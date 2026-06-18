import { z } from "zod";
import type { CSSQuestionSet, CSSQuestion } from "../lib/datasets/css.js";
import { buildCSSQuestionSetStub } from "../lib/datasets/css.js";

export type CSSSessionStage = "running" | "finished";

export type CSSSessionConfig = {
  sessionId: string;
  timePressureMode: "high"; // MVP fixed
  // Guardrail for determinism + client UX
  maxQuestions: number; // should be <= 70
  seed: number;
};

export type CSSSessionState = {
  stage: CSSSessionStage;
  sessionId: string;
  config: CSSSessionConfig;
  // Battery
  questionSet: CSSQuestionSet;

  // Candidate interactions
  currentIndex: number; // 0-based index into question array (next question)
  answersByQuestionId: Record<string, number | null>; // optionIndex or null if skipped (forward-only)
  startedAtIso: string;
  finishedAtIso?: string;
};

export type CSSSessionInitResult = {
  state: CSSSessionState;
  next: {
    question: CSSQuestion;
    timeLimitSeconds: number;
  };
};

export type CSSSessionSubmitResult = {
  state: CSSSessionState;
  next?: {
    question: CSSQuestion;
    timeLimitSeconds: number;
  };
  evaluation?: CSSEvaluation;
};

export type CSSEvaluation = {
  // 1..10 deterministic scores per domain
  domainScores: Array<{
    domain: CSSQuestion["domain"];
    score: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  }>;
  overallScore: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  correctnessSummary: {
    correctCount: number;
    attemptedCount: number;
    totalQuestionCount: number;
  };
};

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

export const CSSSessionStateSchema: z.ZodType<CSSSessionState> = z.object({
  stage: z.union([z.literal("running"), z.literal("finished")]),
  sessionId: z.string().min(1),
  config: z.object({
    sessionId: z.string().min(1),
    timePressureMode: z.literal("high"),
    maxQuestions: z.number().int().min(1).max(70),
    seed: z.number().int()
  }),
  questionSet: z.object({
    datasetId: z.literal("css_question_set"),
    version: z.literal("0.1.0"),
    batterySize: z.literal(70),
    questions: z
      .array(
        z.object({
          id: z.string().min(1),
          index: z.number().int().min(1).max(70),
          domain: z.union([
            z.literal("map_memory"),
            z.literal("working_memory"),
            z.literal("selective_attention"),
            z.literal("auditory_discrimination"),
            z.literal("spatial_orientation"),
            z.literal("problem_solving"),
            z.literal("form_perception"),
            z.literal("perceptual_speed"),
            z.literal("reasoning")
          ]),
          prompt: z.string(),
          options: z.array(z.string()).min(2).max(6),
          correctOptionIndex: z.number().int().min(0),
          timeLimitSeconds: z.number().finite().positive()
        })
      )
      .length(70)
  }),
  currentIndex: z.number().int().min(0).max(70),
  answersByQuestionId: z.record(z.string().min(1), z.union([z.number().int().nullable(), z.null()])),
  startedAtIso: z.string(),
  finishedAtIso: z.string().optional()
});

function nowIso() {
  return new Date().toISOString();
}

function clamp1to10(n: number): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 {
  if (n <= 1) return 1;
  if (n >= 10) return 10;
  return Math.round(n) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export function createInitialCSSStateAndNext(params: {
  deps: {
    questionSet: CSSQuestionSet;
  };
  config: CSSSessionConfig;
}): CSSSessionInitResult {
  const { deps, config } = params;

  const adjustedMax = Math.min(config.maxQuestions, deps.questionSet.batterySize);
  const questionSet = deps.questionSet;

  const questions = questionSet.questions.slice(0, adjustedMax);

  const state: CSSSessionState = {
    stage: "running",
    sessionId: config.sessionId,
    config: { ...config, maxQuestions: adjustedMax },
    questionSet,
    currentIndex: 0,
    answersByQuestionId: {},
    startedAtIso: nowIso()
  };

  const first = questions[0];
  return {
    state,
    next: { question: first, timeLimitSeconds: first.timeLimitSeconds }
  };
}

export type SubmitCSSAnswerInput = {
  state: CSSSessionState;
  questionId: string;
  selectedOptionIndex: number | null; // null => skipped
  submittedAtIso?: string; // reserved
};

export function submitCSSAnswer(params: { deps: { questionSet: CSSQuestionSet }; input: SubmitCSSAnswerInput }): CSSSessionSubmitResult {
  const { input } = params;
  const { state } = input;

  if (state.stage === "finished") {
    return { state };
  }

  const questions = state.questionSet.questions.slice(0, state.config.maxQuestions);
  const qIndex = questions.findIndex((q) => q.id === input.questionId);
  if (qIndex === -1) throw new Error(`Unknown questionId for this session: ${input.questionId}`);

  // Enforce strict progression: submitted question must match currentIndex (prevents reordering exploits)
  if (qIndex !== state.currentIndex) {
    throw new Error(
      `Invalid submission order. Expected question at currentIndex=${state.currentIndex} but got index=${qIndex} (questionId=${input.questionId}).`
    );
  }

  // Forward-only lock: once a questionId is submitted for this session, disallow any revisit/correction.
  // Skip is treated as a submission as well (selectedOptionIndex === null still locks).
  if (Object.prototype.hasOwnProperty.call(state.answersByQuestionId, input.questionId)) {
    throw new Error(`Forward-only violation: questionId=${input.questionId} was already submitted for this session.`);
  }

  const nextAnswers = { ...state.answersByQuestionId };
  nextAnswers[input.questionId] = input.selectedOptionIndex;

  const nextIndex = state.currentIndex + 1;

  const nextStateBase: CSSSessionState = {
    ...state,
    answersByQuestionId: nextAnswers,
    currentIndex: nextIndex
  };

  if (nextIndex >= state.config.maxQuestions) {
    const evaluation = scoreCSSEvaluation({
      questionSet: state.questionSet,
      maxQuestions: state.config.maxQuestions,
      answersByQuestionId: nextAnswers
    });
    const finishedState: CSSSessionState = {
      ...nextStateBase,
      stage: "finished",
      finishedAtIso: nowIso()
    };
    return { state: finishedState, evaluation };
  }

  const nextQuestion = questions[nextIndex];
  return {
    state: nextStateBase,
    next: { question: nextQuestion, timeLimitSeconds: nextQuestion.timeLimitSeconds }
  };
}

function scoreCSSEvaluation(params: {
  questionSet: CSSQuestionSet;
  maxQuestions: number;
  answersByQuestionId: Record<string, number | null>;
}): CSSEvaluation {
  const { questionSet, maxQuestions, answersByQuestionId } = params;

  const questions = questionSet.questions.slice(0, maxQuestions);

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
    const raw = 1 + (correct / denom) * 9; // 1..10
    return {
      domain,
      score: clamp1to10(raw)
    };
  });

  const overallRaw =
    0.35 * (correctCount / Math.max(1, totalQuestionCount)) * 10 +
    0.65 * (domainScores.reduce((acc, d) => acc + d.score, 0) / (domainScores.length * 10)) * 10;

  return {
    domainScores,
    overallScore: clamp1to10(overallRaw),
    correctnessSummary: { correctCount, attemptedCount, totalQuestionCount }
  };
}

// Convenience for server route deps
export function buildDefaultCSSDeps() {
  return { questionSet: buildCSSQuestionSetStub() };
}
