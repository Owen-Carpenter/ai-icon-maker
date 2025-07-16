import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
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

    // Get the current user (more secure than getSession)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Try to fetch user data from users table
    let { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // If user doesn't exist in users table, create them
    if (error?.code === 'PGRST116' || !userData) {
      console.log('User not found in users table, creating...')
      
      // Create user record
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          has_paid_subscription: false,
          subscription_status: 'inactive',
          subscription_plan: 'free',
          credits_remaining: 5
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user record:', createError)
        return NextResponse.json(
          { error: 'Failed to create user record' },
          { status: 500 }
        )
      }

      userData = newUser
    } else if (error) {
      console.error('Error fetching user data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    // Check if user has active subscription
    let hasActiveSubscription = false
    
    // Simple check: user has paid subscription and status is active
    if (userData.has_paid_subscription && userData.subscription_status === 'active') {
      // Also check if subscription hasn't expired
      if (!userData.subscription_current_period_end || 
          new Date(userData.subscription_current_period_end) > new Date()) {
        hasActiveSubscription = true
      }
    }

    return NextResponse.json({
      user: userData,
      hasActiveSubscription
    })

  } catch (error: any) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 