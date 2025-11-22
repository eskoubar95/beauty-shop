# Strapi v5 Opsætnings-Analyse

**Dato:** 20. november 2025  
**Status:** Analyse af potentielle problemer

---

## 🔍 Identificerede problemer

### 1. 🚨 KRITISK: Component file structure er forkert

**Hvad vi har:**
```
src/components/default/seo.json
src/components/default/faq-item.json
```

**Hvad Strapi v5 forventer:**
```
src/components/default/seo/seo.json
src/components/default/faq-item/faq-item.json
```

**Konsekvens:**
- Strapi kan IKKE finde components, fordi de mangler subfolder
- Fejlmeddelelse: `Metadata for "default.seo" not found`
- Content types kan ikke registreres korrekt
- API endpoints bliver ikke genereret

**Kilde:**
- Strapi dokumentation specificerer at components skal være i: `src/components/[category]/[component-name]/[component-name].json`

---

### 2. ⚠️ HØJT: Manglende controllers, services og routes

**Hvad vi mangler:**
```
src/api/page/controllers/page.ts
src/api/page/services/page.ts
src/api/page/routes/page.ts

src/api/bundle-page/controllers/bundle-page.ts
src/api/bundle-page/services/bundle-page.ts
src/api/bundle-page/routes/bundle-page.ts

src/api/blog-post/controllers/blog-post.ts
src/api/blog-post/services/blog-post.ts
src/api/blog-post/routes/blog-post.ts
```

**Konsekvens:**
- Strapi genererer normalt disse automatisk når man bruger UI
- Ved programmatisk schema definition kan de mangle
- Uden routes bliver API endpoints ikke eksponeret
- Dette forklarer hvorfor vi får 404 på alle endpoints

**Standard Strapi v5 struktur:**
```typescript
// controllers/[name].ts
export default factories.createCoreController('api::[name].[name]');

// services/[name].ts  
export default factories.createCoreService('api::[name].[name]');

// routes/[name].ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/[name]s',
      handler: '[name].find',
    },
    // ... more routes
  ],
};
```

---

### 3. ⚠️ MEDIUM: Bootstrap permissions timing

**Nuværende approach:**
- Bootstrap script kører ved startup
- Forsøger at sætte permissions for content types

**Potentielt problem:**
- Content types er måske ikke fuldt registreret når bootstrap kører
- Permissions bliver sat, men content types findes ikke i Strapi registry endnu
- Dette kan forklare hvorfor API endpoints returnerer 404

**Løsning:**
- Tilføj tjek om content type faktisk eksisterer i registry
- Vent på at Strapi er fully bootstrapped
- Log mere detaljeret hvis content types ikke findes

---

### 4. 📋 INFO: Seed data API i Strapi v5

**Nuværende approach:**
```typescript
strapi.entityService.create('api::page.page', { ... })
```

**Strapi v5 anbefaling:**
- Strapi v5 introducerer `documentService` API
- `entityService` er stadig supported, men deprecated
- `documentService` håndterer draft/publish states bedre

**Ikke kritisk**, men kan forbedres senere.

---

### 5. ✅ KORREKT: API parameter ændringer

**Vi har allerede rettet:**
- ✅ Bruger `status=published` i stedet for `publicationState=live`
- ✅ Håndterer array response for collection types
- ✅ Tager første element fra filtered array

**Frontend kode er korrekt opdateret.**

---

### 6. ✅ KORREKT: Content type schemas

**Vores schemas ser korrekte ud:**
- ✅ `kind: "collectionType"` er korrekt
- ✅ `collectionName` matcher naming conventions
- ✅ `info` object har alle nødvendige felter
- ✅ `draftAndPublish: true` er sat
- ✅ Component references bruger korrekt format: `"default.seo"`

**Dog:** Component references vil fejle fordi component filerne ligger forkert (se problem #1).

---

### 7. ✅ KORREKT: CORS configuration

```typescript
{
  name: 'strapi::cors',
  config: {
    headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    origin: env.array('CORS_ORIGIN', ['http://localhost:3000']),
  },
}
```

**Korrekt konfigureret** - CORS burde ikke være problemet.

---

## 🎯 Prioriteret action plan

### Højeste prioritet (må fixes for at få det til at virke):

1. **Fix component file structure**
   - Flyt `seo.json` til `src/components/default/seo/seo.json`
   - Flyt `faq-item.json` til `src/components/default/faq-item/faq-item.json`

2. **Opret manglende controllers, services og routes**
   - For hver content type (page, bundle-page, blog-post)
   - Brug Strapi factories for standard CRUD operations

### Medium prioritet (forbedringer):

3. **Forbedre bootstrap script**
   - Tilføj tjek om content types eksisterer
   - Bedre error handling og logging

4. **Opdater seed script til documentService**
   - Brug moderne Strapi v5 API
   - Bedre håndtering af draft/publish states

---

## 📊 Test checklist efter fixes

Efter at have løst problem #1 og #2:

1. ✅ Start Strapi: `npm run develop`
2. ✅ Tjek at content types vises i admin panel
3. ✅ Tjek at components vises i admin panel  
4. ✅ Test API direkte: `curl http://localhost:1337/api/pages`
5. ✅ Test med status filter: `curl http://localhost:1337/api/pages?status=published`
6. ✅ Tjek at seed data kan køre uden fejl
7. ✅ Test storefront integration: `/dk/test-cms`

---

## 📚 Referencer

- Strapi v5 Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes
- Component Structure: https://docs.strapi.io/cms/guides/components
- Content Type Schema: https://docs.strapi.io/cms/guides/content-types
- REST API: https://docs.strapi.io/cms/api/rest
- Status Parameter: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/publication-state-removed

---

## 💡 Hovedkonklusion

**Problem #1 (component file structure) er højst sandsynligt ROOT CAUSE** for alle vores 404 fejl:

1. Components ligger forkert → Strapi kan ikke læse dem
2. Strapi kan ikke registrere content types → Fejl ved startup
3. Content types ikke registreret → API endpoints ikke genereret
4. Ingen API endpoints → 404 på alle requests

**Problem #2 (manglende controllers/routes)** er muligvis også en årsag, men Strapi burde generere default routes hvis content types er korrekt registreret.

**Næste skridt:** Fix problem #1 først, genstart Strapi, og se om det løser alle 404 fejl.

