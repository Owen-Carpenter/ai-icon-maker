'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Loading from '../../../components/ui/Loading';
import { ToastContainer } from '../../../components/ui/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../hooks/useToast';
import Sidebar from '../../../components/generate/Sidebar';
import ChatPanel from '../../../components/generate/ChatPanel';
import IconDisplayPanel from '../../../components/generate/IconDisplayPanel';

function GeneratePageContent() {
  const { user, hasActiveSubscription, loading, refreshUserData } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { toasts, removeToast, success, error } = useToast();
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isImprovementMode, setIsImprovementMode] = useState(false);
  const [selectedIconUrl, setSelectedIconUrl] = useState<string>('');
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [hasUserTakenAction, setHasUserTakenAction] = useState(true);

  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    const success = searchParams.get('success');
    
    if (success === 'true') {
      setShowSuccess(true);
      // Refresh user data after successful payment
      refreshUserData();
      setTimeout(() => setShowSuccess(false), 8000);
    }
  }, [searchParams, refreshUserData]);

  // Redirect to pricing section if user doesn't have active subscription
  useEffect(() => {
    if (!loading && !hasActiveSubscription) {
      router.replace('/#pricing');
    }
  }, [loading, hasActiveSubscription, router]);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show loading state
  if (loading) {
    return <Loading text="Loading your workspace..." />;
  }

  // Show loading or redirect if no subscription
  if (!hasActiveSubscription) {
    return <Loading text="Redirecting to pricing..." />;
  }

  const handleGenerate = async (prompt: string, style: string, color: string) => {
    if (!prompt.trim()) return;

    setCurrentPrompt(prompt);
    setIsGenerating(true);
    
    try {
      // Call our Claude API to generate icons
      const response = await fetch('/api/generate-icons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: style,
          // Color is now described in the prompt instead of separate parameter
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate icons');
      }

      if (data.success && data.icons?.length > 0) {
        setGeneratedImages(data.icons);
        if (!isImprovementMode) {
          setOriginalImages(data.icons);
          setHasUserTakenAction(false); // Reset action flag for new icons
        }
        success(
          isImprovementMode ? 'Icon Improved!' : 'Icons Generated!', 
          isImprovementMode 
            ? `Successfully improved your icon based on "${prompt}"`
            : `Successfully created ${data.icons.length} unique icons for "${prompt}"`
        );
      } else {
        throw new Error('No icons were generated');
      }
    } catch (err) {
      console.error('Icon generation error:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      // Show error message and fall back to mock data for demo purposes
      const mockImages = [
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QzAwIi8+Cjwvc3ZnPgo=',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjZDMDAiLz4KPC9zdmc+Cg==',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iI0ZGNkMwMCIvPgo8L3N2Zz4K'
      ];
      setGeneratedImages(mockImages);
      if (!isImprovementMode) {
        setOriginalImages(mockImages);
        setHasUserTakenAction(false); // Reset action flag for new icons
      }
      
      error(
        'Generation Failed', 
        `${errorMessage}. Showing demo icons instead. Please check your Claude API configuration.`,
        8000
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateVariations = () => {
    if (generatedImages.length > 0 && currentPrompt) {
      // Regenerate with last used prompt
      handleGenerate(currentPrompt, 'modern', '#000000');
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    // Handle image selection - could save to library
    console.log('Selected image:', imageUrl);
    setHasUserTakenAction(true); // User has taken an action
  };

  const handleImproveIcon = (imageUrl: string) => {
    setSelectedIconUrl(imageUrl);
    setIsImprovementMode(true);
    setCurrentPrompt('');
    setHasUserTakenAction(true); // User has taken an action
    // Store current images as original for comparison
    if (generatedImages.length > 0) {
      setOriginalImages([...generatedImages]);
    }
  };

  const handleExitImprovementMode = () => {
    setIsImprovementMode(false);
    setSelectedIconUrl('');
    setCurrentPrompt('');
    // Restore original images
    if (originalImages.length > 0) {
      setGeneratedImages([...originalImages]);
    }
  };

  const handleReset = () => {
    // Reset state
    setCurrentPrompt('');
    setGeneratedImages([]);
    setIsGenerating(false);
    setIsImprovementMode(false);
    setSelectedIconUrl('');
    setOriginalImages([]);
    setHasUserTakenAction(true); // Reset to allow new chat
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 flex flex-col lg:flex-row">
      {/* Sidebar Navigation - Responsive */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <ToastContainer toasts={toasts} onClose={removeToast} />
        
        {/* Success Message Overlay */}
        {showSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[10000] bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 mx-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-xl">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-semibold">Payment successful! Welcome to AI Icon Generator!</p>
              <p className="text-green-300 text-sm mt-1">Your subscription is now active. Start creating amazing icons below!</p>
            </div>
          </div>
        )}

        {/* Icons Selection Popup */}
        {!hasUserTakenAction && generatedImages.length > 0 && !isGenerating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-midnight-800 border border-white/20 rounded-xl p-4 sm:p-6 lg:p-8 max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-sunset-500 to-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">Your Icons Are Ready!</h3>
                <p className="text-sunset-200 text-sm sm:text-base">Choose what you'd like to do with one of your generated icons:</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-200 flex flex-col items-center"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-lg p-3 sm:p-4 mb-4 flex items-center justify-center">
                      <img
                        src={image}
                        alt={`Generated icon ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="w-full space-y-2">
                      <button
                        onClick={() => {
                          handleImproveIcon(image);
                        }}
                        className="w-full bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200"
                      >
                        Improve This Icon
                      </button>
                      
                      <button
                        onClick={() => {
                          handleSelectImage(image);
                        }}
                        className="w-full bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200"
                      >
                        Download This Icon
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sunset-300 text-sm">
                  Select an action to continue chatting and generating more icons
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Chat Panel */}
          <ChatPanel
            currentPrompt={currentPrompt}
            setCurrentPrompt={setCurrentPrompt}
            isGenerating={isGenerating}
            generatedImages={generatedImages}
            onGenerate={handleGenerate}
            isImprovementMode={isImprovementMode}
            selectedIconUrl={selectedIconUrl}
            onExitImprovementMode={handleExitImprovementMode}
            hasUserTakenAction={hasUserTakenAction}
          />

          {/* Icon Display Panel */}
          <IconDisplayPanel
            generatedImages={generatedImages}
            isGenerating={isGenerating}
            onRegenerate={handleRegenerateVariations}
            onReset={handleReset}
            onSelectImage={handleSelectImage}
            onImproveIcon={handleImproveIcon}
            isImprovementMode={isImprovementMode}
            onExitImprovementMode={handleExitImprovementMode}
            selectedIconUrl={selectedIconUrl}
          />
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<Loading text="Loading your workspace..." />}>
      <GeneratePageContent />
    </Suspense>
  );
} 