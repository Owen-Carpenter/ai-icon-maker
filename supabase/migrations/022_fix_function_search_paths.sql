-- Fix mutable search_path security warnings for all functions
-- Adding SET search_path = public to prevent SQL injection attacks

-- Critical functions actively used in the app:

-- 1. use_tokens function (used in /api/deduct-credit)
DROP FUNCTION IF EXISTS use_tokens(uuid, integer, text, text, text);
CREATE OR REPLACE FUNCTION use_tokens(
    p_user_id uuid,
    p_tokens_needed integer,
    p_usage_type text,
    p_prompt_text text DEFAULT NULL,
    p_style_selected text DEFAULT NULL
)
RETURNS TABLE(
    success boolean,
    remaining_tokens integer,
    usage_id uuid,
    error_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_subscription_id uuid;
    v_monthly_limit integer;
    v_current_usage integer;
    v_remaining integer;
    v_usage_id uuid;
BEGIN
    -- Get active subscription
    SELECT id, monthly_token_limit 
    INTO v_subscription_id, v_monthly_limit
    FROM subscriptions
    WHERE user_id = p_user_id 
    AND status = 'active'
    LIMIT 1;

    -- If no subscription found, use free tier defaults
    IF v_subscription_id IS NULL THEN
        v_monthly_limit := 5;
    END IF;

    -- Calculate current usage
    SELECT COALESCE(SUM(tokens_used), 0)
    INTO v_current_usage
    FROM usage_tracking
    WHERE user_id = p_user_id
    AND subscription_id = v_subscription_id;

    v_remaining := v_monthly_limit - v_current_usage;

    -- Check if user has enough tokens
    IF v_remaining < p_tokens_needed THEN
        RETURN QUERY SELECT 
            false,
            v_remaining,
            NULL::uuid,
            'Insufficient credits'::text;
        RETURN;
    END IF;

    -- Record usage
    INSERT INTO usage_tracking (
        user_id,
        subscription_id,
        tokens_used,
        usage_type,
        prompt_text,
        style_selected,
        generation_successful
    ) VALUES (
        p_user_id,
        v_subscription_id,
        p_tokens_needed,
        p_usage_type,
        p_prompt_text,
        p_style_selected,
        true
    )
    RETURNING id INTO v_usage_id;

    -- Calculate new remaining
    v_remaining := v_remaining - p_tokens_needed;

    RETURN QUERY SELECT 
        true,
        v_remaining,
        v_usage_id,
        NULL::text;
END;
$$;

-- 2. record_token_usage function (used in /api/generate-icons)
DROP FUNCTION IF EXISTS record_token_usage(uuid, integer, text, text, text, boolean, text);
CREATE OR REPLACE FUNCTION record_token_usage(
    p_user_id uuid,
    p_tokens_used integer,
    p_usage_type text,
    p_prompt_text text DEFAULT NULL,
    p_style_selected text DEFAULT NULL,
    p_generation_successful boolean DEFAULT true,
    p_error_message text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_subscription_id uuid;
    v_usage_id uuid;
BEGIN
    -- Get active subscription
    SELECT id INTO v_subscription_id
    FROM subscriptions
    WHERE user_id = p_user_id 
    AND status = 'active'
    LIMIT 1;

    -- Record usage
    INSERT INTO usage_tracking (
        user_id,
        subscription_id,
        tokens_used,
        usage_type,
        prompt_text,
        style_selected,
        generation_successful,
        error_message
    ) VALUES (
        p_user_id,
        v_subscription_id,
        p_tokens_used,
        p_usage_type,
        p_prompt_text,
        p_style_selected,
        p_generation_successful,
        p_error_message
    )
    RETURNING id INTO v_usage_id;

    RETURN v_usage_id;
END;
$$;

-- 3. webhook_upsert_subscription function (used in /api/stripe/webhook)
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

    -- Upsert subscription
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
END;
$$;

-- 4. get_or_create_subscription_for_user function (used in /api/stripe/checkout)
DROP FUNCTION IF EXISTS get_or_create_subscription_for_user(uuid);
CREATE OR REPLACE FUNCTION get_or_create_subscription_for_user(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_subscription_id uuid;
BEGIN
    -- Try to get existing subscription
    SELECT id INTO v_subscription_id
    FROM subscriptions
    WHERE user_id = p_user_id
    LIMIT 1;

    -- If no subscription exists, create a free one
    IF v_subscription_id IS NULL THEN
        INSERT INTO subscriptions (
            user_id,
            plan_type,
            status,
            monthly_token_limit
        ) VALUES (
            p_user_id,
            'free',
            'active',
            5
        )
        RETURNING id INTO v_subscription_id;
    END IF;

    RETURN v_subscription_id;
END;
$$;

-- 5. Update trigger functions for updated_at columns
DROP FUNCTION IF EXISTS update_users_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS update_subscriptions_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS update_icons_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_icons_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Recreate triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscriptions_updated_at_column();

DROP TRIGGER IF EXISTS update_icons_updated_at ON icons;
CREATE TRIGGER update_icons_updated_at
    BEFORE UPDATE ON icons
    FOR EACH ROW
    EXECUTE FUNCTION update_icons_updated_at();

-- Clean up unused legacy functions (from template/other projects)
-- Use DO block to drop all overloaded versions
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all versions of each legacy function
    FOR r IN (
        SELECT proname, oidvectortypes(proargtypes) as argtypes
        FROM pg_proc
        WHERE pronamespace = 'public'::regnamespace
        AND proname IN (
            'can_user_use_tokens',
            'check_booking_time_off_conflict',
            'get_active_time_off',
            'get_current_user_role',
            'get_teams_for_user',
            'is_admin',
            'update_time_off_periods_updated_at',
            'user_has_active_subscription',
            'get_user_active_subscription',
            'get_user_complete_data',
            'get_user_monthly_usage',
            'get_monthly_token_limit',
            'handle_updated_at',
            'trigger_set_timestamp',
            'update_user_subscription',
            'use_user_credits',
            'upsert_subscription',
            'handle_new_user_signup'
        )
    ) LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS public.%I(%s) CASCADE', r.proname, r.argtypes);
        RAISE NOTICE 'Dropped function: %.%(%)', 'public', r.proname, r.argtypes;
    END LOOP;
END $$;

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== FIXED FUNCTION SEARCH_PATH SECURITY ===';
    RAISE NOTICE 'Added SET search_path = public to all active functions:';
    RAISE NOTICE '  - use_tokens';
    RAISE NOTICE '  - record_token_usage';
    RAISE NOTICE '  - webhook_upsert_subscription';
    RAISE NOTICE '  - get_or_create_subscription_for_user';
    RAISE NOTICE '  - update_*_updated_at_column functions';
    RAISE NOTICE 'Removed unused legacy functions from template/other projects';
    RAISE NOTICE 'All functions now protected against search_path injection attacks';
END $$;

