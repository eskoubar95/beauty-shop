#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function auditSecrets() {
  console.log('🔒 Running security audit...\n')
  
  const issues = []
  const warnings = []
  
  // Check for .env files in git
  const envFiles = ['.env', '.env.local', '.env.production']
  envFiles.forEach(file => {
    if (fs.existsSync(file)) {
      warnings.push(`⚠️  ${file} exists - ensure it's in .gitignore`)
    }
  })
  
  // Check .gitignore
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8')
    if (!gitignore.includes('.env')) {
      issues.push('❌ .env not in .gitignore')
    }
    if (!gitignore.includes('.env*')) {
      warnings.push('⚠️  Consider adding .env* to .gitignore for better coverage')
    }
  } else {
    issues.push('❌ .gitignore file not found')
  }
  
  // Check for hardcoded secrets in code
  const codePatterns = [
    { pattern: /sk_live_[a-zA-Z0-9]+/, name: 'Live Stripe key' },
    { pattern: /sk_test_[a-zA-Z0-9]+/, name: 'Test Stripe key' },
    { pattern: /pk_live_[a-zA-Z0-9]+/, name: 'Live Stripe publishable key' },
    { pattern: /pk_test_[a-zA-Z0-9]+/, name: 'Test Stripe publishable key' },
    { pattern: /whsec_[a-zA-Z0-9]+/, name: 'Stripe webhook secret' },
    { pattern: /sk_live_[a-zA-Z0-9]+/, name: 'Live Clerk key' },
    { pattern: /sk_test_[a-zA-Z0-9]+/, name: 'Test Clerk key' },
    { pattern: /pk_live_[a-zA-Z0-9]+/, name: 'Live Clerk publishable key' },
    { pattern: /pk_test_[a-zA-Z0-9]+/, name: 'Test Clerk publishable key' },
    { pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/, name: 'JWT token' },
    { pattern: /postgresql:\/\/[^:]+:[^@]+@/, name: 'Database URL with credentials' }
  ]
  
  // Scan common code directories
  const codeDirs = ['src', 'app', 'lib', 'components', 'pages']
  codeDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      scanDirectory(dir, codePatterns, issues)
    }
  })
  
  // Check for weak JWT secrets
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      issues.push('❌ JWT_SECRET is too short (minimum 32 characters)')
    }
    if (process.env.JWT_SECRET === 'your-jwt-secret-here') {
      issues.push('❌ JWT_SECRET is still using placeholder value')
    }
  }
  
  // Check for test keys in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.STRIPE_API_KEY && process.env.STRIPE_API_KEY.startsWith('sk_test_')) {
      issues.push('❌ Using test Stripe key in production')
    }
    if (process.env.CLERK_SECRET_KEY && process.env.CLERK_SECRET_KEY.startsWith('sk_test_')) {
      issues.push('❌ Using test Clerk key in production')
    }
  }
  
  // Display results
  if (issues.length === 0 && warnings.length === 0) {
    console.log('✅ Security audit passed - no issues found')
  } else {
    if (issues.length > 0) {
      console.log('❌ Security issues found:')
      issues.forEach(issue => console.log(`  ${issue}`))
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  Security warnings:')
      warnings.forEach(warning => console.log(`  ${warning}`))
    }
  }
  
  return issues.length === 0
}

function scanDirectory(dir, patterns, issues) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name)
    
    if (file.isDirectory()) {
      scanDirectory(fullPath, patterns, issues)
    } else if (file.isFile() && /\.(js|ts|jsx|tsx)$/.test(file.name)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8')
        patterns.forEach(({ pattern, name }) => {
          if (pattern.test(content)) {
            issues.push(`❌ ${name} found in ${fullPath}`)
          }
        })
      } catch (error) {
        // Skip files that can't be read
      }
    }
  })
}

function checkEnvironmentSecurity() {
  console.log('🔍 Checking environment security...\n')
  
  const issues = []
  
  // Check for required environment variables
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'COOKIE_SECRET']
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      issues.push(`❌ Required environment variable ${varName} not set`)
    }
  })
  
  // Check for secure defaults
  if (process.env.NODE_ENV === 'production') {
    if (process.env.STORE_CORS && process.env.STORE_CORS.includes('localhost')) {
      issues.push('❌ STORE_CORS contains localhost in production')
    }
    if (process.env.ADMIN_CORS && process.env.ADMIN_CORS.includes('localhost')) {
      issues.push('❌ ADMIN_CORS contains localhost in production')
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ Environment security check passed')
  } else {
    console.log('❌ Environment security issues:')
    issues.forEach(issue => console.log(`  ${issue}`))
  }
  
  return issues.length === 0
}

// Main execution
async function runSecurityAudit() {
  console.log('🛡️  Beauty Shop Security Audit\n')
  console.log('=' .repeat(50))
  
  const secretsOk = auditSecrets()
  console.log('')
  const envOk = checkEnvironmentSecurity()
  
  console.log('\n' + '=' .repeat(50))
  
  if (secretsOk && envOk) {
    console.log('🎉 Security audit completed successfully!')
    console.log('✅ No security issues found')
    process.exit(0)
  } else {
    console.log('⚠️  Security audit completed with issues')
    console.log('❌ Please address the issues above before proceeding')
    process.exit(1)
  }
}

runSecurityAudit().catch(error => {
  console.error('💥 Security audit failed:', error.message)
  process.exit(1)
})
