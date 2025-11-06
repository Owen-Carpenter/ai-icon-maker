import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/stripe/checkout/route'
import { createMockRequest, parseResponse } from '../setup'

// Mock Supabase
vi.mock('@supabase/ssr', async () => {
  const { createMockSupabaseClient } = await import('../mocks/supabase')
  return {
    createServerClient: vi.fn(() => createMockSupabaseClient()),
  }
})

// Mock Stripe - create inside factory to avoid hoisting issues
vi.mock('@/lib/stripe', async () => {
  const { createMockStripe } = await import('../mocks/stripe')
  const mockStripe = createMockStripe()
  return {
    stripe: mockStripe,
    getStripePriceId: vi.fn((planType: string) => {
      const priceMap: Record<string, string> = {
        base: 'price_base',
        pro: 'price_pro',
        proPlus: 'price_proPlus',
      }
      return priceMap[planType] || null
    }),
    STRIPE_CONFIG: {
      baseURL: 'http://localhost:3000',
    },
  }
})

// Mock subscription plans
vi.mock('@/lib/subscription-plans', () => ({
  SUBSCRIPTION_PLANS: {
    base: { name: 'Base', price: 5 },
    pro: { name: 'Pro', price: 10 },
    proPlus: { name: 'Pro+', price: 15 },
  },
}))

describe('POST /api/stripe/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 when plan type is missing', async () => {
    const request = createMockRequest({})

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(400)
    const body = await result.json()
    expect(body.error).toBe('Missing plan type')
  })

  it('should return 400 when plan type is invalid', async () => {
    const request = createMockRequest({
      planType: 'invalid-plan',
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(400)
    const body = await result.json()
    expect(body.error).toBe('Invalid subscription plan')
  })

  it('should create checkout session for valid plan', async () => {
    const request = createMockRequest({
      planType: 'pro',
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(200)
    const body = await result.json()
    expect(body.url).toBeDefined()
    expect(typeof body.url).toBe('string')

    // Verify Stripe checkout was called
    const { stripe } = await import('@/lib/stripe')
    expect(stripe.checkout.sessions.create).toHaveBeenCalled()
  })

  it('should handle Stripe errors', async () => {
    const { stripe } = await import('@/lib/stripe')
    vi.mocked(stripe.checkout.sessions.create).mockRejectedValueOnce(
      new Error('Stripe API error')
    )

    const request = createMockRequest({
      planType: 'pro',
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(500)
    const body = await result.json()
    expect(body.error).toBeDefined()
  })
})

