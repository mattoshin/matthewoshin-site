# Lowkey Ocean Scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the speedboat+skier and dolphin from the 3D ocean scene, strip the skull-and-crossbones emblem off the remaining sailboat, mute the two most cartoon-bright per-section creatures (Octopus, Clownfish), trim the Submarine's scale, and dim the whole canvas's visual prominence — so the site reads humbler for a job-search audience.

**Architecture:** No new abstractions. Every change is a targeted edit to existing files: remove two entries + two files from the scene registry, delete dead geometry from one component, tune existing color/speed/scale constants in three components, add one CSS filter + adjust one existing backdrop-filter value, and update stale doc comments that assumed the removed boats still existed (including this repo's own `AGENTS.md` design rule, which explicitly locked "16 creatures" — this change supersedes that rule with Matthew's direct sign-off, see the spec).

**Tech Stack:** Next.js 16, React 19, TypeScript, react-three-fiber/three.js (scene elements), Tailwind v4 + plain CSS (`globals.css`), vitest 4 (tests).

## Global Constraints

- `pnpm typecheck`, `pnpm test`, and `pnpm build` must all stay green after every task (CI gate, `.github/workflows/test.yml`).
- Work happens on branch `matt/lowkey-ocean-scene`, in the isolated worktree `~/Code/matthewoshin-site-lowkey` (this repo runs parallel agent sessions; never work in a shared checkout — `AGENTS.md`).
- Commit only the files each task actually changed — never `git add -A`.
- No `Math.random()` at render in any scene element (React Compiler constraint already respected by the existing code; do not introduce it).
- Every fact this plan states about current file contents (line numbers, exact code) was read directly from the worktree on 2026-07-21 — if a step's `old_string` doesn't match the live file exactly, stop and re-read the file rather than forcing the edit.
- Spec: `docs/superpowers/specs/2026-07-21-lowkey-ocean-scene-design.md`.

---

## Task 1: Remove the speedboat+skier and dolphin from the scene registry

**Files:**
- Modify: `src/components/scene/registry.ts`
- Delete: `src/components/scene/elements/WaterSkier.tsx`
- Delete: `src/components/scene/elements/Dolphin.tsx`
- Modify: `src/components/scene/OceanCanvas.tsx` (stale comments only)
- Modify: `src/lib/useDeviceTier.ts` (stale comment only)
- Modify: `src/components/scene/elements/Surface.tsx` (stale comment only)
- Modify: `AGENTS.md` (design rule)
- Test: `src/__tests__/scene-registry.test.ts` (new)

**Interfaces:**
- Produces: `SCENE_ELEMENTS` (14 entries, no `"water-skier"` or `"dolphin"` ids), `SCENE_ELEMENTS_PHONE`, `SCENE_ELEMENTS_PHONE_LITE`, `elementsForTier(tier, lite)` — all exported from `src/components/scene/registry.ts`, unchanged signatures. Tasks 2-6 don't depend on this task's internals (disjoint files), but Task 7's verification depends on this task being done first.

- [ ] **Step 1: Write the failing regression test**

Create `src/__tests__/scene-registry.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  SCENE_ELEMENTS,
  SCENE_ELEMENTS_PHONE,
  SCENE_ELEMENTS_PHONE_LITE,
} from "@/components/scene/registry";

/**
 * Regression guard for the 2026-07-21 "lowkey ocean scene" pass: the
 * speedboat+skier and dolphin were removed as showy set-pieces. The
 * phone-lite fallback (which resurrects elements when FPS can't hold) must
 * not bring the boat back - that was the exact bug class fixed on 2026-06-22
 * for the original phone-tier work.
 */
describe("scene registry", () => {
  it("no longer includes the speedboat+skier or the dolphin", () => {
    const ids = SCENE_ELEMENTS.map((e) => e.id);
    expect(ids).not.toContain("water-skier");
    expect(ids).not.toContain("dolphin");
  });

  it("keeps the sailboat as the lone surface actor", () => {
    expect(SCENE_ELEMENTS.map((e) => e.id)).toContain("sailboats");
  });

  it("has 14 elements after the boat removal (was 16)", () => {
    expect(SCENE_ELEMENTS.length).toBe(14);
  });

  it("phone and phone-lite fallbacks never resurrect the speedboat+skier", () => {
    expect(SCENE_ELEMENTS_PHONE.map((e) => e.id)).not.toContain("water-skier");
    expect(SCENE_ELEMENTS_PHONE_LITE.map((e) => e.id)).not.toContain("water-skier");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test scene-registry`
Expected: FAIL — `SCENE_ELEMENTS` still has 16 entries and includes `"water-skier"` and `"dolphin"`.

- [ ] **Step 3: Replace `src/components/scene/registry.ts` in full**

The file is small enough to replace wholesale rather than patch — this removes both imports, both array entries, both phone-set references, and updates every doc comment in one pass:

```ts
/**
 * scene/registry.ts - the ordered list of scene elements rendered by OceanScene.
 *
 * THIS is the only file you edit to add a new 3D element. See the full contract
 * in src/components/scene/types.ts.
 *
 * Add a line below:
 *   import Fish from "./elements/Fish";
 *   ...
 *   { id: "fish", Component: Fish },
 *
 * Elements draw in array order (later entries render after earlier ones).
 *
 * ONE SIGNATURE ANIMATION PER SECTION (by depth band):
 *   surface  -> the surface scene (sailboat, quiet)
 *   about    -> Clownfish (Nemo)            [0.16-0.32]
 *   projects -> Submarine                   [0.33-0.49]
 *   ventures -> Sharks                      [0.50-0.66]
 *   writing  -> Anglerfish                  [0.66-0.80]
 *   skills   -> Sea Turtle                  [0.76-0.90]
 *   contact  -> Octopus, on the floor       [0.90-1.0]
 * Coral + kelp are seabed SCENERY (not a moving creature). The big fish school
 * was retired - one group per section, no hundred-fish crowds.
 *
 * 2026-07-21: the speedboat+skier and dolphin were removed as showy
 * set-pieces (14 elements, was 16) - see docs/superpowers/specs/2026-07-21-
 * lowkey-ocean-scene-design.md. This supersedes AGENTS.md's old "16
 * creatures, do not regress" rule, which was updated alongside this change.
 */

import WaterColumn from "./elements/WaterColumn";
import BioParticles from "./elements/BioParticles";
import CoralReef from "./elements/CoralReef";
import Kelp from "./elements/Kelp";
import Octopus from "./elements/Octopus";
import Anglerfish from "./elements/Anglerfish";
import Submarine from "./elements/Submarine";
import Sharks from "./elements/Sharks";
import SeaTurtle from "./elements/SeaTurtle";
import Clownfish from "./elements/Clownfish";
import CausticsLight from "./elements/CausticsLight";
import WaterSurface from "./elements/WaterSurface";
import Sailboats from "./elements/Sailboats";
import Surface from "./elements/Surface";
import type { SceneElementEntry } from "./types";
import type { DeviceTier } from "@/lib/useDeviceTier";

// `actor: true` marks the moving vessels + creatures that hide during a live
// window resize (see SceneElementEntry.actor). Water + scenery have no flag.
export const SCENE_ELEMENTS: readonly SceneElementEntry[] = [
  { id: "surface", Component: Surface },
  { id: "water-column", Component: WaterColumn },
  { id: "bioparticles", Component: BioParticles },
  { id: "coral-reef", Component: CoralReef },
  { id: "kelp", Component: Kelp },
  { id: "octopus", Component: Octopus, actor: true },
  { id: "anglerfish", Component: Anglerfish, actor: true },
  { id: "submarine", Component: Submarine, actor: true },
  { id: "sharks", Component: Sharks, actor: true },
  { id: "sea-turtle", Component: SeaTurtle, actor: true },
  { id: "clownfish", Component: Clownfish, actor: true },
  { id: "caustics-light", Component: CausticsLight },
  { id: "water-surface", Component: WaterSurface },
  { id: "sailboats", Component: Sailboats, actor: true },
];

/**
 * PHONE PROFILE (<= 767px). The full scene is too heavy for a phone, so we keep
 * the surface hero (sky/water + sailboat + light plankton) plus
 * the one signature creature per section, and DROP the pure scenery + the
 * heaviest shaders:
 *   dropped: coral-reef, kelp, caustics-light, water-surface
 * Order is preserved by filtering the full list, so draw order never drifts.
 */
const PHONE_IDS = new Set<string>([
  "surface",
  "water-column",
  "bioparticles",
  "octopus", // contact
  "anglerfish", // writing
  "submarine", // projects
  "sharks", // ventures
  "sea-turtle", // skills
  "clownfish", // about
  "sailboats",
]);

/**
 * PHONE-LITE: the graceful-degradation floor. If even the phone profile can't
 * hold FPS, the PerformanceMonitor drops to this hero-only set instead of
 * blanking to the static gradient, so the sailboat never vanishes.
 */
const PHONE_LITE_IDS = new Set<string>([
  "surface",
  "water-column",
  "sailboats",
]);

export const SCENE_ELEMENTS_PHONE: readonly SceneElementEntry[] =
  SCENE_ELEMENTS.filter((e) => PHONE_IDS.has(e.id));

export const SCENE_ELEMENTS_PHONE_LITE: readonly SceneElementEntry[] =
  SCENE_ELEMENTS.filter((e) => PHONE_LITE_IDS.has(e.id));

/** Pick the element set for the current device tier + degradation state. */
export function elementsForTier(
  tier: DeviceTier,
  lite: boolean,
): readonly SceneElementEntry[] {
  if (tier !== "phone") return SCENE_ELEMENTS;
  return lite ? SCENE_ELEMENTS_PHONE_LITE : SCENE_ELEMENTS_PHONE;
}
```

- [ ] **Step 4: Delete the two element files**

```bash
git rm src/components/scene/elements/WaterSkier.tsx
git rm src/components/scene/elements/Dolphin.tsx
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test scene-registry`
Expected: PASS (4/4).

- [ ] **Step 6: Run full typecheck to confirm no other file broke**

Run: `pnpm typecheck`
Expected: PASS. (Confirms nothing else imports `WaterSkier`/`Dolphin` directly — already verified during planning via `grep -rln "from \"./elements/WaterSkier\"" src/` returning only `registry.ts`, but typecheck is the authoritative check.)

- [ ] **Step 7: Commit the core removal**

```bash
git add src/components/scene/registry.ts src/__tests__/scene-registry.test.ts
git rm src/components/scene/elements/WaterSkier.tsx src/components/scene/elements/Dolphin.tsx
git commit -m "feat(ocean): remove speedboat+skier and dolphin from the scene

Two showy set-pieces cut for a more lowkey, job-search-facing site. The
sailboat is now the only surface actor. Registry drops from 16 to 14
elements; phone and phone-lite fallbacks updated so neither path can
resurrect the removed boat under FPS pressure."
```

- [ ] **Step 8: Fix the stale "Lamborghini + Black Pearl" comments in `OceanCanvas.tsx`**

Four separate edits in `src/components/scene/OceanCanvas.tsx`:

Edit 1 — old:
```
  // hero (Lamborghini + Black Pearl) reads crisp on retina panels. The trimmed
```
new:
```
  // hero (the sailboat) reads crisp on retina panels. The trimmed
```

Edit 2 — old:
```
  // blanking the whole scene to static when FPS can't hold. The Lamborghini +
  // Black Pearl survive every degradation path.
```
new:
```
  // blanking the whole scene to static when FPS can't hold. The sailboat
  // survives every degradation path.
```

Edit 3 — old:
```
  // During a live window-corner drag, hide the moving actors (boats, dolphin,
```
new:
```
  // During a live window-corner drag, hide the moving actors (the sailboat,
```

Edit 4 — old:
```
              // dropping the Lamborghini + Black Pearl on every FPS dip.
```
new:
```
              // dropping the sailboat on every FPS dip.
```

- [ ] **Step 9: Fix the stale comment in `src/lib/useDeviceTier.ts`**

old:
```
 * fidelity (16 elements, DPR up to 1.5, shader surfaces, 4k plankton). Left
 * unchecked, FPS collapses and the canvas hard-falls-back to the flat static
 * gradient, taking the Lamborghini + Black Pearl with it. So phones run a
```
new:
```
 * fidelity (14 elements, DPR up to 1.5, shader surfaces, 4k plankton). Left
 * unchecked, FPS collapses and the canvas hard-falls-back to the flat static
 * gradient, taking the sailboat with it. So phones run a
```

- [ ] **Step 10: Fix the stale comment in `src/components/scene/elements/Surface.tsx`**

old:
```
    // pegs to the waterline via HORIZON_K (dolphin, boats). Keep Y at 1 so the
```
new:
```
    // pegs to the waterline via HORIZON_K (the sailboat). Keep Y at 1 so the
```

- [ ] **Step 11: Update the `AGENTS.md` design rule**

old:
```
- 16 creatures in the descent zone. Do not regress creature count or spacing.
```
new:
```
- 14 creatures in the descent zone (was 16; the speedboat+skier and dolphin were removed 2026-07-21 for a "lowkey" pass — see docs/superpowers/specs/2026-07-21-lowkey-ocean-scene-design.md). Do not regress below 14 or spacing.
```

- [ ] **Step 12: Run typecheck once more, then commit the comment sweep**

Run: `pnpm typecheck`
Expected: PASS.

```bash
git add src/components/scene/OceanCanvas.tsx src/lib/useDeviceTier.ts src/components/scene/elements/Surface.tsx AGENTS.md
git commit -m "docs(ocean): fix stale Lamborghini/Black Pearl/16-creature comments

Follow-up to the boat removal - these comments described elements that no
longer exist. AGENTS.md's design rule updated to the new count (14) so it
stops contradicting the registry."
```

---

## Task 2: Strip the skull-and-crossbones emblem off the sailboat

**Files:**
- Modify: `src/components/scene/elements/Sailboats.tsx`

**Interfaces:** No other task depends on this file. Independent of Task 1 (can run in parallel) and Tasks 3-6.

No automated test applies here — this repo has no render tests for react-three-fiber scene elements (they require a live WebGL context; `TESTING.md` explicitly documents visual/3D changes as "not automated yet, verified per-change with Playwright/Chrome DevTools screenshots"). Verification for this task is `pnpm typecheck` plus the Task 7 visual pass.

- [ ] **Step 1: Update the file's header comment** (removes the skull-and-crossbones description, softens "menacing," drops the now-gone Lamborghini references since that boat no longer exists)

old:
```
/**
 * Sailboats - THE BLACK PEARL. A papercut galleon silhouette riding the surface:
 * a long near-black hull with a tall stern castle + stern lantern, three masts
 * of WHITE square sails, a skull-and-crossbones on the mainsail, rigging stays,
 * flags at each masthead, and a bowsprit + figurehead. Flat camera-facing shapes
 * (ShapeGeometry / Plane), the scene's papercut idiom - just bigger and menacing.
 * No name lettering on the hull (removed 2026-07-19 by Matthew's call).
 *
 * SURFACE band: past ~progress 0.24 it hides + early-returns. While visible it
 * DRIFTS UP with the surface. It rides a FAR plane (z=-15) vs the Lamborghini
 * speedboat (z=-10), cruising slowly LEFT -> RIGHT (opposite the Lambo), wrapping
 * with an opacity edge-fade so the loop is a seamless carousel, not a teleport.
 *
 * Contract: default-exported SceneElement; reads `progress` imperatively each
 * frame; mutates ONLY refs it owns to satisfy the React-Compiler lint.
 */
```
new:
```
/**
 * Sailboats - THE BLACK PEARL. A papercut galleon silhouette riding the surface:
 * a long near-black hull with a tall stern castle + stern lantern, three masts
 * of WHITE square sails, rigging stays, flags at each masthead, and a bowsprit +
 * figurehead. Flat camera-facing shapes (ShapeGeometry / Plane), the scene's
 * papercut idiom.
 * No name lettering on the hull (removed 2026-07-19); no mainsail emblem
 * (removed 2026-07-21, "lowkey" pass) - just a plain sailboat now.
 *
 * SURFACE band: past ~progress 0.24 it hides + early-returns. While visible it
 * DRIFTS UP with the surface, cruising slowly LEFT -> RIGHT, wrapping with an
 * opacity edge-fade so the loop is a seamless carousel, not a teleport.
 *
 * Contract: default-exported SceneElement; reads `progress` imperatively each
 * frame; mutates ONLY refs it owns to satisfy the React-Compiler lint.
 */
```

- [ ] **Step 2: Fix the `swell()` doc comment** (references "the water-skier rides," now gone)

old:
```
/** Shared sine-sum swell (same sea the water-skier rides). */
function swell(x: number, z: number, t: number): number {
```
new:
```
/** Sine-sum swell driving the sailboat's bob/pitch on the surface. */
function swell(x: number, z: number, t: number): number {
```

- [ ] **Step 3: Remove the `EMBLEM` palette constant**

old:
```
const EMBLEM = "#16120f"; // skull + crossbones, dark on the white sail
```
new: (delete the line entirely)

- [ ] **Step 4: Remove the four emblem-only geometry factory functions**

old:
```
function makeDiscGeometry(r: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.absarc(0, 0, r, 0, Math.PI * 2, false);
  return new THREE.ShapeGeometry(s, 24);
}

function makeBoneGeometry(len: number, w: number): THREE.BufferGeometry {
  const hl = len / 2;
  const r = w / 2;
  const s = new THREE.Shape();
  s.absarc(-hl, 0, r, Math.PI / 2, (Math.PI * 3) / 2, false);
  s.absarc(hl, 0, r, -Math.PI / 2, Math.PI / 2, false);
  s.closePath();
  return new THREE.ShapeGeometry(s, 10);
}

function makeJawGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-0.1, 0);
  s.lineTo(0.1, 0);
  s.lineTo(0.07, -0.12);
  s.lineTo(-0.07, -0.12);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeNoseGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, -0.005);
  s.lineTo(0.032, -0.07);
  s.lineTo(-0.032, -0.07);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

// Masts: mizzen (stern/left), main (center, tallest), fore (bow/right).
```
new:
```
// Masts: mizzen (stern/left), main (center, tallest), fore (bow/right).
```
(This deletes the four functions and their blank-line separators, leaving the `MASTS` section comment as the next line — confirm the file still parses: `makeDiscGeometry`, `makeBoneGeometry`, `makeJawGeometry`, `makeNoseGeometry` have no other callers anywhere in this file besides the emblem block being removed in Step 6.)

- [ ] **Step 5: Remove the `EMBLEM_X`/`EMBLEM_Y` position constants**

old:
```
// Skull + crossbones centered on the main course (lowest main sail).
const EMBLEM_X = MASTS[1].x;
const EMBLEM_Y = DECK_Y + MASTS[1].sails[0].y - MASTS[1].sails[0].h / 2;

export default function Sailboats({ progress }: SceneElementProps) {
```
new:
```
export default function Sailboats({ progress }: SceneElementProps) {
```

- [ ] **Step 6: Remove the five emblem-only geometry `useMemo` hooks**

old:
```
  // Jolly Roger pieces.
  const craniumGeo = useMemo(() => makeDiscGeometry(0.16), []);
  const jawGeo = useMemo(() => makeJawGeometry(), []);
  const boneGeo = useMemo(() => makeBoneGeometry(0.64, 0.07), []);
  const eyeGeo = useMemo(() => makeDiscGeometry(0.044), []);
  const noseGeo = useMemo(() => makeNoseGeometry(), []);

  const rig = useMemo(
```
new:
```
  const rig = useMemo(
```

- [ ] **Step 7: Remove the `emblemCol` color `useMemo`**

old:
```
  const lanternCol = useMemo(() => C(LANTERN), []);
  const emblemCol = useMemo(() => C(EMBLEM), []);

  const collect = (el: THREE.MeshBasicMaterial | null) => {
```
new:
```
  const lanternCol = useMemo(() => C(LANTERN), []);

  const collect = (el: THREE.MeshBasicMaterial | null) => {
```

- [ ] **Step 8: Remove the skull-and-crossbones JSX group**

old:
```
        {/* ---- SKULL + CROSSBONES on the mainsail ---- */}
        <group position={[EMBLEM_X, EMBLEM_Y, 0.013]}>
          <mesh geometry={boneGeo} rotation={[0, 0, 0.82]}>{mat(emblemCol)}</mesh>
          <mesh geometry={boneGeo} rotation={[0, 0, -0.82]}>{mat(emblemCol)}</mesh>
          <mesh geometry={craniumGeo} position={[0, 0.04, 0.001]}>{mat(emblemCol)}</mesh>
          <mesh geometry={jawGeo} position={[0, -0.05, 0.001]}>{mat(emblemCol)}</mesh>
          <mesh geometry={eyeGeo} position={[-0.066, 0.055, 0.002]}>{mat(sailLoCol)}</mesh>
          <mesh geometry={eyeGeo} position={[0.066, 0.055, 0.002]}>{mat(sailLoCol)}</mesh>
          <mesh geometry={noseGeo} position={[0, 0.0, 0.002]}>{mat(sailLoCol)}</mesh>
        </group>

        {/* ---- RIGGING STAYS ---- */}
```
new:
```
        {/* ---- RIGGING STAYS ---- */}
```

- [ ] **Step 9: Fix the phone intro-stagger comment** (it described staggering against the now-removed speedboat)

old:
```
// Phone-only staggered intro: the Black Pearl arrives AFTER the Lamborghini
// (WaterSkier), so the two hero pieces load at visibly different times rather
// than popping in together. Desktop/tablet are unchanged.
const INTRO_DELAY = 1.2; // seconds after load before the ship starts to appear
const INTRO_DURATION = 1.0; // seconds to ease to full opacity
```
new:
```
// Phone-only delayed intro: the sailboat eases in shortly after load rather
// than popping in immediately. Desktop/tablet are unchanged.
const INTRO_DELAY = 1.2; // seconds after load before the ship starts to appear
const INTRO_DURATION = 1.0; // seconds to ease to full opacity
```

- [ ] **Step 10: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS. This is the real safety net here — if any emblem identifier (`EMBLEM`, `emblemCol`, `craniumGeo`, `jawGeo`, `boneGeo`, `eyeGeo`, `noseGeo`, `EMBLEM_X`, `EMBLEM_Y`, `makeDiscGeometry`, `makeBoneGeometry`, `makeJawGeometry`, `makeNoseGeometry`) is still referenced anywhere this file wasn't fully cleaned, TS will fail with "Cannot find name."

- [ ] **Step 11: Commit**

```bash
git add src/components/scene/elements/Sailboats.tsx
git commit -m "feat(ocean): strip the skull-and-crossbones emblem off the sailboat

A pirate flag doesn't read 'hire me.' Hull, sails, lantern glow, and
weathered-flag texture are untouched - it's still a boat, just not a
pirate ship. Removes five now-dead geometry helpers and their JSX group."
```

---

## Task 3: Mute the Octopus

**Files:**
- Modify: `src/components/scene/elements/Octopus.tsx`

**Interfaces:** No other task depends on this file. Independent of Tasks 1, 2, 4, 5, 6.

No automated test applies (same reasoning as Task 2 — no r3f render-test harness in this repo). Verified via `pnpm typecheck` + the Task 7 visual pass.

Color values below were computed by converting each hex to HSL, multiplying saturation by 0.55 (keeping hue and lightness fixed so the octopus stays recognizably itself, just less neon), and converting back — not eyeballed.

- [ ] **Step 1: Update the header comment's color description**

old:
```
 * Colour: warm orange body (#E0653C) with a darker orange (#C24E2E) hint of
 * suckers speckled along the underside of each arm, a soft top-down key light
 * (the shot's god rays), and a faint cool fresnel rim so it separates from the
 * dark water. Brightness lifts with depth/presence so it reads "lit from above".
```
new:
```
 * Colour: muted rust body (#BB7761, toned down 2026-07-21 from a brighter
 * #E0653C for the "lowkey" pass) with a darker rust (#A1614F) hint of
 * suckers speckled along the underside of each arm, a soft top-down key light
 * (the shot's god rays), and a faint cool fresnel rim so it separates from the
 * dark water. Brightness lifts with depth/presence so it reads "lit from above".
```

- [ ] **Step 2: Desaturate the palette constants**

old:
```
const BODY = hexToRgb01("#E0653C"); // warm orange body
const BODY_DEEP = hexToRgb01("#B24A2A"); // shaded underside / core
const SUCKER = hexToRgb01("#C24E2E"); // darker orange sucker hint
const BELLY = hexToRgb01("#F08A5E"); // warm lit highlight up top
const RIM = hexToRgb01("#7FD6E0"); // cool water rim so it pops off the dark
```
new:
```
const BODY = hexToRgb01("#BB7761"); // muted rust body (was bright orange #E0653C)
const BODY_DEEP = hexToRgb01("#935A49"); // shaded underside / core (was #B24A2A)
const SUCKER = hexToRgb01("#A1614F"); // darker rust sucker hint (was #C24E2E)
const BELLY = hexToRgb01("#CF977F"); // warm lit highlight up top (was #F08A5E)
const RIM = hexToRgb01("#7FD6E0"); // cool water rim so it pops off the dark
```

- [ ] **Step 3: Halve the fresnel rim-light intensity** (dials it back from a highlight to an ambient glow)

old:
```
    // Cool fresnel rim so the warm body separates from the dark seabed water.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    col += uRim * fres * 0.4;
```
new:
```
    // Cool fresnel rim so the warm body separates from the dark seabed water.
    // Intensity halved 2026-07-21 (was 0.4) so it reads as ambient glow, not a highlight.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    col += uRim * fres * 0.2;
```

- [ ] **Step 4: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/scene/elements/Octopus.tsx
git commit -m "feat(ocean): mute the octopus's palette for the lowkey pass

Was the most saturated element in the scene (bright orange + bright cyan
rim). Desaturated body/deep/sucker/belly toward rust (~55% of original
saturation, hue+lightness preserved) and halved the fresnel rim intensity."
```

---

## Task 4: Slow and mute the Clownfish

**Files:**
- Modify: `src/components/scene/elements/Clownfish.tsx`

**Interfaces:** No other task depends on this file. Independent of Tasks 1, 2, 3, 5, 6.

No automated test applies (same reasoning as Task 2/3). Verified via `pnpm typecheck` + the Task 7 visual pass.

- [ ] **Step 1: Cut the speed by roughly a third** (was the fastest ambient creature in the scene at 1.05 world units/sec, vs. ~0.02 for the others)

old:
```
const SPEED = 1.05; // world units / second - an unhurried, tasteful drift
```
new:
```
const SPEED = 0.68; // world units / second - slowed 2026-07-21 for the "lowkey" pass (was 1.05, the fastest ambient creature)
```

- [ ] **Step 2: Desaturate the orange palette toward muted coral** (same 0.55-saturation-multiplier method as Task 3, hue/lightness preserved)

old:
```
const ORANGE = hexToRgb01("#FF7A3C");
const ORANGE_DEEP = hexToRgb01("#E85F23");
```
new:
```
const ORANGE = hexToRgb01("#D38A68"); // muted coral, was #FF7A3C
const ORANGE_DEEP = hexToRgb01("#BC704F"); // muted coral-deep, was #E85F23
```

- [ ] **Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/scene/elements/Clownfish.tsx
git commit -m "feat(ocean): slow and mute the clownfish for the lowkey pass

Second-most saturated creature and the fastest-moving ambient one. Speed
cut ~35% (1.05 -> 0.68) and orange desaturated toward muted coral (~55%
of original saturation, hue+lightness preserved, matches the Octopus
fix's direction so the two don't clash)."
```

---

## Task 5: Trim the Submarine's scale

**Files:**
- Modify: `src/components/scene/elements/Submarine.tsx`

**Interfaces:** No other task depends on this file. Independent of Tasks 1-4, 6.

No automated test applies (same reasoning as prior visual tasks). Verified via `pnpm typecheck` + the Task 7 visual pass.

Every shape function in this file (`makeHull`, `makeDeckHighlight`, `makeBellyShadow`, `makeTopRim`, `makeSeam`, `makeLimberHoles`, `makeSail`, `makeSailEdge`, `makeSailPlane`, `makeMasts`, `makeRudders`, `makeSternPlane`, `makeSkewBlade`, `makeHub`) derives its coordinates purely from `HW` and `HH` (confirmed by reading the full file during planning — no independent absolute dimensions exist). The screen-edge entry/exit math in the component's `useFrame` (`subX.current = -halfW + HW`, `if (subX.current > halfW + HW) ...`) also reads `HW` directly. That means scaling `HW`/`HH` shrinks the entire model proportionally **and** keeps the edge-of-screen entry math in sync automatically — no separate `scale` prop or edge-math change is needed or correct here.

- [ ] **Step 1: Reduce `HW` and `HH` by ~10%**

old:
```
const HW         = 4.4;         // hull half-length
const HH         = 0.5;         // hull half-height (at max beam)
```
new:
```
const HW         = 3.96;        // hull half-length (was 4.4, trimmed ~10% 2026-07-21 "lowkey" pass)
const HH         = 0.45;        // hull half-height (was 0.5, at max beam)
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/scene/elements/Submarine.tsx
git commit -m "feat(ocean): trim the submarine's scale for the lowkey pass

Its showiness was scale, not color (already muted charcoal/metallic).
HW/HH cut ~10% (4.4->3.96, 0.5->0.45); every dependent shape and the
screen-edge entry/exit math are derived from these two constants, so the
whole model shrinks proportionally without touching anything else."
```

---

## Task 6: Dim the canvas

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:** No other task depends on this file. Independent of Tasks 1-5.

No automated test applies (CSS visual tuning). Verified via `pnpm build` (Tailwind/CSS compiles) + the Task 7 visual pass.

- [ ] **Step 1: Add a dimming filter to the persistent ocean layer** (covers both the WebGL canvas and its `StaticOcean` fallback, since both sit inside this wrapper — see `OceanCanvas.tsx`)

old:
```
/* Full-bleed fixed ocean background (plain wrapper divs). */
.ocean-fixed-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}
```
new:
```
/* Full-bleed fixed ocean background (plain wrapper divs). */
.ocean-fixed-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  /* Dims + desaturates the whole persistent ocean layer (WebGL canvas AND
     its StaticOcean fallback) so page content reads first, ocean second.
     Single tunable lever, added 2026-07-21 for the "lowkey" pass - see
     docs/superpowers/specs/2026-07-21-lowkey-ocean-scene-design.md. */
  filter: saturate(0.85) brightness(0.95);
}
```

- [ ] **Step 2: Relax the section-scrim's saturation boost** (it currently *boosts* whatever's behind it by 20%, working against the dimmer backdrop)

old:
```
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
```
new:
```
  backdrop-filter: blur(12px) saturate(95%);
  -webkit-backdrop-filter: blur(12px) saturate(95%);
```

- [ ] **Step 3: Run the build**

Run: `pnpm build`
Expected: PASS (confirms the CSS is syntactically valid and Tailwind's build pipeline accepts it).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(ocean): dim the canvas and relax the scrim's saturation boost

Single filter: saturate(0.85) brightness(0.95) on .ocean-fixed-layer pulls
the whole persistent ocean layer back in visual intensity (WebGL + static
fallback both covered) without touching any Three.js/shader code. Also
drops .section-scrim's backdrop-filter saturate(120%) -> saturate(95%),
since boosting saturation behind the glass panels fought the dimmer
backdrop."
```

---

## Task 7: Full verification, then push to preview

**Files:** None modified — this task runs checks and opens the PR.

**Interfaces:** Depends on Tasks 1-6 all being committed on `matt/lowkey-ocean-scene`.

- [ ] **Step 1: Run the full local gate**

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm lint
```
Expected: all four PASS. (`pnpm lint` isn't in CI per `.github/workflows/test.yml`, but it's cheap insurance against dead-code lint warnings from the Sailboats emblem removal.)

- [ ] **Step 2: Grep-sweep for any lingering references**

```bash
grep -rn "WaterSkier\|water-skier\|Dolphin\|Lamborghini\|Black Pearl\|skull\|crossbone\|Jolly Roger" src/ AGENTS.md
```
Expected: no matches (`Sailboats.tsx`'s own filename/component name and "THE BLACK PEARL" boat-name framing in its header comment are fine to keep — re-read Step 1 of Task 2's edit to confirm "Black Pearl" as the *boat's name* was intentionally kept, only the skull/crossbones/menacing framing was cut). If this grep still finds a stray reference, fix it before continuing.

- [ ] **Step 3: Start the dev server and capture screenshots**

```bash
pnpm dev
```
Then, via the Chrome DevTools MCP (not Playwright MCP — it times out on this repo's always-animating WebGL canvas per prior sessions):
- Navigate to `http://localhost:3100`, wait ~2s for the scene to render, `take_screenshot` at desktop width (e.g. 1440px) and at phone width (~390px).
- Confirm visually: no speedboat/skier, no dolphin, the sailboat has no skull emblem, the Octopus (scroll to Contact, ~progress 0.95) and Clownfish (scroll to About, ~progress 0.24) read visibly muted rather than bright orange, and the overall canvas reads dimmer/less saturated than before.

- [ ] **Step 4: Confirm the phone-lite fallback path is clean**

This is already covered by Task 1's `scene-registry.test.ts` (`SCENE_ELEMENTS_PHONE_LITE` no longer contains `"water-skier"`), so no separate manual step is needed — just confirm that test is in the passing suite from Step 1.

- [ ] **Step 5: Push the branch and open a PR**

```bash
git push -u origin matt/lowkey-ocean-scene
gh pr create --title "Lowkey ocean scene: drop the spectacle boats, mute the loudest creatures" --body "$(cat <<'EOF'
## Summary
- Removed the speedboat+skier and dolphin from the 3D scene (16 -> 14 elements); the sailboat is now the lone surface actor, with its skull-and-crossbones mainsail emblem stripped.
- Muted the Octopus and Clownfish (the two most saturated/fast creatures); trimmed the Submarine's scale ~10%.
- Dimmed the whole persistent ocean layer via a single CSS filter, and relaxed the section-scrim's saturation boost to match.
- Updated AGENTS.md's "16 creatures" design rule to reflect the new count, per Matthew's direct call this session.

Spec: docs/superpowers/specs/2026-07-21-lowkey-ocean-scene-design.md
Plan: docs/superpowers/plans/2026-07-21-lowkey-ocean-scene.md

## Test plan
- [x] pnpm typecheck / pnpm test / pnpm build / pnpm lint all green
- [x] scene-registry.test.ts guards against the boat reappearing via the phone-lite fallback
- [x] Chrome DevTools screenshots at desktop + phone width confirm no boat/dolphin/emblem, muted creatures, dimmer canvas
EOF
)"
```

- [ ] **Step 6: Report the preview URL — do not merge**

Once CI finishes on the PR, note the Vercel preview deployment URL (posted automatically as a PR check/comment) and report it back. Per this session's explicit instruction ("push to preview/staging"), **do not merge this PR to `main`** — leave it open at the preview stage for Matthew to review live before promoting to production, overriding this repo's usual "agent merges once green" default (`AGENTS.md`).
