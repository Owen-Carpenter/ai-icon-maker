-- Add support for one-time credit purchases (like Starter Pack)
-- This migration creates functions and tables to handle non-subscription credit purchases

-- Create a table to track one-time purchases
CREATE TABLE IF NOT EXISTS one_time_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Stripe payment details
    stripe_customer_id TEXT,
    stripe_payment_intent_id TEXT UNIQUE,
    
    -- Purchase details
    plan_type TEXT NOT NULL CHECK (plan_type IN ('starter', 'base')), -- starter is the new one-time pack
    credits_purchased INTEGER NOT NULL DEFAULT 0,
    amount_paid INTEGER NOT NULL DEFAULT 0, -- in cents
    
    -- Timestamps
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS one_time_purchases_user_id_idx ON one_time_purchases(user_id);
CREATE INDEX IF NOT EXISTS one_time_purchases_payment_intent_idx ON one_time_purchases(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS one_time_purchases_customer_id_idx ON one_time_purchases(stripe_customer_id);

-- Enable RLS
ALTER TABLE one_time_purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
DROP POLICY IF EXISTS "Users can view own purchases" ON one_time_purchases;
CREATE POLICY "Users can view own purchases" ON one_time_purchases
    FOR SELECT USING (auth.uid() = user_id);

-- Create function to add one-time credits to a user's account
CREATE OR REPLACE FUNCTION add_one_time_credits(
    p_user_id UUID,
    p_credits INTEGER,
    p_plan_type TEXT,
    p_stripe_customer_id TEXT DEFAULT NULL,
    p_payment_intent_id TEXT DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    credits_added INTEGER,
    total_credits INTEGER,
    message TEXT
) AS $$
DECLARE
    v_subscription_id UUID;
    v_current_limit INTEGER;
    v_new_limit INTEGER;
BEGIN
    -- Find or create a subscription record for this user
    SELECT id, monthly_token_limit INTO v_subscription_id, v_current_limit
    FROM subscriptions
    WHERE user_id = p_user_id
    AND status IN ('active', 'inactive')
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- If no subscription exists, create one for tracking credits
    IF v_subscription_id IS NULL THEN
        INSERT INTO subscriptions (
            user_id,
            stripe_customer_id,
            plan_type,
            status,
            monthly_token_limit,
            current_period_start,
            current_period_end
        ) VALUES (
            p_user_id,
            p_stripe_customer_id,
            p_plan_type,
            'active',
            p_credits,
            NOW(),
            NOW() + INTERVAL '1 year' -- One-time credits don't expire for a year
        )
        RETURNING id, monthly_token_limit INTO v_subscription_id, v_current_limit;
        
        v_new_limit := p_credits;
    ELSE
        -- Add credits to existing limit
        v_new_limit := COALESCE(v_current_limit, 0) + p_credits;
        
        UPDATE subscriptions
        SET 
            monthly_token_limit = v_new_limit,
            updated_at = NOW()
        WHERE id = v_subscription_id;
    END IF;
    
    -- Record the purchase
    INSERT INTO one_time_purchases (
        user_id,
        stripe_customer_id,
        stripe_payment_intent_id,
        plan_type,
        credits_purchased,
        amount_paid
    ) VALUES (
        p_user_id,
        p_stripe_customer_id,
        p_payment_intent_id,
        p_plan_type,
        p_credits,
        CASE p_plan_type
            WHEN 'starter' THEN 500 -- $5.00
            WHEN 'base' THEN 500     -- $5.00 (legacy)
            ELSE 0
        END
    );
    
    -- Return success
    RETURN QUERY SELECT 
        TRUE as success,
        p_credits as credits_added,
        v_new_limit as total_credits,
        format('Successfully added %s credits to your account. Total: %s credits', p_credits, v_new_limit) as message;
    
EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 
        FALSE as success,
        0 as credits_added,
        0 as total_credits,
        format('Error adding credits: %s', SQLERRM) as message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the get_monthly_token_limit function to support new plan types
CREATE OR REPLACE FUNCTION get_monthly_token_limit(plan_type TEXT)
RETURNS INTEGER AS $$
BEGIN
    CASE plan_type
        -- New plan types
        WHEN 'starter' THEN RETURN 25;   -- Starter pack: 25 credits (one-time)
        WHEN 'monthly' THEN RETURN 50;   -- Monthly: 50 credits per month
        WHEN 'yearly' THEN RETURN 700;   -- Yearly: 700 credits per year
        
        -- Legacy plan types
        WHEN 'free' THEN RETURN 0;       -- Free tier has no credits
        WHEN 'base' THEN RETURN 25;      -- Legacy base tier
        WHEN 'pro' THEN RETURN 100;      -- Legacy pro tier
        WHEN 'proPlus' THEN RETURN 200;  -- Legacy pro+ tier
        WHEN 'enterprise' THEN RETURN 200; -- Legacy enterprise
        
        ELSE RETURN 0;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Update subscription plan type constraints
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('free', 'starter', 'monthly', 'yearly', 'base', 'pro', 'proPlus', 'enterprise'));

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== ADDED ONE-TIME CREDITS SUPPORT ===';
    RAISE NOTICE 'Starter Pack: $5 for 25 credits (one-time purchase)';
    RAISE NOTICE 'Monthly: $10 for 50 credits (recurring)';
    RAISE NOTICE 'Yearly: $96 for 700 credits (recurring)';
    RAISE NOTICE 'Created one_time_purchases table';
    RAISE NOTICE 'Created add_one_time_credits() function';
    RAISE NOTICE 'Updated get_monthly_token_limit() function';
END $$;

