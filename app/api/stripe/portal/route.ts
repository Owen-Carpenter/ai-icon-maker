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

    // Get user's Stripe customer ID
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single()

    if (!user?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 400 }
      )
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${req.nextUrl.origin}/account`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error('Stripe portal error:', error)
    
    // Handle specific Stripe configuration error
    if (error.code === 'invalid_request_error' && 
        error.message?.includes('configuration')) {
      return NextResponse.json(
        { 
          error: 'portal_not_configured',
          message: 'Customer portal is not configured. Please set up your Stripe Customer Portal in the dashboard first.'
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'internal_server_error',
        message: 'Unable to access subscription management. Please try again later.' 
      },
      { status: 500 }
    )
  }
} 