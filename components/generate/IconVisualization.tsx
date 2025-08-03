'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Download, RefreshCw, Heart, Share2 } from 'lucide-react';

interface IconVisualizationProps {
  generatedImages: string[];
  isGenerating: boolean;
  onRegenerate: () => void;
  onSelectImage: (imageUrl: string) => void;
  currentPrompt?: string;
}

export default function IconVisualization({ 
  generatedImages, 
  isGenerating, 
  onRegenerate, 
  onSelectImage,
  currentPrompt 
}: IconVisualizationProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageSelect = (imageUrl: string, index: number) => {
    setSelectedImageIndex(index);
    onSelectImage(imageUrl);
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `icon-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div>
          <h3 className="text-white font-semibold">Icon Preview</h3>
          <p className="text-white/60 text-xs">
            {currentPrompt ? `"${currentPrompt}"` : 'Your generated icon will appear here'}
          </p>
        </div>
        {generatedImages.length > 0 && (
          <Button
            onClick={onRegenerate}
            disabled={isGenerating}
            size="sm"
            variant="outline"
            className="text-white border-white/30 hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex items-start justify-center overflow-y-auto">
        {isGenerating ? (
          // Loading State
          <div className="text-center space-y-6">
            <div className="relative">
              {/* Animated background circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-4 border-white/10 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-orange-500/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-pink-500/50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              
              {/* Central icon placeholder */}
              <div className="relative z-10 w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-white font-semibold text-lg">Generating your icon...</h3>
              <p className="text-white/60 text-sm max-w-md">
                Our AI is creating a beautiful icon based on your description. This usually takes a few seconds.
              </p>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : generatedImages.length > 0 ? (
          // Generated Icons Display
          <div className="w-full space-y-6 py-4">
            {/* Main selected icon */}
            {selectedImageIndex !== null && (
              <div className="text-center space-y-4">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-xs mx-auto">
                  <img
                    src={generatedImages[selectedImageIndex]}
                    alt="Selected icon"
                    className="w-full h-32 object-contain"
                  />
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={() => handleDownload(generatedImages[selectedImageIndex])}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}

            {/* All generated variations */}
            <div className="pb-4">
              <h4 className="text-white font-medium mb-3 text-center">All Variations</h4>
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all hover:scale-105 ${
                      selectedImageIndex === index 
                        ? 'border-orange-500 shadow-lg' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => handleImageSelect(imageUrl, index)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Generated icon ${index + 1}`}
                      className="w-full h-20 object-contain"
                    />
                    <div className="mt-2 text-center">
                      <span className="text-xs text-gray-600">
                        {selectedImageIndex === index ? 'Selected' : 'Click to select'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="text-center space-y-4 py-8">
            <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
              <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Ready to create?</h3>
              <p className="text-white/60 text-sm max-w-md">
                Describe your icon idea in the chat on the left, and I'll generate beautiful icons for you.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {generatedImages.length > 0 && !isGenerating && (
        <div className="p-4 border-t border-white/20 mt-auto">
          <div className="text-center">
            <p className="text-white/60 text-xs mb-2">
              Generated {generatedImages.length} variations
            </p>
            <div className="flex justify-center space-x-2">
              <Button
                onClick={onRegenerate}
                size="sm"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate More
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 