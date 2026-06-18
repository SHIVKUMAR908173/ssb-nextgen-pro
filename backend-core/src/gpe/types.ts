import type { InterviewEvaluation } from "../ai/types.js";
import type { GPEScenario } from "./datasets/types.js";

export type GPEScenarioId = "indoor_map_v1" | "indoor_map_v2";

export type GPEReadWindow = {
  startedAtIso: string;
  // strictly after this timestamp, writes are allowed
  endsAtIso: string;
};

export type GPEWriteWindow = {
  startedAtIso: string;
  endedAtIso: string;
};

export type GPESessionConfig = {
  sessionId: string;
  scenarioId: GPEScenarioId;

  // "e.g., 5 minutes to read the map and 10 minutes to write solutions"
  readWindowSeconds: number;
  writeWindowSeconds: number;

  // determinism for scenario generation / evaluation stubs
  seed: number;
};

export type GPESessionState = {
  stage: "reading" | "writing" | "finished";
  sessionId: string;
  config: GPESessionConfig;

  // scenario payload snapshot (so evaluation is deterministic for a given session)
  scenario: GPEScenario;

  readWindow: GPEReadWindow;
  writeWindow?: GPEWriteWindow;

  // user plan captured after/within write window
  capturedPlanText?: string;

  finishedAtIso?: string;
};

export type GPESessionInitResult = {
  state: GPESessionState;
  next: {
    // what the UI should show to the candidate during the read window
    readPromptText: string;
    readEndsAtIso: string;
    writeStartsAtIso: string;
    writeEndsAtIso: string;
  };
};

export type GPESessionSubmitResult = {
  state: GPESessionState;
  evaluation?: {
    // MVP: reuse interview evaluation shape to avoid building a totally separate scoring model.
    // Later you can replace with a dedicated GPE scoring type.
    evaluation: InterviewEvaluation;
    // Additionally include the plan itself for traceability.
    capturedPlanText: string;
  };
};
