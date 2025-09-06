-- Fix the user_complete_profile view to correctly handle NULL subscription_id
-- The previous view had issues with JOIN conditions for free users

-- Drop the existing view
DROP VIEW IF EXISTS user_complete_profile;

-- Create a new view that correctly handles both free and paid users
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
    
    -- Current subscription info
    s.id as subscription_id,
    COALESCE(s.plan_type, 'free') as plan_type,
    COALESCE(s.status, 'active') as subscription_status,
    COALESCE(s.monthly_token_limit, 5)::INTEGER as monthly_token_limit,
    s.current_period_start,
    s.current_period_end,
    COALESCE(s.cancel_at_period_end, FALSE) as cancel_at_period_end,
    
    -- Usage summary calculated directly from usage_tracking
    COALESCE(usage_summary.tokens_used_this_month, 0)::INTEGER as tokens_used_this_month,
    COALESCE(usage_summary.tokens_remaining, COALESCE(s.monthly_token_limit, 5))::INTEGER as tokens_remaining,
    COALESCE(usage_summary.total_generations, 0)::INTEGER as total_generations,
    COALESCE(usage_summary.successful_generations, 0)::INTEGER as successful_generations,
    COALESCE(usage_summary.usage_percentage, 0)::NUMERIC as usage_percentage,
    
    -- Auth info
    auth_user.email_confirmed_at,
    auth_user.last_sign_in_at
    
FROM users u
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
LEFT JOIN LATERAL (
    -- Calculate usage directly from usage_tracking table
    SELECT 
        COALESCE(SUM(ut.tokens_used), 0) as tokens_used_this_month,
        GREATEST(0, COALESCE(s.monthly_token_limit, 5) - COALESCE(SUM(ut.tokens_used), 0)) as tokens_remaining,
        COUNT(*) as total_generations,
        SUM(CASE WHEN ut.generation_successful THEN 1 ELSE 0 END) as successful_generations,
        ROUND((COALESCE(SUM(ut.tokens_used), 0)::NUMERIC / COALESCE(s.monthly_token_limit, 5)) * 100, 2) as usage_percentage
    FROM usage_tracking ut
    WHERE ut.user_id = u.id
    AND (
        -- For paid users: match subscription_id and billing periods
        (s.id IS NOT NULL AND ut.subscription_id = s.id 
         AND ut.billing_period_start = s.current_period_start 
         AND ut.billing_period_end = s.current_period_end)
        OR
        -- For free users: match NULL subscription_id and current month billing periods
        (s.id IS NULL AND ut.subscription_id IS NULL 
         AND ut.billing_period_start >= date_trunc('month', NOW())
         AND ut.billing_period_end < date_trunc('month', NOW()) + INTERVAL '1 month')
    )
) usage_summary ON true
LEFT JOIN auth.users auth_user ON auth_user.id = u.id;

-- Add comment
COMMENT ON VIEW user_complete_profile IS 'Complete user data with correct usage calculations - handles both free and paid users properly';

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== FIXED USER_COMPLETE_PROFILE VIEW V2 ===';
    RAISE NOTICE 'Fixed JOIN conditions to properly handle NULL subscription_id for free users';
    RAISE NOTICE 'Now correctly calculates usage for both free and paid users';
    RAISE NOTICE 'View should now show accurate credit counts!';
END $$;
