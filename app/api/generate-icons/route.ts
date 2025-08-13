import { NextRequest, NextResponse } from 'next/server';
import { generateIconsWithClaude, IconGenerationRequest } from '../../../lib/claude';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';

// Rate limiting - simple in-memory store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per user

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { prompt, style, primaryColor }: IconGenerationRequest = body;

    // Validate required fields
    if (!prompt || !style || !primaryColor) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, style, primaryColor' },
        { status: 400 }
      );
    }

    // Get user session (optional - remove if not using authentication)
    const session = await getServerSession();
    const userId = session?.user?.email || request.ip || 'anonymous';

    // Check rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before making another request.' },
        { status: 429 }
      );
    }

    // Validate inputs
    if (prompt.length > 200) {
      return NextResponse.json(
        { error: 'Prompt too long. Maximum 200 characters.' },
        { status: 400 }
      );
    }

    // Generate icons with Claude
    const result = await generateIconsWithClaude({
      prompt: prompt.trim(),
      style,
      primaryColor,
      count: 3,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate icons' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      icons: result.icons,
      message: `Generated ${result.icons.length} icons successfully`,
    });

  } catch (error) {
    console.error('Icon generation API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Icon generation API is running' },
    { status: 200 }
  );
}