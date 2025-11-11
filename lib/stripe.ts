import Stripe from 'stripe'
import { loadStripe, Stripe as StripeJs } from '@stripe/stripe-js'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
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
    case 'base':
      return process.env.STRIPE_BASE_PRICE_ID || null;
    case 'pro':
      return process.env.STRIPE_PRO_PRICE_ID || null;
    case 'proPlus':
      return process.env.STRIPE_PRO_PLUS_PRICE_ID || null;
    case 'enterprise':
      return process.env.STRIPE_UNLIMITED_PRICE_ID || null; // Legacy support
    default:
      return null;
  }
} 

const TIMESTAMP_KEYS = [
  'value',
  'values',
  'unix',
  'epoch',
  'epoch_time',
  'epoch_seconds',
  'seconds',
  'time',
  'timestamp',
]

export function normalizeStripeTimestamp(value: unknown): string | null {
  if (value == null) {
    return null
  }

  if (Array.isArray(value)) {
    for (const candidate of value) {
      const normalized = normalizeStripeTimestamp(candidate)
      if (normalized) {
        return normalized
      }
    }
    return null
  }

  if (typeof value === 'number') {
    // Stripe historically returned seconds. Future versions may return ms.
    const isSeconds = value < 1e12
    const date = new Date(isSeconds ? value * 1000 : value)
    return isNaN(date.getTime()) ? null : date.toISOString()
  }

  if (typeof value === 'string') {
    const numeric = Number(value)
    if (!Number.isNaN(numeric) && value.trim() !== '') {
      const isSeconds = numeric < 1e12
      const date = new Date(isSeconds ? numeric * 1000 : numeric)
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }
    }

    const parsed = new Date(value)
    return isNaN(parsed.getTime()) ? null : parsed.toISOString()
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>

    for (const key of TIMESTAMP_KEYS) {
      if (record[key] != null) {
        const normalized = normalizeStripeTimestamp(record[key])
        if (normalized) {
          return normalized
        }
      }
    }

    return null
  }

  return null
}

export function extractStripePeriod(resource: Record<string, unknown> | null | undefined) {
  const currentPeriod = (resource as any)?.current_period

  const start = normalizeStripeTimestamp([
    (resource as any)?.current_period_start,
    currentPeriod?.start,
    currentPeriod?.start_date,
    currentPeriod?.start_at,
    currentPeriod?.start_time,
  ])

  const end = normalizeStripeTimestamp([
    (resource as any)?.current_period_end,
    currentPeriod?.end,
    currentPeriod?.end_date,
    currentPeriod?.end_at,
    currentPeriod?.end_time,
  ])

  return {
    start,
    end,
  }
}