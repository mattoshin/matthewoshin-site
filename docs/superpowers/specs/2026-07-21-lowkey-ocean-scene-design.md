# Lowkey ocean scene: drop the spectacle boats, calm the loudest creatures, dim the canvas

**Date:** 2026-07-21
**Branch:** `matt/lowkey-ocean-scene`
**Status:** Approved, building.

## Goal

Matthew's ask: "get rid of the boats and make it more lowkey... focus this on being cool but
be more like everyone else and basic with certain elements... make it humble to help me get a
job and lowkey." The site is his portfolio for institutional-recruiter audiences (warm intros);
the prior "humility audit" (PRs #85-87) already stripped boat hull lettering and swagger copy.
This pass goes further on the visuals: remove the two showiest set-pieces (speedboat+skier,
dolphin), keep one quiet sailboat as the sole surface actor, mute the two most cartoon-bright
per-section creatures, and pull the whole 3D layer back in visual intensity so page content
reads first, ocean second.

**Out of scope this round:** nav/chrome, copy, layout structure, and the other four per-section
creatures (Sharks, Sea Turtle, Anglerfish, Submarine's color — its scale is in scope, see below).

## Decisions (locked with Matthew)

- **Boats:** remove `WaterSkier` (the speedboat + towed skier, "Lamborghini") and `Dolphin`
  entirely. Keep `Sailboats` (the sailboat, "Black Pearl") as the only surface actor, but strip
  its skull-and-crossbones mainsail emblem — a pirate flag doesn't read "humble."
- **Per-section creatures:** stay one-per-section (no sections dropped to plain water). Only
  the two most saturated/fast creatures get toned down: Octopus and Clownfish. Sharks, Sea
  Turtle, and Anglerfish already read as restrained ambient silhouettes per the code survey —
  left alone. Submarine's "showy" trait is scale, not color — modest scale trim only.
- **Canvas prominence:** a CSS filter over the existing full-bleed fixed canvas (saturate +
  brightness dialed down), not a structural/layout change. The canvas stays fixed/full-viewport
  — that's core to the "persistent ocean" concept — it just visually recedes.
- **AGENTS.md conflict:** this repo's own standing rule says "16 creatures in the descent zone,
  do not regress creature count or spacing." Dropping WaterSkier + Dolphin takes
  `SCENE_ELEMENTS` from 16 to 14. Matthew is overriding this rule directly in this session — the
  rule text gets updated as part of this change so it doesn't sit there contradicting reality.

## Part 1 — Remove the spectacle boats

### Files deleted
- `src/components/scene/elements/WaterSkier.tsx`
- `src/components/scene/elements/Dolphin.tsx`

### `registry.ts`
- Remove the `{ id: "water-skier", ... }` and `{ id: "dolphin", ... }` entries from
  `SCENE_ELEMENTS` (16 → 14 entries).
- Remove `"water-skier"` from `PHONE_IDS` (dolphin is already absent from the phone set).
- Remove `"water-skier"` from `PHONE_LITE_IDS`: `{surface, water-column, sailboats,
  water-skier}` → `{surface, water-column, sailboats}`. This matters — the phone
  `PerformanceMonitor` fallback path degrades to `PHONE_LITE_IDS` under load, so leaving
  `water-skier` there would resurrect the boat on struggling phones even after full removal.
- Update the file's own doc comments (currently reference "Black Pearl + Lamborghini skier +
  dolphin" as the surface signature) to describe the new reality: sailboat only.

### `Sailboats.tsx`
- Remove the skull-and-crossbones `EMBLEM` mesh/texture logic baked onto the mainsail.
- Everything else — hull (`#140f0d`), sails (`#efe9db`/`#f7f3ea`), lantern glow, weathered
  torn-flag texture, `SHIP_SCALE`/`SHIP_Z` positioning — stays as-is. It reads as an old wooden
  sailboat, not a pirate ship, once the emblem is gone.

## Part 2 — Calm the two loudest creatures

### Octopus (`elements/Octopus.tsx`)
Currently the most saturated element in the scene: warm bright orange body (`#E0653C`) with a
bright cyan rim light (`#7FD6E0`). Desaturate the body toward a muted rust/terracotta, dial the
rim-light intensity/opacity down so it reads as ambient glow, not a highlight. Keep recognizable
as an octopus — this is a hue/saturation shift, not a redesign. Exact hex chosen against the
live file during implementation.

### Clownfish (`elements/Clownfish.tsx`)
Second-most saturated (bright orange/white Nemo palette) and the fastest-moving ambient
creature in the scene (`SPEED 1.05`, vs. ~0.02 for the other ambient creatures). Cut speed by
roughly a third (target ballpark ~0.65-0.7) and mute the orange toward the same muted-coral
direction as the Octopus fix, so the two don't clash once both are toned down.

### Submarine (`elements/Submarine.tsx`)
Already color-neutral (charcoal/metallic, no bright accents); its showiness is sheer scale —
the code comment says it's deliberately slow "so it reads as large." Trim scale modestly
(~10%) so it's present without commanding the frame. Leave `BASE_SPEED` and color untouched.

### Untouched by design
Sharks, Sea Turtle, Anglerfish — code survey confirmed these already read as slow, muted,
distant silhouettes (sharks pushed to `z -17..-27` as "distant silhouettes," sea turtle
comment says "calm, unhurried cruise," anglerfish is near-black with only its lure glowing).
No changes.

## Part 3 — Dim the canvas

### Canvas filter
Add a CSS `filter` to the canvas wrapper layer in `OceanCanvas.tsx` (or its container in
globals.css, whichever holds the mount point): starting values `saturate(0.85)
brightness(0.95)`. Tune by eye once live — this is the single control point for "how far back"
the ocean sits, so it's cheap to nudge without touching any Three.js/shader code.

### Scrim adjustment
`globals.css`'s `.section-scrim` (the glass panels holding page copy) currently sets
`backdrop-filter: blur(12px) saturate(120%)` — it *boosts* the saturation of whatever's behind
it by 20%, which works against a calmer backdrop. Drop that to `saturate(95%)`, keep
`blur(12px)` for readability.

### Untouched by design
No changes to `OceanScene.tsx` lighting (`ambientLight intensity={0.6}`), fog, camera, or the
`WaterSurface.tsx` shader itself. This keeps the change to one reversible lever (Approach A,
picked over deeper in-scene tuning) rather than touching the rendering pipeline.

## Part 4 — Housekeeping

- Update `AGENTS.md`'s design rule: replace "16 creatures in the descent zone. Do not regress
  creature count or spacing." with the new count (14) and a note that this supersedes the prior
  rule as of this change, so the doc doesn't silently rot into a contradiction.
- No test file changes expected unless an existing test asserts the old creature count or
  references `WaterSkier`/`Dolphin` by name (check `src/__tests__/` during implementation).

## Build order

1. Registry + file deletions (WaterSkier, Dolphin removed from `SCENE_ELEMENTS`, `PHONE_IDS`,
   `PHONE_LITE_IDS`; files deleted; doc comments updated).
2. Sailboats emblem removal.
3. Octopus + Clownfish + Submarine tuning (independent of step 1/2, can parallelize).
4. Canvas filter + scrim adjustment (independent, can parallelize).
5. AGENTS.md rule update.

## Verification

- `pnpm typecheck`, `pnpm test`, `pnpm build` all green.
- Grep for any lingering `WaterSkier`/`Dolphin` references (imports, tests, doc comments)
  after deletion.
- Chrome DevTools MCP screenshot pass (Playwright MCP times out on the always-animating WebGL
  canvas per prior sessions — use `take_screenshot` instead) at desktop width and phone width
  (~390px), confirming: no skier, no dolphin, sailboat has no skull emblem, Octopus/Clownfish
  visibly muted, overall canvas reads dimmer than before.
- Force the phone-lite fallback path (or read the code path directly) to confirm it no longer
  references `water-skier`.
