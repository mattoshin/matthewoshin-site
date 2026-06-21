# The Deep — landing redesign

Date: 2026-06-20
Supersedes: `2026-06-19-ocean-redesign-design.md` ("One Ocean, Many Depths")
Branch: `redesign/the-deep`

## Why

The prior design read as three clashing voices: a whimsical cartoon "Moana" ocean
(sailboats, water-skier, golden-hour sun), a formal corporate suit headshot, and an
editorial serif. The dissonance, not any single element, is why it never "felt
right." All the craft went into the ocean engineering, which then fought the
content for attention.

## Decision

Keep the ocean (it is authentic to Matthew's brand: Ocean Supply, Mocean) but move
it from cartoon to **cinematic**. The descent becomes meaningful: surface = first
impression (hook + proof), descending = the substance (track record, ventures,
craft). The mechanic and the message finally agree.

Direction chosen: **The Deep** — a dark, premium descent with one cold light shaft,
drifting marine snow, and restrained bioluminescent accents. Job of the site:
serious credibility AND memorable (proof-forward, but unforgettable). Photo stays
in the hero (Matthew likes it); the clash is fixed by replacing the cartoon
background and seating the photo with a refined cool-graded frame.

## Design system

- **Palette:** ink/near-black navy base, deepening to true ink at the seabed. The
  surface is a cold dim steel-teal "light above," never a bright sky. ONE accent:
  bioluminescent cyan (`--bio-cyan #41e0e6`), used sparingly (key metrics, active
  nav, hover, links). Warm coral retired. Light type on dark everywhere → one
  coherent system, no bright-surface special case.
- **Type:** Georgia display (Matthew's stated preference), Hanken Grotesk body,
  JetBrains Mono for the "instrument readout" depth labels (kept — they are a
  genuine signature). Big headings, tight tracking, generous space.
- **Motion:** cinematic dive easing (existing lerp), staggered reveal-on-enter,
  bioluminescent hover accents. `prefers-reduced-motion` → static deep gradient.

## Hero (the biggest fix)

- Type-forward + **proof in 3 seconds**: mono eyebrow, large name, a sharp one-line
  positioning (Matthew's own `SITE.tagline`), then 3–4 tasteful proof chips, then
  two CTAs (Book a time / See the work), then the descend cue.
- Portrait kept, but premium: refined frame (hairline cyan ring + soft glow), light
  cool grade so it belongs in The Deep. Image stays recognizable.

## Scene (re-skin, not rebuild)

- Retire from the registry: `surface` (cartoon sky), `sailboats`, `water-skier`,
  `submarine`, `fish-patrol`. Files kept on disk (checkpointed).
- `WaterColumn`: recolor to cinematic (cold dim top → near-ink bottom) + a single
  cold god-ray cone that fades as you sink. Faint secondary shafts.
- `DescentBubbles` → retune to slow, fine **marine snow** (next phase).
- Add tasteful **bioluminescent** accents that bloom per zone on arrival (next
  phase) instead of cartoon creatures.
- Perf: fewer always-on objects than today; delete 13 dead creature files and prune
  unused deps (gsap / lenis / motion if confirmed unused).

## Content hierarchy (kills the monotony)

- Replace identical dark slabs with an editorial system: each venture gets ONE
  headline metric; skills become a tight inventory; Experience gets the human
  portrait beat; contact gets a strong closer. Minimal glass, hairline rules.

## Build sequence

1. **Foundation + hero (this pass):** palette tokens, depth zones, cinematic water
   column, retire cartoon scene, rebuilt hero. Verify live, bank the win.
2. **Scene life:** marine snow + bioluminescent per-zone blooms; god-ray polish.
3. **Content hierarchy:** venture metric cards, skills inventory, contact closer,
   interior-page consistency.
4. **Cleanup + a11y + perf:** delete dead files, prune deps, a11y/perf pass.
5. **QA:** full descent + mobile in-browser; adversarial design review.

## Confidentiality

Per `docs/content-review.md`: never surface flagged private figures (Mocean exact
deal value, BrachyClip raise, ICR internals) without explicit OK. Proof points use
tasteful public framings only ("founded + sold Mocean", "CAIO at BrachyClip",
"equity research", attendee counts already in `content.ts`).

## Out of scope (v1)

No CMS, no blog, no analytics funnel. Content stays in `content.ts`.
