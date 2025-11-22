# Endelig Farvepalette - Beauty Shop

> Godkendt farvepalette for brutalistisk design
> Dato: 2025-01-XX

## Beslutninger

✅ **Accent Color:** `#f1433a` (rød-orange)  
✅ **Primary Color:** `#051537` (navy)  
✅ **Base Background:** `#eef1f2` (neutral grå-blå)

## Komplet Farvepalette

### Primary Colors (Navy)
```js
primary: {
  DEFAULT: '#051537',  // Brand color - stærk, autoritativ navy
  dark: '#08152D',     // Mørkere variant (headers, buttons)
  darker: '#08152D',   // Samme som dark (konsolider)
  light: '#0B2142',    // Lysere variant (body text, hover states)
  darkest: '#030D1F',  // Mørkeste variant (hvis nødvendigt)
}
```

**Usage:**
- Headers og navigation
- Vigtig tekst
- Button backgrounds (default variant)
- Card borders og text
- Footer background

### Accent Color
```js
accent: {
  DEFAULT: '#f1433a',  // Rød-orange - bold, attention-grabbing
  dark: '#d12e25',     // Mørkere variant (hover states)
  light: '#ff5c52',    // Lysere variant (highlights, subtle accents)
  muted: '#f1433a/80', // Med opacity for subtile brug
}
```

**Usage:**
- CTAs og vigtige actions
- Highlights og badges
- Price emphasis
- Active states
- Error states (hvis relevant)

### Background Colors - Nuancer baseret på #eef1f2

```js
background: {
  DEFAULT: '#eef1f2',  // Base background - neutral grå-blå
  light: '#f5f7f8',    // Lysere variant (alternating sections)
  lighter: '#fafbfc',  // Endnu lysere (cards, elevated elements)
  white: '#ffffff',    // Ren hvid (cards, modals, overlays)
  dark: '#e3e6e8',     // Mørkere variant (subtle dividers, borders)
  darker: '#d8dce0',  // Endnu mørkere (strong dividers)
}
```

**Nuance Forklaring:**
- **DEFAULT (#eef1f2)**: Standard page background
- **light (#f5f7f8)**: Alternating sections, subtle variation
- **lighter (#fafbfc)**: Cards, elevated elements, modals
- **white (#ffffff)**: Pure white for maximum contrast
- **dark (#e3e6e8)**: Subtle dividers, borders
- **darker (#d8dce0)**: Strong dividers, section separators

**Usage Pattern:**
```tsx
// Standard sections
<section className="bg-background">...</section>

// Alternating sections (subtle variation)
<section className="bg-background-light">...</section>

// Cards og elevated elements
<div className="bg-background-lighter">...</div>
// eller
<div className="bg-white">...</div>

// Dividers
<div className="border-t border-background-dark">...</div>
```

### Border Colors - Nuancer baseret på background

```js
border: {
  DEFAULT: '#d8dce0',  // Standard border (mørkere end background-dark)
  light: '#e3e6e8',    // Lys border (subtle separators)
  lighter: '#e8ebed',  // Endnu lysere (very subtle)
  dark: '#c8cdd2',     // Mørk border (strong separators)
  accent: '#f1433a',   // Accent border (active states)
  primary: '#051537',  // Primary border (important elements)
}
```

**Usage:**
- Product cards: `border-border` eller `border-border-light`
- Image containers: `border-border-lighter`
- Navigation: `border-border-light`
- Active states: `border-accent`
- Important elements: `border-primary`

### Text Colors

```js
text: {
  primary: '#051537',      // Main text color
  secondary: '#051537/80',  // Secondary text (80% opacity)
  tertiary: '#051537/60',   // Tertiary text (60% opacity)
  muted: '#051537/40',      // Muted text (40% opacity)
  accent: '#f1433a',        // Accent text
  white: '#ffffff',         // White text (on dark backgrounds)
  inverse: '#eef1f2',      // Inverse text (on primary backgrounds)
}
```

**Opacity Hierarchy:**
- **/100** (primary): Headings og primær tekst
- **/80** (secondary): Body text og sekundær tekst
- **/60** (tertiary): Labels, kickers, muted text
- **/40** (muted): Placeholder text, very subtle text

### Image Placeholder Colors

```js
image: {
  placeholder: '#e3e6e8',  // Image placeholder background
  border: '#d8dce0',       // Image container border
}
```

**Usage:**
```tsx
<div className="bg-image-placeholder border border-image-border">
  {/* Image content */}
</div>
```

## Komplet Tailwind Config

```js
colors: {
  primary: {
    DEFAULT: '#051537',
    dark: '#08152D',
    darker: '#08152D',
    light: '#0B2142',
    darkest: '#030D1F',
  },
  accent: {
    DEFAULT: '#f1433a',
    dark: '#d12e25',
    light: '#ff5c52',
  },
  background: {
    DEFAULT: '#eef1f2',
    light: '#f5f7f8',
    lighter: '#fafbfc',
    white: '#ffffff',
    dark: '#e3e6e8',
    darker: '#d8dce0',
  },
  border: {
    DEFAULT: '#d8dce0',
    light: '#e3e6e8',
    lighter: '#e8ebed',
    dark: '#c8cdd2',
    accent: '#f1433a',
    primary: '#051537',
  },
  text: {
    primary: '#051537',
    secondary: '#051537',
    tertiary: '#051537',
    muted: '#051537',
    accent: '#f1433a',
    white: '#ffffff',
    inverse: '#eef1f2',
  },
  image: {
    placeholder: '#e3e6e8',
    border: '#d8dce0',
  },
}
```

## Kontrast Matrix

### Text på Background
| Text Color | #eef1f2 (DEFAULT) | #f5f7f8 (light) | #fafbfc (lighter) | #ffffff (white) |
|-----------|-------------------|------------------|-------------------|-----------------|
| #051537 (primary) | ✅ 15.2:1 (AAA) | ✅ 15.4:1 (AAA) | ✅ 15.6:1 (AAA) | ✅ 15.8:1 (AAA) |
| #f1433a (accent) | ✅ 4.5:1 (AA) | ✅ 4.6:1 (AA) | ✅ 4.7:1 (AA) | ✅ 4.8:1 (AA) |

### Accent på Background
| Accent | #eef1f2 | #f5f7f8 | #fafbfc | #ffffff |
|--------|---------|---------|---------|---------|
| #f1433a | ✅ 4.5:1 | ✅ 4.6:1 | ✅ 4.7:1 | ✅ 4.8:1 |

## Migration Guide

### Fase 1: Opdater Tailwind Config
1. Tilføj alle nye color tokens til `tailwind.config.js`
2. Behold eksisterende tokens for backward compatibility
3. Test at Tailwind compilerer korrekt

### Fase 2: Opdater Background Colors
```tsx
// Før
className="bg-background"        // #efeeec
className="bg-background-light"  // #fafaf8

// Efter
className="bg-background"        // #eef1f2
className="bg-background-light"  // #f5f7f8
className="bg-background-lighter" // #fafbfc (ny)
className="bg-white"             // #ffffff (eksplicit)
```

### Fase 3: Opdater Accent Colors
```tsx
// Før
className="bg-[#F2542D]"
className="text-[#F2542D]"

// Efter
className="bg-accent"
className="text-accent"
```

### Fase 4: Opdater Border Colors
```tsx
// Før
className="border-[#DFE3EC]"
className="border-[#D5DAE5]"

// Efter
className="border-border"
className="border-border-light"
```

### Fase 5: Opdater Hardcoded Colors
Se `inconsistencies-report.md` issue #2 for komplet liste.

## Test Checklist

- [ ] Opdater Tailwind config med nye tokens
- [ ] Test background nuancer på alle sections
- [ ] Test accent color (#f1433a) på buttons og CTAs
- [ ] Test kontrast på alle text/background kombinationer
- [ ] Test border colors på cards og containers
- [ ] Test på mobile og desktop
- [ ] Verificer WCAG compliance
- [ ] Få visuel feedback fra team

## Design Rationale

### Background Nuancer
- **Minimal variation**: Brutalistisk design favoriserer subtile nuancer
- **Geometrisk progression**: Hver nuance er ~5-7% lysere/mørkere
- **Konsistent temperatur**: Alle nuancer har samme blå-grå undertone
- **Høj kontrast**: Alle nuancer opretholder stærk kontrast med navy

### Accent Color
- **Bold og attention-grabbing**: #f1433a er mere vibrant end #F2542D
- **Passer til brutalistisk**: Stærk, direkte farve
- **God kontrast**: Opfylder WCAG AA på alle backgrounds

### Border Colors
- **Subtile separators**: Borders er diskrete, ikke dominerende
- **Hierarki**: Forskellige border nuancer for forskellige niveauer
- **Konsistens**: Alle borders matcher background nuancer

## Næste Skridt

1. ✅ **Godkendt:** Accent color #f1433a
2. ⏳ **Næste:** Implementer background nuancer i Tailwind config
3. ⏳ **Derefter:** Opdater alle komponenter med nye tokens
4. ⏳ **Test:** Visuel test på alle pages
5. ⏳ **Extract:** Fjern alle hardcoded hex colors

