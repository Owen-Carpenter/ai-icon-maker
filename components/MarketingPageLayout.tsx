'use client';

import React, { useState, useEffect, useRef } from 'react';
import ScrollAnimation from './ScrollAnimation';
import Navbar from './Navbar';
import Footer from './Footer';
import TestimonialCarousel from './TestimonialCarousel';
import SmartGenerateLink from './SmartGenerateLink';
import { useAuth } from '../contexts/AuthContext';
import { getPlanPriority } from '../lib/subscription-plans';

interface MarketingPageLayoutProps {
  h1Title: string;
  h2Subtitle: string;
}

export default function MarketingPageLayout({ h1Title, h2Subtitle }: MarketingPageLayoutProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const contactFormRef = useRef<HTMLFormElement>(null);
  const { userData } = useAuth();
  const currentPlan = userData?.subscription?.plan_type ?? 'free';
  const currentPlanPriority = getPlanPriority(currentPlan);

  const isPlanDisabled = (planType: string) => currentPlanPriority >= getPlanPriority(planType);

  const getPlanButtonLabel = (planType: string, defaultLabel: string) => {
    if (currentPlan === planType) {
      return 'Current Plan';
    }

    if (currentPlanPriority > getPlanPriority(planType)) {
      return 'Included in Your Plan';
    }

    return defaultLabel;
  };
  
  // Typing animation effect
  useEffect(() => {
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
    let timeoutId: NodeJS.Timeout;
    
    function typeWriter() {
      const typedTextElement = document.getElementById('typed-text');
      const textareaElement = document.getElementById('ai-prompt');
      
      if (!typedTextElement || !textareaElement) return;
      
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
        timeoutId = setTimeout(() => {
          isDeleting = true;
          typeWriter();
        }, 1000);
        return;
      } else if (isDeleting && currentChar === 0) {
        isDeleting = false;
        currentExample = (currentExample + 1) % examples.length;
        typeSpeed = 500;
      }
      
      timeoutId = setTimeout(typeWriter, typeSpeed);
    }
    
    // Start typing animation after a short delay
    const initialTimeout = setTimeout(typeWriter, 1000);
    
    // Cleanup function
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  const faqData = [
    {
      question: "What AI models do you use?",
      answer: "We use GPT Image 1 for generating high-quality AI images and advanced prompt-to-icon technology to convert your descriptions into precise icons. This ensures professional-grade, visually stunning icons with the latest AI technology."
    },
    {
      question: "What if I need more icons?",
      answer: "Our Pro plan (100 credits/month) covers most professional needs. For agencies and high-volume users, our Profession Plus plan offers 200 credits/month plus advanced features."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time. Your access continues until the end of your current billing period."
    },
    {
      question: "Do I own the generated icons?",
      answer: "Yes! All icons generated with AI Icon Maker can be used for commercial purposes without any additional licensing fees."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleCheckout = async (planType: string) => {
    if (loadingPlan || isPlanDisabled(planType)) return;
    
    setLoadingPlan(planType);
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
      setLoadingPlan(null);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const subject = formData.get('subject') as string;
      const message = formData.get('message') as string;
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        contactFormRef.current?.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Navigation */}
      <Navbar variant="marketing" />

      {/* Hero Section */}
      <div className="w-full h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gradient-radial from-sunset-800 via-midnight-700 to-midnight-800 relative overflow-visible animate-fade-in flex items-center">

        
        {/* Floating Emoji Icons - Organic motion with depth animation */}
        <div className="absolute top-24 left-16 text-3xl animate-float-organic-1 hover:scale-125 hover:rotate-12 hover:!opacity-30 transition-all duration-700 cursor-pointer will-change-transform" style={{animationDelay: '0s'}}>
          🎨
        </div>
        
        <div className="absolute top-48 right-32 text-xl animate-float-organic-3 hover:scale-125 hover:-rotate-12 hover:!opacity-30 transition-all duration-700 cursor-pointer will-change-transform" style={{animationDelay: '2.3s'}}>
          ⭐
        </div>
        
        <div className="absolute top-36 left-1/3 text-2xl animate-float-organic-2 hover:scale-125 hover:rotate-6 hover:!opacity-30 transition-all duration-700 cursor-pointer will-change-transform" style={{animationDelay: '1.2s'}}>
          ✨
        </div>
        
        <div className="absolute bottom-48 left-24 text-xl animate-float-organic-1 hover:scale-125 hover:-rotate-6 hover:!opacity-30 transition-all duration-700 cursor-pointer will-change-transform" style={{animationDelay: '3.8s'}}>
          🚀
        </div>
        
        <div className="absolute bottom-36 right-1/4 text-2xl animate-float-organic-3 hover:scale-125 hover:rotate-12 hover:!opacity-30 transition-all duration-700 cursor-pointer will-change-transform" style={{animationDelay: '1.7s'}}>
          💡
        </div>
        
        <div className="absolute top-1/3 right-20 text-xl animate-float-organic-2 hover:scale-125 hover:-rotate-12 hover:!opacity-30 transition-all duration-700 cursor-pointer will-change-transform" style={{animationDelay: '0.6s'}}>
          🔥
        </div>
        <div className="flex flex-col items-center justify-center text-center w-full relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {h1Title}
          </h1>
          
          <h2 className="text-base sm:text-lg lg:text-xl text-sunset-200 mb-8 max-w-2xl px-4">
            {h2Subtitle}
          </h2>
          
          {/* Main Input Field */}
          <div className="w-full max-w-4xl mb-8 mx-auto px-4">
              <div className="relative">
                <textarea
                  id="ai-prompt"
                  className="w-full bg-midnight-800/90 border border-midnight-700 rounded-2xl p-4 sm:p-6 pr-12 sm:pr-16 text-white placeholder-transparent focus:outline-none focus:border-sunset-400 focus:ring-2 focus:ring-sunset-400/20 transition-all duration-300 resize-none text-base sm:text-lg backdrop-blur-sm min-h-[100px] sm:min-h-[120px] max-h-[200px]"
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
                  <select 
                    className="bg-midnight-700/50 hover:bg-midnight-600/50 border border-white/20 rounded-lg px-2 py-1 text-sunset-300 text-xs focus:outline-none focus:border-sunset-500 transition-colors [&>option]:bg-midnight-800 [&>option]:text-white [&>option]:border-none"
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
                <button className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-sunset-gradient hover:scale-105 text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-sunset-500/30">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
          
          {/* CTA Button */}
          <div className="inline-block [background:linear-gradient(45deg,#111827,theme(colors.midnight.800)_50%,#111827)_padding-box,conic-gradient(from_var(--border-angle),#FF8A65,#CE93D8,#FFF7ED,#FF8A65)_border-box] rounded-lg border-4 border-transparent animate-border shadow-lg shadow-sunset-500/50 hover:shadow-xl hover:shadow-sunset-500/70 transition-all duration-300">
            <SmartGenerateLink 
              className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 block"
              fallbackHref="/#pricing"
            >
              Create Your First Icon
            </SmartGenerateLink>
          </div>
        </div>

        {/* Demo Video Preview - Positioned at bottom of hero, extending into next section */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3/4 z-20">
          <ScrollAnimation delay={200}>
            <div className="w-full max-w-[95vw] mx-auto px-2">
              <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-3 shadow-2xl border border-midnight-800 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <div className="bg-coral-gradient rounded-lg aspect-video w-full h-[70vh] sm:min-h-[60vh] overflow-hidden">
                  <video
                    className="w-full h-full object-cover rounded-lg"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src="/videos/Demo_Video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Demo Section - Now with title/subtitle below the video */}
      <div className="pt-[32rem] pb-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16" style={{background: 'radial-gradient(ellipse at top, rgb(154, 52, 18), rgb(55, 65, 81), rgb(31, 41, 55))'}}>
        <div className="container mx-auto text-center">
          {/* Title and subtitle positioned below the video */}
          <ScrollAnimation delay={300}>
            <h2 className="text-4xl font-bold text-white mb-4">From Words to Wonders in Seconds</h2>
          </ScrollAnimation>
          <ScrollAnimation delay={400}>
            <p className="text-sunset-200 mb-12 max-w-2xl mx-auto">
              Experience the future of icon creation. Watch real users transform simple descriptions into professional-grade icons that would take hours to design manually.<br />
              <span className="text-coral-300 font-medium">No design skills required. Just pure creative freedom.</span>
            </p>
          </ScrollAnimation>
          
          {/* Additional demo content or features can go here */}
          <ScrollAnimation delay={500}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-sunset-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-sunset-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Instant Generation</h3>
                <p className="text-sunset-200 text-sm">Generate multiple icon variations in seconds</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-sunset-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-sunset-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Refinement</h3>
                <p className="text-sunset-200 text-sm">Improve and iterate on your icons with natural language</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-sunset-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-sunset-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Professional Export</h3>
                <p className="text-sunset-200 text-sm">Download your AI generated icons as a PNG file</p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-midnight-900/30 py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <ScrollAnimation>
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            </ScrollAnimation>
          </div>
          
          <div className="space-y-32">
            {/* Step 1 - Left Side */}
            <ScrollAnimation delay={100}>
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Content - Left */}
                <div className="order-2 lg:order-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-coral-gradient rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-coral-500 to-transparent flex-1"></div>
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Speak Your Vision
                  </h3>
                  <p className="text-sunset-200 text-xl leading-relaxed max-w-lg">
                    Simply describe what you envision and watch our AI bring it to life. From "minimalist shopping cart" to "futuristic rocket with neon glow" - your words become stunning icons.
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 text-coral-400 font-medium">
                      <span>Start creating</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Visual - Right */}
                <div className="order-1 lg:order-2">
                  <div className="relative">
                    <div className="bg-coral-gradient rounded-3xl p-4 shadow-2xl">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden h-[400px] sm:h-[350px] md:h-[400px]">
                        <video
                          className="w-full h-full object-cover rounded-2xl"
                          autoPlay
                          muted
                          loop
                          playsInline
                        >
                          <source src="/videos/Step1.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-coral-400 rounded-full"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-coral-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Step 2 - Right Side */}
            <ScrollAnimation delay={200}>
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Visual - Left */}
                <div className="order-1">
                  <div className="relative">
                    <div className="bg-sunset-gradient rounded-3xl p-4 shadow-2xl">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden h-[400px] sm:h-[350px] md:h-[400px]">
                        <video
                          className="w-full h-full object-cover rounded-2xl"
                          autoPlay
                          muted
                          loop
                          playsInline
                        >
                          <source src="/videos/Step2.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-sunset-400 rounded-full"></div>
                    <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-sunset-300 rounded-full"></div>
                  </div>
                </div>
                
                {/* Content - Right */}
                <div className="order-2 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-sunset-gradient rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-sunset-500 to-transparent flex-1"></div>
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Watch Ideas Transform
                  </h3>
                  <p className="text-sunset-200 text-xl leading-relaxed max-w-lg">
                    GPT Image 1 works its magic, analyzing every word and crafting multiple professional-grade variations. Each icon is pixel-perfect and ready for any project.
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 text-sunset-400 font-medium">
                      <span>Watch the magic</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Step 3 - Left Side */}
            <ScrollAnimation delay={300}>
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Content - Left */}
                <div className="order-2 lg:order-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-aurora-gradient rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-purple-400 to-transparent flex-1"></div>
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Perfect & Deploy
                  </h3>
                  <p className="text-sunset-200 text-xl leading-relaxed max-w-lg">
                    Select your favorite from multiple stunning variations, download instantly as high-quality PNG, or save to your organized library. Your perfect icon is ready in seconds.
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 text-purple-400 font-medium">
                      <span>Get your icons</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Visual - Right */}
                <div className="order-1 lg:order-2">
                  <div className="relative">
                    <div className="bg-aurora-gradient rounded-3xl p-4 shadow-2xl">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden h-[400px] sm:h-[350px] md:h-[400px]">
                        <video
                          className="w-full h-full object-cover rounded-2xl"
                          autoPlay
                          muted
                          loop
                          playsInline
                        >
                          <source src="/videos/Step3.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-400 rounded-full"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="features" className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <ScrollAnimation>
            <h2 className="text-4xl font-bold text-white mb-4">Why Creators Choose AI Icon Maker</h2>
            </ScrollAnimation>
            <ScrollAnimation delay={100}>
              <p className="text-sunset-200 max-w-2xl mx-auto">
              Everything you need to create stunning, professional icons without the learning curve of traditional design tools.
            </p>
            </ScrollAnimation>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI-Powered Icon Generation */}
            <ScrollAnimation delay={150}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105 group relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-coral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ff7e5f] to-coral-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-coral-300 transition-colors duration-300">Lightning-Fast Creation</h3>
                  <p className="text-sunset-200 text-sm leading-relaxed">Generate multiple professional variations in seconds. What takes hours in Photoshop now happens instantly with GPT Image 1.</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* No Design Skills Needed */}
            <ScrollAnimation delay={200}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105 group relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-sunset-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ff7e5f] to-sunset-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sunset-300 transition-colors duration-300">No Design Skills Needed</h3>
                  <p className="text-sunset-200 text-sm leading-relaxed">If you can describe it, you can create it. Our AI understands natural language—no complex tools or design experience required.</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Professional Quality */}
            <ScrollAnimation delay={250}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105 group relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ff7e5f] to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">Studio-Quality Results</h3>
                  <p className="text-sunset-200 text-sm leading-relaxed">Every icon is crafted with precision and polish. High-resolution PNG exports ready for apps, websites, or any professional project.</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Endless Style Options */}
            <ScrollAnimation delay={300}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105 group relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ff7e5f] to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">Endless Style Options</h3>
                  <p className="text-sunset-200 text-sm leading-relaxed">From modern flat to 3D, minimalist to vintage—choose from 8+ distinct styles that perfectly match your brand aesthetic.</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Save & Organize */}
            <ScrollAnimation delay={350}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105 group relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ff7e5f] to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors duration-300">Your Personal Icon Library</h3>
                  <p className="text-sunset-200 text-sm leading-relaxed">Save and organize your creations in one place. Access all your icons anytime, anywhere—never lose track of custom designs.</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Commercial Rights */}
            <ScrollAnimation delay={400}>
              <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105 group relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ff7e5f] to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">Full Commercial Rights</h3>
                  <p className="text-sunset-200 text-sm leading-relaxed">Own everything you create. Use your icons in client projects, products, apps, or websites—without restrictions or licensing fees.</p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>



      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="container mx-auto text-center">
          <ScrollAnimation>
            <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-12 border border-midnight-800 hover:shadow-3xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
              <ScrollAnimation delay={100}>
                <h2 className="text-4xl font-bold text-white mb-4">Stop Settling for Generic Icons</h2>
              </ScrollAnimation>
              <ScrollAnimation delay={200}>
                <p className="text-sunset-200 mb-8 max-w-2xl mx-auto">
                  Join 500+ designers and developers who've discovered the secret to creating custom icons that perfectly match their vision—in seconds, not hours.
                </p>
              </ScrollAnimation>
                              <ScrollAnimation delay={300}>
                {/* Swirling Border Button */}
                <div className="inline-block [background:linear-gradient(45deg,#111827,theme(colors.midnight.800)_50%,#111827)_padding-box,conic-gradient(from_var(--border-angle),#FF8A65,#CE93D8,#FFF7ED,#FF8A65)_border-box] rounded-lg border-4 border-transparent animate-border shadow-lg shadow-sunset-500/50 hover:shadow-xl hover:shadow-sunset-500/70 transition-all duration-300">
                  <SmartGenerateLink 
                    className="bg-transparent text-white px-12 py-4 rounded-lg font-semibold hover:scale-110 transition-all duration-300 block"
                    fallbackHref="/#pricing"
                  >
                    Transform Your Ideas Now
                  </SmartGenerateLink>
                </div>
              </ScrollAnimation>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 bg-midnight-900/30 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <ScrollAnimation>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Professional AI Icon Generation
              </h2>
            </ScrollAnimation>
            <ScrollAnimation delay={150}>
              <p className="text-xl text-sunset-200 mb-8 max-w-3xl mx-auto">
                High-quality AI-powered icon creation using GPT Image 1 and advanced prompt-to-icon technology. Professional tools deserve professional pricing.
            </p>
            </ScrollAnimation>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            
            {/* Base Plan */}
            <ScrollAnimation delay={200}>
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 relative h-full flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Base</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    $5<span className="text-lg font-normal text-sunset-200">/month</span>
                  </div>
                  <p className="text-sunset-200">Perfect for getting started</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    25 credits per month
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    GPT Image 1 powered icon generation
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Multiple style options
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Download as PNG
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save icons to your library
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Commercial usage rights
                  </li>
              </ul>
                
                <button 
                  onClick={() => handleCheckout('base')}
                  disabled={loadingPlan !== null || isPlanDisabled('base')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-center block shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingPlan === 'base' ? 'Processing...' : getPlanButtonLabel('base', 'Start with Base')}
                </button>
              </div>
            </ScrollAnimation>

            {/* Pro Plan */}
            <ScrollAnimation delay={250}>
              <div className="bg-gradient-to-br from-sunset-500/20 to-coral-500/20 backdrop-blur-md rounded-2xl p-8 border-2 border-sunset-500/50 shadow-2xl hover:shadow-3xl hover:shadow-sunset-500/30 transition-all duration-500 hover:scale-105 relative h-full flex flex-col">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#ff7e5f] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
                
                <div className="text-center mb-8 mt-4">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    $10<span className="text-lg font-normal text-sunset-200">/month</span>
                  </div>
                  <p className="text-sunset-200">Perfect for professionals</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    100 credits per month
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    GPT Image 1 powered icon generation
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Multiple style options
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Download as PNG
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save icons to your library
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Icon improvement & iteration
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Commercial usage rights
                  </li>
              </ul>
                
                <button 
                  onClick={() => handleCheckout('pro')}
                  disabled={loadingPlan !== null || isPlanDisabled('pro')}
                  className="w-full bg-gradient-to-r from-sunset-500 to-coral-500 text-white py-3 px-6 rounded-full font-semibold hover:from-sunset-600 hover:to-coral-600 transition-all duration-300 text-center block shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingPlan === 'pro' ? 'Processing...' : getPlanButtonLabel('pro', 'Start with Pro')}
                </button>
              </div>
            </ScrollAnimation>

            {/* Pro+ Plan */}
            <ScrollAnimation delay={300}>
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105 relative h-full flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro+</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    $15<span className="text-lg font-normal text-sunset-200">/month</span>
                  </div>
                  <p className="text-sunset-200">For power users and teams</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    200 credits per month
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Everything in Pro plan
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Extended icon library storage
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority processing
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    PNG export options
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
                    Premium support
                  </li>
              </ul>
                
                <button 
                  onClick={() => handleCheckout('proPlus')}
                  disabled={loadingPlan !== null || isPlanDisabled('proPlus')}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-full font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 text-center block shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingPlan === 'proPlus' ? 'Processing...' : getPlanButtonLabel('proPlus', 'Start with Pro+')}
                </button>
              </div>
            </ScrollAnimation>
          </div>



          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <ScrollAnimation>
                <h3 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h3>
              </ScrollAnimation>
              <ScrollAnimation delay={100}>
                <p className="text-sunset-200 max-w-2xl mx-auto">
                  Got questions? We've got answers. Here are some common questions about our pricing and service.
                </p>
              </ScrollAnimation>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqData.map((faq, index) => (
                <ScrollAnimation key={index} delay={150 + index * 50}>
                  <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-midnight-800/30 transition-colors duration-200"
                    >
                      <h4 className="text-lg font-semibold text-white">{faq.question}</h4>
                      <svg
                        className={`w-5 h-5 text-sunset-300 transition-transform duration-200 ${
                          openFAQ === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`px-6 transition-all duration-300 ease-in-out ${
                        openFAQ === index ? 'max-h-32 opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'
                      }`}
                    >
                      <p className="text-sunset-200">{faq.answer}</p>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center">
            <ScrollAnimation>
              <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-12 border border-midnight-800 hover:shadow-3xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                <ScrollAnimation delay={100}>
                  <h3 className="text-3xl font-bold text-white mb-4">Ready to Create Professional Icons?</h3>
                </ScrollAnimation>
                <ScrollAnimation delay={200}>
                  <p className="text-sunset-200 mb-8 max-w-2xl mx-auto">
                    Join professionals who are already using AI Icon Maker to create stunning icons for their projects.
                  </p>
                </ScrollAnimation>
                <ScrollAnimation delay={300}>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => handleCheckout('pro')}
                      disabled={loadingPlan !== null}
                      className="bg-gradient-to-r from-sunset-500 to-coral-500 text-white px-8 py-3 rounded-full font-semibold hover:from-sunset-600 hover:to-coral-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingPlan === 'pro' ? 'Processing...' : 'Start Your Subscription'}
                    </button>
                  </div>
                </ScrollAnimation>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <ScrollAnimation>
              <div className="flex justify-center items-center mb-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-sunset-500 to-coral-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">D</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">S</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">M</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">A</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">K</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">L</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">T</div>
                </div>
              </div>
              <p className="text-sunset-200 mb-4">500+ Designers & developers trust AI Icon Maker</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Helping creators streamline their<br />
                workflow and deliver faster
              </h2>
            </ScrollAnimation>
          </div>
          
          {/* Testimonials Carousel */}
          <TestimonialCarousel />
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-20 bg-midnight-900/30 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <ScrollAnimation>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Get in Touch
              </h2>
            </ScrollAnimation>
            <ScrollAnimation delay={100}>
              <p className="text-xl text-sunset-200 mb-8 max-w-3xl mx-auto">
                Have questions about AI Icon Maker? Need help with your subscription? We're here to help you create amazing icons.
              </p>
            </ScrollAnimation>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Contact Form */}
            <ScrollAnimation delay={200}>
              <div className="bg-gradient-to-br from-midnight-900/50 to-midnight-950/70 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
                <form ref={contactFormRef} className="space-y-6" onSubmit={handleContactSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-sunset-200 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full bg-midnight-800/50 border border-midnight-700 rounded-lg p-3 text-white placeholder-sunset-300/50 focus:outline-none focus:border-sunset-400 focus:ring-2 focus:ring-sunset-400/20 transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-sunset-200 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full bg-midnight-800/50 border border-midnight-700 rounded-lg p-3 text-white placeholder-sunset-300/50 focus:outline-none focus:border-sunset-400 focus:ring-2 focus:ring-sunset-400/20 transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-sunset-200 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full bg-midnight-800/50 border border-midnight-700 rounded-lg p-3 text-white focus:outline-none focus:border-sunset-400 focus:ring-2 focus:ring-sunset-400/20 transition-all duration-300"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Question</option>
                      <option value="billing">Billing & Subscriptions</option>
                      <option value="technical">Technical Support</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-sunset-200 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full bg-midnight-800/50 border border-midnight-700 rounded-lg p-3 text-white placeholder-sunset-300/50 focus:outline-none focus:border-sunset-400 focus:ring-2 focus:ring-sunset-400/20 transition-all duration-300 resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>
                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-300">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Message sent successfully! We'll get back to you soon.
                      </div>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Failed to send message. Please try again or contact us directly.
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-sunset-500 to-coral-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-sunset-600 hover:to-coral-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>


      {/* Footer */}
      <Footer />
    </div>
  );
}

