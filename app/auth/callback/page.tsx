'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import Loading from '../../../components/ui/Loading';
import Link from 'next/link';

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isClosingTab, setIsClosingTab] = useState(false);
  const { hasActiveSubscription, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  // Timeout mechanism to prevent hanging
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.error('OAuth callback timeout after 60 seconds - redirecting to login');
        setError('Authentication timed out. Please try again.');
        setLoading(false);
      }
    }, 60000); // 60 second timeout

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Listen for auth completion from other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_callback_complete' && e.newValue) {
        console.log('Auth completed in another tab, closing this one');
        setIsClosingTab(true);
        setTimeout(() => {
          window.close();
          // If window.close() fails (main tab), redirect
          if (!document.hidden) {
            const destination = e.newValue || '/generate';
            router.replace(destination);
          }
        }, 1000);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20; // Max 10 seconds of retries (20 * 500ms)
    let isProcessing = false; // Prevent multiple simultaneous processing
    
    const handleAuthCallback = async () => {
      if (isProcessing) return; // Prevent concurrent processing
      isProcessing = true;
      
      try {
        console.log('Auth callback processing...', { 
          retryCount, 
          url: window.location.href
        });
        
        // Handle the OAuth callback - get session from URL params
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError('Authentication failed. Please try again.');
          setLoading(false);
          isProcessing = false;
          return;
        }

        if (data.session?.user) {
          console.log('Auth callback successful:', data.session.user.email);
          setLoading(false);
          isProcessing = false;
          return;
        }

        // Check if we're in the middle of an OAuth flow or email confirmation
        const urlParams = new URLSearchParams(window.location.search);
        const urlHash = window.location.hash;
        const hasOAuthParams = urlParams.has('code') || urlParams.has('state');
        const hasEmailConfirmation = urlParams.has('type') || urlParams.has('token') || urlParams.has('email') || urlHash.includes('access_token');
        
        console.log('Auth callback status check:', { 
          hasSession: !!data.session, 
          hasOAuthParams, 
          hasEmailConfirmation,
          urlParams: Object.fromEntries(urlParams.entries()),
          hash: urlHash 
        });
        
        if (hasOAuthParams || hasEmailConfirmation) {
          retryCount++;
          if (retryCount < maxRetries) {
            // Still processing OAuth or email confirmation, wait a bit more
            console.log(`Auth processing... retry ${retryCount}/${maxRetries}`);
            isProcessing = false;
            setTimeout(handleAuthCallback, 500);
            return;
          } else {
            // Max retries reached, but still have auth params - this might be a real issue
            console.error('Auth callback max retries reached');
            setError('Authentication is taking longer than expected. Please try again.');
            setLoading(false);
            isProcessing = false;
            return;
          }
        }
        
        // No session found and no OAuth params, redirect to login
        console.log('No session found in callback, redirecting to login');
        router.push('/login?error=authentication_failed');
        isProcessing = false;
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
        isProcessing = false;
      }
    };

    // Start processing immediately
    handleAuthCallback();
  }, [router]);

  // Handle redirect after auth context loads user data
  useEffect(() => {
    if (!loading && !authLoading && userData && !hasRedirected) {
      setHasRedirected(true); // Prevent multiple redirects
      
      console.log('Redirecting user after auth callback...', { 
        hasActiveSubscription, 
        userId: userData.id
      });
      
      // Determine redirect destination
      const redirectPath = hasActiveSubscription ? '/generate' : '/account';
      
      // Signal to other tabs that auth is complete
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('auth_callback_complete', redirectPath);
          // Clear the flag after a short delay
          setTimeout(() => {
            localStorage.removeItem('auth_callback_complete');
          }, 2000);
        } catch (e) {
          console.log('Could not access localStorage:', e);
        }
      }
      
      // Redirect this tab
      router.replace(redirectPath);
    }
  }, [loading, authLoading, userData, hasActiveSubscription, router, hasRedirected]);

  if (isClosingTab) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <Loading text="Redirecting..." size="lg" />
          <p className="text-white/60 text-sm mt-4">You can close this tab</p>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <Loading text="Verifying your account..." size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Site Header */}
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center space-x-2 group mb-6">
              <div className="w-12 h-12 bg-[#ff7e5f] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">AI Icon Maker</span>
            </Link>
          </div>

          {/* Error Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
            <p className="text-white/70 mb-8 leading-relaxed">{error}</p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/login')}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Back to Login
              </button>
              <Link
                href="/"
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30 text-center"
              >
                Go Home
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Need help? <Link href="/#contact" className="text-orange-400 hover:text-orange-300 transition-colors duration-300 font-medium">Contact support</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 