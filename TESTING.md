# Testing

Tests let you move fast and ship with confidence. Without them, changes to
`content.ts` (which every page composes from) only break visibly in prod.

## Framework

- **vitest 4** + **@testing-library/react 16**, jsdom environment.
- Config: `vitest.config.ts` (maps the `@/` alias, picks up `src/**/*.test.{ts,tsx}`).

## Run

```bash
pnpm test          # full suite, ~1s
pnpm exec vitest   # watch mode
```

CI runs `tsc --noEmit` + `pnpm test` on every push and PR (`.github/workflows/test.yml`).

## Layers

- **Data integrity** (`src/__tests__/content.test.ts`): content.ts invariants —
  unique build slugs, non-empty groups, slugged schools have story pages.
  Every route composes from this file, so this is the highest-value net.
- **Component composition** (`about-page`, `hero-section`, `bucket-nav` tests):
  render the real components, assert the links and sections a visitor relies on.
- **Visual / e2e**: not automated yet; verified per-change with Playwright
  screenshots during development.

## Conventions

- Tests live in `src/__tests__/`, named `<subject>.test.ts(x)`.
- Explicit imports from `vitest` (no globals), plain assertions (no jest-dom).
- Client components that read Next router state get a `vi.mock("next/navigation")`.
- When fixing a bug, add the regression test in the same commit.
