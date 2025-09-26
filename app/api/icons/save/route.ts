import { NextRequest, NextResponse } from 'next/server'
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { 
      name, 
      prompt, 
      style, 
      color, 
      tags = [], 
      format = 'PNG',
      image_url 
    } = body

    // Validate required fields
    if (!name || !image_url) {
      return NextResponse.json(
        { error: 'Name and image URL are required' },
        { status: 400 }
      )
    }

    // Calculate approximate file size (image URL length as rough estimate)
    const file_size = image_url.length

    // Insert icon into database
    const { data: icon, error } = await supabase
      .from('icons')
      .insert({
        user_id: user.id,
        name: name.trim(),
        prompt,
        style,
        color,
        tags: Array.isArray(tags) ? tags : [],
        format,
        file_size,
        image_url,
        is_favorite: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving icon:', error)
      return NextResponse.json(
        { error: 'Failed to save icon' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      icon
    })

  } catch (error: any) {
    console.error('Save icon API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
