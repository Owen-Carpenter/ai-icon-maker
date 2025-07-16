import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  // Define route types
  const appRoutes = ['/generate', '/library'] // Routes that require both auth AND subscription
  const accountRoutes = ['/account'] // Routes that require auth but not necessarily subscription
  const authRoutes = ['/login', '/register', '/forgot-password']
  const publicRoutes = ['/'] // Routes that don't require auth

  const { data: { user } } = await supabase.auth.getUser()

  // Check route types
  const isAppRoute = appRoutes.some(route => req.nextUrl.pathname.startsWith(route))
  const isAccountRoute = accountRoutes.some(route => req.nextUrl.pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname === route)

  // If not authenticated and trying to access protected routes
  if ((isAppRoute || isAccountRoute) && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If authenticated and trying to access auth pages, redirect based on subscription
  if (isAuthRoute && user) {
    try {
      // Check if user has active subscription by querying users table
      const { data: userData } = await supabase
        .from('users')
        .select('has_paid_subscription, subscription_status, subscription_current_period_end')
        .eq('id', user.id)
        .single()

      const hasActiveSubscription = userData?.has_paid_subscription && 
        userData?.subscription_status === 'active' &&
        (!userData?.subscription_current_period_end || 
         new Date(userData.subscription_current_period_end) > new Date())

      if (hasActiveSubscription) {
        return NextResponse.redirect(new URL('/generate', req.url))
      } else {
        return NextResponse.redirect(new URL('/account', req.url))
      }
    } catch (error) {
      // If user doesn't exist in users table or other error, redirect to account
      return NextResponse.redirect(new URL('/account', req.url))
    }
  }

  // Check subscription for app routes
  if (isAppRoute && user) {
    try {
      // Check if user has active subscription by querying users table
      const { data: userData } = await supabase
        .from('users')
        .select('has_paid_subscription, subscription_status, subscription_current_period_end')
        .eq('id', user.id)
        .single()

      const hasActiveSubscription = userData?.has_paid_subscription && 
        userData?.subscription_status === 'active' &&
        (!userData?.subscription_current_period_end || 
         new Date(userData.subscription_current_period_end) > new Date())

      if (!hasActiveSubscription) {
        // Redirect to marketing page pricing section where they can subscribe
        return NextResponse.redirect(new URL('/#pricing', req.url))
      }
    } catch (error) {
      console.error('Error checking subscription status:', error)
      // If we can't check subscription status, redirect to account for safety
      return NextResponse.redirect(new URL('/account?error=subscription_check_failed', req.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 