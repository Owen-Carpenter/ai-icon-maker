import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  id: string
  email?: string
}

// Helper function to get the appropriate base URL
const getBaseUrl = () => {
  let baseUrl = ''
  
  // Check for environment variables first
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or fallback to current origin
    baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
  } else {
    // Server-side: use environment variable or fallback to localhost
    baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  }
  
  // Remove trailing slash if present
  return baseUrl.replace(/\/$/, '')
}

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { user: data.user, error }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { user: data.user, session: data.session, error }
  },

  // Sign in with Google OAuth
  async signInWithGoogle() {
    const baseUrl = getBaseUrl()
    
    // Debug logging removed for production
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Reset password
  async resetPassword(email: string) {
    const baseUrl = getBaseUrl()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/reset-password`,
    })
    return { error }
  },

  // Update password
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    })
    return { user: data.user, error }
  },

  // Get current user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    return { user: data.user, error }
  },

  // Get current session
  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession()
    return { session: data.session, error }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
} 