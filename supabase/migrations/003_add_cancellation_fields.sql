-- Add subscription cancellation tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Create an index for the new column
CREATE INDEX IF NOT EXISTS users_subscription_cancel_at_period_end_idx ON users(subscription_cancel_at_period_end);

-- Update the update_user_subscription function to handle cancellation
CREATE OR REPLACE FUNCTION public.update_user_subscription(
    user_id UUID,
    customer_id TEXT,
    subscription_id TEXT,
    status TEXT,
    plan TEXT,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    credits INTEGER,
    cancel_at_period_end BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
    UPDATE users SET
        has_paid_subscription = CASE WHEN status = 'active' THEN TRUE ELSE FALSE END,
        stripe_customer_id = customer_id,
        stripe_subscription_id = subscription_id,
        subscription_status = status,
        subscription_plan = plan,
        subscription_current_period_start = period_start,
        subscription_current_period_end = period_end,
        subscription_cancel_at_period_end = cancel_at_period_end,
        credits_remaining = credits,
        updated_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 