import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generate Icons',
  description: 'Create custom AI-generated icons with our powerful icon generator. Describe your icon idea and let AI bring it to life with multiple style options.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

