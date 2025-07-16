-- Create users table with subscription and payment information
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    
    -- Subscription and Payment fields
    has_paid_subscription BOOLEAN DEFAULT FALSE,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
    subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'unlimited')),
    subscription_current_period_start TIMESTAMPTZ,
    subscription_current_period_end TIMESTAMPTZ,
    
    -- Usage tracking
    credits_remaining INTEGER DEFAULT 5,
    total_generations_used INTEGER DEFAULT 0,
    last_generation_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS users_stripe_subscription_id_idx ON users(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS users_subscription_status_idx ON users(subscription_status);
CREATE INDEX IF NOT EXISTS users_has_paid_subscription_idx ON users(has_paid_subscription);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own record" ON users;
CREATE POLICY "Users can view own record" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own record" ON users;
CREATE POLICY "Users can update own record" ON users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own record" ON users;
CREATE POLICY "Users can insert own record" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at_column();

-- Function to handle new user signup and create user record
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.user_has_active_subscription(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
BEGIN
    SELECT has_paid_subscription, subscription_status, subscription_current_period_end
    INTO user_record
    FROM users 
    WHERE id = user_id;
    
    -- Return true if user has paid subscription and it's active and not expired
    RETURN user_record.has_paid_subscription = TRUE 
           AND user_record.subscription_status = 'active'
           AND (user_record.subscription_current_period_end IS NULL OR user_record.subscription_current_period_end > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user subscription status
CREATE OR REPLACE FUNCTION public.update_user_subscription(
    user_id UUID,
    customer_id TEXT,
    subscription_id TEXT,
    status TEXT,
    plan TEXT,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    credits INTEGER
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
        credits_remaining = credits,
        updated_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to use credits (decrement)
CREATE OR REPLACE FUNCTION public.use_user_credits(user_id UUID, credits_to_use INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
    unlimited_plan BOOLEAN;
BEGIN
    -- Get current credits and check if unlimited plan
    SELECT credits_remaining, subscription_plan = 'unlimited' INTO current_credits, unlimited_plan
    FROM users WHERE id = user_id;
    
    -- If unlimited plan, don't deduct credits
    IF unlimited_plan THEN
        UPDATE users SET 
            total_generations_used = total_generations_used + credits_to_use,
            last_generation_at = NOW()
        WHERE id = user_id;
        RETURN TRUE;
    END IF;
    
    -- Check if user has enough credits
    IF current_credits >= credits_to_use THEN
        UPDATE users SET 
            credits_remaining = credits_remaining - credits_to_use,
            total_generations_used = total_generations_used + credits_to_use,
            last_generation_at = NOW()
        WHERE id = user_id;
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Migration from profiles table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        -- Migrate existing data from profiles to users
        INSERT INTO users (id, email, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_plan, credits_remaining)
        SELECT 
            p.id,
            COALESCE(p.email, au.email) as email,
            p.stripe_customer_id,
            p.stripe_subscription_id,
            COALESCE(p.subscription_status, 'inactive') as subscription_status,
            COALESCE(p.subscription_plan, 'free') as subscription_plan,
            COALESCE(p.credits_remaining, 5) as credits_remaining
        FROM profiles p
        JOIN auth.users au ON au.id = p.id
        ON CONFLICT (id) DO UPDATE SET
            stripe_customer_id = EXCLUDED.stripe_customer_id,
            stripe_subscription_id = EXCLUDED.stripe_subscription_id,
            subscription_status = EXCLUDED.subscription_status,
            subscription_plan = EXCLUDED.subscription_plan,
            credits_remaining = EXCLUDED.credits_remaining;
        
        -- Update has_paid_subscription based on subscription status
        UPDATE users SET has_paid_subscription = TRUE WHERE subscription_status = 'active';
    END IF;
END $$; 