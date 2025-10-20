import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { Analytics } from '@vercel/analytics/react'
import StructuredData from '../components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-icon-maker.com'),
  title: {
    default: 'AI Icon Maker - Create Professional Icons with AI',
    template: '%s | AI Icon Maker'
  },
  description: 'Create professional-grade PNG icons with AI-powered generation using GPT Image 1. Perfect for designers, developers, and content creators. Multiple styles, instant downloads, and personal library storage.',
  keywords: ['AI icon generator', 'icon maker', 'AI design tool', 'GPT Image 1', 'icon creation', 'PNG icons', 'professional icons', 'AI graphics', 'icon design', 'SaaS icon tool'],
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
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
} 