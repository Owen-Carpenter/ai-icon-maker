# Pricing Structure Changes - Summary

## Overview
Successfully updated the SaaS to support a new three-tier pricing structure with proper handling of one-time purchases (Starter Pack) and recurring subscriptions (Monthly/Yearly).

## New Pricing Structure

| Plan | Price | Credits | Type | Key Feature |
|------|-------|---------|------|-------------|
| **Starter Pack** | $5 | 25 | One-time | No recurring charges |
| **Monthly** | $10/month | 50/month | Subscription | Cancel anytime |
| **Yearly** | $96/year | 700/year | Subscription | Save $24/year |

## Changes Made

### 1. **Updated Plan Definitions** (`lib/subscription-plans.ts`)
- ✅ Added new plan types: `starter`, `monthly`, `yearly`
- ✅ Updated credit amounts: 25, 50, 700
- ✅ Added `isOneTime` flag for starter pack
- ✅ Maintained legacy plans for backward compatibility

### 2. **Updated Stripe Integration** (`lib/stripe.ts`)
- ✅ Added new price ID mappings
- ✅ Support for `STRIPE_STARTER_PRICE_ID`, `STRIPE_MONTHLY_PRICE_ID`, `STRIPE_YEARLY_PRICE_ID`
- ✅ Maintained backward compatibility with legacy price IDs

### 3. **Enhanced Checkout Flow** (`app/api/stripe/checkout/route.ts`)
- ✅ Detects one-time vs subscription purchases
- ✅ Uses `mode: 'payment'` for starter pack
- ✅ Uses `mode: 'subscription'` for monthly/yearly
- ✅ Adds `is_one_time` metadata to sessions

### 4. **Updated Webhook Handler** (`app/api/stripe/webhook/route.ts`)
- ✅ Handles `checkout.session.completed` for both payment types
- ✅ Calls `add_one_time_credits()` for starter pack
- ✅ Calls `webhook_upsert_subscription()` for subscriptions
- ✅ Updated `getCreditsForPlan()` with new amounts
- ✅ Updated `getPlanTypeFromPriceId()` with new mappings

### 5. **Database Migration** (`supabase/migrations/026_add_one_time_credits_support.sql`)
- ✅ Created `one_time_purchases` table
- ✅ Added `add_one_time_credits()` function
- ✅ Updated `get_monthly_token_limit()` function
- ✅ Updated subscription plan type constraints
- ✅ Added proper indexes and RLS policies

### 6. **Updated Marketing Pages**
- ✅ `app/(marketing)/page.tsx` - New pricing cards with correct amounts
- ✅ `components/MarketingPageLayout.tsx` - New pricing cards for subpages
- ✅ Updated FAQ sections to reflect new pricing
- ✅ Updated savings callouts ($24/year for yearly plan)
- ✅ Added "Best Value" badge to yearly plan

### 7. **Updated Usage Page** (`app/(app)/usage/page.tsx`)
- ✅ Updated plan information in tips section
- ✅ Shows correct credit amounts for each tier

## Key Technical Features

### One-Time Credit System
- Credits are added to user's account immediately upon purchase
- Credits don't expire for 1 year
- No recurring charges
- Users can purchase multiple starter packs to accumulate credits
- Tracked separately in `one_time_purchases` table

### Subscription Credit System
- Credits refresh based on subscription period (monthly/yearly)
- Auto-renewal handled by Stripe
- Credits reset at each billing cycle
- Standard subscription management (cancel, upgrade, downgrade)

### Credit Tracking
```
Total Available = monthly_token_limit (from subscriptions table)
Total Used = sum(tokens_used) from usage_tracking
Remaining = Total Available - Total Used
```

### Backward Compatibility
Legacy plans maintained:
- `base` → 25 credits (maps to `starter` pricing)
- `pro` → 100 credits (legacy, not offered to new users)
- `proPlus` → 200 credits (legacy, not offered to new users)

## Environment Variables Required

```bash
# New Pricing (Required)
STRIPE_STARTER_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx

# Legacy (Optional, for existing subscriptions)
STRIPE_BASE_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_PRO_PLUS_PRICE_ID=price_xxxxxxxxxxxxx
```

## Setup Checklist

- [ ] Create three products in Stripe Dashboard
- [ ] Copy Price IDs to environment variables
- [ ] Run database migration `026_add_one_time_credits_support.sql`
- [ ] Test one-time purchase with Stripe test mode
- [ ] Test recurring subscriptions with Stripe test mode
- [ ] Verify webhook processes both payment types correctly
- [ ] Test credit deduction on icon generation
- [ ] Verify usage page displays correct information
- [ ] Update production environment variables
- [ ] Monitor Stripe webhook logs after deployment

## Testing Checklist

### Starter Pack (One-Time)
- [ ] Can purchase starter pack successfully
- [ ] Credits added immediately (25 credits)
- [ ] No subscription created
- [ ] No recurring charges
- [ ] Can purchase multiple times (credits accumulate)
- [ ] Credits tracked in `one_time_purchases` table

### Monthly Subscription
- [ ] Can subscribe successfully
- [ ] Subscription created in database
- [ ] 50 credits available
- [ ] Credits refresh monthly
- [ ] Can cancel subscription
- [ ] Cancellation properly handled

### Yearly Subscription
- [ ] Can subscribe successfully
- [ ] Subscription created in database
- [ ] 700 credits available
- [ ] Credits refresh yearly
- [ ] Shows $24 savings
- [ ] Can cancel subscription

### Credit Usage
- [ ] Icon generation deducts 1 credit
- [ ] Icon improvement deducts 3 credits
- [ ] Remaining credits calculated correctly
- [ ] Usage page shows accurate data
- [ ] Paywall triggers when out of credits

## Files Changed

```
lib/subscription-plans.ts                               (Modified)
lib/stripe.ts                                          (Modified)
app/api/stripe/checkout/route.ts                       (Modified)
app/api/stripe/webhook/route.ts                        (Modified)
app/(marketing)/page.tsx                                (Modified)
components/MarketingPageLayout.tsx                      (Modified)
app/(app)/usage/page.tsx                                (Modified)
supabase/migrations/026_add_one_time_credits_support.sql (New)
PRICING_SETUP.md                                        (New)
PRICING_CHANGES_SUMMARY.md                              (New)
```

## Deployment Steps

1. **Merge changes to main branch**
2. **Set environment variables in production**
   - Add new Stripe price IDs
3. **Run database migration**
   ```bash
   supabase db push
   ```
4. **Deploy application**
5. **Verify webhook is working**
   - Check Stripe Dashboard > Developers > Webhooks
6. **Test with Stripe test mode first**
7. **Monitor logs for any errors**
8. **Announce new pricing to users**

## Rollback Plan

If issues occur:
1. Revert code changes via git
2. Keep database migration (safe, maintains legacy plans)
3. Existing subscriptions continue to work
4. New signups will use legacy plan names until fixed

## Success Metrics

Monitor these metrics after deployment:
- Starter pack purchase conversion rate
- Monthly vs Yearly subscription ratio
- Average credits used per user
- Revenue per user (starter vs subscriptions)
- Churn rate comparison between plans

---

**Implementation Date**: December 2025  
**Status**: ✅ Ready for Testing  
**Breaking Changes**: None (backward compatible)

