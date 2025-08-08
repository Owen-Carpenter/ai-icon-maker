'use client';

import React, { useState } from 'react';
import ScrollAnimation from '../../components/ScrollAnimation';
import Navbar from '../../components/Navbar';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';
import TestimonialCarousel from '../../components/TestimonialCarousel';
import Link from 'next/link';
import SmartGenerateLink from '../../components/SmartGenerateLink';
import Logo from '../../components/ui/Logo';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (planType: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        // If not authenticated, redirect to register
        window.location.href = '/register';
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // Fallback to registration
      window.location.href = '/register';
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Navigation */}
      <Navbar variant="marketing" />

      {/* Hero Section */}
      <div className="w-full h-screen px-4 bg-gradient-radial from-sunset-900 via-midnight-800 to-midnight-900 relative overflow-hidden animate-fade-in flex items-center">
        {/* Gradient overlay for extra depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-sunset-500/10 via-transparent to-coral-500/10 animate-fade-in" style={{animationDelay: '0.3s'}}></div>
        
        {/* Floating Emoji Icons */}
        <div className="absolute top-20 left-10 text-3xl animate-float opacity-20" style={{animationDuration: '6s', animationDelay: '0s'}}>
          🎨
        </div>
        
        <div className="absolute top-32 right-20 text-2xl animate-float opacity-10" style={{animationDuration: '8s', animationDelay: '1s'}}>
          ⭐
        </div>
        
        <div className="absolute top-40 left-1/4 text-4xl animate-float opacity-25" style={{animationDuration: '10s', animationDelay: '2s'}}>
          ✨
        </div>
        
        <div className="absolute bottom-32 left-16 text-2xl animate-float opacity-20" style={{animationDuration: '7s', animationDelay: '3s'}}>
          🚀
        </div>
        
        <div className="absolute bottom-20 right-1/3 text-3xl animate-float opacity-10" style={{animationDuration: '9s', animationDelay: '4s'}}>
          💡
        </div>
        
        <div className="absolute top-1/3 right-10 text-2xl animate-float opacity-20" style={{animationDuration: '11s', animationDelay: '5s'}}>
          🔥
        </div>
        
        <div className="absolute top-1/2 left-8 text-4xl animate-float opacity-25" style={{animationDuration: '12s', animationDelay: '6s'}}>
          🎯
        </div>
        
        <div className="absolute top-16 right-1/4 text-2xl animate-float opacity-10" style={{animationDuration: '13s', animationDelay: '7s'}}>
          🌟
        </div>
        
        <div className="absolute bottom-40 right-16 text-2xl animate-float opacity-20" style={{animationDuration: '14s', animationDelay: '8s'}}>
          🎪
        </div>
        
        <div className="absolute top-2/3 left-1/3 text-3xl animate-float opacity-10" style={{animationDuration: '15s', animationDelay: '9s'}}>
          🎭
        </div>
        <div className="flex flex-col items-center justify-center text-center w-full relative z-10 animate-fade-in" style={{animationDelay: '0.5s'}}>
          <ScrollAnimation>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Make something 
              <span className="inline-flex items-center mx-2">
                <span className="text-3xl lg:text-4xl">🎨</span>
              </span>
              Iconic
            </h1>
          </ScrollAnimation>
          
          <ScrollAnimation delay={300}>
            <p className="text-lg lg:text-xl text-sunset-200 mb-8 max-w-2xl">
              Create stunning icons and designs by chatting with AI
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation delay={600}>
            {/* Main Input Field */}
            <div className="w-full mb-8">
              <div className="relative">
                <textarea
                  id="ai-prompt"
                  className="w-full min-w-[300px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[900px] max-w-[95vw] bg-midnight-800/90 border border-midnight-700 rounded-2xl p-4 sm:p-6 pr-12 sm:pr-16 text-white placeholder-transparent focus:outline-none focus:border-sunset-400 focus:ring-2 focus:ring-sunset-400/20 transition-all duration-300 resize-none text-base sm:text-lg backdrop-blur-sm min-h-[100px] sm:min-h-[120px] max-h-[200px]"
                  rows={4}
                  placeholder=""
                  disabled
                />
                <div 
                  id="typing-placeholder" 
                  className="absolute top-4 left-4 sm:top-6 sm:left-6 text-sunset-300/70 pointer-events-none text-base sm:text-lg"
                >
                  <span id="typed-text"></span>
                  <span id="cursor" className="animate-pulse text-sunset-400">|</span>
                </div>
                
                {/* Interactive Elements at Bottom */}
                <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 flex items-center space-x-2 sm:space-x-4">
                  <button className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-midnight-700/50 hover:bg-midnight-600/50 rounded-full text-sunset-300 hover:text-white transition-all duration-300">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  
                  <button className="flex items-center space-x-1 sm:space-x-2 text-sunset-300 hover:text-white transition-colors duration-300 text-xs sm:text-sm bg-midnight-700/50 hover:bg-midnight-600/50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>Attach</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 sm:space-x-2 text-sunset-300 hover:text-white transition-colors duration-300 text-xs sm:text-sm bg-midnight-700/50 hover:bg-midnight-600/50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Public</span>
                  </button>
                </div>
                
                {/* Send Button */}
                <button className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-sunset-gradient hover:scale-105 text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-sunset-500/30">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={900}>
            {/* CTA Button */}
            <div className="inline-block [background:linear-gradient(45deg,#111827,theme(colors.midnight.800)_50%,#111827)_padding-box,conic-gradient(from_var(--border-angle),#FF8A65,#CE93D8,#FFF7ED,#FF8A65)_border-box] rounded-lg border-4 border-transparent animate-border shadow-lg shadow-sunset-500/50 hover:shadow-xl hover:shadow-sunset-500/70 transition-all duration-300">
              <SmartGenerateLink 
                className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 block"
                fallbackHref="/register"
              >
                Start Creating Icons
              </SmartGenerateLink>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Demo Section */}
      <div className="bg-midnight-900/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation>
          <h2 className="text-4xl font-bold text-white mb-4">See AI Icon Maker in action!</h2>
          </ScrollAnimation>
          <ScrollAnimation delay={200}>
            <p className="text-sunset-200 mb-12">
            Watch how quickly you can generate icons<br />
            like magic.
          </p>
          </ScrollAnimation>
          
          <div className="max-w-4xl mx-auto">
            <ScrollAnimation delay={300}>
              <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-midnight-800 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <div className="bg-coral-gradient rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-white">Demo Video Placeholder</p>
                    <p className="text-white/80 text-sm mt-2">Interactive AI Icon Generation</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <ScrollAnimation>
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Benefits</h2>
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <p className="text-sunset-200 max-w-2xl mx-auto">
              Designed to make AI prompt engineering intuitive, efficient, powerful, and fun for 
              everyone.
            </p>
            </ScrollAnimation>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Visual AI Prompt Builder */}
            <ScrollAnimation delay={300}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#ff7e5f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Icon Generation</h3>
                <p className="text-sunset-200">
                Create stunning icons instantly with 
                advanced AI prompt technology.
              </p>
            </div>
            </ScrollAnimation>

            {/* Quick Preview */}
            <ScrollAnimation delay={400}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#ff7e5f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quick Preview</h3>
                <p className="text-sunset-200">
                Get feedback on completion and likely quality 
                with your prompts.
              </p>
            </div>
            </ScrollAnimation>

            {/* Slack Brand Management */}
            <ScrollAnimation delay={500}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#ff7e5f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Slack Brand Management</h3>
                <p className="text-sunset-200">
                Generate prompts like company-ready 
                with easy icon workflow integration.
              </p>
            </div>
            </ScrollAnimation>

            {/* Multi-Provider Support */}
            <ScrollAnimation delay={600}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#ff7e5f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Multi-Provider Support</h3>
                <p className="text-sunset-200">
                Works with OpenAI, Anthropic, Google, 
                and more with your OpenAI.
              </p>
            </div>
            </ScrollAnimation>

            {/* Save & Share */}
            <ScrollAnimation delay={700}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#ff7e5f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Save & Share</h3>
                <p className="text-sunset-200">
                Save your best prompts and share them 
                with clients easily.
              </p>
            </div>
            </ScrollAnimation>

            {/* AI Model Fine-Tuning */}
            <ScrollAnimation delay={800}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#ff7e5f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Model Fine-Tuning</h3>
                <p className="text-sunset-200">
                Optimize prompts with expert techniques 
                for different AI models.
              </p>
            </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-midnight-900/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <ScrollAnimation>
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            </ScrollAnimation>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <ScrollAnimation delay={200}>
            <div className="text-center">
                <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-midnight-800 hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                  <div className="bg-coral-gradient rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl font-bold text-white">1</span>
                      </div>
                      <p className="text-white text-sm">Step 1</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Enter Your Prompt</h3>
                <p className="text-sunset-200">
                  Describe the icon you want to create in natural language.
                </p>
              </div>
            </ScrollAnimation>

            {/* Step 2 */}
            <ScrollAnimation delay={400}>
            <div className="text-center">
                <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-midnight-800 hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                  <div className="bg-coral-gradient rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <p className="text-white text-sm">Step 2</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Magic Happens</h3>
                <p className="text-sunset-200">
                  Our AI generates multiple high-quality icon variations for you.
                </p>
              </div>
            </ScrollAnimation>

            {/* Step 3 */}
            <ScrollAnimation delay={600}>
            <div className="text-center">
                <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-midnight-800 hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                  <div className="bg-aurora-gradient rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl font-bold text-white">3</span>
                      </div>
                      <p className="text-white text-sm">Step 3</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Download & Use</h3>
                <p className="text-sunset-200">
                  Choose your favorite and download in multiple formats.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation>
            <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-12 border border-midnight-800 hover:shadow-3xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
              <ScrollAnimation delay={200}>
                <h2 className="text-4xl font-bold text-white mb-4">Ready to Create Amazing Icons?</h2>
              </ScrollAnimation>
              <ScrollAnimation delay={400}>
                <p className="text-sunset-200 mb-8 max-w-2xl mx-auto">
                  Join thousands of creators who are already using AI Icon Maker to bring their ideas to life.
                </p>
              </ScrollAnimation>
                              <ScrollAnimation delay={600}>
                {/* Swirling Border Button */}
                <div className="inline-block [background:linear-gradient(45deg,#111827,theme(colors.midnight.800)_50%,#111827)_padding-box,conic-gradient(from_var(--border-angle),#FF8A65,#CE93D8,#FFF7ED,#FF8A65)_border-box] rounded-lg border-4 border-transparent animate-border shadow-lg shadow-sunset-500/50 hover:shadow-xl hover:shadow-sunset-500/70 transition-all duration-300">
                  <SmartGenerateLink 
                    className="bg-transparent text-white px-12 py-4 rounded-lg font-semibold hover:scale-110 transition-all duration-300 block"
                    fallbackHref="/register"
                  >
                    Start Creating Now
                  </SmartGenerateLink>
                </div>
              </ScrollAnimation>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 bg-midnight-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <ScrollAnimation>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Professional AI Icon Generation
              </h2>
            </ScrollAnimation>
            <ScrollAnimation delay={300}>
              <p className="text-xl text-sunset-200 mb-8 max-w-3xl mx-auto">
                High-quality AI-powered SVG icon creation using Claude Sonnet 4.0 and advanced prompt-to-icon technology. Professional tools deserve professional pricing.
            </p>
            </ScrollAnimation>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            
            {/* Pro Plan */}
            <ScrollAnimation delay={400}>
              <div className="bg-gradient-to-br from-sunset-500/20 to-coral-500/20 backdrop-blur-md rounded-2xl p-8 border-2 border-sunset-500/50 shadow-2xl hover:shadow-3xl hover:shadow-sunset-500/30 transition-all duration-500 hover:scale-105 relative">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#ff7e5f] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
                
                <div className="text-center mb-8 mt-4">
                  <h3 className="text-2xl font-bold text-white mb-2">AI Icon Maker Pro</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    $20<span className="text-lg font-normal text-sunset-200">/month</span>
                  </div>
                  <p className="text-sunset-200">Perfect for professionals and small teams</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    200 AI-generated icons per month
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Claude Sonnet 4.0 for SVG generation
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced prompt-to-icon AI
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Scalable SVG outputs (any size)
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority AI processing
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Icon library management
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Commercial usage rights
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Email support
                  </li>
              </ul>
                
                <button 
                  onClick={() => handleCheckout('pro')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-sunset-500 to-coral-500 text-white py-3 px-6 rounded-full font-semibold hover:from-sunset-600 hover:to-coral-600 transition-all duration-300 text-center block shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Start Creating Icons'}
                </button>
              </div>
            </ScrollAnimation>

            {/* Enterprise Plan */}
            <ScrollAnimation delay={600}>
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105 relative">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    $99<span className="text-lg font-normal text-sunset-200">/month</span>
                  </div>
                  <p className="text-sunset-200">For agencies and large organizations</p>
            </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    1,000 AI-generated icons per month
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Claude Sonnet 4.0 + experimental models
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited SVG scaling (any size)
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Team collaboration & sharing
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Brand style consistency tools
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    API access for integrations
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    White-label options
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support & dedicated account manager
                  </li>
                </ul>
                
                <button 
                  onClick={() => handleCheckout('unlimited')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-full font-semibold hover:from-purple-500 hover:to-purple-600 transition-all duration-300 text-center block disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Start Creating Icons'}
                </button>
              </div>
            </ScrollAnimation>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <ScrollAnimation>
                <h3 className="text-3xl font-bold text-white mb-4">Why This Pricing Makes Sense</h3>
              </ScrollAnimation>
              <ScrollAnimation delay={200}>
                <p className="text-sunset-200 max-w-2xl mx-auto">
                  We use cutting-edge AI models to ensure the highest quality SVG icons. Here's what it costs to generate professional icons with leading AI services:
                </p>
              </ScrollAnimation>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollAnimation delay={300}>
                <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center">
                  <h4 className="text-xl font-semibold text-white mb-3">Claude Sonnet 4.0</h4>
                  <p className="text-sunset-200 mb-2">$0.015 per SVG</p>
                  <p className="text-sunset-200 text-sm">Anthropic's latest model for SVG code generation</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={400}>
                <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center">
                  <h4 className="text-xl font-semibold text-white mb-3">AI Icon Generation</h4>
                  <p className="text-sunset-200 mb-2">$0.005 per generation</p>
                  <p className="text-sunset-200 text-sm">Advanced prompt-to-icon conversion</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={500}>
                <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center">
                  <h4 className="text-xl font-semibold text-white mb-3">Premium Infrastructure</h4>
                  <p className="text-sunset-200 mb-2">$0.010 per request</p>
                  <p className="text-sunset-200 text-sm">High-speed processing & optimization</p>
                </div>
              </ScrollAnimation>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <ScrollAnimation>
                <h3 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h3>
              </ScrollAnimation>
              <ScrollAnimation delay={200}>
                <p className="text-sunset-200 max-w-2xl mx-auto">
                  Got questions? We've got answers. Here are some common questions about our pricing and service.
                </p>
              </ScrollAnimation>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScrollAnimation delay={300}>
                <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
                  <h4 className="text-xl font-semibold text-white mb-3">What AI models do you use?</h4>
                  <p className="text-sunset-200">
                    We use Claude Sonnet 4.0 for generating high-quality SVG code and advanced prompt-to-icon technology to convert your descriptions into precise icons. This ensures scalable, professional-grade icons.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={400}>
                <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
                  <h4 className="text-xl font-semibold text-white mb-3">What if I need more icons?</h4>
                  <p className="text-sunset-200">
                    Our Pro plan (200 icons/month) covers most professional needs. For agencies and high-volume users, our Enterprise plan offers 1,000 icons/month plus advanced features.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={500}>
                <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
                  <h4 className="text-xl font-semibold text-white mb-3">Can I cancel anytime?</h4>
                  <p className="text-sunset-200">
                    Yes! You can cancel your subscription at any time. Your access continues until the end of your current billing period.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={600}>
                <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
                  <h4 className="text-xl font-semibold text-white mb-3">Do I own the generated icons?</h4>
                  <p className="text-sunset-200">
                    Yes! All icons generated with AI Icon Maker can be used for commercial purposes without any additional licensing fees.
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center">
            <ScrollAnimation>
              <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-12 border border-midnight-800 hover:shadow-3xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                <ScrollAnimation delay={200}>
                  <h3 className="text-3xl font-bold text-white mb-4">Ready to Create Professional Icons?</h3>
                </ScrollAnimation>
                <ScrollAnimation delay={400}>
                  <p className="text-sunset-200 mb-8 max-w-2xl mx-auto">
                    Join professionals who are already using AI Icon Maker to create stunning icons for their projects.
                  </p>
                </ScrollAnimation>
                <ScrollAnimation delay={600}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => handleCheckout('pro')}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-sunset-500 to-coral-500 text-white px-8 py-3 rounded-full font-semibold hover:from-sunset-600 hover:to-coral-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Start Your Subscription'}
                    </button>
                    <Link 
                      href="#contact" 
                      className="bg-transparent border-2 border-sunset-500 text-sunset-500 px-8 py-3 rounded-full font-semibold hover:bg-sunset-500 hover:text-white transition-all duration-300"
                    >
                      Contact Sales
                    </Link>
                  </div>
                </ScrollAnimation>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <ScrollAnimation>
              <div className="flex justify-center items-center mb-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-sunset-500 to-coral-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">D</div>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">S</div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">M</div>
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">A</div>
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">K</div>
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">L</div>
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">T</div>
                </div>
              </div>
              <p className="text-sunset-200 mb-4">500+ Designers & developers trust AI Icon Maker</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Helping creators streamline their<br />
                workflow and deliver faster
              </h2>
            </ScrollAnimation>
            <ScrollAnimation delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-midnight-800/50 text-sunset-200 px-6 py-3 rounded-full font-medium hover:bg-midnight-700/50 transition-all duration-300 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Join our community</span>
                </button>
                <button className="bg-transparent border border-sunset-500 text-sunset-500 px-6 py-3 rounded-full font-medium hover:bg-sunset-500 hover:text-white transition-all duration-300">
                  Read more reviews
                </button>
              </div>
            </ScrollAnimation>
          </div>
          
          {/* Testimonials Carousel */}
          <TestimonialCarousel />
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact">
        <Contact />
      </div>

      {/* Footer */}
      <Footer />

      {/* Typing Animation & Icon Demo Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const examples = [
                "Ask AI Icon Maker to create an icon for my...",
                "Create a shopping cart icon with modern flat design",
                "Design an AI icon maker logo for a productivity app", 
                "Generate a heart icon with gradient colors",
                "Build a settings gear icon with minimal style",
                "Make a star rating icon with golden color"
              ];
              
              let currentExample = 0;
              let currentChar = 0;
              let isDeleting = false;
              
              function typeWriter() {
                const typedTextElement = document.getElementById('typed-text');
                const cursorElement = document.getElementById('cursor');
                const textareaElement = document.getElementById('ai-prompt');
                
                if (!typedTextElement || !cursorElement || !textareaElement) return;
                
                const currentText = examples[currentExample];
                
                if (isDeleting) {
                  typedTextElement.textContent = currentText.substring(0, currentChar - 1);
                  currentChar--;
                } else {
                  typedTextElement.textContent = currentText.substring(0, currentChar + 1);
                  currentChar++;
                }
                
                let typeSpeed = isDeleting ? 30 : 50;
                
                if (!isDeleting && currentChar === currentText.length) {
                  // Pause for 1 second after completing the sentence, then start deleting
                  setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                  }, 1000);
                  return; // Don't continue with the current cycle
                } else if (isDeleting && currentChar === 0) {
                  isDeleting = false;
                  currentExample = (currentExample + 1) % examples.length;
                  typeSpeed = 500;
                }
                
                // Hide placeholder when user starts typing
                textareaElement.addEventListener('input', function() {
                  const placeholderElement = document.getElementById('typing-placeholder');
                  if (placeholderElement) {
                    placeholderElement.style.display = this.value ? 'none' : 'block';
                  }
                });
                
                // Show placeholder when textarea is empty
                textareaElement.addEventListener('blur', function() {
                  const placeholderElement = document.getElementById('typing-placeholder');
                  if (placeholderElement && !this.value) {
                    placeholderElement.style.display = 'block';
                  }
                });
                
                setTimeout(typeWriter, typeSpeed);
              }
              
              // Simple Icon Generation Demo
              function initIconDemo() {
                const demoStatus = document.getElementById('demo-status');
                if (!demoStatus) return;
                
                const statuses = [
                  'Processing prompt...',
                  'Generating icon...',
                  'Optimizing design...',
                  'Icon ready!'
                ];
                
                let currentStatus = 0;
                
                function updateStatus() {
                  if (demoStatus) {
                    demoStatus.textContent = statuses[currentStatus];
                    currentStatus = (currentStatus + 1) % statuses.length;
                  }
                  
                  setTimeout(updateStatus, 2000);
                }
                
                // Start the demo
                setTimeout(updateStatus, 2000);
              }
              
              // Initialize everything when DOM is ready
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(typeWriter, 1000);
                initIconDemo();
              });
              
              // Also start if DOM is already loaded
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  setTimeout(typeWriter, 1000);
                  initIconDemo();
                });
              } else {
                setTimeout(typeWriter, 1000);
                initIconDemo();
              }
            })();
          `,
        }}
      />
    </div>
  );
} 