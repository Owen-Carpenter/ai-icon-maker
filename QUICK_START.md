# Quick Start Guide - New Pricing Implementation

## ✅ What's Been Done

All code changes have been completed and are ready for deployment:

1. **Starter Pack ($5)** - One-time purchase with 25 credits ✅
2. **Monthly ($10/month)** - Recurring subscription with 50 credits ✅
3. **Yearly ($96/year)** - Recurring subscription with 700 credits ✅

## 🚀 What You Need to Do

### Step 1: Create Stripe Products (5 minutes)

Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)

**Create Product 1: Starter Pack**
- Click "Add product"
- Name: `Starter Pack`
- Price: `$5.00` USD
- Billing: `One time`
- Click "Save product"
- **Copy the Price ID** (starts with `price_`)

**Create Product 2: Monthly**
- Click "Add product"
- Name: `Monthly`
- Price: `$10.00` USD
- Billing: `Recurring` → `Monthly`
- Click "Save product"
- **Copy the Price ID**

**Create Product 3: Yearly**
- Click "Add product"
- Name: `Yearly`
- Price: `$96.00` USD
- Billing: `Recurring` → `Yearly`
- Click "Save product"
- **Copy the Price ID**

### Step 2: Update Environment Variables (2 minutes)

Add these to your `.env.local` or hosting environment:

```bash
STRIPE_STARTER_PRICE_ID=price_xxxxxxxxxxxxx  # From Step 1
STRIPE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx  # From Step 1
STRIPE_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx   # From Step 1
```

### Step 3: Run Database Migration (1 minute)

```bash
# If using Supabase
cd supabase
supabase db push

# Or connect directly to your database
psql $DATABASE_URL -f supabase/migrations/026_add_one_time_credits_support.sql
```

### Step 4: Test in Stripe Test Mode (10 minutes)

1. Make sure you're in **Test Mode** (toggle in Stripe Dashboard)
2. Click "Get Started" on Starter Pack
3. Use test card: `4242 4242 4242 4242`
4. Verify 25 credits are added
5. Generate an icon to test credit deduction

### Step 5: Deploy! 🎉

Everything is ready. Deploy your changes and you're live!

## 📋 Quick Checklist

- [ ] Created 3 products in Stripe
- [ ] Added 3 environment variables
- [ ] Ran database migration
- [ ] Tested starter pack purchase
- [ ] Tested monthly subscription
- [ ] Tested yearly subscription
- [ ] Verified credit tracking works
- [ ] Deployed to production

## 🆘 Need Help?

- **Setup Guide**: See `PRICING_SETUP.md`
- **All Changes**: See `PRICING_CHANGES_SUMMARY.md`
- **Issues**: Check Stripe Dashboard logs and webhook events

## 💡 Pro Tips

1. **Test First**: Always test in Stripe test mode before going live
2. **Webhook**: Verify your webhook endpoint is active in Stripe
3. **Monitor**: Watch Stripe logs after deployment for any webhook errors
4. **Gradual Rollout**: Consider hiding new pricing from 90% of users initially

---

**Time Required**: ~20 minutes total  
**Difficulty**: Easy  
**Breaking Changes**: None

