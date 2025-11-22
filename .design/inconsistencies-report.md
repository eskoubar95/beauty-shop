# Design Inconsistencies Report

> Genereret fra design audit af Beauty Shop homepage.
> Dato: 2025-01-XX
> URL: http://localhost:8000/dk

## Summary

**Total issues found:** 14
- 🔴 Critical: 2 (border radius er korrekt for brutalistisk design)
- 🟡 Medium: 7
- 🟢 Low: 5

## 🔴 Critical Issues

### 1. Border Radius - ✅ CORRECT FOR BRUTALIST DESIGN
**Location:** `beauty-shop-storefront/src/modules/home/components/step-cards/step-card.tsx:22`

**Status:** ✅ **NOT AN ISSUE** - Brutalistisk design benytter hårde kanter (`rounded-none`)

**Current:**
```tsx
className="... rounded-none ..."
```

**Design Rationale:**
Brutalistisk design karakteriseres af:
- Hårde, skarpe kanter (ingen border radius)
- Stærk kontrast
- Geometriske former
- Minimalistisk æstetik

**Note:** Andre cards bør også bruge `rounded-none` for konsistens med brutalistisk stil, ikke `rounded-lg`.

---

### 2. Hardcoded Hex Colors - Widespread Usage
**Status:** ✅ **TOKENS TILFØJET** - Se `tailwind.config.js` for komplet palette

**Locations:**
- `beauty-shop-storefront/src/modules/home/components/hero/index.tsx:30,33`
- `beauty-shop-storefront/src/modules/home/components/step-cards/step-card.tsx:16,17`
- `beauty-shop-storefront/src/modules/home/components/product-cards/product-card.tsx:65,66,70,95,135`
- `beauty-shop-storefront/src/modules/layout/templates/nav/index.tsx:29,34,55,66,74,81,92,95,125,130,140,143`
- `beauty-shop-storefront/src/components/ui/button.tsx:13,17`
- Og flere...

**Issue:**
33+ instanser af hardcoded hex colors (`bg-[#...]`, `text-[#...]`, `border-[#...]`) i stedet for theme tokens.

**Current:**
```tsx
text-[#08152D]
bg-[#F2542D]  // Skal opdateres til #f1433a
border-[#DFE3EC]
```

**Expected:**
```tsx
text-primary-darker
bg-accent
border-border-light
```

**Impact:** 
- Svært at vedligeholde farver
- Inkonsistens ved farveændringer
- Ingen centraliseret farve management

**Fix:**
1. ✅ **FÆRDIG:** Color tokens tilføjet til `tailwind.config.js` (se godkendt palette i `color-palette-final.md`)
2. ⏳ **NÆSTE:** Erstat alle hardcoded hex med tokens i komponenter
3. ⏳ **OPDATER:** Accent color fra `#F2542D` til `#f1433a` i alle komponenter

---

### 3. Shadow Duplication - Multiple Custom Shadows
**Locations:**
- `beauty-shop-storefront/src/modules/home/components/hero/index.tsx:29`
- `beauty-shop-storefront/src/modules/home/components/product-cards/product-card.tsx:65`
- `beauty-shop-storefront/src/modules/home/components/step-cards/step-card.tsx:23`
- `beauty-shop-storefront/src/components/ui/card.tsx:11`
- `beauty-shop-storefront/src/modules/layout/components/side-menu/index.tsx:81`

**Issue:**
Custom shadow strings gentages i flere komponenter i stedet for named tokens.

**Current:**
```tsx
shadow-[0_28px_70px_rgba(5,21,55,0.18)]
shadow-[0_22px_60px_rgba(5,21,55,0.08)]
shadow-[0_15px_30px_-12px_rgba(0,0,0,0.1),0_4px_12px_-8px_rgba(0,0,0,0.1)]
```

**Expected:**
```tsx
shadow-hero
shadow-product-card
shadow-card
```

**Impact:** 
- Svært at vedligeholde shadows
- Risiko for inkonsistens ved ændringer

**Fix:**
1. Tilføj shadow tokens til `tailwind.config.js`:
```js
boxShadow: {
  'hero': '0_28px_70px_rgba(5,21,55,0.18)',
  'product-card': '0_22px_60px_rgba(5,21,55,0.08)',
  'card': '0_15px_30px_-12px_rgba(0,0,0,0.1),0_4px_12px_-8px_rgba(0,0,0,0.1)',
  'menu': '0_20px_60px_rgba(5,21,55,0.18)',
  'dropdown': '0_24px_60px_rgba(5,21,55,0.1)',
}
```

2. Erstat alle custom shadows med tokens.

---

## 🟡 Medium Issues

### 4. Spacing Off-Scale - Hero Padding
**Location:** `beauty-shop-storefront/src/modules/home/components/hero/index.tsx:28`

**Issue:**
Hero bruger `sm:px-10` (40px) som ikke er et 8px multiple.

**Current:**
```tsx
px-4 sm:px-10 lg:px-16
```

**Expected:**
```tsx
px-4 sm:px-8 lg:px-16
```

**Impact:** Bryder 8px spacing scale konsistens.

**Fix:**
```tsx
<div className="relative mx-auto flex h-full w-full max-w-[1440px] items-end justify-start px-4 pb-0 sm:px-8 sm:pb-10 lg:px-16 lg:pb-14">
```

---

### 5. Spacing Off-Scale - Product Card Padding
**Location:** `beauty-shop-storefront/src/modules/home/components/product-cards/product-card.tsx:69,88`

**Issue:**
Product cards bruger `sm:px-10` (40px) som ikke er et 8px multiple.

**Current:**
```tsx
px-8 pt-8 sm:px-10 sm:pt-10
px-8 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8
```

**Expected:**
```tsx
px-8 pt-8 sm:pt-10
px-8 pb-8 pt-6 sm:pb-10 sm:pt-8
```

**Impact:** Bryder 8px spacing scale konsistens.

**Fix:**
Fjern `sm:px-10` og brug `px-8` konsistent.

---

### 6. Spacing Off-Scale - Gaps
**Locations:**
- `beauty-shop-storefront/src/modules/home/components/storytelling-section/index.tsx:38,47`
- `beauty-shop-storefront/src/modules/home/components/product-cards/product-card.tsx:103,112,127`

**Issue:**
Bruger `gap-5` (20px) som ikke er et 8px multiple.

**Current:**
```tsx
gap-5
```

**Expected:**
```tsx
gap-4  // eller gap-6
```

**Impact:** Bryder 8px spacing scale konsistens.

**Fix:**
Erstat alle `gap-5` med `gap-4` eller `gap-6` baseret på visuel balance.

---

### 7. Typography - Inconsistent H3 Sizes
**Locations:**
- `beauty-shop-storefront/src/modules/home/components/step-cards/step-card.tsx:42`
- `beauty-shop-storefront/src/modules/home/components/product-cards/product-card.tsx:91`

**Issue:**
Step cards bruger `text-2xl sm:text-[26px]` mens product cards bruger `text-3xl sm:text-[34px]`.

**Current:**
- Step cards: `text-2xl sm:text-[26px]`
- Product cards: `text-3xl sm:text-[34px]`

**Expected:**
Standardiser til én størrelse baseret på hierarki:
- Step cards (sub-headings): `text-2xl sm:text-[26px]` ✅
- Product cards (titles): `text-3xl sm:text-[34px]` ✅

**Impact:** Faktisk OK hvis det er intentionel hierarki forskel, men bør dokumenteres.

**Fix:**
Dokumenter at step card titles er sub-headings og product card titles er hoved-titles.

---

### 8. Hero Box Padding - Inconsistent Scale
**Location:** `beauty-shop-storefront/src/modules/home/components/hero/index.tsx:29`

**Issue:**
Hero box bruger `p-7 sm:p-9 lg:p-12` (28px/36px/48px) som ikke følger standard 8px scale.

**Current:**
```tsx
p-7 sm:p-9 lg:p-12
```

**Expected:**
```tsx
p-6 sm:p-8 lg:p-12  // eller p-8 sm:p-10 lg:p-12
```

**Impact:** Bryder 8px spacing scale, men kan være intentionel for hero emphasis.

**Fix:**
Overvej at ændre til `p-8 sm:p-10 lg:p-12` (32px/40px/48px) eller dokumenter som exception.

---

### 9. Step Card Padding - Inconsistent Scale
**Location:** `beauty-shop-storefront/src/modules/home/components/step-cards/step-card.tsx:29,37`

**Issue:**
Step card header bruger `py-5 sm:py-7` (20px/28px) og content bruger `py-14 sm:py-16` (56px/64px).

**Current:**
```tsx
px-8 py-5 text-left ... sm:py-7
px-8 py-14 text-left sm:py-16
```

**Expected:**
```tsx
px-8 py-4 text-left ... sm:py-6  // eller py-6 sm:py-8
px-8 py-12 text-left sm:py-16    // eller py-16 sm:py-16
```

**Impact:** `py-5` og `py-14` er ikke 8px multiples.

**Fix:**
Ændre til `py-4 sm:py-6` (header) og `py-12 sm:py-16` (content).

---

### 10. Why Section - Missing Responsive Padding
**Location:** `beauty-shop-storefront/src/modules/home/components/why-section/index.tsx:16,18`

**Issue:**
Why section bruger `py-20` (80px) uden responsive variant, og `lg:px-0` fjerner padding på desktop.

**Current:**
```tsx
className="... bg-background py-20"
className="... px-4 sm:px-8 lg:px-0"
```

**Expected:**
```tsx
className="... bg-background py-16 sm:py-20 lg:py-24"
className="... px-4 sm:px-8 lg:px-16"
```

**Impact:** Inkonsistent med andre sections.

**Fix:**
Tilføj responsive padding pattern som andre sections.

---

## 🟢 Low Priority Issues

### 11. Image Placeholder Text - Hardcoded
**Locations:**
- `beauty-shop-storefront/src/modules/home/components/product-cards/product-card.tsx:82`
- `beauty-shop-storefront/src/modules/home/components/storytelling-section/index.tsx:84`
- `beauty-shop-storefront/src/modules/home/components/why-section/index.tsx:30`

**Issue:**
"Billede på vej" er hardcoded i flere komponenter.

**Current:**
```tsx
Billede på vej
```

**Expected:**
```tsx
// Extract to constant or i18n
const PLACEHOLDER_TEXT = "Billede på vej"
```

**Impact:** Svært at ændre eller oversætte.

**Fix:**
Opret shared constant eller i18n string.

---

### 12. Tracking Values - Multiple Similar Values
**Locations:**
Flere komponenter bruger lignende men ikke identiske tracking values.

**Issue:**
- `tracking-[0.22em]` (kickers, badges)
- `tracking-[0.2em]` (buttons, price labels)
- `tracking-[0.18em]` (feature labels)
- `tracking-[0.28em]` (step card headers)

**Impact:** Kan standardiseres til færre værdier.

**Fix:**
Overvej at reducere til 2-3 standard tracking values:
- `tracking-[0.2em]` - Standard uppercase
- `tracking-[0.18em]` - Tighter for labels
- `tracking-[0.28em]` - Wider for headers (behold)

---

### 13. Custom Font Sizes - Arbitrary Values
**Locations:**
Flere komponenter bruger arbitrary font sizes i stedet for standard Tailwind scale.

**Issue:**
- `text-[34px]` (H1, H3)
- `text-[40px]` (H1)
- `text-[44px]` (H2 CTA)
- `text-[52px]` (H2 CTA)
- `text-[56px]` (H2)
- `text-[26px]` (H3 step cards)
- `text-[17px]` (body)
- `text-[30px]` (price)
- `text-[34px]` (price)

**Impact:** Svært at vedligeholde og kan føre til inkonsistens.

**Fix:**
Overvej at tilføje custom font sizes til Tailwind config:
```js
fontSize: {
  // ... existing
  'hero-mobile': ['30px', { lineHeight: 'tight', letterSpacing: '-0.02em' }],
  'hero-tablet': ['34px', { lineHeight: 'tight', letterSpacing: '-0.02em' }],
  'hero-desktop': ['40px', { lineHeight: 'tight', letterSpacing: '-0.02em' }],
  // etc.
}
```

---

### 14. Border Colors - Multiple Similar Grays
**Locations:**
Flere komponenter bruger lignende men ikke identiske border colors.

**Issue:**
- `border-[#DFE3EC]` (product cards)
- `border-[#D5DAE5]` (image containers)
- `border-[#E6E2DA]` (navigation)
- `border-[#D9D9D9]` (navigation underlines)

**Impact:** Kan standardiseres til færre border color tokens.

**Fix:**
Tilføj border color tokens til Tailwind config og erstat hardcoded values.

---

### 15. Hover Transform - Inconsistent Values
**Locations:**
- `beauty-shop-storefront/src/components/ui/button.tsx:13,17`
- `beauty-shop-storefront/src/modules/home/components/product-cards/product-card.tsx:65`

**Issue:**
Buttons bruger `hover:-translate-y-0.5` (2px) mens product cards bruger `hover:-translate-y-1` (4px).

**Current:**
- Buttons: `hover:-translate-y-0.5`
- Product cards: `hover:-translate-y-1`

**Impact:** Faktisk OK hvis det er intentionel (cards skal "lifte" mere), men bør dokumenteres.

**Fix:**
Dokumenter hover transform scale:
- Small elements (buttons): `-translate-y-0.5` (2px)
- Large elements (cards): `-translate-y-1` (4px)

---

## Recommendations

### Priority Order for Fixes

1. **Critical (Do First):**
   - Extract hardcoded colors til theme tokens
   - Extract custom shadows til named tokens
   - **Note:** Border radius er korrekt for brutalistisk design (rounded-none)

2. **Medium (Do Next):**
   - Fix spacing off-scale issues (px-10, gap-5, py-5, py-14)
   - Standardiser Why section padding pattern
   - Dokumenter intentionelle forskelle (H3 sizes, hover transforms)

3. **Low (Nice to Have):**
   - Extract placeholder text til constant
   - Standardiser tracking values
   - Tilføj custom font sizes til Tailwind config
   - Standardiser border colors

### Next Steps

1. Kør `/design-consistency-fix` command for at automatisk fixe issues
2. Review og godkend ændringer
3. Opdater `.design-standards.md` med nye tokens
4. Test visuelt efter fixes

