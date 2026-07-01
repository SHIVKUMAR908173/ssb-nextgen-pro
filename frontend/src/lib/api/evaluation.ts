/**
 * API Service for SSB Test Evaluations
 * 
 * This module provides API calls for all AI-powered test evaluations:
 * - WAT (Word Association Test)
 * - TAT (Thematic Apperception Test)
 * - SRT (Situation Reaction Test)
 * - SD (Self Description)
 * - GPE (Group Planning Exercise)
 * - PPDT (Picture Perception and Description Test)
 */

const API_BASE_URL = '/api';

// ==================== Types ====================

export interface OLQScores {
  [key: string]: number;
}

export interface WATEvaluationRequest {
  word: string;
  response: string;
  time_taken?: number;
}

export interface WATEvaluationResponse {
  score: number;
  olq_mapping: OLQScores;
  feedback: string;
  suggestions: string[];
  is_positive: boolean;
}

export interface TATEvaluationRequest {
  image_id: string;
  story: string;
  time_taken?: number;
  themes_identified?: string[];
}

export interface TATEvaluationResponse {
  overall_score: number;
  olq_analysis: { [key: string]: { score: number; assessment: string } };
  themes_analysis: { [key: string]: number };
  feedback: string;
  strengths: string[];
  areas_for_improvement: string[];
  story_structure_score: number;
}

export interface SRTEvaluationRequest {
  scenario_id: string;
  scenario_text: string;
  response: string;
  time_taken?: number;
}

export interface SRTEvaluationResponse {
  score: number;
  olq_analysis: OLQScores;
  feedback: string;
  ideal_response_points: string[];
  red_flags: string[];
  green_flags: string[];
}

export interface SDEvaluationRequest {
  section: string;
  description: string;
  word_count?: number;
}

export interface SDEvaluationResponse {
  score: number;
  olq_indicators: OLQScores;
  feedback: string;
  authenticity_score: number;
  suggestions: string[];
}

export interface GPEEvaluationRequest {
  scenario_id: string;
  plan: string;
  priorities_identified?: string[];
  resources_allocated?: { [key: string]: string };
  time_allocation?: string;
}

export interface GPEEvaluationResponse {
  overall_score: number;
  planning_score: number;
  prioritization_score: number;
  resource_allocation_score: number;
  olq_analysis: OLQScores;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  ideal_approach: string;
}

export interface PPDTEvaluationRequest {
  image_description: string;
  story: string;
  characters_identified?: string[];
  themes_identified?: string[];
  time_taken?: number;
}

export interface PPDTEvaluationResponse {
  overall_score: number;
  perception_score: number;
  story_score: number;
  olq_analysis: OLQScores;
  feedback: string;
  character_analysis: { [key: string]: string };
  theme_analysis: { [key: string]: number };
}

export interface ComprehensiveAssessmentRequest {
  wat_responses?: Array<{ word: string; response: string }>;
  tat_stories?: Array<{ image_id: string; story: string }>;
  srt_responses?: Array<{ scenario_id: string; response: string }>;
  sd_responses?: Array<{ section: string; description: string }>;
}

export interface ComprehensiveAssessmentResponse {
  olq_scores: OLQScores;
  strengths: string[];
  weaknesses: string[];
  average_score: number;
  recommendation: string;
  total_responses_analyzed: number;
  timestamp: string;
}

export interface OLQFramework {
  [key: string]: {
    description: string;
    category: string;
    weight: number;
    critical: boolean;
  };
}

// ==================== API Functions ====================

/**
 * Evaluate Word Association Test response
 */
export async function evaluateWAT(request: WATEvaluationRequest): Promise<WATEvaluationResponse> {
  const response = await fetch(`${API_BASE_URL}/evaluate-wat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate WAT response');
  }

  return response.json();
}

/**
 * Evaluate Thematic Apperception Test story
 */
export async function evaluateTAT(request: TATEvaluationRequest): Promise<TATEvaluationResponse> {
  const response = await fetch(`${API_BASE_URL}/evaluate-tat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate TAT story');
  }

  return response.json();
}

/**
 * Evaluate Situation Reaction Test response
 */
export async function evaluateSRT(request: SRTEvaluationRequest): Promise<SRTEvaluationResponse> {
  const response = await fetch(`${API_BASE_URL}/evaluate-srt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate SRT response');
  }

  return response.json();
}

/**
 * Evaluate Self Description
 */
export async function evaluateSD(request: SDEvaluationRequest): Promise<SDEvaluationResponse> {
  const response = await fetch(`${API_BASE_URL}/evaluate-sd`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate SD');
  }

  return response.json();
}

/**
 * Evaluate Group Planning Exercise
 */
export async function evaluateGPE(request: GPEEvaluationRequest): Promise<GPEEvaluationResponse> {
  const response = await fetch(`${API_BASE_URL}/evaluate-gpe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate GPE');
  }

  return response.json();
}

/**
 * Evaluate Picture Perception and Description Test
 */
export async function evaluatePPDT(request: PPDTEvaluationRequest): Promise<PPDTEvaluationResponse> {
  const response = await fetch(`${API_BASE_URL}/evaluate-ppdt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate PPDT');
  }

  return response.json();
}

/**
 * Get comprehensive assessment across multiple tests
 */
export async function getComprehensiveAssessment(
  request: ComprehensiveAssessmentRequest
): Promise<ComprehensiveAssessmentResponse> {
  const response = await fetch(`${API_BASE_URL}/evaluate-comprehensive-psych`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to get comprehensive assessment');
  }

  return response.json();
}

/**
 * Get OLQ framework summary
 */
export async function getOLQSummary(): Promise<{
  olq_framework: OLQFramework;
  categories: string[];
}> {
  const response = await fetch(`${API_BASE_URL}/olq-summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch OLQ summary');
  }

  return response.json();
}

// ==================== Helper Functions ====================

/**
 * Calculate overall OLQ score from scores object
 */
export function calculateOverallScore(scores: OLQScores): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Get OLQ category color for visualization
 */
export function getOLQColor(score: number): string {
  if (score >= 4.5) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  if (score >= 3.5) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  if (score >= 2.5) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  return 'text-red-500 bg-red-500/10 border-red-500/20';
}

/**
 * Get OLQ score label
 */
export function getScoreLabel(score: number): string {
  if (score >= 4.5) return 'Excellent';
  if (score >= 3.5) return 'Good';
  if (score >= 2.5) return 'Average';
  if (score >= 1.5) return 'Below Average';
  return 'Poor';
}

/**
 * Format score as percentage
 */
export function scoreToPercentage(score: number): number {
  return Math.round((score / 5) * 100);
}

// ==================== Database Helpers (Supabase) ====================
import { createClient } from '@/lib/supabase/client';

export async function saveTestHistory(testName: string, score: number, total: number, improvements: string[]) {
  try {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
        // Fallback to local storage if not logged in
        const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
        history.push({
            id: `${testName.replace(/\s+/g, '')}-${Date.now()}`,
            test: testName,
            score,
            total,
            date: new Date().toISOString(),
            status: 'completed',
            improvements
        });
        localStorage.setItem('testHistory', JSON.stringify(history));
        return;
    }

    await supabase.from('test_history').insert({
      user_id: authData.user.id,
      test_name: testName,
      score: score,
      total: total,
      status: 'completed',
      improvements: improvements
    });
  } catch (e) {
    console.error('Error saving test history to Supabase:', e);
  }
}

export async function getTestHistory() {
  try {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
        // Fallback to local storage
        return JSON.parse(localStorage.getItem('testHistory') || '[]');
    }

    const { data } = await supabase.from('test_history')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('created_at', { ascending: false });
    
    // Map to old format for UI compatibility
    return (data || []).map(row => ({
        id: row.id,
        test: row.test_name,
        score: row.score,
        total: row.total,
        date: row.created_at,
        status: row.status,
        improvements: row.improvements || []
    }));
  } catch (e) {
    console.error('Error fetching test history from Supabase:', e);
    return [];
  }
}
