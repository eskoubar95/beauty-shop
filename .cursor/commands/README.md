# Beauty Shop – Cursor Commands

Reusable AI prompts for Beauty Shop development workflows. Type `/` in Cursor AI chat to access any command.

**Total:** 35 commands (19 original + 16 new)

## 🆕 NEW: Plan-Based Development Workflow

For large features (>400 LOC), see **[PLAN-BASED-WORKFLOW.md](./PLAN-BASED-WORKFLOW.md)** for the complete guide to:
- 14 new commands inspired by HumanLayer
- Phase-based implementation with checkpoints
- Full Linear + GitHub MCP integration
- Structured planning → research → implementation → PR workflow

**Quick start:** `/fetch-linear-ticket` → `/create-implementation-plan` → `/execute-plan-phase`

---

## 📋 Quick Reference

### Development & Features
- `/setup-nextjs-feature` - Scaffold Next.js 15 feature (App Router, React 19)
- `/api-resource` - Design/implement versioned API resource
- `/rhf-zod-form` - React Hook Form + Zod validation with server actions
- `/postgres-migration-rls` - Database migration + RLS policies
- `/feature-flags` - Setup/gate feature with LaunchDarkly
- `/sentry-instrumentation` - Add Sentry monitoring (errors, breadcrumbs)

### Testing & Quality
- `/write-unit-tests` - Generate comprehensive unit tests
- `/run-all-tests-and-fix` - Run test suite, identify failures, fix issues
- `/lint-fix` - Auto-fix linting and formatting issues
- `/code-review` - Comprehensive PR review checklist
- `/accessibility-audit` - WCAG 2.1 AA compliance check
- `/security-audit` - Security vulnerability scan

### Debugging & Optimization
- `/debug-issue` - Systematic debugging workflow
- `/optimize-performance` - Analyze and improve performance
- `/refactor-code` - Improve code quality while preserving functionality

### Documentation & Collaboration
- `/add-documentation` - Generate/update comprehensive documentation
- `/generate-commit-message` - Create Conventional Commit message
- `/generate-pr-description` - Generate PR description from changes
- `/onboard-new-developer` - Complete onboarding checklist

---

## 🎯 Commands by Category

### 🏗️ Development & Features

#### `/setup-nextjs-feature`
Scaffold production-grade Next.js 15 feature with React 19.

**When to use:**
- Starting new feature or page
- Need complete setup with routes, components, services
- Want best practices built-in

**Delivers:**
- UI route and components
- Server actions with business logic
- Domain types (DTOs, schemas)
- API integration
- Feature flag guard
- Sentry instrumentation
- Tests (unit, integration, render)

**Example:**
```
/setup-nextjs-feature

Feature: Product listing
Route: /products
Model: Product with variants, pricing, inventory
Flag: product-catalog-v2
```

---

#### `/api-resource`
Design and implement versioned API resource.

**When to use:**
- Creating new API endpoint
- Need RESTful resource structure
- Want consistent error handling

**Delivers:**
- Versioned routes (`/api/v1/resource`)
- DTOs and validation schemas
- Consistent error responses
- Pagination (cursor-based)
- Authorization checks
- Tests

**Example:**
```
/api-resource

Resource: Orders
Operations: list, get, create, update
Entities: Order, OrderItem, Customer
```

---

#### `/rhf-zod-form`
Create form with React Hook Form + Zod validation and server actions.

**When to use:**
- Building any form (checkout, contact, settings)
- Need validation with type safety
- Want server-side processing

**Delivers:**
- Zod validation schema
- RHF form component
- Server action for submission
- Error handling (field-level + summary)
- Loading states
- Tests

**Example:**
```
/rhf-zod-form

Form: Checkout
Fields: email, firstName, lastName, address, postalCode, city
Submit: Create order, process payment
```

---

#### `/postgres-migration-rls`
Create PostgreSQL migration with Row Level Security policies.

**When to use:**
- Database schema changes
- Need Supabase RLS policies
- Want secure data access

**Delivers:**
- Up/down migrations
- RLS policies for auth
- Indexes for performance
- Migration tests

**Example:**
```
/postgres-migration-rls

Table: orders
Columns: id, user_id, total, status, created_at
RLS: Users can only access their own orders
```

---

#### `/feature-flags`
Setup feature behind LaunchDarkly flag.

**When to use:**
- Gradual feature rollout
- A/B testing
- Kill switch for risky features

**Delivers:**
- Flag utility wrapper
- Guarded code paths with safe defaults
- Analytics breadcrumb
- Documentation (purpose, rollout plan)
- Tests (flag on/off behavior)

**Example:**
```
/feature-flags

Flag: checkout.subscription.enabled
Rollout: 10% of users, then scale to 100%
Fallback: Regular one-time purchase
```

---

#### `/sentry-instrumentation`
Add Sentry error tracking and performance monitoring.

**When to use:**
- New feature needs monitoring
- Want error context for debugging
- Performance tracking needed

**Delivers:**
- Sentry initialization
- Error capture with context (no PII)
- Breadcrumbs for user actions
- Performance spans
- Test verification

**Example:**
```
/sentry-instrumentation

Feature: Checkout flow
Track: Page views, button clicks, API calls, errors
Context: Order ID, payment status (no card details)
```

---

### ✅ Testing & Quality

#### `/write-unit-tests`
Generate comprehensive unit tests for code.

**When to use:**
- New feature needs test coverage
- Refactoring existing code
- Want to prevent regressions

**Test types:**
- **Components:** Render, interactions, accessibility
- **Services:** Happy path, error handling, edge cases
- **Server Actions:** Validation, auth, transactions

**Example:**
```
/write-unit-tests

Target: lib/services/orders/create-order.ts
Scenarios:
- Valid order creation
- Invalid payment method
- Out of stock items
- Authorization failure
```

---

#### `/run-all-tests-and-fix`
Execute test suite, triage failures, and fix issues.

**When to use:**
- Before merging PR
- After refactoring
- CI/CD failed

**Process:**
1. Run full test suite
2. Categorize failures (assertion, runtime, timeout, mock)
3. Prioritize (critical → important → low)
4. Fix issues systematically
5. Verify all tests pass

**Example:**
```
/run-all-tests-and-fix

After refactoring price calculation logic, 5 tests failed.
Identify issues and fix while maintaining test quality.
```

---

#### `/lint-fix`
Auto-fix linting, formatting, and code style issues.

**When to use:**
- Before committing code
- After bulk code changes
- Fixing code style violations

**Fixes:**
- ESLint errors/warnings
- Prettier formatting
- TypeScript type issues
- Next.js specific rules
- Unused imports
- Console.log statements

**Example:**
```
/lint-fix

Fix all auto-fixable issues in current file or entire codebase.
```

---

#### `/code-review`
Comprehensive PR review against Beauty Shop standards.

**When to use:**
- Reviewing teammate's PR
- Self-review before requesting review
- Want structured feedback

**Reviews:**
- Code quality (SRP, naming, file size)
- Frontend (Next.js, React, performance)
- Security (no secrets, input validation, no PII)
- Accessibility (WCAG AA compliance)
- Testing (coverage, quality)
- Documentation

**Example:**
```
/code-review

PR: feature/BS-152-product-catalog
Review against all rules in .cursor/rules/
Check security, performance, accessibility, tests.
```

---

#### `/accessibility-audit`
WCAG 2.1 Level AA compliance audit.

**When to use:**
- New UI feature
- Before production release
- Accessibility bug reported

**Checks:**
- Keyboard navigation
- Screen reader compatibility
- Color contrast (4.5:1 for text)
- Alt text on images
- Form labels
- Focus indicators
- Semantic HTML

**Example:**
```
/accessibility-audit

Feature: Checkout flow
Ensure keyboard-only navigation, screen reader announcements,
and proper ARIA labels throughout 3-step checkout.
```

---

#### `/security-audit`
Security vulnerability scan for e-commerce platform.

**When to use:**
- Payment/auth features
- Before production deployment
- Security bug reported

**Scans for:**
- Hardcoded secrets
- SQL injection risks
- XSS vulnerabilities
- CSRF protection
- No PII in logs
- Payment security (PCI DSS)
- GDPR compliance

**Example:**
```
/security-audit

Feature: Payment processing with Stripe
Check: No card storage, webhook verification, amount validation,
no sensitive data in logs/errors.
```

---

### 🐛 Debugging & Optimization

#### `/debug-issue`
Systematic debugging workflow for identifying root cause.

**When to use:**
- Bug reported by user or QA
- Tests failing unexpectedly
- Production error in Sentry

**Process:**
1. Gather information (error, environment, steps to reproduce)
2. Reproduce issue locally
3. Isolate problem (specific file/function)
4. Analyze root cause
5. Propose solution with code

**Example:**
```
/debug-issue

Issue: Checkout fails on mobile Safari
Error: "Payment validation failed"
Environment: iOS 16, Safari
User: Completed shipping step, failed at payment
```

---

#### `/optimize-performance`
Analyze and optimize for < 2 second page load time.

**When to use:**
- Lighthouse score < 90
- Core Web Vitals failing
- Page feels slow
- Before production launch

**Optimizes:**
- Bundle size (code splitting)
- Images (Next.js Image, WebP)
- React performance (memo, virtualization)
- API calls (batching, caching)
- Database queries (indexes, N+1)
- Core Web Vitals (LCP, FID, CLS)

**Example:**
```
/optimize-performance

Page: Product listing (/products)
Issue: LCP 3.2s (target < 2.5s)
Large image, heavy JavaScript bundle, slow API
```

---

#### `/refactor-code`
Improve code quality while preserving functionality.

**When to use:**
- File > 400 LOC
- Code duplication
- Complex functions (> 50 lines)
- Poor naming
- Tech debt

**Improves:**
- Single Responsibility Principle
- File size (< 500 LOC)
- Function complexity
- Type safety (no `any`)
- DRY (Don't Repeat Yourself)

**Example:**
```
/refactor-code

File: components/checkout/CheckoutForm.tsx (687 LOC)
Issues: Multiple responsibilities, nested conditionals, duplication
Extract: separate components, utility functions
```

---

### 📝 Documentation & Collaboration

#### `/add-documentation`
Generate comprehensive code documentation.

**When to use:**
- New feature/API
- Complex logic needs explanation
- Public API needs docs

**Creates:**
- README files
- JSDoc comments
- API documentation
- Architecture Decision Records (ADR)
- Environment variables docs

**Example:**
```
/add-documentation

Target: lib/services/pricing/calculate-discount.ts
Document: Function purpose, parameters, return type,
business rules for discount calculation, examples
```

---

#### `/generate-commit-message`
Create Conventional Commit message from staged changes.

**When to use:**
- Ready to commit
- Want structured commit message
- Following team conventions

**Format:**
```
<type>(<scope>): <short summary>

WHY:
- Reason for change

HOW:
- Key implementation details

NOTES:
- Breaking changes, risks, follow-ups

Refs: BS-<issue-id>
```

**Example:**
```
/generate-commit-message

Staged changes:
- Added product sorting
- Updated API endpoint
- Added tests

Generate commit message following Conventional Commits.
```

---

#### `/generate-pr-description`
Generate PR description from changes.

**When to use:**
- Opening new PR
- Want complete PR description
- Following team template

**Includes:**
- WHAT: Summary of changes
- WHY: Context and motivation
- HOW: Key implementation decisions
- TESTS: Testing performed
- SCREENSHOTS: UI changes (if applicable)
- ROLLBACK: How to revert if needed

**Example:**
```
/generate-pr-description

Changes:
- Implemented product filtering
- Added price range slider
- Updated API to support filters

Generate complete PR description.
```

---

#### `/onboard-new-developer`
Complete onboarding checklist for new team member.

**When to use:**
- New developer joins team
- Intern/contractor onboarding
- Want consistent onboarding experience

**Covers:**
- Access & accounts setup
- Local environment
- Codebase tour
- Coding standards
- Development workflow
- First tasks
- Resources & help

**Example:**
```
/onboard-new-developer

New developer: Sarah
Background: 3 years React, new to Next.js 15
Start date: Monday
Generate personalized onboarding checklist.
```

---

## 💡 Using Commands

### In Cursor AI Chat:
1. Type `/` to see all available commands
2. Select the command you need
3. Cursor will load the prompt template
4. Fill in placeholders (e.g., `{{feature_name}}`)
5. Let AI execute the command

### Command Placeholders:
Most commands use placeholders:
- `{{feature_name}}` - Name of feature
- `{{route}}` - URL route
- `{{scope}}` - Code scope/area
- `{{file}}` - File path
- `{{issue_id}}` - Linear issue ID (BS-XXX)

### Example Session:
```
You: /setup-nextjs-feature

Cursor AI: I'll help you scaffold a new Next.js feature.
          Please provide:
          - Feature name: ?
          - Route: ?
          - Model brief: ?

You: - Feature name: Product reviews
     - Route: /products/[id]/reviews
     - Model: Review with rating, comment, user

Cursor AI: [Generates complete feature with routes, components,
           services, types, tests...]
```

---

## 🎨 Command Principles

All commands follow Beauty Shop standards:

### Code Quality
- **SRP:** Single Responsibility Principle
- **Small files:** < 500 LOC
- **Small functions:** < 50 lines
- **Type safety:** Explicit TypeScript types
- **No PII:** Never log personal data

### Testing
- **AAA pattern:** Arrange, Act, Assert
- **Coverage:** 80%+ for critical paths
- **Behavior testing:** Test what, not how
- **No snapshots:** Test specific behaviors

### Security
- **No secrets:** Environment variables only
- **Input validation:** All user inputs
- **No PII in logs:** Sanitize all logging
- **Authorization:** Check permissions server-side

### Beauty Shop Specific
- **Prices in minor units:** Store in øre (DKK * 100)
- **Danish locale:** UI strings in Danish
- **MedusaJS integration:** Type-safe API calls
- **GDPR compliance:** EU data residency

---

## 📚 Related Documentation

### Project Docs (`.project/`)
- `01-Project_Brief.md` - Vision and goals
- `02-Product_Requirements_Document.md` - Full requirements
- `03-Tech_Stack.md` - Technology decisions
- `04-Database_Schema.md` - Database structure
- `05-API_Design.md` - API conventions
- `06-Backend_Guide.md` - Backend development
- `07-Frontend_Guide.md` - Frontend development

### Coding Rules (`.cursor/rules/`)
- `00-foundations.mdc` - Core principles
- `10-nextjs_frontend.mdc` - Next.js standards
- `12-forms_actions_validation.mdc` - Form handling
- `21-api_design.mdc` - API design
- `22-security_secrets.mdc` - Security practices
- `24-observability_sentry.mdc` - Monitoring
- `25-feature_flags.mdc` - Feature flags
- `30-database_postgres.mdc` - Database guidelines
- `31-ci_cd_pipeline.mdc` - CI/CD workflow

---

## 🆕 Adding Custom Commands

Want to add your own command?

1. Create new `.md` file in `.cursor/commands/`
2. Use descriptive kebab-case name (e.g., `my-custom-command.md`)
3. Follow this template:

```markdown
# Command Title

Brief description of what this command does.

## Objective
Clear goal statement.

## Context
- Project-specific context
- Related rules/docs
- When to use this command

## Inputs
- {{placeholder1}}: Description
- {{placeholder2}}: Description

## Deliverables
1. Item 1
2. Item 2
3. Item 3

## Example
```
Example usage
```

## Checklist
- [ ] Item 1
- [ ] Item 2
```

4. Commit and push - command will be available immediately!

---

## ✨ Tips & Best Practices

### Command Selection
- **Start specific:** Use feature-specific commands first
- **Then general:** Use general commands (debug, refactor) for refinement
- **Combine:** Use multiple commands in sequence

### Prompt Engineering
- **Be specific:** Provide detailed context in placeholders
- **Reference docs:** Link to relevant `.project/` or `.cursor/rules/` docs
- **Examples:** Give examples of desired output

### Quality Control
- **Review output:** Always review AI-generated code
- **Run tests:** `npm run test` after using commands
- **Type check:** `npm run type-check` catches issues
- **Lint:** `npm run lint:fix` for style

### Workflow
```bash
# Typical development flow
1. /setup-nextjs-feature    # Create feature
2. /write-unit-tests         # Add tests
3. /lint-fix                 # Clean up code
4. /code-review              # Self-review
5. /generate-commit-message  # Commit
6. /generate-pr-description  # Open PR
```

---

## 🤝 Contributing

Found a bug in a command? Want to improve one?

1. Open issue in Linear (label: `cursor-commands`)
2. Make changes in `.cursor/commands/`
3. Test the command
4. Open PR with:
   - What changed
   - Why the change improves the command
   - Example usage

---

**Questions?** Ask in #dev-tooling Slack channel or tag @nicklas in Linear.

**Last updated:** October 2025  
**Maintainer:** Nicklas Eskou
