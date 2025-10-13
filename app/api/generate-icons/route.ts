import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateIconsWithChatGPT } from '../../../lib/chatgpt'

export async function POST(request: NextRequest) {
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
    const { prompt, style, isImprovement = false, sourceImageUrl } = body

    // Validate required fields
    if (!prompt || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, style' },
        { status: 400 }
      )
    }

    // Validate prompt length
    if (prompt.length > 200) {
      return NextResponse.json(
        { error: 'Prompt too long. Maximum 200 characters.' },
        { status: 400 }
      )
    }

    // Note: Credit deduction is now handled by the /api/deduct-credit endpoint
    // This API only handles the actual icon generation

    // Call ChatGPT API to generate real icons
    const result = await generateIconsWithChatGPT({
      prompt: prompt.trim(),
      style,
      count: isImprovement ? 1 : 3,
      isImprovement: isImprovement,
      sourceImageUrl: sourceImageUrl, // Pass the source image for editing
    })

    // If generation failed, we should ideally refund the credit, but for now we'll keep the deduction
    // as the user still used the service attempt
    if (!result.success) {
      // Record the failed generation
      await supabase.rpc('record_token_usage', {
        p_user_id: user.id,
        p_tokens_used: 0, // No additional tokens for the failure record
        p_usage_type: 'icon_generation',
        p_prompt_text: prompt.trim(),
        p_style_selected: style,
        p_generation_successful: false,
        p_error_message: result.error || 'Unknown generation error'
      })

      return NextResponse.json(
        { error: result.error || 'Failed to generate icons' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      icons: result.icons,
      message: `Generated ${result.icons.length} icons successfully`
    })

  } catch (error) {
    console.error('Icon generation API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}