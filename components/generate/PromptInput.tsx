'use client';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: string;
  setStyle: (style: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function PromptInput({ prompt, setPrompt, style, setStyle, primaryColor, setPrimaryColor, onGenerate, isGenerating }: PromptInputProps) {
  const iconStyles = [
    { value: 'modern', label: 'Modern', description: 'Clean and contemporary design' },
    { value: 'flat', label: 'Flat', description: 'Minimalist flat design' },
    { value: 'metallic', label: 'Metallic', description: 'Shiny metallic finish' },
    { value: 'cartoon', label: 'Cartoon', description: 'Fun and playful style' },
    { value: 'pictogram', label: 'Pictogram', description: 'Simple symbolic representation' },
    { value: 'line-art', label: 'Line Art', description: 'Outline style with clean lines' },
    { value: '3d', label: '3D', description: 'Three-dimensional appearance' },
    { value: 'vintage', label: 'Vintage', description: 'Retro and classic style' },
    { value: 'neon', label: 'Neon', description: 'Glowing neon effect' },
    { value: 'hand-drawn', label: 'Hand-drawn', description: 'Sketchy, artistic style' }
  ];

  // Find the selected style for display purposes
  const selectedStyle = iconStyles.find(s => s.value === style);

  return (
    <div className="w-full h-full">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 h-full flex flex-col">
        {/* Main Prompt Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Describe your icon
          </label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A minimalist shopping cart with rounded corners"
            className="w-full h-12"
          />
        </div>

        {/* Controls Row */}
        <div className="flex flex-col gap-4 items-start flex-1">
          {/* Style and Color Row */}
          <div className="flex gap-4 w-full">
            {/* Style Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-2">
                Style
              </label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Choose a style...">
                    {selectedStyle && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{selectedStyle.label}</span>
                        <span className="text-xs text-gray-400 hidden sm:inline">
                          • {selectedStyle.description}
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full">
                  {iconStyles.map((iconStyle) => (
                    <SelectItem 
                      key={iconStyle.value} 
                      value={iconStyle.value}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col py-1">
                        <span className="font-medium text-white">{iconStyle.label}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{iconStyle.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Primary Color Selection */}
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-white mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-10 rounded-lg border border-white/20 bg-white/10 cursor-pointer"
                title="Choose primary color"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="w-full mt-auto">
            <Button
              onClick={() => onGenerate()}
              disabled={isGenerating || (!prompt.trim() || !style)}
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating from Prompt...
                </>
              ) : (
                'Generate from Prompt'
              )}
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        {style && prompt && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-sm text-gray-300">
                <span className="text-white font-medium">Ready to generate from prompt:</span> {iconStyles.find(s => s.value === style)?.label} style icon of "{prompt}" 
                <span className="inline-flex items-center gap-1 ml-2">
                  in <span className="inline-block w-3 h-3 rounded-full border border-gray-500" style={{ backgroundColor: primaryColor }}></span> color
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!prompt && !style && (
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-300">
              <span className="text-blue-200 font-medium">Tip:</span> You can generate icons from text prompts here, drawings on the canvas, or combine both approaches for unique results!
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 