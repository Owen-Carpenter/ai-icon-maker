'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import AIChatInterface from '../../../components/generate/AIChatInterface';
import IconVisualization from '../../../components/generate/IconVisualization';
import Loading from '../../../components/ui/Loading';
import { useAuth } from '../../../contexts/AuthContext';

function GeneratePageContent() {
  const { user, hasActiveSubscription, loading, refreshUserData } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatInterfaceRef = useRef<{ reset: () => void }>(null);
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
    
    // Log the generation request (in real app, this would be sent to AI API)
    console.log('Generating icon:', { 
      prompt: prompt, 
      style: style,
      primaryColor: color,
      mode: 'prompt-only'
    });
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock generated images - in real app, these would come from AI API
      const mockImages = [
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QzAwIi8+Cjwvc3ZnPgo=',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjZDMDAiLz4KPC9zdmc+Cg==',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iI0ZGNkMwMCIvPgo8L3N2Zz4K'
      ];
      
      setGeneratedImages(mockImages);
      setIsGenerating(false);
    }, 3000);
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
    // Reset chat interface
    if (chatInterfaceRef.current) {
      chatInterfaceRef.current.reset();
    }
    // Reset visualization state
    setCurrentPrompt('');
    setGeneratedImages([]);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-dark-gradient overflow-x-hidden">
      <Navbar variant="app" />
      
      {/* Hero-style gradient background */}
      <div className="w-full min-h-screen px-4 py-8 pt-32 bg-gradient-radial from-sunset-900 via-midnight-800 to-midnight-900 relative overflow-hidden">
        {/* Gradient overlay for extra depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-sunset-500/10 via-transparent to-coral-500/10"></div>
        
        <div className="container mx-auto relative z-10 h-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">AI Icon Generator</h1>
          <p className="text-sunset-200 text-sm lg:text-base">Create amazing icons with AI-powered text-to-icon generation</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center max-w-4xl mx-auto gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-semibold text-sm lg:text-base">Payment successful! Welcome to AI Icon Generator!</p>
              <p className="text-green-300 text-xs lg:text-sm mt-1">Your subscription is now active. Start creating amazing icons below!</p>
            </div>
          </div>
        )}

        {/* Main Interface - Base44 Style Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-7xl mx-auto min-h-[600px] lg:h-[600px]">
          {/* AI Chat Interface - Left Side */}
          <div className="h-full min-h-[400px] lg:min-h-0">
            <AIChatInterface
              ref={chatInterfaceRef}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              currentPrompt={currentPrompt}
            />
          </div>

          {/* Icon Visualization - Right Side */}
          <div className="h-full min-h-[400px] lg:min-h-0">
            <IconVisualization
              generatedImages={generatedImages}
              isGenerating={isGenerating}
              onRegenerate={handleRegenerateVariations}
              onGenerateNew={handleReset}
              onSelectImage={handleSelectImage}
              currentPrompt={currentPrompt}
            />
          </div>
        </div>
        </div>
      </div>
      
      <Footer />
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