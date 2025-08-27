-- Fix function return type mismatches (bigint vs integer)
-- The error indicates functions are returning bigint when integer is expected

-- Fix get_user_monthly_usage function return types
CREATE OR REPLACE FUNCTION public.get_user_monthly_usage(p_user_id UUID)
RETURNS TABLE (
    total_tokens_used INTEGER,
    total_generations INTEGER,
    successful_generations INTEGER,
    failed_generations INTEGER,
    monthly_limit INTEGER,
    remaining_tokens INTEGER,
    usage_percentage NUMERIC
) AS $$
DECLARE
    user_subscription RECORD;
    usage_stats RECORD;
BEGIN
    -- Get user's active subscription
    SELECT * INTO user_subscription
    FROM get_user_active_subscription(p_user_id) 
    LIMIT 1;
    
    -- If no active subscription, return free tier limits
    IF user_subscription IS NULL THEN
        SELECT 
            COALESCE(SUM(ut.tokens_used), 0)::INTEGER as total_used,
            COALESCE(COUNT(*), 0)::INTEGER as total_gens,
            COALESCE(SUM(CASE WHEN ut.generation_successful THEN 1 ELSE 0 END), 0)::INTEGER as successful_gens,
            COALESCE(SUM(CASE WHEN NOT ut.generation_successful THEN 1 ELSE 0 END), 0)::INTEGER as failed_gens
        INTO usage_stats
        FROM usage_tracking ut
        WHERE ut.user_id = p_user_id
        AND ut.created_at >= date_trunc('month', NOW())
        AND ut.created_at < date_trunc('month', NOW()) + INTERVAL '1 month';
        
        RETURN QUERY
        SELECT 
            usage_stats.total_used,
            usage_stats.total_gens,
            usage_stats.successful_gens,
            usage_stats.failed_gens,
            5 as monthly_limit, -- Free tier limit
            GREATEST(0, 5 - usage_stats.total_used) as remaining,
            ROUND((usage_stats.total_used::NUMERIC / 5) * 100, 2) as percentage;
        RETURN;
    END IF;
    
    -- Get usage stats for current billing period
    SELECT 
        COALESCE(SUM(ut.tokens_used), 0)::INTEGER as total_used,
        COALESCE(COUNT(*), 0)::INTEGER as total_gens,
        COALESCE(SUM(CASE WHEN ut.generation_successful THEN 1 ELSE 0 END), 0)::INTEGER as successful_gens,
        COALESCE(SUM(CASE WHEN NOT ut.generation_successful THEN 1 ELSE 0 END), 0)::INTEGER as failed_gens
    INTO usage_stats
    FROM usage_tracking ut
    WHERE ut.user_id = p_user_id
    AND ut.billing_period_start = user_subscription.current_period_start
    AND ut.billing_period_end = user_subscription.current_period_end;
    
    RETURN QUERY
    SELECT 
        usage_stats.total_used,
        usage_stats.total_gens,
        usage_stats.successful_gens,
        usage_stats.failed_gens,
        user_subscription.monthly_token_limit,
        GREATEST(0, user_subscription.monthly_token_limit - usage_stats.total_used) as remaining,
        ROUND((usage_stats.total_used::NUMERIC / user_subscription.monthly_token_limit) * 100, 2) as percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix can_user_use_tokens function return types
CREATE OR REPLACE FUNCTION public.can_user_use_tokens(
    p_user_id UUID, 
    p_tokens_needed INTEGER DEFAULT 1
)
RETURNS TABLE (
    can_use BOOLEAN,
    remaining_tokens INTEGER,
    monthly_limit INTEGER,
    plan_type TEXT
) AS $$
DECLARE
    user_subscription RECORD;
    monthly_usage RECORD;
BEGIN
    -- Get user's active subscription
    SELECT * INTO user_subscription
    FROM get_user_active_subscription(p_user_id) 
    LIMIT 1;
    
    -- Get current usage
    SELECT * INTO monthly_usage
    FROM get_user_monthly_usage(p_user_id)
    LIMIT 1;
    
    -- If no active subscription, use free tier
    IF user_subscription IS NULL THEN
        RETURN QUERY
        SELECT 
            (monthly_usage.remaining_tokens >= p_tokens_needed) as can_use,
            monthly_usage.remaining_tokens,
            5 as monthly_limit,
            'free'::TEXT as plan_type;
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        (monthly_usage.remaining_tokens >= p_tokens_needed) as can_use,
        monthly_usage.remaining_tokens,
        monthly_usage.monthly_limit,
        user_subscription.plan_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix use_tokens function return types
CREATE OR REPLACE FUNCTION public.use_tokens(
    p_user_id UUID,
    p_tokens_needed INTEGER,
    p_usage_type TEXT,
    p_prompt_text TEXT DEFAULT NULL,
    p_style_selected TEXT DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    usage_id UUID,
    remaining_tokens INTEGER,
    error_message TEXT
) AS $$
DECLARE
    can_use_result RECORD;
    new_usage_id UUID;
BEGIN
    -- Check if user can use tokens
    SELECT * INTO can_use_result
    FROM can_user_use_tokens(p_user_id, p_tokens_needed)
    LIMIT 1;
    
    -- If user cannot use tokens, return failure
    IF NOT can_use_result.can_use THEN
        RETURN QUERY
        SELECT 
            FALSE as success,
            NULL::UUID as usage_id,
            can_use_result.remaining_tokens,
            'Insufficient tokens remaining' as error_message;
        RETURN;
    END IF;
    
    -- Record the usage
    SELECT record_token_usage(
        p_user_id,
        p_tokens_needed,
        p_usage_type,
        p_prompt_text,
        p_style_selected,
        TRUE,
        NULL
    ) INTO new_usage_id;
    
    -- Return success with updated remaining tokens
    RETURN QUERY
    SELECT 
        TRUE as success,
        new_usage_id,
        (can_use_result.remaining_tokens - p_tokens_needed) as remaining_tokens,
        NULL::TEXT as error_message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix get_user_complete_data function return types  
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

-- Update the view to handle the type casting properly
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
    
    -- Current subscription info (with proper type casting)
    s.subscription_id,
    s.plan_type,
    s.status as subscription_status,
    s.monthly_token_limit::INTEGER,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    
    -- Usage summary (with proper type casting)
    usage_summary.total_tokens_used::INTEGER as tokens_used_this_month,
    usage_summary.remaining_tokens::INTEGER as tokens_remaining,
    usage_summary.total_generations::INTEGER,
    usage_summary.successful_generations::INTEGER,
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

-- Also try to handle the case where users_new might still exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_new') THEN
        -- Create a temporary view that works with users_new
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
            
            -- Default values for new structure
            NULL::UUID as subscription_id,
            'free'::TEXT as plan_type,
            'active'::TEXT as subscription_status,
            5::INTEGER as monthly_token_limit,
            NULL::TIMESTAMPTZ as current_period_start,
            NULL::TIMESTAMPTZ as current_period_end,
            FALSE as cancel_at_period_end,
            
            -- Default usage values
            0::INTEGER as tokens_used_this_month,
            5::INTEGER as tokens_remaining,
            0::INTEGER as total_generations,
            0::INTEGER as successful_generations,
            0::NUMERIC as usage_percentage,
            
            -- Auth info
            auth_user.email_confirmed_at,
            auth_user.last_sign_in_at
            
        FROM users_new u
        LEFT JOIN auth.users auth_user ON auth_user.id = u.id;
        
        RAISE NOTICE 'Created temporary view for users_new table';
    END IF;
END $$;

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== FUNCTION TYPE FIXES APPLIED ===';
    RAISE NOTICE 'Fixed all function return types to use INTEGER instead of BIGINT';
    RAISE NOTICE 'Updated view with proper type casting';
    RAISE NOTICE 'Added fallback support for users_new table';
    RAISE NOTICE 'Database functions should now work correctly!';
END $$;
