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
- Type: Poppins on everything that sits on the water (hero, nav wordmark, bucket labels, OceanAI) via `font-display`; Fraunces, the share card's serif, on every heading inside a glass panel (subpage titles and entries, case-study titles, pull quotes, blog prose headings, and the home descent panels' h2 and beat) via `font-serif` (`--font-fraunces` is loaded in `src/app/layout.tsx`, the token lives in `globals.css`, blog prose headings follow it). Don't put the serif on the scene: the Poppins-only pass (#53, 2026-06-24) was Matthew's own feedback that a serif clashed with the playful ocean. `src/__tests__/display-type.test.tsx` enforces the split.
- Small text links and icon buttons get the `hit` class (`src/app/globals.css`) for a centered 44px minimum tap target without changing how they look. Rows of `hit` elements need at least 44px vertical pitch so the invisible boxes don't overlap; the footer uses `gap-y-7` (28px) for its 18px-tall links.
- Subpages render through `PageShell` (`src/components/page/PageShell.tsx`), which takes `width` (`"wide"` default or `"reading"`), `backLink`, and `kicker` props. The blog index/post pages are the reading-width example (`width="reading"`, post pages add `backLink` and a date `kicker`).
- A card (rounded-xl/2xl, a border, a translucent fill) means "you can open this": use one only where the whole element is the link, like Portfolio and Writing. A non-clickable list of entries gets one of three patterns instead (design audit F-008, 2026-09-03, enforced by `src/__tests__/cards-only-where-clickable.test.tsx`): a timeline (`/experience`, one `--gutter` CSS variable drives the list's left padding, each dot's offset and the rule's position together, and each `li` draws its own rule segment via `::before` down to the next dot, with the last `li` hiding its segment); hairline rows (`/education`, `ul` with `divide-y`, entries with a slug rendered as a full-row `Link` with a trailing "Read more" arrow, the rest a plain row); or editorial columns (`/interests`, a two-column grid from `md`, a thin `border-t` rule above each entry). The About page's Education and "Off the clock" digests use the same two patterns (rows and columns) at a smaller size, with the shared `ReadMore` arrow (`src/components/page/ReadMore.tsx`) on linked rows.
- Add `role="list"` to any `ul`/`ol` whose markers are removed by Tailwind: WebKit drops the implicit list semantics once the default list style is gone, so the explicit role keeps `getByRole("list")` (and screen readers) working.

## Gotchas
- `main` has no branch protection yet (TODOS.md P2), but always go through a PR anyway.
- Heavy WebGL: test perf impact before adding postprocessing passes.
- Content lives in `src/data/`. Blog posts in `content/blog/`. The share-card
  tagline is `SITE.ogTagline` (built from the `FOCUS` const) in
  `src/data/content.ts`. Edit it there, not in `opengraph-image.tsx`.
- `assets/og/` (bundled fonts + pre-cropped portrait) is read at render time
  by `src/app/opengraph-image.tsx`. It's build-time input for the share card,
  not a public static asset, so don't move it under `public/`.
- The share card is served three ways: `/opengraph-image` (the versioned card
  Next generates from `opengraph-image.tsx`), `/twitter-image` (same card,
  re-exported for X), and `/og.png` (`src/app/og.png/route.ts`, a compat
  route for old cached links). All three render through the same file.
- Don't `rm -rf .next` (or delete `.next/dev`) while a dev server is running
  against this checkout, since it serves straight out of that build directory.
- The global `:focus-visible` rule in `src/app/globals.css` is unlayered CSS, so it beats Tailwind utility classes like `rounded-full`. It must stay outline-only (no `border-radius`) or it squares off every round pill/button the moment it takes focus. Don't add `focus-visible:outline-none` on individual buttons to "fix" the corners, that's how the OceanAI chat widget lost its focus ring.
- The portfolio card list lives in `src/data/portfolio-items.ts`, not the page file. It owns the `PortfolioItem`/`PortfolioCategory` types (`PortfolioGrid` re-exports them for existing importers) and sets a `thumb` per item. To add a card with a screenshot: add the item, add a matching `slug|url` line to `scripts/capture-portfolio-thumbs.sh`, run the script, and commit the resulting `public/portfolio/<slug>.webp`. `src/__tests__/portfolio-thumbnails.test.tsx` fails if any of the three is missing. Thumbnails are captured from production URLs, not localhost, so they never carry the dev indicator; a card with nothing live to screenshot (e.g. BriefBridge) omits `thumb` and renders text-only.

## Do not
- Add auth to this repo (private tools belong in oshin-os / oshin-jobsearch).
- Push directly to `main` — every change goes through a PR with green CI.
- Commit `.env*` files.

## Testing

- `pnpm test` runs the vitest suite (`src/__tests__/`), ~2s. See TESTING.md.
- CI (`.github/workflows/test.yml`) gates every PR and push to main on `pnpm typecheck`, `pnpm test`, and `pnpm build`, on Node 24 (matches Vercel production).
- A test that rasterizes the og-image card (next/og's wasm) must opt into
  `// @vitest-environment node`, because jsdom breaks the wasm's typed-array
  boundary. See TESTING.md.
- When adding a feature or fixing a bug, add or update a test in the same change.
- Never commit code that fails `pnpm test` or `pnpm typecheck`.
