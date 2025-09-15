import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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
 * Generate SVG icons using Claude AI
 */
export async function generateIconsWithClaude(request: IconGenerationRequest): Promise<IconGenerationResponse> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const { prompt, style, count = 3, onThought } = request;

    // Create a detailed prompt for Claude to generate SVG icons
    const systemPrompt = `You are a MASTER icon designer specializing in clean, professional icons for modern applications and design systems. Your icons are known for their clarity, simplicity, and perfect recognition at any size.

CRITICAL: First, show your creative thinking process in detail. Explain your design decisions, color choices, composition thoughts, and technical approach. Think out loud about how you'll create each icon. Then provide the SVG code.

ABSOLUTE REQUIREMENTS - NO EXCEPTIONS:
1. Generate EXACTLY ${count} different SVG icons of PROFESSIONAL quality
2. Each SVG must be CLEAN, SIMPLE, and ICON-STYLE - not detailed illustrations
3. Use viewBox="0 0 24 24" for perfect scalability
4. Create SILHOUETTE-BASED designs - solid shapes, minimal details, high contrast
5. Use SIMPLE, BOLD color palettes - 1-2 colors maximum per icon
6. Style: ${style} - but executed as proper ICONS, not illustrations
7. Return ONLY the SVG code, no explanations, no markdown formatting
8. CRITICAL: Separate each SVG with exactly "---SVG_SEPARATOR---" on its own line
9. Each icon must be INSTANTLY recognizable and CLEAR at small sizes
10. Use SOLID FILLS and SIMPLE SHAPES - no gradients, textures, or complex details
11. Focus on SHAPE and FORM - the essence of the object, not realistic details
12. NO BACKGROUND ELEMENTS - transparent backgrounds only

ICON DESIGN REQUIREMENTS:
- CLEAN SILHOUETTES: Bold, recognizable shapes that work at 16x16px
- SIMPLE COLOR PALETTES: 1-2 solid colors maximum, high contrast
- MINIMAL DETAILS: Only essential elements, no decorative flourishes
- PROFESSIONAL COMPOSITION: Perfect balance, clear focal points
- SCALABLE DESIGN: Must be clear and recognizable at any size
- TRANSPARENT BACKGROUNDS: NO background elements - icons must work on any background

TECHNICAL EXCELLENCE:
- Use simple <path> elements with solid fills
- Avoid gradients, filters, or complex effects
- Focus on clean geometry and perfect curves
- Use consistent stroke weights (2px or solid fills)
- Create recognizable symbols, not detailed illustrations
- CRITICAL: NO background rectangles, circles, or any background elements

STYLE EXECUTION (ICON-FOCUSED):
- Modern: Clean geometric shapes, minimal details, contemporary aesthetics
- Flat: Solid colors, simple shapes, no depth or shadows
- Outline: Line-based icons with consistent stroke weights, filled or outlined
- Filled: Solid shape icons with bold, recognizable forms
- Minimal: Ultra-simple designs with only essential elements
- Rounded: Soft, friendly shapes with rounded corners
- Sharp: Angular, precise geometric forms
- Duotone: Two-color icons with high contrast
- Monochrome: Single color icons with varying opacity
- Linear: Line-based icons with consistent stroke width

MANDATORY ICON ELEMENTS:
- SOLID FILLS: Use single colors, no gradients or complex effects
- CLEAN SHAPES: Simple, recognizable geometric forms
- HIGH CONTRAST: Bold, clear visibility at small sizes
- MINIMAL DETAILS: Only essential elements for recognition
- CONSISTENT STYLE: Uniform approach across all icons
- SCALABLE DESIGN: Works perfectly at 16x16px and larger
- TRANSPARENT BACKGROUNDS ONLY - no background shapes or fills

CREATE ICONS THAT ARE CLEAN, PROFESSIONAL, AND INSTANTLY RECOGNIZABLE.`;

    const userPrompt = `Create ${count} CLEAN, PROFESSIONAL SVG icons representing: "${prompt}"

FIRST: Share your creative thinking process. Explain:
- Your initial concept and vision for each icon
- Color choices and why you chose them (1-2 colors max)
- Technical approach and simple SVG techniques you'll use
- Design challenges and how you'll solve them
- Composition and visual hierarchy thoughts

THEN: Provide the actual SVG code.

DESIGN MISSION:
Your task is to create clean, professional icons that are instantly recognizable and work perfectly at any size. These icons must be SIMPLE, CLEAR, and ICON-STYLE - not detailed illustrations.

EXECUTION REQUIREMENTS:
- Style: ${style} - but executed as proper ICONS, not illustrations
- Each icon must be INSTANTLY recognizable as "${prompt}" while being CLEAN and SIMPLE
- Focus on SILHOUETTE and SHAPE - the essence of the object
- Every element must be ESSENTIAL for recognition
- Use SIMPLE, BOLD color palettes with solid fills

MANDATORY ICON PRINCIPLES:
- CLEAN SILHOUETTES: Bold, recognizable shapes that work at 16x16px
- SIMPLE COLORS: 1-2 solid colors maximum, high contrast
- MINIMAL DETAILS: Only essential elements, no decorative flourishes
- SOLID FILLS: No gradients, textures, or complex effects
- SCALABLE DESIGN: Must be clear and recognizable at any size
- TRANSPARENT BACKGROUNDS: Absolutely NO background elements - pure transparent backgrounds only

ICON DESIGN EXAMPLES:

FOR "snowman":
1. Simple white circle for head, larger white circle for body, small black dots for eyes and buttons, orange triangle for nose, black rectangle for hat, simple line for scarf
2. Clean silhouette with three white circles (head, body, base), minimal facial features, simple hat shape, basic scarf line
3. Geometric snowman with rounded rectangles, simple facial features, clean hat design, minimal details

FOR "apple":
1. Simple red circle with small indent at top, green leaf shape, brown stem line
2. Clean apple silhouette with bite mark cutout, minimal leaf detail, simple stem
3. Basic apple shape with core visible, simple seed dots, clean outline

TECHNICAL EXECUTION:
- Use simple <path> elements with solid fills
- Avoid gradients, filters, or complex effects
- Focus on clean geometry and perfect curves
- Use consistent stroke weights (2px or solid fills)
- Create recognizable symbols, not detailed illustrations
- TRANSPARENT BACKGROUNDS ONLY - no background rectangles, circles, or fills

CRITICAL DELIVERY REQUIREMENTS:
- Generate EXACTLY ${count} complete SVG icons
- Each icon must be separated by "---SVG_SEPARATOR---" 
- All ${count} icons must be unique and complete
- NO background elements in any icon
- Each SVG must be self-contained and complete
- Use simple, clean designs that work at small sizes
- Focus on silhouette and essential shapes only

CREATE ICONS THAT ARE CLEAN, PROFESSIONAL, AND PERFECT FOR MODERN APPLICATIONS.`;

    let responseText = '';

    if (onThought) {
      // Use streaming to capture thoughts in real-time
      const stream = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          // Handle different delta types
          if ('text' in chunk.delta) {
            const text = chunk.delta.text;
            responseText += text;
            
            // Stream thoughts to the callback (everything before SVG code)
            if (!text.includes('<svg') && onThought) {
              onThought(text);
            }
          }
        }
      }
    } else {
      // Fallback to regular API call
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      responseText = message.content[0]?.type === 'text' ? message.content[0].text : '';
    }
    
    if (!responseText) {
      throw new Error('No response from Claude');
    }

    // Parse the SVG icons from the response
    const svgIcons = parseSVGsFromResponse(responseText);
    
    console.log(`Claude response length: ${responseText.length}`);
    console.log(`Parsed ${svgIcons.length} SVG icons`);
    
    if (svgIcons.length === 0) {
      console.error('Claude response:', responseText.substring(0, 500) + '...');
      throw new Error('No valid SVG icons generated');
    }

    // Convert SVGs to base64 data URLs for consistent format
    const iconDataUrls = svgIcons.map(svg => {
      const base64 = Buffer.from(svg).toString('base64');
      return `data:image/svg+xml;base64,${base64}`;
    });

    return {
      success: true,
      icons: iconDataUrls,
    };

  } catch (error) {
    console.error('Claude icon generation error:', error);
    return {
      success: false,
      icons: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Parse SVG icons from Claude's response
 */
function parseSVGsFromResponse(response: string): string[] {
  const svgs: string[] = [];
  
  // Split by separator if present
  const parts = response.split('---SVG_SEPARATOR---');
  
  for (const part of parts) {
    // Extract SVG content using regex
    const svgMatch = part.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi);
    
    if (svgMatch) {
      svgs.push(...svgMatch);
    }
  }
  
  // If no separator found, try to extract all SVGs from the full response
  if (svgs.length === 0) {
    const allSvgMatches = response.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi);
    if (allSvgMatches) {
      svgs.push(...allSvgMatches);
    }
  }
  
  // Validate and clean SVGs
  return svgs
    .map(svg => svg.trim())
    .filter(svg => svg.startsWith('<svg') && svg.endsWith('</svg>'))
    .slice(0, 3); // Limit to 3 icons max
}

/**
 * Validate SVG content
 */
export function validateSVG(svgContent: string): boolean {
  try {
    // Basic validation
    if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
      return false;
    }
    
    // Check for basic SVG structure
    const hasValidStructure = svgContent.includes('viewBox') || svgContent.includes('width');
    
    return hasValidStructure;
  } catch {
    return false;
  }
}