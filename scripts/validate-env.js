#!/usr/bin/env node

const requiredEnvVars = {
  development: [
    'DATABASE_URL',
    'REDIS_URL', 
    'STRIPE_API_KEY',
    'CLERK_SECRET_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ],
  production: [
    'DATABASE_URL',
    'STRIPE_API_KEY',
    'CLERK_SECRET_KEY', 
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SENTRY_DSN'
  ]
}

function validateEnvironment() {
  const env = process.env.NODE_ENV || 'development'
  const missing = []
  
  console.log(`🔍 Validating ${env} environment...`)
  
  requiredEnvVars[env]?.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  })
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`)
    console.error(`\nPlease ensure all required variables are set in your .env file`)
    console.error(`Required for ${env}:`, requiredEnvVars[env])
    process.exit(1)
  }
  
  console.log(`✅ Environment validation passed for ${env}`)
  console.log(`Found ${requiredEnvVars[env].length} required variables`)
}

// Additional validation functions
function validateJWTSecret() {
  const jwtSecret = process.env.JWT_SECRET
  if (jwtSecret && jwtSecret.length < 32) {
    console.error(`❌ JWT_SECRET is too short (${jwtSecret.length} chars). Minimum 32 characters required.`)
    process.exit(1)
  }
}

function validateDatabaseURL() {
  const dbUrl = process.env.DATABASE_URL
  if (dbUrl && !dbUrl.startsWith('postgresql://')) {
    console.error(`❌ DATABASE_URL must start with 'postgresql://'`)
    process.exit(1)
  }
}

function validateCORS() {
  const storeCors = process.env.STORE_CORS
  const adminCors = process.env.ADMIN_CORS
  
  if (process.env.NODE_ENV === 'production') {
    if (storeCors && storeCors.includes('localhost')) {
      console.error(`❌ STORE_CORS contains localhost in production`)
      process.exit(1)
    }
    if (adminCors && adminCors.includes('localhost')) {
      console.error(`❌ ADMIN_CORS contains localhost in production`)
      process.exit(1)
    }
  }
}

// Run all validations
try {
  validateEnvironment()
  validateJWTSecret()
  validateDatabaseURL()
  validateCORS()
  
  console.log(`\n🎉 All environment validations passed!`)
} catch (error) {
  console.error(`\n💥 Environment validation failed:`, error.message)
  process.exit(1)
}
