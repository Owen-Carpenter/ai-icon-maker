'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SubscriptionButtonProps {
  priceId: string;
  planType: string;
  children: React.ReactNode;
  className?: string;
  loadingClassName?: string;
  disabled?: boolean;
}

export default function SubscriptionButton({
  priceId,
  planType,
  children,
  className = '',
  loadingClassName = '',
  disabled = false
}: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/login';
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
        body: JSON.stringify({
          priceId,
          planType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Subscription error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={disabled || loading}
        className={`
          ${className}
          ${loading ? loadingClassName : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {loading ? 'Processing...' : children}
      </button>
      
      {error && (
        <div className="mt-2 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
} 