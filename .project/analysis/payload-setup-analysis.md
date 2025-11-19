# Payload CMS Setup Analysis - CORE-26

**Date:** 2025-01-13  
**Issue:** CORE-26 - Setup Payload CMS on Supabase stack  
**Status:** In Progress - Troubleshooting  
**Priority:** High

---

## Executive Summary

Vi har installeret Payload CMS korrekt i Next.js app, men admin UI loader ikke på grund af en fejl i config Context. Fejlen tyder på at Payload's `RootPage` ikke kan få adgang til config via React Context, hvilket forhindrer admin UI i at renderes.

**Hovedproblem:** `importMap.js` er tom, og `RootPage` får undefined config via Context.

---

## Current State

### ✅ Hvad vi har gjort korrekt:

1. **Dependencies installeret korrekt:**
   - `payload@^3.63.0`
   - `@payloadcms/next@^3.63.0`
   - `@payloadcms/db-postgres@^3.63.0`
   - `@payloadcms/richtext-lexical@^3.63.0`

2. **Payload config oprettet korrekt:**
   - `payload.config.ts` med postgres adapter
   - `schemaName: "payload"` (korrekt schema)
   - `lexicalEditor()` (korrekt editor)
   - Users collection oprettet

3. **Next.js integration:**
   - `withPayload` plugin i `next.config.js`
   - API routes oprettet (`src/app/api/payload/[...slug]/route.ts`)
   - Admin route oprettet (`src/app/(payload)/admin/[[...slug]]/page.tsx`)
   - `@payload-config` alias i `tsconfig.json`

4. **Environment variables:**
   - `PAYLOAD_SECRET` defineret
   - `PAYLOAD_PUBLIC_SERVER_URL` defineret
   - `DATABASE_URL` defineret
   - `PAYLOAD_ADMIN_EMAIL` og `PAYLOAD_ADMIN_PASSWORD` defineret

### ❌ Hvad der fejler:

1. **Admin UI loader ikke:**
   - Fejl: `TypeError: Cannot destructure property 'config' of 'ue(...)' as it is undefined`
   - Fejlen kommer fra `CodeEditor.tsx` i Payload
   - Dette tyder på at config ikke når ned til dybe komponenter via React Context

2. **importMap.js er tom:**
   - Filen eksisterer: `src/app/(payload)/admin/importMap.js`
   - Men den er tom: `export const importMap = {}`
   - Dette betyder at Payload ikke kan finde admin komponenter at importere

3. **RootPage forventer måske importMap:**
   - Vi prøvede at tilføje `importMap` fra `getPayload`, men det løste ikke problemet
   - Payload's officielle dokumentation viser ikke eksplicit hvordan `RootPage` skal bruges

---

## Comparison with Payload Official Documentation

### Payload's Official Approach (for Next.js):

1. **Installation:**
   ```bash
   npm install payload @payloadcms/next @payloadcms/db-postgres
   ```

2. **next.config.js:**
   ```js
   import { withPayload } from '@payloadcms/next/withPayload'
   
   export default withPayload({
     // Your Next.js config
   })
   ```

3. **API Routes:**
   ```ts
   import config from '@payload-config'
   import { REST_GET } from '@payloadcms/next/routes'
   
   export const GET = REST_GET(config)
   ```

4. **Admin Route:**
   - Dokumentationen viser IKKE eksplicit hvordan admin route skal opsættes
   - Men de nævner at `withPayload` plugin håndterer admin UI automatisk

### Vores Nuværende Approach:

1. **✅ Installation:** Korrekt
2. **✅ next.config.js:** Korrekt (bruger `withPayload`)
3. **✅ API Routes:** Korrekt (bruger `configPromise` for Next.js 15)
4. **❓ Admin Route:** Vi har oprettet manuelt, men måske skal `withPayload` håndtere det automatisk?

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

## Recommended Solutions

### Option 1: Følg Payload's Officielle Next.js Guide (Anbefalet)

**Tilgang:**
1. Start fra bunden med Payload's officielle guide
2. Brug `create-payload-app` som reference (ikke til at oprette nyt projekt, men til at se korrekt struktur)
3. Kopier den korrekte admin route struktur fra Payload's eksempler

**Fordele:**
- Følger Payload's anbefalede patterns
- Minder risiko for konfigurationsfejl
- Bedre kompatibilitet med fremtidige Payload opdateringer

**Ulemper:**
- Kræver at vi starter forfra med admin route
- Tager lidt længere tid

### Option 2: Debug Nuværende Setup

**Tilgang:**
1. Tjek om `withPayload` plugin faktisk genererer `importMap.js` korrekt
2. Verificer at Payload config bliver loaded korrekt i Next.js build
3. Test med React 18 i stedet for React 19 RC

**Fordele:**
- Beholder nuværende struktur
- Hurtigere hvis vi finder problemet

**Ulemper:**
- Vi har allerede prøvet mange løsninger uden succes
- Risiko for at fortsætte med samme problem

### Option 3: Brug Payload's Standalone Mode (Ikke anbefalet)

**Tilgang:**
1. Kør Payload som separat server (ikke embedded i Next.js)
2. Next.js fetcher data via Payload API

**Fordele:**
- Adskiller Payload fra Next.js (mindre kompleksitet)
- Mere stabil (testet setup)

**Ulemper:**
- Kræver separat server/deployment
- Ikke hvad planen specifikt anbefaler (embedded i Next.js)
- Mere kompleks CI/CD setup

---

## Next Steps Recommendation

### Fase 1: Verificer Payload's Officielle Setup

1. **Læs Payload's officielle Next.js guide:**
   - https://payloadcms.com/docs/nextjs/overview
   - https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload

2. **Sammenlign med vores nuværende setup:**
   - Find forskelle i struktur
   - Identificer manglende konfiguration

3. **Test med React 18:**
   - Downgrade React til version 18
   - Test om admin UI loader korrekt

### Fase 2: Refactor Admin Route

1. **Brug Payload's officielle admin route struktur:**
   - Kopier fra Payload's eksempler
   - Sikre at `importMap` genereres korrekt

2. **Verificer `withPayload` plugin:**
   - Tjek at plugin faktisk initialiserer Payload
   - Verificer at `importMap.js` bliver genereret

### Fase 3: Test og Validering

1. **Test admin UI:**
   - Gå til `http://localhost:8000/admin`
   - Verificer at login fungerer
   - Test at dashboard loader

2. **Test API routes:**
   - Verificer at `/api/payload/*` routes fungerer
   - Test CRUD operationer

---

## Key Questions to Answer

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

## Conclusion

Vi har installeret Payload CMS korrekt, men admin UI loader ikke på grund af en fejl i config Context. Dette tyder på at vi enten:
1. Mangler noget i konfigurationen (fx `importMap` generation)
2. Bruger forkert struktur til admin route
3. Har kompatibilitetsproblemer med React 19 RC

**Anbefaling:** Start forfra med Payload's officielle Next.js guide og sammenlign med vores nuværende setup for at finde forskelle.

---

## References

- [Payload CMS Next.js Integration](https://payloadcms.com/docs/nextjs/overview)
- [The Ultimate Guide To Using Next.js with Payload](https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload)
- [Payload CMS Installation Guide](https://payloadcms.com/docs/getting-started/installation)
- [Payload CMS GitHub Examples](https://github.com/payloadcms/payload/tree/main/examples)
- Linear Issue: [CORE-26](https://linear.app/beauty-shop/issue/CORE-26)
- Implementation Plan: [2025-11-12-CORE-26-setup-payload-cms.md](../plans/2025-11-12-CORE-26-setup-payload-cms.md)

