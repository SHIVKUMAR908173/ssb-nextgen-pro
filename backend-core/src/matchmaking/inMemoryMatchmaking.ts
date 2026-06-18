import type { MatchGroup, MatchmakingConfig, PracticeMatchRequest } from "./redisMatchmaking.js";

export type InMemoryMatchmakingConfig = Omit<MatchmakingConfig, "redisUrl"> & {
  // Not used; parity with Redis config shape.
  redisUrl?: string;
};

type SerializedCandidate = PracticeMatchRequest & { ttlAtMs: number };

export function createInMemoryMatchmaking(config: InMemoryMatchmakingConfig) {
  const queue: SerializedCandidate[] = [];
  let nextGroupSeq = 1;

  function serializeCandidate(req: PracticeMatchRequest, nowMs: number): SerializedCandidate {
    return { ...req, ttlAtMs: nowMs + config.queueCandidateMaxAgeMs };
  }

  async function enqueueCandidate(req: PracticeMatchRequest): Promise<void> {
    const nowMs = Date.now();
    queue.push(serializeCandidate(req, nowMs));
  }

  async function tryBuildOneGroup(nowMs: number): Promise<MatchGroup | null> {
    // Drop expired from head.
    while (queue.length && queue[0].ttlAtMs <= nowMs) queue.shift();

    if (queue.length < config.groupMinSize) return null;

    // Take up to groupMaxSize from current queue order.
    const selected = queue.splice(0, config.groupMaxSize);

    // Remove expired that might have slipped in.
    const fresh = selected.filter((c) => c.ttlAtMs > nowMs);
    if (fresh.length < config.groupMinSize) {
      // Not enough: put fresh back preserving order.
      queue.unshift(...fresh);
      return null;
    }

    const groupId = `gd-gpe-mem-${Date.now()}-${nextGroupSeq++}`;
    return {
      groupId,
      candidateIds: fresh.slice(0, config.groupMaxSize).map((c) => c.candidateId),
      sessionIds: fresh.slice(0, config.groupMaxSize).map((c) => c.sessionId),
      expiresAtMs: nowMs + config.matchTtlMs
    };
  }

  async function startPubSubEvaluator(): Promise<null> {
    // No pub/sub in-memory; group building is triggered by API tests/loops externally.
    return null;
  }

  return {
    enqueueCandidate,
    tryBuildOneGroup,
    startPubSubEvaluator
  };
}
