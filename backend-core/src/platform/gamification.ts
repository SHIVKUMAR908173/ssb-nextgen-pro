import { z } from "zod";

export type XPEventType = "task_complete" | "daily_login" | "streak_bonus";

export type XPEvent = {
  userId: string;
  type: XPEventType;
  taskKey?: string;
  xpDelta: number;
  occurredAtIso: string;
};

export type GamificationUser = {
  userId: string;

  xp: number;

  dailyLogin: {
    // Keyed by YYYY-MM-DD in server local date.
    lastLoginDate?: string;
    loginStreak: number;
  };

  taskCompletions: Record<
    string,
    {
      completions: number;
      lastCompletedAtIso?: string;
    }
  >;

  events: XPEvent[];
};

const ISODateSchema = z.string().datetime();

function toLocalDateKey(d: Date) {
  // Using UTC+5:30 locally is “close enough” for an MVP without a full timezone layer.
  const offsetMs = 5.5 * 60 * 60 * 1000;
  const local = new Date(d.getTime() + offsetMs);
  return local.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function createGamificationService(deps?: { now?: () => Date }) {
  const now = deps?.now ?? (() => new Date());

  // MVP: in-memory only.
  const users = new Map<string, GamificationUser>();

  function getOrCreateUser(userId: string): GamificationUser {
    const existing = users.get(userId);
    if (existing) return existing;

    const created: GamificationUser = {
      userId,
      xp: 0,
      dailyLogin: {
        lastLoginDate: undefined,
        loginStreak: 0
      },
      taskCompletions: {},
      events: []
    };

    users.set(userId, created);
    return created;
  }

  function recordXp(params: {
    userId: string;
    type: XPEventType;
    taskKey?: string;
    xpDelta: number;
  }): GamificationUser {
    const { userId, type, taskKey, xpDelta } = params;
    if (!Number.isFinite(xpDelta) || xpDelta <= 0) {
      throw new Error("xpDelta must be a positive finite number");
    }

    const user = getOrCreateUser(userId);

    const occurredAtIso = now().toISOString();
    ISODateSchema.parse(occurredAtIso);

    user.xp += xpDelta;
    user.events.push({
      userId,
      type,
      taskKey,
      xpDelta,
      occurredAtIso
    });

    return user;
  }

  function applyDailyLogin(params: { userId: string }): GamificationUser {
    const user = getOrCreateUser(params.userId);

    const todayKey = toLocalDateKey(now());
    const lastKey = user.dailyLogin.lastLoginDate;

    if (lastKey === todayKey) {
      // Already counted today.
      return user;
    }

    // If last login was yesterday -> streak+1, else reset to 1.
    if (lastKey) {
      const lastDate = new Date(lastKey + "T00:00:00.000Z");
      const todayDate = new Date(todayKey + "T00:00:00.000Z");
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));

      if (diffDays === 1) {
        user.dailyLogin.loginStreak += 1;
      } else {
        user.dailyLogin.loginStreak = 1;
      }
    } else {
      user.dailyLogin.loginStreak = 1;
    }

    user.dailyLogin.lastLoginDate = todayKey;

    // MVP XP rules (tunable later).
    const dailyLoginXp = 10;
    const streakBonusXp = Math.min(50, user.dailyLogin.loginStreak * 2);

    // Record both events to keep event log consistent.
    recordXp({ userId: user.userId, type: "daily_login", xpDelta: dailyLoginXp });
    if (user.dailyLogin.loginStreak > 1) {
      recordXp({ userId: user.userId, type: "streak_bonus", xpDelta: streakBonusXp });
    }

    return user;
  }

  function applyTaskCompletion(params: { userId: string; taskKey: string; xpDelta?: number }): GamificationUser {
    const { userId, taskKey } = params;
    if (!taskKey) throw new Error("taskKey is required");

    const user = getOrCreateUser(userId);

    const completion = user.taskCompletions[taskKey] ?? { completions: 0, lastCompletedAtIso: undefined };
    completion.completions += 1;
    completion.lastCompletedAtIso = now().toISOString();
    user.taskCompletions[taskKey] = completion;

    recordXp({ userId: userId, type: "task_complete", taskKey, xpDelta: params.xpDelta ?? 30 });

    return user;
  }

  function getUser(params: { userId: string }): GamificationUser {
    return getOrCreateUser(params.userId);
  }

  function listUsers(): GamificationUser[] {
    return Array.from(users.values());
  }

  return {
    applyDailyLogin,
    applyTaskCompletion,
    getUser,
    listUsers
  };
}
