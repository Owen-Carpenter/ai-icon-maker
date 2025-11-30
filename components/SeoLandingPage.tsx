import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import SmartGenerateLink from './SmartGenerateLink';

interface SeoLandingPageProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  faq: { question: string; answer: string }[];
  keywords: string[];
}

export default function SeoLandingPage({
  title,
  subtitle,
  description,
  features,
  faq,
  keywords,
}: SeoLandingPageProps) {
  return (
    <div className="min-h-screen bg-dark-gradient flex flex-col">
      <Navbar variant="marketing" />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="pt-32 pb-20 px-4 sm:px-6 md:px-8 bg-gradient-radial from-sunset-900/20 via-midnight-900 to-midnight-950">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-xl text-sunset-200 mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
            <div className="flex justify-center">
              <div className="inline-block [background:linear-gradient(45deg,#111827,theme(colors.midnight.800)_50%,#111827)_padding-box,conic-gradient(from_var(--border-angle),#FF8A65,#CE93D8,#FFF7ED,#FF8A65)_border-box] rounded-lg border-4 border-transparent animate-border shadow-lg shadow-sunset-500/50 hover:shadow-xl hover:shadow-sunset-500/70 transition-all duration-300">
                <SmartGenerateLink 
                  className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-all duration-300 block text-lg"
                  fallbackHref="/register"
                >
                  Generate Icons Now
                </SmartGenerateLink>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="py-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-midnight-900/50 backdrop-blur-sm rounded-2xl p-8 border border-midnight-800 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-6">About {title}</h2>
              <div className="prose prose-invert max-w-none text-sunset-200">
                <p className="text-lg mb-6">{description}</p>
                
                <h3 className="text-2xl font-bold text-white mt-8 mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-20 bg-midnight-950 px-4 sm:px-6">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faq.map((item, index) => (
                <div key={index} className="bg-midnight-900/50 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">{item.question}</h3>
                  <p className="text-sunset-200">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Keywords (Hidden visually but present for bots if needed, though usually context is enough) */}
        <div className="sr-only">
          {keywords.join(', ')}
        </div>
      </main>

      <Footer />
    </div>
  );
}

