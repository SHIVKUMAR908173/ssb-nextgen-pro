import type {
  TATSessionConfig,
  TATSessionInitResult,
  TATSessionState,
  TATSessionSubmitResult
} from "./types.js";

export type TATScenarioProvider = {
  getScenarios(): { id: string; imageUrl: string; isBlank: boolean }[];
};

export type TATStateMachineDeps = {
  scenarioProvider: TATScenarioProvider;
};

function nowIso() {
  return new Date().toISOString();
}

// Ensure the blank slide is always the last one if present in the data, 
// or simply slice the first 11 and add the blank slide.
function buildOrderedScenarios(allScenarios: { id: string; imageUrl: string; isBlank: boolean }[], config: TATSessionConfig): string[] {
  const regular = allScenarios.filter(s => !s.isBlank);
  const blank = allScenarios.find(s => s.isBlank);
  
  // Just take the first N-1 and append blank
  const selected = regular.slice(0, config.scenarioCount - 1).map(s => s.id);
  if (blank) {
    selected.push(blank.id);
  }
  return selected;
}

export function createInitialStateAndNext(params: {
  deps: TATStateMachineDeps;
  config: TATSessionConfig;
}): TATSessionInitResult {
  const { deps, config } = params;

  const allScenarios = deps.scenarioProvider.getScenarios();
  const scenarioOrder = buildOrderedScenarios(allScenarios, config);

  if (scenarioOrder.length !== config.scenarioCount) {
    throw new Error(`TAT config requires ${config.scenarioCount} scenarios, but only found ${scenarioOrder.length}`);
  }

  const nextIndex = 0;
  const viewStartedAtIso = nowIso();
  const writeStartedAtIso = new Date(Date.now() + config.pictureTimeSeconds * 1000).toISOString();
  const endedAtIso = new Date(Date.now() + (config.pictureTimeSeconds + config.writingTimeSeconds) * 1000).toISOString();

  const firstScenarioId = scenarioOrder[nextIndex];
  const nextScenario = allScenarios.find((s) => s.id === firstScenarioId);
  if (!nextScenario) throw new Error(`Internal error: missing next scenario for id=${firstScenarioId}`);

  const state: TATSessionState = {
    stage: "running",
    sessionId: config.sessionId,
    config,
    currentIndex: nextIndex,
    scenarioOrder,
    flashes: []
  };

  return {
    state,
    next: {
      scenarioId: nextScenario.id,
      imageUrl: nextScenario.imageUrl,
      isBlank: nextScenario.isBlank,
      pictureTimeSeconds: config.pictureTimeSeconds,
      writingTimeSeconds: config.writingTimeSeconds,
      viewStartedAtIso,
      writeStartedAtIso,
      endedAtIso
    }
  };
}

export function submitAnswer(params: {
  deps: TATStateMachineDeps;
  state: TATSessionState;
  responseText: string;
}): TATSessionSubmitResult {
  const { deps, state, responseText } = params;

  if (state.stage !== "running") {
    return { state };
  }

  const allScenarios = deps.scenarioProvider.getScenarios();
  const currentScenarioId = state.scenarioOrder[state.currentIndex];
  const scenario = allScenarios.find((s) => s.id === currentScenarioId);
  if (!scenario) throw new Error(`Internal error: missing scenario for id=${currentScenarioId}`);

  const prevEnded = state.flashes[state.flashes.length - 1]?.endedAtIso || new Date().toISOString();
  
  const flash = {
    scenarioId: scenario.id,
    imageUrl: scenario.imageUrl,
    isBlank: scenario.isBlank,
    index: state.currentIndex,
    viewStartedAtIso: state.currentIndex === 0 ? new Date().toISOString() : prevEnded,
    writeStartedAtIso: new Date(new Date(prevEnded).getTime() + state.config.pictureTimeSeconds * 1000).toISOString(),
    endedAtIso: nowIso(),
    responseText
  };

  const nextIndex = state.currentIndex + 1;
  const isFinished = nextIndex >= state.config.scenarioCount;

  const nextState: TATSessionState = {
    ...state,
    currentIndex: nextIndex,
    stage: isFinished ? "finished" : "running",
    flashes: [...state.flashes, flash]
  };

  if (isFinished) {
    return {
      state: nextState,
      evaluation: { status: "evaluation_pending" }
    };
  }

  const nextScenarioId = state.scenarioOrder[nextIndex];
  const nextScenarioObj = allScenarios.find((s) => s.id === nextScenarioId);
  if (!nextScenarioObj) throw new Error(`Internal error: missing scenario for id=${nextScenarioId}`);

  return {
    state: nextState,
    next: {
      scenarioId: nextScenarioObj.id,
      imageUrl: nextScenarioObj.imageUrl,
      isBlank: nextScenarioObj.isBlank,
      pictureTimeSeconds: state.config.pictureTimeSeconds,
      writingTimeSeconds: state.config.writingTimeSeconds,
      viewStartedAtIso: flash.endedAtIso,
      writeStartedAtIso: new Date(new Date(flash.endedAtIso).getTime() + state.config.pictureTimeSeconds * 1000).toISOString(),
      endedAtIso: new Date(new Date(flash.endedAtIso).getTime() + (state.config.pictureTimeSeconds + state.config.writingTimeSeconds) * 1000).toISOString()
    }
  };
}
