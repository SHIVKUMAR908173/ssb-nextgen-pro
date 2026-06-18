import { AssessmentSession } from '../types/database.types';

export interface OLQScores {
  effectiveIntelligence: number
  reasoningAbility: number
  organizingAbility: number
  powerOfExpression: number
  socialAdaptability: number
  cooperation: number
  senseOfResponsibility: number
  initiative: number
  selfConfidence: number
  speedOfDecision: number
  abilityToInfluenceGroup: number
  liveliness: number
  determination: number
  courage: number
  stamina: number
}

export interface AssessmentProfile {
  userId: string
  olqScores: OLQScores
  overallOfficerScore: number        // 0-100 weighted composite
  recommendationLikelihood: number   // 0-100 probability
  grade: 'RECOMMENDED' | 'BORDERLINE' | 'NEEDS_WORK' | 'NOT_READY'
  strongestOLQs: string[]
  weakestOLQs: string[]
  ssbReadinessLevel: 1 | 2 | 3 | 4 | 5
  predictedOutcome: string
  improvementRoadmap: { olq: string, action: string, priority: 'HIGH' | 'MEDIUM' | 'LOW' }[]
  sessionCount: number
  lastUpdated: string
}

const OLQ_KEYS: (keyof OLQScores)[] = [
  'effectiveIntelligence', 'reasoningAbility', 'organizingAbility', 'powerOfExpression',
  'socialAdaptability', 'cooperation', 'senseOfResponsibility', 'initiative',
  'selfConfidence', 'speedOfDecision', 'abilityToInfluenceGroup', 'liveliness',
  'determination', 'courage', 'stamina'
]

// Weight matrix for each OLQ based on which tests contribute to it
const TEST_WEIGHTS: Record<string, Partial<Record<keyof OLQScores, number>>> = {
  oir: { effectiveIntelligence: 0.5, reasoningAbility: 0.5, speedOfDecision: 0.2 },
  tat: { effectiveIntelligence: 0.3, initiative: 0.4, determination: 0.3, powerOfExpression: 0.2 },
  wat: { speedOfDecision: 0.4, reasoningAbility: 0.2, determination: 0.2, courage: 0.1 },
  srt: { senseOfResponsibility: 0.4, speedOfDecision: 0.3, reasoningAbility: 0.2, initiative: 0.3 },
  sd: { selfConfidence: 0.5, liveliness: 0.2, determination: 0.2 },
  gd: { powerOfExpression: 0.4, socialAdaptability: 0.4, abilityToInfluenceGroup: 0.4, liveliness: 0.3 },
  gpe: { organizingAbility: 0.5, reasoningAbility: 0.3, abilityToInfluenceGroup: 0.3 },
  interview: { selfConfidence: 0.4, powerOfExpression: 0.3, liveliness: 0.3, effectiveIntelligence: 0.2 },
  pgt: { organizingAbility: 0.4, cooperation: 0.4, initiative: 0.2 },
  io: { courage: 0.5, stamina: 0.5, determination: 0.4 },
  lecturette: { powerOfExpression: 0.5, selfConfidence: 0.4, abilityToInfluenceGroup: 0.2 }
}

export function computeAssessmentProfile(userId: string, allSessions: Partial<AssessmentSession>[]): AssessmentProfile {
  const currentScores: Record<string, number[]> = {}
  OLQ_KEYS.forEach(key => currentScores[key] = [])

  // Process all sessions and extract partial OLQ signals
  allSessions.forEach(session => {
    // Determine weight based on recency
    const ageDays = (new Date().getTime() - new Date(session.created_at || Date.now()).getTime()) / (1000 * 3600 * 24)
    let timeWeight = 1.0
    if (ageDays > 7 && ageDays <= 30) timeWeight = 0.7
    if (ageDays > 30) timeWeight = 0.4

    const sessionModule = session.module as string
    const baseScore = session.score || 0 // 0-100
    const normalizedBaseScore = baseScore / 10 // 0-10

    // Apply weights
    if (TEST_WEIGHTS[sessionModule]) {
      const w = TEST_WEIGHTS[sessionModule]
      Object.keys(w).forEach(olq => {
        const factor = w[olq as keyof OLQScores] || 0
        // Mix AI-provided specific OLQ scores if they exist
        const aiSpecificScore = session.olq_scores && session.olq_scores[olq] ? session.olq_scores[olq] : normalizedBaseScore
        const finalScoreContribution = aiSpecificScore * factor * timeWeight
        if (finalScoreContribution > 0) {
           currentScores[olq].push(finalScoreContribution / factor) // Store un-factored but time-weighted score
        }
      })
    }
  })

  // Calculate final OLQ scores (averaging collected signals)
  const finalOlqScores: Partial<OLQScores> = {}
  let totalOlqSum = 0
  
  OLQ_KEYS.forEach(key => {
    const scores = currentScores[key]
    if (scores.length > 0) {
      // Recent scores matter more, but we just take an average of the time-weighted scores
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      // Cap at 10
      finalOlqScores[key] = Math.min(10, Math.round(avg * 10) / 10)
    } else {
      // Default baseline if no data yet
      finalOlqScores[key] = 5
    }
    totalOlqSum += finalOlqScores[key]!
  })

  // Calculate overall Officer Score
  // Max possible sum = 150. Overall score is out of 100
  const consistencyBonus = allSessions.length > 10 ? 5 : 0
  const overallOfficerScore = Math.min(100, Math.round((totalOlqSum / 150) * 100) + consistencyBonus)

  // Grade and Likelihood
  let grade: AssessmentProfile['grade'] = 'NOT_READY'
  const likelihood = overallOfficerScore

  if (overallOfficerScore >= 80) grade = 'RECOMMENDED'
  else if (overallOfficerScore >= 65) grade = 'BORDERLINE'
  else if (overallOfficerScore >= 50) grade = 'NEEDS_WORK'

  // Readiness Level
  let readinessLevel = 1
  if (overallOfficerScore >= 85) readinessLevel = 5
  else if (overallOfficerScore >= 70) readinessLevel = 4
  else if (overallOfficerScore >= 55) readinessLevel = 3
  else if (overallOfficerScore >= 40) readinessLevel = 2

  // Find strengths and weaknesses
  const sortedOLQs = [...OLQ_KEYS].sort((a, b) => finalOlqScores[b]! - finalOlqScores[a]!)
  const strongestOLQs = sortedOLQs.slice(0, 3)
  const weakestOLQs = sortedOLQs.slice(-3)

  const improvementRoadmap = weakestOLQs.map((olq, i) => ({
    olq,
    action: generateImprovementAction(olq),
    priority: i === 0 ? 'HIGH' : 'MEDIUM'
  })) as AssessmentProfile['improvementRoadmap']

  return {
    userId,
    olqScores: finalOlqScores as OLQScores,
    overallOfficerScore,
    recommendationLikelihood: likelihood,
    grade,
    strongestOLQs,
    weakestOLQs,
    ssbReadinessLevel: readinessLevel as 1|2|3|4|5,
    predictedOutcome: getPredictedOutcome(grade),
    improvementRoadmap,
    sessionCount: allSessions.length,
    lastUpdated: new Date().toISOString()
  }
}

function generateImprovementAction(olq: string): string {
  const actions: Record<string, string> = {
    effectiveIntelligence: "Practice OIR Sets 70-80 under strict time limits.",
    reasoningAbility: "Solve complex situational puzzles and analyze cause-effect in daily news.",
    organizingAbility: "Focus on Group Planning Exercises (GPE) and create detailed SMEAC plans.",
    powerOfExpression: "Record yourself speaking on 3 lecturette topics daily for 3 minutes.",
    socialAdaptability: "Participate in diverse group discussions and actively listen before countering.",
    cooperation: "In group tasks, practice giving supportive ideas rather than dictating.",
    senseOfResponsibility: "Complete SRTs focusing on holistic solutions, leaving no situation pending.",
    initiative: "In TAT, ensure your hero takes the first proactive step before others do.",
    selfConfidence: "Practice virtual interviews focusing on steady voice and strong eye contact.",
    speedOfDecision: "Practice WAT with a 10-second timer instead of 15 seconds.",
    abilityToInfluenceGroup: "In GD, bring the group back to the core theme when it diverges.",
    liveliness: "Maintain a cheerful disposition even during stressful Command Task scenarios.",
    determination: "Increase consistency: maintain a daily streak of at least 3 tasks.",
    courage: "Visualize high-stress tasks like Individual Obstacles and commit without hesitation.",
    stamina: "Incorporate physical conditioning and prolonged mental focus sessions into your routine."
  }
  return actions[olq] || "Practice related test modules consistently."
}

function getPredictedOutcome(grade: string): string {
  switch (grade) {
    case 'RECOMMENDED': return "High probability of clearing SSB. Focus on maintaining consistency."
    case 'BORDERLINE': return "In contention, but psychological tests or GD need polishing."
    case 'NEEDS_WORK': return "Needs significant improvement in core OLQs before appearing."
    default: return "Just starting. Focus on understanding the tests and building a strong foundation."
  }
}
