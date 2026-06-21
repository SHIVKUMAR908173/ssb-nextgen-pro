-- Assessment Sessions (universal — all test types)
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL, -- 'tat','wat','srt','sd','gd','gpe','oir','ppdt','interview','lecturette','io','pgt'
  session_data JSONB, -- stores all answers/inputs
  ai_feedback JSONB, -- stores AI evaluation result
  score INTEGER CHECK (score >= 0 AND score <= 100),
  olq_scores JSONB, -- { effectiveIntelligence: 7, powerOfExpression: 8, ... }
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cached Assessment Profile (ML engine output)
CREATE TABLE IF NOT EXISTS assessment_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  profile_data JSONB NOT NULL, -- full AssessmentProfile object
  overall_score INTEGER,
  grade TEXT,
  recommendation_likelihood INTEGER,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Study Progress (per topic)
CREATE TABLE IF NOT EXISTS study_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  topic_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'not_started',
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exam, chapter_id)
);

-- Flashcard Progress (spaced repetition)
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

-- Quiz Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam TEXT,
  chapter_id TEXT,
  score INTEGER,
  total_questions INTEGER,
  answers JSONB,
  weak_topics JSONB,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Sessions
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  piq_context JSONB,
  conversation_history JSONB, -- [{role, content, score, feedback}]
  overall_score INTEGER,
  grade TEXT,
  category_scores JSONB,
  io_notes TEXT, -- AI-generated IO observation notes
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_active_days INTEGER DEFAULT 0
);

-- Study Notes
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

-- Revision Plans
CREATE TABLE IF NOT EXISTS revision_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam TEXT NOT NULL,
  exam_date DATE NOT NULL,
  daily_hours INTEGER,
  weak_topics TEXT[],
  plan JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ALL tables
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users see only their own data)
CREATE POLICY "Users own data" ON assessment_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON assessment_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON study_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON flashcard_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON quiz_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON interview_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON user_streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON study_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON revision_plans FOR ALL USING (auth.uid() = user_id);
