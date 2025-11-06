import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/contact/route'
import { createMockRequest, parseResponse } from '../setup'

// Mock Resend - hoisting-safe approach
vi.mock('resend', () => {
  const mockSend = vi.fn().mockResolvedValue({
    data: { id: 'test-email-id' },
    error: null,
  })

  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
    __mockSend: mockSend, // Export for test access
  }
})

describe('POST /api/contact', () => {
  let mockSend: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    // Get the mock function from the module
    const resendModule = await import('resend')
    const Resend = (resendModule as any).Resend
    const instance = new Resend('test-key')
    mockSend = instance.emails.send as ReturnType<typeof vi.fn>
    vi.mocked(mockSend).mockResolvedValue({
      data: { id: 'test-email-id' },
      error: null,
    })
  })

  it('should return 400 when required fields are missing', async () => {
    const request = createMockRequest({
      name: 'Test User',
      email: 'test@example.com',
      // message is missing
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(400)
    const body = await result.json()
    expect(body.error).toContain('Missing required fields')
  })

  it('should return 400 when email format is invalid', async () => {
    const request = createMockRequest({
      name: 'Test User',
      email: 'invalid-email',
      message: 'Test message',
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(400)
    const body = await result.json()
    expect(body.error).toContain('Invalid email format')
  })

  it('should successfully send contact email', async () => {
    const request = createMockRequest({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message content',
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(200)
    const body = await result.json()
    expect(body.message).toBe('Email sent successfully')
    expect(body.id).toBeDefined()

    // Verify Resend was called with correct parameters
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: expect.arrayContaining([expect.any(String)]),
        subject: 'Test Subject',
      })
    )
  })

  it('should handle Resend API errors', async () => {
    vi.mocked(mockSend).mockResolvedValueOnce({
      data: null,
      error: { message: 'Resend API error' },
    } as any)

    const request = createMockRequest({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })

    const response = await POST(request as any)
    const result = await parseResponse(response)

    expect(result.status).toBe(500)
    const body = await result.json()
    expect(body.error).toBe('Failed to send email')
  })
})

