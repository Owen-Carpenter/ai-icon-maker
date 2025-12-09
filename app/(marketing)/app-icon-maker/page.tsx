import React from 'react';
import MarketingPageLayout from '../../../components/MarketingPageLayout';

export const metadata = {
  title: 'App Icon Maker | Generate iOS & Android App Icons',
  description: 'Create stunning app icons for iOS and Android in seconds. The best AI App Icon Maker for developers and indie hackers.',
};

export default function AppIconMakerPage() {
  return (
    <MarketingPageLayout
      h1Title='Make App <span class="bg-gradient-to-r from-sunset-500 to-coral-500 bg-clip-text text-transparent">Icons</span>'
      h2Subtitle="Create stunning PNG app icons for iOS and Android apps with AI - perfect for the App Store and Google Play."
    />
  );
}
