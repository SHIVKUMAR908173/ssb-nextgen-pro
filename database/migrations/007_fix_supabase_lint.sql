-- Migration to fix Supabase Linter warnings
-- 1. function_search_path_mutable
-- 2. pg_graphql_anon_table_exposed & pg_graphql_authenticated_table_exposed

-- Fix functions search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Fix pg_graphql_anon_table_exposed & pg_graphql_authenticated_table_exposed warnings
-- Since this project uses the standard Supabase JS Client (PostgREST) and not GraphQL,
-- the safest and most complete fix is to simply disable the GraphQL extension.
-- This immediately resolves all GraphQL exposure warnings without breaking RLS or PostgREST.
DROP EXTENSION IF EXISTS pg_graphql CASCADE;

-- Enable RLS on all tables in the public schema to fix "RLS Disabled in Public" and "Policy Exists RLS Disabled"
DO $$ 
DECLARE 
  t RECORD;
BEGIN 
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  LOOP 
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t.table_name); 
  END LOOP; 
END $$;
