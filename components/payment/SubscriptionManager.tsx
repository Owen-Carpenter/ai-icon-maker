'use client';

import React, { useState } from 'react';
import { ExternalLink, Settings, AlertTriangle, CheckCircle, X } from 'lucide-react';
import CustomerPortalButton from './CustomerPortalButton';

interface SubscriptionManagerProps {
  className?: string;
}

export default function SubscriptionManager({ className = '' }: SubscriptionManagerProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const handleCancelSubscription = async (immediate: boolean = false) => {
    setCanceling(true);
    setCancelError('');

    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ immediate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      setCancelSuccess(true);
      setShowCancelModal(false);
      
      // Refresh the page after a short delay to show updated subscription status
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error('Cancellation error:', error);
      setCancelError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className={className}>
      {/* Success Message */}
      {cancelSuccess && (
        <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
          <p className="text-green-400">Subscription canceled successfully. Refreshing page...</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Primary Option: Stripe Customer Portal */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Recommended: Full Subscription Management
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Access the complete Stripe Customer Portal to manage your subscription, update payment methods, view invoices, and more.
          </p>
          <CustomerPortalButton className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
            Open Customer Portal
          </CustomerPortalButton>
        </div>

        {/* Alternative Option: Direct Cancellation */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Quick Cancel Option
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Cancel your subscription directly. You'll retain access until the end of your current billing period.
          </p>
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
                Cancel Subscription
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel your subscription? You'll retain access to all features until the end of your current billing period.
            </p>

            {cancelError && (
              <div className="mb-4 text-red-400 text-sm">
                {cancelError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={canceling}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => handleCancelSubscription(false)}
                disabled={canceling}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {canceling ? 'Canceling...' : 'Cancel at Period End'}
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              Your subscription will remain active until the end of your current billing period.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 