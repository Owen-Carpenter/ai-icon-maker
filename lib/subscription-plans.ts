// Subscription plans configuration (client-safe - no environment variables)
export const SUBSCRIPTION_PLANS = {
  pro: {
    name: 'Pro',
    price: 15,
    priceId: 'pro', // Resolved server-side
    credits: 200, // Updated: Pro users get 200 tokens
    features: [
      '200 credits per month',
      'DALL-E 3 powered icon generation',
      'Multiple style options (Modern, Flat, 3D, etc.)',
      'Download as SVG, PNG, or JPG',
      'Save icons to your library',
      'Icon improvement & iteration',
      'Commercial usage rights',
      'Transparent background icons'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 30,
    priceId: 'enterprise', // Changed from 'unlimited' to 'enterprise'
    credits: 500, // Updated: Enterprise users get 500 tokens
    features: [
      '500 credits per month',
      'Everything in Pro plan',
      'DALL-E 3 HD quality generation',
      'Priority processing & faster generation',
      'Extended icon library storage',
      'Advanced export options',
      'Commercial usage rights',
      'Premium transparent background icons'
    ]
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS 