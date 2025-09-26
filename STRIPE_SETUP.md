# Stripe Payment Integration Setup Guide

This guide will walk you through setting up Stripe payments for your AI Icon Maker application.

## Prerequisites

- Stripe account (create one at [stripe.com](https://stripe.com))
- Vercel or similar hosting platform for webhook endpoints
- Supabase database already configured

## 1. Stripe Dashboard Configuration

### Create Products and Prices

1. **Navigate to Products** in your Stripe Dashboard
2. **Create the following products:**

#### Base Plan Product
- **Name:** Base Plan
- **Description:** 25 AI generations per month
- **Pricing:** $5.00/month recurring

#### Pro Plan Product
- **Name:** Pro Plan
- **Description:** 100 AI generations per month with priority support
- **Pricing:** $10.00/month recurring

#### Pro+ Plan Product  
- **Name:** Pro+ Plan
- **Description:** 200 AI generations per month with extended storage
- **Pricing:** $15.00/month recurring

3. **Copy the Price IDs** for each plan - you'll need these for environment variables

### Configure Webhooks

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. **Endpoint URL:** `https://your-domain.com/api/stripe/webhook`
4. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** - you'll need this for `STRIPE_WEBHOOK_SECRET`

### Customer Portal Configuration

1. Go to **Settings > Billing > Customer portal**
2. **Activate** the customer portal
3. Configure the following settings:
   - **Business information:** Add your company details
   - **Privacy policy:** Add your privacy policy URL
   - **Terms of service:** Add your terms of service URL
   - **Features:** Enable subscription cancellation, plan changes, and payment method updates

## 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret

# Stripe Price IDs
STRIPE_BASE_PRICE_ID=price_your_base_monthly_price_id
STRIPE_PRO_PRICE_ID=price_your_pro_monthly_price_id
STRIPE_PRO_PLUS_PRICE_ID=price_your_pro_plus_monthly_price_id
STRIPE_UNLIMITED_PRICE_ID=price_your_legacy_enterprise_price_id
```

### How to Find Your Keys:

1. **Secret Key:** Developers > API keys > Secret key
2. **Publishable Key:** Developers > API keys > Publishable key  
3. **Webhook Secret:** Developers > Webhooks > Select your webhook > Signing secret
4. **Price IDs:** Products > Select product > Copy price ID

## 3. Database Migration

Run the Supabase migration to add subscription fields:

```bash
# If using Supabase CLI
supabase db reset

# Or manually run the SQL from supabase/migrations/001_add_subscription_fields.sql
```

The migration adds these fields to the `profiles` table:
- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_status`
- `subscription_plan`
- `subscription_current_period_start`
- `subscription_current_period_end`
- `credits_remaining`

## 4. Testing the Integration

### Test Mode Setup

1. Use **test mode** keys from Stripe Dashboard
2. **Test credit cards:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

### Testing Workflow

1. **Create account** in your app
2. **Navigate to account page**
3. **Click "Upgrade to Pro"**
4. **Complete checkout** with test card
5. **Verify subscription** appears in Stripe Dashboard
6. **Check database** for updated user profile
7. **Test customer portal** access

### Webhook Testing

1. Use **Stripe CLI** for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
2. Trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   ```

## 5. Production Deployment

### Webhook Endpoint

1. **Deploy your app** to production
2. **Update webhook endpoint** URL in Stripe Dashboard
3. **Replace test keys** with live keys in production environment

### Security Checklist

- ✅ Webhook signature verification enabled
- ✅ API keys stored in environment variables
- ✅ HTTPS enabled for all endpoints
- ✅ Row Level Security enabled in Supabase
- ✅ Customer portal activated

## 6. Monitoring & Analytics

### Stripe Dashboard

Monitor these metrics:
- **Monthly Recurring Revenue (MRR)**
- **Subscription churn rate**
- **Failed payments**
- **Subscription upgrades/downgrades**

### Application Monitoring

Track these events:
- Successful subscriptions
- Failed payments
- Webhook delivery failures
- User credit consumption

## 7. Common Issues & Troubleshooting

### Webhook Issues

**Problem:** Webhooks not being received
- Check webhook URL is correct and accessible
- Verify endpoint is returning 200 status
- Check webhook signing secret

**Problem:** Signature verification failing
- Ensure webhook secret is correct
- Check raw body is being used for verification

### Payment Issues

**Problem:** Checkout session creation failing
- Verify API keys are correct
- Check price IDs exist in Stripe
- Ensure customer creation is working

### Database Issues

**Problem:** User profile not updating
- Check webhook handlers are working
- Verify database permissions
- Check Supabase connection

## 8. Support & Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Webhook Testing Guide](https://stripe.com/docs/webhooks/test)
- [Customer Portal Guide](https://stripe.com/docs/billing/subscriptions/customer-portal)

For issues with this integration, check the application logs and Stripe Dashboard event logs for detailed error information. 