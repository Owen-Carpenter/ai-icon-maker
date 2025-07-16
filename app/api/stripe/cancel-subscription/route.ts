import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe'
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

    // Get user's subscription details
    const { data: user } = await supabase
      .from('users')
      .select('stripe_subscription_id, stripe_customer_id, subscription_plan')
      .eq('id', session.user.id)
      .single()

    if (!user?.stripe_subscription_id) {
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
      ? await stripe.subscriptions.cancel(user.stripe_subscription_id)
      : await stripe.subscriptions.update(user.stripe_subscription_id, {
          cancel_at_period_end: true,
        })

    // Update the user's subscription status in our database
    if (immediate) {
      await supabase
        .from('users')
        .update({
          subscription_status: 'canceled',
          subscription_plan: 'free',
          subscription_current_period_end: null,
          stripe_subscription_id: null,
        })
        .eq('id', session.user.id)
    } else {
      await supabase
        .from('users')
        .update({
          subscription_cancel_at_period_end: true,
        })
        .eq('id', session.user.id)
    }

    return NextResponse.json({
      success: true,
      message: immediate 
        ? 'Subscription canceled immediately' 
        : 'Subscription will be canceled at the end of the current billing period',
      canceledAt: immediate ? new Date().toISOString() : null,
      cancelAtPeriodEnd: !immediate,
      currentPeriodEnd: (canceledSubscription as any).current_period_end 
        ? new Date((canceledSubscription as any).current_period_end * 1000).toISOString() 
        : null,
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