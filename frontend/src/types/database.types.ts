export interface AssessmentSession {
  id: string;
  user_id: string;
  module: string;
  score: number | null;
  session_data: Record<string, unknown> | null;
  ai_feedback: Record<string, unknown> | null;
  olq_scores: Record<string, number> | null;
  duration_seconds: number | null;
  created_at: string;
}

export interface AssessmentProfile {
  id: string;
  user_id: string;
  profile_data: Record<string, unknown>;
  overall_score: number | null;
  grade: string | null;
  recommendation_likelihood: number | null;
  computed_at: string;
  expires_at: string;
}

export interface StudyProgress {
  id: string;
  user_id: string;
  exam: string;
  chapter_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  time_spent_seconds: number;
  completed_at: string | null;
  updated_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
  total_active_days: number;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  piq_context: Record<string, unknown> | null;
  conversation_history: Record<string, unknown> | null;
  overall_score: number | null;
  grade: string | null;
  category_scores: Record<string, number> | null;
  io_notes: string | null;
  duration_seconds: number | null;
  created_at: string;
}

export interface FlashcardProgress {
  id: string;
  user_id: string;
  card_id: number;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  next_review_date: string;
  review_count: number;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  exam: string;
  chapter_id: string;
  score: number | null;
  total_questions: number | null;
  answers: Record<string, unknown> | null;
  time_taken_seconds: number | null;
  created_at: string;
}

export interface StudyNote {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  tags: string[] | null;
  chapter_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FitnessLog {
  id: string;
  user_id: string;
  date: string;
  pushups: number | null;
  situps: number | null;
  pullups: number | null;
  run_km: number | null;
  run_time_seconds: number | null;
  notes: string | null;
  created_at: string;
}

export interface PiqSubmission {
  id: string;
  user_id: string;
  personal_details: Record<string, unknown> | null;
  education_details: Record<string, unknown> | null;
  hobbies_sports: Record<string, unknown> | null;
  ssb_history: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface TestHistory {
  id: string;
  user_id: string;
  test_name: string;
  score: number;
  total: number;
  status: string;
  improvements: Record<string, unknown>[] | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  xp: number;
  streak: number;
  lecturettes_completed: number;
  last_active: string;
}

export interface GtoProgress {
  id: string;
  user_id: string;
  obstacles_cleared: string[] | null;
  time_spent: number;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      assessment_sessions: {
        Row: AssessmentSession;
        Insert: Partial<AssessmentSession>;
        Update: Partial<AssessmentSession>;
      };
      assessment_profiles: {
        Row: AssessmentProfile;
        Insert: Partial<AssessmentProfile>;
        Update: Partial<AssessmentProfile>;
      };
      study_progress: {
        Row: StudyProgress;
        Insert: Partial<StudyProgress>;
        Update: Partial<StudyProgress>;
      };
      user_streaks: {
        Row: UserStreak;
        Insert: Partial<UserStreak>;
        Update: Partial<UserStreak>;
      };
      interview_sessions: {
        Row: InterviewSession;
        Insert: Partial<InterviewSession>;
        Update: Partial<InterviewSession>;
      };
      flashcard_progress: {
        Row: FlashcardProgress;
        Insert: Partial<FlashcardProgress>;
        Update: Partial<FlashcardProgress>;
      };
      quiz_attempts: {
        Row: QuizAttempt;
        Insert: Partial<QuizAttempt>;
        Update: Partial<QuizAttempt>;
      };
      study_notes: {
        Row: StudyNote;
        Insert: Partial<StudyNote>;
        Update: Partial<StudyNote>;
      };
      fitness_logs: {
        Row: FitnessLog;
        Insert: Partial<FitnessLog>;
        Update: Partial<FitnessLog>;
      };
      piq_submissions: {
        Row: PiqSubmission;
        Insert: Partial<PiqSubmission>;
        Update: Partial<PiqSubmission>;
      };
      test_history: {
        Row: TestHistory;
        Insert: Partial<TestHistory>;
        Update: Partial<TestHistory>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Partial<UserProfile>;
        Update: Partial<UserProfile>;
      };
      gto_progress: {
        Row: GtoProgress;
        Insert: Partial<GtoProgress>;
        Update: Partial<GtoProgress>;
      };
    };
  };
}
