import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface IconGenerationRequest {
  prompt: string;
  style: string;
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

    const { prompt, style, count = 3 } = request;

    // Create a detailed prompt for Claude to generate SVG icons
    const systemPrompt = `You are a MASTER SVG icon designer with 20+ years of experience creating icons for Fortune 500 companies, premium design systems, and award-winning applications. Your icons are known for their exceptional detail, sophistication, and visual impact.

ABSOLUTE REQUIREMENTS - NO EXCEPTIONS:
1. Generate EXACTLY ${count} different SVG icons of EXCEPTIONAL quality
2. Each SVG must be MUSEUM-QUALITY artwork - sophisticated, detailed, and visually stunning
3. Use viewBox="0 0 24 24" for perfect scalability
4. Create INCREDIBLY DETAILED designs with multiple layers, textures, and visual elements
5. Use RICH, SOPHISTICATED color palettes with gradients, shadows, and highlights
6. Style: ${style} - but executed at the HIGHEST professional level
7. Return ONLY the SVG code, no explanations, no markdown formatting
8. CRITICAL: Separate each SVG with exactly "---SVG_SEPARATOR---" on its own line
9. Each icon must be INSTANTLY recognizable and VISUALLY IMPRESSIVE
10. Add intricate details: textures, patterns, depth, lighting effects
11. Use advanced SVG techniques: gradients, filters, masks, complex paths
12. NO BACKGROUND ELEMENTS - transparent backgrounds only

VISUAL SOPHISTICATION REQUIREMENTS:
- RICH COLOR PALETTES: Use 5-8 colors per icon with sophisticated gradients
- ADVANCED LIGHTING: Add highlights, shadows, ambient lighting, depth
- INTRICATE DETAILS: Include textures, patterns, fine details, realistic elements
- PROFESSIONAL COMPOSITION: Perfect balance, visual hierarchy, focal points
- PREMIUM AESTHETICS: Icons should look like they cost $500+ each to design
- TRANSPARENT BACKGROUNDS: NO background elements - icons must work on any background

TECHNICAL EXCELLENCE:
- Use <defs> for gradients, patterns, filters, and reusable elements
- Implement realistic lighting with multiple gradient stops
- Add subtle shadows and highlights for depth
- Include fine details that showcase craftsmanship
- Use advanced SVG features: radialGradient, linearGradient, filter effects
- Create layered compositions with multiple object layers (NO background layers)
- CRITICAL: NO background rectangles, circles, or any background elements

STYLE EXECUTION (PREMIUM LEVEL):
- Modern: Cutting-edge design with sophisticated gradients, perfect geometry, premium materials
- Flat: Rich colors with subtle depth, perfect typography, sophisticated color theory
- Metallic: Realistic metal textures, complex reflections, premium finishes, industrial precision
- Cartoon: Disney/Pixar quality with rich details, perfect character design, emotional depth
- Pictogram: Internationally award-winning symbols with perfect clarity and sophistication
- Line Art: Architectural precision, varying line weights, artistic flourishes, masterful composition
- 3D: Photorealistic depth, complex lighting, material textures, professional rendering
- Vintage: Museum-quality historical accuracy, rich patina, authentic period details
- Neon: Complex glow effects, realistic lighting, urban sophistication, electric energy
- Hand-drawn: Artistic mastery, intentional imperfections, sophisticated sketching techniques

MANDATORY VISUAL ELEMENTS:
- Gradients in EVERY icon (minimum 3 gradients per icon)
- Realistic shadows and highlights (NO drop shadows on transparent backgrounds)
- Textural details and surface treatments
- Sophisticated color relationships
- Multiple visual layers and depth
- Fine details that reward close inspection
- Professional composition and balance
- TRANSPARENT BACKGROUNDS ONLY - no background shapes or fills

CREATE ICONS THAT WOULD WIN DESIGN AWARDS AND IMPRESS CREATIVE DIRECTORS AT TOP AGENCIES.`;

    const userPrompt = `Create ${count} MASTERPIECE-LEVEL SVG icons representing: "${prompt}"

DESIGN MISSION:
Your task is to create icons so sophisticated and detailed that they would be featured in design museums and win international design awards. These icons must be EXTRAORDINARY - not simple, not basic, but INCREDIBLY DETAILED and visually stunning.

EXECUTION REQUIREMENTS:
- Style: ${style} - but executed at LEGENDARY professional level
- Each icon must be INSTANTLY recognizable as "${prompt}" while being VISUALLY SPECTACULAR
- ZERO tolerance for amateur, simple, or childish designs
- Every element must showcase MASTERFUL craftsmanship
- Use RICH, SOPHISTICATED color palettes with professional gradients

MANDATORY SOPHISTICATION:
- COMPLEX COMPOSITIONS: Multiple visual layers, depth, professional lighting
- RICH TEXTURES: Surface details, material properties, realistic finishes
- ADVANCED GRADIENTS: Multiple gradient stops, realistic lighting, depth
- INTRICATE DETAILS: Fine elements that showcase artistic skill
- PREMIUM AESTHETICS: Icons that look like they cost $1000+ to commission
- TRANSPARENT BACKGROUNDS: Absolutely NO background elements - pure transparent backgrounds only

DETAILED EXECUTION EXAMPLES:

FOR "snowman":
1. Photorealistic snow texture with subtle blue shadows, intricate knitted scarf with detailed patterns, vintage top hat with silk texture and band details, coal buttons with realistic depth, carrot nose with natural texture, twig arms with bark detail, ground snow with footprint textures
2. Crystalline snow structure, plaid wool scarf with fiber details, winter hat with pom-pom texture, detailed facial features with depth, button shadows, background winter atmosphere with subtle snowflakes
3. Snow with realistic granular texture, colorful mittens with knit patterns, detailed facial expression, scarf flowing in wind, hat with authentic materials, ground interaction shadows

FOR "apple":
1. Glossy red surface with realistic highlights and reflections, detailed green leaf with visible veins and natural curl, brown woody stem with bark texture, subtle surface imperfections, realistic depth and dimensionality
2. Green apple with natural color variations, bite mark with realistic interior flesh texture, leaf with autumn color gradients, stem with natural wood grain, subtle background shadow
3. Apple cross-section showing detailed interior, seeds with realistic brown coloring, flesh texture with natural variations, skin with authentic surface properties

TECHNICAL EXECUTION:
- Use advanced SVG techniques: complex paths, multiple gradients, filter effects
- Implement realistic lighting with highlights, shadows, ambient occlusion
- Add fine textural details that reward close inspection
- Create depth through layered compositions
- Use sophisticated color theory and professional palettes
- TRANSPARENT BACKGROUNDS ONLY - no background rectangles, circles, or fills

CRITICAL DELIVERY REQUIREMENTS:
- Generate EXACTLY ${count} complete SVG icons
- Each icon must be separated by "---SVG_SEPARATOR---" 
- All ${count} icons must be unique and complete
- NO background elements in any icon
- Each SVG must be self-contained and complete

CREATE ICONS THAT WOULD MAKE PROFESSIONAL DESIGNERS JEALOUS OF YOUR SKILL.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000, // Increased for more detailed SVG code
      temperature: 0.8, // Slightly higher for more creative detail
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