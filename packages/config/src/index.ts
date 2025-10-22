// Environment configuration
export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || '',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // MedusaJS
  medusa: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
    adminUrl: process.env.MEDUSA_ADMIN_URL || 'http://localhost:9000/app',
    storeUrl: process.env.MEDUSA_STORE_URL || 'http://localhost:9000',
    cors: {
      admin: process.env.ADMIN_CORS?.split(',') || ['http://localhost:9000'],
      store: process.env.STORE_CORS?.split(',') || ['http://localhost:3000'],
      auth: process.env.AUTH_CORS?.split(',') || ['http://localhost:9000'],
    },
  },

  // Next.js
  nextjs: {
    port: parseInt(process.env.PORT || '3000'),
    hostname: process.env.HOSTNAME || 'localhost',
  },

  // Clerk Authentication
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
    secretKey: process.env.CLERK_SECRET_KEY || '',
    webhookSecret: process.env.CLERK_WEBHOOK_SECRET || '',
  },

  // Stripe
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  // Resend
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@beautyshop.com',
  },

  // LaunchDarkly
  launchdarkly: {
    clientSideId: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID || '',
    serverSideId: process.env.LAUNCHDARKLY_SERVER_SIDE_ID || '',
  },

  // Sentry
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development',
    release: process.env.SENTRY_RELEASE || '1.0.0',
  },

  // Vercel Analytics
  vercel: {
    analyticsId: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID || '',
  },

  // App Configuration
  app: {
    name: 'Beauty Shop',
    description: 'Premium beauty and skincare products',
    url: process.env.APP_URL || 'http://localhost:3000',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  // Feature Flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableErrorTracking: process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true',
    enableFeatureFlags: process.env.NEXT_PUBLIC_ENABLE_FEATURE_FLAGS === 'true',
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'supersecret',
    cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    encryptionKey: process.env.ENCRYPTION_KEY || 'supersecret',
  },

  // Redis (optional)
  redis: {
    url: process.env.REDIS_URL || '',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
  },
}

// Validation function
export function validateConfig() {
  const required = [
    'DATABASE_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  return true
}

// Export theme and constants
export * from './theme'
export * from './constants'

// Export individual configs for easier imports
export const { database, supabase, medusa, nextjs, clerk, stripe, resend, launchdarkly, sentry, vercel, app, features, security, redis } = config
