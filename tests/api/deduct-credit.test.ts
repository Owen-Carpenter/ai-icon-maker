import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/deduct-credit/route'
import { createMockRequest, parseResponse } from '../setup'
import type { createMockSupabaseClient } from '../mocks/supabase'

// Mock Supabase with a factory that allows per-test overrides
let mockSupabaseInstance: ReturnType<typeof createMockSupabaseClient> | null = null

vi.mock('@supabase/ssr', async () => {
  const { createMockSupabaseClient } = await import('../mocks/supabase')
  return {
    createServerClient: vi.fn(() => {
      if (!mockSupabaseInstance) {
        mockSupabaseInstance = createMockSupabaseClient()
      }
      return mockSupabaseInstance
    }),
  }
})

describe('POST /api/deduct-credit', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    // Reset to default mock
    const { createMockSupabaseClient } = await import('../mocks/supabase')
    mockSupabaseInstance = createMockSupabaseClient()
  })

  it('should return 401 when user is not authenticated', async () => {
    if (mockSupabaseInstance) {
      mockSupabaseInstance.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })
    }

    const request = createMockRequest({
      prompt: 'test icon',
      style: 'modern',
      isImprovement: false,
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(401)
    expect(await result.json()).toEqual({ error: 'Unauthorized' })
  })

  it('should return 400 when required fields are missing', async () => {
    const request = createMockRequest({
      prompt: 'test icon',
      // style is missing
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(400)
    const body = await result.json()
    expect(body.error).toContain('Missing required fields')
  })

  it('should successfully deduct credits for new icon generation', async () => {
    const request = createMockRequest({
      prompt: 'test icon',
      style: 'modern',
      isImprovement: false,
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(200)
    const body = await result.json()
    expect(body.success).toBe(true)
    expect(body.credits_deducted).toBe(1)
    expect(body.remaining_tokens).toBeGreaterThanOrEqual(0)
  })

  it('should deduct 3 credits for icon improvement', async () => {
    const request = createMockRequest({
      prompt: 'make it blue',
      style: 'modern',
      isImprovement: true,
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(200)
    const body = await result.json()
    expect(body.success).toBe(true)
    expect(body.credits_deducted).toBe(3)
  })

  it('should return 403 when user has insufficient credits', async () => {
    if (mockSupabaseInstance) {
      mockSupabaseInstance.rpc = vi.fn().mockResolvedValue({
        data: [
          {
            success: false,
            remaining_tokens: 0,
            usage_id: null,
            error_message: 'Insufficient credits',
          },
        ],
        error: null,
      })
    }

    const request = createMockRequest({
      prompt: 'test icon',
      style: 'modern',
      isImprovement: false,
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(403)
    const body = await result.json()
    expect(body.error).toContain('Insufficient credits')
  })
})

