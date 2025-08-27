-- Create usage tracking table to monitor token consumption
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    -- Usage details
    tokens_used INTEGER NOT NULL DEFAULT 1,
    usage_type TEXT NOT NULL CHECK (usage_type IN ('icon_generation', 'icon_improvement', 'api_call')),
    
    -- Context information
    prompt_text TEXT,
    style_selected TEXT,
    generation_successful BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    -- Billing period tracking
    billing_period_start TIMESTAMPTZ,
    billing_period_end TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS usage_tracking_user_id_idx ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS usage_tracking_subscription_id_idx ON usage_tracking(subscription_id);
CREATE INDEX IF NOT EXISTS usage_tracking_created_at_idx ON usage_tracking(created_at);
CREATE INDEX IF NOT EXISTS usage_tracking_billing_period_idx ON usage_tracking(user_id, billing_period_start, billing_period_end);
CREATE INDEX IF NOT EXISTS usage_tracking_usage_type_idx ON usage_tracking(usage_type);

-- Composite index for monthly usage queries
CREATE INDEX IF NOT EXISTS usage_tracking_monthly_summary_idx ON usage_tracking(user_id, billing_period_start, billing_period_end, tokens_used);

-- Enable Row Level Security (RLS)
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own usage" ON usage_tracking;
CREATE POLICY "Users can view own usage" ON usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own usage" ON usage_tracking;
CREATE POLICY "Users can insert own usage" ON usage_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to record token usage
CREATE OR REPLACE FUNCTION public.record_token_usage(
    p_user_id UUID,
    p_tokens_used INTEGER,
    p_usage_type TEXT,
    p_prompt_text TEXT DEFAULT NULL,
    p_style_selected TEXT DEFAULT NULL,
    p_generation_successful BOOLEAN DEFAULT TRUE,
    p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    usage_id UUID;
    user_subscription RECORD;
BEGIN
    -- Get user's active subscription for billing period info
    SELECT * INTO user_subscription
    FROM get_user_active_subscription(p_user_id) 
    LIMIT 1;
    
    -- Insert usage record
    INSERT INTO usage_tracking (
        user_id,
        subscription_id,
        tokens_used,
        usage_type,
        prompt_text,
        style_selected,
        generation_successful,
        error_message,
        billing_period_start,
        billing_period_end
    )
    VALUES (
        p_user_id,
        user_subscription.subscription_id,
        p_tokens_used,
        p_usage_type,
        p_prompt_text,
        p_style_selected,
        p_generation_successful,
        p_error_message,
        user_subscription.current_period_start,
        user_subscription.current_period_end
    )
    RETURNING id INTO usage_id;
    
    RETURN usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current month usage
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
            COALESCE(SUM(ut.tokens_used), 0) as total_used,
            COALESCE(COUNT(*), 0) as total_gens,
            COALESCE(SUM(CASE WHEN ut.generation_successful THEN 1 ELSE 0 END), 0) as successful_gens,
            COALESCE(SUM(CASE WHEN NOT ut.generation_successful THEN 1 ELSE 0 END), 0) as failed_gens
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
        COALESCE(SUM(ut.tokens_used), 0) as total_used,
        COALESCE(COUNT(*), 0) as total_gens,
        COALESCE(SUM(CASE WHEN ut.generation_successful THEN 1 ELSE 0 END), 0) as successful_gens,
        COALESCE(SUM(CASE WHEN NOT ut.generation_successful THEN 1 ELSE 0 END), 0) as failed_gens
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

-- Function to check if user can use tokens
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

-- Function to process token usage (combines check and record)
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
