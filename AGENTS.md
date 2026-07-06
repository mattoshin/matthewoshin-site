<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Testing

- `pnpm test` runs the vitest suite (`src/__tests__/`), ~1s. See TESTING.md.
- CI (`.github/workflows/test.yml`) gates every PR and push to main on `pnpm typecheck` + `pnpm test`.
- When adding a feature or fixing a bug, add or update a test in the same change.
- Never commit code that fails `pnpm test` or `pnpm typecheck`.
