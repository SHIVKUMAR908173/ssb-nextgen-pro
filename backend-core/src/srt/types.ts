export type SRTScenario = {
  id: string;
  situation: string;
};

export type SRTFlash = {
  scenarioId: string;
  situation: string;
  index: number;
  startedAtIso: string;
  endedAtIso: string;
  responseText: string;
};

export type SRTSessionConfig = {
  sessionId: string;
  scenarioCount: number; // e.g. 30
  flashDurationSeconds: number; // e.g. 30
  seed: number;
};

export type SRTSessionState = {
  stage: "running" | "finished";
  sessionId: string;
  config: SRTSessionConfig;
  currentIndex: number;
  scenarioOrder: string[]; 
  flashes: SRTFlash[];
};

export type SRTSessionInitResult = {
  state: SRTSessionState;
  next: {
    scenarioId: string;
    situation: string;
    flashDurationSeconds: number;
    startedAtIso: string;
    endedAtIso: string;
  };
};

export type SRTSessionSubmitResult = {
  state: SRTSessionState;
  next?: {
    scenarioId: string;
    situation: string;
    flashDurationSeconds: number;
    startedAtIso: string;
    endedAtIso: string;
  };
  evaluation?: any; 
};
