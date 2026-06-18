import type { InterviewEvaluation } from "../ai/types.js";

export type WATWord = {
  id: string;
  word: string;
};

export type WATFlash = {
  wordId: string;
  word: string;
  // monotonic index of the flash in the session (0..wordCount-1)
  index: number;
  startedAtIso: string;
  endedAtIso: string;
  // Candidate response captured during/after the flash
  responseText: string;
};

export type WATSessionConfig = {
  sessionId: string;
  wordCount: number; // e.g. 60
  flashDurationSeconds: number; // e.g. 15
  seed: number; // determinism for word ordering/selection
};

export type WATSessionState = {
  stage: "running" | "finished";
  sessionId: string;

  config: WATSessionConfig;

  // current flash index (0-based)
  currentIndex: number;

  // Deterministic word ordering for this session
  wordOrder: string[]; // word ids length == wordCount

  flashes: WATFlash[];
};

export type WATSessionInitResult = {
  state: WATSessionState;
  // word that should be shown next, with timing metadata
  next: {
    wordId: string;
    word: string;
    flashDurationSeconds: number;
    startedAtIso: string;
    endedAtIso: string;
  };
};

export type WATSessionSubmitResult = {
  state: WATSessionState;
  next?: {
    wordId: string;
    word: string;
    flashDurationSeconds: number;
    startedAtIso: string;
    endedAtIso: string;
  };
  evaluation?: InterviewEvaluation; // reuse existing shape for OLQ scores + recommendation
};
