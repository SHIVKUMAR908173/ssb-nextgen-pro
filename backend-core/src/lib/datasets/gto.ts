import { z } from "zod";

export type Ft = number;

export type ObstacleKind =
  | "burma_bridge"
  | "long_jump_drum"
  | "high_jump_bar"
  | "rope_bridge"
  | "general";

export type ColliderColorRule = "red" | "blue" | "yellow" | "white";

export type DistanceRuleId = "distance_4ft_bridge_required";

export type ObstacleDimension = {
  kind: ObstacleKind;
  lengthFt?: Ft;
  widthFt?: Ft;
  heightFt?: Ft;
  notes?: string;
};

export type ObstacleDimensionSet = {
  datasetId: "gto_obstacle_dimensions";
  version: "0.1.0";
  units: "feet";
  obstacles: ObstacleDimension[];
};

export type ColorRuleMapping = {
  colliderColor: ColliderColorRule;
  // Whether the "candidate man" is allowed to touch this collider.
  menSafe: boolean;
  // Whether the "helping material" is allowed to touch this collider.
  materialSafe: boolean;
  // Helpful for UI/traceability.
  description: string;
};

export type ColorRuleSet = {
  datasetId: "gto_color_rule";
  version: "0.1.0";
  mappings: ColorRuleMapping[];
};

export type DistanceRuleParams = {
  id: DistanceRuleId;
  // Any gap >= this value must be bridged (not jumped).
  minGapFtToRequireBridge: Ft;
  // Buffer to reduce floating point edge cases.
  epsilonFt: Ft;
};

export type DistanceRuleSet = {
  datasetId: "gto_distance_rules";
  version: "0.1.0";
  rules: DistanceRuleParams[];
};

export type GTOEnvironmentRulesDataset = {
  obstacleDimensions: ObstacleDimensionSet;
  colorRules: ColorRuleSet;
  distanceRules: DistanceRuleSet;
};

const positiveFeet = z
  .number()
  .refine((n) => Number.isFinite(n) && n > 0, { message: "feet must be > 0" });

const nonNegativeFeet = z
  .number()
  .refine((n) => Number.isFinite(n) && n >= 0, { message: "feet must be >= 0" });

const obstacleKindSchema: z.ZodType<ObstacleKind> = z.union([
  z.literal("burma_bridge"),
  z.literal("long_jump_drum"),
  z.literal("high_jump_bar"),
  z.literal("rope_bridge"),
  z.literal("general")
]);

export const ObstacleDimensionSchema = z.object({
  kind: obstacleKindSchema,
  lengthFt: nonNegativeFeet.optional(),
  widthFt: nonNegativeFeet.optional(),
  heightFt: nonNegativeFeet.optional(),
  notes: z.string().optional()
});

export const ObstacleDimensionSetSchema: z.ZodType<ObstacleDimensionSet> = z.object({
  datasetId: z.literal("gto_obstacle_dimensions"),
  version: z.literal("0.1.0"),
  units: z.literal("feet"),
  obstacles: z.array(ObstacleDimensionSchema)
});

export const ColorRuleMappingSchema: z.ZodType<ColorRuleMapping> = z.object({
  colliderColor: z.union([z.literal("red"), z.literal("blue"), z.literal("yellow"), z.literal("white")]),
  menSafe: z.boolean(),
  materialSafe: z.boolean(),
  description: z.string()
});

export const ColorRuleSetSchema: z.ZodType<ColorRuleSet> = z.object({
  datasetId: z.literal("gto_color_rule"),
  version: z.literal("0.1.0"),
  mappings: z.array(ColorRuleMappingSchema)
});

export const DistanceRuleParamsSchema: z.ZodType<DistanceRuleParams> = z.object({
  id: z.literal("distance_4ft_bridge_required"),
  minGapFtToRequireBridge: positiveFeet,
  epsilonFt: nonNegativeFeet
});

export const DistanceRuleSetSchema: z.ZodType<DistanceRuleSet> = z.object({
  datasetId: z.literal("gto_distance_rules"),
  version: z.literal("0.1.0"),
  rules: z.array(DistanceRuleParamsSchema)
});

export const GTOEnvironmentRulesDatasetSchema: z.ZodType<GTOEnvironmentRulesDataset> = z.object({
  obstacleDimensions: ObstacleDimensionSetSchema,
  colorRules: ColorRuleSetSchema,
  distanceRules: DistanceRuleSetSchema
});

// --- Builders / stubs ---
// These are intentionally MVP stubs: typed + validated, ready to be expanded with real SSB measurements.

export function buildGTOObstacleDimensionStub(): ObstacleDimensionSet {
  return {
    datasetId: "gto_obstacle_dimensions",
    version: "0.1.0",
    units: "feet",
    obstacles: [
      {
        kind: "burma_bridge",
        lengthFt: 25,
        heightFt: 10,
        notes: "MVP stub; verify against official SSB dimensions."
      },
      {
        kind: "long_jump_drum",
        lengthFt: 6,
        widthFt: 3,
        notes: "MVP stub (6x3 ft). Verify against official dimensions."
      },
      {
        kind: "high_jump_bar",
        lengthFt: 3,
        notes: "MVP stub; verify exact bar dimensions."
      },
      {
        kind: "rope_bridge",
        notes: "General placeholder for cantilever/rope bridging assets."
      }
    ]
  };
}

export function buildGTOColorRuleStub(): ColorRuleSet {
  // Color rule semantics (typical SSB interpretation):
  // - Red: out of bounds for both men and helping materials.
  // - Blue/Yellow: safe for men but NOT safe for helping materials.
  // - White: safe for both men and helping materials.
  return {
    datasetId: "gto_color_rule",
    version: "0.1.0",
    mappings: [
      {
        colliderColor: "red",
        menSafe: false,
        materialSafe: false,
        description: "Out of bounds: candidate and helping materials both penalized."
      },
      {
        colliderColor: "blue",
        menSafe: true,
        materialSafe: false,
        description: "Safe for candidate; helping materials touching triggers penalty."
      },
      {
        colliderColor: "yellow",
        menSafe: true,
        materialSafe: false,
        description: "Safe for candidate; helping materials touching triggers penalty."
      },
      {
        colliderColor: "white",
        menSafe: true,
        materialSafe: true,
        description: "Safe for both candidate and helping materials."
      }
    ]
  };
}

export function buildGTODistanceRuleStub(): DistanceRuleSet {
  return {
    datasetId: "gto_distance_rules",
    version: "0.1.0",
    rules: [
      {
        id: "distance_4ft_bridge_required",
        minGapFtToRequireBridge: 4,
        epsilonFt: 0.01
      }
    ]
  };
}

export function buildGTOEnvironmentRulesDatasetStub(): GTOEnvironmentRulesDataset {
  return {
    obstacleDimensions: buildGTOObstacleDimensionStub(),
    colorRules: buildGTOColorRuleStub(),
    distanceRules: buildGTODistanceRuleStub()
  };
}

// --- Evaluation helper (MVP) ---
// This intentionally lives with dataset module so backend can reuse it without a new dependency layer.

export function getDistanceRuleParams(
  dataset: DistanceRuleSet,
  ruleId: DistanceRuleId
): DistanceRuleParams {
  const rule = dataset.rules.find((r) => r.id === ruleId);
  if (!rule) throw new Error(`Missing distance rule params for id=${ruleId}`);
  return rule;
}

/**
 * Distance rule enforcement:
 * Return true if the gap is large enough that it must be bridged.
 * @param gapFt measured gap in feet
 */
export function isGapBridgeRequired(params: DistanceRuleParams, gapFt: Ft): boolean {
  const safe = params.minGapFtToRequireBridge - params.epsilonFt;
  return gapFt >= safe;
}
