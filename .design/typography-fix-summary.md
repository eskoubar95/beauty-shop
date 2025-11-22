# Typography Fix - Summary

> Dato: 2025-01-XX
> Fix af tekststørrelser problemer

## Problemer Identificeret

### 1. Arbitrary Font Sizes Overalt 🔴
- 10+ forskellige arbitrary font sizes (`text-[34px]`, `text-[40px]`, etc.)
- Inkonsistent mellem komponenter
- Svært at vedligeholde

### 2. Blanding af Standard og Arbitrary 🟡
- Komponenter bruger både `text-3xl` og `text-[34px]` i samme chain
- Inkonsistent responsive progression

### 3. Custom Utility Classes Ignoreret 🟡
- Custom classes findes i `globals.css` men bruges ikke konsekvent
- Komponenter bruger direkte arbitrary sizes i stedet

## Løsning Implementeret

### 1. Typography Tokens Tilføjet ✅

Tilføjet til `tailwind.config.js`:

```js
fontSize: {
  // Hero H1
  'hero-mobile': ['30px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  'hero-tablet': ['34px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  'hero-desktop': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  
  // Section H2
  'section-mobile': ['36px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
  'section-tablet': ['48px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
  'section-desktop': ['56px', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
  
  // CTA H2 (uppercase)
  'cta-mobile': ['36px', { lineHeight: '1.1', letterSpacing: '0.08em' }],
  'cta-tablet': ['44px', { lineHeight: '1.1', letterSpacing: '0.08em' }],
  'cta-desktop': ['52px', { lineHeight: '1.1', letterSpacing: '0.08em' }],
  
  // Card H3 (step cards)
  'card-title-mobile': ['24px', { lineHeight: '1.2' }],
  'card-title-tablet': ['26px', { lineHeight: '1.2' }],
  
  // Product H3
  'product-title-mobile': ['30px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
  'product-title-tablet': ['34px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
  
  // Price
  'price-mobile': ['30px', { lineHeight: '1', letterSpacing: '-0.01em' }],
  'price-tablet': ['34px', { lineHeight: '1', letterSpacing: '-0.01em' }],
  
  // Body large
  'body-large': ['17px', { lineHeight: '1.6' }],
  
  // Button lg
  'button-lg': ['15px', { lineHeight: '1.5' }],
  
  // Badge
  'badge': ['11px', { lineHeight: '1' }],
}
```

### 2. Komponenter Opdateret ✅

**Hero:**
- Før: `text-3xl sm:text-[34px] lg:text-[40px]`
- Efter: `text-hero-mobile sm:text-hero-tablet lg:text-hero-desktop`

**Section H2:**
- Før: `text-4xl sm:text-5xl lg:text-[56px]`
- Efter: `text-section-mobile sm:text-section-tablet lg:text-section-desktop`

**CTA H2:**
- Før: `text-4xl sm:text-[44px] lg:text-[52px]`
- Efter: `text-cta-mobile sm:text-cta-tablet lg:text-cta-desktop`

**Card H3:**
- Før: `text-2xl sm:text-[26px]`
- Efter: `text-card-title-mobile sm:text-card-title-tablet`

**Product H3:**
- Før: `text-3xl sm:text-[34px]`
- Efter: `text-product-title-mobile sm:text-product-title-tablet`

**Price:**
- Før: `text-[30px] sm:text-[34px]`
- Efter: `text-price-mobile sm:text-price-tablet`

**Body large:**
- Før: `text-base sm:text-[17px]`
- Efter: `text-base sm:text-body-large`

**Button lg:**
- Før: `text-[15px]`
- Efter: `text-button-lg`

**Badge:**
- Før: `text-[11px]`
- Efter: `text-badge`

## Benefits

✅ **Konsistent hierarki** - Klar forskel mellem heading niveauer
✅ **Forudsigelig scaling** - Konsistent responsive progression
✅ **Centraliseret** - Alle størrelser i Tailwind config
✅ **Vedligeholdbart** - Opdater ét sted, påvirker alle
✅ **Type-safe** - TypeScript autocomplete for tokens
✅ **Dokumenteret** - Klar reference i design-standards.md

## Files Updated

1. `tailwind.config.js` - Typography tokens tilføjet
2. `src/modules/home/components/hero/index.tsx`
3. `src/modules/home/components/storytelling-section/index.tsx`
4. `src/modules/home/components/step-cards/step-card.tsx`
5. `src/modules/home/components/product-cards/product-card.tsx`
6. `src/modules/home/components/final-cta/index.tsx`
7. `src/modules/home/components/faq/index.tsx`
8. `src/modules/home/components/why-section/index.tsx`
9. `src/components/ui/button.tsx`
10. `src/modules/layout/components/mobile-cart-button.tsx`
11. `src/modules/layout/components/cart-dropdown/index.tsx`

## Next Steps

1. ✅ **Færdig:** Typography tokens implementeret
2. ✅ **Færdig:** Homepage komponenter opdateret
3. ⏳ **Næste:** Test visuelt at tekststørrelser ser korrekte ud
4. ⏳ **Næste:** Opdater design-standards.md med nye typography tokens
5. ⏳ **Næste:** Overvej at opdatere custom utility classes i globals.css til at bruge tokens

