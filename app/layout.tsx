import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Icon Maker - A Magical AI Icon Editor for Creators',
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 