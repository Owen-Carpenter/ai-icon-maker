'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { authService } from '../lib/auth'
import { apiCache } from '../lib/api-cache'

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
  refreshUserData: (forceRefresh?: boolean) => Promise<void>
  invalidateCache: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [loading, setLoading] = useState(true)

  // Function to fetch user data from our users table using global cache
  const fetchUserData = useCallback(async (userId: string, forceRefresh: boolean = false) => {
    const cacheKey = `user_profile_${userId}`
    
    try {
      const data = await apiCache.get(
        cacheKey,
        async () => {
          const response = await fetch('/api/user/profile')
          if (!response.ok) {
            throw new Error('Failed to fetch user data')
          }
          return response.json()
        },
        forceRefresh
      )
      
      setUserData(data.user)
      setHasActiveSubscription(data.hasActiveSubscription)
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUserData(null)
      setHasActiveSubscription(false)
    }
  }, [])

  const refreshUserData = useCallback(async (forceRefresh: boolean = false) => {
    if (user) {
      await fetchUserData(user.id, forceRefresh)
    }
  }, [user, fetchUserData])

  // The global cache and request deduplication will handle rapid calls

  useEffect(() => {
    // Get initial session
    authService.getCurrentSession().then(async ({ session }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserData(session.user.id, true) // Force refresh on initial load
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
          await fetchUserData(session.user.id, true) // Force refresh on auth state change
        } else {
          setUserData(null)
          setHasActiveSubscription(false)
        }
        
        setLoading(false)
        
        // Don't auto-redirect after sign-in - let the page handle it or user navigate manually
        // This prevents unwanted redirects and gives users control
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

  const invalidateCache = useCallback(() => {
    if (user) {
      apiCache.invalidate(`user_profile_${user.id}`)
    }
  }, [user])

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
    invalidateCache,
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