# CORE-27 Merge Strategy - Step-by-Step Plan

## Situation Analysis

**Current State:**
- ✅ CORE-27 branch: `feature/CORE-27-implement-strapi-cms` (has merged main)
- ⚠️ CORE-23-24 branch: `feature/CORE-23-24-frontpage` (has PR, older than CORE-27)
- ⚠️ CORE-27 has uncommitted changes (many files modified/untracked)
- ✅ CORE-27 already includes CORE-23-24's commit (`413dfe4`) via merge from main
- ✅ CORE-27's changes should "overrule" CORE-23-24 (Strapi CMS replaces hardcoded content)

**Key Insight:**
CORE-27 has already merged main, which includes CORE-23-24's changes. CORE-27's Strapi CMS implementation replaces the hardcoded frontpage content from CORE-23-24, so CORE-27's changes take precedence.

---

## Step-by-Step Plan

### Phase 1: Prepare CORE-27 Branch ✅

**Goal:** Commit all current work and ensure branch is clean

#### Step 1.1: Review Uncommitted Changes
```bash
# See what's changed
git status

# Review key changes (optional - to understand what we're committing)
git diff --stat
```

#### Step 1.2: Stage and Commit All Changes
```bash
# Stage all changes (modified + untracked)
git add .

# Create comprehensive commit message
git commit -m "feat(CORE-27): implement Strapi CMS integration with i18n support

- Add Strapi CMS project (beauty-shop-cms)
- Implement Page content type with Dynamic Zones
- Add homepage sections (Hero, Brand Logos, Why, Steps, Products, Storytelling, FAQ, Final CTA)
- Implement i18n integration (da-DK, en locales)
- Add locale mapping utility (countryCode → locale)
- Implement fallback strategy for missing locales
- Add catch-all route for dynamic Strapi pages
- Update homepage to use Strapi as single source of truth
- Add CMS data fetching helpers (getHomepage, getPageBySlug)
- Configure i18n on all fields and components
- Add documentation (I18N_INTEGRATION.md, STRAPI_I18N_BUG_REPORT.md)

Replaces hardcoded frontpage content from CORE-23-24 with Strapi CMS."
```

#### Step 1.3: Verify Commit
```bash
# Check commit was created
git log --oneline -1

# Verify no uncommitted changes remain
git status
```

---

### Phase 2: Verify CORE-27 Includes CORE-23-24 Changes ✅

**Goal:** Confirm CORE-27 has all necessary changes from CORE-23-24

#### Step 2.1: Check Merge History
```bash
# Verify CORE-23-24's commit is in CORE-27's history
git log --oneline --graph --all | grep -E "(CORE-23|CORE-24|413dfe4)"

# Should show: CORE-27 includes commit 413dfe4 from CORE-23-24
```

#### Step 2.2: Verify No Conflicts
```bash
# Check if there are any conflicting changes
git diff feature/CORE-23-24-frontpage...feature/CORE-27-implement-strapi-cms --name-only

# Review any overlapping files (should be minimal - mostly .project/analysis files)
```

**Expected Result:** 
- CORE-27 includes CORE-23-24's commit via merge
- Overlapping files are mostly documentation/analysis
- No actual code conflicts (CORE-27 replaces CORE-23-24's hardcoded content with Strapi)

---

### Phase 3: Test CORE-27 Branch ✅

**Goal:** Ensure all tests pass and code works

#### Step 3.1: Run Type Check
```bash
cd beauty-shop-storefront
npm run typecheck
```

#### Step 3.2: Run Linter
```bash
npm run lint
```

#### Step 3.3: Run Build
```bash
npm run build
```

#### Step 3.4: Manual Testing Checklist
- [ ] `/dk` homepage loads from Strapi
- [ ] `/gb` homepage loads from Strapi (or fallback to da-DK)
- [ ] `/us` homepage loads from Strapi (or fallback to da-DK)
- [ ] Dynamic pages work (e.g., `/dk/about`)
- [ ] No console errors
- [ ] Strapi CMS runs locally (`http://localhost:1337`)

**If tests fail:** Fix issues before proceeding to Phase 4.

---

### Phase 4: Push and Create PR ✅

**Goal:** Push CORE-27 and create PR for review

#### Step 4.1: Push Branch
```bash
# Make sure you're on CORE-27 branch
git checkout feature/CORE-27-implement-strapi-cms

# Push to remote (force push if needed, but be careful!)
git push origin feature/CORE-27-implement-strapi-cms

# If branch exists remotely and has conflicts:
# git push origin feature/CORE-27-implement-strapi-cms --force-with-lease
```

#### Step 4.2: Create PR on GitHub
1. Go to: `https://github.com/eskoubar95/beauty-shop/pulls`
2. Click "New Pull Request"
3. Base: `main`
4. Compare: `feature/CORE-27-implement-strapi-cms`
5. Title: `feat(CORE-27): Implement Strapi CMS for marketing content, bundles and blog`
6. Description: Use template below

**PR Description Template:**
```markdown
## Summary
Implements Strapi CMS integration for homepage and dynamic pages, replacing hardcoded content from CORE-23-24.

## Changes
- ✅ Strapi CMS project setup (`beauty-shop-cms/`)
- ✅ Page content type with Dynamic Zones
- ✅ Homepage sections (Hero, Brand Logos, Why, Steps, Products, Storytelling, FAQ, Final CTA)
- ✅ i18n integration (da-DK, en locales)
- ✅ Locale mapping (countryCode → locale)
- ✅ Fallback strategy for missing locales
- ✅ Catch-all route for dynamic Strapi pages
- ✅ CMS data fetching helpers

## Testing
- ✅ Type check passed
- ✅ Lint passed
- ✅ Build passed
- ✅ Manual testing: `/dk`, `/gb`, `/us` all work
- ✅ Strapi CMS runs locally

## Impact on CORE-23-24
This PR **replaces** the hardcoded frontpage content from CORE-23-24 with Strapi CMS. CORE-23-24's PR should be closed/merged after this, as CORE-27 supersedes it.

## Next Steps
- Phase 4.5: Strapi Live Preview
- Phase 4.6: Documentation updates
- Deploy Strapi to Railway
```

#### Step 4.3: Link Linear Issue
- Add comment in PR: `Closes CORE-27` or `Related to CORE-27`
- Update Linear CORE-27 with PR link

---

### Phase 5: Handle CORE-23-24 PR ✅

**Goal:** Close or update CORE-23-24 PR since CORE-27 supersedes it

#### Step 5.1: Review CORE-23-24 PR
- Check if PR is still open
- Review what it changes vs CORE-27

#### Step 5.2: Decision Point

**Option A: Close CORE-23-24 PR** (Recommended)
- Add comment: "Superseded by CORE-27. CORE-27 includes CORE-23-24's changes via merge and replaces hardcoded content with Strapi CMS."
- Close PR
- Update Linear CORE-23 and CORE-24: "Superseded by CORE-27"

**Option B: Merge CORE-23-24 First** (Not recommended - creates merge conflicts)
- Only if CORE-27 doesn't include CORE-23-24's changes
- But we verified it does, so Option A is better

---

### Phase 6: CI/CD Verification ✅

**Goal:** Ensure PR tests pass

#### Step 6.1: Monitor PR Checks
- GitHub Actions should run automatically
- Check: Type check, lint, build, tests

#### Step 6.2: Fix Any Failures
- If tests fail, fix locally and push again
- Re-run checks

#### Step 6.3: Ready for Review
- All checks green ✅
- PR ready for code review
- Request reviewers if needed

---

## Commands Summary

```bash
# Phase 1: Commit all changes
git add .
git commit -m "feat(CORE-27): implement Strapi CMS integration with i18n support

[Full commit message from Step 1.2]"

# Phase 2: Verify includes CORE-23-24
git log --oneline --graph --all | grep -E "(CORE-23|CORE-24|413dfe4)"

# Phase 3: Test
cd beauty-shop-storefront
npm run typecheck
npm run lint
npm run build

# Phase 4: Push and create PR
git push origin feature/CORE-27-implement-strapi-cms
# Then create PR on GitHub

# Phase 5: Handle CORE-23-24 PR
# (Manual - close PR on GitHub, update Linear)

# Phase 6: Monitor CI/CD
# (Automatic - check PR status on GitHub)
```

---

## Risk Mitigation

### Risk 1: Merge Conflicts
**Mitigation:** CORE-27 already merged main (includes CORE-23-24), so conflicts unlikely.

### Risk 2: Tests Fail
**Mitigation:** Run tests locally before pushing (Phase 3).

### Risk 3: CORE-23-24 PR Still Needed
**Mitigation:** CORE-27 includes CORE-23-24's changes, so CORE-23-24 PR can be closed.

### Risk 4: Missing Changes
**Mitigation:** Verify CORE-27 includes CORE-23-24 commit (Phase 2).

---

## Success Criteria

✅ All uncommitted changes committed  
✅ CORE-27 includes CORE-23-24's changes  
✅ All tests pass (typecheck, lint, build)  
✅ PR created and linked to CORE-27  
✅ CORE-23-24 PR closed/updated  
✅ CI/CD checks pass  
✅ Ready for code review  

---

## Next Steps After Merge

1. Deploy Strapi CMS to Railway
2. Configure production database
3. Set up environment variables
4. Test production deployment
5. Continue with Phase 4.5 (Live Preview) and 4.6 (Documentation)

