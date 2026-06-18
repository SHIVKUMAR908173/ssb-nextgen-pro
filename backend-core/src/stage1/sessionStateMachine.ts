import { z } from "zod";
import type { CSSQuestionSet, CSSQuestion } from "../lib/datasets/css.js";
import type { OPAMQuestionSet, OPAMQuestion } from "../lib/datasets/opam.js";
import { buildCSSQuestionSetStub } from "../lib/datasets/css.js";
import { buildOPAMQuestionSetStub } from "../lib/datasets/opam.js";
import { createInitialCSSStateAndNext, submitCSSAnswer } from "../css/sessionStateMachine.js";
import type { CSSSessionConfig, CSSSessionState, CSSSessionInitResult, CSSSessionSubmitResult } from "../css/sessionStateMachine.js";
import { createInitialOPAMStateAndNext, submitOPAMAnswer } from "../opam/sessionStateMachine.js";
import type { OPAMSessionConfig, OPAMSessionState, OPAMSessionInitResult, OPAMSessionSubmitResult, OPAMEvaluation } from "../opam/sessionStateMachine.js";
import { opamDomainScoresToBigFive } from "../opam/opamBigFiveMapping.js";

// Import the concrete evaluation shapes from child modules.
type CSSEvaluation = import("../css/sessionStateMachine.js").CSSEvaluation;
type OPAMEvaluationType = import("../opam/sessionStateMachine.js").OPAMEvaluation;

export type Stage1SessionStage = "css" | "opam" | "finished";

export type Stage1SessionConfig = {
  sessionId: string;
  /**
   * Strict: CSS=70, OPAM=120, total=190.
   */
  maxCssQuestions: number; // must be 70
  maxOpamQuestions: number; // must be 120
  /**
   * Strict: total time limit for whole combined test (CSS+OPAM) = 90 minutes.
   */
  totalTimeSeconds: number; // must be 5400
  seed: number;
};

export type Stage1NextQuestion =
  | { kind: "css"; question: CSSQuestion; timeLimitSeconds: number }
  | { kind: "opam"; question: OPAMQuestion; timeLimitSeconds: number };

export type Stage1Evaluation = {
  css?: {
    domainScores: CSSEvaluation["domainScores"];
  };
  opam?: {
    domainScores: OPAMEvaluationType["domainScores"];
  };
  overallScore: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  correctnessSummary: {
    attemptedCount: number;
    totalQuestionCount: number;
  };
};

export type Stage1SessionState = {
  stage: Stage1SessionStage;
  sessionId: string;
  config: Stage1SessionConfig;

  cssState: CSSSessionState;
  opamState: OPAMSessionState;

  startedAtIso: string;
  endsAtIso: string;

  /**
   * Tracks global progression across CSS then OPAM.
   */
  currentIndex: number; // 0..189 (next question index in combined stream)
  answeredCount: number; // number of questions with non-null answer submitted
};

export type Stage1SessionInitResult = {
  state: Stage1SessionState;
  next: Stage1NextQuestion;
};

export type Stage1SessionSubmitResult = {
  state: Stage1SessionState;
  next?: Stage1NextQuestion;
  evaluation?: Stage1Evaluation;
};

export const Stage1SessionStateSchema = z.object({
  stage: z.union([z.literal("css"), z.literal("opam"), z.literal("finished")]),
  sessionId: z.string().min(1),
  config: z.object({
    sessionId: z.string().min(1),
    maxCssQuestions: z.literal(70),
    maxOpamQuestions: z.literal(120),
    totalTimeSeconds: z.literal(5400),
    seed: z.number().int()
  }),
  // Keep these as "raw child states" for MVP; tighten once we expose their schemas.
  cssState: z.any(),
  opamState: z.any(),
  startedAtIso: z.string(),
  endsAtIso: z.string(),
  currentIndex: z.number().int().min(0).max(189),
  answeredCount: z.number().int().min(0).max(190)
}) as z.ZodType<Stage1SessionState>;

function nowIso() {
  return new Date().toISOString();
}

function clamp1to10(n: number): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 {
  if (n <= 1) return 1;
  if (n >= 10) return 10;
  return Math.round(n) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

function addSecondsIso(startIso: string, seconds: number) {
  const start = Date.parse(startIso);
  return new Date(start + seconds * 1000).toISOString();
}

function isExpired(state: Stage1SessionState) {
  return Date.parse(state.endsAtIso) < Date.now();
}

function cssOffset() {
  return 0;
}

/**
 * Combined stream indices:
 * - 0..69 => CSS (70)
 * - 70..189 => OPAM (120)
 */
function combinedIndexToKindAndLocalIndex(index: number, config: Stage1SessionConfig): { kind: "css" | "opam"; localIndex: number } {
  if (index < config.maxCssQuestions) {
    return { kind: "css", localIndex: index - cssOffset() };
  }
  return { kind: "opam", localIndex: index - config.maxCssQuestions };
}

export function createInitialStage1StateAndNext(params: {
  deps: {
    cssQuestionSet: CSSQuestionSet;
    opamQuestionSet: OPAMQuestionSet;
  };
  config: Stage1SessionConfig;
}): Stage1SessionInitResult {
  const { deps, config } = params;

  if (config.maxCssQuestions !== 70) throw new Error("Stage1 maxCssQuestions must be 70");
  if (config.maxOpamQuestions !== 120) throw new Error("Stage1 maxOpamQuestions must be 120");
  if (config.totalTimeSeconds !== 5400) throw new Error("Stage1 totalTimeSeconds must be 5400 (90 minutes)");

  const startedAtIso = nowIso();
  const endsAtIso = addSecondsIso(startedAtIso, config.totalTimeSeconds);

  const cssInit: CSSSessionInitResult = createInitialCSSStateAndNext({
    deps: { questionSet: deps.cssQuestionSet },
    config: {
      sessionId: `${config.sessionId}-css`,
      timePressureMode: "high",
      maxQuestions: config.maxCssQuestions,
      seed: config.seed
    }
  });

  const opamInit: OPAMSessionInitResult = createInitialOPAMStateAndNext({
    deps: { questionSet: deps.opamQuestionSet },
    config: {
      sessionId: `${config.sessionId}-opam`,
      maxQuestions: config.maxOpamQuestions,
      seed: config.seed
    }
  });

  const state: Stage1SessionState = {
    stage: "css",
    sessionId: config.sessionId,
    config,
    cssState: cssInit.state,
    opamState: opamInit.state,
    startedAtIso,
    endsAtIso,
    currentIndex: 0,
    answeredCount: 0
  };

  // Next question always starts with CSS question 0 (local index 0)
  return {
    state,
    next: { kind: "css", question: cssInit.next.question, timeLimitSeconds: cssInit.next.timeLimitSeconds }
  };
}

export type Stage1SubmitAnswerInput = {
  /**
   * Stage1 stream questionId: must match the currently expected CSS or OPAM question id.
   */
  questionId: string;
  selectedOptionIndex: number | null;
  submittedAtIso?: string;
};

export function submitStage1Answer(params: {
  deps: { cssQuestionSet: CSSQuestionSet; opamQuestionSet: OPAMQuestionSet };
  input: { state: Stage1SessionState; answer: Stage1SubmitAnswerInput };
}): Stage1SessionSubmitResult {
  const { state, answer } = params.input;

  if (state.stage === "finished") return { state };

  const expired = isExpired(state);
  if (expired) {
    const evaluation = evaluateStage1({ state, deps: params.deps, expired: true });
    return { state: { ...state, stage: "finished" }, evaluation };
  }

  const { kind, localIndex } = combinedIndexToKindAndLocalIndex(state.currentIndex, state.config);

  if (kind === "css") {
    // Validate questionId matches CSS current expected question
    const cssNextQuestion = state.cssState.questionSet.questions.slice(0, state.cssState.config.maxQuestions)[state.cssState.currentIndex];
    if (!cssNextQuestion) throw new Error("Internal error: CSS next question missing");
    if (cssNextQuestion.id !== answer.questionId) {
      throw new Error(`Stage1 CSS order violation. Expected questionId=${cssNextQuestion.id} but got ${answer.questionId}`);
    }

    const out: CSSSessionSubmitResult = submitCSSAnswer({
      deps: { questionSet: params.deps.cssQuestionSet },
      input: {
        state: state.cssState,
        questionId: answer.questionId,
        selectedOptionIndex: answer.selectedOptionIndex,
        submittedAtIso: answer.submittedAtIso
      }
    });

    const nextCssState = out.state;
    const answeredThis = answer.selectedOptionIndex === null ? 0 : 1;

    const nextAnsweredCount = state.answeredCount + answeredThis;

    // If CSS finished -> move to OPAM
    const nextStage = nextCssState.stage === "finished" ? "opam" : "css";

    const nextIndex = state.currentIndex + 1;

    if (nextStage === "opam") {
      const opamQuestion = state.opamState.questionSet.questions.slice(0, state.opamState.config.maxQuestions)[0];
      if (!opamQuestion) throw new Error("Internal error: OPAM first question missing");

      const nextState: Stage1SessionState = {
        ...state,
        stage: "opam",
        cssState: nextCssState,
        currentIndex: nextIndex,
        answeredCount: nextAnsweredCount
      };

      return { state: nextState, next: { kind: "opam", question: opamQuestion, timeLimitSeconds: opamQuestion.timeLimitSeconds } };
    }

    const nextCssQuestion = nextCssState.questionSet.questions.slice(0, nextCssState.config.maxQuestions)[nextCssState.currentIndex];
    if (!nextCssQuestion) throw new Error("Internal error: CSS next question missing after submit");

    const nextState: Stage1SessionState = {
      ...state,
      stage: "css",
      cssState: nextCssState,
      currentIndex: nextIndex,
      answeredCount: nextAnsweredCount
    };

    return {
      state: nextState,
      next: { kind: "css", question: nextCssQuestion, timeLimitSeconds: nextCssQuestion.timeLimitSeconds }
    };
  }

  // kind === "opam"
  const opamQuestion = state.opamState.questionSet.questions.slice(0, state.opamState.config.maxQuestions)[state.opamState.currentIndex];
  if (!opamQuestion) throw new Error("Internal error: OPAM current question missing");

  if (opamQuestion.id !== answer.questionId) {
    throw new Error(`Stage1 OPAM order violation. Expected questionId=${opamQuestion.id} but got ${answer.questionId}`);
  }

  const out: OPAMSessionSubmitResult = submitOPAMAnswer({
    deps: { questionSet: params.deps.opamQuestionSet },
    input: {
      state: state.opamState,
      questionId: answer.questionId,
      selectedOptionIndex: answer.selectedOptionIndex,
      submittedAtIso: answer.submittedAtIso
    }
  });

  const nextOpamState = out.state;
  const answeredThis = answer.selectedOptionIndex === null ? 0 : 1;
  const nextAnsweredCount = state.answeredCount + answeredThis;
  const nextIndex = state.currentIndex + 1;

  if (nextOpamState.stage === "finished") {
    const evaluation = evaluateStage1({ state: { ...state, opamState: nextOpamState }, deps: params.deps, expired: false });
    const finishedState: Stage1SessionState = {
      ...state,
      stage: "finished",
      opamState: nextOpamState,
      currentIndex: nextIndex,
      answeredCount: nextAnsweredCount
    };
    return { state: finishedState, evaluation };
  }

  const nextOpamQuestion = nextOpamState.questionSet.questions.slice(0, nextOpamState.config.maxQuestions)[nextOpamState.currentIndex];
  if (!nextOpamQuestion) throw new Error("Internal error: OPAM next question missing after submit");

  const nextState: Stage1SessionState = {
    ...state,
    stage: "opam",
    opamState: nextOpamState,
    currentIndex: nextIndex,
    answeredCount: nextAnsweredCount
  };

  return { state: nextState, next: { kind: "opam", question: nextOpamQuestion, timeLimitSeconds: nextOpamQuestion.timeLimitSeconds } };
}

function evaluateStage1(params: {
  state: Stage1SessionState;
  deps: { cssQuestionSet: CSSQuestionSet; opamQuestionSet: OPAMQuestionSet };
  expired: boolean;
}): Stage1Evaluation {
  const { state, expired } = params;

  const cssEval = expired ? undefined : scoreFromCSSState(state.cssState, state.config.maxCssQuestions);
  const opamEval = expired ? undefined : scoreFromOPAMState(state.opamState, state.config.maxOpamQuestions);

  const overallScore: Stage1Evaluation["overallScore"] = expired
    ? 1
    : clamp1to10(0.5 * (cssEval?.overallScore ?? 1) + 0.5 * (opamEval?.overallScore ?? 1));

  const totalQuestionCount = state.config.maxCssQuestions + state.config.maxOpamQuestions;
  const attemptedCount =
    Object.values(state.cssState.answersByQuestionId).filter((v) => v !== null).length +
    Object.values(state.opamState.answersByQuestionId).filter((v) => v !== null).length;

  return {
    css: cssEval ? { domainScores: cssEval.domainScores } : undefined,
    opam: opamEval ? { domainScores: opamEval.domainScores } : undefined,
    overallScore,
    correctnessSummary: { attemptedCount, totalQuestionCount }
  };
}

const ALL_CSS_DOMAINS: CSSQuestion["domain"][] = [
  "map_memory",
  "working_memory",
  "selective_attention",
  "auditory_discrimination",
  "spatial_orientation",
  "problem_solving",
  "form_perception",
  "perceptual_speed",
  "reasoning"
];

function scoreFromCSSState(cssState: CSSSessionState, maxCssQuestions: number): CSSEvaluation {
  const { questionSet, answersByQuestionId } = cssState;

  const questions = questionSet.questions.slice(0, maxCssQuestions);

  const perDomainCorrect: Record<CSSQuestion["domain"], { correct: number; attempted: number; total: number }> =
    ALL_CSS_DOMAINS.reduce((acc, domain) => {
      acc[domain] = { correct: 0, attempted: 0, total: 0 };
      return acc;
    }, {} as Record<CSSQuestion["domain"], { correct: number; attempted: number; total: number }>);

  for (const q of questions) {
    const bucket = perDomainCorrect[q.domain];
    bucket.total += 1;

    const selected = answersByQuestionId[q.id] ?? null;
    if (selected === null) continue;

    bucket.attempted += 1;
    if (selected === q.correctOptionIndex) bucket.correct += 1;
  }

  const totalQuestionCount = questions.length;
  const attemptedCount = questions.filter((q) => (answersByQuestionId[q.id] ?? null) !== null).length;
  const correctCount = questions.filter((q) => {
    const selected = answersByQuestionId[q.id] ?? null;
    return selected !== null && selected === q.correctOptionIndex;
  }).length;

  const domainScores = ALL_CSS_DOMAINS.map((domain) => {
    const { correct, attempted, total } = perDomainCorrect[domain];
    const denom = total === 0 ? 1 : total;
    const raw = 1 + (correct / denom) * 9;
    return {
      domain,
      score: clamp1to10(raw) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    };
  });

  const overallRaw =
    0.35 * (correctCount / Math.max(1, totalQuestionCount)) * 10 +
    0.65 * (domainScores.reduce((acc, d) => acc + d.score, 0) / (domainScores.length * 10)) * 10;

  const overallScore = clamp1to10(overallRaw);

  return {
    domainScores,
    overallScore,
    correctnessSummary: { correctCount, attemptedCount, totalQuestionCount }
  };
}

function scoreFromOPAMState(opamState: OPAMSessionState, maxOpamQuestions: number): OPAMEvaluationType {
  const { questionSet, answersByQuestionId } = opamState;

  const questions = questionSet.questions.slice(0, maxOpamQuestions);

  const perDomainCorrect: Record<OPAMQuestion["domain"], { correct: number; attempted: number; total: number }> = {
    self_report_conduct: { correct: 0, attempted: 0, total: 0 },
    discipline: { correct: 0, attempted: 0, total: 0 },
    motivation: { correct: 0, attempted: 0, total: 0 },
    team_spirit: { correct: 0, attempted: 0, total: 0 }
  };

  for (const q of questions) {
    perDomainCorrect[q.domain].total += 1;
    const selected = answersByQuestionId[q.id] ?? null;
    if (selected === null) continue;
    perDomainCorrect[q.domain].attempted += 1;
    if (selected === q.correctOptionIndex) perDomainCorrect[q.domain].correct += 1;
  }

  const totalQuestionCount = questions.length;
  const attemptedCount = questions.filter((q) => (answersByQuestionId[q.id] ?? null) !== null).length;
  const correctCount = questions.filter((q) => {
    const selected = answersByQuestionId[q.id] ?? null;
    return selected !== null && selected === q.correctOptionIndex;
  }).length;

  const domainScores = (Object.keys(perDomainCorrect) as OPAMQuestion["domain"][]).map((domain) => {
    const { correct, attempted, total } = perDomainCorrect[domain];
    const denom = total === 0 ? 1 : total;
    const raw = 1 + (correct / denom) * 9;
    return { domain, score: clamp1to10(raw) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 };
  });

  const overallRaw =
    0.35 * (correctCount / Math.max(1, totalQuestionCount)) * 10 +
    0.65 * (domainScores.reduce((acc, d) => acc + d.score, 0) / (domainScores.length * 10)) * 10;

  const overallScore = clamp1to10(overallRaw);

  const { bigFiveScores } = opamDomainScoresToBigFive({
    domainScores: domainScores.map((d) => ({ domain: d.domain, score: d.score }))
  });

  return {
    domainScores,
    bigFiveScores,
    overallScore,
    correctnessSummary: { correctCount, attemptedCount, totalQuestionCount }
  };
}

export function buildDefaultStage1Deps() {
  return { cssQuestionSet: buildCSSQuestionSetStub(), opamQuestionSet: buildOPAMQuestionSetStub() };
}
