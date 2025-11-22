# Getting Started with Design Commands

Quick guide to using the new Playwright MCP-powered design commands.

## Prerequisites

1. **Dev server running:**
   ```bash
   cd beauty-shop-storefront
   npm run dev
   ```
   Should be accessible at `http://localhost:3000`

2. **Playwright MCP configured in Cursor** ✅
   (Already set up)

## Quick Start Workflow

### 1️⃣ First Time: Document Your Design System

```
/design-audit
```

**What it does:**
- Screenshots all homepage components (Hero, Cards, Sections)
- Analyzes colors, spacing, typography, shadows visually
- Creates `.design/design-standards.md` with patterns
- Lists inconsistencies (hardcoded values, off-scale spacing)

**Output:**
- `.design/design-standards.md` - Your design system documentation
- `.design/screenshots/baseline/` - Reference screenshots

**Time:** ~5 minutes

---

### 2️⃣ Fix Inconsistencies

```
/design-consistency-fix
```

**What it does:**
- Captures "before" screenshots
- Updates `tailwind.config.js` (adds color/shadow tokens)
- Replaces hardcoded values: `bg-[#08152D]` → `bg-primary-darker`
- Replaces custom shadows: `shadow-[0_28px...]` → `shadow-hero`
- Captures "after" screenshots
- Verifies no visual regressions

**Output:**
- Standardized codebase
- Before/after screenshots proving no visual changes

**Time:** ~10 minutes

---

### 3️⃣ Review New Components

When building new component:

```
/design-review AboutPage
```

**What it does:**
- Screenshots component (desktop + mobile)
- Analyzes against `.design-standards.md`
- Compares with reference components (Hero, ProductCard)
- Provides concrete fixes with file:line

**Output:**
- Visual analysis (spacing, typography, colors)
- Critical issues list + fixes
- Score (X/10)
- Next steps

**Time:** ~3 minutes

---

### 4️⃣ Polish & Optimize

When something "feels off":

```
/design-optimize TestimonialSection - feels cramped
```

**What it does:**
- Iteration 1: Screenshot + analyze → propose changes
- Iteration 2: Apply → screenshot → compare
- Iteration 3+: Refine until 9/10 quality
- Shows visual progression

**Output:**
- Screenshot progression (iteration-1, 2, 3...)
- Optimization log (what changed, why)
- Final comparison (before vs. after)

**Time:** ~5-10 minutes (2-4 iterations)

---

### 5️⃣ Adapt External Inspiration

When you find design you like:

```
/design-adapt-inspiration

URL: https://linear.app
Pattern: Card spacing and subtle borders  
Target: src/components/TestimonialCard.tsx
Goal: Make our cards feel more polished
```

**What it does:**
- Screenshots inspiration site (Linear)
- Extracts specific pattern (card design)
- Analyzes your existing component
- Provides 3 adaptation options:
  - Conservative (low risk, quick win)
  - Bold (significant upgrade)
  - Full Reimagination (maximum impact)
- Validates against Beauty Shop brand

**Output:**
- Pattern analysis (padding: 24px, border: 1px subtle, etc.)
- 3 concrete options with pros/cons
- Recommended option with reasoning
- Implementation code

**Time:** ~5-7 minutes

---

## Typical Development Flow

### Building New Feature

```bash
# 1. Build component
[write code]

# 2. Review design
/design-review NewComponent

# 3. Apply suggested fixes
[fix spacing, colors, etc.]

# 4. Optimize if needed
/design-optimize NewComponent - hierarchy unclear

# 5. Final check
/design-review NewComponent
# Goal: 9/10 score
```

### Polishing Existing Page

```bash
# 1. Baseline review
/design-review ProductsPage

# 2. Optimize iteratively
/design-optimize ProductsPage - feels cluttered

# 3. Verify improvements
/design-review ProductsPage
# Should see improved score
```

### Design System Maintenance

```bash
# Quarterly or when adding many new components

# 1. Re-audit to catch drift
/design-audit

# 2. Fix new inconsistencies
/design-consistency-fix

# 3. Update design-standards.md if patterns evolved
```

---

## Tips for Success

### When to Use Each Command

| Situation | Command | Why |
|-----------|---------|-----|
| Starting design work | `/design-audit` | Document current state |
| Hardcoded colors/shadows | `/design-consistency-fix` | Standardize to tokens |
| New component built | `/design-review` | Ensure consistency |
| Component feels off | `/design-optimize` | Iterative polish |
| Found inspiration online | `/design-adapt-inspiration` | Extract & adapt patterns |
| Pre-PR check | `/design-review` | Final quality gate |

### Getting Best Results

**Design Audit:**
- Run when homepage is fully built
- Ensure all components visible (not just placeholders)
- Run again after major refactors

**Design Review:**
- Be specific about what feels off
- Compare with similar existing components
- Don't skip mobile screenshot analysis

**Design Optimize:**
- Define clear goal ("more spacious", "clearer hierarchy")
- Trust the visual analysis over your gut
- Stop at 9/10 (perfection is diminishing returns)

### Common Patterns

**Premium Beauty Aesthetic:**
- Generous spacing (py-24, not py-12)
- Large gaps (gap-12, not gap-4)
- Strong typography hierarchy (H1 vs H2 clear difference)
- Subtle, elegant shadows
- Warm neutral backgrounds

**Spacing Philosophy:**
- When in doubt, add space
- Section padding: `py-16 sm:py-20 lg:py-24`
- Element gaps: `gap-8` minimum for major sections
- 8px scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px

---

## Example Sessions

### Example 1: First Time Setup

```
You: /design-audit

Cursor:
📸 Capturing homepage with Playwright...
✅ Hero, StepCards, ProductCards, Storytelling, FAQ captured
✅ Desktop (1440px) + Mobile (375px)

🔍 Analyzing visual patterns with AI...
- Colors: Found #051537, #08152D, #0B2142, #F2542D
- Spacing: Mostly 8px scale (some px-10 off-scale)
- Typography: Clear hierarchy (40-56px headings)
- Shadows: 3 custom patterns found

✅ Created .design-standards.md
✅ Saved baseline screenshots

📋 Inconsistencies Found:
🔴 5 files use bg-[#08152D] → should use token
🔴 3 components have custom shadows → should use tokens
🟡 2 components use px-10 → not 8px scale

Recommendation: Run /design-consistency-fix
```

### Example 2: Review & Fix

```
You: /design-review AboutPage

Cursor:
📸 Screenshots captured (desktop + mobile)

🔍 Visual Analysis:
❌ Hero padding: py-12 (feels cramped)
   File: src/app/about/page.tsx:15
   Suggest: py-16 sm:py-20 lg:py-24
   Why: Homepage Hero uses py-24, creates premium feel

❌ Inconsistent gaps: gap-6 and gap-12 mixed
   Suggest: gap-12 consistently

✅ Colors correct
✅ Typography hierarchy good

Score: 6/10

You: [Apply suggested fixes]

You: /design-review AboutPage

Cursor:
📸 New screenshots captured

🔍 Analysis:
✅ Spacing much improved
✅ Consistent gaps
✅ Premium feel achieved

Score: 9/10 🎉
Ready for production!
```

### Example 3: Iterative Optimization

```
You: /design-optimize TestimonialSection - feels cramped

Cursor:
🎯 Goal: More spacious, premium feel

📸 ITERATION 1: Baseline
Score: 5/10
Issues: py-12 too tight, gap-4 too close, heading too small

Proposed: py-12 → py-24, gap-4 → gap-12, text-3xl → text-4xl
Apply? [yes]

📸 ITERATION 2: After changes
Score: 7.5/10 (improved +2.5!)
Good: Much better spacing
Still: Desktop gap could be larger

Proposed: gap-12 → gap-16 on lg:
Apply? [yes]

📸 ITERATION 3: Final
Score: 9/10 🎉

Summary:
- 3 iterations
- 5/10 → 9/10 (+4 points)
- Feels spacious and premium
- Ready for production!
```

---

## Troubleshooting

### Playwright not capturing screenshots
- Check dev server running: `http://localhost:3000`
- Ensure Playwright MCP is enabled in Cursor
- Try refreshing page in browser first

### Screenshots look different than browser
- Clear browser cache
- Rebuild app: `npm run build`
- Hard refresh: Cmd+Shift+R

### Visual regressions after fix
- Compare before/after screenshots carefully
- May need to adjust token values in `tailwind.config.js`
- Iterate until visually identical

### Design score not improving
- After 3 iterations, may need structural changes
- Consider component refactor instead
- Ask for design review from team

---

## Resources

- **Commands:** `.cursor/commands/design-*.md`
- **Standards:** `.design/design-standards.md` (generated)
- **Rules:** `.cursor/rules/10-nextjs_frontend.mdc`
- **Theme:** `beauty-shop-storefront/tailwind.config.js`

---

**Questions?** Tag @nicklas in Linear or #dev-tooling Slack

**Last updated:** January 2025

