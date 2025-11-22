# Typography Audit Report

> Analyser af nuværende typography tokens og optimeringsforslag
> Dato: 2025-01-XX

## Current State Analysis

### Typography Tokens (15 unikke størrelser)

**Headings:**
1. **H1 (Hero):** 30px → 34px → 40px
   - Ratio: 1.13x → 1.18x (inkonsistent)
   - Progression: +4px → +6px

2. **H2 (Section):** 36px → 48px → 56px
   - Ratio: 1.33x → 1.17x (inkonsistent)
   - Progression: +12px → +8px

3. **H2 (CTA):** 36px → 44px → 52px
   - Ratio: 1.22x → 1.18x (inkonsistent)
   - Progression: +8px → +8px

4. **H3 (Card):** 24px → 26px
   - Ratio: 1.08x (meget lille forskel)
   - Progression: +2px

5. **H3 (Product):** 30px → 34px
   - Ratio: 1.13x
   - Progression: +4px

6. **Price:** 30px → 34px
   - **PROBLEM:** Identisk med H3 (Product)!

**Body:**
7. **Body Large:** 17px (kun mobile/tablet, ingen desktop variant)

**UI:**
8. **Button lg:** 15px (ingen responsive variant)
9. **Badge:** 11px (ingen responsive variant)

### Issues Identified 🔴

#### 1. For Mange Unikke Størrelser
- **15 unikke størrelser** (inkl. breakpoints)
- **Anbefalet:** 8-12 unikke størrelser
- **Problem:** Svært at huske og vedligeholde

#### 2. Inkonsistent Progression
- **H1:** +4px → +6px (inkonsistent)
- **H2 Section:** +12px → +8px (inkonsistent)
- **H2 CTA:** +8px → +8px (konsistent, men forskellig fra Section)
- **H3 Card:** +2px (meget lille forskel)
- **H3 Product:** +4px (forskellig fra Card)

**Anbefalet:** Konsistent ratio (1.2-1.5x) mellem alle niveauer

#### 3. Redundans
- **H3 (Product) og Price:** Begge 30px → 34px (identisk!)
- **H2 (Section) og H2 (CTA):** Tæt på hinanden (36px vs 36px mobile, 48px vs 44px tablet, 56px vs 52px desktop)
- **H3 (Card) og H3 (Product):** Kun 6px forskel (24px vs 30px mobile)

#### 4. Inkonsistent Responsive Scaling
- Nogle har 3 breakpoints (mobile, tablet, desktop)
- Nogle har 2 breakpoints (mobile, tablet)
- Nogle har 1 breakpoint (ingen scaling)

#### 5. Unødvendige Variationer
- **H2 (Section) vs H2 (CTA):** Forskellen er primært letter-spacing (uppercase), ikke størrelse
- **H3 (Card) vs H3 (Product):** Kun 6px forskel - er det nødvendigt?
- **Price vs H3 (Product):** Identisk - kan konsolideres

## Design Principles Violations

### ❌ Modular Scale Principle
- **Anbefalet:** Konsistent ratio (1.2-1.5x)
- **Nuværende:** Inkonsistent ratio (1.08x - 1.33x)
- **Impact:** Uforudsigelig scaling, svært at huske

### ❌ Simplicity Principle
- **Anbefalet:** 8-12 unikke størrelser
- **Nuværende:** 15 unikke størrelser
- **Impact:** For komplekst, svært at vedligeholde

### ❌ Consistency Principle
- **Anbefalet:** Samme størrelse for samme hierarki niveau
- **Nuværende:** Forskellige størrelser for samme niveau (H2 Section vs H2 CTA, H3 Card vs H3 Product)
- **Impact:** Inkonsistent visuel hierarki

### ❌ Clarity Principle
- **Anbefalet:** Minimum 20% forskel mellem niveauer
- **Nuværende:** H3 Card (24px) og H3 Product (30px) = kun 25% forskel, men bruges forskelligt
- **Impact:** Forvirrende for brugere

## Optimized Proposal

### Simplified Typography Scale (8 unikke størrelser)

**Baseret på 1.2x modular scale:**

```
Mobile → Tablet → Desktop

H1 (Hero):      30px → 36px → 44px  (1.2x ratio)
H2 (All):       36px → 44px → 52px  (1.2x ratio) - Konsolideret
H3 (All):       24px → 28px → 32px  (1.2x ratio) - Konsolideret
Price:          28px → 32px → 36px  (1.2x ratio) - Kan være H3 størrelse?
Body:           16px → 17px → 18px  (minimal scaling)
Body Large:     17px → 18px → 19px  (minimal scaling)
Button:         15px → 15px → 15px  (ingen scaling)
Badge:          11px → 11px → 11px  (ingen scaling)
```

### Consolidation Strategy

#### 1. Konsolider H2 Tokens
**Før:**
- `section-mobile`: 36px
- `cta-mobile`: 36px
- `section-tablet`: 48px
- `cta-tablet`: 44px
- `section-desktop`: 56px
- `cta-desktop`: 52px

**Efter:**
- `heading-2-mobile`: 36px
- `heading-2-tablet`: 44px
- `heading-2-desktop`: 52px

**Rationale:**
- Forskellen er primært styling (uppercase, letter-spacing), ikke størrelse
- Konsistent 1.2x ratio
- Simplificeret fra 6 tokens til 3

#### 2. Konsolider H3 Tokens
**Før:**
- `card-title-mobile`: 24px
- `card-title-tablet`: 26px
- `product-title-mobile`: 30px
- `product-title-tablet`: 34px

**Efter:**
- `heading-3-mobile`: 24px
- `heading-3-tablet`: 28px
- `heading-3-desktop`: 32px

**Rationale:**
- Kun 6px forskel mellem card og product (25%)
- Konsistent 1.2x ratio
- Simplificeret fra 4 tokens til 3

#### 3. Konsolider Price Token
**Før:**
- `price-mobile`: 30px
- `price-tablet`: 34px

**Efter:**
- Brug `heading-3-tablet` (28px) og `heading-3-desktop` (32px)
- Eller opret `price-mobile`: 28px, `price-tablet`: 32px, `price-desktop`: 36px

**Rationale:**
- Price er tæt på H3 størrelse
- Kan bruge H3 tokens eller have egen variant

#### 4. Standardiser H1
**Før:**
- `hero-mobile`: 30px
- `hero-tablet`: 34px
- `hero-desktop`: 40px

**Efter:**
- `heading-1-mobile`: 30px
- `heading-1-tablet`: 36px
- `heading-1-desktop`: 44px

**Rationale:**
- Konsistent 1.2x ratio
- Mere generisk navn (ikke specifik til hero)

### Final Optimized Scale

```js
fontSize: {
  // H1 (Hero, Main headings)
  'heading-1-mobile': ['30px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  'heading-1-tablet': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  'heading-1-desktop': ['44px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  
  // H2 (Section headings, CTA - styling forskel, ikke størrelse)
  'heading-2-mobile': ['36px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
  'heading-2-tablet': ['44px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
  'heading-2-desktop': ['52px', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
  
  // H3 (Card titles, Product titles)
  'heading-3-mobile': ['24px', { lineHeight: '1.2' }],
  'heading-3-tablet': ['28px', { lineHeight: '1.2' }],
  'heading-3-desktop': ['32px', { lineHeight: '1.2' }],
  
  // Price (kan bruge H3 eller egen variant)
  'price-mobile': ['28px', { lineHeight: '1', letterSpacing: '-0.01em' }],
  'price-tablet': ['32px', { lineHeight: '1', letterSpacing: '-0.01em' }],
  'price-desktop': ['36px', { lineHeight: '1', letterSpacing: '-0.01em' }],
  
  // Body
  'body-large': ['17px', { lineHeight: '1.6' }],
  
  // UI
  'button-lg': ['15px', { lineHeight: '1.5' }],
  'badge': ['11px', { lineHeight: '1' }],
}
```

**Total:** 13 tokens (inkl. alle breakpoints) vs 15 før
**Unikke størrelser:** 8 (30, 36, 44, 24, 28, 32, 17, 15, 11) vs 15 før

### Benefits

✅ **Konsistent ratio** - 1.2x mellem alle niveauer
✅ **Simplificeret** - Fra 15 til 8 unikke størrelser
✅ **Konsolideret** - H2 og H3 tokens er nu generiske
✅ **Forudsigelig** - Samme pattern for alle headings
✅ **Vedligeholdbart** - Let at forstå og opdatere

## Migration Plan

### Phase 1: Update Tailwind Config
1. Erstat nuværende tokens med optimerede tokens
2. Behold backward compatibility tokens (hero-mobile → heading-1-mobile alias)

### Phase 2: Update Components
1. Hero: `text-hero-*` → `text-heading-1-*`
2. Section H2: `text-section-*` → `text-heading-2-*`
3. CTA H2: `text-cta-*` → `text-heading-2-*` (samme token!)
4. Card H3: `text-card-title-*` → `text-heading-3-*`
5. Product H3: `text-product-title-*` → `text-heading-3-*`
6. Price: `text-price-*` → `text-price-*` (opdateret størrelser)

### Phase 3: Visual Testing
1. Test at hierarki ser korrekt ud
2. Verificer at forskelle mellem niveauer er tydelige
3. Test på mobile, tablet, desktop

## Recommendations

### 1. Konsolider H2 Tokens (High Priority)
- H2 (Section) og H2 (CTA) skal bruge samme tokens
- Forskellen er styling (uppercase, letter-spacing), ikke størrelse

### 2. Konsolider H3 Tokens (High Priority)
- H3 (Card) og H3 (Product) skal bruge samme tokens
- 6px forskel er ikke nok til at retfærdiggøre separate tokens

### 3. Standardiser Progression (High Priority)
- Brug konsistent 1.2x ratio for alle headings
- Mere forudsigelig og let at huske

### 4. Overvej Price Token (Medium Priority)
- Price kan bruge H3 tokens eller have egen variant
- 28px → 32px → 36px passer godt med H3 scale

### 5. Dokumenter Usage (Low Priority)
- Opdater design-standards.md med nye tokens
- Dokumenter hvornår hver token skal bruges

## Next Steps

1. ✅ **Færdig:** Audit gennemført
2. ⏳ **Næste:** Review optimeringsforslag
3. ⏳ **Næste:** Implementer optimerede tokens
4. ⏳ **Næste:** Migrer komponenter
5. ⏳ **Næste:** Test visuelt

