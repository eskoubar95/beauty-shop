# Blog Posts Frontend Issue - Løsning

**Dato:** 20. november 2025  
**Status:** ✅ LØST

---

## Problem

Blog posts virkede i direkte API kald (curl/browser), men returnerede tomme arrays i Next.js frontend. Andre content types (pages, bundle-pages) virkede fint.

## Root Cause

Ugyldig `populate` syntax i frontend-koden:

```typescript
// ❌ FORKERT
populate=coverImage,seo
```

Strapi v5 afviste denne syntax med `400 Bad Request`:

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid key coverImage,seo"
  }
}
```

## Løsning

Ændret til wildcard syntax:

```typescript
// ✅ KORREKT
populate=*
```

### Filer ændret:
- `beauty-shop-storefront/src/lib/data/cms/blog.ts`
  - `listBlogPosts()`: Ændret populate parameter
  - `getBlogPostBySlug()`: Ændret populate parameter

## Hvorfor virkede curl tests?

De direkte API tests brugte `populate=*`, mens frontend-koden fejlagtigt brugte `populate=coverImage,seo`.

## Strapi v5 Populate Syntax

I Strapi v5 skal `populate` enten:

1. **Wildcard** (simplest):
   ```
   populate=*
   ```

2. **Nested syntax** (mest præcis):
   ```
   populate[coverImage][fields][0]=url
   &populate[seo][fields][0]=metaTitle
   ```

3. **IKKE komma-separeret liste** (ugyldig):
   ```
   populate=field1,field2  ❌
   ```

## Verifikation

Efter rettelsen:
- ✅ `/dk/test-cms` viser blog posts korrekt
- ✅ Alle 4 CMS tests er grønne
- ✅ API returnerer data som forventet

## Læring

Altid test populate syntax direkte i browser/curl før implementering i frontend-kode. Strapi v5's populate syntax er anderledes end v4, og komma-separeret liste er ikke understøttet.

## Reference

- Strapi Docs: https://docs.strapi.io/cms/api/rest/guides/understanding-populate
- Issue tracking: CORE-27
- Branch: `feature/CORE-27-implement-strapi-cms`

