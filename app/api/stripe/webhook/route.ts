import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../../lib/stripe'
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

    console.log('Received Stripe webhook:', event.type)

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
        console.log(`Unhandled event type: ${event.type}`)
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
  console.log('Processing checkout session completed:', session.id)
  
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const userId = session.metadata?.user_id
  const planType = session.metadata?.plan_type

  if (!userId) {
    console.error('No user_id in session metadata')
    return
  }

  if (!subscriptionId) {
    console.error('No subscription_id in session')
    return
  }

  try {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    // Safely convert timestamps
    const periodStart = (subscription as any).current_period_start 
      ? new Date((subscription as any).current_period_start * 1000).toISOString()
      : null
    const periodEnd = (subscription as any).current_period_end 
      ? new Date((subscription as any).current_period_end * 1000).toISOString() 
      : null
    
    // Update user using the database function
    const { error } = await supabase.rpc('update_user_subscription', {
      user_id: userId,
      customer_id: customerId,
      subscription_id: subscriptionId,
      status: subscription.status,
      plan: planType,
      period_start: periodStart,
      period_end: periodEnd,
      credits: getCreditsForPlan(planType || 'free'),
      cancel_at_period_end: subscription.cancel_at_period_end || false
    })

    if (error) {
      console.error('Database update error:', error)
      throw error
    }

    console.log(`Updated user ${userId} with subscription ${subscriptionId}`)
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
    throw error
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing subscription created:', subscription.id)
  
  const customerId = subscription.customer as string
  
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

  // Get plan type from price ID
  const priceId = subscription.items.data[0]?.price.id
  const planType = getPlanTypeFromPriceId(priceId)

  // Safely convert timestamps
  const periodStart = (subscription as any).current_period_start 
    ? new Date((subscription as any).current_period_start * 1000).toISOString()
    : null
  const periodEnd = (subscription as any).current_period_end 
    ? new Date((subscription as any).current_period_end * 1000).toISOString() 
    : null

  // Update user using the database function
  await supabase.rpc('update_user_subscription', {
    user_id: user.id,
    customer_id: customerId,
    subscription_id: subscription.id,
    status: subscription.status,
    plan: planType,
    period_start: periodStart,
    period_end: periodEnd,
    credits: getCreditsForPlan(planType),
    cancel_at_period_end: subscription.cancel_at_period_end || false
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription updated:', subscription.id)
  
  const customerId = subscription.customer as string
  
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

  // Get plan type from price ID
  const priceId = subscription.items.data[0]?.price.id
  const planType = getPlanTypeFromPriceId(priceId)

  // Safely convert timestamps
  const periodStart = (subscription as any).current_period_start 
    ? new Date((subscription as any).current_period_start * 1000).toISOString()
    : null
  const periodEnd = (subscription as any).current_period_end 
    ? new Date((subscription as any).current_period_end * 1000).toISOString() 
    : null

  // Update user using the database function
  await supabase.rpc('update_user_subscription', {
    user_id: user.id,
    customer_id: customerId,
    subscription_id: subscription.id,
    status: subscription.status,
    plan: planType,
    period_start: periodStart,
    period_end: periodEnd,
    credits: getCreditsForPlan(planType),
    cancel_at_period_end: subscription.cancel_at_period_end || false
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deleted:', subscription.id)
  
  const customerId = subscription.customer as string
  
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

  // Reset to free plan using the database function
  await supabase.rpc('update_user_subscription', {
    user_id: user.id,
    customer_id: customerId,
    subscription_id: null,
    status: 'canceled',
    plan: 'free',
    period_start: null,
    period_end: null,
    credits: getCreditsForPlan('free'),
    cancel_at_period_end: false
  })
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment succeeded:', invoice.id)
  
  const customerId = invoice.customer as string
  const subscriptionId = (invoice as any).subscription as string

  if (!subscriptionId) return

  // Find user by customer ID
  const { data: user } = await supabase
    .from('users')
    .select('id, subscription_plan')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!user) {
    console.error(`No user found for customer ${customerId}`)
    return
  }

  // Reset credits for the new billing period
  const credits = getCreditsForPlan(user.subscription_plan || 'free')
  
  await supabase
    .from('users')
    .update({
      credits_remaining: credits,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment failed:', invoice.id)
  
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
  console.log(`Payment failed for user ${user.id}`)
}

function getPlanTypeFromPriceId(priceId: string): string {
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID
  const unlimitedPriceId = process.env.STRIPE_UNLIMITED_PRICE_ID

  if (priceId === proPriceId) return 'pro'
  if (priceId === unlimitedPriceId) return 'unlimited'
  return 'free'
}

function getCreditsForPlan(planType: string): number {
  switch (planType) {
    case 'free':
      return 5
    case 'pro':
      return 200 // Updated to match new pricing
    case 'unlimited':
      return 1000 // Updated to match new Enterprise pricing
    default:
      return 5
  }
} 