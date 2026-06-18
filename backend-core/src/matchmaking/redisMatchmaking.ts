import IORedis from "ioredis";

const RedisCtor: new (url: string, opts?: { lazyConnect?: boolean }) => any = (IORedis as any).default ?? (IORedis as any);

export type PracticeMatchRequest = {
  candidateId: string;
  sessionId: string;
  region?: string;
  skillLevel?: number;
  /**
   * Measured/declared RTT bucket (ms), used for metadata matching.
   */
  latencyMs?: number;
  createdAtMs: number;
};

export type MatchGroup = {
  groupId: string;
  candidateIds: string[];
  sessionIds: string[];
  /**
   * Timestamp for consumers to enforce timeouts.
   */
  expiresAtMs: number;
};

export type MatchmakingConfig = {
  redisUrl: string;
  /**
   * Pub/Sub channel used to notify match-evaluator that new candidates arrived.
   */
  notifyChannel: string;
  /**
   * Redis list (queue) key for candidates waiting to be matched.
   */
  queueKey: string;

  groupMinSize: number; // 8
  groupMaxSize: number; // 10
  matchTtlMs: number;

  /**
   * How long a candidate can stay in queue before being eligible for drop/requeue.
   */
  queueCandidateMaxAgeMs: number;
};

export function createRedisMatchmaking(config: MatchmakingConfig) {
  const redis = new (IORedis as any)(config.redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 0,
    reconnectOnError: false,
    enableOfflineQueue: false
  });
  const redisPub = new (IORedis as any)(config.redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 0,
    reconnectOnError: false,
    enableOfflineQueue: false
  });

  // Prevent “Unhandled error event” from crashing request handling when Redis is down.
  redis.on("error", (e: unknown) => {
    // eslint-disable-next-line no-console
    console.error("[matchmaking] redis error", e);
  });
  redisPub.on("error", (e: unknown) => {
    // eslint-disable-next-line no-console
    console.error("[matchmaking] redisPub error", e);
  });

  let redisAvailable = true;

  async function ensureConnected() {
    if (!redisAvailable) throw new Error("redis_unavailable");

    try {
      if ((redis as any).status !== "ready") await redis.connect();
      if ((redisPub as any).status !== "ready") await redisPub.connect();
    } catch (e) {
      redisAvailable = false;
      throw new Error("redis_unavailable");
    }
  }

  type SerializedCandidate = PracticeMatchRequest & { ttlAtMs: number };

  function serializeCandidate(c: PracticeMatchRequest, nowMs: number): SerializedCandidate {
    return { ...c, ttlAtMs: nowMs + config.queueCandidateMaxAgeMs };
  }

  async function enqueueCandidate(req: PracticeMatchRequest): Promise<void> {
    await ensureConnected();
    const nowMs = Date.now();
    const payload: SerializedCandidate = serializeCandidate(req, nowMs);
    await redis.rpush(config.queueKey, JSON.stringify(payload));
    await redisPub.publish(config.notifyChannel, JSON.stringify({ enqueuedAtMs: nowMs }));
  }

  /**
   * Evaluate queue and attempt to form 8-10 person groups.
   *
   * Strategy (MVP):
   * - Pop candidates from the Redis list up to groupMaxSize (10).
   * - Filter out expired candidates (ttlAtMs > now).
   * - If we have >= groupMinSize, form a group and return it.
   * - Otherwise, push the remaining back (with the same serialized payload) and stop.
   *
   * NOTE: This evaluator is intended to run periodically (or on pub/sub triggers).
   */
  async function tryBuildOneGroup(nowMs: number): Promise<MatchGroup | null> {
    await ensureConnected();

    const maxPick = config.groupMaxSize;

    // LPOP removes candidates from the queue; if we can’t form a group, we requeue.
    const popped: string[] = [];
    for (let i = 0; i < maxPick; i++) {
      const item = await redis.lpop(config.queueKey);
      if (!item) break;
      popped.push(item);
    }

    if (popped.length === 0) return null;

    const candidates: SerializedCandidate[] = [];
    const requeue: string[] = [];

    for (const raw of popped) {
      try {
        const parsed = JSON.parse(raw) as SerializedCandidate;
        if (parsed.ttlAtMs <= nowMs) continue; // drop expired
        candidates.push(parsed);
      } catch {
        // if malformed, drop
      }
    }

    if (candidates.length >= config.groupMinSize) {
      const selected = candidates.slice(0, config.groupMaxSize);

      if (candidates.length > selected.length) {
        const leftovers = candidates.slice(selected.length);
        for (const left of leftovers) requeue.push(JSON.stringify(left));
      }

      if (requeue.length) {
        // Requeue at head by LPUSH in reverse order to preserve relative order.
        for (let i = requeue.length - 1; i >= 0; i--) {
          await redis.lpush(config.queueKey, requeue[i]);
        }
      }

      const groupId = `gd-gpe-${nowMs}-${Math.random().toString(16).slice(2)}`;
      return {
        groupId,
        candidateIds: selected.map((c) => c.candidateId),
        sessionIds: selected.map((c) => c.sessionId),
        expiresAtMs: nowMs + config.matchTtlMs
      };
    }

    // Not enough candidates: requeue them all.
    for (const c of candidates) requeue.push(JSON.stringify(c));
    for (let i = requeue.length - 1; i >= 0; i--) {
      await redis.lpush(config.queueKey, requeue[i]);
    }

    return null;
  }

  async function startPubSubEvaluator(opts?: { intervalMs?: number }) {
    await ensureConnected();

    const intervalMs = opts?.intervalMs ?? 750;
    const channel = config.notifyChannel;

    const sub = new (IORedis as any)(config.redisUrl, { lazyConnect: true });
    await sub.connect();

    let building = false;

    sub.subscribe(channel);

    sub.on("message", async () => {
      if (building) return;
      building = true;
      try {
        const nowMs = Date.now();
        for (let k = 0; k < 2; k++) {
          const group = await tryBuildOneGroup(nowMs);
          if (!group) break;
          // eslint-disable-next-line no-console
          console.log(`[matchmaking] built group groupId=${group.groupId} size=${group.candidateIds.length}`);
          // TODO: Persist group to Redis + notify participants (wired by API)
        }
      } finally {
        building = false;
      }
    });

    const timer = setInterval(async () => {
      if (building) return;
      building = true;
      try {
        const nowMs = Date.now();
        const group = await tryBuildOneGroup(nowMs);
        if (group) {
          // eslint-disable-next-line no-console
          console.log(`[matchmaking] periodic built group groupId=${group.groupId} size=${group.candidateIds.length}`);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[matchmaking] periodic evaluator error", e);
      } finally {
        building = false;
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
      sub.disconnect();
    };
  }

  return {
    enqueueCandidate,
    tryBuildOneGroup,
    startPubSubEvaluator
  };
}
