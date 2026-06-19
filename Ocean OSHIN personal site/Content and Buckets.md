---
title: Content and Buckets
tags: [matthewoshin-site, content]
---

# Content and Buckets

This page is the source of truth for WHAT goes on the site and WHERE it comes from. The whole site is organized into six buckets, each of which is its own page at its own ocean depth. All real copy lives in one file, [`src/data/content.ts`](#where-content-lives), and the navigation, page headers, and the home launchpad cards all read from it.

If you want the rendering side (how a page sets its depth, how the persistent canvas works), see [[Architecture]]. For the AI chat that answers questions grounded in this same bio, see [[OceanAI]]. For what is shipped versus planned, see [[Roadmap]].

## The six buckets

The buckets are fixed, in this order, descending from the sunlit shallows to the floor:

| Order | Label | Route | Zone id (immutable) | Teaser (home card) |
|-------|-------|-------|---------------------|--------------------|
| 1 | Experience | `/experience` | `about` | CAIO at BrachyClip, VP of AI at ICR, equity research before that. |
| 2 | Entrepreneurship | `/entrepreneurship` | `projects` | Mocean, Element Underground, and the products I'm shipping now. |
| 3 | Skills | `/skills` | `ventures` | AI engineering, full-stack, markets, data and product. |
| 4 | Education | `/education` | `writing` | University of Michigan, B.A. Economics. |
| 5 | Interests | `/interests` | `skills` | DJ rig, sneakers, markets, networking, emerging tech. |
| 6 | Contact | `/contact` | `contact` | Email, LinkedIn, GitHub, or book a time. |

A few things to internalize here:

- **Home (`/`) is not a bucket.** The wordmark returns you to the surface launchpad. The `surface` zone maps to Home (the HERO + ABOUT blocks), and it is intentionally left out of the `BUCKETS` array because the launchpad is the entry point, not a tab.
- **Zone ids are NOT the labels.** The labels were reordered during the build but the zone ids were frozen. So `Education` lives at the `writing` zone, `Interests` lives at the `skills` zone, and `Skills` lives at the `ventures` zone. This mismatch is deliberate and load-bearing: the WebGL creatures gate their visibility on the zone id, so renaming a zone id would break the scene. Rename labels freely, never rename zone ids. See [[Architecture]] for how `ZoneSetter` and `zoneCenterProgress()` drive the camera dive off these ids.

```ts
// src/data/content.ts - the zone -> bucket mapping, as documented in the file header
//   surface  -> Home (HERO + ABOUT)
//   about    -> Experience (EXPERIENCE)
//   projects -> Entrepreneurship (VENTURES past + BUILDS current)
//   ventures -> Skills (SKILL_GROUPS)
//   writing  -> Education (EDUCATION)
//   skills   -> Interests (INTERESTS)
//   contact  -> Contact (CONTACT)
```

## Where content lives

All of it is in one server-importable plain-data module:

```
src/data/content.ts
```

It exports typed constants, no fetching, no side effects. The file header bakes in the hard rules: no em dashes anywhere; voice is confident, warm, direct; every figure in it is public and approved (sourced from LinkedIn). Pages import the constants they need and render them. The canonical exports:

| Export | Type | Feeds |
|--------|------|-------|
| `SITE` | object | name, role, tagline, email, linkedin, github, `calendlyUrl` (placeholder) |
| `BUCKETS` | `readonly Bucket[]` | the six-item nav + home launchpad cards |
| `BUCKET_BY_HREF` | record | nav active-state + page-header lookups |
| `HERO` | object | front-page hero (positioning, hook, bio, scroll hint) |
| `ABOUT` | object | the "About me" column on Home |
| `EXPERIENCE` | `readonly Job[]` | the Experience page (jobs) |
| `VENTURES` | `readonly Venture[]` | Entrepreneurship, past ventures |
| `BUILDS` | `readonly Build[]` | Entrepreneurship "Building now" + the `/projects/[slug]` case-study shells |
| `ENTREPRENEURSHIP` | object | Entrepreneurship page headings/labels |
| `SKILL_GROUPS` | `readonly SkillGroup[]` | the Skills page |
| `EDUCATION` / `EDUCATION_META` | array / object | the Education page |
| `INTERESTS` / `INTERESTS_META` | array / object | the Interests page |
| `CONTACT` | object | the Contact page |

The `Bucket` interface ties a zone id to its route and teaser:

```ts
export interface Bucket {
  id: ZoneId;     // immutable; WebGL creatures gate on it; never rename
  label: string;  // nav + header display label
  href: string;   // the route this bucket lives at
  teaser: string; // one-line preview on the home launchpad card
}
```

`ZoneId` is imported from `@/lib/depth`, which is the single place the depth zones are defined. That import is what keeps the content layer and the scene layer in sync. See [[Architecture]].

## What real content lives in each bucket

Everything below is what is actually in `content.ts` today. All figures are the public, LinkedIn-sourced numbers and are cleared to publish. See the [Confidentiality](#confidentiality) section for what must never appear.

### Home (surface): HERO + ABOUT

Not a bucket, but the first thing anyone sees. The hero positions Matthew as "Builder. Chief AI Officer at BrachyClip. Markets, AI, and emerging tech." with the throughline hook ("I'm a builder...") and a concise bio. The ABOUT block expands that into five short paragraphs in his voice, hitting the same beats as the deeper pages so the front page can stand alone. The "builder is the throughline" line appears exactly once strong (in the hook); the About block does not repeat it.

### Experience (`/experience`, zone `about`)

Five jobs, most recent first, each with a role, org, period, and bullet points:

- **Chief AI Officer, BrachyClip** (2025 to present): early-stage cancer medical device company. Built brand, positioning, and investor narrative; stood up AI infrastructure; builds internal AI tools for market analysis, regulatory research, and outreach.
- **VP, AI & Innovation, ICR** (Recent): headed the firm's AI & Intelligence Lab, shipped internal tools and client-facing products, drove firm-wide AI adoption, set and executed AI strategy.
- **Equity Research Analyst, Manatuck Hill Partners** (2024): thematic research across AI infrastructure, nuclear energy, and precious metals that informed portfolio decisions; management interviews; built an automated intelligence aggregation system.
- **AI Project Manager, Qult.ai** (2023, internship): led 4 developers building an AI healthcare career platform on Python, React Native, MongoDB.
- **Software Product Manager, Top Floor** (2022 to 2023, internship): community and marketing infrastructure for AI companies; automated marketing products sold to 3 clients.

### Entrepreneurship (`/entrepreneurship`, zone `projects`)

Two parts: past ventures (`VENTURES`) and current builds (`BUILDS`).

**Ventures and companies (`VENTURES`)**, roughly in the order they happened:

| Venture | Era | The public figures |
|---------|-----|--------------------|
| Mocean Technologies | Founded and acquired | Founded at 19. $400K in revenue, 100,000+ users, 1,000+ investor communities. Acquired. |
| Element Underground | Co-founder | Large-scale events across NYC, Miami, Boston, and Ann Arbor that have drawn 17,000+ attendees. |
| Profit Paradise | Community | Grew to about 3,500 members. Started paid, later made free. |
| Ocean Supply | Early venture | Sneaker arbitrage, the first real operation. Where the ocean theme started. |
| Resell Network | Community | 11,000-member community, sold alongside Mocean. |

**Building now (`BUILDS`)**, which also back the `/projects/[slug]` case-study shells (so they carry the richer `summary`, `highlights`, `stack`, `status` fields that page reads):

- **Sigma** (`slug: "sigma"`): an options-implied distribution terminal for equity research. Extracts the risk-neutral distribution priced into options, lets you lay your own view next to it, and surfaces edge, expected value, half-Kelly sizing, and a calibration scorecard. Stack: Next.js, TypeScript, Python, options math.
- **Galactic Signals** (`slug: "galactic-signals"`): a trading-signals platform that turns market data into alerts. Real-time data pipelines, a full-stack app with an admin and monitor builder, encrypted API key management, and a Discord delivery bot. Stack: Next.js, PostgreSQL, Python workers, Discord.

### Skills (`/skills`, zone `ventures`)

Four `SKILL_GROUPS`, grouped by where the tooling lives:

- **AI engineering**: Claude Code, Agents, RAG, Evals, Prompt design
- **Full-stack**: Next.js, TypeScript, React, Supabase, Vercel, Python, MongoDB
- **Markets**: Equity research, Financial modeling, Valuation, Thematic investing
- **Data & product**: Data pipelines, Product strategy, Go-to-market

### Education (`/education`, zone `writing`)

- **University of Michigan**, B.A. Economics
- **Weston High School**

That is the whole list. There is no Georgia Tech or OMSCS entry; it was never confirmed, so it must not be added.

### Interests (`/interests`, zone `skills`)

- DJ with a real rig
- Sneakers
- Markets and investing
- Networking
- Emerging tech

### Contact (`/contact`, zone `contact`)

Heading "Let's talk." plus the pitch to connect on AI, markets, or medicine. Channels come from `SITE`:

- Email: `matthewoshin@gmail.com`
- LinkedIn: `linkedin.com/in/mattoshin`
- GitHub: `github.com/mattoshin`
- A "Book a time" CTA backed by `SITE.calendlyUrl`, which is the literal placeholder `"CALENDLY_URL"` so it cannot ship live by accident. Matthew fills in the real Calendly link. Tracked in [[Roadmap]].

## Page-per-bucket mapping

How a route turns into rendered content and a camera depth:

1. The route (for example `/experience`) renders a `<ZoneSetter zone="about" />`, which tells the depth store to dive to that zone's center. The page reads its own copy from `content.ts` (here, `EXPERIENCE`).
2. The persistent WebGL canvas in the root layout lerps the camera toward that depth, so navigating between buckets is a dive through the water, not a page flash. The full mechanism is in [[Architecture]].
3. The nav and headers resolve the active bucket via `BUCKET_BY_HREF`, and the home launchpad renders one card per item in `BUCKETS` using each `teaser`.

Adding or changing a bucket: edit `BUCKETS` in `content.ts` for label/teaser/order, and make sure a matching route page exists with the right `<ZoneSetter zone="..." />`. Do not invent a new zone id without also wiring it into `@/lib/depth` and the scene; otherwise creatures will not gate correctly.

## Confidentiality

This is the part to get right. The site exists to make recruiters, partners, press, and investors want Matthew. It does that with the real, public story, and only that.

**OK to publish (all of it is already in `content.ts`, sourced from LinkedIn):**

- Mocean Technologies: $400K revenue, 100,000+ users, 1,000+ investor communities, founded at 19, acquired.
- Element Underground: 17,000+ attendees across NYC, Miami, Boston, and Ann Arbor.
- Profit Paradise: about 3,500 members.
- Resell Network: 11,000-member community, sold with Mocean.
- Roles, periods, and bullet points for BrachyClip, ICR, Manatuck Hill, Qult.ai, and Top Floor exactly as written above.
- Education: University of Michigan B.A. Economics and Weston High School. Nothing else.

**Never publish:**

- Personal profit or compensation figures. No money figures beyond the public ones listed above.
- Any NDA-covered material, equity stakes, or deal/acquisition terms.
- Party, alcohol, or venue details from the old 2023 private pitch PDF. That document is private. Mine the arc of the story from it if needed, never its specifics, dollar amounts, or names.
- Anything not confirmed. The Georgia Tech / OMSCS line is the canonical example: it was never confirmed, so it stays out.

Rule of thumb for any new copy: if a number or claim is not already in `content.ts` and not on Matthew's public LinkedIn, do not add it without his sign-off. The same boundary applies to [[OceanAI]], which is grounded in this bio and must answer only from the approved public story. The plan to ground OceanAI in the indexed personal brain (RAG) is tracked in [[Roadmap]] and inherits this same confidentiality boundary.

## See also

- [[Architecture]] for how routes drive the camera dive and how the persistent canvas survives navigation.
- [[OceanAI]] for the chat widget grounded in this same bio.
- [[Roadmap]] for case-study expansion, the real Calendly link, the newsletter, and RAG grounding.
