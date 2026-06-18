import type { LecturetteSessionMetadata, TierLevel, SSBLecturetteAssessmentResult } from "./types.js";
import type { AcousticBiomarkers, LinguisticBiomarkers } from "./types.js";
import type { InterviewEvaluation } from "../../ai/types.js";
import { scoreLecturetteMock } from "./scoring.js";

function nowIso() {
  return new Date().toISOString();
}

function addSecondsIso(baseNowMs: number, seconds: number) {
  return new Date(baseNowMs + seconds * 1000).toISOString();
}

export type LecturetteStage = "prep" | "speaking";

export type LecturetteSessionConfig = {
  candidate_id: string;
  tier_level: TierLevel;
  seed: number;
};

export type LecturetteSessionInitResult = {
  state: LecturetteSessionState;
};

export type LecturetteSessionSubmitResult = {
  state: LecturetteSessionState;
  scoreResult: SSBLecturetteAssessmentResult;
};

export type LecturetteCard = {
  id: string;
  topics: Array<{
    topicId: string;
    title: string;
    difficultyTier: "above_average" | "average" | "sub_standard";
  }>;
};

export type LecturetteSessionState = {
  stage: LecturetteStage;
  sessionId: string;

  config: LecturetteSessionConfig;

  // timing
  prepWindowSeconds: number;
  speakWindowSeconds: number;

  startedAtIso: string;
  prepEndsAtIso: string;
  speakEndsAtIso: string;

  // card selection
  // Mark optional to stay compatible with the current server.ts Zod parsing surface.
  // (MVP still requires it at runtime.)
  selectedCard?: LecturetteCard;
  topic_selected: {
    topicId: string;
    title: string;
    difficultyTier: "above_average" | "average" | "sub_standard";
  };
  tier_level: TierLevel;

  // capture payload for scoring
  captured: {
    // MVP: we accept biomarkers directly (client “transcript/audio extraction” stub)
    acousticBiomarkers?: AcousticBiomarkers;
    linguisticBiomarkers?: LinguisticBiomarkers;
  };

  finishedAtIso?: string;
};

export function createLecturetteSessionInitAndNext(params: {
  card: LecturetteCard;
  config: LecturetteSessionConfig;
  prepWindowSeconds?: number;
  speakWindowSeconds?: number;
}): LecturetteSessionInitResult {
  const { card, config } = params;

  const prepWindowSeconds = params.prepWindowSeconds ?? 180;
  const speakWindowSeconds = params.speakWindowSeconds ?? 180;

  const startedAtIso = nowIso();
  const startedAtMs = Date.parse(startedAtIso);

  const prepEndsAtIso = addSecondsIso(startedAtMs, prepWindowSeconds);
  const speakEndsAtIso = addSecondsIso(startedAtMs, prepWindowSeconds + speakWindowSeconds);

  // Select a topic matching tier_level distribution preference.
  // MVP: pick first topic in card whose difficultyTier aligns with config, else fallback to index based on seed.
  const desiredDifficulty: LecturetteSessionState["topic_selected"]["difficultyTier"] = (() => {
    if (config.tier_level === 3) return "above_average";
    if (config.tier_level === 2) return "average";
    return "sub_standard";
  })();

  const matching = card.topics.filter((t) => t.difficultyTier === desiredDifficulty);
  const pickFrom = matching.length ? matching : card.topics;

  const pickIdx = config.seed % pickFrom.length;
  const selected = pickFrom[pickIdx];

  const state: LecturetteSessionState = {
    stage: "prep",
    sessionId: `lec-session-${config.candidate_id}-${config.seed}`,
    config,
    prepWindowSeconds,
    speakWindowSeconds,
    startedAtIso,
    prepEndsAtIso,
    speakEndsAtIso,
    selectedCard: card,
    topic_selected: {
      topicId: selected.topicId,
      title: selected.title,
      difficultyTier: selected.difficultyTier
    },
    tier_level: config.tier_level,
    captured: {}
  };

  return { state };
}

function assertWithinWindow(params: { nowMs: number; endsAtIso: string }) {
  const endsMs = Date.parse(params.endsAtIso);
  if (!Number.isFinite(endsMs)) throw new Error("Invalid endsAtIso in state");
  if (params.nowMs > endsMs) {
    throw new Error("Time window expired");
  }
}

export function submitLecturetteSession(params: {
  state: LecturetteSessionState;
  acousticBiomarkers: AcousticBiomarkers;
  linguisticBiomarkers: LinguisticBiomarkers;
  submittedAtIso?: string;
}): LecturetteSessionSubmitResult {
  const { state, acousticBiomarkers, linguisticBiomarkers, submittedAtIso } = params;

  if (state.stage !== "prep" && state.stage !== "speaking") {
    throw new Error(`Invalid stage=${state.stage}`);
  }

  const submittedIso = submittedAtIso ?? nowIso();
  const nowMs = Date.parse(submittedIso);
  if (!Number.isFinite(nowMs)) throw new Error("submittedAtIso invalid");

  // Determine stage based on time.
  const prepEndsMs = Date.parse(state.prepEndsAtIso);
  if (!Number.isFinite(prepEndsMs)) throw new Error("prepEndsAtIso invalid");

  const shouldBeSpeaking = nowMs >= prepEndsMs;
  const stage = shouldBeSpeaking ? "speaking" : "prep";

  // Enforce strict timing rules.
  if (stage === "prep") {
    // In MVP, submission during prep is allowed only if still within prep window and we treat it as “not started speaking”.
    // Spec wants prep 3 min then speak 3 min; so we do not score until speaking window.
    assertWithinWindow({ nowMs, endsAtIso: state.prepEndsAtIso });
    throw new Error("Cannot submit for scoring during prep phase; wait for speaking phase.");
  }

  // stage speaking: must be within speak window
  assertWithinWindow({ nowMs, endsAtIso: state.speakEndsAtIso });

  const sessionMetadata: LecturetteSessionMetadata = {
    candidate_id: state.config.candidate_id,
    topic_selected: state.topic_selected.title,
    tier_level: state.config.tier_level,
    total_duration_seconds: state.prepWindowSeconds + state.speakWindowSeconds
  };

  const scoreResult: SSBLecturetteAssessmentResult = scoreLecturetteMock({
    sessionMetadata,
    acoustic: acousticBiomarkers,
    linguistic: linguisticBiomarkers
  });

  const finishedAtIso = nowIso();

  const nextState: LecturetteSessionState = {
    ...state,
    stage: "speaking",
    captured: {
      acousticBiomarkers,
      linguisticBiomarkers
    },
    finishedAtIso
  };

  return { state: nextState, scoreResult };
}
