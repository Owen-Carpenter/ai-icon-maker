import React from 'react';
import MarketingPageLayout from '../../../components/MarketingPageLayout';

export const metadata = {
  title: 'AI Icon Set Generator | Create Consistent Icon Packs',
  description: 'Generate cohesive, consistent icon sets for your UI design system. Maintain style across multiple icons automatically.',
};

export default function IconSetGeneratorPage() {
  return (
    <MarketingPageLayout
      h1Title='Create Icon <span class="bg-gradient-to-r from-sunset-500 to-coral-500 bg-clip-text text-transparent">Sets</span>'
      h2Subtitle="Generate multiple matching PNG icons with consistent style for your entire design system or app in minutes."
    />
  );
}
