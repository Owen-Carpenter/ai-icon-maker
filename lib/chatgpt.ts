import OpenAI from 'openai';
import {
  getInitialReasoningPrompt,
  getImprovementReasoningPrompt,
  getSystemPrompt,
  getInitialImagePrompt,
  getImprovementImagePrompt,
  extractImprovementParts
} from './icon-prompts';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface IconGenerationRequest {
  prompt: string;
  style: string;
  count?: number;
  onThought?: (thought: string) => void; // Callback for streaming thoughts
  isImprovement?: boolean; // Flag to indicate if this is an improvement request
}

export interface IconGenerationResponse {
  success: boolean;
  icons: string[];
  error?: string;
}

/**
 * Generate icons using GPT Image 1
 */
export async function generateIconsWithChatGPT(request: IconGenerationRequest): Promise<IconGenerationResponse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { prompt, style, count = 3, onThought, isImprovement = false } = request;

    // Generate real reasoning text using ChatGPT
    if (onThought) {
      try {
        // Extract improvement parts if this is an improvement request
        const { basePrompt, improvementInstruction } = isImprovement 
          ? extractImprovementParts(prompt)
          : { basePrompt: prompt, improvementInstruction: '' };
        
        const reasoningPrompt = isImprovement 
          ? getImprovementReasoningPrompt({
              prompt,
              style,
              count,
              improvementInstruction,
              basePrompt
            })
          : getInitialReasoningPrompt({
              prompt,
              style,
              count
            });

        const reasoningResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: getSystemPrompt()
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
        onThought("\n\n🎨 Now generating the actual icons with GPT Image 1...\n");
        
      } catch (reasoningError) {
        console.error('Error generating reasoning:', reasoningError);
        // Fallback to simple reasoning if ChatGPT fails
        onThought(`🎨 GPT Image 1 is creating minimal "${prompt}" icons in ${style} style...\n`);
        onThought("🔍 Designing clean icons with transparent PNG backgrounds...\n");
        onThought("✨ Using solid colors and simple shapes for maximum clarity...\n");
        onThought("🖼️ Generating clean icon variations...\n");
      }
    }

    // Create detailed prompts for GPT Image 1 generation
    const imagePrompts = [];
    const actualCount = isImprovement ? 1 : count; // Force 1 icon for improvements
    
    console.log(`🎯 Generating ${actualCount} icon(s) - Improvement mode: ${isImprovement}`);
    console.log(`🎯 Original prompt: "${prompt}"`);
    console.log(`🎯 Full request params:`, { prompt, style, count, isImprovement, actualCount });
    
    if (isImprovement) {
      console.log('🎯 IMPROVEMENT MODE: Restyling existing icon with requested changes');
    } else {
      console.log('🎯 NEW ICON MODE: Creating new icons from scratch');
    }
    
    // Extract improvement parts if needed
    const { basePrompt, improvementInstruction } = isImprovement 
      ? extractImprovementParts(prompt)
      : { basePrompt: prompt, improvementInstruction: '' };
    
    for (let i = 0; i < actualCount; i++) {
      let imagePrompt;
      
      if (isImprovement) {
        imagePrompt = getImprovementImagePrompt({
          prompt,
          style,
          count,
          improvementInstruction,
          basePrompt
        });
        console.log(`🎯 Improvement prompt: "${imagePrompt}"`);
      } else {
        imagePrompt = getInitialImagePrompt({ prompt, style, count }, i);
      }
      
      imagePrompts.push(imagePrompt);
    }

    // Generate images using GPT Image 1
    const imageUrls = [];
    let billingError = false;
    
    for (let i = 0; i < imagePrompts.length; i++) {
      const imagePrompt = imagePrompts[i];
      const variation = i === 0 ? "first" : i === 1 ? "second" : "third";
      
      console.log(`\n🖼️ Processing ${variation} variation (${i + 1}/${imagePrompts.length})`);
      console.log(`Image prompt: ${imagePrompt}`);
      // Processing image variation
      
      if (onThought) {
        onThought(`\n🖼️ Creating ${variation} variation: ${imagePrompt.split('.')[0]}...\n`);
      }
      
      try {
        const response = await openai.images.generate({
          model: "gpt-image-1", // Use GPT Image 1 model
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
          quality: "medium" //for development mode
        });

        // GPT Image 1 response received

        // Check for base64 in response.data[0].b64_json (GPT Image 1 format)
        if (response.data && response.data[0]?.b64_json) {
          const dataUrl = `data:image/png;base64,${response.data[0].b64_json}`;
          imageUrls.push(dataUrl);
          // Base64 data added successfully
          if (onThought) {
            onThought(`✅ ${variation} variation generated successfully!\n`);
          }
        }
        // Check for URL in response.data[0].url (DALL-E format)
        else if (response.data && response.data[0]?.url) {
          imageUrls.push(response.data[0].url);
          // URL added successfully
          if (onThought) {
            onThought(`✅ ${variation} variation generated successfully!\n`);
          }
        }
        // Check for any other possible response structure
        else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const firstItem = response.data[0];
          // Checking alternative response structure
          
          // Look for any URL-like property
          const possibleUrlKeys = ['url', 'image_url', 'src', 'href', 'link'];
          let foundUrl = null;
          
          for (const key of possibleUrlKeys) {
            const value = (firstItem as any)[key];
            if (value && typeof value === 'string' && value.startsWith('http')) {
              foundUrl = value;
              break;
            }
          }
          
          if (foundUrl) {
            imageUrls.push(foundUrl);
            console.log(`✅ Successfully added ${variation} variation from alternative structure:`, foundUrl);
            // Alternative URL added successfully
            if (onThought) {
              onThought(`✅ ${variation} variation generated successfully (alternative format)!\n`);
            }
          } else {
            console.error(`❌ No recognizable URL found in alternative response structure for ${variation}:`, firstItem);
            if (onThought) {
              onThought(`❌ No URL found in response for ${variation} variation\n`);
            }
          }
        }
        else {
          console.error(`❌ No URL or b64_json found in GPT Image 1 response for ${variation} variation:`, response);
          console.error('Response structure:', {
            hasData: !!response.data,
            dataLength: response.data?.length,
            firstItem: response.data?.[0],
            responseKeys: Object.keys(response),
            fullResponse: response
          });
          if (onThought) {
            onThought(`❌ No URL found in response for ${variation} variation\n`);
          }
        }
      } catch (imageError: any) {
        console.error(`Error generating image ${imageUrls.length + 1}:`, imageError);
        console.error('Full error details:', JSON.stringify(imageError, null, 2));
        console.error(`imageUrls length after error: ${imageUrls.length}`);
        
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
      
      // End of loop iteration
    }

    console.log(`\n🔍 FINAL CHECK - After all iterations:`);
    console.log(`imageUrls length:`, imageUrls.length);
    console.log(`billingError:`, billingError);

    // Handle billing hard limit error specifically
    if (billingError) {
      console.warn('GPT Image 1 billing limit reached, using fallback icons');
      const fallbackIcons = generateFallbackIcons(prompt, style, count);
      return {
        success: true,
        icons: fallbackIcons,
        error: 'OpenAI billing limit reached. Please add more credits to your OpenAI account at https://platform.openai.com/ for full functionality.'
      };
    }

    if (imageUrls.length === 0) {
      console.warn('No GPT Image 1 images generated, using fallback icons');
      console.warn('imageUrls array is empty:', imageUrls);
      console.warn('imageUrls length:', imageUrls.length);
      const fallbackIcons = generateFallbackIcons(prompt, style, count);
      return {
        success: true,
        icons: fallbackIcons,
        error: 'Unable to generate GPT Image 1 images. Showing placeholder icons. Please check your OpenAI account billing.'
      };
    }

    console.log(`Generated ${imageUrls.length} images using GPT Image 1`);
    
    if (onThought) {
      onThought(`\n🎉 Successfully generated ${imageUrls.length} clean, minimal icons!\n`);
      onThought("✨ All icons have transparent PNG backgrounds with simple, solid color designs.\n");
      onThought("🎯 Perfect for app icons and UI elements - no extra details or distractions.\n");
    }
    
    return {
      success: true,
      icons: imageUrls,
    };

  } catch (error) {
    console.error('GPT Image 1 icon generation error:', error);
    
    // Handle specific OpenAI errors
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      if (error.message.includes('billing hard limit reached') || error.message.includes('Billing hard limit')) {
        errorMessage = 'OpenAI billing hard limit reached. Please add credits to your OpenAI account to continue using GPT Image 1 generation.';
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
 * Generate fallback placeholder icons when GPT Image 1 is unavailable
 */
function generateFallbackIcons(prompt: string, style: string, count: number): string[] {
  const fallbackIcons = [];
  
  // Create different icon variations based on the prompt with transparent backgrounds
  const iconVariations = [
    // Variation 1: Simple geometric shape with transparent background
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="512" height="512">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">${prompt.charAt(0).toUpperCase()}</text>
    </svg>`,
    
    // Variation 2: Square with rounded corners and transparent background
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="512" height="512">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#10b981" stroke="#059669" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">${prompt.charAt(0).toUpperCase()}</text>
    </svg>`,
    
    // Variation 3: Diamond shape with transparent background
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="512" height="512">
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
