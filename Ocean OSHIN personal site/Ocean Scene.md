---
title: Ocean Scene
tags: [matthewoshin-site, webgl]
---

# Ocean Scene

This is the living ocean. One persistent WebGL canvas renders the whole descent, from a sunlit surface down to a bioluminescent abyss, and every creature in it is procedural code with no external assets. This page covers how the canvas survives navigation, the registry contract for adding a creature in two steps, the full element table, the performance and accessibility guardrails, and the rule that keeps everything license-clean.

For how depth maps to routes and how the rest of the site is wired, see [[Architecture]]. For the palette and type these elements draw against, see [[Design System]]. For why the scene was built this way, see [[Decision Log]].

## The persistent canvas

There is exactly ONE `<Canvas>` and it lives in the root layout, not on any page. It is mounted by `DescentChrome`, which the root layout renders once.

```
src/app/layout.tsx
  -> DescentChrome (src/components/chrome/DescentChrome.tsx)
     -> DescentBackground   (chooses canvas vs static gradient)
        -> OceanCanvas      (the <Canvas>, dpr, perf monitor, WebGL gate)
           -> OceanScene    (everything INSIDE the canvas)
              -> SCENE_ELEMENTS (the registry, mapped to components)
```

Because the canvas is mounted in the layout and never inside a page, it survives client-side route changes. Navigating from `/experience` to `/skills` does not remount or flash the canvas. Instead the camera dives through the water to the new depth. That dive is the whole point: depth is route-driven.

### How the dive works (route to depth)

Each page renders a `<ZoneSetter zone="..."/>` that writes the zustand store's `targetProgress` to that zone's center (`zoneCenterProgress()` in `src/lib/depth.ts`). Inside the canvas, the `DepthController` in `src/components/scene/OceanScene.tsx` lerps the camera `y` and the `FogExp2` density and color toward that target every frame. So moving between pages sinks the camera, and the right creatures (which gate on the same progress value) come into view as you arrive.

Page vertical scroll no longer changes depth. That was the single-scroll era. Depth is purely a function of which route you are on. See [[Architecture]] for the route table.

The shared depth math lives in `src/lib/depth.ts`, which is intentionally framework-free (no React, no three) so server components, the store, and the canvas all read the same numbers and can never drift apart.

## The registry contract

A scene element is a self-contained React component that renders three.js primitives inside the canvas. The contract is documented in full at the top of `src/components/scene/types.ts`. The promise: you never edit `OceanScene`, the canvas wrapper, the store, or `depth.ts` to add visuals. You drop a file and add one line.

### Add a creature in 2 steps

**Step 1.** Create a file in `src/components/scene/elements/`, for example `Jellyfish.tsx`. It must be a default-exported component typed as `SceneElement`. It lives inside `<Canvas>`, so it can use `useFrame`, `useThree`, and drei helpers. It receives one prop, `progress`, the shared accessor.

```tsx
// src/components/scene/elements/Jellyfish.tsx
import { useFrame } from "@react-three/fiber";
import type { SceneElementProps } from "../types";

export default function Jellyfish({ progress }: SceneElementProps) {
  useFrame(() => {
    const p = progress.get();            // 0 surface .. 1 seabed
    const here = progress.inZone("writing");
    const t = progress.within("writing"); // 0..1 local progress through the band
    // lerp your own refs toward depth-driven targets here
  });
  return null;
}
```

**Step 2.** Register it with ONE entry in `src/components/scene/registry.ts`.

```ts
import Jellyfish from "./elements/Jellyfish";

export const SCENE_ELEMENTS: readonly SceneElementEntry[] = [
  // ...existing entries
  { id: "jellyfish", Component: Jellyfish },
];
```

That is the whole contract. `OceanScene` maps over `SCENE_ELEMENTS` and renders each one, passing the shared `progress` accessor. Elements draw in array order (later entries render after earlier ones), which is how draw order and layering are controlled.

### The progress accessor

Every element gets a `progress` object whose identity is stable for the life of the canvas. Its methods read the latest values from the zustand store at call time, without subscribing, so reading progress never triggers a React re-render. This is the same source the camera and fog use. The interface (`DescentProgress` in `types.ts`):

| Method | Returns |
| --- | --- |
| `progress.get()` | Normalized depth, `0` (surface) to `1` (seabed). |
| `progress.zone()` | The active `ZoneId` for the current depth. |
| `progress.inZone(id)` | `true` if the active zone equals `id`. |
| `progress.within(id)` | `0..1` local progress through a given zone, clamped. Handy for fading an element in and out as you pass its band. |

### Element rules of the road

These are the conventions every existing element follows, drawn from the contract and the element source:

- **Read progress imperatively in `useFrame`**, via `progress.get()`. Do not subscribe or depend on the prop identity.
- **Mutate only your own refs and the three objects you own.** The React Compiler immutability lint forbids mutating values returned from a hook in the render body, so per-frame simulation buffers and scratch objects live in refs and are built lazily, never via `useMemo` whose return value you then mutate.
- **Zone-gate hard.** Off your depth band, set `group.visible = false` and early-return from `useFrame` before any heavy work, so the element costs nearly nothing elsewhere. `FishSchool`, `Anglerfish`, and `BioParticles` all do this.
- **Use a deterministic PRNG, not `Math.random()`.** The compiler forbids `Math.random()` during render, and a fixed seed keeps layouts reproducible across reloads. Elements use a small mulberry32 helper.
- **Custom shader materials set `fog={false}`.** Elements that ride the depth fade do it through their own uniforms, not the scene fog.

## Scene element table

The registry order (which is also draw order) and what each element is. Depth bands reference the immutable zone ids in `depth.ts`. Note the internal zone ids do not match the page labels: `about` is the Experience page, `projects` is Entrepreneurship, `ventures` is Skills, `writing` is Education, `skills` is Interests. See [[Architecture]] for the full route-to-zone mapping.

| Element | File | What it is | Depth band |
| --- | --- | --- | --- |
| WaterColumn | `WaterColumn.tsx` | Gradient water column plus light shafts, the base water you descend through. | Full column |
| BioParticles | `BioParticles.tsx` | ~4,000 additive GPU-point plankton. Density and brightness ramp with depth, barely there at twilight, densest at the floor. | Ramps from `projects` (0.30) to `skills`/floor (0.82) |
| CoralReef | `CoralReef.tsx` | Procedural reef structures, part of the friendly-reef blend palette. | Deep zones / seabed |
| Kelp | `Kelp.tsx` | Vertex-sway seabed kelp. | Seabed |
| Octopus | `Octopus.tsx` | A reef-dweller creature. | Deep zones |
| Anglerfish | `Anglerfish.tsx` | One stylized anglerfish with a glowing bioluminescent lure on an illicium stalk that casts a cyan key onto its own face. The deep payoff. | `writing` (Abyss, 0.66 to 0.80) with feather |
| Sharks | `Sharks.tsx` | Spline-cruising shark silhouettes. (Ocean-coded to Matthew's Mocean shark logo.) | Mid to deep |
| SeaTurtle | `SeaTurtle.tsx` | A drifting sea turtle. | Mid water |
| FishSchool | `FishSchool.tsx` | ~160 opaque steel-blue instanced fish that school, bank as one, and part around the content column. | `about` (0.16) through `projects` (0.50) with feather |
| Clownfish | `Clownfish.tsx` | Reef clownfish, part of the recognizable-creature blend pass. | Shallows / reef |
| CausticsLight | `CausticsLight.tsx` | God rays and caustic light filtering from the surface. | Near surface |
| WaterSurface | `WaterSurface.tsx` | The water surface with Gerstner waves. | Surface |
| Sailboats | `Sailboats.tsx` | Sailboats on the surface, seen from below. | Surface |

The registry is ordered surface-out: water column and particles first, then creatures, then the surface and sailboats last so they layer correctly over the water you are looking up through.

### A note on the three skimmed elements

- **FishSchool** is one `InstancedMesh` of 160 procedural low-poly fish with a recognizable side profile (rounded front, forked tail, dorsal hint). Per-instance curl-noise drift plus soft cohesion toward a wandering school center makes the shoal bank as one. The bodies are OPAQUE steel-blue with counter-shading and a tiny dark eye, deliberately NOT a glowing additive cloud. A central-corridor clearance force nudges fish out of the content column so the school parts around the text. `transparent` is used only to feather the whole school in and out at the band edges.
- **Anglerfish** is a single fat, bulbous procedural body (nose to tail from elliptical rings) with a baked wide-gash mouth, fang teeth, and fins, plus an illicium stalk and a self-glowing additive lure sphere wrapped in a camera-facing halo sprite. The lure's live world position feeds the body shader as a local key light, so the side of the face nearest the lure brightens. It follows a slow closed Catmull-Rom loop centered on the live camera depth, so it lurks in frame through the whole Abyss band. No bloom pass: the glow is pure additive blending.
- **BioParticles** is one `<points>` draw call of ~4,000 plankton with additive blending and soft radial sprites (no texture, no bloom pass). All motion, twinkle, and the depth ramp live in the shader; the CPU writes a couple of uniforms per frame. The field is a tall slab modulo-wrapped around the camera's Y in the vertex shader, so the camera is always inside the plankton and the field is effectively infinite. The visible point count and brightness both ramp with depth, which is the "thickening toward the abyss" effect.

## Performance and accessibility guardrails

These live mostly in `OceanCanvas.tsx` (the canvas wrapper), `OceanScene.tsx` (inside the canvas), and `DescentBackground.tsx` (what fills the background layer). Verified 60fps, zero console errors, responsive down to mobile.

| Guardrail | Where | What it does |
| --- | --- | --- |
| Instancing | `FishSchool.tsx`, others | The 160-fish school is one `InstancedMesh`; the 4,000 plankton are one `<points>`. One draw call each. |
| `fog={false}` on custom materials | every shader element | Custom shaders opt out of the scene fog and handle their own depth fade via uniforms, so the fog never double-applies or muddies their color. |
| `AdaptiveDpr` | `OceanScene.tsx` | drei's adaptive dpr lowers resolution under load. |
| `PerformanceMonitor` + dpr cap | `OceanCanvas.tsx` | `dpr={[1, 1.5]}`. On FPS decline it drops dpr to 1; on a hard fallback it swaps to the static gradient entirely. |
| Tab-hidden pause | `OceanCanvas.tsx` | A `visibilitychange` listener flips `frameloop` to `"never"` when the tab is hidden, saving battery and GPU, and back to `"always"` on return. |
| Zone-gating | every banded element | Off-band, the element's group goes `.visible = false` and `useFrame` early-returns before the heavy loop, so creatures cost nearly nothing outside their depth. |
| Off-band early-return | `FishSchool`, `Anglerfish`, `BioParticles` | The per-instance simulation, path following, and shader updates are all skipped once the smoothed fade reaches zero. |
| No-allocation frames | banded elements | Simulation buffers and scratch math objects are reused across frames (held in refs) so `useFrame` never allocates. |

### Accessibility fallback

The canvas is decorative and sits behind all real content. It is positioned `fixed`, full-viewport, behind the DOM (`-z-10`), with `pointer-events: none` and `aria-hidden="true"`. All real content is server-rendered DOM on top of it.

The fallback chain in `DescentBackground.tsx` and `OceanCanvas.tsx`:

1. **Reduced motion** (system `prefers-reduced-motion` OR the manual motion toggle in the nav) renders `StaticOcean`, a deterministic per-route gradient, and never mounts the canvas at all.
2. **Not yet hydrated** also renders `StaticOcean`, so the first paint is always ocean with no white flash or hydration mismatch.
3. **No WebGL2** (detected in `OceanCanvas` via `isWebGL2Available()`) renders `StaticOcean`.
4. **Runtime degrade or context loss** (`PerformanceMonitor onFallback`, or a `webglcontextlost` event) raises a flag that swaps to `StaticOcean`.
5. The static gradient also sits underneath the live canvas, so any transparent area or a context loss still reads as ocean, not white.

The canvas is imported via `next/dynamic({ ssr: false })` so three and R3F never run on the server. The static gradient and the live fog read their colors from the same zone palettes in `depth.ts`, so the fallback matches the route. Reduced-motion and WCAG AA are enforced; see [[Design System]] for the legibility scrim and text-shadow utilities.

## Procedural only, license-clean

Every element under `src/components/scene/elements/` is built from procedural geometry and small custom GLSL shaders. No external models, no textures, no fetched assets, no network. Geometry is generated in code (fish profiles, the anglerfish body and teeth, kelp, reef, the plankton field), and glow is achieved with additive blending and shaders rather than image sprites or a postprocessing bloom pass.

This is a deliberate rule, not an accident. It keeps the scene license-clean (nothing to attribute or license) and fully self-contained (the repo carries no asset dependencies), and it means the whole ocean ships as code. See [[Decision Log]] for the reasoning, including why the fish were redesigned from a glowing additive cloud to opaque steel-blue bodies that read clearly and part around text. When you add a creature, hold the line: procedural geometry and shaders only.

## Related

- [[Architecture]] for routes, zones, the store, and how the canvas is mounted.
- [[Design System]] for the depth palette, bio accents, the coral wayfinding accent, and legibility.
- [[Decision Log]] for why the descent, why multi-page, why the blend palette, and why procedural only.
