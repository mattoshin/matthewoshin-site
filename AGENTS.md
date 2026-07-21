<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Matthew Oshin — Personal Site

## What this is
- Public portfolio at **matthewoshin.com**: ocean WebGL descent, project demos, blog, about.
- Fully public. No auth. Demos live under `/app/*` (Mocean, Galactic, Sigma, etc.).

## Stack
- **Next.js 16** + React 19 + TypeScript + Tailwind v4
- **r3f / drei / postprocessing** for the ocean scene; **gsap** + **lenis** for scroll/motion
- **pnpm** (pinned in package.json)

## Branch + deploy
- **Vercel** project `matthewoshin-site`, git-connected: merge/push to `main` auto-deploys production.
- Work on a feature branch, open a PR to `main`. Once CI is green and the change is verified, the agent MERGES the PR itself and announces the deploy. Matthew can veto after the fact; do not park merges in his court.
- Live URL: https://matthewoshin.com

## Parallel sessions and worktrees
- Multiple agent sessions often run against this repo at once. NEVER work directly in a checkout another session may be using: create your own `git worktree` for your branch and work there.
- Commit only the files you changed (never `git add -A` in a shared tree). Leave other sessions' uncommitted files alone.
- When merging a PR whose branch is checked out in someone else's worktree, keep the remote branch (skip `--delete-branch`) so you don't yank it out from under them.

## Commands
- `pnpm dev` — local dev
- `pnpm test` — vitest (`src/__tests__/`)
- `pnpm typecheck` — typegen + tsc
- `pnpm build` — production build (also gated in CI)

## Design rules
- Keep the **cartoon ocean** aesthetic. User rejected the dark "Deep" cinematic redesign.
- 14 creatures in the descent zone (was 16; the speedboat+skier and dolphin were removed 2026-07-21 for a "lowkey" pass — see docs/superpowers/specs/2026-07-21-lowkey-ocean-scene-design.md). Do not regress below 14 or spacing.
- Georgia for display headings on content pages; ocean chrome uses the existing token system.

## Gotchas
- `main` has no branch protection yet (TODOS.md P2), but always go through a PR anyway.
- Heavy WebGL: test perf impact before adding postprocessing passes.
- Content lives in `src/data/`. Blog posts in `content/blog/`.

## Do not
- Add auth to this repo (private tools belong in oshin-os / oshin-jobsearch).
- Push directly to `main` — every change goes through a PR with green CI.
- Commit `.env*` files.

## Testing

- `pnpm test` runs the vitest suite (`src/__tests__/`), ~1s. See TESTING.md.
- CI (`.github/workflows/test.yml`) gates every PR and push to main on `pnpm typecheck`, `pnpm test`, and `pnpm build`.
- When adding a feature or fixing a bug, add or update a test in the same change.
- Never commit code that fails `pnpm test` or `pnpm typecheck`.
