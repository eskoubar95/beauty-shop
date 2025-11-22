# Deploy Storefront to Vercel Implementation Plan

## Overview
Deploy Next.js storefront (`beauty-shop-storefront/`) til Vercel med korrekt environment configuration, GitHub secrets setup, og automatisk deployment fra CI/CD pipeline. Denne opgave unblocks user-facing storefront access efter backend deployment (CORE-21).

## Linear Issue
**Issue:** CORE-22  
**Status:** ✅ Done (Completed 2025-10-31)  
**Priority:** High (2)  
**Labels:** human-required, Infra, Chore  
**URL:** https://linear.app/beauty-shop/issue/CORE-22/deploy-storefront-to-vercel  
**Git Branch:** `nicklaseskou95/core-22-deploy-storefront-to-vercel`  
**Production URL:** https://guapo-storefront.vercel.app

## Current State Analysis

### What Exists Now:
- ✅ **Next.js Storefront:** `beauty-shop-storefront/` directory med komplet structure
- ✅ **CI/CD Deployment Job:** `.github/workflows/ci.yml` har Vercel deployment konfigureret (lines 132-218)
- ✅ **Environment Check:** `check-env-variables.js` validerer required environment variables
- ✅ **Build Scripts:** `package.json` har `build` og `start` scripts
- ✅ **MedusaJS SDK Config:** `src/lib/config.ts` integrerer med backend via environment variables
- ✅ **Backend Deployed:** CORE-21 completed - Railway backend URL available

### What's Missing:
- ❌ **Vercel Project:** Ingen Vercel project oprettet endnu
- ❌ **GitHub Secrets:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` mangler
- ❌ **Environment Variables (Vercel):** Production environment variables ikke sat
- ❌ **`.env.example` Template:** Ingen template for production environment variables
- ❌ **Deployment Documentation:** Ingen guide til Vercel setup
- ❌ **Publishable API Key:** Ikke oprettet i Medusa Admin endnu

### Key Discoveries:

**From Codebase Research:**

1. **Environment Variables Required** (`check-env-variables.js:3-10`, `src/lib/config.ts:1-14`):
   ```javascript
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY // REQUIRED - fra Medusa Admin
   MEDUSA_BACKEND_URL                  // Backend URL (Railway)
   NEXT_PUBLIC_BASE_URL                // Vercel production URL (optional)
   NEXT_PUBLIC_DEFAULT_REGION          // Default region (optional, e.g., 'dk')
   ```

2. **Build Configuration** (`next.config.js:1-58`):
   - React Strict Mode enabled
   - TypeScript og ESLint errors ignored during build (intentional for fast iteration)
   - Image optimization configured med remote patterns
   - Environment check runs before build

3. **CI/CD Deployment Setup** (`.github/workflows/ci.yml:132-218`):
   - Vercel deployment job allerede konfigureret
   - Checks for GitHub secrets before deploying (lines 180-192)
   - Supports both PR preview og production deployments
   - Uses `amondnet/vercel-action@v25`

4. **Backend Integration** (`src/lib/config.ts:1-14`):
   - MedusaJS SDK initialized med `baseUrl` og `publishableKey`
   - Defaults to `http://localhost:9000` hvis MEDUSA_BACKEND_URL ikke sat
   - Debug mode aktiveret i development

5. **Package Manager** (`package.json:55`):
   - Yarn 3.2.3 via Corepack
   - Vercel auto-detects yarn.lock

### Constraints & Assumptions:

**Constraints:**
- Vercel project skal oprettes manuelt via Vercel dashboard
- Root directory skal være `beauty-shop-storefront/` (ikke repo root)
- GitHub secrets skal sættes manuelt i repository settings
- Publishable API key skal oprettes i Medusa Admin (kræver admin user login)
- Environment variables skal sættes både i Vercel og GitHub Actions (for PR previews)

**Assumptions:**
- Backend Railway URL er tilgængelig fra CORE-21 deployment
- Admin user eksisterer og kan logge ind i Medusa Admin
- Vercel account eksisterer eller kan oprettes (free tier er nok for MVP)
- GitHub repository er public eller Vercel har access

## Desired End State

### Success Criteria:

#### Automated Verification:
- [ ] Build succeeds i Vercel: `yarn build` completes uden errors
- [ ] Type check passes (hvis aktiveret): `yarn typecheck`
- [ ] Linter passes (hvis aktiveret): `yarn lint`
- [ ] GitHub Actions Vercel deployment job runs successfully
- [ ] PR preview deployments trigger automatically

#### Manual Verification:
- [ ] Vercel project created og connected til GitHub
- [ ] Root directory set til `beauty-shop-storefront/`
- [ ] All environment variables sat i Vercel dashboard (Production + Preview)
- [ ] All GitHub secrets sat korrekt (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`)
- [ ] Production deployment accessible på Vercel URL
- [ ] Homepage loader korrekt (no 404s eller missing assets)
- [ ] Products kan fetches fra Railway backend (no CORS errors)
- [ ] Images vises korrekt
- [ ] Cart functionality fungerer
- [ ] No kritiske console errors
- [ ] SSL/TLS certificate valid (Vercel auto-provision)
- [ ] Lighthouse score > 85 (Performance)

**URLs & Configuration:**
- Production URL: `https://[project-name].vercel.app` (Vercel auto-generated)
- Preview URL: `https://[branch-name]-[project-name].vercel.app`
- Backend URL: Railway deployment URL (fra CORE-21)

**Environment Variables Verified:**
- ✅ `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` - Publishable API key fra Medusa Admin
- ✅ `MEDUSA_BACKEND_URL` - Railway backend URL
- ✅ `NEXT_PUBLIC_BASE_URL` - Vercel production URL
- ✅ `NEXT_PUBLIC_DEFAULT_REGION` - Default region (e.g., `dk`)

## What We're NOT Doing

**Out of Scope:**
- ❌ **Custom Domain Setup** - Vercel default domain er nok for nu (kan gøres senere)
- ❌ **Edge Functions** - Bruger standard Next.js deployment
- ❌ **Custom Caching Strategy** - Vercel defaults er nok
- ❌ **Analytics Setup** - Vercel Analytics kan aktiveres senere
- ❌ **Error Monitoring** - Sentry kan integreres senere (ikke påkrævet for deployment)
- ❌ **CI/CD Optimization** - Eksisterende pipeline er nok
- ❌ **Performance Optimization** - Focus er på deployment, ikke optimization
- ❌ **Content Seeding** - Products skal seedes separat via Medusa Admin
- ❌ **Authentication** - Clerk integration allerede i kode, ikke del af deployment

**Explicitly Excluded:**
- Multi-region deployment (Vercel global CDN er default)
- Custom SSL certificates (Vercel auto-provision)
- Database migrations (backend responsibility)
- Email service configuration (fremtidig opgave)

## Implementation Approach

**High-Level Strategy:**
1. **Prepare Configuration Files** - Opret `.env.example` og dokumentation lokalt
2. **Create Publishable API Key** - Login til Medusa Admin og opret key
3. **Manual Vercel Setup** - Opret Vercel project via dashboard
4. **Configure Environment Variables** - Sæt environment variables i Vercel
5. **Configure GitHub Secrets** - Sæt Vercel secrets i GitHub repository
6. **Deploy & Verify** - Trigger deployment og test alle endpoints
7. **Document** - Opret deployment guide for fremtidige developer

**Why This Approach:**
- Vercel project creation kræver manuel interaction (account, dashboard)
- Publishable API key skal oprettes via Medusa Admin (ikke API)
- Environment variables skal være secrets i Vercel (ikke committet)
- GitHub secrets skal sættes manuelt i repository settings
- Incremental verification hver fase sikrer stabile checkpoints

## Phase 1: Prepare Configuration Files

### Overview
Opret `.env.example` template og deployment dokumentation. Disse filer skal være i repository og guide setup.

### Changes Required:

#### 1. Create Environment Example File
**File:** `beauty-shop-storefront/.env.example` (new)
**Changes:** Opret template med alle påkrævede environment variables
```bash
# ===============================================
# Beauty Shop Storefront - Environment Variables
# ===============================================
# This file provides a template for environment variables
# needed for production deployment to Vercel.
#
# Copy this file to `.env.local` for local development.
# For production, set these in Vercel dashboard.

# ===============================================
# Required - MedusaJS Backend Connection
# ===============================================

# Publishable API key from Medusa Admin
# How to get:
# 1. Login to Medusa Admin: https://[railway-url]/app
# 2. Go to Settings → API Keys
# 3. Create new Publishable Key
# 4. Copy the key (starts with "pk_")
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key_here

# Backend URL (Railway deployment from CORE-21)
# Production: https://[railway-project-name].railway.app
# Local: http://localhost:9000
MEDUSA_BACKEND_URL=https://your-backend.railway.app

# ===============================================
# Optional - Site Configuration
# ===============================================

# Base URL for the storefront (Vercel production URL)
# Used for canonical URLs, Open Graph, etc.
# Production: https://[vercel-project-name].vercel.app
# Local: http://localhost:8000
NEXT_PUBLIC_BASE_URL=https://your-storefront.vercel.app

# Default region for products and pricing
# Options: us, eu, dk, etc. (depends on regions configured in Medusa)
NEXT_PUBLIC_DEFAULT_REGION=dk

# ===============================================
# Optional - Medusa Cloud (if using)
# ===============================================

# Only needed if using Medusa Cloud for image storage
# MEDUSA_CLOUD_S3_HOSTNAME=
# MEDUSA_CLOUD_S3_PATHNAME=

# ===============================================
# Development Only (not needed in Vercel)
# ===============================================

# These are used for local development only
# and should NOT be set in Vercel production

# NODE_ENV=development
# SKIP_ENV_VALIDATION=true
```
**Rationale:** 
- Template viser alle påkrævede og optional variabler
- Klare kommentarer forklarer hvor man får hver værdi
- Placeholder værdier med clear instructions
- Grouped by category for readability

#### 2. Create Deployment Documentation
**File:** `.project/deployment-storefront.md` (new)
**Changes:** Opret comprehensive deployment guide
```markdown
# Storefront Deployment Guide - Vercel

## Overview
Deployment guide for Next.js storefront til Vercel platform.

**Last Updated:** 2025-10-31  
**Related Ticket:** CORE-22  
**Backend:** CORE-21 (Railway)

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub repository access
- Railway backend deployed (CORE-21 completed)
- Medusa Admin access for Publishable API key

## Step-by-Step Deployment

### Step 1: Create Publishable API Key

**Why:** Storefront needs a publishable API key to fetch data from backend.

**How:**
1. Open Medusa Admin: `https://[railway-url]/app`
2. Login with admin credentials (created in CORE-21)
3. Navigate to: Settings → API Keys → Publishable Keys
4. Click "Create Publishable Key"
5. Name: "Beauty Shop Storefront - Production"
6. Copy the generated key (starts with `pk_`)
7. ⚠️ Save this key securely - you'll need it for Vercel

**Troubleshooting:**
- If "API Keys" menu missing: Update Medusa to latest version
- If key generation fails: Check backend logs for errors

---

### Step 2: Create Vercel Project

**Why:** Connect GitHub repository to Vercel for automatic deployments.

**How:**
1. Login to Vercel dashboard: https://vercel.com
2. Click "Add New..." → "Project"
3. Import Git Repository: Select `beauty-shop` repository
4. Configure Project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `beauty-shop-storefront/` ⚠️ IMPORTANT
   - **Build Command:** `yarn build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `yarn install` (auto-detected)
5. DO NOT deploy yet - configure environment variables first
6. Click "Environment Variables" to expand section

---

### Step 3: Configure Environment Variables (Vercel)

**Why:** Storefront needs environment variables to connect to backend.

**How:**

**In Vercel Project Settings → Environment Variables:**

Add these variables for **both Production and Preview** environments:

**Required Variables:**

1. **NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY**
   - Value: Publishable key from Step 1 (starts with `pk_`)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

2. **MEDUSA_BACKEND_URL**
   - Value: Railway backend URL (e.g., `https://your-backend.railway.app`)
   - Get from: Railway dashboard → Service URL
   - Environments: ✅ Production, ✅ Preview, ✅ Development

**Optional Variables:**

3. **NEXT_PUBLIC_BASE_URL**
   - Value: Your Vercel production URL (e.g., `https://beauty-shop.vercel.app`)
   - ⚠️ Can be set after first deployment (update later)
   - Environments: ✅ Production

4. **NEXT_PUBLIC_DEFAULT_REGION**
   - Value: `dk` (or your preferred default region)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

**Important Notes:**
- ⚠️ Variables starting with `NEXT_PUBLIC_` are exposed to browser
- ⚠️ `MEDUSA_BACKEND_URL` is server-side only (not exposed)
- ⚠️ All variables are case-sensitive
- ⚠️ No trailing slashes in URLs

**Verification:**
- [ ] All required variables added
- [ ] All variables set for Production environment
- [ ] All variables set for Preview environment (PR deployments)
- [ ] No typos in variable names
- [ ] Railway backend URL is correct

---

### Step 4: Configure GitHub Secrets

**Why:** GitHub Actions needs Vercel credentials to deploy from CI/CD pipeline.

**How:**

**4A. Get Vercel Credentials:**

1. **VERCEL_TOKEN:**
   - Go to: https://vercel.com/account/tokens
   - Click "Create Token"
   - Name: `Beauty Shop CI/CD`
   - Scope: Full Account
   - Expiration: No Expiration (or 1 year)
   - Click "Create"
   - Copy token immediately (only shown once)

2. **VERCEL_ORG_ID:**
   - Go to Vercel Dashboard → Settings
   - Under "General" → find "Your ID" or "Team ID"
   - Copy the ID (starts with `team_` for teams, or `user_` for personal)

3. **VERCEL_PROJECT_ID:**
   - Go to your Vercel project → Settings → General
   - Scroll to "Project ID"
   - Copy the ID (starts with `prj_`)

**4B. Add Secrets to GitHub:**

1. Go to: `https://github.com/eskoubar95/beauty-shop/settings/secrets/actions`
2. Click "New repository secret" for each:

   - **Name:** `VERCEL_TOKEN`
     **Value:** [Token from step 4A.1]

   - **Name:** `VERCEL_ORG_ID`
     **Value:** [Org/Team ID from step 4A.2]

   - **Name:** `VERCEL_PROJECT_ID`
     **Value:** [Project ID from step 4A.3]

3. Verify all three secrets are listed

**Verification:**
- [ ] All three secrets added to GitHub
- [ ] Secret names match exactly (case-sensitive)
- [ ] No trailing spaces in values

---

### Step 5: Deploy to Production

**Why:** Trigger initial deployment to verify everything works.

**How:**

**Option A: Deploy from Vercel Dashboard (Recommended for first deploy)**
1. In Vercel project settings, click "Deploy"
2. Select branch: `main`
3. Click "Deploy"
4. Monitor build logs in real-time
5. Wait for deployment to complete (2-3 minutes)

**Option B: Deploy via Git Push (for subsequent deploys)**
```bash
# Commit .env.example and documentation
git add beauty-shop-storefront/.env.example .project/deployment-storefront.md
git commit -m "feat(CORE-22): Add Vercel deployment configuration and documentation"
git push origin main
```
GitHub Actions will automatically trigger Vercel deployment.

**Monitor Deployment:**
- Vercel dashboard → Deployments → Latest
- Watch build logs for errors
- Check for warnings or missing environment variables

**Verification:**
- [ ] Build completes successfully (green check)
- [ ] Deployment status: "Ready"
- [ ] Production URL assigned (e.g., `https://beauty-shop.vercel.app`)

---

### Step 6: Verify Deployment

**Why:** Ensure storefront works correctly and can connect to backend.

**How:**

**6A. Basic Functionality:**

1. **Homepage Loads:**
   - Visit: `https://[your-project].vercel.app`
   - Expected: Homepage loads with no errors
   - Check: No 404s, no blank page

2. **Backend Connection:**
   - Open browser console (F12)
   - Check Network tab for API calls to Railway backend
   - Expected: API calls succeed (status 200)
   - Check: No CORS errors

3. **Products Display:**
   - Navigate to product listing page
   - Expected: Products load (or empty state if no products seeded)
   - Check: No "Failed to fetch" errors

4. **Images Display:**
   - Verify product images load correctly
   - Expected: Images from backend render
   - Check: No broken image icons

5. **Cart Functionality:**
   - Try adding a product to cart
   - Expected: Cart updates correctly
   - Check: Cart icon shows item count

**6B. Performance Check:**

Run Lighthouse audit (Chrome DevTools):
```bash
# Open Chrome DevTools → Lighthouse
# Run audit for "Performance" and "Accessibility"
```

**Expected:**
- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90

**6C. Console Check:**

Open browser console (F12) and verify:
- [ ] No critical errors (red messages)
- [ ] No CORS errors
- [ ] No 404 errors for assets
- [ ] API calls to backend succeed
- [ ] Environment variables loaded correctly

**6D. SSL/TLS Check:**

- Browser shows secure connection (🔒 padlock icon)
- Certificate valid and issued by Vercel
- No SSL warnings

**Verification Checklist:**
- [ ] Homepage loads without errors
- [ ] Backend API calls succeed (no CORS)
- [ ] Products fetch correctly (or empty state shown)
- [ ] Images display correctly
- [ ] Cart functionality works
- [ ] No critical console errors
- [ ] SSL/TLS certificate valid
- [ ] Lighthouse Performance > 85
- [ ] Lighthouse Accessibility > 90

---

### Step 7: Configure CORS (Backend)

**Why:** Backend must allow requests from Vercel production URL.

**How:**

1. **Get Vercel Production URL:**
   - From Vercel dashboard (e.g., `https://beauty-shop.vercel.app`)

2. **Update Railway Environment Variables:**
   - Go to Railway dashboard → `beauty-shop-server` service
   - Go to Variables tab
   - Update `STORE_CORS` variable:
     ```
     STORE_CORS=https://beauty-shop.vercel.app,http://localhost:8000
     ```
     (Comma-separated list, no spaces)

3. **Restart Backend Service:**
   - Railway will auto-restart when variables change
   - Or manually restart: Service → Settings → Restart

4. **Verify CORS:**
   - Visit storefront again
   - Check browser console - CORS errors should be gone
   - Test product fetching

**Verification:**
- [ ] `STORE_CORS` updated with Vercel URL
- [ ] Backend service restarted
- [ ] No CORS errors in browser console
- [ ] API calls from storefront succeed

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Check `yarn.lock` is up to date
- Verify all dependencies in `package.json`
- Try: `yarn install` locally first

**Error: "Environment variable missing: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"**
- Verify variable is set in Vercel dashboard
- Check variable name spelling (case-sensitive)
- Ensure variable is set for correct environment (Production/Preview)

**Error: "TypeScript compilation failed"**
- Check Vercel build logs for specific errors
- Verify `tsconfig.json` is correct
- Note: TypeScript errors are ignored in build (intentional)

---

### Deployment Fails

**Error: "Build exceeded maximum duration"**
- Vercel free tier has 5-minute build limit
- Check if `node_modules` cache is working
- Consider upgrading Vercel plan if needed

**Error: "Root directory not found"**
- Verify root directory set to `beauty-shop-storefront/`
- Check setting in Vercel Project Settings → General

**Error: "Failed to connect to backend"**
- Verify `MEDUSA_BACKEND_URL` is correct
- Test Railway backend URL directly: `https://[railway-url]/health`
- Check Railway backend is running (not crashed)

---

### Runtime Issues

**Products not loading / Empty product list**
- Check if products are seeded in Medusa Admin
- Verify publishable API key has correct permissions
- Check backend logs for errors
- Test API endpoint directly: `https://[railway-url]/store/products`

**CORS errors in console**
- Verify `STORE_CORS` in Railway includes Vercel URL
- Check for trailing slashes (should not have)
- Verify Railway backend restarted after CORS update

**Images not loading**
- Verify image URLs in backend response
- Check Next.js image optimization settings
- Verify image remote patterns in `next.config.js`

**Cart not working**
- Check browser console for errors
- Verify MedusaJS SDK initialized correctly
- Check publishable API key is valid

---

## Updating Deployment

### Update Environment Variables
1. Vercel dashboard → Project → Settings → Environment Variables
2. Edit/add variables as needed
3. Redeploy: Vercel will auto-redeploy when variables change

### Update Code
1. Push changes to GitHub
2. Vercel auto-deploys on push to `main` branch
3. Preview deployments created for PRs automatically

### View Logs
- Vercel dashboard → Project → Deployments → [Deployment] → Logs
- Or: `vercel logs` (if Vercel CLI installed)

---

## CI/CD Integration

### How It Works

**PR Preview Deployments:**
- Every PR automatically triggers a Vercel preview deployment
- GitHub Actions runs Vercel deployment via `amondnet/vercel-action`
- Preview URL posted as PR comment
- Useful for testing changes before merging

**Production Deployments:**
- Push to `main` branch triggers production deployment
- GitHub Actions deploys to Vercel with `--prod` flag
- Production URL updated automatically

**Workflow File:**
- Location: `.github/workflows/ci.yml` (lines 132-218)
- Job name: `deploy-storefront`
- Trigger: Push to `main` OR pull request
- Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

---

## Production Checklist

Before marking deployment as production-ready:

- [ ] Vercel project created and connected to GitHub
- [ ] Root directory set to `beauty-shop-storefront/`
- [ ] All environment variables set in Vercel (Production + Preview)
- [ ] All GitHub secrets configured (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`)
- [ ] Publishable API key created and configured
- [ ] Production deployment successful
- [ ] Homepage loads without errors
- [ ] Backend API calls succeed (no CORS errors)
- [ ] Products fetch correctly
- [ ] Images display correctly
- [ ] Cart functionality works
- [ ] SSL/TLS certificate valid
- [ ] Lighthouse Performance > 85
- [ ] No critical console errors
- [ ] CORS configured correctly in backend
- [ ] PR preview deployments work
- [ ] GitHub Actions deployment job succeeds

---

## Related Documentation

- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [GitHub Actions Vercel Integration](https://github.com/amondnet/vercel-action)
- Backend Deployment: `.project/plans/2025-10-29-CORE-21-deploy-medusajs-backend-to-railway.md`
- Linear: CORE-22

---

**Deployment Status:** Ready for Implementation  
**Estimated Time:** 1-2 hours (mostly manual setup + verification)  
**Risk Level:** Low-Medium (infrastructure setup, requires manual steps)

```
**Rationale:** 
- Comprehensive step-by-step guide for future developers
- Troubleshooting section saves time
- Production checklist ensures quality
- Clear verification steps at each phase

### Success Criteria:

#### Automated Verification:
- [ ] `.env.example` file exists in `beauty-shop-storefront/` directory
- [ ] `.env.example` has valid syntax (no parse errors)
- [ ] Deployment documentation exists at `.project/deployment-storefront.md`
- [ ] Git status shows new files ready to commit
- [ ] Local build succeeds: `cd beauty-shop-storefront && yarn build`

#### Manual Verification:
- [ ] `.env.example` includes all required variables from ticket
- [ ] Template comments explain where to get each value
- [ ] Documentation is clear and comprehensive
- [ ] All troubleshooting sections included
- [ ] Production checklist is complete

**⚠️ PAUSE HERE** - Review configuration files og documentation før proceeding til manual Vercel setup.

---

## Phase 2: Create Publishable API Key (Manual)

### Overview
Login til Medusa Admin på Railway deployment og opret publishable API key. Denne key er påkrævet for at storefront kan fetche data fra backend.

### Changes Required:

#### 1. Login to Medusa Admin (Manual)
**Action:** Access Railway backend admin panel
**Steps:**
1. Get Railway backend URL from CORE-21 deployment
   - Go to: Railway dashboard → `beauty-shop-server` service
   - Copy the public URL (e.g., `https://beauty-shop-production.railway.app`)

2. Navigate to admin panel:
   ```
   https://[railway-url]/app
   ```

3. Login with admin credentials:
   - Email: Created in CORE-21 (e.g., `admin@beautyshop.com`)
   - Password: Set during admin user creation

**Troubleshooting:**
- If login page doesn't load: Check Railway backend is running
- If CORS error: Verify `ADMIN_CORS` includes Railway URL
- If 404: Verify `/app` path is correct

**Rationale:**
- Publishable API key må oprettes via admin panel
- Cannot be created via API or CLI
- Requires admin user login

#### 2. Create Publishable Key (Manual)
**Action:** Medusa Admin → Settings → API Keys
**Steps:**
1. After login, navigate to: Settings → API Keys → Publishable Keys
2. Click "Create Publishable Key" button
3. Fill in details:
   - **Name:** `Beauty Shop Storefront - Production`
   - **Description:** `Production publishable key for Vercel deployment`
   - (Other fields optional)
4. Click "Create" or "Save"
5. Copy the generated key (starts with `pk_`)
   - ⚠️ **IMPORTANT:** Save this key immediately
   - Format: `pk_[random-string]`
   - You'll need it for Phase 3 (Vercel environment variables)

**Important Notes:**
- ⚠️ Key is only shown once during creation
- ⚠️ If you lose it, you must create a new one
- ⚠️ Key is not a secret (can be exposed in frontend code)
- ⚠️ But should still be treated carefully

**Rationale:**
- Publishable key identifies storefront to backend
- Allows backend to apply correct settings (regions, currencies, etc.)
- Required for MedusaJS SDK initialization

#### 3. Save Key Securely (Manual)
**Action:** Store key for later use
**Recommended Methods:**
- Password manager (1Password, LastPass)
- Secure note
- Temporary text file (delete after Phase 3)

**DO NOT:**
- ❌ Commit to git
- ❌ Share in Slack/email
- ❌ Store in plain text long-term

### Success Criteria:

#### Manual Verification:
- [ ] Successfully logged into Medusa Admin on Railway
- [ ] Navigated to API Keys section
- [ ] Created new Publishable Key named "Beauty Shop Storefront - Production"
- [ ] Copied publishable key (starts with `pk_`)
- [ ] Key saved securely for Phase 3
- [ ] Verified key format: `pk_[alphanumeric-string]`

**⚠️ PAUSE HERE** - Do NOT proceed til Phase 3 without the publishable key. If you lost it, create a new one.

---

## Phase 3: Manual Vercel Setup (Manual)

### Overview
Opret Vercel project via Vercel dashboard, connect til GitHub repository og configure correct root directory. Dette er primært manuel process i Vercel dashboard.

### Changes Required:

#### 1. Create Vercel Project (Manual)
**Action:** Vercel Dashboard
**Steps:**
1. Login til Vercel (https://vercel.com)
2. Click "Add New..." → "Project"
3. If first time: Authorize Vercel GitHub App
   - Grant access to `beauty-shop` repository (or all repositories)
4. Import Git Repository:
   - Select `eskoubar95/beauty-shop` (eller relevant org/repo)
   - Click "Import"
5. Configure Project Settings:
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** Click "Edit" → Type `beauty-shop-storefront/` ⚠️ CRITICAL
   - **Build Command:** `yarn build` (auto-detected from package.json)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `yarn install` (auto-detected)
   - **Node.js Version:** 20.x (auto-detected or select)
6. **DO NOT click "Deploy" yet** - configure environment variables first (Phase 4)

**Rationale:** 
- Vercel skal bygge fra `beauty-shop-storefront/` directory
- Root directory indeholder flere projects (storefront, backend)
- Vercel auto-detects Next.js og Yarn

**Important Notes:**
- ⚠️ Root directory SKAL være `beauty-shop-storefront/` (med trailing slash)
- ⚠️ Hvis forkert root directory, build vil fejle (cannot find package.json)
- ⚠️ Framework preset skal være Next.js (ikke andet)

#### 2. Verify Project Settings (Manual)
**Action:** Vercel Project Settings → General
**Verification:**
- [ ] Framework: Next.js
- [ ] Root Directory: `beauty-shop-storefront/`
- [ ] Build Command: `yarn build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `yarn install` or `yarn`
- [ ] Node.js Version: 20.x

**Troubleshooting:**
- If wrong settings detected: Edit in Project Settings → General
- If wrong root directory: Click "Edit" next to Root Directory
- If wrong framework: Select "Next.js" from dropdown

### Success Criteria:

#### Manual Verification:
- [ ] Vercel project created successfully
- [ ] GitHub repository connected (`eskoubar95/beauty-shop`)
- [ ] Root directory set to `beauty-shop-storefront/` (verified in settings)
- [ ] Framework preset: Next.js
- [ ] Build command: `yarn build`
- [ ] Install command detected correctly
- [ ] Node.js version: 20.x
- [ ] Project has a unique name (auto-generated or custom)

**⚠️ PAUSE HERE** - Do NOT deploy yet. Configure environment variables first (Phase 4).

---

## Phase 4: Configure Environment Variables (Manual)

### Overview
Sæt alle påkrævede environment variables i Vercel dashboard for både Production og Preview environments.

### Changes Required:

#### 1. Add Required Environment Variables (Manual)
**Action:** Vercel Project → Settings → Environment Variables
**Steps:**

**For EACH variable below:**
1. Click "Add New" or "Add Another"
2. Enter Key (name)
3. Enter Value
4. Select Environments:
   - ✅ Production
   - ✅ Preview (for PR deployments)
   - ✅ Development (optional, for local `vercel dev`)
5. Click "Save"

**Required Variables:**

**1. NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY**
- **Key:** `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- **Value:** Publishable key from Phase 2 (starts with `pk_`)
- **Environments:** Production, Preview, Development
- **Rationale:** Required for MedusaJS SDK initialization

**2. MEDUSA_BACKEND_URL**
- **Key:** `MEDUSA_BACKEND_URL`
- **Value:** Railway backend URL (e.g., `https://beauty-shop-production.railway.app`)
- **Environments:** Production, Preview, Development
- **Rationale:** Storefront needs to know where backend API is

**Optional Variables:**

**3. NEXT_PUBLIC_BASE_URL**
- **Key:** `NEXT_PUBLIC_BASE_URL`
- **Value:** Vercel production URL (e.g., `https://beauty-shop.vercel.app`)
- **Environments:** Production only
- **Note:** ⚠️ Can be set after first deployment (update later with actual URL)
- **Rationale:** Used for canonical URLs, Open Graph metadata

**4. NEXT_PUBLIC_DEFAULT_REGION**
- **Key:** `NEXT_PUBLIC_DEFAULT_REGION`
- **Value:** `dk` (or your preferred default region)
- **Environments:** Production, Preview, Development
- **Rationale:** Sets default region for products and pricing

**Important Notes:**
- ⚠️ Variables starting with `NEXT_PUBLIC_` are exposed to browser (public)
- ⚠️ `MEDUSA_BACKEND_URL` is server-side only (not exposed to browser)
- ⚠️ All variable names are case-sensitive
- ⚠️ No trailing slashes in URLs
- ⚠️ Railway URL format: `https://[project-name].railway.app` (no trailing slash)

#### 2. Verify Environment Variables (Manual)
**Action:** Vercel Project → Settings → Environment Variables
**Verification Checklist:**
- [ ] `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` added
- [ ] Publishable key value starts with `pk_`
- [ ] `MEDUSA_BACKEND_URL` added
- [ ] Backend URL is correct (test: `https://[railway-url]/health`)
- [ ] All required variables set for **Production** environment
- [ ] All required variables set for **Preview** environment
- [ ] No typos in variable names
- [ ] No trailing spaces in values
- [ ] No trailing slashes in URLs

### Success Criteria:

#### Manual Verification:
- [ ] All required environment variables added in Vercel
- [ ] `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` set correctly (starts with `pk_`)
- [ ] `MEDUSA_BACKEND_URL` set correctly (Railway URL)
- [ ] Variables set for both Production and Preview environments
- [ ] Variable names match exactly (case-sensitive)
- [ ] Backend URL tested and accessible (`/health` returns 200)

**⚠️ PAUSE HERE** - Verify all environment variables are correct before deploying. Missing or incorrect variables will cause deployment to fail or storefront to not work.

---

## Phase 5: Configure GitHub Secrets (Manual)

### Overview
Sæt Vercel credentials som GitHub repository secrets så CI/CD pipeline kan deploye fra GitHub Actions.

### Changes Required:

#### 1. Get Vercel Credentials (Manual)
**Action:** Retrieve Vercel API credentials

**1A. VERCEL_TOKEN:**
1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Token Name: `Beauty Shop CI/CD`
4. Scope: Full Account (required for deployments)
5. Expiration: No Expiration (or 1 year)
6. Click "Create"
7. Copy token immediately (only shown once)
   - Format: `[long-alphanumeric-string]`
   - ⚠️ Save securely - will be added to GitHub in next step

**1B. VERCEL_ORG_ID:**
1. Go to Vercel Dashboard → Settings
2. Scroll to "General" section
3. Find "Your ID" (personal account) or "Team ID" (team account)
4. Copy the ID
   - Format: `team_[random]` (team) or `user_[random]` (personal)

**1C. VERCEL_PROJECT_ID:**
1. Go to Vercel project you just created
2. Click Settings → General
3. Scroll to "Project ID"
4. Copy the ID
   - Format: `prj_[random]`

**Important Notes:**
- ⚠️ VERCEL_TOKEN is sensitive - treat like a password
- ⚠️ Token is only shown once during creation
- ⚠️ If you lose token, create a new one

#### 2. Add Secrets to GitHub (Manual)
**Action:** GitHub Repository Settings → Secrets
**Steps:**

1. Go to: `https://github.com/eskoubar95/beauty-shop/settings/secrets/actions`
2. Click "New repository secret" button

**For EACH secret:**

**Secret 1: VERCEL_TOKEN**
- Click "New repository secret"
- Name: `VERCEL_TOKEN`
- Value: [Token from step 1A]
- Click "Add secret"

**Secret 2: VERCEL_ORG_ID**
- Click "New repository secret"
- Name: `VERCEL_ORG_ID`
- Value: [Org/Team ID from step 1B]
- Click "Add secret"

**Secret 3: VERCEL_PROJECT_ID**
- Click "New repository secret"
- Name: `VERCEL_PROJECT_ID`
- Value: [Project ID from step 1C]
- Click "Add secret"

#### 3. Verify GitHub Secrets (Manual)
**Action:** GitHub Repository → Settings → Secrets and variables → Actions
**Verification:**
- [ ] All three secrets are listed
- [ ] Secret names match exactly (case-sensitive):
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
- [ ] Secret values are hidden (shows `***`)
- [ ] No typos in secret names

**Rationale:**
- GitHub Actions needs these secrets to deploy to Vercel
- CI/CD pipeline checks for these secrets before deploying (`.github/workflows/ci.yml:180-192`)
- Without secrets, CI/CD skips Vercel deployment with warning

### Success Criteria:

#### Manual Verification:
- [ ] VERCEL_TOKEN created successfully
- [ ] VERCEL_ORG_ID retrieved from Vercel dashboard
- [ ] VERCEL_PROJECT_ID retrieved from Vercel project settings
- [ ] All three secrets added to GitHub repository
- [ ] Secret names match exactly (no typos)
- [ ] Secrets are visible in GitHub Settings → Secrets → Actions

**⚠️ PAUSE HERE** - Verify all GitHub secrets are correct. Incorrect secrets will cause CI/CD deployment to fail.

---

## Phase 6: Deployment & Verification

### Overview
Trigger initial deployment via Vercel dashboard, monitor build logs, og verificer alle kritiske funktioner.

### Changes Required:

#### 1. Trigger Initial Deployment (Manual)
**Action:** Deploy via Vercel dashboard (first deployment)
**Steps:**
1. Go to Vercel project dashboard
2. Click "Deploy" button (usually top right)
3. If prompted: Select branch `main`
4. Click "Deploy" to confirm
5. Monitor build logs in real-time

**Alternative - Deploy via Git Push:**
```bash
# If Phase 1 files not committed yet
git add beauty-shop-storefront/.env.example .project/deployment-storefront.md
git commit -m "feat(CORE-22): Add Vercel deployment configuration and documentation"
git push origin main
```
Vercel will auto-deploy on push to `main` branch.

**Monitor Deployment:**
1. Vercel dashboard → Deployments → [Latest deployment]
2. Watch build logs
3. Look for errors or warnings
4. Verify environment variables loaded correctly

**Expected Build Output:**
```
Installing dependencies...
yarn install v3.2.3
...
Building Next.js application...
> yarn build
...
Compiled successfully
...
Deployment successful!
```

**Troubleshooting:**
- If build fails: Check build logs for specific error
- If missing env var: Go back to Phase 4 and add it
- If wrong root directory: Go back to Phase 3 and fix

#### 2. Verify Production URL (Manual)
**Action:** Access deployed storefront
**Steps:**
1. After deployment completes, Vercel shows production URL
2. Copy URL (e.g., `https://beauty-shop-asdf123.vercel.app`)
3. Open in browser
4. Verify homepage loads

**Expected:**
- Homepage loads without errors
- No blank page
- No 404 errors
- Content renders correctly

**Troubleshooting:**
- If 404: Check root directory setting
- If blank page: Check browser console for errors
- If server error: Check Vercel logs

#### 3. Update NEXT_PUBLIC_BASE_URL (Manual - Optional)
**Action:** Update environment variable with actual Vercel URL
**Steps:**
1. Go to Vercel Project → Settings → Environment Variables
2. Find `NEXT_PUBLIC_BASE_URL`
3. Edit value to actual Vercel production URL (e.g., `https://beauty-shop-asdf123.vercel.app`)
4. Select "Production" environment only
5. Save
6. Redeploy (Vercel will prompt or auto-redeploy)

**Note:** This step is optional but recommended for correct canonical URLs and Open Graph metadata.

#### 4. Test Backend Connection (Manual)
**Action:** Verify storefront can fetch data from Railway backend
**Steps:**
1. Open storefront in browser
2. Open browser console (F12)
3. Go to Network tab
4. Navigate to product listing or homepage
5. Look for API calls to Railway backend URL
6. Verify API calls succeed (status 200)

**Expected:**
- Network tab shows requests to `https://[railway-url]/store/...`
- All requests return 200 OK
- No CORS errors in console
- Products load (or empty state if no products seeded)

**Troubleshooting:**
- If CORS error: Go to Phase 7 (Configure CORS)
- If 500 error: Check Railway backend logs
- If connection refused: Verify Railway backend is running

#### 5. Test Core Functionality (Manual)
**Action:** Test critical user flows
**Tests:**

**5A. Homepage:**
- [ ] Homepage loads without errors
- [ ] Hero section visible
- [ ] Featured products section visible (if products exist)
- [ ] Footer loads correctly
- [ ] Navigation menu works

**5B. Product Listing:**
- [ ] Navigate to store/products page
- [ ] Products load (or empty state shown)
- [ ] Product images display
- [ ] Product prices visible
- [ ] Filtering works (if applicable)

**5C. Product Detail Page:**
- [ ] Click on a product
- [ ] Product detail page loads
- [ ] Product images display in gallery
- [ ] "Add to Cart" button visible
- [ ] Product description renders

**5D. Cart:**
- [ ] Click "Add to Cart" on a product
- [ ] Cart icon updates with count
- [ ] Cart dropdown/page shows product
- [ ] Quantity can be adjusted
- [ ] Remove from cart works

**5E. Console Check:**
- [ ] Open browser console (F12)
- [ ] No critical errors (red messages)
- [ ] No CORS errors
- [ ] No 404 errors for assets
- [ ] API calls succeed

**5F. Performance:**
- [ ] Pages load quickly (< 3 seconds)
- [ ] No layout shifts
- [ ] Images lazy-load correctly
- [ ] Smooth scrolling

#### 6. Run Lighthouse Audit (Manual)
**Action:** Performance and accessibility check
**Steps:**
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
4. Click "Analyze page load"
5. Wait for results

**Expected Scores:**
- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

**If scores low:**
- Performance issues: Often due to images (check image optimization)
- Accessibility issues: Check for missing alt text, contrast issues
- Best Practices: Check console for mixed content warnings
- SEO: Check for missing meta tags

#### 7. Verify SSL/TLS (Manual)
**Action:** Check HTTPS certificate
**Steps:**
1. Visit storefront URL
2. Check browser address bar for padlock icon (🔒)
3. Click padlock → View certificate
4. Verify:
   - Issued by: Vercel
   - Valid dates (not expired)
   - Domain matches

**Expected:**
- Browser shows secure connection (green padlock)
- No SSL warnings
- Certificate valid

### Success Criteria:

#### Automated Verification:
- [ ] Vercel build completes successfully
- [ ] Deployment status: "Ready" (green)
- [ ] Production URL assigned

#### Manual Verification:
- [ ] Production URL accessible
- [ ] Homepage loads without errors
- [ ] Backend API calls succeed (no CORS errors)
- [ ] Products fetch correctly (or empty state if no products)
- [ ] Images display correctly
- [ ] Cart functionality works
- [ ] No critical console errors
- [ ] SSL/TLS certificate valid
- [ ] Lighthouse Performance > 85
- [ ] Lighthouse Accessibility > 90
- [ ] All core user flows work

**⚠️ PAUSE HERE** - If any verification fails, troubleshoot before proceeding to Phase 7 (CORS configuration).

---

## Phase 7: Configure CORS (Backend Update)

### Overview
Opdater backend CORS configuration til at tillade requests fra Vercel production URL.

### Changes Required:

#### 1. Update STORE_CORS in Railway (Manual)
**Action:** Railway Dashboard → Backend Service → Variables
**Steps:**
1. Get Vercel production URL from Phase 6 (e.g., `https://beauty-shop-asdf123.vercel.app`)
2. Go to Railway dashboard
3. Navigate to `beauty-shop-server` service
4. Go to Variables tab
5. Find `STORE_CORS` variable
6. Edit value to include Vercel URL:
   ```
   STORE_CORS=https://beauty-shop-asdf123.vercel.app,http://localhost:8000
   ```
   - ⚠️ Comma-separated list
   - ⚠️ No spaces between URLs
   - ⚠️ No trailing slashes
7. Save variable
8. Railway will auto-restart service

**Rationale:**
- Backend must explicitly allow requests from Vercel domain
- CORS policy prevents unauthorized cross-origin requests
- Localhost included for local development

**Important Notes:**
- ⚠️ Variable name is `STORE_CORS` (not `CORS` or `CORS_ORIGIN`)
- ⚠️ URLs must match exactly (https, no trailing slash)
- ⚠️ Railway auto-restarts service when variables change (wait ~30 seconds)

#### 2. Verify CORS Update (Manual)
**Action:** Test storefront after backend restart
**Steps:**
1. Wait for Railway backend to restart (~30-60 seconds)
2. Verify backend is running:
   ```bash
   curl https://[railway-url]/health
   ```
   Expected: 200 OK

3. Refresh storefront in browser
4. Open browser console (F12)
5. Navigate to product listing
6. Check Network tab for API calls
7. Verify:
   - No CORS errors in console
   - API calls succeed (status 200)
   - Products load correctly

**Expected:**
- No CORS errors: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- API calls succeed
- Products fetch and display

**Troubleshooting:**
- If still CORS errors: Double-check `STORE_CORS` variable (no typos, no spaces)
- If backend not responding: Check Railway logs for errors
- If variable not updating: Try manual restart: Railway → Service → Settings → Restart

### Success Criteria:

#### Manual Verification:
- [ ] `STORE_CORS` variable updated in Railway with Vercel URL
- [ ] Railway backend service restarted successfully
- [ ] Backend health endpoint responds (200 OK)
- [ ] No CORS errors in browser console when visiting storefront
- [ ] API calls from storefront to backend succeed
- [ ] Products load correctly on storefront

**⚠️ PAUSE HERE** - Verify CORS is working before proceeding to CI/CD verification.

---

## Phase 8: Verify CI/CD Integration

### Overview
Test at GitHub Actions automatically deployer til Vercel ved PR og merge til main.

### Changes Required:

#### 1. Test PR Preview Deployment (Manual)
**Action:** Create test PR og verificer preview deployment
**Steps:**
1. Create a new branch:
   ```bash
   git checkout -b test/verify-vercel-deployment
   ```

2. Make a small change (e.g., update README):
   ```bash
   echo "\n\n<!-- Vercel deployment test -->" >> README.md
   git add README.md
   git commit -m "test: verify Vercel PR preview deployment"
   git push origin test/verify-vercel-deployment
   ```

3. Create PR on GitHub:
   - Go to repository on GitHub
   - GitHub will prompt "Compare & pull request"
   - Click it, fill in PR details
   - Create PR

4. Monitor GitHub Actions:
   - Go to PR → Checks tab
   - Watch `deploy-storefront` job
   - Should trigger Vercel deployment

5. Verify Preview URL:
   - GitHub Actions should post comment with preview URL
   - Click preview URL
   - Verify site loads correctly

**Expected:**
- GitHub Actions `deploy-storefront` job runs
- No errors in job logs
- Preview URL generated (e.g., `https://test-verify-vercel-deployment-beauty-shop.vercel.app`)
- Preview site loads correctly
- Comment posted to PR with preview URL

**Troubleshooting:**
- If job skipped: Check GitHub secrets are set correctly
- If job fails: Check job logs for specific error
- If no preview URL: Check Vercel dashboard → Deployments

#### 2. Test Production Deployment (Manual)
**Action:** Merge PR og verificer production deployment
**Steps:**
1. Merge test PR to main:
   - Approve PR (if review required)
   - Click "Merge pull request"
   - Confirm merge

2. Monitor GitHub Actions:
   - Go to repository → Actions tab
   - Watch latest workflow run for `main` branch
   - `deploy-storefront` job should run with `--prod` flag

3. Verify Production Deployment:
   - Wait for job to complete
   - Go to Vercel dashboard → Deployments
   - Latest deployment should be for `main` branch
   - Verify deployment successful

4. Verify Production Site:
   - Visit production URL
   - Verify changes are live
   - No regressions or errors

**Expected:**
- GitHub Actions runs on merge to main
- `deploy-storefront` job succeeds
- Production deployment created in Vercel
- Production site updated with changes

#### 3. Cleanup Test Branch (Manual)
**Action:** Delete test branch
```bash
git checkout main
git pull
git branch -d test/verify-vercel-deployment
git push origin --delete test/verify-vercel-deployment
```

### Success Criteria:

#### Automated Verification:
- [ ] GitHub Actions `deploy-storefront` job runs on PR creation
- [ ] GitHub Actions `deploy-storefront` job runs on merge to main
- [ ] No errors in job logs

#### Manual Verification:
- [ ] PR preview deployment created successfully
- [ ] Preview URL accessible and works correctly
- [ ] Preview deployment comment posted to PR (optional, depends on action config)
- [ ] Production deployment triggered on merge to main
- [ ] Production site updated correctly
- [ ] CI/CD integration fully functional

**⚠️ PAUSE HERE** - Verify CI/CD works before considering deployment complete.

---

## Testing Strategy

### Unit Tests
- Not required for this deployment task (infrastructure)
- Existing Next.js tests should still pass locally

### Integration Tests
- Can be run against Vercel URL in future (not part of this task)
- Manual testing covers core functionality

### Manual Testing Checklist
- [ ] Homepage loads
- [ ] Product listing loads
- [ ] Product detail page loads
- [ ] Add to cart works
- [ ] Cart page displays correctly
- [ ] Backend API calls succeed
- [ ] Images display
- [ ] Navigation works
- [ ] SSL certificate valid
- [ ] No CORS errors
- [ ] No console errors
- [ ] Performance acceptable (Lighthouse > 85)

### Production Verification
- [ ] All acceptance criteria from Linear ticket verified
- [ ] No critical errors in Vercel logs
- [ ] No critical errors in browser console
- [ ] Performance acceptable (< 3s page load)
- [ ] CI/CD integration working (PR previews + production deploys)

## Rollback Strategy

### If Deployment Fails

**Immediate Rollback:**
1. Vercel dashboard → Deployments
2. Find last known good deployment
3. Click "..." menu → "Promote to Production"
4. Investigate issues in failed deployment logs

**Code Rollback:**
1. Revert git commit that broke deployment:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
2. Vercel auto-deploys reverted version

**Configuration Rollback:**
1. Vercel dashboard → Settings → Environment Variables
2. Revert problematic environment variable
3. Redeploy (Vercel will prompt)

### If Production Issues Occur

**Quick Fixes:**
- Update environment variables (no redeploy needed if server-side only)
- Redeploy from Vercel dashboard
- Check Vercel logs for specific errors

**Severe Issues:**
- Promote previous deployment to production
- Fix issue locally and test
- Redeploy when fixed

**Backend Issues:**
- If issue is backend-related (CORS, API errors):
  - Check Railway backend logs
  - Update backend configuration if needed
  - No storefront redeployment needed

## References

### Linear Ticket
- **Issue:** CORE-22
- **URL:** https://linear.app/beauty-shop/issue/CORE-22/deploy-storefront-to-vercel

### Documentation
- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [GitHub Actions Vercel Integration](https://github.com/amondnet/vercel-action)
- [MedusaJS Publishable API Keys](https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys)

### Related Files
- `beauty-shop-storefront/.env.example` - Environment template (Phase 1)
- `beauty-shop-storefront/package.json` - Build scripts
- `beauty-shop-storefront/next.config.js` - Next.js configuration
- `beauty-shop-storefront/check-env-variables.js` - Environment validation
- `beauty-shop-storefront/src/lib/config.ts` - MedusaJS SDK configuration
- `.github/workflows/ci.yml` - CI/CD pipeline (lines 132-218)
- `.project/deployment-backend.md` - Backend deployment guide (CORE-21)
- `.project/plans/2025-10-29-CORE-21-deploy-medusajs-backend-to-railway.md` - Backend deployment plan

### Code References
- MedusaJS SDK config: `beauty-shop-storefront/src/lib/config.ts:1-14`
- Environment check: `beauty-shop-storefront/check-env-variables.js:3-10`
- Next.js config: `beauty-shop-storefront/next.config.js:14-56`
- CI/CD Vercel job: `.github/workflows/ci.yml:132-218`
- CI/CD secrets check: `.github/workflows/ci.yml:180-192`

---

## Notes & Considerations

### Important Reminders

1. **Root Directory** - MUST be `beauty-shop-storefront/` (trailing slash)
2. **Publishable API Key** - Required, må oprettes via Medusa Admin
3. **CORS Configuration** - Backend skal tillade Vercel URL
4. **GitHub Secrets** - All three secrets påkrævet for CI/CD
5. **Environment Variables** - Sæt for både Production og Preview
6. **Railway Backend** - Must be running and accessible
7. **Vercel Free Tier** - Sufficient for MVP (100 GB bandwidth, 1000 build minutes/month)

### Future Enhancements

- Custom domain setup (e.g., `shop.beautyshop.dk`)
- Vercel Analytics activation
- Error monitoring (Sentry) integration
- Performance monitoring
- A/B testing setup
- Image optimization tuning
- Preview URLs for specific branches

### Dependencies

**Blocked By:**
- CORE-21: Deploy Backend to Railway (✅ DONE)

**Blocks:**
- None directly
- Enables user-facing storefront access
- Enables product seeding and testing in production environment

---

**Plan Status:** ✅ Completed (2025-10-31)  
**Estimated Complexity:** 1-2 hours (primarily manual setup + verification)  
**Actual Time:** ~1-2 hours  
**Risk Level:** Low-Medium (infrastructure setup, requires manual steps)  
**Completion:** All 8 phases successfully implemented

---

## Execution Order Summary

1. ✅ **Phase 1:** Create `.env.example` og dokumentation (5-10 min) - **Completed**
2. ✅ **Phase 2:** Create Publishable API Key via Medusa Admin (5 min) - **Completed**
3. ✅ **Phase 3:** Create Vercel project og configure settings (10 min) - **Completed**
4. ✅ **Phase 4:** Add environment variables i Vercel (10 min) - **Completed**
5. ✅ **Phase 5:** Add GitHub secrets (10 min) - **Completed**
6. ✅ **Phase 6:** Deploy og verify functionality (20-30 min) - **Completed**
7. ✅ **Phase 7:** Configure CORS i backend (5 min) - **Completed**
8. ✅ **Phase 8:** Verify CI/CD integration (10-15 min) - **Completed**

**Total Estimated Time:** 1-2 hours  
**Actual Time:** ~1-2 hours

---

## Completion Summary

**Status:** ✅ **100% Complete** (Completed 2025-10-31)

### Deployment Results

**Production Deployment:**
- ✅ Production site live: https://guapo-storefront.vercel.app
- ✅ Build successful (compiled in 35.1s)
- ✅ All environment variables configured
- ✅ Backend integration working (Railway backend connected)
- ✅ CORS configured correctly

**CI/CD Integration:**
- ✅ GitHub Actions pipeline functional
- ✅ PR preview deployments working
- ✅ Production deployments trigger on merge to `main`
- ✅ All GitHub secrets configured correctly
- ✅ Test PR #10 verified deployment flow

**Verification:**
- ✅ All automated checks pass
- ✅ Build process stable
- ✅ GitHub Actions ↔ Vercel integration functional
- ✅ Production deployments reliable

**Known Issues:**
- ⚠️ Vercel previews can have temporary platform errors (intermittent, not code-related)
- ✅ Production deployments are stable

### Test Results

**PR Preview Deployment (Test PR #10):**
- ✅ GitHub Actions CI pipeline ran successfully
- ✅ Build completed without errors
- ✅ Vercel preview deployment created
- ✅ Preview URL generated and accessible

**Production Deployment:**
- ✅ PR #10 merged to main
- ✅ Production deployment successful
- ✅ Site accessible and functional

**Conclusion:**
CORE-22 is **100% complete**. All 8 phases successfully implemented. Storefront is live and CI/CD is fully operational! 🚀

