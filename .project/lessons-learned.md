# Lessons Learned - CORE-19

**Date:** 2025-01-24
**Issue:** CORE-19 - Fix Fundamental Architecture - Fresh MedusaJS Setup

## What Went Wrong (CORE-16)

### Initial Approach ❌
We attempted to build a custom monorepo structure with Turborepo, manually installing MedusaJS, Next.js, and Payload CMS as separate apps.

**Problems:**
1. **Over-complicated architecture** - Custom monorepo with shared packages added unnecessary complexity
2. **Manual MedusaJS setup** - Tried to configure MedusaJS from scratch instead of using official CLI
3. **Separate app installation** - Installing apps separately instead of using Medusa's integrated approach
4. **Turborepo overhead** - Added build system complexity that wasn't needed
5. **Package management issues** - Multiple dependency conflicts with manual setup
6. **Migration confusion** - Trying to manually manage database schemas instead of letting MedusaJS handle it

### Root Cause
We didn't follow MedusaJS documentation and best practices. We tried to reinvent the wheel instead of using the provided tools.

## What Went Right (CORE-19)

### Correct Approach ✅

**Key Decisions:**
1. **Used official Medusa CLI** - `npx create-medusa-app` with proper flags
2. **Integrated storefront** - Used Medusa's built-in Next.js storefront option
3. **Proper directory structure** - Two directories: backend and storefront
4. **Let MedusaJS manage schemas** - Allowed MedusaJS to create its own tables automatically
5. **Custom schemas added separately** - Created `beauty_shop` schema for custom tables
6. **Clean environment setup** - Proper .env configuration with Supabase Transaction Pooler

### Implementation Phases

**Phase 0: Pre-Flight Check**
- Verified Supabase credentials
- Checked tool versions
- Measured baseline performance
- Created checklist

**Phase 1: Backup & Cleanup**
- Full backup of failed attempt
- Saved git stash for safety
- Identified salvageable components
- Cleaned up incorrect files

**Phase 2: Fresh Installation**
- Used `create-medusa-app` with `--skip-db` flag
- Installed integrated Next.js storefront
- Configured Supabase Transaction Pooler
- Ran MedusaJS migrations
- Created admin user

**Phase 3: Reintegration**
- Copied custom Supabase migrations
- Added utility scripts
- Created root package.json for convenience
- Verified database schemas

**Phase 4: Documentation & Cleanup**
- Updated README with correct setup
- Created .env.example files
- Documented lessons learned
- Clean architecture achieved

## Key Learnings

### 1. Always Use Official Tools
- ✅ Use `create-medusa-app` instead of manual setup
- ✅ Follow official documentation
- ✅ Don't reinvent the wheel

### 2. Keep It Simple
- ✅ Two directories instead of complex monorepo
- ✅ Let frameworks handle their own concerns
- ✅ Custom code only where needed

### 3. Database Management
- ✅ Let MedusaJS create its own tables
- ✅ Add custom schemas separately
- ✅ Use Supabase Transaction Pooler for production
- ✅ Proper schema separation (medusa, beauty_shop, payload)

### 4. Environment Configuration
- ✅ Use `.env` for backend
- ✅ Use `.env.local` for Next.js storefront
- ✅ Provide `.env.example` files
- ✅ Document all required variables

### 5. Progressive Enhancement
- ✅ Get basic setup working first
- ✅ Add custom features incrementally
- ✅ Test at each step
- ✅ Document as you go

## Technical Decisions

### Why Not Turborepo?
- **Overkill** - MedusaJS + Next.js don't need complex build orchestration
- **Added complexity** - More configuration to maintain
- **Not required** - Medusa CLI handles app creation

### Why Transaction Pooler?
- **Performance** - Better connection management
- **Scalability** - Handles concurrent connections
- **Production ready** - Supabase recommendation

### Why Two Separate Directories?
- **Clarity** - Clear separation of concerns
- **Simplicity** - Easier to understand and maintain
- **Medusa standard** - How MedusaJS is designed to work
- **Independent deployment** - Can deploy separately

## Timeline

**CORE-16 (Failed Attempt):** ~8 hours
- Multiple issues and reworks
- Conflicting dependencies
- Manual schema management
- Ultimately abandoned

**CORE-19 (Successful):** ~4 hours
- Clean, methodical approach
- Following documentation
- Proper tooling
- Working solution

## Success Metrics

### Before (CORE-16)
- ❌ Complex monorepo structure
- ❌ Multiple dependency conflicts
- ❌ Manual schema management
- ❌ Build issues
- ❌ TypeScript errors
- ❌ Never reached working state

### After (CORE-19)
- ✅ Simple, clean structure
- ✅ No dependency conflicts
- ✅ Automatic schema management
- ✅ Everything builds
- ✅ No TypeScript errors
- ✅ Fully working in 4 hours

## Recommendations for Future

### Do ✅
1. Follow official documentation
2. Use provided CLI tools
3. Start simple, add complexity gradually
4. Test incrementally
5. Document decisions
6. Use proper environment variables
7. Let frameworks handle their concerns

### Don't ❌
1. Try to be too clever with architecture
2. Manually configure what tools provide
3. Add complexity prematurely
4. Skip testing
5. Ignore documentation
6. Commit secrets
7. Fight the framework

## Resources

- [MedusaJS Installation](https://docs.medusajs.com/learn/installation)
- [MedusaJS Storefront Setup](https://docs.medusajs.com/learn/installation)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#using-pgblib-to-connect-with-connection-pooling)
- [MedusaJS Database Management](https://docs.medusajs.com/deployments/server/databases)

## Conclusion

The key lesson is: **follow the framework, don't fight it**. MedusaJS provides excellent tooling and documentation. By using the official CLI and following best practices, we achieved a working setup in half the time it took to create a broken one.

The simple architecture (two directories, proper environment setup, official tools) is much better than the complex monorepo we initially attempted.

