# Payload CMS Reset Plan - CORE-26

**Date:** 2025-01-13  
**Branch:** `feature/CORE-26-payload-cms`  
**Status:** Reset and Reinstall with Official Command

---

## Current State

- **Branch:** `feature/CORE-26-payload-cms`
- **HEAD:** `413dfe4` (feat: implement frontpage polish for CORE-23 CORE-24)
- **Changes:** All uncommitted (modified + untracked files)
- **Status:** Payload setup fejler (tom `importMap.js`, admin UI virker ikke)

---

## Reset Strategy

**Option 1: Soft Reset (Recommended)**
- Discard all changes (modified + untracked files)
- Clean working directory
- Start fresh with official Payload installation

**Option 2: Manual Cleanup**
- Manually remove Payload-related files
- Keep analysis and plan files
- Start fresh with official Payload installation

---

## Step 1: Discard All Changes

**Actions:**
1. Discard modified files: `git restore .`
2. Remove untracked files: `git clean -fd`
3. Verify clean state: `git status`

**Files to be removed:**
- `beauty-shop-storefront/payload.config.ts`
- `beauty-shop-storefront/payload/`
- `beauty-shop-storefront/scripts/bootstrap-payload.ts`
- `beauty-shop-storefront/src/app/(payload)/`
- `beauty-shop-storefront/src/app/api/payload/`
- `.project/analysis/payload-*.md` (kan gemmes hvis nødvendigt)
- `.project/plans/2025-11-12-CORE-26-setup-payload-cms.md` (kan gemmes hvis nødvendigt)

**Files to be restored:**
- `.gitignore`
- `.project/08-Architecture.md`
- `README.md`
- `beauty-shop-storefront/check-env-variables.js`
- `beauty-shop-storefront/next.config.js`
- `beauty-shop-storefront/package.json`
- `beauty-shop-storefront/src/middleware.ts`
- `beauty-shop-storefront/tsconfig.json`
- `package.json`
- `scripts/validate-env.js`

---

## Step 2: Install Payload with Official Command

**Actions:**
1. Navigate to storefront: `cd beauty-shop-storefront`
2. Run Payload install: `npx create-payload-app@latest`
3. Follow prompts:
   - **Project type:** "Add to existing Next.js app"
   - **Database:** "PostgreSQL"
   - **Editor:** "Lexical"
   - **Admin route:** "/admin"
   - **TypeScript:** Yes
   - **Install dependencies:** Yes

**Expected output:**
- `payload.config.ts` created
- `next.config.js` updated with `withPayload`
- Admin route structure created: `src/app/(payload)/admin/[[...slug]]/page.tsx`
- API route created: `src/app/api/[...slug]/route.ts`
- Dependencies installed

---

## Step 3: Configure Payload for Supabase

**Actions:**
1. Update `payload.config.ts`:
   - Set `DATABASE_URL` from environment
   - Set `schemaName: "payload"`
   - Configure `serverURL` and `secret`
   - Verify `editor: lexicalEditor()`
   - Verify `db: postgresAdapter()`

2. Update `.env.local`:
   - Add `DATABASE_URL` (from `beauty-shop/.env`)
   - Add `PAYLOAD_SECRET` (generate new or use existing)
   - Add `PAYLOAD_PUBLIC_SERVER_URL=http://localhost:8000`
   - Add `PAYLOAD_ADMIN_EMAIL` (for bootstrap)
   - Add `PAYLOAD_ADMIN_PASSWORD` (for bootstrap)

3. Update `next.config.js`:
   - Verify `withPayload` plugin configured
   - Verify `configPath` points to `payload.config.ts`
   - Check for conflicts with existing config

4. Update `src/middleware.ts`:
   - Verify `/admin` and `/api/payload` routes are excluded from country code redirection

---

## Step 4: Test Admin UI

**Actions:**
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:8000/admin`
3. Verify admin UI loads
4. Test login (if bootstrap user created)
5. Verify dashboard loads

**Expected:**
- Admin UI loads without errors
- No `importMap.js` errors
- No config Context errors
- Dashboard displays correctly

---

## Step 5: Bootstrap Admin User

**Actions:**
1. Check if Payload created bootstrap script
2. If not, create bootstrap script manually
3. Run bootstrap: `npm run bootstrap:payload` (or similar)
4. Verify admin user created in database

---

## Rollback Plan

**Hvis reinstall fejler:**
1. Checkout backup (hvis oprettet): `git checkout backup/payload-setup-attempt-1`
2. Eller discard changes: `git restore . && git clean -fd`
3. Review official Payload docs
4. Try alternative approach

---

## Notes

- **Analysis files:** Kan gemmes hvis de er nyttige for reference
- **Plan file:** Kan gemmes hvis den er nyttig for reference
- **Environment variables:** Skal opdateres i `.env.local`
- **Database schema:** Payload vil oprette `payload` schema automatisk

---

## References

- [Payload CMS Installation Guide](https://payloadcms.com/docs/getting-started/installation)
- [Payload CMS Next.js Integration](https://payloadcms.com/docs/nextjs/overview)
- Linear Issue: [CORE-26](https://linear.app/beauty-shop/issue/CORE-26)


