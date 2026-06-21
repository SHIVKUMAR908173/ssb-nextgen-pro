-- SSB NextGen Pro — Supabase Schema Stabilization Migration
-- Execute this in Supabase Dashboard > SQL Editor
-- Safe to re-run (uses IF NOT EXISTS)

-- Core assessment tables
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  session_data JSONB,
  ai_feedback JSONB,
  olq_scores JSONB,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  profile_data JSONB NOT NULL,
  overall_score INTEGER,
  grade TEXT,
  recommendation_likelihood INTEGER,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour')
);

CREATE TABLE IF NOT EXISTS study_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  status TEXT DEFAULT 'not_started',
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exam, chapter_id)
);

CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_active_days INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  piq_context JSONB,
  conversation_history JSONB,
  overall_score INTEGER,
  grade TEXT,
  category_scores JSONB,
  io_notes TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcard_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id INTEGER NOT NULL,
  difficulty TEXT,
  next_review_date DATE DEFAULT CURRENT_DATE,
  review_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam TEXT,
  chapter_id TEXT,
  score INTEGER,
  total_questions INTEGER,
  answers JSONB,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  chapter_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fitness_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  pushups INTEGER,
  situps INTEGER,
  pullups INTEGER,
  run_km NUMERIC(4,2),
  run_time_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
DO $$ DECLARE t TEXT;
BEGIN FOR t IN SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name IN (
    'assessment_sessions','assessment_profiles','study_progress',
    'user_streaks','interview_sessions','flashcard_progress',
    'quiz_attempts','study_notes','fitness_logs')
LOOP EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t); END LOOP; END $$;

-- RLS policies — users see only their own data
DO $$ DECLARE t TEXT;
BEGIN FOR t IN VALUES ('assessment_sessions'),('assessment_profiles'),
  ('study_progress'),('user_streaks'),('interview_sessions'),
  ('flashcard_progress'),('quiz_attempts'),('study_notes'),('fitness_logs')
LOOP
  EXECUTE format('DROP POLICY IF EXISTS "select_own" ON %I', t);
  EXECUTE format('DROP POLICY IF EXISTS "insert_own" ON %I', t);
  EXECUTE format('DROP POLICY IF EXISTS "update_own" ON %I', t);
  EXECUTE format('CREATE POLICY "select_own" ON %I FOR SELECT USING (auth.uid() = user_id)', t);
  EXECUTE format('CREATE POLICY "insert_own" ON %I FOR INSERT WITH CHECK (auth.uid() = user_id)', t);
  EXECUTE format('CREATE POLICY "update_own" ON %I FOR UPDATE USING (auth.uid() = user_id)', t);
END LOOP; END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_created ON assessment_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_progress_user ON study_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user ON user_streaks(user_id);

-- Enable realtime for dashboard subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE assessment_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE user_streaks;

-- PIQ Submissions
CREATE TABLE IF NOT EXISTS piq_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_details JSONB,
  education_details JSONB,
  hobbies_sports JSONB,
  ssb_history JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE piq_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_own" ON piq_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON piq_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own" ON piq_submissions FOR UPDATE USING (auth.uid() = user_id);
