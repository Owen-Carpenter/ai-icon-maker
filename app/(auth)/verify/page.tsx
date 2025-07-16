'use client';

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

function VerifyContent() {
  const [message, setMessage] = useState('Verifying your email...')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the token from URL params
        const token = searchParams.get('token')
        const type = searchParams.get('type')
        
        if (type === 'signup') {
          // This is email verification after signup
          if (token) {
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'signup'
            })
            
            if (error) {
              setError('Invalid or expired verification link')
            } else {
              setMessage('Email verified successfully! You can now sign in.')
              setTimeout(() => {
                router.push('/login')
              }, 3000)
            }
          } else {
            setError('No verification token found')
          }
        } else if (type === 'recovery') {
          // This is password reset verification
          if (token) {
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery'
            })
            
            if (error) {
              setError('Invalid or expired reset link')
            } else {
              setMessage('Email verified! You can now reset your password.')
              setTimeout(() => {
                router.push('/reset-password')
              }, 2000)
            }
          } else {
            setError('No reset token found')
          }
        } else {
          setError('Invalid verification type')
        }
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    handleEmailVerification()
  }, [searchParams, router])

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="text-center space-y-4">
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {message && !error && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400 text-sm">{message}</p>
          </div>
        )}

        <div className="pt-4">
          <p className="text-gray-300 text-sm">
            Need help?{' '}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 transition-colors duration-300">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function VerifyFallback() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
        <p className="text-gray-300">Loading...</p>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-dark-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 group mb-8">
            <div className="w-12 h-12 bg-[#ff7e5f] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">AI Icon Maker</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">
            Email Verification
          </h2>
        </div>

        <Suspense fallback={<VerifyFallback />}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  )
} 