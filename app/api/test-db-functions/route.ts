import { NextRequest, NextResponse } from 'next/server'

// Test routes are disabled in production
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 404 }
    )
  }
  return NextResponse.json({ error: 'Test endpoint not implemented' }, { status: 501 })
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 404 }
    )
  }
  return NextResponse.json({ error: 'Test endpoint not implemented' }, { status: 501 })
}

