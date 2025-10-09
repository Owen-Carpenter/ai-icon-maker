import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Icon Maker - Create Professional Icons with AI',
  description: 'Generate stunning, professional-grade PNG icons in seconds with AI-powered technology. Choose from multiple styles, download instantly, and save to your personal library. Starting at just $5/month for 25 credits.',
  keywords: ['AI icon generator', 'create icons online', 'AI design tool', 'professional icon maker', 'GPT Image 1 icons', 'PNG icon download', 'icon generation service', 'AI graphics tool'],
  openGraph: {
    title: 'AI Icon Maker - Create Professional Icons with AI',
    description: 'Generate stunning, professional-grade PNG icons in seconds with AI-powered technology. Multiple styles, instant downloads, and personal library storage.',
    type: 'website',
    images: [
      {
        url: '/images/AIIconMakerLogo.png',
        width: 1200,
        height: 630,
        alt: 'AI Icon Maker - Create Professional Icons',
      },
    ],
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

