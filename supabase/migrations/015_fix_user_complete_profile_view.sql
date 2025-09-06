-- Fix the user_complete_profile view to show correct credit data
-- The view was using broken database functions, now we'll make it work correctly

-- Drop the existing view
DROP VIEW IF EXISTS user_complete_profile;

-- Create a new view that calculates usage correctly
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
    s.plan_type,
    s.status as subscription_status,
    s.monthly_token_limit::INTEGER,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    
    -- Usage summary calculated directly from usage_tracking
    COALESCE(usage_summary.tokens_used_this_month, 0)::INTEGER as tokens_used_this_month,
    COALESCE(usage_summary.tokens_remaining, s.monthly_token_limit, 5)::INTEGER as tokens_remaining,
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
    AND ut.subscription_id = s.id
    -- Use current month billing periods for free users or users with null subscription periods
    AND (
        (s.id IS NULL OR s.current_period_start IS NULL OR s.current_period_end IS NULL) 
        AND ut.billing_period_start >= date_trunc('month', NOW())
        AND ut.billing_period_end < date_trunc('month', NOW()) + INTERVAL '1 month'
        OR
        (s.id IS NOT NULL AND s.current_period_start IS NOT NULL AND s.current_period_end IS NOT NULL)
        AND ut.billing_period_start = s.current_period_start
        AND ut.billing_period_end = s.current_period_end
    )
) usage_summary ON true
LEFT JOIN auth.users auth_user ON auth_user.id = u.id;

-- Add comment
COMMENT ON VIEW user_complete_profile IS 'Complete user data with correct usage calculations - bypasses broken database functions';

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== FIXED USER_COMPLETE_PROFILE VIEW ===';
    RAISE NOTICE 'Updated view to calculate usage directly from usage_tracking table';
    RAISE NOTICE 'Handles both free users (monthly periods) and paid users (subscription periods)';
    RAISE NOTICE 'Bypasses broken get_user_monthly_usage function';
    RAISE NOTICE 'View should now show correct credit counts!';
END $$;
