import type { ColliderColorRule, DistanceRuleId, DistanceRuleParams, DistanceRuleSet, Ft } from "../lib/datasets/gto.js";
import { getDistanceRuleParams, isGapBridgeRequired } from "../lib/datasets/gto.js";

export type EvaluateGapBridgeInput = {
  gapFt: Ft;
  distanceRuleId: DistanceRuleId;
  dataset: DistanceRuleSet;
};

export type EvaluateGapBridgeOutput = {
  bridgeRequired: boolean;
  distanceRule: DistanceRuleParams;
};

export function evaluateGapBridge(params: EvaluateGapBridgeInput): EvaluateGapBridgeOutput {
  const { gapFt, distanceRuleId, dataset } = params;
  const distanceRule = getDistanceRuleParams(dataset, distanceRuleId);
  return {
    bridgeRequired: isGapBridgeRequired(distanceRule, gapFt),
    distanceRule
  };
}

export type EvaluateColorRuleInput = {
  colliderColor: ColliderColorRule;
  // When determining whether the candidate/helping materials are allowed to touch.
  // - "candidate" means the man/candidate itself
  // - "material" means the helping material
  who: "candidate" | "material";
  dataset: {
    mappings: Array<{
      colliderColor: ColliderColorRule;
      menSafe: boolean;
      materialSafe: boolean;
    }>;
  };
};

export type EvaluateColorRuleOutput = {
  allowed: boolean;
  mappingFound: boolean;
};

export function evaluateColorRule(params: EvaluateColorRuleInput): EvaluateColorRuleOutput {
  const { colliderColor, who, dataset } = params;
  const mapping = dataset.mappings.find((m) => m.colliderColor === colliderColor);

  if (!mapping) {
    return { allowed: false, mappingFound: false };
  }

  if (who === "candidate") return { allowed: mapping.menSafe, mappingFound: true };
  return { allowed: mapping.materialSafe, mappingFound: true };
}
