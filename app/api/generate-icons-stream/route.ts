import { NextRequest, NextResponse } from 'next/server';
import { generateIconsWithChatGPT } from '../../../lib/chatgpt';

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
        
        // Send initial response to confirm stream is working
        const initialData = JSON.stringify({ 
          type: 'start', 
          message: 'Starting GPT Image 1 generation...' 
        });
        safeEnqueue(`data: ${initialData}\n\n`);
        
        // Call ChatGPT API with streaming thoughts
        console.log('🚀 Starting GPT Image 1 generation with streaming...');
        console.log('Prompt:', prompt.trim());
        console.log('Style:', style);
        
        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          console.error('⏰ GPT Image 1 generation timeout after 60 seconds');
          const data = JSON.stringify({ 
            type: 'error', 
            error: 'Generation timeout - please try again' 
          });
          safeEnqueue(`data: ${data}\n\n`);
          safeClose();
        }, 60000); // 60 second timeout
        
        // Detect improvement mode by checking if the request body has isImprovement flag
        const isImprovement = body.isImprovement || false;
        console.log('🔍 Detected improvement mode:', isImprovement);
        console.log('🔍 Full prompt:', prompt);
        
        generateIconsWithChatGPT({
          prompt: prompt.trim(),
          style,
          count: isImprovement ? 1 : 3, // Generate 1 for improvements, 3 for new icons
          isImprovement: isImprovement,
          onThought: (thought: string) => {
            console.log('💭 Streaming thought:', thought);
            // Send thought chunk to client
            const data = JSON.stringify({ type: 'thought', content: thought });
            safeEnqueue(`data: ${data}\n\n`);
          },
        }).then((result) => {
          clearTimeout(timeoutId); // Clear timeout on success
          console.log('✅ GPT Image 1 generation completed:', result);
          console.log('Result success:', result.success);
          console.log('Result icons length:', result.icons?.length);
          console.log('Result error:', result.error);
          
          // Ensure we have valid icons before sending
          if (result.success && result.icons && result.icons.length > 0) {
            console.log('📤 Sending successful result with icons');
            const data = JSON.stringify({ 
              type: 'complete', 
              success: true,
              icons: result.icons,
              error: null
            });
            safeEnqueue(`data: ${data}\n\n`);
          } else {
            console.log('📤 Sending error result - no valid icons');
            const data = JSON.stringify({ 
              type: 'complete', 
              success: false,
              icons: [],
              error: result.error || 'No icons generated'
            });
            safeEnqueue(`data: ${data}\n\n`);
          }
          safeClose();
        }).catch((error) => {
          clearTimeout(timeoutId); // Clear timeout on error
          console.error('❌ GPT Image 1 generation failed:', error);
          // Send error
          const data = JSON.stringify({ 
            type: 'error', 
            error: error.message 
          });
          console.log('📤 Sending error to client:', data);
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
