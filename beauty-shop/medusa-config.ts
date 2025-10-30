import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Debug: Log Redis configuration at startup
console.log('🔧 [CONFIG] REDIS_URL is:', process.env.REDIS_URL ? 'SET' : 'NOT SET')
if (process.env.REDIS_URL) {
  console.log('🔧 [CONFIG] REDIS_URL starts with:', process.env.REDIS_URL.substring(0, 25) + '...')
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: process.env.DATABASE_EXTRA ? JSON.parse(process.env.DATABASE_EXTRA) : undefined,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    // Disable admin panel in production if DISABLE_ADMIN is set
    disable: process.env.DISABLE_ADMIN === 'true',
  }
})
