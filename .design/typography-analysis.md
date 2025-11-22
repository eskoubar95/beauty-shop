# Typography Analysis - Tekststørrelser Problemer

> Analyse af tekststørrelser og identificering af problemer
> Dato: 2025-01-XX

## Problemer Identificeret

### 1. Arbitrary Font Sizes Overalt 🔴

**Problem:** Mange komponenter bruger arbitrary font sizes (`text-[34px]`, `text-[40px]`, etc.) i stedet for standard Tailwind scale eller named tokens.

**Eksempler:**
- `text-[34px]` - Brugt i H1 (tablet), H3 (product cards), price
- `text-[40px]` - Brugt i H1 (desktop)
- `text-[56px]` - Brugt i H2 (desktop)
- `text-[26px]` - Brugt i H3 (step cards, tablet)
- `text-[17px]` - Brugt i body text (hero)
- `text-[30px]` - Brugt i price
- `text-[44px]` - Brugt i H2 CTA (tablet)
- `text-[52px]` - Brugt i H2 CTA (desktop)
- `text-[15px]` - Brugt i buttons (lg size)
- `text-[11px]` - Brugt i badges

**Impact:**
- Svært at vedligeholde
- Inkonsistens mellem komponenter
- Ingen centraliseret typography system
- Svært at opdatere globalt

### 2. Blanding af Standard og Arbitrary Sizes 🔴

**Problem:** Komponenter bruger både Tailwind standard sizes (`text-3xl`) og arbitrary sizes (`text-[34px]`) i samme responsive chain.

**Eksempel:**
```tsx
// Hero H1
className="text-3xl ... sm:text-[34px] lg:text-[40px]"
// Mixer text-3xl (30px) med arbitrary 34px og 40px
```

**Impact:**
- Inkonsistent progression
- Uforudsigelig scaling
- Svært at forstå hierarki

### 3. Custom Utility Classes vs Direct Classes 🟡

**Problem:** Der findes custom utility classes i `globals.css` (f.eks. `text-large-regular`) men de bruges ikke konsekvent. I stedet bruges direkte Tailwind classes eller arbitrary sizes.

**Custom Classes Eksisterende:**
- `text-xsmall-regular` (10px)
- `text-small-regular` (12px)
- `text-base-regular` (14px)
- `text-large-regular` (16px)
- `text-xl-regular` (24px)
- `text-2xl-regular` (30px)
- `text-3xl-regular` (32px)

**Men bruges ikke i homepage komponenter!**

### 4. Inkonsistent Hierarki 🟡

**Problem:** Forskellige komponenter bruger forskellige størrelser for samme hierarki niveau.

**Eksempler:**
- **H3 i step cards:** `text-2xl sm:text-[26px]` (24px/26px)
- **H3 i product cards:** `text-3xl sm:text-[34px]` (30px/34px)
- **Price i product cards:** `text-[30px] sm:text-[34px]` (30px/34px)

**Impact:**
- Inkonsistent visuel hierarki
- Forvirrende for brugere
- Svært at vedligeholde

### 5. Responsive Progression Problemer 🟡

**Problem:** Responsive font size progression er ikke konsistent eller forudsigelig.

**Eksempler:**
- Hero H1: `text-3xl` (30px) → `sm:text-[34px]` (34px) → `lg:text-[40px]` (40px)
  - Progression: +4px, +6px (ikke konsistent)
- H2 Section: `text-4xl` (36px) → `sm:text-5xl` (48px) → `lg:text-[56px]` (56px)
  - Progression: +12px, +8px (ikke konsistent)
- H2 CTA: `text-4xl` (36px) → `sm:text-[44px]` (44px) → `lg:text-[52px]` (52px)
  - Progression: +8px, +8px (konsistent, men arbitrary)

## Nuværende Typography System

### Custom Utility Classes (globals.css)
```css
.text-xsmall-regular { text-[10px] leading-4 font-normal; }
.text-small-regular { text-xs leading-5 font-normal; }
.text-small-semi { text-xs leading-5 font-semibold; }
.text-base-regular { text-sm leading-6 font-normal; }
.text-base-semi { text-sm leading-6 font-semibold; }
.text-large-regular { text-base leading-6 font-normal; }
.text-large-semi { text-base leading-6 font-semibold; }
.text-xl-regular { text-2xl leading-[36px] font-normal; }
.text-xl-semi { text-2xl leading-[36px] font-semibold; }
.text-2xl-regular { text-[30px] leading-[48px] font-normal; }
.text-2xl-semi { text-[30px] leading-[48px] font-semibold; }
.text-3xl-regular { text-[32px] leading-[44px] font-normal; }
.text-3xl-semi { text-[32px] leading-[44px] font-semibold; }
```

**Problem:** Disse classes bruges ikke konsekvent i homepage komponenter.

### Arbitrary Sizes i Komponenter
- `text-[11px]` - Badges
- `text-[15px]` - Button lg
- `text-[17px]` - Hero body
- `text-[26px]` - Step card H3
- `text-[30px]` - Price
- `text-[34px]` - H1 tablet, H3 product cards, Price
- `text-[40px]` - H1 desktop
- `text-[44px]` - H2 CTA tablet
- `text-[52px]` - H2 CTA desktop
- `text-[56px]` - H2 desktop

## Anbefalet Løsning

### Option A: Standardiser til Tailwind Config Tokens (Anbefalet)

Tilføj custom font sizes til `tailwind.config.js` med konsistent responsive progression:

```js
fontSize: {
  // Existing
  '3xl': '2rem',
  
  // Hero H1
  'hero-mobile': ['30px', { lineHeight: 'tight', letterSpacing: '-0.02em' }],
  'hero-tablet': ['34px', { lineHeight: 'tight', letterSpacing: '-0.02em' }],
  'hero-desktop': ['40px', { lineHeight: 'tight', letterSpacing: '-0.02em' }],
  
  // Section H2
  'section-mobile': ['36px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
  'section-tablet': ['48px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
  'section-desktop': ['56px', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
  
  // CTA H2 (uppercase)
  'cta-mobile': ['36px', { lineHeight: '1.1', letterSpacing: '0.08em' }],
  'cta-tablet': ['44px', { lineHeight: '1.1', letterSpacing: '0.08em' }],
  'cta-desktop': ['52px', { lineHeight: '1.1', letterSpacing: '0.08em' }],
  
  // Card H3
  'card-title-mobile': ['24px', { lineHeight: 'tight' }],
  'card-title-tablet': ['26px', { lineHeight: 'tight' }],
  'card-title-desktop': ['26px', { lineHeight: 'tight' }],
  
  // Product Card H3
  'product-title-mobile': ['30px', { lineHeight: 'tight', letterSpacing: 'tight' }],
  'product-title-tablet': ['34px', { lineHeight: 'tight', letterSpacing: 'tight' }],
  'product-title-desktop': ['34px', { lineHeight: 'tight', letterSpacing: 'tight' }],
  
  // Price
  'price-mobile': ['30px', { lineHeight: 'tight', letterSpacing: 'tight' }],
  'price-tablet': ['34px', { lineHeight: 'tight', letterSpacing: 'tight' }],
  'price-desktop': ['34px', { lineHeight: 'tight', letterSpacing: 'tight' }],
  
  // Body large
  'body-large': ['17px', { lineHeight: 'relaxed' }],
  
  // Button lg
  'button-lg': ['15px', { lineHeight: 'normal' }],
  
  // Badge
  'badge': ['11px', { lineHeight: 'none' }],
}
```

**Usage:**
```tsx
// Før
<h1 className="text-3xl sm:text-[34px] lg:text-[40px]">

// Efter
<h1 className="text-hero-mobile sm:text-hero-tablet lg:text-hero-desktop">
```

### Option B: Forbedre Custom Utility Classes

Opdater `globals.css` utility classes til at matche alle behov og brug dem konsekvent.

### Option C: Hybrid Approach (Anbefalet)

1. Tilføj custom font sizes til Tailwind config for headings og special cases
2. Brug standard Tailwind scale for body text
3. Opdater custom utility classes til at matche nye tokens
4. Migrer komponenter gradvist

## Problemer med Nuværende System

### 1. Inkonsistent Responsive Progression
- Nogle bruger: `text-3xl sm:text-[34px] lg:text-[40px]`
- Andre bruger: `text-4xl sm:text-5xl lg:text-[56px]`
- Ingen klar pattern

### 2. Arbitrary Values Overalt
- 10+ forskellige arbitrary font sizes
- Svært at huske og vedligeholde
- Ingen dokumentation

### 3. Custom Classes Ignoreret
- Custom utility classes findes men bruges ikke
- Komponenter bruger direkte arbitrary sizes i stedet

### 4. Hierarki Problemer
- Step card H3: 24px/26px
- Product card H3: 30px/34px
- Price: 30px/34px
- Ingen klar forskel mellem dem

## Anbefalet Typography Scale

### Headings

**H1 (Hero):**
- Mobile: 30px (`text-hero-mobile`)
- Tablet: 34px (`text-hero-tablet`)
- Desktop: 40px (`text-hero-desktop`)

**H2 (Section):**
- Mobile: 36px (`text-section-mobile`)
- Tablet: 48px (`text-section-tablet`)
- Desktop: 56px (`text-section-desktop`)

**H2 (CTA - uppercase):**
- Mobile: 36px (`text-cta-mobile`)
- Tablet: 44px (`text-cta-tablet`)
- Desktop: 52px (`text-cta-desktop`)

**H3 (Card titles):**
- Mobile: 24px (`text-card-title-mobile`)
- Tablet: 26px (`text-card-title-tablet`)
- Desktop: 26px (`text-card-title-desktop`)

**H3 (Product titles):**
- Mobile: 30px (`text-product-title-mobile`)
- Tablet: 34px (`text-product-title-tablet`)
- Desktop: 34px (`text-product-title-desktop`)

### Body Text

**Standard:**
- `text-base` (16px) - Standard body
- `text-body-large` (17px) - Large body (hero)

**Small:**
- `text-sm` (14px) - Small text
- `text-xs` (12px) - Extra small

### Special

**Price:**
- Mobile: 30px (`text-price-mobile`)
- Tablet: 34px (`text-price-tablet`)
- Desktop: 34px (`text-price-desktop`)

**Button lg:**
- `text-button-lg` (15px)

**Badge:**
- `text-badge` (11px)

## Implementation Plan

### Fase 1: Tilføj Tokens til Tailwind Config
1. Tilføj alle custom font sizes til `tailwind.config.js`
2. Inkluder line-height og letter-spacing i tokens
3. Test at Tailwind compilerer korrekt

### Fase 2: Opdater Komponenter
1. Hero: `text-hero-mobile sm:text-hero-tablet lg:text-hero-desktop`
2. Section H2: `text-section-mobile sm:text-section-tablet lg:text-section-desktop`
3. CTA H2: `text-cta-mobile sm:text-cta-tablet lg:text-cta-desktop`
4. Card H3: `text-card-title-mobile sm:text-card-title-tablet`
5. Product H3: `text-product-title-mobile sm:text-product-title-tablet`
6. Price: `text-price-mobile sm:text-price-tablet`
7. Body large: `text-body-large`
8. Button lg: `text-button-lg`
9. Badge: `text-badge`

### Fase 3: Opdater Custom Utility Classes
1. Opdater `globals.css` utility classes til at bruge nye tokens
2. Eller fjern dem hvis de ikke bruges

### Fase 4: Dokumenter
1. Opdater `design-standards.md` med nye typography tokens
2. Dokumenter usage patterns
3. Opret migration guide

## Benefits

✅ **Konsistent hierarki** - Klar forskel mellem heading niveauer
✅ **Forudsigelig scaling** - Konsistent responsive progression
✅ **Centraliseret** - Alle størrelser i Tailwind config
✅ **Vedligeholdbart** - Opdater ét sted, påvirker alle
✅ **Dokumenteret** - Klar reference i design-standards.md
✅ **Type-safe** - TypeScript autocomplete for tokens

## Næste Skridt

1. Review denne analyse
2. Beslut approach (Option A, B, eller C)
3. Implementer tokens i Tailwind config
4. Migrer komponenter
5. Test visuelt
6. Opdater dokumentation

