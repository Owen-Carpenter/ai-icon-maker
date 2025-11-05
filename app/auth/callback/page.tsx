'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Loading from '../../../components/ui/Loading';
import Link from 'next/link';

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('OAuth callback error:', error);
          setError('Authentication failed. Please try again or contact support.');
          setLoading(false);
          return;
        }

        if (data.session?.user) {
          // Wait for auth context to update, then check subscription status
          setTimeout(async () => {
            try {
              const response = await fetch('/api/user/profile');
              if (response.ok) {
                const profileData = await response.json();
                if (profileData.hasActiveSubscription) {
                  // User has subscription - go to generate page
                  window.location.href = '/generate';
                } else {
                  // User has no subscription - go to home page
                  window.location.href = '/';
                }
              } else {
                // Fallback to home page if we can't check subscription
                window.location.href = '/';
              }
            } catch (error) {
              console.error('Error checking subscription status:', error);
              // Fallback to home page on error
              window.location.href = '/';
            }
          }, 1000); // Give time for auth context to update
        } else {
          setError('Could not complete authentication. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error during OAuth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-dark-gradient flex items-center justify-center">
        <Loading text="Completing sign in..." size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Error Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">Verification Failed</h1>
            <p className="text-white/70 mb-8 leading-relaxed">{error}</p>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-center"
              >
                Back to Login
              </Link>
              <Link
                href="/"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30 text-center"
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