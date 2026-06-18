import { z } from "zod";

export type GDPersonaRole = "Initiator" | "Supporter" | "Harmonizer" | "Dominator";

export type GDPersona = {
  role: GDPersonaRole;
  // Simple behavior tags used by deterministic scoring.
  isDisruptiveArchetype: boolean;
  preferredMove: "start" | "support" | "moderate" | "control";
};

export type GDTrendingIssue = {
  id: string;
  title: string;
  description: string;
  // 1..3 for difficulty tiers in MVP.
  tier: 1 | 2 | 3;
  subThemes: string[];
};

export type GDAgentsPromptsDataset = {
  datasetId: "gd_agents_prompts_stub";
  version: "0.1.0";
  issues: GDTrendingIssue[];
  personas: GDPersona[];
};

const PersonaRoleSchema: z.ZodType<GDPersonaRole> = z.union([
  z.literal("Initiator"),
  z.literal("Supporter"),
  z.literal("Harmonizer"),
  z.literal("Dominator")
]);

export const GDPersonaSchema: z.ZodType<GDPersona> = z.object({
  role: PersonaRoleSchema,
  isDisruptiveArchetype: z.boolean(),
  preferredMove: z.union([z.literal("start"), z.literal("support"), z.literal("moderate"), z.literal("control")])
});

export const GDTrendingIssueSchema: z.ZodType<GDTrendingIssue> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  subThemes: z.array(z.string().min(1)).min(1)
});

export const GDAgentsPromptsDatasetSchema: z.ZodType<GDAgentsPromptsDataset> = z.object({
  datasetId: z.literal("gd_agents_prompts_stub"),
  version: z.literal("0.1.0"),
  issues: z.array(GDTrendingIssueSchema).min(1),
  personas: z.array(GDPersonaSchema).min(1)
});

export function buildGDAgentsPromptsDatasetStub(): GDAgentsPromptsDataset {
  const personas: GDPersona[] = [
    { role: "Initiator", isDisruptiveArchetype: false, preferredMove: "start" },
    { role: "Supporter", isDisruptiveArchetype: false, preferredMove: "support" },
    { role: "Harmonizer", isDisruptiveArchetype: false, preferredMove: "moderate" },
    { role: "Dominator", isDisruptiveArchetype: true, preferredMove: "control" }
  ];

  const issues: GDTrendingIssue[] = [
    {
      id: "gd-issue-ai-governance",
      title: "Regulating AI agents: accountability vs innovation",
      description: "Debate whether AI agents should be regulated more strictly and how to balance safety, accountability, and innovation.",
      tier: 2,
      subThemes: ["accountability", "safety", "governance", "innovation"]
    },
    {
      id: "gd-issue-misinformation",
      title: "Misinformation and election integrity",
      description: "Discuss approaches to reduce misinformation while protecting freedom of expression and avoiding over-censorship.",
      tier: 1,
      subThemes: ["platform policy", "media literacy", "legal safeguards", "de-escalation"]
    },
    {
      id: "gd-issue-data-embassies",
      title: "Data embassies and cross-border privacy",
      description: "Explore whether data embassies can improve privacy and governance without undermining sovereignty and usability.",
      tier: 3,
      subThemes: ["data sovereignty", "privacy vs access", "governance", "cross-border"]
    }
  ];

  const out: GDAgentsPromptsDataset = {
    datasetId: "gd_agents_prompts_stub",
    version: "0.1.0",
    issues,
    personas
  };

  const check = GDAgentsPromptsDatasetSchema.safeParse(out);
  if (!check.success) throw new Error(`GD agents dataset stub failed schema validation: ${JSON.stringify(check.error.flatten())}`);
  return out;
}
