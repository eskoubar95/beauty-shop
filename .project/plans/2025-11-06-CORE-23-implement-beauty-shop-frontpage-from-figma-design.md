# Implement Beauty Shop Frontpage from Figma Design - Implementation Plan

## Overview

Implementerer professionel frontpage for Beauty Shop baseret på Figma design "guapo-webdesign". Frontpagen erstatter nuværende placeholder med kompleks hero section, brand logos, why section, 3-step cards, og product selection cards. Alt skal være responsivt, CMS-ready, og integreret med ShadCN UI komponenter.

**Estimated Size:** ~800-1000 LOC  
**Estimated Time:** 8-12 timer  
**Risk Level:** Medium

---

## Linear Issue

**Issue:** CORE-23  
**Title:** Implement Beauty Shop Frontpage from Figma Design  
**Status:** Triage  
**Priority:** High  
**Labels:** Frontend, Feature  
**URL:** https://linear.app/beauty-shop/issue/CORE-23/implement-beauty-shop-frontpage-from-figma-design

---

## Current State Analysis

### What Exists:

1. **Next.js 15 + React 19 Setup:**
   - App Router structure i `beauty-shop-storefront/src/app/[countryCode]/(main)/`
   - Current homepage: `src/app/[countryCode]/(main)/page.tsx` med placeholder Hero og FeaturedProducts
   - Tailwind CSS configured med MedusaJS UI preset
   - Inter font family allerede konfigureret

2. **Current Hero Component:**
   - `src/modules/home/components/hero/index.tsx` - Simple placeholder med "Ecommerce Starter Template" tekst
   - Bruger MedusaJS UI komponenter (Button, Heading)

3. **Navigation:**
   - `src/modules/layout/templates/nav/index.tsx` - Eksisterende navigation med SideMenu, CartButton
   - Bruger MedusaJS UI komponenter
   - Logo: "Medusa Store" (skal ændres til "GUAPO")

4. **Module Structure:**
   - `src/modules/` - Feature-based module struktur
   - `src/modules/home/` - Homepage komponenter

5. **Tailwind Config:**
   - MedusaJS UI preset aktivt
   - Custom colors (grey scale) allerede defineret
   - Inter font konfigureret

### What's Missing:

1. **ShadCN UI Setup:**
   - Ingen `components.json` fil
   - Ingen `src/lib/utils.ts` med `cn()` helper
   - ShadCN komponenter ikke installeret

2. **Design System Colors:**
   - Brand farver (Oxford Blue, Royal Blue, Orange/Red) ikke i Tailwind config
   - Background colors (`#efeeec`, `#fafaf8`) mangler

3. **Frontpage Sections:**
   - Hero section med overlay tekst box (mangler)
   - Brand logos section (mangler)
   - Why section "Hudpleje gjort simpelt" (mangler)
   - 3-step cards med motion (mangler)
   - Product selection cards (mangler)

4. **Navigation Updates:**
   - Logo skal ændres til "GUAPO"
   - Menu links skal være: "Hudpleje box", "Om GUAPO", "Kontakt"
   - User icon (mangler)

5. **CMS-Ready Structure:**
   - TypeScript interfaces for content struktur (mangler)
   - Hardcoded content (ikke CMS-ready endnu)

6. **Framer Motion:**
   - Ikke installeret (påkrævet for 3-step cards animation)

### Key Discoveries:

**File References:**
- Current homepage: `beauty-shop-storefront/src/app/[countryCode]/(main)/page.tsx:1-41`
- Current hero: `beauty-shop-storefront/src/modules/home/components/hero/index.tsx:1-36`
- Navigation: `beauty-shop-storefront/src/modules/layout/templates/nav/index.tsx:1-60`
- Tailwind config: `beauty-shop-storefront/tailwind.config.js:1-163`
- Package.json: `beauty-shop-storefront/package.json:1-64`

**Patterns to Follow:**
- Module-based struktur: `src/modules/home/components/` for homepage komponenter
- Server Components by default (kun "use client" når nødvendigt)
- MedusaJS UI komponenter bruges i nuværende codebase (men vi skifter til ShadCN UI for denne feature)
- Layout wrapper: `src/app/[countryCode]/(main)/layout.tsx` håndterer Nav og Footer

---

## Desired End State

### Specification:

1. **ShadCN UI Setup:**
   - `components.json` konfigureret med korrekte paths
   - `src/lib/utils.ts` med `cn()` helper
   - ShadCN komponenter kan importeres og bruges

2. **Design System:**
   - Tailwind config opdateret med brand colors:
     - Primary: `#051537` (Oxford Blue)
     - Primary dark: `#092766` (Royal Blue)
     - Accent: `#f2542d` (Orange/Red)
     - Grays: `#A5A5A5`, `#CCCCCC`, `#F2F2F2`
     - Background: `#efeeec`, `#fafaf8`

3. **Navigation Component:**
   - Logo: "GUAPO" (venstre side)
   - Menu links: "Hudpleje box", "Om GUAPO", "Kontakt"
   - Cart icon med badge (højre side)
   - User icon (højre side)
   - Hamburger menu på mobile
   - ShadCN UI komponenter som base

4. **Hero Section:**
   - 700px høj (desktop)
   - Baggrundsbillede (hero image asset)
   - Overlay tekst box (hvid/beige baggrund)
- H1: "Hudpleje, der virker. Leveret til dig." (40px, Inter SemiBold, tracking -0.4px)
- Body tekst (15px, Inter Regular, tracking -0.375px)
- CTA button: "Start din Rutine" (dark blue bg `#051537`, white text, IBM Plex Mono font, 15px, uppercase, tracking 1.65px)
   - Responsiv: Stack tekst over billede på mobile
   - CMS-ready: Content fra props/config

5. **Brand Logos Section:**
   - Horizontal strip med logoer (Beauty of Joseon, VT Group, Medicube)
   - Opacity 60%
   - Responsiv: Scroll på mobile hvis nødvendigt

6. **Why Section:**
   - 2-kolonne grid layout (desktop)
   - Venstre: Billede (product box image asset)
   - Højre: Tekst
     - H2: "Hudpleje gjort simpelt" (56px, Inter SemiBold)
     - Body: "Vi samler koreansk effektivitet..." (17px, Inter Medium)
   - Responsiv: Stack tekst under billede på mobile
   - CMS-ready: Content fra props/config

7. **3-Step Cards Section:**
   - 3 cards i grid (desktop)
   - Card 1: "Vælg din pakke" (light gray bg, dark blue border)
   - Card 2: "Modtag din boks" (light gray bg, dark blue border)
   - Card 3: "Gentag månedligt" (orange bg `#f2542d`, white text)
   - Hver card: Icon (56px), Heading (22px), Body (14px)
   - Responsiv: Horizontal scroll med motion på mobile
   - Motion: Smooth scroll, snap points, fade edges
   - CMS-ready: Content fra props/config

8. **Product Selection Cards:**
   - 2 cards i grid (desktop)
   - Hver card: Image placeholder, Title, Subtitle, Features list, Price, CTA button
   - "Essentials" card med priser (599,00 DKK første måned, 399,95 DKK/pr. måned efterfølgende - brug dansk nummerformatering med komma)
   - Responsiv: Stack cards på mobile
   - CMS-ready: Product data fra props/config

9. **Responsive Design:**
   - Mobile: < 640px (sm breakpoint)
   - Tablet: 640px - 1024px (md breakpoint)
   - Desktop: > 1024px (lg breakpoint)
   - Alle sektioner testet på alle breakpoints
   - Touch-friendly targets (min 44x44px)
   - Readable text sizes (min 16px body)

10. **CMS Preparation:**
    - Hero content struktur (title, body, ctaText, imageUrl)
    - Why section content struktur (title, body, imageUrl)
    - Step cards content struktur (array med title, body, icon, color)
    - Product cards content struktur (array med product data)
    - TypeScript interfaces/typer defineret
    - Hardcoded content nu, klar til CMS integration senere

11. **Performance & Accessibility:**
    - Images optimized (Next.js Image component)
    - Semantic HTML (h1-h6, nav, section, article)
    - ARIA labels hvor nødvendigt
    - Keyboard navigation fungerer
    - Lighthouse score > 90 (Performance, Accessibility)

### Verification Criteria:

- [ ] Alle sektioner render korrekt på desktop, tablet, mobile
- [ ] Navigation fungerer med hamburger menu på mobile
- [ ] Hero section viser korrekt tekst og CTA
- [ ] Brand logos scroll på mobile hvis nødvendigt
- [ ] Why section stack korrekt på mobile
- [ ] 3-step cards scroll smooth på mobile med snap points
- [ ] Product cards stack på mobile
- [ ] Alle farver matcher Figma design
- [ ] Typography matcher specifikationer
- [ ] Lighthouse score > 90
- [ ] Keyboard navigation fungerer
- [ ] TypeScript types defineret for alle content strukturer

---

## What We're NOT Doing

**Explicitly Out of Scope:**

1. **CMS Integration:**
   - Vi laver IKKE PayloadCMS integration i denne phase
   - Vi laver content struktur klar (TypeScript interfaces), men hardcoder content nu

2. **Product Data Integration:**
   - Vi laver IKKE integration med MedusaJS product API i denne phase
   - Product cards viser placeholder data

3. **Cart Functionality:**
   - Vi laver IKKE add-to-cart funktionalitet i denne phase
   - CTA buttons er visuelle placeholders

4. **Navigation Routing:**
   - Vi laver IKKE routing til "Om GUAPO" og "Kontakt" pages
   - Links er placeholders (kan være `#` eller `/`)

5. **Image Assets:**
   - Vi laver IKKE faktiske image assets (hero image, product box image)
   - Vi bruger placeholder images eller Next.js Image med placeholder

6. **Logo Assets:**
   - Vi laver IKKE faktiske brand logo SVG'er (Beauty of Joseon, etc.)
   - Vi bruger placeholder logos eller tekst

7. **Icon Assets:**
   - Vi laver IKKE custom SVG icons til 3-step cards
   - Vi bruger eksisterende icon library eller placeholder icons

8. **Animation Details:**
   - Vi laver IKKE komplekse animations udover basic scroll motion
   - Vi fokuserer på smooth scroll, snap points, fade edges

9. **SEO Optimization:**
   - Vi laver IKKE meta tags, structured data, eller SEO optimization
   - Det kommer i senere phase

10. **Analytics:**
    - Vi laver IKKE event tracking eller analytics integration
    - Det kommer i senere phase

---

## Implementation Approach

**High-Level Strategy:**

1. **Setup First:** Installer ShadCN UI og konfigurer design system
2. **Foundation:** Opret TypeScript interfaces og content strukturer
3. **Components:** Byg komponenter én for én (Navigation → Hero → Sections)
4. **Integration:** Integrer komponenter i homepage
5. **Polish:** Responsive design, motion, accessibility, performance

**Why This Order:**
- Setup først sikrer alle dependencies er klar
- Foundation sikrer type safety gennem hele processen
- Komponenter bygges isoleret (lettere at teste)
- Integration til sidst (samler alt sammen)
- Polish til sidst (optimerer det færdige produkt)

---

## Phase 1: ShadCN UI Setup & Design System Configuration

### Overview

Installerer og konfigurerer ShadCN UI, opdaterer Tailwind config med brand colors, og opretter utility functions.

**Estimated Time:** 1-2 timer

### Changes Required:

#### 1. Install ShadCN UI
**Command:** 
```bash
cd beauty-shop-storefront
npx shadcn@latest init
```

**Configuration:**
- Style: Default
- Base color: Slate
- CSS variables: Yes
- App directory: `src/app`
- Components: `src/components`
- Utils: `src/lib/utils`
- Use alias: Yes

**Rationale:** ShadCN UI giver os access til Radix UI primitives og styled komponenter der matcher vores design system.

#### 2. Update Tailwind Config with Brand Colors
**File:** `beauty-shop-storefront/tailwind.config.js`

**Changes:** Tilføj brand colors til `theme.extend.colors`:

```javascript
colors: {
  // ... existing colors ...
  primary: {
    DEFAULT: '#051537',
    dark: '#092766',
  },
  accent: {
    DEFAULT: '#f2542d',
  },
  gray: {
    light: '#F2F2F2',
    medium: '#CCCCCC',
    dark: '#A5A5A5',
  },
  background: {
    DEFAULT: '#efeeec',
    light: '#fafaf8',
  },
}
```

**Also add IBM Plex Mono to fontFamily (for hero button):**
```javascript
fontFamily: {
  // ... existing sans ...
  mono: ['IBM Plex Mono', 'monospace'],
}
```

**Note:** IBM Plex Mono skal installeres via Google Fonts eller Next.js font optimization.

**Rationale:** Brand colors skal være tilgængelige gennem Tailwind classes (`bg-primary`, `text-accent`, etc.). IBM Plex Mono er brugt til hero button ifølge Figma design.

#### 3. Verify `lib/utils.ts` Created
**File:** `beauty-shop-storefront/src/lib/utils.ts`

**Should contain:**
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Rationale:** `cn()` helper er essentiel for at kombinere Tailwind classes dynamisk.

#### 4. Install Framer Motion
**Command:**
```bash
cd beauty-shop-storefront
yarn add framer-motion
```

**Rationale:** Framer Motion er påkrævet for 3-step cards horizontal scroll animation.

### Success Criteria:

#### Automated Verification:
- [ ] ShadCN UI init completed: `components.json` eksisterer
- [ ] `src/lib/utils.ts` eksisterer med `cn()` function
- [ ] `framer-motion` i `package.json` dependencies
- [ ] Type check passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:
- [ ] ShadCN komponenter kan importeres: `import { Button } from "@/components/ui/button"`
- [ ] Brand colors tilgængelige: `bg-primary`, `text-accent` fungerer
- [ ] `cn()` helper fungerer: Kan kombinere classes

**⚠️ PAUSE HERE** - Verificer alt fungerer før Phase 2

---

## Phase 2: TypeScript Types & CMS-Ready Structure

### Overview

Opretter TypeScript interfaces for alle content strukturer (hero, why section, step cards, product cards). Disse typer gør koden type-safe og klar til CMS integration senere.

**Estimated Time:** 1 time

### Changes Required:

#### 1. Create Types File
**File:** `beauty-shop-storefront/src/lib/types/homepage.ts`

**Content:**
```typescript
export interface HeroContent {
  title: string
  body: string
  ctaText: string
  imageUrl: string
}

export interface WhySectionContent {
  title: string
  body: string
  imageUrl: string
}

export interface StepCard {
  title: string
  body: string
  icon: string // Icon name or URL
  color: "default" | "accent" // default = gray bg, accent = orange bg
}

export interface ProductCard {
  id: string
  title: string
  subtitle: string
  features: string[]
  price: {
    firstMonth: number // DKK
    subsequent: number // DKK
  }
  imageUrl: string
  ctaText: string
}

export interface HomepageContent {
  hero: HeroContent
  brandLogos: string[] // Array of logo URLs
  whySection: WhySectionContent
  stepCards: StepCard[]
  productCards: ProductCard[]
}
```

**Rationale:** Centraliseret type definitions gør koden type-safe og dokumenterer content struktur klar til CMS.

#### 2. Create Mock Data File
**File:** `beauty-shop-storefront/src/lib/data/homepage-content.ts`

**Content:** Hardcoded mock data der matcher design specifikationer.

**Rationale:** Mock data gør det muligt at bygge komponenter uden at vente på faktiske assets eller CMS.

### Success Criteria:

#### Automated Verification:
- [ ] Types file eksisterer: `src/lib/types/homepage.ts`
- [ ] Mock data file eksisterer: `src/lib/data/homepage-content.ts`
- [ ] Type check passes: `npm run type-check`
- [ ] No TypeScript errors i files

#### Manual Verification:
- [ ] Types kan importeres: `import { HeroContent } from "@/lib/types/homepage"`
- [ ] Mock data matcher TypeScript interfaces
- [ ] IntelliSense fungerer når man bruger types

**⚠️ PAUSE HERE** - Verificer types før Phase 3

---

## Phase 3: Navigation Component

### Overview

Opdaterer navigation komponenten til at matche Figma design med GUAPO logo, nye menu links, og styling. **VIKTIGT:** Vi bevarer eksisterende MedusaJS integration (CartButton, CartDropdown) - kun visuel styling opdateres.

**Estimated Time:** 1 time

### Changes Required:

#### 1. Update Navigation Component
**File:** `beauty-shop-storefront/src/modules/layout/templates/nav/index.tsx`

**Changes:**
- Erstat "Medusa Store" med "GUAPO" logo tekst
- Tilføj menu links: "Hudpleje box", "Om GUAPO", "Kontakt" (desktop)
- Tilføj User icon (højre side, ved siden af CartButton)
- Opdater styling til Figma design:
  - Background: `bg-[#f2f2f2]` (eller `bg-background-light`)
  - Text colors: `text-primary` for links
  - Spacing: Match Figma (64px padding, etc.)
- Responsiv: Opdater SideMenu styling (bevar funktionalitet, kun styling tweaks)
- **BEVAR CartButton komponent som den er** (ingen funktionelle ændringer)

**Styling Approach:**
- Brug Tailwind classes direkte (ikke nødvendigvis ShadCN Button komponenter)
- Brug brand colors: `primary`, `accent`, etc.
- Bevar MedusaJS UI preset (vi kan bruge både MedusaJS og ShadCN classes)
- Bevar `content-container` class
- **KUN visuel styling** - ingen funktionelle ændringer til CartButton/CartDropdown

**Rationale:** Navigation er første element brugeren ser, så det skal matche design. Vi bevarer kritiske e-commerce funktioner (cart) for at undgå regression.

#### 2. Update SideMenu Styling (Optional)
**File:** `beauty-shop-storefront/src/modules/layout/components/side-menu/index.tsx`

**If needed:** Opdater SideMenu styling til at matche Figma design (bevar HeadlessUI Popover, kun styling tweaks).

**Rationale:** SideMenu fungerer godt med HeadlessUI - kun styling opdateres, ikke funktionalitet.

#### 3. CartButton Badge Styling (Optional)
**File:** `beauty-shop-storefront/src/modules/layout/components/cart-dropdown/index.tsx`

**If needed:** Opdater badge styling til at matche Figma design (orange background `#f2542d` hvis synlig i navigation).

**Note:** Dette er valgfrit - kun hvis badge skal matche Figma design eksakt. **BEVAR alt andet funktionalitet som den er.**

### Success Criteria:

#### Automated Verification:
- [ ] Navigation komponent opdateret
- [ ] Type check passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:
- [ ] Logo viser "GUAPO" (desktop og mobile)
- [ ] Menu links vises (desktop): "Hudpleje box", "Om GUAPO", "Kontakt"
- [ ] Hamburger menu fungerer (mobile)
- [ ] **CartButton virker korrekt** (vigtigste test!)
- [ ] CartDropdown åbner og viser cart items
- [ ] Cart count badge opdateres korrekt
- [ ] User icon vises (højre side)
- [ ] Responsive: Navigation fungerer på alle breakpoints
- [ ] **Ingen regression i eksisterende cart funktionalitet**

**⚠️ PAUSE HERE** - Verificer navigation før Phase 4

---

## Phase 4: Hero Section

### Overview

Opretter ny hero section komponent der matcher Figma design med overlay tekst box, baggrundsbillede, og CTA button.

**Estimated Time:** 1.5 timer

### Changes Required:

#### 1. Create New Hero Component
**File:** `beauty-shop-storefront/src/modules/home/components/hero/index.tsx`

**Replace existing content med:**
- 700px høj container (desktop)
- Next.js Image component for baggrundsbillede
- Overlay tekst box (hvid/beige baggrund, centered eller positioned)
- H1: "Hudpleje, der virker. Leveret til dig." (40px, Inter SemiBold)
- Body tekst (15px, Inter Regular)
- CTA button: "Start din Rutine" (ShadCN Button, dark blue bg, white text)
- Responsiv: Stack tekst over billede på mobile

**Props:** `HeroContent` interface fra types file

**Rationale:** Hero section er første impression, så den skal være perfekt.

#### 2. Update Homepage to Use New Hero
**File:** `beauty-shop-storefront/src/app/[countryCode]/(main)/page.tsx`

**Changes:**
- Import mock data fra `@/lib/data/homepage-content`
- Pass hero content til Hero component

### Success Criteria:

#### Automated Verification:
- [ ] Hero komponent opdateret
- [ ] Homepage opdateret
- [ ] Type check passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:
- [ ] Hero section er 700px høj (desktop)
- [ ] Baggrundsbillede vises (eller placeholder)
- [ ] Overlay tekst box vises med korrekt styling
- [ ] H1 tekst matcher specifikation (40px, Inter SemiBold)
- [ ] Body tekst matcher specifikation (15px, Inter Regular)
- [ ] CTA button fungerer (visuelt, ikke nødvendigvis click handler)
- [ ] Responsiv: Tekst stack over billede på mobile
- [ ] Alt ser godt ud på desktop, tablet, mobile

**⚠️ PAUSE HERE** - Verificer hero section før Phase 5

---

## Phase 5: Brand Logos Section

### Overview

Opretter brand logos section med horizontal strip af logoer (Beauty of Joseon, VT Group, Medicube) med opacity 60%.

**Estimated Time:** 0.5 timer

### Changes Required:

#### 1. Create Brand Logos Component
**File:** `beauty-shop-storefront/src/modules/home/components/brand-logos/index.tsx`

**Content:**
- Horizontal strip container
- Logo images (placeholder eller tekst for nu)
- Opacity 60% (`opacity-60`)
- Responsiv: Scroll på mobile hvis nødvendigt (horizontal scroll med overflow-x-auto)

**Props:** `brandLogos: string[]` (array af logo URLs)

**Rationale:** Simpel komponent, men vigtig for brand trust.

### Success Criteria:

#### Automated Verification:
- [ ] Brand logos komponent oprettet
- [ ] Type check passes: `npm run type-check`

#### Manual Verification:
- [ ] Logoer vises i horizontal strip
- [ ] Opacity 60% anvendt
- [ ] Responsiv: Scroll på mobile hvis nødvendigt
- [ ] Alt ser godt ud på alle breakpoints

**⚠️ PAUSE HERE** - Verificer brand logos før Phase 6

---

## Phase 6: Why Section

### Overview

Opretter "Hudpleje gjort simpelt" section med 2-kolonne layout (billede venstre, tekst højre) der stacker på mobile.

**Estimated Time:** 1 time

### Changes Required:

#### 1. Create Why Section Component
**File:** `beauty-shop-storefront/src/modules/home/components/why-section/index.tsx`

**Content:**
- 2-kolonne grid layout (desktop): `grid grid-cols-2 gap-8`
- Venstre kolonne: Next.js Image component (product box image)
- Højre kolonne: Tekst
  - H2: "Hudpleje gjort simpelt" (56px, Inter SemiBold)
  - Body: "Vi samler koreansk effektivitet..." (17px, Inter Medium)
- Responsiv: Stack på mobile (`flex-col` på mobile, `grid-cols-2` på desktop)

**Props:** `WhySectionContent` interface

**Rationale:** Why section forklarer værdiproposition, så den skal være klar og læsbar.

### Success Criteria:

#### Automated Verification:
- [ ] Why section komponent oprettet
- [ ] Type check passes: `npm run type-check`

#### Manual Verification:
- [ ] 2-kolonne layout (desktop)
- [ ] Billede vises (venstre)
- [ ] Tekst vises (højre)
- [ ] H2 matcher specifikation (56px, Inter SemiBold)
- [ ] Body tekst matcher specifikation (17px, Inter Medium)
- [ ] Responsiv: Stack på mobile (tekst under billede)
- [ ] Alt ser godt ud på alle breakpoints

**⚠️ PAUSE HERE** - Verificer why section før Phase 7

---

## Phase 7: 3-Step Cards Section

### Overview

Opretter 3-step cards section med 3 cards i grid (desktop) og horizontal scroll med motion på mobile. Dette er den mest komplekse komponent pga. motion requirements.

**Estimated Time:** 2 timer

### Changes Required:

#### 1. Install/Verify Framer Motion
**Already done in Phase 1, but verify:**
- `framer-motion` i `package.json`

#### 2. Create Step Cards Component
**File:** `beauty-shop-storefront/src/modules/home/components/step-cards/index.tsx`

**Content:**
- Desktop: 3 cards i grid (`grid grid-cols-3 gap-8`)
- Card styling:
  - Card 1 & 2: Light gray bg (`bg-gray-light`), dark blue border (`border-primary`)
  - Card 3: Orange bg (`bg-accent`), white text
- Hver card:
  - Icon (56px) - placeholder icon for nu
  - Heading (22px, Inter SemiBold)
  - Body (14px, Inter Regular)
- Mobile: Horizontal scroll container med Framer Motion
  - Smooth scroll
  - Snap points (1 card per view)
  - Fade edges (gradient overlay)
  - Optional: Swipe gestures

**Props:** `stepCards: StepCard[]`

**Framer Motion Implementation:**
```typescript
"use client"
import { motion } from "framer-motion"

// Mobile scroll container
<motion.div
  className="flex overflow-x-auto snap-x snap-mandatory gap-4"
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
>
  {stepCards.map((card, index) => (
    <motion.div
      key={index}
      className="flex-shrink-0 w-[calc(100vw-2rem)] snap-center"
    >
      {/* Card content */}
    </motion.div>
  ))}
</motion.div>
```

**Rationale:** Motion gør experience bedre på mobile, men kræver "use client" directive.

#### 3. Create Card Component (Optional)
**File:** `beauty-shop-storefront/src/modules/home/components/step-cards/step-card.tsx`

**If needed:** Separeret card komponent for bedre organization.

### Success Criteria:

#### Automated Verification:
- [ ] Step cards komponent oprettet
- [ ] Framer Motion importet og brugt
- [ ] Type check passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:
- [ ] 3 cards vises i grid (desktop)
- [ ] Card styling matcher specifikation (gray bg + border for 1-2, orange bg for 3)
- [ ] Icons vises (56px)
- [ ] Headings matcher specifikation (22px)
- [ ] Body tekst matcher specifikation (14px)
- [ ] Mobile: Horizontal scroll fungerer
- [ ] Mobile: Snap points fungerer (1 card per view)
- [ ] Mobile: Fade edges vises (gradient overlay)
- [ ] Mobile: Smooth scroll animation
- [ ] Alt ser godt ud på alle breakpoints

**⚠️ PAUSE HERE** - Verificer step cards før Phase 8

---

## Phase 8: Product Selection Cards

### Overview

Opretter product selection cards section med 2 cards i grid (desktop) der stacker på mobile. Hver card har image, title, subtitle, features list, price, og CTA button.

**Estimated Time:** 1.5 timer

### Changes Required:

#### 1. Create Product Cards Component
**File:** `beauty-shop-storefront/src/modules/home/components/product-cards/index.tsx`

**Content:**
- 2-kolonne grid layout (desktop): `grid grid-cols-2 gap-8`
- Hver card:
  - Image placeholder (Next.js Image)
  - Title (heading)
  - Subtitle
  - Features list (ul/li)
  - Price: "599 DKK første måned, 399,95 DKK efterfølgende"
  - CTA button (ShadCN Button)
- Responsiv: Stack cards på mobile (`flex-col` på mobile)

**Props:** `productCards: ProductCard[]`

**Rationale:** Product cards er conversion-focused, så de skal være klare og actionable.

### Success Criteria:

#### Automated Verification:
- [ ] Product cards komponent oprettet
- [ ] Type check passes: `npm run type-check`

#### Manual Verification:
- [ ] 2 cards vises i grid (desktop)
- [ ] Hver card har alle elementer (image, title, subtitle, features, price, CTA)
- [ ] Pris vises korrekt: "599 DKK første måned, 399,95 DKK efterfølgende"
- [ ] CTA button fungerer (visuelt)
- [ ] Responsiv: Cards stack på mobile
- [ ] Alt ser godt ud på alle breakpoints

**⚠️ PAUSE HERE** - Verificer product cards før Phase 9

---

## Phase 9: Homepage Integration

### Overview

Integrerer alle nye komponenter i homepage og opdaterer struktur til at matche design.

**Estimated Time:** 1 time

### Changes Required:

#### 1. Update Homepage
**File:** `beauty-shop-storefront/src/app/[countryCode]/(main)/page.tsx`

**Changes:**
- Import alle nye komponenter
- Import mock data fra `@/lib/data/homepage-content`
- Opdater struktur:
  ```tsx
  <>
    <Hero content={homepageContent.hero} />
    <BrandLogos logos={homepageContent.brandLogos} />
    <WhySection content={homepageContent.whySection} />
    <StepCards cards={homepageContent.stepCards} />
    <ProductCards cards={homepageContent.productCards} />
  </>
  ```
- Fjern eller kommenter ud gamle `FeaturedProducts` komponent (hvis ikke brugt)

**Rationale:** Integration samler alt sammen til en komplet frontpage.

#### 2. Update Metadata
**File:** `beauty-shop-storefront/src/app/[countryCode]/(main)/page.tsx`

**Changes:**
- Opdater `metadata.title` til "Beauty Shop - Hudpleje, der virker"
- Opdater `metadata.description` til relevante SEO tekst

### Success Criteria:

#### Automated Verification:
- [ ] Homepage opdateret med alle komponenter
- [ ] Type check passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:
- [ ] Alle sektioner vises i korrekt rækkefølge
- [ ] Ingen console errors
- [ ] Page load time < 2 seconds
- [ ] Alt fungerer på desktop, tablet, mobile

**⚠️ PAUSE HERE** - Verificer komplet frontpage før Phase 10

---

## Phase 10: Responsive Design Polish

### Overview

Polerer responsive design, sikrer alle sektioner fungerer perfekt på alle breakpoints, og tilføjer touch-friendly targets.

**Estimated Time:** 1.5 timer

### Changes Required:

#### 1. Verify Breakpoints
**Check alle komponenter:**
- Mobile: < 640px (default Tailwind)
- Tablet: 640px - 1024px (`sm:` prefix)
- Desktop: > 1024px (`lg:` prefix)

**Ensure:**
- Alle sektioner har korrekt responsive behavior
- Tekst størrelser justeres (fx `text-4xl lg:text-5xl`)
- Spacing justeres (fx `px-4 lg:px-16`)
- Grid layouts justeres (fx `grid-cols-1 lg:grid-cols-2`)

#### 2. Touch-Friendly Targets
**Ensure:**
- Alle buttons har min 44x44px touch target
- Links har min 44px højde
- Spacing mellem interaktive elementer er tilstrækkelig

#### 3. Readable Text Sizes
**Ensure:**
- Body text er min 16px på mobile (for accessibility)
- Headings skal være større end body text
- Line height er tilstrækkelig (fx `leading-relaxed`)

#### 4. Test på Devices
**Manual testing:**
- iPhone (mobile)
- iPad (tablet)
- Desktop browser (Chrome, Safari, Firefox)

### Success Criteria:

#### Automated Verification:
- [ ] Type check passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:
- [ ] Alle sektioner fungerer perfekt på mobile (< 640px)
- [ ] Alle sektioner fungerer perfekt på tablet (640px - 1024px)
- [ ] Alle sektioner fungerer perfekt på desktop (> 1024px)
- [ ] Touch targets er min 44x44px
- [ ] Body text er min 16px på mobile
- [ ] Ingen horizontal scroll (unintended)
- [ ] Alt ser godt ud på alle breakpoints

**⚠️ PAUSE HERE** - Verificer responsive design før Phase 11

---

## Phase 11: Performance & Accessibility

### Overview

Optimerer performance (images, code splitting) og sikrer accessibility (semantic HTML, ARIA labels, keyboard navigation).

**Estimated Time:** 1 time

### Changes Required:

#### 1. Image Optimization
**Ensure:**
- Alle images bruger Next.js `Image` component
- Images har korrekt `width` og `height` attributes
- Images har `alt` text (eller `alt=""` hvis decorative)
- Images bruger `loading="lazy"` hvor relevant

#### 2. Semantic HTML
**Ensure:**
- H1-H6 headings bruges korrekt (hierarki)
- `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>` bruges korrekt
- Lists bruges korrekt (`<ul>`, `<ol>`, `<li>`)

#### 3. ARIA Labels
**Ensure:**
- Interactive elements har `aria-label` hvor nødvendigt
- Navigation har `aria-label="Main navigation"`
- Buttons har descriptive text eller `aria-label`

#### 4. Keyboard Navigation
**Ensure:**
- Alle interactive elements er keyboard accessible (Tab, Enter, Space)
- Focus states er synlige (Tailwind `focus:` classes)
- Skip links (optional, men god praksis)

#### 5. Lighthouse Audit
**Run:**
```bash
# Install Lighthouse CLI (hvis ikke allerede)
npm install -g lighthouse

# Run audit
lighthouse http://localhost:8000 --view
```

**Targets:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90 (optional)

### Success Criteria:

#### Automated Verification:
- [ ] Type check passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90

#### Manual Verification:
- [ ] Alle images loader korrekt med Next.js Image
- [ ] Semantic HTML bruges korrekt
- [ ] Keyboard navigation fungerer (Tab gennem alle interactive elements)
- [ ] Focus states er synlige
- [ ] Screen reader test (optional, men anbefalet)
- [ ] Alt fungerer som forventet

**⚠️ PAUSE HERE** - Verificer performance og accessibility før Phase 12

---

## Phase 12: Final Polish & Documentation

### Overview

Sidste polish (edge cases, error handling, cleanup) og dokumentation (README, kommentarer).

**Estimated Time:** 1 time

### Changes Required:

#### 1. Error Handling
**Ensure:**
- Komponenter håndterer missing data gracefully:
  - Hero: Fallback hvis `imageUrl` er tom (vis placeholder div med `bg-gray-light`)
  - Brand logos: Vis tom state hvis `brandLogos.length === 0` (eller skjul sektionen)
  - Step cards: Hvis `stepCards.length < 3`, vis de tilgængelige cards (ikke crash)
  - Product cards: Hvis `productCards.length < 2`, vis tilgængelige cards (eller placeholder)
- Fallback values for alle props (default props eller conditional rendering)
- Error boundaries (optional, men god praksis)
- Graceful degradation: Hvis JavaScript er disabled, Framer Motion animations skal ikke crashe (bruge CSS-only scroll fallback)

#### 2. Edge Cases
**Check:**
- **0 brand logos:** Skjul sektionen eller vis tom state message
- **1 product card:** Vis den ene card (center den eller brug full width)
- **0 step cards:** Skjul sektionen eller vis fallback message
- **< 3 step cards:** Vis de tilgængelige cards (ikke crash med grid)
- **Missing hero image:** Vis placeholder div med background color
- **Missing product box image:** Vis placeholder med background color
- **JavaScript disabled:** Framer Motion animations skal ikke crashe (bruge CSS-only horizontal scroll)
- **Very long text:** Tekst skal wrap korrekt, ikke overflow containers
- **Very small viewport (< 320px):** Sikre at layout ikke bryder

#### 3. Code Cleanup
**Ensure:**
- Fjern unused imports
- Fjern console.log statements
- Fjern commented-out code
- Consistent formatting (Prettier)

#### 4. Documentation
**Add:**
- README eller kommentarer i komponenter der forklarer props
- Kommentarer for komplekse logik (fx Framer Motion animation)
- JSDoc comments for exported functions/types

#### 5. Final Testing
**Run:**
- Full build: `npm run build`
- Type check: `npm run type-check`
- Lint: `npm run lint`
- Manual test på alle breakpoints
- Lighthouse audit

### Success Criteria:

#### Automated Verification:
- [ ] Type check passes: `npm run type-check`
- [ ] Lint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] Alle edge cases håndteret
- [ ] Error handling fungerer
- [ ] Code er clean (ingen unused imports, etc.)
- [ ] Dokumentation er tilstrækkelig
- [ ] Alt fungerer perfekt på alle breakpoints
- [ ] Lighthouse score > 90 (Performance, Accessibility)

**✅ COMPLETE** - Frontpage implementation er færdig!

---

## Testing Strategy

### Unit Tests (Optional, but Recommended)

**Komponenter at teste:**
- Hero component (renders korrekt med props)
- BrandLogos component (renders korrekt med logos array)
- WhySection component (renders korrekt med content)
- StepCards component (renders korrekt med cards array)
- ProductCards component (renders korrekt med cards array)

**Test Framework:**
- Jest + React Testing Library
- Test at komponenter render korrekt
- Test at props bliver brugt korrekt
- Test edge cases (empty arrays, missing props)

### Integration Tests (Optional)

**Test flows:**
- Homepage loads korrekt
- Alle sektioner vises i korrekt rækkefølge
- Navigation fungerer
- Mobile menu fungerer

### Manual Testing Checklist

**Desktop (> 1024px):**
- [ ] Alle sektioner vises korrekt
- [ ] Navigation fungerer
- [ ] Hover states fungerer
- [ ] Keyboard navigation fungerer
- [ ] Images loader korrekt

**Tablet (640px - 1024px):**
- [ ] Responsive layouts fungerer
- [ ] Touch targets er tilstrækkelige
- [ ] Tekst er læsbar
- [ ] Navigation fungerer

**Mobile (< 640px):**
- [ ] Hamburger menu fungerer
- [ ] Horizontal scroll fungerer (step cards)
- [ ] Touch targets er min 44x44px
- [ ] Tekst er min 16px
- [ ] Ingen horizontal scroll (unintended)

**Cross-Browser:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

**Accessibility:**
- [ ] Keyboard navigation fungerer
- [ ] Screen reader test (optional)
- [ ] Focus states er synlige
- [ ] ARIA labels er korrekte

**Performance:**
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] Page load time < 2 seconds
- [ ] Images loader optimized

---

## References

### Linear Issue
- **CORE-23:** https://linear.app/beauty-shop/issue/CORE-23/implement-beauty-shop-frontpage-from-figma-design

### Related Files
- Homepage: `beauty-shop-storefront/src/app/[countryCode]/(main)/page.tsx`
- Current hero: `beauty-shop-storefront/src/modules/home/components/hero/index.tsx`
- Navigation: `beauty-shop-storefront/src/modules/layout/templates/nav/index.tsx`
- Tailwind config: `beauty-shop-storefront/tailwind.config.js`
- Package.json: `beauty-shop-storefront/package.json`

### Documentation
- ShadCN UI: https://ui.shadcn.com/docs/installation/next
- Framer Motion: https://www.framer.com/motion/
- Next.js Image: https://nextjs.org/docs/app/api-reference/components/image
- Tailwind Responsive: https://tailwindcss.com/docs/responsive-design

### Design
- Figma: "guapo-webdesign" frame
- Desktop width: 1516px
- Design assets: Hero image, Product box image, Icons (SVG)

---

## Rollback Strategy

**Hvis implementation fejler:**

1. **Phase 1-2 (Setup):** 
   - Revert `components.json`, `tailwind.config.js`, `package.json` changes
   - Remove `src/lib/utils.ts` and `src/lib/types/homepage.ts`

2. **Phase 3-8 (Components):**
   - Keep ShadCN UI setup (kan være nyttigt senere)
   - Revert homepage til original state
   - Remove nye komponenter

3. **Phase 9-12 (Integration & Polish):**
   - Revert homepage integration
   - Keep komponenter (kan bruges senere)
   - Revert metadata changes

**Backup:**
- Commit før hver phase (git commit)
- Branch protection (ikke force push til main)

---

## Next Steps After Completion

1. **Review & Approve:**
   - Code review af alle ændringer
   - Design review (sammenlign med Figma)
   - Lighthouse audit review

2. **Deploy:**
   - Deploy til staging environment
   - Test på staging
   - Deploy til production

3. **Post-Implementation:**
   - Opdater Linear issue status til "Done"
   - Document learnings (hvad fungerede godt, hvad kunne forbedres)
   - Plan næste phase (CMS integration, product data integration, etc.)

---

**Plan Created:** 2025-11-06  
**Last Updated:** 2025-11-06  
**Status:** Ready for Implementation

