import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
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

    // Get total count of user's saved icons
    const { count: totalCount, error: totalError } = await supabase
      .from('icons')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (totalError) {
      console.error('Error fetching total icon count:', totalError)
      return NextResponse.json(
        { error: 'Failed to fetch icon count' },
        { status: 500 }
      )
    }

    // Get count of icons created this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const { count: thisMonthCount, error: monthError } = await supabase
      .from('icons')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString())
      .lt('created_at', startOfNextMonth.toISOString())

    if (monthError) {
      console.error('Error fetching monthly icon count:', monthError)
      return NextResponse.json(
        { error: 'Failed to fetch monthly icon count' },
        { status: 500 }
      )
    }

    // Get count of icons created last month for comparison
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const { count: lastMonthCount, error: lastMonthError } = await supabase
      .from('icons')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfLastMonth.toISOString())
      .lt('created_at', endOfLastMonth.toISOString())

    if (lastMonthError) {
      console.error('Error fetching last month icon count:', lastMonthError)
      // Don't fail the whole request, just set to 0
    }

    // Calculate average per day (based on days elapsed in current month)
    const daysElapsed = Math.max(1, now.getDate())
    const avgPerDay = thisMonthCount ? Math.round(thisMonthCount / daysElapsed) : 0

    return NextResponse.json({
      success: true,
      count: totalCount || 0,
      thisMonth: thisMonthCount || 0,
      lastMonth: lastMonthCount || 0,
      avgPerDay,
      daysElapsed
    })

  } catch (error: any) {
    console.error('Icon count API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
