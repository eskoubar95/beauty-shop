#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const REQUIRED_VARS = {
  'SUPABASE_URL': 'Supabase project URL',
  'SUPABASE_ANON_KEY': 'Supabase anonymous key',
  'DATABASE_URL': 'PostgreSQL connection string',
}

const OPTIONAL_VARS = {
  'MEDUSA_BACKEND_URL': 'MedusaJS backend URL (default: http://localhost:9000)',
  'PAYLOAD_SECRET': 'Payload CMS secret key',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': 'Clerk publishable key',
}

function validateEnv() {
  console.log('🔍 Validating environment variables...\n')
  
  const envFile = 'beauty-shop/.env'
  if (!fs.existsSync(envFile)) {
    console.error('❌ .env file not found')
    console.error('   Run: node scripts/setup-env.js')
    process.exit(1)
  }
  
  const envContent = fs.readFileSync(envFile, 'utf8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      envVars[match[1].trim()] = match[2].trim()
    }
  })
  
  let missingVars = []
  let emptyVars = []
  
  // Check required variables
  for (const [varName, description] of Object.entries(REQUIRED_VARS)) {
    if (!envVars[varName]) {
      missingVars.push(`${varName} - ${description}`)
    } else if (envVars[varName].includes('your-') || envVars[varName].includes('...')) {
      emptyVars.push(`${varName} - ${description}`)
    }
  }
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:\n')
    missingVars.forEach(v => console.error(`   - ${v}`))
    process.exit(1)
  }
  
  if (emptyVars.length > 0) {
    console.warn('⚠️  Environment variables with placeholder values:\n')
    emptyVars.forEach(v => console.warn(`   - ${v}`))
    console.warn('\n   These must be filled with actual values before deployment\n')
  }
  
  // Check optional variables
  console.log('✅ Required environment variables present\n')
  console.log('ℹ️  Optional variables:')
  for (const [varName, description] of Object.entries(OPTIONAL_VARS)) {
    const status = envVars[varName] ? '✓' : '✗'
    console.log(`   ${status} ${varName}`)
  }
  
  console.log('\n🎉 Environment validation complete!')
}

try {
  validateEnv()
} catch (error) {
  console.error('\n💥 Validation failed:', error.message)
  process.exit(1)
}
