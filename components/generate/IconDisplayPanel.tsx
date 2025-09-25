'use client';

import { useState, useEffect, useRef } from 'react';
import { downloadPNGImage, generateFileName } from '../../lib/download-utils';

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
  currentPrompt?: string;
  currentStyle?: string;
  currentColor?: string;
  onStreamingThoughts?: (thoughts: string) => void;
  streamedThoughts?: string;
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
  selectedIconUrl,
  currentPrompt,
  currentStyle,
  currentColor,
  onStreamingThoughts,
  streamedThoughts
}: IconDisplayPanelProps) {
  const [animatedCode, setAnimatedCode] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedIconCode, setSelectedIconCode] = useState('');
  const [codeAnimationComplete, setCodeAnimationComplete] = useState(false);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);
  const [savingIconId, setSavingIconId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [iconToSave, setIconToSave] = useState<string>('');
  const [extractedSvgCodes, setExtractedSvgCodes] = useState<string[]>([]);
  const [dalleThoughts, setDalleThoughts] = useState<string>('');
  const thoughtsContainerRef = useRef<HTMLDivElement>(null);

  // Function to extract SVG code from base64 data URL
  const extractSvgFromDataUrl = (dataUrl: string): string => {
    if (dataUrl.startsWith('data:image/svg+xml;base64,')) {
      try {
        const base64 = dataUrl.split(',')[1];
        const svgCode = atob(base64);
        // Ensure the SVG has proper dimensions for 500x500 canvas
        if (svgCode.includes('viewBox="0 0 24 24"')) {
          return svgCode.replace(
            /<svg([^>]*)>/,
            '<svg width="500" height="500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
          );
        }
        return svgCode;
      } catch (error) {
        console.error('Error decoding SVG from data URL:', error);
        return getFallbackSvgCode();
      }
    }
    return getFallbackSvgCode();
  };

  // Fallback SVG code for demonstration - properly sized for 500x500 canvas
  const getFallbackSvgCode = () => `<svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle to show canvas bounds -->
  <circle cx="250" cy="250" r="240" stroke="#E0E0E0" stroke-width="2" fill="none" opacity="0.3"/>
  
  <!-- Main star icon -->
  <path d="M250 75L268.75 195.83L375 225L268.75 304.17L250 425L231.25 304.17L125 225L231.25 195.83L250 75Z" fill="#FF6C00"/>
  
  <!-- Inner circle -->
  <circle cx="250" cy="250" r="80" stroke="#FF6C00" stroke-width="6" fill="none"/>
  
  <!-- Center square -->
  <rect x="220" y="220" width="60" height="60" rx="8" fill="#FF6C00" opacity="0.7"/>
  
  <!-- Cross lines -->
  <path d="M220 250H280M250 220V280" stroke="white" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Test text to verify SVG download -->
  <text x="250" y="450" text-anchor="middle" fill="#FF6C00" font-family="Arial" font-size="20" font-weight="bold">SVG Download Test</text>
</svg>`;

  // Extract SVG codes when images change - start animation with first icon immediately
  useEffect(() => {
    if (generatedImages.length > 0) {
      const codes = generatedImages.map(extractSvgFromDataUrl);
      setExtractedSvgCodes(codes);
      
      // If we're generating and this is the first real SVG code, start animation immediately
      if (isGenerating && codes.length > 0 && animatedCode === '') {
        let currentIndex = 0;
        const realCode = codes[0]; // Use the first actual SVG code
        
        const interval = setInterval(() => {
          if (currentIndex <= realCode.length) {
            setAnimatedCode(realCode.slice(0, currentIndex));
            currentIndex += Math.random() > 0.5 ? 3 : 2; // Faster typing speed
          } else {
            clearInterval(interval);
            setCodeAnimationComplete(true);
            // Show "Code Complete" message for a moment, then show icons
            setTimeout(() => {
              setShowGeneratedContent(true);
            }, 500);
          }
        }, 25);
      }
    } else {
      setExtractedSvgCodes([]);
    }
  }, [generatedImages, isGenerating, animatedCode]);

  // Function to save icon to library
  const handleSaveToLibrary = async (imageUrl: string, iconName: string) => {
    setSavingIconId(imageUrl);
    
    try {
      // Find the SVG code for this specific image
      const imageIndex = generatedImages.indexOf(imageUrl);
      const svgCode = imageIndex >= 0 && extractedSvgCodes[imageIndex] 
        ? extractedSvgCodes[imageIndex] 
        : getFallbackSvgCode();

      const response = await fetch('/api/icons/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: iconName,
          svg_code: svgCode,
          prompt: currentPrompt,
          style: currentStyle,
          color: currentColor,
          image_url: imageUrl,
          format: 'SVG',
          tags: currentPrompt ? [currentPrompt.split(' ')[0]] : []
        }),
      });

      if (response.ok) {
        // Redirect to library page
        window.location.href = '/library';
      } else {
        throw new Error('Failed to save icon');
      }
    } catch (error) {
      console.error('Error saving icon:', error);
      alert('Failed to save icon to library. Please try again.');
    } finally {
      setSavingIconId(null);
      setShowSaveModal(false);
    }
  };

  const openSaveModal = (imageUrl: string) => {
    setIconToSave(imageUrl);
    setShowSaveModal(true);
  };

  // Handle downloading the PNG icon
  const handleDownload = async (imageUrl: string, iconName?: string) => {
    try {
      // Generate filename based on prompt or generic name
      const baseName = iconName || currentPrompt || 'generated-icon';
      
      // Download the actual PNG image that was generated
      await downloadPNGImage(imageUrl, baseName);
      
      // Call the original onSelectImage callback for any additional functionality
      onSelectImage(imageUrl);
    } catch (error) {
      console.error('Error downloading PNG icon:', error);
      alert('Failed to download PNG icon. Please try again.');
    }
  };

  // Reset animation state when generation starts or stops
  useEffect(() => {
    if (isGenerating) {
      setCodeAnimationComplete(false);
      setShowGeneratedContent(false);
      setAnimatedCode(''); // Reset animated code
      setDalleThoughts(''); // Reset GPT Image 1 thoughts
    } else {
      setAnimatedCode('');
      setCodeAnimationComplete(false);
      setShowGeneratedContent(false);
      setDalleThoughts('');
    }
  }, [isGenerating]);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (thoughtsContainerRef.current && streamedThoughts) {
      const container = thoughtsContainerRef.current;
      
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const maxScroll = Math.max(0, scrollHeight - clientHeight);
        
        
        // Always scroll to bottom when new content arrives
        container.scrollTop = maxScroll;
      });
    }
  }, [streamedThoughts]);

  // Also scroll when isGenerating changes to ensure we're at bottom
  useEffect(() => {
    if (thoughtsContainerRef.current && isGenerating) {
      const container = thoughtsContainerRef.current;
      
      requestAnimationFrame(() => {
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const maxScroll = Math.max(0, scrollHeight - clientHeight);
        
        
        container.scrollTop = maxScroll;
      });
    }
  }, [isGenerating]);

  // Force scroll to bottom periodically during generation
  useEffect(() => {
    if (isGenerating && streamedThoughts) {
      const interval = setInterval(() => {
        if (thoughtsContainerRef.current) {
          const container = thoughtsContainerRef.current;
          const scrollHeight = container.scrollHeight;
          const clientHeight = container.clientHeight;
          const maxScroll = Math.max(0, scrollHeight - clientHeight);
          const currentScroll = container.scrollTop;
          
          // Only scroll if we're not already at the bottom
          if (maxScroll > 0 && currentScroll < maxScroll - 10) { // 10px buffer
            
            container.scrollTop = maxScroll;
          }
        }
      }, 50); // Check every 50ms for more responsive scrolling
      
      return () => clearInterval(interval);
    }
  }, [isGenerating, streamedThoughts]);

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
    // Find the SVG code for this specific image
    const imageIndex = generatedImages.indexOf(imageUrl);
    const svgCode = imageIndex >= 0 && extractedSvgCodes[imageIndex] 
      ? extractedSvgCodes[imageIndex] 
      : getFallbackSvgCode();
    
    setSelectedIconCode(svgCode);
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
      <div className="flex-1 p-4 lg:p-8 lg:min-h-0 relative z-10">
        {isGenerating || (!showGeneratedContent && generatedImages.length > 0) ? (
          <div className="flex flex-col items-center justify-center min-h-96 space-y-6 py-8">
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
                  <p className="text-sunset-200 text-sm mt-2">GPT Image 1 is generating images</p>
                  <p className="text-sunset-300/80 text-xs mt-1">This can take up to a minute</p>
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
            
            {/* GPT Image 1's Thoughts Display */}
            <div className="bg-midnight-800 border border-white/20 rounded-lg p-6 w-full max-w-2xl mt-4">
              <div className="flex items-center mb-4">
                <svg className="w-4 h-4 text-sunset-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-sunset-400 text-sm font-medium">
                  {streamedThoughts ? 'GPT Image 1 is thinking...' : 'Waiting for GPT Image 1\'s thoughts...'}
                </span>
                {isGenerating && <div className="ml-2 w-2 h-4 bg-sunset-400 animate-pulse"></div>}
                {!isGenerating && streamedThoughts && (
                  <svg className="ml-2 w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div 
                ref={thoughtsContainerRef}
                className="h-[300px] overflow-y-auto scrollbar-none relative"
                style={{
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // IE/Edge
                }}
              >
                <div className="text-sunset-300 text-sm font-normal leading-relaxed whitespace-pre-wrap p-4">
                  {streamedThoughts || (isGenerating ? '🎨 GPT Image 1 is analyzing your request...\n📝 Generating detailed design reasoning...\n🔍 Preparing professional icon concepts...\n⚡ Processing with AI...' : '')}
                  {streamedThoughts && isGenerating && (
                    <span className="inline-block w-2 h-4 bg-sunset-400 animate-pulse ml-1"></span>
                  )}
                </div>
                {/* Fade gradient at top to create smooth transition */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-midnight-800 via-midnight-800/80 to-transparent pointer-events-none z-10"></div>
                {/* Scroll hint at bottom */}
                {streamedThoughts && streamedThoughts.length > 500 && (
                  <div className="absolute bottom-2 right-2 text-xs text-sunset-400/60 pointer-events-none z-10">
                    ↑ scroll to see more
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : generatedImages.length > 0 && showGeneratedContent ? (
          <div className="flex justify-center items-center w-full min-h-96">
            {isImprovementMode && selectedIconUrl ? (
              // Show the improved icon if available, otherwise show the original icon to improve
              <div className="flex flex-col items-center space-y-6">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-medium text-white mb-2">
                    {generatedImages.length > 0 ? "Improved Icon" : "Icon to Improve"}
                  </h4>
                  <p className="text-sunset-200 text-sm">
                    {generatedImages.length > 0 
                      ? "Here's your improved icon!" 
                      : "Describe how you'd like to improve this icon"
                    }
                  </p>
                </div>
                <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/10 border border-white/20 rounded-xl p-8 lg:p-12 hover:bg-white/20 transition-all duration-200 flex flex-col items-center justify-center group">
                  <img
                    src={generatedImages.length > 0 ? generatedImages[0] : selectedIconUrl}
                    alt={generatedImages.length > 0 ? "Improved icon" : "Icon to improve"}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                {/* Action Buttons for Improvement Mode */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShowCode(generatedImages.length > 0 ? generatedImages[0] : selectedIconUrl)}
                    className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                    title="View SVG Code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    View Code
                  </button>
                  <button 
                    onClick={() => handleDownload(generatedImages.length > 0 ? generatedImages[0] : selectedIconUrl)}
                    className="[background:linear-gradient(45deg,#111827,theme(colors.midnight.800)_50%,#111827)_padding-box,conic-gradient(from_var(--border-angle),#FF8A65,#CE93D8,#FFF7ED,#FF8A65)_border-box] rounded-lg border-4 border-transparent animate-border shadow-lg shadow-sunset-500/50 hover:shadow-xl hover:shadow-sunset-500/70 transition-all duration-300 bg-transparent text-white py-2 px-4 font-semibold hover:scale-105 w-full flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PNG
                  </button>
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
                    className="aspect-square bg-white/10 border border-white/20 rounded-xl p-4 lg:p-6 hover:bg-white/20 transition-all duration-200 flex flex-col items-center justify-center hover:scale-105 relative"
                  >

                    
                    <div 
                      onClick={() => onImproveIcon(image)}
                      className="w-full h-full cursor-pointer flex items-center justify-center"
                    >
                      <img
                        src={image}
                        alt={`Generated icon ${index + 1}`}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    
                    {/* Simplified Action Buttons - Only essential actions */}
                    <div className="mt-3 w-full flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openSaveModal(image);
                        }}
                        disabled={savingIconId === image}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 px-3 rounded-lg text-xs font-medium transition-colors border border-green-500/30 hover:border-green-500/50 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Save to Library"
                      >
                        {savingIconId === image ? (
                          <div className="w-3 h-3 border border-green-300 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        )}
                        Save
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image);
                        }}
                        className="flex-1 [background:linear-gradient(45deg,#111827,theme(colors.midnight.800)_50%,#111827)_padding-box,conic-gradient(from_var(--border-angle),#FF8A65,#CE93D8,#FFF7ED,#FF8A65)_border-box] rounded-lg border-4 border-transparent animate-border shadow-lg shadow-sunset-500/50 hover:shadow-xl hover:shadow-sunset-500/70 transition-all duration-300 bg-transparent text-white py-2 px-3 font-semibold hover:scale-105 text-xs flex items-center justify-center gap-1"
                        title="Download PNG"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        PNG
                      </button>
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
                const iconToSave = generatedImages.length > 0 ? generatedImages[0] : selectedIconUrl;
                iconToSave && openSaveModal(iconToSave);
              }}
              disabled={savingIconId === (generatedImages.length > 0 ? generatedImages[0] : selectedIconUrl)}
              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 px-4 rounded-lg font-semibold transition-colors border border-green-500/30 hover:border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {savingIconId === (generatedImages.length > 0 ? generatedImages[0] : selectedIconUrl) ? (
                <>
                  <div className="w-4 h-4 border border-green-300 border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  💾 Save to Library
                </>
              )}
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
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 px-4 rounded-lg font-semibold transition-colors border border-red-500/30 hover:border-red-500/50 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
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

      {/* Save to Library Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-midnight-800 to-midnight-900 rounded-2xl border border-white/20 p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Save to Library</h3>
            <p className="text-gray-300 mb-4">Give your icon a name to save it to your library.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const iconName = formData.get('iconName') as string;
              if (iconName.trim()) {
                handleSaveToLibrary(iconToSave, iconName.trim());
              }
            }}>
              <input
                type="text"
                name="iconName"
                placeholder="Enter icon name..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent mb-4"
                autoFocus
                required
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingIconId !== null}
                  className="flex-1 px-4 py-2 bg-sunset-500 hover:bg-sunset-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingIconId ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}