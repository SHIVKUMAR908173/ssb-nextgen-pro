// Heuristic WAT scoring MVP: sentiment/reflex + semantic similarity to ideal_response + OLQ target mapping.
import { InterviewEvaluation, OLQScore } from "../ai/types.js";
import type { WATSessionState } from "./types.js";
import { buildWATModelResponseSpecsValidated } from "../lib/datasets/wat.js";

function clamp1to10(n: number) {
  if (n < 1) return 1;
  if (n > 10) return 10;
  return n;
}

const OLQ_IDS: Array<Pick<OLQScore, "olqId" | "olqName">> = [
  { olqId: "OLQ-01", olqName: "Planning & Organizing - Placeholder" },
  { olqId: "OLQ-02", olqName: "Social Adjustment - Placeholder" },
  { olqId: "OLQ-03", olqName: "Social Effectiveness - Placeholder" },
  { olqId: "OLQ-04", olqName: "Dynamic Qualities - Placeholder" },

  { olqId: "OLQ-05", olqName: "Decision Making - Placeholder" },
  { olqId: "OLQ-06", olqName: "Initiative - Placeholder" },
  { olqId: "OLQ-07", olqName: "Communication - Placeholder" },
  { olqId: "OLQ-08", olqName: "Team Work - Placeholder" },
  { olqId: "OLQ-09", olqName: "Courage - Placeholder" },
  { olqId: "OLQ-10", olqName: "Discipline - Placeholder" },
  { olqId: "OLQ-11", olqName: "Integrity - Placeholder" },
  { olqId: "OLQ-12", olqName: "Adaptability - Placeholder" },
  { olqId: "OLQ-13", olqName: "Resilience - Placeholder" },
  { olqId: "OLQ-14", olqName: "Leadership - Placeholder" },
  { olqId: "OLQ-15", olqName: "Responsibility - Placeholder" }
];

function scoreToJustification(score: number) {
  if (score >= 8) return "Strong coherence with OLQ-aligned associative themes and controlled reflex framing across flashes.";
  if (score >= 5) return "Moderate coherence; some associative themes align to OLQs but consistency varies between flashes.";
  return "Weak coherence; responses show limited goal-directed framing and/or reflexive pessimism where positivity is expected.";
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

function jaccardSimilarity(a: string, b: string) {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const x of ta) if (tb.has(x)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union ? inter / union : 0;
}

const NEGATIVE_REFLEX_PENALTY_KEYWORDS = [
  // reflex/pessimism markers
  "afraid",
  "fear",
  "terrified",
  "panic",
  "hopeless",
  "cannot",
  "unable",
  "ruin",
  "destroy",
  "trapped",
  "guilty",
  "failure",
  "defeat",
  "worry",
  "danger"
];

function sentimentReflexScore(specType: "Positive" | "Neutral" | "Negative", responseText: string) {
  // Heuristic:
  // - For Negative stimulus: penalize pessimistic framing; reward constructive "prepare/adapt/recover" framing.
  // - For Positive stimulus: reward constructive/mission framing; penalize pure resignation/denial.
  const text = responseText.toLowerCase();

  if (specType === "Negative") {
    const pessimisticHits = NEGATIVE_REFLEX_PENALTY_KEYWORDS.reduce((acc, k) => acc + (text.includes(k) ? 1 : 0), 0);
    const constructiveSignals = ["prepare", "plan", "discipline", "adapt", "recover", "learn", "manage", "focus", "execute"];
    const constructiveHits = constructiveSignals.reduce((acc, k) => acc + (text.includes(k) ? 1 : 0), 0);

    // Map to 0..1 then scale to 1..10.
    const raw01 = 0.75 + constructiveHits * 0.08 - pessimisticHits * 0.06;
    return clamp1to10(Math.round(clamp01(raw01) * 9 + 1));
  }

  if (specType === "Positive") {
    const positiveSignals = ["honour", "loyal", "team", "mission", "discipline", "lead", "integrity", "commit", "improve", "success"];
    const posHits = positiveSignals.reduce((acc, k) => acc + (text.includes(k) ? 1 : 0), 0);
    const denialSignals = ["nothing", "no point", "give up"];
    const negHits = denialSignals.reduce((acc, k) => acc + (text.includes(k) ? 1 : 0), 0);

    const raw01 = 0.55 + posHits * 0.12 - negHits * 0.25;
    return clamp1to10(Math.round(clamp01(raw01) * 9 + 1));
  }

  // Neutral: mild baseline coherence.
  const raw01 = 0.55 + Math.min(0.25, tokenize(responseText).length / 80);
  return clamp1to10(Math.round(clamp01(raw01) * 9 + 1));
}

function clamp01(n: number) {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function olqTargetsFromSpec(targetOlqs: string[]) {
  // Only allow OLQs that exist in this codebase.
  const allowed = new Set(OLQ_IDS.map((o) => o.olqId));
  return targetOlqs.filter((id) => allowed.has(id));
}

export function evaluateWATMock(params: { seed: number; state: WATSessionState }): InterviewEvaluation {
  const { state } = params;

  const specs = buildWATModelResponseSpecsValidated();
  const specByWord = new Map<string, (typeof specs)[number]>();
  for (const s of specs) specByWord.set(s.word.toLowerCase(), s);

  // Accumulate OLQ evidence scores from each flash.
  const olqAccum: Record<string, number[]> = {};
  for (const olq of OLQ_IDS) olqAccum[olq.olqId] = [];

  for (const flash of state.flashes) {
    const spec = specByWord.get(flash.word.toLowerCase());
    if (!spec) {
      // Unknown words: contribute neutral baseline (low weight).
      for (const olq of OLQ_IDS) olqAccum[olq.olqId].push(4);
      continue;
    }

    const reflexScore = sentimentReflexScore(spec.type, flash.responseText); // 1..10
    const sim = jaccardSimilarity(flash.responseText, spec.ideal_response); // 0..1
    const similarityScore = clamp1to10(Math.round(sim * 9 + 1)); // 1..10

    // Combine: favor reflex correctness + meaning.
    const combined = clamp1to10(Math.round(reflexScore * 0.6 + similarityScore * 0.4));

    // Push combined evidence only to target OLQs; also softly to others to avoid total sparsity.
    const targets = olqTargetsFromSpec(spec.target_olq);
    const nonTargets = OLQ_IDS.map((o) => o.olqId).filter((id) => !targets.includes(id));

    for (const id of targets) olqAccum[id].push(combined);
    const bleed = clamp1to10(Math.round(combined * 0.7)); // reduced influence
    for (const id of nonTargets) olqAccum[id].push(bleed);
  }

  const olqScores: OLQScore[] = OLQ_IDS.map((olq) => {
    const arr = olqAccum[olq.olqId];
    const avg = arr.reduce((acc, n) => acc + n, 0) / (arr.length || 1);
    const score = clamp1to10(Math.round(avg));
    return {
      olqId: olq.olqId,
      olqName: olq.olqName,
      score: score as OLQScore["score"],
      justification: scoreToJustification(score)
    };
  });

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

  const avg = (planningOrganizing + socialAdjustment + socialEffectiveness + dynamicQualities) / 4;
  const recommendation: InterviewEvaluation["recommendation"] =
    avg >= 8 ? "SSB_RECOMMEND" : avg >= 5.5 ? "MAYBE" : "NOT_RECOMMEND";

  const overallJustification =
    recommendation === "SSB_RECOMMEND"
      ? "Across the association flashes, reflex framing and semantic coherence align to OLQ-targeted ideals with consistent constructive direction."
      : recommendation === "MAYBE"
        ? "The association pattern shows partial alignment: some flashes are coherent and OLQ-consistent, while others reduce clarity or reflex control."
        : "The association pattern shows limited coherence and weak constructive reframing, with reflexive pessimism present in areas expecting controlled positivity.";

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
