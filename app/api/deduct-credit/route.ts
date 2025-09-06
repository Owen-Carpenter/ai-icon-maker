import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  console.log('🔴 [CREDIT API DEBUG] API endpoint hit!');
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { prompt, style, isImprovement } = body
    
    console.log('🔴 [CREDIT API DEBUG] Credit deduction request:', { 
      prompt, 
      style, 
      isImprovement, 
      userId: user.id 
    });


    // Validate required fields
    if (!prompt || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, style' },
        { status: 400 }
      )
    }

    // Get user's subscription to check limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    // Calculate current usage directly (same logic as user profile API)
    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('tokens_used, generation_successful')
      .eq('user_id', user.id)
      .eq('subscription_id', subscription?.id || null)

    const totalUsed = usageData?.reduce((sum, record) => sum + record.tokens_used, 0) || 0
    const monthlyLimit = subscription?.monthly_token_limit || 5
    const remaining = Math.max(0, monthlyLimit - totalUsed)

    console.log('🔴 [CREDIT API DEBUG] Direct usage calculation:', { 
      totalUsed, 
      monthlyLimit, 
      remaining, 
      tokensNeeded: 1,
      canUse: remaining >= 1
    });
    
    if (remaining < 1) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits', 
          remaining_tokens: remaining,
          monthly_limit: monthlyLimit,
          plan_type: subscription?.plan_type || 'free'
        },
        { status: 403 }
      )
    }

    // Deduct credits using the database function
    const { data: usageResult, error: usageError } = await supabase
      .rpc('use_tokens', {
        p_user_id: user.id,
        p_tokens_needed: 1,
        p_usage_type: isImprovement ? 'icon_improvement' : 'icon_generation',
        p_prompt_text: prompt.trim(),
        p_style_selected: style
      })


    if (usageError) {
      console.error('Error recording token usage:', usageError)
      return NextResponse.json(
        { error: 'Failed to process credit deduction' },
        { status: 500 }
      )
    }

    const tokenUsage = usageResult?.[0]
    console.log('🔴 [CREDIT API DEBUG] Token usage result:', { 
      usageResult, 
      tokenUsage, 
      success: tokenUsage?.success,
      remainingTokens: tokenUsage?.remaining_tokens 
    });
    
    if (!tokenUsage?.success) {
      return NextResponse.json(
        { 
          error: tokenUsage?.error_message || 'Failed to deduct credits',
          remaining_tokens: tokenUsage?.remaining_tokens || 0
        },
        { status: 403 }
      )
    }

    // Calculate final remaining tokens (after deduction)
    const finalRemaining = Math.max(0, remaining - 1)
    
    const response = {
      success: true,
      remaining_tokens: finalRemaining,
      usage_id: tokenUsage.usage_id,
      message: `Credit deducted successfully. ${finalRemaining} credits remaining.`
    };
    
    console.log('🔴 [CREDIT API DEBUG] Final response:', response);
    
    return NextResponse.json(response)

  } catch (error) {
    console.error('🔴 [CREDIT API DEBUG] Credit deduction API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
