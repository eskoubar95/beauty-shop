# Homepage Content Model i Strapi

**Dato:** 20. november 2025  
**Phase:** 4.3 - Page Content Type + Homepage Sections  
**Status:** ✅ Implementeret

---

## Oversigt

Denne dokumentation beskriver `Page` content type og alle `homepage.*` komponenter, der er oprettet i Strapi for at understøtte forsiden med pre-built sektioner i en Dynamic Zone.

---

## Page Content Type

**Sti:** `beauty-shop-cms/src/api/page/content-types/page/schema.json`

### Felter:

- **`slug`** (UID, required, unique)
  - Unik identifier for siden (fx `homepage`, `about`, `kampagne-x`)
  
- **`title`** (String, required, max 255)
  - Sidens titel (bruges kun til overblik i CMS)
  
- **`pageType`** (Enumeration, required, default: `standard`)
  - Værdier: `homepage`, `landing`, `standard`
  - Gør det nemt at filtrere i frontend
  
- **`body`** (Rich text, optional)
  - Bruges til standard pages (fx About) med rich text indhold
  
- **`seo`** (Component: `shared.seo`, optional)
  - Meta title, description, OG image (via @strapi/plugin-seo)
  
- **`sections`** (Dynamic Zone, optional)
  - Liste af pre-built sektioner til homepage
  - Kan indeholde:
    - `homepage.hero-section`
    - `homepage.brand-logos-section`
    - `homepage.why-section`
    - `homepage.step-cards-section`
    - `homepage.product-section`
    - `homepage.storytelling-section`
    - `homepage.faq-section`
    - `homepage.final-cta-section`

---

## Homepage Components

Alle komponenter er placeret i: `beauty-shop-cms/src/components/homepage/`

### 1. `homepage.hero-section`

**Fil:** `hero-section.json`

**Felter:**
- `internalLabel` (String, optional) - Internt navn i CMS
- `title` (String, required) - Hero overskrift
- `body` (Text, required) - Hero undertekst
- `image` (Media, required) - Hero baggrundsbillede
- `imageAlt` (String, optional) - Alt tekst
- `primaryCtaLabel` (String, required) - Primær CTA knap tekst
- `primaryCtaLink` (String, required) - Primær CTA link
- `secondaryCtaLabel` (String, optional) - Sekundær CTA knap tekst
- `secondaryCtaLink` (String, optional) - Sekundær CTA link

**Matcher:** `HeroContent` i `src/lib/types/homepage.ts`

---

### 2. `homepage.brand-logos-section`

**Fil:** `brand-logos-section.json`

**Felter:**
- `internalLabel` (String, optional)
- `title` (String, optional) - Sektion titel (hvis nødvendig)
- `logos` (Repeatable component: `homepage.brand-logo-item`)

**Sub-komponent: `homepage.brand-logo-item`**
- `name` (String, required) - Brand navn
- `logo` (Media, required) - Logo billede
- `link` (String, optional) - Link til brand website

**Matcher:** `brandLogos: string[]` i `HomepageContent`

---

### 3. `homepage.why-section`

**Fil:** `why-section.json`

**Felter:**
- `internalLabel` (String, optional)
- `title` (String, required) - Overskrift
- `subtitle` (Text, required) - Undertekst/body
- `image` (Media, required) - Billede
- `imageAlt` (String, optional) - Alt tekst

**Matcher:** `WhySectionContent` i `src/lib/types/homepage.ts`

---

### 4. `homepage.step-cards-section`

**Fil:** `step-cards-section.json`

**Felter:**
- `internalLabel` (String, optional)
- `title` (String, optional) - Sektion titel
- `steps` (Repeatable component: `homepage.step-card-item`)

**Sub-komponent: `homepage.step-card-item`**
- `title` (String, required) - Step titel
- `body` (Text, required) - Step beskrivelse
- `icon` (String, optional) - Icon navn (fx "package", "truck", "repeat")
- `color` (Enumeration: `default` | `accent`, default: `default`)

**Matcher:** `StepCard[]` i `HomepageContent`

---

### 5. `homepage.product-section`

**Fil:** `product-section.json`

**Felter:**
- `internalLabel` (String, optional)
- `title` (String, optional) - Sektion titel
- `subtitle` (Text, optional) - Sektion undertekst
- `productHandles` (JSON, optional) - Liste af produkt handles/IDs (fx `["essentials", "premium"]`)
- `ctaLabel` (String, optional) - CTA knap tekst
- `ctaLink` (String, optional) - CTA link

**Note:** Produkter hentes fra Medusa baseret på `productHandles`. Priser og stock kommer fra Medusa, ikke Strapi.

**Matcher:** `ProductCard[]` i `HomepageContent` (men produkter fetches fra Medusa)

---

### 6. `homepage.storytelling-section`

**Fil:** `storytelling-section.json`

**Felter:**
- `internalLabel` (String, optional)
- `kicker` (String, optional) - Kicker tekst (uppercase label)
- `title` (String, required) - Overskrift
- `body` (Rich text, required) - Hovedtekst (kan indeholde flere paragrafer)
- `image` (Media, optional) - Billede
- `imageAlt` (String, optional) - Alt tekst
- `highlights` (Repeatable component: `homepage.story-highlight`, optional)
- `quote` (Component: `homepage.story-quote`, optional)

**Sub-komponent: `homepage.story-highlight`**
- `title` (String, required) - Highlight titel
- `description` (Text, required) - Highlight beskrivelse

**Sub-komponent: `homepage.story-quote`**
- `text` (String, required) - Quote tekst
- `author` (String, required) - Forfatter navn
- `role` (String, optional) - Forfatter rolle

**Matcher:** `StorytellingSection` i `HomepageContent`

---

### 7. `homepage.faq-section`

**Fil:** `faq-section.json`

**Felter:**
- `internalLabel` (String, optional)
- `title` (String, optional) - Sektion titel
- `items` (Repeatable component: `default.faq-item`)

**Note:** Genbruger eksisterende `default.faq-item` komponent:
- `question` (String, required)
- `answer` (Rich text, required)

**Matcher:** `FaqItem[]` i `HomepageContent`

---

### 8. `homepage.final-cta-section`

**Fil:** `final-cta-section.json`

**Felter:**
- `internalLabel` (String, optional)
- `title` (String, required) - Overskrift
- `body` (Text, required) - Undertekst
- `supportingPoints` (JSON, optional) - Array af strings med supporting points
- `primaryCtaLabel` (String, required) - Primær CTA knap tekst
- `primaryCtaLink` (String, required) - Primær CTA link
- `secondaryCtaLabel` (String, optional) - Sekundær CTA knap tekst
- `secondaryCtaLink` (String, optional) - Sekundær CTA link
- `image` (Media, optional) - Billede
- `imageAlt` (String, optional) - Alt tekst

**Matcher:** `FinalCtaContent` i `HomepageContent`

---

## Opret Homepage Record i Strapi

### Via Strapi Admin (Anbefalet for første gang):

1. **Start Strapi:**
   ```bash
   cd beauty-shop-cms
   npm run develop
   ```

2. **Log ind i Strapi Admin:**
   - Gå til http://localhost:1337/admin
   - Log ind med din admin bruger

3. **Opret ny Page:**
   - Gå til **Content Manager** → **Page**
   - Klik **"Create new entry"**
   - Udfyld:
     - **Title:** "Homepage"
     - **Slug:** `homepage` (auto-genereret fra title)
     - **Page Type:** Vælg `homepage`
     - **SEO:** Udfyld meta title, description, evt. OG image

4. **Tilføj Sektioner (Dynamic Zone):**
   - Scroll ned til **"Sections"** feltet
   - Klik **"Add a component"**
   - Vælg sektioner i rækkefølge (fx):
     1. `Hero Section` - Udfyld title, body, image, CTA
     2. `Brand Logos Section` - Tilføj brand logo items
     3. `Why Section` - Udfyld title, subtitle, image
     4. `Step Cards Section` - Tilføj step card items
     5. `Product Section` - Udfyld title, product handles
     6. `Storytelling Section` - Udfyld title, body, image, evt. highlights/quote
     7. `FAQ Section` - Tilføj FAQ items (genbruger `default.faq-item`)
     8. `Final CTA Section` - Udfyld title, body, CTA buttons

5. **Træk og Drop for Rækkefølge:**
   - Brug drag-handle (⋮⋮) ved hver sektion til at ændre rækkefølge
   - Træk sektioner op/ned for at omrokere

6. **Gem og Publish:**
   - Klik **"Save"** (gemmer som draft)
   - Klik **"Publish"** når klar til at vise i storefront

---

### Via Seed Script (Fremtidig):

En seed script kan oprettes senere for at automatisk oprette initial homepage content med mock data. Dette er ikke implementeret endnu, men kan tilføjes i `beauty-shop-cms/scripts/seed.js`.

---

## Mapping til Storefront

Når `Page` med slug `homepage` hentes fra Strapi, skal `sections` Dynamic Zone mappes til `HomepageContent` struktur:

```typescript
// Pseudokode for mapping
const mapStrapiPageToHomepageContent = (page: StrapiPage): HomepageContent => {
  const sections = page.attributes.sections || []
  
  return {
    hero: findSection(sections, 'hero-section')?.attributes,
    brandLogos: findSection(sections, 'brand-logos-section')?.attributes.logos.map(l => l.logo.url),
    whySection: findSection(sections, 'why-section')?.attributes,
    stepCards: findSection(sections, 'step-cards-section')?.attributes.steps,
    productCards: [], // Hentes fra Medusa baseret på productHandles
    storytelling: findSection(sections, 'storytelling-section')?.attributes,
    faq: findSection(sections, 'faq-section')?.attributes.items,
    finalCta: findSection(sections, 'final-cta-section')?.attributes,
    // footer kommer ikke fra homepage Page, men fra separat config
  }
}
```

**Note:** Dette mapping implementeres i Phase 4.4.

---

## Verifikation

### Automated:
- ✅ Strapi build lykkedes: `npm run build` i `beauty-shop-cms`
- ✅ Alle component schemas er valide JSON
- ✅ `Page` schema inkluderer `sections` Dynamic Zone med alle homepage components

### Manual (Næste skridt):
- [ ] Start Strapi: `npm run develop`
- [ ] Verificér `Page` content type er synlig i Content Manager
- [ ] Verificér alle `homepage.*` components er tilgængelige i Dynamic Zone
- [ ] Opret test `homepage` Page med mindst 2 sektioner
- [ ] Verificér at sektioner kan trækkes op/ned for at ændre rækkefølge

---

## Næste Skridt

**Phase 4.4:** Hent og map homepage-data fra Strapi til `HomeTemplate`
- Implementér `getHomepage()` helper i `src/lib/data/cms/pages.ts`
- Map Strapi `sections` Dynamic Zone til `HomepageContent`
- Opdater `page.tsx` til at bruge Strapi data med fallback

---

**Sidst opdateret:** 20. november 2025  
**Status:** ✅ Phase 4.3 Complete

