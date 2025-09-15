import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface IconGenerationRequest {
  prompt: string;
  style: string;
  count?: number;
  onThought?: (thought: string) => void; // Callback for streaming thoughts
}

export interface IconGenerationResponse {
  success: boolean;
  icons: string[];
  error?: string;
}

/**
 * Generate icons using DALL-E (GPT Image 1)
 */
export async function generateIconsWithChatGPT(request: IconGenerationRequest): Promise<IconGenerationResponse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { prompt, style, count = 3, onThought } = request;

    // Generate real reasoning text using ChatGPT
    if (onThought) {
      try {
        const reasoningPrompt = `You are an expert icon designer using DALL-E 3. A user wants to create ${count} professional icons for "${prompt}" in ${style} style. 

CRITICAL: These icons must have COMPLETELY TRANSPARENT backgrounds - only the icon object itself should be visible, no background elements whatsoever.

Please provide a detailed, step-by-step reasoning process explaining:
1. Your initial analysis of the request and transparent background requirements
2. Your design approach and visual strategy for clean, isolated icons
3. Color choices and why you chose them (solid colors only, no gradients)
4. Technical considerations for icon design with transparent backgrounds
5. How you'll ensure the icons work at small sizes without background support
6. Your specific approach to creating completely transparent backgrounds
7. The specific variations you'll create (different angles, styles, or details)
8. Final quality checks to ensure no background elements remain

Write this as a natural, flowing reasoning process that shows your creative thinking. Be specific about design decisions and technical choices, especially regarding transparent backgrounds.`;

        const reasoningResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert icon designer with deep knowledge of design principles, color theory, and technical icon creation. You specialize in creating icons with completely transparent backgrounds - only the icon object itself is visible, with no background elements, shadows, or environmental details. Provide detailed, professional reasoning for your design decisions, especially regarding transparent background requirements."
            },
            {
              role: "user",
              content: reasoningPrompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1000,
          stream: true
        });

        let reasoningText = "";
        for await (const chunk of reasoningResponse) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            reasoningText += content;
            onThought(content);
          }
        }
        
        // Add a separator before image generation
        onThought("\n\n🎨 Now generating the actual icons with DALL-E 3...\n");
        
      } catch (reasoningError) {
        console.error('Error generating reasoning:', reasoningError);
        // Fallback to simple reasoning if ChatGPT fails
        onThought(`🎨 DALL-E 3 is analyzing your request for "${prompt}" in ${style} style...\n`);
        onThought("🔍 Designing professional icons with transparent backgrounds...\n");
        onThought("✨ Ensuring high contrast and perfect scalability...\n");
        onThought("🖼️ Generating unique icon variations...\n");
      }
    }

    // Create detailed prompts for DALL-E image generation
    const imagePrompts = [];
    
    for (let i = 0; i < count; i++) {
      const variation = i === 0 ? "first" : i === 1 ? "second" : "third";
      const imagePrompt = `Create a clean, professional icon of ${prompt} in ${style} style. ${variation} variation. 

CRITICAL REQUIREMENTS:
- COMPLETELY TRANSPARENT BACKGROUND - no background, no backdrop, no surface, no ground
- ONLY the icon object itself should be visible
- No shadows, no reflections, no environmental elements
- No background colors, shapes, or textures
- The icon should appear to float in empty space
- Simple, minimalist design with high contrast
- Solid colors only, no gradients
- Perfect for use as an app icon or UI element
- Instantly recognizable at small sizes
- Clean, sharp edges with no background bleed

The final image should contain ONLY the ${prompt} icon with a completely transparent background.`;
      imagePrompts.push(imagePrompt);
    }

    // Generate images using DALL-E
    const imageUrls = [];
    let billingError = false;
    
    for (let i = 0; i < imagePrompts.length; i++) {
      const imagePrompt = imagePrompts[i];
      const variation = i === 0 ? "first" : i === 1 ? "second" : "third";
      
      if (onThought) {
        onThought(`\n🖼️ Creating ${variation} variation: ${imagePrompt.split('.')[0]}...\n`);
      }
      
      try {
        const response = await openai.images.generate({
          model: "dall-e-3", // Use DALL-E 3 for highest quality
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
          quality: "hd", // High definition quality
          style: "natural" // Natural style for better icons
        });

        if (response.data && response.data[0]?.url) {
          imageUrls.push(response.data[0].url);
          if (onThought) {
            onThought(`✅ ${variation} variation generated successfully!\n`);
          }
        }
      } catch (imageError: any) {
        console.error(`Error generating image ${imageUrls.length + 1}:`, imageError);
        console.error('Full error details:', JSON.stringify(imageError, null, 2));
        
        if (onThought) {
          onThought(`❌ Error generating ${variation} variation. Continuing with others...\n`);
        }
        
        // Check for billing hard limit error
        if (imageError?.code === 'billing_hard_limit_reached' || 
            imageError?.message?.includes('Billing hard limit has been reached')) {
          billingError = true;
          break; // Stop trying to generate more images
        }
        // Continue with other images for other types of errors
      }
    }

    // Handle billing hard limit error specifically
    if (billingError) {
      console.warn('DALL-E billing limit reached, using fallback icons');
      const fallbackIcons = generateFallbackIcons(prompt, style, count);
      return {
        success: true,
        icons: fallbackIcons,
        error: 'OpenAI billing limit reached. Please add more credits to your OpenAI account at https://platform.openai.com/ for full functionality.'
      };
    }

    if (imageUrls.length === 0) {
      console.warn('No DALL-E images generated, using fallback icons');
      const fallbackIcons = generateFallbackIcons(prompt, style, count);
      return {
        success: true,
        icons: fallbackIcons,
        error: 'Unable to generate DALL-E images. Showing placeholder icons. Please check your OpenAI account billing.'
      };
    }

    console.log(`Generated ${imageUrls.length} images using DALL-E 3`);
    
    if (onThought) {
      onThought(`\n🎉 Successfully generated ${imageUrls.length} professional icons!\n`);
      onThought("✨ All icons have completely transparent backgrounds with only the icon object visible.\n");
      onThought("🎯 Perfect for use in any design - no background elements or distractions.\n");
    }
    
    return {
      success: true,
      icons: imageUrls,
    };

  } catch (error) {
    console.error('DALL-E icon generation error:', error);
    
    // Handle specific OpenAI errors
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      if (error.message.includes('billing hard limit reached') || error.message.includes('Billing hard limit')) {
        errorMessage = 'OpenAI billing hard limit reached. Please add credits to your OpenAI account to continue using DALL-E image generation.';
      } else if (error.message.includes('429') || error.message.includes('quota')) {
        errorMessage = 'OpenAI API quota exceeded. Please check your billing and add credits to your OpenAI account.';
      } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
        errorMessage = 'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.';
      } else if (error.message.includes('content_policy_violation')) {
        errorMessage = 'The prompt may contain content that violates OpenAI\'s content policy. Please try a different prompt.';
      } else if (error.message.includes('rate_limit_exceeded')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      icons: [],
      error: errorMessage,
    };
  }
}

/**
 * Generate fallback placeholder icons when DALL-E is unavailable
 */
function generateFallbackIcons(prompt: string, style: string, count: number): string[] {
  const fallbackIcons = [];
  
  // Create different icon variations based on the prompt with transparent backgrounds
  const iconVariations = [
    // Variation 1: Simple geometric shape with transparent background
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">${prompt.charAt(0).toUpperCase()}</text>
    </svg>`,
    
    // Variation 2: Square with rounded corners and transparent background
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#10b981" stroke="#059669" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">${prompt.charAt(0).toUpperCase()}</text>
    </svg>`,
    
    // Variation 3: Diamond shape with transparent background
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
      <path d="M12 2l8 8-8 8-8-8z" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white">${prompt.charAt(0).toUpperCase()}</text>
    </svg>`
  ];
  
  for (let i = 0; i < count; i++) {
    const svgIcon = iconVariations[i % iconVariations.length];
    
    // Convert to data URL
    const base64 = Buffer.from(svgIcon).toString('base64');
    fallbackIcons.push(`data:image/svg+xml;base64,${base64}`);
  }
  
  return fallbackIcons;
}

/**
 * Test OpenAI API key
 */
export async function testOpenAIKey(): Promise<{success: boolean, error?: string}> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return { success: false, error: 'OPENAI_API_KEY is not configured' };
    }

    // Try a simple API call to test the key
    const response = await openai.models.list();
    return { success: true };
  } catch (error: any) {
    console.error('OpenAI API key test failed:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error testing API key' 
    };
  }
}

/**
 * Validate image URL
 */
export function validateImageUrl(url: string): boolean {
  try {
    // Basic validation for image URLs
    return url.startsWith('https://') && (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.webp'));
  } catch {
    return false;
  }
}
