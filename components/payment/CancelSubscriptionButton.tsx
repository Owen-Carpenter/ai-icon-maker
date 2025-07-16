'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface CancelSubscriptionButtonProps {
  className?: string;
}

export default function CancelSubscriptionButton({ className = '' }: CancelSubscriptionButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = async () => {
    setCanceling(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ immediate: false }), // Cancel at period end
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      setSuccess(true);
      setShowModal(false);
      
      // Refresh the page after a short delay to show updated subscription status
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error('Cancellation error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setCanceling(false);
    }
  };

  return (
    <>
      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
          <p className="text-green-400">Subscription canceled successfully. You'll retain access until the end of your billing period.</p>
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className={`${className} flex items-center justify-center gap-2`}
      >
        <AlertTriangle className="h-4 w-4" />
        Cancel Subscription
      </button>

      {/* Cancel Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
                Cancel Subscription
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
                disabled={canceling}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                Are you sure you want to cancel your subscription?
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-400 text-sm">
                  <strong>What happens next:</strong>
                </p>
                <ul className="text-blue-300 text-sm mt-1 space-y-1 ml-2">
                  <li>• Your subscription will be canceled</li>
                  <li>• You'll keep access until the end of your billing period</li>
                  <li>• No future charges will be made</li>
                  <li>• You can resubscribe anytime</li>
                </ul>
              </div>

              {error && (
                <div className="text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={canceling}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {canceling ? 'Canceling...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 