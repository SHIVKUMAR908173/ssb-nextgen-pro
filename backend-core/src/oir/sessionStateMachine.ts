import { z } from "zod";
import { OIRQuestion, OIRQuestionBank, OIRQuestionSchema, OIRQuestionBankSchema } from "../lib/datasets/oir.js";

export type OIRCategory = "verbal" | "non_verbal";

export type OIRSessionConfig = {
  sessionId: string;

  /**
   * Global strict timer for the whole set.
   * Candidates must finish within this time.
   */
  totalTimeSeconds: number; // 900..1800 (15..30 mins) expected

  /**
   * We serve 40..50 questions per set.
   */
  questionCount: number; // 40..50 expected

  /**
   * If true, we try to balance verbal/non_verbal counts evenly.
   * If impossible due to bank sizes, we fall back to whatever is available.
   */
  balanceCategories: boolean;

  seed: number; // determinism for question selection
};

export type OIRSelectedQuestion = OIRQuestion;

export type OIRSessionState = {
  stage: "running" | "finished";
  sessionId: string;

  config: OIRSessionConfig;

  startedAtIso: string;
  /**
   * Strict end time; submissions after this should be locked.
   */
  endsAtIso: string;

  selectedQuestionIds: string[];
  /**
   * Captured candidate answers, in submission order mapping by question id.
   */
  answersByQuestionId: Record<string, number | undefined>; // selected option index
};

export type OIRSessionInitResult = {
  state: OIRSessionState;
  next: {
    questionIndex: number; // 0-based
    questionId: string;
    prompt: string;
    options: string[];
  };
  questions: OIRSelectedQuestion[];
};

export type OIRSessionSubmitResult = {
  state: OIRSessionState;
  evaluation: {
    totalScore: number; // 0..questionCount (no negative marking)
    correctCount: number;
    attemptedCount: number;
    /**
     * Per-category breakdown.
     */
    breakdown: Array<{
      category: OIRCategory;
      questionCount: number;
      correctCount: number;
      score: number;
    }>;
    /**
     * For UI/debug: provide correctness per question.
     */
    perQuestion: Array<{
      questionId: string;
      isCorrect: boolean;
      selectedIndex: number | null;
      correctIndex: number;
    }>;
  };
};

type Deps = {
  questionBank: OIRQuestionBank;
};

function nowIso() {
  return new Date().toISOString();
}

function addSecondsIso(startIso: string, seconds: number) {
  const start = Date.parse(startIso);
  return new Date(start + seconds * 1000).toISOString();
}

function assertFiniteInt(n: number) {
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) throw new Error(`Expected finite integer, got ${n}`);
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleDeterministic<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

function selectQuestions(params: {
  bank: OIRQuestionBank;
  config: OIRSessionConfig;
}): OIRSelectedQuestion[] {
  const { bank, config } = params;

  const all = bank.questions;

  if (all.length < config.questionCount) {
    throw new Error(`OIR bank has only ${all.length} questions but config.questionCount=${config.questionCount}`);
  }

  const verbal = all.filter((q) => q.category === "verbal");
  const nonVerbal = all.filter((q) => q.category === "non_verbal");

  if (!config.balanceCategories) {
    const shuffled = shuffleDeterministic(all, config.seed);
    return shuffled.slice(0, config.questionCount);
  }

  // Target roughly half/half with remainder to verbal.
  const verbalTarget = Math.ceil(config.questionCount / 2);
  const nonVerbalTarget = Math.floor(config.questionCount / 2);

  const verbalShuffled = shuffleDeterministic(verbal, config.seed + 11);
  const nonVerbalShuffled = shuffleDeterministic(nonVerbal, config.seed + 29);

  const chosenVerbal = verbalShuffled.slice(0, Math.min(verbalTarget, verbalShuffled.length));
  const chosenNonVerbal = nonVerbalShuffled.slice(0, Math.min(nonVerbalTarget, nonVerbalShuffled.length));

  const chosen: OIRSelectedQuestion[] = [...chosenVerbal, ...chosenNonVerbal];

  if (chosen.length >= config.questionCount) {
    // If one category lacked enough questions, we may have extra from other; cut deterministically.
    return chosen.slice(0, config.questionCount);
  }

  // Fill remaining slots from the combined pool excluding already chosen IDs.
  const chosenIds = new Set(chosen.map((q) => q.id));
  const remaining = all.filter((q) => !chosenIds.has(q.id));

  const remainingShuffled = shuffleDeterministic(remaining, config.seed + 101);
  const fill = remainingShuffled.slice(0, config.questionCount - chosen.length);

  return [...chosen, ...fill];
}

export function createInitialStateAndNext(params: {
  deps: Deps;
  config: OIRSessionConfig;
}): OIRSessionInitResult {
  const { deps, config } = params;

  assertFiniteInt(config.questionCount);
  assertFiniteInt(config.totalTimeSeconds);
  if (config.totalTimeSeconds < 900 || config.totalTimeSeconds > 1800) {
    throw new Error(`OIR totalTimeSeconds expected 900..1800, got ${config.totalTimeSeconds}`);
  }
  if (config.questionCount < 40 || config.questionCount > 50) {
    throw new Error(`OIR questionCount expected 40..50, got ${config.questionCount}`);
  }

  const bankParsed = OIRQuestionBankSchema.safeParse(deps.questionBank);
  if (!bankParsed.success) throw new Error(`Invalid OIR questionBank: ${JSON.stringify(bankParsed.error.flatten())}`);

  const selected = selectQuestions({ bank: bankParsed.data, config });
  const selectedIds = selected.map((q) => q.id);

  const startedAtIso = nowIso();
  const endsAtIso = addSecondsIso(startedAtIso, config.totalTimeSeconds);

  const state: OIRSessionState = {
    stage: "running",
    sessionId: config.sessionId,
    config,
    startedAtIso,
    endsAtIso,
    selectedQuestionIds: selectedIds,
    answersByQuestionId: Object.fromEntries(selectedIds.map((id) => [id, undefined]))
  };

  const first = selected[0];
  return {
    state,
    next: {
      questionIndex: 0,
      questionId: first.id,
      prompt: first.prompt,
      options: first.options
    },
    questions: selected
  };
}

function isExpired(state: OIRSessionState): boolean {
  const end = Date.parse(state.endsAtIso);
  const now = Date.now();
  return now > end;
}

export function submitAnswer(params: {
  deps: Deps;
  state: OIRSessionState;
  /**
   * Candidate answers for the whole set.
   * Must include selected option indices (0..options.length-1) or null/undefined for unattempted.
   */
  answersByQuestionId: Record<string, number | null | undefined>;
  submittedAtIso?: string; // for testing; default now
}): OIRSessionSubmitResult {
  const { deps, state, answersByQuestionId, submittedAtIso } = params;

  const bankParsed = OIRQuestionBankSchema.safeParse(deps.questionBank);
  if (!bankParsed.success) throw new Error(`Invalid OIR questionBank: ${JSON.stringify(bankParsed.error.flatten())}`);
  const bank = bankParsed.data;

  if (state.stage !== "running") {
    // Already finished: idempotent return.
    throw new Error(`OIR session not running (stage=${state.stage})`);
  }

  const submittedIso = submittedAtIso ?? nowIso();
  const expired = Date.parse(submittedIso) > Date.parse(state.endsAtIso);

  // If expired, lock scoring: treat as finished with 0 correct (but keep attempted counts).
  const questionById = new Map(bank.questions.map((q) => [q.id, q]));
  const selectedQuestions: OIRQuestion[] = state.selectedQuestionIds.map((id) => {
    const q = questionById.get(id);
    if (!q) throw new Error(`Missing selected question id=${id} in bank`);
    return q;
  });

  const updatedAnswers: Record<string, number | undefined> = {};
  for (const qid of state.selectedQuestionIds) {
    const raw = answersByQuestionId[qid];
    updatedAnswers[qid] = typeof raw === "number" ? raw : undefined;
  }

  const finishedState: OIRSessionState = {
    ...state,
    stage: "finished",
    answersByQuestionId: updatedAnswers
  };

  const perQuestion = selectedQuestions.map((q) => {
    const selectedIndex = updatedAnswers[q.id];
    const attempted = typeof selectedIndex === "number";
    const isCorrect = !expired && attempted && selectedIndex === q.correctAnswerIndex;
    return {
      questionId: q.id,
      isCorrect,
      selectedIndex: attempted ? (selectedIndex as number) : null,
      correctIndex: q.correctAnswerIndex
    };
  });

  const attemptedCount = perQuestion.filter((p) => p.selectedIndex !== null).length;
  const correctCount = perQuestion.filter((p) => p.isCorrect).length;
  const totalScore = expired ? 0 : correctCount; // no negative marking: score == correct answers

  const breakdownByCategory: Record<OIRCategory, { questionCount: number; correctCount: number; score: number }> = {
    verbal: { questionCount: 0, correctCount: 0, score: 0 },
    non_verbal: { questionCount: 0, correctCount: 0, score: 0 }
  };

  for (const q of selectedQuestions) {
    const p = perQuestion.find((x) => x.questionId === q.id);
    if (!p) throw new Error(`Internal error: missing perQuestion entry for ${q.id}`);
    const b = breakdownByCategory[q.category];
    b.questionCount += 1;
    if (p.isCorrect) {
      b.correctCount += 1;
      b.score += 1;
    }
  }

  return {
    state: finishedState,
    evaluation: {
      totalScore,
      correctCount: expired ? 0 : correctCount,
      attemptedCount,
      breakdown: [
        { category: "verbal", ...breakdownByCategory.verbal },
        { category: "non_verbal", ...breakdownByCategory.non_verbal }
      ],
      perQuestion
    }
  };
}
