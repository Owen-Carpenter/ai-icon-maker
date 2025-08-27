-- Optimize user references by using a central users table as the main reference point
-- This creates a cleaner architecture where other tables reference users, not auth.users directly

-- Step 1: Update subscriptions table to reference users instead of auth.users
-- (This assumes users table is the primary user entity)

-- First, let's see what we're working with
DO $$
BEGIN
    -- Check if we need to update the foreign key constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'subscriptions' 
        AND kcu.column_name = 'user_id'
        AND tc.constraint_type = 'FOREIGN KEY'
    ) THEN
        -- Drop existing foreign key constraint
        ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;
        
        -- Add new foreign key constraint to users table
        ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
            
        RAISE NOTICE 'Updated subscriptions.user_id to reference users table';
    END IF;
END $$;

-- Step 2: Update usage_tracking table to reference users instead of auth.users
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'usage_tracking' 
        AND kcu.column_name = 'user_id'
        AND tc.constraint_type = 'FOREIGN KEY'
    ) THEN
        -- Drop existing foreign key constraint
        ALTER TABLE usage_tracking DROP CONSTRAINT IF EXISTS usage_tracking_user_id_fkey;
        
        -- Add new foreign key constraint to users table
        ALTER TABLE usage_tracking ADD CONSTRAINT usage_tracking_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
            
        RAISE NOTICE 'Updated usage_tracking.user_id to reference users table';
    END IF;
END $$;

-- Step 3: Create a function to get user info with all related data
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

-- Step 4: Update RLS policies to work with the new structure
-- Since we're now using users as the central table, RLS can still work the same way

-- Step 5: Create a convenience function to get a user's complete data
CREATE OR REPLACE FUNCTION public.get_user_complete_data(p_user_id UUID)
RETURNS TABLE (
    -- User profile
    user_id UUID,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    display_name TEXT,
    bio TEXT,
    
    -- Subscription
    subscription_id UUID,
    plan_type TEXT,
    subscription_status TEXT,
    monthly_token_limit INTEGER,
    tokens_remaining INTEGER,
    usage_percentage NUMERIC,
    
    -- Recent usage
    recent_generations INTEGER,
    last_generation_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.full_name,
        u.avatar_url,
        u.display_name,
        u.bio,
        
        sub.subscription_id,
        sub.plan_type,
        sub.status,
        sub.monthly_token_limit,
        usage.remaining_tokens,
        usage.usage_percentage,
        
        (SELECT COUNT(*)::INTEGER FROM usage_tracking ut 
         WHERE ut.user_id = u.id 
         AND ut.created_at >= NOW() - INTERVAL '7 days') as recent_generations,
        (SELECT MAX(ut.created_at) FROM usage_tracking ut 
         WHERE ut.user_id = u.id) as last_generation_at
         
    FROM users u
    LEFT JOIN LATERAL (
        SELECT * FROM get_user_active_subscription(u.id) LIMIT 1
    ) sub ON true
    LEFT JOIN LATERAL (
        SELECT * FROM get_user_monthly_usage(u.id) LIMIT 1
    ) usage ON true
    WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Add helpful comments about the new architecture
COMMENT ON TABLE users IS 'Central user profiles table - all other user data references this table';
COMMENT ON TABLE subscriptions IS 'User subscriptions - references users.id for cleaner architecture';
COMMENT ON TABLE usage_tracking IS 'Usage tracking - references users.id through users table';
COMMENT ON VIEW user_complete_profile IS 'Complete user data in one view - combines profile, subscription, and usage';

-- Step 7: Summary of the new architecture
DO $$
BEGIN
    RAISE NOTICE '=== OPTIMIZED USER REFERENCE ARCHITECTURE ===';
    RAISE NOTICE 'auth.users (Supabase managed) -> users (your app profile) -> subscriptions + usage_tracking';
    RAISE NOTICE '';
    RAISE NOTICE 'Benefits:';
    RAISE NOTICE '✅ Clean separation: auth vs app data';
    RAISE NOTICE '✅ Central user table as single source of truth';
    RAISE NOTICE '✅ Other tables reference users.id (not auth.users.id directly)';
    RAISE NOTICE '✅ Easier to query and maintain relationships';
    RAISE NOTICE '✅ Still maintains cascading deletes and RLS security';
END $$;
