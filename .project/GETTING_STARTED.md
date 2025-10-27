# 🚀 Getting Started – Beauty Shop

**Welcome to Beauty Shop!** This guide will help you get started with the project, whether you're a new developer joining the team or the founder starting the Foundation Phase.

---

## 📊 Current Status

**Phase:** Foundation Phase (Completed ✅)  
**Current Sprint:** MVP Development  
**Architecture:** Simple MedusaJS + Next.js structure (CORE-19)

---

## 🎯 Foundation Phase (COMPLETED)

✅ **CORE-19: Fix Fundamental Architecture** (Completed January 24, 2025)
   - Fresh MedusaJS installation via `create-medusa-app`
   - Next.js 15 storefront (integrated)
   - Supabase database configuration
   - Custom schema migrations
   - **Result:** Fully functional setup in ~4 hours
   - **Replaced:** Failed CORE-16 Turborepo monorepo

**Key Learnings:**
- ❌ CORE-16 (Turborepo monorepo) failed after 8+ hours
- ✅ CORE-19 (Simple MedusaJS setup) succeeded in 4 hours
- **Lesson:** Follow official documentation, don't fight the framework

**Architecture Decision:**
The project now uses a simple two-directory structure:
- `beauty-shop/` - MedusaJS backend + admin
- `beauty-shop-storefront/` - Next.js storefront

No Turborepo, no shared packages, no unnecessary complexity.

---

## 🛠️ How to Use This Workspace

### 1. Read Core Documentation

Start here to understand the project:

- **[.project/README.md](.project/README.md)** – Overview of all documentation
- **[.project/01-Project_Brief.md](./01-Project_Brief.md)** – Vision, goals, target users
- **[.project/02-Product_Requirements_Document.md](./02-Product_Requirements_Document.md)** – Complete PRD with features, tech stack, timeline
- **[.cursor/commands/README.md](../.cursor/commands/README.md)** – All available Cursor commands

### 2. Review Tech Stack & Guides

- **[.project/03-Tech_Stack.md](./03-Tech_Stack.md)** – Technologies we're using
- **[.project/06-Backend_Guide.md](./06-Backend_Guide.md)** – Backend (MedusaJS) guide
- **[.project/07-Frontend_Guide.md](./07-Frontend_Guide.md)** – Frontend (Next.js) guide
- **[.project/04-Database_Schema.md](./04-Database_Schema.md)** – Database schema
- **[.project/05-API_Design.md](./05-API_Design.md)** – API design patterns

### 3. Setup Local Environment

**Prerequisites:**
- Node.js 20+
- npm 10+ (or pnpm 8+)
- GitHub CLI (optional, but recommended)
- Cursor IDE (with Linear + GitHub MCP configured)

**Environment Setup:**
```bash
# Clone repo (if not already)
git clone https://github.com/eskoubar95/beauty-shop.git
cd beauty-shop

# Backend setup
cd beauty-shop
cp .env.example .env
# Edit .env with your Supabase credentials
npm install

# Storefront setup
cd ../beauty-shop-storefront
cp .env.local.example .env.local
# Edit .env.local with your MedusaJS backend URL
npm install

# Run migrations
cd ../beauty-shop
npx medusa db:migrate

# Create admin user
npx medusa user -e admin@medusajs.com -p supersecret

# Configure Medusa Admin
# 1. Create Region (Settings → Regions)
# 2. Create Sales Channel (Settings → Sales Channels)
# 3. Link Publishable API Key to Sales Channel

# Fill in your secrets (see .project/secrets-management.md)
```

### 4. Configure Cursor Tools

**Linear MCP:**
- Installed: ✅ (based on commands)
- Team: CORE
- Used for: Fetching issues, updating status, creating comments

**GitHub MCP:**
- Installed: ✅ (based on commands)
- Repo: eskoubar95/beauty-shop
- Used for: PRs, commits, branch management, Copilot assignment

**Verify MCP:**
```bash
# In Cursor, run:
/fetch-linear-ticket CORE-15
```

If this works, your Linear MCP is configured correctly.

---

## 📋 Workflow: How to Work on an Issue

### Option 1: Human Implementation (Complex Tasks)

**For:** Foundation Phase, high-risk, > 400 LOC, novel patterns

```
1. Fetch the Linear issue:
   /fetch-linear-ticket CORE-15

2. Research existing patterns (if applicable):
   /research-feature-patterns

3. Create implementation plan (if > 400 LOC):
   /create-implementation-plan

4. Execute phase by phase:
   /execute-plan-phase

5. Run quality checks before PR:
   /prepare-pr

6. Self-review:
   /review-pr-self

7. Create PR with Linear link:
   /create-pr-with-linear
```

### Option 2: GitHub Copilot (Simple Tasks)

**For:** Well-defined, < 400 LOC, existing patterns, repetitive work

**NOT for Foundation Phase** (all Foundation issues are `human-required`)

```
1. Create Linear issue with proper labels:
   /create-linear-issue feature "Add price filter to catalog"

2. Move issue to "Planned" status in Linear UI
   → Make.com auto-creates GitHub issue

3. Assign Copilot:
   /assign-copilot-to-issue [github-issue-number]

4. Monitor Copilot progress on GitHub
5. Review PR when Copilot is done
```

---

## ⚡ Quick Start: Development

### Step 1: Start Backend

```bash
cd beauty-shop
npm run dev
```

Backend available at: `http://localhost:9000`  
Admin available at: `http://localhost:9000/app`

### Step 2: Start Storefront

```bash
# In a separate terminal
cd beauty-shop-storefront
npm run dev
```

Storefront available at: `http://localhost:8000`

### Step 3: Start Working on Features

```bash
# Fetch your Linear ticket
/fetch-linear-ticket CORE-XX

# Create implementation plan (if complex)
/create-implementation-plan CORE-XX

# Execute phase by phase
/execute-plan-phase .project/plans/[plan-file].md 0

# Run quality checks before PR
/prepare-pr

# Create PR
/create-pr-with-linear CORE-XX
```

### Architecture Reference

See the complete setup guide in the root `README.md` or refer to:
- `08-Architecture.md` - Complete architecture documentation
- `.project/lessons-learned.md` - CORE-19 post-mortem and learnings

---

## 🧭 Navigation: Commands Overview

### Planning & Research
- `/fetch-linear-ticket [id]` – Fetch Linear issue details
- `/research-feature-patterns` – Research existing code patterns
- `/create-implementation-plan` – Create structured implementation plan
- `/validate-plan` – Validate plan quality

### Implementation
- `/execute-plan-phase` – Execute plan phase by phase
- `/setup-nextjs-feature` – Quick Next.js feature setup (< 400 LOC)
- `/database-migration` – Create database migration
- `/rhf-zod-form` – Create RHF + Zod form
- `/design-api-resource` – Design API resource

### Quality & Testing
- `/prepare-pr` – Run all pre-PR checks
- `/review-pr-self` – Self-review code changes
- `/write-unit-tests` – Generate unit tests
- `/add-tests-for-changes` – Add missing tests for changes
- `/debug-issue` – Debug and fix issues
- `/lint-fix` – Fix linting issues
- `/accessibility-audit` – WCAG compliance audit
- `/security-audit` – Security review
- `/optimize-performance` – Performance optimization

### GitHub & Linear Integration
- `/create-pr-with-linear [issue-id]` – Create PR with Linear link
- `/update-linear-status [issue-id] [status]` – Update Linear issue status
- `/create-linear-issue [type] [title]` – Create new Linear issue
- `/assign-copilot-to-issue [issue-number]` – Assign Copilot to GitHub issue

### Documentation
- `/add-documentation` – Generate code documentation
- `/update-docs-from-changes` – Update docs based on changes

### Maintenance
- `/cleanup-branch` – Remove debug code and unlinked TODOs
- `/validate-commits` – Validate Conventional Commits
- `/refactor-code` – Refactor for quality

**Full list:** See [.cursor/commands/README.md](../.cursor/commands/README.md)

---

## 🔗 Linear Workflow

### Issue Lifecycle

```
Backlog → Triage → Planned → In Progress → In Review → Done
```

### Labels System

**Area Labels** (mutually exclusive):
- `Analytics`, `Auth`, `Backend`, `CMS`, `Frontend`, `Infra`, `Payments`

**Automation Labels:**
- `copilot-ready` – Can be assigned to GitHub Copilot
- `human-required` – Requires human developer
- `needs-research` – Research required first
- `high-risk` – Auth, payments, PII, or critical infra
- `tech-debt` – Code quality improvement
- `breaking-change` – Non-backward compatible

**Type Labels:**
- `Bug`, `Chore`, `Feature`, `Spike`

**Scope Labels:**
- `Internal`, `MVP`, `Post-MVP`

**Status Indicators:**
- `blocked` – Waiting on external dependency
- `ready-to-merge` – Approved, ready for merge

### Working with Linear

```bash
# Fetch issue details
/fetch-linear-ticket CORE-15

# Update status
/update-linear-status CORE-15 "In Progress"

# Create new issue
/create-linear-issue feature "Add product variant selector"
```

---

## 📦 GitHub Workflow

### Branch Naming

```
feature/CORE-15-environment-configuration
fix/CORE-23-checkout-bug
chore/CORE-99-update-deps
```

Format: `{type}/CORE-{id}-{short-title}`

### Commit Messages

Use Conventional Commits:
```
feat: add environment configuration for dev and prod
fix: resolve database connection timeout
chore: update dependencies
docs: add getting started guide
```

Generate commit message:
```bash
/generate-commit-message
```

### Pull Requests

**Create PR:**
```bash
/create-pr-with-linear CORE-15
```

**PR Requirements:**
- ✅ Green CI (lint, typecheck, tests, build)
- ✅ 1+ human review
- ✅ Linear issue linked
- ✅ Description includes: WHAT/WHY/HOW, risks, test plan

**PR Template auto-includes:**
- Summary of changes
- Related Linear issue
- Test plan
- Affected areas
- Rollback plan

---

## 🧪 Testing & Quality

### Run All Checks

```bash
# Via command:
/prepare-pr

# Or manually:
pnpm run check
```

This runs:
1. Prettier (format check)
2. ESLint (lint)
3. TypeScript (typecheck)
4. Tests (unit + integration)
5. Secrets check (no .env committed)
6. Build

### Fix Issues

```bash
# Fix linting:
/lint-fix

# Fix tests:
/run-all-tests-and-fix

# Debug specific issue:
/debug-issue
```

---

## 🎓 Onboarding Checklist

### For New Developers

- [ ] Read `.project/README.md`
- [ ] Read `.project/01-Project_Brief.md`
- [ ] Skim `.project/02-Product_Requirements_Document.md`
- [ ] Review relevant tech guide (Backend or Frontend)
- [ ] Read `.cursor/commands/README.md`
- [ ] Install Linear MCP in Cursor
- [ ] Install GitHub MCP in Cursor
- [ ] Clone repository
- [ ] Review Foundation Phase issues in Linear
- [ ] Pick first task (start with CORE-15 if available)
- [ ] Run `/onboard-new-developer` command for detailed walkthrough

### For Founders/Solo Devs

- [ ] Read all `.project/` docs
- [ ] Review Foundation Phase plan (this file)
- [ ] Setup Linear + GitHub integrations
- [ ] Configure Make.com workflow (Linear → GitHub)
- [ ] Start CORE-15 (Environment Configuration)
- [ ] Complete Foundation Phase in order
- [ ] Re-create MVP issues with better structure after Foundation

---

## 🚦 What's Next After Foundation?

Once all 5 Foundation issues are done:

1. **Validate Foundation Setup:**
   - Backend runs locally
   - Frontend runs locally
   - Database connected
   - CI/CD pipeline green
   - All env vars working

2. **Re-create MVP Issues:**
   - Use `/create-linear-issue` for each MVP feature
   - Include proper labels, LOC estimates, technical context
   - Decide copilot-ready vs human-required per issue

3. **Start MVP Development:**
   - Product Catalog (CORE-8)
   - Shopping Cart (CORE-9)
   - Checkout Flow (CORE-10)
   - User Authentication (CORE-11)
   - Waitlist (CORE-12)
   - Landing Page (CORE-13)
   - Starter Kit Product (CORE-14)

4. **Follow Plan-Based Workflow:**
   - See [.cursor/commands/PLAN-BASED-WORKFLOW.md](../.cursor/commands/PLAN-BASED-WORKFLOW.md)

---

## 📞 Need Help?

**Documentation:**
- [.project/README.md](./README.md) – All documentation
- [.cursor/commands/README.md](../.cursor/commands/README.md) – All commands
- [.cursor/commands/PLAN-BASED-WORKFLOW.md](../.cursor/commands/PLAN-BASED-WORKFLOW.md) – Plan-based development guide

**Commands:**
- `/onboard-new-developer` – Detailed onboarding walkthrough
- `/fetch-linear-ticket [id]` – Get issue details with context
- `/research-feature-patterns` – Research existing patterns

**External Resources:**
- [Linear Workspace](https://linear.app/beauty-shop)
- [GitHub Repository](https://github.com/eskoubar95/beauty-shop)
- [Notion Documentation](https://www.notion.so/2899946d4ef5806eb1fdf9e6c662763b)

---

**Ready to start?** Run: `/fetch-linear-ticket CORE-15` 🚀

*Last updated: January 24, 2025*  
*Maintained by: Nicklas Eskou*  
*Architecture: Simple MedusaJS + Next.js (CORE-19)*

