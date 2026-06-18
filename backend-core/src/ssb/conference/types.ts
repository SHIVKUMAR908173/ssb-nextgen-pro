import { z } from "zod";

export type AssessorId = "psychologist" | "gto" | "io";

export type AssessorScoreInput = {
  assessorId: AssessorId;
  /**
   * Assessor marks in their own 0..300 scale.
   */
  marks: number; // expected 0..300
};

export type ConferenceDecision = {
  recommendation: "SSB_RECOMMEND" | "MAYBE" | "NOT_RECOMMEND";
  totalMarks: number; // 0..900
  assessorMarks: Record<AssessorId, number>;
  passing: {
    perAssessorMin: number; // 90
    perAssessorPass: Record<AssessorId, boolean>;
    totalMin: number; // 270
    totalPass: boolean;
  };
  borderline: boolean;
  virtualConference?: {
    prompts: Array<{
      id: string;
      question: string;
      intent: "bump_to_pass" | "clarify_strengths" | "resolve_concerns";
    }>;
    /**
     * Simple deterministic follow-up result produced by platform logic:
     * whether the candidate managed to cross the 270 total.
     */
    predictedBumpOutcome: {
      canReachPassing: boolean;
      targetTotal: number; // 270
      estimatedAdjustedTotal: number; // 0..900
    };
  };
};

export const ConferenceDecisionSchema: z.ZodType<ConferenceDecision> = z.object({
  recommendation: z.union([z.literal("SSB_RECOMMEND"), z.literal("MAYBE"), z.literal("NOT_RECOMMEND")]),
  totalMarks: z.number().int().min(0).max(900),
  assessorMarks: z.object({
    psychologist: z.number().int().min(0).max(300),
    gto: z.number().int().min(0).max(300),
    io: z.number().int().min(0).max(300)
  }),
  passing: z.object({
    perAssessorMin: z.number().int().min(0),
    perAssessorPass: z.object({
      psychologist: z.boolean(),
      gto: z.boolean(),
      io: z.boolean()
    }),
    totalMin: z.number().int().min(0),
    totalPass: z.boolean()
  }),
  borderline: z.boolean(),
  virtualConference: z
    .object({
      prompts: z.array(
        z.object({
          id: z.string().min(1),
          question: z.string().min(1),
          intent: z.union([z.literal("bump_to_pass"), z.literal("clarify_strengths"), z.literal("resolve_concerns")])
        })
      ),
      predictedBumpOutcome: z.object({
        canReachPassing: z.boolean(),
        targetTotal: z.number().int().min(0).max(900),
        estimatedAdjustedTotal: z.number().int().min(0).max(900)
      })
    })
    .optional()
});

export const AggregateInputSchema = z.object({
  assessorScores: z.tuple([
    z.object({ assessorId: z.literal("psychologist"), marks: z.number().int().min(0).max(300) }),
    z.object({ assessorId: z.literal("gto"), marks: z.number().int().min(0).max(300) }),
    z.object({ assessorId: z.literal("io"), marks: z.number().int().min(0).max(300) })
  ])
});

export type AggregateInput = z.infer<typeof AggregateInputSchema>;
