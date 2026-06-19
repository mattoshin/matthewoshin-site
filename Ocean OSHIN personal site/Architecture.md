---
title: Architecture
tags: [matthewoshin-site, architecture]
---

# Architecture

This is the engine behind "The Descent." The whole site is one ocean you move down through, and the trick that makes it feel like an ocean is this: there is a single persistent WebGL canvas that never unmounts, and depth is driven by which route you are on, not by how far you scroll. Navigating from one page to another DIVES the camera down (or back up) through the water to that page's depth. This page explains how that works, names every file in the loop, and covers the fallbacks.

For what swims in the water, see [[Ocean Scene]]. For colors, type, and the depth-zone palette, see [[Design System]]. For why these choices were made over the alternatives, see [[Decision Log]].

## The big idea: multi-page + one persistent canvas

Early builds were a single infinite-scroll page (scroll down = descend). That looked great but tanked SEO and shareability: every "section" lived at the same URL, so you could not hand someone a link to Entrepreneurship. The current architecture is multi-page. Each bucket is a real crawlable route, and the ocean stays continuous because the canvas lives ABOVE the page content in the component tree.

Two pieces make this work:

1. The ocean (canvas plus all overlay chrome) is mounted ONCE in the root layout, so it survives client-side route changes. No remount, no white flash, no re-initializing three.js between pages.
2. Depth is route-driven. Each page declares a zone. A controller inside the canvas lerps the camera and fog toward that zone's depth every frame. Switching pages is the dive.

```
src/app/layout.tsx          (Server Component, the root)
 └─ <DescentChrome />        (Client, mounted once, persists across routes)
     ├─ MotionController     (resolves reduced-motion, marks store hydrated)
     ├─ DescentBackground    (dynamic ssr:false import of OceanCanvas)
     │   └─ OceanCanvas      (the ONE <Canvas>, dpr, perf, WebGL2 gate)
     │       └─ OceanScene   (DepthController + every scene element)
     ├─ BucketNav            (top nav, active pill, motion toggle)
     ├─ DepthGauge           (right-rail depth readout)
     └─ OceanAI              (floating chat widget, see [[OceanAI]])
 └─ <div id="content">{children}</div>   (per-route page, swaps on nav)
```

### Why the canvas lives in the root layout

In the App Router, the root layout does NOT remount on client-side navigation. Only `{children}` swaps. So anything you want to persist (an expensive WebGL context, a smoothed camera position, schooling fish that should not respawn) belongs in the layout, not in a page. That is exactly what `src/app/layout.tsx` does:

```tsx
// src/app/layout.tsx
<body className="min-h-full">
  <a href="#content" className="...">Skip to content</a>
  <DescentChrome />            {/* the persistent ocean + chrome */}
  <div id="content">{children}</div>   {/* the page that changes */}
</body>
```

One wrinkle: the layout is a Server Component, and you cannot use `next/dynamic({ ssr: false })` directly inside a Server Component. So `layout.tsx` renders `DescentChrome` (a Client Component, `src/components/chrome/DescentChrome.tsx`), and the `ssr: false` dynamic import of the canvas happens one level deeper inside `DescentBackground`. That keeps the canvas client-only (three.js never SSRs) while the page content above the fold stays server-rendered for SEO and accessibility.

## Route-driven depth: the dive

This is the heart of it. The flow is:

`route renders <ZoneSetter zone="..." />` to `store.setTargetProgress(...)` to `DepthController lerp` to `camera.y + fog` to `the camera sinks`.

### Step 1: each page declares its zone

Every page renders exactly one `<ZoneSetter zone="..." />` and nothing else depth-related. The home page (`src/app/page.tsx`) is the surface:

```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <>
      <ZoneSetter zone="surface" />
      <HeroSection />
    </>
  );
}
```

`ZoneSetter` (`src/components/page/ZoneSetter.tsx`) renders nothing. On mount, and any time the `zone` prop changes, it writes that zone's center depth into the store:

```tsx
// src/components/page/ZoneSetter.tsx
useEffect(() => {
  useDescentStore.getState().setTargetProgress(zoneCenterProgress(zone));
}, [zone]);
return null;
```

`zoneCenterProgress(id)` lives in `src/lib/depth.ts`. It returns the normalized progress (0..1) at the CENTER of that zone's depth band, with two deliberate exceptions: the surface returns exactly `0` (so the launchpad reads as the open surface) and contact returns exactly `1` (so the closing page reads as the seabed floor). Every interior zone targets its midpoint.

```ts
// src/lib/depth.ts
export function zoneCenterProgress(id: ZoneId): number {
  const zone = zoneById(id);
  if (id === ZONES[0].id) return 0;                    // surface = top
  if (id === ZONES[ZONES.length - 1].id) return 1;     // contact = floor
  return (zone.start + zone.end) / 2;                  // interior = midpoint
}
```

### Step 2: the store holds the target

`setTargetProgress` (in `src/lib/store.ts`) clamps the value, stores it as `targetProgress`, and immediately sets `activeZone` to the DESTINATION zone. That immediacy is intentional: the nav pill and depth gauge label flip to the new page right away, even while the camera is still sinking toward it. The dive is the animation, not the label.

### Step 3: the canvas lerps toward the target

Inside the canvas, `DepthController` (in `src/components/scene/OceanScene.tsx`) runs every frame in `useFrame`. It reads `targetProgress` imperatively (NOT via a selector, which would force 60 React re-renders a second) and eases a smoothed value toward it:

```ts
// src/components/scene/OceanScene.tsx (DepthController, inside useFrame)
const target = useDescentStore.getState().targetProgress;
const k = Math.min(1, delta * 2.5);              // frame-rate-independent damping
smoothed.current = lerp(smoothed.current, target, k);
const p = smoothed.current;

useDescentStore.getState().setScrollProgress(Math.round(p * 1000) / 1000); // feed DOM
state.camera.position.y = cameraYForProgress(p);  // camera sinks
// fog density + color also ease toward the active zone each frame
```

The damping (`delta * 2.5`) gives a graceful sink instead of a snap, and it is frame-rate-independent so it feels the same at 30fps or 120fps. `cameraYForProgress` maps progress 0..1 to camera Y of `0` to `-60` world units; `fogDensityForProgress` ramps `THREE.FogExp2` density from `0.01` (clear surface) to `0.048` (murky deep). The fog COLOR eases toward the active zone's `palette.fog`. All of those targets come from `src/lib/depth.ts`, the single source of truth.

### Step 4: the depth gauge follows for free

The DepthController writes the live smoothed value back to the store via `setScrollProgress`. That is what the right-rail `DepthGauge` and any DOM readout subscribe to, so the gauge tracks the dive in real time. Page scroll never touches any of this. Vertical scrolling on a page just scrolls the DOM content under the fixed ocean. It does NOT change depth.

## Data flow diagram

```
 ┌──────────────┐   navigate (Next.js client routing)
 │  user clicks │ ─────────────────────────────────────────┐
 │  a bucket    │                                           │
 └──────────────┘                                           ▼
                                                  ┌────────────────────┐
   page swaps in <div id="content">  ───────────► │  <ZoneSetter zone> │
   (layout + canvas DO NOT remount)               │  on the new page   │
                                                  └─────────┬──────────┘
                                                            │ setTargetProgress(
                                                            │   zoneCenterProgress(zone))
                                                            ▼
                                            ┌───────────────────────────────┐
                                            │   zustand: useDescentStore     │
                                            │   targetProgress = <center>    │
                                            │   activeZone     = destination │  ──► BucketNav pill
                                            └───────────────┬───────────────┘      DepthGauge label
                                                            │ read imperatively
                                                            │ every frame
                                                            ▼
                                            ┌───────────────────────────────┐
                                            │  DepthController (useFrame)    │
                                            │  smoothed = lerp(smoothed,     │
                                            │      target, delta*2.5)        │
                                            └───────────────┬───────────────┘
                                          camera.position.y │ + fog density/color
                                                            ▼
                                            ┌───────────────────────────────┐
                                            │   THE CAMERA DIVES through     │
                                            │   the water to the new depth   │
                                            └───────────────┬───────────────┘
                                                            │ setScrollProgress(smoothed)
                                                            ▼
                                            ┌───────────────────────────────┐
                                            │  DepthGauge / DOM readouts     │
                                            │  track the live dive depth     │
                                            └───────────────────────────────┘
```

The loop is one-directional with a single feedback edge: routes write `targetProgress`, the canvas reads it and writes back `scrollProgress`, and DOM chrome reads `scrollProgress`. Three worlds (route setters, DOM chrome, WebGL) meet only through the store, none of them SSR-coupled.

## Route-to-zone-depth table

There is a naming gotcha worth flagging up front: the internal `ZoneId` values in `src/lib/depth.ts` were named in the single-scroll era and DO NOT match the URL paths. The zone ids are immutable (scene creatures zone-gate on them, so renaming would break the visuals), so the routes simply map onto the existing ids. Read the table left to right: the URL you visit, the `zone` prop its page passes, and where the camera ends up.

| Route (URL) | Page meaning | `zone` prop / `ZoneId` | Depth label | Band (start to end) | Target progress |
| --- | --- | --- | --- | --- | --- |
| `/` | Launchpad / home | `surface` | 0m (surface) | 0.00 to 0.16 | 0.00 (top) |
| `/experience` | Experience (about) | `about` | Sunlit shallows | 0.16 to 0.32 | 0.24 |
| `/entrepreneurship` | Entrepreneurship (projects) | `projects` | Twilight | 0.32 to 0.50 | 0.41 |
| `/skills` | Skills (ventures band) | `ventures` | Midnight | 0.50 to 0.66 | 0.58 |
| `/education` | Education (writing band) | `writing` | Abyss | 0.66 to 0.80 | 0.73 |
| `/interests` | Interests (skills band) | `skills` | Seabed | 0.80 to 0.92 | 0.86 |
| `/contact` | Contact | `contact` | The Floor | 0.92 to 1.00 | 1.00 (floor) |

Plus dynamic case-study shells at `/projects/[slug]` (for example `sigma`, `galactic-signals`), reached from `/entrepreneurship`. See [[Content and Buckets]] for what each page contains.

The actual route folders confirm this set:

```
src/app/
  page.tsx              # /            surface
  experience/page.tsx   # /experience  about
  entrepreneurship/...  # /entrepreneurship  projects
  skills/page.tsx       # /skills      ventures
  education/page.tsx    # /education   writing
  interests/page.tsx    # /interests   skills
  contact/page.tsx      # /contact     contact
  projects/[slug]/...   # /projects/sigma, /projects/galactic-signals
  api/oceanai/route.ts  # the chat backend (see [[OceanAI]])
  layout.tsx            # the persistent ocean lives here
  globals.css           # Tailwind v4 @theme tokens (see [[Design System]])
```

When you add a page, you only do two things: drop a route folder with a page that renders `<ZoneSetter zone="..." />`, and pick the zone id whose depth band you want. The dive, fog, and creature gating all come for free from `depth.ts`.

## The zustand store shape

One store, `useDescentStore`, defined in `src/lib/store.ts`. It is the only bridge between routes, DOM chrome, and the canvas. Field by field:

| Field | Type | Written by | Read by | Purpose |
| --- | --- | --- | --- | --- |
| `scrollProgress` | `number` 0..1 | canvas (`setScrollProgress`), or reduced-motion path directly | DepthGauge, DOM readouts, the canvas progress accessor | Live SMOOTHED depth. The thing currently in view. |
| `targetProgress` | `number` 0..1 | route `ZoneSetter` (`setTargetProgress`) | DepthController in `useFrame` | The depth the ocean is diving TOWARD. |
| `activeZone` | `ZoneId` | derived in the setters | BucketNav, DepthGauge label | Current zone for nav highlight and gauge copy. Tracks the destination immediately. |
| `reducedMotion` | `boolean` | MotionController | OceanCanvas mount gate, scene elements | OR of OS `prefers-reduced-motion` and the manual toggle. When true the canvas never mounts. |
| `manualReducedMotion` | `boolean` | `toggleReducedMotion` / `setManualReducedMotion` | the motion toggle UI | User override, independent of the OS preference. |
| `hydrated` | `boolean` | MotionController | anything avoiding an SSR flash | True once the client has hydrated and measured the OS pref. |
| `webglAvailable` | `boolean` | OceanCanvas (detection + context-loss) | fallback decisions | False when the browser cannot make a WebGL2 context. |

Setters: `setScrollProgress`, `setTargetProgress`, `setReducedMotion`, `toggleReducedMotion`, `setManualReducedMotion`, `setHydrated`, `setWebglAvailable`.

Two access rules that matter:

- DOM components subscribe with a selector so they re-render on change: `useDescentStore((s) => s.scrollProgress)`.
- Inside `useFrame` (60 times a second) you must NOT subscribe. Read imperatively: `useDescentStore.getState().targetProgress`. Subscribing in the frame loop would force constant React re-renders and kill the framerate.

The setters are cheap-guarded. `setScrollProgress` only writes when the value or its derived zone actually changed, and `setTargetProgress` bails if the target is unchanged. The DepthController also rounds the reported depth to three decimals so imperceptible deltas do not churn React.

## Reduced motion, StaticOcean, and the WebGL2 fallback

The site has three rendering paths. It picks whichever the visitor's setup can handle, and it always reads as ocean, never a blank page.

### 1. Full WebGL (the default)

`OceanCanvas` (`src/components/scene/OceanCanvas.tsx`) owns the single `<Canvas>`. It is positioned fixed, full-viewport, BEHIND the DOM (`-z-10`), `pointer-events: none`, and `aria-hidden="true"`, so all the real, accessible content is server-rendered DOM sitting on top of it. Performance guardrails:

- `dpr={[1, 1.5]}`, with drei `AdaptiveDpr` and `PerformanceMonitor`. On `onDecline` the dpr drops to `1`; on `onFallback` it hard-degrades to StaticOcean.
- `frameloop` flips to `"never"` when the tab is hidden (`visibilitychange`), to save battery and GPU, then back to `"always"` on return.

### 2. StaticOcean (reduced motion, or degraded hardware)

When `reducedMotion` is true (OS `prefers-reduced-motion` OR the manual toggle), the canvas is never mounted at all. `MotionController` resolves the preference and `DescentBackground` renders `StaticOcean` instead, a deterministic per-route gradient built from the same `depth.ts` zone palette so the colors still match the page you are on. In that path there is no `useFrame` to smooth anything, so `setTargetProgress` jumps `scrollProgress` straight to the target. The depth gauge still moves; it just does not animate the dive.

```ts
// src/lib/store.ts (setTargetProgress, reduced-motion branch)
if (prev.reducedMotion) {
  set({ targetProgress: next, scrollProgress: next, activeZone: zoneAtProgress(next).id });
} else {
  set({ targetProgress: next, activeZone: zoneAtProgress(next).id });
}
```

### 3. Hard WebGL2 fallback

`OceanCanvas` checks `isWebGL2Available()` (`src/lib/webgl`) in a lazy state initializer (it only ever mounts client-side via the `ssr: false` dynamic import, so this is safe). If WebGL2 is missing, or a `webglcontextlost` event fires at runtime, it sets `degraded` and renders `StaticOcean`. It also pushes `webglAvailable` into the store so the rest of the app knows. Belt and suspenders: a `StaticOcean` gradient is rendered UNDERNEATH the canvas too, so any transparent area or a sudden context loss still reads as ocean rather than flashing white.

```tsx
// src/components/scene/OceanCanvas.tsx
if (!supported || degraded) {
  return <StaticOcean />;     // reduced-motion path is handled upstream in DescentBackground
}
return (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
    <StaticOcean />            {/* safety net under the live canvas */}
    <Canvas ...>
      <PerformanceMonitor onDecline={() => setDpr(1)} onFallback={() => setDegraded(true)}>
        <OceanScene />
      </PerformanceMonitor>
    </Canvas>
  </div>
);
```

Net result: a powerful machine gets the full living ocean at the capped dpr, a weak one gets a clean degraded canvas or the static gradient, a reduced-motion visitor gets the static gradient with no animation, and a browser with no WebGL2 still gets a colored ocean. Verified at 60fps with zero console errors, fully responsive down to a mobile hamburger nav.

## See also

- [[Ocean Scene]] for the registry contract and every procedural creature the canvas renders.
- [[Design System]] for the depth-zone palette, fonts, scrim, and accessibility tokens that `depth.ts` and `globals.css` share.
- [[Decision Log]] for why multi-page beat infinite scroll, why the canvas lives in the layout, and why depth is route-driven instead of scroll-driven.
- [[OceanAI]], [[Content and Buckets]], [[Build Log]], and [[Deployment and Ops]] for the rest of the system. Back to [[Home]] or [[Project Overview]].
