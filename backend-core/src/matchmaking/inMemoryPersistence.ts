import type { MatchGroup } from "./redisMatchmaking.js";

export type OneTimeToken = {
  token: string;
  expiresAtMs: number;
  roomId: string;
};

type StoredGroup = MatchGroup;

type StoredToken = {
  candidateId: string;
  groupId: string;
  roomId: string;
  expiresAtMs: number;
  used: boolean;
};

export function createInMemoryMatchmakingPersistence(cfg: {
  tokenTtlMs: number;
}) {
  const groups = new Map<string, StoredGroup>();
  const candidateToGroupId = new Map<string, string>();
  const tokens = new Map<string, StoredToken>();

  async function persistGroup(group: StoredGroup) {
    groups.set(group.groupId, group);
    for (const cid of group.candidateIds) candidateToGroupId.set(cid, group.groupId);
  }

  async function getGroup(groupId: string): Promise<StoredGroup | null> {
    return groups.get(groupId) ?? null;
  }

  async function getGroupIdForCandidate(candidateId: string): Promise<string | null> {
    return candidateToGroupId.get(candidateId) ?? null;
  }

  async function createOneTimeToken(params: {
    candidateId: string;
    groupId: string;
    roomId: string;
  }): Promise<OneTimeToken> {
    const nowMs = Date.now();
    const expiresAtMs = nowMs + cfg.tokenTtlMs;
    const token = `gdgpe-mem-${nowMs}-${Math.random().toString(16).slice(2)}`;

    tokens.set(token, {
      candidateId: params.candidateId,
      groupId: params.groupId,
      roomId: params.roomId,
      expiresAtMs,
      used: false
    });

    return { token, expiresAtMs, roomId: params.roomId };
  }

  return {
    persistGroup,
    getGroup,
    getGroupIdForCandidate,
    createOneTimeToken
  };
}
