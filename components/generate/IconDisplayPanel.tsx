'use client';

import { useState, useEffect } from 'react';

interface IconDisplayPanelProps {
  generatedImages: string[];
  isGenerating: boolean;
  onRegenerate: () => void;
  onReset: () => void;
  onSelectImage: (imageUrl: string) => void;
  onImproveIcon: (imageUrl: string) => void;
  isImprovementMode?: boolean;
  onExitImprovementMode?: () => void;
  selectedIconUrl?: string;
}

export default function IconDisplayPanel({ 
  generatedImages, 
  isGenerating, 
  onRegenerate, 
  onReset, 
  onSelectImage,
  onImproveIcon,
  isImprovementMode = false,
  onExitImprovementMode,
  selectedIconUrl
}: IconDisplayPanelProps) {
  const [animatedCode, setAnimatedCode] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedIconCode, setSelectedIconCode] = useState('');
  const [codeAnimationComplete, setCodeAnimationComplete] = useState(false);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);

  // Fake SVG code for demonstration
  const sampleSvgCode = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L13.09 8.26L20 9L13.09 15.74L12 22L10.91 15.74L4 9L10.91 8.26L12 2Z" fill="#FF6C00"/>
  <circle cx="12" cy="12" r="8" stroke="#FF6C00" stroke-width="2" fill="none"/>
  <rect x="8" y="8" width="8" height="8" rx="2" fill="#FF6C00" opacity="0.5"/>
  <path d="M8 12H16M12 8V16" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>`;

  // Animate code writing during generation
  useEffect(() => {
    if (isGenerating) {
      setCodeAnimationComplete(false);
      setShowGeneratedContent(false);
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= sampleSvgCode.length) {
          setAnimatedCode(sampleSvgCode.slice(0, currentIndex));
          currentIndex += Math.random() > 0.5 ? 3 : 2; // Faster typing speed
        } else {
          clearInterval(interval);
          setCodeAnimationComplete(true);
          // Show "Code Complete" message for a moment, then show icons
          setTimeout(() => {
            setShowGeneratedContent(true);
          }, 500); // Reduced from 1000ms to 500ms
        }
      }, 25); // Reduced from 50ms to 25ms

      return () => clearInterval(interval);
    } else {
      setAnimatedCode('');
      setCodeAnimationComplete(false);
      setShowGeneratedContent(false);
    }
  }, [isGenerating]);

  // Show generated content when generation is complete and animation is done
  useEffect(() => {
    if (!isGenerating && generatedImages.length > 0) {
      const timer = setTimeout(() => {
        setShowGeneratedContent(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, generatedImages.length]);

  const handleShowCode = (imageUrl: string) => {
    setSelectedIconCode(sampleSvgCode); // In real app, this would be the actual SVG code for the specific icon
    setShowCodeModal(true);
  };

  return (
    <div 
      data-walkthrough="results-panel"
      className="flex-1 flex flex-col lg:h-full lg:min-h-0 relative"
    >
      {/* Gradient Background - positioned behind content */}
      <div className="absolute inset-0 bg-gradient-to-r from-sunset-900/40 via-midnight-800/20 to-midnight-900/10 z-0"></div>
      {/* Results Header */}
              <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm relative z-10">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white">Generated Icons</h2>
              <p className="text-sunset-200 text-sm">Choose an action below each icon: Improve it or Download it</p>
            </div>
          </div>
        </div>

      {/* Results Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 lg:min-h-0 relative z-10">
        {isGenerating || (!showGeneratedContent && generatedImages.length > 0) ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            {isGenerating && (
              <>
                <div className="w-10 h-10 animate-spin mt-4">
                  <img 
                    src="/images/AIIconMakerLogo.png" 
                    alt="AI Icon Maker" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-white text-lg font-medium">Generating your icons...</p>
                  <p className="text-sunset-200 text-sm mt-2">Claude is writing SVG code</p>
                </div>
              </>
            )}
            
            {!isGenerating && !showGeneratedContent && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white text-lg font-medium">Code Generation Complete!</p>
                <p className="text-sunset-200 text-sm mt-2">Rendering your icons...</p>
              </div>
            )}
            
            {/* Animated Code Display */}
            <div className="bg-midnight-800 border border-white/20 rounded-lg p-4 w-full max-w-2xl">
              <div className="flex items-center mb-3">
                <svg className="w-4 h-4 text-sunset-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-sunset-400 text-sm font-medium">
                  {codeAnimationComplete ? 'SVG Code Generated' : 'Generating SVG Code'}
                </span>
                {!codeAnimationComplete && <div className="ml-2 w-2 h-4 bg-sunset-400 animate-pulse"></div>}
                {codeAnimationComplete && (
                  <svg className="ml-2 w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <pre className="text-green-400 text-xs font-mono overflow-hidden min-h-[200px]">
                <code>{animatedCode}</code>
              </pre>
            </div>
          </div>
        ) : generatedImages.length > 0 && showGeneratedContent ? (
          <div className="flex justify-center items-center w-full min-h-96">
            {isImprovementMode && selectedIconUrl ? (
              // Show only the selected icon for improvement
              <div className="flex flex-col items-center space-y-6">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-medium text-white mb-2">Icon to Improve</h4>
                  <p className="text-sunset-200 text-sm">Describe how you'd like to improve this icon</p>
                </div>
                <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/10 border border-white/20 rounded-xl p-8 lg:p-12 hover:bg-white/20 transition-all duration-200 flex flex-col items-center justify-center group">
                  <img
                    src={selectedIconUrl}
                    alt="Icon to improve"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                {/* Action Buttons for Improvement Mode */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShowCode(selectedIconUrl)}
                    className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                    title="View SVG Code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    View Code
                  </button>
                  <div className="[background:linear-gradient(45deg,#111827,theme(colors.midnight.800)_50%,#111827)_padding-box,conic-gradient(from_var(--border-angle),#FF8A65,#CE93D8,#FFF7ED,#FF8A65)_border-box] rounded-lg border-4 border-transparent animate-border shadow-lg shadow-sunset-500/50 hover:shadow-xl hover:shadow-sunset-500/70 transition-all duration-300">
                    <button
                      onClick={() => onSelectImage(selectedIconUrl)}
                      className="bg-transparent text-white py-2 px-4 rounded-lg font-semibold hover:scale-105 transition-all duration-300 block w-full"
                    >
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sunset-200 text-sm">Use the chat panel on the left to describe your improvements</p>
                </div>
              </div>
            ) : (
              // Show all generated icons in grid
              <div className="inline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-white/10 border border-white/20 rounded-xl p-4 lg:p-6 hover:bg-white/20 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center group hover:scale-105"
                  >
                    <img
                      src={image}
                      alt={`Generated icon ${index + 1}`}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                    />
                    
                    {/* Action Buttons Row */}
                    <div className="mt-3 w-full space-y-2">
                      {/* Improvement Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onImproveIcon(image);
                        }}
                        className="w-full bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200"
                      >
                        Improve Icon
                      </button>
                      
                      {/* Download and Code Buttons Row */}
                      <div className="flex gap-2">
                        <div className="flex-1 [background:linear-gradient(45deg,#111827,theme(colors.midnight.800)_50%,#111827)_padding-box,conic-gradient(from_var(--border-angle),#FF8A65,#CE93D8,#FFF7ED,#FF8A65)_border-box] rounded-lg border-4 border-transparent animate-border shadow-lg shadow-sunset-500/50 hover:shadow-xl hover:shadow-sunset-500/70 transition-all duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectImage(image);
                            }}
                            className="w-full bg-transparent text-white py-2 px-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 text-xs"
                          >
                            Download
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowCode(image);
                          }}
                          className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200"
                          title="View SVG Code"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-center space-y-6">
            <div className="w-24 h-24 bg-sunset-500/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-sunset-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Ready to create amazing icons</h3>
              <p className="text-sunset-200">Describe your icon idea in the chat to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {generatedImages.length > 0 && (
        <div 
          data-walkthrough="action-buttons"
          className="p-4 lg:p-6 border-t border-white/10 space-y-3 bg-white/15 backdrop-blur-sm relative z-30"
        >
          {isImprovementMode && onExitImprovementMode && (
            <button
              onClick={onExitImprovementMode}
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 px-4 rounded-lg font-semibold transition-colors border border-blue-500/30 hover:border-blue-500/50"
            >
              ← Back to Original Icons
            </button>
          )}
          {isImprovementMode ? (
            <button
              onClick={() => {
                // TODO: Implement save to library functionality
                console.log('Save to library clicked');
              }}
              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 px-4 rounded-lg font-semibold transition-colors border border-green-500/30 hover:border-green-500/50"
            >
              💾 Save to Library
            </button>
          ) : (
            <button
              onClick={onRegenerate}
              className="w-full bg-sunset-500/20 hover:bg-sunset-500/30 text-sunset-300 py-2 px-4 rounded-lg font-semibold transition-colors border border-sunset-500/30 hover:border-sunset-500/50"
            >
              Generate Different Variations
            </button>
          )}
          <button
            onClick={onReset}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 px-4 rounded-lg font-semibold transition-colors border border-red-500/30 hover:border-red-500/50"
          >
            Start New Icon
          </button>
        </div>
      )}

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-midnight-800 border border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 className="text-lg font-semibold text-white">SVG Code</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-midnight-900 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">SVG Code</span>
                <button
                  onClick={() => navigator.clipboard.writeText(selectedIconCode)}
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1 rounded text-xs font-medium transition-colors border border-purple-500/30"
                >
                  Copy Code
                </button>
              </div>
              <pre className="text-green-400 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                <code>{selectedIconCode}</code>
              </pre>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Copy this SVG code to use your icon in any web project or design tool.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}