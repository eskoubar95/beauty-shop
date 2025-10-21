# Environment Configuration Implementation Plan

## Overview
Konfigurer alle environment variables og secrets for development og production environments. Dette er et kritisk foundation ticket der skal løses først, da det blokerer andre CORE tickets.

## Linear Issue
**Issue:** CORE-15 - Environment Configuration  
**Status:** Planned  
**Priority:** Urgent  
**Assignee:** Nicklas Eskou  
**Labels:** high-risk, human-required, Infra

## Current State Analysis

### Key Discoveries:
- Projektet er i initial setup fase (kun package.json og README)
- Ingen eksisterende environment konfiguration
- Secrets check script allerede implementeret i package.json
- Ingen .env filer eksisterer endnu
- Tech stack defineret i `.project/03-Tech_Stack.md`

### What Exists:
- Basic package.json med scripts
- Git repository setup
- Secrets check script: `secrets:check` (linje 16 i package.json)

### What's Missing:
- Environment variable templates (.env.example files)
- Secrets management documentation
- Environment validation scripts
- Security guidelines implementation
- Production vs development environment setup

## Desired End State
- Development environment konfigureret med alle nødvendige variabler
- Production environment konfigureret med sikre secrets
- Secrets management workflow dokumenteret
- Environment validation implementeret
- Security review checklist klar
- Alle environments fungerer korrekt

## What We're NOT Doing
- Implementering af faktiske secrets (kun templates og dokumentation)
- Setup af faktiske tredjepartstjenester (kun konfiguration)
- Database migration eller schema ændringer
- Frontend/backend kode implementering

## Implementation Approach
Følg security-first approach med dokumentation og templates først, derefter validation og sikkerhedscheck.

## Phase 1: Environment Variable Schema Definition

### Overview
Definer alle nødvendige environment variables baseret på tech stack og backend/frontend guides.

### Changes Required:

#### 1. Backend Environment Template
**File:** `.env.example` (backend)
**Changes:** Opret template med alle backend environment variables
```bash
# Database
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
REDIS_URL="redis://localhost:6379"

# MedusaJS
MEDUSA_ADMIN_ONBOARDING_TYPE="default"
MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY="../beauty-shop-frontend"
JWT_SECRET="your-jwt-secret-here"
COOKIE_SECRET="your-cookie-secret-here"

# Stripe
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Clerk
CLERK_SECRET_KEY="sk_test_..."
CLERK_PUBLISHABLE_KEY="pk_test_..."

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Sentry
SENTRY_DSN="https://..."

# App Configuration
NODE_ENV="development"
PORT=9000
STORE_CORS="http://localhost:8000,http://localhost:3000"
ADMIN_CORS="http://localhost:7001,http://localhost:3000"
```
**Rationale:** Backend har flest secrets og kræver omfattende konfiguration

#### 2. Frontend Environment Template
**File:** `.env.local.example` (frontend)
**Changes:** Opret template med alle frontend environment variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:9000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Sentry
NEXT_PUBLIC_SENTRY_DSN="https://..."

# Feature Flags (Post-MVP)
NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID="your-client-id"

# App Configuration
NODE_ENV="development"
```
**Rationale:** Frontend har færre secrets men kræver NEXT_PUBLIC_ prefix for client-side access

#### 3. Production Environment Template
**File:** `.env.production.example`
**Changes:** Opret production template med sikre defaults
```bash
# Production Environment Template
# WARNING: Never commit actual production secrets to git
# Use secure secret management service (Vercel, AWS, etc.)

# Database
DATABASE_URL="postgresql://..."

# MedusaJS
JWT_SECRET="[GENERATE_SECURE_RANDOM_STRING]"
COOKIE_SECRET="[GENERATE_SECURE_RANDOM_STRING]"

# Stripe (Live keys)
STRIPE_API_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Clerk (Live keys)
CLERK_SECRET_KEY="sk_live_..."
CLERK_PUBLISHABLE_KEY="pk_live_..."

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Sentry
SENTRY_DSN="https://..."

# App Configuration
NODE_ENV="production"
PORT=9000
STORE_CORS="https://beautyshop.com,https://www.beautyshop.com"
ADMIN_CORS="https://admin.beautyshop.com"
```
**Rationale:** Production kræver ekstra sikkerhed og live keys

### Success Criteria:

#### Automated Verification:
- [ ] Backend .env.example oprettet
- [ ] Frontend .env.local.example oprettet  
- [ ] Production .env.production.example oprettet
- [ ] Alle templates valideres: `npm run secrets:check`
- [ ] Type check: `npm run typecheck`
- [ ] Lint: `npm run lint`

#### Manual Verification:
- [ ] Alle nødvendige variabler inkluderet
- [ ] Ingen faktiske secrets i templates
- [ ] Kommentarer forklarer hver variabel
- [ ] Production template har sikkerhedsadvarsler

**⚠️ PAUSE HERE** - Manual approval before Phase 2

## Phase 2: Secrets Management Documentation

### Overview
Opret omfattende dokumentation for secrets management workflow og sikkerhedsretningslinjer.

### Changes Required:

#### 1. Secrets Management Guide
**File:** `.project/secrets-management.md`
**Changes:** Opret komplet guide for secrets management
```markdown
# Secrets Management Guide
**Beauty Shop - Environment Configuration & Security**

## Overview
Denne guide beskriver hvordan secrets og environment variables håndteres sikkert i Beauty Shop projektet.

## Security Principles
- Aldrig commit .env filer til git
- Brug environment-specific secret management
- Roter secrets regelmæssigt
- Minimal privilege access
- Audit trail for alle secret access

## Development Environment
1. Kopier .env.example til .env
2. Udfyld med test/development værdier
3. Brug test keys for alle tredjepartstjenester
4. Valider med `npm run secrets:check`

## Production Environment
1. Brug Vercel Environment Variables for frontend
2. Brug Render Environment Variables for backend
3. Brug AWS Secrets Manager for kritiske secrets
4. Implementer secret rotation

## Secret Rotation Schedule
- JWT secrets: Hver 90 dage
- API keys: Hver 180 dage
- Database passwords: Hver 365 dage

## Emergency Procedures
1. Roter kompromitterede secrets øjeblikkeligt
2. Revoke access til alle services
3. Genopret fra backup
4. Audit alle access logs
```
**Rationale:** Komplet dokumentation er kritisk for sikkerhed

#### 2. Environment Validation Script
**File:** `scripts/validate-env.js`
**Changes:** Opret script til environment validation
```javascript
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
  
  requiredEnvVars[env]?.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  })
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }
  
  console.log(`✅ Environment validation passed for ${env}`)
}

validateEnvironment()
```
**Rationale:** Automatisk validation forhindrer runtime fejl

#### 3. Security Checklist
**File:** `.project/security-checklist.md`
**Changes:** Opret security review checklist
```markdown
# Security Checklist
**Environment Configuration Review**

## Pre-Deployment Checklist
- [ ] Ingen .env filer i git history
- [ ] Alle secrets i secure secret management
- [ ] Production secrets er live keys (ikke test)
- [ ] CORS konfiguration er restriktiv
- [ ] JWT secrets er cryptographically strong
- [ ] Database connections bruger SSL
- [ ] Error messages indeholder ikke sensitive data

## Post-Deployment Verification
- [ ] Health check endpoints fungerer
- [ ] Database connection etableret
- [ ] External services (Stripe, Clerk) responderer
- [ ] Error tracking (Sentry) fungerer
- [ ] Logs indeholder ikke PII
```
**Rationale:** Struktureret checklist sikrer konsistent security review

### Success Criteria:

#### Automated Verification:
- [ ] Validation script kører: `node scripts/validate-env.js`
- [ ] Secrets check passerer: `npm run secrets:check`
- [ ] Type check: `npm run typecheck`
- [ ] Lint: `npm run lint`

#### Manual Verification:
- [ ] Dokumentation er komplet og klar
- [ ] Validation script tester alle environments
- [ ] Security checklist dækker alle kritiske punkter
- [ ] Workflow er praktisk og følges

**⚠️ PAUSE HERE** - Manual approval before Phase 3

## Phase 3: Environment Setup & Validation

### Overview
Implementer environment setup scripts og valider at alle environments fungerer korrekt.

### Changes Required:

#### 1. Environment Setup Script
**File:** `scripts/setup-env.js`
**Changes:** Opret script til environment setup
```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex')
}

function setupEnvironment(env) {
  const templateFile = `.env.${env}.example`
  const targetFile = env === 'production' ? '.env.production' : '.env'
  
  if (!fs.existsSync(templateFile)) {
    console.error(`❌ Template file ${templateFile} not found`)
    process.exit(1)
  }
  
  if (fs.existsSync(targetFile)) {
    console.log(`⚠️  ${targetFile} already exists, skipping...`)
    return
  }
  
  let content = fs.readFileSync(templateFile, 'utf8')
  
  // Replace placeholder values
  content = content.replace(/\[GENERATE_SECURE_RANDOM_STRING\]/g, generateSecret())
  content = content.replace(/your-jwt-secret-here/g, generateSecret())
  content = content.replace(/your-cookie-secret-here/g, generateSecret())
  
  fs.writeFileSync(targetFile, content)
  console.log(`✅ Created ${targetFile}`)
}

const env = process.argv[2] || 'development'
setupEnvironment(env)
```
**Rationale:** Automatiseret setup reducerer fejl og gør det nemt at starte

#### 2. Environment Health Check
**File:** `scripts/health-check.js`
**Changes:** Opret health check script
```javascript
#!/usr/bin/env node

const https = require('https')
const http = require('http')

async function checkService(url, name) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http
    
    const req = client.get(url, (res) => {
      resolve({ name, status: 'ok', code: res.statusCode })
    })
    
    req.on('error', (err) => {
      resolve({ name, status: 'error', error: err.message })
    })
    
    req.setTimeout(5000, () => {
      req.destroy()
      resolve({ name, status: 'timeout' })
    })
  })
}

async function healthCheck() {
  console.log('🔍 Running environment health check...\n')
  
  const checks = [
    { url: process.env.NEXT_PUBLIC_API_URL + '/health', name: 'Backend API' },
    { url: process.env.NEXT_PUBLIC_SITE_URL, name: 'Frontend' }
  ]
  
  for (const check of checks) {
    if (check.url) {
      const result = await checkService(check.url, check.name)
      const status = result.status === 'ok' ? '✅' : '❌'
      console.log(`${status} ${result.name}: ${result.status}`)
      if (result.error) console.log(`   Error: ${result.error}`)
    }
  }
}

healthCheck().catch(console.error)
```
**Rationale:** Health check validerer at alle services fungerer

#### 3. Package.json Scripts Update
**File:** `package.json`
**Changes:** Tilføj environment scripts
```json
{
  "scripts": {
    "env:setup": "node scripts/setup-env.js",
    "env:validate": "node scripts/validate-env.js",
    "env:health": "node scripts/health-check.js",
    "env:check": "npm run env:validate && npm run env:health"
  }
}
```
**Rationale:** Konsistente npm scripts gør environment management nemt

### Success Criteria:

#### Automated Verification:
- [ ] Setup script kører: `npm run env:setup`
- [ ] Validation script kører: `npm run env:validate`
- [ ] Health check kører: `npm run env:health`
- [ ] Alle scripts fungerer uden fejl
- [ ] Type check: `npm run typecheck`

#### Manual Verification:
- [ ] Environment filer oprettes korrekt
- [ ] Secrets genereres sikkert
- [ ] Health check tester alle services
- [ ] Scripts er brugervenlige

**⚠️ PAUSE HERE** - Manual approval before Phase 4

## Phase 4: Security Review & Documentation

### Overview
Gennemfør sikkerhedsreview og opdater dokumentation med lessons learned.

### Changes Required:

#### 1. Security Review Implementation
**File:** `scripts/security-audit.js`
**Changes:** Opret security audit script
```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function auditSecrets() {
  console.log('🔒 Running security audit...\n')
  
  const issues = []
  
  // Check for .env files in git
  const envFiles = ['.env', '.env.local', '.env.production']
  envFiles.forEach(file => {
    if (fs.existsSync(file)) {
      issues.push(`⚠️  ${file} exists - ensure it's in .gitignore`)
    }
  })
  
  // Check for hardcoded secrets in code
  const codeFiles = ['src/**/*.js', 'src/**/*.ts', 'app/**/*.js', 'app/**/*.ts']
  // Implementation would scan files for patterns like API keys
  
  // Check .gitignore
  const gitignore = fs.readFileSync('.gitignore', 'utf8')
  if (!gitignore.includes('.env')) {
    issues.push('❌ .env not in .gitignore')
  }
  
  if (issues.length === 0) {
    console.log('✅ Security audit passed')
  } else {
    console.log('Issues found:')
    issues.forEach(issue => console.log(issue))
  }
}

auditSecrets()
```
**Rationale:** Automatiseret security audit sikrer konsistent sikkerhed

#### 2. Final Documentation Update
**File:** `README.md`
**Changes:** Opdater README med environment setup instruktioner
```markdown
# Beauty Shop

## Environment Setup

### Development
1. Kopier environment template:
   ```bash
   cp .env.example .env
   cp .env.local.example .env.local
   ```

2. Udfyld med development værdier

3. Valider environment:
   ```bash
   npm run env:check
   ```

### Production
1. Konfigurer secrets i Vercel/Render
2. Valider med production environment
3. Kør security audit: `npm run security:audit`

## Commands
- `npm run env:setup` - Setup environment files
- `npm run env:validate` - Validate environment variables
- `npm run env:health` - Check service health
- `npm run security:audit` - Run security audit
```
**Rationale:** README giver hurtig reference for environment setup

#### 3. Security Guidelines
**File:** `.project/security-guidelines.md`
**Changes:** Opret detaljerede security guidelines
```markdown
# Security Guidelines
**Beauty Shop - Environment Security**

## Secret Management
- Brug environment variables for alle secrets
- Roter secrets regelmæssigt
- Brug forskellige secrets per environment
- Log secret access (men ikke secret værdier)

## Environment Separation
- Development: Test keys, local database
- Staging: Test keys, staging database  
- Production: Live keys, production database

## Access Control
- Minimal privilege principle
- Regular access review
- MFA for alle admin accounts
- Audit trail for alle changes

## Incident Response
1. Roter kompromitterede secrets øjeblikkeligt
2. Revoke access til alle services
3. Audit access logs
4. Update security procedures
```
**Rationale:** Detaljerede guidelines sikrer konsistent security practice

### Success Criteria:

#### Automated Verification:
- [ ] Security audit kører: `npm run security:audit`
- [ ] Alle environment scripts fungerer
- [ ] Documentation er opdateret
- [ ] Type check: `npm run typecheck`
- [ ] Lint: `npm run lint`

#### Manual Verification:
- [ ] Security review gennemført
- [ ] Alle secrets er sikre
- [ ] Dokumentation er komplet
- [ ] Workflow er testet og fungerer
- [ ] Team er trænet i procedures

**⚠️ PAUSE HERE** - Final review before completion

## Testing Strategy

### Unit Tests
- Environment validation functions
- Secret generation utilities
- Health check endpoints

### Integration Tests  
- Environment setup end-to-end
- Cross-service communication
- Error handling scenarios

### Security Tests
- Secret leakage detection
- Access control validation
- Audit trail verification

## References
- Linear: CORE-15
- Tech Stack: `.project/03-Tech_Stack.md`
- Backend Guide: `.project/06-Backend_Guide.md`
- Frontend Guide: `.project/07-Frontend_Guide.md`
- Security Rules: `.cursor/rules/22-security_secrets.md`

## Risk Mitigation

### High Risk Areas
- **Secret Management:** Brug secure secret management services
- **Environment Separation:** Strict separation mellem dev/prod
- **Access Control:** Minimal privilege, regular review

### Mitigation Strategies
- Automatiseret validation
- Security audit scripts
- Dokumenterede procedures
- Regular security reviews

## Success Metrics
- [ ] Alle environments fungerer
- [ ] Secrets er sikre og roteret
- [ ] Dokumentation er komplet
- [ ] Security review er godkendt
- [ ] Team kan følge procedures
- [ ] Ingen secrets i git history
- [ ] Automatiseret validation fungerer
