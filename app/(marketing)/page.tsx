import ScrollAnimation from '../../components/ScrollAnimation';
import Navbar from '../../components/Navbar';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';
import TestimonialCarousel from '../../components/TestimonialCarousel';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Navigation */}
      <Navbar variant="marketing" />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 text-center lg:text-left">
            <ScrollAnimation>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              A Magical AI Icon<br />
              Editor for Creators
            </h1>
            </ScrollAnimation>
            <ScrollAnimation delay={300}>
              <p className="text-xl text-sunset-200 mb-8 max-w-2xl">
               AI Icon Maker lets you easily build, create, and manage professional icons 
               for OpenAI, Anthropic, Google, and many other AI APIs and integrated 
               your icon library everywhere in one centralized environment.
             </p>
            </ScrollAnimation>
            
            <ScrollAnimation delay={600}>
              {/* Swirling Border Button */}
              <div className="inline-block [background:linear-gradient(45deg,#111827,theme(colors.midnight.800)_50%,#111827)_padding-box,conic-gradient(from_var(--border-angle),#FF8A65,#CE93D8,#FFF7ED,#FF8A65)_border-box] rounded-lg border-4 border-transparent animate-border shadow-lg shadow-sunset-500/50 hover:shadow-xl hover:shadow-sunset-500/70 transition-all duration-300">
                <Link href="/register" className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 block">
              Try AI Icon Maker
                </Link>
              </div>
            </ScrollAnimation>
          </div>
          
          <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center lg:justify-end">
            <ScrollAnimation delay={400} className="lg:translate-x-8">
              <div className="bg-gradient-to-br from-midnight-900/40 to-midnight-950/60 backdrop-blur-sm rounded-2xl p-5 shadow-2xl border border-white/10 hover:shadow-3xl hover:shadow-sunset-500/20 transition-all duration-500 max-w-md animate-float">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center space-x-2 bg-[#ff7e5f]/20 text-sunset-300 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    <span>INTRODUCING AI ICON MAKER</span>
                    <span className="bg-[#ff7e5f] text-white px-2 py-0.5 rounded text-xs">BETA</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">What should we build?</h3>
                  <p className="text-sunset-200 text-xs">Creating stunning icons with AI has never been easier.</p>
                </div>

                {/* Prompt Input */}
                <div className="mb-4">
                  <div className="relative">
                    <textarea
                      id="ai-prompt"
                      className="w-full bg-midnight-800/50 border border-midnight-700 rounded-lg p-3 text-white placeholder-sunset-300/50 focus:outline-none focus:border-sunset-400 focus:ring-1 focus:ring-sunset-400 transition-all duration-300 resize-none text-sm"
                      rows={2}
                      placeholder=""
                    />
                    <div 
                      id="typing-placeholder" 
                      className="absolute top-3 left-3 text-sunset-300/70 pointer-events-none text-sm"
                    >
                      <span id="typed-text"></span>
                      <span id="cursor" className="animate-pulse text-sunset-400">|</span>
                    </div>
                  </div>
                </div>

                {/* Animated Sketch to Icon Demo */}
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 relative overflow-hidden h-32">
                    {/* Animated Sketch Canvas */}
                    <canvas
                      id="sketch-canvas"
                      width="280"
                      height="100"
                      className="absolute inset-2 opacity-100 transition-opacity duration-1000 w-full h-full"
                    ></canvas>
                    
                    {/* Generated Icon Display */}
                    <div id="generated-icon" className="absolute inset-2 flex items-center justify-center opacity-0 transition-opacity duration-1000">
                      <div className="w-16 h-16 bg-gradient-to-br from-sunset-500 to-coral-500 rounded-xl flex items-center justify-center shadow-lg transform scale-0 transition-transform duration-500">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div id="demo-status" className="text-xs text-gray-500 font-medium">Sketching...</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-2 text-sunset-300 hover:text-white transition-colors duration-300 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>Attach</span>
                  </button>
                  
                  <Link 
                    href="/generate"
                    className="bg-sunset-gradient hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-sunset-500/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Generate</span>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          </div>
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
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-[#ff7e5f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Visual AI Prompt Builder</h3>
                <p className="text-sunset-200">
                Build better prompts with AI guidance and 
                a modern visual canvas.
              </p>
            </div>
            </ScrollAnimation>

            {/* Quick Preview */}
            <ScrollAnimation delay={400}>
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
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
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
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
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
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
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
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
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
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
                  <Link href="/register" className="bg-transparent text-white px-12 py-4 rounded-lg font-semibold hover:scale-110 transition-all duration-300 block">
                    Start Creating Now
                  </Link>
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
                High-quality AI-powered icon creation using premium models like DALL-E 3, Midjourney, and Stable Diffusion XL. Professional tools deserve professional pricing.
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
                    Premium AI models (DALL-E 3, Midjourney, SDXL)
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Multiple formats (PNG, SVG, ICO)
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High-resolution outputs (up to 1024x1024)
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
                
                <Link 
                  href="/register" 
                  className="w-full bg-gradient-to-r from-sunset-500 to-coral-500 text-white py-3 px-6 rounded-full font-semibold hover:from-sunset-600 hover:to-coral-600 transition-all duration-300 text-center block shadow-lg hover:shadow-xl"
                >
                  Start Creating Icons
                </Link>
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
                    All premium AI models + experimental models
                  </li>
                  <li className="flex items-center text-sunset-200">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ultra-high resolution (up to 2048x2048)
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
                
                <Link 
                  href="/register" 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-full font-semibold hover:from-purple-500 hover:to-purple-600 transition-all duration-300 text-center block"
                >
                  Start Creating Icons
                </Link>
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
                  We use premium AI models to ensure the highest quality icons. Here's what it costs to generate icons with leading AI services:
                </p>
              </ScrollAnimation>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollAnimation delay={300}>
                <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center">
                  <h4 className="text-xl font-semibold text-white mb-3">DALL-E 3</h4>
                  <p className="text-sunset-200 mb-2">$0.040 per image</p>
                  <p className="text-sunset-200 text-sm">OpenAI's premium model</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={400}>
                <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center">
                  <h4 className="text-xl font-semibold text-white mb-3">Midjourney</h4>
                  <p className="text-sunset-200 mb-2">$0.33+ per image</p>
                  <p className="text-sunset-200 text-sm">Based on $10/month plan</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={500}>
                <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10 text-center">
                  <h4 className="text-xl font-semibold text-white mb-3">Stable Diffusion XL</h4>
                  <p className="text-sunset-200 mb-2">$0.001-0.004 per image</p>
                  <p className="text-sunset-200 text-sm">Via cloud providers</p>
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
                  <h4 className="text-xl font-semibold text-white mb-3">Why no free plan?</h4>
                  <p className="text-sunset-200">
                    AI image generation using premium models like DALL-E 3 and Midjourney has real costs. We prefer to offer quality over quantity with transparent pricing.
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
                    <Link 
                      href="/register" 
                      className="bg-gradient-to-r from-sunset-500 to-coral-500 text-white px-8 py-3 rounded-full font-semibold hover:from-sunset-600 hover:to-coral-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Start Your Subscription
                    </Link>
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

      {/* Typing Animation & Sketch Demo Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const examples = [
                "Create a shopping cart icon with modern flat design",
                "Design a lightning bolt icon for a productivity app", 
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
                  typeSpeed = 2000;
                  isDeleting = true;
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
              
              // Animated Sketch to Icon Demo
              function initSketchDemo() {
                const canvas = document.getElementById('sketch-canvas');
                const generatedIcon = document.getElementById('generated-icon');
                const demoStatus = document.getElementById('demo-status');
                
                if (!canvas || !generatedIcon || !demoStatus) return;
                
                const ctx = canvas.getContext('2d');
                let animationStep = 0;
                let currentPath = [];
                
                                 // Lightning bolt path 1 - Classic zigzag
                 const lightningPath1 = [
                   {x: 140, y: 20},
                   {x: 125, y: 40},
                   {x: 155, y: 40},
                   {x: 140, y: 60},
                   {x: 110, y: 45},
                   {x: 140, y: 20}
                 ];
                 
                 // Lightning bolt path 2 - Wider zigzag
                 const lightningPath2 = [
                   {x: 140, y: 25},
                   {x: 120, y: 45},
                   {x: 160, y: 45},
                   {x: 140, y: 75},
                   {x: 105, y: 50},
                   {x: 140, y: 25}
                 ];
                 
                 // Lightning bolt path 3 - Taller lightning
                 const lightningPath3 = [
                   {x: 140, y: 15},
                   {x: 130, y: 35},
                   {x: 150, y: 35},
                   {x: 140, y: 55},
                   {x: 125, y: 75},
                   {x: 155, y: 75},
                   {x: 140, y: 85},
                   {x: 115, y: 60},
                   {x: 140, y: 15}
                 ];
                
                                 const paths = [lightningPath1, lightningPath2, lightningPath3];
                let currentPathIndex = 0;
                
                function drawSketch() {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  
                  // Set drawing style
                  ctx.strokeStyle = '#666';
                  ctx.lineWidth = 2;
                  ctx.lineCap = 'round';
                  ctx.lineJoin = 'round';
                  
                  const path = paths[currentPathIndex];
                  
                  if (animationStep < path.length) {
                    // Draw the path progressively
                    ctx.beginPath();
                    ctx.moveTo(path[0].x, path[0].y);
                    
                    for (let i = 1; i <= animationStep; i++) {
                      ctx.lineTo(path[i].x, path[i].y);
                    }
                    
                    ctx.stroke();
                    
                                         // Add some random sketch lines for effect
                     if (Math.random() > 0.8) {
                       ctx.beginPath();
                       const pointIndex = Math.max(0, Math.floor(animationStep/2));
                       if (path[pointIndex]) {
                         ctx.moveTo(path[pointIndex].x + Math.random() * 3 - 1.5, 
                                   path[pointIndex].y + Math.random() * 3 - 1.5);
                         ctx.lineTo(path[pointIndex].x + Math.random() * 6 - 3, 
                                   path[pointIndex].y + Math.random() * 6 - 3);
                         ctx.stroke();
                       }
                     }
                    
                    animationStep++;
                    setTimeout(drawSketch, 150);
                  } else {
                    // Sketch complete, show AI processing
                    demoStatus.textContent = 'AI Processing...';
                    setTimeout(showGeneratedIcon, 1000);
                  }
                }
                
                function showGeneratedIcon() {
                  // Hide sketch canvas
                  canvas.style.opacity = '0';
                  
                  // Show generated icon
                  generatedIcon.style.opacity = '1';
                  generatedIcon.querySelector('div').style.transform = 'scale(1)';
                  
                  demoStatus.textContent = 'Icon Generated!';
                  
                  // Reset after 3 seconds
                  setTimeout(resetDemo, 3000);
                }
                
                function resetDemo() {
                  // Hide generated icon
                  generatedIcon.style.opacity = '0';
                  generatedIcon.querySelector('div').style.transform = 'scale(0)';
                  
                  // Show sketch canvas
                  canvas.style.opacity = '1';
                  
                  // Reset variables
                  animationStep = 0;
                  currentPathIndex = (currentPathIndex + 1) % paths.length;
                  
                  demoStatus.textContent = 'Sketching...';
                  
                  // Start next sketch
                  setTimeout(drawSketch, 1000);
                }
                
                // Start the demo
                setTimeout(drawSketch, 2000);
              }
              
              // Initialize everything when DOM is ready
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(typeWriter, 1000);
                initSketchDemo();
              });
              
              // Also start if DOM is already loaded
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  setTimeout(typeWriter, 1000);
                  initSketchDemo();
                });
              } else {
                setTimeout(typeWriter, 1000);
                initSketchDemo();
              }
            })();
          `,
        }}
      />
    </div>
  );
} 