---
title: Build Log
tags: [matthewoshin-site, build-log]
---

# Build Log

This is the commit-level history of the site, in order, straight from the git log on `main`. It is the receipts behind [[Roadmap]] (which groups these into DONE) and [[Decision Log]] (which explains why each call was made).

The whole thing was built in a single ultracode session. Each phase ran through the same loop: multi-agent build, then integrate, then adversarial browser verify, then commit. Every phase below is one commit, so the history reads cleanly as build phases plus two legibility passes that landed between Phase 6 and Phase 7. All commits are dated 2026-06-17.

To confirm the hashes and messages yourself:

```bash
git -C /Users/matthewoshin/Code/matthewoshin-site log --oneline -20
```

## The build loop

Every phase followed the same three steps before it was allowed to commit:

1. **Build**: parallel agents implement the phase (scene elements, routes, chrome, content).
2. **Integrate**: the pieces are wired into the persistent canvas and the registry, and the app is made to compile and run as one thing. See [[Architecture]] for how the canvas and routing fit together.
3. **Adversarial browser verify**: the running site is checked hard in the browser (60fps, zero console errors, responsive, reduced-motion fallback, the dive actually dives) before the phase is committed.

Each phase is its own commit, so any phase can be inspected or reverted on its own.

## Phases

| Commit | Phase | What shipped |
| --- | --- | --- |
| `cd2cbaf` | Scaffold | Initial commit from Create Next App. Bare Next.js 16 starter, nothing ocean yet. |
| `e86902a` | Phase 1: ocean descent spine | The skeleton of the Descent. Persistent WebGL canvas (`OceanCanvas`, `OceanScene`), the depth store and zone math (`src/lib/depth.ts`), the `WaterColumn` element, the scene `registry.ts` and `types.ts` contract, the reduced-motion / no-WebGL `StaticOcean` fallback, and the first chrome (`DescentChrome`, `DepthGauge`, `TopBar`, `ScrollController`). This is the spine that everything later hangs on. |
| `fec309a` | Phase 2: living ocean scene | The water came alive. Seven procedural elements added to `src/components/scene/elements/`: `WaterSurface` (Gerstner waves), `Sailboats`, `CausticsLight` (god rays), `FishSchool`, `Sharks`, `Kelp`, and `BioParticles` (plankton). All procedural, no external assets, license-clean. |
| `3a16498` | Phase 3: blend pass | The "brighter reef" turn. Palette in `globals.css` brightened from a pure dark abyss toward a friendly reef, and recognizable reef creatures added: `CoralReef`, `SeaTurtle`, `Clownfish`, `Octopus`, and the abyss `Anglerfish` with its glowing lure. Depth math (`src/lib/depth.ts`) extended to zone-gate them. See [[Decision Log]] for why blend won over both dark-only and flat-2D. |
| `4b7a971` | Phase 4: front-page launchpad + bucket nav + real content | The site got a face and a voice. Front-page launchpad and `BucketNav`, plus the real LinkedIn-sourced content wired into `src/data/content.ts` and the section components (About, Projects, Skills, Ventures, Writing, Hero). This is where it stopped being a tech demo and started being Matthew's site. Content rules live in [[Content and Buckets]]. |
| `4add6b6` | Phase 5: OCEANAI chatbot | The Claude-backed chat widget. `src/components/chrome/OceanAI.tsx` (anglerfish-lure FAB, ocean-glass panel) plus the server route `src/app/api/oceanai/route.ts`, mounted globally via `DescentChrome`. Graceful fallback so it never 500s without a key. Full detail in [[OceanAI]]. |
| `6442fcf` | Phase 6: meta-design polish | The designer's-eye pass. `FishSchool` redesigned from a glowing additive cloud to opaque steel-blue fish that read clearly and part around text, one warm `--reef-coral` accent introduced for wayfinding, and `CausticsLight`, `HeroSection`, and `Section` tuned. See [[Design System]] and [[Decision Log]]. |
| `8a52870` | Legibility pass | Lighter content scrim plus `text-shadow` so the ocean reads through behind the words. Matthew's call: legibility without darkening the background. |
| `b428ba7` | Legibility + responsive pass | Mobile hamburger nav menu plus stronger text. The site now reads on a phone. |
| `54fd782` | Phase 7: multi-page architecture | The big structural move. Each bucket became a crawlable route (`/experience`, `/entrepreneurship`, `/skills`, `/education`, `/interests`, `/contact`), depth went route-driven via `ZoneSetter` and `PageShell`, and the old single-scroll `ScrollController` was deleted. The persistent canvas survives route changes and the camera dives between pages. This is the current architecture. See [[Architecture]] for how it works and [[Decision Log]] for why multi-page beat infinite scroll. |

## Notes on the order

A few things worth knowing when reading the history:

- **The spine came first on purpose.** Phase 1 shipped the persistent canvas, the depth store, and the registry contract before a single creature existed. Everything after Phase 1 is "drop a file in `scene/elements/` plus one line in `registry.ts`," which is exactly why Phases 2 and 3 could add ten creatures fast.
- **Content landed before polish.** Phase 4 wired in the real content before the Phase 6 design polish, so the polish was tuned against real words and real section lengths, not lorem ipsum.
- **The two legibility passes (`8a52870`, `b428ba7`) are not phases.** They sit between Phase 6 and Phase 7 because they were follow-ups to the polish phase: make the text readable over the brighter water, then make it work on mobile.
- **Phase 7 is a rewrite of the navigation model, not an addition.** It deleted `ScrollController.tsx` and moved depth from scroll-driven to route-driven. If you `git diff` Phase 6 to Phase 7 you will see sections move from one big page into per-route pages under `src/app/`.

## Related pages

- [[Roadmap]] groups these phases into DONE and lays out what is NEXT.
- [[Decision Log]] explains the why behind the calls visible in this history (ocean theme, multi-page, blend palette, procedural creatures, fish redesign, light scrim, coral accent, AI fallback).
- [[Architecture]] for the current route-driven, persistent-canvas model that Phase 7 landed.
- [[Ocean Scene]] for the creatures added in Phases 2 and 3 and the registry contract from Phase 1.
- [[OceanAI]] for the Phase 5 chat widget.
- [[Project Overview]] and [[Home]] for the wider map.
