// Subscription plans configuration (client-safe - no environment variables)
export const SUBSCRIPTION_PLANS = {
  base: {
    name: 'Base',
    price: 5,
    priceId: 'base', // Resolved server-side
    credits: 25,
    features: [
      '25 credits per month',
      'GPT Image 1 powered icon generation',
      'Multiple style options (Modern, Flat, 3D, etc.)',
      'Download as PNG',
      'Save icons to your library',
      'Icon improvement & iteration',
      'Commercial usage rights',
      'Transparent background icons'
    ]
  },
  pro: {
    name: 'Pro',
    price: 10,
    priceId: 'pro', // Resolved server-side
    credits: 100,
    features: [
      '100 credits per month',
      'GPT Image 1 powered icon generation',
      'Multiple style options (Modern, Flat, 3D, etc.)',
      'Download as PNG',
      'Save icons to your library',
      'Icon improvement & iteration',
      'Commercial usage rights',
      'Transparent background icons',
      'Priority support'
    ]
  },
  proPlus: {
    name: 'Pro+',
    price: 15,
    priceId: 'proPlus', // Resolved server-side
    credits: 200,
    features: [
      '200 credits per month',
      'GPT Image 1 powered icon generation',
      'Multiple style options (Modern, Flat, 3D, etc.)',
      'Download as PNG',
      'Save icons to your library',
      'Icon improvement & iteration',
      'Commercial usage rights',
      'Transparent background icons',
      'Priority support',
      'Extended icon library storage'
    ]
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS 

const PLAN_PRIORITY: Record<string, number> = {
  free: 0,
  base: 1,
  pro: 2,
  proPlus: 3,
}

export function getPlanPriority(plan?: string | null): number {
  if (!plan) {
    return 0
  }

  return PLAN_PRIORITY[plan] ?? 0
}