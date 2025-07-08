import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIcon Studio - AI-Powered Icon Generator',
  description: 'Create professional-grade icons with AI or drawing tools. Premium SaaS application for designers, developers, and content creators.',
  keywords: ['AI', 'icon', 'generator', 'design', 'SaaS', 'DALL-E'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 