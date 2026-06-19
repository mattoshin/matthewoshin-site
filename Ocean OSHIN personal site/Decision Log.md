---
title: Decision Log
tags: [matthewoshin-site, decisions]
---

# Decision Log

This is the "why" behind the build. Each entry is one key decision: what we chose, what we passed on, and the reasoning. If you are about to undo one of these, read the rationale first so you do not relearn it the hard way.

For the "how" that these decisions produced, see [[Architecture]], [[Design System]], [[Ocean Scene]], and [[OceanAI]]. For the chronological commit-by-commit record, see [[Build Log]].

## Quick reference

| # | Decision | We chose | We passed on |
|---|----------|----------|--------------|
| 1 | Core concept | Ocean "Descent" (move down through water) | A conventional sectioned portfolio |
| 2 | Navigation model | Full multi-page, route-driven dive | Pure infinite single-scroll |
| 3 | Palette direction | Blended brighter reef | Pure dark abyss / flat 2D cartoon |
| 4 | Creature assets | Procedural only | External 3D models |
| 5 | Fish look | Opaque steel-blue schooling fish | Glowing additive cloud |
| 6 | Text legibility | Light scrim + text-shadow | Darkening the background |
| 7 | Accent color | One warm coral | A second/third accent or no accent |
| 8 | OceanAI reliability | Graceful canned fallback | Hard failure when no API key |

## 1. Ocean "Descent" as the core concept

### Decision
Build the site as an ocean you move down through. Navigating descends you from a sunlit surface to a bioluminescent abyss. See [[Ocean Scene]] for how this renders.

### Alternatives considered
- A conventional portfolio (hero, grid of projects, about, contact).
- A more generic "creative dev" parallax site with no unifying metaphor.

### Rationale
The medium proves the message. Matthew is a builder, so the site itself should be the proof, not a list of claims. The theme is also authentic to his real ventures, which are already ocean-coded: Ocean Supply (his sneaker business), Mocean Technologies (M.Oshin plus Ocean, shark logo), and Profit Paradise (palm-tree logo). The concept is not decoration bolted on top, it is true to the person. See [[Project Overview]] for the north star ("the link Matthew hands out that makes someone want him").

## 2. Hybrid, then full multi-page (route-driven dive)

### Decision
Move from a single infinite-scroll page to a full multi-page app where each content bucket gets its own crawlable URL. One persistent WebGL canvas lives in the root layout and survives client-side route changes, so navigating between pages dives the camera through the water instead of remounting. See [[Architecture]] for the route-to-depth wiring.

### Alternatives considered
- Pure infinite single-scroll, where the whole experience lives at `/` and depth is driven purely by scroll position (the original Phase 1 to 6 model).
- A hybrid where some content stayed on the scroll spine and some moved to routes.

### Rationale
Pure infinite scroll tanks SEO and shareability. There is no clean URL to link a recruiter to "Entrepreneurship," no per-page Open Graph image, nothing for crawlers to index well. Multi-page gives every bucket a real address (`/experience`, `/entrepreneurship`, `/skills`, `/education`, `/interests`, `/contact`) while the persistent canvas keeps the dive feeling continuous. Depth became route-driven: each page renders a `ZoneSetter` that sets the target depth, and the in-canvas controller lerps the camera and fog toward it. Page scroll no longer changes depth. This is why `lenis` and `gsap`, central in the single-scroll era, are now largely unused. See [[Content and Buckets]] for the route map and [[Roadmap]] for the per-page OG images that this unlocked.

## 3. Blended "brighter reef" palette

### Decision
Brighten the depth-zone palette toward a friendly, recognizable reef. Deep zones stay rich dark teal-navy rather than going black (for example abyss is `#071824`). See [[Design System]] for the full token set.

### Alternatives considered
- A pure dark-abyss palette: mostly black water, maximum mystery, minimal color.
- A flat 2D cartoon look modeled on a Dribbble illustration reference.

### Rationale
Pure dark abyss read as cold and hard to navigate, and it buried the content. The flat cartoon reference looked charming in a static frame but cheap in motion and off-brand for someone selling himself to recruiters, partners, and investors. The blend keeps the descent legible and inviting while still going genuinely deep and dark at the bottom. Creatures stay recognizable (you can tell a turtle from a shark) instead of dissolving into silhouettes too early.

## 4. Procedural creatures only

### Decision
Every scene element is generated in code. No external 3D models, textures, or assets. See [[Ocean Scene]] for the registry of elements in `src/components/scene/elements/`.

### Alternatives considered
- Importing rigged glTF/GLB models for fish, sharks, turtle, octopus, and so on.
- Mixing a few purchased or free models with procedural extras.

### Rationale
License-cleanliness and self-containment. Procedural means no attribution obligations, no licensing risk on a site Matthew hands to press and investors, and no asset pipeline to maintain. The whole scene is just TypeScript and shaders, so it stays small, version-controllable, and trivially portable. Adding a creature is dropping a file in `scene/elements/` and one line in `scene/registry.ts`. The tradeoff is more authoring effort per creature, accepted on purpose.

## 5. Fish redesigned to opaque steel-blue schooling fish

### Decision
Replace the original glowing additive fish cloud with roughly 160 opaque steel-blue instanced fish that school and part around content. Implemented in `src/components/scene/elements/FishSchool.tsx`.

### Alternatives considered
- Keeping the earlier glowing, additive-blended particle cloud that read as fish.
- A denser cloud of even more, smaller, dimmer particles.

### Rationale
The additive cloud read as vague light, not fish, and it washed out wherever it overlapped bright water or text. Opaque steel-blue fish read clearly as fish at a glance, hold their form against any background, and add real motion design when they school and part around the content card. This was part of the Phase 6 meta-design polish where the scene stopped looking like tech-demo particles and started looking intentional.

## 6. Light scrim plus text-shadow for legibility

### Decision
Achieve readable text over the live ocean with a light translucent scrim (`.section-scrim`, around 44 to 52 percent dark) plus `.hero-halo` text-shadow utilities, rather than darkening the scene. See [[Design System]] for the exact utilities.

### Alternatives considered
- A heavy dark overlay behind every content block to guarantee contrast.
- A solid opaque content panel that hides the ocean behind it entirely.

### Rationale
Matthew explicitly wanted the ocean to read through the content, not get blacked out behind a panel. A heavy overlay would have killed the whole point of the descent. The fix was to keep the scrim intentionally light and lean on text-shadow halos so the type stays WCAG AA legible while the water, light shafts, and creatures remain visible underneath. This is the change in the "lighter content scrim plus text-shadow legibility" pass, refined again in the responsive and stronger-text follow-up. See [[Build Log]].

## 7. One warm coral accent

### Decision
Use a single warm accent, `--reef-coral` (`#ff9b5a`), for wayfinding: eyebrows, the active nav pill, and hovers. Everything else stays in the cool ocean range. See [[Design System]].

### Alternatives considered
- Multiple accent colors to differentiate buckets or states.
- No warm accent, keeping a fully monochromatic cool palette.

### Rationale
The water is entirely cool blues and teals, so cool-on-cool interactive states disappear. One warm color pops hard against that field and instantly signals "this is where you are / where you can go." Restraint matters: limiting it to one accent used sparingly keeps the wayfinding obvious and the design disciplined instead of carnival-colored. The coral also nods back to the reef palette decision (#3) so it reads as part of the ocean, not bolted on.

## 8. OceanAI graceful fallback

### Decision
The OceanAI chat widget never breaks. The server route (`src/app/api/oceanai/route.ts`, model `claude-haiku-4-5`) returns a canned, on-brand bio reply whenever `ANTHROPIC_API_KEY` is missing or the upstream call fails. It never returns a 500. See [[OceanAI]].

### Alternatives considered
- Letting the endpoint error out or surface a failure state to the user when the key is absent or Anthropic is down.
- Hiding the widget entirely unless a key is configured.

### Rationale
This is a portfolio site that gets handed to people cold, often on a deployment where the key may not be set yet. A chatbot that errors in front of a recruiter is worse than no chatbot. The graceful fallback means the feature degrades into a useful canned answer instead of a broken UI, so the site always looks finished. It also lets the public Vercel build ship safely before the live key is added. The planned upgrade is to ground OceanAI in gbrain (RAG) so it answers from Matthew's real indexed history, with the same static fallback preserved. See [[Roadmap]].

## Related pages

- [[Architecture]]: the persistent canvas and route-driven depth that decisions 1 and 2 produced.
- [[Design System]]: the tokens, scrim, and accent from decisions 3, 6, and 7.
- [[Ocean Scene]]: the procedural element registry from decisions 4 and 5.
- [[OceanAI]]: the chat widget and fallback from decision 8.
- [[Build Log]]: the phase-by-phase commit history these decisions map onto.
- [[Roadmap]]: what is next, including OG images and gbrain-grounded OceanAI.
