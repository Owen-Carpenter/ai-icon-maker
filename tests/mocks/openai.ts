import { vi } from 'vitest'

export const createMockOpenAI = () => {
  const mockImageResponse = {
    data: [
      {
        b64_json: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        url: undefined,
      },
    ],
  }

  return {
    images: {
      generate: vi.fn().mockResolvedValue(mockImageResponse),
      edit: vi.fn().mockResolvedValue(mockImageResponse),
    },
  }
}

