'use client';

import { Button } from '../ui/button';

interface GenerationPanelProps {
  generatedImages: string[];
  isGenerating: boolean;
  onRegenerateVariations: () => void;
  onSelectImage: (imageUrl: string) => void;
}

export default function GenerationPanel({ 
  generatedImages, 
  isGenerating, 
  onRegenerateVariations,
  onSelectImage 
}: GenerationPanelProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Generated Icons</h3>
        <Button
          onClick={onRegenerateVariations}
          disabled={isGenerating || generatedImages.length === 0}
          variant="outline"
          size="sm"
        >
          {isGenerating ? 'Generating...' : 'New Variations'}
        </Button>
      </div>

      {/* Generated Images Grid */}
      <div className="space-y-4">
        {generatedImages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">
              Generated icons will appear here
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {generatedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-3 border border-gray-200 hover:border-orange-500 transition-colors cursor-pointer"
                onClick={() => onSelectImage(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Generated icon ${index + 1}`}
                  className="w-full h-24 object-contain rounded"
                />
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    Variation {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectImage(imageUrl);
                    }}
                  >
                    Use This
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generation Settings */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <h4 className="text-white font-medium mb-3">Settings</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-white text-sm mb-1">Style</label>
            <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
              <option value="modern">Modern</option>
              <option value="minimalist">Minimalist</option>
              <option value="detailed">Detailed</option>
              <option value="flat">Flat Design</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white text-sm mb-1">Size</label>
            <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
              <option value="256">256x256</option>
              <option value="512">512x512</option>
              <option value="1024">1024x1024</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 