# TODOS

## CI

### Add a production build gate
**Priority:** P3
CI runs typecheck + vitest but never `next build`, so Next-specific failures
(invalid metadata exports, RSC/client boundary violations, route conflicts)
only surface in the Vercel preview build. Either add a parallel `pnpm build`
job or make the Vercel preview deployment a required status check before merge.

### Pin GitHub Actions to commit SHAs
**Priority:** P3
`actions/checkout@v4`, `pnpm/action-setup@v4`, and `actions/setup-node@v4` are
tag-pinned in `.github/workflows/test.yml`. The workflow holds no secrets and a
read-only token, so risk is low; SHA-pin if it ever gains secrets or publish steps.

## Completed
