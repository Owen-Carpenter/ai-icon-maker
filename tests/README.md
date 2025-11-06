# Testing Guide

This project uses Vitest for unit and integration testing.

## Setup

Tests are located in the `tests/` directory and follow the same structure as the source code.

**Important**: Before running tests, you need to create `tests/setup.ts` from `tests/setup.example.ts`:

```bash
cp tests/setup.example.ts tests/setup.ts
```

Then edit `tests/setup.ts` and add your test API keys. This file is gitignored to protect your API keys.

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.ts              # Test setup and utilities
├── mocks/                # Mock implementations
│   ├── supabase.ts      # Supabase client mocks
│   ├── stripe.ts        # Stripe client mocks
│   ├── openai.ts        # OpenAI client mocks
│   └── resend.ts        # Resend client mocks
└── api/                  # API route tests
    ├── deduct-credit.test.ts
    ├── contact.test.ts
    ├── generate-icons.test.ts
    └── stripe-checkout.test.ts
```

## Writing Tests

### Example: Testing an API Route

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/your-route/route'
import { createMockRequest, parseResponse } from '../setup'

describe('POST /api/your-route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle valid request', async () => {
    const request = createMockRequest({ data: 'test' })
    const response = await POST(request as any)
    const result = await parseResponse(response)
    
    expect(result.status).toBe(200)
  })
})
```

## Mocking

### Supabase
Use `createMockSupabaseClient()` from `tests/mocks/supabase.ts`

### Stripe
Use `createMockStripe()` from `tests/mocks/stripe.ts`

### OpenAI
Use `createMockOpenAI()` from `tests/mocks/openai.ts`

### Resend
Use `createMockResend()` from `tests/mocks/resend.ts`

## Test Coverage

Current coverage focuses on:
- API route handlers
- Error handling
- Input validation
- Authentication/authorization
- Business logic

## Best Practices

1. **Isolate tests**: Each test should be independent
2. **Mock external dependencies**: Don't make real API calls in tests
3. **Test edge cases**: Include error scenarios and boundary conditions
4. **Keep tests fast**: Unit tests should run quickly
5. **Use descriptive names**: Test names should clearly describe what they test

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test:run
```

