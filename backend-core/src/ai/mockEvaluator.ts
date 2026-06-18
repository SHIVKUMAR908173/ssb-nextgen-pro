import { CandidateInput, InterviewEvaluation, OLQScore } from "./types.js";

export type MockEvaluatorConfig = {
  seed: number;
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp1to10(n: number) {
  if (n < 1) return 1;
  if (n > 10) return 10;
  return n;
}

function stableHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type OLQSeedMapItem = {
  olqId: string;
  olqName: string;
  base: number; // 1..10
};

export const OLQ_SEED_MAP: OLQSeedMapItem[] = [
  { olqId: "OLQ-01", olqName: "Planning & Organizing - Placeholder", base: 6 },
  { olqId: "OLQ-02", olqName: "Social Adjustment - Placeholder", base: 6 },
  { olqId: "OLQ-03", olqName: "Social Effectiveness - Placeholder", base: 6 },
  { olqId: "OLQ-04", olqName: "Dynamic Qualities - Placeholder", base: 6 },

  // Remaining 11 placeholders so output always has exactly 15 scores.
  { olqId: "OLQ-05", olqName: "Decision Making - Placeholder", base: 6 },
  { olqId: "OLQ-06", olqName: "Initiative - Placeholder", base: 6 },
  { olqId: "OLQ-07", olqName: "Communication - Placeholder", base: 6 },
  { olqId: "OLQ-08", olqName: "Team Work - Placeholder", base: 6 },
  { olqId: "OLQ-09", olqName: "Courage - Placeholder", base: 6 },
  { olqId: "OLQ-10", olqName: "Discipline - Placeholder", base: 6 },
  { olqId: "OLQ-11", olqName: "Integrity - Placeholder", base: 6 },
  { olqId: "OLQ-12", olqName: "Adaptability - Placeholder", base: 6 },
  { olqId: "OLQ-13", olqName: "Resilience - Placeholder", base: 6 },
  { olqId: "OLQ-14", olqName: "Leadership - Placeholder", base: 6 },
  { olqId: "OLQ-15", olqName: "Responsibility - Placeholder", base: 6 }
];

export function evaluateInterviewMock(
  config: MockEvaluatorConfig,
  candidate: CandidateInput
): InterviewEvaluation {
  const rand = mulberry32(config.seed);

  const concatenated = Object.entries(candidate.answersByQuestionId)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v)
    .join("\n");

  const lengthFactor = Math.min(1, concatenated.length / 1800); // 0..1-ish
  const hash = stableHash(concatenated);

  const olqScores: OLQScore[] = OLQ_SEED_MAP.map((olq, idx) => {
    // Deterministic but varied: combine hash + index + some "random".
    const n = hash + idx * 2654435761;
    const wobble = Math.floor((rand() * 2 - 1) * 2); // -2..+1
    const baseLift = Math.round(lengthFactor * 2); // 0..2
    const raw = olq.base + wobble + baseLift + (n % 3) - 1; // -1..+1
    const score = clamp1to10(raw);

    const justification =
      score >= 8
        ? "The answer text shows strong specificity and coherent structure across questions."
        : score >= 5
          ? "The answer provides partial structure with some ambiguity or limited concrete examples."
          : "The answer lacks depth, shows inconsistency, or avoids direct ownership of actions.";

    return {
      olqId: olq.olqId,
      olqName: olq.olqName,
      score: score as OLQScore["score"],
      justification
    };
  });

  // Factor aggregations: simple deterministic rollups.
  const planningOrganizing = averageInt(olqScores.slice(0, 4));
  const socialAdjustment = averageInt(olqScores.slice(4, 8));
  const socialEffectiveness = averageInt(olqScores.slice(8, 11));
  const dynamicQualities = averageInt(olqScores.slice(11, 15));

  const factorAggregation = {
    planningOrganizing,
    socialAdjustment,
    socialEffectiveness,
    dynamicQualities
  };

  const recommendation = recommendFromFactors(factorAggregation);

  const overallJustification =
    recommendation === "SSB_RECOMMEND"
      ? "Across responses, the candidate demonstrates consistent ownership, structured thinking, and credible detail."
      : recommendation === "MAYBE"
        ? "Responses are moderately consistent; several OLQs appear limited by reduced specificity or uneven structuring."
        : "Responses show weak ownership and limited evidence; key behavioral markers are insufficiently evidenced.";

  return {
    recommendation,
    factorAggregation,
    olqScores,
    overallJustification
  };
}

function averageInt(items: OLQScore[]) {
  const sum = items.reduce((acc, it) => acc + it.score, 0);
  return clamp1to10(Math.round(sum / items.length));
}

function recommendFromFactors(factors: {
  planningOrganizing: number;
  socialAdjustment: number;
  socialEffectiveness: number;
  dynamicQualities: number;
}): InterviewEvaluation["recommendation"] {
  const avg = (factors.planningOrganizing + factors.socialAdjustment + factors.socialEffectiveness + factors.dynamicQualities) / 4;
  if (avg >= 8) return "SSB_RECOMMEND";
  if (avg >= 5.5) return "MAYBE";
  return "NOT_RECOMMEND";
}
