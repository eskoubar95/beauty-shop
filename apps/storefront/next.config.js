/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@beauty-shop/ui', '@beauty-shop/types', '@beauty-shop/config'],
  images: {
    domains: ['localhost', 'aakjzquwftmtuzxjzxbv.supabase.co'],
  },
  env: {
    MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
  },
  outputFileTracingRoot: '/Users/nicklaseskou/Documents/GitHub/beauty-shop',
}

module.exports = nextConfig
