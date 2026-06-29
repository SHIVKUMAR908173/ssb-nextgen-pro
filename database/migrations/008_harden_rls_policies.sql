-- 008_harden_rls_policies.sql
-- Description: Hardens RLS policies by adding WITH CHECK constraints to UPDATE operations
-- to prevent users from mutating data out of their ownership.

-- 1. Harden user_profiles
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles 
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. Harden user_streaks (assuming it was created in 005/006)
DROP POLICY IF EXISTS "Users own data" ON user_streaks;
CREATE POLICY "Users own data" ON user_streaks 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

