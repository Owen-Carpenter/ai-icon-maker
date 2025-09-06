import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
    const { prompt, style, primaryColor } = body

    // Validate required fields
    if (!prompt || !style || !primaryColor) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, style, primaryColor' },
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

    // Generate mock icons for testing (not using Claude API yet)
    const mockIcons = [
      `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${primaryColor}" rx="20"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="12">${prompt.slice(0, 8) || 'Icon'}</text></svg>`)}`,
      `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="${primaryColor}"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="10">${prompt.slice(0, 8) || 'Icon'}</text></svg>`)}`,
      `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 90,75 10,75" fill="${primaryColor}"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="10">${prompt.slice(0, 8) || 'Icon'}</text></svg>`)}`
    ]

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    /* REAL CLAUDE API CALL - Uncomment when ready to use Claude:
    
    const result = await generateIconsWithClaude({
      prompt: prompt.trim(),
      style,
      primaryColor,
      count: 3,
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
      message: `Generated ${result.icons.length} icons successfully`,
      remaining_tokens: tokenUsage.remaining_tokens,
      usage_id: tokenUsage.usage_id
    })
    
    */

    return NextResponse.json({
      success: true,
      icons: mockIcons,
      message: `Generated ${mockIcons.length} icons successfully (Mock Mode)`
    })

  } catch (error) {
    console.error('Icon generation API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}