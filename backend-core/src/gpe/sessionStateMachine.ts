import type {
  GPESessionConfig,
  GPESessionInitResult,
  GPESessionState,
  GPESessionSubmitResult,
  GPEScenarioId
} from "./types.js";
import { evaluateGPESessionMock } from "./gpeScoring.js";
import { GPE_SCENARIOS } from "./datasets/scenarios.js";

function nowIso() {
  return new Date().toISOString();
}

function addSecondsIso(baseNowMs: number, seconds: number) {
  return new Date(baseNowMs + seconds * 1000).toISOString();
}

function resolveScenario(config: GPESessionConfig): GPEScenarioId {
  return config.scenarioId;
}

export type GPESessionMachineDeps = {
  // Keep deps pattern for future scenario providers / evaluators
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

export function createInitialStateAndNext(params: {
  deps: GPESessionMachineDeps;
  config: GPESessionConfig;
}): GPESessionInitResult {
  const { deps: _deps, config } = params;

  const readStartedAtIso = nowIso();
  const readEndsAtIso = addSecondsIso(Date.now(), config.readWindowSeconds);

  const scenario = GPE_SCENARIOS[config.scenarioId];

  const state: GPESessionState = {
    stage: "reading",
    sessionId: config.sessionId,
    config,
    scenario,
    readWindow: {
      startedAtIso: readStartedAtIso,
      endsAtIso: readEndsAtIso
    }
  };

  const next = {
    readPromptText: scenario.promptText,
    readEndsAtIso,
    writeStartsAtIso: readEndsAtIso,
    writeEndsAtIso: addSecondsIso(Date.now(), config.readWindowSeconds + config.writeWindowSeconds)
  };

  return { state, next };
}

export function submitPlan(params: {
  deps: GPESessionMachineDeps;
  state: GPESessionState;
  planText: string;
  submittedAtIso?: string;
}): GPESessionSubmitResult {
  const { deps: _deps, state, planText, submittedAtIso } = params;

  if (state.stage === "finished") {
    return { state };
  }

  if (typeof planText !== "string" || !planText.trim()) {
    // Server layer should treat this as 400, but we keep logic local too.
    throw new Error("planText must be a non-empty string");
  }

  const submittedIso = submittedAtIso ?? nowIso();
  const submittedMs = Date.parse(submittedIso);
  if (Number.isNaN(submittedMs)) throw new Error("submittedAtIso is invalid");

  const readEndsMs = Date.parse(state.readWindow.endsAtIso);
  if (Number.isNaN(readEndsMs)) throw new Error("Invalid readWindow.endsAtIso in state");

  const writeStartsMs = readEndsMs;
  const writeEndsMs = addSecondsIso(
    // base time is write start; we recompute write end from config
    writeStartsMs,
    state.config.writeWindowSeconds // NOTE: addSecondsIso accepts baseNowMs, so pass ms directly
  );

  const writeEndsIso = writeEndsMs;
  const writeEndsParsedMs = Date.parse(writeEndsIso);

  // Strict window:
  // - reading phase: reject if submitted before write starts
  // - writing phase: accept if within write window
  if (submittedMs < writeStartsMs) {
    throw new Error("Too early: plan can only be submitted after the read window ends");
  }

  if (submittedMs > writeEndsParsedMs) {
    throw new Error("Too late: plan submission window has expired");
  }

  const writeStartedAtIso = state.readWindow.endsAtIso;

  const finishedState: GPESessionState = {
    ...state,
    stage: "finished",
    writeWindow: {
      startedAtIso: writeStartedAtIso,
      endedAtIso: nowIso()
    },
    capturedPlanText: planText.trim(),
    finishedAtIso: nowIso()
  };

  const evaluation = evaluateGPESessionMock({
    seed: state.config.seed,
    session: finishedState
  });

  return {
    state: finishedState,
    evaluation: {
      evaluation,
      capturedPlanText: finishedState.capturedPlanText ?? ""
    }
  };
}
