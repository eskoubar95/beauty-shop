# Payload CMS Next Steps - CORE-26

**Date:** 2025-01-13  
**Issue:** CORE-26 - Setup Payload CMS on Supabase stack  
**Status:** In Progress - Next Steps Defined

---

## Executive Summary

Vi skal **IKKE** installere Payload forfra. Vi skal kun:
1. **Teste med React 18** (hurtig test - udelukker React 19 RC kompatibilitet)
2. **Sammenligne admin route struktur** med Payload's officielle eksempler
3. **Fixe admin route** til at matche Payload's anbefalinger

---

## What We Have (Korrekt)

✅ **Dependencies installeret:**
- `payload@^3.63.0`
- `@payloadcms/next@^3.63.0`
- `@payloadcms/db-postgres@^3.63.0`
- `@payloadcms/richtext-lexical@^3.63.0`

✅ **Payload config oprettet:**
- `payload.config.ts` med postgres adapter
- `schemaName: "payload"` (korrekt schema)
- `lexicalEditor()` (korrekt editor)
- Users collection oprettet

✅ **Next.js integration:**
- `withPayload` plugin i `next.config.js`
- API routes oprettet (`src/app/api/payload/[...slug]/route.ts`)
- Admin route oprettet (`src/app/(payload)/admin/[[...slug]]/page.tsx`)
- `@payload-config` alias i `tsconfig.json`

✅ **Environment variables:**
- `PAYLOAD_SECRET` defineret
- `PAYLOAD_PUBLIC_SERVER_URL` defineret
- `DATABASE_URL` defineret
- `PAYLOAD_ADMIN_EMAIL` og `PAYLOAD_ADMIN_PASSWORD` defineret

---

## What's Wrong

❌ **Admin UI loader ikke:**
- Fejl: `TypeError: Cannot destructure property 'config' of 'ue(...)' as it is undefined`
- Fejlen kommer fra `CodeEditor.tsx` i Payload
- Dette tyder på at config ikke når ned til dybe komponenter via React Context

❌ **importMap.js er tom:**
- Filen eksisterer: `src/app/(payload)/admin/importMap.js`
- Men den er tom: `export const importMap = {}`
- Dette betyder at Payload ikke kan finde admin komponenter at importere

---

## Root Cause Analysis

### Problem 1: Empty importMap.js

**Symptom:**
- `src/app/(payload)/admin/importMap.js` er tom
- Dette betyder at Payload ikke kan bundlere admin komponenter

**Mulige årsager:**
1. `withPayload` plugin kan ikke finde Payload config korrekt
2. Payload's bundler kører ikke korrekt under Next.js build
3. Config path er forkert i `next.config.js`

### Problem 2: Config Context fejl

**Symptom:**
- `RootPage` får undefined config via React Context
- Fejl i `CodeEditor.tsx`: `Cannot destructure property 'config' of 'ue(...)' as it is undefined`

**Mulige årsager:**
1. `RootPage` forventer `importMap` men vi sender ikke den korrekt
2. `configPromise` bliver ikke resolved korrekt før `RootPage` renderes
3. `withPayload` plugin har ikke initialiseret Payload korrekt

### Problem 3: React 19 RC kompatibilitet

**Symptom:**
- Vi bruger React 19 RC (`react@19.0.0-rc-66855b96-20241106`)
- Payload 3.63.0 er måske ikke fuldt kompatibel med React 19 RC

**Mulige løsninger:**
1. Downgrade til React 18 (testet og stabil)
2. Opdater Payload til nyeste version (hvis React 19 support er tilføjet)
3. Vent på officiel React 19 support i Payload

---

## Recommended Next Steps

### Step 1: Test with React 18 (Quick Test)

**Purpose:** Udeluk React 19 RC kompatibilitet som årsag til problemet.

**Actions:**
1. Downgrade React til version 18 i `package.json`
2. Kør `npm install`
3. Test om admin UI loader korrekt

**Time:** ~15 minutter

**If it works:**
- Problem er React 19 RC kompatibilitet
- Vi kan enten:
  - Fortsætte med React 18 (stabil)
  - Vent på officiel React 19 support i Payload

**If it doesn't work:**
- Problem er ikke React 19 RC kompatibilitet
- Gå til Step 2

---

### Step 2: Compare with Payload's Official Structure

**Purpose:** Sammenlign vores admin route struktur med Payload's officielle eksempler.

**Actions:**
1. Læs Payload's officielle Next.js guide:
   - https://payloadcms.com/docs/nextjs/overview
   - https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload

2. Sammenlign vores admin route struktur:
   - Vores: `src/app/(payload)/admin/[[...slug]]/page.tsx`
   - Payload's: (Tjek deres eksempler)

3. Identificer forskelle:
   - Er admin route struktur korrekt?
   - Mangler vi noget i `RootPage` props?
   - Skal `importMap` genereres automatisk eller manuelt?

**Time:** ~30 minutter

---

### Step 3: Fix Admin Route Structure

**Purpose:** Ret admin route til at matche Payload's anbefalinger.

**Actions:**
1. Tjek Payload's GitHub eksempler:
   - https://github.com/payloadcms/payload/tree/main/examples
   - Find Next.js eksempler
   - Sammenlign admin route struktur

2. Opdater admin route:
   - Kopier korrekt struktur fra Payload's eksempler
   - Sikre at `RootPage` props er korrekt
   - Verificer at `importMap` genereres korrekt

3. Test admin UI:
   - Gå til `http://localhost:8000/admin`
   - Verificer at login fungerer
   - Test at dashboard loader

**Time:** ~1 time

---

### Step 4: Verify withPayload Plugin

**Purpose:** Verificer at `withPayload` plugin faktisk initialiserer Payload korrekt.

**Actions:**
1. Tjek `next.config.js`:
   - Er `withPayload` plugin korrekt konfigureret?
   - Er `configPath` korrekt?
   - Mangler vi noget i plugin konfiguration?

2. Test build:
   - Kør `npm run build`
   - Verificer at `importMap.js` bliver genereret
   - Tjek build logs for fejl

3. Test dev:
   - Kør `npm run dev`
   - Verificer at admin UI loader
   - Tjek console for fejl

**Time:** ~30 minutter

---

## Alternative Approach: Use Payload's Official Examples

Hvis Step 1-4 ikke løser problemet, kan vi:

1. **Kopier Payload's officielle Next.js eksempel:**
   - Find Payload's GitHub eksempler
   - Kopier admin route struktur
   - Tilpas til vores setup

2. **Brug `create-payload-app` som reference:**
   - Opret et nyt Payload projekt med `create-payload-app`
   - Sammenlign struktur med vores setup
   - Kopier korrekt admin route struktur

**Time:** ~2 timer

---

## Decision Tree

```
Start
  │
  ├─ Test with React 18
  │   │
  │   ├─ Works? → Problem is React 19 RC compatibility
  │   │   │
  │   │   └─ Continue with React 18 OR wait for official React 19 support
  │   │
  │   └─ Doesn't work? → Go to Step 2
  │
  ├─ Compare with Payload's Official Structure
  │   │
  │   ├─ Found differences? → Go to Step 3
  │   │
  │   └─ No differences? → Go to Step 4
  │
  ├─ Fix Admin Route Structure
  │   │
  │   ├─ Works? → Done!
  │   │
  │   └─ Doesn't work? → Go to Step 4
  │
  └─ Verify withPayload Plugin
      │
      ├─ Works? → Done!
      │
      └─ Doesn't work? → Use Alternative Approach
```

---

## Recommended Order

1. **Step 1: Test with React 18** (Quick test - 15 min)
2. **Step 2: Compare with Payload's Official Structure** (30 min)
3. **Step 3: Fix Admin Route Structure** (1 hour)
4. **Step 4: Verify withPayload Plugin** (30 min)

**Total estimated time:** ~2-3 timer

---

## Questions to Answer

1. **Skal admin route oprettes manuelt eller håndteres det automatisk af `withPayload`?**
   - Payload's dokumentation viser ikke eksplicit hvordan admin route skal opsættes
   - Men `withPayload` plugin bør håndtere det automatisk

2. **Hvorfor er `importMap.js` tom?**
   - Dette er kritisk for at admin UI kan fungere
   - Payload's bundler skal generere denne fil under build

3. **Er React 19 RC kompatibel med Payload 3.63.0?**
   - Payload's dokumentation nævner ikke React 19 support
   - Vi bør teste med React 18 først

4. **Skal vi bruge `configPromise` eller `config` i admin route?**
   - Next.js 15 kræver async params/searchParams
   - Men `RootPage` forventer måske sync config?

---

## Next Action

**Start med Step 1: Test with React 18**

Dette er den hurtigste test og vil hurtigt udelukke React 19 RC kompatibilitet som årsag til problemet.

**Command:**
```bash
# Downgrade React to version 18
cd beauty-shop-storefront
npm install react@^18.3.1 react-dom@^18.3.1 @types/react@^18.3.12 @types/react-dom@^18.3.1

# Test admin UI
npm run dev
# Go to http://localhost:8000/admin
```

**Expected result:**
- Admin UI loader korrekt (hvis problem er React 19 RC)
- Eller samme fejl (hvis problem er noget andet)

---

## References

- [Payload CMS Next.js Integration](https://payloadcms.com/docs/nextjs/overview)
- [The Ultimate Guide To Using Next.js with Payload](https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload)
- [Payload CMS Installation Guide](https://payloadcms.com/docs/getting-started/installation)
- [Payload CMS GitHub Examples](https://github.com/payloadcms/payload/tree/main/examples)
- Linear Issue: [CORE-26](https://linear.app/beauty-shop/issue/CORE-26)
- Implementation Plan: [2025-11-12-CORE-26-setup-payload-cms.md](../plans/2025-11-12-CORE-26-setup-payload-cms.md)
- Analysis: [payload-setup-analysis.md](./payload-setup-analysis.md)


