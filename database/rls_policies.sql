-- ===========================================
-- Row Level Security (RLS) Policies for SSB NextGen Pro
-- ===========================================
-- This file contains RLS policies to secure database access
-- Run this script in your Supabase SQL editor or via migration

-- ===========================================
-- Enable RLS on all tables
-- ===========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE oir_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacha_interview_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacha_gd_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE mansa_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_submissions ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- Users Table Policies
-- ===========================================

-- Users can read their own data
CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own data (during signup)
CREATE POLICY "Users can insert own profile"
ON users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
ON users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  )
);

-- ===========================================
-- OIR Tests Policies
-- ===========================================

-- Everyone can read OIR tests (they are public content)
CREATE POLICY "Everyone can view OIR tests"
ON oir_tests
FOR SELECT
USING (true);

-- Only admins can modify OIR tests
CREATE POLICY "Admins can manage OIR tests"
ON oir_tests
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  )
);

-- ===========================================
-- Test Results Policies
-- ===========================================

-- Users can view their own test results
CREATE POLICY "Users can view own test results"
ON test_results
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own test results
CREATE POLICY "Users can insert own test results"
ON test_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own test results
CREATE POLICY "Users can update own test results"
ON test_results
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all test results
CREATE POLICY "Admins can view all test results"
ON test_results
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  )
);

-- ===========================================
-- Interview Bank Policies
-- ===========================================

-- Everyone can read interview questions (they are public content)
CREATE POLICY "Everyone can view interview questions"
ON vacha_interview_bank
FOR SELECT
USING (true);

-- Only admins can modify interview questions
CREATE POLICY "Admins can manage interview questions"
ON vacha_interview_bank
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  )
);

-- ===========================================
-- GD Topics Policies
-- ===========================================

-- Everyone can read GD topics (they are public content)
CREATE POLICY "Everyone can view GD topics"
ON vacha_gd_topics
FOR SELECT
USING (true);

-- Only admins can modify GD topics
CREATE POLICY "Admins can manage GD topics"
ON vacha_gd_topics
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  )
);

-- ===========================================
-- Mansa Scenarios Policies
-- ===========================================

-- Everyone can read psychology scenarios (they are public content)
CREATE POLICY "Everyone can view psychology scenarios"
ON mansa_scenarios
FOR SELECT
USING (true);

-- Only admins can modify psychology scenarios
CREATE POLICY "Admins can manage psychology scenarios"
ON mansa_scenarios
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  )
);

-- ===========================================
-- Psych Submissions Policies
-- ===========================================

-- Users can view their own psychology submissions
CREATE POLICY "Users can view own psych submissions"
ON psych_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own psych submissions
CREATE POLICY "Users can insert own psych submissions"
ON psych_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own psych submissions
CREATE POLICY "Users can update own psych submissions"
ON psych_submissions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all psych submissions
CREATE POLICY "Admins can view all psych submissions"
ON psych_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  )
);

-- ===========================================
-- Helper Functions
-- ===========================================

-- Function to get current user ID (works with or without auth)
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS uuid AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is admin
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

-- ===========================================
-- Indexes for Performance
-- ===========================================

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at ON test_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_psych_submissions_user_id ON psych_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_psych_submissions_created_at ON psych_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ===========================================
-- Triggers for Automatic Timestamps
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- Audit Log Table (Optional)
-- ===========================================

-- Create audit log table for tracking changes
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

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  )
);

-- ===========================================
-- End of RLS Policies
-- ===========================================

-- ===========================================
-- OLQ Assessments Policies
-- ===========================================
ALTER TABLE olq_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own OLQ assessments"
ON olq_assessments FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can insert OLQ assessments"
ON olq_assessments FOR INSERT
WITH CHECK (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

CREATE POLICY "No user updates on OLQ assessments"
ON olq_assessments FOR UPDATE USING (false);

CREATE POLICY "No user deletes on OLQ assessments"
ON olq_assessments FOR DELETE USING (false);

-- ===========================================
-- GTO Progress & Sessions Policies
-- ===========================================
ALTER TABLE gto_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE gto_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own GTO progress"
ON gto_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own GTO progress"
ON gto_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own GTO sessions"
ON gto_sessions FOR SELECT USING (auth.uid() = user_id);