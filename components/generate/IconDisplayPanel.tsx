'use client';

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

  return (
    <div className="flex-1 bg-white/5 backdrop-blur-sm flex flex-col">
      {/* Results Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Generated Icons</h3>
        <p className="text-sunset-200 text-sm">Click any icon to improve it, or right-click to download</p>
      </div>

      {/* Results Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <div className="w-24 h-24 border-4 border-sunset-500/30 border-t-sunset-500 rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-white text-lg font-medium">Generating your icons...</p>
              <p className="text-sunset-200 text-sm mt-2">This may take a few moments</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 w-full max-w-md">
              <div className="space-y-3">
                <div className="h-3 bg-sunset-500/30 rounded animate-pulse"></div>
                <div className="h-3 bg-sunset-500/20 rounded animate-pulse"></div>
                <div className="h-3 bg-sunset-500/10 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : generatedImages.length > 0 ? (
          <div className="flex justify-center items-center w-full">
            {isImprovementMode && selectedIconUrl ? (
              // Show only the selected icon for improvement
              <div className="flex flex-col items-center space-y-6">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-medium text-white mb-2">Icon to Improve</h4>
                  <p className="text-sunset-200 text-sm">Describe how you'd like to improve this icon</p>
                </div>
                <div className="w-80 h-80 bg-white/10 border border-white/20 rounded-xl p-12 hover:bg-white/20 transition-all duration-200 flex flex-col items-center justify-center group">
                  <img
                    src={selectedIconUrl}
                    alt="Icon to improve"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sunset-200 text-sm">Use the chat panel on the left to describe your improvements</p>
                </div>
              </div>
            ) : (
              // Show all generated icons in grid
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center group hover:scale-105"
                  >
                    <img
                      src={image}
                      alt={`Generated icon ${index + 1}`}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                    />
                    
                    {/* Improvement Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onImproveIcon(image);
                      }}
                      className="mt-3 w-full bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                    >
                      Improve Icon
                    </button>
                    
                    {/* Download Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectImage(image);
                      }}
                      className="mt-2 w-full bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                    >
                      Download
                    </button>
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
        <div className="p-6 border-t border-white/10 space-y-3">
          {isImprovementMode && onExitImprovementMode && (
            <button
              onClick={onExitImprovementMode}
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 px-4 rounded-lg font-medium transition-colors border border-blue-500/30"
            >
              ← Back to Original Icons
            </button>
          )}
          <button
            onClick={onRegenerate}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-medium transition-colors border border-white/20"
          >
            {isImprovementMode ? 'Generate More Improvements' : 'Generate More Variations'}
          </button>
          <button
            onClick={onReset}
            className="w-full bg-sunset-500/20 hover:bg-sunset-500/30 text-sunset-300 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Start New Icon
          </button>
        </div>
      )}
    </div>
  );
}