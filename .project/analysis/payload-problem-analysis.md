# Payload CMS Problem Analysis - CORE-26

**Date:** 2025-01-13  
**Issue:** CORE-26 - Setup Payload CMS on Supabase stack  
**Status:** Analysis - Root Cause Identification

---

## Executive Summary

**React 19 er IKKE problemet.** Payload kræver Next.js 15+, ikke specifikt React 19. Problemet er sandsynligvis i Payload admin route opsætningen.

**Hovedproblem:** `importMap.js` er tom, hvilket betyder at Payload ikke kan bundlere admin komponenter korrekt. Config Context når ikke ned til dybe komponenter (fx `CodeEditor.tsx`).

---

## React 19 er IKKE Problem

### Fakta:
1. **Payload kræver Next.js 15+**, ikke specifikt React 19
2. **Next.js 15 kan køre med React 18 eller React 19**
3. **Vi bruger Next.js 15.3.1** ✅
4. **Vi bruger React 19 RC** ✅ (men ikke nødvendigt)

### Konklusion:
React 19 er IKKE problemet. Vi skal fokusere på Payload setup.

---

## Root Cause Analysis

### Problem 1: `importMap.js` er tom

**Fil:** `beauty-shop-storefront/src/app/(payload)/admin/importMap.js`

**Indhold:**
```javascript
export const importMap = {
}
```

**Problem:**
- `importMap.js` skal indeholde mappings til Payload admin komponenter
- Tom `importMap` betyder at Payload ikke kan bundlere admin komponenter
- Dette forhindrer admin UI i at fungere korrekt

**Mulige årsager:**
1. `withPayload` plugin genererer ikke `importMap.js` automatisk
2. Payload bundler kører ikke korrekt
3. Next.js build process mangler konfiguration
4. `payload.config.ts` mangler noget der trigger bundler

---

### Problem 2: Config Context når ikke ned til komponenter

**Fejl:**
```
Runtime TypeError: Cannot destructure property 'config' of 'ue(...)' as it is undefined.
at CodeEditor.tsx:304:5
```

**Problem:**
- `RootPage` får ikke config korrekt fra Context
- Dybe komponenter (fx `CodeEditor.tsx`) kan ikke få adgang til config
- Dette tyder på at Payload's React Context ikke initialiseres korrekt

**Mulige årsager:**
1. `RootPage` initialiserer ikke config Context korrekt
2. `withPayload` plugin mangler noget der initialiserer Context
3. `configPromise` resolve ikke korrekt
4. `importMap` mangler, hvilket forhindrer Context initialisering

---

## Current Setup Analysis

### 1. `next.config.js` (CommonJS)

```javascript
const { withPayload } = require("@payloadcms/next/withPayload")

const nextConfig = {
  // ... config
}

module.exports = withPayload(nextConfig, {
  configPath: path.resolve(__dirname, "./payload.config.ts"),
})
```

**Status:** ✅ Korrekt struktur  
**Note:** Payload docs viser ESM, men Next.js understøtter begge.

---

### 2. `payload.config.ts`

```typescript
export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  secret: process.env.PAYLOAD_SECRET,
  editor: lexicalEditor(),
  admin: {
    user: Users.slug,
  },
  db: postgresAdapter({
    pool: poolConfig,
    schemaName: "payload",
  }),
  collections: [Users],
})
```

**Status:** ✅ Korrekt struktur  
**Note:** Mangler måske `bundler` config, men Payload docs siger at Next.js håndterer bundling.

---

### 3. `src/app/(payload)/admin/[[...slug]]/page.tsx`

```typescript
import { RootPage } from "@payloadcms/next/views"

export default async function PayloadAdminPage({
  params,
  searchParams,
}: AdminPageProps) {
  return RootPage({
    config: configPromise,
    params: Promise.resolve({
      segments: resolvedParams?.slug ?? [],
    }),
    searchParams: Promise.resolve(cleanSearchParams),
  })
}
```

**Status:** ✅ Korrekt struktur (så vidt vi kan se)  
**Note:** Passer config korrekt til `RootPage`.

---

### 4. `src/app/api/payload/[...slug]/route.ts`

```typescript
export const GET = (request, context) =>
  REST_GET(configPromise)(request, toParams(context))
// ... andre routes
```

**Status:** ✅ Korrekt struktur  
**Note:** API routes ser korrekte ud.

---

### 5. `src/app/(payload)/admin/importMap.js`

```javascript
export const importMap = {
}
```

**Status:** ❌ TOM - Dette er problemet!

---

## Possible Solutions

### Solution 1: Check if `withPayload` generates `importMap.js`

**Hypotese:** `withPayload` plugin skal generere `importMap.js` automatisk under build.

**Test:**
1. Kør `npm run build` i `beauty-shop-storefront`
2. Check om `importMap.js` bliver genereret
3. Check om Payload bundler kører korrekt

**Expected:**
- `importMap.js` skal indeholde mappings til Payload admin komponenter
- Payload bundler skal køre under build process

---

### Solution 2: Check Payload bundler configuration

**Hypotese:** Payload bundler mangler konfiguration i `payload.config.ts`.

**Test:**
1. Tjek Payload docs for bundler config
2. Check om vi skal tilføje `bundler` config (selvom docs siger Next.js håndterer det)
3. Check om vi skal tilføje `admin.bundler` config

**Expected:**
- Payload bundler skal køre under build process
- `importMap.js` skal genereres automatisk

---

### Solution 3: Check Next.js build process

**Hypotese:** Next.js build process mangler noget der trigger Payload bundler.

**Test:**
1. Check Next.js build logs for Payload bundler output
2. Check om Payload bundler kører under build
3. Check om der er errors i build logs

**Expected:**
- Payload bundler skal køre under build process
- `importMap.js` skal genereres automatisk

---

### Solution 4: Check if `RootPage` needs `importMap` prop

**Hypotese:** `RootPage` skal have `importMap` prop, ikke kun `config`.

**Test:**
1. Tjek Payload docs for `RootPage` props
2. Check om vi skal importere `importMap` og passe den til `RootPage`
3. Check om `withPayload` plugin skal generere `importMap` og passe den automatisk

**Expected:**
- `RootPage` skal have `importMap` prop (hvis nødvendigt)
- `withPayload` plugin skal generere `importMap` automatisk

---

### Solution 5: Check Payload version compatibility

**Hypotese:** Payload version er ikke kompatibel med Next.js 15 eller React 19.

**Test:**
1. Tjek Payload version compatibility med Next.js 15
2. Check om der er kendte issues med Payload 3.63.0 og Next.js 15
3. Check om vi skal opgradere eller downgrade Payload

**Expected:**
- Payload 3.63.0 skal være kompatibel med Next.js 15
- Ingen kendte issues

---

## Recommended Next Steps

### Step 1: Check Payload Build Process (15 min)

**Actions:**
1. Kør `npm run build` i `beauty-shop-storefront`
2. Check build logs for Payload bundler output
3. Check om `importMap.js` bliver genereret
4. Check om der er errors i build logs

**Expected:**
- Payload bundler kører under build
- `importMap.js` genereres automatisk
- Ingen errors i build logs

---

### Step 2: Check Payload Official Examples (30 min)

**Actions:**
1. Find Payload's officielle Next.js 15 eksempler på GitHub
2. Sammenlign admin route struktur med vores
3. Identificer forskelle
4. Check om de bruger `RootPage` direkte eller om `withPayload` håndterer det automatisk

**Expected:**
- Vi finder Payload's officielle Next.js 15 eksempler
- Vi identificerer forskelle i admin route struktur
- Vi finder hvad vi mangler

---

### Step 3: Test with Payload Official Template (1 time)

**Actions:**
1. Opret nyt Payload projekt med officiel Next.js 15 template
2. Sammenlign struktur med vores
3. Test om admin UI virker i officiel template
4. Kopier korrekt struktur til vores projekt

**Expected:**
- Officiel template virker
- Vi identificerer hvad vi mangler
- Vi kopierer korrekt struktur

---

### Step 4: Fix Admin Route Structure (1 time)

**Actions:**
1. Fix admin route struktur baseret på officiel template
2. Test om admin UI virker
3. Fix `importMap.js` hvis nødvendigt
4. Test om config Context virker

**Expected:**
- Admin route struktur matcher officiel template
- Admin UI virker
- Config Context virker

---

## Conclusion

**React 19 er IKKE problemet.** Payload kræver Next.js 15+, ikke specifikt React 19.

**Hovedproblem:** `importMap.js` er tom, hvilket betyder at Payload ikke kan bundlere admin komponenter korrekt. Config Context når ikke ned til dybe komponenter.

**Anbefaling:** Test Payload build process, sammenlign med officielle eksempler, og fix admin route struktur.

---

## References

- [Payload CMS Next.js Integration](https://payloadcms.com/docs/nextjs/overview)
- [The Ultimate Guide To Using Next.js with Payload](https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload)
- [Next.js 15 React 19 Support](https://nextjs.org/docs/app/building-your-application/upgrading/react-19)
- [Payload CMS GitHub Examples](https://github.com/payloadcms/payload/tree/main/examples)
- Linear Issue: [CORE-26](https://linear.app/beauty-shop/issue/CORE-26)
- Implementation Plan: [2025-11-12-CORE-26-setup-payload-cms.md](../plans/2025-11-12-CORE-26-setup-payload-cms.md)


