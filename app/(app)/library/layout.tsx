import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Icon Library',
  description: 'Access your saved icon collection. View, download, and manage all your AI-generated icons in one place.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

