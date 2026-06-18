import { z } from "zod";

export type WATWord = {
  id: string;
  word: string;
};

export type WATStimulus = {
  id: string;
  word: string;
  // How the prompt should look for this stimulus (frontend can render it)
  promptTemplate: string;
};

export type WATModelResponse = {
  // Stimulus word this model-response spec corresponds to
  word: string;
  type: "Positive" | "Neutral" | "Negative";
  ideal_response: string;
  // Target OLQs by olqId
  target_olq: string[];
  reasoning: string;
};

export function buildWATStimulusWordBank(): WATWord[] {
  // MVP: include a larger curated set so sessions can request 60+ flashes.
  // Replace/extend with your full assessment-grade corpus later.
  const words: string[] = [
    // Positive / action / competence
    "Admire",
    "Courage",
    "Knowledge",
    "Confidence",
    "Improve",
    "Success",
    "Achieve",
    "Honour",
    "Victory",
    "Optimist",

    "Discipline",
    "Integrity",
    "Leadership",
    "Responsibility",
    "Resilience",
    "Initiative",
    "Teamwork",
    "Service",
    "Commitment",
    "Perseverance",
    "Patience",
    "Preparation",
    "Focus",
    "Excellence",
    "Strength",
    "Growth",
    "Motivation",
    "Recovery",
    "Candidacy",
    "Consistency",
    "Ownership",
    "Accountability",
    "Tolerance",
    "Adaptability",
    "Clarity",
    "Strategy",
    "Plan",
    "Order",
    "Method",
    "System",
    "Craft",
    "Competence",
    "Craftsmanship",

    // Neutral / operational
    "System",
    "Plan",
    "Detail",
    "Regular",
    "Time",
    "Method",
    "Company",
    "Books",
    "Schedule",
    "Procedure",
    "Protocol",
    "Routine",
    "Training",
    "Briefing",
    "Report",
    "Meeting",
    "Agenda",
    "Checklist",
    "Measure",
    "Review",
    "Update",
    "Process",
    "Location",
    "Position",
    "Unit",
    "Command",
    "Mission",
    "Task",
    "Tool",
    "Material",
    "Environment",
    "Condition",
    "Status",
    "Equipment",

    // Negative / stress / risk
    "Fear",
    "Defeat",
    "Worry",
    "Danger",
    "Blame",
    "Insult",
    "Failure",
    "Ugly",
    "Trapped",
    "Guilty",

    "Anxiety",
    "Threat",
    "Loss",
    "Ruin",
    "Collapse",
    "Panic",
    "Chaos",
    "Hesitation",
    "Delay",
    "Mistake",
    "Error",
    "Misstep",
    "Regret",
    "Resentment",
    "Guilt",
    "Insincerity",
    "Betrayal",
    "Neglect",
    "Negativity",
    "Rivalry",
    "Isolation",
    "Disorder",
    "Impairment",
    "Frustration",
    "Burnout",
    "Stagnation",
    "Crack",
    "Rupture",
    "FailureMode"
  ];

  // Ensure stable IDs.
  return words.map((word, idx) => ({
    id: `wat-word-${String(idx + 1).padStart(4, "0")}`,
    word
  }));
}

// Existing code expects a dataset stub that includes prompt/response templates.
// We keep it for compatibility with server.ts.
export type WATItem = {
  id: string;
  word: string;
  promptTemplate: string;
  responseTemplate: string;
};

export function buildWATDatasetStub(): WATItem[] {
  const wordBank = buildWATStimulusWordBank();
  return wordBank.map((w) => ({
    id: w.id,
    word: w.word,
    promptTemplate: "Indicate the first 2–3 thoughts/associations that come to mind for: {word}",
    responseTemplate: "Thought 1: ...; Thought 2: ...; (Optional) Thought 3: ..."
  }));
}

// ------------------------------
// Model Response Specs + Validation
// ------------------------------
const WATModelResponseSchema = z
  .object({
    word: z.string().min(1),
    type: z.enum(["Positive", "Neutral", "Negative"]),
    ideal_response: z.string().min(1),
    target_olq: z.array(z.string().min(1)),
    reasoning: z.string().min(1)
  })
  .strict();

function normalizeWATModelResponse(input: WATModelResponse): WATModelResponse {
  return {
    ...input,
    word: input.word.trim(),
    ideal_response: input.ideal_response.trim(),
    reasoning: input.reasoning.trim(),
    target_olq: Array.from(new Set(input.target_olq.map((x) => x.trim()).filter(Boolean)))
  };
}

export function buildWATModelResponseSpecs(): WATModelResponse[] {
  // MVP set: you will likely replace with your full dataset.
  // target_olq uses olqId strings that match the rest of the system.
  return [
    {
      word: "Optimist",
      type: "Positive",
      ideal_response: "An optimist turns challenges into opportunities for disciplined action.",
      target_olq: ["OLQ-06", "OLQ-13", "OLQ-12"],
      reasoning: "Shows positive energy and a proactive mindset under pressure."
    },
    {
      word: "Failure",
      type: "Negative",
      ideal_response:
        "Failures teach essential lessons; we analyze causes and correct with resilience and accountability.",
      target_olq: ["OLQ-13", "OLQ-10", "OLQ-15"],
      reasoning: "Demonstrates resilience, discipline, and learning from setbacks."
    },
    {
      word: "Victory",
      type: "Positive",
      ideal_response: "Victory is earned through planning, discipline, and team coordination toward the mission.",
      target_olq: ["OLQ-14", "OLQ-08", "OLQ-10", "OLQ-05"],
      reasoning: "Highlights leadership, teamwork, discipline, and structured decision making."
    },
    {
      word: "Defeat",
      type: "Negative",
      ideal_response:
        "Soldiers prepare rigorously for battle to avoid defeat; when it occurs, they adapt quickly and recover.",
      target_olq: ["OLQ-13", "OLQ-12", "OLQ-06"],
      reasoning: "Frames defeat as a training signal and emphasizes adaptive recovery."
    },
    {
      word: "Loyalty",
      type: "Positive",
      ideal_response: "Loyalty to one's team and mission is the mark of a true officer, sustained through integrity and service.",
      target_olq: ["OLQ-11", "OLQ-08", "OLQ-15", "OLQ-09"],
      reasoning: "Highlights team-first mentality and integrity/patriot duty."
    }
  ];
}

/**
 * Validated/normalized model response specs that the scorer can safely consume.
 * If future real datasets contain malformed objects, this fails fast at startup/runtime of the scoring call.
 */
export function buildWATModelResponseSpecsValidated(): WATModelResponse[] {
  const raw = buildWATModelResponseSpecs();

  // Validate each record
  const parsed = raw.map((item) => {
    const res = WATModelResponseSchema.safeParse(item);
    if (!res.success) {
      const issues = res.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      throw new Error(`Invalid WATModelResponse spec: ${issues}`);
    }
    return res.data;
  });

  // Normalize
  const normalized = parsed.map(normalizeWATModelResponse);

  // Enforce unique words (case-insensitive). If duplicates exist, last wins after normalization.
  const byWord = new Map<string, WATModelResponse>();
  for (const spec of normalized) {
    byWord.set(spec.word.toLowerCase(), spec);
  }

  return Array.from(byWord.values());
}
