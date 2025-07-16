'use client';

import React, { useState } from 'react';
import { ExternalLink, Settings, AlertCircle } from 'lucide-react';

interface CustomerPortalButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function CustomerPortalButton({ children, className = '' }: CustomerPortalButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);

  const handlePortalAccess = async () => {
    setLoading(true);
    setError('');
    setShowSetupInstructions(false);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'portal_not_configured') {
          setShowSetupInstructions(true);
          setError('');
        } else {
          throw new Error(data.message || data.error || 'Failed to access customer portal');
        }
        setLoading(false);
        return;
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Portal access error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePortalAccess}
        disabled={loading}
        className={`
          ${className}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          flex items-center justify-center gap-2
        `}
      >
        {loading ? 'Loading...' : children}
        {!loading && <ExternalLink className="h-4 w-4" />}
      </button>
      
      {error && !showSetupInstructions && (
        <div className="mt-2 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {showSetupInstructions && (
        <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-orange-400 font-semibold mb-2">Portal Setup Required</p>
              <p className="text-gray-300 mb-3">
                The subscription management portal needs to be configured in your Stripe dashboard first.
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>Setup Instructions:</strong></p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Go to your <a 
                    href="https://dashboard.stripe.com/test/settings/billing/portal" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline inline-flex items-center gap-1"
                  >
                    Stripe Customer Portal settings <ExternalLink className="h-3 w-3" />
                  </a></li>
                  <li>Click "Activate test link"</li>
                  <li>Configure your customer portal settings</li>
                  <li>Save the configuration</li>
                </ol>
              </div>
              <p className="text-gray-400 text-xs mt-3">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                This is a one-time setup for your Stripe account.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 