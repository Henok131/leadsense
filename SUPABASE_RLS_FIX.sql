-- ============================================================
-- FIX: Allow Anonymous Read Access to Leads Table
-- ============================================================
-- 
-- PROBLEM: Dashboard shows 0 leads even though table has 7 rows
-- CAUSE: Row Level Security (RLS) is blocking anonymous reads
-- 
-- SOLUTION: Create a policy to allow anonymous SELECT access
-- ============================================================

-- Step 1: Check if RLS is enabled (run this first)
SELECT 
  tablename, 
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'leads';

-- Step 2: Check existing policies (if any)
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd as "Command",
  qual as "Using Expression"
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename = 'leads';

-- Step 3: CREATE POLICY to allow anonymous read access
-- This allows unauthenticated (anonymous) users to SELECT all leads
CREATE POLICY IF NOT EXISTS "Allow anonymous read access"
ON public.leads
FOR SELECT
TO anon
USING (true);

-- Step 4: If you also want authenticated users to read (optional)
CREATE POLICY IF NOT EXISTS "Allow authenticated read access"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- Alternative: Allow ALL public access (both anon and authenticated)
-- Uncomment below if you want a simpler policy:
/*
CREATE POLICY IF NOT EXISTS "Allow public read access"
ON public.leads
FOR SELECT
TO public
USING (true);
*/

-- Step 5: Verify the policy was created
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd as "Command"
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename = 'leads';

-- ============================================================
-- NOTES:
-- ============================================================
-- 1. "anon" role = Anonymous/unauthenticated users
-- 2. "authenticated" role = Logged-in users
-- 3. "public" = Both anon and authenticated
-- 4. USING (true) = Allow all rows (no filtering)
-- 
-- For production, you might want to restrict access:
-- - USING (user_id = auth.uid()) - Only see own leads
-- - USING (status = 'published') - Only see published leads
-- - etc.
-- ============================================================

