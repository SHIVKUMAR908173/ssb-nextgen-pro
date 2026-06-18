/**
 * OLQ Tracker API Client
 * Handles all OLQ-related API calls for tracking, configuration, and analytics
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface OLQScores {
  effective_intelligence: number | null;
  reasoning_ability: number | null;
  organizing_ability: number | null;
  power_of_expression: number | null;
  social_adaptability: number | null;
  cooperation: number | null;
  sense_of_responsibility: number | null;
  initiative: number | null;
  self_confidence: number | null;
  speed_of_decision: number | null;
  ability_to_influence: number | null;
  liveliness: number | null;
  determination: number | null;
  courage: number | null;
  stamina: number | null;
}

export interface OLQAssessment {
  id: string;
  user_id: string;
  test_type: string;
  test_id: string | null;
  overall_score: number | null;
  olq_scores: OLQScores;
  assessed_by: string;
  notes: string | null;
  created_at: string;
}

export interface OLQDailySummary {
  date: string;
  olq_averages: OLQScores;
  overall_daily_score: number | null;
  assessment_count: number;
}

export interface OLQConfiguration {
  weights: Record<string, number>;
  targets: Record<string, number>;
  configuration_name: string;
  notes: string | null;
}

export interface OLQTrend {
  date: string;
  scores: (number | null)[];
  overall_score: number | null;
}

export interface CurrentOLQResponse {
  scores: number[];
  labels: string[];
  last_updated: string;
}

/**
 * Create a new OLQ assessment
 */
export async function createOLQAssessment(
  userId: string,
  testType: string,
  testId: string | null,
  overallScore: number | null,
  olqScores: Partial<OLQScores> | null,
  assessedBy: string = 'AI',
  notes: string | null = null
): Promise<{ success: boolean; assessment_id: string; created_at: string }> {
  const response = await fetch(`${API_BASE_URL}/api/olq/assessments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      test_type: testType,
      test_id: testId,
      overall_score: overallScore,
      olq_scores: olqScores,
      assessed_by: assessedBy,
      notes: notes,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create OLQ assessment');
  }

  return response.json();
}

/**
 * Get OLQ assessments for a user
 */
export async function getUserAssessments(
  userId: string,
  days: number = 30,
  testType?: string
): Promise<OLQAssessment[]> {
  const params = new URLSearchParams({
    days: days.toString(),
  });
  
  if (testType) {
    params.append('test_type', testType);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/olq/assessments/${userId}?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch assessments');
  }

  return response.json();
}

/**
 * Get current aggregated OLQ scores for radar chart
 */
export async function getCurrentOLQScores(userId: string): Promise<CurrentOLQResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/olq/current-scores/${userId}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch current OLQ scores');
  }

  return response.json();
}

/**
 * Get daily OLQ summary for trend analysis
 */
export async function getDailySummary(
  userId: string,
  days: number = 7
): Promise<OLQDailySummary[]> {
  const params = new URLSearchParams({
    days: days.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/olq/daily-summary/${userId}?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch daily summary');
  }

  return response.json();
}

/**
 * Get OLQ configuration (weights and targets)
 */
export async function getOLQConfiguration(userId: string): Promise<OLQConfiguration> {
  const response = await fetch(
    `${API_BASE_URL}/api/olq/configuration/${userId}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch OLQ configuration');
  }

  return response.json();
}

/**
 * Update OLQ configuration
 */
export async function updateOLQConfiguration(
  userId: string,
  config: {
    weights?: Record<string, number>;
    targets?: Record<string, number>;
    configuration_name?: string;
    notes?: string;
  }
): Promise<{ success: boolean; configuration_id: string }> {
  const response = await fetch(
    `${API_BASE_URL}/api/olq/configuration?user_id=${userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update OLQ configuration');
  }

  return response.json();
}

/**
 * Get OLQ trends over time
 */
export async function getOLQTrends(
  userId: string,
  days: number = 30
): Promise<OLQTrend[]> {
  const params = new URLSearchParams({
    days: days.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/olq/trends/${userId}?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch OLQ trends');
  }

  return response.json();
}

/**
 * Calculate weighted OLQ scores based on configuration
 */
export function calculateWeightedScores(
  rawScores: number[],
  weights: Record<string, number>
): number[] {
  const olqKeys = [
    'effective_intelligence',
    'reasoning_ability',
    'organizing_ability',
    'power_of_expression',
    'social_adaptability',
    'cooperation',
    'sense_of_responsibility',
    'initiative',
    'self_confidence',
    'speed_of_decision',
    'ability_to_influence',
    'liveliness',
    'determination',
    'courage',
    'stamina',
  ];

  return rawScores.map((score, index) => {
    const key = olqKeys[index];
    const weight = weights[key] || 1.0;
    return Math.min(10, Math.max(1, score * weight));
  });
}

/**
 * Get OLQ labels in order
 */
export const OLQ_LABELS = [
  'Effective Intelligence',
  'Reasoning Ability',
  'Organizing Ability',
  'Power of Expression',
  'Social Adaptability',
  'Cooperation',
  'Sense of Responsibility',
  'Initiative',
  'Self Confidence',
  'Speed of Decision',
  'Ability to Influence',
  'Liveliness',
  'Determination',
  'Courage',
  'Stamina',
];

/**
 * Get OLQ keys in order
 */
export const OLQ_KEYS = [
  'effective_intelligence',
  'reasoning_ability',
  'organizing_ability',
  'power_of_expression',
  'social_adaptability',
  'cooperation',
  'sense_of_responsibility',
  'initiative',
  'self_confidence',
  'speed_of_decision',
  'ability_to_influence',
  'liveliness',
  'determination',
  'courage',
  'stamina',
];

/**
 * Map OLQ keys to their factor groups
 */
export const OLQ_FACTOR_GROUPS = {
  'Planning & Organising': [
    'effective_intelligence',
    'reasoning_ability',
    'organizing_ability',
    'power_of_expression',
  ],
  'Social Adjustment': [
    'social_adaptability',
    'cooperation',
    'sense_of_responsibility',
  ],
  'Social Effectiveness': [
    'initiative',
    'self_confidence',
    'speed_of_decision',
    'ability_to_influence',
  ],
  'Dynamic': [
    'liveliness',
    'determination',
    'courage',
    'stamina',
  ],
};

/**
 * Calculate factor scores from OLQ scores
 */
export function calculateFactorScores(olqScores: number[]): Record<string, number> {
  const factors: Record<string, number[]> = {
    'Planning & Organising': olqScores.slice(0, 4),
    'Social Adjustment': olqScores.slice(4, 7),
    'Social Effectiveness': olqScores.slice(7, 11),
    'Dynamic': olqScores.slice(11, 15),
  };

  const factorAverages: Record<string, number> = {};
  for (const [factor, scores] of Object.entries(factors)) {
    const validScores = scores.filter(s => s !== null && s !== undefined);
    factorAverages[factor] = validScores.length > 0
      ? parseFloat((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2))
      : 0;
  }

  return factorAverages;
}