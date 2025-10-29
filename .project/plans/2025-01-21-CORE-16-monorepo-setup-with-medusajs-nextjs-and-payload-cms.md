# Monorepo Setup with MedusaJS, Next.js, and Payload CMS Implementation Plan

## Overview
Opret moderne monorepo struktur med Turborepo og pnpm workspaces for at organisere vores multi-app projekt: MedusaJS 2.0 (e-commerce backend + admin), Next.js 15 (customer storefront), og Payload CMS (content management). Dette erstatter den nuværende ad-hoc struktur med en koordineret arkitektur der understøtter effektiv development workflow og build orchestration.

## Linear Issue
**Issue:** CORE-16  
**Status:** Planned  
**Priority:** Urgent  
**Labels:** high-risk, human-required, Infra

## Current State Analysis

### Key Discoveries:
- Root `package.json` eksisterer med basic scripts (ikke monorepo setup)
- `backend/` folder med MedusaJS 2.0 allerede installeret
- `supabase/` folder med konfiguration og linked projekt
- `scripts/` folder med environment setup utilities
- Ingen `apps/` eller `packages/` struktur endnu
- Environment variables delvist konfigureret

### Constraints:
- MedusaJS er allerede installeret med Supabase integration
- Supabase projekt er allerede linked (`aakjzquwftmtuzxjzxbv.supabase.co`)
- Backend folder skal flyttes til `apps/medusa/`
- Starter MedusaJS forfra for korrekt monorepo integration

## Desired End State

### Monorepo Structure:
```
beauty-shop/
├── apps/
│   ├── storefront/              # Next.js 15 (port 3000)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   │
│   ├── admin/                   # Payload CMS (port 3001)
│   │   ├── collections/
│   │   ├── payload.config.ts
│   │   └── package.json
│   │
│   └── medusa/                  # MedusaJS 2.0 (port 9000)
│       ├── src/
│       ├── medusa-config.js
│       └── package.json
│
├── packages/
│   ├── ui/                      # Shared React components
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── types/                   # Shared TypeScript types
│   │   ├── src/
│   │   └── package.json
│   │
│   └── config/                  # Shared configs
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── supabase/                    # Supabase migrations
│   ├── config.toml
│   └── migrations/
│       ├── 001_schema_separation.sql
│       └── 002_rls_policies.sql
│
├── turbo.json                   # Turborepo config
├── pnpm-workspace.yaml          # pnpm workspaces
├── package.json                 # Root package.json
└── .env.example                 # Environment template
```

### Success Criteria:
- [ ] `pnpm dev` starter alle apps parallelt
- [ ] Alle 3 apps accessible på deres respektive ports
- [ ] Database connection verificeret for MedusaJS og Payload
- [ ] Shared packages kan importeres på tværs af apps
- [ ] Type checking fungerer korrekt
- [ ] Build succeeds: `pnpm build`

## What We're NOT Doing
- Bevare eksisterende MedusaJS setup (starter forfra for korrekt integration)
- Oprette separate GitHub repositories
- Konfigurere CI/CD pipeline (Phase 2)
- Implementere authentication (Phase 2)
- Oprette produkter eller content (Phase 2)

## Implementation Approach
Incremental setup med pause points efter hver fase for validering. Starter med backup strategy, derefter monorepo foundation og bygger op til fuld integration.

## Rollback Strategy
Hvis monorepo setup fejler på noget tidspunkt:

### Quick Rollback:
1. **Git stash/reset:** `git reset --hard HEAD` (hvis ikke committed)
2. **Restore from backup:** `cp -r .backup/pre-monorepo/* .` (se Phase 0)
3. **Verify original state:** `npm run dev` (original scripts)

### Recovery Plan:
- Phase 1 failure → Restore original structure, delete `apps/` og `packages/`
- Phase 2 failure → Run `supabase db reset` til tidligere migration
- Phase 3-6 failure → Continue med fewer apps, remove failing workspace

### Feature Flag:
Ikke applicable for infrastructure setup (ingen runtime feature flag)

---

## Phase 0: Backup & Preparation

### Overview
Opret backup af nuværende setup og valider environment variables før monorepo transformation.

### Changes Required:

#### 1. Create backup directory
**File:** `.backup/` (directory)
**Changes:** Backup current state
```bash
mkdir -p .backup/pre-monorepo
cp -r backend .backup/pre-monorepo/
cp package.json .backup/pre-monorepo/
cp package-lock.json .backup/pre-monorepo/ 2>/dev/null || true
```
**Rationale:** Enable quick rollback if setup fails.

#### 2. Create environment validation script
**File:** `scripts/validate-env.js`
**Changes:** Validate all required environment variables
```javascript
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
  
  const envFile = '.env'
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
```
**Rationale:** Catch missing environment variables early to prevent silent failures.

#### 3. Update root package.json with validation script
**File:** `package.json`
**Changes:** Add env:validate script
```json
{
  "scripts": {
    "env:validate": "node scripts/validate-env.js",
    "env:setup": "node scripts/setup-env.js",
    "backup:create": "mkdir -p .backup/pre-monorepo && cp -r backend package.json package-lock.json .backup/pre-monorepo/ 2>/dev/null || true",
    "backup:restore": "cp -r .backup/pre-monorepo/* . && echo 'Backup restored. Run npm install to restore dependencies.'"
  }
}
```
**Rationale:** Easy access to validation and backup commands.

### Success Criteria:

#### Automated Verification:
- [ ] Backup created: `ls .backup/pre-monorepo/`
- [ ] Environment validates: `npm run env:validate`

#### Manual Verification:
- [ ] Backup directory contains current backend
- [ ] All required env vars are present and valid
- [ ] No placeholder values in production-critical vars

**⚠️ PAUSE HERE** - Manual approval before Phase 1

---

## Phase 1: Monorepo Foundation

### Overview
Opret grundlæggende monorepo struktur med Turborepo og pnpm workspaces. Flyt eksisterende backend og konfigurer root scripts.

### Changes Required:

#### 1. Install Turborepo and pnpm
**File:** `package.json`
**Changes:** Add Turborepo and configure pnpm workspaces
```json
{
  "name": "beauty-shop",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^1.10.12"
  },
  "packageManager": "pnpm@8.10.0"
}
```
**Rationale:** Turborepo giver effektiv build orchestration og caching. pnpm workspaces håndterer dependencies optimalt.

#### 2. Create pnpm-workspace.yaml
**File:** `pnpm-workspace.yaml`
**Changes:** Define workspace structure
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```
**Rationale:** pnpm workspace configuration for monorepo management.

#### 3. Create turbo.json
**File:** `turbo.json`
**Changes:** Configure Turborepo pipeline
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "test": {
      "dependsOn": ["^test"]
    }
  }
}
```
**Rationale:** Turborepo pipeline configuration for optimal build performance.

#### 4. Create apps directory structure
**File:** `apps/` (directory)
**Changes:** Create directory structure
```bash
mkdir -p apps/storefront apps/admin apps/medusa
```
**Rationale:** Organize apps in dedicated directory.

#### 5. Create packages directory structure
**File:** `packages/` (directory)
**Changes:** Create directory structure
```bash
mkdir -p packages/ui packages/types packages/config
```
**Rationale:** Organize shared packages in dedicated directory.

#### 6. Move existing backend
**File:** `backend/` → `apps/medusa/`
**Changes:** Move existing MedusaJS installation
```bash
mv backend/* apps/medusa/
rmdir backend
```
**Rationale:** Integrate existing backend into monorepo structure.

#### 7. Update .gitignore
**File:** `.gitignore`
**Changes:** Add monorepo-specific ignores
```gitignore
# Turborepo
.turbo

# pnpm
.pnpm-store

# Apps
apps/*/node_modules
apps/*/.next
apps/*/dist

# Packages
packages/*/node_modules
packages/*/dist

# Backup
.backup/
```
**Rationale:** Ignore monorepo-specific build artifacts, dependencies, and backup directory.

### Success Criteria:

#### Automated Verification:
- [ ] Turborepo installs: `pnpm install`
- [ ] Workspace structure created: `ls apps/ packages/`
- [ ] Backend moved: `ls apps/medusa/`
- [ ] pnpm workspaces work: `pnpm -r list`

#### Manual Verification:
- [ ] Directory structure matches expected layout
- [ ] No broken symlinks or missing files
- [ ] Root package.json scripts work

**⚠️ PAUSE HERE** - Manual approval before Phase 2

---

## Phase 2: Schema Separation & Database Setup

### Overview
Opret separate Supabase schemas for MedusaJS, Beauty Shop custom data, og Payload CMS. Konfigurer RLS policies med Clerk authentication.

### Changes Required:

#### 1. Create schema separation migration
**File:** `supabase/migrations/001_schema_separation.sql`
**Changes:** Create separate schemas
```sql
-- Create separate schemas
CREATE SCHEMA IF NOT EXISTS medusa;       -- MedusaJS tables
CREATE SCHEMA IF NOT EXISTS beauty_shop;  -- Custom Beauty Shop tables
CREATE SCHEMA IF NOT EXISTS payload;      -- Payload CMS tables

-- Grant permissions
GRANT USAGE ON SCHEMA medusa TO postgres;
GRANT USAGE ON SCHEMA beauty_shop TO postgres;
GRANT USAGE ON SCHEMA payload TO postgres;
```
**Rationale:** Separate schemas prevent conflicts between different systems.

#### 2. Create RLS policies migration
**File:** `supabase/migrations/002_rls_policies.sql`
**Changes:** Configure RLS with Clerk
```sql
-- Enable RLS on beauty_shop schema
ALTER SCHEMA beauty_shop OWNER TO postgres;

-- Create user_profiles table
CREATE TABLE beauty_shop.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES medusa.customer(id),
  phone VARCHAR(20),
  skin_type VARCHAR(50),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE beauty_shop.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies with Clerk
CREATE POLICY "Users can view own profile" ON beauty_shop.user_profiles
  FOR SELECT USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can update own profile" ON beauty_shop.user_profiles
  FOR UPDATE USING (auth.jwt() ->> 'sub' = clerk_user_id);
```
**Rationale:** RLS policies ensure data privacy and security with Clerk authentication.

#### 3. Update Supabase config
**File:** `supabase/config.toml`
**Changes:** Add new schemas to API
```toml
[api]
schemas = ["public", "graphql_public", "medusa", "beauty_shop", "payload"]
```
**Rationale:** Expose new schemas through Supabase API.

#### 4. Create environment template
**File:** `.env.example`
**Changes:** Add all required environment variables
```env
# Supabase Configuration
SUPABASE_URL=https://aakjzquwftmtuzxjzxbv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:6swY4T5vVR4KpxdM@db.aakjzquwftmtuzxjzxbv.supabase.co:5432/postgres

# MedusaJS Configuration
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_ADMIN_URL=http://localhost:9000/app

# Payload CMS Configuration
PAYLOAD_SECRET=your-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```
**Rationale:** Template for all required environment variables.

### Success Criteria:

#### Automated Verification:
- [ ] Migration runs: `supabase db push`
- [ ] Schemas created: `supabase db diff`
- [ ] RLS policies active: `supabase db diff`

#### Manual Verification:
- [ ] Supabase Studio shows new schemas
- [ ] RLS policies work with test user
- [ ] Environment variables validate

**⚠️ PAUSE HERE** - Manual approval before Phase 3

---

## Phase 3: Shared Packages Creation

### Overview
Opret shared packages for UI komponenter, TypeScript types, og konfigurationer der kan deles på tværs af apps.

### Changes Required:

#### 1. Create UI package
**File:** `packages/ui/package.json`
**Changes:** Create shared UI components package
```json
{
  "name": "@beauty-shop/ui",
  "version": "0.0.1",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tsup": "^7.2.0",
    "typescript": "^5.0.0"
  }
}
```
**Rationale:** Shared UI components reduce duplication and ensure consistency.

#### 2. Create types package
**File:** `packages/types/package.json`
**Changes:** Create shared types package
```json
{
  "name": "@beauty-shop/types",
  "version": "0.0.1",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```
**Rationale:** Shared types ensure consistency across apps and packages.

#### 3. Create config package
**File:** `packages/config/package.json`
**Changes:** Create shared config package
```json
{
  "name": "@beauty-shop/config",
  "version": "0.0.1",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "eslint": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```
**Rationale:** Shared configurations ensure consistent tooling across apps.

#### 4. Create basic UI components
**File:** `packages/ui/src/Button.tsx`
**Changes:** Create basic Button component
```typescript
import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```
**Rationale:** Basic UI components for consistent design system.

#### 5. Create shared types
**File:** `packages/types/src/index.ts`
**Changes:** Create shared type definitions
```typescript
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

export interface Product {
  id: string
  title: string
  handle: string
  price: number
  images: string[]
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
}
```
**Rationale:** Shared types ensure consistency across apps.

#### 6. Create shared configs
**File:** `packages/config/eslint/base.js`
**Changes:** Create shared ESLint config
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
```
**Rationale:** Shared ESLint config ensures consistent code quality.

#### 7. Configure bundle optimization
**File:** `packages/ui/tsup.config.ts`
**Changes:** Configure tsup for tree-shaking and optimization
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: 'terser',
  external: ['react', 'react-dom']
})
```
**Rationale:** Enable tree-shaking and minimize bundle size for shared packages.

#### 8. Create bundle analysis script
**File:** `scripts/analyze-bundle.js`
**Changes:** Create bundle analysis tool
```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function analyzeBundle() {
  console.log('📦 Analyzing bundle sizes...\n')
  
  const packages = ['ui', 'types', 'config']
  let totalSize = 0
  
  packages.forEach(pkg => {
    const distPath = path.join('packages', pkg, 'dist')
    if (!fs.existsSync(distPath)) {
      console.warn(`⚠️  ${pkg}: dist/ not found (run pnpm build first)`)
      return
    }
    
    let pkgSize = 0
    const files = fs.readdirSync(distPath)
    
    files.forEach(file => {
      const filePath = path.join(distPath, file)
      const stats = fs.statSync(filePath)
      if (stats.isFile()) {
        pkgSize += stats.size
      }
    })
    
    totalSize += pkgSize
    const sizeKB = (pkgSize / 1024).toFixed(2)
    console.log(`  ${pkg}: ${sizeKB} KB`)
  })
  
  const totalKB = (totalSize / 1024).toFixed(2)
  console.log(`\n  Total: ${totalKB} KB`)
  
  if (totalSize > 500 * 1024) {
    console.warn('\n⚠️  Warning: Total bundle size exceeds 500KB')
    console.warn('   Consider code splitting or lazy loading')
  } else {
    console.log('\n✅ Bundle size is optimal')
  }
}

try {
  analyzeBundle()
} catch (error) {
  console.error('\n💥 Analysis failed:', error.message)
  process.exit(1)
}
```
**Rationale:** Monitor bundle sizes to prevent bloat.

#### 9. Update package.json with bundle analysis
**File:** `package.json` (root)
**Changes:** Add bundle analysis script
```json
{
  "scripts": {
    "analyze": "pnpm -r build && node scripts/analyze-bundle.js"
  }
}
```
**Rationale:** Easy access to bundle analysis.

### Success Criteria:

#### Automated Verification:
- [ ] Packages build: `pnpm -r build`
- [ ] Type checking works: `pnpm -r typecheck`
- [ ] Linting works: `pnpm -r lint`
- [ ] Bundle analysis runs: `pnpm run analyze`
- [ ] Bundle size < 500KB: Check output from analyze script

#### Manual Verification:
- [ ] UI components render correctly
- [ ] Types are properly exported
- [ ] Configs are properly shared
- [ ] Tree-shaking works (test unused exports not in bundle)

**⚠️ PAUSE HERE** - Manual approval before Phase 4

---

## Phase 4: Next.js Storefront Setup

### Overview
Installer Next.js 15 i `apps/storefront/` og konfigurer MedusaJS client integration med shared packages.

### Changes Required:

#### 1. Create Next.js app
**File:** `apps/storefront/package.json`
**Changes:** Create Next.js 15 app
```json
{
  "name": "@beauty-shop/storefront",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@beauty-shop/ui": "workspace:*",
    "@beauty-shop/types": "workspace:*",
    "@medusajs/medusa-js": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```
**Rationale:** Next.js 15 with App Router for modern React development.

#### 2. Configure Next.js
**File:** `apps/storefront/next.config.js`
**Changes:** Configure Next.js for monorepo
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@beauty-shop/ui', '@beauty-shop/types'],
  experimental: {
    externalDir: true
  }
}

module.exports = nextConfig
```
**Rationale:** Configure Next.js to work with monorepo packages.

#### 3. Create MedusaJS client with error handling
**File:** `apps/storefront/lib/medusa.ts`
**Changes:** Configure MedusaJS client with error handling
```typescript
import Medusa from '@medusajs/medusa-js'

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000'

// Validate backend URL
if (!MEDUSA_BACKEND_URL) {
  throw new Error('NEXT_PUBLIC_MEDUSA_URL is not configured')
}

const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3
})

// Test connection helper
export async function testMedusaConnection(): Promise<boolean> {
  try {
    await medusa.regions.list()
    return true
  } catch (error) {
    console.error('Medusa connection failed:', error)
    return false
  }
}

export default medusa
```
**Rationale:** MedusaJS client with validation and connection testing.

#### 3b. Create error boundary
**File:** `apps/storefront/components/ErrorBoundary.tsx`
**Changes:** Create error boundary for API failures
```typescript
'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Der opstod en fejl</h2>
            <p className="text-gray-600 mb-4">
              Vi kunne ikke indlæse siden. Prøv venligst igen.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Prøv igen
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```
**Rationale:** Graceful error handling for React components.

#### 4. Create basic pages with error boundary
**File:** `apps/storefront/app/page.tsx`
**Changes:** Create homepage with error handling
```typescript
import { Button } from '@beauty-shop/ui'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div>
        <h1>Beauty Shop</h1>
        <Button variant="primary">Shop Now</Button>
      </div>
    </ErrorBoundary>
  )
}
```
**Rationale:** Basic homepage with error boundary for resilience.

#### 4b. Create connection test page
**File:** `apps/storefront/app/health/page.tsx`
**Changes:** Create health check page
```typescript
import { testMedusaConnection } from '@/lib/medusa'

export default async function HealthPage() {
  const medusaHealthy = await testMedusaConnection()
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">System Health</h1>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Medusa Backend: </span>
          <span className={medusaHealthy ? 'text-green-600' : 'text-red-600'}>
            {medusaHealthy ? '✓ Connected' : '✗ Disconnected'}
          </span>
        </div>
      </div>
    </div>
  )
}
```
**Rationale:** Test page for verifying API connections during development.

#### 5. Configure TypeScript
**File:** `apps/storefront/tsconfig.json`
**Changes:** Configure TypeScript for monorepo
```json
{
  "extends": "@beauty-shop/config/typescript/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@beauty-shop/ui": ["../../packages/ui/src"],
      "@beauty-shop/types": ["../../packages/types/src"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```
**Rationale:** TypeScript configuration for monorepo with path mapping.

### Success Criteria:

#### Automated Verification:
- [ ] Next.js builds: `pnpm --filter storefront build`
- [ ] Type checking works: `pnpm --filter storefront typecheck`
- [ ] Linting works: `pnpm --filter storefront lint`

#### Manual Verification:
- [ ] Storefront runs on port 3000
- [ ] UI components render correctly
- [ ] Health page shows Medusa connection status: http://localhost:3000/health
- [ ] Error boundary catches and displays errors gracefully
- [ ] API connection failures show user-friendly messages

**⚠️ PAUSE HERE** - Manual approval before Phase 5

---

## Phase 5: Payload CMS Setup

### Overview
Installer Payload CMS i `apps/admin/` og konfigurer Supabase integration med content collections.

### Changes Required:

#### 1. Create Payload CMS app
**File:** `apps/admin/package.json`
**Changes:** Create Payload CMS app
```json
{
  "name": "@beauty-shop/admin",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "payload dev",
    "build": "payload build",
    "start": "payload start",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "payload": "^2.0.0",
    "@payloadcms/db-postgres": "^2.0.0",
    "@payloadcms/bundler-webpack": "^2.0.0",
    "@payloadcms/richtext-slate": "^2.0.0",
    "@beauty-shop/types": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```
**Rationale:** Payload CMS for content management with Supabase integration.

#### 2. Configure Payload with error handling
**File:** `apps/admin/payload.config.ts`
**Changes:** Configure Payload with Supabase and error handling
```typescript
import { buildConfig } from 'payload/config'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'

// Validate required environment variables
const DATABASE_URL = process.env.DATABASE_URL
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required for Payload CMS')
}

if (!PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is required for Payload CMS')
}

export default buildConfig({
  admin: {
    user: 'users',
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  db: postgresAdapter({
    pool: {
      connectionString: DATABASE_URL,
    },
    // Add connection error handling
    migrationDir: path.resolve(__dirname, './migrations'),
  }),
  collections: [
    {
      name: 'users',
      auth: true,
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          unique: true,
        },
      ],
    },
    {
      name: 'blog-posts',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
        },
      ],
    },
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    console.log('✅ Payload CMS initialized successfully')
    
    // Test database connection
    try {
      await payload.find({
        collection: 'users',
        limit: 1,
      })
      console.log('✅ Database connection verified')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw error
    }
  },
})
```
**Rationale:** Payload configuration with environment validation and connection testing.

#### 2b. Create database connection health check
**File:** `apps/admin/src/utils/db-health.ts`
**Changes:** Create database health check utility
```typescript
import payload from 'payload'

export async function checkDatabaseHealth(): Promise<{
  healthy: boolean
  error?: string
}> {
  try {
    // Test read operation
    await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    return { healthy: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Database health check failed:', errorMessage)
    return { healthy: false, error: errorMessage }
  }
}

export async function testPayloadConnection(): Promise<boolean> {
  const result = await checkDatabaseHealth()
  return result.healthy
}
```
**Rationale:** Utility for testing Payload database connections.

#### 3. Create content collections
**File:** `apps/admin/collections/BlogPost.ts`
**Changes:** Create blog post collection
```typescript
import { CollectionConfig } from 'payload/types'

export const BlogPost: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
```
**Rationale:** Content collections for blog posts and media.

#### 4. Configure TypeScript
**File:** `apps/admin/tsconfig.json`
**Changes:** Configure TypeScript for Payload
```json
{
  "extends": "@beauty-shop/config/typescript/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@beauty-shop/types": ["../../packages/types/src"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```
**Rationale:** TypeScript configuration for Payload CMS.

### Success Criteria:

#### Automated Verification:
- [ ] Payload builds: `pnpm --filter admin build`
- [ ] Type checking works: `pnpm --filter admin typecheck`
- [ ] Environment variables validate: `npm run env:validate`

#### Manual Verification:
- [ ] Admin panel runs on port 3001
- [ ] Login page accessible at http://localhost:3001/admin
- [ ] Database connection verified (check console logs on startup)
- [ ] Content collections are accessible
- [ ] Can create and save test blog post
- [ ] Database health check passes
- [ ] Error messages display if database connection fails

**⚠️ PAUSE HERE** - Manual approval before Phase 6

---

## Phase 6: Integration Testing & Workflow

### Overview
Test fuld integration af monorepo med alle apps kørende parallelt. Verificer hot reload, build orchestration, og environment variables.

### Changes Required:

#### 1. Test parallel development
**File:** `package.json`
**Changes:** Verify dev script works
```bash
pnpm dev
```
**Rationale:** Test that all apps start in parallel.

#### 2. Test build orchestration
**File:** `package.json`
**Changes:** Verify build script works
```bash
pnpm build
```
**Rationale:** Test that all apps build successfully.

#### 3. Test cross-package imports
**File:** `apps/storefront/app/test/page.tsx`
**Changes:** Test shared package imports
```typescript
import { Button } from '@beauty-shop/ui'
import { User } from '@beauty-shop/types'

export default function TestPage() {
  return (
    <div>
      <Button>Test Button</Button>
      <p>User type: {typeof User}</p>
    </div>
  )
}
```
**Rationale:** Verify shared packages work across apps.

#### 4. Test environment variables
**File:** `scripts/test-integration.js`
**Changes:** Create integration test script
```javascript
const { execSync } = require('child_process')

function testIntegration() {
  console.log('🧪 Testing monorepo integration...')
  
  // Test dev command
  console.log('Testing dev command...')
  execSync('pnpm dev --dry-run', { stdio: 'inherit' })
  
  // Test build command
  console.log('Testing build command...')
  execSync('pnpm build --dry-run', { stdio: 'inherit' })
  
  console.log('✅ Integration tests passed!')
}

testIntegration()
```
**Rationale:** Automated integration testing.

#### 5. Create README
**File:** `README.md`
**Changes:** Update README with monorepo instructions
```markdown
# Beauty Shop Monorepo

Modern hudplejeunivers der kombinerer koreansk innovation med nordisk enkelhed.

## Apps

- **Storefront** (`apps/storefront/`) - Next.js 15 customer storefront
- **Admin** (`apps/admin/`) - Payload CMS content management
- **Medusa** (`apps/medusa/`) - MedusaJS e-commerce backend

## Packages

- **UI** (`packages/ui/`) - Shared React components
- **Types** (`packages/types/`) - Shared TypeScript types
- **Config** (`packages/config/`) - Shared configurations

## Development

```bash
# Install dependencies
pnpm install

# Start all apps
pnpm dev

# Build all apps
pnpm build

# Run tests
pnpm test
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your service keys
3. Run `pnpm run env:validate`
```
**Rationale:** Documentation for monorepo usage.

### Success Criteria:

#### Automated Verification:
- [ ] All apps start: `pnpm dev`
- [ ] All apps build: `pnpm build`
- [ ] Type checking works: `pnpm typecheck`
- [ ] Linting works: `pnpm lint`
- [ ] Tests pass: `pnpm test`

#### Manual Verification:
- [ ] Storefront accessible on http://localhost:3000
- [ ] Admin panel accessible on http://localhost:3001
- [ ] MedusaJS backend accessible on http://localhost:9000
- [ ] Hot reload test - Shared package:
  - Edit `packages/ui/src/Button.tsx` (change button text)
  - Verify storefront updates without restart (< 2 seconds)
  - Verify no console errors
- [ ] Hot reload test - Storefront:
  - Edit `apps/storefront/app/page.tsx`
  - Verify page updates without restart (< 2 seconds)
- [ ] Hot reload test - Type changes:
  - Edit `packages/types/src/index.ts` (add new property)
  - Verify TypeScript picks up changes
  - Verify no build errors
- [ ] Cross-package imports work correctly
- [ ] Environment variables are properly loaded
- [ ] All health checks pass (storefront/health, Payload startup logs)

**⚠️ PAUSE HERE** - Final validation before completion

---

## Testing Strategy

### Unit Tests
- Test shared packages independently
- Test individual app components
- Test utility functions

### Integration Tests
- Test cross-package imports
- Test API connections
- Test database connections

### Manual Tests
- Test development workflow
- Test build process
- Test hot reload functionality

## References
- Linear: CORE-16
- Related files: `.project/02-Product_Requirements_Document.md`, `.project/03-Tech_Stack.md`, `.project/04-Database_Schema.md`
- Supabase project: https://aakjzquwftmtuzxjzxbv.supabase.co
- MedusaJS documentation: https://docs.medusajs.com/
- Next.js documentation: https://nextjs.org/docs
- Payload CMS documentation: https://payloadcms.com/docs
