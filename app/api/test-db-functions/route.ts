import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 [TEST DEBUG] Testing database functions...');
    
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

    console.log('🧪 [TEST DEBUG] User authenticated:', user.id);

    // Test can_user_use_tokens function
    const { data: creditCheck, error: creditError } = await supabase
      .rpc('can_user_use_tokens', {
        p_user_id: user.id,
        p_tokens_needed: 1
      })

    console.log('🧪 [TEST DEBUG] Credit check result:', { creditCheck, creditError });

    // Test use_tokens function
    const { data: usageResult, error: usageError } = await supabase
      .rpc('use_tokens', {
        p_user_id: user.id,
        p_tokens_needed: 1,
        p_usage_type: 'icon_generation',
        p_prompt_text: 'test',
        p_style_selected: 'modern'
      })

    console.log('🧪 [TEST DEBUG] Usage result:', { usageResult, usageError });

    return NextResponse.json({
      success: true,
      user_id: user.id,
      credit_check: { data: creditCheck, error: creditError },
      usage_result: { data: usageResult, error: usageError }
    })

  } catch (error) {
    console.error('🧪 [TEST DEBUG] Test API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
