import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, extractStripePeriod } from '../../../../lib/stripe'
import { supabase } from '../../../../lib/supabase'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }


    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const userId = session.metadata?.user_id
  const planType = session.metadata?.plan_type
  const isOneTime = session.metadata?.is_one_time === 'true'

  if (!userId) {
    console.error('No user_id in session metadata')
    return
  }

  try {
    // Handle one-time purchases (like starter pack)
    if (isOneTime || !subscriptionId) {
      console.log(`Processing one-time purchase for user ${userId}, plan: ${planType}`)
      
      // Get credits for the plan
      const credits = getCreditsForPlan(planType || 'starter')
      
      // Add credits to user's account via one-time credit purchase
      const { error: creditError } = await supabase.rpc('add_one_time_credits', {
        p_user_id: userId,
        p_credits: credits,
        p_plan_type: planType || 'starter',
        p_stripe_customer_id: customerId,
        p_payment_intent_id: session.payment_intent as string || null
      })

      if (creditError) {
        console.error('Error adding one-time credits:', creditError)
        throw creditError
      }

      console.log(`Added ${credits} one-time credits for user ${userId}`)
      return
    }

    // Handle recurring subscriptions
    console.log(`Processing subscription for user ${userId}, plan: ${planType}`)
    
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    // Safely convert timestamps (supports both legacy and new Stripe API response shapes)
    const { start: periodStart, end: periodEnd } = extractStripePeriod(subscription as any)
    
    // Use our new webhook subscription upsert function
    const { error } = await supabase.rpc('webhook_upsert_subscription', {
      p_user_id: userId,
      p_stripe_customer_id: customerId,
      p_stripe_subscription_id: subscriptionId,
      p_plan_type: planType || 'free',
      p_status: subscription.status,
      p_current_period_start: periodStart,
      p_current_period_end: periodEnd,
      p_cancel_at_period_end: subscription.cancel_at_period_end || false
    })

    if (error) {
      console.error('Database update error:', error)
      throw error
    }

  } catch (error) {
    console.error('Error handling checkout session completed:', error)
    throw error
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  
  const customerId = subscription.customer as string
  
  // Find user by customer ID in subscriptions table
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!existingSubscription) {
    console.error(`No user found for customer ${customerId}`)
    return
  }

  // Get plan type from price ID
  const priceId = subscription.items.data[0]?.price.id
  const planType = getPlanTypeFromPriceId(priceId)

  const { start: periodStart, end: periodEnd } = extractStripePeriod(subscription as any)

  // Use our new webhook subscription upsert function
  await supabase.rpc('webhook_upsert_subscription', {
    p_user_id: existingSubscription.user_id,
    p_stripe_customer_id: customerId,
    p_stripe_subscription_id: subscription.id,
    p_plan_type: planType,
    p_status: subscription.status,
    p_current_period_start: periodStart,
    p_current_period_end: periodEnd,
    p_cancel_at_period_end: subscription.cancel_at_period_end || false
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  
  // Find subscription record directly
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (!existingSubscription) {
    console.error(`No subscription found for subscription ${subscription.id}`)
    return
  }

  // Get plan type from price ID
  const priceId = subscription.items.data[0]?.price.id
  const planType = getPlanTypeFromPriceId(priceId)

  const { start: periodStart, end: periodEnd } = extractStripePeriod(subscription as any)

  // Update subscription directly
  await supabase
    .from('subscriptions')
    .update({
      plan_type: planType,
      status: subscription.status,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      monthly_token_limit: getCreditsForPlan(planType),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  
  // Update subscription status to canceled
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: false,
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  
  const customerId = invoice.customer as string
  const subscriptionId = (invoice as any).subscription as string

  if (!subscriptionId) return

  // Find user by subscription (using new database structure)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan_type, monthly_token_limit')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (!subscription) {
    console.error(`No subscription found for subscription ${subscriptionId}`)
    return
  }

  // Note: Token reset is now handled automatically by the usage tracking system
  // based on billing periods. No need to manually reset tokens here.
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  
  const customerId = invoice.customer as string
  
  // Find user by customer ID
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!user) {
    console.error(`No user found for customer ${customerId}`)
    return
  }

  // You might want to send an email notification here
  // For now, we'll just log it
}

function getPlanTypeFromPriceId(priceId: string): string {
  // New plan types
  const starterPriceId = process.env.STRIPE_STARTER_PRICE_ID
  const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID
  const yearlyPriceId = process.env.STRIPE_YEARLY_PRICE_ID
  
  // Legacy plan types
  const basePriceId = process.env.STRIPE_BASE_PRICE_ID
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID
  const proPlusPriceId = process.env.STRIPE_PRO_PLUS_PRICE_ID
  const enterprisePriceId = process.env.STRIPE_UNLIMITED_PRICE_ID

  // Check new plan types first
  if (priceId === starterPriceId) return 'starter'
  if (priceId === monthlyPriceId) return 'monthly'
  if (priceId === yearlyPriceId) return 'yearly'
  
  // Check legacy plan types
  if (priceId === basePriceId) return 'base'
  if (priceId === proPriceId) return 'pro'
  if (priceId === proPlusPriceId) return 'proPlus'
  if (priceId === enterprisePriceId) return 'proPlus' // Legacy enterprise maps to pro+
  return 'free'
}

function getCreditsForPlan(planType: string): number {
  switch (planType) {
    // New plan types
    case 'starter':
      return 25 // Starter pack: $5 for 25 credits (one-time)
    case 'monthly':
      return 50 // Monthly: $10 for 50 credits per month
    case 'yearly':
      return 700 // Yearly: $96 for 700 credits per year
    
    // Legacy plan types (for backward compatibility)
    case 'base':
      return 25 // Legacy base tier
    case 'pro':
      return 100 // Legacy pro tier
    case 'proPlus':
      return 200 // Legacy pro+ tier
    case 'enterprise':
      return 200 // Legacy enterprise
    case 'free':
      return 0 // Free tier has no credits
    
    default:
      return 0
  }
} 