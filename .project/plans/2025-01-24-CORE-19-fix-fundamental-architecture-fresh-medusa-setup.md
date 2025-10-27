# Fix Fundamental Architecture - Fresh MedusaJS Setup Implementation Plan

## Overview
Redde Beauty Shop projektet fra fundamentale arkitekturfejl ved at starte forfra med korrekt MedusaJS installation. Vi kasserer den forkerte Turborepo monorepo struktur og følger Medusa's officielle best practices med integreret storefront og korrekt database setup.

## Linear Issue
**Issue:** CORE-19  
**Status:** In Progress  
**Priority:** Urgent  
**Labels:** high-risk, human-required, Infra  
**URL:** https://linear.app/beauty-shop/issue/CORE-19

## Current State Analysis

### What Exists Now (After Phase 1):
```
beauty-shop/
├── .backup/2025-01-24-failed-monorepo/  # Complete backup
├── .project/                            # Plans and documentation
├── scripts/                             # Utility scripts (preserved)
├── supabase/                            # Custom migrations (preserved)
├── .env                                 # Environment variables (preserved)
├── .git/                                # Git history (preserved)
├── README.md                            # Documentation (preserved)
└── [other config files]                 # Preserved
```

### What Was Removed (Phase 1):
- ❌ `apps/` directory (incorrect MedusaJS installation)
- ❌ `packages/` directory (unnecessary complexity)
- ❌ `turbo.json` (Turborepo config)
- ❌ `pnpm-workspace.yaml` (pnpm workspace config)
- ❌ `package.json` (root - will be replaced)
- ❌ `pnpm-lock.yaml` (lock file)
- ❌ `node_modules/` (will be recreated)

### What Was Preserved:
- ✅ Supabase projekt (already created and linked)
- ✅ Environment variables from CORE-15
- ✅ GitHub CI/CD from CORE-4
- ✅ Custom migrations in `supabase/migrations/`
- ✅ Scripts: `validate-env.js`, `health-check.js`
- ✅ Schema concepts (medusa, beauty_shop, payload)

## Desired End State

### Correct Structure (Per Medusa Docs):
```
beauty-shop-root/
├── beauty-shop/                   # MedusaJS backend + integrated admin
│   ├── src/
│   │   ├── admin/                 # MedusaJS admin customizations
│   │   ├── api/                   # Custom API routes
│   │   ├── modules/               # Custom modules
│   │   ├── workflows/             # Custom workflows
│   │   └── subscribers/           # Event handlers
│   ├── medusa-config.ts           # Medusa configuration
│   ├── .env                       # DATABASE_URL + config
│   └── package.json
│
├── beauty-shop-storefront/        # Next.js storefront (auto-created by CLI)
│   ├── src/
│   │   ├── app/                   # Next.js 15 App Router
│   │   ├── components/            # React components
│   │   └── lib/                   # Utilities
│   ├── .env.local                 # Storefront config
│   └── package.json
│
├── supabase/                      # Custom migrations only
│   ├── config.toml
│   └── migrations/
│       ├── 20250124000001_beauty_shop_tables.sql
│       └── 20250124000002_clerk_rls_policies.sql
│
├── scripts/                       # Utility scripts
│   ├── validate-env.js
│   └── health-check.js
│
├── .env.example                   # Environment template
└── README.md                      # Updated setup guide
```

---

## Phase 0: Pre-Flight Check & Preparation ✅

**Status:** COMPLETED

### Changes Completed:
- ✅ Supabase credentials verified
- ✅ Tooling versions checked
- ✅ Baseline performance measured
- ✅ Checklist file created

---

## Phase 1: Backup & Cleanup ✅

**Status:** COMPLETED

### Changes Completed:
- ✅ Backup created: `.backup/2025-01-24-failed-monorepo/`
- ✅ Git stash saved: `stash@{0}: CORE-19: Backup before architecture reset (2025-01-24)`
- ✅ Safety branch created: `core-16-failed-attempt`
- ✅ Genbrugelige filer identified: `SALVAGEABLE.md`
- ✅ apps/ deleted
- ✅ packages/ deleted
- ✅ turbo.json deleted
- ✅ pnpm-workspace.yaml deleted

---

## Phase 2A: Fresh MedusaJS Installation

### Overview
Installer MedusaJS korrekt med Medusa CLI og inkluder Next.js Starter Storefront. Dette er den kritiske installation fase.

### Changes Required:

#### 1. Run create-medusa-app with --skip-db
**Command:** Install MedusaJS + Storefront

```bash
# Navigate to project root
cd /Users/nicklaseskou/Documents/GitHub/beauty-shop

# Run Medusa CLI with --skip-db flag
npx create-medusa-app@latest beauty-shop --skip-db

# During installation prompts:
# "Would you like to install the Next.js Starter Storefront? You can also install it later."
# → Answer: YES

# This creates TWO directories:
# - beauty-shop/           (MedusaJS backend + admin)
# - beauty-shop-storefront/ (Next.js storefront)
```

**Rationale:** Korrekt installation per Medusa dokumentation, integreret storefront.

**Expected output:**
```
✓ Created project directory
✓ Installed Next.js Starter Storefront successfully in the beauty-shop-storefront directory.
✓ Installed Dependencies
✓ Finished Preparation

Change to the `beauty-shop` directory to explore your Medusa project.

Start your Medusa application again with the following command:

npm run dev
```

### Success Criteria:

#### Automated Verification:
```bash
# Check directory structure
test -d beauty-shop && test -d beauty-shop-storefront && echo "✅ Directories created"

# Check package.json files exist
test -f beauty-shop/package.json && test -f beauty-shop-storefront/package.json && echo "✅ Package files exist"
```

#### Manual Verification:
- [ ] `beauty-shop/` directory exists
- [ ] `beauty-shop-storefront/` directory exists
- [ ] Both directories have `package.json` files
- [ ] Installation completed without errors
- [ ] CLI prompts answered correctly (YES to storefront)

**⚠️ PAUSE HERE** - Manual approval before Phase 2B

---

## Phase 2B: Database Configuration & Testing

### Overview
Konfigurer Supabase database, kør migrations, og test at alt fungerer korrekt. Dette sikrer at installationen er funktionel.

### Changes Required:

#### 1. Configure MedusaJS .env with Supabase
**File:** `beauty-shop/.env`
**Changes:** Create environment configuration

```env
# Supabase Database Configuration
DATABASE_URL=postgresql://postgres.aakjzquwftmtuzxjzxbv:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
DATABASE_EXTRA={"ssl":{"rejectUnauthorized":false}}

# MedusaJS Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com

# Redis (optional for development)
REDIS_URL=redis://localhost:6379

# Secrets (generate secure values)
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
```

#### 2. Run MedusaJS Database Migrations
**Command:** Create MedusaJS tables automatically

```bash
# Navigate to MedusaJS directory
cd beauty-shop

# Run migrations (this creates all MedusaJS tables automatically)
npx medusa db:migrate
```

#### 3. Configure Next.js Storefront .env
**File:** `beauty-shop-storefront/.env.local`
**Changes:** Create storefront environment config

```env
# MedusaJS Backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

#### 4. Test MedusaJS Backend + Admin
**Command:** Start MedusaJS and verify

```bash
# In beauty-shop/ directory
npm run dev

# Expected:
# Server is ready on port: 9000
# Admin running on: http://localhost:9000/app
```

#### 5. Test Next.js Storefront
**Command:** Start storefront in separate terminal

```bash
# In beauty-shop-storefront/ directory
npm run dev

# Expected:
# ▲ Next.js 15.x.x
# - Local:   http://localhost:8000
```

---

## Phase 3: Reintegrate Valuable Work

### Overview
Integrer custom Supabase migrations, environment validation scripts, og health check utilities fra backup. Dette tilføjer Beauty Shop specifik funktionalitet oven på den korrekte Medusa installation.

### Changes Required:

#### 1. Copy Custom Supabase Migrations
**Files:** Copy from backup to project

#### 2. Update Custom Migrations (Remove medusa schema creation)
**File:** `supabase/migrations/20250124000001_beauty_shop_tables.sql`
**Changes:** Remove medusa schema creation (already exists from MedusaJS)

#### 3. Run Custom Migrations
**Command:** Execute Beauty Shop migrations

#### 4. Copy Environment Validation Script
**File:** Copy script from backup

#### 5. Copy Health Check Script
**File:** Copy health check script

#### 6. Create Root Package.json for Scripts
**File:** `package.json` (root)
**Changes:** Create minimal root package.json for utility scripts

#### 7. Test Full Integration
**Command:** Run full stack and verify

---

## Phase 4: Documentation & Cleanup

### Overview
Opdater dokumentation med korrekt setup guide, dokumenter lessons learned for fremtiden, og ryd op i backup efter verificering.

### Changes Required:

#### 1. Update README.md
**File:** `README.md`
**Changes:** Replace entire content with correct setup guide

#### 2. Create .env.example Files
**File:** `beauty-shop/.env.example`
**Changes:** Create environment template

#### 3. Document Lessons Learned
**File:** `.project/lessons-learned.md`
**Changes:** Create post-mortem document

#### 4. Update Linear CORE-16 (Already Done)
**Action:** Verify post-mortem comment posted

#### 5. Measure Performance Improvement
**Action:** Compare performance with baseline

#### 6. Delete Backup After Verification
**Action:** Remove backup once everything works

---

## Success Criteria

**Phase 2A Success:**
- ✅ `beauty-shop/` directory exists
- ✅ `beauty-shop-storefront/` directory exists
- ✅ Both directories have `package.json` files
- ✅ Installation completed without errors

**Phase 2B Success:**
- ✅ MedusaJS backend kører på `http://localhost:9000`
- ✅ MedusaJS admin tilgængelig på `http://localhost:9000/app`
- ✅ Next.js storefront kører på `http://localhost:8000`
- ✅ Database connection verificeret (Supabase)
- ✅ MedusaJS tabeller oprettet automatisk
- ✅ Ingen TypeScript errors
- ✅ Ingen build errors

**Phase 3 Success:**
- ✅ Custom Supabase migrations kørt succesfuldt
- ✅ Environment validation scripts fungerer
- ✅ Health check endpoints responderer
- ✅ Storefront kan kommunikere med backend

**Phase 4 Success:**
- ✅ README opdateret med korrekt setup
- ✅ Lessons learned dokumenteret
- ✅ Performance improvement målt
- ✅ Backup verificeret og slettet

---

## Estimated Timeline

**Total Time:** 4-5 hours

- **Phase 0:** Pre-Flight Check - 15 min ✅
- **Phase 1:** Backup & Cleanup - 30 min ✅
- **Phase 2A:** Fresh Install - 1 hour (CLI installation only)
- **Phase 2B:** Database Config & Testing - 1-2 hours (includes testing)
- **Phase 3:** Reintegration - 1-2 hours
- **Phase 4:** Documentation - 30 min

---

**Ready to proceed with Phase 2A: Fresh MedusaJS Installation**