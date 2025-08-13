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
    const systemPrompt = `You are an expert SVG icon designer. Your task is to create clean, scalable SVG icons based on user requirements.

IMPORTANT RULES:
1. Always generate EXACTLY ${count} different SVG icons
2. Each SVG must be complete and valid
3. Use viewBox="0 0 24 24" for all icons
4. Keep designs simple and recognizable at small sizes
5. Use the specified primary color: ${primaryColor}
6. Style should be: ${style}
7. Return ONLY the SVG code, no explanations or markdown
8. Separate multiple SVGs with "---SVG_SEPARATOR---"

Style Guidelines:
- Modern: Clean lines, minimal details, contemporary feel
- Flat: No gradients or shadows, solid colors, 2D appearance
- Metallic: Add subtle gradients and highlights for metallic effect
- Cartoon: Rounded, playful, exaggerated features
- Pictogram: Simple symbolic representation, minimal detail
- Line Art: Outline only, no fills, consistent stroke width
- 3D: Add depth with gradients and shadows
- Vintage: Retro styling with ornate details
- Neon: Bright colors with glow effects
- Hand-drawn: Slightly irregular lines, artistic feel`;

    const userPrompt = `Create ${count} SVG icons for: ${prompt}

Style: ${style}
Primary Color: ${primaryColor}

Make each icon unique but related to the same concept. Ensure they are professional, scalable, and suitable for use in applications.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
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