'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '../../lib/subscription-plans';
import SubscriptionButton from './SubscriptionButton';

interface PricingCardProps {
  plan: SubscriptionPlan;
  currentPlan?: string;
  isPopular?: boolean;
}

export default function PricingCard({ plan, currentPlan, isPopular }: PricingCardProps) {
  const planData = SUBSCRIPTION_PLANS[plan];
  const isCurrentPlan = currentPlan === plan;

  return (
    <div className={`
      relative bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105
      ${isPopular ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-white/20'}
      ${isCurrentPlan ? 'ring-2 ring-green-500/50' : ''}
    `}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Current Plan
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{planData.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-white">${planData.price}</span>
          {plan !== 'free' && <span className="text-gray-400 text-lg">/month</span>}
        </div>
        
        {plan === 'unlimited' && (
          <div className="text-orange-400 font-semibold text-sm">
            Unlimited generations
          </div>
        )}
        {plan === 'pro' && (
          <div className="text-blue-400 font-semibold text-sm">
            {planData.credits} generations/month
          </div>
        )}
        {plan === 'free' && (
          <div className="text-gray-400 font-semibold text-sm">
            {planData.credits} generations/month
          </div>
        )}
      </div>

      <ul className="space-y-4 mb-8">
        {planData.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {plan === 'free' ? (
          <div className="w-full py-3 px-6 rounded-xl bg-gray-600 text-gray-400 text-center font-semibold cursor-not-allowed">
            Current Plan
          </div>
        ) : isCurrentPlan ? (
          <div className="w-full py-3 px-6 rounded-xl bg-green-600 text-white text-center font-semibold cursor-default">
            ✓ Subscribed
          </div>
        ) : (
          <SubscriptionButton
            priceId={planData.priceId!}
            planType={plan}
            className={`
              w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-center
              ${isPopular 
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
              }
            `}
            loadingClassName="opacity-50 cursor-not-allowed"
          >
            {isCurrentPlan ? 'Current Plan' : `Upgrade to ${planData.name}`}
          </SubscriptionButton>
        )}
      </div>
    </div>
  );
} 