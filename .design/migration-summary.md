# Design Consistency Fix - Migration Summary

> Dato: 2025-01-XX
> URL: http://localhost:8000/dk

## ✅ Færdige Opgaver

### Phase 1: Baseline Screenshots ✅
- Desktop full-page screenshot: `.design/screenshots/before/desktop-full-page.png`
- Mobile full-page screenshot: (skal tages hvis nødvendigt)

### Phase 2: Theme Configuration ✅

#### Shadow Tokens Tilføjet
Tilføjet til `tailwind.config.js`:
```js
boxShadow: {
  'hero': '0_28px_70px_rgba(5,21,55,0.18)',
  'product-card': '0_22px_60px_rgba(5,21,55,0.08)',
  'card': '0_15px_30px_-12px_rgba(0,0,0,0.1),0_4px_12px_-8px_rgba(0,0,0,0.1)',
  'menu': '0_20px_60px_rgba(5,21,55,0.18)',
  'dropdown': '0_24px_60px_rgba(5,21,55,0.1)',
}
```

**Note:** Color tokens var allerede implementeret fra tidligere (se `color-palette-final.md`).

### Phase 3: Component Updates ✅

#### Opdaterede Komponenter

**Homepage Components:**
1. **Hero** (`src/modules/home/components/hero/index.tsx`)
   - `text-[#08152D]` → `text-primary-darker`
   - `text-[#0B2142]/80` → `text-primary-light/80`
   - `shadow-[0_28px_70px_rgba(5,21,55,0.18)]` → `shadow-hero`
   - `sm:px-10` → `sm:px-8` (fix spacing off-scale)

2. **Step Cards** (`src/modules/home/components/step-cards/step-card.tsx`)
   - `bg-[#F2542D]` → `bg-accent` (ny accent: #f1433a)
   - `bg-[#051537]` → `bg-primary`
   - `text-[#051537]` → `text-primary`
   - `shadow-[0_15px_30px_-12px_rgba(0,0,0,0.1),0_4px_12px_-8px_rgba(0,0,0,0.1)]` → `shadow-card`

3. **Product Cards** (`src/modules/home/components/product-cards/product-card.tsx`)
   - `border-[#DFE3EC]` → `border-border`
   - `bg-[#F7F9FC]` → `bg-background-lighter`
   - `border-[#D5DAE5]` → `border-border-lighter`
   - `bg-[#E9EDF5]` → `bg-image-placeholder`
   - `bg-[#08152D]` → `bg-primary-darker` (badge)
   - `text-[#F2542D]` → `text-accent` (price emphasis)
   - `shadow-[0_22px_60px_rgba(5,21,55,0.08)]` → `shadow-product-card`
   - `sm:px-10` → fjernet (brug `px-8` konsistent)

4. **Storytelling Section** (`src/modules/home/components/storytelling-section/index.tsx`)
   - `border-[#D5DAE5]` → `border-border-lighter`
   - `bg-[#E9EDF5]` → `bg-image-placeholder`

**UI Components:**
5. **Button** (`src/components/ui/button.tsx`)
   - `border-[#08152D]` → `border-primary-darker`
   - `bg-[#08152D]` → `bg-primary-darker`
   - `text-[#08152D]` → `text-primary-darker`
   - `hover:bg-[#0B2142]` → `hover:bg-primary-light`
   - `focus-visible:outline-[#0B2142]` → `focus-visible:outline-primary-light`

6. **Card** (`src/components/ui/card.tsx`)
   - `shadow-[0_15px_30px_-12px_rgba(0,0,0,0.1),0_4px_12px_-8px_rgba(0,0,0,0.1)]` → `shadow-card`

**Layout Components:**
7. **Navigation** (`src/modules/layout/templates/nav/index.tsx`)
   - `text-[#0B2142]` → `text-primary-light`
   - `text-[#08152D]` → `text-primary-darker`
   - `hover:text-[#08152D]` → `hover:text-primary-darker`
   - `after:bg-[#D9D9D9]` → `after:bg-border`
   - `after:bg-[#F2542D]` → `after:bg-accent` (active state)
   - `border-[#E6E2DA]` → `border-border-light`
   - `bg-[#E6E2DA]` → `bg-border-light`

8. **Side Menu** (`src/modules/layout/components/side-menu/index.tsx`)
   - `text-[#0B2142]` → `text-primary-light`
   - `text-[#08152D]` → `text-primary-darker`
   - `hover:text-[#08152D]` → `hover:text-primary-darker`
   - `focus-visible:outline-[#0B2142]` → `focus-visible:outline-primary-light`
   - `shadow-[0_20px_60px_rgba(5,21,55,0.18)]` → `shadow-menu`

9. **Mobile Cart Button** (`src/modules/layout/components/mobile-cart-button.tsx`)
   - `text-[#0B2142]` → `text-primary-light`
   - `hover:text-[#08152D]` → `hover:text-primary-darker`
   - `bg-[#F2542D]` → `bg-accent` (badge)

10. **Cart Dropdown** (`src/modules/layout/components/cart-dropdown/index.tsx`)
    - `text-[#0B2142]` → `text-primary-light`
    - `hover:text-[#08152D]` → `hover:text-primary-darker`
    - `bg-[#F2542D]` → `bg-accent` (badge)
    - `shadow-[0_24px_60px_rgba(5,21,55,0.1)]` → `shadow-dropdown`

### Phase 4: Visual Verification ✅

**Screenshots:**
- Before: `.design/screenshots/before/desktop-full-page.png`
- After: `.design/screenshots/after/desktop-full-page.png`
- After Mobile: `.design/screenshots/after/mobile-full-page.png`

**Visual Changes:**
- ✅ Accent color opdateret fra `#F2542D` til `#f1433a` (mere rød-orange)
- ✅ Background colors opdateret (fra `#efeeec` til `#eef1f2` - mere neutral)
- ✅ Alle shadows tokenized
- ✅ Alle borders tokenized
- ✅ Spacing fixes (px-10 → px-8)

**Note:** Footer farve `#1E1E1C` er bevidst beholdt hardcoded da det er en specifik footer farve.

### Phase 5: Testing ✅

**Build Status:**
- ✅ Build successful
- ✅ No TypeScript errors
- ✅ No linting errors

## Statistik

**Files Updated:** 10
- Homepage components: 4
- UI components: 2
- Layout components: 4

**Hardcoded Values Replaced:**
- Colors: ~35+ instanser
- Shadows: 5 instanser
- Spacing fixes: 2 instanser

**Tokens Used:**
- Primary colors: `primary`, `primary-darker`, `primary-light`
- Accent: `accent` (#f1433a)
- Background: `background`, `background-lighter`
- Border: `border`, `border-light`, `border-lighter`
- Image: `image-placeholder`
- Shadows: `shadow-hero`, `shadow-product-card`, `shadow-card`, `shadow-menu`, `shadow-dropdown`

## Remaining Hardcoded Colors

**Intentionally Kept:**
- Footer background: `bg-[#1E1E1C]` - Specifik footer farve, ikke i palette

**Potentially Missed:**
- Tjek andre moduler hvis de bruger hardcoded colors

## Next Steps

1. ✅ **Færdig:** Color tokens implementeret
2. ✅ **Færdig:** Shadow tokens implementeret
3. ✅ **Færdig:** Komponenter opdateret
4. ✅ **Færdig:** Build verificeret
5. ⏳ **Næste:** Test visuelt på alle pages
6. ⏳ **Næste:** Verificer kontrast (WCAG compliance)
7. ⏳ **Næste:** Test på mobile og desktop
8. ⏳ **Næste:** Få feedback fra team

## Notes

- Accent color ændring fra `#F2542D` til `#f1433a` kan påvirke visuel identitet - test grundigt
- Background color ændring fra `#efeeec` til `#eef1f2` er subtil men kan påvirke overall følelse
- Alle ændringer følger godkendt palette fra `color-palette-final.md`
- Brutalistisk design stil bevares (rounded-none, hårde kanter)

