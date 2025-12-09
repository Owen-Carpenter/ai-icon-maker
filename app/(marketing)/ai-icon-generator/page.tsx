import React from 'react';
import MarketingPageLayout from '../../../components/MarketingPageLayout';

export const metadata = {
  title: 'AI Icon Generator | Create Custom Icons with AI',
  description: 'Generate professional custom icons in seconds with our AI Icon Generator. Perfect for apps, websites, and branding.',
};

export default function AiIconGeneratorPage() {
  return (
    <MarketingPageLayout
      h1Title='Generate AI <span class="bg-gradient-to-r from-sunset-500 to-coral-500 bg-clip-text text-transparent">Icons</span>'
      h2Subtitle="Create professional PNG icons, app icons, and logos in seconds with our advanced AI-powered generator."
    />
  );
}
