'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import ChatPanel from '../../../components/generate/ChatPanel';
import IconDisplayPanel from '../../../components/generate/IconDisplayPanel';
import Sidebar from '../../../components/generate/Sidebar';
import Loading from '../../../components/ui/Loading';
import { useToast } from '../../../hooks/useToast';
import { ToastContainer } from '../../../components/ui/Toast';
import Walkthrough, { useWalkthrough } from '../../../components/Walkthrough';
import { generatePageSteps } from '../../../lib/walkthrough-steps';
import SubscriptionGate from '../../../components/SubscriptionGate';

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
  const [showHeroView, setShowHeroView] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [style, setStyle] = useState('modern');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Walkthrough state
  const { isActive: isWalkthroughActive, startWalkthrough, completeWalkthrough, skipWalkthrough } = useWalkthrough();

  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    const success = searchParams.get('success');
    
    if (success === 'true') {
      setShowSuccess(true);
      // Refresh user data after successful payment
      refreshUserData();
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
    }
  }, [searchParams, refreshUserData]);

  // Handle payment success processing
  useEffect(() => {
    const success = searchParams.get('success');
    
    if (success === 'true' && !loading) {
      // User just completed payment, show processing state
      setIsProcessingPayment(true);
      
      // Give webhook time to process, then refresh user data
      const timeoutId = setTimeout(() => {
        refreshUserData().then(() => {
          setIsProcessingPayment(false);
        });
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchParams, loading, refreshUserData]);

  // Note: Removed automatic redirect to pricing - let SubscriptionGate handle access control

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show loading state
  if (loading) {
    return <Loading text="Loading your workspace..." />;
  }

  // Show payment processing state
  if (isProcessingPayment) {
    return <Loading text="Processing your payment... Please wait." />;
  }

  // Temporary: Log subscription status for debugging
  console.log('Generate page - hasActiveSubscription:', hasActiveSubscription, 'loading:', loading);
  
  // Show subscription gate if user doesn't have active subscription
  if (!hasActiveSubscription) {
    return (
      <SubscriptionGate 
        title="Premium Workspace Required"
        description="Upgrade to start generating amazing AI icons with our advanced tools."
      />
    );
  }

  const handleGenerate = async (prompt: string, style: string, color: string) => {
    if (!prompt.trim()) return;

    setCurrentPrompt(prompt);
    setIsGenerating(true);
    
    // Seamless transition from hero view to main interface
    if (showHeroView) {
      setIsTransitioning(true);
      // Small delay to start transition, then switch views
      setTimeout(() => {
        setShowHeroView(false);
      }, 50);
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    }
    
    try {
      // TEMPORARY: Skip API call to demo the code animation while Claude is being set up
      // Simulate code generation time (4 seconds to see the full animation)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Use mock data for demonstration
      const mockImages = [
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QzAwIi8+Cjwvc3ZnPgo=',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjZDMDAiLz4KPC9zdmc+Cg==',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iI0ZGNkMwMCIvPgo8L3N2Zz4K'
      ];
      setGeneratedImages(mockImages);
      if (!isImprovementMode) {
        setOriginalImages(mockImages);
        setHasUserTakenAction(true); // Allow continued interaction
      }
      
      success(
        isImprovementMode ? 'Icon Improved!' : 'Icons Generated!', 
        isImprovementMode 
          ? `Successfully improved your icon based on "${prompt}"`
          : `Successfully created ${mockImages.length} unique icons for "${prompt}" (Demo Mode)`
      );

      /* REAL API CALL - Uncomment when Claude is set up:
      
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
      
      */
      
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
        setHasUserTakenAction(true); // Allow continued interaction
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
    setHasUserTakenAction(true);
    success('Icon Downloaded!', 'Icon saved to your downloads folder');
  };

  const handleImproveIcon = (imageUrl: string) => {
    setSelectedIconUrl(imageUrl);
    setIsImprovementMode(true);
    setHasUserTakenAction(true);
    console.log('Improving icon:', imageUrl);
  };

  const handleExitImprovementMode = () => {
    setIsImprovementMode(false);
    setSelectedIconUrl('');
    setGeneratedImages(originalImages); // Restore original images
  };

  // Handle walkthrough trigger from sidebar
  const handleStartWalkthrough = () => {
    // If we're in hero view, transition to main interface first
    if (showHeroView) {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowHeroView(false);
      }, 50);
      setTimeout(() => {
        setIsTransitioning(false);
        // Start walkthrough after transition completes
        setTimeout(() => {
          startWalkthrough();
        }, 500);
      }, 800);
    } else {
      startWalkthrough();
    }
  };

  const handleReset = () => {
    // Start transition animation back to hero view
    setIsTransitioning(true);
    setTimeout(() => {
      // Reset state
      setCurrentPrompt('');
      setGeneratedImages([]);
      setIsGenerating(false);
      setIsImprovementMode(false);
      setSelectedIconUrl('');
      setOriginalImages([]);
      setHasUserTakenAction(true); // Reset to allow new chat
      setShowHeroView(true); // Go back to hero view
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Reset transition state after animation
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Sidebar Navigation - Responsive */}
              <Sidebar currentPage="generate" onStartWalkthrough={handleStartWalkthrough} />

      {/* Main Content Area with Seamless Transition */}
      <div className="flex-1 relative overflow-hidden">
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

        {/* Hero View Overlay - Seamlessly transitions out */}
        {showHeroView && (
          <div className={`absolute inset-0 bg-gradient-radial from-sunset-900 via-midnight-800 to-midnight-900 flex items-center justify-center px-4 z-30 transition-all duration-1000 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
          }`}>
            {/* Gradient overlay for extra depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-sunset-500/10 via-transparent to-coral-500/10"></div>
            
            {/* Centered Hero Content */}
            <div className="w-full max-w-4xl text-center relative z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Make something 
                <span className="inline-flex items-center mx-1 sm:mx-2">
                  <span className="text-2xl sm:text-3xl lg:text-4xl">🎨</span>
                </span>
                <span className="bg-gradient-to-r from-sunset-500 to-coral-500 bg-clip-text text-transparent">Iconic</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-sunset-200 mb-8 max-w-2xl mx-auto px-4">
                Create stunning icons and designs by chatting with AI
              </p>
              
              {/* Main Input Field */}
              <div className="w-full mb-8">
                <div className="relative">
                  <textarea
                    value={currentPrompt}
                    onChange={(e) => setCurrentPrompt(e.target.value)}
                    className="w-full min-w-[300px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[900px] max-w-[95vw] bg-midnight-800/90 border border-midnight-700 rounded-2xl p-4 sm:p-6 pr-12 sm:pr-16 text-white placeholder-sunset-300/70 focus:outline-none focus:border-sunset-400 focus:ring-2 focus:ring-sunset-400/20 transition-all duration-300 resize-none text-base sm:text-lg backdrop-blur-sm min-h-[100px] sm:min-h-[120px] max-h-[200px]"
                    rows={4}
                    placeholder="Describe your icon idea..."
                  />
                  
                  {/* Style Controls at Bottom */}
                  <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 flex items-center space-x-2 sm:space-x-4">
                    <select 
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="bg-midnight-700/50 hover:bg-midnight-600/50 text-sunset-300 hover:text-white transition-all duration-300 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border-none focus:outline-none [&>option]:bg-midnight-800 [&>option]:text-white"
                    >
                      <option value="modern">Modern</option>
                      <option value="flat">Flat</option>
                      <option value="line-art">Line Art</option>
                      <option value="3d">3D</option>
                      <option value="vintage">Vintage</option>
                      <option value="neon">Neon</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="hand-drawn">Hand Drawn</option>
                    </select>
                  </div>
                  
                  {/* Send Button */}
                  <button 
                    onClick={() => handleGenerate(currentPrompt, style, '#FF6C00')}
                    disabled={!currentPrompt.trim() || isGenerating}
                    className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 disabled:opacity-50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-sunset-500/30 hover:scale-105"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Interface - Seamlessly transitions in */}
        <div className={`flex flex-col lg:flex-row h-full min-h-0 lg:ml-16 transition-all duration-1000 ease-in-out ${
          showHeroView ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
        }`}>
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

      {/* Walkthrough Component */}
      <Walkthrough
        steps={generatePageSteps}
        isActive={isWalkthroughActive}
        onComplete={completeWalkthrough}
        onSkip={skipWalkthrough}
      />
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