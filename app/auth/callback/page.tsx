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
        console.log('Processing email verification callback...');
        
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError('Email verification failed. Please try again or contact support.');
          setLoading(false);
          return;
        }

        if (data.session?.user) {
          console.log('Email verified successfully for:', data.session.user.email);
          setSuccess(true);
          setLoading(false);
        } else {
          setError('Could not verify your email. The link may have expired.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error during email verification:', err);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <Loading text="Verifying your email..." size="lg" />
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Email Verified! 🎉</h1>
            <p className="text-white/70 mb-8 leading-relaxed">
              Your email has been successfully verified. You're all set to start creating amazing icons with AI!
            </p>
            
            {/* CTA Button */}
            <Link
              href="/generate"
              className="block w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
            >
              Start Creating Icons →
            </Link>
            
            <p className="text-white/50 text-sm mt-6">
              You can close this tab and return to the original window,<br />
              or click the button above to get started.
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Your session is automatically synced across tabs
            </p>
          </div>
        </div>
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