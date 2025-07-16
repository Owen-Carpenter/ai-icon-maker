import Stripe from 'stripe'
import { loadStripe, Stripe as StripeJs } from '@stripe/stripe-js'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
})

// Client-side Stripe instance
let stripePromise: Promise<StripeJs | null>
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: 'usd',
  payment_method_types: ['card'],
  mode: 'subscription' as const,
  billing_address_collection: 'auto' as const,
  customer_creation: 'always' as const,
}

// Server-side function to get actual Stripe price IDs
export const getStripePriceId = (plan: string): string | null => {
  switch (plan) {
    case 'pro':
      return process.env.STRIPE_PRO_PRICE_ID || null;
    case 'unlimited':
      return process.env.STRIPE_UNLIMITED_PRICE_ID || null;
    default:
      return null;
  }
} 