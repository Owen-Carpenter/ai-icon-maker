-- Migration script to refactor existing users table and move subscription data to subscriptions table
-- This migration preserves existing data while implementing the new schema

-- Step 1: Create a clean users table with minimal fields
CREATE TABLE IF NOT EXISTS users_new (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    
    -- Basic profile information only
    display_name TEXT,
    bio TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Migrate existing user data (excluding subscription fields)
INSERT INTO users_new (id, email, full_name, avatar_url, created_at, updated_at)
SELECT 
    id,
    email,
    full_name,
    avatar_url,
    COALESCE(created_at, NOW()),
    COALESCE(updated_at, NOW())
FROM users
ON CONFLICT (id) DO NOTHING;

-- Step 3: Migrate subscription data from users table to subscriptions table (if columns exist)
DO $$
DECLARE
    has_subscription_columns BOOLEAN := FALSE;
BEGIN
    -- Check if the users table has subscription columns
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'stripe_customer_id'
    ) INTO has_subscription_columns;
    
    -- Only migrate subscription data if the columns exist
    IF has_subscription_columns THEN
        INSERT INTO subscriptions (
            user_id,
            stripe_customer_id,
            stripe_subscription_id,
            plan_type,
            status,
            current_period_start,
            current_period_end,
            cancel_at_period_end,
            monthly_token_limit,
            created_at,
            updated_at
        )
        SELECT 
            u.id as user_id,
            u.stripe_customer_id,
            u.stripe_subscription_id,
            CASE 
                WHEN u.subscription_plan = 'unlimited' THEN 'enterprise'
                WHEN u.subscription_plan = 'pro' THEN 'pro'
                ELSE 'free'
            END as plan_type,
            COALESCE(u.subscription_status, 'inactive') as status,
            u.subscription_current_period_start,
            u.subscription_current_period_end,
            COALESCE(u.subscription_cancel_at_period_end, FALSE),
            CASE 
                WHEN u.subscription_plan = 'unlimited' THEN 200  -- Enterprise gets 200 tokens
                WHEN u.subscription_plan = 'pro' THEN 100        -- Pro gets 100 tokens
                ELSE 5                                           -- Free gets 5 tokens
            END as monthly_token_limit,
            COALESCE(u.created_at, NOW()),
            COALESCE(u.updated_at, NOW())
        FROM users u
        WHERE u.stripe_customer_id IS NOT NULL OR u.subscription_status != 'inactive'
        ON CONFLICT (stripe_subscription_id) DO UPDATE SET
            plan_type = EXCLUDED.plan_type,
            status = EXCLUDED.status,
            current_period_start = EXCLUDED.current_period_start,
            current_period_end = EXCLUDED.current_period_end,
            cancel_at_period_end = EXCLUDED.cancel_at_period_end,
            monthly_token_limit = EXCLUDED.monthly_token_limit,
            updated_at = NOW();
            
        RAISE NOTICE 'Migrated existing subscription data from users table';
    ELSE
        -- Create default free subscriptions for all existing users
        INSERT INTO subscriptions (user_id, plan_type, status, monthly_token_limit)
        SELECT u.id, 'free', 'active', 5
        FROM users u
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Created default free subscriptions for all users (no existing subscription data found)';
    END IF;
END $$;

-- Step 4: Migrate usage data from users table to usage_tracking table (if columns exist)
DO $$
DECLARE
    has_usage_columns BOOLEAN := FALSE;
BEGIN
    -- Check if the users table has usage tracking columns
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'total_generations_used'
    ) INTO has_usage_columns;
    
    -- Only migrate usage data if the columns exist
    IF has_usage_columns THEN
        INSERT INTO usage_tracking (
            user_id,
            subscription_id,
            tokens_used,
            usage_type,
            generation_successful,
            billing_period_start,
            billing_period_end,
            created_at
        )
        SELECT 
            u.id as user_id,
            s.id as subscription_id,
            GREATEST(0, 
                CASE 
                    WHEN u.subscription_plan = 'unlimited' THEN 200
                    WHEN u.subscription_plan = 'pro' THEN 100
                    ELSE 5
                END - COALESCE(u.credits_remaining, 0)
            ) as tokens_used,
            'icon_generation' as usage_type,
            TRUE as generation_successful,
            COALESCE(s.current_period_start, date_trunc('month', NOW())) as billing_period_start,
            COALESCE(s.current_period_end, date_trunc('month', NOW()) + INTERVAL '1 month') as billing_period_end,
            COALESCE(u.last_generation_at, u.updated_at, NOW()) as created_at
        FROM users u
        LEFT JOIN subscriptions s ON s.user_id = u.id
        WHERE u.total_generations_used > 0 OR u.credits_remaining < 
            CASE 
                WHEN u.subscription_plan = 'unlimited' THEN 200
                WHEN u.subscription_plan = 'pro' THEN 100
                ELSE 5
            END;
            
        RAISE NOTICE 'Migrated existing usage data from users table';
    ELSE
        RAISE NOTICE 'No existing usage data found to migrate (users table has no usage columns)';
    END IF;
END $$;

-- Step 5: Enable RLS and create policies for new users table
ALTER TABLE users_new ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users_new
DROP POLICY IF EXISTS "Users can view own profile" ON users_new;
CREATE POLICY "Users can view own profile" ON users_new
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users_new;
CREATE POLICY "Users can update own profile" ON users_new
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users_new;
CREATE POLICY "Users can insert own profile" ON users_new
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 6: Create updated_at trigger for users_new
CREATE OR REPLACE FUNCTION update_users_new_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_new_updated_at ON users_new;
CREATE TRIGGER update_users_new_updated_at
    BEFORE UPDATE ON users_new
    FOR EACH ROW
    EXECUTE FUNCTION update_users_new_updated_at_column();

-- Step 7: Update auth trigger to use new users table
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users_new (id, email, full_name)
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

-- Step 8: Create indexes for users_new
CREATE INDEX IF NOT EXISTS users_new_email_idx ON users_new(email);

-- Step 9: Create helpful views and functions
-- View to get user with current subscription info
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
FROM users_new u
LEFT JOIN LATERAL (
    SELECT * FROM get_user_active_subscription(u.id) LIMIT 1
) s ON true
LEFT JOIN LATERAL (
    SELECT * FROM get_user_monthly_usage(u.id) LIMIT 1
) monthly_usage ON true;

-- Function to check if user has active subscription (updated)
CREATE OR REPLACE FUNCTION public.user_has_active_subscription(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    subscription_record RECORD;
BEGIN
    SELECT * INTO subscription_record
    FROM get_user_active_subscription(user_id) 
    LIMIT 1;
    
    RETURN subscription_record IS NOT NULL 
           AND subscription_record.status IN ('active', 'trialing')
           AND (subscription_record.current_period_end IS NULL OR subscription_record.current_period_end > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Add helpful comments
COMMENT ON TABLE subscriptions IS 'Stores subscription information separately from user profiles';
COMMENT ON TABLE usage_tracking IS 'Tracks token usage over time with detailed context';
COMMENT ON TABLE users_new IS 'Clean user profiles table without subscription clutter';
COMMENT ON VIEW user_with_subscription IS 'Convenient view combining user profile with current subscription and usage data';

-- Step 11: Print migration summary
DO $$
DECLARE
    users_migrated INTEGER;
    subscriptions_created INTEGER;
    usage_records_created INTEGER;
BEGIN
    SELECT COUNT(*) INTO users_migrated FROM users_new;
    SELECT COUNT(*) INTO subscriptions_created FROM subscriptions;
    SELECT COUNT(*) INTO usage_records_created FROM usage_tracking;
    
    RAISE NOTICE 'Migration completed successfully:';
    RAISE NOTICE '- % user profiles migrated', users_migrated;
    RAISE NOTICE '- % subscription records created', subscriptions_created;
    RAISE NOTICE '- % usage records created', usage_records_created;
    RAISE NOTICE 'New schema is ready for use!';
END $$;
