import { z } from "zod";

export type GTOIOHurdleKind =
  | "burma_bridge"
  | "tarzan_swing"
  | "tiger_leap"
  | "zig_zag_balance"
  | "rope_climb"
  | "log_jumping"
  | "trench_cross"
  | "wall_scaling"
  | "tire_carry"
  | "obstacle_runs";

export type GTOIOHurdle = {
  id: string;
  kind: GTOIOHurdleKind;
  sequenceIndex: number; // 0..9
  // Points awarded for correctly completing this hurdle once.
  points: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
};

export type GTOIODataset = {
  datasetId: "gto_io_dataset";
  version: "0.1.0";
  hurdles: GTOIOHurdle[]; // exactly 10
};

export type GTOIORules = {
  datasetId: "gto_io_rules";
  version: "0.1.0";

  totalTimeSeconds: number; // strict 180s for MVP
  // If candidate repeats obstacles:
  // only allow bonus points if ALL 10 hurdles were successfully completed within the timer.
  repeatsBonusPointsPerExtraCompletion: number;
  // Cap repeats contribution to avoid runaway scores.
  repeatsBonusCapPoints: number;
};

export type GTOIOCompletionEvent = {
  hurdleId: string;
  completed: boolean;
  timestampMs: number;
  // whether this completion counts as a "repeat completion" attempt
  isRepeat: boolean;
};

export type GTOIORunInput = {
  dataset: GTOIODataset;
  rules: GTOIORules;
  startedAtMs: number; // epoch ms
  completedAtMs?: number; // epoch ms (optional; if absent, strict evaluation fails)
  completionEvents: GTOIOCompletionEvent[];
};

export type GTOIOEvaluation = {
  pass: boolean;
  score: number; // 0..10-ish scaled to rubric 1..10? We'll keep 1..10 clamp.
  details: {
    all10Completed: boolean;
    completedWithinTime: boolean;
    basePoints: number;
    repeatsBonusPoints: number;
    violations: Array<{ type: "time_expired" | "not_all_10_completed" | "missing_completion"; message: string }>;
  };
};

const IOHurdleKindSchema: z.ZodType<GTOIOHurdleKind> = z.union([
  z.literal("burma_bridge"),
  z.literal("tarzan_swing"),
  z.literal("tiger_leap"),
  z.literal("zig_zag_balance"),
  z.literal("rope_climb"),
  z.literal("log_jumping"),
  z.literal("trench_cross"),
  z.literal("wall_scaling"),
  z.literal("tire_carry"),
  z.literal("obstacle_runs")
]);

const IOHurdlePointsSchema: z.ZodType<GTOIOHurdle["points"]> = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10)
]);

export const GTOIOHurdleSchema: z.ZodType<GTOIOHurdle> = z.object({
  id: z.string().min(1),
  kind: IOHurdleKindSchema,
  sequenceIndex: z.number().int().min(0).max(9),
  points: IOHurdlePointsSchema
});

export const GTOIODatasetSchema: z.ZodType<GTOIODataset> = z.object({
  datasetId: z.literal("gto_io_dataset"),
  version: z.literal("0.1.0"),
  hurdles: z.array(GTOIOHurdleSchema).length(10)
});

export const GTOIORulesSchema: z.ZodType<GTOIORules> = z.object({
  datasetId: z.literal("gto_io_rules"),
  version: z.literal("0.1.0"),
  totalTimeSeconds: z.number().int().positive(),
  repeatsBonusPointsPerExtraCompletion: z.number().int().min(0),
  repeatsBonusCapPoints: z.number().int().min(0)
});

export const GTOIOCompletionEventSchema: z.ZodType<GTOIOCompletionEvent> = z.object({
  hurdleId: z.string().min(1),
  completed: z.boolean(),
  timestampMs: z.number().finite().nonnegative(),
  isRepeat: z.boolean()
});

export const GTOIORunInputSchema: z.ZodType<GTOIORunInput> = z.object({
  dataset: GTOIODatasetSchema,
  rules: GTOIORulesSchema,
  startedAtMs: z.number().finite(),
  completedAtMs: z.number().finite().optional(),
  completionEvents: z.array(GTOIOCompletionEventSchema)
});

export const GTOIOEvaluationSchema: z.ZodType<GTOIOEvaluation> = z.object({
  pass: z.boolean(),
  score: z.number().int().min(1).max(10),
  details: z.object({
    all10Completed: z.boolean(),
    completedWithinTime: z.boolean(),
    basePoints: z.number().int().min(0),
    repeatsBonusPoints: z.number().int().min(0),
    violations: z.array(
      z.object({
        type: z.union([z.literal("time_expired"), z.literal("not_all_10_completed"), z.literal("missing_completion")]),
        message: z.string().min(1)
      })
    )
  })
});

function clamp1to10Int(n: number): number {
  return Math.max(1, Math.min(10, Math.round(n)));
}

function computeRunDurationSeconds(input: GTOIORunInput): number | undefined {
  if (typeof input.completedAtMs !== "number" || !Number.isFinite(input.completedAtMs)) return undefined;
  return (input.completedAtMs - input.startedAtMs) / 1000;
}

export function buildGTOIODatasetStub(): GTOIODataset {
  const hurdles: GTOIOHurdle[] = [
    { id: "io-01", kind: "burma_bridge", sequenceIndex: 0, points: 1 },
    { id: "io-02", kind: "tarzan_swing", sequenceIndex: 1, points: 2 },
    { id: "io-03", kind: "tiger_leap", sequenceIndex: 2, points: 3 },
    { id: "io-04", kind: "zig_zag_balance", sequenceIndex: 3, points: 4 },
    { id: "io-05", kind: "rope_climb", sequenceIndex: 4, points: 5 },
    { id: "io-06", kind: "log_jumping", sequenceIndex: 5, points: 6 },
    { id: "io-07", kind: "trench_cross", sequenceIndex: 6, points: 7 },
    { id: "io-08", kind: "wall_scaling", sequenceIndex: 7, points: 8 },
    { id: "io-09", kind: "tire_carry", sequenceIndex: 8, points: 9 },
    { id: "io-10", kind: "obstacle_runs", sequenceIndex: 9, points: 10 }
  ];

  const out: GTOIODataset = {
    datasetId: "gto_io_dataset",
    version: "0.1.0",
    hurdles
  };

  const check = GTOIODatasetSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`buildGTOIODatasetStub failed schema validation: ${JSON.stringify(check.error.flatten())}`);
  }

  return out;
}

export function buildGTOIORulesStub(): GTOIORules {
  const out: GTOIORules = {
    datasetId: "gto_io_rules",
    version: "0.1.0",
    totalTimeSeconds: 180,
    repeatsBonusPointsPerExtraCompletion: 1,
    repeatsBonusCapPoints: 5
  };

  const check = GTOIORulesSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`buildGTOIORulesStub failed schema validation: ${JSON.stringify(check.error.flatten())}`);
  }

  return out;
}

/**
 * MVP scoring:
 * - basePoints: sum of points for each hurdle completed at least once (completed=true event).
 * - repeatsBonusPoints: only if all 10 completed within timer AND this event has isRepeat=true and completed=true.
 * - score normalized to 1..10 by mapping basePoints+bonus to ratio of maximum possible points (55 for 1..10).
 */
export function evaluateGTOIORun(params: GTOIORunInput): GTOIOEvaluation {
  const input = params;

  const durationSeconds = computeRunDurationSeconds(input);
  const violations: GTOIOEvaluation["details"]["violations"] = [];

  const completedWithinTime = typeof durationSeconds === "number" ? durationSeconds <= input.rules.totalTimeSeconds : false;
  if (typeof durationSeconds !== "number") {
    violations.push({ type: "missing_completion", message: "completedAtMs missing; cannot verify time window." });
  } else if (!completedWithinTime) {
    violations.push({ type: "time_expired", message: `Time expired. durationSeconds=${durationSeconds.toFixed(1)}` });
  }

  const hurdlePointsById = new Map(input.dataset.hurdles.map((h) => [h.id, h.points] as const));
  const maxBasePoints = input.dataset.hurdles.reduce((acc, h) => acc + h.points, 0); // 55 with our stub
  const baseCompletedHurdleIds = new Set(
    input.completionEvents
      .filter((e) => e.completed)
      .map((e) => e.hurdleId)
  );

  const all10Completed = input.dataset.hurdles.every((h) => baseCompletedHurdleIds.has(h.id));
  if (!all10Completed) {
    violations.push({ type: "not_all_10_completed", message: "Not all 10 hurdles were completed." });
  }

  let basePoints = 0;
  for (const h of input.dataset.hurdles) {
    if (baseCompletedHurdleIds.has(h.id)) basePoints += h.points;
  }

  let repeatsBonusPoints = 0;
  const repeatsAllowed = all10Completed && completedWithinTime;
  if (repeatsAllowed) {
    const repeatCompletedEvents = input.completionEvents.filter((e) => e.completed && e.isRepeat && hurdlePointsById.has(e.hurdleId));
    for (const _evt of repeatCompletedEvents) {
      repeatsBonusPoints += input.rules.repeatsBonusPointsPerExtraCompletion;
    }
    repeatsBonusPoints = Math.min(repeatsBonusPoints, input.rules.repeatsBonusCapPoints);
  }

  const totalPoints = basePoints + repeatsBonusPoints;

  // Normalize:
  // - max total possible points (maxBasePoints + cap)
  const maxTotalPoints = maxBasePoints + input.rules.repeatsBonusCapPoints;
  const ratio = maxTotalPoints <= 0 ? 0 : totalPoints / maxTotalPoints;
  const score = clamp1to10Int(1 + ratio * 9);

  const pass = all10Completed && completedWithinTime;

  const out: GTOIOEvaluation = {
    pass,
    score,
    details: {
      all10Completed,
      completedWithinTime,
      basePoints,
      repeatsBonusPoints,
      violations
    }
  };

  const check = GTOIOEvaluationSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`evaluateGTOIORun produced invalid result: ${JSON.stringify(check.error.flatten())}`);
  }

  return out;
}
