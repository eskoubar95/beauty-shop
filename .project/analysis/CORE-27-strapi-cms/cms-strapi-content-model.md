# Strapi CMS Content Model Documentation

**Beauty Shop CMS - Content Types & Components**

**Last Updated:** 2025-11-19  
**Strapi Version:** 5.31.1

---

## Overview

Dette dokument beskriver content model'en i Beauty Shop's Strapi CMS-instans. Alle content types er defineret programmatisk via schema-filer i `beauty-shop-cms/src/api/` og kan administreres via Strapi admin UI.

---

## Components

### SEO Component (`seo.seo`)

**Location:** `src/api/seo/components/seo.json`

**Purpose:** Genbrugelig SEO-komponent til meta title, description og OG-billede.

**Fields:**
- `metaTitle` (string, max 255) - Meta title for SEO
- `metaDescription` (text, max 500) - Meta description for SEO
- `ogImage` (media, single image) - Open Graph image for social sharing

**Used by:**
- `page` content type
- `bundlePage` content type
- `blogPost` content type

---

### FAQ Item Component (`shared.faq-item`)

**Location:** `src/api/shared/components/faq-item.json`

**Purpose:** FAQ spørgsmål og svar-par til brug i bundle pages.

**Fields:**
- `question` (string, max 255, required) - FAQ spørgsmål
- `answer` (richtext, required) - FAQ svar

**Used by:**
- `bundlePage` content type (repeatable)

---

## Content Types

### Page (`page`)

**Location:** `src/api/page/content-types/page/schema.json`

**Purpose:** Statiske/marketing-sider som About, Terms, Privacy osv.

**Fields:**
- `slug` (UID, required, unique) - URL slug (fx "about", "terms")
- `title` (string, required, max 255) - Side titel
- `body` (richtext, optional) - Side indhold (rich text)
- `seo` (component: `seo.seo`, optional) - SEO metadata

**Example Records:**
- `about` - About page
- `terms` - Terms & Conditions
- `privacy` - Privacy Policy

**API Endpoint:** `/api/pages`

**Usage in Storefront:**
```typescript
// Fetch page by slug
GET /api/pages?filters[slug][$eq]=about&populate=seo
```

---

### Bundle Page (`bundle-page`)

**Location:** `src/api/bundle-page/content-types/bundle-page/schema.json`

**Purpose:** Rige bundle/kit-sider med marketingindhold, kombineret med Medusa commerce-data.

**Fields:**
- `slug` (UID, required, unique) - URL slug i storefront
- `medusaProductId` (string, optional) - Medusa product UUID
- `medusaProductHandle` (string, optional) - Medusa product handle (fx "essentials", "premium")
- `heroTitle` (string, optional, max 255) - Hero sektion titel
- `heroSubtitle` (text, optional) - Hero sektion undertitel
- `heroImage` (media, single image, optional) - Hero billede
- `sections` (JSON, optional) - Fleksible indholdskasser/USPs (JSON struktur)
- `faqItems` (component: `shared.faq-item`, repeatable) - FAQ liste
- `socialProof` (JSON, optional) - Ratings/testimonials (JSON struktur)
- `seo` (component: `seo.seo`, optional) - SEO metadata

**Relation to Medusa:**
- `medusaProductId` eller `medusaProductHandle` refererer til et produkt i Medusa
- Commerce-data (pris, stock, varianter) hentes fra Medusa API
- Marketingindhold (hero, FAQ, social proof) kommer fra Strapi

**Example Records:**
- `essentials` - Essentials bundle page (medusaProductHandle: "essentials")
- `premium` - Premium bundle page (medusaProductHandle: "premium")

**API Endpoint:** `/api/bundle-pages`

**Usage in Storefront:**
```typescript
// Fetch bundle page by slug
GET /api/bundle-pages?filters[slug][$eq]=essentials&populate=seo,heroImage,faqItems

// Or by Medusa product handle
GET /api/bundle-pages?filters[medusaProductHandle][$eq]=essentials&populate=*
```

---

### Blog Post (`blog-post`)

**Location:** `src/api/blog-post/content-types/blog-post/schema.json`

**Purpose:** Blogindlæg til SEO og guides.

**Fields:**
- `title` (string, required, max 255) - Blog post titel
- `slug` (UID, required, unique, auto-generated from title) - URL slug
- `excerpt` (text, optional, max 500) - Kort uddrag til blog index
- `body` (richtext, required) - Blog post indhold
- `coverImage` (media, single image, optional) - Cover billede
- `tags` (string, repeatable, optional) - Tags til kategorisering
- `publishedAt` (datetime, optional) - Publiceringsdato
- `seo` (component: `seo.seo`, optional) - SEO metadata

**Draft & Publish:**
- Content type har `draftAndPublish` aktiveret
- Kun publicerede posts vises i storefront (med `publishedAt` set)

**API Endpoint:** `/api/blog-posts`

**Usage in Storefront:**
```typescript
// List published blog posts
GET /api/blog-posts?filters[publishedAt][$notNull]=true&sort=publishedAt:desc&populate=coverImage,seo

// Get single blog post by slug
GET /api/blog-posts?filters[slug][$eq]=my-blog-post&populate=*
```

---

## Permissions

### Public Role

**Read Access:**
- ✅ `page` - find, findOne
- ✅ `bundle-page` - find, findOne
- ✅ `blog-post` - find, findOne (kun published)

**Write Access:**
- ❌ Ingen write-adgang for public role

**Configuration:**
- Permissions konfigureres i Strapi admin: Settings → Roles & Permissions → Public
- For produktion: Overvej API token-baseret auth i stedet for public read

---

## Database Schema

Strapi opretter automatisk database-tabeller baseret på content type schemas:

- `pages` - Page content type
- `bundle_pages` - Bundle Page content type
- `blog_posts` - Blog Post content type
- `components_seo_seos` - SEO component data
- `components_shared_faq_items` - FAQ Item component data

**Note:** Strapi håndterer database-migrations automatisk. Manuelt SQL er ikke nødvendigt.

---

## Integration Points

### Medusa Integration

**Bundle Pages:**
- `bundlePage.medusaProductId` eller `bundlePage.medusaProductHandle` bruges til at slå op i Medusa API
- Storefront kombinerer Strapi marketingindhold med Medusa commerce-data

**Example Flow:**
1. Storefront henter `bundlePage` fra Strapi via slug
2. Storefront henter produktdata fra Medusa via `medusaProductHandle`
3. Storefront kombinerer data og renderer side

### Next.js Storefront Integration

**CMS Client Layer:**
- `beauty-shop-storefront/src/lib/data/cms/` - CMS helper functions
- `getPageBySlug()`, `getBundlePageBySlug()`, `listBlogPosts()`, `getBlogPostBySlug()`

**See:** Phase 3 implementation plan for detaljer.

---

## Content Editor Workflow

### Creating a Page:
1. Log ind i Strapi admin (`http://localhost:1337/admin`)
2. Gå til Content Manager → Page
3. Klik "Create new entry"
4. Udfyld slug, title, body
5. Tilføj SEO metadata (optional)
6. Save & Publish

### Creating a Bundle Page:
1. Content Manager → Bundle Page
2. Udfyld slug og Medusa reference (productId eller handle)
3. Tilføj hero content (title, subtitle, image)
4. Tilføj FAQ items (repeatable component)
5. Tilføj sections/social proof (JSON)
6. Save & Publish

### Creating a Blog Post:
1. Content Manager → Blog Post
2. Udfyld title (slug genereres automatisk)
3. Udfyld excerpt og body
4. Upload cover image
5. Tilføj tags
6. Set `publishedAt` dato
7. Save & Publish

---

## Future Enhancements

### Phase 2 (Out of Scope for CORE-27):
- Two-way product sync med Medusa (via `devx-commerce/strapi` plugin)
- A/B testing flags på content blocks
- Strapi Page Builder integration (https://pagebuilder.wc8.io/docs) for visuelt page building

### Potential Improvements:
- GraphQL API (i stedet for REST)
- Advanced rich text blocks (dynamic zones)
- Media library organization
- Content versioning/rollback

---

## References

- **Implementation Plan:** `.project/plans/2025-11-19-CORE-27-implement-strapi-cms-for-marketing-content-bundles-and-blog.md`
- **Strapi Documentation:** https://docs.strapi.io
- **Strapi v5 Content Types:** https://docs.strapi.io/dev-docs/backend-customization/models
- **Strapi Page Builder:** https://pagebuilder.wc8.io/docs (potential future enhancement)

---

**Maintained by:** Development Team  
**Questions?** See implementation plan or Strapi admin UI for details.

