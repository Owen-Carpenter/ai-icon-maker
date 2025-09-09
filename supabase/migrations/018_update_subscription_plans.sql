-- Update subscription plans with new pricing and credit limits
-- Pro: $10/month, 200 credits
-- Enterprise: $20/month, 500 credits

-- Update the get_monthly_token_limit function with new limits
CREATE OR REPLACE FUNCTION get_monthly_token_limit(plan_type TEXT)
RETURNS INTEGER AS $$
BEGIN
    CASE plan_type
        WHEN 'free' THEN RETURN 5;
        WHEN 'pro' THEN RETURN 200;  -- Updated from 100 to 200
        WHEN 'enterprise' THEN RETURN 500;  -- Updated from 200 to 500
        ELSE RETURN 5;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Update existing subscriptions to use new token limits
UPDATE subscriptions 
SET monthly_token_limit = get_monthly_token_limit(plan_type)
WHERE plan_type IN ('pro', 'enterprise');

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== UPDATED SUBSCRIPTION PLANS ===';
    RAISE NOTICE 'Pro Plan: $10/month, 200 credits (was $20/month, 100 credits)';
    RAISE NOTICE 'Enterprise Plan: $20/month, 500 credits (was $99/month, 200 credits)';
    RAISE NOTICE 'Updated existing subscriptions with new token limits';
END $$;
