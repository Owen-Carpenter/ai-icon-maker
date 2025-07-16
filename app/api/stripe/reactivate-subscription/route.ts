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
      .select('stripe_subscription_id, subscription_cancel_at_period_end')
      .eq('id', session.user.id)
      .single()

    if (!user?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    if (!user.subscription_cancel_at_period_end) {
      return NextResponse.json(
        { error: 'Subscription is not canceled' },
        { status: 400 }
      )
    }

    // Reactivate the subscription in Stripe by removing cancel_at_period_end
    const reactivatedSubscription = await stripe.subscriptions.update(user.stripe_subscription_id, {
      cancel_at_period_end: false,
    })

    // Update the user's subscription status in our database
    await supabase
      .from('users')
      .update({
        subscription_cancel_at_period_end: false,
      })
      .eq('id', session.user.id)

    return NextResponse.json({
      success: true,
      message: 'Subscription reactivated successfully',
      subscription: {
        id: reactivatedSubscription.id,
        status: reactivatedSubscription.status,
        cancel_at_period_end: reactivatedSubscription.cancel_at_period_end,
        current_period_end: (reactivatedSubscription as any).current_period_end 
          ? new Date((reactivatedSubscription as any).current_period_end * 1000).toISOString() 
          : null,
      }
    })

  } catch (error: any) {
    console.error('Subscription reactivation error:', error)
    
    if (error.code === 'resource_missing') {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Unable to reactivate subscription. Please try again later.',
        details: error.message 
      },
      { status: 500 }
    )
  }
} 