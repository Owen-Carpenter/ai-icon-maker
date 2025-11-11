-- Ensure webhook_upsert_subscription gracefully handles existing Stripe customers
DROP FUNCTION IF EXISTS webhook_upsert_subscription(uuid, text, text, text, text, timestamptz, timestamptz, boolean);

CREATE OR REPLACE FUNCTION webhook_upsert_subscription(
    p_user_id uuid,
    p_stripe_customer_id text,
    p_stripe_subscription_id text,
    p_plan_type text,
    p_status text,
    p_current_period_start timestamptz,
    p_current_period_end timestamptz,
    p_cancel_at_period_end boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_monthly_limit integer;
BEGIN
    -- Determine monthly token limit based on plan
    v_monthly_limit := CASE p_plan_type
        WHEN 'base' THEN 25
        WHEN 'pro' THEN 100
        WHEN 'proPlus' THEN 200
        WHEN 'enterprise' THEN 200
        ELSE 5
    END;

    -- First, try to update any existing subscription that already has this Stripe customer ID
    UPDATE subscriptions
    SET
        user_id = p_user_id,
        stripe_subscription_id = p_stripe_subscription_id,
        plan_type = p_plan_type,
        status = p_status,
        monthly_token_limit = v_monthly_limit,
        current_period_start = p_current_period_start,
        current_period_end = p_current_period_end,
        cancel_at_period_end = p_cancel_at_period_end,
        updated_at = NOW()
    WHERE stripe_customer_id = p_stripe_customer_id;

    IF NOT FOUND THEN
        -- If no row was updated, insert a new subscription (or update the existing row for this user)
        INSERT INTO subscriptions (
            user_id,
            stripe_customer_id,
            stripe_subscription_id,
            plan_type,
            status,
            monthly_token_limit,
            current_period_start,
            current_period_end,
            cancel_at_period_end
        ) VALUES (
            p_user_id,
            p_stripe_customer_id,
            p_stripe_subscription_id,
            p_plan_type,
            p_status,
            v_monthly_limit,
            p_current_period_start,
            p_current_period_end,
            p_cancel_at_period_end
        )
        ON CONFLICT (user_id)
        DO UPDATE SET
            stripe_customer_id = EXCLUDED.stripe_customer_id,
            stripe_subscription_id = EXCLUDED.stripe_subscription_id,
            plan_type = EXCLUDED.plan_type,
            status = EXCLUDED.status,
            monthly_token_limit = EXCLUDED.monthly_token_limit,
            current_period_start = EXCLUDED.current_period_start,
            current_period_end = EXCLUDED.current_period_end,
            cancel_at_period_end = EXCLUDED.cancel_at_period_end,
            updated_at = NOW();
    END IF;
END;
$$;

