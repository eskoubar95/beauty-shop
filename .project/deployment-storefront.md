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

