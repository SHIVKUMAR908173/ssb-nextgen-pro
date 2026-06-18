export type InterviewStage =
  | "introduction"
  | "ciq_1_education"
  | "ciq_2_family_routine"
  | "ciq_3_hobbies_interests"
  | "ciq_4_general_awareness"
  | "ciq_5_self_assessment"
  | "ciq_6_defence_motivation"
  | "conclusion";

export type RapidFireQuestion = {
  id: string;
  question: string;
};

export type InterviewTurn = {
  stage: InterviewStage;
  askedQuestions: RapidFireQuestion[];
  candidateAnswers: Array<{
    questionId: string;
    text: string;
  }>;
};

export type OLQScore = {
  olqId: string;
  olqName: string;
  score: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  justification: string;
};

export type InterviewEvaluation = {
  recommendation: "SSB_RECOMMEND" | "MAYBE" | "NOT_RECOMMEND";
  factorAggregation: {
    planningOrganizing: number; // 1-10
    socialAdjustment: number; // 1-10
    socialEffectiveness: number; // 1-10
    dynamicQualities: number; // 1-10
  };
  olqScores: OLQScore[]; // exactly 15
  overallJustification: string;
};

export type InterviewRunConfig = {
  sessionId: string;
  rapidFireBundleSize: number; // e.g. 4..6
  maxTurns: number; // guardrail
  seed: number; // determinism
};

export type InterviewState = {
  stage: InterviewStage;
  turnIndex: number;
  turnHistory: InterviewTurn[];
  askedQuestionIds: string[];
  finished: boolean;
};

export type CandidateInput = {
  // Map question -> answer; in real life we’d stream, but this is deterministic.
  answersByQuestionId: Record<string, string>;
};

export type InterviewStateMachineOutput = {
  state: InterviewState;
  next: {
    askedQuestions: RapidFireQuestion[];
    stage: InterviewStage;
    shouldAskAgain: boolean;
    evaluation?: InterviewEvaluation; // only when finished
  };
};
