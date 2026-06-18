import { z } from "zod";

export type ExamKey = "nda" | "cds" | "afcat";
export type ResourceKind = "pyq" | "model_paper" | "notes" | "video" | "mock_test";

export type DefencePrepResource = {
  id: string;

  exam: ExamKey;
  kind: ResourceKind;

  title: string;
  description: string;

  url: string;

  /**
   * Optional categorization for user search/filtering.
   * Example: "Mathematics", "English", "General Knowledge", "AFCAT Reasoning"
   */
  tags?: string[];

  /**
   * If known, indicates which paper/section this resource targets.
   */
  subject?: string;

  /**
   * Track provenance at the item level (portal / repository / channel).
   */
  sourceName?: string;
};

export type DefencePrepResourcesDataset = {
  datasetId: "defence_prep_resources";
  version: "0.1.0";
  generatedAtIso: string;
  items: DefencePrepResource[];
};

const ExamKeySchema: z.ZodType<ExamKey> = z.union([z.literal("nda"), z.literal("cds"), z.literal("afcat")]);

const ResourceKindSchema: z.ZodType<ResourceKind> = z.union([
  z.literal("pyq"),
  z.literal("model_paper"),
  z.literal("notes"),
  z.literal("video"),
  z.literal("mock_test")
]);

const DefencePrepResourceSchema: z.ZodType<DefencePrepResource> = z.object({
  id: z.string().min(1),
  exam: ExamKeySchema,
  kind: ResourceKindSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  tags: z.array(z.string().min(1)).optional(),
  subject: z.string().optional(),
  sourceName: z.string().optional()
});

export const DefencePrepResourcesDatasetSchema: z.ZodType<DefencePrepResourcesDataset> = z.object({
  datasetId: z.literal("defence_prep_resources"),
  version: z.literal("0.1.0"),
  generatedAtIso: z.string().datetime(),
  items: z.array(DefencePrepResourceSchema).min(1)
});

function mkId(input: { exam: ExamKey; kind: ResourceKind; title: string }): string {
  // deterministic stable-ish ID
  const base = `${input.exam}-${input.kind}-${input.title}`.toLowerCase();
  const sanitized = base.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `dpr-${sanitized.slice(0, 80)}`;
}

/**
 * MVP curated free resources list.
 * Note: URLs are placeholders unless you confirm exact links you want shipped.
 */
export function buildDefencePrepResourcesDatasetStub(): DefencePrepResourcesDataset {
  const nowIso = new Date().toISOString();

  const items: DefencePrepResource[] = [
    {
      id: mkId({
        exam: "nda",
        kind: "pyq",
        title: "UPSC NDA previous years question papers (official portal)"
      }),
      exam: "nda",
      kind: "pyq",
      title: "UPSC NDA Previous Year Question Papers (Official Portal)",
      description: "Official NDA past question papers collection from UPSC.",
      url: "https://www.upsc.gov.in/exams/previous-year",
      tags: ["official", "upsc", "pyq"],
      subject: "NDA Exam Papers",
      sourceName: "UPSC"
    },
    {
      id: mkId({
        exam: "cds",
        kind: "pyq",
        title: "UPSC CDS previous years question papers (official portal)"
      }),
      exam: "cds",
      kind: "pyq",
      title: "UPSC CDS Previous Year Question Papers (Official Portal)",
      description: "Official CDS past question papers collection from UPSC.",
      url: "https://www.upsc.gov.in/exams/previous-year",
      tags: ["official", "upsc", "pyq"],
      subject: "CDS Exam Papers",
      sourceName: "UPSC"
    },
    {
      id: mkId({
        exam: "afcat",
        kind: "model_paper",
        title: "AFCAT model question papers (official portal)"
      }),
      exam: "afcat",
      kind: "model_paper",
      title: "AFCAT Model Question Papers (Official Portal)",
      description: "Official AFCAT model question papers from the CareerAirforce portal.",
      url: "https://careerairforce.nic.in/",
      tags: ["official", "afcat", "model-paper"],
      subject: "AFCAT Exam Papers",
      sourceName: "CareerAirforce"
    },
    {
      id: mkId({
        exam: "nda",
        kind: "notes",
        title: "Mathematics chapter-wise PDF notes (open educational notes)"
      }),
      exam: "nda",
      kind: "notes",
      title: "Mathematics Chapter-wise Notes (PDF - stub entry)",
      description: "Add exact chapter-wise PDF link(s) from a trusted open source / educational site.",
      url: "https://example.com/notes/nda-maths-chapterwise",
      tags: ["mathematics", "chapter-wise", "pdf"],
      subject: "Mathematics",
      sourceName: "TBD"
    },
    {
      id: mkId({
        exam: "cds",
        kind: "video",
        title: "NDA/CDS English grammar & PYP analysis playlist (YouTube)"
      }),
      exam: "cds",
      kind: "video",
      title: "YouTube Playlist: English Grammar + Practice (CDS/NDA)",
      description: "Add the exact YouTube playlist/channel URLs you want included.",
      url: "https://www.youtube.com/",
      tags: ["english", "grammar", "practice", "youtube"],
      subject: "English",
      sourceName: "TBD"
    },
    {
      id: mkId({
        exam: "afcat",
        kind: "mock_test",
        title: "Free AFCAT online test series (stub entry)"
      }),
      exam: "afcat",
      kind: "mock_test",
      title: "Free AFCAT Online Mock Tests (stub entry)",
      description: "Add the exact link(s) to the free all-India AFCAT test series you want shipped.",
      url: "https://example.com/mock/afcat-free-series",
      tags: ["afcat", "mock", "online"],
      subject: "AFCAT",
      sourceName: "TBD"
    }
  ];

  const out: DefencePrepResourcesDataset = {
    datasetId: "defence_prep_resources",
    version: "0.1.0",
    generatedAtIso: nowIso,
    items
  };

  const check = DefencePrepResourcesDatasetSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`buildDefencePrepResourcesDatasetStub schema validation failed: ${JSON.stringify(check.error.flatten())}`);
  }

  return out;
}
