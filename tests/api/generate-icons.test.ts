import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/generate-icons/route'
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

// Mock OpenAI
vi.mock('openai', async () => {
  const { createMockOpenAI } = await import('../mocks/openai')
  return {
    default: vi.fn().mockImplementation(() => createMockOpenAI()),
  }
})

// Mock chatgpt module
vi.mock('@/lib/chatgpt', () => ({
  generateIconsWithChatGPT: vi.fn().mockResolvedValue({
    success: true,
    icons: [
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    ],
    error: null,
  }),
}))

describe('POST /api/generate-icons', () => {
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

  it('should return 400 when prompt is too long', async () => {
    const longPrompt = 'a'.repeat(201) // 201 characters

    const request = createMockRequest({
      prompt: longPrompt,
      style: 'modern',
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(400)
    const body = await result.json()
    expect(body.error).toContain('Prompt too long')
  })

  it('should successfully generate icons', async () => {
    const request = createMockRequest({
      prompt: 'a shopping cart icon',
      style: 'modern',
      isImprovement: false,
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(200)
    const body = await result.json()
    expect(body.success).toBe(true)
    expect(body.icons).toBeDefined()
    expect(Array.isArray(body.icons)).toBe(true)
  })

  it('should handle generation failures', async () => {
    const { generateIconsWithChatGPT } = await import('@/lib/chatgpt')
    vi.mocked(generateIconsWithChatGPT).mockResolvedValueOnce({
      success: false,
      icons: [],
      error: 'Generation failed',
    })

    const request = createMockRequest({
      prompt: 'test icon',
      style: 'modern',
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(500)
    const body = await result.json()
    expect(body.error).toBe('Generation failed')
  })
})

