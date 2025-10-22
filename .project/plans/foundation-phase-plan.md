# Foundation Phase – Implementation Plan

**Phase:** Foundation (Week 1-2)  
**Goal:** Setup complete development environment and infrastructure  
**Status:** ⚠️ OUTDATED - See updated plan below  
**Created:** October 21, 2025  
**Updated:** January 21, 2025

---

## ⚠️ ARCHITECTURE UPDATE (Jan 21, 2025)

**This plan has been updated to reflect the new monorepo architecture:**
- CORE-5, CORE-6, and CORE-7 have been **replaced** by **CORE-16** (Monorepo Setup)
- The new Foundation Phase now consists of **3 tasks** instead of 5
- Updated plan below reflects Turborepo + pnpm workspaces structure

**See:** [CORE-16 - Monorepo Setup](https://linear.app/beauty-shop/issue/CORE-16)

---

## Overview

The Foundation Phase consists of 3 critical tasks that **must** be completed in order before any MVP development can begin. This plan outlines dependencies, estimated timelines, and success criteria for each task.

---

## Dependency Graph

```
CORE-15 (Environment Configuration)
    ↓
    ├── CORE-4 (GitHub Repository Setup)
    ↓
    └── CORE-16 (Monorepo Setup: MedusaJS + Next.js + Payload CMS)
            ↓
            MVP Development Ready ✅
```

**Critical Path:** CORE-15 → CORE-16  
**Parallel Path:** CORE-4 can be done after CORE-15, in parallel with CORE-16

**Old Architecture (DEPRECATED):**
~~CORE-5 (Supabase Database Setup)~~ → **Cancelled**  
~~CORE-6 (MedusaJS Backend Setup)~~ → **Merged into CORE-16**  
~~CORE-7 (Next.js Frontend Setup)~~ → **Merged into CORE-16**

---

## Task 1: CORE-15 – Environment Configuration

**Priority:** 🔴 CRITICAL – START HERE  
**Estimated Time:** 2-3 hours  
**Dependencies:** None  
**Blocks:** All other tasks

### Why First?

Every other task requires environment variables to function. This is the foundation of the foundation.

### Scope

1. **Define environment variable schema**
   - Backend env vars (DATABASE_URL, STRIPE_API_KEY, CLERK_SECRET_KEY, SENTRY_DSN)
   - Frontend env vars (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
   - Supabase vars (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)

2. **Create .env.example templates**
   - `.env.example` for backend
   - `.env.local.example` for frontend
   - Include comments explaining each variable

3. **Document secrets management workflow**
   - Where to get secrets (Stripe Dashboard, Clerk Dashboard, etc.)
   - How to store secrets securely (never commit .env files)
   - Environment validation scripts

4. **Setup environment validation**
   - Script to validate all required env vars are present
   - TypeScript types for env vars
   - Runtime validation using Zod

5. **Security review checklist**
   - Follow `.cursor/rules/22-security_secrets.md`
   - Verify no secrets in git history
   - Document rollback procedure if secrets leaked

### Files to Create

```
backend/
  .env.example                  # Backend env template
  lib/env-validation.ts         # Zod validation schema

frontend/
  .env.local.example            # Frontend env template
  lib/env.ts                    # Type-safe env access

.project/
  secrets-management.md         # Secrets documentation
```

### Success Criteria

- ✅ All required env vars documented
- ✅ .env.example files created
- ✅ Validation scripts work
- ✅ Documentation complete
- ✅ Security review passed

### Estimated LOC

~150-200 LOC

### Labels

`human-required`, `high-risk`, `Infra`

### Implementation Approach

```bash
# Use this command:
/fetch-linear-ticket CORE-15
/create-implementation-plan
/execute-plan-phase
```

---

## Task 2: CORE-4 – GitHub Repository Setup

**Priority:** 🟠 HIGH  
**Estimated Time:** 3-4 hours  
**Dependencies:** CORE-15 (needs env vars for CI)  
**Blocks:** Code collaboration, CI/CD automation

### Why Second?

Once env vars are defined, we can configure CI/CD pipeline that uses them. This enables proper code review workflow for all remaining tasks.

### Scope

1. **Create GitHub Actions CI/CD workflow**
   - Install dependencies
   - Run typecheck
   - Run linter
   - Run tests
   - Run build
   - Upload artifacts (optional)

2. **Configure branch protection**
   - Require pull request
   - Require 1+ review
   - Require green CI
   - No direct pushes to main

3. **Create issue templates**
   - Bug report template
   - Feature request template
   - Align with Linear workflow

4. **Create PR template**
   - What/Why/How sections
   - Test plan
   - Affected areas
   - Rollback plan

5. **Update root README.md**
   - Project overview
   - Setup instructions
   - Link to `.project/GETTING_STARTED.md`

### Files to Create

```
.github/
  workflows/
    ci.yml                      # CI/CD pipeline
  ISSUE_TEMPLATE/
    bug_report.md               # Bug template
    feature_request.md          # Feature template
  pull_request_template.md      # PR template

.gitignore                      # Comprehensive gitignore
README.md                       # Root README (update)
```

### Success Criteria

- ✅ CI/CD pipeline runs green
- ✅ Branch protection active
- ✅ Issue templates work
- ✅ PR template works
- ✅ README.md updated

### Estimated LOC

~250-300 LOC

### Labels

`human-required`, `Infra`

### Implementation Approach

```bash
/fetch-linear-ticket CORE-4
/create-implementation-plan
/execute-plan-phase
```

**Note:** Review `.cursor/rules/31-ci_cd_pipeline.md` before implementation.

---

## Task 3: CORE-16 – Monorepo Setup (MedusaJS + Next.js + Payload CMS)

**Priority:** 🔴 CRITICAL  
**Estimated Time:** 12-16 hours  
**Dependencies:** CORE-15 (needs environment vars)  
**Blocks:** MVP Development (all apps needed)

**⚠️ Note:** This task **replaces** CORE-5, CORE-6, and CORE-7 with a unified monorepo approach.

### Why Third?

All apps (MedusaJS backend, Next.js storefront, Payload CMS) need to be set up in a coordinated monorepo structure to enable shared packages, type safety, and efficient development workflow.

### Scope

**Phase 1: Monorepo Foundation**
1. **Initialize Turborepo + pnpm workspaces**
   - Create `turbo.json` config
   - Create `pnpm-workspace.yaml`
   - Setup root `package.json`

2. **Create folder structure**
   - `apps/storefront/` (Next.js 15)
   - `apps/medusa/` (MedusaJS 2.0 backend + admin)
   - `apps/admin/` (Payload CMS)
   - `packages/ui/` (Shared components)
   - `packages/types/` (Shared TypeScript types)
   - `packages/config/` (Shared configs)

**Phase 2: MedusaJS Setup**
3. **Install MedusaJS 2.0**
   - Use `create-medusa-app` with direct Supabase connection
   - Configure database URL
   - Test MedusaJS admin dashboard

**Phase 3: Supabase Schema Separation**
4. **Configure database schemas**
   - Create `medusa` schema for MedusaJS tables
   - Create `beauty_shop` schema for custom tables
   - Implement RLS policies with Clerk authentication
   - Migrate MedusaJS tables to `medusa` schema

**Phase 4: Next.js & Payload Setup**
5. **Install Next.js 15 storefront**
   - Setup App Router structure
   - Configure Tailwind + shadcn/ui
   - Connect to MedusaJS API

6. **Install Payload CMS**
   - Configure Payload with Supabase
   - Setup content collections
   - Test admin interface

**Phase 5: Shared Packages**
7. **Setup shared packages**
   - UI components in `packages/ui/`
   - TypeScript types in `packages/types/`
   - Test cross-package imports

### Files to Create

```
# Root monorepo config
turbo.json                      # Turborepo config
pnpm-workspace.yaml             # pnpm workspaces
package.json                    # Root package.json

# Apps
apps/
  medusa/                       # MedusaJS (created by CLI)
    package.json
    medusa-config.js
    .env
  storefront/                   # Next.js (created by CLI)
    package.json
    next.config.js
    .env.local
  admin/                        # Payload CMS (created by CLI)
    package.json
    payload.config.ts
    .env

# Packages
packages/
  ui/
    package.json                # Shared UI components
    tsconfig.json
  types/
    package.json                # Shared TypeScript types
    index.ts
  config/
    package.json                # Shared configs (eslint, tsconfig)
    tsconfig.base.json

# Database
supabase/
  migrations/
    001_medusa_schema.sql       # MedusaJS schema separation
    002_beauty_shop_schema.sql  # Custom tables
    003_rls_policies.sql        # RLS with Clerk
```

### Success Criteria

- ✅ Turborepo + pnpm workspaces configured
- ✅ All 3 apps installed and running
- ✅ Supabase schema separation implemented
- ✅ RLS policies with Clerk working
- ✅ Shared packages working across apps
- ✅ `pnpm dev` starts all apps simultaneously
- ✅ Type safety across packages verified

### Estimated LOC

~600-800 LOC

### Labels

`human-required`, `high-risk`, `Infra`

### Implementation Approach

```bash
/fetch-linear-ticket CORE-16
/create-implementation-plan
/execute-plan-phase
```

**Critical:** Follow `.project/08-Architecture.md` for monorepo structure and `.cursor/rules/30-database_postgres.md` for database best practices.

---

## ~~Task 4: CORE-6 – MedusaJS Backend Setup~~ (DEPRECATED)

**⚠️ This task has been merged into CORE-16 (Monorepo Setup)**

<details>
<summary>📜 Old CORE-6 Scope (For Reference Only)</summary>

## Task 4: CORE-6 – MedusaJS Backend Setup

**Priority:** 🔴 CRITICAL  
**Estimated Time:** 8-10 hours  
**Dependencies:** CORE-15, CORE-5  
**Blocks:** CORE-7 (frontend needs backend API)

### Why Fourth?

Backend is the most complex piece with multiple integrations (Stripe, Clerk, Sentry). Must be done before frontend can consume APIs.

### Scope

1. **Initialize MedusaJS v2 project**
   - Create backend directory
   - Install MedusaJS dependencies
   - Configure medusa-config.js

2. **Configure Stripe plugin**
   - Install @medusajs/stripe plugin
   - Configure payment methods (Dankort, MobilePay)
   - Test webhook endpoints

3. **Integrate Clerk authentication**
   - Custom auth middleware
   - JWT validation
   - Protected routes

4. **Setup Sentry for error tracking**
   - Install Sentry SDK
   - Configure error boundaries
   - Test error reporting

5. **Create basic API structure**
   - Health check endpoint
   - Product endpoints (GET /v1/products)
   - Cart endpoints (POST /v1/carts)
   - Follow `.cursor/rules/21-api_design.md`

6. **Test all integrations locally**
   - Stripe payment flow
   - Clerk authentication
   - Sentry error logging

### Files to Create

```
backend/
  medusa-config.js              # MedusaJS config
  lib/
    stripe/
      client.ts                 # Stripe client
      webhooks.ts               # Stripe webhooks
    clerk/
      middleware.ts             # Auth middleware
      jwt-validation.ts         # JWT utils
    sentry/
      config.ts                 # Sentry config
  api/
    routes/
      health.ts                 # Health check
      products.ts               # Product routes
      carts.ts                  # Cart routes
    middlewares/
      auth.ts                   # Auth middleware
      error.ts                  # Error middleware
```

### Success Criteria

- ✅ MedusaJS runs locally
- ✅ Stripe integration works
- ✅ Clerk auth works
- ✅ Sentry logs errors
- ✅ Health check responds
- ✅ Basic API endpoints work

### Estimated LOC

~500+ LOC

### Labels

`human-required`, `high-risk`, `Backend`

### Implementation Approach

```bash
/fetch-linear-ticket CORE-6
/create-implementation-plan
/execute-plan-phase
```

**Critical:** Follow `.cursor/rules/21-api_design.md` and `.project/06-Backend_Guide.md`.

</details>

---

## ~~Task 5: CORE-7 – Next.js Frontend Setup~~ (DEPRECATED)

**⚠️ This task has been merged into CORE-16 (Monorepo Setup)**

<details>
<summary>📜 Old CORE-7 Scope (For Reference Only)</summary>

## Task 5: CORE-7 – Next.js Frontend Setup

**Priority:** 🟠 HIGH  
**Estimated Time:** 6-8 hours  
**Dependencies:** CORE-15, CORE-6  
**Blocks:** All MVP features

### Why Last?

Frontend depends on backend API being available. Once backend is running, frontend can be built to consume it.

### Scope

1. **Initialize Next.js 15 project**
   - Create frontend directory
   - Setup App Router
   - Configure next.config.js

2. **Setup Tailwind CSS**
   - Install Tailwind
   - Configure tailwind.config.ts
   - Setup design tokens (colors, typography, spacing)

3. **Install and configure shadcn/ui**
   - Initialize shadcn/ui
   - Install base components (Button, Input, Card, etc.)
   - Customize theme

4. **Implement design tokens**
   - Review Figma design (if available)
   - Colors (primary, secondary, neutral)
   - Typography (font families, sizes, weights)
   - Spacing scale
   - Border radius

5. **Create basic layout structure**
   - Root layout with header/footer
   - Home page (placeholder)
   - Basic navigation
   - Responsive design

6. **Test API integration**
   - Fetch products from backend
   - Display in simple list
   - Verify API connectivity

### Files to Create

```
frontend/
  app/
    layout.tsx                  # Root layout
    page.tsx                    # Home page
    globals.css                 # Global styles
  components/
    ui/                         # shadcn components
    layout/
      Header.tsx                # Header
      Footer.tsx                # Footer
      Navigation.tsx            # Navigation
  lib/
    utils.ts                    # Utility functions
    api-client.ts               # API client
  tailwind.config.ts            # Tailwind config
  next.config.js                # Next.js config
```

### Success Criteria

- ✅ Next.js runs locally
- ✅ Tailwind CSS works
- ✅ shadcn/ui components work
- ✅ Design tokens implemented
- ✅ Layout renders correctly
- ✅ API integration works

### Estimated LOC

~300-400 LOC

### Labels

`human-required`, `Frontend`

### Implementation Approach

```bash
/fetch-linear-ticket CORE-7
/create-implementation-plan
/execute-plan-phase
```

**Critical:** Follow `.cursor/rules/10-nextjs_frontend.md` and `.project/07-Frontend_Guide.md`.

</details>

---

## Timeline & Milestones (Updated for Monorepo)

### Week 1

**Days 1-2:** CORE-15 + CORE-4 (parallel after CORE-15)
- Day 1 Morning: CORE-15 (env configuration)
- Day 1 Afternoon: Start CORE-4 (GitHub setup)
- Day 2: Finish CORE-4

**Days 3-6:** CORE-16 Phase 1-3 (Monorepo Foundation + MedusaJS + Supabase)
- Day 3: Turborepo + pnpm workspaces setup
- Day 4: MedusaJS installation with Supabase
- Day 5: Database schema separation + RLS policies
- Day 6: Test MedusaJS backend + admin dashboard

### Week 2

**Days 7-9:** CORE-16 Phase 4-5 (Next.js + Payload + Shared Packages)
- Day 7: Next.js storefront setup + Tailwind
- Day 8: Payload CMS setup
- Day 9: Shared packages (ui, types, config)

**Day 10:** Integration & Validation
- Test `pnpm dev` (all apps running)
- Verify type safety across packages
- Test API connectivity
- Document any issues

### Total Timeline

**Estimated:** 7-8 days (~1.5 weeks for solo dev)  
**Buffer:** +2 days for unexpected issues  
**Total:** 10 days max

**Note:** New monorepo approach is **~2-3 days faster** than the old separate setup approach!  
**Target Completion:** End of Week 2

---

## Risk Mitigation

### High-Risk Areas

1. **CORE-16 (Monorepo Complexity)**
   - Risk: Apps don't communicate correctly, type mismatches, build failures
   - Mitigation: Follow Turborepo best practices, test cross-package imports incrementally

2. **Database Schema Separation**
   - Risk: RLS policies incorrect → security breach, schema conflicts
   - Mitigation: Thorough testing, peer review, follow `.cursor/rules/30-database_postgres.md`

3. **MedusaJS + Supabase Integration**
   - Risk: Database connection failures, schema conflicts with MedusaJS tables
   - Mitigation: Use direct connection URL, test schema separation thoroughly

4. **Environment Variables**
   - Risk: Secrets leaked in git, env vars misconfigured across apps
   - Mitigation: Pre-commit hooks, regular secrets audit, follow `.cursor/rules/22-security_secrets.md`

### Contingency Plans

- If CORE-16 monorepo setup too complex: Start with separate repos, migrate later
- If MedusaJS + Supabase integration fails: Use PostgreSQL in Docker as fallback
- If Payload CMS setup blocked: Skip for now, focus on MedusaJS + Next.js first
- If shared packages cause issues: Duplicate code initially, refactor later

---

## Quality Gates

Each task must pass these checks before moving to next:

### Before Moving to Next Task

- [ ] All acceptance criteria met
- [ ] Code reviewed (self-review at minimum)
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] Linear issue updated to "Done"

### Before Declaring Foundation Complete

- [ ] All 3 tasks in "Done" status (CORE-15, CORE-4, CORE-16)
- [ ] `pnpm dev` starts all apps successfully
- [ ] MedusaJS backend runs without errors
- [ ] MedusaJS admin accessible at `/app`
- [ ] Next.js storefront runs without errors
- [ ] Payload CMS admin accessible
- [ ] Database connected and queryable
- [ ] Schema separation verified (medusa, beauty_shop schemas)
- [ ] RLS policies working with Clerk
- [ ] Shared packages importing correctly
- [ ] Type safety verified across apps
- [ ] CI/CD pipeline green
- [ ] All env vars working across apps
- [ ] No console errors or warnings
- [ ] Security review passed

---

## After Foundation Phase

Once all 3 tasks are complete (CORE-15, CORE-4, CORE-16):

1. **Celebrate! 🎉** You've built the entire monorepo foundation for Beauty Shop.

2. **Validate Setup:**
   - Run `pnpm dev` and verify all 3 apps start
   - Test MedusaJS backend API endpoints
   - Test MedusaJS admin dashboard access
   - Test Next.js storefront rendering
   - Test Payload CMS admin interface
   - Verify database schemas (medusa, beauty_shop)
   - Test shared package imports
   - Check CI/CD pipeline is green

3. **Re-create MVP Issues:**
   - Use `/create-linear-issue` for each MVP feature
   - Apply proper labels and LOC estimates
   - Decide copilot-ready vs human-required

4. **Start MVP Development:**
   - Begin with CORE-8 (Product Catalog)
   - Follow plan-based workflow for complex features
   - Use Copilot for simple, repetitive tasks

5. **Maintain Quality:**
   - Run `/prepare-pr` before every PR
   - Keep test coverage > 70%
   - Keep Lighthouse score > 90
   - Monitor Sentry for errors
   - Verify type safety across monorepo

---

## Resources

**Documentation:**
- [.project/GETTING_STARTED.md](../GETTING_STARTED.md) – How to get started
- [.cursor/commands/README.md](../../.cursor/commands/README.md) – All commands
- [.cursor/commands/PLAN-BASED-WORKFLOW.md](../../.cursor/commands/PLAN-BASED-WORKFLOW.md) – Workflow guide

**Linear Issues:**
- [CORE-15: Environment Configuration](https://linear.app/beauty-shop/issue/CORE-15)
- [CORE-4: GitHub Repository Setup](https://linear.app/beauty-shop/issue/CORE-4)
- [CORE-16: Monorepo Setup with MedusaJS, Next.js, and Payload CMS](https://linear.app/beauty-shop/issue/CORE-16)

**Deprecated Issues (For Reference):**
- ~~[CORE-5: Supabase Database Setup](https://linear.app/beauty-shop/issue/CORE-5)~~ → Cancelled
- ~~[CORE-6: MedusaJS Backend Setup](https://linear.app/beauty-shop/issue/CORE-6)~~ → Merged into CORE-16
- ~~[CORE-7: Next.js Frontend Setup](https://linear.app/beauty-shop/issue/CORE-7)~~ → Merged into CORE-16

**Tech Guides:**
- [.project/06-Backend_Guide.md](../06-Backend_Guide.md) – Backend guide
- [.project/07-Frontend_Guide.md](../07-Frontend_Guide.md) – Frontend guide
- [.project/04-Database_Schema.md](../04-Database_Schema.md) – Database schema

---

**Ready to start?** Run: `/fetch-linear-ticket CORE-15` 🚀

*Last updated: October 21, 2025*  
*Maintained by: Nicklas Eskou*

