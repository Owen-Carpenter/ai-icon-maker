import { NextRequest, NextResponse } from 'next/server'
import { stripe, extractStripePeriod } from '../../../../lib/stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Get the current user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's subscription details from subscriptions table
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, stripe_customer_id, plan_type')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single()

    if (!subscription?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Parse request body to check for immediate cancellation
    const body = await req.json().catch(() => ({}))
    const { immediate = false } = body

    // Cancel the subscription in Stripe
    const canceledSubscription = immediate 
      ? await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
      : await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: true,
        })

    // Update the subscription status in our database
    if (immediate) {
      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          cancel_at_period_end: false,
          canceled_at: new Date().toISOString(),
        })
        .eq('user_id', session.user.id)
        .eq('stripe_subscription_id', subscription.stripe_subscription_id)
    } else {
      await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: true,
        })
        .eq('user_id', session.user.id)
        .eq('stripe_subscription_id', subscription.stripe_subscription_id)
    }

    return NextResponse.json({
      success: true,
      message: immediate 
        ? 'Subscription canceled immediately' 
        : 'Subscription will be canceled at the end of the current billing period',
      canceledAt: immediate ? new Date().toISOString() : null,
      cancelAtPeriodEnd: !immediate,
      currentPeriodEnd: extractStripePeriod(canceledSubscription as any).end,
    })

  } catch (error: any) {
    console.error('Subscription cancellation error:', error)
    
    if (error.code === 'resource_missing') {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Unable to cancel subscription. Please try again later.',
        details: error.message 
      },
      { status: 500 }
    )
  }
} 