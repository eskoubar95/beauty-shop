# Typography Visual Analysis Results

> Analyser baseret på faktisk visuel inspektion og design principper
> Dato: 2025-01-XX

## Analysis Method

Baseret på:
1. Visuel inspektion af forsiden
2. Nuværende typography tokens i Tailwind config
3. Design principper (WCAG, modular scale, hierarchy)
4. Faktisk brug i komponenter

## Current Typography Tokens

### Headings

**H1 (Hero):**
- Mobile: 30px
- Tablet: 36px  
- Desktop: 44px
- **Ratio:** 1.2x konsistent ✅

**H2 (Section):**
- Mobile: 36px
- Tablet: 44px
- Desktop: 52px
- **Ratio:** 1.2x konsistent ✅

**H3 (All):**
- Mobile: 24px
- Tablet: 28px
- Desktop: 32px
- **Ratio:** 1.2x konsistent ✅

**Price:**
- Mobile: 28px
- Tablet: 32px
- Desktop: 36px
- **Ratio:** 1.2x konsistent ✅

### Body & UI

**Body Large:** 17px
**Button lg:** 15px
**Badge:** 11px

## Visual Analysis Findings

### ✅ Strengths

1. **Konsistent modular scale** - 1.2x ratio for alle headings
2. **Klar hierarki** - H1 (30-44px) > H2 (36-52px) > H3 (24-32px)
3. **Tokenized** - Alle størrelser er i Tailwind config
4. **Responsive** - Alle headings har mobile/tablet/desktop variants

### ⚠️ Potential Issues

1. **H2 og H3 er tæt på hinanden**
   - H2 mobile: 36px
   - H3 desktop: 32px
   - **Forskel:** Kun 4px (11%) - kan være for lille
   - **Anbefaling:** Overvej at øge H2 eller reducere H3 gap

2. **Body Large (17px) er tæt på standard (16px)**
   - **Forskel:** Kun 1px (6%) - måske unødvendig
   - **Anbefaling:** Overvej at konsolidere til 16px eller øge til 18px

3. **Badge (11px) er meget lille**
   - **WCAG concern:** < 14px kan være svært at læse
   - **Anbefaling:** Overvej at øge til 12px minimum

4. **Price størrelse (28-36px)**
   - Price mobile (28px) er større end H3 mobile (24px)
   - **Rationale:** Price skal være prominent, men kan være forvirrende
   - **Anbefaling:** Overvej at justere price til at matche H3 eller have egen klar størrelse

## Optimizations Proposed

### Option 1: Increase H2/H3 Gap (Recommended)

**Problem:** H2 og H3 er for tæt på hinanden

**Solution:**
- H2: 36px → 44px → 52px (behold)
- H3: 24px → 28px → 32px → **Opdater til:** 20px → 24px → 28px
- **Gap:** 16px → 20px → 24px (bedre forskel)

**Benefits:**
- Klarere hierarki
- Bedre visuel separation
- Stadig konsistent 1.2x ratio

### Option 2: Adjust Price Size

**Problem:** Price (28-36px) er større end H3 (24-32px)

**Solution A:** Match H3
- Price: 24px → 28px → 32px (samme som H3)

**Solution B:** Keep prominent but adjust
- Price: 26px → 30px → 34px (mellem H3 og H2)

### Option 3: Increase Small Text

**Problem:** Badge (11px) og Button (15px) kan være for små

**Solution:**
- Badge: 11px → 12px (WCAG minimum)
- Button lg: 15px → 16px (standard body size)

### Option 4: Consolidate Body Sizes

**Problem:** Body (16px) og Body Large (17px) er for tæt

**Solution:**
- Body: 16px (behold)
- Body Large: 17px → 18px (klarere forskel)

## Recommended Optimizations

### Priority 1: Increase H2/H3 Gap
```js
// H3 opdateret for bedre separation
'heading-3-mobile': ['20px', { lineHeight: '1.2' }],
'heading-3-tablet': ['24px', { lineHeight: '1.2' }],
'heading-3-desktop': ['28px', { lineHeight: '1.2' }],
```

**Impact:** Klarere hierarki, bedre læsbarhed

### Priority 2: Adjust Price Size
```js
// Price matcher H3 eller har egen størrelse
'price-mobile': ['24px', { lineHeight: '1', letterSpacing: '-0.01em' }],
'price-tablet': ['28px', { lineHeight: '1', letterSpacing: '-0.01em' }],
'price-desktop': ['32px', { lineHeight: '1', letterSpacing: '-0.01em' }],
```

**Impact:** Konsistent med H3, eller egen klar størrelse

### Priority 3: Increase Small Text
```js
// WCAG compliance
'badge': ['12px', { lineHeight: '1' }], // Fra 11px
'button-lg': ['16px', { lineHeight: '1.5' }], // Fra 15px
```

**Impact:** Bedre læsbarhed, WCAG compliance

### Priority 4: Body Large Adjustment
```js
// Klarere forskel fra standard body
'body-large': ['18px', { lineHeight: '1.6' }], // Fra 17px
```

**Impact:** Klarere forskel, bedre hierarki

## Implementation Plan

1. **Review optimizations** - Vælg hvilke optimeringer der skal implementeres
2. **Update Tailwind config** - Opdater tokens
3. **Update components** - Opdater komponenter hvis nødvendigt
4. **Visual test** - Test at hierarki ser godt ud
5. **Document** - Opdater design-standards.md

## Next Steps

1. ⏳ **Review:** Gennemgå optimeringsforslag
2. ⏳ **Decide:** Vælg hvilke optimeringer der skal implementeres
3. ⏳ **Implement:** Opdater tokens og komponenter
4. ⏳ **Test:** Verificer visuelt

