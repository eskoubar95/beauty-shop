# Cursor Rules for Beauty Shop

This folder contains `.mdc` rule files consumed by Cursor to guide coding standards and AI collaboration.

Contents
- `00-foundations.mdc`: global engineering foundations
- `01-git_branch_pr.mdc`: branching and PR governance
- `02-ai_agents_collaboration.mdc`: Cursor/Copilot roles and workflow
- `10-nextjs_frontend.mdc`: Next.js 15 + React 19 patterns
- `21-api_design.mdc`: API principles
- `22-security_secrets.mdc`: security and secrets (error-level)
- `24-observability_sentry.mdc`: Sentry org `beauty-shop` and privacy
- `25-feature_flags.mdc`: LaunchDarkly naming/rollout

Conventions
- Each rule declares `owner`, `severity`, `globs`, `last_review`, `next_review`.
- Keep rules short, testable, and with examples.
- Use English for code/comments; product copy may vary by locale.

CI Enforcement
- Treat `severity: error` as a gate (lint/test/build fail).
- `warn` shows PR annotations; `info` adds comments only.

## How to contribute to rules
- Create a branch `chore/BS-<id>-rules-update`.
- Keep edits atomic; update one rule per PR when possible.
- Update `last_review`/`next_review` and the rule `owner` if it changes.
- Explain WHAT/WHY in PR; link to Notion/ADR if applicable.
- For breaking governance updates, add a short "rollout plan" in PR.


