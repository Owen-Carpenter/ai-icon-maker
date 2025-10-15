-- Secure the user_complete_profile view
-- Fix security issues: exposing auth.users data and SECURITY DEFINER concerns

-- Drop the existing view
DROP VIEW IF EXISTS user_complete_profile;

-- Create a secure version that doesn't expose sensitive auth.users data
-- Only expose the minimal necessary fields and rely on RLS
CREATE OR REPLACE VIEW user_complete_profile 
WITH (security_invoker = true) AS
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
    COALESCE(usage_summary.usage_percentage, 0)::NUMERIC as usage_percentage
    
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
        -- For paid users: match subscription_id (ignore billing periods if NULL)
        (s.id IS NOT NULL AND ut.subscription_id = s.id)
        OR
        -- For free users: match NULL subscription_id and current month
        (s.id IS NULL AND ut.subscription_id IS NULL 
         AND ut.created_at >= date_trunc('month', NOW())
         AND ut.created_at < date_trunc('month', NOW()) + INTERVAL '1 month')
    )
) usage_summary ON true;

-- Add RLS policies for the view
ALTER VIEW user_complete_profile SET (security_invoker = true);

-- Enable RLS on the underlying users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only see their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" 
ON users 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Create policy: service role can see all users
DROP POLICY IF EXISTS "Service role can view all users" ON users;
CREATE POLICY "Service role can view all users" 
ON users 
FOR ALL 
TO service_role 
USING (true);

-- Add comment
COMMENT ON VIEW user_complete_profile IS 'Secure user profile view - uses security_invoker and RLS to protect user data';

-- Grant appropriate access
GRANT SELECT ON user_complete_profile TO authenticated;
REVOKE SELECT ON user_complete_profile FROM anon;

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== SECURED USER_COMPLETE_PROFILE VIEW ===';
    RAISE NOTICE 'Removed auth.users join to prevent data exposure';
    RAISE NOTICE 'Added security_invoker property to use caller permissions';
    RAISE NOTICE 'Added RLS policies to users table';
    RAISE NOTICE 'Only authenticated users can see their own data';
    RAISE NOTICE 'Anonymous users cannot access the view';
END $$;

