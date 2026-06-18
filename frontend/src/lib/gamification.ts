export type XPEventType = "task_complete" | "daily_login" | "streak_bonus";

export type XPEvent = {
  userId: string;
  type: XPEventType;
  taskKey?: string;
  xpDelta: number;
  occurredAtIso: string;
};

export type GamificationProfile = {
  userId: string;
  xp: number;
  dailyLogin: {
    lastLoginDate?: string;
    loginStreak: number;
  };
  taskCompletions: Record<string, { completions: number; lastCompletedAtIso?: string }>;
  events: XPEvent[];
};

export const RANKS = [
  { level: 1, title: "Cadet", minXp: 0, icon: "🎖️" },
  { level: 2, title: "Lieutenant", minXp: 100, icon: "⭐" },
  { level: 3, title: "Captain", minXp: 300, icon: "⭐⭐⭐" },
  { level: 4, title: "Major", minXp: 600, icon: "🦅" },
  { level: 5, title: "Lt. Colonel", minXp: 1000, icon: "🦁" },
  { level: 6, title: "Colonel", minXp: 1500, icon: "🗡️" },
  { level: 7, title: "Brigadier", minXp: 2000, icon: "⚔️" },
  { level: 8, title: "Major General", minXp: 3000, icon: "🛡️" },
  { level: 9, title: "Lt. General", minXp: 5000, icon: "👑" },
  { level: 10, title: "General", minXp: 10000, icon: "🔥" },
];

export function getRankInfo(xp: number) {
  let currentRank = RANKS[0];
  let nextRank = RANKS[1];

  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].minXp) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || null;
    } else {
      break;
    }
  }

  const progressToNext = nextRank ? ((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100 : 100;
  
  return {
    currentRank,
    nextRank,
    progressToNext: Math.max(0, Math.min(100, progressToNext)),
    xpToNext: nextRank ? nextRank.minXp - xp : 0
  };
}

const API_BASE = "http://localhost:3001/api/gamification";

export async function fetchProfile(userId: string): Promise<GamificationProfile> {
  const res = await fetch(`${API_BASE}/profile?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function logEvent(userId: string, type: XPEventType, taskKey?: string, xpDelta?: number): Promise<GamificationProfile> {
  const res = await fetch(`${API_BASE}/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, type, taskKey, xpDelta })
  });
  if (!res.ok) throw new Error("Failed to log event");
  return res.json();
}
