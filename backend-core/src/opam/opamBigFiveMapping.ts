import { OPAMDomain } from "../lib/datasets/opam.js";

export type BigFiveTrait = "openness" | "conscientiousness" | "extroversion" | "agreeableness" | "neuroticism";

export type OLQToBigFiveMapping = {
  /**
   * 15 OLQs (in this repo they’re represented by OLQ-01..OLQ-15 placeholders).
   */
  olqId: string;

  /**
   * “Big Five” target traits for this OLQ.
   * Values are weights; they don’t have to sum to 1.0.
   */
  bigFiveWeights: Partial<Record<BigFiveTrait, number>>;

  /**
   * Why this mapping exists (used for audit / future real rubrics).
   */
  rationale: string;
};

/**
 * MVP mapping: deterministic heuristic weights that ensure every trait gets signal.
 * Replace with the “official”/validated trait framework when available.
 */
export const OLQ_TO_BIG_FIVE_MAPPING: OLQToBigFiveMapping[] = (() => {
  const mk = (olqId: string, bigFiveWeights: OLQToBigFiveMapping["bigFiveWeights"], rationale: string): OLQToBigFiveMapping => ({
    olqId,
    bigFiveWeights,
    rationale
  });

  // OLQ placeholders: OLQ-01..OLQ-15
  // Distribution is intentionally broad so the evaluation always returns all 5 traits.
  return [
    mk("OLQ-01", { openness: 0.9, conscientiousness: 0.2, agreeableness: 0.4 }, "Planning/curiosity-style behavior aligns with openness; structure adds some conscientiousness."),
    mk("OLQ-02", { extroversion: 0.8, agreeableness: 0.6 }, "Social adjustment/people-facing behavior maps to extroversion + agreeableness."),
    mk("OLQ-03", { extroversion: 0.7, agreeableness: 0.7 }, "Social effectiveness/communication intent maps to extroversion and agreeableness."),
    mk("OLQ-04", { neuroticism: 0.6, openness: 0.4 }, "Dynamic qualities under pressure can increase sensitivity (neuroticism) signal; creativity stays in openness."),
    mk("OLQ-05", { conscientiousness: 0.9 }, "Decision/organization-like quality strongly maps to conscientiousness."),
    mk("OLQ-06", { openness: 0.6, extroversion: 0.3, conscientiousness: 0.5 }, "Initiative tends to create new approaches (openness) while still requiring follow-through (conscientiousness)."),
    mk("OLQ-07", { extroversion: 0.7, agreeableness: 0.4 }, "Communication effectiveness aligns with extroversion; cooperative tone aligns with agreeableness."),
    mk("OLQ-08", { agreeableness: 0.9, extroversion: 0.3 }, "Teamwork maps primarily to agreeableness."),
    mk("OLQ-09", { conscientiousness: 0.5, neuroticism: 0.4 }, "Courage under uncertainty can reflect steadiness (low neuroticism) and discipline."),
    mk("OLQ-10", { conscientiousness: 1.0 }, "Discipline maps directly to conscientiousness."),
    mk("OLQ-11", { agreeableness: 0.8, conscientiousness: 0.6 }, "Integrity/consistency with norms supports agreeableness + conscientiousness."),
    mk("OLQ-12", { openness: 0.7, conscientiousness: 0.4 }, "Adaptability reflects openness + some conscientious execution."),
    mk("OLQ-13", { neuroticism: 0.6, conscientiousness: 0.5 }, "Resilience is inversely related to neuroticism; since we don’t have directionality here, we weight it to neuroticism signal."),
    mk("OLQ-14", { extroversion: 0.5, agreeableness: 0.5, conscientiousness: 0.5 }, "Leadership mixes influence (extroversion) + fairness (agreeableness) + execution."),
    mk("OLQ-15", { conscientiousness: 0.9, agreeableness: 0.3 }, "Responsibility is mostly conscientiousness; accountability in teams can raise agreeableness.")
  ];
})();

export type OpamTraitSignal = {
  domain: OPAMDomain;
  /**
   * Domain score in 1..10.
   */
  score: number;
};

export type BigFiveTraitScores = Record<BigFiveTrait, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>;

/**
 * Heuristic OPAM→Big Five:
 * OPAM domains currently available:
 * - self_report_conduct
 * - discipline
 * - motivation
 * - team_spirit
 *
 * This maps domains to Big Five trait signals so the evaluator can output all 5 traits.
 */
export function opamDomainScoresToBigFive(params: {
  domainScores: Array<{ domain: OPAMDomain; score: number }>;
}): {
  bigFiveScores: BigFiveTraitScores;
  /**
   * Audit trail used by UI: which OPAM domain contributed how much.
   */
  contributions: Array<{
    domain: OPAMDomain;
    score: number;
    weights: Partial<Record<BigFiveTrait, number>>;
  }>;
} {
  const weightsByDomain: Record<OPAMDomain, Partial<Record<BigFiveTrait, number>>> = {
    self_report_conduct: { agreeableness: 0.65, neuroticism: 0.35 },
    discipline: { conscientiousness: 0.95, neuroticism: 0.1 },
    motivation: { openness: 0.5, conscientiousness: 0.4, extroversion: 0.2 },
    team_spirit: { agreeableness: 0.75, extroversion: 0.35 }
  };

  const traits: BigFiveTrait[] = ["openness", "conscientiousness", "extroversion", "agreeableness", "neuroticism"];
  const traitSumWeights: Record<BigFiveTrait, number> = {
    openness: 0,
    conscientiousness: 0,
    extroversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  const traitWeightedTotal: Record<BigFiveTrait, number> = {
    openness: 0,
    conscientiousness: 0,
    extroversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  const contributions = params.domainScores.map((d) => ({
    domain: d.domain,
    score: d.score,
    weights: weightsByDomain[d.domain] ?? {}
  }));

  for (const d of params.domainScores) {
    const w = weightsByDomain[d.domain] ?? {};
    for (const t of traits) {
      const wt = w[t] ?? 0;
      if (wt <= 0) continue;
      traitWeightedTotal[t] += d.score * wt;
      traitSumWeights[t] += wt;
    }
  }

  const bigFiveScores = traits.reduce((acc, t) => {
    const denom = traitSumWeights[t] || 1;
    const raw = traitWeightedTotal[t] / denom; // ~1..10
    const clamped = clamp1to10(raw);
    acc[t] = clamped;
    return acc;
  }, {} as BigFiveTraitScores);

  return { bigFiveScores, contributions };
}

function clamp1to10(n: number): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 {
  if (n <= 1) return 1;
  if (n >= 10) return 10;
  return Math.round(n) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}
