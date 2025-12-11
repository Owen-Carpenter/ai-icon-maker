-- Transform legacy subscription plans to new plan structure
-- This migration automatically upgrades existing legacy plan users to the new pricing structure

-- Update existing subscriptions to new plan types
-- base → monthly (upgrade from 25 credits to 50 credits)
UPDATE subscriptions
SET 
    plan_type = 'monthly',
    monthly_token_limit = 50,
    updated_at = NOW()
WHERE plan_type = 'base'
AND status = 'active';

-- pro → monthly (legacy pro had 100 credits, new monthly has 50)
UPDATE subscriptions
SET 
    plan_type = 'monthly',
    monthly_token_limit = 50,
    updated_at = NOW()
WHERE plan_type = 'pro'
AND status = 'active';

-- proPlus → yearly (upgrade from 200 credits/month to 700 credits/year which is much better value)
UPDATE subscriptions
SET 
    plan_type = 'yearly',
    monthly_token_limit = 700,
    updated_at = NOW()
WHERE plan_type = 'proPlus'
AND status = 'active';

-- enterprise → yearly (best available plan)
UPDATE subscriptions
SET 
    plan_type = 'yearly',
    monthly_token_limit = 700,
    updated_at = NOW()
WHERE plan_type = 'enterprise'
AND status = 'active';

-- Log the transformation
DO $$
DECLARE
    v_base_count INTEGER;
    v_pro_count INTEGER;
    v_proplus_count INTEGER;
    v_enterprise_count INTEGER;
BEGIN
    -- Count transformed subscriptions
    SELECT COUNT(*) INTO v_base_count FROM subscriptions WHERE plan_type = 'monthly' AND updated_at >= NOW() - INTERVAL '1 minute';
    SELECT COUNT(*) INTO v_proplus_count FROM subscriptions WHERE plan_type = 'yearly' AND updated_at >= NOW() - INTERVAL '1 minute';
    
    RAISE NOTICE '=== LEGACY SUBSCRIPTION TRANSFORMATION COMPLETE ===';
    RAISE NOTICE 'Transformed legacy subscriptions to new plan structure:';
    RAISE NOTICE '  - base → monthly: Upgraded to 50 credits/month';
    RAISE NOTICE '  - pro → monthly: Now 50 credits/month (standardized)';
    RAISE NOTICE '  - proPlus → yearly: Upgraded to 700 credits/year (much better value!)';
    RAISE NOTICE '  - enterprise → yearly: Upgraded to 700 credits/year';
    RAISE NOTICE '';
    RAISE NOTICE 'Future webhook events will automatically transform legacy plans';
    RAISE NOTICE 'Legacy users will benefit from new pricing structure on next renewal';
END $$;

-- Update the subscription plan type constraints to include new types (if not already done)
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('free', 'starter', 'monthly', 'yearly', 'base', 'pro', 'proPlus', 'enterprise'));

-- Summary
SELECT 
    plan_type,
    status,
    COUNT(*) as subscription_count,
    SUM(monthly_token_limit) as total_credits
FROM subscriptions
WHERE status = 'active'
GROUP BY plan_type, status
ORDER BY 
    CASE plan_type
        WHEN 'yearly' THEN 1
        WHEN 'monthly' THEN 2
        WHEN 'starter' THEN 3
        WHEN 'free' THEN 4
        ELSE 5
    END;

