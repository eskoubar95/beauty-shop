# Beauty Shop Design Standards

> Dokumenteret fra visuel analyse af live homepage (http://localhost:8000/dk) og kodebase gennemgang.
> Dette dokument fungerer som single source of truth for designmønstre i Beauty Shop.

## Design Stil: Brutalistisk

**Kerneprincipper:**
- **Hårde kanter** - Ingen border radius (`rounded-none`)
- **Stærk kontrast** - Bold farver og tydelig hierarki
- **Geometriske former** - Rektangulære, skarpe elementer
- **Minimalistisk æstetik** - Ren, funktionel design
- **Bold typography** - Stærke, klare skrifttyper

**Implikationer:**
- Alle cards og containers bruger `rounded-none` (ikke `rounded-lg`)
- Stærke farvekontraster mellem elementer
- Klar visuel hierarki gennem størrelse og vægt
- Minimal brug af gradients og bløde overgange

## Colors

> **Godkendt farvepalette:** Se `.design/color-palette-final.md` for komplet dokumentation.

### Primary (Navy)
- **#051537** (`primary` i Tailwind) - Brand color, standard primary
- **#08152D** (`primary.dark` / `primary.darker`) - Mørkere variant
- **#0B2142** (`primary.light`) - Lysere variant
- **#030D1F** (`primary.darkest`) - Mørkeste variant

**Usage:**
- Headers og navigation
- Vigtig tekst
- Button backgrounds (default variant)
- Card borders og text
- Footer background

### Accent
- **#f1433a** (`accent` i Tailwind) - Rød-orange accent color ✅ Godkendt
- **#d12e25** (`accent.dark`) - Mørkere variant (hover states)
- **#ff5c52** (`accent.light`) - Lysere variant (highlights)

**Usage:**
- CTAs og vigtige actions
- Highlights og badges
- Price emphasis
- Active states
- Error states (hvis relevant)

### Background - Nuancer baseret på #eef1f2
- **#eef1f2** (`background` i Tailwind) - Base background, neutral grå-blå ✅ Godkendt
- **#f5f7f8** (`background.light`) - Lysere variant (alternating sections)
- **#fafbfc** (`background.lighter`) - Endnu lysere (cards, elevated elements)
- **#ffffff** (`background.white`) - Ren hvid (cards, modals, overlays)
- **#e3e6e8** (`background.dark`) - Mørkere variant (subtle dividers)
- **#d8dce0** (`background.darker`) - Endnu mørkere (strong dividers)

**Usage:**
- Standard sections: `bg-background`
- Alternating sections: `bg-background-light`
- Cards og elevated: `bg-background-lighter` eller `bg-white`
- Dividers: `border-background-dark` eller `border-background-darker`

### Border Colors - Nuancer baseret på background
- **#d8dce0** (`border` i Tailwind) - Standard border ✅ Godkendt
- **#e3e6e8** (`border.light`) - Lys border (subtle separators)
- **#e8ebed** (`border.lighter`) - Endnu lysere (very subtle)
- **#c8cdd2** (`border.dark`) - Mørk border (strong separators)
- **#f1433a** (`border.accent`) - Accent border (active states)
- **#051537** (`border.primary`) - Primary border (important elements)

**Usage:**
- Product cards: `border-border` eller `border-border-light`
- Image containers: `border-border-lighter`
- Navigation: `border-border-light`
- Active states: `border-accent`
- Important elements: `border-primary`

### Text Colors
- **#051537** (`text.primary`) - Main text color
- **#051537/80** (`text.secondary`) - Secondary text (80% opacity)
- **#051537/60** (`text.tertiary`) - Tertiary text (60% opacity)
- **#051537/40** (`text.muted`) - Muted text (40% opacity)
- **#f1433a** (`text.accent`) - Accent text
- **#ffffff** (`text.white`) - White text (on dark backgrounds)
- **#eef1f2** (`text.inverse`) - Inverse text (on primary backgrounds)

**Opacity Hierarchy:**
- **/100** (primary): Headings og primær tekst
- **/80** (secondary): Body text og sekundær tekst
- **/60** (tertiary): Labels, kickers, muted text
- **/40** (muted): Placeholder text, very subtle text

### Image Placeholder Colors
- **#e3e6e8** (`image.placeholder`) - Image placeholder background
- **#d8dce0** (`image.border`) - Image container border

**Usage:**
```tsx
<div className="bg-image-placeholder border border-image-border">
  {/* Image content */}
</div>
```

### Text Opacity Hierarchy
- **/100** (default) - Headings og primær tekst
- **/80** - Body text og sekundær tekst
- **/75** - Beskrivelser og feature lists
- **/70** - Sub-items i lister
- **/65** - Italic sub-text
- **/60** - Labels, kickers, muted text
- **/40** - Placeholder text

### Footer
- **#1E1E1C** - Mørk baggrund for footer

## Spacing Scale (8px base)

### Standard Scale
- **xs**: 4px (`gap-1`, `p-1`)
- **sm**: 8px (`gap-2`, `p-2`)
- **md**: 12px (`gap-3`, `p-3`)
- **base**: 16px (`gap-4`, `p-4`)
- **lg**: 24px (`gap-6`, `p-6`)
- **xl**: 32px (`gap-8`, `p-8`)
- **2xl**: 48px (`gap-12`, `p-12`)
- **3xl**: 64px (`gap-16`, `p-16`)
- **4xl**: 96px (`gap-24`, `p-24`)

### Section Spacing
**Vertical padding:**
- Mobile: `py-16` (64px)
- Tablet: `sm:py-20` (80px)
- Desktop: `lg:py-24` (96px)

**Pattern:** `py-16 sm:py-20 lg:py-24`

**Exceptions:**
- Why section: `py-20` (80px) - ingen responsive variant
- Brand logos: `py-6 sm:py-10` (24px/40px) - mindre spacing

### Container Spacing
**Max width:**
- Standard: `max-w-[1440px]`

**Horizontal padding:**
- Mobile: `px-4` (16px)
- Tablet: `sm:px-8` (32px)
- Desktop: `lg:px-16` (64px)

**Pattern:** `px-4 sm:px-8 lg:px-16`

**Exceptions:**
- Hero: `px-4 sm:px-10 lg:px-16` - `px-10` (40px) på tablet (ikke 8px multiple)
- Why section: `px-4 sm:px-8 lg:px-0` - ingen padding på desktop

### Internal Component Spacing

**Gaps:**
- Small gaps: `gap-3` (12px), `gap-4` (16px)
- Medium gaps: `gap-5` (20px - ikke 8px multiple), `gap-6` (24px)
- Large gaps: `gap-8` (32px), `gap-10` (40px - ikke 8px multiple), `gap-12` (48px), `gap-16` (64px), `gap-20` (80px)

**Padding:**
- Hero box: `p-7 sm:p-9 lg:p-12` (28px/36px/48px)
- Step card header: `px-8 py-5 sm:py-7` (32px horizontal, 20px/28px vertical)
- Step card content: `px-8 py-14 sm:py-16` (32px horizontal, 56px/64px vertical)
- Product card: `px-8 pt-8 sm:px-10 sm:pt-10` og `px-8 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8`

## Typography

### Font Families
- **Sans-serif**: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Ubuntu, sans-serif
- **Mono**: IBM Plex Mono, monospace (brugt i buttons)

### Hierarchy

**H1 (Hero):**
- Mobile: `text-3xl` (30px) `font-semibold` `leading-tight` `tracking-[-0.02em]`
- Tablet: `sm:text-[34px]` (34px)
- Desktop: `lg:text-[40px]` (40px)

**H2 (Section headings):**
- Mobile: `text-4xl` (36px) `font-semibold` `tracking-[-0.04em]`
- Tablet: `sm:text-5xl` (48px)
- Desktop: `lg:text-[56px]` (56px) `lg:leading-[1.05]`

**H2 (Final CTA - uppercase):**
- Mobile: `text-4xl` (36px) `font-semibold` `uppercase` `tracking-[0.08em]`
- Tablet: `sm:text-[44px]` (44px)
- Desktop: `lg:text-[52px]` (52px)

**H3 (Card titles):**
- Mobile: `text-2xl` (24px) eller `text-3xl` (30px) `font-semibold` `leading-tight`
- Tablet: `sm:text-[26px]` (26px) eller `sm:text-[34px]` (34px)
- Desktop: Samme som tablet

**Body:**
- Standard: `text-base` (16px) `leading-relaxed`
- Large: `sm:text-lg` (18px) eller `sm:text-[17px]` (17px)
- Small: `text-sm` (14px)
- Tiny: `text-xs` (12px)

### Tracking (Letter Spacing)

**Headings:**
- Tight: `tracking-tight` eller `tracking-[-0.02em]` (H1)
- Tighter: `tracking-[-0.04em]` (H2 section headings)

**Uppercase labels:**
- Standard: `tracking-[0.22em]` eller `tracking-[0.2em]`
- Wide: `tracking-[0.28em]` (step card headers)
- Medium: `tracking-[0.18em]` (feature labels)
- Narrow: `tracking-[0.08em]` (final CTA heading)

**Buttons:**
- `tracking-[0.2em]` - Standard for uppercase buttons

### Leading (Line Height)
- **Tight**: `leading-tight` (headings)
- **Relaxed**: `leading-relaxed` (body text)
- **Custom**: `lg:leading-[1.05]` (large H2 headings)

### Font Weights
- **Semibold**: `font-semibold` (headings, buttons, labels)
- **Medium**: `font-medium` (body emphasis)
- **Regular**: Default (body text)

## Shadows

### Hero Box Shadow
```css
shadow-[0_28px_70px_rgba(5,21,55,0.18)]
```
- 28px vertical offset
- 70px blur
- Navy color (#051537) med 18% opacity
- Brugt i hero section white box

### Product Card Shadow
```css
shadow-[0_22px_60px_rgba(5,21,55,0.08)]
```
- 22px vertical offset
- 60px blur
- Navy color med 8% opacity
- Brugt i product cards

### Step Card Shadow
```css
shadow-[0_15px_30px_-12px_rgba(0,0,0,0.1),0_4px_12px_-8px_rgba(0,0,0,0.1)]
```
- Dual shadow system
- Første: 15px offset, 30px blur, -12px spread, 10% black opacity
- Anden: 4px offset, 12px blur, -8px spread, 10% black opacity
- Brugt i step cards og Card component

### Side Menu Shadow
```css
shadow-[0_20px_60px_rgba(5,21,55,0.18)]
```
- 20px vertical offset
- 60px blur
- Navy color med 18% opacity
- Brugt i mobile side menu

### Cart Dropdown Shadow
```css
shadow-[0_24px_60px_rgba(5,21,55,0.1)]
```
- 24px vertical offset
- 60px blur
- Navy color med 10% opacity

## Border Radius

### Scale
- **none**: `0px` (`rounded-none`) - **STANDARD FOR BRUTALISTISK DESIGN**
- **soft**: `2px` (`rounded-soft`) - Kun for meget små elementer hvis nødvendigt
- **base**: `4px` (`rounded-base`) - Undgå hvis muligt
- **rounded**: `8px` (`rounded` eller `rounded-lg`) - **UNDGÅ for brutalistisk design**
- **large**: `16px` (`rounded-large`) - **UNDGÅ for brutalistisk design**
- **circle**: `9999px` (`rounded-full`) - Kun for avatars/pills hvis nødvendigt

### Usage (Brutalistisk Design)
- **Cards**: `rounded-none` ✅ - Hårde kanter
- **Buttons**: `rounded-none` ✅ - Hårde kanter (eller minimal hvis brand kræver det)
- **Images**: `rounded-none` ✅ - Square corners
- **Badges**: `rounded-none` ✅ - Square corners
- **Containers**: `rounded-none` ✅ - Hårde kanter

**Note:** Alle UI elementer bør bruge `rounded-none` for at opretholde brutalistisk æstetik.

## Hover States

### Transform Effects
- **Lift**: `hover:-translate-y-1` (4px) eller `hover:-translate-y-0.5` (2px)
- **Buttons**: `hover:-translate-y-0.5` (2px)
- **Product cards**: `hover:-translate-y-1` (4px)

### Transitions
- **Duration**: `duration-200` (200ms)
- **Property**: `transition-transform` eller `transition-colors`

### Color Changes
- **Buttons (default)**: `hover:bg-[#0B2142]` (lysere navy)
- **Text links**: `hover:text-[#08152D]` (mørkere navy)
- **Outline buttons**: `hover:bg-[#08152D] hover:text-white`

## Component Patterns

### Hero Section
- Full-width section med background image
- White box overlay med shadow
- Max-width container: `max-w-[1440px]`
- Content padding: `px-4 sm:px-10 lg:px-16`
- Box padding: `p-7 sm:p-9 lg:p-12`
- Box max-width: `max-w-[500px] sm:max-w-[520px]`

### Step Cards
- 3-column grid på desktop (`grid-cols-3 gap-8`)
- Stack på mobile (`flex-col gap-6`)
- Card structure:
  - Header med colored background (`bg-[#051537]` eller `bg-[#F2542D]`)
  - Content area med white background
  - Padding: `px-8 py-5 sm:py-7` (header), `px-8 py-14 sm:py-16` (content)
- **Issue**: `rounded-none` - burde være `rounded-lg`

### Product Cards
- 2-column grid på desktop (`grid-cols-1 lg:grid-cols-2 gap-10`)
- Card structure:
  - Image container: `aspect-video` med border
  - Content area: `px-8 pt-8 sm:px-10 sm:pt-10` (top), `px-8 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8` (content)
  - Border: `border border-[#DFE3EC]`
  - Shadow: Custom product card shadow
- Hover: `hover:-translate-y-1`

### Storytelling Section
- 2-column grid på desktop (`lg:grid-cols-2 lg:gap-20`)
- Stack på mobile (`flex-col gap-12`)
- Image container: `aspect-[4/3]` med border `border-[#D5DAE5]`
- Text content: `gap-8` mellem elementer

### FAQ Section
- 2-column grid på desktop (`lg:grid-cols-2 gap-6`)
- Accordion items med `divide-y divide-primary/15`
- Item padding: `px-6 py-5`

### Final CTA Section
- Centered content
- Uppercase heading med `tracking-[0.08em]`
- Divider: `h-px w-16 bg-primary/40`
- Button: `min-w-[200px]`

## Uppercase Labels Pattern

Konsistent brug af uppercase labels med tracking:
- **Kickers**: `uppercase tracking-[0.22em] text-primary/60`
- **Step labels**: `uppercase tracking-[0.28em]`
- **Badges**: `uppercase tracking-[0.22em]`
- **Feature labels**: `uppercase tracking-[0.18em]`
- **Price labels**: `uppercase tracking-[0.2em]`

## Image Placeholders

Konsistent placeholder pattern:
- Container: `border border-[#D5DAE5] bg-[#E9EDF5]`
- Placeholder text: `text-sm font-medium uppercase tracking-[0.18em] text-primary/40`
- Text: "Billede på vej"

## Button Variants

### Default
- Background: `bg-[#08152D]`
- Text: `text-white`
- Border: `border-[#08152D]`
- Font: `font-mono uppercase tracking-[0.2em]`
- Hover: `hover:bg-[#0B2142] hover:-translate-y-0.5`

### Outline
- Background: `bg-white`
- Text: `text-[#08152D]`
- Border: `border-[#08152D]`
- Font: `font-mono uppercase tracking-[0.2em]`
- Hover: `hover:bg-[#08152D] hover:text-white hover:-translate-y-0.5`

## Responsive Breakpoints

Fra Tailwind config:
- **2xsmall**: 320px
- **xsmall**: 512px
- **small**: 1024px (tablet)
- **medium**: 1280px
- **large**: 1440px (desktop)
- **xlarge**: 1680px
- **2xlarge**: 1920px

Standard pattern: Mobile-first med `sm:` (1024px) og `lg:` (1440px) breakpoints.

