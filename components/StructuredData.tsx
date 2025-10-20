export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Icon Maker',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        name: 'Base Plan',
        price: '5.00',
        priceCurrency: 'USD',
        description: '25 credits per month for AI icon generation',
      },
      {
        '@type': 'Offer',
        name: 'Pro Plan',
        price: '10.00',
        priceCurrency: 'USD',
        description: '100 credits per month for AI icon generation',
      },
      {
        '@type': 'Offer',
        name: 'Pro+ Plan',
        price: '15.00',
        priceCurrency: 'USD',
        description: '200 credits per month for AI icon generation',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
    description: 'Create professional-grade PNG icons with AI-powered generation using GPT Image 1. Perfect for designers, developers, and content creators.',
    featureList: [
      'AI-powered icon generation',
      'Multiple style options',
      'PNG export',
      'Icon library storage',
      'Icon improvement & iteration',
      'Commercial usage rights',
    ],
  }

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI Icon Maker',
    url: 'https://ai-icon-maker.com',
    logo: 'https://ai-icon-maker.com/images/AIIconMakerLogo.png',
    description: 'Professional AI-powered icon generation platform for designers and developers',
    sameAs: [],
  }

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI Icon Maker',
    url: 'https://ai-icon-maker.com',
    description: 'Create professional-grade icons with AI',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ai-icon-maker.com/generate?prompt={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  )
}

