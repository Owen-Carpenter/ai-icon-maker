import { vi } from 'vitest'

export const createMockSupabaseClient = () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
  }

  const mockSubscription = {
    id: 'test-subscription-id',
    user_id: 'test-user-id',
    plan_type: 'pro',
    status: 'active',
    monthly_token_limit: 100,
    stripe_customer_id: null, // Default to null for new subscriptions
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }

  const mockUsage = [
    {
      tokens_used: 10,
      generation_successful: true,
    },
  ]

  const mockRpcResult = {
    success: true,
    remaining_tokens: 90,
    usage_id: 'test-usage-id',
    error_message: null,
  }

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { 
          session: {
            user: mockUser,
            access_token: 'test-token',
          }
        },
        error: null,
      }),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn((table: string) => {
      const queryBuilder = {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: table === 'subscriptions' ? (mockSubscription.stripe_customer_id ? mockSubscription : null) : mockUser,
          error: table === 'subscriptions' && !mockSubscription.stripe_customer_id 
            ? { code: 'PGRST116', message: 'Not found' } 
            : null,
        }),
        limit: vi.fn().mockResolvedValue({
          data: [mockSubscription],
          error: null,
        }),
      }
      return queryBuilder
    }),
    rpc: vi.fn().mockImplementation((functionName: string) => {
      // Handle different RPC functions
      if (functionName === 'get_or_create_subscription_for_user') {
        return Promise.resolve({ data: null, error: null })
      }
      // Default for other RPC calls like use_tokens
      return Promise.resolve({
        data: [mockRpcResult],
        error: null,
      })
    }),
  }
}

// Mock Supabase SSR createServerClient
export const mockCreateServerClient = vi.fn((url: string, key: string, options: any) => {
  return createMockSupabaseClient()
})

