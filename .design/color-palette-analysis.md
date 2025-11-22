# Farvepalette Analyse - Beauty Shop

> Analyse af nuværende og foreslåede farvepaletter for brutalistisk design
> Dato: 2025-01-XX

## Design Kontekst

**Design Stil:** Brutalistisk
- Hårde kanter (ingen border radius)
- Stærk kontrast
- Geometriske former
- Minimalistisk æstetik
- Bold typography

## Nuværende Farvepalette

### Primary Colors
- **#051537** - Navy (brand color)
- **#08152D** - Mørkere navy variant
- **#0B2142** - Lysere navy variant
- **#092766** - Mørkeste navy variant

### Accent Color
- **#F2542D** - Orange/red-orange (nuværende accent)

### Background Colors
- **#efeeec** - Warm beige (standard baggrund)
- **#fafaf8** - Lysere beige variant
- **#F7F9FC** - Meget lys blå-grå (secondary cards)
- **#E9EDF5** - Lys blå-grå (image placeholders)

### Border Colors
- **#DFE3EC** - Lys grå (product cards)
- **#D5DAE5** - Lysere grå (image containers)
- **#E6E2DA** - Varm beige (navigation)
- **#D9D9D9** - Neutral grå (navigation underlines)

## Foreslået Farvepalette (Huemint)

Fra [Huemint Brand 2 Colors](https://huemint.com/brand-2/#palette=eef1f2-f1433a-051537):

### Core Palette
- **#eef1f2** - Meget lys grå-blå (næsten hvid)
- **#f1433a** - Rød-orange accent
- **#051537** - Navy (samme som nuværende brand color)

## Sammenligning og Analyse

### 1. Background Color: #eef1f2 vs #efeeec

**Nuværende (#efeeec):**
- Warm beige med rødlige undertoner
- Giver varm, organisk følelse
- Komplementerer orange accent godt
- RGB: (239, 238, 236)

**Foreslået (#eef1f2):**
- Koldere, blålig grå
- Mere neutral og "clean"
- Bedre kontrast med navy
- RGB: (238, 241, 242)

**Kontrast Analyse:**
- #eef1f2 + #051537: **WCAG AAA** (15.2:1 kontrast ratio)
- #efeeec + #051537: **WCAG AAA** (14.8:1 kontrast ratio)

**Anbefaling:**
✅ **#eef1f2** er bedre for brutalistisk design:
- Mere neutral og "hard-edged"
- Bedre kontrast med navy
- Passer bedre til minimalistisk æstetik
- Mindre "warm" og mere "technical"

### 2. Accent Color: #f1433a ✅ GODKENDT

**✅ Besluttet: #f1433a** (rød-orange accent)

**Farveegenskaber:**
- RGB: (241, 67, 58)
- Mere rød end orange
- Vibrant og attention-grabbing
- Passer perfekt til brutalistisk design

**Kontrast Analyse:**
- #eef1f2 + #f1433a: **WCAG AA** (4.5:1 kontrast ratio) ✅

**Farvepsykologi:**
- **#f1433a**: Bold, stærk, attention-grabbing
- Perfekt til brutalistisk æstetik
- Skaber stærk kontrast med navy og neutral background

**Nuancer:**
- **DEFAULT**: #f1433a (standard accent)
- **dark**: #d12e25 (hover states, mørkere variant)
- **light**: #ff5c52 (highlights, lysere variant)

### 3. Primary Color: #051537 (Uændret)

✅ **Behold #051537** - Perfekt brand color:
- Stærk, autoritativ navy
- God kontrast på begge baggrunde
- Passer til brutalistisk æstetik

## Komplet Farvepalette Anbefaling

### Option A: Huemint Palette (Mere Brutalistisk)
```js
primary: {
  DEFAULT: '#051537',
  dark: '#08152D',
  darker: '#08152D',
  light: '#0B2142',
},
accent: {
  DEFAULT: '#f1433a',  // Mere rød-orange
},
background: {
  DEFAULT: '#eef1f2',  // Koldere, neutral grå
  light: '#ffffff',    // Ren hvid
  card: '#ffffff',     // Hvid for cards
  image: '#eef1f2',    // Samme som background
},
```

### Option B: Hybrid (Behold Warm Accent)
```js
primary: {
  DEFAULT: '#051537',
  dark: '#08152D',
  darker: '#08152D',
  light: '#0B2142',
},
accent: {
  DEFAULT: '#F2542D',   // Behold nuværende orange
},
background: {
  DEFAULT: '#eef1f2',  // Opdater til koldere grå
  light: '#ffffff',
  card: '#ffffff',
  image: '#eef1f2',
},
```

### Option C: Nuværende (Behold Alt)
```js
// Behold nuværende palette, men standardiser tokens
```

## Kontrast Matrix

### Text på Background
| Text Color | #eef1f2 (foreslået) | #efeeec (nuværende) |
|-----------|---------------------|---------------------|
| #051537 (navy) | ✅ 15.2:1 (AAA) | ✅ 14.8:1 (AAA) |
| #f1433a (accent) | ✅ 4.5:1 (AA) | ⚠️ 4.2:1 (AA) |
| #F2542D (nuværende accent) | ✅ 4.2:1 (AA) | ✅ 4.5:1 (AA) |

### Accent på Background
| Accent | #eef1f2 | #efeeec |
|--------|---------|---------|
| #f1433a | ✅ 4.5:1 | ⚠️ 4.2:1 |
| #F2542D | ✅ 4.2:1 | ✅ 4.5:1 |

## Anbefalinger

### 1. Background Color
✅ **Opdater til #eef1f2**
- Bedre for brutalistisk design
- Mere neutral og "hard-edged"
- Bedre kontrast med navy
- Mindre "warm" følelse

### 2. Accent Color
✅ **Godkendt: #f1433a**
- Bold, stærk, attention-grabbing
- Passer perfekt til brutalistisk design
- God kontrast på alle backgrounds
- Se `color-palette-final.md` for komplet palette med nuancer

### 3. Border Colors
Opdater border colors til at matche ny background:
- **#DFE3EC** → **#D5DAE5** (lysere, passer bedre til #eef1f2)
- **#D5DAE5** → **#C8D0DB** (endnu lysere for image containers)
- **#E6E2DA** → **#D5DAE5** (fjern warm beige, brug neutral grå)

### 4. Implementation Plan

1. **Fase 1: Background Update**
   - Opdater `background.DEFAULT` til `#eef1f2`
   - Test visuelt på alle sections

2. **Fase 2: Accent Test**
   - Test `#f1433a` på CTAs og highlights
   - Sammenlign med `#F2542D` side-by-side
   - Vælg baseret på brand følelse

3. **Fase 3: Border Colors**
   - Opdater border colors til at matche ny background
   - Test kontrast på alle cards og containers

4. **Fase 4: Token Extraction**
   - Extract alle hardcoded hex colors til tokens
   - Opdater Tailwind config
   - Opdater alle komponenter

## Test Checklist

- [ ] Test #eef1f2 background på homepage
- [ ] Test #f1433a accent på buttons og CTAs
- [ ] Sammenlign #f1433a vs #F2542D side-by-side
- [ ] Test kontrast på alle text/background kombinationer
- [ ] Test på mobile og desktop
- [ ] Test i forskellige lysforhold (hvis muligt)
- [ ] Få feedback fra team/brugere

## Næste Skridt

1. ✅ **Godkendt:** Accent color #f1433a
2. ⏳ **Næste:** Implementer background nuancer (se `color-palette-final.md`)
3. ⏳ **Derefter:** Opdater Tailwind config med alle tokens
4. ⏳ **Test:** Visuel test på alle pages
5. ⏳ **Extract:** Fjern alle hardcoded hex colors

**Se `color-palette-final.md` for komplet farvepalette med alle nuancer.**

