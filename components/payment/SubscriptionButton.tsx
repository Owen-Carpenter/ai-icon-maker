'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SubscriptionButtonProps {
  priceId: string;
  planType: string;
  className?: string;
  loadingClassName?: string;
  disabled?: boolean;
  disabledClassName?: string;
  children: React.ReactNode;
}

export default function SubscriptionButton({ 
  priceId, 
  planType, 
  className = '', 
  loadingClassName = '',
  disabled = false,
  disabledClassName = 'opacity-50 cursor-not-allowed',
  children 
}: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (disabled) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleCheckout}
        disabled={loading || disabled}
        className={`${className} ${loading ? loadingClassName : ''} ${(loading || disabled) ? disabledClassName : ''}`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </div>
        ) : (
          children
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
} 