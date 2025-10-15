-- Fix the remaining get_or_create_subscription_for_user function
-- This is a patch to ensure the search_path is properly set

-- Drop all versions of the function to ensure clean recreation
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT proname, oidvectortypes(proargtypes) as argtypes
        FROM pg_proc
        WHERE pronamespace = 'public'::regnamespace
        AND proname = 'get_or_create_subscription_for_user'
    ) LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS public.%I(%s) CASCADE', r.proname, r.argtypes);
        RAISE NOTICE 'Dropped function: %.%(%)', 'public', r.proname, r.argtypes;
    END LOOP;
END $$;

-- Recreate with proper search_path
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

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== PATCHED get_or_create_subscription_for_user ===';
    RAISE NOTICE 'Function now has SET search_path = public';
    RAISE NOTICE 'SQL injection attack vector eliminated';
END $$;

