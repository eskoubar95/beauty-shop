# Implementation Plans

This directory contains detailed implementation plans for large features (>400 LOC) and complex changes in the Beauty Shop project.

## When to Create a Plan

Use `/create-implementation-plan` for:

- **Large Features** (> 400 LOC or > 20 files)
- **Multi-Component Features** spanning backend + frontend + database
- **Complex Refactoring** that touches many parts of the codebase
- **Risky Changes** requiring phased rollout and verification
- **Cross-Domain Features** involving multiple services (MedusaJS, Supabase, Stripe, etc.)
- **Features with Unclear Requirements** that need research and discovery

For smaller, straightforward features (< 400 LOC), use direct implementation commands like:
- `/setup-nextjs-feature` - For simple Next.js features
- `/api-resource` - For API endpoints
- `/rhf-zod-form` - For forms

## Plan Format

Plans follow HumanLayer's phase-based structure, adapted for Beauty Shop:

### Key Elements:
- **Linear Ticket Integration** - Every plan links to a Linear issue
- **Phase-Based Implementation** - Break work into incremental, testable phases
- **Success Criteria Separation** - Automated (runnable commands) vs Manual (human testing)
- **Pause Points** - Explicit stops between phases for verification
- **"What We're NOT Doing"** - Scope guard to prevent feature creep
- **Current State Analysis** - Document what exists and what's discovered during research
- **Rollback Strategy** - How to quickly revert if issues arise

### File Naming Convention:
```
YYYY-MM-DD-BS-XXX-feature-name.md
```

**Examples:**
- `2025-10-20-BS-152-product-catalog-filtering.md`
- `2025-10-21-BS-153-checkout-payment-flow.md`
- `2025-10-22-refactor-cart-state-management.md` (no ticket)

## Workflow

### Complete Plan-Based Development Flow:

```
1. /fetch-linear-ticket BS-XXX
   ↓ Get ticket details, acceptance criteria, technical notes

2. /research-feature-patterns
   ↓ Research existing patterns, find reusable components

3. /create-implementation-plan
   ↓ Interactive planning session, create detailed plan

4. /validate-plan
   ↓ Review plan for completeness, dependencies, scope

5. /execute-plan-phase (Phase 1)
   ↓ Implement first phase
   ↓ Run automated checks
   ↓ Perform manual testing
   ↓ PAUSE for approval

6. /update-linear-status
   ↓ Post progress to Linear

7. /execute-plan-phase (Phase 2)
   ↓ Continue with next phase...

8. /prepare-pr
   ↓ Pre-PR quality checks

9. /create-pr-with-linear
   ↓ Create PR, link to Linear, update status
```

## Why Phase-Based Implementation?

### Benefits:
1. **Incremental Progress** - Ship working code frequently, reduce risk
2. **Early Feedback** - Catch issues early in each phase
3. **Clear Checkpoints** - Know exactly where you are in the process
4. **Easier Review** - Smaller, focused PRs are easier to review
5. **Rollback Safety** - Can rollback to last successful phase
6. **Team Coordination** - Clear phases help multiple developers collaborate

### When to Use Phases:
- **Phase 1:** Usually foundation (database schema, core services, types)
- **Phase 2:** Business logic and API endpoints
- **Phase 3:** UI components and user-facing features
- **Phase 4:** Integration, polish, edge cases, performance optimization

Each phase should be independently testable and deployable.

## Success Criteria: Automated vs Manual

### Automated Verification (Must Pass Before Next Phase):
- Type checking: `npm run type-check`
- Linting: `npm run lint`
- Unit tests: `npm run test`
- Build: `npm run build`
- Integration tests: `npm run test:integration` (if applicable)

### Manual Verification (Human Testing Required):
- Feature works correctly in UI
- Performance meets PRD requirements (< 2 sec load time)
- Edge cases handled gracefully
- Accessibility works (keyboard nav, screen reader)
- Cross-browser/device compatibility
- No regressions in related features

**Important:** Automated checks run fast and catch obvious issues. Manual testing catches UX, performance, and integration issues that machines can't detect.

## Example Plans

See `template.md` for the complete plan structure.

### Real-World Example Structure:

```markdown
# Product Catalog Filtering Implementation Plan

## Overview
Add advanced filtering to product catalog with category, price range, and search.

## Linear Issue
**Issue:** BS-152
**Status:** In Progress

## Current State Analysis
- Existing ProductList component in `components/products/ProductList.tsx`
- MedusaJS product endpoints support filtering
- No client-side filter state management yet

### Key Discoveries:
- Found similar filtering pattern in `components/admin/ProductFilters.tsx`
- Zustand store pattern in `lib/stores/cart-store.ts` can be reused
- Product API supports cursor-based pagination

## Desired End State
Users can filter products by category, price range, and search by name.
Filters persist in URL for shareable links.

## What We're NOT Doing
- ❌ NOT implementing saved filter presets (Phase 2 feature)
- ❌ NOT adding product recommendations (separate ticket)
- ❌ NOT changing existing cart behavior

## Phase 1: Zustand Filter Store
[Detailed implementation steps...]

## Phase 2: UI Components
[Detailed implementation steps...]

## Phase 3: API Integration
[Detailed implementation steps...]
```

## Tips for Writing Good Plans

### Do:
- ✅ Be specific with file paths and line numbers
- ✅ Include code snippets for complex changes
- ✅ Document assumptions and constraints
- ✅ List all dependencies between phases
- ✅ Make success criteria measurable
- ✅ Reference existing patterns to follow
- ✅ Consider security and performance implications

### Don't:
- ❌ Leave open questions unresolved (research first!)
- ❌ Make phases too large (keep < 500 LOC per phase)
- ❌ Skip the "What We're NOT Doing" section
- ❌ Forget rollback strategy
- ❌ Assume - verify with codebase research

## Related Documentation

- **Commands:** See `.cursor/commands/README.md` for all available commands
- **Rules:** See `.cursor/rules/` for coding standards and practices
- **Project Docs:** See `.project/` for PRD, tech stack, API design, etc.
- **HumanLayer Inspiration:** https://github.com/humanlayer/humanlayer/tree/main/.claude/commands

## Questions?

If you're unsure whether to create a plan:
- **Size:** Will it be > 400 LOC? → Plan it
- **Complexity:** Does it touch backend + frontend + database? → Plan it
- **Risk:** Is it touching payment flow, auth, or core data? → Plan it
- **Clarity:** Are requirements unclear? → Research, then plan it

When in doubt, create a plan. Better to over-plan than to refactor mid-implementation.

