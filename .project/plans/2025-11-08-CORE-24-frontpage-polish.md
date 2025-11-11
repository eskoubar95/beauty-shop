# Frontpage Design Polish & Remaining Sections – Implementation Plan

## Overview

Polerer eksisterende forsideblokke (navigation, hero, Why/3-step, produktkort) og implementerer de resterende sektioner (social proof, storytelling, FAQ, final CTA/handling, footer) for at matche GUAPO-brandet tæt på Figma-“guapo-webdesign” samtidig med at vi kan foretage informerede designafvigelser hvor det giver bedre UX. Resultatet skal være en komplet, responsiv, CMS-forberedt forside klar til design QA og senere CMS-handoff.

**Estimated Size:** ~700–900 LOC  
**Estimated Time:** 8–12 timer  
**Risk Level:** Medium (UI-regressioner, responsive edge cases)

---

## Linear Issue

**Issue:** CORE-24  
**Title:** [Feature] Frontpage design polish & remaining sections  
**Status:** Planned  
**Priority:** Urgent  
**Labels:** Frontend, Feature, human-required  
**URL:** https://linear.app/beauty-shop/issue/CORE-24/feature-frontpage-design-polish-and-remaining-sections

---

## Current State Analysis

### Hvad findes allerede

1. **Hero/sektioner:** `src/app/[countryCode]/(main)/page.tsx` loader `Hero`, `BrandLogos`, `WhySection`, `StepCards` og `ProductCards` med mock data fra `src/lib/data/homepage-content.ts`.
2. **Komponenter:**  
   - Hero: `@modules/home/components/hero/index.tsx`  
   - Why: `@modules/home/components/why-section/index.tsx`  
   - Step cards (desktop/mobil): `@modules/home/components/step-cards/*`  
   - Produktkort: `@modules/home/components/product-cards/*`  
   Disse matcher CORE-23-planens output, men mangler finpolish ift. spacing, typografi og sammenspil.
3. **Navigation:** `@modules/layout/templates/nav/index.tsx` er allerede GUAPO-brandet, men med Medusa-spacing/hover states og begrænset mobilpolish.
4. **Footer:** `@modules/layout/templates/footer/index.tsx` er uændret Medusa-templaten (skal erstattes).
5. **CMS-typer:** `@lib/types/homepage.ts` og mock data understøtter hero, brand logos, why, steps, produkter – men ikke social proof/storytelling/FAQ/CTA/footer.

### Mangler og begrænsninger

1. **Nye sektioner:** Social proof, storytelling, FAQ, final CTA og custom footer mangler helt, både typer, data og komponenter.
2. **Navigation polish:** Desktop spacing, hover/fokus-styling, badges og mobilmenu matcher ikke Figma endnu.
3. **Hero refinement:** Overlay, button-styling og små responsive tweaks kræver detaljeret justering.
4. **Why + 3-step komposition:** Skal bindes tættere sammen (fælles wrapper, spacing og transitions).
5. **Produktkort:** Kræver finjustering af badges, priser, hover states og spacing.
6. **Design QA:** Ingen dokumenteret cross-breakpoint review eller micro-gap log.

### Nøglefund

- Hero, Why, StepCards, ProductCards er modulære og datadrevne (`homepageContent`), hvilket gør det enkelt at udvide med nye datafelter.
- Step-card setup bruger `framer-motion` (allerede installeret), så mobile scroll kan udvides uden nye deps.
- Accordion-pattern findes i `src/modules/products/components/product-tabs/accordion.tsx` (kan genbruges til FAQ).
- Footer templaten er asynkron og afhænger af Medusa-data; vi skal erstatte den med en statisk GUAPO-version for at undgå unødige fetches.

---

## Desired End State

1. Navigation matcher brandets spacing, hover/fokus-states, cart/account affordances og mobilmenu uden at ændre funktionel adfærd.
2. Hero har pixel-faithful typografi, overlay, CTA og fallback for manglende assets.
3. Why + 3-step præsenteres som én sammenhængende sektion med polerede grids, motion og responsive breakpoints.
4. Produktkort har præcis spacing, badgeplacering, prisformattering og hover states fra designet.
5. Social proof, storytelling, FAQ og final CTA/handling er implementeret med placeholder content, responsive layout og tilpasset typografi.
6. Footer er udskiftet med GUAPO-brandet struktur inkl. mobil collapse-regler.
7. Design QA-dokumentation findes, og responsive test er udført (mobile/tablet/desktop).

### Verificering (høj-niveau)

- [ ] Navigation lever op til AC #1 (desktop/mobil, hover/focus, cart/account).
- [ ] Hero matcher AC #2 (typografi, padding, overlay, mobile behaviour).
- [ ] Why + 3-step opfylder AC #3 (kombineret blok, korrekt grids/motion).
- [ ] Produktkort lever op til AC #4 (spacing, CTA, badges, pris).
- [ ] Nye sektioner dækker AC #5 (social proof, storytelling, FAQ, final CTA).
- [ ] Footer opfylder AC #6 (layout, links, mobil collapse).
- [ ] Design QA gennemført og mikro-gaps dokumenteret (AC #7).

---

## What We’re NOT Doing

1. **CMS-integration:** Vi udvider typer og mock data, men integrerer ikke med CMS endnu.
2. **Backend/Medusa-API:** Ingen ændringer i produktdata, carts eller regioner.
3. **Checkout/cart funktionalitet:** Navigationens cart-knap må ikke få nye sideeffekter.
4. **Fuld asset-produktion:** Brug placeholders hvor designassets mangler; faktiske assets håndteres senere.
5. **Ny animation beyond scope:** Kun let motion (fade/scroll). Ingen tunge parallax-/videoeffekter.
6. **SEO/analytics:** Ingen ændringer i metadata (udover hvis allerede krævet) eller tracking.
7. **Performance tuning ud over AC:** Ingen ekstra code splitting/lazy loading udover hvad sektionerne kræver.

---

## Implementation Approach

1. Udvid først data- og typestruktur, så alle sektioner kan bygges datadrevet.
2. Polish top-down: navigation → hero → kombinerede sektioner → produktkort.
3. Byg nye sektioner fra top mod bund (social proof → storytelling → FAQ → final CTA → footer).
4. Wrap-up med QA og dokumentation.

Denne rækkefølge sikrer, at top-level navigation/hero står stabilt inden vi bygger videre, og at nye sektioner kan bruge etablerede spacing/tokens.

---

## Phase 1: Content & Type Foundations

### Overview

Udvider `HomepageContent` typer og mock data til at inkludere social proof, storytelling, FAQ, final CTA og footer-indhold samt helper-typer til stats/testimonials.

### Changes Required

1. **Opdater typer**  
   - Fil: `src/lib/types/homepage.ts`  
   - Tilføj interfaces for:
     - `SocialProofStat`, `Testimonial`, `StorySection`, `FaqItem`, `FinalCtaContent`, `FooterLinkGroup`, `FooterLink`.  
     - Udvid `HomepageContent` med felter for nye sektioner samt evt. `socialProof`, `storytelling`, `faq`, `finalCta`, `footer`.
2. **Mock data**  
   - Fil: `src/lib/data/homepage-content.ts`  
   - Tilføj placeholder data for nye typer inkl. default billeder/ikonnavne (brug eksisterende `/public` assets eller midlertidige `#`-links).  
   - Sørg for, at `imageAlt`/`quote` er sat, og at arrays ikke er tomme.
3. **Eksport helpers**  
   - Overvej at eksportere enum/union for testimonial badges eller rating types, hvis det letter komponentlogik.

### Success Criteria

#### Automated Verification
- [ ] Type check: `npm run type-check`
- [ ] Build: `npm run build`

#### Manual Verification
- [ ] IntelliSense viser nye typer
- [ ] Mock data matcher typer uden TS-fejl
- [ ] Ingen runtime-fejl ved load af forsiden

**⚠️ PAUSE HERE** – fortsæt først når typer og data er på plads.

---

## Phase 2: Navigation Polish

### Overview

Finjuster navigationen til at opfylde AC #1 uden at ændre cart/account funktionalitet.

### Changes Required

1. **Styling**  
   - Fil: `src/modules/layout/templates/nav/index.tsx`  
   - Opdater padding (`px-6 lg:px-12`), højde (`h-20` desktop), baggrund (`bg-background`), border farve, og hover/focus states (brug `focus-visible:outline`).  
   - Introducér tydelig hover-underline eller tone for desktop links.  
   - Tilføj `aria-label` på nav-ikonlinks.
2. **Menu alignment**  
   - Justér flex layout, så logoet er centreret og links boomer i én linje med korrekt spacing (`gap-10` etc.).  
   - Sørg for, at `SideMenu`’s ods strenger matches (evt. ekstra props for brandfarver).
3. **Badge/Cart**  
   - sikr cart badge farver (accent) matcher design og har `aria-live="polite"`.
4. **Mobile menu**  
   - Tilpas `SideMenu`-styling for baggrunde/links; evt. importér brandfarver i `@modules/layout/components/side-menu/index.tsx`.

### Success Criteria

#### Automated Verification
- [ ] Type check & build passerer

#### Manual Verification
- [ ] Desktop: logo, links, user-ikon, cart aligner korrekt
- [ ] Hover/focus states synlige
- [ ] Mobile menu viser brandfarver, og interaktion fungerer
- [ ] Cart badge opfører sig som før (antal opdateres, dropdown virker)

**⚠️ PAUSE HERE** – visual QA på navigation før videre.

---

## Phase 3: Hero Refinement

### Overview

Justér hero overlay, typografi, CTA og fallback-strategi for at matche AC #2.

### Changes Required

1. **Hero component tweaks**  
   - Fil: `@modules/home/components/hero/index.tsx`  
   - Finjustér overlay-positionering (fx `lg:max-w-[520px]`, `top-1/2 translate-y-[-50%]` på desktop).  
   - Sikr CTA bruger `font-mono` og uppercase tracking fra design.  
   - Tilføj alternative layout på mobile (tekst over billede) ved at justere overlay flex.  
   - Introducér `aria-describedby` og semantisk struktur (`<header>`?).
2. **Fallbacks**  
   - Giv overlay baggrund fallback (`bg-background/95`).  
   - Hvis `ctaHref` ønskes senere, forbered prop men hold knap `type="button"`.

### Success Criteria

#### Automated Verification
- [ ] Type check & build passerer

#### Manual Verification
- [ ] Desktop: overlay ligger som i design (afstand fra venstre/bund)  
- [ ] Mobile: tekst stacker korrekt, padding er komfortabel  
- [ ] CTA har korrekt font/hover-state  
- [ ] Ingen layout shift ved manglende billede

**⚠️ PAUSE HERE** – visuel kontrol af hero før videre.

---

## Phase 4: Why + 3-Step Composition

### Overview

Binder why-sektionen og 3-step cards i én samlet blok med konsistent spacing og motion (AC #3).

### Changes Required

1. **Wrapper layout**  
   - Opret evt. `@modules/home/components/why-and-steps/index.tsx` der orkestrerer Why + Steps med fælles heading/subheadline hvis design kræver. Alternativt justér eksisterende sektioner med samme padding/gap.  
   - Sikr `max-w` og `px` er konsistente (`max-w-[1440px]`, `px-6/16`).
2. **Why-section tweaks**  
   - Justér grid-ratio (`lg:grid-cols-[1.1fr_0.9fr]`), tilføj `figcaption` til billede, og sikre whitespace, der matcher design (32/64px).  
   - Tilføj `aria-labelledby`.
3. **Step cards**  
   - Tjek mobil `StepCardsMobile`: tilføj `snap-always`, `scrollbar-hidden`, gradient masks med brandfarver.  
   - Desktop: check border, skygge, spacing (f.eks. `gap-10`).

### Success Criteria

#### Automated Verification
- [ ] Type check & build passerer

#### Manual Verification
- [ ] Why + Steps føles som én sektion (ingen farvejump)  
- [ ] Mobil scroll er smooth, snap fungerer, gradienter synlige  
- [ ] Desktop grids aligner, overskrifter har konsistent baseline  
- [ ] Ikoner og badges har korrekt størrelse (56px)

**⚠️ PAUSE HERE** – review sektionen før produktkort.

---

## Phase 5: Product Cards Polish

### Overview

Opdater spacing, badge-placering, CTA-styling og prisformat for produktkort (AC #4).

### Changes Required

1. **Komponent justeringer**  
   - Fil: `@modules/home/components/product-cards/product-card.tsx`  
   - Finjustér shadow/border, badge typografi, bullet styling, CTA-variant (outline vs. filled).  
   - Sikr priser bruger `formatCurrencyDKK` med korrekt tekst (“599 DKK første måned, 399,95 DKK derefter”).  
   - Tilføj `aria-label` og `aria-labelledby` for accessibility.
2. **Section layout**  
   - Fil: `@modules/home/components/product-cards/index.tsx`  
   - Justér introduktionstekst, spacing (`gap-12`), responsive stacking.

### Success Criteria

#### Automated Verification
- [ ] Type check & build passerer

#### Manual Verification
- [ ] Badges placeres korrekt og bruger rigtige farver  
- [ ] CTA-knapper matcher design (hover transitions, fokus states)  
- [ ] Prisformat korrekt med kommaer  
- [ ] Mobil: kort stacker og har passende padding

**⚠️ PAUSE HERE** – visuel QA før nye sektioner.

---

## Phase 6: Social Proof & Storytelling Sections

### Overview

Implementerer to nye sektioner midt på siden baseret på udvidet data: social proof (stats/testimonials) og storytelling (tekst+billede).

### Changes Required

1. **Social Proof komponent**  
   - Opret `@modules/home/components/social-proof/index.tsx`  
   - Render headline, subcopy, stats (fx “+1200 tilfredse kunder”) og testimonials (kort cards med quote/navn).  
   - Responsivt grid (`md:grid-cols-2`), brug `aria-labelledby`.
2. **Storytelling komponent**  
   - Opret `@modules/home/components/storytelling/index.tsx`  
   - Layout: tekstblok + billede (kan spejle Why-section).  
   - Tilføj evt. quote highlight eller timeline, afhængigt af data.
3. **Integrér i homepage**  
   - Opdater `page.tsx` til at inkludere nye sektioner i korrekt rækkefølge.

### Success Criteria

#### Automated Verification
- [ ] Type check & build passerer

#### Manual Verification
- [ ] Social proof viser alle stats/testimonials, responsivt grid fungerer  
- [ ] Storytelling layout matcher design, billede har korrekt aspect  
- [ ] Sektioner føles harmoniske med eksisterende tema

**⚠️ PAUSE HERE** – få feedback på nye sektioner før FAQ/CTA.

---

## Phase 7: FAQ & Final CTA/Handling

### Overview

Bygger en FAQ med accordion-pattern og afsluttende CTA/handling block for at fuldende midtersektionerne (AC #5).

### Changes Required

1. **FAQ**  
   - Opret `@modules/home/components/faq/index.tsx`  
   - Genbrug accordion fra `@modules/products/components/product-tabs/accordion.tsx` (importér/ekstrahér til fælles folder eller implementér let wrapper).  
   - Data fra `homepageContent.faq`.  
   - Tilføj `aria-label="Ofte stillede spørgsmål"`.
2. **Final CTA**  
   - Opret `@modules/home/components/final-cta/index.tsx`  
   - Layout: stor headline, body, bullet-liste/USP, CTA-knapper (primær + sekundær).  
   - Understøt eventuelle billeder eller garanti-badges.
3. **Homepage integration**  
   - Indsæt sektionerne i `page.tsx` efter storytelling/social proof.

### Success Criteria

#### Automated Verification
- [ ] Type check & build passerer

#### Manual Verification
- [ ] Accordion fungerer med keyboard (Enter/Space) og har fokus-states  
- [ ] Final CTA matcher design (typografi, knapper, baggrund)  
- [ ] Sektioner er responsivt stabile (ingen overflow)

**⚠️ PAUSE HERE** – design review før footer.

---

## Phase 8: Footer Redesign

### Overview

Erstatter Medusa-footer med GUAPO-footeren inkl. mobil collapse-regler (AC #6).

### Changes Required

1. **Ny footer komponent**  
   - Fil: `@modules/layout/templates/footer/index.tsx`  
   - Fjerne Medusa datafetch (`listCollections`, `listCategories`) og erstatt med statisk GUAPO-indhold fra `homepageContent.footer`.  
   - Struktur: brandkolonne, links (del evt. op i grupper), social media, adresse, legal tekst.  
   - Mobil: Brug accordion/collapse (kan være `Disclosure` fra Radix eller simpel `details` tag).  
   - Tilføj `aria-label="Footer navigation"`.
2. **Styles**  
   - Brug brandfarver; sikr tydelige borders/padding.  
   - Tilføj `focus-visible:outline` for links.

### Success Criteria

#### Automated Verification
- [ ] Type check & build passerer
- [ ] Ingen Medusa-datafetch i footeren (kontrollér at async/await fjernes)

#### Manual Verification
- [ ] Desktop footer matcher layout/typografi  
- [ ] Mobile footeren bruger collapse uden layout-breaks  
- [ ] Legal tekst opdateret til GUAPO  
- [ ] Links fungerer og er keyboard-navigerbare

**⚠️ PAUSE HERE** – komplet UI review før QA.

---

## Phase 9: Design QA & Documentation

### Overview

Gennemfør cross-breakpoint review, dokumentér mikro-gaps og opdater note-/planfilen med restopgaver.

### Changes Required

1. **QA tjekliste**  
   - Test på mobile (<640px), tablet (640–1024px), desktop (>1024px).  
   - Fokus på spacing, typografi, hover/focus states, scroll interaktioner.
2. **Lighthouse/A11y**  
   - Kør `npm run lint`, `npm run type-check`, `npm run build`.  
   - Kør Lighthouse i Chrome (Performance & Accessibility > 90).  
   - Test keyboard navigation og screen reader labels (VoiceOver/ChromeVox).
3. **Dokumentation**  
   - Opdater denne plan eller README med micro-gaps (fx TODO for manglende assets).  
   - Gem QA-findings i Linear-kommentar hvis relevant.

### Success Criteria

#### Automated Verification
- [ ] `npm run lint`
- [ ] `npm run type-check`
- [ ] `npm run build`
- [ ] Lighthouse Performance & Accessibility > 90

#### Manual Verification
- [ ] Design QA tjekliste gennemført og dokumenteret  
- [ ] Ingen console warnings/errors  
- [ ] Keyboard navigation fungerer hele vejen  
- [ ] Eventuelle micro-gaps noteret i Linear/plan

**✅ COMPLETE** – klar til kodegennemgang og release.

---

## Testing Strategy

### Automatisk
- `npm run lint`
- `npm run type-check`
- `npm run build`
- Evt. targeted komponenttests (Hero, FAQ accordion) hvis vi tilføjer dem.

### Manual Checklist
- Desktop/tablet/mobile visuel verifikation af alle sektioner.
- Navigation menu (desktop + mobile) og cart dropdown fungerer.
- Hero overlay, Why/Steps scroll, produktkort hover, nye sektioner.
- FAQ accordion keyboard navigation.
- Footer links/collapse.
- Lighthouse audit (Performance, Accessibility > 90).

---

## References

- Forside: `src/app/[countryCode]/(main)/page.tsx`
- Eksisterende komponenter: `@modules/home/components/*`
- Navigation: `@modules/layout/templates/nav/index.tsx`
- Footer: `@modules/layout/templates/footer/index.tsx`
- Types/mock data: `@lib/types/homepage.ts`, `@lib/data/homepage-content.ts`
- Accordion pattern: `@modules/products/components/product-tabs/accordion.tsx`
- Linear issues: CORE-23 plan (`.project/plans/2025-11-06-CORE-23-implement-beauty-shop-frontpage-from-figma-design.md`), CORE-24 ticket

---

## Rollback Strategy

1. **Types/data (Phase 1):**  
   - Reverter `homepage-content.ts` og `homepage.ts` ændringer hvis nye sektioner fejler.
2. **UI-komponenter (Phase 2–8):**  
   - Reverter individuelle komponentfiler (nav, hero, sektioner, footer) til tidligere commit.
   - Behold types/data for fremtidig brug om nødvendigt.
3. **Integration (page.tsx):**  
   - Reverter import/JSX-ændringer for at vende tilbage til tidligere sekvens.

Bevar commits per fase for nem revert (`git revert <commit>`).

---

## Next Steps

- Del plan med design/human reviewer for buy-in.
- Kør `/validate-plan` hvis formaliseret review ønskes.
- Start implementering fasevis: `/execute-plan-phase .project/plans/2025-11-08-CORE-24-frontpage-polish.md 1`


