# TODOS

## CI

### Make the CI gate an actual gate
**Priority:** P2
Two gaps, confirmed 2026-07-06: (1) CI runs typecheck + vitest but never
`next build`, so Next-specific failures (invalid metadata exports, RSC/client
boundary violations, route conflicts) only surface in the Vercel build; (2)
main has NO branch protection (verified via the GitHub API), so under the
merge-on-green auto-deploy policy the workflow is advisory, not a gate, and a
direct push to main deploys before CI reports. Fix: add branch protection on
main requiring the `test` workflow (and ideally the Vercel preview deployment)
as status checks, and add a parallel `pnpm build` job or required Vercel check.

### Pin GitHub Actions to commit SHAs
**Priority:** P3
`actions/checkout@v4`, `pnpm/action-setup@v4`, and `actions/setup-node@v4` are
tag-pinned in `.github/workflows/test.yml`. The workflow holds no secrets and a
read-only token, so risk is low; SHA-pin if it ever gains secrets or publish steps.

## Completed
