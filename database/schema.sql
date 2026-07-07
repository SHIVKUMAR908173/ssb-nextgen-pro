-- SSB NextGen Professional Database Schema
-- Compatible with PostgreSQL/Supabase

-- Users Table
CREATE TABLE users
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP
    WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
    WITH TIME ZONE
);

    -- OIR Tests Table
    CREATE TABLE oir_tests
    (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        set_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        type TEXT CHECK (type IN ('Verbal', 'Non-Verbal')),
        difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
        created_at TIMESTAMP
        WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

        -- User Test Results
        CREATE TABLE test_results
        (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id),
            test_id UUID REFERENCES oir_tests(id),
            score INTEGER,
            total_questions INTEGER,
            time_taken INTEGER,
            -- in seconds
            completed_at TIMESTAMP
            WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

            -- Vacha: Interview Bank
            CREATE TABLE vacha_interview_bank
            (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                category TEXT NOT NULL,
                question_text TEXT NOT NULL,
                ideal_points TEXT
                [], -- Array of points that should be covered in the answer
    difficulty TEXT DEFAULT 'Medium',
    created_at TIMESTAMP
                WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

                -- Vacha: GD Topics
                CREATE TABLE vacha_gd_topics
                (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    title TEXT NOT NULL,
                    lead_points TEXT
                    [], -- The three lead options for the GD
    background_info TEXT,
    created_at TIMESTAMP
                    WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

                    -- Mansa: Psychology Scenarios (TAT/PPDT/WAT/SRT)
                    CREATE TABLE mansa_scenarios
                    (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        test_type TEXT CHECK (test_type IN ('TAT', 'PPDT', 'WAT', 'SRT')),
                        prompt_text TEXT,
                        -- For WAT/SRT
                        image_url TEXT,
                        -- For TAT/PPDT
                        suggested_themes TEXT
                        [],
    created_at TIMESTAMP
                        WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

                        -- Psychology Test Submissions (TAT, WAT, SRT)
                        CREATE TABLE psych_submissions
                        (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            user_id UUID REFERENCES users(id),
                            scenario_id UUID REFERENCES mansa_scenarios(id),
                            test_type TEXT CHECK (test_type IN ('TAT', 'WAT', 'SRT', 'SD')),
                            content JSONB,
                            -- Stores the actual responses
                            ai_feedback TEXT,
                            created_at TIMESTAMP
                            WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

                            -- GTO Virtual Ground Progress
                            CREATE TABLE gto_progress
                            (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                                level_id INTEGER NOT NULL,
                                level_type TEXT CHECK (level_type IN ('PGT', 'HGT', 'CT', 'FGT')),
                                completed BOOLEAN DEFAULT FALSE,
                                stars INTEGER CHECK (stars >= 0 AND stars <= 3) DEFAULT 0,
                                best_score INTEGER DEFAULT 0,
                                time_taken INTEGER,
                                -- in seconds
                                attempts INTEGER DEFAULT 0,
                                best_completion JSONB,
                                -- Stores the best completion data (tools used, path taken, etc.)
                                last_played TIMESTAMP
                                WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP
                                WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
                                WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE
                                (user_id, level_id)
);

                                -- GTO Game Sessions (for analytics and replay)
                                CREATE TABLE gto_sessions
                                (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                                    level_id INTEGER NOT NULL,
                                    session_data JSONB,
                                    -- Full session recording for replay
                                    score INTEGER DEFAULT 0,
                                    completed BOOLEAN DEFAULT FALSE,
                                    violations INTEGER DEFAULT 0,
                                    -- Rule violations during session
                                    duration INTEGER,
                                    -- Session duration in seconds
                                    created_at TIMESTAMP
                                    WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

                                    -- Leaderboard view for GTO
                                    CREATE OR REPLACE VIEW gto_leaderboard AS
                                    SELECT
                                        u.id as user_id,
                                        u.full_name,
                                        u.email,
                                        COUNT(gp.id) as levels_completed,
                                        SUM(gp.stars) as total_stars,
                                        SUM(gp.best_score) as total_score,
                                        AVG(CASE WHEN gp.completed THEN gp.time_taken ELSE NULL END) as avg_completion_time
                                    FROM users u
                                        LEFT JOIN gto_progress gp ON u.id = gp.user_id
                                    WHERE gp.completed = TRUE
                                    GROUP BY u.id, u.full_name, u.email
                                    ORDER BY total_score DESC, total_stars DESC, levels_completed DESC;

                                    -- Indexes for performance
                                    CREATE INDEX idx_gto_progress_user_id ON gto_progress(user_id);
                                    CREATE INDEX idx_gto_progress_level_id ON gto_progress(level_id);
                                    CREATE INDEX idx_gto_progress_completed ON gto_progress(completed);
                                    CREATE INDEX idx_gto_sessions_user_id ON gto_sessions(user_id);
                                    CREATE INDEX idx_gto_sessions_created_at ON gto_sessions(created_at);

                                    -- Additional Enterprise Performance Indexes
                                    CREATE INDEX idx_test_results_user_id ON test_results(user_id);
                                    CREATE INDEX idx_test_results_test_id ON test_results(test_id);
                                    CREATE INDEX idx_psych_submissions_user_id ON psych_submissions(user_id);
                                    CREATE INDEX idx_psych_submissions_created_at ON psych_submissions(created_at DESC);
                                    CREATE INDEX idx_psych_submissions_content_gin ON psych_submissions USING GIN (content);