import { NextRequest, NextResponse } from 'next/server';
import { generateIconsWithClaude } from '../../../lib/claude';

export async function POST(request: NextRequest) {
  try {
    // Note: Authentication is handled by the credit deduction API
    // This streaming endpoint focuses on the generation process

    // Parse request body
    const body = await request.json();
    const { prompt, style } = body;

    // Validate required fields
    if (!prompt || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, style' },
        { status: 400 }
      );
    }

    // Create a ReadableStream for streaming thoughts
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Call Claude API with streaming thoughts
        generateIconsWithClaude({
          prompt: prompt.trim(),
          style,
          count: 3,
          onThought: (thought: string) => {
            // Send thought chunk to client
            const data = JSON.stringify({ type: 'thought', content: thought });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          },
        }).then((result) => {
          // Send final result
          const data = JSON.stringify({ 
            type: 'complete', 
            success: result.success,
            icons: result.icons,
            error: result.error
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          controller.close();
        }).catch((error) => {
          // Send error
          const data = JSON.stringify({ 
            type: 'error', 
            error: error.message 
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Generate icons stream error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
