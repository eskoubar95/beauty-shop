# Payload CMS Next Steps - Final Decision

**Date:** 2025-01-13  
**Issue:** CORE-26 - Setup Payload CMS on Supabase stack  
**Status:** Decision Point - Reset and Reinstall

---

## Summary

**Step 1 completed:** Build lykkedes, men `importMap.js` er stadig tom. Dette betyder at Payload bundler ikke genererer `importMap.js` korrekt, hvilket forhindrer admin UI i at fungere.

**Conclusion:** Vores setup matcher ikke Payload's officielle struktur. Vi skal enten:
1. Fixe strukturen manuelt (risiko for flere problemer)
2. Reset branch og installer Payload på ny med officielle commands (anbefalet)

---

## Recommendation: Reset and Reinstall

**Anbefaling:** Reset branch og installer Payload på ny med `npx create-payload-app@latest`.

**Rationale:**
1. **Build lykkedes**, men admin UI virker ikke (tom `importMap.js`)
2. **Runtime fejl:** `Cannot destructure property 'config' of 'ue(...)' as it is undefined`
3. **Struktur mismatch:** Vores setup matcher ikke Payload's officielle struktur
4. **Tidsbesparende:** Officiel installation sikrer korrekt struktur
5. **Mindre risiko:** Færre problemer i fremtiden

---

## Step 1: Backup Current Work

**Actions:**
1. Commit current work (hvis ikke allerede gjort)
2. Create backup branch: `git checkout -b backup/payload-setup-attempt-1`
3. Document what was tried in this branch

**Time:** ~5 minutter

---

## Step 2: Reset Branch

**Actions:**
1. Checkout feature branch: `git checkout feature/CORE-26-setup-payload-cms`
2. Reset to before Payload setup: `git reset --hard <commit-before-payload>`
3. Clean up: `git clean -fd`

**Time:** ~2 minutter

---

## Step 3: Install Payload with Official Command

**Actions:**
1. Run Payload install command: `npx create-payload-app@latest`
2. Follow prompts:
   - Select "Add to existing Next.js app"
   - Select database: PostgreSQL
   - Select editor: Lexical
   - Select admin route: `/admin`
3. Verify installation:
   - Check `payload.config.ts` exists
   - Check `next.config.js` updated with `withPayload`
   - Check admin route structure created

**Time:** ~10 minutter

---

## Step 4: Configure Payload for Supabase

**Actions:**
1. Update `payload.config.ts`:
   - Set `DATABASE_URL` from environment
   - Set `schemaName: "payload"`
   - Configure `serverURL` and `secret`
2. Update `next.config.js`:
   - Verify `withPayload` plugin configured
   - Check `configPath` points to `payload.config.ts`
3. Update environment variables:
   - Add `DATABASE_URL` to `.env.local`
   - Add `PAYLOAD_SECRET` to `.env.local`
   - Add `PAYLOAD_PUBLIC_SERVER_URL` to `.env.local`

**Time:** ~15 minutter

---

## Step 5: Test Admin UI

**Actions:**
1. Start dev server: `npm run dev`
2. Navigate to `/admin`
3. Verify admin UI loads
4. Test login with bootstrap admin user
5. Verify dashboard loads

**Time:** ~10 minutter

---

## Step 6: Integrate with Existing Storefront

**Actions:**
1. Ensure Payload admin route doesn't conflict with storefront routes
2. Update middleware to exclude `/admin` and `/api/payload` routes
3. Test storefront routes still work
4. Test Payload admin routes work

**Time:** ~15 minutter

---

## Expected Outcome

**After reinstall:**
- ✅ Payload admin UI virker korrekt
- ✅ `importMap.js` genereres automatisk (eller ikke nødvendig)
- ✅ Config Context initialiseres korrekt
- ✅ Admin route struktur matcher Payload's officielle anbefalinger
- ✅ Ingen runtime fejl

---

## Rollback Plan

**Hvis reinstall fejler:**
1. Checkout backup branch: `git checkout backup/payload-setup-attempt-1`
2. Review what was tried
3. Try alternative approach (manual setup with official docs)

---

## References

- [Payload CMS Installation Guide](https://payloadcms.com/docs/getting-started/installation)
- [Payload CMS Next.js Integration](https://payloadcms.com/docs/nextjs/overview)
- [The Ultimate Guide To Using Next.js with Payload](https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload)
- Linear Issue: [CORE-26](https://linear.app/beauty-shop/issue/CORE-26)
- Implementation Plan: [2025-11-12-CORE-26-setup-payload-cms.md](../plans/2025-11-12-CORE-26-setup-payload-cms.md)


