import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { Analytics } from '@vercel/analytics/react'
import StructuredData from '../components/StructuredData'
import { ErrorBoundary } from '../components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-icon-maker.com'),
  title: {
    default: 'AI Icon Maker - Create Professional Icons with AI',
    template: '%s | AI Icon Maker'
  },
  description: 'Create professional-grade PNG icons with AI-powered generation using GPT Image 1. Perfect for designers, developers, and content creators. Multiple styles, instant downloads, and personal library storage.',
  keywords: [
    // Primary Keywords
    'AI icon generator',
    'icon maker online',
    'AI icon creator',
    'icon generator',
    'app icon maker',
    'logo maker AI',
    'AI design tool',
    'icon creator online',
    'AI graphics generator',
    'icon design tool',
    
    // Technology-specific
    'GPT icon generator',
    'ChatGPT icon maker',
    'AI powered icon design',
    'machine learning icon creator',
    'neural network icon generator',
    
    // Use Case Keywords
    'app icon generator',
    'website icon maker',
    'favicon generator',
    'logo icon creator',
    'social media icon maker',
    'app store icon generator',
    'game icon creator',
    'startup icon maker',
    
    // Feature-based Keywords
    'PNG icon generator',
    'SVG icon maker',
    'transparent background icons',
    'custom icon generator',
    'professional icon maker',
    'commercial use icons',
    'royalty free icon generator',
    
    // Platform/User-specific
    'icon maker for developers',
    'icon generator for designers',
    'icon creator for startups',
    'icon maker for apps',
    'icon generator for websites',
    
    // Action-oriented
    'create icons online',
    'generate icons with AI',
    'make icons instantly',
    'design icons with AI',
    'build custom icons',
    
    // Quality descriptors
    'high quality icon generator',
    'professional icon creator',
    'modern icon maker',
    'unique icon generator',
    'custom AI icons',
  ],
  authors: [{ name: 'AI Icon Maker' }],
  creator: 'AI Icon Maker',
  publisher: 'AI Icon Maker',
  verification: {
    google: 'EFS5qxq_vRGUABjbt4LNQPlrLjtGyolIolAmwfMgGzw',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/AIIconMakerLogo.png',
    shortcut: '/images/AIIconMakerLogo.png',
    apple: '/images/AIIconMakerLogo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-icon-maker.com',
    title: 'AI Icon Maker - Create Professional Icons with AI',
    description: 'Create professional-grade PNG icons with AI-powered generation using GPT Image 1. Perfect for designers, developers, and content creators.',
    siteName: 'AI Icon Maker',
    images: [
      {
        url: '/images/AIIconMakerLogo.png',
        width: 1200,
        height: 630,
        alt: 'AI Icon Maker - Professional AI Icon Generation',
      },
    ],
  },
  alternates: {
    canonical: 'https://ai-icon-maker.com',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17770613842"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17770613842');
            `,
          }}
        />
        <StructuredData />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
} 