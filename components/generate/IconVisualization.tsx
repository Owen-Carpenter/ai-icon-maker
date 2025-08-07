'use client';


import { Button } from '../ui/button';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import Logo from '../ui/Logo';

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
  const handleDownload = () => {
    if (generatedImages.length > 0) {
      const link = document.createElement('a');
      link.href = generatedImages[0];
      link.download = `icon-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            {/* Animated Site Icon */}
            <div className="w-16 h-16 flex items-center justify-center animate-spin">
              <Logo 
                width={48} 
                height={48} 
                className="text-white"
                alt="AI Icon Maker"
              />
            </div>
            
            {/* Text */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Generating your icon...
              </h3>
              <p className="text-sm text-sunset-200 animate-pulse">
                Our AI is creating a beautiful icon based on your description
              </p>
            </div>

            {/* Loading Dots Animation */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-sunset-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-sunset-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-sunset-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        ) : generatedImages.length > 0 ? (
          // Generated Icon Display
          <div className="w-full py-4">
            <div className="text-center space-y-4">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 w-64 h-64 mx-auto flex items-center justify-center">
                <img
                  src={generatedImages[0]}
                  alt="Generated icon"
                  className="w-32 h-32 object-contain"
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={handleDownload}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
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
              Icon generated successfully
            </p>
            <div className="flex justify-center space-x-2">
              <Button
                onClick={onRegenerate}
                size="sm"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 