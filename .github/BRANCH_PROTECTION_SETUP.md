# Branch Protection Rules Setup

## Main Branch Protection

### Configuration Steps:
1. Go to Settings > Branches
2. Add rule for `main` branch
3. Configure the following settings:

### Required Settings:
- ✅ **Require a pull request before merging**
- ✅ **Require approvals: 1**
- ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**
- ✅ **Require linear history**
- ✅ **Include administrators**
- ✅ **Restrict pushes that create files larger than 100MB**

### Required Status Checks:
- `check` (Check & Test job)
- `security` (Security Audit job)

### Additional Settings:
- ✅ **Allow force pushes: No**
- ✅ **Allow deletions: No**
- ✅ **Restrict pushes to matching branches: Yes**

## Verification

After setup, verify that:
1. Direct pushes to main are blocked
2. PRs require approval
3. CI checks must pass before merge
4. Branch is protected from deletion

## Notes

- These settings ensure code quality and prevent accidental changes
- All changes must go through PR review process
- CI pipeline must pass all checks before merge
- Security audit must pass before deployment
