# Testing

Tests let you move fast and ship with confidence. Without them, changes to
`content.ts` (which every page composes from) only break visibly in prod.

## Framework

- **vitest 4** + **@testing-library/react 16**, jsdom environment.
- Config: `vitest.config.ts` (maps the `@/` alias, picks up `src/**/*.test.{ts,tsx}`).
- One file opts out of jsdom per-file with `// @vitest-environment node`:
  `share-preview-render.test.ts` rasterizes the og-image card through next/og
  (satori + resvg wasm), and the wasm's typed-array boundary breaks when it
  crosses jsdom's realm. The rest of the suite stays on jsdom.

## Run

```bash
pnpm test          # full suite, ~2s
pnpm exec vitest   # watch mode
```

CI runs `pnpm typecheck`, `pnpm test`, and a separate `pnpm build` job on
every push and PR, on Node 24 (`.github/workflows/test.yml`).

## Layers

- **Data integrity** (`src/__tests__/content.test.ts`): content.ts invariants:
  unique build slugs, non-empty groups, slugged schools have story pages.
  Every route composes from this file, so this is the highest-value net.
- **Component composition** (`about-page`, `hero-section`, `bucket-nav`,
  `portfolio-page`, `projects-page` tests): render the real components, assert
  the links and sections a visitor relies on.
- **Portfolio thumbnails** (`portfolio-thumbnails.test.tsx`): binds
  `src/data/portfolio-items.ts` to the committed files, not just the render.
  It checks every `thumb` path exists under `public/portfolio/` and is bigger
  than a blank capture, that the rendered grid points each card's `<Image>`
  at that file with the right `loading`/`sizes` values, and that
  `scripts/capture-portfolio-thumbs.sh`'s `slug|url` list matches the data
  one-for-one. A renamed slug, a missing capture, or a source left behind in
  the script fails here instead of shipping a broken image.
- **Share preview card** (`share-preview.test.tsx`, `share-preview-render.test.ts`):
  keeps every share-facing string (og-image, twitter-image, page metadata)
  employer-free, and proves the route actually rasterizes a real 1200x630 PNG
  whose id changes when its rendered inputs do. The render assertions run in
  the node environment described above.
- **Hit areas** (`design-quick-wins.test.tsx`): jsdom cannot lay out or measure
  `::after` pseudo-elements, so these tests only bind the `hit` class on each
  element and check the CSS rule text in `globals.css` separately. Actual
  44px tap-target coverage is verified by hand in a real browser with
  `document.elementFromPoint` at the edges of the rendered box, confirming
  the expected link (not a neighbor) receives the click.
- **Visual / e2e**: not automated yet; verified per-change with Playwright
  screenshots during development.

## Conventions

- Tests live in `src/__tests__/`, named `<subject>.test.ts(x)`.
- Explicit imports from `vitest` (no globals), plain assertions (no jest-dom).
- Client components that read Next router state get a `vi.mock("next/navigation")`.
- When fixing a bug, add the regression test in the same commit.

- Cleanup between tests is global: `vitest.setup.ts` runs `afterEach(cleanup)`,
  so new test files do not need their own.
