# Demos Overhaul: naming, depth, and a new flagship

## Why

The `/app/*` demos hub carries 9 product cards. Some use invented brand names
that don't say what the product does (Riptide Research, Sonar Media). Two of
the nine are noticeably thinner than the rest and now sit next to much deeper
entries. Galactic Signals shows a hand-built recreation instead of the real
app Matthew actually operates. And a new, much deeper build — the GTM/SDR-AE
platform he built for an EliseAI interview (repo `elise-signal`) — isn't on
the portfolio at all, still carries EliseAI's brand, and needs to come in
de-branded as a flagship entry.

This spans three genuinely separate pieces of work, each its own repo state
and risk profile. They get **three separate plans and PRs**, done in this
order:

- **A. Cleanup** (this repo, `matthewoshin-site`) — rename, cut, reorder.
  Fast, mechanical, no external dependencies. Ships first.
- **B. GTM Engineering** — de-brand `elise-signal`, wire it into the demos
  hub as an external link.
- **C. Galactic Signals real-code swap** — deploy the real `galactic-app`
  standalone in demo mode, retire the local mock, wire in the external link.

B and C touch a second repo each and involve real infra (a de-brand pass on
a live interview artifact; a seeded database and auth bypass for a
standalone deploy). Order between B and C is Matthew's call once A ships;
this spec covers the full vision so each sub-project doesn't need to
re-derive shared context, but only A gets planned into implementation next.

## The end state: demos hub roster and order

The state below is what the hub looks like once **all three** sub-projects
have shipped, not just A. 9 cards become 8. New order, leading with the
deepest/most current real work and closing on the origin story:

1. **Go To Market Engineering** (new — de-branded Elise Signal, external link)
2. **Options-Implied Distribution Terminal** (renamed from Riptide Research, external link, unchanged otherwise)
3. **Galactic Signals** (unchanged name; swaps from local mock to external link once sub-project C ships)
4. Financial Communications Platform (unchanged)
5. SEC Intelligence (unchanged)
6. Workplace AI (unchanged)
7. SecOps Command (unchanged)
8. **Mocean** (unchanged; moves to closing "origin story" slot)

Cut entirely: **AI Media Monitoring** (Sonar Media) and **Fitness OS**.

## Sub-project A: cleanup (matthewoshin-site)

**Rename.** `src/data/demos.ts` and `src/data/content.ts`: "Riptide Research"
→ "Options-Implied Distribution Terminal" everywhere it appears as a name/
title. Taglines, hooks, and summaries stay conceptually the same (the
underlying description of what it does was already accurate) but get a pass
to read naturally with the new name in place of the old one.

**Cut AI Media Monitoring (Sonar).** Remove the demo card from
`src/data/demos.ts` and the case study from `src/data/content.ts`. Delete
`src/app/app/sonar/` (both routes), `src/components/demos/sonar/` (all
files), `src/data/sonar-demo.ts`. Remove references in
`src/app/api/oceanai/route.ts` (the site chat assistant's product list),
`src/app/portfolio/page.tsx`, and update the affected assertions in
`src/__tests__/portfolio-page.test.tsx`.

**Cut Fitness OS.** Same treatment: remove from `demos.ts` and `content.ts`,
delete `src/app/app/fitness-os/`, `src/components/demos/mtrain/` (all
files), `src/data/mtrain-demo.ts`. Same reference cleanup in
`oceanai/route.ts`, `portfolio/page.tsx`, and the test file.

**Reorder.** `DEMOS` array in `src/data/demos.ts` reflects the relative
order above, minus the not-yet-added GTM Engineering card: after A ships,
the array has 7 entries (9 minus the 2 cuts), opening with the renamed
Riptide entry and closing with Mocean. (Galactic Signals and GTM
Engineering's *content* changes are out of scope for sub-project A — A only
reorders the array and, for GTM Engineering, is not responsible for adding
the card at all. That's sub-project B's job, once the real de-branded app
exists to link to. Sub-project A ships without GTM Engineering on the hub.)

**Bio copy.** The home-page hero blurb and About page both list product
names in prose ("Riptide Research, Galactic Signals, Sonar Media, Observly,
BriefBridge, mTrain, and the Dog House band site" — `content.ts` line ~108,
and a second Riptide mention on the About page ~line 212). Update the name
and drop Sonar Media from the list. (Observly, BriefBridge, and mTrain in
that sentence refer to *other* ventures outside the `/app/*` demos system —
leave those as-is; only touch the demo-hub names.) GTM Engineering does not
get added to this bio sentence in sub-project A — that's B's job.

**Testing.** `pnpm typecheck`, `pnpm test`, `pnpm build` must stay green.
Update `src/__tests__/portfolio-page.test.tsx` assertions for the removed
demos and the renamed one.

## Sub-project B: Go To Market Engineering (spec-level, plans later)

De-brand `elise-signal` (repo `mattoshin/elise-signal`) for public portfolio
use, keep the code and functionality intact — this is a real, deep,
multi-view platform (Control Plane, Sequences, Pipeline, Enrichment, Agent
Studio, live social monitoring, deploy-anywhere runtimes) and none of that
gets simplified or removed.

**Remove:** the EliseAI brand purple (`#7638FA`, mined from their live
site), the "Elise" AI assistant persona/name, the "EliseAI GTM" product
name and wordmark throughout the app, and the footer callouts to EliseAI's
real product line (EliseCRM, VoiceAI, Prospect Management, Lease Audits).

**Keep:** the real-estate/property-management example vertical, and the
real named companies it tracks via live public Bluesky search (Greystar,
AvalonBay) — this is public information, not proprietary EliseAI branding,
and Matthew's explicit call was to keep it and just not say "Elise."

**New identity:** portfolio card name "Go To Market Engineering"; in-app
wordmark/title becomes a short form of the same (default: "GTM
Engineering" — flag for Matthew to confirm or override during
implementation). New accent palette to replace the EliseAI purple — pick
this via a Refero-informed pass at implementation time (per the standing
design-research-first rule), not decided in this spec.

**Hosting:** `gotomarket.matthewoshin.com` already exists as a DNS CNAME to
the `elise-signal` Vercel project — confirm it's still correctly wired
before relying on it, but no new domain work is expected. Demos hub card
`href` points externally to that URL, same pattern as Riptide.

**Wire-in:** add the card to `src/data/demos.ts` (slot 1) and a case study
to `src/data/content.ts` `BUILDS`, plus the bio-sentence mention deferred
from sub-project A.

## Sub-project C: Galactic Signals real-code swap (spec-level, plans later)

Retire the hand-built mock console (`src/components/demos/galactic/`,
`src/data/galactic-demo.ts`, `galactic-admin-demo.ts`, and the
`/app/galactic-signals` routes) and deploy the real `~/Code/galactic-app`
codebase standalone instead, linked externally like Riptide and GTM
Engineering.

**What's needed** (real work, not a copy-paste swap):
- A `DEMO_MODE` env flag that bypasses real NextAuth with a fixed seeded
  session, so a portfolio visitor never hits a login wall.
- A lightweight seeded Postgres (free-tier Neon or Supabase) with
  representative data — enough feeds, users, and activity to make the
  console read as populated and real.
- Strip or stub the live dependencies the interactive UI otherwise expects:
  the Python worker fleet and outbound Discord webhook delivery don't run
  in a demo deploy.
- The marketing/landing pages (`/`, `/privacy`, `/terms`) already have no DB
  dependency and need no changes.

**Positioning:** lean the copy into **cross-asset intelligence** rather than
"monitoring/alerts marketplace" — the differentiator worth foregrounding is
that Galactic surfaces what the cross-asset data *means* (stocks, crypto,
sports betting, trading cards, real estate, macro, news feeding one
picture), not just that it pipes alerts into Discord. Applies to the
`demos.ts` tagline, the `content.ts` hook/summary, and in-app copy touched
during the swap.

**Deploy:** its own Vercel project/subdomain (mirrors the Riptide/GTM
Engineering pattern — real apps get their own deployment, only concept
demos live inside `matthewoshin-site`'s `/app/*` tree). Exact subdomain
choice deferred to implementation.

## Out of scope

- Mocean: the old CRA+Laravel snapshot (`~/Code/jrad-x-moshin-2026`) is not
  worth rehabbing into a real deploy — dead backend, already-sold company.
  The existing hand-built Mocean mock stays as-is, name unchanged.
- The four solid concept demos (Financial Communications Platform, SEC
  Intelligence, Workplace AI, SecOps Command) get no changes — already deep
  enough that expanding them isn't warranted this round.
