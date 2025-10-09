import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Usage & Limits',
  description: 'Track your icon generation usage, monitor credit limits, and view your subscription statistics.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function UsageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

