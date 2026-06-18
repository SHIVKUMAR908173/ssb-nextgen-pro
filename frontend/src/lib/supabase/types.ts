/**
 * Supabase Database Type Definitions
 * Auto-generated from the database schema
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          last_login?: string | null;
        };
        Relationships: [];
      };
      oir_tests: {
        Row: {
          id: string;
          set_number: number;
          title: string;
          type: "Verbal" | "Non-Verbal";
          difficulty: "Easy" | "Medium" | "Hard";
          created_at: string;
        };
        Insert: {
          id?: string;
          set_number: number;
          title: string;
          type: "Verbal" | "Non-Verbal";
          difficulty: "Easy" | "Medium" | "Hard";
          created_at?: string;
        };
        Update: {
          id?: string;
          set_number?: number;
          title?: string;
          type?: "Verbal" | "Non-Verbal";
          difficulty?: "Easy" | "Medium" | "Hard";
          created_at?: string;
        };
        Relationships: [];
      };
      test_results: {
        Row: {
          id: string;
          user_id: string | null;
          test_id: string | null;
          score: number | null;
          total_questions: number | null;
          time_taken: number | null;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          test_id?: string | null;
          score?: number | null;
          total_questions?: number | null;
          time_taken?: number | null;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          test_id?: string | null;
          score?: number | null;
          total_questions?: number | null;
          time_taken?: number | null;
          completed_at?: string;
        };
        Relationships: [];
      };
      vacha_interview_bank: {
        Row: {
          id: string;
          category: string;
          question_text: string;
          ideal_points: string[] | null;
          difficulty: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          question_text: string;
          ideal_points?: string[] | null;
          difficulty?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          category?: string;
          question_text?: string;
          ideal_points?: string[] | null;
          difficulty?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      vacha_gd_topics: {
        Row: {
          id: string;
          title: string;
          lead_points: string[] | null;
          background_info: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          lead_points?: string[] | null;
          background_info?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          lead_points?: string[] | null;
          background_info?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      mansa_scenarios: {
        Row: {
          id: string;
          test_type: "TAT" | "PPDT" | "WAT" | "SRT";
          prompt_text: string | null;
          image_url: string | null;
          suggested_themes: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          test_type: "TAT" | "PPDT" | "WAT" | "SRT";
          prompt_text?: string | null;
          image_url?: string | null;
          suggested_themes?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          test_type?: "TAT" | "PPDT" | "WAT" | "SRT";
          prompt_text?: string | null;
          image_url?: string | null;
          suggested_themes?: string[] | null;
          created_at?: string;
        };
        Relationships: [];
      };
      psych_submissions: {
        Row: {
          id: string;
          user_id: string | null;
          scenario_id: string | null;
          test_type: "TAT" | "WAT" | "SRT" | "SD";
          content: unknown;
          ai_feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          scenario_id?: string | null;
          test_type: "TAT" | "WAT" | "SRT" | "SD";
          content: unknown;
          ai_feedback?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          scenario_id?: string | null;
          test_type?: "TAT" | "WAT" | "SRT" | "SD";
          content?: unknown;
          ai_feedback?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience type aliases
type Tables = Database["public"]["Tables"];
export type User = Tables["users"]["Row"];
export type UserInsert = Tables["users"]["Insert"];
export type OIRTest = Tables["oir_tests"]["Row"];
export type TestResult = Tables["test_results"]["Row"];
export type InterviewQuestion = Tables["vacha_interview_bank"]["Row"];
export type GDTopic = Tables["vacha_gd_topics"]["Row"];
export type PsychScenario = Tables["mansa_scenarios"]["Row"];
export type PsychSubmission = Tables["psych_submissions"]["Row"];
