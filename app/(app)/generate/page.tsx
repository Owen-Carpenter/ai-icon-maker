'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Navbar from '../../../components/Navbar';


import Loading from '../../../components/ui/Loading';
import { ToastContainer } from '../../../components/ui/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../hooks/useToast';

function GeneratePageContent() {
  const { user, hasActiveSubscription, loading, refreshUserData } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { toasts, removeToast, success, error } = useToast();
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

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
          primaryColor: color,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate icons');
      }

      if (data.success && data.icons?.length > 0) {
        setGeneratedImages(data.icons);
        success('Icons Generated!', `Successfully created ${data.icons.length} unique icons for "${prompt}"`);
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
  };

  const handleReset = () => {
    // Reset state
    setCurrentPrompt('');
    setGeneratedImages([]);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 flex flex-col">
      <Navbar variant="app" />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mx-4 mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-green-400 font-semibold">Payment successful! Welcome to AI Icon Generator!</p>
            <p className="text-green-300 text-sm mt-1">Your subscription is now active. Start creating amazing icons below!</p>
          </div>
        </div>
      )}

      {/* Main Chat Interface - Full Screen Like Lovable/Bolt */}
      <div className="flex-1 flex flex-col min-h-0 pt-20">
        <div className="flex-1 flex max-w-full">
          
          {/* Chat Panel - Left Side (Smaller) */}
          <div className="w-96 bg-white/5 backdrop-blur-sm flex flex-col border-r border-white/10">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-sunset-500 to-coral-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                  <p className="text-sunset-200 text-sm">Claude Sonnet 4.0</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                  <p className="text-white text-sm leading-relaxed">
                    Hi! Describe the icon you'd like me to create, and I'll generate multiple variations for you.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <button 
                      onClick={() => setCurrentPrompt('shopping cart icon')}
                      className="text-xs px-2 py-1 bg-sunset-500/20 text-sunset-300 rounded-full hover:bg-sunset-500/30 transition-colors"
                    >
                      Shopping cart
                    </button>
                    <button 
                      onClick={() => setCurrentPrompt('settings gear icon')}
                      className="text-xs px-2 py-1 bg-sunset-500/20 text-sunset-300 rounded-full hover:bg-sunset-500/30 transition-colors"
                    >
                      Settings
                    </button>
                    <button 
                      onClick={() => setCurrentPrompt('user profile icon')}
                      className="text-xs px-2 py-1 bg-sunset-500/20 text-sunset-300 rounded-full hover:bg-sunset-500/30 transition-colors"
                    >
                      User profile
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Generated Messages */}
              {currentPrompt && (
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-sunset-500 to-coral-500 rounded-lg p-3">
                    <p className="text-white text-sm">{currentPrompt}</p>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                    <p className="text-white text-sm">Creating variations...</p>
                    <div className="mt-2 flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-sunset-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-sunset-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1.5 h-1.5 bg-sunset-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {generatedImages.length > 0 && !isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                    <p className="text-white text-sm">✨ Generated {generatedImages.length} icons! Check them out →</p>
                    <p className="text-sunset-200 text-xs mt-1">Want different variations?</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (currentPrompt.trim()) {
                  handleGenerate(currentPrompt, 'modern', '#FF6C00');
                }
              }} className="space-y-3">
                
                {/* Style Controls */}
                <div className="flex gap-2">
                  <select 
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-2 text-white text-xs"
                    defaultValue="modern"
                  >
                    <option value="modern">Modern</option>
                    <option value="flat">Flat</option>
                    <option value="line-art">Line Art</option>
                    <option value="3d">3D</option>
                  </select>
                  <input
                    type="color"
                    defaultValue="#FF6C00"
                    className="w-10 h-9 rounded-lg border border-white/20 bg-white/10 cursor-pointer"
                  />
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentPrompt}
                    onChange={(e) => setCurrentPrompt(e.target.value)}
                    placeholder="Describe your icon idea..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-sunset-300 focus:outline-none focus:border-sunset-500 transition-colors"
                    disabled={isGenerating}
                  />
                  <button
                    type="submit"
                    disabled={!currentPrompt.trim() || isGenerating}
                    className="bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Panel - Right Side (Larger) */}
          <div className="flex-1 bg-white/5 backdrop-blur-sm flex flex-col">
            {/* Results Header */}
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Generated Icons</h3>
              <p className="text-sunset-200 text-sm">Click any icon to download</p>
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
                <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {generatedImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectImage(image)}
                      className="aspect-square bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 cursor-pointer transition-all duration-200 flex items-center justify-center group hover:scale-105"
                    >
                      <img
                        src={image}
                        alt={`Generated icon ${index + 1}`}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                  ))}
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
                <button
                  onClick={handleRegenerateVariations}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-medium transition-colors border border-white/20"
                >
                  Generate More Variations
                </button>
                <button
                  onClick={handleReset}
                  className="w-full bg-sunset-500/20 hover:bg-sunset-500/30 text-sunset-300 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Start New Icon
                </button>
              </div>
            )}
          </div>

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