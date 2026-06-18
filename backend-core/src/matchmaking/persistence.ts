import IORedis from "ioredis";
import type { MatchGroup, PracticeMatchRequest } from "./redisMatchmaking.js";

export type MatchmakingRedisKeys = {
  queueKey: string;
  groupsKey: string; // hash groupId -> serialized group
  candidateToGroupKey: string; // hash candidateId -> groupId
  tokensKey: string; // hash token -> {groupId,candidateId,roomId,expiresAtMs,used}
};

export type MatchmakingPersistenceConfig = {
  redisUrl: string;
  keys: MatchmakingRedisKeys;
  tokenTtlMs: number;
};

export function createMatchmakingPersistence(cfg: MatchmakingPersistenceConfig) {
  const redis = new (IORedis as any)(cfg.redisUrl, { lazyConnect: true });

  // Prevent “Unhandled error event” from crashing request handling when Redis is down.
  redis.on("error", (e: unknown) => {
    // eslint-disable-next-line no-console
    console.error("[matchmaking:persistence] redis error", e);
  });

  async function ensureConnected() {
    if ((redis as any).status !== "ready") await redis.connect();
  }

  function serializeGroup(group: MatchGroup): string {
    return JSON.stringify(group);
  }

  async function persistGroup(group: MatchGroup) {
    await ensureConnected();
    await redis.hset(cfg.keys.groupsKey, group.groupId, serializeGroup(group));

    const pipeline = redis.pipeline();
    for (const cid of group.candidateIds) {
      pipeline.hset(cfg.keys.candidateToGroupKey, cid, group.groupId);
    }
    await pipeline.exec();
  }

  async function getGroup(groupId: string): Promise<MatchGroup | null> {
    await ensureConnected();
    const raw = await redis.hget(cfg.keys.groupsKey, groupId);
    if (!raw) return null;
    return JSON.parse(raw) as MatchGroup;
  }

  async function getGroupIdForCandidate(candidateId: string): Promise<string | null> {
    await ensureConnected();
    const groupId = await redis.hget(cfg.keys.candidateToGroupKey, candidateId);
    return groupId ?? null;
  }

  async function createOneTimeToken(params: {
    candidateId: string;
    groupId: string;
    roomId: string;
  }): Promise<{ token: string; expiresAtMs: number; roomId: string }> {
    await ensureConnected();
    const nowMs = Date.now();
    const expiresAtMs = nowMs + cfg.tokenTtlMs;
    const token = `gdgpe-${nowMs}-${Math.random().toString(16).slice(2)}`;

    await redis.hset(
      cfg.keys.tokensKey,
      token,
      JSON.stringify({
        candidateId: params.candidateId,
        groupId: params.groupId,
        roomId: params.roomId,
        expiresAtMs,
        used: false
      })
    );

    return { token, expiresAtMs, roomId: params.roomId };
  }

  return {
    persistGroup,
    getGroup,
    getGroupIdForCandidate,
    createOneTimeToken
  };
}
