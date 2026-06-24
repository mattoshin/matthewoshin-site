# Portfolio filters + mTrain studio-admin demo

**Date:** 2026-06-23
**Branch:** `feat/portfolio-filters-mtrain-demo`
**Status:** Approved, building.

## Goal

Add category filters to `/portfolio`, surface two missing projects (BrachyClip, Element
Underground), drop Camp Ricky, give every card the turquoise treatment (today only the top
four featured cards have it), and build a new clickable `/app/fitness-os` studio-admin demo.

## Decisions (locked with Matthew)

- **Filter scheme:** by type — `All · AI Products · Web & Client · Ventures`. Each card tagged once.
- **mTrain demo:** build it, in the same PR. Warm sand + evergreen theme, editorial serif.
- **Camp Ricky:** removed from the portfolio grid.
- **Refero:** research-first (done — time2book, Mangomint, Teal, Runey, Rox).

## Part 1 — Portfolio filters + cards

### Categories
A single `PortfolioCategory = "ai-products" | "web-client" | "ventures"`.

- **AI Products (9):** riptide, galactic-signals, icr-intelligence (Financial Comms), sonar,
  sec-intelligence, atrium (Workplace AI), vantage (SecOps), observly, briefbridge
- **Web & Client (2):** brachyclip (new), mtrain
- **Ventures (2):** mocean, element-underground (new to portfolio)
- **Excluded from portfolio:** camp-ricky

### Model
Build a single derived `PortfolioItem[]` in the portfolio page: `{ name, hook, status,
category, caseHref, demoHref? }`, assembled from BUILDS + the two VENTURES + new BrachyClip.
Card markup moves into a `PortfolioCard` component; a client `PortfolioGrid` holds the active
filter and renders pills + filtered cards.

### Filter UI (Refero: Designstripe/Glorify/Twitch pill pattern)
- A horizontal pill row above the grid: `All (13) · AI Products (9) · Web & Client (2) · Ventures (2)`.
- Active pill = filled turquoise (bio-cyan); inactive = ghost (`border-white/15`). Counts in each.
- Client-side instant filter (no route change). Horizontally scrollable / wraps on mobile.
- Respects the mobile grid fix already shipped (`grid-cols-1 sm:grid-cols-2`, `min-w-0`).

### Turquoise everywhere
Every card uses the featured turquoise treatment (`border-bio-cyan/30 bg-bio-cyan/[0.06]`),
not just the demo-backed four.

### BrachyClip (new BUILDS entry → /projects/brachyclip case study)
Web & Client. Content drawn from the EXPERIENCE bullets: the brachyclip.com marketing site +
gated investor portal on Next.js 16. No live link (portal is gated/confidential). No demo.

### Element Underground
Already in VENTURES with a `/ventures/element-underground` detail page. Surface it as a
Ventures card (case study link only).

## Part 2 — mTrain studio-admin demo (`/app/fitness-os`)

Mirrors the Atrium demo architecture, scoped theme, mock data, clickable but non-functional.

### Files (under `src/components/demos/mtrain/`)
- `MtrainScope.tsx` — theme boundary, scoped `--mt-*` tokens + keyframes (warm sand + evergreen).
- `MtrainKit.tsx` — UI primitives (Card, StatCard, Pill, Sparkline, Donut, Bar, Avatar, Icon…).
- `MtrainLanding.tsx` — scope/intro page (hero + "open the dashboard").
- `MtrainConsole.tsx` — shell that switches modules + sidebar.
- `MtrainSidebar.tsx` — left nav.
- `nav-context.ts` — module-switch context.
- `modules/Overview.tsx`, `modules/Schedule.tsx`, `modules/Leads.tsx`, `modules/Members.tsx`.
- Data: `src/data/mtrain-demo.ts` (ModuleId + all mock data; "never fabricate real business
  facts" — everything clearly demo/sample, fictional clients).
- Routes: `src/app/app/fitness-os/page.tsx` (Landing), `src/app/app/fitness-os/dashboard/page.tsx` (Console).

### Theme tokens (warm sand + evergreen)
Surfaces `--mt-bg #FAF8F4 / --mt-card #FFFFFF`; ink `#1C1B19`; accent evergreen `#1F3D34`,
sage `#8BA88E`, accent-wash. Editorial serif headings (reuse the site display serif via font),
mono for numerics. No indigo. Distinct from the site's bio-cyan.

### Modules (Refero-grounded)
- **Overview** (Runey/Teal): 4 KPI cards w/ sparklines (week's bookings, active members, new
  leads, revenue MTD), a bookings trend chart, today's classes list, class fill-rate donut.
- **Schedule** (time2book): Upcoming/Past tabs, classes grouped by day, cards with time /
  instructor / location / capacity fill bar (e.g. 12/16).
- **Leads** (Rox): table — name, source (site form / Instagram / referral / walk-in), interest,
  stage pill (New → Contacted → Trial booked → Member), date; stage colors like Rox.
- **Members**: roster table — name, plan, status, joined, last visit.

### Registration
Add mTrain to the `/app` index `DEMOS` array (accent evergreen `#1F3D34`), and set
`demoHref: "/app/fitness-os"` on the mtrain BUILDS entry so the portfolio card shows "View Demo".

## Build order
1. Portfolio content (categories, BrachyClip, exclude camp-ricky) + filter component + turquoise.
2. mTrain demo: theme + Kit + data + shell + sidebar + landing + routes (foundation), then the
   4 modules (parallelizable against the shared Kit + data).
3. Verify mobile (390/375) + desktop, build green, then CI → merge → deploy.

## Verification
- Portfolio: filters switch correctly, counts right, all cards turquoise, no mobile overflow
  (reuse the headless audit harness at 390/375), BrachyClip + Element present, Camp Ricky gone.
- mTrain demo: all 4 modules render, theme scoped (no leak into global), mobile + desktop clean,
  registered on /app index, "View Demo" on the portfolio card works.
