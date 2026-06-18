export interface ApiResponse<T = unknown> {
  status?: string;
  data?: T;
  error?: string;
  message?: string;
}

// OIR Types
export interface OirQuestion {
  id: string;
  bookletNo: number;
  type: 'VERBAL' | 'NON_VERBAL';
  category: string;
  difficulty: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  imageUrl?: string;
}

export interface OirQuestionsResponse {
  status: string;
  totalBankSize: number;
  returnedCount: number;
  questions: OirQuestion[];
}

// Evaluation Types
export interface PsychEvaluationRequest {
  responses: Array<{
    word?: string;
    sentence?: string;
    situation?: string;
    reaction?: string;
    timeTaken: number;
  }>;
  testType: 'WAT' | 'SRT' | 'TAT' | 'SDT';
}

export interface EvaluationResponse {
  overall_score: number;
  olq_scores: Record<string, number>;
  feedback: Record<string, unknown>;
  recommendations: string[];
}

// Streak Types
export interface StreakResponse {
  currentStreak: number;
  longestStreak: number;
  lastActive: string;
}
