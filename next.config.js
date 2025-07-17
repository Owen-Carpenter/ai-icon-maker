/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        // Add your production domain here
        ...(process.env.NEXT_PUBLIC_APP_URL ? [new URL(process.env.NEXT_PUBLIC_APP_URL).host] : []),
        // Common Vercel patterns
        ...(process.env.VERCEL_URL ? [process.env.VERCEL_URL] : []),
      ],
    },
  },
  images: {
    domains: ['supabase.co'],
  },
}

module.exports = nextConfig 