# Homepage Structure Analysis - Frontend Modules Organization

**Dato:** 20. november 2025  
**Phase:** 4.1 - Analyse  
**Status:** ✅ Complete

---

## ⚠️ VIGTIG KLAREGØRELSE

**`modules/` i storefront er IKKE MedusaJS backend modules!**

Der er en kritisk forskel:

1. **MedusaJS Modules (backend)** - `beauty-shop/src/modules/`:
   - Backend modules til MedusaJS
   - Har `models/`, `services/`, registreres i `medusa-config.ts`
   - Til business logic og data models
   - **IKKE relevant for frontend UI komponenter**

2. **Frontend Modules (storefront)** - `beauty-shop-storefront/src/modules/`:
   - **IKKE MedusaJS modules**
   - Frontend-organiseringsstruktur fra MedusaJS storefront starter template
   - Konvention til at organisere UI komponenter og templates
   - **Dette er hvad vi bruger til homepage komponenter**

**Konklusion:** Det er **korrekt** at bruge `modules/` til at organisere homepage design komponenter, men det er **ikke** "MedusaJS modules pattern" - det er en frontend-organiseringskonvention.

---

## Executive Summary

**Konklusion:** Homepage modulet følger **delvist** frontend modules konventionen, men mangler en `templates/` layer. Alle andre moduler (`products`, `store`, `order`, etc.) har både `components/` og `templates/`, mens `home` kun har `components/`.

**Anbefaling:** Opret `src/modules/home/templates/index.tsx` (HomeTemplate) der sammensætter alle homepage komponenter, og refaktor route handler til at bruge denne template for konsistens med andre moduler.

---

## 1. Nuværende Homepage Struktur

### 1.1 Route Handler
**File:** `src/app/[countryCode]/(main)/page.tsx`

```typescript
export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)
  if (!region) return null

  return (
    <main>
      <Hero content={homepageContent.hero} />
      <BrandLogos brandLogos={homepageContent.brandLogos} />
      <WhySection content={homepageContent.whySection} />
      <StepCards cards={homepageContent.stepCards} />
      <ProductCards products={homepageContent.productCards} />
      <StorytellingSection content={homepageContent.storytelling} />
      <FaqSection items={homepageContent.faq} />
      <FinalCtaSection content={homepageContent.finalCta} />
    </main>
  )
}
```

**Observationer:**
- ✅ Route handler er korrekt placeret i App Router struktur
- ✅ Bruger async/await for data fetching (`getRegion`)
- ❌ Importerer komponenter direkte i stedet for via template
- ❌ Ingen separation mellem route logic og template composition

### 1.2 Home Module Struktur
**Path:** `src/modules/home/`

```
home/
├── components/
│   ├── brand-logos/
│   ├── faq/
│   ├── featured-products/
│   ├── final-cta/
│   ├── hero/
│   ├── product-cards/
│   ├── step-cards/
│   ├── storytelling-section/
│   └── why-section/
```

**Observationer:**
- ✅ Komponenter er korrekt organiseret i `components/`
- ✅ Hver komponent har sin egen mappe med `index.tsx`
- ❌ **Mangler `templates/` directory**
- ❌ **Mangler `services/` directory** (hvis data fetching skal centraliseres)

### 1.3 Data Flow
**File:** `src/lib/data/homepage-content.ts`

```typescript
export const homepageContent: HomepageContent = {
  hero: { ... },
  brandLogos: [ ... ],
  whySection: { ... },
  // ... etc
}
```

**Observationer:**
- ✅ Data er typed (`HomepageContent` interface)
- ✅ Centraliseret i `lib/data/`
- ❌ Hardcoded mock data (kommentar: "will be replaced with CMS integration")
- ❌ Ingen service layer for data fetching

---

## 2. Sammenligning med Andre Moduler

### 2.1 Products Module
**Path:** `src/modules/products/`

```
products/
├── components/
│   ├── image-gallery/
│   ├── product-actions/
│   ├── product-preview/
│   └── ...
└── templates/
    ├── index.tsx (ProductTemplate)
    ├── product-info/
    └── product-actions-wrapper/
```

**Pattern:**
- Route handler (`src/app/[countryCode]/(main)/products/[handle]/page.tsx`) importerer `ProductTemplate`
- `ProductTemplate` sammensætter alle `components/`
- Template håndterer layout og composition

### 2.2 Store Module
**Path:** `src/modules/store/`

```
store/
├── components/
│   ├── pagination/
│   └── refinement-list/
└── templates/
    ├── index.tsx (StoreTemplate)
    └── paginated-products.tsx
```

**Pattern:**
- Route handler importerer `StoreTemplate`
- Template sammensætter components og håndterer data flow

### 2.3 Order Module
**Path:** `src/modules/order/`

```
order/
├── components/
│   ├── help/
│   ├── items/
│   └── ...
└── templates/
    ├── order-details-template.tsx
    └── order-completed-template.tsx
```

**Pattern:**
- Templates er async server components
- Håndterer data fetching og composition

---

## 3. Frontend Modules Organization Pattern

### 3.1 Backend Modules (MedusaJS Core) - IKKE RELEVANT
Ifølge [MedusaJS Modules dokumentation](https://docs.medusajs.com/learn/fundamentals/modules), backend modules har:
- `models/` - Data models (database tables)
- `services/` - Business logic
- `routes/` - API endpoints
- `workflows/` - Business workflows

**⚠️ Dette er backend-specifikt og IKKE relevant for frontend UI komponenter.**

**MedusaJS modules er designet til business logic, ikke frontend design komponenter.**

### 3.2 Frontend Modules Organization (Storefront Konvention)
I storefront (`beauty-shop-storefront/src/modules/`) er `modules/` en **organiseringskonvention** fra MedusaJS storefront starter template, IKKE backend MedusaJS modules.

Pattern ser ud til at være:

```
modules/
└── [domain]/
    ├── components/     # UI komponenter (presentation layer)
    ├── templates/      # Page templates (composition layer)
    └── services/       # Data fetching (optional, hvis kompleks)
```

**Rationale:**
- `components/` - Reusable UI komponenter
- `templates/` - Sammensætter components til komplette pages
- `services/` - Centraliseret data fetching (hvis nødvendigt)

**Dette er en frontend-organiseringskonvention, ikke MedusaJS backend modules.**

### 3.3 Home Module vs. Konvention

| Element | Konvention | Home Module | Status |
|---------|------------|-------------|--------|
| `components/` | ✅ Standard | ✅ Eksisterer | ✅ Korrekt |
| `templates/` | ✅ Standard | ❌ Mangler | ❌ **Mangler** |
| `services/` | ⚠️ Optional | ❌ Mangler | ⚠️ Overvej hvis kompleks data fetching |

---

## 4. Identificerede Problemer

### 4.1 Manglende Template Layer
**Problem:** Route handler sammensætter komponenter direkte i stedet for via template.

**Impact:**
- ❌ Inkonsistent med andre moduler
- ❌ Svært at genbruge homepage composition
- ❌ Route handler bliver for kompleks
- ❌ Svært at teste homepage composition isoleret

### 4.2 Data Fetching i Route Handler
**Problem:** Data fetching (`getRegion`) sker i route handler, ikke i template eller service.

**Impact:**
- ⚠️ Fungerer, men ikke optimalt
- ⚠️ Template kan ikke håndtere data fetching selv
- ⚠️ Svært at genbruge template med forskellige data sources

### 4.3 Hardcoded Mock Data
**Problem:** Homepage bruger hardcoded mock data fra `lib/data/homepage-content.ts`.

**Impact:**
- ❌ Blokerer CMS integration
- ❌ Data er ikke dynamisk
- ✅ Men: Kommentar indikerer at dette er bevidst (TODO for CMS)

---

## 5. Anbefalinger

### 5.1 Opret HomeTemplate (HØJ PRIORITET)
**Action:** Opret `src/modules/home/templates/index.tsx`

```typescript
// src/modules/home/templates/index.tsx
import Hero from "@modules/home/components/hero"
import BrandLogos from "@modules/home/components/brand-logos"
import WhySection from "@modules/home/components/why-section"
// ... etc

type HomeTemplateProps = {
  content: HomepageContent
  region: HttpTypes.StoreRegion
}

export default function HomeTemplate({ content, region }: HomeTemplateProps) {
  return (
    <main>
      <Hero content={content.hero} />
      <BrandLogos brandLogos={content.brandLogos} />
      <WhySection content={content.whySection} />
      <StepCards cards={content.stepCards} />
      <ProductCards products={content.productCards} />
      <StorytellingSection content={content.storytelling} />
      <FaqSection items={content.faq} />
      <FinalCtaSection content={content.finalCta} />
    </main>
  )
}
```

**Rationale:**
- ✅ Følger samme pattern som andre moduler
- ✅ Gør homepage composition genbrugelig
- ✅ Separerer route logic fra template composition
- ✅ Nemmere at teste

### 5.2 Refaktor Route Handler
**Action:** Opdater `src/app/[countryCode]/(main)/page.tsx`

```typescript
import HomeTemplate from "@modules/home/templates"
import { getRegion } from "@lib/data/regions"
import { homepageContent } from "@lib/data/homepage-content"

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)
  if (!region) return null

  return <HomeTemplate content={homepageContent} region={region} />
}
```

**Rationale:**
- ✅ Route handler bliver simplere
- ✅ Følger samme pattern som andre routes
- ✅ Template kan genbruges

### 5.3 Overvej Service Layer (LAV PRIORITET)
**Action:** Opret `src/modules/home/services/homepage-content.ts` (hvis nødvendigt)

```typescript
// src/modules/home/services/homepage-content.ts
import { homepageContent as fallbackContent } from "@lib/data/homepage-content"
import { getPageBySlug } from "@lib/data/cms/pages"

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    // Fetch from Strapi (når CMS er klar)
    const cmsPage = await getPageBySlug("homepage")
    if (cmsPage) {
      return mapCmsToHomepageContent(cmsPage)
    }
  } catch (error) {
    // Fallback to mock data
  }
  return fallbackContent
}
```

**Rationale:**
- ⚠️ Kun nødvendigt hvis data fetching bliver kompleks
- ⚠️ Kan vente til CMS integration
- ✅ Centraliserer data fetching logik

---

## 6. Konklusion

### 6.1 Nuværende Status
- ✅ Komponenter er korrekt struktureret
- ✅ Route handler fungerer
- ❌ Mangler template layer (inkonsistent med andre moduler)
- ⚠️ Data fetching kan forbedres (men ikke kritisk)

### 6.2 Næste Skridt
1. **HØJ PRIORITET:** Opret `HomeTemplate` i `src/modules/home/templates/`
2. **HØJ PRIORITET:** Refaktor route handler til at bruge template
3. **MEDIUM PRIORITET:** Overvej service layer når CMS integration starter
4. **LAV PRIORITET:** Flyt data fetching til service layer (hvis kompleks)

### 6.3 Alignment med Frontend Modules Konvention
**Frontend modules organisation (ikke MedusaJS backend modules):**
- ✅ `components/` - Eksisterer og er korrekt
- ❌ `templates/` - Mangler, skal oprettes for konsistens
- ⚠️ `services/` - Optional, kan tilføjes senere

**⚠️ VIGTIGT:** Dette er IKKE MedusaJS backend modules pattern. Det er en frontend-organiseringskonvention fra MedusaJS storefront starter template.

**Homepage er nu klar til refaktorering og CMS integration!**

---

## 7. Referencer

- **MedusaJS Modules Docs (backend):** https://docs.medusajs.com/learn/fundamentals/modules
  - ⚠️ Dette er til backend modules, IKKE frontend UI komponenter
- **Next.js App Router:** https://nextjs.org/docs/app
- **Eksisterende templates (frontend konvention):**
  - `src/modules/products/templates/index.tsx`
  - `src/modules/store/templates/index.tsx`
  - `src/modules/order/templates/order-details-template.tsx`

## 8. Vigtig Klarering

### 8.1 Backend vs. Frontend Modules

**`modules/` i storefront er IKKE MedusaJS backend modules.**

- ✅ Det er korrekt at bruge `modules/` til at organisere homepage design komponenter
- ✅ Dette er en frontend-organiseringskonvention fra MedusaJS storefront starter
- ❌ Det er IKKE "MedusaJS modules pattern" (som er til backend)
- ✅ Det er en god praksis for at organisere UI komponenter i storefront

**Konklusion:** Vores brug af `modules/home/components/` til homepage design komponenter er **korrekt** og følger storefront konventionen.

### 8.2 Forskellen mellem `src/components/` og `src/modules/[domain]/components/`

Der er en vigtig forskel mellem disse to directories:

#### `src/components/` (UI Primitives)
**Formål:** Generelle, reusable UI primitives og design system komponenter

**Eksempler:**
- `components/ui/button.tsx` - shadcn/ui Button komponent
- `components/ui/accordion.tsx` - shadcn/ui Accordion komponent
- `components/ui/card.tsx` - shadcn/ui Card komponent
- `components/blocks/` - (eventuelle block-level komponenter)

**Karakteristika:**
- ✅ **Domain-agnostic** - kan bruges overalt
- ✅ **Low-level** - grundlæggende UI building blocks
- ✅ **Design system** - følger design tokens og patterns
- ✅ **Genbrugelig** - ingen business logic

**Brug:** Når du har brug for en generel UI komponent (knap, input, card, etc.)

#### `src/modules/[domain]/components/` (Domain Components)
**Formål:** Domain-specifikke komponenter med business logic

**Eksempler:**
- `modules/home/components/hero/` - Homepage hero sektion
- `modules/home/components/why-section/` - Homepage "why" sektion
- `modules/products/components/product-preview/` - Produkt preview card
- `modules/cart/components/item/` - Cart item komponent

**Karakteristika:**
- ✅ **Domain-specific** - tilhører et specifikt domæne (home, products, cart, etc.)
- ✅ **High-level** - sammensatte komponenter med business logic
- ✅ **Context-aware** - forstår domænets data strukturer
- ✅ **Business logic** - kan indeholde domain-specifik logik

**Brug:** Når du har brug for en komponent der er specifik for et domæne

#### `src/modules/common/components/` (Shared Domain Components)
**Formål:** Komponenter der deles på tværs af flere domæner

**Eksempler:**
- `modules/common/components/interactive-link/` - Link komponent
- `modules/common/components/modal/` - Modal komponent
- `modules/common/components/delete-button/` - Delete button

**Karakteristika:**
- ✅ **Cross-domain** - bruges af flere moduler
- ✅ **Reusable** - men stadig med lidt business context
- ✅ **Shared utilities** - hjælpekomponenter

**Brug:** Når en komponent skal bruges af flere domæner, men ikke er en UI primitive

### 8.3 Beslutningstræ: Hvor skal min komponent placeres?

```
Er komponenten en generel UI primitive?
├─ JA → src/components/ui/
│       (Button, Input, Card, etc.)
│
└─ NEJ → Er komponenten specifik for ét domæne?
    ├─ JA → src/modules/[domain]/components/
    │       (Hero, ProductPreview, CartItem, etc.)
    │
    └─ NEJ → Bruges den af flere domæner?
        ├─ JA → src/modules/common/components/
        │       (InteractiveLink, Modal, etc.)
        │
        └─ NEJ → Overvej om den skal være i components/ui/
```

### 8.4 Eksempel: Homepage Hero Komponent

**Placering:** `src/modules/home/components/hero/index.tsx`

**Hvorfor ikke `src/components/`?**
- ❌ Hero er specifik for homepage domain
- ❌ Har business logic (homepage content structure)
- ❌ Er ikke en generel UI primitive

**Hvorfor ikke `src/modules/common/components/`?**
- ❌ Hero bruges kun på homepage
- ❌ Er ikke shared på tværs af domæner

**Konklusion:** `modules/home/components/hero/` er korrekt placering ✅

### 8.5 Eksempel: Button Komponent

**Placering:** `src/components/ui/button.tsx`

**Hvorfor ikke `modules/`?**
- ✅ Button er en generel UI primitive
- ✅ Kan bruges overalt (homepage, products, cart, etc.)
- ✅ Ingen business logic
- ✅ Følger design system

**Konklusion:** `components/ui/button.tsx` er korrekt placering ✅

---

**Sidst opdateret:** 20. november 2025

