// Subscription plans configuration (client-safe - no environment variables)
export const SUBSCRIPTION_PLANS = {
  starter: {
    name: 'Starter Pack',
    price: 5,
    priceId: 'starter', // Resolved server-side
    credits: 25,
    isOneTime: true, // One-time purchase, not recurring
    features: [
      '25 credits (one-time)',
      'No recurring charges',
      'GPT Image 1 powered generation',
      'Multiple style options',
      'Download as PNG',
      'Commercial usage rights'
    ]
  },
  monthly: {
    name: 'Monthly',
    price: 10,
    priceId: 'monthly', // Resolved server-side
    credits: 50,
    isOneTime: false,
    features: [
      '50 credits per month',
      'Cancel anytime',
      'GPT Image 1 powered generation',
      'All style options',
      'Icon library & storage',
      'Icon improvement & iteration',
      'Priority support',
      'Commercial usage rights'
    ]
  },
  yearly: {
    name: 'Yearly',
    price: 96,
    priceId: 'yearly', // Resolved server-side
    credits: 700,
    isOneTime: false,
    features: [
      '700 credits per year',
      'Save $24 vs monthly',
      'Everything in Monthly plan',
      'Priority processing',
      'Extended library storage',
      'Premium support',
      'Commercial usage rights'
    ]
  },
  // Legacy plans for backward compatibility
  base: {
    name: 'Base (Legacy)',
    price: 5,
    priceId: 'base',
    credits: 25,
    isOneTime: false,
    features: ['Legacy plan - migrated to Starter Pack']
  },
  pro: {
    name: 'Pro (Legacy)',
    price: 10,
    priceId: 'pro',
    credits: 100,
    isOneTime: false,
    features: ['Legacy plan - migrated to Monthly']
  },
  proPlus: {
    name: 'Pro+ (Legacy)',
    price: 15,
    priceId: 'proPlus',
    credits: 200,
    isOneTime: false,
    features: ['Legacy plan - migrated to Yearly']
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS 

const PLAN_PRIORITY: Record<string, number> = {
  free: 0,
  starter: 1,
  base: 1, // Legacy
  monthly: 2,
  pro: 2, // Legacy
  yearly: 3,
  proPlus: 3, // Legacy
}

export function getPlanPriority(plan?: string | null): number {
  if (!plan) {
    return 0
  }

  return PLAN_PRIORITY[plan] ?? 0
}