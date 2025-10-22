import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@beauty-shop/ui', '@beauty-shop/types', '@beauty-shop/config'],
  images: {
    domains: ['localhost', 'aakjzquwftmtuzxjzxbv.supabase.co'],
  },
  env: {
    PAYLOAD_PUBLIC_SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  },
  outputFileTracingRoot: '/Users/nicklaseskou/Documents/GitHub/beauty-shop',
  experimental: {
    reactCompiler: false,
  },
}

// Make sure you wrap your `nextConfig`
// with the `withPayload` plugin
export default withPayload(nextConfig)
