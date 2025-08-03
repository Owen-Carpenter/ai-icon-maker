'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import PromptInput from '../../../components/generate/PromptInput';
import GenerationPanel from '../../../components/generate/GenerationPanel';
import Loading from '../../../components/ui/Loading';
import { useAuth } from '../../../contexts/AuthContext';

function GeneratePageContent() {
  const { user, hasActiveSubscription, loading, refreshUserData } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [primaryColor, setPrimaryColor] = useState('#000000');
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

  const handleGenerate = async () => {
    const hasPrompt = prompt.trim() && style;

    // Must have prompt
    if (!hasPrompt) return;

    setIsGenerating(true);
    
    // Log the generation request (in real app, this would be sent to AI API)
    console.log('Generating icon:', { 
      prompt: prompt, 
      style: style,
      primaryColor: primaryColor,
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
    if (generatedImages.length > 0) {
      // Regenerate with last used prompt
      handleGenerate();
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    // Handle image selection - could save to library
    console.log('Selected image:', imageUrl);
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar variant="app" />
      
      <div className="container mx-auto px-4 py-8 pt-32">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">AI Icon Generator</h1>
          <p className="text-sunset-200">Create amazing icons with AI-powered text-to-icon generation</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex items-center max-w-4xl mx-auto">
            <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-semibold">Payment successful! Welcome to AI Icon Generator!</p>
              <p className="text-green-300 text-sm mt-1">Your subscription is now active. Start creating amazing icons below!</p>
            </div>
          </div>
        )}

        {/* Main Interface - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* PromptInput - Left Column */}
          <div className="lg:col-span-1">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              style={style}
              setStyle={setStyle}
              primaryColor={primaryColor}
              setPrimaryColor={setPrimaryColor}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Generation Panel - Right Column */}
          <div className="lg:col-span-2">
            <GenerationPanel
              generatedImages={generatedImages}
              isGenerating={isGenerating}
              onRegenerateVariations={handleRegenerateVariations}
              onSelectImage={handleSelectImage}
              currentPrompt={prompt}
            />
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