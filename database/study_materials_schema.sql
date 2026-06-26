-- ==============================================================================
-- STUDY MATERIALS SCHEMA (SuperKalam-Style Knowledge Base)
-- ==============================================================================

-- 1. Create the main study_materials table
CREATE TABLE IF NOT EXISTS public.study_materials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'nda', 'cds', 'afcat', 'ssb'
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    theme_color VARCHAR(50) DEFAULT 'olive',
    syllabus_blueprint JSONB NOT NULL DEFAULT '[]'::jsonb,
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    practice_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    pdf_vault JSONB NOT NULL DEFAULT '[]'::jsonb,
    video_vault JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Allow anyone (authenticated or anonymous) to SELECT (read) study materials
CREATE POLICY "Allow public read access to study materials" 
    ON public.study_materials FOR SELECT 
    USING (true);

-- Only service role (admin) can insert/update/delete
CREATE POLICY "Allow service role full access" 
    ON public.study_materials FOR ALL 
    USING (auth.jwt() ->> 'role' = 'service_role');

-- 4. Create trigger to automatically update 'updated_at'
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER on_study_materials_updated
    BEFORE UPDATE ON public.study_materials
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
