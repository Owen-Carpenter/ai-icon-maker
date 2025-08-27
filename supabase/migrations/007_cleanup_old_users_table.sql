-- Cleanup script to remove old users table and rename users_new to users
-- Run this AFTER verifying the migration worked correctly

-- Check if migration 006 was run first
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_new') THEN
        RAISE EXCEPTION 'users_new table does not exist. Please run migration 006_migrate_users_to_new_schema.sql first.';
    END IF;
END $$;

-- Step 1: Drop old users table (contains subscription data that's now in subscriptions table)
-- CAUTION: Only run this after verifying data migration was successful
DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Rename users_new to users
ALTER TABLE users_new RENAME TO users;

-- Step 3: Update function references to use the new users table
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

-- Step 4: Drop old trigger first, then update function
DROP TRIGGER IF EXISTS update_users_new_updated_at ON users;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Step 5: Drop old function and create new one with correct name
DROP FUNCTION IF EXISTS update_users_new_updated_at_column();
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: Create trigger with new function name
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at_column();

-- Step 7: Update view to reference correct table name
DROP VIEW IF EXISTS user_with_subscription;
CREATE OR REPLACE VIEW user_with_subscription AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.avatar_url,
    u.display_name,
    u.bio,
    u.created_at,
    u.updated_at,
    s.plan_type,
    s.status as subscription_status,
    s.monthly_token_limit,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    COALESCE(monthly_usage.remaining_tokens, s.monthly_token_limit) as tokens_remaining,
    COALESCE(monthly_usage.total_tokens_used, 0) as tokens_used_this_month,
    COALESCE(monthly_usage.usage_percentage, 0) as usage_percentage
FROM users u
LEFT JOIN LATERAL (
    SELECT * FROM get_user_active_subscription(u.id) LIMIT 1
) s ON true
LEFT JOIN LATERAL (
    SELECT * FROM get_user_monthly_usage(u.id) LIMIT 1
) monthly_usage ON true;

-- Step 8: Update index names
DROP INDEX IF EXISTS users_new_email_idx;
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Step 9: Verify cleanup
DO $$
DECLARE
    users_count INTEGER;
    subscriptions_count INTEGER;
    usage_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO users_count FROM users;
    SELECT COUNT(*) INTO subscriptions_count FROM subscriptions;
    SELECT COUNT(*) INTO usage_count FROM usage_tracking;
    
    RAISE NOTICE 'Database cleanup completed:';
    RAISE NOTICE '- % users in clean users table', users_count;
    RAISE NOTICE '- % subscription records', subscriptions_count;
    RAISE NOTICE '- % usage tracking records', usage_count;
    RAISE NOTICE 'Schema refactoring complete!';
END $$;
