'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Lock, Zap } from 'lucide-react';

interface SubscriptionGateProps {
  title?: string;
  description?: string;
}

export default function SubscriptionGate({ 
  title = "Premium Feature Required",
  description = "You need an active subscription to access this feature."
}: SubscriptionGateProps) {
  return (
    <div className="min-h-screen bg-dark-gradient flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
              <Lock className="h-8 w-8 text-orange-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            <p className="text-gray-300">{description}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-left p-4 bg-white/5 rounded-lg">
              <Crown className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
              <span className="text-gray-300 text-sm">
                Generate unlimited AI icons with premium plans
              </span>
            </div>
            
            <div className="flex items-center text-left p-4 bg-white/5 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
              <span className="text-gray-300 text-sm">
                High-resolution downloads without watermarks
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/account"
              className="block w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View Subscription Plans
            </Link>
            
            <Link
              href="/"
              className="block w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-white/20 hover:border-white/40"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 