import { vi } from 'vitest'

export const createMockResend = () => {
  return {
    emails: {
      send: vi.fn().mockResolvedValue({
        data: {
          id: 'test-email-id',
        },
        error: null,
      }),
    },
  }
}

