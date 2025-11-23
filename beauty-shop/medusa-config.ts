import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

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
  },
  modules: {
    cacheService: {
      resolve: "@medusajs/cache-redis",
      options: { 
        redisUrl: process.env.REDIS_URL,
      },
    },
    eventBusModuleService: {
      resolve: "@medusajs/event-bus-redis",
      options: { 
        redisUrl: process.env.REDIS_URL,
      },
    },
    purchaseOrder: {
      resolve: "./src/modules/purchase-orders",
    },
  },
})
