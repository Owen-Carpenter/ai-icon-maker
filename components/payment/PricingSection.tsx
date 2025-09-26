'use client';

import React from 'react';
import PricingCard from './PricingCard';
import { SUBSCRIPTION_PLANS } from '../../lib/subscription-plans';

interface PricingSectionProps {
  currentPlan?: string;
  title?: string;
  subtitle?: string;
}

export default function PricingSection({ 
  currentPlan = '', 
  title = "Choose Your Plan",
  subtitle = "Select the perfect plan for your icon creation needs"
}: PricingSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard 
            plan="base" 
            currentPlan={currentPlan}
          />
          <PricingCard 
            plan="pro" 
            currentPlan={currentPlan}
            isPopular={true}
          />
          <PricingCard 
            plan="proPlus" 
            currentPlan={currentPlan}
          />
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            All plans include secure payment processing, instant account upgrades, and access to our customer support. 
            You can change or cancel your subscription at any time through your account settings.
          </p>
        </div>
      </div>
    </section>
  );
} 