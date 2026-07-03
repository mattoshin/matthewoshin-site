/**
 * scene/types.ts - the scene-element contract.
 *
 * ===========================================================================
 *  HOW TO ADD A 3D SCENE ELEMENT (water surface, fish, sharks, kelp, particles)
 *  WITHOUT TOUCHING ANY SHARED FILE EXCEPT THE REGISTRY.
 * ===========================================================================
 *
 * 1. Create a new file under src/components/scene/elements/, e.g. `Fish.tsx`.
 *    It must be a default-exported React component typed as `SceneElement`.
 *    It renders R3F/three primitives (it lives INSIDE <Canvas>, so you may use
 *    useFrame, useThree, drei helpers, etc).
 *
 * 2. Read the live descent progress imperatively, NOT via the `progress` prop's
 *    identity (that prop is a stable accessor object, see below). Each frame:
 *
 *       useFrame(() => {
 *         const p = progress.get();            // 0 (surface) .. 1 (seabed)
 *         const visible = progress.inZone("ventures"); // helper
 *         // lerp your element toward depth-driven targets here
 *       });
 *
 *    The accessor reads from the zustand store WITHOUT subscribing, so it never
 *    causes React re-renders. This is the same source the camera + fog use.
 *
 * 3. Register it in src/components/scene/registry.ts by adding ONE entry to the
 *    SCENE_ELEMENTS array: `{ id: "fish", Component: Fish }`. Nothing else needs
 *    to change. OceanScene maps over the registry and renders every element,
 *    passing each the shared `progress` accessor.
 *
 * That is the entire contract. You never edit OceanScene, the Canvas wrapper,
 * the store, or depth.ts to add visuals. Elements are self-contained and ordered
 * by their position in the registry array (later = drawn later).
 * ===========================================================================
 */

import type { ComponentType } from "react";
import type { ZoneId } from "@/lib/depth";

/**
 * Stable, re-render-free accessor handed to every scene element. Methods read
 * the latest values from the zustand store at call time (typically once per
 * frame inside useFrame). The object identity is stable for the canvas lifetime.
 */
export interface DescentProgress {
  /** Normalized 0 (surface) .. 1 (seabed). */
  get: () => number;
  /** The active ZoneId for the current progress. */
  zone: () => ZoneId;
  /** True if the active zone equals `id`. */
  inZone: (id: ZoneId) => boolean;
  /**
   * 0..1 local progress THROUGH a given zone (0 at its start, 1 at its end,
   * clamped). Handy for fading an element in/out as you pass its depth band.
   */
  within: (id: ZoneId) => number;
}

/** Props every registered scene element receives. */
export interface SceneElementProps {
  progress: DescentProgress;
}

/** The shape a scene element component must satisfy. */
export type SceneElement = ComponentType<SceneElementProps>;

/** One entry in the scene registry. */
export interface SceneElementEntry {
  /** Unique, stable key (also used as React key). */
  id: string;
  /** The element component. */
  Component: SceneElement;
  /**
   * Moving actor (boats, creatures) vs water/scenery. Actors are hidden while
   * the window is being resized - a mid-drag stale frame stretches them into
   * visible artifacts - and pop back in ~1s after the drag settles. Water and
   * scenery keep rendering through the whole drag.
   */
  actor?: boolean;
}
