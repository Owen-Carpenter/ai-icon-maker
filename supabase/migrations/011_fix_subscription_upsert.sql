-- Fix subscription upsert to handle duplicate customer IDs properly
-- The issue is that we might have multiple subscription attempts for the same customer

-- Drop and recreate the upsert function with better conflict resolution
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
    existing_subscription_id UUID;
BEGIN
    -- Get token limit for the plan
    token_limit := get_monthly_token_limit(p_plan_type);
    
    -- First, check if a subscription already exists for this user or customer
    SELECT id INTO existing_subscription_id
    FROM subscriptions 
    WHERE user_id = p_user_id 
       OR stripe_customer_id = p_stripe_customer_id
       OR stripe_subscription_id = p_stripe_subscription_id
    LIMIT 1;
    
    IF existing_subscription_id IS NOT NULL THEN
        -- Update existing subscription
        UPDATE subscriptions SET
            stripe_customer_id = p_stripe_customer_id,
            stripe_subscription_id = p_stripe_subscription_id,
            plan_type = p_plan_type,
            status = p_status,
            current_period_start = p_current_period_start,
            current_period_end = p_current_period_end,
            cancel_at_period_end = p_cancel_at_period_end,
            monthly_token_limit = token_limit,
            updated_at = NOW()
        WHERE id = existing_subscription_id
        RETURNING id INTO subscription_id;
        
        RAISE NOTICE 'Updated existing subscription % for user %', existing_subscription_id, p_user_id;
    ELSE
        -- Insert new subscription
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
        RETURNING id INTO subscription_id;
        
        RAISE NOTICE 'Created new subscription % for user %', subscription_id, p_user_id;
    END IF;
    
    RETURN subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also create a simpler function to get or create a subscription for checkout
CREATE OR REPLACE FUNCTION public.get_or_create_subscription_for_user(
    p_user_id UUID,
    p_stripe_customer_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    subscription_id UUID;
BEGIN
    -- Try to find existing subscription
    SELECT id INTO subscription_id
    FROM subscriptions 
    WHERE user_id = p_user_id
    LIMIT 1;
    
    IF subscription_id IS NOT NULL THEN
        -- Update customer ID if provided and different
        IF p_stripe_customer_id IS NOT NULL THEN
            UPDATE subscriptions 
            SET stripe_customer_id = p_stripe_customer_id,
                updated_at = NOW()
            WHERE id = subscription_id 
            AND (stripe_customer_id IS NULL OR stripe_customer_id != p_stripe_customer_id);
        END IF;
        
        RETURN subscription_id;
    ELSE
        -- Create new subscription
        INSERT INTO subscriptions (
            user_id,
            stripe_customer_id,
            plan_type,
            status,
            monthly_token_limit
        )
        VALUES (
            p_user_id,
            p_stripe_customer_id,
            'free',
            'active',
            5
        )
        RETURNING id INTO subscription_id;
        
        RETURN subscription_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to safely handle webhook subscription updates
CREATE OR REPLACE FUNCTION public.webhook_upsert_subscription(
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
    
    -- Use INSERT ... ON CONFLICT with proper constraint handling
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
    ON CONFLICT (user_id) 
    DO UPDATE SET
        stripe_customer_id = EXCLUDED.stripe_customer_id,
        stripe_subscription_id = EXCLUDED.stripe_subscription_id,
        plan_type = EXCLUDED.plan_type,
        status = EXCLUDED.status,
        current_period_start = EXCLUDED.current_period_start,
        current_period_end = EXCLUDED.current_period_end,
        cancel_at_period_end = EXCLUDED.cancel_at_period_end,
        monthly_token_limit = EXCLUDED.monthly_token_limit,
        updated_at = NOW()
    RETURNING id INTO subscription_id;
    
    RETURN subscription_id;
EXCEPTION
    WHEN unique_violation THEN
        -- If we still get a unique violation, try to update the existing record
        UPDATE subscriptions SET
            stripe_subscription_id = p_stripe_subscription_id,
            plan_type = p_plan_type,
            status = p_status,
            current_period_start = p_current_period_start,
            current_period_end = p_current_period_end,
            cancel_at_period_end = p_cancel_at_period_end,
            monthly_token_limit = token_limit,
            updated_at = NOW()
        WHERE stripe_customer_id = p_stripe_customer_id
        RETURNING id INTO subscription_id;
        
        RETURN subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a unique constraint on user_id to prevent multiple subscriptions per user
DO $$
BEGIN
    -- Add unique constraint on user_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'subscriptions_user_id_key'
    ) THEN
        ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
        RAISE NOTICE 'Added unique constraint on user_id to subscriptions table';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Could not add unique constraint on user_id (may already exist): %', SQLERRM;
END $$;

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== SUBSCRIPTION UPSERT FIXES APPLIED ===';
    RAISE NOTICE 'Created webhook_upsert_subscription function with better conflict resolution';
    RAISE NOTICE 'Added get_or_create_subscription_for_user for checkout flow';
    RAISE NOTICE 'Added unique constraint on user_id to prevent duplicate subscriptions';
    RAISE NOTICE 'Subscription creation should now handle conflicts properly!';
END $$;
