"use client";

/**
 * OceanScene - everything that lives INSIDE the <Canvas>.
 *
 * Responsibilities:
 *   - Build the stable `progress` accessor (reads zustand without subscribing).
 *   - Drive the camera.y and the scene fog toward depth-driven targets each
 *     frame, LERPing so fast scrolls feel like sinking.
 *   - Render every registered scene element from the registry, passing each the
 *     shared `progress` accessor.
 *
 * It does NOT own the Canvas, dpr, perf monitor, or WebGL detection. That is the
 * OceanCanvas wrapper. Keeping them separate means scene elements never touch
 * canvas config and vice versa.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { useDescentStore } from "@/lib/store";
import {
  ZONES,
  cameraYForProgress,
  clamp01,
  fogDensityForProgress,
  hexToRgb01,
  lerp,
  zoneAtProgress,
  type ZoneId,
} from "@/lib/depth";
import { elementsForTier } from "./registry";
import type { DescentProgress } from "./types";
import type { DeviceTier } from "@/lib/useDeviceTier";

/** Build the stable, re-render-free progress accessor from the store. */
function useDescentProgress(): DescentProgress {
  return useMemo<DescentProgress>(() => {
    const get = () => useDescentStore.getState().scrollProgress;
    return {
      get,
      zone: () => zoneAtProgress(get()).id,
      inZone: (id: ZoneId) => zoneAtProgress(get()).id === id,
      within: (id: ZoneId) => {
        const z = ZONES.find((zone) => zone.id === id);
        if (!z) return 0;
        const span = z.end - z.start || 1;
        return clamp01((get() - z.start) / span);
      },
    };
  }, []);
}

// Surface fog as the initial fog values (declared via <fogExp2> in JSX so React
// owns it, then mutated imperatively each frame via the ref).
const INITIAL_FOG = hexToRgb01(ZONES[0].palette.fog);

/**
 * Drives the camera depth and the scene fog every frame toward depth targets.
 *
 * To stay compatible with the React Compiler immutability lint we never mutate
 * values returned from a hook in the render body. Instead:
 *   - the fog is declared declaratively as a <fogExp2> attached to the scene,
 *     and we hold a ref to it to mutate density/color inside useFrame;
 *   - camera/scene are read from the `state` argument of useFrame (not from
 *     useThree at render time), which the linter permits.
 */
function DepthController() {
  const fogRef = useRef<THREE.FogExp2>(null);
  // Seed the smoothed depth from the route's initial target so the first paint
  // is already at the right depth (e.g. landing directly on /contact).
  const smoothed = useRef(useDescentStore.getState().targetProgress);
  // Scratch color reused each frame so we never allocate inside useFrame.
  const targetColor = useRef(new THREE.Color());

  useFrame((state, delta) => {
    // Route-driven: dive TOWARD the active page's zone center, never scroll.
    const target = useDescentStore.getState().targetProgress;
    // Critically-damped-ish lerp: a graceful sink, never a snap.
    const k = Math.min(1, delta * 2.5);
    smoothed.current = lerp(smoothed.current, target, k);
    const p = smoothed.current;

    // Report the live smoothed depth back to the store so the depth gauge and
    // any DOM readouts track the dive in real time. Cheap-guarded inside the
    // store; we round to avoid churning React on imperceptible deltas.
    useDescentStore.getState().setScrollProgress(Math.round(p * 1000) / 1000);

    // Camera sinks.
    state.camera.position.y = cameraYForProgress(p);

    const f = fogRef.current;
    if (f) {
      f.density = fogDensityForProgress(p);
      // Ease the fog color toward the active zone's fog target.
      const zone = zoneAtProgress(p);
      const [tr, tg, tb] = hexToRgb01(zone.palette.fog);
      targetColor.current.setRGB(tr, tg, tb);
      f.color.lerp(targetColor.current, k);
    }
  });

  return (
    <fogExp2
      ref={fogRef}
      attach="fog"
      args={[
        new THREE.Color(INITIAL_FOG[0], INITIAL_FOG[1], INITIAL_FOG[2]).getHex(),
        0.012,
      ]}
    />
  );
}

/**
 * Flips the store's `sceneReady` once the WebGL scene has actually painted a few
 * frames, so the SharkLoader fades out over a rendered ocean rather than guessing
 * with a timer. Fires once, then the per-frame work is a single cheap compare.
 */
function SceneReadySignal() {
  const setSceneReady = useDescentStore((s) => s.setSceneReady);
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current >= 3) {
      done.current = true;
      setSceneReady(true);
    }
  });
  return null;
}

/**
 * @param tier       "phone" runs the trimmed registry; "full" the complete scene.
 * @param lite       phone-only graceful-degradation flag -> hero-only element set.
 * @param hideActors true while the window is being live-resized: the moving
 *                   vessels + creatures (registry `actor: true`) toggle invisible
 *                   so a mid-drag stale frame can't stretch them into artifacts,
 *                   while the water keeps rendering. Visibility (not unmount) so
 *                   no model state resets and repopulating is free.
 * Defaults keep the full scene if ever rendered without props.
 */
export default function OceanScene({
  tier = "full",
  lite = false,
  hideActors = false,
}: {
  tier?: DeviceTier;
  lite?: boolean;
  hideActors?: boolean;
}) {
  const progress = useDescentProgress();
  const elements = elementsForTier(tier, lite);

  return (
    <>
      <DepthController />
      <SceneReadySignal />
      <AdaptiveDpr pixelated={false} />
      <ambientLight intensity={0.6} />
      {elements.map(({ id, Component, actor }) =>
        // Each actor gets its OWN visibility group (not one shared wrapper) so
        // registry draw order is preserved exactly - the transparent water
        // shaders depend on it.
        actor ? (
          <group key={id} visible={!hideActors}>
            <Component progress={progress} />
          </group>
        ) : (
          <Component key={id} progress={progress} />
        ),
      )}
    </>
  );
}
