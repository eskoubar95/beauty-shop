# Payload CMS React 18 Downgrade Analysis - CORE-26

**Date:** 2025-01-13  
**Issue:** CORE-26 - Setup Payload CMS on Supabase stack  
**Status:** Analysis - React 18 Downgrade Impact

---

## Executive Summary

**Vi kan IKKE downgrade til React 18** uden at refactor 11 filer der bruger `useActionState` (React 19 hook). Next.js 15 er også designet til React 19, så downgrade kan medføre kompatibilitetsproblemer.

**Anbefaling:** Find en anden løsning til Payload admin route problemet der ikke kræver React downgrade.

---

## React 19 Features in Use

### 1. `useActionState` Hook

**Bruges i 11 filer:**
- `profile-name/index.tsx`
- `profile-email/index.tsx`
- `profile-phone/index.tsx`
- `profile-password/index.tsx`
- `profile-billing-address/index.tsx`
- `address-card/edit-address-modal.tsx`
- `address-card/add-address.tsx`
- `addresses/index.tsx`
- `login/index.tsx`
- `register/index.tsx`
- `transfer-request-form/index.tsx`

**Eksempel:**
```typescript
const [state, formAction] = useActionState(updateCustomerName, {
  error: false,
  success: false,
})
```

**React 18 alternativ:**
- `useFormStatus` (kun for submit status)
- Custom hook med `useState` + `useTransition`
- Eller refactor til standard form handling

**Refactor effort:** ~2-3 timer for alle 11 filer

---

## Next.js 15 Compatibility

### Next.js 15 er designet til React 19

**Konsekvenser:**
- Next.js 15 bruger React 19 features
- Downgrade til React 18 kan medføre kompatibilitetsproblemer
- Next.js 15's App Router er bygget til React 19

**Officiel support:**
- Next.js 15: React 19 (anbefalet)
- Next.js 15: React 18 (ikke officielt understøttet, men kan fungere)

---

## MedusaJS SDK Compatibility

### MedusaJS SDK er React-agnostic

**Konsekvenser:**
- MedusaJS SDK bruger ikke React hooks
- SDK er kompatibel med både React 18 og React 19
- Ingen breaking changes ved React downgrade

---

## Impact Analysis

### Hvis vi downgrader til React 18:

**Positive:**
- ✅ Payload admin UI kan måske virke (hvis problem er React 19 RC)
- ✅ MedusaJS SDK virker stadig

**Negative:**
- ❌ Skal refactor 11 filer fra `useActionState` til React 18 alternativer
- ❌ Next.js 15 kan have kompatibilitetsproblemer med React 18
- ❌ Risiko for breaking changes i Next.js features
- ❌ Test effort: ~2-3 timer for refactor + test

**Estimated time:** ~4-6 timer (refactor + test + debugging)

---

## Recommended Alternatives

### Option 1: Fix Payload Admin Route (Anbefalet)

**Tilgang:**
1. Sammenlign admin route struktur med Payload's officielle eksempler
2. Fix admin route til at matche Payload's anbefalinger
3. Test om admin UI loader korrekt

**Fordele:**
- Beholder React 19 (ingen breaking changes)
- Ingen refactor nødvendig
- Beholder Next.js 15 features

**Ulemper:**
- Kan tage lidt længere tid at finde problemet

**Estimated time:** ~2-3 timer

---

### Option 2: Wait for Official Payload React 19 Support

**Tilgang:**
1. Vent på officiel Payload React 19 support
2. Eller test med nyere Payload version (hvis React 19 support er tilføjet)

**Fordele:**
- Ingen refactor nødvendig
- Beholder React 19

**Ulemper:**
- Kan tage tid før Payload understøtter React 19 officielt
- Blokerer Payload integration

**Estimated time:** Ukendt (afhænger af Payload's release schedule)

---

### Option 3: Use Payload Standalone Mode (Ikke anbefalet)

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

**Estimated time:** ~4-6 timer (setup + deployment)

---

### Option 4: Downgrade to React 18 (Ikke anbefalet)

**Tilgang:**
1. Downgrade React til version 18
2. Refactor alle `useActionState` calls til React 18 alternativer
3. Test alt

**Fordele:**
- Payload admin UI kan måske virke

**Ulemper:**
- ❌ Skal refactor 11 filer
- ❌ Next.js 15 kan have kompatibilitetsproblemer
- ❌ Risiko for breaking changes
- ❌ Test effort: ~2-3 timer

**Estimated time:** ~4-6 timer (refactor + test + debugging)

---

## Decision Matrix

| Option | Time | Risk | React 19 | Breaking Changes |
|--------|------|------|----------|------------------|
| **Option 1: Fix Admin Route** | 2-3h | Low | ✅ Yes | ❌ No |
| **Option 2: Wait for Support** | Unknown | Low | ✅ Yes | ❌ No |
| **Option 3: Standalone Mode** | 4-6h | Medium | ✅ Yes | ⚠️ Maybe |
| **Option 4: Downgrade React** | 4-6h | High | ❌ No | ✅ Yes |

---

## Recommendation

**Option 1: Fix Payload Admin Route (Anbefalet)**

**Rationale:**
1. Beholder React 19 (ingen breaking changes)
2. Ingen refactor nødvendig
3. Beholder Next.js 15 features
4. Lavest risiko
5. Hurtigst løsning (2-3 timer)

**Steps:**
1. Sammenlign admin route struktur med Payload's officielle eksempler
2. Tjek Payload's GitHub eksempler for korrekt admin route struktur
3. Fix admin route til at matche Payload's anbefalinger
4. Test om admin UI loader korrekt

---

## Next Steps

### Step 1: Compare with Payload's Official Structure

**Actions:**
1. Læs Payload's officielle Next.js guide:
   - https://payloadcms.com/docs/nextjs/overview
   - https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload

2. Tjek Payload's GitHub eksempler:
   - https://github.com/payloadcms/payload/tree/main/examples
   - Find Next.js eksempler
   - Sammenlign admin route struktur

3. Identificer forskelle:
   - Er admin route struktur korrekt?
   - Mangler vi noget i `RootPage` props?
   - Skal `importMap` genereres automatisk eller manuelt?

**Time:** ~30 minutter

---

### Step 2: Fix Admin Route Structure

**Actions:**
1. Kopier korrekt struktur fra Payload's eksempler
2. Opdater admin route til at matche Payload's anbefalinger
3. Verificer at `importMap` genereres korrekt

**Time:** ~1 time

---

### Step 3: Test Admin UI

**Actions:**
1. Gå til `http://localhost:8000/admin`
2. Verificer at login fungerer
3. Test at dashboard loader

**Time:** ~30 minutter

---

## Conclusion

**Vi skal IKKE downgrade til React 18** på grund af:
1. Vi bruger `useActionState` (React 19 hook) i 11 filer
2. Next.js 15 er designet til React 19
3. Refactor effort: ~2-3 timer for alle filer
4. Risiko for breaking changes i Next.js features

**Anbefaling:** Fix Payload admin route struktur til at matche Payload's officielle anbefalinger. Dette bevarer React 19 og undgår breaking changes.

---

## References

- [Payload CMS Next.js Integration](https://payloadcms.com/docs/nextjs/overview)
- [The Ultimate Guide To Using Next.js with Payload](https://payloadcms.com/posts/blog/the-ultimate-guide-to-using-nextjs-with-payload)
- [Next.js 15 React 19 Support](https://nextjs.org/docs/app/building-your-application/upgrading/react-19)
- [React 19 useActionState Hook](https://react.dev/reference/react/useActionState)
- Linear Issue: [CORE-26](https://linear.app/beauty-shop/issue/CORE-26)
- Implementation Plan: [2025-11-12-CORE-26-setup-payload-cms.md](../plans/2025-11-12-CORE-26-setup-payload-cms.md)


