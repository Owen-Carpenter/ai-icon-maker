import React from 'react';
import MarketingPageLayout from '../../../components/MarketingPageLayout';

export const metadata = {
  title: 'AI Favicon Generator | Create Website Favicons Instantly',
  description: 'Generate unique, brand-matching favicons for your website with AI. Stand out in the browser tab.',
};

export default function FaviconGeneratorPage() {
  return (
    <MarketingPageLayout
      h1Title='Generate Website <span class="bg-gradient-to-r from-sunset-500 to-coral-500 bg-clip-text text-transparent">Favicons</span>'
      h2Subtitle="Create unique, brand-matching PNG favicons for your website that stand out in every browser tab."
    />
  );
}
