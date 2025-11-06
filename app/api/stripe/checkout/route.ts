import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG, getStripePriceId } from '../../../../lib/stripe'
import { SUBSCRIPTION_PLANS } from '../../../../lib/subscription-plans'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    // Check for required environment variables
    const requiredEnvVars = {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
    
    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars)
      return NextResponse.json(
        { error: `Missing environment variables: ${missingVars.join(', ')}` },
        { status: 500 }
      )
    }

    const { planType } = await req.json()

    if (!planType) {
      return NextResponse.json(
        { error: 'Missing plan type' },
        { status: 400 }
      )
    }

    // Verify the plan exists
    if (!SUBSCRIPTION_PLANS[planType as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      )
    }

    // Get the actual Stripe price ID
    const priceId = getStripePriceId(planType)
    if (!priceId) {
      console.error(`Price ID not found for plan: ${planType}`)
      console.error('Available environment variables:', {
        STRIPE_BASE_PRICE_ID: process.env.STRIPE_BASE_PRICE_ID,
        STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
        STRIPE_PRO_PLUS_PRICE_ID: process.env.STRIPE_PRO_PLUS_PRICE_ID,
        STRIPE_UNLIMITED_PRICE_ID: process.env.STRIPE_UNLIMITED_PRICE_ID,
      })
      return NextResponse.json(
        { error: 'Price ID not configured for this plan' },
        { status: 500 }
      )
    }

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

    // Get or create subscription record for user
    let customerId: string | null = null
    
    try {
      // Check if user already has a subscription with customer ID
      const { data: existingSubscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', session.user.id)
        .single()

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Error fetching subscription:', subscriptionError)
        throw subscriptionError
      }

      customerId = existingSubscription?.stripe_customer_id

      // Validate existing customer ID if it exists
      if (customerId) {
        try {
          await stripe.customers.retrieve(customerId)
        } catch (stripeError: any) {
          if (stripeError.code === 'resource_missing') {
            customerId = null // Reset to null so we create a new one
          } else {
            console.error('Error validating customer ID:', stripeError)
            throw stripeError
          }
        }
      }

      // Create Stripe customer if doesn't exist or is invalid
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: session.user.email!,
          metadata: {
            supabase_user_id: session.user.id,
          },
        })
        customerId = customer.id

        // Use our helper function to get or create subscription
        const { error: rpcError } = await supabase.rpc('get_or_create_subscription_for_user', {
          p_user_id: session.user.id
        })
        
        if (rpcError) {
          console.error('Error creating subscription record:', rpcError)
          throw rpcError
        }

        // Update the subscription with the Stripe customer ID
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ stripe_customer_id: customerId })
          .eq('user_id', session.user.id)
        
        if (updateError) {
          console.error('Error updating subscription with customer ID:', updateError)
          throw updateError
        }
      }
    } catch (dbError) {
      console.error('Database error in checkout:', dbError)
      return NextResponse.json(
        { error: 'Database error during checkout setup' },
        { status: 500 }
      )
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${req.nextUrl?.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/generate?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl?.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account?canceled=true`,
      metadata: {
        user_id: session.user.id,
        plan_type: planType,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 