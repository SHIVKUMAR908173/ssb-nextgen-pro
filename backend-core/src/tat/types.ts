export type TATScenario = {
  id: string;
  imageUrl: string;
  isBlank: boolean;
};

export type TATFlash = {
  scenarioId: string;
  imageUrl: string;
  isBlank: boolean;
  index: number;
  viewStartedAtIso: string;
  writeStartedAtIso: string;
  endedAtIso: string;
  responseText: string;
};

export type TATSessionConfig = {
  sessionId: string;
  scenarioCount: number; // typically 12 (11 pictures + 1 blank)
  pictureTimeSeconds: number; // e.g. 30
  writingTimeSeconds: number; // e.g. 240
  seed: number;
};

export type TATSessionState = {
  stage: "running" | "finished";
  sessionId: string;
  config: TATSessionConfig;
  currentIndex: number;
  scenarioOrder: string[]; 
  flashes: TATFlash[];
};

export type TATSessionInitResult = {
  state: TATSessionState;
  next: {
    scenarioId: string;
    imageUrl: string;
    isBlank: boolean;
    pictureTimeSeconds: number;
    writingTimeSeconds: number;
    viewStartedAtIso: string;
    writeStartedAtIso: string;
    endedAtIso: string;
  };
};

export type TATSessionSubmitResult = {
  state: TATSessionState;
  next?: {
    scenarioId: string;
    imageUrl: string;
    isBlank: boolean;
    pictureTimeSeconds: number;
    writingTimeSeconds: number;
    viewStartedAtIso: string;
    writeStartedAtIso: string;
    endedAtIso: string;
  };
  evaluation?: any; 
};
