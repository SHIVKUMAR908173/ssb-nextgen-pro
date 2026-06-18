/**
 * Supabase client for server-side operations
 * Provides both client and admin (service role) clients
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "../../config/index.js";

// Database types for type safety
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          password_hash: string | null;
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          password_hash?: string | null;
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          password_hash?: string | null;
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

type Tables = Database["public"]["Tables"];

// User type helpers
export type User = Tables["users"]["Row"];
export type UserInsert = Tables["users"]["Insert"];
export type UserUpdate = Tables["users"]["Update"];

export type OIRTest = Tables["oir_tests"]["Row"];
export type TestResult = Tables["test_results"]["Row"];
export type InterviewQuestion = Tables["vacha_interview_bank"]["Row"];
export type GDTopic = Tables["vacha_gd_topics"]["Row"];
export type PsychScenario = Tables["mansa_scenarios"]["Row"];
export type PsychSubmission = Tables["psych_submissions"]["Row"];

let clientInstance: SupabaseClient<Database> | null = null;
let adminInstance: SupabaseClient<Database> | null = null;

/**
 * Get or create the Supabase client with anon key (for user-level operations)
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!clientInstance) {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      throw new Error(
        "Supabase client not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables."
      );
    }
    clientInstance = createClient<Database, "public">(supabaseConfig.url, supabaseConfig.anonKey);
  }
  return clientInstance;
}

/**
 * Get or create the Supabase admin client with service role key (for server operations)
 * WARNING: This bypasses RLS policies - use with caution
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> {
  if (!adminInstance) {
    if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
      throw new Error(
        "Supabase admin client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
      );
    }
    adminInstance = createClient<Database, "public">(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return adminInstance;
}

// ============= User Repository =============

export const userRepository = {
  async createUser(data: UserInsert): Promise<User> {
    const supabase = getSupabaseAdminClient();
    const { data: user, error } = await supabase.from("users").insert<UserInsert>(data).select().single();
    if (error) throw error;
    return user;
  },

  async getUserById(id: string): Promise<User | null> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("users").select().eq("id", id).single();
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("users").select().eq("email", email).single();
    if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
    return data || null;
  },

  async updateUser(id: string, data: UserUpdate): Promise<User> {
    const supabase = getSupabaseAdminClient();
    const { data: user, error } = await supabase.from("users").update<UserUpdate>(data).eq("id", id).select().single();
    if (error) throw error;
    return user;
  },

  async updateLastLogin(id: string): Promise<void> {
    await this.updateUser(id, { last_login: new Date().toISOString() });
  },
};

// ============= Test Results Repository =============

export const testResultRepository = {
  async createTestResult(data: Omit<TestResult, "id" | "completed_at">): Promise<TestResult> {
    const supabase = getSupabaseAdminClient();
    const { data: result, error } = await supabase.from("test_results").insert<Omit<TestResult, "id" | "completed_at">>(data).select().single();
    if (error) throw error;
    return result;
  },

  async getResultsByUserId(userId: string): Promise<TestResult[]> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("test_results")
      .select("*, oir_tests(*)")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getResultStats(userId: string) {
    const results = await this.getResultsByUserId(userId);
    if (results.length === 0) {
      return { averageScore: 0, totalTests: 0, bestScore: 0 };
    }
    const scores = results.filter((r) => r.score !== null).map((r) => r.score as number);
    return {
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      totalTests: results.length,
      bestScore: Math.max(...scores),
    };
  },
};

// ============= Interview Bank Repository =============

export const interviewBankRepository = {
  async getQuestionsByCategory(category: string): Promise<InterviewQuestion[]> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("vacha_interview_bank")
      .select()
      .eq("category", category)
      .order("difficulty");
    if (error) throw error;
    return data || [];
  },

  async getAllQuestions(): Promise<InterviewQuestion[]> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("vacha_interview_bank").select().order("category");
    if (error) throw error;
    return data || [];
  },
};

// ============= GD Topics Repository =============

export const gdTopicsRepository = {
  async getAllTopics(): Promise<GDTopic[]> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("vacha_gd_topics").select().order("title");
    if (error) throw error;
    return data || [];
  },

  async getTopicById(id: string): Promise<GDTopic | null> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("vacha_gd_topics").select().eq("id", id).single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },
};

// ============= Psych Scenarios Repository =============

export const psychScenariosRepository = {
  async getScenariosByType(testType: "TAT" | "PPDT" | "WAT" | "SRT"): Promise<PsychScenario[]> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("mansa_scenarios")
      .select()
      .eq("test_type", testType)
      .order("created_at");
    if (error) throw error;
    return data || [];
  },

  async getRandomScenario(testType: "TAT" | "PPDT" | "WAT" | "SRT", count = 1): Promise<PsychScenario[]> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("mansa_scenarios")
      .select()
      .eq("test_type", testType)
      .limit(count);
    if (error) throw error;
    return data || [];
  },
};

// ============= Psych Submissions Repository =============

export const psychSubmissionsRepository = {
  async createSubmission(data: Omit<PsychSubmission, "id" | "created_at">): Promise<PsychSubmission> {
    const supabase = getSupabaseAdminClient();
    const { data: submission, error } = await supabase.from("psych_submissions").insert<Omit<PsychSubmission, "id" | "created_at">>(data).select().single();
    if (error) throw error;
    return submission;
  },

  async getSubmissionsByUserId(userId: string): Promise<PsychSubmission[]> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("psych_submissions")
      .select("*, mansa_scenarios(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateSubmissionFeedback(id: string, feedback: string): Promise<PsychSubmission> {
    const supabase = getSupabaseAdminClient();
    const { data: submission, error } = await supabase
      .from("psych_submissions")
      .update<{ ai_feedback: string }>({ ai_feedback: feedback })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return submission;
  },
};