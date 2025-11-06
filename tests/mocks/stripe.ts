import { vi } from 'vitest'

export const createMockStripe = () => {
  const mockCustomer = {
    id: 'cus_test123',
    email: 'test@example.com',
    metadata: {
      supabase_user_id: 'test-user-id',
    },
  }

  const mockCheckoutSession = {
    id: 'cs_test123',
    url: 'https://checkout.stripe.com/test',
    customer: 'cus_test123',
    subscription: 'sub_test123',
    metadata: {
      user_id: 'test-user-id',
      plan_type: 'pro',
    },
  }

  const mockSubscription = {
    id: 'sub_test123',
    customer: 'cus_test123',
    status: 'active',
    items: {
      data: [
        {
          price: {
            id: 'price_test123',
          },
        },
      ],
    },
    current_period_start: Math.floor(Date.now() / 1000),
    current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    cancel_at_period_end: false,
  }

  return {
    customers: {
      create: vi.fn().mockResolvedValue(mockCustomer),
      retrieve: vi.fn().mockResolvedValue(mockCustomer),
      update: vi.fn().mockResolvedValue(mockCustomer),
    },
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue(mockCheckoutSession),
        retrieve: vi.fn().mockResolvedValue(mockCheckoutSession),
      },
    },
    subscriptions: {
      retrieve: vi.fn().mockResolvedValue(mockSubscription),
      update: vi.fn().mockResolvedValue(mockSubscription),
      cancel: vi.fn().mockResolvedValue({
        ...mockSubscription,
        status: 'canceled',
      }),
    },
    billingPortal: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          url: 'https://billing.stripe.com/test',
        }),
      },
    },
    webhooks: {
      constructEvent: vi.fn().mockImplementation((body, signature, secret) => {
        return JSON.parse(body)
      }),
    },
  }
}

