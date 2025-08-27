-- Fix the table naming issue where users_new still exists
-- This script will safely handle the transition

-- Step 1: Check current state and fix naming
DO $$
DECLARE
    users_new_exists BOOLEAN := FALSE;
    users_exists BOOLEAN := FALSE;
BEGIN
    -- Check if users_new table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users_new'
    ) INTO users_new_exists;
    
    -- Check if users table exists  
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
    ) INTO users_exists;
    
    RAISE NOTICE 'users_new exists: %, users exists: %', users_new_exists, users_exists;
    
    -- Case 1: Both tables exist (migration 007 partially failed)
    IF users_new_exists AND users_exists THEN
        RAISE NOTICE 'Both users and users_new exist - dropping old users table and renaming users_new';
        
        -- Drop the old users table (has subscription columns we don't want)
        DROP TABLE IF EXISTS users CASCADE;
        
        -- Rename users_new to users
        ALTER TABLE users_new RENAME TO users;
        
        RAISE NOTICE 'Renamed users_new to users';
        
    -- Case 2: Only users_new exists (migration 007 not run)
    ELSIF users_new_exists AND NOT users_exists THEN
        RAISE NOTICE 'Only users_new exists - renaming to users';
        
        -- Simply rename users_new to users
        ALTER TABLE users_new RENAME TO users;
        
        RAISE NOTICE 'Renamed users_new to users';
        
    -- Case 3: Only users exists (migration completed successfully)
    ELSIF NOT users_new_exists AND users_exists THEN
        RAISE NOTICE 'Only users exists - migration already completed successfully';
        
    -- Case 4: Neither exists (unexpected)
    ELSE
        RAISE EXCEPTION 'Neither users nor users_new table exists - database state is unexpected';
    END IF;
END $$;

-- Step 2: Ensure the users table has the correct structure
-- Add any missing columns that should be in the clean users table
DO $$
BEGIN
    -- Add display_name if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'display_name'
    ) THEN
        ALTER TABLE users ADD COLUMN display_name TEXT;
        RAISE NOTICE 'Added display_name column to users table';
    END IF;
    
    -- Add bio if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'bio'
    ) THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
        RAISE NOTICE 'Added bio column to users table';
    END IF;
END $$;

-- Step 3: Ensure correct constraints and indexes exist
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Step 4: Update any remaining function references
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate the trigger if needed
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at_column();

-- Step 5: Ensure RLS is properly configured
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 6: Recreate the view with correct table name
DROP VIEW IF EXISTS user_complete_profile;
CREATE OR REPLACE VIEW user_complete_profile AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.avatar_url,
    u.display_name,
    u.bio,
    u.created_at as user_created_at,
    u.updated_at as user_updated_at,
    
    -- Current subscription info (using correct column names from function)
    s.subscription_id,
    s.plan_type,
    s.status as subscription_status,
    s.monthly_token_limit,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    
    -- Usage summary (using correct column names from function)
    usage_summary.total_tokens_used as tokens_used_this_month,
    usage_summary.remaining_tokens as tokens_remaining,
    usage_summary.total_generations,
    usage_summary.successful_generations,
    usage_summary.usage_percentage,
    
    -- Auth info (if needed)
    auth_user.email_confirmed_at,
    auth_user.last_sign_in_at
    
FROM users u
LEFT JOIN LATERAL (
    SELECT * FROM get_user_active_subscription(u.id) LIMIT 1
) s ON true
LEFT JOIN LATERAL (
    SELECT * FROM get_user_monthly_usage(u.id) LIMIT 1
) usage_summary ON true
LEFT JOIN auth.users auth_user ON auth_user.id = u.id;

-- Step 7: Update the auth trigger to use correct table name
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    
    -- Create a free subscription for new users
    INSERT INTO public.subscriptions (user_id, plan_type, status, monthly_token_limit)
    VALUES (NEW.id, 'free', 'active', 5);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- Step 8: Final verification
DO $$
DECLARE
    table_count INTEGER;
    view_count INTEGER;
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count FROM information_schema.tables WHERE table_name = 'users';
    SELECT COUNT(*) INTO view_count FROM information_schema.views WHERE table_name = 'user_complete_profile';
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE tablename = 'users';
    
    RAISE NOTICE '=== DATABASE STRUCTURE VERIFICATION ===';
    RAISE NOTICE 'users table exists: %', table_count > 0;
    RAISE NOTICE 'user_complete_profile view exists: %', view_count > 0;
    RAISE NOTICE 'RLS policies count: %', policy_count;
    RAISE NOTICE 'Database structure is now properly configured!';
END $$;
