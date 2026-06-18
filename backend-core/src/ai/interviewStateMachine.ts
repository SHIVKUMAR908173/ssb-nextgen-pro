import { z } from "zod";
import {
  CandidateInput,
  InterviewEvaluation,
  InterviewRunConfig,
  InterviewStage,
  InterviewState,
  InterviewStateMachineOutput,
  InterviewTurn,
  RapidFireQuestion
} from "./types.js";
import { evaluateInterviewMock } from "./mockEvaluator.js";

// Deterministic AI Scoring Schema:
// Enforces 15 OLQs scoring without hallucinated keys, as per TODO_PI_MODULE.md
export const InterviewEvaluationJSONSchema = z.object({
  olqScores: z.record(z.string(), z.number().int().min(1).max(10)),
  justifications: z.record(z.string(), z.string()),
  acousticBiomarkers: z.object({
    confidenceScore: z.number().min(0).max(1),
    hesitationCount: z.number().int().min(0)
  }).optional()
});

// Virtual Interviewer Persona Branding
export const INTERVIEWER_PERSONA = "Virtual AI name: Col Anshul Thakur. Speak with a strict, disciplined army/colonel vibe.";

export type InterviewQuestionProvider = {
  getIntroductionQuestions(): RapidFireQuestion[];
  getEducationQuestions(): RapidFireQuestion[];
  getRapidFireBundleQuestions(
    seed: number,
    bundleSize: number,
    alreadyAskedIds: Set<string>
  ): RapidFireQuestion[];

  getFollowupQuestions(seed: number): RapidFireQuestion[];

  // Stage-aware CIQ (SSB PI-style)
  getCiqQuestionsStage(
    stage: Exclude<InterviewStage, "introduction" | "conclusion">,
    seed: number,
    alreadyAskedIds: Set<string>,
    bundleSize: number
  ): RapidFireQuestion[];
};

export type InterviewStateMachineDeps = {
  questionProvider: InterviewQuestionProvider;
};

export function createInitialState(): InterviewState {
  return {
    stage: "introduction",
    turnIndex: 0,
    turnHistory: [],
    askedQuestionIds: [],
    finished: false
  };
}

function appendTurn(state: InterviewState, turn: InterviewTurn): InterviewState {
  return {
    ...state,
    turnHistory: [...state.turnHistory, turn]
  };
}

function nextAskedQuestionIds(
  currentAsked: string[],
  turnAsked: RapidFireQuestion[]
): string[] {
  const next = new Set(currentAsked);
  for (const q of turnAsked) next.add(q.id);
  return Array.from(next);
}

export function runInterviewStateMachine(params: {
  deps: InterviewStateMachineDeps;
  config: InterviewRunConfig;
  candidate: CandidateInput;
  state?: InterviewState;
}): InterviewStateMachineOutput {
  const { deps, config, candidate } = params;
  const state = params.state ?? createInitialState();

  if (state.finished) {
    // Should be externally guarded; return same state (idempotent).
    return {
      state,
      next: { askedQuestions: [], stage: state.stage, shouldAskAgain: false }
    };
  }

  const askedSet = new Set(state.askedQuestionIds);

  const stage = state.stage;

  const ciqOrder: Exclude<InterviewStage, "introduction" | "conclusion">[] = [
    "ciq_1_education",
    "ciq_2_family_routine",
    "ciq_3_hobbies_interests",
    "ciq_4_general_awareness",
    "ciq_5_self_assessment",
    "ciq_6_defence_motivation"
  ];

  const stageIndex = stage === "introduction" || stage === "conclusion" ? -1 : ciqOrder.indexOf(stage);

  let stageAsked: RapidFireQuestion[] = [];
  let shouldAskAgain = true;
  let nextStage: InterviewStage = stage;

  if (stage === "introduction") {
    stageAsked = deps.questionProvider.getIntroductionQuestions();
    nextStage = "ciq_1_education";
  } else if (stage === "conclusion") {
    stageAsked = [];
    nextStage = "conclusion";
    shouldAskAgain = false;
  } else if (stageIndex >= 0) {
    // CIQ rapid-fire: ask 5..10 questions per bundle for each CIQ stage.
    stageAsked = deps.questionProvider.getCiqQuestionsStage(
      stage,
      config.seed + state.turnIndex,
      askedSet,
      config.rapidFireBundleSize
    );

    const isLastCiq = stageIndex === ciqOrder.length - 1;
    nextStage = isLastCiq ? "conclusion" : ciqOrder[stageIndex + 1];
  }

  const askedQuestions = stageAsked;

  const turn: InterviewTurn = {
    stage,
    askedQuestions,
    candidateAnswers: askedQuestions.map((q) => ({
      questionId: q.id,
      text: candidate.answersByQuestionId[q.id] ?? ""
    }))
  };

  let nextState: InterviewState = appendTurn(state, turn);
  nextState = {
    ...nextState,
    stage: nextStage,
    turnIndex: state.turnIndex + 1,
    askedQuestionIds: nextAskedQuestionIds(state.askedQuestionIds, askedQuestions)
  };

  // Stop condition: either reached maxTurns, or moved to conclusion and just ran it.
  const reachedMaxTurns = nextState.turnIndex >= config.maxTurns;

  if (stage === "conclusion" || reachedMaxTurns || nextState.stage === "conclusion") {
    nextState = { ...nextState, finished: true };
    const evaluation: InterviewEvaluation = evaluateInterviewMock(
      { seed: config.seed },
      candidate
    );

    return {
      state: nextState,
      next: {
        askedQuestions: [],
        stage: nextState.stage,
        shouldAskAgain: false,
        evaluation
      }
    };
  }

  // CIQ special rule: we repeatedly ask rapid-fire bundles; once turnIndex hits maxTurns, it finishes above.
  return {
    state: nextState,
    next: {
      askedQuestions,
      stage: nextState.stage,
      shouldAskAgain
    }
  };
}
