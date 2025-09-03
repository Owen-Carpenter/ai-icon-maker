import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// DELETE /api/icons/[id] - Delete an icon
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: iconId } = await params

    if (!iconId) {
      return NextResponse.json(
        { error: 'Icon ID is required' },
        { status: 400 }
      )
    }

    // Delete the icon (RLS policy ensures user can only delete their own icons)
    const { error } = await supabase
      .from('icons')
      .delete()
      .eq('id', iconId)
      .eq('user_id', user.id) // Extra safety check

    if (error) {
      console.error('Error deleting icon:', error)
      return NextResponse.json(
        { error: 'Failed to delete icon' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Icon deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete icon API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/icons/[id] - Update an icon (for renaming, adding tags, etc.)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: iconId } = await params

    if (!iconId) {
      return NextResponse.json(
        { error: 'Icon ID is required' },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { name, tags, is_favorite } = body

    // Build update object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : []
    if (is_favorite !== undefined) updateData.is_favorite = Boolean(is_favorite)

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update the icon
    const { data: icon, error } = await supabase
      .from('icons')
      .update(updateData)
      .eq('id', iconId)
      .eq('user_id', user.id) // Extra safety check
      .select()
      .single()

    if (error) {
      console.error('Error updating icon:', error)
      return NextResponse.json(
        { error: 'Failed to update icon' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      icon
    })

  } catch (error: any) {
    console.error('Update icon API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
