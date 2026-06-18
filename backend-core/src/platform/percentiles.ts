import { z } from "zod";

export type RankingItem = {
  userId: string;
  score: number; // higher is better
};

export type PercentileResult = {
  score: number;
  percentile: number; // 0..100
  rank: number; // 1 = best
  total: number;
  ties: number; // number of users with same score (in the computed population)
};

const ScoreSchema = z.number().finite();

function clamp0to100(n: number) {
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
}

/**
 * MVP percentile:
 * - Sort by score descending
 * - rank = position among sorted items (1-based)
 * - percentile computed as: 100 * (numStrictlyBelow / (total-1))
 *   where strictlyBelow means "scores lower than candidate score".
 *
 * If total === 1 -> percentile 100.
 *
 * This yields stable, intuitive percentiles without needing normal distributions.
 */
export function computePercentilesForPopulation(params: {
  population: RankingItem[];
  scoreForUserId: { userId: string; score: number };
}): PercentileResult {
  const { population, scoreForUserId } = params;

  if (!Array.isArray(population) || population.length === 0) {
    throw new Error("population must be a non-empty array");
  }

  const total = population.length;

  const scored = population.map((it) => ({
    userId: it.userId,
    score: ScoreSchema.parse(it.score)
  }));

  const candidateScore = ScoreSchema.parse(scoreForUserId.score);
  const candidateUserId = scoreForUserId.userId;

  // Ensure candidate is included in ranking population if caller passed a score not in list.
  const included = scored.some((x) => x.userId === candidateUserId);
  const effective = included
    ? scored
    : [
        ...scored,
        {
          userId: candidateUserId,
          score: candidateScore
        }
      ];

  // Sort high->low; stable tie order isn't important for percentile/rank by score.
  const sorted = [...effective].sort((a, b) => b.score - a.score);

  const rankIndex0 = sorted.findIndex((x) => x.userId === candidateUserId);
  // If somehow userId doesn't exist (e.g., duplicates), fallback by matching score first.
  const rankIndex = rankIndex0 >= 0 ? rankIndex0 : sorted.findIndex((x) => x.score === candidateScore);
  if (rankIndex < 0) {
    throw new Error("Could not find candidate in effective population after inclusion check.");
  }

  const rank = rankIndex + 1;

  // Ties: count users with exactly same score as candidate.
  const ties = sorted.filter((x) => x.score === candidateScore).length;

  const numStrictlyBelow = sorted.filter((x) => x.score < candidateScore).length;

  const percentile =
    total <= 1
      ? 100
      : clamp0to100(Math.round((100 * numStrictlyBelow) / (total - 1)));

  return {
    score: candidateScore,
    percentile,
    rank,
    total,
    ties
  };
}

export function computePercentileFromScores(params: {
  scores: number[];
  targetScore: number;
}): { percentile: number; rank: number; ties: number; total: number } {
  const { scores, targetScore } = params;
  if (!scores.length) throw new Error("scores must be non-empty");

  const total = scores.length;
  const tScore = ScoreSchema.parse(targetScore);

  const sorted = [...scores].sort((a, b) => b - a);
  const rankIndex0 = sorted.findIndex((s) => s === tScore);
  const rank = (rankIndex0 >= 0 ? rankIndex0 : 0) + 1;
  const ties = sorted.filter((s) => s === tScore).length;
  const numStrictlyBelow = sorted.filter((s) => s < tScore).length;

  const percentile =
    total <= 1 ? 100 : clamp0to100(Math.round((100 * numStrictlyBelow) / (total - 1)));

  return { percentile, rank, ties, total };
}
