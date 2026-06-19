---
title: Deployment and Ops
tags: [matthewoshin-site, deployment, ops]
---

# Deployment and Ops

How to run the site locally, how it ships, and the keys it needs to be fully alive. The site is a Next.js 16 app on Vercel. There is intentionally very little ops surface here: no `vercel.json`, an empty `next.config.ts`, and no custom CI. That is on purpose. The interesting infra lives in the scene and the [[OceanAI]] route, not in config files.

For what is shipped versus what is planned see [[Roadmap]]. For the reasoning behind the open calls (public vs gate, RAG path) see [[Decision Log]].

## Local development

The repo uses `pnpm`. The dev port is conventionally `3100` (not Next's default `3000`) to keep it clear of Matthew's other local apps.

```bash
PORT=3100 pnpm dev
```

The `dev` script in `package.json` is just `next dev` (Turbopack is the Next 16 default). The `PORT` env var is what pins it to 3100, so always launch with the variable prefixed as above. After it boots, the site is at `http://localhost:3100`.

First time on a fresh clone:

```bash
pnpm install
PORT=3100 pnpm dev
```

### Scripts (from `package.json`)

| Command | Script | What it does |
| --- | --- | --- |
| `PORT=3100 pnpm dev` | `next dev` | Local dev server with HMR, on port 3100. |
| `pnpm build` | `next build` | Production build. This is what Vercel runs. Catches type errors and build-time failures. |
| `pnpm start` | `next start` | Serves the production build locally (run `pnpm build` first). |
| `pnpm lint` | `eslint` | Lints with `eslint-config-next`. |

### Typecheck

There is no dedicated `typecheck` script. TypeScript is `strict` (see `tsconfig.json`), and `pnpm build` type-checks as part of the build. To type-check without a full build:

```bash
pnpm exec tsc --noEmit
```

Run `pnpm build` before any deploy or merge. It is the real gate: it surfaces type errors, R3F/React-19 issues, and the React-Compiler immutability lint that the [[Ocean Scene]] elements depend on.

## Hosting (Vercel)

The site lives on Vercel. The repo is linked via `.vercel/project.json` (gitignored, local only):

| Field | Value |
| --- | --- |
| Project name | `matthewoshin-site` |
| Framework | Next.js (auto-detected) |
| Dev port | 3100 (local convention) |
| Live alias | `matthewoshin-site.vercel.app` |
| Repo | `github.com/mattoshin/matthewoshin-site` (private) |

There is no `vercel.json`. Vercel auto-detects the Next.js framework and runs `next build`. `next.config.ts` is intentionally empty (just the typed `NextConfig` shell), so there are no rewrites, redirects, headers, or image domains to track yet.

### Current state: older public build

> The live deploy at `matthewoshin-site.vercel.app` currently ships an OLDER, PUBLIC build, not the latest `main`.

What that means in practice:

- The live site is fully public (no password gate). Anyone with the link can see it.
- It predates the most recent local work, so the deployed version may lag the seven-phase [[Build Log]] state. Treat `matthewoshin-site.vercel.app` as a preview-grade artifact, not the canonical "this is the site" link.
- The link you actually hand out is still pending. The plan is the custom domain `matthewoshin.com` (a [[Roadmap]] NEXT item), not the `.vercel.app` alias.

To ship the current local state, push to `main` (Vercel deploys on push) or run a manual deploy from the project root:

```bash
vercel --prod
```

A manual deploy needs the Vercel CLI authenticated and the project already linked (the `.vercel/` directory present). Prefer push-to-deploy unless there is a reason to go manual.

## Environment variables

None of the keys below are committed. `.env*` is gitignored, and there is no `.env.example` in the repo. Everything the deployed site needs lives in the Vercel project env. The site is built to degrade gracefully, so it runs without any of these, it just runs in fallback mode.

| Variable | Powers | Without it |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Live [[OceanAI]] (the Claude-backed chat widget). | OceanAI serves a warm canned bio reply. It never 500s. |
| `NEXT_PUBLIC_SUPABASE_URL` | Planned newsletter writes + production OceanAI RAG (the Supabase-hosted brain). | Newsletter has no backend; OceanAI stays on its static persona. |
| Supabase keys (anon + service role) | Same as above: newsletter capture and prod RAG over Matthew's indexed history. | Same as above. |

### `ANTHROPIC_API_KEY` (live OceanAI)

The OceanAI route at `src/app/api/oceanai/route.ts` reads `process.env.ANTHROPIC_API_KEY`. If the key is missing (or the upstream call fails for any reason), it returns a canned, on-brand bio reply with `fallback: true` instead of erroring. The route calls the Anthropic Messages API by plain `fetch` (no SDK) against model `claude-haiku-4-5`.

Add the key in Vercel to flip OceanAI from the static persona to live Claude:

```bash
vercel env add ANTHROPIC_API_KEY production
```

This is one of the two [[Roadmap]] "add keys in Vercel" unlocks. Setting it is what makes the most impressive thing on the site actually run live.

### Supabase keys (newsletter + prod OceanAI RAG)

Two NEXT moves depend on Supabase being wired into Vercel:

- Newsletter email popup: a Supabase-backed write path to capture press, recruiter, and partner emails into a list Matthew owns.
- OceanAI grounded in gbrain (RAG): in production, OceanAI would query the Supabase-hosted brain directly so it answers from Matthew's real indexed history instead of a static bio. Local dev queries gbrain via its CLI; prod queries Supabase. The graceful static fallback stays as the floor either way.

These keys are not in the repo or in Vercel yet. Until they land, the newsletter has no backend and OceanAI stays on its bio persona. See [[OceanAI]] for the RAG design and [[Roadmap]] NEXT items 2 and 4.

## Pending decision: public vs password gate

This is Matthew's call and it is unresolved. It blocks pointing the custom domain.

- The older live build is already fully PUBLIC at `matthewoshin-site.vercel.app`.
- Going (and staying) public maximizes shareability, which is the entire north star: the link Matthew hands out that makes someone want him. A public site is the default and the simplest path.
- A Vercel password gate (or deployment protection) buys control over who sees it before it is fully polished, at the cost of friction for anyone he shares it with.

Pick one before pointing `matthewoshin.com` at the site. A gate is a Vercel project setting (Deployment Protection), not a code change, so this decision does not block any build work, only the domain step. Tracked in [[Decision Log]] and [[Roadmap]] pending decisions.

## Quick checklist

Before merging to `main` or deploying:

1. `pnpm build` passes (this is the type-check gate too).
2. `pnpm lint` is clean.
3. If touching the scene, sanity-check 60fps and zero console errors in the browser (see [[Ocean Scene]]).
4. Confirm no secrets crept into committed files (`.env*` is gitignored, keep it that way).

## Related pages

- [[OceanAI]] for the chat widget, the API route, and the RAG plan that needs the keys above.
- [[Roadmap]] for what is DONE, NEXT, and the pending decisions these keys unlock.
- [[Decision Log]] for the why behind the open calls.
- [[Build Log]] for the commit-level history of what is (locally) shipped.
- [[Project Overview]] and [[Home]] for the wider map.
