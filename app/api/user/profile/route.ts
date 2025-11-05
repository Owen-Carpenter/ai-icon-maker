import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Note: Client-side caching is now handled by the global ApiCache singleton

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

    // Note: Caching is now handled client-side for better performance

    // Try to fetch user data with subscription and usage info using our new view
    let { data: userData, error } = await supabase
      .from('user_complete_profile')
      .select('*')
      .eq('id', user.id)
      .single()

    // If the view is not working correctly, calculate usage directly
    if (userData && userData.tokens_remaining === userData.monthly_token_limit) {
      // Get user's subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()
      
      // Calculate usage directly from usage_tracking
      const { data: usageData } = await supabase
        .from('usage_tracking')
        .select('tokens_used, generation_successful')
        .eq('user_id', user.id)
        .eq('subscription_id', subscription?.id || null)
      
      const totalUsed = usageData?.reduce((sum, record) => sum + record.tokens_used, 0) || 0
      const monthlyLimit = subscription?.monthly_token_limit || 5
      const remaining = Math.max(0, monthlyLimit - totalUsed)
      
      // Update the userData with correct usage
      userData.tokens_used_this_month = totalUsed
      userData.tokens_remaining = remaining
      userData.total_generations = usageData?.length || 0
      userData.successful_generations = usageData?.filter(r => r.generation_successful).length || 0
      userData.usage_percentage = monthlyLimit > 0 ? (totalUsed / monthlyLimit) * 100 : 0
    }

    // If user doesn't exist, try to create them with error handling for duplicate key
    if (error?.code === 'PGRST116' || !userData) {
      
      // Try both table names to handle migration state
      let createUserError: any = null
      let newUser: any = null
      
      // First try 'users' table
      const { data: userData1, error: error1 } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]
        })
        .select()
        .single()
      
      if (error1?.code === '23505') {
        // Duplicate key error - user already exists, try to fetch them
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (!fetchError && existingUser) {
          newUser = existingUser
        } else {
          // Try users_new table as fallback
          const { data: existingUserNew, error: fetchErrorNew } = await supabase
            .from('users_new')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (!fetchErrorNew && existingUserNew) {
            newUser = existingUserNew
          } else {
            createUserError = error1
          }
        }
      } else if (error1) {
        createUserError = error1
      } else {
        newUser = userData1
      }

      if (createUserError) {
        console.error('Error creating user record:', createUserError)
        return NextResponse.json(
          { error: 'Failed to create user record' },
          { status: 500 }
        )
      }

      // Only create subscription if we actually created a new user (not just fetched existing)
      if (newUser && !error1) {
        // Create default free subscription for the new user
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan_type: 'free',
            status: 'active',
            monthly_token_limit: 5
          })

        if (subscriptionError) {
          console.error('Error creating subscription record:', subscriptionError)
          // Continue anyway - user exists, subscription creation can be retried
        }
      }

      // Now fetch the complete profile data
      const { data: completeUserData, error: fetchError } = await supabase
        .from('user_complete_profile')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError) {
        console.error('Error fetching complete user data:', fetchError)
        // Fallback to basic user data
        userData = {
          ...newUser,
          subscription_id: null,
          plan_type: 'free',
          subscription_status: 'active',
          monthly_token_limit: 5,
          tokens_remaining: 5,
          tokens_used_this_month: 0,
          usage_percentage: 0
        }
      } else {
        userData = completeUserData
      }
    } else if (error) {
      console.error('Error fetching user data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    // Check if user has active subscription using new structure
    const hasActiveSubscription = userData.subscription_status === 'active' && 
      userData.plan_type && userData.plan_type !== 'free' &&
      (!userData.current_period_end || new Date(userData.current_period_end) > new Date())

    // Fallback: If view doesn't give us subscription data, check subscriptions table directly
    if (!hasActiveSubscription && (!userData.plan_type || userData.plan_type === 'free')) {
      const { data: directSubscription } = await supabase
        .from('subscriptions')
        .select('plan_type, status, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (directSubscription) {
        // Override the result if we find an active subscription
        const directHasActive = directSubscription.status === 'active' && 
          directSubscription.plan_type !== 'free' &&
          (!directSubscription.current_period_end || new Date(directSubscription.current_period_end) > new Date());
        
        if (directHasActive) {
          // Update the userData to reflect the correct subscription info
          userData.subscription_status = directSubscription.status;
          userData.plan_type = directSubscription.plan_type;
          userData.current_period_end = directSubscription.current_period_end;
        }
      }
    }
    
    // Recalculate after potential override
    const finalHasActiveSubscription = userData.subscription_status === 'active' && 
      userData.plan_type && userData.plan_type !== 'free' &&
      (!userData.current_period_end || new Date(userData.current_period_end) > new Date());

    const responseData = {
      user: {
        // User profile
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
        display_name: userData.display_name,
        bio: userData.bio,
        created_at: userData.user_created_at,
        updated_at: userData.user_updated_at,
        
        // Subscription info
        subscription: {
          id: userData.subscription_id,
          plan_type: userData.plan_type,
          status: userData.subscription_status,
          monthly_token_limit: userData.monthly_token_limit,
          current_period_start: userData.current_period_start,
          current_period_end: userData.current_period_end,
          cancel_at_period_end: userData.cancel_at_period_end
        },
        
        // Usage info
        usage: {
          tokens_used_this_month: userData.tokens_used_this_month || 0,
          tokens_remaining: userData.tokens_remaining || userData.monthly_token_limit || 5,
          total_generations: userData.total_generations || 0,
          successful_generations: userData.successful_generations || 0,
          usage_percentage: userData.usage_percentage || 0
        }
      },
      hasActiveSubscription: finalHasActiveSubscription
    }

    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 