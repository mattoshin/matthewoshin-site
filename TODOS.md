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

## Portfolio

### mTrain thumbnail source redirects to www
**What:** `scripts/capture-portfolio-thumbs.sh` fails on `mtrain|https://mtrainstudio.com` because the site redirects to `https://www.mtrainstudio.com/`, so the mTrain thumbnail cannot be recaptured and the run stops there.
**Why:** The committed thumbnail is fine today, but a re-run aborts at mTrain and never reaches the sources after it.
**Context:** Found 2026-09-04 (v1.2.7.0) while verifying the exact-URL check; the old prefix check failed on it too. The thumbnails test binds the script URL to the card's `siteHref`, so the fix is to move both to the www host, or link the canonical host the site redirects to.
**Effort:** S
**Priority:** P2
**Depends on:** None

### /projects/mtrain links a View Demo to a missing route
**What:** The mTrain build has `demoHref: "/app/fitness-os"` but no such route exists under `src/app/app/`, so the case study renders a View Demo button that 404s.
**Why:** A dead demo button on a public case study.
**Context:** Pre-existing, surfaced by the 2026-09-04 adversarial review. Either restore the Fitness OS demo route or drop the demoHref from the mTrain build (the portfolio card already omits it).
**Effort:** S
**Priority:** P2
**Depends on:** None

### Live demo endpoints are open to anonymous spend
**What:** fintech.matthewoshin.com and gotomarket.matthewoshin.com run live Claude (and, for fintech, Apollo) calls for anonymous visitors, and /portfolio now links them first.
**Why:** A crawler or a bored visitor can burn API spend. The guard belongs in those repos (per-IP rate limits or a demo cap), not in this site, which only links them.
**Context:** Raised by Codex and the security specialist on 2026-09-04. Both apps were already public before this release.
**Effort:** M
**Priority:** P2
**Depends on:** None

## Completed
