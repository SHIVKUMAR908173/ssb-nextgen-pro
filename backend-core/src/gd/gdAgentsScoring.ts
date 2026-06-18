import type { GDPersonaRole } from "../lib/datasets/gdAgents.js";
import type { GDTrendingIssue, GDPersona } from "../lib/datasets/gdAgents.js";
import type { GDTopic } from "./datasets/topics.js";

export type GDAgentTurn = {
  speaker: "candidate" | "agent";
  text: string;
  agentRole?: GDPersonaRole;
  /**
   * Client-side hint from transcript parsing, allowing deterministic scoring
   * to penalize / reward.
   */
  isDisruptive?: boolean;
};

export type GDAgentsEvaluationRubric = {
  // 0..10
  cooperation: number;
  // 0..10
  influenceAndConfidence: number;
  // 0..10
  tactfulnessWithDisrupters: number;
  // 0..10
  logicalSupport: number;
};

export type GDAgentsEvaluation = {
  topicId: string;
  totalScore: number; // 0..100
  rubric: GDAgentsEvaluationRubric;
  summary: string;
  evidence: Array<{ key: string; message: string }>;
};

function clamp1to10(n: number) {
  return Math.max(1, Math.min(10, n));
}

function normalize(t: string) {
  return t.toLowerCase().replace(/\s+/g, " ").trim();
}

function countHits(text: string, keywords: string[]) {
  const nt = normalize(text);
  return keywords.reduce((acc, k) => acc + (nt.includes(k) ? 1 : 0), 0);
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function topicKeywords(topic: GDTopic | GDTrendingIssue) {
  const subs = "subThemes" in topic ? topic.subThemes : [];
  return unique(
    [
      topic.title,
      topic.description,
      ...(subs.length ? subs : (topic as GDTrendingIssue).subThemes)
    ]
      .join(" ")
      .split(" ")
      .map((w) => w.trim())
      .filter((w) => w.length >= 4)
      .slice(0, 50)
  );
}

/**
 * MVP deterministic rubric:
 * - cooperation: penalize if candidate counters disruptive agent harshly or dominates.
 * - tactfulnessWithDisrupters: reward de-escalation markers.
 * - logicalSupport: reward "because/therefore" markers + keyword alignment.
 * - influenceAndConfidence: reward clear structuring + proportion of substantive candidate turns.
 */
export function evaluateGDAgentsMock(params: {
  topic: GDTopic;
  turns: GDAgentTurn[];
  selectedAgentRoles?: GDPersona[]; // optional traceability
}): GDAgentsEvaluation {
  const { topic, turns } = params;

  const candidateTurns = turns.filter((t) => t.speaker === "candidate");
  const candidateText = candidateTurns.map((t) => t.text).join("\n");
  const candidateNorm = normalize(candidateText);

  const agentTurns = turns.filter((t) => t.speaker === "agent");
  const disruptiveCount = agentTurns.filter((t) => t.isDisruptive).length;

  const evidence: Array<{ key: string; message: string }> = [];

  // Tactfulness markers
  const deEscalationKeywords = [
    "i understand",
    "let's",
    "we can",
    "perhaps",
    "could you",
    "with due respect",
    "thank you",
    "i hear you",
    "agree",
    "respect"
  ];
  const harshKeywords = ["shut up", "idiot", "stupid", "you are wrong", "never", "always", "must", "obviously"];

  const deEscHits = countHits(candidateText, deEscalationKeywords);
  const harshHits = countHits(candidateText, harshKeywords);

  const tactfulnessRaw = 3 + deEscHits * 1.0 - harshHits * 0.8 - disruptiveCount * 0.2;
  const tactfulnessWithDisrupters = clamp1to10(Math.round(tactfulnessRaw));
  evidence.push({
    key: "tactfulness",
    message:
      tactfulnessWithDisrupters >= 7
        ? "De-escalation and respect markers appear in candidate responses."
        : "Candidate responses may be too sharp; add acknowledgment before counterpoints."
  });

  // Cooperation: structure around listening + fewer dominance cues
  const dominanceKeywords = ["i will", "let me tell", "you have to", "clearly", "i'm in charge", "must"];
  const hedgingKeywords = ["i think", "in my view", "might", "could", "perhaps", "maybe"];
  const dominanceHits = countHits(candidateText, dominanceKeywords);
  const hedgingHits = countHits(candidateText, hedgingKeywords);

  const cooperationRaw = 3 + hedgingHits * 0.8 - dominanceHits * 0.9 - disruptiveCount * 0.15;
  const cooperation = clamp1to10(Math.round(cooperationRaw));
  evidence.push({
    key: "cooperation",
    message:
      cooperation >= 7
        ? "Candidate language supports respectful turn-taking."
        : "Dominance cues detected; soften language and invite other perspectives."
  });

  // Logical support: keyword alignment + reasoning markers
  const logicKeywords = ["because", "therefore", "so that", "for example", "for instance", "as a result", "consequently"];
  const logicHits = countHits(candidateText, logicKeywords);

  const alignHits = countHits(candidateText, topicKeywords(topic));
  const logicalSupportRaw = 3 + logicHits * 0.9 + alignHits * 0.12;
  const logicalSupport = clamp1to10(Math.round(logicalSupportRaw));
  evidence.push({
    key: "logic",
    message:
      logicalSupport >= 7
        ? "Reasoning markers and topic-aligned keywords are present."
        : "Add clearer reasoning (because/therefore) and explicit topic references."
  });

  // Influence/confidence: candidate structure cues + candidate turn count
  const structKeywords = ["first", "second", "third", "in conclusion", "to sum up", "overall", "therefore", "so"];
  const structHits = countHits(candidateText, structKeywords);

  const candTurnCount = candidateTurns.length;
  const substantiveTurnBonus = Math.min(4, Math.round(candTurnCount / 2));
  const influenceRaw = 3 + structHits * 0.7 + substantiveTurnBonus - disruptiveCount * 0.1;
  const influenceAndConfidence = clamp1to10(Math.round(influenceRaw));
  evidence.push({
    key: "influence",
    message:
      influenceAndConfidence >= 7
        ? "Candidate shows structure and confident pacing."
        : "Structure cues are limited; add a clear intro → reasons → conclusion flow."
  });

  const rubric: GDAgentsEvaluationRubric = {
    cooperation,
    influenceAndConfidence,
    tactfulnessWithDisrupters,
    logicalSupport
  };

  const totalScore = Math.round(
    (rubric.cooperation + rubric.influenceAndConfidence + rubric.tactfulnessWithDisrupters + rubric.logicalSupport) / 4 * 10
  );

  const summary =
    totalScore >= 80
      ? "Strong handling of disrupters with logical support, tact, and constructive cooperation."
      : totalScore >= 60
        ? "Mixed performance: some tact and logic, but improvements needed in de-escalation and argument structure."
        : "Weak integration of listening/tactful responses; add clearer reasoning and respectful counterpoints.";

  return {
    topicId: topic.id,
    totalScore,
    rubric,
    summary,
    evidence
  };
}
