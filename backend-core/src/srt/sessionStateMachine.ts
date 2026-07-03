import type {
  SRTSessionConfig,
  SRTSessionInitResult,
  SRTSessionState,
  SRTSessionSubmitResult
} from "./types.js";

export type SRTScenarioProvider = {
  getScenarios(): { id: string; situation: string }[];
};

export type SRTStateMachineDeps = {
  scenarioProvider: SRTScenarioProvider;
};

function nowIso() {
  return new Date().toISOString();
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentSeed = seed;
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createInitialStateAndNext(params: {
  deps: SRTStateMachineDeps;
  config: SRTSessionConfig;
}): SRTSessionInitResult {
  const { deps, config } = params;

  const allScenarios = deps.scenarioProvider.getScenarios();
  if (allScenarios.length < config.scenarioCount) {
    throw new Error(`SRT scenarioProvider returned ${allScenarios.length} scenarios, but config requires ${config.scenarioCount}`);
  }

  const shuffledIds = shuffleArray(allScenarios.map(s => s.id), config.seed);
  const scenarioOrder = shuffledIds.slice(0, config.scenarioCount);

  const nextIndex = 0;
  const startedAtIso = nowIso();
  const endedAtIso = new Date(Date.now() + config.flashDurationSeconds * 1000).toISOString();

  const firstScenarioId = scenarioOrder[nextIndex];
  const nextScenario = allScenarios.find((s) => s.id === firstScenarioId);
  if (!nextScenario) throw new Error(`Internal error: missing next scenario for id=${firstScenarioId}`);

  const state: SRTSessionState = {
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
      situation: nextScenario.situation,
      flashDurationSeconds: config.flashDurationSeconds,
      startedAtIso,
      endedAtIso
    }
  };
}

export function submitAnswer(params: {
  deps: SRTStateMachineDeps;
  state: SRTSessionState;
  responseText: string;
}): SRTSessionSubmitResult {
  const { deps, state, responseText } = params;

  if (state.stage !== "running") {
    return { state };
  }

  const allScenarios = deps.scenarioProvider.getScenarios();
  const currentScenarioId = state.scenarioOrder[state.currentIndex];
  const scenario = allScenarios.find((s) => s.id === currentScenarioId);
  if (!scenario) throw new Error(`Internal error: missing scenario for id=${currentScenarioId}`);

  const flash = {
    scenarioId: scenario.id,
    situation: scenario.situation,
    index: state.currentIndex,
    startedAtIso: state.currentIndex === 0 ? new Date().toISOString() : state.flashes[state.flashes.length - 1]?.endedAtIso || new Date().toISOString(),
    endedAtIso: nowIso(),
    responseText
  };

  const nextIndex = state.currentIndex + 1;
  const isFinished = nextIndex >= state.config.scenarioCount;

  const nextState: SRTSessionState = {
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
      situation: nextScenarioObj.situation,
      flashDurationSeconds: state.config.flashDurationSeconds,
      startedAtIso: flash.endedAtIso,
      endedAtIso: new Date(Date.now() + state.config.flashDurationSeconds * 1000).toISOString()
    }
  };
}
