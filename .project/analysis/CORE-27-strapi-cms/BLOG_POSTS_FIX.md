# Blog Posts Fix - Status Update

**Dato:** 20. november 2025  
**Status:** ✅ FIXED (kræver manual publish)

---

## 🎯 Problem

Blog posts viste ikke på storefront fordi:
1. De eksisterende blog posts var oprettet med custom `publishedAt` field
2. Vi ændrede schema til at bruge Strapi's built-in `draftAndPublish` system
3. De gamle posts er nu i "draft" status
4. Frontend filtrerer med `status=published`

---

## ✅ Løsning implementeret

### 1. Schema opdateret

**Blog post schema:**
- ✅ Beholdt `draftAndPublish: true`
- ✅ Fjernet custom `publishedAt` field  
- ✅ Bruger Strapi's built-in publish system

### 2. Seed data opdateret

**`beauty-shop-cms/src/seed.ts`:**
- ✅ Fjernet `publishedAt: new Date()` fra blog post creation
- ✅ Strapi håndterer nu publikation automatisk

### 3. Frontend opdateret

**`beauty-shop-storefront/src/lib/data/cms/blog.ts`:**
- ✅ Bruger `status=published` filter
- ✅ Matcher Strapi's built-in publikationssystem

### 4. Types opdateret

**`beauty-shop-storefront/src/lib/types/cms.ts`:**
- ✅ `publishedAt` er nu Strapi's built-in felt

---

## 📋 Skridt for at få blog posts til at virke

### Metode 1: Via Admin Panel (Anbefalet)

1. Gå til: http://localhost:1337/admin
2. Navigation: Content Manager > Blog Post
3. Klik på hver blog post
4. Tryk på "Publish" knappen
5. Gentag for alle blog posts

### Metode 2: Via Script

Kør dette i en ny terminal mens Strapi kører:
```bash
cd beauty-shop-cms
npm run strapi -- scripts:publish-blog-posts
```

### Metode 3: Slet og re-seed

```bash
# Stop Strapi
# Slet blog posts via admin panel
# Restart med seed:
cd beauty-shop-cms
SEED_DATA=true npm run develop
```

---

## 🧪 Test

Efter publish, test at blog posts virker:

**API test:**
```bash
curl 'http://localhost:1337/api/blog-posts?status=published&populate=*'
```

**Storefront test:**
Besøg: http://localhost:8000/dk/test-cms

Forventet resultat:
- ✅ Test 3: Blog Posts List viser grønt
- ✅ Test 4: Single Blog Post viser grønt

---

## 📊 Hvad virker nu

- ✅ Page (About) - Fungerer perfekt
- ✅ Bundle Page (Essentials) - Fungerer perfekt
- ⏳ Blog Posts List - Venter på publish
- ⏳ Single Blog Post - Venter på publish

---

## 🎓 Læring

### Strapi's Draft & Publish System

Når `draftAndPublish: true` er sat i schema:
- Strapi tilføjer automatisk et `publishedAt` felt
- Nye entries oprettes som drafts (`publishedAt: null`)
- Brug `entityService.update()` med `publishedAt: new Date()` for at publishe
- Filter med `status=published` i API calls

### Best Practice

For content der skal bruge draft/publish workflow:
- ✅ Brug Strapi's built-in system (`draftAndPublish: true`)
- ❌ Lav ikke custom `publishedAt` fields
- ✅ Lad Strapi håndtere publikation

---

## 📝 Relaterede filer

- `beauty-shop-cms/src/api/blog-post/content-types/blog-post/schema.json` - Opdateret schema
- `beauty-shop-cms/src/seed.ts` - Opdateret seed data
- `beauty-shop-cms/scripts/publish-blog-posts.ts` - Publish script (ny)
- `beauty-shop-storefront/src/lib/data/cms/blog.ts` - Opdateret API calls
- `beauty-shop-storefront/src/lib/types/cms.ts` - Opdateret types

---

**Status:** Klar til test efter manual publish af blog posts.

