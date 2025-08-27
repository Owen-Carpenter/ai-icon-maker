-- Create subscriptions table to separate subscription data from users
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Stripe integration
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    
    -- Subscription details
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro', 'enterprise')),
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing', 'unpaid')),
    
    -- Billing periods
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    
    -- Cancellation tracking
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    
    -- Token limits based on plan
    monthly_token_limit INTEGER NOT NULL DEFAULT 5,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_plan_type_idx ON subscriptions(plan_type);

-- Enable Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
CREATE POLICY "Users can update own subscription" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscription" ON subscriptions;
CREATE POLICY "Users can insert own subscription" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscriptions_updated_at_column();

-- Function to get monthly token limit based on plan
CREATE OR REPLACE FUNCTION get_monthly_token_limit(plan_type TEXT)
RETURNS INTEGER AS $$
BEGIN
    CASE plan_type
        WHEN 'free' THEN RETURN 5;
        WHEN 'pro' THEN RETURN 100;
        WHEN 'enterprise' THEN RETURN 200;
        ELSE RETURN 5;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to create or update subscription
CREATE OR REPLACE FUNCTION public.upsert_subscription(
    p_user_id UUID,
    p_stripe_customer_id TEXT,
    p_stripe_subscription_id TEXT,
    p_plan_type TEXT,
    p_status TEXT,
    p_current_period_start TIMESTAMPTZ,
    p_current_period_end TIMESTAMPTZ,
    p_cancel_at_period_end BOOLEAN DEFAULT FALSE
)
RETURNS UUID AS $$
DECLARE
    subscription_id UUID;
    token_limit INTEGER;
BEGIN
    -- Get token limit for the plan
    token_limit := get_monthly_token_limit(p_plan_type);
    
    -- Insert or update subscription
    INSERT INTO subscriptions (
        user_id, 
        stripe_customer_id, 
        stripe_subscription_id, 
        plan_type, 
        status, 
        current_period_start, 
        current_period_end, 
        cancel_at_period_end,
        monthly_token_limit
    )
    VALUES (
        p_user_id, 
        p_stripe_customer_id, 
        p_stripe_subscription_id, 
        p_plan_type, 
        p_status, 
        p_current_period_start, 
        p_current_period_end, 
        p_cancel_at_period_end,
        token_limit
    )
    ON CONFLICT (stripe_subscription_id) 
    DO UPDATE SET
        plan_type = EXCLUDED.plan_type,
        status = EXCLUDED.status,
        current_period_start = EXCLUDED.current_period_start,
        current_period_end = EXCLUDED.current_period_end,
        cancel_at_period_end = EXCLUDED.cancel_at_period_end,
        monthly_token_limit = token_limit,
        updated_at = NOW()
    RETURNING id INTO subscription_id;
    
    RETURN subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's active subscription
CREATE OR REPLACE FUNCTION public.get_user_active_subscription(p_user_id UUID)
RETURNS TABLE (
    subscription_id UUID,
    plan_type TEXT,
    status TEXT,
    monthly_token_limit INTEGER,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.plan_type,
        s.status,
        s.monthly_token_limit,
        s.current_period_start,
        s.current_period_end,
        s.cancel_at_period_end
    FROM subscriptions s
    WHERE s.user_id = p_user_id
    AND s.status IN ('active', 'trialing')
    AND (s.current_period_end IS NULL OR s.current_period_end > NOW())
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
