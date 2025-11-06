-- Fix RLS performance issues by wrapping auth.uid() in SELECT
-- This prevents re-evaluation for each row and improves query performance at scale
-- See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================

-- Fix "Users can view own subscription" policy
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING ((select auth.uid()) = user_id);

-- Fix "Users can update own subscription" policy
DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
CREATE POLICY "Users can update own subscription" ON subscriptions
    FOR UPDATE USING ((select auth.uid()) = user_id);

-- Fix "Users can insert own subscription" policy
DROP POLICY IF EXISTS "Users can insert own subscription" ON subscriptions;
CREATE POLICY "Users can insert own subscription" ON subscriptions
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- USAGE_TRACKING TABLE
-- ============================================================================

-- Fix "Users can view own usage" policy
DROP POLICY IF EXISTS "Users can view own usage" ON usage_tracking;
CREATE POLICY "Users can view own usage" ON usage_tracking
    FOR SELECT USING ((select auth.uid()) = user_id);

-- Fix "Users can insert own usage" policy
DROP POLICY IF EXISTS "Users can insert own usage" ON usage_tracking;
CREATE POLICY "Users can insert own usage" ON usage_tracking
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- USERS TABLE
-- ============================================================================

-- Remove duplicate SELECT policies and create optimized ones
-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own record" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create optimized, non-duplicate policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- Keep service role policy if it exists
-- (This is a restrictive policy, so it's fine to keep it)

-- ============================================================================
-- ICONS TABLE
-- ============================================================================

-- Fix "Users can view their own icons" policy
DROP POLICY IF EXISTS "Users can view their own icons" ON icons;
CREATE POLICY "Users can view their own icons" ON icons
    FOR SELECT USING ((select auth.uid()) = user_id);

-- Fix "Users can insert their own icons" policy
DROP POLICY IF EXISTS "Users can insert their own icons" ON icons;
CREATE POLICY "Users can insert their own icons" ON icons
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- Fix "Users can update their own icons" policy
DROP POLICY IF EXISTS "Users can update their own icons" ON icons;
CREATE POLICY "Users can update their own icons" ON icons
    FOR UPDATE USING ((select auth.uid()) = user_id);

-- Fix "Users can delete their own icons" policy
DROP POLICY IF EXISTS "Users can delete their own icons" ON icons;
CREATE POLICY "Users can delete their own icons" ON icons
    FOR DELETE USING ((select auth.uid()) = user_id);

-- ============================================================================
-- SUMMARY
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '=== RLS PERFORMANCE FIXES APPLIED ===';
    RAISE NOTICE 'All auth.uid() calls wrapped in (select auth.uid())';
    RAISE NOTICE 'Duplicate policies on users table removed';
    RAISE NOTICE 'All RLS policies now optimized for performance';
END $$;

