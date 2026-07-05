import { z } from "zod";
import type { DistanceRuleSet, ColorRuleSet } from "../lib/datasets/gto.js";
import { evaluateGapBridge, evaluateColorRule } from "./rules.js";

export type ToolType = 'FATTA' | 'BALLI' | 'ROPE' | 'PLANK' | 'DRUM';

export type PlatformConfig = {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: "WHITE" | "RED" | "BLUE" | "YELLOW" | "GREEN";
  label: string;
  type: "platform" | "barrel" | "drum" | "wall" | "trench";
};

export type LevelConfig = {
  levelId: number;
  platforms: PlatformConfig[];
  availableTools: ToolType[];
};

export type PlacedTool = {
  id: string;
  tool: ToolType;
  fromPlatformId: string;
  toPlatformId: string;
};

export type OutdoorSessionConfig = {
  sessionId: string;
  taskType: "PGT" | "HGT" | "FGT" | "CT";
  levelId: number;
};

export type OutdoorSessionState = {
  config: OutdoorSessionConfig;
  score: number;
  placedTools: PlacedTool[];
  completed: boolean;
  ruleViolations: number;
};

export type OutdoorSessionInitResult = {
  state: OutdoorSessionState;
  level: LevelConfig;
};

export type OutdoorSessionMoveInput = {
  state: OutdoorSessionState;
  move: {
    tool: ToolType;
    fromPlatformId: string;
    toPlatformId: string;
    // Client-side distance calculation to save server from doing full 3D math on bounding boxes,
    // though ideally the server should do it. For this mock, we accept client's distance.
    distanceFt: number;
    // Color of the platform being touched
    touchedColor: "WHITE" | "RED" | "BLUE" | "YELLOW" | "GREEN";
  };
};

export type OutdoorSessionMoveResult = {
  state: OutdoorSessionState;
  valid: boolean;
  message: string;
};

// Mock level generation for init
export function generateLevelConfig(levelId: number): LevelConfig {
  // A simplistic mock 3D level layout that the frontend will render
  return {
    levelId,
    availableTools: ['FATTA', 'ROPE', 'BALLI'],
    platforms: [
      { id: "start", x: 0, y: 0.25, z: -10, width: 8, depth: 4, height: 0.5, color: "WHITE", label: "START LINE", type: "platform" },
      { id: "p1", x: 0, y: 1, z: -3, width: 2, depth: 2, height: 2, color: "WHITE", label: "P1", type: "drum" },
      { id: "p2", x: 0, y: 1.5, z: 4, width: 2.5, depth: 2.5, height: 3, color: "BLUE", label: "P2", type: "platform" },
      { id: "finish", x: 0, y: 0.25, z: 12, width: 8, depth: 4, height: 0.5, color: "WHITE", label: "FINISH LINE", type: "platform" },
      // Red zone trench spanning across
      { id: "redzone", x: 0, y: 0.1, z: 0, width: 20, depth: 16, height: 0.2, color: "RED", label: "Red Zone", type: "trench" }
    ]
  };
}

export function initOutdoorSession(config: OutdoorSessionConfig): OutdoorSessionInitResult {
  const state: OutdoorSessionState = {
    config,
    score: 0,
    placedTools: [],
    completed: false,
    ruleViolations: 0
  };
  return {
    state,
    level: generateLevelConfig(config.levelId)
  };
}

export function submitOutdoorMove(deps: { distanceRules: DistanceRuleSet; colorRules: ColorRuleSet }, input: OutdoorSessionMoveInput): OutdoorSessionMoveResult {
  const { state, move } = input;
  
  // 1. Color Rule Validation
  // If the tool touches RED, it's a violation.
  let colorCheckValid = true;
  let colorMessage = "Move valid.";
  if (move.touchedColor === "RED") {
    colorCheckValid = false;
    colorMessage = "COLOR RULE VIOLATION: Helping material cannot touch RED.";
  }

  // 2. Distance Rule Validation
  // Using the GTO dataset distance rule
  const distanceEval = evaluateGapBridge({
    gapFt: move.distanceFt,
    distanceRuleId: "distance_4ft_bridge_required",
    dataset: deps.distanceRules
  });

  // A Fatta is typically 6ft. We'll mock tool length limits.
  const toolLengths: Record<ToolType, number> = {
    'FATTA': 6,
    'BALLI': 8,
    'PLANK': 6,
    'ROPE': 12,
    'DRUM': 2
  };

  let distanceCheckValid = true;
  if (move.distanceFt > toolLengths[move.tool]) {
    distanceCheckValid = false;
    colorMessage = `DISTANCE RULE VIOLATION: ${move.tool} (${toolLengths[move.tool]}ft) is too short to bridge a ${move.distanceFt.toFixed(1)}ft gap.`;
  }

  const valid = colorCheckValid && distanceCheckValid;
  
  const newState = { ...state };
  if (valid) {
    newState.score += 10;
    newState.placedTools = [...newState.placedTools, {
      id: `tool-${Date.now()}`,
      tool: move.tool,
      fromPlatformId: move.fromPlatformId,
      toPlatformId: move.toPlatformId
    }];
    if (move.toPlatformId.toLowerCase().includes('finish')) {
      newState.completed = true;
      newState.score += 50;
    }
  } else {
    newState.ruleViolations += 1;
    newState.score = Math.max(0, newState.score - 5);
  }

  return {
    state: newState,
    valid,
    message: colorMessage
  };
}
