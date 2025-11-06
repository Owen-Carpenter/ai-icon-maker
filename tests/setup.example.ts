import { vi } from 'vitest'
import { Readable } from 'stream'

// Mock environment variables
// Copy this file to setup.ts and fill in your test API keys
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_test'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
process.env.RESEND_API_KEY = 're_test'
process.env.CONTACT_EMAIL = 'test@example.com'
// NODE_ENV is read-only, but Vitest sets it automatically

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn((name: string) => ({
      name,
      value: 'test-cookie-value',
    })),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}))

// Helper to create mock NextRequest
export function createMockRequest(
  body?: any,
  headers: Record<string, string> = {}
): Request {
  const url = 'http://localhost:3000/api/test'
  const init: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    init.body = JSON.stringify(body)
  }

  const request = new Request(url, init)
  
  // Add nextUrl property for Next.js compatibility
  ;(request as any).nextUrl = new URL(url)
  
  return request
}

// Helper to create mock NextResponse-like response
export function parseResponse(response: Response) {
  return {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    json: () => response.json(),
    text: () => response.text(),
  }
}

