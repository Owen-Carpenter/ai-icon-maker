import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface IconGenerationRequest {
  prompt: string;
  style: string;
  primaryColor: string;
  count?: number;
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

    const { prompt, style, primaryColor, count = 3 } = request;

    // Create a detailed prompt for Claude to generate SVG icons
    const systemPrompt = `You are a professional SVG icon designer creating high-quality, polished icons for modern applications.

CRITICAL RULES:
1. Always generate EXACTLY ${count} different SVG icons
2. Each SVG must be complete, valid, and professional quality
3. Use viewBox="0 0 24 24" for all icons
4. Create clean, sophisticated designs that look professional
5. Use NATURAL COLORS for the main object - don't force the primary color onto everything
6. Style should be: ${style}
7. Return ONLY the SVG code, no explanations or markdown
8. Separate multiple SVGs with "---SVG_SEPARATOR---"
9. Icons must be instantly recognizable and well-designed
10. Use the primary color (${primaryColor}) for ACCENTS and DETAILS, not the main object
11. Each icon should be a unique, polished variation

COLOR STRATEGY:
- Use natural colors for the main object (white for snowman, green for trees, etc.)
- Apply primary color (${primaryColor}) to accessories, highlights, or decorative elements
- For a snowman: white body, black eyes/buttons, ${primaryColor} scarf/hat
- For an apple: red/green body, ${primaryColor} leaf/stem
- For a house: natural colors, ${primaryColor} door/roof details
- Ensure excellent contrast and visual hierarchy

DESIGN QUALITY:
- Professional, polished appearance
- Clean, precise lines and shapes
- Proper proportions and balance
- Sophisticated use of color and space
- Icons should look like they belong in a premium app

Style Guidelines:
- Modern: Clean, contemporary, sophisticated
- Flat: Minimalist, solid colors, excellent contrast
- Metallic: Subtle gradients, professional shine
- Cartoon: Polished, friendly, well-proportioned
- Pictogram: Clean, symbolic, instantly recognizable
- Line Art: Precise, consistent stroke weights
- 3D: Professional depth, realistic lighting
- Vintage: Elegant, refined retro styling
- Neon: Bright, modern, eye-catching
- Hand-drawn: Artistic but polished, not amateur`;

    const userPrompt = `Create ${count} professional, high-quality SVG icons representing: "${prompt}"

DESIGN REQUIREMENTS:
- Style: ${style}
- Primary Color: ${primaryColor} (use for accents/details only)
- Each icon must be instantly recognizable as "${prompt}"
- Professional quality - no amateur or childish designs
- Use natural colors for the main object
- Sophisticated, polished appearance

COLOR INSTRUCTIONS:
- Main object: Use natural colors (white for snowman, red for apple, etc.)
- Accents: Use primary color (${primaryColor}) for accessories, highlights, or decorative elements
- Ensure excellent contrast and visual hierarchy

EXAMPLES FOR "snowman":
1. White snowman body with black eyes/buttons, ${primaryColor} scarf
2. White snowman with top hat, black features, ${primaryColor} hat band
3. White snowman with carrot nose, black buttons, ${primaryColor} mittens

EXAMPLES FOR "apple":
1. Red apple with green leaf, ${primaryColor} stem
2. Green apple with bite mark, ${primaryColor} leaf
3. Apple core with ${primaryColor} seeds

Create sophisticated, professional icons that look like they belong in a premium application.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const responseText = message.content[0]?.type === 'text' ? message.content[0].text : '';
    
    if (!responseText) {
      throw new Error('No response from Claude');
    }

    // Parse the SVG icons from the response
    const svgIcons = parseSVGsFromResponse(responseText);
    
    if (svgIcons.length === 0) {
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