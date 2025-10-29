# Deploy MedusaJS Backend to Railway Implementation Plan

## Overview
Deploy MedusaJS backend (`beauty-shop/`) til Railway med PostgreSQL (Supabase), Redis, environment variables konfiguration og health check verification. Dette er kritisk infrastructure-opgave der gør det muligt for storefront at fungere med en kørende backend API.

## Linear Issue
**Issue:** CORE-21  
**Status:** Triage  
**Priority:** High (2)  
**Labels:** high-risk, human-required, Infra, Chore  
**URL:** https://linear.app/beauty-shop/issue/CORE-21/deploy-medusajs-backend-to-railway  
**Git Branch:** `nicklaseskou95/core-21-deploy-medusajs-backend-to-railway`

## Current State Analysis

### What Exists Now:
- ✅ **MedusaJS Backend:** `beauty-shop/` directory med korrekt struktur
- ✅ **medusa-config.ts:** Konfigureret til at læse environment variables
- ✅ **Package Scripts:** `build` (`medusa build`) og `start` (`medusa start`) eksisterer
- ✅ **Health Endpoint:** `/health` endpoint eksisterer (testet i `integration-tests/http/health.spec.ts`)
- ✅ **Supabase Database:** Allerede konfigureret lokalt (connection string eksisterer)
- ✅ **Local Environment:** `.env` fil med lokale variabler

### What's Missing:
- ❌ **Railway Configuration:** Ingen `railway.toml` fil
- ❌ **Environment Template:** Ingen `.env.example` for Railway-specific variabler
- ❌ **Railway Project:** Ingen Railway deployment endnu
- ❌ **Production Secrets:** Ingen genererede production secrets (JWT_SECRET, COOKIE_SECRET)
- ❌ **Deployment Documentation:** Ingen dokumentation for Railway deployment proces
- ❌ **Redis Production Instance:** Ingen Railway Redis provisioned

### Key Discoveries:

**From Codebase Research:**

1. **MedusaJS Config** (`beauty-shop/medusa-config.ts:1-17`):
   - Læser `DATABASE_URL`, `DATABASE_EXTRA`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`
   - Kræver `JWT_SECRET` og `COOKIE_SECRET`
   - Støtter SSL config via `DATABASE_EXTRA` JSON

2. **Package Scripts** (`beauty-shop/package.json:15-19`):
   ```json
   "build": "medusa build",
   "start": "medusa start"
   ```
   - Railway kan bruge `npm run build` og `npm run start` direkte

3. **Health Endpoint** (`beauty-shop/integration-tests/http/health.spec.ts:8-12`):
   - MedusaJS har built-in `/health` endpoint
   - Returnerer 200 OK status
   - Kan bruges til Railway health checks

4. **Architecture Docs** (`.project/08-Architecture.md:325-327`):
   - Backend planlagt til Railway eller Render
   - Port: 9000 (lokalt)
   - Admin panel: `/app` path

5. **Environment Pattern** (`README.md:42-60`):
   - Lokal `.env` template viser required variabler
   - Supabase Transaction Pooler på port 6543
   - Redis optional i development, påkrævet i production

### Constraints & Assumptions:

**Constraints:**
- Railway kræver GitHub repository connection for auto-deploy
- Redis er PÅKRÆVET i production (MedusaJS bruger fake redis hvis manglende)
- Supabase Transaction Pooler skal bruges (port 6543, ikke 5432)
- SSL connection til Supabase kræver `DATABASE_EXTRA` JSON config
- Secrets skal genereres sikkert (32+ chars random strings)

**Assumptions:**
- Supabase database er allerede provisioned og konfigureret
- Railway account eksisterer eller kan oprettes
- Storefront URL vil være Vercel deployment (endnu ikke kendt)
- Admin user kan oprettes via CLI efter deployment

## Desired End State

### Success Criteria:

**Automated Verification:**
- [ ] Railway build succeeds: `npm ci && npm run build`
- [ ] Railway deployment successful (green status)
- [ ] Health endpoint responds: `GET /health` returns 200
- [ ] Type check passes (ingen TypeScript errors)
- [ ] No build errors or warnings

**Manual Verification:**
- [ ] Railway project connected to GitHub repository
- [ ] All environment variables set correctly in Railway dashboard
- [ ] Database connection works (migrations run successfully)
- [ ] Redis connection verified (medusa logs show real Redis, not fake)
- [ ] Admin panel accessible: `https://[railway-url]/app`
- [ ] API endpoints respond correctly (test store API)
- [ ] CORS configured correctly (storefront kan connecte)
- [ ] Admin user kan login
- [ ] SSL/TLS enabled for all connections
- [ ] Secrets ikke synlige i logs

**Railway URLs & Configuration:**
- Railway backend URL: `https://[project-name].railway.app` (automatically generated)
- Health check URL: `https://[project-name].railway.app/health`
- Admin panel: `https://[project-name].railway.app/app`
- Build log shows successful deployment

**Environment Variables Verified:**
- ✅ `DATABASE_URL` - Supabase Transaction Pooler connection
- ✅ `DATABASE_EXTRA` - SSL configuration JSON
- ✅ `REDIS_URL` - Railway Redis instance
- ✅ `JWT_SECRET` - Secure 32+ char random string
- ✅ `COOKIE_SECRET` - Secure 32+ char random string
- ✅ `STORE_CORS` - Storefront URL(s)
- ✅ `ADMIN_CORS` - Admin panel URL(s)
- ✅ `AUTH_CORS` - Auth endpoint URL(s)
- ✅ `MEDUSA_ADMIN_ONBOARDING_TYPE=skip`

## What We're NOT Doing

**Out of Scope:**
- ❌ **Vercel Storefront Deployment** - Dette er CORE-22 (blokkeret af dette ticket)
- ❌ **Database Setup** - Supabase er allerede konfigureret
- ❌ **Custom Domain Setup** - Railway default domain er nok for nu
- ❌ **CI/CD Integration** - Railway auto-deploy fra GitHub er nok
- ❌ **Monitoring Setup** - Basic Railway logging er nok (Sentry kan være fremtidig opgave)
- ❌ **Load Balancing** - Single instance er nok for MVP
- ❌ **Backup Strategy** - Supabase har automatisk backup
- ❌ **Admin User Creation** - Skal gøres manuelt efter deployment via CLI
- ❌ **Sales Channel Configuration** - Skal konfigureres i admin panel efter deployment
- ❌ **Production Database Migrations** - Køres automatisk ved første deploy

**Explicitly Excluded:**
- Custom middleware eller API endpoints (bruger standard MedusaJS)
- Custom build optimizations (bruger standard MedusaJS build)
- Multi-region deployment
- Custom SSL certificates (Railway håndterer dette)

## Implementation Approach

**High-Level Strategy:**
1. **Prepare Configuration Files** - Opret railway.toml og .env.example lokalt
2. **Manual Railway Setup** - Opret Railway project og connect GitHub (kræver Railway account)
3. **Configure Environment** - Sæt environment variables i Railway dashboard (manuelt)
4. **Deploy & Verify** - Deploy og test alle endpoints
5. **Document** - Opret deployment guide for fremtidige developer

**Why This Approach:**
- Railway setup kræver manuel interaction (account, dashboard)
- Secrets generation skal gøres sikkert (ikke i kode)
- Environment variables skal være secrets i Railway (ikke committet)
- Incremental verification hver fase sikrer stabile checkpoints

## Phase 1: Prepare Configuration Files

### Overview
Opret Railway konfigurationsfil og environment template. Disse filer skal være i repository og guide setup.

### Changes Required:

#### 1. Create Railway Configuration File
**File:** `beauty-shop/railway.toml` (new)
**Changes:** Opret Railway build og deployment konfiguration
```toml
[build]
builder = "nixpacks"
buildCommand = "npm ci && npm run build"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on-failure"
```
**Rationale:** 
- `nixpacks` er Railway's default Node.js builder (autodetects)
- `npm ci` for clean install (production-ready)
- `npm run build` forfører MedusaJS build
- Health check path bruger eksisterende `/health` endpoint
- Timeout på 300 sekunder (5 min) giver tid til cold start

#### 2. Create Environment Example File
**File:** `beauty-shop/.env.example` (new)
**Changes:** Opret template med alle Railway-specific environment variables
```bash
# Database (Supabase Transaction Pooler)
DATABASE_URL=postgresql://postgres.xxx:***@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DATABASE_EXTRA={"ssl":{"rejectUnauthorized":false}}

# Redis (Railway - replace with actual Railway Redis URL)
REDIS_URL=redis://default:password@hostname.railway.app:6379

# Secrets (generate secure random 32+ char strings)
JWT_SECRET=REPLACE_WITH_SECURE_RANDOM_STRING_32_CHARS_MIN
COOKIE_SECRET=REPLACE_WITH_SECURE_RANDOM_STRING_32_CHARS_MIN

# CORS Configuration
STORE_CORS=https://beauty-shop.vercel.app
ADMIN_CORS=https://your-project.railway.app,http://localhost:7001
AUTH_CORS=https://your-project.railway.app,http://localhost:7001

# Admin Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=skip
```
**Rationale:**
- Template viser alle påkrævede variabler
- Placeholder værdier med klare instruktioner
- Kommentarer forklarer kilde for hver variabel
- Ikke committet til git (.env.example er template)

#### 3. Update README with Railway Section
**File:** `README.md`
**Changes:** Tilføj Railway deployment sektion efter "## 🚀 Deployment"
```markdown
### Backend (MedusaJS) - Railway

**Prerequisites:**
- Railway account (https://railway.app)
- Supabase database connection string
- GitHub repository connected to Railway

**Deployment Steps:**

1. **Create Railway Project:**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `beauty-shop` repository
   - Select `beauty-shop/` directory as root

2. **Configure Environment Variables:**
   - Go to Project → Variables
   - Add all variables from `beauty-shop/.env.example`
   - Generate secure secrets for `JWT_SECRET` and `COOKIE_SECRET`
   - Update `ADMIN_CORS` and `AUTH_CORS` with Railway URL

3. **Add Redis Service:**
   - In Railway project, click "+ New"
   - Select "Redis"
   - Railway will auto-generate `REDIS_URL` variable

4. **Deploy:**
   - Railway will auto-deploy on git push to main
   - Check deployment logs for errors
   - Verify health endpoint: `https://[project].railway.app/health`

5. **Create Admin User:**
   ```bash
   npx medusa user -e admin@beautyshop.com -p [secure-password]
   ```

**Production URLs:**
- Backend API: `https://[project-name].railway.app`
- Admin Panel: `https://[project-name].railway.app/app`
- Health Check: `https://[project-name].railway.app/health`
```
**Rationale:** 
- Guider fremtidige developers gennem processen
- Klare step-by-step instruktioner
- Inkluderer troubleshooting reference

### Success Criteria:

#### Automated Verification:
- [ ] `railway.toml` file exists in `beauty-shop/` directory
- [ ] `.env.example` file exists in `beauty-shop/` directory
- [ ] Both files have valid syntax (no parse errors)
- [ ] Git status shows new files ready to commit
- [ ] TypeScript compilation succeeds: `cd beauty-shop && npm run build` (local test)

#### Manual Verification:
- [ ] `railway.toml` contains correct build and start commands
- [ ] `.env.example` includes all required variables from ticket
- [ ] Template comments explain where to get each value
- [ ] README section is clear and complete

**⚠️ PAUSE HERE** - Review configuration files before proceeding to manual Railway setup.

---

## Phase 2: Railway Project Setup (Manual)

### Overview
Installér Railway CLI, opret Railway project, connect til GitHub repository og konfigurer build settings. Dette er primært manuel proces i Railway dashboard og CLI.

### Changes Required:

#### 1. Install Railway CLI (Manual)
**Action:** Install Railway CLI på lokal maskine
**Purpose:** CLI gør det nemmere at administrere deployments, køre kommandoer og se logs

**Installation Methods:**

**Option A: Using npm (Recommended):**
```bash
npm install -g @railway/cli
```

**Option B: Using Homebrew (macOS):**
```bash
brew install railway
```

**Option C: Using curl (Universal):**
```bash
curl -fsSL https://railway.app/install.sh | sh
```

**Verify Installation:**
```bash
railway --version
```
Expected output: `railway version X.X.X` or similar

**Login to Railway:**
```bash
railway login
```
This opens browser for authentication. After login, CLI is authenticated.

**Rationale:**
- Railway CLI er nyttig for admin user creation (Phase 4)
- Gør det nemmere at se logs, deploye, og administrere services
- Bruges til at køre `railway run` kommandoer i Railway environment

**Important Notes:**
- ⚠️ CLI er valgfri - kan også bruge Railway dashboard for alle operations
- ⚠️ Men CLI anbefales for admin user creation (lettere end SSH)
- ⚠️ Login kræver Railway account (skal oprettes hvis ikke eksisterer)

#### 2. Create Railway Project (Manual)
**Action:** Railway Dashboard
**Steps:**
1. Login til Railway (https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway GitHub integration (hvis ikke allerede gjort)
5. Choose repository: `eskoubar95/beauty-shop` (eller relevant org/repo)
6. Railway vil auto-detect Node.js projekt
7. **Important:** Set root directory to `beauty-shop/` (ikke root!)
   - Dette kan gøres i Project Settings → Service → Root Directory

**Rationale:** 
- Railway skal bygge fra `beauty-shop/` directory
- Root directory indeholder flere projects (storefront, backend)
- Railway auto-detects Node.js og npm

#### 3. Configure Build Settings (Manual)
**Action:** Railway Dashboard → Service Settings
**Verification:**
- Build Command should be: `npm ci && npm run build` (from railway.toml)
- Start Command should be: `npm run start` (from railway.toml)
- Healthcheck Path: `/health`
- Healthcheck Timeout: `300` seconds

**Rationale:**
- Railway læser `railway.toml` automatisk
- Men god at verificere i dashboard
- Healthcheck sikrer auto-restart ved fejl

#### 4. Verify GitHub Connection (Manual)
**Action:** Railway Dashboard → Settings → Service Settings
**Verification:**
- GitHub repo connected correctly
- Auto-deploy enabled for `main` branch (optional, men anbefalet)
- Service detects changes correctly

### Success Criteria:

#### Automated Verification:
- [ ] Railway CLI installed: `railway --version` returns version number
- [ ] Railway CLI authenticated: `railway whoami` shows username

#### Manual Verification:
- [ ] Railway CLI installed and working
- [ ] Railway CLI logged in successfully
- [ ] Railway project created successfully
- [ ] Root directory set to `beauty-shop/`
- [ ] Build command detected correctly (`npm ci && npm run build`)
- [ ] Start command detected correctly (`npm run start`)
- [ ] Healthcheck path configured (`/health`)
- [ ] Initial build attempt (might fail without env vars - expected)

**⚠️ PAUSE HERE** - Do NOT proceed until Railway project is created and configured. First build will likely fail due to missing environment variables (expected).

---

## Phase 3: Environment Variables Configuration (Manual)

### Overview
Konfigurer alle environment variables i Railway dashboard. Dette inkluderer database connection, Redis, secrets og CORS settings.

### Changes Required:

#### 1. Database Configuration (Manual)
**Action:** Railway Dashboard → Variables
**Add Variables:**

```
DATABASE_URL=postgresql://postgres.xxx:***@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DATABASE_EXTRA={"ssl":{"rejectUnauthorized":false}}
```

**Steps:**
1. Go to Railway project → Variables tab
2. Click "+ New Variable"
3. Add `DATABASE_URL` with Supabase Transaction Pooler connection string
4. Add `DATABASE_EXTRA` with exact JSON (important: no spaces, correct escaping)
5. Mark both as "Secret" (hide from logs)

**Important Notes:**
- ⚠️ Use Transaction Pooler (port 6543, not 5432)
- ⚠️ Include `?pgbouncer=true` query parameter
- ⚠️ `DATABASE_EXTRA` must be valid JSON string
- ⚠️ Verify connection string format from Supabase dashboard

**Rationale:**
- Transaction Pooler er bedre for Railway's connection pattern
- SSL kræver explicit JSON config
- Secrets skal være masked i logs

#### 2. Redis Configuration (Manual)
**Action:** Railway Dashboard → Add Service
**Steps:**
1. In Railway project, click "+ New" button
2. Select "Redis" from database options
3. Railway will auto-provision Redis instance
4. Railway automatically adds `REDIS_URL` variable to main service
5. Verify `REDIS_URL` variable exists and is correct format:
   ```
   redis://default:[password]@[host]:[port]
   ```

**Rationale:**
- Railway Redis er managed service (nemmere end external)
- Auto-generated URL er korrekt formateret
- MedusaJS kræver Redis i production (uses fake redis hvis missing)

#### 3. Secret Generation (Manual)
**Action:** Generate secure random strings
**Methods:**

**Option A: Using OpenSSL (Recommended):**
```bash
openssl rand -base64 32
```
Run twice to generate `JWT_SECRET` and `COOKIE_SECRET`

**Option B: Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option C: Online Generator:**
- https://generate-secret.vercel.app/32 (generate secure random strings)

**Add to Railway:**
1. Generate two 32+ character random strings
2. Add `JWT_SECRET` variable in Railway (mark as Secret)
3. Add `COOKIE_SECRET` variable in Railway (mark as Secret)
4. **Never commit these to git!**

**Rationale:**
- 32 characters minimum for security
- Base64 encoding gives safe characters
- Must be random (not predictable)
- Store only in Railway secrets

#### 4. CORS Configuration (Manual)
**Action:** Railway Dashboard → Variables
**Add Variables:**

```
STORE_CORS=https://beauty-shop.vercel.app
ADMIN_CORS=https://[railway-project-url].railway.app,http://localhost:7001
AUTH_CORS=https://[railway-project-url].railway.app,http://localhost:7001
MEDUSA_ADMIN_ONBOARDING_TYPE=skip
```

**Steps:**
1. Get Railway project URL from Railway dashboard (format: `[project-name].railway.app`)
2. For `STORE_CORS`: Use Vercel storefront URL (if known) or placeholder
   - If storefront not deployed yet, use placeholder: `https://beauty-shop.vercel.app`
   - Can update later when CORE-22 is completed
3. For `ADMIN_CORS`: Railway URL + localhost (for local admin access)
4. For `AUTH_CORS`: Same as ADMIN_CORS
5. `MEDUSA_ADMIN_ONBOARDING_TYPE=skip` skips onboarding flow

**Important Notes:**
- ⚠️ Railway URL will be auto-generated after first deploy
- ⚠️ Update `ADMIN_CORS` and `AUTH_CORS` after first deploy with actual Railway URL
- ⚠️ Can update `STORE_CORS` later when storefront is deployed (CORE-22)

**Rationale:**
- CORS must match exact origins
- Localhost included for local admin panel access
- Skip onboarding since admin user created manually

### Success Criteria:

#### Manual Verification:
- [ ] All environment variables added in Railway dashboard
- [ ] `DATABASE_URL` uses Supabase Transaction Pooler (port 6543)
- [ ] `DATABASE_EXTRA` is valid JSON (no syntax errors)
- [ ] Redis service provisioned and `REDIS_URL` variable exists
- [ ] `JWT_SECRET` is 32+ characters, random, never committed
- [ ] `COOKIE_SECRET` is 32+ characters, random, never committed
- [ ] `ADMIN_CORS` includes Railway URL (update after first deploy if needed)
- [ ] `AUTH_CORS` includes Railway URL (update after first deploy if needed)
- [ ] `STORE_CORS` configured (placeholder OK if storefront not deployed)
- [ ] `MEDUSA_ADMIN_ONBOARDING_TYPE=skip` set
- [ ] All secrets marked as "Secret" in Railway (not visible in logs)

**⚠️ PAUSE HERE** - Verify all environment variables before deploying. Missing or incorrect variables will cause deployment failure.

---

## Phase 4: Deployment & Verification

### Overview
Trigger Railway deployment, verificer build success, test health endpoint og verificer alle kritikke funktioner.

### Changes Required:

#### 1. Trigger Deployment (Manual/Auto)
**Action:** Railway auto-deploys on git push, eller manual trigger
**Methods:**

**Option A: Auto-deploy (Recommended):**
```bash
# Push Phase 1 files (railway.toml, .env.example, README)
git add beauty-shop/railway.toml beauty-shop/.env.example README.md
git commit -m "feat(CORE-21): Add Railway deployment configuration"
git push origin feature/CORE-21-deploy-medusajs-backend-to-railway
```

Railway will auto-detect push and start deployment.

**Option B: Manual Trigger:**
1. Go to Railway dashboard
2. Click "Deploy" button
3. Select branch/commit
4. Click "Deploy"

**Monitor Deployment:**
1. Watch Railway build logs in real-time
2. Verify build command runs: `npm ci && npm run build`
3. Verify no build errors
4. Verify deployment completes successfully

**Rationale:**
- Auto-deploy ensures consistency
- Manual trigger useful for testing
- Build logs reveal configuration issues early

#### 2. Verify Health Endpoint (Manual)
**Action:** Test `/health` endpoint
**Steps:**
1. After deployment completes, get Railway URL from dashboard
2. Test health endpoint:
   ```bash
   curl https://[railway-project].railway.app/health
   ```
   Expected: `200 OK` response

3. Or visit in browser:
   ```
   https://[railway-project].railway.app/health
   ```

**Rationale:**
- Health endpoint confirms server is running
- Railway uses this for health checks
- 200 OK means MedusaJS started successfully

#### 3. Verify Database Connection (Manual)
**Action:** Check Railway logs for database connection
**Steps:**
1. Go to Railway dashboard → Service → Logs
2. Look for database connection messages
3. Check for any database errors
4. Verify migrations ran successfully (if first deploy)

**Expected Log Messages:**
- "Database connected successfully"
- "Running migrations..." (first deploy only)
- No connection errors

**Rationale:**
- Database connection errors appear in logs
- Migrations run automatically on first deploy
- Connection pool issues visible in logs

#### 4. Verify Redis Connection (Manual)
**Action:** Check Railway logs for Redis connection
**Steps:**
1. Check Railway logs for Redis connection
2. Verify no "Using fake Redis" warnings
3. Look for successful Redis connection messages

**Expected:**
- No "fake redis" warnings (MedusaJS uses fake redis if REDIS_URL missing)
- Redis connection success messages
- No Redis-related errors

**Rationale:**
- MedusaJS falls back to fake redis if REDIS_URL missing/invalid
- Real Redis required for production (sessions, caching)
- Logs reveal if Redis actually connected

#### 5. Test Admin Panel Access (Manual)
**Action:** Access admin panel in browser
**Steps:**
1. Navigate to: `https://[railway-project].railway.app/app`
2. Verify admin panel loads (MedusaJS admin UI)
3. Check for CORS errors in browser console (should be none)
4. Verify no SSL/TLS errors

**Expected:**
- Admin panel UI loads correctly
- No CORS errors in browser console
- SSL certificate valid (no browser warnings)
- Login page accessible (even if no user created yet)

**Rationale:**
- Admin panel access confirms routing works
- CORS errors indicate misconfiguration
- SSL verification confirms secure connection

#### 6. Test Store API Endpoint (Manual)
**Action:** Test public store API
**Steps:**
1. Test store endpoint:
   ```bash
   curl https://[railway-project].railway.app/store/products
   ```
   Expected: JSON response with products array (or empty array if no products)

2. Verify CORS headers (if testing from browser):
   ```bash
   curl -H "Origin: https://beauty-shop.vercel.app" \
        -I https://[railway-project].railway.app/store/products
   ```
   Expected: `Access-Control-Allow-Origin: https://beauty-shop.vercel.app`

**Rationale:**
- Store API must be accessible for storefront
- CORS headers must match configured origins
- Empty array is OK if no products seeded

#### 7. Create Admin User (Manual)
**Action:** Use MedusaJS CLI to create admin user via Railway CLI
**Steps:**
1. Ensure Railway service is running
2. Link Railway CLI to project (if not already linked):
   ```bash
   # Navigate to project root
   cd /path/to/beauty-shop
   
   # Link Railway project
   railway link
   # Select the Railway project when prompted
   ```
   
3. Create admin user using Railway CLI:
   ```bash
   # Navigate to backend directory
   cd beauty-shop
   
   # Run MedusaJS user creation command in Railway environment
   railway run npx medusa user -e admin@beautyshop.com -p [secure-password]
   ```
   
   **Alternative (if Railway CLI not installed):**
   - Use Railway dashboard → Service → Connect
   - SSH into service (if available)
   - Then run: `npx medusa user -e admin@beautyshop.com -p [secure-password]`

4. Verify user created:
   - Try logging into admin panel with created credentials
   - Should successfully authenticate

**Important Notes:**
- ⚠️ Railway CLI skal være installerede og authenticated (Phase 2, Step 1)
- ⚠️ Railway CLI skal være linked til projektet (via `railway link`)
- ⚠️ Kommandoen køres i Railway environment med alle environment variables loaded
- ⚠️ Choose secure password (not "password" or "admin")
- ⚠️ Email should be valid (for password reset if needed)
- ⚠️ User is stored in database (persists across deployments)

**Rationale:**
- Admin user required to access admin panel
- Created via CLI (not through UI)
- Credentials stored securely in database

### Success Criteria:

#### Automated Verification:
- [ ] Railway build completes successfully (green status)
- [ ] Health endpoint returns 200: `curl https://[url]/health`
- [ ] Build logs show no TypeScript errors
- [ ] Build logs show no npm install errors
- [ ] Deployment status is "Active" in Railway dashboard

#### Manual Verification:
- [ ] Railway URL accessible (no DNS errors)
- [ ] Health endpoint responds: `/health` returns 200 OK
- [ ] Database connection successful (no errors in logs)
- [ ] Redis connection successful (no "fake redis" warnings)
- [ ] Admin panel accessible: `/app` loads correctly
- [ ] Store API responds: `/store/products` returns JSON
- [ ] CORS headers correct (if testing from browser)
- [ ] SSL/TLS enabled (browser shows secure connection)
- [ ] Admin user created and can login
- [ ] All environment variables loaded correctly (check logs)

**⚠️ PAUSE HERE** - Verify all above before considering deployment complete. Any failures require investigation and fixes.

---

## Phase 5: Documentation & Verification

### Overview
Opret deployment dokumentation og verificer alle acceptance criteria fra Linear ticket.

### Changes Required:

#### 1. Create Deployment Documentation
**File:** `.project/deployment-backend.md` (new)
**Changes:** Opret comprehensive deployment guide
```markdown
# Backend Deployment Guide - Railway

## Overview
Deployment guide for MedusaJS backend to Railway platform.

**Last Updated:** 2025-10-29  
**Related Ticket:** CORE-21

## Prerequisites

- Railway account (https://railway.app)
- Supabase database (already provisioned)
- GitHub repository access
- Railway CLI installed (recommended, for admin user creation and management)

**Install Railway CLI:**
```bash
# Option 1: npm (Recommended)
npm install -g @railway/cli

# Option 2: Homebrew (macOS)
brew install railway

# Option 3: curl (Universal)
curl -fsSL https://railway.app/install.sh | sh

# Verify installation
railway --version

# Login
railway login
```

## Initial Setup

### 1. Railway Project Creation

1. Login to Railway dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select repository: `eskoubar95/beauty-shop`
4. Set root directory: `beauty-shop/`
5. Railway auto-detects Node.js and reads `railway.toml`

### 2. Environment Variables

Add all required variables in Railway → Variables:

**Database:**
- `DATABASE_URL` - Supabase Transaction Pooler connection string
- `DATABASE_EXTRA` - SSL config JSON: `{"ssl":{"rejectUnauthorized":false}}`

**Redis:**
- `REDIS_URL` - Auto-generated by Railway Redis service

**Secrets:**
- `JWT_SECRET` - Generate: `openssl rand -base64 32`
- `COOKIE_SECRET` - Generate: `openssl rand -base64 32`

**CORS:**
- `STORE_CORS` - Storefront URL (e.g., `https://beauty-shop.vercel.app`)
- `ADMIN_CORS` - Admin origins (Railway URL + localhost)
- `AUTH_CORS` - Auth origins (same as ADMIN_CORS)
- `MEDUSA_ADMIN_ONBOARDING_TYPE=skip`

### 3. Redis Service

1. In Railway project: "+ New" → "Redis"
2. Railway auto-generates `REDIS_URL`
3. Variable automatically available to main service

### 4. Deploy

Railway auto-deploys on git push to connected branch, or:
- Manual trigger: Railway dashboard → "Deploy"

### 5. Verify Deployment

**Health Check:**
```bash
curl https://[railway-project].railway.app/health
```
Expected: `200 OK`

**Admin Panel:**
```
https://[railway-project].railway.app/app
```

**Link Railway CLI to Project:**
```bash
# From project root
cd /path/to/beauty-shop/beauty-shop
railway link
# Select project when prompted
```

**Create Admin User:**
```bash
# From beauty-shop directory (where medusa-config.ts is)
cd beauty-shop
railway run npx medusa user -e admin@beautyshop.com -p [password]
```

**Note:** Railway CLI skal være installerede og authenticated først (se Prerequisites).

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Check `package.json` includes all dependencies
- Verify `npm ci` installs correctly

**Error: "TypeScript compilation failed"**
- Check TypeScript config in `beauty-shop/`
- Verify all types resolve correctly

**Error: "Build command failed"**
- Check Railway build logs for specific error
- Verify Node.js version (requires Node 20+)

### Deployment Fails

**Error: "Cannot connect to database"**
- Verify `DATABASE_URL` is correct (Transaction Pooler, port 6543)
- Check `DATABASE_EXTRA` JSON is valid
- Test connection string locally first

**Error: "Redis connection failed"**
- Verify Redis service provisioned
- Check `REDIS_URL` variable exists
- Verify Redis service is running in Railway

**Error: "Health check timeout"**
- Increase healthcheck timeout in `railway.toml`
- Check application logs for startup errors
- Verify `medusa start` command works locally

### Runtime Issues

**Admin panel shows CORS error**
- Verify `ADMIN_CORS` includes Railway URL
- Check browser console for exact origin
- Update CORS variables if needed

**API returns 500 errors**
- Check Railway logs for application errors
- Verify all environment variables set correctly
- Test locally with same environment variables

## Updating Deployment

### Update Environment Variables
1. Railway dashboard → Variables
2. Edit/add variables as needed
3. Service automatically restarts with new variables

### Update Code
1. Push changes to GitHub
2. Railway auto-deploys (if auto-deploy enabled)
3. Or manually trigger deployment

### View Logs
```bash
# Railway CLI (requires railway link first)
railway logs

# Or Railway dashboard
Service → Logs tab
```

**Link Railway CLI to Project:**
```bash
# Navigate to beauty-shop directory
cd beauty-shop
railway link
# Select project when prompted
```

## Production Checklist

Before marking deployment as production-ready:

- [ ] All environment variables set and verified
- [ ] Database migrations run successfully
- [ ] Redis connected (not fake redis)
- [ ] Health endpoint responding
- [ ] Admin panel accessible
- [ ] Admin user created and can login
- [ ] Store API responding correctly
- [ ] CORS configured correctly
- [ ] SSL/TLS enabled (no warnings)
- [ ] Secrets not visible in logs
- [ ] Monitoring/logging configured (optional)

## Related Documentation

- [MedusaJS Railway Deployment](https://docs.medusajs.com/deployment/railway)
- [Railway Node.js Guide](https://docs.railway.app/guides/nodejs)
- [Railway Redis Guide](https://docs.railway.app/databases/redis)
- Linear: CORE-21
```
**Rationale:**
- Comprehensive guide for future developers
- Troubleshooting section saves time
- Production checklist ensures quality

#### 2. Verify All Acceptance Criteria (Manual)
**Action:** Go through Linear ticket acceptance criteria checklist

**Railway Setup:**
- [ ] Railway project created for `beauty-shop` backend
- [ ] Connected to GitHub repository
- [ ] Build succeeds (uses `npm run build` from `beauty-shop/`)
- [ ] Deployment successful with public URL

**Database Configuration:**
- [ ] Supabase PostgreSQL connected via DATABASE_URL
- [ ] DATABASE_EXTRA configured for SSL (`{"ssl":{"rejectUnauthorized":false}}`)
- [ ] Database migrations run successfully on first deploy
- [ ] `medusa` schema populated with tables

**Redis Configuration:**
- [ ] Railway Redis addon provisioned
- [ ] REDIS_URL environment variable set
- [ ] MedusaJS connects to Redis for caching/sessions
- [ ] Verified Redis is working (not using fake instance)

**Environment Variables:**
- [ ] All required env vars set in Railway dashboard
- [ ] DATABASE_URL (Supabase Transaction Pooler)
- [ ] DATABASE_EXTRA (SSL config)
- [ ] REDIS_URL (Railway Redis)
- [ ] JWT_SECRET (generate secure value)
- [ ] COOKIE_SECRET (generate secure value)
- [ ] MEDUSA_ADMIN_ONBOARDING_TYPE=skip
- [ ] STORE_CORS (storefront URL)
- [ ] ADMIN_CORS (Railway + localhost)
- [ ] AUTH_CORS (same as ADMIN_CORS)

**Health & Verification:**
- [ ] Health check endpoint responds: `GET /health`
- [ ] Admin panel accessible at `https://[railway-url]/app`
- [ ] API endpoints respond correctly
- [ ] Admin user can login

**Security:**
- [ ] Environment variables are secrets (not visible in logs)
- [ ] SSL/TLS enabled for all connections
- [ ] CORS configured correctly
- [ ] No secrets in git repository

**Rationale:**
- Ensures all ticket requirements met
- Verification step before closing ticket
- Documents what was accomplished

### Success Criteria:

#### Manual Verification:
- [ ] Deployment documentation created at `.project/deployment-backend.md`
- [ ] Documentation includes all setup steps
- [ ] Troubleshooting section included
- [ ] All acceptance criteria from Linear ticket verified
- [ ] Production checklist completed
- [ ] README updated with Railway deployment section

---

## Testing Strategy

### Unit Tests
- Not required for this deployment task (infrastructure)
- Existing MedusaJS tests should still pass locally

### Integration Tests
- **Health Endpoint:** `integration-tests/http/health.spec.ts` already exists
- Can be run against Railway URL in CI/CD (future enhancement)

### Manual Testing Checklist
- [ ] Health endpoint: `GET /health` returns 200
- [ ] Admin panel: `/app` loads correctly
- [ ] Store API: `/store/products` returns JSON
- [ ] Admin login: Can authenticate with created user
- [ ] Database connection: No errors in logs
- [ ] Redis connection: No "fake redis" warnings
- [ ] CORS: Storefront can connect (when deployed)
- [ ] SSL: Browser shows secure connection

### Production Verification
- [ ] All acceptance criteria met
- [ ] No critical errors in logs
- [ ] Performance acceptable (startup time, response times)
- [ ] Monitoring/logging working (basic Railway logs)

## Rollback Strategy

### If Deployment Fails

**Immediate Rollback:**
1. Railway dashboard → Deployments → Previous deployment
2. Click "Redeploy" on last known good deployment
3. Investigate issues in logs

**Code Rollback:**
1. Revert git commit that broke deployment
2. Push revert commit
3. Railway auto-deploys previous version

**Configuration Rollback:**
1. Railway dashboard → Variables
2. Revert problematic environment variable
3. Service auto-restarts with corrected value

### If Production Issues Occur

**Quick Fixes:**
- Update environment variables (no redeploy needed)
- Restart service: Railway dashboard → Restart
- Check logs for specific errors

**Severe Issues:**
- Rollback to previous deployment
- Fix issue locally first
- Test fix in Railway staging (if available)
- Redeploy when fixed

## References

### Linear Ticket
- **Issue:** CORE-21
- **URL:** https://linear.app/beauty-shop/issue/CORE-21/deploy-medusajs-backend-to-railway

### Documentation
- [MedusaJS Railway Deployment Docs](https://docs.medusajs.com/deployment/railway)
- [Railway Node.js Guide](https://docs.railway.app/guides/nodejs)
- [Railway Redis Guide](https://docs.railway.app/databases/redis)

### Related Files
- `beauty-shop/railway.toml` - Railway configuration
- `beauty-shop/.env.example` - Environment template
- `beauty-shop/medusa-config.ts` - MedusaJS configuration
- `beauty-shop/package.json` - Build scripts
- `.project/08-Architecture.md` - Architecture documentation
- `README.md` - Setup guide

### Code References
- MedusaJS config: `beauty-shop/medusa-config.ts:1-17`
- Health endpoint test: `beauty-shop/integration-tests/http/health.spec.ts:8-12`
- Package scripts: `beauty-shop/package.json:15-19`

---

## Notes & Considerations

### Important Reminders

1. **Railway CLI** - Install and authenticate before Phase 2 (makes admin user creation easier)
2. **Redis is REQUIRED** - MedusaJS will use fake redis if REDIS_URL missing
3. **Transaction Pooler** - Must use Supabase port 6543 (not 5432)
4. **Secrets Generation** - Use secure random strings (32+ chars)
5. **CORS URLs** - Update after first deploy with actual Railway URL
6. **Admin User** - Must be created manually via CLI after deployment (Railway CLI recommended)

### Future Enhancements

- CI/CD integration for automated testing
- Custom domain setup
- Monitoring/alerting (Sentry, etc.)
- Multi-region deployment
- Database connection pooling optimization

### Dependencies

**Blocks:**
- CORE-22: Deploy Storefront to Vercel (needs backend URL)

**Blocked By:**
- None (Supabase already configured)

---

**Plan Status:** Ready for Implementation  
**Estimated Complexity:** ~2-3 hours (mostly manual Railway setup)  
**Risk Level:** High (production deployment, database, Redis)  
**Next Step:** Execute Phase 1 (Create configuration files)

