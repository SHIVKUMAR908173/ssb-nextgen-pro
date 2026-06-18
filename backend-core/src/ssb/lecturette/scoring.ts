import type {
  AcousticBiomarkers,
  LinguisticBiomarkers,
  OLQEvaluation,
  SSBLecturetteAssessmentResult,
  TimestampReference
} from "./types.js";
import { SSBLecturetteAssessmentResultSchema } from "./types.js";

export function clamp1to5(n: number): 1 | 2 | 3 | 4 | 5 {
  if (n <= 1) return 1;
  if (n >= 5) return 5;
  return Math.round(n) as 1 | 2 | 3 | 4 | 5;
}

function evidenceRef(label: string, startSeconds: number, endSeconds: number): TimestampReference {
  return { label, start_seconds: startSeconds, end_seconds: endSeconds };
}

/**
 * MVP deterministic scoring:
 * - Uses rule-of-thumb thresholds from the provided spec.
 * - Produces fixed-format evidence strings using only the provided biomarkers.
 *
 * NOTE: Real deployment should replace this with an LLM constrained to the schema
 * and/or a trained model on true ASR+acoustics feature vectors.
 */
export function scoreLecturetteMock(params: {
  sessionMetadata: SSBLecturetteAssessmentResult["session_metadata"];
  acoustic: AcousticBiomarkers;
  linguistic: LinguisticBiomarkers;
}): SSBLecturetteAssessmentResult {
  const { sessionMetadata, acoustic, linguistic } = params;

  const wordsPerMin = acoustic.words_per_minute;

  // Convert biomarkers to normalized “quality” signals (higher is better).
  const wpmQuality = scoreFromRange(wordsPerMin, 140, 150, 110, 170); // peak around 140-150
  const pausePenalty = scoreFromPenalty(acoustic.total_pause_duration_seconds, 25, 70); // arbitrary scale for MVP
  const fillerPenalty = scoreFromPenalty(
    linguistic.filler_word_count,
    10,
    35
  );
  const lexicalQuality = scoreFromRange01(linguistic.lexical_diversity_ttr, 0.35, 0.55);

  const transitionQuality = scoreFromRange(linguistic.transition_word_count, 4, 10, 0, 18);
  const syntaxQuality = scoreFromRange(linguistic.mean_dependency_distance, 4.5, 7.5, 2, 12);
  const readabilityQuality = scoreFromRange(linguistic.flesch_kincaid_grade, 8, 12, 4, 18);

  const jitterPenalty = scoreFromPenalty(acoustic.jitter_percentage, 0.5, 2.0);
  const shimmerPenalty = scoreFromPenalty(acoustic.shimmer_percentage, 0.5, 2.0);
  const confidenceQuality = clamp1to5(
    1 + Math.round((wpmQuality - 1) * 0.25 + (jitterPenalty + shimmerPenalty) * 1.5 - fillerPenalty * 0.15)
  );

  // Power of Expression: lexical richness + pacing + filler/clarity.
  const poeRaw =
    1 +
    (lexicalQuality - 1) * 0.35 +
    (readabilityQuality - 1) * 0.25 +
    (wpmQuality - 1) * 0.25 -
    fillerPenalty * 0.35 +
    transitionQuality * 0.05;
  const poe = clamp1to5(poeRaw);

  // Effective Intelligence: fast retrieval (wpm) + fewer long pauses/fillers.
  const eiRaw =
    1 +
    (wpmQuality - 1) * 0.45 +
    (pausePenalty - 1) * 0.25 +
    (1 - fillerPenalty / 5) * 1.2;
  const effectiveIntelligence = clamp1to5(eiRaw);

  // Reasoning ability: transitions + syntax/readability proxies.
  const raRaw =
    1 +
    (transitionQuality - 1) * 0.4 +
    (syntaxQuality - 1) * 0.25 +
    (lexicalQuality - 1) * 0.15 +
    (readabilityQuality - 1) * 0.2;
  const reasoningAbility = clamp1to5(raRaw);

  // Organizing ability: transitions + structural sequencing proxies.
  const oaRaw =
    1 +
    (transitionQuality - 1) * 0.55 +
    (pausePenalty - 1) * 0.15 +
    (readabilityQuality - 1) * 0.2 +
    (syntaxQuality - 1) * 0.1;
  const organizingAbility = clamp1to5(oaRaw);

  // Self-confidence: jitter/shimmer + stability proxies (wpmQuality + filler).
  const sc = confidenceQuality;

  // Liveliness / influence: pitch variance not present in MVP types; use wpmQuality + penalty inversions.
  // If we only have mean f0, approximate liveliness from “not too slow/fast” + low pauses/fillers.
  const livelinessRaw =
    1 +
    (wpmQuality - 1) * 0.45 +
    (pausePenalty - 1) * 0.25 +
    (1 - jitterPenalty / 5) * 0.15 +
    (1 - shimmerPenalty / 5) * 0.15;
  const livelinessAndInfluence = clamp1to5(livelinessRaw);

  // Courage/Determination: fluency proxies => low pauses + low filler + good pacing.
  const courageRaw =
    1 +
    (pausePenalty - 1) * 0.35 +
    (wpmQuality - 1) * 0.35 +
    (1 - fillerPenalty / 5) * 0.3;
  const courageAndDetermination = clamp1to5(courageRaw);

  const olqEvaluation: OLQEvaluation[] = [
    {
      olq_name: "Effective Intelligence",
      score: effectiveIntelligence,
      justification_evidence: `Effective Intelligence scored ${effectiveIntelligence}/5 using pacing+hesitation proxies: WPM=${format1(wordsPerMin)} with pause_penalty=${format1(pausePenalty)} and filler_word_count=${linguistic.filler_word_count}.`
    },
    {
      olq_name: "Reasoning Ability",
      score: reasoningAbility,
      justification_evidence: `Reasoning Ability scored ${reasoningAbility}/5 based on structural/logic proxies: transition_word_count=${linguistic.transition_word_count}, mean_dependency_distance=${format1(linguistic.mean_dependency_distance)}, flesch_kincaid_grade=${format1(linguistic.flesch_kincaid_grade)}.`
    },
    {
      olq_name: "Organizing Ability",
      score: organizingAbility,
      justification_evidence: `Organizing Ability scored ${organizingAbility}/5 using discourse signposting proxies: transition_word_count=${linguistic.transition_word_count} and overall sequencing stability proxy pause_penalty=${format1(pausePenalty)}.`
    },
    {
      olq_name: "Power of Expression",
      score: poe,
      justification_evidence: `Power of Expression scored ${poe}/5 using lexical + clarity proxies: lexical_diversity_ttr=${format3(linguistic.lexical_diversity_ttr)}, filler_word_count=${linguistic.filler_word_count}, WPM=${format1(wordsPerMin)}.`
    },
    {
      olq_name: "Self-Confidence",
      score: sc,
      justification_evidence: `Self-Confidence scored ${sc}/5 from vocal stability proxies: jitter_percentage=${format3(acoustic.jitter_percentage)}, shimmer_percentage=${format3(acoustic.shimmer_percentage)}, WPM=${format1(wordsPerMin)}.`
    },
    {
      olq_name: "Liveliness and Ability to Influence the Group",
      score: livelinessAndInfluence,
      justification_evidence: `Liveliness/Influence scored ${livelinessAndInfluence}/5 using engagement proxies: WPM=${format1(wordsPerMin)} with pause_penalty=${format1(pausePenalty)} and vocal stability (jitter/shimmer).`
    },
    {
      olq_name: "Courage and Determination",
      score: courageAndDetermination,
      justification_evidence: `Courage/Determination scored ${courageAndDetermination}/5 based on fluency under pressure proxies: total_pause_duration_seconds=${format1(acoustic.total_pause_duration_seconds)} and filler_word_count=${linguistic.filler_word_count}.`
    }
  ];

  const result: SSBLecturetteAssessmentResult = {
    session_metadata: sessionMetadata,
    acoustic_biomarkers: acoustic,
    linguistic_biomarkers: linguistic,
    olq_evaluation: olqEvaluation
  };

  // Validate output shape defensively.
  const parsed = SSBLecturetteAssessmentResultSchema.safeParse(result);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`SSB Lecturette scoring produced invalid result: ${msg}`);
  }

  return result;
}

/**
 * Returns 1..5 score from a target interval [bestMin,bestMax].
 * - best interval => 5
 * - outside [lowCap, highCap] => 1
 * - linear-ish ramp in between.
 */
function scoreFromRange(value: number, bestMin: number, bestMax: number, lowCap: number, highCap: number): number {
  if (value < lowCap || value > highCap) return 1;
  if (value >= bestMin && value <= bestMax) return 5;

  // Determine which side we're on.
  const dist =
    value < bestMin ? bestMin - value : value > bestMax ? value - bestMax : 0;

  const span = value < bestMin ? bestMin - lowCap : highCap - bestMax;
  const t = span <= 0 ? 0 : dist / span; // 0..1
  const score = 5 - t * 4;
  return clamp1to5(score);
}

/** score penalty => higher means “worse” in 1..5 space; we later invert as needed */
function scoreFromPenalty(value: number, mildThreshold: number, severeThreshold: number): number {
  // value <= mild => 5 (good) ; value >= severe => 1 (bad)
  if (value <= mildThreshold) return 5;
  if (value >= severeThreshold) return 1;

  const t = (value - mildThreshold) / (severeThreshold - mildThreshold); // 0..1
  const score = 5 - t * 4;
  return clamp1to5(score);
}

/** 0..1 ttr with sweet spot */
function scoreFromRange01(value: number, bestMin: number, bestMax: number): number {
  if (value <= bestMin) return 3;
  if (value >= bestMax) return 5;
  // between bestMin and bestMax
  const t = (value - bestMin) / (bestMax - bestMin); // 0..1
  const score = 3 + t * 2;
  return clamp1to5(score);
}

function format1(n: number) {
  return Math.round(n * 10) / 10;
}
function format3(n: number) {
  return Math.round(n * 1000) / 1000;
}
