/**
 * store.ts - the single zustand store for the descent.
 *
 * This is the runtime source of truth that bridges three worlds that must never
 * SSR-couple: the Lenis/GSAP scroll driver (writes), the DOM chrome like the
 * depth gauge (reads), and the WebGL canvas (reads every frame in useFrame).
 *
 * Read patterns:
 *   const progress  = useDescentStore((s) => s.scrollProgress)  // re-renders DOM
 *   const zone      = useDescentStore((s) => s.activeZone)      // re-renders DOM
 *   const reduced   = useDescentStore((s) => s.reducedMotion)
 *
 * Inside useFrame (canvas), DO NOT subscribe with a selector (that would force
 * React re-renders 60x/sec). Instead read the latest value imperatively:
 *   const p = useDescentStore.getState().scrollProgress
 *
 * Write patterns (scroll driver only):
 *   useDescentStore.getState().setScrollProgress(p)
 */

"use client";

import { create } from "zustand";
import { type ZoneId, zoneAtProgress } from "./depth";

export interface DescentState {
  /** Normalized 0 (surface) .. 1 (seabed). Written by the scroll driver. */
  scrollProgress: number;
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
  setReducedMotion: (reduced: boolean) => void;
  toggleReducedMotion: () => void;
  setManualReducedMotion: (reduced: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  setWebglAvailable: (available: boolean) => void;
}

export const useDescentStore = create<DescentState>((set, get) => ({
  scrollProgress: 0,
  activeZone: "surface",
  reducedMotion: false,
  manualReducedMotion: false,
  hydrated: false,
  webglAvailable: true,

  setScrollProgress: (p) => {
    // Cheap guard: only touch state when the value (or derived zone) changes.
    const prev = get();
    const next = p < 0 ? 0 : p > 1 ? 1 : p;
    const zone = zoneAtProgress(next).id;
    if (next === prev.scrollProgress && zone === prev.activeZone) return;
    set({ scrollProgress: next, activeZone: zone });
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
