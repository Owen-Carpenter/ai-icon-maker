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
    let isClosed = false;
    
    const stream = new ReadableStream({
      start(controller) {
        
        const safeEnqueue = (data: string) => {
          if (!isClosed) {
            try {
              // Check if controller is still writable
              if (controller.desiredSize !== null) {
                controller.enqueue(encoder.encode(data));
              } else {
                isClosed = true;
              }
            } catch (error) {
              console.error('Error enqueueing data:', error);
              isClosed = true;
            }
          }
        };
        
        const safeClose = () => {
          if (!isClosed) {
            try {
              controller.close();
              isClosed = true;
            } catch (error) {
              console.error('Error closing controller:', error);
            }
          }
        };
        
        // Call Claude API with streaming thoughts
        generateIconsWithClaude({
          prompt: prompt.trim(),
          style,
          count: 3,
          onThought: (thought: string) => {
            // Send thought chunk to client
            const data = JSON.stringify({ type: 'thought', content: thought });
            safeEnqueue(`data: ${data}\n\n`);
          },
        }).then((result) => {
          // Send final result
          const data = JSON.stringify({ 
            type: 'complete', 
            success: result.success,
            icons: result.icons,
            error: result.error
          });
          safeEnqueue(`data: ${data}\n\n`);
          safeClose();
        }).catch((error) => {
          // Send error
          const data = JSON.stringify({ 
            type: 'error', 
            error: error.message 
          });
          safeEnqueue(`data: ${data}\n\n`);
          safeClose();
        });
      },
      cancel() {
        // Handle client disconnect
        isClosed = true;
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
