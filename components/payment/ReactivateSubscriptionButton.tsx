'use client';

import React, { useState } from 'react';
import { CheckCircle, RefreshCw } from 'lucide-react';

interface ReactivateSubscriptionButtonProps {
  className?: string;
}

export default function ReactivateSubscriptionButton({ className = '' }: ReactivateSubscriptionButtonProps) {
  const [reactivating, setReactivating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReactivate = async () => {
    setReactivating(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/reactivate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reactivate subscription');
      }

      setSuccess(true);
      
      // Refresh the page after a short delay to show updated subscription status
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error('Reactivation error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setReactivating(false);
    }
  };

  return (
    <>
      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
          <p className="text-green-400">Subscription reactivated successfully! Your subscription will continue as normal.</p>
        </div>
      )}

      <button
        onClick={handleReactivate}
        disabled={reactivating || success}
        className={`${className} flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <RefreshCw className={`h-4 w-4 ${reactivating ? 'animate-spin' : ''}`} />
        {reactivating ? 'Reactivating...' : 'Reactivate Subscription'}
      </button>

      {error && (
        <div className="mt-2 text-red-400 text-sm">
          {error}
        </div>
      )}
    </>
  );
} 