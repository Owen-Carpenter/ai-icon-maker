# Pricing Structure Setup Guide

## New Pricing Structure

The SaaS now supports three pricing tiers with proper handling of one-time purchases and recurring subscriptions:

### 1. **Starter Pack** - $5 (One-Time Purchase)
- 25 credits (one-time, non-expiring for 1 year)
- No recurring charges
- Perfect for trying out the service
- Uses Stripe **payment mode** (not subscription)

### 2. **Monthly** - $10/month (Recurring Subscription)
- 50 credits per month
- Renews monthly
- Can cancel anytime
- Uses Stripe **subscription mode**

### 3. **Yearly** - $96/year (Recurring Subscription)
- 700 credits per year
- Saves $24 compared to monthly ($8/month effective rate)
- Renews annually
- Uses Stripe **subscription mode**

## Required Stripe Configuration

### Step 1: Create Products and Prices in Stripe Dashboard

You need to create three products in your Stripe Dashboard:

#### Product 1: Starter Pack
- **Type**: One-time payment
- **Name**: Starter Pack
- **Price**: $5.00 USD
- **Billing**: One-time
- Copy the Price ID (e.g., `price_xxxxxxxxxxxxx`)

#### Product 2: Monthly Subscription
- **Type**: Recurring subscription
- **Name**: Monthly
- **Price**: $10.00 USD
- **Billing**: Monthly
- Copy the Price ID (e.g., `price_xxxxxxxxxxxxx`)

#### Product 3: Yearly Subscription
- **Type**: Recurring subscription
- **Name**: Yearly
- **Price**: $96.00 USD
- **Billing**: Yearly
- Copy the Price ID (e.g., `price_xxxxxxxxxxxxx`)

### Step 2: Set Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# New Pricing Structure
STRIPE_STARTER_PRICE_ID=price_xxxxxxxxxxxxx  # Starter Pack ($5 one-time)
STRIPE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx  # Monthly ($10/month)
STRIPE_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx   # Yearly ($96/year)

# Legacy (Optional - for backward compatibility)
STRIPE_BASE_PRICE_ID=price_xxxxxxxxxxxxx     # Old base plan
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx      # Old pro plan
STRIPE_PRO_PLUS_PRICE_ID=price_xxxxxxxxxxxxx # Old pro+ plan
```

### Step 3: Run Database Migration

Apply the new migration to add one-time credit support:

```bash
# If using Supabase CLI
supabase db push

# Or apply the migration directly
psql $DATABASE_URL -f supabase/migrations/026_add_one_time_credits_support.sql
```

This migration:
- Creates `one_time_purchases` table to track one-time credit purchases
- Adds `add_one_time_credits()` function to handle credit additions
- Updates `get_monthly_token_limit()` to support new plan types
- Updates subscription table constraints to allow new plan types

### Step 4: Configure Stripe Webhook

Ensure your Stripe webhook is configured to listen for these events:
- `checkout.session.completed` - Handles both one-time purchases and subscription starts
- `customer.subscription.created` - New subscriptions
- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Cancellations
- `invoice.payment_failed` - Failed payments

The webhook endpoint: `https://yourdomain.com/api/stripe/webhook`

## How It Works

### One-Time Purchases (Starter Pack)

1. **User clicks "Get Started"** on Starter Pack
2. **Checkout session** created with `mode: 'payment'` (not subscription)
3. **Webhook receives** `checkout.session.completed` event
4. **System detects** `is_one_time: true` in metadata
5. **Credits added** via `add_one_time_credits()` function
6. **Credits are available** immediately and don't expire for 1 year
7. **No recurring charges** - user can purchase again if needed

### Recurring Subscriptions (Monthly/Yearly)

1. **User clicks subscribe** on Monthly or Yearly
2. **Checkout session** created with `mode: 'subscription'`
3. **Webhook receives** `checkout.session.completed` event
4. **Subscription created** in database via `webhook_upsert_subscription()`
5. **Credits refresh** based on plan (50/month or 700/year)
6. **Auto-renewal** handled by Stripe

### Credit Tracking

Credits are tracked through the `subscriptions` table:
- `monthly_token_limit` = Total available credits
- Usage tracked in `usage_tracking` table
- Remaining = `monthly_token_limit - sum(tokens_used)`

For one-time purchases:
- Credits are **added** to existing `monthly_token_limit`
- Multiple starter packs can be purchased to accumulate credits
- Credits don't reset monthly like subscriptions

## Files Modified

### Core Configuration
- `lib/subscription-plans.ts` - Plan definitions and credits
- `lib/stripe.ts` - Stripe price ID mappings

### API Routes
- `app/api/stripe/checkout/route.ts` - Handles payment vs subscription mode
- `app/api/stripe/webhook/route.ts` - Processes one-time purchases

### Database
- `supabase/migrations/026_add_one_time_credits_support.sql` - New migration

### UI Components
- `app/(marketing)/page.tsx` - Updated pricing cards
- `components/MarketingPageLayout.tsx` - Updated pricing cards
- `app/(app)/usage/page.tsx` - Updated usage information

## Testing

### Test One-Time Purchase
1. Use Stripe test mode
2. Click "Get Started" on Starter Pack
3. Use test card: `4242 4242 4242 4242`
4. Verify credits are added to account
5. Confirm no subscription is created

### Test Recurring Subscription
1. Use Stripe test mode
2. Click "Subscribe Monthly" or "Subscribe Yearly"
3. Use test card: `4242 4242 4242 4242`
4. Verify subscription is created
5. Check credits reset according to plan period

### Test Credit Usage
1. Generate icons to use credits
2. Verify credits are properly deducted
3. Check usage page shows correct remaining credits
4. Test running out of credits shows proper paywall

## Migration Path for Existing Users

Legacy plans are maintained for backward compatibility:
- `base` (25 credits/month) → Consider migrating to `starter` or `monthly`
- `pro` (100 credits/month) → Migrate to `monthly` (50) + purchase extras
- `proPlus` (200 credits/month) → Migrate to `yearly` (700/year)

Existing subscriptions will continue to work without interruption.

## Troubleshooting

### Issue: Credits not adding after purchase
- Check webhook logs in Stripe Dashboard
- Verify `STRIPE_STARTER_PRICE_ID` environment variable is set
- Check database logs for `add_one_time_credits()` function errors

### Issue: Subscription mode instead of payment mode
- Verify `planType === 'starter'` in checkout route
- Check that `mode: 'payment'` is being set for starter pack

### Issue: Wrong credit amounts
- Verify `getCreditsForPlan()` function returns correct amounts
- Check `get_monthly_token_limit()` database function

## Support

For issues or questions about the pricing implementation, check:
1. Stripe Dashboard logs
2. Supabase database logs
3. Application server logs
4. This documentation

---

**Last Updated**: December 2025
**Version**: 1.0.0

