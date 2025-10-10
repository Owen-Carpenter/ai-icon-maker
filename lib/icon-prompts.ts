/**
 * Icon Generation Prompts
 * 
 * Centralized prompt templates for initial icon generation and improvements
 */

export interface PromptContext {
  prompt: string;
  style: string;
  count: number;
  improvementInstruction?: string;
  basePrompt?: string;
}

/**
 * Generate reasoning prompt for initial icon creation
 */
export function getInitialReasoningPrompt(context: PromptContext): string {
  const { prompt, style, count } = context;
  
  return `You are an expert icon designer using GPT Image 1. A user wants to create ${count} clean, minimal icons for "${prompt}" in ${style} style.

CRITICAL REQUIREMENTS:
- TRANSPARENT PNG BACKGROUND - completely transparent, no background elements
- MINIMAL DESIGN - just the essential icon shape, no extra details
- SOLID COLORS ONLY - no gradients, shadows, or effects
- HIGH CONTRAST - clear visibility at small sizes

Please provide a brief reasoning process explaining:
1. How you'll create a clean, minimal version of "${prompt}"
2. Your approach to ensuring completely transparent backgrounds
3. Color choices for maximum contrast and clarity
4. How you'll keep the design simple and recognizable

Keep this concise and focused on transparency and minimalism.`;
}

/**
 * Generate reasoning prompt for icon improvement
 */
export function getImprovementReasoningPrompt(context: PromptContext): string {
  const { prompt, style, improvementInstruction = 'general improvement', basePrompt = prompt } = context;
  
  // Extract all improvements from the full prompt if it contains cumulative changes
  const allImprovements = prompt.includes(', and ') 
    ? prompt.split(', ').slice(1).join(', ') // Remove base prompt, keep all improvements
    : improvementInstruction;
  
  const hasColorRequest = /blue|color|red|green|yellow|orange|purple|pink|black|white/i.test(allImprovements);
  const colorNote = hasColorRequest 
    ? 'CRITICAL: You MUST use the specific color requested in the feedback' 
    : 'Choose appropriate colors for the design';
  const colorImportance = hasColorRequest
    ? 'IMPORTANT: The color change must be visually obvious and match exactly what was requested.'
    : '';
  
  return `You are an expert icon designer using GPT Image 1. A user wants to restyle an existing icon based on their cumulative feedback: "${prompt}" in ${style} style.

CRITICAL REQUIREMENTS:
- TRANSPARENT PNG BACKGROUND - completely transparent, no background elements
- MINIMAL DESIGN - just the essential icon shape, no extra details
- SOLID COLORS ONLY - no gradients, shadows, or effects
- HIGH CONTRAST - clear visibility at small sizes

Please provide a brief reasoning process explaining:
1. How you'll modify the existing icon based on ALL the feedback: "${allImprovements}"
2. Your approach to ensuring completely transparent backgrounds
3. Color choices for maximum contrast and clarity - ${colorNote}
4. How you'll keep the same basic concept and recognizable shape while applying ALL the requested changes cumulatively

IMPORTANT: You are RESTYLING an existing icon with CUMULATIVE improvements, not creating a new one. Keep the same core concept and recognizable shape, but apply ALL the requested modifications together (color, style adjustments, etc.). ${colorImportance}`;
}

/**
 * Generate system prompt for icon design reasoning
 */
export function getSystemPrompt(): string {
  return "You are an expert icon designer specializing in clean, minimal icons with transparent PNG backgrounds. You create simple, recognizable icons with no background elements, shadows, or extra details. Focus on essential shapes and solid colors for maximum clarity.";
}

/**
 * Generate image generation prompt for initial icons
 */
export function getInitialImagePrompt(context: PromptContext, variationIndex: number): string {
  const { prompt, style } = context;
  const variation = variationIndex === 0 ? "first" : variationIndex === 1 ? "second" : "third";
  
  return `Minimal ${prompt} icon, ${style} style, ${variation} version. TRANSPARENT PNG BACKGROUND. Simple solid color shape, no details, no background, no shadows, no effects. Clean edges, high contrast.`;
}

/**
 * Generate image generation prompt for icon improvements
 */
export function getImprovementImagePrompt(context: PromptContext): string {
  const { prompt, improvementInstruction = '', basePrompt = prompt } = context;
  
  // Extract all improvements from the full prompt if it contains cumulative changes
  const allImprovements = prompt.includes(', and ') 
    ? prompt.split(', ').slice(1).join(', ') // Remove base prompt, keep all improvements
    : improvementInstruction;
  
  // Check if this is a color change request in any of the improvements
  const isColorChange = /blue|color|red|green|yellow|orange|purple|pink|black|white/i.test(allImprovements);
  
  if (allImprovements) {
    if (isColorChange) {
      // For color changes, modify the existing icon with all cumulative changes
      return `Modify the existing ${basePrompt} icon with ALL these cumulative changes: ${allImprovements}. Keep the same basic shape and structure, but apply ALL the requested modifications together. TRANSPARENT PNG BACKGROUND. Simple solid color shape, no details, no background, no shadows, no effects. Clean edges, high contrast.`;
    } else {
      // For other improvements, modify the existing icon with all cumulative changes
      return `Modify the existing ${basePrompt} icon with ALL these cumulative changes: ${allImprovements}. Keep the same basic concept and recognizable shape, but apply ALL the requested changes together: ${allImprovements}. TRANSPARENT PNG BACKGROUND. Simple solid color shape, no details, no background, no shadows, no effects. Clean edges, high contrast.`;
    }
  } else {
    // Fallback for general improvements
    return `Modify the existing ${basePrompt} icon with improvements. Keep the same basic concept. TRANSPARENT PNG BACKGROUND. Simple solid color shape, no details, no background, no shadows, no effects. Clean edges, high contrast.`;
  }
}

/**
 * Extract improvement instruction from a combined prompt
 */
export function extractImprovementParts(prompt: string): { basePrompt: string; improvementInstruction: string } {
  if (!prompt.includes(',')) {
    return { basePrompt: prompt, improvementInstruction: '' };
  }
  
  const parts = prompt.split(',');
  const basePrompt = parts[0].trim();
  const improvementInstruction = parts.slice(1).join(',').trim();
  
  return { basePrompt, improvementInstruction };
}

