import { z } from "zod";

export type Sex = "male" | "female";

export type RegionType = "plains" | "hilly";

export type HeightRule = {
  sex: Sex;
  /**
   * Base minimum height in cm.
   */
  minCm: number;
  /**
   * If candidate belongs to a qualifying hilly region, allow relaxation.
   */
  hillyRelaxationCm: number; // e.g., 5
  qualifyingRegions: RegionType[]; // e.g. ["hilly"]
};

export type MedicalRejectionRule = {
  id: string;
  /**
   * Human readable label to show on UI.
   */
  label: string;
  /**
   * If true, the candidate is automatically rejected.
   */
  check: (candidate: MedicalPreScreenInput) => boolean;
};

export type DentalPointsRule = {
  id: string;
  label: string;
  minHealthyPoints: number; // 14
};

export type VisionEntryType = "standard" | "tgc";

export type VisionEvaluationInput = {
  /**
   * Myopia in Dioptres.
   * For example: -2.50 means -2.50D.
   */
  myopiaDioptres: number;
  entryType: VisionEntryType;
};

export type ColorPerceptionCPLevel = "cp-ii" | "cp-iii";

export type ColorPerceptionRoleCategory = "flying_technical" | "administrative_other";

export type ColorPerceptionEvaluationInput = {
  /**
   * CP level as per the specific test (e.g., Ishihara variant classification).
   */
  cpLevel: ColorPerceptionCPLevel;

  /**
   * Role category determines whether CP-II is mandatory.
   */
  roleCategory: ColorPerceptionRoleCategory;
};

export type MedicalPreScreenInput = {
  sex: Sex;
  region: RegionType;

  age: number;
  weightKg: number;

  heightCm: number;

  /**
   * Skin diseases such as severe acne, warts, etc.
   * MVP: boolean. Real system would be detailed classification.
   */
  hasSkinDisease: boolean;

  /**
   * Candidate’s dental assessment points.
   */
  dentalHealthyPoints: number;

  /**
   * History of mental breakdowns / psychiatric admissions.
   */
  hasHistoryOfMentalBreakdown: boolean;

  /**
   * History of abdominal/hernia surgeries within past year.
   */
  hadAbdominalOrHerniaSurgeryWithinPastYear: boolean;

  /**
   * Mandatory tests: UI can guide candidates to fetch results.
   */
  mandatoryTests: {
    restingECGDone: boolean;
    abdominalUltrasoundDone: boolean;
    completeHaemogramDone: boolean;
  };

  /**
   * Vision constraints used by Armed Forces Medical Services.
   */
  vision: VisionEvaluationInput;

  /**
   * Colour perception constraints used by Armed Forces Medical Services.
   */
  colorPerception: ColorPerceptionEvaluationInput;
};

export type MedicalEvaluation = {
  verdict: "eligible" | "rejected" | "borderline";
  reasons: Array<{ id: string; label: string; detail: string }>;
  /**
   * Helpful for UI to show what to fix.
   */
  mandatoryTestsStatus: MedicalPreScreenInput["mandatoryTests"];
};

const HEIGHT_RULES: HeightRule[] = [
  {
    sex: "male",
    minCm: 157.5,
    hillyRelaxationCm: 5,
    qualifyingRegions: ["hilly"]
  },
  {
    sex: "female",
    minCm: 152,
    hillyRelaxationCm: 5,
    qualifyingRegions: ["hilly"]
  }
];

const MAX_RECOMMENDED_HEIGHT = 220; // guardrail for input sanity

/**
 * Vision cutoffs (MVP hardcoding based on user specification):
 * - Standard entries: myopia down to -2.5D acceptable
 * - TGC entries: myopia down to -3.5D acceptable
 *
 * Notes:
 * - Convention: myopiaDioptres is negative for myopia.
 * - "Up to -2.5" means more mild than or equal to -2.5 (e.g. -2.0 ok, -2.5 ok, -2.6 rejected).
 */
const STANDARD_MYOPIA_MIN = -2.5;
const TGC_MYOPIA_MIN = -3.5;

function isMyopiaAllowedByEntryType(params: {
  entryType: VisionEntryType;
  myopiaDioptres: number;
}): boolean {
  const { entryType, myopiaDioptres } = params;

  const allowedMin = entryType === "tgc" ? TGC_MYOPIA_MIN : STANDARD_MYOPIA_MIN;

  // "allowed up to X" => value must be >= allowedMin (since more negative is worse).
  return myopiaDioptres >= allowedMin;
}

const CP_II_REQUIRED_ROLES: ColorPerceptionRoleCategory[] = ["flying_technical"];

export function evaluateMedicalPreScreen(params: { candidate: MedicalPreScreenInput }): MedicalEvaluation {
  const { candidate } = params;

  const reasons: Array<{ id: string; label: string; detail: string }> = [];
  let rejected = false;

  const heightRule = HEIGHT_RULES.find((r) => r.sex === candidate.sex);
  if (!heightRule) {
    throw new Error(`Missing height rule for sex=${candidate.sex}`);
  }

  const qualifiesHilly = heightRule.qualifyingRegions.includes(candidate.region);
  const allowedMin = heightRule.minCm + (qualifiesHilly ? -heightRule.hillyRelaxationCm : 0); // relax means min lowers by 5
  if (candidate.heightCm < allowedMin) {
    rejected = true;
    reasons.push({
      id: "height",
      label: "Height eligibility",
      detail: `Minimum required: ${allowedMin} cm (${candidate.sex}, region=${candidate.region}). Candidate: ${candidate.heightCm} cm.`
    });
  }

  // Age-specific weight chart (anthropometric bounds rule)
  // Ideal weight approx: (heightCm - 100) * 0.9 (males), 0.85 (females), slightly scaling with age.
  const ageScale = 1 + ((candidate.age - 18) * 0.01); // +1% per year over 18
  const idealWeight = (candidate.heightCm - 100) * (candidate.sex === "male" ? 0.9 : 0.85) * ageScale;
  const minWeight = idealWeight * 0.85; // 15% tolerance
  const maxWeight = idealWeight * 1.15;

  if (candidate.weightKg < minWeight || candidate.weightKg > maxWeight) {
    rejected = true;
    reasons.push({
      id: "weight",
      label: "Age-specific weight standards",
      detail: `Candidate weight (${candidate.weightKg}kg) is outside the 15% acceptable range (${minWeight.toFixed(1)}kg - ${maxWeight.toFixed(1)}kg) for age ${candidate.age} and height ${candidate.heightCm}cm.`
    });
  }

  // Automatic rejection rules (MVP based on prompt)
  if (candidate.hasSkinDisease) {
    rejected = true;
    reasons.push({
      id: "skin_disease",
      label: "Skin disease (automatic rejection)",
      detail: "Severe skin diseases (e.g., acne/warts) are not permitted."
    });
  }

  const dentalRule: DentalPointsRule = {
    id: "dental_points",
    label: "Healthy dental points",
    minHealthyPoints: 14
  };

  if (candidate.dentalHealthyPoints < dentalRule.minHealthyPoints) {
    rejected = true;
    reasons.push({
      id: dentalRule.id,
      label: dentalRule.label + " (automatic rejection)",
      detail: `Minimum required: ${dentalRule.minHealthyPoints}. Candidate: ${candidate.dentalHealthyPoints}.`
    });
  }

  if (candidate.hasHistoryOfMentalBreakdown) {
    rejected = true;
    reasons.push({
      id: "mental_breakdown_history",
      label: "History of mental breakdowns (automatic rejection)",
      detail: "Past history of mental breakdowns/psychiatric issues is not permitted."
    });
  }

  if (candidate.hadAbdominalOrHerniaSurgeryWithinPastYear) {
    rejected = true;
    reasons.push({
      id: "hernia_surgery_past_year",
      label: "Abdominal/hernia surgery within 1 year (automatic rejection)",
      detail: "Surgery within the past year leads to disqualification under the MVP rules."
    });
  }

  // Vision: hardcoded myopia cutoff by entry type
  const { myopiaDioptres, entryType } = candidate.vision;
  if (!isMyopiaAllowedByEntryType({ entryType, myopiaDioptres })) {
    rejected = true;
    const allowedMin = entryType === "tgc" ? TGC_MYOPIA_MIN : STANDARD_MYOPIA_MIN;
    reasons.push({
      id: "myopia_cutoff",
      label: "Myopia eligibility",
      detail: `Myopia cutoff violated for entryType=${entryType}. Allowed minimum: ${allowedMin}D. Candidate: ${myopiaDioptres}D.`
    });
  }

  // Color perception: CP-II required for flying/technical roles.
  const { cpLevel, roleCategory } = candidate.colorPerception;
  const cpIiRequired = CP_II_REQUIRED_ROLES.includes(roleCategory);
  if (cpIiRequired && cpLevel !== "cp-ii") {
    rejected = true;
    reasons.push({
      id: "color_perception_cutoff",
      label: "Colour perception eligibility",
      detail: `CP-II required for roleCategory=${roleCategory}. Candidate: ${cpLevel}.`
    });
  }

  // Mandatory tests: not an automatic rejection in this MVP; instead mark borderline if missing.
  const mandatoryMissing: string[] = [];
  if (!candidate.mandatoryTests.restingECGDone) mandatoryMissing.push("resting ECG");
  if (!candidate.mandatoryTests.abdominalUltrasoundDone) mandatoryMissing.push("abdominal ultrasound");
  if (!candidate.mandatoryTests.completeHaemogramDone) mandatoryMissing.push("complete haemogram");

  const allMandatoryDone = mandatoryMissing.length === 0;

  const verdict: MedicalEvaluation["verdict"] = rejected ? "rejected" : allMandatoryDone ? "eligible" : "borderline";

  return {
    verdict,
    reasons,
    mandatoryTestsStatus: candidate.mandatoryTests
  };
}

export const MedicalPreScreenInputSchema: z.ZodType<MedicalPreScreenInput> = z.object({
  sex: z.union([z.literal("male"), z.literal("female")]),
  region: z.union([z.literal("plains"), z.literal("hilly")]),
  age: z.number().int().min(16).max(30),
  weightKg: z.number().finite().positive().max(200),
  heightCm: z.number().finite().positive().max(MAX_RECOMMENDED_HEIGHT),

  hasSkinDisease: z.boolean(),
  dentalHealthyPoints: z.number().finite().int().min(0),
  hasHistoryOfMentalBreakdown: z.boolean(),
  hadAbdominalOrHerniaSurgeryWithinPastYear: z.boolean(),

  mandatoryTests: z.object({
    restingECGDone: z.boolean(),
    abdominalUltrasoundDone: z.boolean(),
    completeHaemogramDone: z.boolean()
  }),

  vision: z.object({
    myopiaDioptres: z.number().finite().min(-20).max(20),
    entryType: z.union([z.literal("standard"), z.literal("tgc")])
  }),

  colorPerception: z.object({
    cpLevel: z.union([z.literal("cp-ii"), z.literal("cp-iii")]),
    roleCategory: z.union([z.literal("flying_technical"), z.literal("administrative_other")])
  })
});

// --- Optional convenience helpers (used by smoke tests / future wiring) ---

export function formatMyopiaCutoffDetail(entryType: VisionEntryType): { allowedMin: number } {
  return { allowedMin: entryType === "tgc" ? TGC_MYOPIA_MIN : STANDARD_MYOPIA_MIN };
}

export function isVisionCutoffValid(input: VisionEvaluationInput): boolean {
  return isMyopiaAllowedByEntryType({ entryType: input.entryType, myopiaDioptres: input.myopiaDioptres });
}
