import { ConferenceDecisionSchema, type AggregateInput, type AssessorId, type ConferenceDecision } from "./types.js";

const PER_ASSESSOR_MIN = 90;
const TOTAL_MIN = 270;

// Borderline rule per spec: total between 240 and 269 inclusive triggers virtual conference
function isBorderline(totalMarks: number): boolean {
  return totalMarks >= 240 && totalMarks <= 269;
}

function clampInt(n: number) {
  if (!Number.isFinite(n)) throw new Error(`Expected finite number, got ${n}`);
  return Math.trunc(n);
}

function buildVirtualConferencePrompts(params: {
  assessorMarks: Record<AssessorId, number>;
  totalMarks: number;
}) {
  const { assessorMarks, totalMarks } = params;

  // Deterministic prompts based on weakest assessor
  const entries = Object.entries(assessorMarks) as Array<[AssessorId, number]>;
  const sorted = entries.slice().sort((a, b) => a[1] - b[1]);
  const weakest = sorted[0][0];

  const baseQuestions: NonNullable<ConferenceDecision["virtualConference"]>["prompts"] = [
    {
      id: "vc-1",
      intent: "resolve_concerns",
      question: "Summarize your key strengths with one concrete example and explain how it addresses the board’s concern."
    },
    {
      id: "vc-2",
      intent: "bump_to_pass",
      question:
        "If you had to improve immediately, what is your 7-day action plan? Provide measurable steps and outcomes."
    },
    {
      id: "vc-3",
      intent: "clarify_strengths",
      question:
        "Explain how you balance discipline with adaptability under pressure, and describe a situation where you changed strategy mid-way."
    }
  ];

  if (weakest === "psychologist") {
    // More reflective / self-control
    const out: NonNullable<ConferenceDecision["virtualConference"]>["prompts"] = [
      baseQuestions[0],
      {
        id: "vc-psy-2",
        intent: "resolve_concerns",
        question:
          "The board feels your responses may not consistently reflect emotional control. Explain a time you faced stress and how you maintained composure."
      },
      baseQuestions[2]
    ];
    return out;
  }

  if (weakest === "gto") {
    // More procedural / decision making
    const out: NonNullable<ConferenceDecision["virtualConference"]>["prompts"] = [
      baseQuestions[0],
      {
        id: "vc-gto-2",
        intent: "bump_to_pass",
        question:
          "Describe how you prioritize tasks under constraints in a group setting. Give a step-by-step plan and how you handle disagreements."
      },
      baseQuestions[1]
    ];
    return out;
  }

  // io weakest (motivation/communication)
  const out: NonNullable<ConferenceDecision["virtualConference"]>["prompts"] = [
    baseQuestions[0],
    {
      id: "vc-io-2",
      intent: "clarify_strengths",
      question:
        "Explain your motivation in a clear, respectful manner: why this service, how it matches your temperament, and how you handle accountability."
    },
    baseQuestions[2]
  ];
  return out;
}

/**
 * Aggregates assessor marks into 900 total, applies passing threshold logic,
 * and triggers a deterministic Virtual Conference payload for borderline cases.
 */
export function aggregateConference(params: { input: AggregateInput }): ConferenceDecision {
  const { input } = params;

  const assessorMarks = {
    psychologist: clampInt(input.assessorScores[0].marks),
    gto: clampInt(input.assessorScores[1].marks),
    io: clampInt(input.assessorScores[2].marks)
  };

  for (const [id, marks] of Object.entries(assessorMarks) as Array<[AssessorId, number]>) {
    if (marks < 0 || marks > 300) throw new Error(`Assessor marks out of range: ${id}=${marks} expected 0..300`);
  }

  const totalMarks = assessorMarks.psychologist + assessorMarks.gto + assessorMarks.io;

  const perAssessorPass = {
    psychologist: assessorMarks.psychologist >= PER_ASSESSOR_MIN,
    gto: assessorMarks.gto >= PER_ASSESSOR_MIN,
    io: assessorMarks.io >= PER_ASSESSOR_MIN
  };

  const totalPass = totalMarks >= TOTAL_MIN;

  const recommendation: ConferenceDecision["recommendation"] = perAssessorPass.psychologist && perAssessorPass.gto && perAssessorPass.io && totalPass
    ? "SSB_RECOMMEND"
    : perAssessorPass.psychologist || perAssessorPass.gto || perAssessorPass.io
      ? totalMarks >= 240
        ? "MAYBE"
        : "NOT_RECOMMEND"
      : "NOT_RECOMMEND";

  const borderline = isBorderline(totalMarks);

  const virtualConference = borderline
    ? {
        prompts: buildVirtualConferencePrompts({
          assessorMarks,
          totalMarks
        }),
        // Simple deterministic bump simulation:
        // If candidate has any assessor >=90, estimate ability to gain up to +30% of the shortfall to 270.
        // Otherwise, simulate smaller bump +15% of shortfall.
        predictedBumpOutcome: (() => {
          const shortfall = TOTAL_MIN - totalMarks; // 1..(270-240)=30 possibly, else <=0
          const anyPerAssessorOk = Object.values(perAssessorPass).some(Boolean);
          const bumpFraction = anyPerAssessorOk ? 0.3 : 0.15;
          const estimatedAdjustedTotal = clampInt(
            Math.max(totalMarks, totalMarks + Math.ceil(Math.max(0, shortfall) * bumpFraction))
          );

          return {
            canReachPassing: estimatedAdjustedTotal >= TOTAL_MIN,
            targetTotal: TOTAL_MIN,
            estimatedAdjustedTotal
          };
        })()
      }
    : undefined;

  const out: ConferenceDecision = {
    recommendation,
    totalMarks,
    assessorMarks,
    passing: {
      perAssessorMin: PER_ASSESSOR_MIN,
      perAssessorPass,
      totalMin: TOTAL_MIN,
      totalPass
    },
    borderline,
    virtualConference
  };

  const check = ConferenceDecisionSchema.safeParse(out);
  if (!check.success) {
    throw new Error(`aggregateConference produced invalid JSON schema: ${JSON.stringify(check.error.flatten())}`);
  }

  return out;
}
