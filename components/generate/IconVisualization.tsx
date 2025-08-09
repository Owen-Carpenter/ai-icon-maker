'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Download, RefreshCw, Share2, Code, Eye, CheckCircle } from 'lucide-react';
import Logo from '../ui/Logo';

interface IconVisualizationProps {
  generatedImages: string[];
  isGenerating: boolean;
  onRegenerate: () => void;
  onSelectImage: (imageUrl: string) => void;
  currentPrompt?: string;
}

// Sample SVG code for animation
const sampleSvgCode = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Icon Background -->
  <circle cx="32" cy="32" r="28" fill="url(#gradient)" stroke="#e5e7eb" stroke-width="2"/>
  
  <!-- Gradient Definition -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Icon Content -->
  <path d="M20 24h24M20 32h24M20 40h16" stroke="white" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Decorative Elements -->
  <circle cx="48" cy="40" r="3" fill="white" opacity="0.8"/>
</svg>`;

export default function IconVisualization({ 
  generatedImages, 
  isGenerating, 
  onRegenerate, 
  onSelectImage,
  currentPrompt 
}: IconVisualizationProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [codeIndex, setCodeIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'icon' | 'code'>('icon');
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  // Animate SVG code typing
  useEffect(() => {
    if (isGenerating) {
      setDisplayedCode('');
      setCodeIndex(0);
      setViewMode('icon'); // Reset to icon view when generating
      
      const interval = setInterval(() => {
        setCodeIndex((prevIndex) => {
          if (prevIndex >= sampleSvgCode.length) {
            clearInterval(interval);
            return prevIndex;
          }
          // Speed up by adding multiple characters per interval for faster completion
          return Math.min(prevIndex + 4, sampleSvgCode.length);
        });
      }, 8); // Slower typing speed for better readability

      return () => clearInterval(interval);
    } else {
      setDisplayedCode('');
      setCodeIndex(0);
    }
  }, [isGenerating]);

  // Update displayed code based on current index
  useEffect(() => {
    setDisplayedCode(sampleSvgCode.slice(0, codeIndex));
  }, [codeIndex]);

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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleSvgCode).then(() => {
      setShowCopyPopup(true);
      setTimeout(() => setShowCopyPopup(false), 2000); // Hide after 2 seconds
    }).catch((err) => {
      console.error('Failed to copy code:', err);
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 h-full flex flex-col min-h-[400px] lg:max-h-[600px] relative">
      {/* Copy Confirmation Popup */}
      {showCopyPopup && (
        <div className="absolute top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Code copied!</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0">
        <div>
          <h3 className="text-white font-semibold text-sm lg:text-base">
            {generatedImages.length > 0 && viewMode === 'code' ? 'SVG Code' : 'Icon Preview'}
          </h3>
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
      <div className="flex-1 p-4 lg:p-6 flex items-start justify-center overflow-y-auto min-h-0">
        {isGenerating ? (
          // Animated SVG Code Generation State
          <div className="w-full h-full flex flex-col">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Generating SVG code...
              </h3>
              <p className="text-sm text-sunset-200">
                Our AI is writing the perfect SVG code for your icon
              </p>
            </div>
            
            {/* SVG Code Display */}
            <div className="flex-1 bg-midnight-900/50 rounded-lg border border-white/20 p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-xs font-mono">icon.svg</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="bg-midnight-800 rounded p-4 h-full overflow-auto" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
                <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre" style={{ minWidth: 'max-content' }}>
                  <code className="block">
                    {displayedCode.split('\n').map((line, index) => (
                      <div key={index} className="flex">
                        <span className="text-white/40 mr-2 select-none w-8 text-right flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="flex-1 whitespace-pre">{line || ' '}</span>
                      </div>
                    ))}
                    {displayedCode && <span className="animate-pulse text-green-300">|</span>}
                  </code>
                </pre>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-4 text-center">
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-sunset-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-sunset-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-sunset-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        ) : generatedImages.length > 0 ? (
          // Generated Icon Display with Toggle
          <div className="w-full h-full flex flex-col min-h-0">
            {/* Toggle Buttons */}
            <div className="flex justify-center mb-4 flex-shrink-0">
              <div className="bg-white/10 rounded-lg p-1 flex relative">
                {/* Sliding Background */}
                <div 
                  className={`absolute top-1 bottom-1 rounded-md bg-gradient-to-r from-orange-500 to-pink-600 transition-all duration-300 ease-in-out ${
                    viewMode === 'icon' 
                      ? 'left-1 w-[calc(50%-8px)]' 
                      : 'left-[calc(50%-1px)] w-[calc(50%-4px)]'
                  }`}
                />
                
                <Button
                  onClick={() => setViewMode('icon')}
                  size="sm"
                  variant="ghost"
                  className={`text-xs relative z-10 transition-colors duration-300 px-3 flex-1 ${
                    viewMode === 'icon' 
                      ? 'text-white' 
                      : 'text-white'
                  }`}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Icon
                </Button>
                <Button
                  onClick={() => setViewMode('code')}
                  size="sm"
                  variant="ghost"
                  className={`text-xs relative z-10 transition-colors duration-300 px-3 flex-1 ${
                    viewMode === 'code' 
                      ? 'text-white' 
                      : 'text-white'
                  }`}
                >
                  <Code className="w-3 h-3 mr-1" />
                  Code
                </Button>
              </div>
            </div>

            {/* Content based on view mode */}
            {viewMode === 'icon' ? (
              <div className="flex-1 flex flex-col items-center justify-center min-h-0 p-4">
                <div className="bg-white rounded-xl p-4 lg:p-8 shadow-lg border border-gray-200 w-full max-w-[256px] h-48 lg:h-64 flex items-center justify-center">
                  <img
                    src={generatedImages[0]}
                    alt="Generated icon"
                    className="w-16 h-16 lg:w-32 lg:h-32 object-contain"
                  />
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4 w-full max-w-[256px]">
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10 w-full sm:w-auto"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            ) : (
              // Code View
              <div className="flex-1 bg-midnight-900/50 rounded-lg border border-white/20 p-4 overflow-hidden flex flex-col min-h-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 flex-shrink-0 gap-2">
                  <span className="text-white/60 text-xs font-mono">icon.svg</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleCopyCode}
                      size="sm"
                      variant="outline"
                      className="text-white border-white/30 hover:bg-white/10 text-xs"
                    >
                      Copy Code
                    </Button>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-midnight-800 rounded p-2 lg:p-4 flex-1 overflow-auto min-h-0" style={{ overflowX: 'scroll', overflowY: 'auto' }}>
                  <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre" style={{ minWidth: 'max-content' }}>
                    <code className="block">
                      {sampleSvgCode.split('\n').map((line, index) => (
                        <div key={index} className="flex">
                          <span className="text-white/40 mr-2 select-none w-8 text-right flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="flex-1 whitespace-pre">{line || ' '}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            )}
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
        <div className="p-4 border-t border-white/20 mt-auto flex-shrink-0">
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