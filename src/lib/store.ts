/**
 * store.ts - the single zustand store for the descent.
 *
 * MULTI-PAGE / ROUTE-DRIVEN DEPTH
 * --------------------------------
 * Depth is no longer scroll-driven. The site is multi-page, and the ocean is a
 * single persistent canvas in the root layout. Each route declares its zone id;
 * a tiny <ZoneSetter> on the page sets `targetProgress` to that zone's center.
 * The canvas DepthController LERPs the camera + fog from where it is toward
 * `targetProgress`, so navigating between pages DIVES the camera through the
 * water to the new depth (the signature mechanic).
 *
 * Three worlds bridge through this store, none SSR-coupled:
 *   - route ZoneSetters (write `targetProgress`)
 *   - DOM chrome like the depth gauge (read `scrollProgress`, the live smoothed
 *     depth, mirrored back from the canvas each frame; reduced-motion path sets
 *     it directly so the gauge still moves with no canvas)
 *   - the WebGL canvas (reads `targetProgress` every frame in useFrame, lerps,
 *     and reports the smoothed value back via setScrollProgress)
 *
 * Read patterns:
 *   const progress  = useDescentStore((s) => s.scrollProgress)  // re-renders DOM
 *   const zone      = useDescentStore((s) => s.activeZone)      // re-renders DOM
 *   const reduced   = useDescentStore((s) => s.reducedMotion)
 *
 * Inside useFrame (canvas), DO NOT subscribe with a selector (that would force
 * React re-renders 60x/sec). Instead read the latest value imperatively:
 *   const target = useDescentStore.getState().targetProgress
 *
 * Write patterns:
 *   useDescentStore.getState().setTargetProgress(p)   // route ZoneSetter
 *   useDescentStore.getState().setScrollProgress(p)   // canvas feedback / RM
 */

"use client";

import { create } from "zustand";
import { type ZoneId, clamp01, zoneAtProgress } from "./depth";

export interface DescentState {
  /**
   * Live smoothed depth, 0 (surface) .. 1 (seabed). In the WebGL path the canvas
   * lerps toward `targetProgress` and writes the smoothed value here each frame
   * so the depth gauge and any DOM readouts track the dive. In the reduced-motion
   * path it is set directly to the route's target (no canvas to lerp it).
   */
  scrollProgress: number;
  /**
   * The depth the ocean is diving TOWARD, set by the active route's ZoneSetter to
   * the center of that route's zone. The canvas lerps `scrollProgress` to this.
   */
  targetProgress: number;
  /** Derived from scrollProgress; the zone currently in view. */
  activeZone: ZoneId;
  /**
   * Whether reduced motion is in effect. This is the OR of the OS
   * prefers-reduced-motion query and the user's manual toggle. When true the
   * WebGL canvas is never mounted and the static gradient renders instead.
   */
  reducedMotion: boolean;
  /** Manual user override of motion, independent of the OS preference. */
  manualReducedMotion: boolean;
  /** True once the client has hydrated + measured the OS pref (avoids SSR flash). */
  hydrated: boolean;
  /** True when the browser cannot create a WebGL2 context (hard fallback). */
  webglAvailable: boolean;

  setScrollProgress: (p: number) => void;
  setTargetProgress: (p: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleReducedMotion: () => void;
  setManualReducedMotion: (reduced: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  setWebglAvailable: (available: boolean) => void;
}

export const useDescentStore = create<DescentState>((set, get) => ({
  scrollProgress: 0,
  targetProgress: 0,
  activeZone: "surface",
  reducedMotion: false,
  manualReducedMotion: false,
  hydrated: false,
  webglAvailable: true,

  setScrollProgress: (p) => {
    // Cheap guard: only touch state when the value (or derived zone) changes.
    const prev = get();
    const next = clamp01(p);
    const zone = zoneAtProgress(next).id;
    if (next === prev.scrollProgress && zone === prev.activeZone) return;
    set({ scrollProgress: next, activeZone: zone });
  },

  setTargetProgress: (p) => {
    const next = clamp01(p);
    const prev = get();
    if (next === prev.targetProgress) return;
    // Set the dive target. The active zone (for nav highlight / gauge label)
    // tracks the DESTINATION immediately so chrome reflects the new page even
    // while the camera is still sinking toward it. In the reduced-motion path
    // there is no canvas to lerp, so jump the live depth to the target too.
    if (prev.reducedMotion) {
      set({
        targetProgress: next,
        scrollProgress: next,
        activeZone: zoneAtProgress(next).id,
      });
    } else {
      set({ targetProgress: next, activeZone: zoneAtProgress(next).id });
    }
  },

  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),

  toggleReducedMotion: () => {
    const next = !get().manualReducedMotion;
    // Manual ON forces reduced motion. Manual OFF falls back to OS preference,
    // which the MotionController re-applies via setReducedMotion.
    set({ manualReducedMotion: next, reducedMotion: next ? true : get().reducedMotion });
  },

  setManualReducedMotion: (reduced) =>
    set({ manualReducedMotion: reduced, reducedMotion: reduced ? true : get().reducedMotion }),

  setHydrated: (hydrated) => set({ hydrated }),

  setWebglAvailable: (available) => set({ webglAvailable: available }),
}));
