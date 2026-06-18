-- SSB NextGen Pro: Supabase Schema

-- 1. Test History Table
-- Replaces localStorage.getItem('testHistory')
CREATE TABLE IF NOT EXISTS test_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL, -- e.g., 'OIR Visual Test', 'PPDT Screening', 'PI CIQ'
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL,
    improvements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE test_history ENABLE ROW LEVEL SECURITY;

-- Create Policy: Users can only see their own history
CREATE POLICY "Users can view their own test history" ON test_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test history" ON test_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. User Profiles Table (Streak, XP, Gamification)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    lecturettes_completed INTEGER DEFAULT 0,
    last_active DATE DEFAULT CURRENT_DATE
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. GTO Ground 3D Progress
CREATE TABLE IF NOT EXISTS gto_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    obstacles_cleared TEXT[],
    time_spent INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gto_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gto progress" ON gto_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own gto progress" ON gto_progress FOR ALL USING (auth.uid() = user_id);

-- Trigger to create user_profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
