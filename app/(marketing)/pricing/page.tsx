import ScrollAnimation from '../../components/ScrollAnimation';
import Navbar from '../../components/Navbar';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Navigation */}
      <Navbar variant="marketing" />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="text-center mb-16">
          <ScrollAnimation>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
          </ScrollAnimation>
          <ScrollAnimation delay={300}>
            <p className="text-xl text-sunset-200 mb-8 max-w-3xl mx-auto">
              Choose the perfect plan for your icon creation needs. Start free and upgrade as you grow.
            </p>
          </ScrollAnimation>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Free Plan */}
          <ScrollAnimation delay={200}>
            <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $0<span className="text-lg font-normal text-sunset-200">/month</span>
                </div>
                <p className="text-sunset-200">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5 icons per month
                </li>
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic drawing tools
                </li>
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  PNG export
                </li>
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Community support
                </li>
              </ul>
              
              <Link 
                href="/register" 
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-full font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 text-center block"
              >
                Get Started Free
              </Link>
            </div>
          </ScrollAnimation>

          {/* Pro Plan - Featured */}
          <ScrollAnimation delay={400}>
            <div className="bg-gradient-to-br from-sunset-500/20 to-coral-500/20 backdrop-blur-md rounded-2xl p-8 border-2 border-sunset-500/50 shadow-2xl hover:shadow-3xl hover:shadow-sunset-500/30 transition-all duration-500 hover:scale-105 relative">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-sunset-500 to-coral-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-8 mt-4">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $19<span className="text-lg font-normal text-sunset-200">/month</span>
                </div>
                <p className="text-sunset-200">Perfect for professionals</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100 icons per month
                </li>
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced drawing tools
                </li>
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  PNG, SVG, ICO export
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
                  Email support
                </li>
              </ul>
              
              <Link 
                href="/register" 
                className="w-full bg-gradient-to-r from-sunset-500 to-coral-500 text-white py-3 px-6 rounded-full font-semibold hover:from-sunset-600 hover:to-coral-600 transition-all duration-300 text-center block shadow-lg hover:shadow-xl"
              >
                Start Pro Trial
              </Link>
            </div>
          </ScrollAnimation>

          {/* Enterprise Plan */}
          <ScrollAnimation delay={600}>
            <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $99<span className="text-lg font-normal text-sunset-200">/month</span>
                </div>
                <p className="text-sunset-200">For teams and organizations</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited icons
                </li>
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Team collaboration
                </li>
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Brand guidelines
                </li>
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  API access
                </li>
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom integrations
                </li>
                <li className="flex items-center text-sunset-200">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 priority support
                </li>
              </ul>
              
              <Link 
                href="/contact" 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-full font-semibold hover:from-purple-500 hover:to-purple-600 transition-all duration-300 text-center block"
              >
                Contact Sales
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-midnight-900/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <ScrollAnimation>
              <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <p className="text-sunset-200 max-w-2xl mx-auto">
                Got questions? We've got answers. Here are some common questions about our pricing.
              </p>
            </ScrollAnimation>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollAnimation delay={300}>
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">Can I change plans anytime?</h3>
                <p className="text-sunset-200">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={400}>
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">What happens to my icons if I downgrade?</h3>
                <p className="text-sunset-200">
                  Your previously created icons remain yours forever. You'll just have lower monthly limits for creating new icons going forward.
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={500}>
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">Do you offer refunds?</h3>
                <p className="text-sunset-200">
                  We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment in full.
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={600}>
              <div className="bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">Can I use icons commercially?</h3>
                <p className="text-sunset-200">
                  Yes! All icons created with AI Icon Maker can be used for commercial purposes without any additional licensing fees.
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
                <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
              </ScrollAnimation>
              <ScrollAnimation delay={400}>
                <p className="text-sunset-200 mb-8 max-w-2xl mx-auto">
                  Join thousands of creators who are already using AI Icon Maker to bring their ideas to life.
                </p>
              </ScrollAnimation>
              <ScrollAnimation delay={600}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/register" 
                    className="bg-gradient-to-r from-sunset-500 to-coral-500 text-white px-8 py-3 rounded-full font-semibold hover:from-sunset-600 hover:to-coral-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Free Trial
                  </Link>
                  <Link 
                    href="/contact" 
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

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
} 