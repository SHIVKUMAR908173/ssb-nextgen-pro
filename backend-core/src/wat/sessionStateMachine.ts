import { createRandomWordOrder } from "./wordOrder.js";
import type {
  WATSessionConfig,
  WATSessionInitResult,
  WATSessionState,
  WATSessionSubmitResult
} from "./types.js";
import { evaluateWATMock } from "./watScoring.js";

export type WATWordProvider = {
  getWords(): { id: string; word: string }[];
};

export type WATStateMachineDeps = {
  wordProvider: WATWordProvider;
};

function nowIso() {
  return new Date().toISOString();
}

function appendFlash(state: WATSessionState, flash: Omit<WATSessionState["flashes"][number], "index">) {
  return {
    ...state,
    flashes: [
      ...state.flashes,
      {
        ...flash,
        index: state.currentIndex
      }
    ]
  };
}

export function createInitialStateAndNext(params: {
  deps: WATStateMachineDeps;
  config: WATSessionConfig;
}): WATSessionInitResult {
  const { deps, config } = params;

  const words = deps.wordProvider.getWords();

  if (words.length < config.wordCount) {
    throw new Error(`WAT wordProvider returned ${words.length} words, but config.wordCount=${config.wordCount}`);
  }

  const wordOrder = createRandomWordOrder({
    words,
    wordCount: config.wordCount,
    seed: config.seed
  });

  const nextIndex = 0;

  const startedAtIso = nowIso();
  const endedAtIso = new Date(Date.now() + config.flashDurationSeconds * 1000).toISOString();

  const firstWordId = wordOrder[nextIndex];

  const nextWord = words.find((w) => w.id === firstWordId);
  if (!nextWord) throw new Error(`Internal error: missing next word for id=${firstWordId}`);

  const state: WATSessionState = {
    stage: "running",
    sessionId: config.sessionId,
    config,
    currentIndex: nextIndex,
    wordOrder,
    flashes: []
  };

  return {
    state,
    next: {
      wordId: nextWord.id,
      word: nextWord.word,
      flashDurationSeconds: config.flashDurationSeconds,
      startedAtIso,
      endedAtIso
    }
  };
}

export function submitAnswer(params: {
  deps: WATStateMachineDeps;
  state: WATSessionState;
  responseText: string;
}): WATSessionSubmitResult {
  const { deps, state, responseText } = params;

  if (state.stage !== "running") {
    return { state };
  }

  const words = deps.wordProvider.getWords();

  const wordId = state.wordOrder[state.currentIndex];
  const word = words.find((w) => w.id === wordId);
  if (!word) throw new Error(`Internal error: missing word for id=${wordId}`);

  const flashDurationSeconds = state.config.flashDurationSeconds;
  const startedAtIso = state.flashes.length
    ? // approximate: last endedAt + (next flash duration) is not tracked; we keep consistent timing metadata
      nowIso()
    : nowIso();
  const endedAtIso = new Date(Date.now() + flashDurationSeconds * 1000).toISOString();

  const nextStateAfterFlash = appendFlash(state, {
    wordId: word.id,
    word: word.word,
    startedAtIso,
    endedAtIso,
    responseText
  });

  const nextIndex = nextStateAfterFlash.currentIndex + 1;

  if (nextIndex >= nextStateAfterFlash.wordOrder.length) {
    const finished: WATSessionState = {
      ...nextStateAfterFlash,
      stage: "finished",
      currentIndex: nextIndex
    };

    const evaluation = evaluateWATMock({ seed: state.config.seed, state: finished });

    return { state: finished, evaluation };
  }

  const startedAtIso2 = nowIso();
  const endedAtIso2 = new Date(Date.now() + state.config.flashDurationSeconds * 1000).toISOString();

  const nextWordId = nextStateAfterFlash.wordOrder[nextIndex];
  const nextWord = words.find((w) => w.id === nextWordId);
  if (!nextWord) throw new Error(`Internal error: missing next word for id=${nextWordId}`);

  const nextState: WATSessionState = {
    ...nextStateAfterFlash,
    currentIndex: nextIndex
  };

  return {
    state: nextState,
    next: {
      wordId: nextWord.id,
      word: nextWord.word,
      flashDurationSeconds: state.config.flashDurationSeconds,
      startedAtIso: startedAtIso2,
      endedAtIso: endedAtIso2
    }
  };
}
