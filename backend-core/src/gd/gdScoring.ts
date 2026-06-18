import type { GDTopic } from "./datasets/topics.js";

export type GDParticipantTurn = {
  speaker: "candidate" | "other";
  text: string;
  /**
   * Whether the candidate explicitly referenced/acknowledged a point made earlier.
   */
  referencesOthers?: boolean;
};

export type GDEvaluationRubric = {
  contentRelevance: number; // 1..10
  activeListening: number; // 1..10
  friendlyTone: number; // 1..10
  respectAndTurnTaking: number; // 1..10
  confidenceAndClarity: number; // 1..10
};

export type GDEvaluation = {
  topicId: string;
  totalScore: number; // 0..100 (MVP normalized)
  rubric: GDEvaluationRubric;
  summary: string;
  /**
   * Basic evidence strings so UI/coach can explain scoring.
   */
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

/**
 * Very lightweight, deterministic GD scorer for MVP:
 * - Relevance: keyword overlap with topic title/description/subthemes
 * - Active listening: references-other flags + acknowledgment cues
 * - Friendly tone: penalize harsh/insult keywords, reward polite markers
 * - Respect/turn-taking: reward hedging/“I agree/I understand”, penalize dominance cues
 * - Clarity/confidence: reward structure cues (“first/second”, “therefore”, etc.)
 */
export function evaluateGDTextMock(params: {
  topic: GDTopic;
  /**
   * Candidate turns in order (other turns may be included for listening cues).
   */
  turns: GDParticipantTurn[];
}): GDEvaluation {
  const { topic, turns } = params;

  const candidateTurns = turns.filter((t) => t.speaker === "candidate");
  const candidateText = candidateTurns.map((t) => t.text).join("\n");
  const candidateNorm = normalize(candidateText);

  const evidence: Array<{ key: string; message: string }> = [];

  // 1) Content relevance
  const relevanceKeywords = [
    normalize(topic.title),
    normalize(topic.description),
    ...topic.subThemes.map((s) => normalize(s))
  ]
    .join(" ")
    .split(" ")
    .filter((w) => w.length >= 4);

  const overlap = countHits(candidateText, Array.from(new Set(relevanceKeywords)).slice(0, 35));
  const relevanceRaw = 3 + overlap * 0.4;
  const contentRelevance = clamp1to10(Math.round(relevanceRaw));
  if (overlap >= 4) evidence.push({ key: "relevance", message: "Good keyword alignment with topic and sub-themes." });
  else evidence.push({ key: "relevance", message: "Limited explicit alignment with topic/sub-themes; add clearer references." });

  // 2) Active listening
  const ackKeywords = ["i understand", "i agree", "you mentioned", "as you said", "your point", "also", "however"];
  const acknowledgementHits = countHits(candidateText, ackKeywords);

  const referencesOthersHits = candidateTurns.filter((t) => t.referencesOthers).length;
  const activeListeningScore = clamp1to10(Math.round(3 + acknowledgementHits * 0.8 + referencesOthersHits * 1.5));
  if (activeListeningScore >= 7) evidence.push({ key: "listening", message: "Acknowledgment and referencing present." });
  else evidence.push({ key: "listening", message: "Add explicit acknowledgment of others before counterpoints." });

  // 3) Friendly tone
  const politeKeywords = ["respect", "thank", "please", "appreciate", "with due respect", "i believe", "could you"];
  const harshKeywords = ["stupid", "idiot", "nonsense", "you are wrong", "shut up", "always wrong", "never"];
  const politeHits = countHits(candidateText, politeKeywords);
  const harshHits = countHits(candidateText, harshKeywords);

  const friendlyTone = clamp1to10(Math.round(4 + politeHits * 1.2 - harshHits * 1.5));
  if (harshHits > 0) evidence.push({ key: "tone", message: "Detected potentially harsh language; keep tone friendlier." });
  else evidence.push({ key: "tone", message: "Tone appears constructive/polite in the candidate text." });

  // 4) Respect and turn-taking
  // dominance markers: “i will”, “let me tell”, lots of “i” + imperative without hedging
  const dominanceKeywords = ["i will", "let me tell", "you have to", "obviously", "clearly", "must"];
  const hedgingKeywords = ["may", "might", "could", "i think", "in my view", "perhaps", "depending"];
  const dominanceHits = countHits(candidateText, dominanceKeywords);
  const hedgingHits = countHits(candidateText, hedgingKeywords);

  const respectAndTurnTaking = clamp1to10(Math.round(4 + hedgingHits * 0.9 - dominanceHits * 0.8));
  if (respectAndTurnTaking >= 7)
    evidence.push({ key: "respect", message: "Uses hedging/softeners; likely supports healthy turn-taking." });
  else evidence.push({ key: "respect", message: "Tone may be too directive; use softer language and invite other perspectives." });

  // 5) Clarity/confidence (structure)
  const structureKeywords = ["first", "second", "third", "therefore", "because", "for example", "in conclusion", "so"];
  const structureHits = countHits(candidateText, structureKeywords);
  const confidenceAndClarity = clamp1to10(Math.round(3 + structureHits * 0.9 + Math.min(10, candidateNorm.length / 220)));

  if (confidenceAndClarity >= 7) evidence.push({ key: "clarity", message: "Some structure cues detected (sequencing/conclusion)." });
  else evidence.push({ key: "clarity", message: "Add clearer structure: start claim -> give reason -> example -> conclude." });

  const rubric: GDEvaluationRubric = {
    contentRelevance,
    activeListening: activeListeningScore,
    friendlyTone,
    respectAndTurnTaking,
    confidenceAndClarity
  };

  const totalScore = Math.round(
    (rubric.contentRelevance + rubric.activeListening + rubric.friendlyTone + rubric.respectAndTurnTaking + rubric.confidenceAndClarity) / 5
  );

  const summary =
    totalScore >= 8
      ? "Shows strong topic engagement with respectful, listener-aware participation."
      : totalScore >= 6
        ? "Demonstrates partial alignment; improvements needed in listening cues and structured argumentation."
        : "Engagement is weak or unclear; focus on topic references and respectful, turn-aware statements.";

  return {
    topicId: topic.id,
    totalScore,
    rubric,
    summary,
    evidence
  };
}
