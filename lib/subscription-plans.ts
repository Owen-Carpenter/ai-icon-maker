// Subscription plans configuration (client-safe - no environment variables)
export const SUBSCRIPTION_PLANS = {
  pro: {
    name: 'Pro',
    price: 20, // Updated to match marketing page
    priceId: 'pro', // Resolved server-side
    credits: 200, // Updated to match marketing page
    features: [
      '200 AI-generated icons per month',
      'Premium AI models (DALL-E 3, Midjourney, SDXL)',
      'Multiple formats (PNG, SVG, ICO)',
      'High-resolution outputs (up to 1024x1024)',
      'Priority AI processing',
      'Icon library management',
      'Commercial usage rights',
      'Email support'
    ]
  },
  unlimited: {
    name: 'Enterprise',
    price: 99, // Updated to match marketing page  
    priceId: 'unlimited', // Resolved server-side
    credits: 1000, // Updated to match marketing page
    features: [
      '1,000 AI-generated icons per month',
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