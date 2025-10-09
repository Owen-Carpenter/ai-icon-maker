import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your AI Icon Maker account settings, subscription plan, and billing information.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

