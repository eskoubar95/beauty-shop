#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex')
}

function setupEnvironment(env) {
  const templateFile = env === 'local' ? '.env.local.example' : 
                      env === 'production' ? '.env.production.example' : 
                      '.env.example'
  const targetFile = env === 'production' ? '.env.production' : 
                    env === 'local' ? '.env.local' : 
                    '.env'
  
  console.log(`🔧 Setting up ${env} environment...`)
  
  if (!fs.existsSync(templateFile)) {
    console.error(`❌ Template file ${templateFile} not found`)
    console.error(`Available templates:`)
    const exampleFiles = fs.readdirSync('.').filter(f => f.startsWith('.env') && f.endsWith('.example'))
    exampleFiles.forEach(f => console.error(`  - ${f}`))
    process.exit(1)
  }
  
  if (fs.existsSync(targetFile)) {
    console.log(`⚠️  ${targetFile} already exists, skipping...`)
    console.log(`   To overwrite, delete the file first`)
    return
  }
  
  let content = fs.readFileSync(templateFile, 'utf8')
  
  // Replace placeholder values
  content = content.replace(/\[GENERATE_SECURE_RANDOM_STRING\]/g, generateSecret())
  content = content.replace(/your-jwt-secret-here/g, generateSecret())
  content = content.replace(/your-cookie-secret-here/g, generateSecret())
  
  // Add timestamp comment
  const timestamp = new Date().toISOString()
  content = `# Generated on ${timestamp}\n# DO NOT COMMIT THIS FILE TO GIT\n\n${content}`
  
  fs.writeFileSync(targetFile, content)
  console.log(`✅ Created ${targetFile}`)
  console.log(`   Generated secure secrets for JWT and cookies`)
  console.log(`   Remember to fill in your actual service keys`)
}

function showUsage() {
  console.log(`Usage: node scripts/setup-env.js [environment]`)
  console.log(``)
  console.log(`Environments:`)
  console.log(`  development  - Create .env file (default)`)
  console.log(`  production   - Create .env.production file`)
  console.log(`  local        - Create .env.local file (frontend)`)
  console.log(``)
  console.log(`Examples:`)
  console.log(`  node scripts/setup-env.js`)
  console.log(`  node scripts/setup-env.js development`)
  console.log(`  node scripts/setup-env.js production`)
}

// Main execution
const env = process.argv[2] || 'development'

if (env === 'help' || env === '--help' || env === '-h') {
  showUsage()
  process.exit(0)
}

const validEnvs = ['development', 'production', 'local']
if (!validEnvs.includes(env)) {
  console.error(`❌ Invalid environment: ${env}`)
  console.error(`Valid environments: ${validEnvs.join(', ')}`)
  showUsage()
  process.exit(1)
}

try {
  setupEnvironment(env)
  console.log(`\n🎉 Environment setup complete!`)
  console.log(`Next steps:`)
  console.log(`1. Fill in your actual service keys`)
  console.log(`2. Run: npm run env:validate`)
  console.log(`3. Run: npm run env:health`)
} catch (error) {
  console.error(`\n💥 Setup failed:`, error.message)
  process.exit(1)
}
