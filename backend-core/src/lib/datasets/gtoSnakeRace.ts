import { z } from "zod";

export type Ft = number;

export type SnakeRaceObstacleKind =
  | "single_ramp"
  | "figure_of_eight"
  | "spiders_web"
  | "double_wall"
  | "single_wall"
  | "slide";

export type SnakeRaceObstacle = {
  id: string;
  kind: SnakeRaceObstacleKind;
  sequenceIndex: number; // 0..5
  // Helpful UI only; backend uses events for enforcement.
  assetHint?: string;
};

export type SnakeRaceDataset = {
  datasetId: "gto_snake_race_dataset";
  version: "0.1.0";
  units: "feet";
  obstacles: SnakeRaceObstacle[]; // exactly 6 (MVP)
};

export type SnakeRuleConfig = {
  datasetId: "gto_snake_race_rules";
  version: "0.1.0";

  // Enforcement:
  // - minimum 3 group members must "hold snake" at all times.
  // - snake must never touch ground.
  minGroupMembersHoldingSnake: number; // >=1
  snakeGroundTouchAllowedMs: number; // usually 0

  // Red-painted penalties:
  // - if candidate touches red: penalty
  // - if snake touches red: penalty
  // - if any holding member touches red: penalty (MVP)
  redTouchPenaltyPoints: number; // points deducted
  // Optional: allow a penalty cap per phase; MVP keep undefined.
  redTouchPenaltyCapPoints?: number;
};

export type SnakeRacePenaltyEvent = {
  eventType: "red_touch";
  // who touched red
  toucher: "candidate" | "holding_member" | "snake";
  timestampMs: number;
  colliderColor: "red";
};

export type SnakeRaceTouchEvent = {
  eventType: "touch";
  toucher: "candidate" | "holding_member" | "snake";
  timestampMs: number;

  // We model touch classification by colliderColor:
  colliderColor: "red" | "blue" | "yellow" | "white";

  // whether the touch is considered "ground contact"
  touchesGround: boolean;
};

export type SnakeRaceRunInput = {
  dataset: SnakeRaceDataset;
  rules: SnakeRuleConfig;

  // Candidate group size
  groupSize: number;

  // The run timeline from client:
  // - holdingMembersHoldingSnake: array of member indexes holding the snake at each timestamp bucket.
  // MVP: we accept discrete buckets.
  holdingStateBuckets: Array<{
    timestampMs: number;
    holdingMemberIndexes: number[]; // subset of [0, groupSize)
  }>;

  // Touch events include snake ground-touch detection and red touch penalties.
  touchEvents: SnakeRaceTouchEvent[]; // may be empty
};

export type SnakeRaceRunEvaluation = {
  pass: boolean;

  // 0..10
  score: number;

  violations: Array<{
    type: "insufficient_holding" | "snake_touched_ground" | "red_touch";
    message: string;
    timestampMs?: number;
    details?: Record<string, string | number | boolean>;
  }>;

  // derived totals
  penaltyPoints: number;
};

const snakeObstacleKindSchema: z.ZodType<SnakeRaceObstacleKind> = z.union([
  z.literal("single_ramp"),
  z.literal("figure_of_eight"),
  z.literal("spiders_web"),
  z.literal("double_wall"),
  z.literal("single_wall"),
  z.literal("slide")
]);

export const SnakeRaceObstacleSchema: z.ZodType<SnakeRaceObstacle> = z.object({
  id: z.string().min(1),
  kind: snakeObstacleKindSchema,
  sequenceIndex: z.number().int().min(0).max(5),
  assetHint: z.string().optional()
});

export const SnakeRaceDatasetSchema: z.ZodType<SnakeRaceDataset> = z.object({
  datasetId: z.literal("gto_snake_race_dataset"),
  version: z.literal("0.1.0"),
  units: z.literal("feet"),
  obstacles: z.array(SnakeRaceObstacleSchema).length(6)
});

export const SnakeRuleConfigSchema: z.ZodType<SnakeRuleConfig> = z.object({
  datasetId: z.literal("gto_snake_race_rules"),
  version: z.literal("0.1.0"),
  minGroupMembersHoldingSnake: z.number().int().min(1),
  snakeGroundTouchAllowedMs: z.number().int().min(0),
  redTouchPenaltyPoints: z.number().finite(),
  redTouchPenaltyCapPoints: z.number().finite().optional()
});

export const SnakeRaceTouchEventSchema: z.ZodType<SnakeRaceTouchEvent> = z.object({
  eventType: z.literal("touch"),
  toucher: z.union([z.literal("candidate"), z.literal("holding_member"), z.literal("snake")]),
  timestampMs: z.number().finite().nonnegative(),
  colliderColor: z.union([z.literal("red"), z.literal("blue"), z.literal("yellow"), z.literal("white")]),
  touchesGround: z.boolean()
});

export const SnakeRaceRunInputSchema: z.ZodType<SnakeRaceRunInput> = z.object({
  dataset: SnakeRaceDatasetSchema,
  rules: SnakeRuleConfigSchema,
  groupSize: z.number().int().min(1),
  holdingStateBuckets: z
    .array(
      z.object({
        timestampMs: z.number().finite().nonnegative(),
        holdingMemberIndexes: z.array(z.number().int().min(0))
      })
    )
    .min(1),
  touchEvents: z.array(SnakeRaceTouchEventSchema)
});

export const SnakeRaceRunEvaluationSchema: z.ZodType<SnakeRaceRunEvaluation> = z.object({
  pass: z.boolean(),
  score: z.number().int().min(1).max(10),
  violations: z.array(
    z.object({
      type: z.union([z.literal("insufficient_holding"), z.literal("snake_touched_ground"), z.literal("red_touch")]),
      message: z.string().min(1),
      timestampMs: z.number().finite().nonnegative().optional(),
      details: z.record(z.union([z.string(), z.number(), z.boolean()])).optional()
    })
  ),
  penaltyPoints: z.number().finite()
});

export function buildSnakeRaceDatasetStub(): SnakeRaceDataset {
  const obstacles: SnakeRaceObstacle[] = [
    { id: "snake-ob-01", kind: "single_ramp", sequenceIndex: 0, assetHint: "unity/ramps/single" },
    { id: "snake-ob-02", kind: "figure_of_eight", sequenceIndex: 1, assetHint: "unity/figure8" },
    { id: "snake-ob-03", kind: "spiders_web", sequenceIndex: 2, assetHint: "unity/spiderweb" },
    { id: "snake-ob-04", kind: "double_wall", sequenceIndex: 3, assetHint: "unity/walls/double" },
    { id: "snake-ob-05", kind: "single_wall", sequenceIndex: 4, assetHint: "unity/walls/single" },
    { id: "snake-ob-06", kind: "slide", sequenceIndex: 5, assetHint: "unity/slides" }
  ];

  const out: SnakeRaceDataset = {
    datasetId: "gto_snake_race_dataset",
    version: "0.1.0",
    units: "feet",
    obstacles
  };

  const check = SnakeRaceDatasetSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`buildSnakeRaceDatasetStub failed schema validation: ${JSON.stringify(check.error.flatten())}`);
  }
  return out;
}

export function buildSnakeRaceRulesStub(): SnakeRuleConfig {
  const out: SnakeRuleConfig = {
    datasetId: "gto_snake_race_rules",
    version: "0.1.0",
    minGroupMembersHoldingSnake: 3,
    snakeGroundTouchAllowedMs: 0,
    redTouchPenaltyPoints: 1,
    redTouchPenaltyCapPoints: 6
  };

  const check = SnakeRuleConfigSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`buildSnakeRaceRulesStub failed schema validation: ${JSON.stringify(check.error.flatten())}`);
  }
  return out;
}

function clamp1to10Int(n: number): number {
  return Math.max(1, Math.min(10, Math.round(n)));
}

/**
 * MVP enforcement/evaluation:
 * - insufficient_holding: if at any bucket the holding count < minGroupMembersHoldingSnake
 * - snake_touched_ground: if any touch event where toucher === "snake" AND touchesGround === true for > allowedMs (MVP: any is violation)
 * - red_touch: penaltyPoints per red_touch event (candidate/holding_member/snake) derived from touchEvents.
 *
 * Score:
 * - start at 10
 * - subtract per-violation redTouchPenaltyPoints
 * - if hard violations occur (insufficient holding / snake touched ground) => pass=false and score <= 1..3
 */
export function evaluateSnakeRaceRun(params: SnakeRaceRunInput): SnakeRaceRunEvaluation {
  const input = params;

  const violations: SnakeRaceRunEvaluation["violations"] = [];
  let penaltyPoints = 0;

  const redTouchEvents = input.touchEvents.filter((e) => e.colliderColor === "red");
  for (const evt of redTouchEvents) {
    if (evt.toucher === "candidate" || evt.toucher === "holding_member" || evt.toucher === "snake") {
      penaltyPoints += input.rules.redTouchPenaltyPoints;
      violations.push({
        type: "red_touch",
        message: `${evt.toucher} touched red collider`,
        timestampMs: evt.timestampMs,
        details: { toucher: evt.toucher, colliderColor: evt.colliderColor }
      });
    }
  }

  if (typeof input.rules.redTouchPenaltyCapPoints === "number" && penaltyPoints > input.rules.redTouchPenaltyCapPoints) {
    penaltyPoints = input.rules.redTouchPenaltyCapPoints;
  }

  // Holding enforcement
  for (const bucket of input.holdingStateBuckets) {
    const holdingCount = bucket.holdingMemberIndexes.length;
    if (holdingCount < input.rules.minGroupMembersHoldingSnake) {
      violations.push({
        type: "insufficient_holding",
        message: `Holding snake requires at least ${input.rules.minGroupMembersHoldingSnake} members, but had ${holdingCount}.`,
        timestampMs: bucket.timestampMs,
        details: { holdingCount, required: input.rules.minGroupMembersHoldingSnake }
      });
      // hard violation => no need to continue, but keep scanning for evidence.
    }
  }

  // Snake never touch ground
  const snakeGroundTouches = input.touchEvents.filter((e) => e.toucher === "snake" && e.touchesGround);
  const snakeGroundViolation = snakeGroundTouches.length > 0; // MVP: any touch is violation

  if (snakeGroundViolation) {
    const first = snakeGroundTouches[0];
    violations.push({
      type: "snake_touched_ground",
      message: `Snake touched ground (not allowed).`,
      timestampMs: first.timestampMs
    });
  }

  const hasHardViolation =
    violations.some((v) => v.type === "insufficient_holding") || violations.some((v) => v.type === "snake_touched_ground");

  let score = 10 - penaltyPoints;

  if (hasHardViolation) {
    score = Math.min(score, 2);
  }

  const finalScore = clamp1to10Int(score);

  return {
    pass: !hasHardViolation && violations.filter((v) => v.type === "red_touch").length === 0,
    score: finalScore,
    violations,
    penaltyPoints
  };
}
