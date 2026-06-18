import { z } from "zod";

export type OLQName =
  | "Effective Intelligence"
  | "Reasoning Ability"
  | "Organizing Ability"
  | "Power of Expression"
  | "Self-Confidence"
  | "Liveliness and Ability to Influence the Group"
  | "Courage and Determination";

export const OLQ_NAME_SCHEMA = z.union([
  z.literal("Effective Intelligence"),
  z.literal("Reasoning Ability"),
  z.literal("Organizing Ability"),
  z.literal("Power of Expression"),
  z.literal("Self-Confidence"),
  z.literal("Liveliness and Ability to Influence the Group"),
  z.literal("Courage and Determination")
]);

export type TierLevel = 1 | 2 | 3;

export type LecturetteSessionMetadata = {
  candidate_id: string;
  topic_selected: string;
  tier_level: TierLevel;
  total_duration_seconds: number;
};

export type AcousticBiomarkers = {
  words_per_minute: number;
  pitch_f0_mean_hz: number;
  jitter_percentage: number;
  shimmer_percentage: number;
  total_pause_duration_seconds: number;

  // Optional extras to support future models; kept optional to allow MVP deterministic scoring.
  f0_variance_hz2?: number;
  filler_word_density_per_min?: number;
};

export type LinguisticBiomarkers = {
  // 0..1
  lexical_diversity_ttr: number;
  // absolute counts (over entire transcript)
  filler_word_count: number;
  transition_word_count: number;
  mean_dependency_distance: number;
  flesch_kincaid_grade: number;
};

export type TimestampReference = {
  start_seconds: number;
  end_seconds: number;
  label: string;
};

export type OLQEvaluation = {
  olq_name: OLQName;
  score: 1 | 2 | 3 | 4 | 5;
  justification_evidence: string;
  timestamp_references?: TimestampReference[];
};

export type SSBLecturetteAssessmentResult = {
  session_metadata: LecturetteSessionMetadata;
  acoustic_biomarkers: AcousticBiomarkers;
  linguistic_biomarkers: LinguisticBiomarkers;
  olq_evaluation: OLQEvaluation[];
};

export const TimestampReferenceSchema = z.object({
  start_seconds: z.number().finite().nonnegative(),
  end_seconds: z.number().finite().nonnegative(),
  label: z.string().min(1)
});

export const LecturetteSessionMetadataSchema: z.ZodType<LecturetteSessionMetadata> = z.object({
  candidate_id: z.string().min(1),
  topic_selected: z.string().min(1),
  tier_level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  total_duration_seconds: z.number().finite().positive()
});

export const AcousticBiomarkersSchema: z.ZodType<AcousticBiomarkers> = z.object({
  words_per_minute: z.number().finite().positive(),
  pitch_f0_mean_hz: z.number().finite().positive(),
  jitter_percentage: z.number().finite().nonnegative(),
  shimmer_percentage: z.number().finite().nonnegative(),
  total_pause_duration_seconds: z.number().finite().nonnegative(),

  f0_variance_hz2: z.number().finite().nonnegative().optional(),
  filler_word_density_per_min: z.number().finite().nonnegative().optional()
});

export const LinguisticBiomarkersSchema: z.ZodType<LinguisticBiomarkers> = z.object({
  lexical_diversity_ttr: z.number().finite().min(0).max(1),
  filler_word_count: z.number().finite().int().min(0),
  transition_word_count: z.number().finite().int().min(0),
  mean_dependency_distance: z.number().finite().nonnegative(),
  flesch_kincaid_grade: z.number().finite().nonnegative()
});

export const OLQEvaluationSchema: z.ZodType<OLQEvaluation> = z.object({
  olq_name: OLQ_NAME_SCHEMA,
  score: z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
  justification_evidence: z.string().min(1),
  timestamp_references: z.array(TimestampReferenceSchema).optional()
});

export const SSBLecturetteAssessmentResultSchema: z.ZodType<SSBLecturetteAssessmentResult> = z.object({
  session_metadata: LecturetteSessionMetadataSchema,
  acoustic_biomarkers: AcousticBiomarkersSchema,
  linguistic_biomarkers: LinguisticBiomarkersSchema,
  olq_evaluation: z.array(OLQEvaluationSchema)
});
