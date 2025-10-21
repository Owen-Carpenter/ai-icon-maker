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
          url: window.location.href,
          isNewTab: window.opener !== null,
          hasOpener: !!window.opener
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
          
          // Check if this was opened in a new tab (email confirmation link)
          // If so, try to close this tab and redirect the opener
          if (window.opener && !window.opener.closed) {
            console.log('Detected popup/new tab - attempting to redirect opener and close');
            try {
              // Try to redirect the opener window
              const redirectPath = hasActiveSubscription ? '/generate' : '/account';
              window.opener.location.href = redirectPath;
              
              // Close this window after a short delay
              setTimeout(() => {
                window.close();
              }, 1000);
            } catch (e) {
              console.log('Could not access opener window, using normal redirect');
              // If we can't access opener (cross-origin), just redirect normally
              setLoading(false);
              isProcessing = false;
              return;
            }
          } else {
            // Normal flow - not a popup
            setLoading(false);
            isProcessing = false;
            return;
          }
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
  }, [router, hasActiveSubscription]);

  // Handle redirect after auth context loads user data
  useEffect(() => {
    if (!loading && !authLoading && userData && !hasRedirected) {
      setHasRedirected(true); // Prevent multiple redirects
      
      console.log('Redirecting user after auth callback...', { 
        hasActiveSubscription, 
        userId: userData.id,
        isPopup: window.opener !== null
      });
      
      // Determine redirect destination
      const redirectPath = hasActiveSubscription ? '/generate' : '/account';
      
      // Check if this is a popup window (opened from email confirmation)
      if (window.opener && !window.opener.closed) {
        console.log('In popup - attempting to redirect parent and close');
        try {
          // Redirect the parent window
          window.opener.location.href = redirectPath;
          // Close this popup after redirect
          setTimeout(() => {
            window.close();
          }, 500);
        } catch (e) {
          console.log('Could not access opener, redirecting current window');
          // Fallback: redirect current window if we can't access opener
          router.replace(redirectPath);
        }
      } else {
        // Normal redirect (not a popup)
        router.replace(redirectPath);
      }
    }
  }, [loading, authLoading, userData, hasActiveSubscription, router, hasRedirected]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <Loading text="Verifying your account..." size="lg" />
          {typeof window !== 'undefined' && window.opener && !window.opener.closed && (
            <p className="text-white/60 text-sm mt-4">This window will close automatically...</p>
          )}
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