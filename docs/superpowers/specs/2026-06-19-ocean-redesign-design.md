# Personal Site Redesign: "One Ocean, Many Depths"

Generated 2026-06-19. Status: DRAFT (awaiting Matthew's review).
Repo: mattoshin/matthewoshin-site. Live at https://matthewoshin.com (Coolify droplet).

## Goal
Elevate matthewoshin.com so the **text, hero, and structure feel DigitalOcean-grade**
while keeping the **immersive ocean depth** theme. The site's job is a **strong, credible
professional home base**, the page people hit before a meeting or after the LinkedIn.
No hard sell; the work speaks. CTA stays light (connect / follow / book a time).

## Design vision: "One Ocean, Many Depths"
The whole site is ONE continuous ocean in a single persistent 3D canvas. Navigation is
not page-loading, it's **diving to a depth zone**. Per Matthew's call, the live 3D scene
is present on EVERY page (fully immersive), with the engineering to keep it readable and fast.

### Aesthetic: DigitalOcean clarity, expressed in the ocean palette
DigitalOcean's real language is deep navy + vibrant gradient accents + big bold geometric
headings + generous whitespace + clean card grids + clear structure. That maps directly
onto the existing ocean tokens (surface aqua → deep teal-navy → bio-cyan / reef-coral).
- **Typography:** bold geometric sans for headings (DO-like presence), highly readable sans
  for body. Big type, tight tracking on headers, lots of breathing room.
- **Components:** eyebrow → big headline → one-line subhead pattern; glass content panels;
  card grids; restrained accents (bio-cyan primary, reef-coral secondary used sparingly);
  light, clear CTAs.

### Readability + performance system (the make-or-break for immersive-everywhere)
- **Persistent canvas:** one WebGL context across routes (never re-mount). Route changes =
  the camera dives between depth zones, so it feels like one continuous world.
- **Glass content panels:** frosted, high-contrast panels float in front of the scene; the
  scene gently dims + blurs behind active content so text is always DO-crisp.
- **Per-page depth zones:** each section lives at its own depth (its own light, color, creatures).
- **Fallbacks:** reduced-motion and mobile fall back to a static depth-gradient (beautiful,
  instant, no jank). Heavy 3D lazy-loads. Performance budget enforced.

## Information architecture
- **Home (/)** — surface + the dive: hero (photo + name + one sharp line), short bio, then the
  depth-zone launchpad (DO-style cards) into each section.
- **/experience** — BrachyClip, ICR, Manatuck Hill, Qult.ai, Top Floor.
- **/entrepreneurship** — Ventures: Ocean Supply, Profit Paradise, Mocean, Resell Network,
  Element Underground, plus "the pattern."
- **/projects** + **/projects/[slug]** — Portfolio with case-study depth: Sigma, Galactic,
  Observly, BriefBridge, mTrain, Camp Ricky, the sites.
- **/skills** — AI engineering, full-stack, markets/quant, data/infra, product/GTM/brand, design.
- **/education** — University of Michigan econ, Weston HS, still-learning.
- **/interests** — markets, DJ, sneakers, networking, emerging tech.
- **/contact** — light CTA: email, LinkedIn, GitHub, book a time.

The existing zone IDs in `content.ts` are immutable (WebGL creatures gate on them); only
labels + content mapped onto each zone change.

## Content
- **Source of truth:** `docs/content-source.md` (mined from the wiki, gbrain, and repos;
  safe-to-publish, in Matthew's voice). Populate `src/data/content.ts` from it.
- **Sensitive items:** held per `docs/content-review.md` (32 flagged). Nothing flagged ships
  without Matthew's explicit sign-off.
- **Hero** gets Matthew's photo; **portfolio** gets project screenshots (pending assets).

## Build sequence (bank wins, don't churn)
1. **Foundation:** the DO-style design kit (type scale, the existing color tokens, components:
   eyebrow / heading / glass-panel / card / button) + the persistent-canvas + glass-panel
   readability system, proven on the **Home** first.
2. **Template:** apply it to ONE interior page (**Entrepreneurship**) end-to-end as the pattern.
   Matthew confirms it feels right.
3. **Roll out:** apply the template across the remaining pages, wiring content from `content.ts`.
4. **Polish:** dive transitions between zones, mobile / reduced-motion fallback, performance pass.

## Open items (need Matthew)
- Headshot + screenshots (Sigma, Galactic, BrachyClip).
- ICR public-phrasing OK: name ICR + the products (Beacon, etc.)? any separation/NDA limit?
  (Gates the strongest Experience entry; drafted soft + past-tense for now.)
- Calendly URL + Michigan graduation year (sources conflict 2024 vs 2025).
- Include/keep-private calls: name Jared as co-founder? surface the Susquehanna/Sigma framing?
  name the Camp Ricky friend? (All currently kept generic.)

## Out of scope (v1)
- No CMS; content stays in `content.ts`.
- No blog/writing section (the "writing" zone id is repurposed to Education).
- No analytics / marketing funnel (it's a presence site, not a funnel).

## Success criteria
- Reads as DigitalOcean-clear (typography, spacing, structure) AND immersive (live ocean on
  every page) without the text ever fighting the scene.
- Loads fast; graceful static fallback on mobile / reduced-motion.
- Every section carries real, accurate depth from `content.ts`; nothing flagged is exposed.
- Feels unmistakably like Matthew: builder, markets-to-AI throughline, ocean theme earned.
