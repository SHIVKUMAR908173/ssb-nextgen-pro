-- ===========================================
-- SSB NextGen Pro — COMPLETE Database Setup
-- ===========================================
-- Run this ONCE in the Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- ===========================================

-- ███████████████████████████████████████████
-- PART 1: SCHEMA (Tables)
-- ███████████████████████████████████████████

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- OIR Tests Table
CREATE TABLE IF NOT EXISTS oir_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('Verbal', 'Non-Verbal')),
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Test Results
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    test_id UUID REFERENCES oir_tests(id),
    score INTEGER,
    total_questions INTEGER,
    time_taken INTEGER, -- in seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vacha: Interview Bank
CREATE TABLE IF NOT EXISTS vacha_interview_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    question_text TEXT NOT NULL,
    ideal_points TEXT[],
    difficulty TEXT DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vacha: GD Topics
CREATE TABLE IF NOT EXISTS vacha_gd_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    lead_points TEXT[],
    background_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mansa: Psychology Scenarios (TAT/PPDT/WAT/SRT)
CREATE TABLE IF NOT EXISTS mansa_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_type TEXT CHECK (test_type IN ('TAT', 'PPDT', 'WAT', 'SRT')),
    prompt_text TEXT,
    image_url TEXT,
    suggested_themes TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Psychology Test Submissions
CREATE TABLE IF NOT EXISTS psych_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    scenario_id UUID REFERENCES mansa_scenarios(id),
    test_type TEXT CHECK (test_type IN ('TAT', 'WAT', 'SRT', 'SD')),
    content JSONB,
    ai_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ███████████████████████████████████████████
-- PART 2: ROW LEVEL SECURITY (RLS)
-- ███████████████████████████████████████████

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE oir_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacha_interview_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacha_gd_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE mansa_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- OIR Tests policies (public read)
CREATE POLICY "Everyone can view OIR tests"
ON oir_tests FOR SELECT USING (true);

CREATE POLICY "Admins can manage OIR tests"
ON oir_tests FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- Test Results policies
CREATE POLICY "Users can view own test results"
ON test_results FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results"
ON test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own test results"
ON test_results FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all test results"
ON test_results FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- Interview Bank policies (public read)
CREATE POLICY "Everyone can view interview questions"
ON vacha_interview_bank FOR SELECT USING (true);

CREATE POLICY "Admins can manage interview questions"
ON vacha_interview_bank FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- GD Topics policies (public read)
CREATE POLICY "Everyone can view GD topics"
ON vacha_gd_topics FOR SELECT USING (true);

CREATE POLICY "Admins can manage GD topics"
ON vacha_gd_topics FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- Psychology Scenarios policies (public read)
CREATE POLICY "Everyone can view psychology scenarios"
ON mansa_scenarios FOR SELECT USING (true);

CREATE POLICY "Admins can manage psychology scenarios"
ON mansa_scenarios FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- Psych Submissions policies
CREATE POLICY "Users can view own psych submissions"
ON psych_submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own psych submissions"
ON psych_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own psych submissions"
ON psych_submissions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all psych submissions"
ON psych_submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);

-- Audit Log policies (admin only)
CREATE POLICY "Admins can view audit logs"
ON audit_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.role = 'admin')
);


-- ███████████████████████████████████████████
-- PART 3: INDEXES & HELPER FUNCTIONS
-- ███████████████████████████████████████████

CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at ON test_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_psych_submissions_user_id ON psych_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_psych_submissions_created_at ON psych_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Helper function: get current user ID
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS uuid AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ███████████████████████████████████████████
-- DONE! All 8 tables, 15 RLS policies,
-- 5 indexes, and 3 helper functions created.
-- ███████████████████████████████████████████
