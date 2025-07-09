import ScrollAnimation from '../components/ScrollAnimation';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Navigation */}
      <Navbar />

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
          
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <ScrollAnimation delay={400} className="translate-x-8">
              <div className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-midnight-800 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <div className="bg-sunset-gradient rounded-lg h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm">AI Icon Generation Preview</p>
                  </div>
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
      <div className="py-20">
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
                <div className="w-16 h-16 bg-sunset-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
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
                <div className="w-16 h-16 bg-sunset-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
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
                <div className="w-16 h-16 bg-sunset-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
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
                <div className="w-16 h-16 bg-sunset-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
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
                <div className="w-16 h-16 bg-sunset-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
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
                <div className="w-16 h-16 bg-sunset-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:rotate-12 transition-transform duration-300">
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
                  <div className="bg-sunset-gradient rounded-lg h-48 flex items-center justify-center">
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

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
} 