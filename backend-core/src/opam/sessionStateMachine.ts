import { z } from "zod";
import type { OPAMQuestionSet, OPAMQuestion } from "../lib/datasets/opam.js";
import { buildOPAMQuestionSetStub } from "../lib/datasets/opam.js";
import type { BigFiveTraitScores } from "./opamBigFiveMapping.js";
import { opamDomainScoresToBigFive } from "./opamBigFiveMapping.js";

export type OPAMSessionStage = "running" | "finished";

export type OPAMSessionConfig = {
  sessionId: string;
  // Guardrail for determinism + client UX
  maxQuestions: number; // should be <= 120
  seed: number;
};

export type OPAMSessionState = {
  stage: OPAMSessionStage;
  sessionId: string;
  config: OPAMSessionConfig;

  questionSet: OPAMQuestionSet;

  currentIndex: number; // 0-based index into question array (next question)
  answersByQuestionId: Record<string, number | null>; // optionIndex or null if skipped

  startedAtIso: string;
  finishedAtIso?: string;
};

export type OPAMSessionInitResult = {
  state: OPAMSessionState;
  next: {
    question: OPAMQuestion;
    timeLimitSeconds: number;
  };
};

export type OPAMSessionSubmitResult = {
  state: OPAMSessionState;
  next?: {
    question: OPAMQuestion;
    timeLimitSeconds: number;
  };
  evaluation?: OPAMEvaluation;
};

export type OPAMEvaluation = {
  /**
   * 1..10 deterministic scores per OPAM domain.
   */
  domainScores: Array<{
    domain: OPAMQuestion["domain"];
    score: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  }>;

  /**
   * Big Five traits (OCEAN), derived from OPAM domain scores using a heuristic mapping.
   */
  bigFiveScores: BigFiveTraitScores;

  overallScore: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  correctnessSummary: {
    correctCount: number;
    attemptedCount: number;
    totalQuestionCount: number;
  };
};

export const OPAMSessionStateSchema: z.ZodType<OPAMSessionState> = z.object({
  stage: z.union([z.literal("running"), z.literal("finished")]),
  sessionId: z.string().min(1),
  config: z.object({
    sessionId: z.string().min(1),
    maxQuestions: z.number().int().min(1).max(120),
    seed: z.number().int()
  }),
  questionSet: z.object({
    datasetId: z.literal("opam_question_set"),
    version: z.literal("0.1.0"),
    batterySize: z.literal(120),
    questions: z
      .array(
        z.object({
          id: z.string().min(1),
          index: z.number().int().min(1).max(120),
          domain: z.union([
            z.literal("self_report_conduct"),
            z.literal("discipline"),
            z.literal("motivation"),
            z.literal("team_spirit")
          ]),
          prompt: z.string(),
          options: z.array(z.string()).min(2).max(6),
          correctOptionIndex: z.number().int().min(0),
          timeLimitSeconds: z.number().finite().positive()
        })
      )
      .length(120)
  }),
  currentIndex: z.number().int().min(0).max(120),
  answersByQuestionId: z.record(z.string().min(1), z.union([z.number().int().min(0).nullable(), z.null()])),
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

export function createInitialOPAMStateAndNext(params: {
  deps: {
    questionSet: OPAMQuestionSet;
  };
  config: OPAMSessionConfig;
}): OPAMSessionInitResult {
  const { deps, config } = params;

  const adjustedMax = Math.min(config.maxQuestions, deps.questionSet.batterySize);
  const questionSet = deps.questionSet;
  const questions = questionSet.questions.slice(0, adjustedMax);

  const state: OPAMSessionState = {
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

export type SubmitOPAMAnswerInput = {
  state: OPAMSessionState;
  questionId: string;
  selectedOptionIndex: number | null; // null => skipped
  submittedAtIso?: string; // reserved
};

export function submitOPAMAnswer(params: {
  deps: { questionSet: OPAMQuestionSet };
  input: SubmitOPAMAnswerInput;
}): OPAMSessionSubmitResult {
  const { input } = params;
  const { state } = input;

  if (state.stage === "finished") {
    return { state };
  }

  const questions = state.questionSet.questions.slice(0, state.config.maxQuestions);
  const qIndex = questions.findIndex((q) => q.id === input.questionId);
  if (qIndex === -1) throw new Error(`Unknown questionId for this session: ${input.questionId}`);

  // Enforce strict progression: submitted question must match currentIndex
  if (qIndex !== state.currentIndex) {
    throw new Error(
      `Invalid submission order. Expected question at currentIndex=${state.currentIndex} but got index=${qIndex} (questionId=${input.questionId}).`
    );
  }

  const nextAnswers = { ...state.answersByQuestionId };
  nextAnswers[input.questionId] = input.selectedOptionIndex;

  const nextIndex = state.currentIndex + 1;

  const nextStateBase: OPAMSessionState = {
    ...state,
    answersByQuestionId: nextAnswers,
    currentIndex: nextIndex
  };

  if (nextIndex >= state.config.maxQuestions) {
    const evaluation = scoreOPAMEvaluation({
      questionSet: state.questionSet,
      maxQuestions: state.config.maxQuestions,
      answersByQuestionId: nextAnswers
    });

    const finishedState: OPAMSessionState = {
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

function scoreOPAMEvaluation(params: {
  questionSet: OPAMQuestionSet;
  maxQuestions: number;
  answersByQuestionId: Record<string, number | null>;
}): OPAMEvaluation {
  const { questionSet, maxQuestions, answersByQuestionId } = params;

  const questions = questionSet.questions.slice(0, maxQuestions);

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
    const raw = 1 + (correct / denom) * 9; // 1..10
    return {
      domain,
      score: clamp1to10(raw)
    };
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

export function buildDefaultOPAMDeps() {
  return { questionSet: buildOPAMQuestionSetStub() };
}
