-- Drop the old table if it exists
DROP TABLE IF EXISTS public.gto_progress;
DROP TABLE IF EXISTS public.gto_sessions;

-- 1. GTO Level Progress Table
CREATE TABLE IF NOT EXISTS public.gto_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    level_id INTEGER NOT NULL,
    level_type VARCHAR(10) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    stars INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    time_taken INTEGER,
    attempts INTEGER DEFAULT 0,
    best_completion JSONB,
    last_played TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, level_id)
);

-- Row Level Security
ALTER TABLE public.gto_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gto progress" ON public.gto_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gto progress" ON public.gto_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gto progress" ON public.gto_progress FOR UPDATE USING (auth.uid() = user_id);

-- 2. GTO Full Sessions Table
CREATE TABLE IF NOT EXISTS public.gto_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    level_id INTEGER NOT NULL,
    session_data JSONB,
    score INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    violations INTEGER DEFAULT 0,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.gto_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gto sessions" ON public.gto_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gto sessions" ON public.gto_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
