# [Feature Name] Implementation Plan

## Overview
[Brief description of what we're implementing and why]

## Linear Issue
**Issue:** BS-XXX  
**Status:** [In Progress | Review | Done]  
**Priority:** [Low | Medium | High | Urgent]  
**Assignee:** [name]  
**Sprint:** [sprint name]

## Current State Analysis
[What exists now, what's missing, key constraints discovered]

### Key Discoveries:
- [Important finding with file:line reference]
- [Pattern to follow from existing codebase]
- [Constraint to work within]

## Desired End State
[A specification of the desired end state after this plan is complete, and how to verify it]

## What We're NOT Doing
[Explicitly list out-of-scope items to prevent scope creep]
- ❌ NOT doing: [item 1]
- ❌ NOT doing: [item 2]
- ❌ NOT doing: [item 3]

## Implementation Approach
[High-level strategy and reasoning for chosen approach]

---

## Phase 1: [Descriptive Name]

### Overview
[What this phase accomplishes and why it's first]

### Changes Required:

#### 1. [Component/File Group]
**File:** `path/to/file.ext`  
**Changes:** [Summary of changes needed]

```[language]
// Specific code to add/modify
// Include key snippets to guide implementation
```

**Rationale:** [Why this change is needed]

#### 2. [Another Component/File]
**File:** `path/to/another-file.ext`  
**Changes:** [Summary]

```[language]
// Code examples
```

### Success Criteria:

#### Automated Verification:
- [ ] Migration applies cleanly: `npm run migrate` (if applicable)
- [ ] Unit tests pass: `npm run test`
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:
- [ ] Feature works as expected when tested via UI
- [ ] Performance is acceptable (< 2 sec load time per PRD)
- [ ] Edge case handling verified manually
- [ ] No regressions in related features
- [ ] Accessibility tested (keyboard nav, screen reader)

**⚠️ PAUSE HERE** - Complete automated verification and manual testing before proceeding to Phase 2.

---

## Phase 2: [Descriptive Name]

### Overview
[What this phase accomplishes]

### Changes Required:

#### 1. [Component/File]
**File:** `path/to/file.ext`  
**Changes:** [Summary]

```[language]
// Code
```

### Success Criteria:

#### Automated Verification:
- [ ] Tests pass: `npm run test`
- [ ] Type check: `npm run type-check`
- [ ] Lint: `npm run lint`
- [ ] Build: `npm run build`

#### Manual Verification:
- [ ] [Specific manual test 1]
- [ ] [Specific manual test 2]
- [ ] [Specific manual test 3]

**⚠️ PAUSE HERE** - Complete verification before proceeding to Phase 3.

---

## Phase 3: [Descriptive Name]

[Similar structure... Add as many phases as needed]

---

## Testing Strategy

### Unit Tests:
- [What components/functions to unit test]
- [Key edge cases to cover]
- [Mock strategies for external dependencies]

### Integration Tests:
- [End-to-end scenarios to test]
- [API integration points to verify]
- [Data flow scenarios]

### Manual Testing Steps:
1. [Specific step to verify feature works]
2. [Another verification step]
3. [Edge case to test manually]
4. [Performance testing under load]
5. [Cross-browser/device testing if UI]

### Accessibility Testing:
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

## Performance Considerations
[Any performance implications, optimizations needed, or bottlenecks to watch]

## Security Considerations
[Security implications, data handling, input validation requirements]
- GDPR compliance for PII
- Input sanitization
- Authentication/authorization checks

## Migration Notes
[If applicable, how to handle existing data/systems, rollback strategy]

## Rollback Plan
[How to quickly rollback if issues arise in production]
1. [Rollback step 1]
2. [Rollback step 2]

## References
- **Linear Ticket:** [BS-XXX](https://linear.app/beauty-shop/issue/BS-XXX)
- **Related Research:** `.project/research/[relevant].md` (if applicable)
- **Similar Implementation:** `[file:line]` (reference to similar patterns in codebase)
- **ADRs:** (if architectural decisions were made)
- **Related PRs:** (if building on previous work)

## Implementation Notes
[Any additional notes, gotchas, or important context for implementation]

