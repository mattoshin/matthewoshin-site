# Demos Overhaul: Cleanup (Sub-project A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename "Riptide Research" to "Options-Implied Distribution Terminal", cut the AI Media Monitoring (Sonar) and Fitness OS demos entirely, and reorder the demos hub so the deepest/most current real work leads and Mocean closes as the origin story.

**Architecture:** Pure content/data + file-deletion changes in one Next.js repo (`matthewoshin-site`). No new components, no schema changes — `src/data/demos.ts` and `src/data/content.ts` are the two sources of truth that `src/app/app/page.tsx`, `src/app/portfolio/page.tsx`, and `src/app/projects/[slug]/page.tsx` all read from, so editing them cascades correctly. `src/app/api/oceanai/route.ts` carries a duplicate hardcoded product list in its system prompt that needs the same edits by hand.

**Tech Stack:** Next.js 16, TypeScript, vitest.

## Global Constraints

- No em dashes anywhere (repo-wide style rule; the AGENTS.md testing note also implies the OceanAI system prompt strips them server-side, but this repo's own written copy must not introduce any either).
- `pnpm typecheck`, `pnpm test`, `pnpm build` must all stay green after every task (CI gates on these three).
- Never `git add -A` in a shared tree — this repo has multiple concurrent worktrees; stage only the files this plan touches.
- Slugs (`riptide`, used in `demoHref`/`caseHref`/route params) do not change — only the `name` display field and prose. Changing the slug would break the `/projects/riptide` route and any external links to `riptide.matthewoshin.com`.
- Full spec: `docs/superpowers/specs/2026-08-04-demos-overhaul-design.md`.

---

### Task 1: Rename Riptide Research → Options-Implied Distribution Terminal

**Files:**
- Modify: `src/data/demos.ts:99` (the `riptide` entry's `name` field)
- Modify: `src/data/content.ts:437` (the `riptide` BUILDS entry's `name` field)
- Modify: `src/data/content.ts:441` (summary prose, mid-sentence "Riptide" reference)
- Modify: `src/data/content.ts:108` (home "portfolio" bucket teaser)
- Modify: `src/data/content.ts:212` (About page paragraph)
- Modify: `src/data/content.ts:800` (About page education paragraph)
- Modify: `src/app/portfolio/page.tsx:23` (page metadata description)
- Modify: `src/app/api/oceanai/route.ts:59` (chat assistant system prompt)
- Modify: `src/__tests__/portfolio-page.test.tsx:34-36` (existing assertion pins the old name)

**Interfaces:** None — pure string edits, no new exports or types.

- [ ] **Step 1: Update the demos.ts card name**

In `src/data/demos.ts`, in the `riptide` entry, change:
```ts
    name: "Riptide Research",
```
to:
```ts
    name: "Options-Implied Distribution Terminal",
```

- [ ] **Step 2: Update the content.ts BUILDS entry name and body**

In `src/data/content.ts`, in the `riptide` BUILDS entry, change:
```ts
    name: "Riptide Research",
```
to:
```ts
    name: "Options-Implied Distribution Terminal",
```

In the same entry's `summary` field, change the mid-sentence reference so the prose doesn't repeat the old name:
```ts
      "Every research tool ships a single number where the real answer is a distribution. Riptide takes the live options chain, derives the market's full risk-neutral distribution, and puts my own Bull/Base/Bear view on the same axis, shading the gap between them as expected value and a half-Kelly size. On top of that sits an agentic layer: a Model Lab to author and save my own models, an Edge Radar that scans the whole universe for names where a model's distribution most disagrees with what options are pricing, and a Model Arena that overlays the market, my view, the Street, and an AI analyst on one axis and then grades which of them has actually been right. The quant engine is dependency-free TypeScript with unit tests; the AI analyst is anchored to the implied base rate so it can't free-run overconfident.",
```
to:
```ts
      "Every research tool ships a single number where the real answer is a distribution. This terminal takes the live options chain, derives the market's full risk-neutral distribution, and puts my own Bull/Base/Bear view on the same axis, shading the gap between them as expected value and a half-Kelly size. On top of that sits an agentic layer: a Model Lab to author and save my own models, an Edge Radar that scans the whole universe for names where a model's distribution most disagrees with what options are pricing, and a Model Arena that overlays the market, my view, the Street, and an AI analyst on one axis and then grades which of them has actually been right. The quant engine is dependency-free TypeScript with unit tests; the AI analyst is anchored to the implied base rate so it can't free-run overconfident.",
```

- [ ] **Step 3: Update the home page portfolio teaser**

In `src/data/content.ts`, the `"portfolio"` bucket's `teaser` field, change:
```ts
      "The products I build and run now: Riptide Research, Galactic Signals, Sonar Media, Observly, BriefBridge, mTrain, and the Dog House band site. Each card says what it is and what it does, and opens a live demo you can click through yourself.",
```
to:
```ts
      "The products I build and run now: the Options-Implied Distribution Terminal, Galactic Signals, Observly, BriefBridge, mTrain, and the Dog House band site. Each card says what it is and what it does, and opens a live demo you can click through yourself.",
```
(This also drops "Sonar Media" — Task 2 cuts that demo. Doing it here avoids a second edit to the same line.)

- [ ] **Step 4: Update the About page paragraphs**

In `src/data/content.ts`, in the `paragraphs` array, change:
```ts
    "Today I lead AI and marketing at a medical device company, plus a portfolio of my own builds. The main one is Riptide Research, an equity-research terminal that quantifies how my view disagrees with what the options market is pricing: markets reasoning shipped as a product.",
```
to:
```ts
    "Today I lead AI and marketing at a medical device company, plus a portfolio of my own builds. The main one is my Options-Implied Distribution Terminal, which quantifies how my view disagrees with what the options market is pricing: markets reasoning shipped as a product.",
```

And further down, change:
```ts
      "Economics is also what pulled me toward markets directly, from an equity-research seat to building Riptide Research, my equity-research terminal. The classroom gave me the vocabulary and the ventures gave me the reps.",
```
to:
```ts
      "Economics is also what pulled me toward markets directly, from an equity-research seat to building my Options-Implied Distribution Terminal. The classroom gave me the vocabulary and the ventures gave me the reps.",
```

- [ ] **Step 5: Update the portfolio page metadata description**

In `src/app/portfolio/page.tsx`, change:
```ts
    "Products I build, filterable by type: AI products (Riptide, Galactic Signals, Financial Communications Platform, SEC Intelligence, Sonar Media, Workplace AI, SecOps Command, Observly, BriefBridge), web & client work (BrachyClip, mTrain, Fitness OS, Dog House), and ventures (Mocean, Element Underground).",
```
to:
```ts
    "Products I build, filterable by type: AI products (Options-Implied Distribution Terminal, Galactic Signals, Financial Communications Platform, SEC Intelligence, Workplace AI, SecOps Command, Observly, BriefBridge), web & client work (BrachyClip, mTrain, Dog House), and ventures (Mocean, Element Underground).",
```
(This also drops "Sonar Media" and "Fitness OS" — same reasoning as Step 3, avoids a second pass over this line in Tasks 2/3.)

- [ ] **Step 6: Update the OceanAI chat assistant's system prompt**

In `src/app/api/oceanai/route.ts`, change:
```ts
What he builds now: Riptide Research (formerly called Sigma), an options-implied distribution equity-research terminal, and Galactic Signals, a trading-signals platform. His Portfolio page on this site also has live clickable demos of other builds, including Sonar Media, Observly, BriefBridge, and mTrain. His web and client work includes Dog House (doghouseband.matthewoshin.com), a photo-led site plus self-serve CMS he designed and built end to end for a NYC rock band; its case study is on the Portfolio page. In total he has shipped 20+ products end to end.
```
to:
```ts
What he builds now: the Options-Implied Distribution Terminal, an equity-research terminal that prices where his view disagrees with the options market, and Galactic Signals, a trading-signals platform. His Portfolio page on this site also has live clickable demos of other builds, including Observly, BriefBridge, and mTrain. His web and client work includes Dog House (doghouseband.matthewoshin.com), a photo-led site plus self-serve CMS he designed and built end to end for a NYC rock band; its case study is on the Portfolio page. In total he has shipped 20+ products end to end.
```

- [ ] **Step 7: Update the existing test assertion**

In `src/__tests__/portfolio-page.test.tsx`, in the "Web & Client filter" test, change:
```ts
    expect(
      screen.queryByRole("heading", { name: "Riptide Research" }),
    ).toBeNull();
```
to:
```ts
    expect(
      screen.queryByRole("heading", { name: "Options-Implied Distribution Terminal" }),
    ).toBeNull();
```

- [ ] **Step 8: Verify**

Run: `pnpm typecheck && pnpm test && pnpm build`
Expected: all three pass with no errors. `pnpm test` should show the same test count as before this task (no tests added or removed in this task).

- [ ] **Step 9: Commit**

```bash
git add src/data/demos.ts src/data/content.ts src/app/portfolio/page.tsx src/app/api/oceanai/route.ts src/__tests__/portfolio-page.test.tsx
git commit -m "rename: Riptide Research -> Options-Implied Distribution Terminal"
```

---

### Task 2: Cut the AI Media Monitoring (Sonar) demo

**Files:**
- Delete: `src/app/app/sonar/page.tsx`
- Delete: `src/app/app/sonar/dashboard/page.tsx`
- Delete: `src/components/demos/sonar/SonarCharts.tsx`
- Delete: `src/components/demos/sonar/SonarDashboard.tsx`
- Delete: `src/components/demos/sonar/SonarKit.tsx`
- Delete: `src/components/demos/sonar/SonarLanding.tsx`
- Delete: `src/components/demos/sonar/SonarScope.tsx`
- Delete: `src/data/sonar-demo.ts`
- Modify: `src/data/demos.ts` (remove the `sonar` DEMOS entry)
- Modify: `src/data/content.ts` (remove the `sonar` BUILDS entry)
- Modify: `src/app/portfolio/page.tsx` (remove the `fromBuild("sonar", ...)` line)

**Interfaces:** None — deletions and array-entry removals only. No other file imports anything from `src/components/demos/sonar/` or `src/data/sonar-demo.ts` outside the files listed above (confirmed by repo-wide grep during planning).

- [ ] **Step 1: Delete the sonar route files**

```bash
git rm -r src/app/app/sonar
```

- [ ] **Step 2: Delete the sonar demo components**

```bash
git rm -r src/components/demos/sonar
```

- [ ] **Step 3: Delete the sonar data file**

```bash
git rm src/data/sonar-demo.ts
```

- [ ] **Step 4: Remove the sonar entry from demos.ts**

In `src/data/demos.ts`, delete this entire object from the `DEMOS` array:
```ts
  {
    slug: "sonar",
    name: "Sonar Media",
    tagline:
      "Real-time media monitoring your team builds in plain English. Describe a monitor, AI wires up the agentic workflow, dry-run it over the last 48 hours, and it watches the internet for you.",
    era: "Recent build",
    status: "live",
    href: "/app/sonar",
    caseStudy: "/projects/sonar",
    accent: "#FFB224",
  },
```

- [ ] **Step 5: Remove the sonar entry from content.ts BUILDS**

In `src/data/content.ts`, delete this entire object from the `BUILDS` array:
```ts
  {
    slug: "sonar",
    name: "Sonar Media",
    hook: "Real-time media monitoring you build in plain English. Describe what to watch and AI assembles the agentic workflow that watches it for you.",
    demoHref: "/app/sonar",
    summary:
      "Investor-relations and communications teams drown in signal: a story that moves the stock can break on SEC EDGAR, a newswire, a regulator's feed, or social, and legacy monitoring makes you hand-write boolean queries to catch it. Sonar Media flips that. You describe what you care about in a sentence, an LLM resolves it into a validated monitor spec, and you dry-run it against the last 48 hours before it ever fires. Matches arrive tagged with the source, a sentiment read, the terms that hit, and a one-line summary of why it matters, gated by severity and capped so they never flood you. I built this as the media-intelligence layer of an enterprise platform: thousands of sources, an AI relevance gate to kill noise, and per-workspace AI-spend caps so a monitoring run never becomes a surprise bill.",
    highlights: [
      "A plain-English monitor builder: an LLM turns a sentence into a validated, schema-checked spec (entities, keywords, sources, cadence, delivery), with no boolean syntax.",
      "A 48-hour dry run that replays real history, so a monitor earns trust before a single alert goes out.",
      "A cheap AI relevance gate on every candidate match, so delivered alerts are the real story and not every keyword hit.",
      "Severity gating and per-monitor flood caps: instant for the urgent, digest for the rest, with AI spend tracked per model and capped per workspace.",
      "Source-grade coverage across SEC EDGAR, the wires, regulators, social, and cyber feeds, parsed in near real time.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Claude (Opus, Sonnet, Haiku)", "Zod", "Async workers", "PostgreSQL"],
    status: "Recent build",
  },
```
This automatically removes the `/projects/sonar` case study (that route reads from `BUILDS` dynamically).

- [ ] **Step 6: Remove the sonar line from portfolio/page.tsx**

In `src/app/portfolio/page.tsx`, in the `ITEMS` array, delete:
```ts
  fromBuild("sonar", "ai-products"),
```

- [ ] **Step 7: Verify**

Run: `pnpm typecheck && pnpm test && pnpm build`
Expected: all three pass. `pnpm build` in particular confirms no other route still references the deleted `/app/sonar` pages or the removed data.

- [ ] **Step 8: Commit**

```bash
git add -u src/data/demos.ts src/data/content.ts src/app/portfolio/page.tsx
git commit -m "cut: remove AI Media Monitoring (Sonar) demo"
```

---

### Task 3: Cut the Fitness OS demo

**Files:**
- Delete: `src/app/app/fitness-os/page.tsx`
- Delete: `src/app/app/fitness-os/dashboard/page.tsx`
- Delete: `src/components/demos/mtrain/MtrainConsole.tsx`
- Delete: `src/components/demos/mtrain/MtrainKit.tsx`
- Delete: `src/components/demos/mtrain/MtrainLanding.tsx`
- Delete: `src/components/demos/mtrain/MtrainSidebar.tsx`
- Delete: `src/components/demos/mtrain/nav-context.ts`
- Delete: `src/components/demos/mtrain/modules/Leads.tsx`
- Delete: `src/components/demos/mtrain/modules/Members.tsx`
- Delete: `src/components/demos/mtrain/modules/Overview.tsx`
- Delete: `src/components/demos/mtrain/modules/Schedule.tsx`
- Delete: `src/data/mtrain-demo.ts`
- Modify: `src/data/demos.ts` (remove the `fitness-os` DEMOS entry)
- Modify: `src/app/portfolio/page.tsx` (remove the inline Fitness OS item and its now-stale comment)

**Interfaces:** None. `src/components/demos/mtrain/` and `src/data/mtrain-demo.ts` are the Fitness OS demo's internals (unrelated to the real mTrain venture, which lives entirely in `src/app/portfolio/page.tsx` as a hardcoded item pointing at `mtrainstudio.com` — that item is untouched). Confirmed by repo-wide grep during planning that nothing outside the files listed here imports from these paths.

- [ ] **Step 1: Delete the fitness-os route files**

```bash
git rm -r src/app/app/fitness-os
```

- [ ] **Step 2: Delete the mtrain demo components (Fitness OS's internals)**

```bash
git rm -r src/components/demos/mtrain
```

- [ ] **Step 3: Delete the mtrain demo data file**

```bash
git rm src/data/mtrain-demo.ts
```

- [ ] **Step 4: Remove the fitness-os entry from demos.ts**

In `src/data/demos.ts`, delete this entire object (the last entry in `DEMOS`, so also remove the trailing comma left dangling on the prior entry if your editor doesn't auto-fix it — the prior entry is `riptide`):
```ts
  {
    slug: "fitness-os",
    name: "Fitness OS",
    tagline:
      "Gym and studio operation software: the class schedule, the lead pipeline, and every member over a Mindbody-style data layer, in one calm back office. A concept drawn from a real studio engagement.",
    era: "Product concept · Studio operations",
    status: "live",
    href: "/app/fitness-os",
    accent: "#1f3d34",
  },
```

- [ ] **Step 5: Remove the Fitness OS item and stale comment from portfolio/page.tsx**

In `src/app/portfolio/page.tsx`, delete this object from `ITEMS`:
```ts
  {
    name: "Fitness OS",
    hook: "Gym and studio operation software: the class schedule, the lead pipeline, and the member roster in one back office over a Mindbody-style data layer. A concept product, drawn from a real studio engagement.",
    status: "Product concept",
    category: "web-client",
    demoHref: "/app/fitness-os",
  },
```

And update the comment above `ITEMS` (it references Fitness OS by name), changing:
```ts
// Curated order for the "All" view: demo-backed flagships first, then the
// web/client work, then the remaining case studies. BrachyClip and mTrain are
// active engagements, so they link to the live site ("View Site"); the studio
// back-office software is its own product card, "Fitness OS", which opens the
// clickable demo.
```
to:
```ts
// Curated order for the "All" view: demo-backed flagships first, then the
// web/client work, then the remaining case studies. BrachyClip and mTrain are
// active engagements, so they link to the live site ("View Site").
```

- [ ] **Step 6: Verify**

Run: `pnpm typecheck && pnpm test && pnpm build`
Expected: all three pass.

- [ ] **Step 7: Commit**

```bash
git add -u src/data/demos.ts src/app/portfolio/page.tsx
git commit -m "cut: remove Fitness OS demo"
```

---

### Task 4: Reorder the demos hub

**Files:**
- Modify: `src/data/demos.ts` (reorder the `DEMOS` array)

**Interfaces:** None — array element order only, no field changes (Task 1 already renamed `riptide`; Tasks 2-3 already removed `sonar` and `fitness-os`). After this task `DEMOS` has 7 entries in this order: `riptide`, `galactic`, `financial-comms`, `sec-intelligence`, `atrium`, `vantage`, `mocean`.

- [ ] **Step 1: Reorder the DEMOS array**

In `src/data/demos.ts`, the `DEMOS` array (after Tasks 1-3) has entries in this order: `mocean`, `galactic`, `financial-comms`, `sec-intelligence`, `atrium`, `vantage`, `riptide`. Reorder so `riptide` moves to the front and `mocean` moves to the back, giving:

```ts
export const DEMOS: DemoCard[] = [
  {
    slug: "riptide",
    name: "Options-Implied Distribution Terminal",
    tagline:
      "Agentic equity-research terminal. Research in distributions: the options market's implied distribution versus your own models, scanned for gaps and graded over time.",
    era: "Current build, live",
    status: "live",
    href: "https://riptide.matthewoshin.com",
    caseStudy: "/projects/riptide",
    accent: "#2fe3bf",
  },
  {
    slug: "galactic",
    name: "Galactic Signals",
    tagline:
      "A cross-asset monitoring marketplace for retail investors and online communities. Subscribe to feeds, wire a webhook, get branded real-time alerts, built toward the AI agent data layer beneath it.",
    era: "Current build",
    status: "live",
    href: "/app/galactic-signals",
    caseStudy: "/projects/galactic-signals",
    accent: "#1DD1A1",
  },
  {
    slug: "financial-comms",
    name: "Financial Communications Platform",
    tagline:
      "The AI platform for investor relations, PR, and capital markets: earnings prep, peer and investor intelligence, crisis command, and on-voice drafting in one console.",
    era: "2024 to 2026 · Production build",
    status: "live",
    href: "/app/financial-comms",
    caseStudy: "/projects/financial-comms",
    accent: "#0027b3",
  },
  {
    slug: "sec-intelligence",
    name: "SEC Intelligence",
    tagline:
      "A real-time SEC-filing terminal for wealth managers and traders. Every material filing the moment it lands, an AI analyst that reads it for you, and alerts routed to email, phone, or your own agents.",
    era: "Current build",
    status: "live",
    href: "/app/sec-intelligence",
    caseStudy: "/projects/sec-intelligence",
    accent: "#3da9fc",
  },
  {
    slug: "atrium",
    name: "Workplace AI",
    tagline:
      "An unbranded concept: the corporate employee workspace, reimagined. An app hub, IT, legal, and HR in one calm place, with an AI assistant that automates the busywork and shows you what it handled.",
    era: "Concept · self-directed",
    status: "live",
    href: "/app/atrium",
    caseStudy: "/projects/atrium",
    accent: "#6d4aff",
  },
  {
    slug: "vantage",
    name: "SecOps Command",
    tagline:
      "An agentic security and IT operations command center. Autonomous agents triage incidents, hunt threats, patch vulnerabilities, and collect compliance evidence, in one console.",
    era: "Concept build · Security + IT ops",
    status: "live",
    href: "/app/vantage",
    caseStudy: "/projects/vantage",
    accent: "#b6abff",
  },
  {
    slug: "mocean",
    name: "Mocean",
    tagline:
      "Discord-native B2B research SaaS. Subscribe to data feeds, wire each to a Discord channel, deliver alpha automatically.",
    era: "2021 to 2023 · Founded and acquired",
    status: "live",
    href: "/app/mocean-demo",
    caseStudy: "/ventures/mocean",
    accent: "#5ecdd1",
  },
];
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck && pnpm test && pnpm build`
Expected: all three pass.

- [ ] **Step 3: Commit**

```bash
git add src/data/demos.ts
git commit -m "reorder: lead demos hub with Riptide, close with Mocean"
```

---

## Final Verification

- [ ] Run `pnpm typecheck && pnpm test && pnpm build` once more from a clean state to confirm the full sequence of commits leaves the repo green.
- [ ] `git log --oneline main..HEAD` shows exactly 4 commits (rename, cut Sonar, cut Fitness OS, reorder).
- [ ] Push the branch and open a PR against `main`; wait for CI; once green, merge per this repo's standing rule (agent merges, announces the deploy — `matthewoshin-site` is Vercel git-connected so merge to `main` auto-deploys production).
