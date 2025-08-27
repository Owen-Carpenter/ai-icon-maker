'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { authService } from '../lib/auth'

interface UserData {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  display_name?: string
  bio?: string
  created_at: string
  updated_at: string
  
  // Subscription info
  subscription: {
    id?: string
    plan_type: string
    status: string
    monthly_token_limit: number
    current_period_start?: string
    current_period_end?: string
    cancel_at_period_end?: boolean
  }
  
  // Usage info
  usage: {
    tokens_used_this_month: number
    tokens_remaining: number
    total_generations: number
    successful_generations: number
    usage_percentage: number
  }
}

interface AuthContextType {
  user: User | null
  session: Session | null
  userData: UserData | null
  hasActiveSubscription: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<any>
  resetPassword: (email: string) => Promise<any>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [loading, setLoading] = useState(true)

  // Function to fetch user data from our users table
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
        setHasActiveSubscription(data.hasActiveSubscription)
      } else {
        console.error('Failed to fetch user data')
        setUserData(null)
        setHasActiveSubscription(false)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUserData(null)
      setHasActiveSubscription(false)
    }
  }, [])

  const refreshUserData = useCallback(async () => {
    if (user) {
      await fetchUserData(user.id)
    }
  }, [user, fetchUserData])

  useEffect(() => {
    // Get initial session
    authService.getCurrentSession().then(async ({ session }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserData(session.user.id)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserData(session.user.id)
        } else {
          setUserData(null)
          setHasActiveSubscription(false)
        }
        
        setLoading(false)
        
        // Only reload if we're not on the OAuth callback page
        // and not already on a protected route
        if (event === 'SIGNED_IN' && 
            !window.location.pathname.includes('/auth/callback') &&
            !window.location.pathname.includes('/generate') &&
            !window.location.pathname.includes('/library') &&
            !window.location.pathname.includes('/account')) {
          // Small delay to ensure state is updated
          setTimeout(() => {
            window.location.href = '/generate'
          }, 100)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const result = await authService.signIn(email, password)
    setLoading(false)
    return result
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    const result = await authService.signUp(email, password)
    setLoading(false)
    return result
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    const result = await authService.signInWithGoogle()
    setLoading(false)
    return result
  }

  const signOut = async () => {
    setLoading(true)
    const result = await authService.signOut()
    setLoading(false)
    return result
  }

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email)
  }

  const value = {
    user,
    session,
    userData,
    hasActiveSubscription,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshUserData,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 