// Subscription plans configuration (client-safe - no environment variables)
export const SUBSCRIPTION_PLANS = {
  pro: {
    name: 'Pro',
    price: 10,
    priceId: 'pro', // Resolved server-side
    credits: 200, // Updated: Pro users get 200 tokens
    features: [
      '200 AI-generated icons per month',
      'Premium AI models (Claude Sonnet 4.0)',
      'Multiple formats (PNG, SVG, ICO)',
      'High-resolution outputs (up to 1024x1024)',
      'Priority AI processing',
      'Icon library management',
      'Commercial usage rights',
      'Email support'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 20,
    priceId: 'enterprise', // Changed from 'unlimited' to 'enterprise'
    credits: 500, // Updated: Enterprise users get 500 tokens
    features: [
      '500 AI-generated icons per month',
      'All premium AI models + experimental models',
      'Ultra-high resolution (up to 2048x2048)',
      'Team collaboration & sharing',
      'Brand style consistency tools',
      'API access for integrations',
      'White-label options',
      'Priority support & dedicated account manager'
    ]
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS 