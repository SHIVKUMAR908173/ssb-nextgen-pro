import { z } from "zod";

export type GDTier = 1 | 2 | 3;

export type GDTopic = {
  id: string;
  title: string;
  description: string;
  tier: GDTier;

  /**
   * High probability topics for 2025/2026 guidance.
   * Used by UI to highlight and by backend for selection pools.
   */
  highProbability: boolean;

  /**
   * Sub-themes to help the candidate structure their points.
   */
  subThemes: string[];
};

export type GDTopicsDataset = {
  datasetId: "gd_topics_stub";
  version: "0.1.0";
  updatedFor: "2026/2027";
  topics: GDTopic[];
};

export const GDTopicSchema: z.ZodType<GDTopic> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  highProbability: z.boolean(),
  subThemes: z.array(z.string().min(1)).min(1)
});

export const GDTopicsDatasetSchema: z.ZodType<GDTopicsDataset> = z.object({
  datasetId: z.literal("gd_topics_stub"),
  version: z.literal("0.1.0"),
  updatedFor: z.literal("2026/2027"),
  topics: z.array(GDTopicSchema)
});

export function buildGDTopicsDatasetStub(): GDTopicsDataset {
  const topics: GDTopic[] = [
    // Tier 3 (high pressure / advanced)
    {
      id: "gd-2026-aatmanirbhar-defence-milestones",
      title: "Aatmanirbhar Bharat Defence Milestones",
      description:
        "Discuss India's defence production push: target ₹1.75 lakh crore in the current fiscal and ₹3 lakh crore by 2029. Cover policy, industrial capacity, and strategic autonomy.",
      tier: 3,
      highProbability: true,
      subThemes: ["defence production targets", "indigenous supply chains", "strategic autonomy", "public-private capacity building"]
    },
    {
      id: "gd-2026-data-embassies",
      title: "Data Embassies",
      description:
        "Explain 'data embassies' and debate their implications for sovereignty, governance, privacy, and cross-border cooperation.",
      tier: 3,
      highProbability: true,
      subThemes: ["data sovereignty", "privacy vs access", "cross-border governance", "compliance & governance models"]
    },
    {
      id: "gd-2026-ai-agents",
      title: "Artificial Intelligence Agents",
      description:
        "Debate whether AI agents should be deployed broadly. Consider accountability, safety, job impact, and governance mechanisms.",
      tier: 3,
      highProbability: true,
      subThemes: ["agent accountability", "safety & alignment", "jobs & productivity", "regulation & audits"]
    },

    // Tier 2 (common high probability mix)
    {
      id: "gd-2026-israel-hamas",
      title: "Israel–Hamas conflict",
      description:
        "Discuss humanitarian priorities, conflict de-escalation options, and the responsibilities of regional and international actors.",
      tier: 2,
      highProbability: true,
      subThemes: ["humanitarian aid", "de-escalation", "international response", "peace-building"]
    },
    {
      id: "gd-2026-one-nation-one-election",
      title: "One Nation, One Election",
      description:
        "Discuss the goals of electoral synchronization and evaluate potential benefits, risks, and administrative/logistical challenges.",
      tier: 2,
      highProbability: true,
      subThemes: ["governance efficiency", "federal balance", "implementation risks", "public trust"]
    },
    {
      id: "gd-2026-uniform-civil-code",
      title: "Uniform Civil Code (UCC)",
      description:
        "Discuss the goals of civil reforms and social cohesion, and evaluate the balance between constitutional principles and cultural pluralism.",
      tier: 2,
      highProbability: true,
      subThemes: ["constitutional values", "social justice", "implementation challenges", "community concerns"]
    },

    // Tier 1 (easy / familiar) + pool diversity
    {
      id: "gd-2026-south-china-sea",
      title: "South China Sea dispute",
      description:
        "Discuss causes of conflict, the role of international law, and realistic pathways to reduce tensions among stakeholders.",
      tier: 1,
      highProbability: false,
      subThemes: ["confidence-building", "diplomacy", "maritime law", "resource security"]
    },
    {
      id: "gd-2026-social-media-misinformation",
      title: "Misinformation, persuasion, and civic responsibility",
      description:
        "Debate how societies can reduce misinformation while protecting freedom of expression and encouraging civic media literacy.",
      tier: 1,
      highProbability: false,
      subThemes: ["media literacy", "platform accountability", "verification habits", "legal safeguards"]
    },
    {
      id: "gd-2026-cyber-security",
      title: "Cybersecurity in critical infrastructure",
      description:
        "Discuss how governments and operators should secure systems impacting public safety and essential services, including standards and incident response.",
      tier: 2,
      highProbability: false,
      subThemes: ["risk management", "incident response", "public-private collaboration", "standards & audits"]
    }
  ];

  const out: GDTopicsDataset = {
    datasetId: "gd_topics_stub",
    version: "0.1.0",
    updatedFor: "2026/2027",
    topics
  };

  const check = GDTopicsDatasetSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`GD topics dataset stub failed schema validation: ${JSON.stringify(check.error.flatten())}`);
  }

  return out;
}
