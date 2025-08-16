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
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
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

        {/* Main Interface */}
        <div className="flex-1 flex">
          {/* Chat Panel */}
          <ChatPanel
            currentPrompt={currentPrompt}
            setCurrentPrompt={setCurrentPrompt}
            isGenerating={isGenerating}
            generatedImages={generatedImages}
            onGenerate={handleGenerate}
          />

          {/* Icon Display Panel */}
          <IconDisplayPanel
            generatedImages={generatedImages}
            isGenerating={isGenerating}
            onRegenerate={handleRegenerateVariations}
            onReset={handleReset}
            onSelectImage={handleSelectImage}
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