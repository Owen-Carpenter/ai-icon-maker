-- Update subscription plans to support three-tier pricing structure
-- Base: $5/month, 25 credits
-- Pro: $10/month, 100 credits  
-- Pro+: $15/month, 200 credits

-- Update the get_monthly_token_limit function with new three-tier limits
CREATE OR REPLACE FUNCTION get_monthly_token_limit(plan_type TEXT)
RETURNS INTEGER AS $$
BEGIN
    CASE plan_type
        WHEN 'free' THEN RETURN 0;       -- Free tier has no credits
        WHEN 'base' THEN RETURN 25;      -- New base tier
        WHEN 'pro' THEN RETURN 100;      -- Updated pro tier
        WHEN 'proPlus' THEN RETURN 200;  -- New pro+ tier
        WHEN 'enterprise' THEN RETURN 200; -- Legacy enterprise maps to pro+
        ELSE RETURN 0;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Update the subscription table to support new plan types
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('free', 'base', 'pro', 'proPlus', 'enterprise'));

-- Update existing subscriptions to use new token limits
UPDATE subscriptions 
SET monthly_token_limit = get_monthly_token_limit(plan_type)
WHERE plan_type IN ('pro', 'enterprise');

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== UPDATED TO THREE-TIER SUBSCRIPTION PLANS ===';
    RAISE NOTICE 'Free Plan: $0/month, 0 credits (explore only)';
    RAISE NOTICE 'Base Plan: $5/month, 25 credits';
    RAISE NOTICE 'Pro Plan: $10/month, 100 credits';
    RAISE NOTICE 'Pro+ Plan: $15/month, 200 credits';
    RAISE NOTICE 'Updated existing subscriptions with new token limits';
    RAISE NOTICE 'Legacy enterprise plans now map to Pro+ tier';
END $$;
