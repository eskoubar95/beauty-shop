# Foundation Phase – Implementation Plan

**Phase:** Foundation (Week 1-2)  
**Goal:** Setup complete development environment and infrastructure  
**Status:** Ready to start  
**Created:** October 21, 2025

---

## Overview

The Foundation Phase consists of 5 critical tasks that **must** be completed in order before any MVP development can begin. This plan outlines dependencies, estimated timelines, and success criteria for each task.

---

## Dependency Graph

```
CORE-15 (Environment Configuration)
    ↓
    ├── CORE-4 (GitHub Repository Setup)
    ↓
    └── CORE-5 (Supabase Database Setup)
            ↓
            └── CORE-6 (MedusaJS Backend Setup)
                    ↓
                    └── CORE-7 (Next.js Frontend Setup)
                            ↓
                            MVP Development Ready ✅
```

**Critical Path:** CORE-15 → CORE-5 → CORE-6 → CORE-7  
**Parallel Path:** CORE-4 can be done after CORE-15, in parallel with CORE-5

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

## Task 3: CORE-5 – Supabase Database Setup

**Priority:** 🔴 CRITICAL  
**Estimated Time:** 6-8 hours  
**Dependencies:** CORE-15 (needs DATABASE_URL)  
**Blocks:** CORE-6 (backend needs database)

### Why Third?

Backend (CORE-6) cannot function without a database. This is the most complex Foundation task due to schema design and RLS policies.

### Scope

1. **Create Supabase project**
   - Development project
   - Production project (or staging)
   - Enable required extensions (uuid-ossp, pg_trgm)

2. **Implement database schema**
   - Review `.project/04-Database_Schema.md` thoroughly
   - Create migration files (001_initial_schema.sql)
   - MedusaJS compatible schema
   - Indexes for performance

3. **Configure RLS policies**
   - Row Level Security for multi-tenancy
   - Policies for each table
   - Test policies thoroughly

4. **Add seed data**
   - Sample products
   - Sample users (for testing)
   - Sample orders (for testing)

5. **Test connection**
   - Connection from local machine
   - Verify RLS policies work
   - Test migrations rollback

### Files to Create

```
backend/
  migrations/
    001_initial_schema.sql      # Main schema
    002_rls_policies.sql        # RLS policies
    003_seed_data.sql           # Sample data
  lib/
    supabase/
      client.ts                 # Supabase client
      types.ts                  # Generated types
      migrate.ts                # Migration runner
```

### Success Criteria

- ✅ Supabase project created
- ✅ Schema implemented correctly
- ✅ RLS policies active and tested
- ✅ Seed data inserted
- ✅ Connection works from backend

### Estimated LOC

~400+ LOC

### Labels

`human-required`, `high-risk`, `Infra`

### Implementation Approach

```bash
/fetch-linear-ticket CORE-5
/create-implementation-plan
/execute-plan-phase
```

**Critical:** Follow `.cursor/rules/30-database_postgres.md` for best practices.

---

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

---

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

---

## Timeline & Milestones

### Week 1

**Days 1-2:** CORE-15 + CORE-4 (parallel after CORE-15)
- Day 1 Morning: CORE-15 (env configuration)
- Day 1 Afternoon: Start CORE-4 (GitHub setup)
- Day 2: Finish CORE-4, start CORE-5

**Days 3-4:** CORE-5 (database setup)
- Day 3: Schema design + migrations
- Day 4: RLS policies + seed data

### Week 2

**Days 5-7:** CORE-6 (backend setup)
- Day 5: MedusaJS initialization
- Day 6: Stripe + Clerk integrations
- Day 7: Sentry + API structure

**Days 8-9:** CORE-7 (frontend setup)
- Day 8: Next.js + Tailwind + shadcn/ui
- Day 9: Design tokens + layout + API test

**Day 10:** Buffer & Validation
- Run full integration test
- Validate all 5 tasks complete
- Document any issues

### Total Timeline

**Estimated:** 10 days (2 weeks for solo dev)  
**Buffer:** +2 days for unexpected issues  
**Target Completion:** End of Week 2

---

## Risk Mitigation

### High-Risk Areas

1. **CORE-5 (Database Schema)**
   - Risk: RLS policies incorrect → security breach
   - Mitigation: Thorough testing, peer review, follow `.cursor/rules/30-database_postgres.md`

2. **CORE-6 (Backend Integrations)**
   - Risk: Stripe webhook failures, Clerk auth issues
   - Mitigation: Test webhooks locally with Stripe CLI, test auth with different user types

3. **Environment Variables**
   - Risk: Secrets leaked in git
   - Mitigation: Pre-commit hooks, regular secrets audit, follow `.cursor/rules/22-security_secrets.md`

### Contingency Plans

- If CORE-5 takes longer: Simplify schema, add advanced features later
- If CORE-6 integrations fail: Start with basic MedusaJS, add plugins incrementally
- If CORE-7 design tokens missing: Use shadcn defaults, refine later

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

- [ ] All 5 tasks in "Done" status
- [ ] Backend runs locally without errors
- [ ] Frontend runs locally without errors
- [ ] Database connected and queryable
- [ ] CI/CD pipeline green
- [ ] All env vars working
- [ ] No console errors or warnings
- [ ] Security review passed

---

## After Foundation Phase

Once all 5 tasks are complete:

1. **Celebrate! 🎉** You've built the entire foundation for Beauty Shop.

2. **Validate Setup:**
   - Run full integration test (backend → database → frontend)
   - Verify all services communicate
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

---

## Resources

**Documentation:**
- [.project/GETTING_STARTED.md](../GETTING_STARTED.md) – How to get started
- [.cursor/commands/README.md](../../.cursor/commands/README.md) – All commands
- [.cursor/commands/PLAN-BASED-WORKFLOW.md](../../.cursor/commands/PLAN-BASED-WORKFLOW.md) – Workflow guide

**Linear Issues:**
- [CORE-15: Environment Configuration](https://linear.app/beauty-shop/issue/CORE-15)
- [CORE-4: GitHub Repository Setup](https://linear.app/beauty-shop/issue/CORE-4)
- [CORE-5: Supabase Database Setup](https://linear.app/beauty-shop/issue/CORE-5)
- [CORE-6: MedusaJS Backend Setup](https://linear.app/beauty-shop/issue/CORE-6)
- [CORE-7: Next.js Frontend Setup](https://linear.app/beauty-shop/issue/CORE-7)

**Tech Guides:**
- [.project/06-Backend_Guide.md](../06-Backend_Guide.md) – Backend guide
- [.project/07-Frontend_Guide.md](../07-Frontend_Guide.md) – Frontend guide
- [.project/04-Database_Schema.md](../04-Database_Schema.md) – Database schema

---

**Ready to start?** Run: `/fetch-linear-ticket CORE-15` 🚀

*Last updated: October 21, 2025*  
*Maintained by: Nicklas Eskou*

