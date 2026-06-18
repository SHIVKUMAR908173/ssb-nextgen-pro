import { z } from "zod";

export type LecturetteDifficultyTier = "above_average" | "average" | "sub_standard";

export type LecturetteTopicCard = {
  id: string;
  topics: Array<{
    topicId: string;
    title: string;
    difficultyTier: LecturetteDifficultyTier;
  }>;
};

export type LecturetteCardDataset = {
  datasetId: "ssb_lecturette_cards_stub";
  version: "0.1.0";
  // Exactly the tiers we need per spec: one above avg, two avg, one sub-standard.
  cards: LecturetteTopicCard[];
};

export const LecturetteDifficultyTierSchema: z.ZodType<LecturetteDifficultyTier> = z.union([
  z.literal("above_average"),
  z.literal("average"),
  z.literal("sub_standard")
]);

export const LecturetteTopicSchema = z.object({
  topicId: z.string().min(1),
  title: z.string().min(1),
  difficultyTier: LecturetteDifficultyTierSchema
});

export const LecturetteTopicCardSchema: z.ZodType<LecturetteTopicCard> = z.object({
  id: z.string().min(1),
  topics: z.array(LecturetteTopicSchema).length(4)
});

export const LecturetteCardDatasetSchema: z.ZodType<LecturetteCardDataset> = z.object({
  datasetId: z.literal("ssb_lecturette_cards_stub"),
  version: z.literal("0.1.0"),
  cards: z.array(LecturetteTopicCardSchema).min(1)
});

export function buildLecturetteCardsDatasetStub(): LecturetteCardDataset {
  // Deterministic-but-diverse stub cards.
  // Each card must have: 1 above_average, 2 average, 1 sub_standard.
  const cards: LecturetteTopicCard[] = [
    {
      id: "lec-card-001",
      topics: [
        { topicId: "lec-001-aa", title: "Ethical AI in high-stakes decision systems", difficultyTier: "above_average" },
        { topicId: "lec-001-a1", title: "Resilience in disaster preparedness at community level", difficultyTier: "average" },
        { topicId: "lec-001-a2", title: "Why misinformation spreads and how societies respond", difficultyTier: "average" },
        { topicId: "lec-001-ss", title: "Teamwork basics: roles, clarity, and communication", difficultyTier: "sub_standard" }
      ]
    },
    {
      id: "lec-card-002",
      topics: [
        { topicId: "lec-002-aa", title: "Balancing security and civil liberties in democracies", difficultyTier: "above_average" },
        { topicId: "lec-002-a1", title: "Leadership under uncertainty: what changes decisions", difficultyTier: "average" },
        { topicId: "lec-002-a2", title: "Sustainability: practical actions in public services", difficultyTier: "average" },
        { topicId: "lec-002-ss", title: "Discipline in daily routines and its benefits", difficultyTier: "sub_standard" }
      ]
    }
  ];

  const out: LecturetteCardDataset = {
    datasetId: "ssb_lecturette_cards_stub",
    version: "0.1.0",
    cards
  };

  const check = LecturetteCardDatasetSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`buildLecturetteCardsDatasetStub failed schema validation: ${JSON.stringify(check.error.flatten())}`);
  }

  return out;
}

export function pickLecturetteCard(params: { dataset: LecturetteCardDataset; seed: number; cardIndexOverride?: number }) {
  const { dataset, seed, cardIndexOverride } = params;
  const idx = typeof cardIndexOverride === "number" ? cardIndexOverride : seed % dataset.cards.length;
  return dataset.cards[idx];
}
