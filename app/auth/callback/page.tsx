'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError('Authentication failed. Please try again.');
          setLoading(false);
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to generate page
          router.push('/generate');
        } else {
          // No session found, redirect to login
          router.push('/login?error=authentication_failed');
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-2">Completing Sign In</h1>
          <p className="text-white/70">Please wait while we finish setting up your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
} 