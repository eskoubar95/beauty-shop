# CORE-23: MedusaJS Integration Analysis

**Date:** 2025-11-06  
**Issue:** CORE-23 - Implement Beauty Shop Frontpage  
**Status:** ⚠️ Needs Clarification Before Phase 3

---

## Problem Identified

**Vi skal opdatere navigation i Phase 3, men der er vigtige integrationer med MedusaJS der skal bevares:**

### Nuværende Navigation Integration:

1. **CartButton Component:**
   - Async server component (`async function CartButton()`)
   - Fetcher cart data via `retrieveCart()` fra `@lib/data/cart`
   - Bruger MedusaJS SDK: `sdk.client.fetch('/store/carts/${id}')`
   - Returnerer `<CartDropdown cart={cart} />` som client component

2. **CartDropdown Component:**
   - Client component ("use client")
   - Bruger HeadlessUI Popover (ikke ShadCN eller MedusaJS UI primitives)
   - Bruger MedusaJS UI Button: `import { Button } from "@medusajs/ui"`
   - Viser cart items, subtotal, "Go to cart" button
   - Har kompleks state management (auto-open/close, timers)

3. **Navigation Styling:**
   - Bruger MedusaJS UI preset classes: `text-ui-fg-base`, `text-ui-fg-subtle`, `border-ui-border-base`
   - Disse kommer fra `@medusajs/ui-preset` i `tailwind.config.js`
   - `content-container` class fra globals.css

4. **SideMenu Component:**
   - Bruger HeadlessUI Popover
   - Bruger MedusaJS UI components: `Text`, `clx`, `useToggleState` fra `@medusajs/ui`
   - Bruger MedusaJS Icons: `ArrowRightMini`, `XMark`

---

## Plan vs. Reality Conflict

### Plan siger (Phase 3):
> "Brug ShadCN UI komponenter (Button, etc.) i stedet for MedusaJS UI"

### Realitet:
- CartButton og CartDropdown er **kritiske e-commerce funktionaliteter**
- De integrerer direkte med MedusaJS backend
- De bruger MedusaJS types (`HttpTypes.StoreCart`)
- De har kompleks state management og user interaction

### Risiko:
Hvis vi erstatter MedusaJS UI komponenter helt:
- ❌ CartButton kan stoppe med at virke
- ❌ CartDropdown kan miste styling/konsistens
- ❌ Type safety kan blive brudt
- ❌ Eksisterende tests kan fejle

---

## Recommended Approach

### Option 1: Hybrid Approach (RECOMMENDED)

**Bevar MedusaJS funktionalitet, opdater visuel styling:**

1. **Navigation Structure:**
   - Opdater logo tekst: "Medusa Store" → "GUAPO"
   - Tilføj nye menu links: "Hudpleje box", "Om GUAPO", "Kontakt"
   - Tilføj User icon (højre side)
   - Opdater styling til at matche Figma design
   - **BEVAR CartButton som den er** (kun visuel styling hvis nødvendigt)

2. **Styling Strategy:**
   - Brug ShadCN UI til nye komponenter (hero, sections, etc.)
   - Brug Tailwind classes direkte for navigation styling
   - Bevar MedusaJS UI preset (det giver os `ui-*` classes)
   - Brug vores nye brand colors (`primary`, `accent`, etc.)

3. **CartButton:**
   - **DON'T TOUCH** CartButton eller CartDropdown
   - De fungerer perfekt som de er
   - Kun styling tweaks hvis absolut nødvendigt (fx badge color)

### Option 2: Gradual Migration (Alternative)

**Migrér CartButton til ShadCN, men bevar funktionalitet:**

1. Extract cart fetching logic til separate hook/service
2. Rewrite CartDropdown med ShadCN Popover
3. Test omhyggeligt at cart funktionalitet virker
4. **Risk:** Høj risiko for at introducere bugs

**⚠️ NOT RECOMMENDED** for Phase 3 - for meget risiko for kritisk e-commerce funktionalitet.

---

## Specific Changes Needed for Phase 3

### Navigation Component Updates:

**File:** `beauty-shop-storefront/src/modules/layout/templates/nav/index.tsx`

**Changes:**
1. ✅ Opdater logo tekst: "Medusa Store" → "GUAPO"
2. ✅ Tilføj menu links: "Hudpleje box", "Om GUAPO", "Kontakt" (desktop)
3. ✅ Tilføj User icon (højre side, ved siden af CartButton)
4. ✅ Opdater styling til Figma design (farver, spacing, typography)
5. ✅ Responsiv: Hamburger menu på mobile (kan bruge HeadlessUI eller ShadCN Sheet)
6. ⚠️ **BEVAR CartButton komponent som den er** (kun visuel tweaks)

**Styling:**
- Brug Tailwind classes direkte (ikke nødvendigvis ShadCN components for navigation)
- Brug brand colors: `text-primary`, `bg-primary`, etc.
- Bevar `content-container` class
- Bevar MedusaJS UI preset (vi kan bruge både MedusaJS og ShadCN classes)

**CartButton:**
- Bevar `<CartButton />` som den er
- Eventuelt styling tweaks til badge (fx orange background for badge)
- **DON'T** rewrite CartButton eller CartDropdown

---

## Updated Phase 3 Plan

### Phase 3: Navigation Component (REVISED)

**Estimated Time:** 1 time

#### Changes Required:

**1. Update Navigation Component**
**File:** `beauty-shop-storefront/src/modules/layout/templates/nav/index.tsx`

**Changes:**
- Erstat "Medusa Store" med "GUAPO" logo tekst
- Tilføj menu links: "Hudpleje box", "Om GUAPO", "Kontakt" (desktop)
- Tilføj User icon (højre side, ved siden af CartButton)
- Opdater styling til Figma design:
  - Background: `bg-[#f2f2f2]` (eller `bg-background-light`)
  - Text colors: `text-primary` for links
  - Spacing: Match Figma (64px padding, etc.)
- Responsiv: Hamburger menu på mobile (bevar SideMenu, eller opdater med ShadCN Sheet)
- **BEVAR CartButton komponent som den er** (ingen funktionelle ændringer)

**Styling Approach:**
- Brug Tailwind classes direkte (ikke nødvendigvis ShadCN Button komponenter)
- Brug brand colors: `primary`, `accent`, etc.
- Bevar MedusaJS UI preset (kan bruge både MedusaJS og ShadCN)
- Bevar `content-container` class

**2. CartButton Badge Styling (Optional)**
**File:** `beauty-shop-storefront/src/modules/layout/components/cart-dropdown/index.tsx`

**If needed:** Opdater badge styling til at matche Figma design (orange background `#f2542d`).

**Note:** Dette er valgfrit - kun hvis badge skal matche Figma design eksakt.

---

## Questions to Clarify

### 1. CartButton Badge Styling
**Question:** Skal cart badge have orange background (`#f2542d`) som i Figma?

**Current:** Badge vises i CartDropdown, ikke i Navigation direkte

**Recommendation:** Check Figma design - hvis badge skal være synlig i navigation, opdater styling. Ellers, skip.

### 2. ShadCN vs. MedusaJS UI
**Question:** Skal vi bruge ShadCN Button komponenter i navigation, eller bare Tailwind classes?

**Recommendation:** Brug Tailwind classes direkte for navigation links (simplere, mindre dependencies). Brug ShadCN til nye komponenter (hero, sections).

### 3. SideMenu (Mobile Menu)
**Question:** Skal vi erstatte SideMenu med ShadCN Sheet, eller opdatere eksisterende SideMenu?

**Recommendation:** Opdater eksisterende SideMenu styling (den bruger allerede HeadlessUI, som er fint). Kun styling tweaks.

---

## Testing Strategy

### After Phase 3 Implementation:

**Critical Tests:**
1. ✅ CartButton vises korrekt
2. ✅ CartDropdown åbner og viser cart items
3. ✅ Cart count badge opdateres korrekt
4. ✅ Navigation links virker (routing)
5. ✅ Responsive menu virker (mobile)
6. ✅ User icon vises korrekt

**Integration Tests:**
1. ✅ Add item to cart → badge opdateres
2. ✅ Navigate to cart page → cart data korrekt
3. ✅ Login/logout → user icon updates

---

## Recommendations

### ✅ SAFE Approach (Recommended):

1. **Navigation Styling Only:**
   - Opdater logo, links, styling
   - Bevar CartButton som den er
   - Bevar SideMenu funktionalitet
   - Brug Tailwind classes (ikke nødvendigvis ShadCN components)

2. **Gradual Migration:**
   - Nye komponenter (hero, sections) → ShadCN UI
   - Eksisterende e-commerce funktionalitet → Bevar som den er
   - Gradual migration senere (ikke i denne phase)

3. **Test Thoroughly:**
   - Test cart funktionalitet efter navigation updates
   - Verify at ingen regression i eksisterende features

### ⚠️ RISKY Approach (Not Recommended):

1. ❌ Rewrite CartButton med ShadCN
2. ❌ Replace MedusaJS UI components helt
3. ❌ Migrate SideMenu til ShadCN Sheet (unnecessary risk)

---

## Action Items

**Before Phase 3:**
1. ✅ **Confirm approach:** Hybrid (styling only) vs. Full migration
2. ✅ **Clarify badge styling:** Orange background i navigation?
3. ✅ **Update plan:** Revise Phase 3 med sikker tilgang

**During Phase 3:**
1. ✅ Update navigation styling
2. ✅ Bevar CartButton funktionalitet
3. ✅ Test cart integration thoroughly

**After Phase 3:**
1. ✅ Verify cart funktionalitet virker
2. ✅ Test på alle breakpoints
3. ✅ Update Linear med status

---

## Conclusion

**Vi har STYR på MedusaJS integration, MEN:**

⚠️ **Planen skal revideres for Phase 3:**
- Vi skal **BEVARE** CartButton og CartDropdown funktionalitet
- Vi skal **IKKE** erstatte MedusaJS UI komponenter helt
- Vi skal bruge **hybrid approach**: ShadCN til nye komponenter, bevar eksisterende e-commerce funktionalitet

**Recommendation:** Revider Phase 3 plan før implementation for at sikre at vi ikke bryder kritiske e-commerce funktioner.

