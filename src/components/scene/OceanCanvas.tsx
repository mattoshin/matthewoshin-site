"use client";

/**
 * OceanCanvas - the ONE persistent WebGL canvas.
 *
 * Owns: the R3F <Canvas>, dpr range, PerformanceMonitor (auto-degrades dpr when
 * FPS drops, hard-falls-back to StaticOcean on the worst hardware), pause when
 * the tab is hidden, and the WebGL2 availability gate.
 *
 * Positioned fixed, full-viewport, BEHIND the DOM (-z-10), pointer-events:none,
 * aria-hidden. All real content is server-rendered DOM on top of this.
 *
 * This component is the thing imported via next/dynamic({ ssr:false }) so the
 * canvas never SSRs. See DescentBackground.
 */

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useDescentStore } from "@/lib/store";
import { isWebGL2Available } from "@/lib/webgl";
import { useDeviceTier } from "@/lib/useDeviceTier";
import { useWindowResizing } from "@/lib/useWindowResizing";
import OceanScene from "./OceanScene";
import SceneErrorBoundary from "./SceneErrorBoundary";
import StaticOcean from "../chrome/StaticOcean";

// If the live canvas mounts but never reports a painted frame within this budget
// (a hung or silently-broken context that neither throws nor fires
// `webglcontextlost`), give up on it and fall back to the static ocean. Comfortably
// longer than a healthy scene's first-paint (a few frames) and than the loader's
// own safety timeout, so slow-but-working hardware is never wrongly demoted.
const PAINT_WATCHDOG_MS = 5000;

export default function OceanCanvas() {
  const setWebglAvailable = useDescentStore((s) => s.setWebglAvailable);
  const setSceneReady = useDescentStore((s) => s.setSceneReady);
  const sceneReady = useDescentStore((s) => s.sceneReady);
  const tier = useDeviceTier();
  const isPhone = tier === "phone";

  // This component is only ever mounted client-side (dynamic ssr:false), so it is
  // safe to detect WebGL2 in a lazy state initializer rather than an effect.
  const [supported] = useState<boolean>(() => isWebGL2Available());
  // Phones render at their native device pixel ratio (capped at 2) so the surface
  // hero (the sailboat) reads crisp on retina panels. The trimmed
  // phone registry plus the PerformanceMonitor below keep that within budget,
  // shedding resolution only if FPS actually dips. dpr ceiling can be lowered by
  // the PerformanceMonitor at runtime.
  const phoneCeil = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1.5;
  const [dpr, setDpr] = useState<number>(isPhone ? phoneCeil : 1.5);
  // Hard fallback flag: only raised for genuinely unusable WebGL (no context, or
  // a lost context). FPS dips DO NOT raise this anymore - see onFallback below.
  const [degraded, setDegraded] = useState(false);
  // Phone graceful-degradation step: drop to the hero-only registry rather than
  // blanking the whole scene to static when FPS can't hold. The sailboat
  // survives every degradation path.
  const [lite, setLite] = useState(false);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  // During a live window-corner drag, hide the moving actors (the sailboat,
  // creatures) while the WATER keeps rendering; the actors pop back in once the
  // drag has settled for a second. Desktop/tablet only: phones fire `resize` on
  // every URL-bar collapse while scrolling, and the scene must not lose its
  // hero mid-scroll there.
  const resizing = useWindowResizing(1000, !isPhone);

  // Floor is 1.0 everywhere: never render below native CSS resolution, which is
  // what made the phone surface look soft and blurry. Phones may climb to their
  // native ratio (capped at 2) for a pixel-dense hero; desktop/tablet keep
  // [1, 1.5]. The ceiling is clamped to [dprMin, dprMax] at render time so a
  // stale runtime `dpr` from before a tier change can never produce an
  // out-of-budget OR an inverted range; `dpr` re-expands on the next onDecline.
  const dprMin = 1;
  const dprMax = isPhone ? phoneCeil : 1.5;
  const dprCeiling = Math.max(dprMin, Math.min(dpr, dprMax));

  // Sync detection result into the shared store (external-system sync).
  useEffect(() => {
    setWebglAvailable(supported && !degraded);
  }, [supported, degraded, setWebglAvailable]);

  // When there is no live canvas to paint (no WebGL2, or a runtime hard
  // fallback), the StaticOcean IS the terminal background, so mark the scene
  // ready immediately and let the loader fade rather than wait for its timeout.
  useEffect(() => {
    if (!supported || degraded) setSceneReady(true);
  }, [supported, degraded, setSceneReady]);

  // Paint watchdog: the live canvas is mounted, but if it never reports a
  // painted frame (SceneReadySignal flips `sceneReady` after a few frames) within
  // the budget, the context is hung or silently broken - it isn't throwing and
  // isn't firing `webglcontextlost`, so nothing else would catch it. Fall back to
  // the static ocean rather than leave a stuck/blank layer on screen. Cleared the
  // moment the scene paints, so healthy hardware never trips it.
  useEffect(() => {
    if (!supported || degraded || sceneReady) return;
    const t = window.setTimeout(() => {
      if (!useDescentStore.getState().sceneReady) {
        setDegraded(true);
        setWebglAvailable(false);
      }
    }, PAINT_WATCHDOG_MS);
    return () => window.clearTimeout(t);
  }, [supported, degraded, sceneReady, setWebglAvailable]);

  // Pause rendering when the tab is hidden (saves battery / GPU).
  useEffect(() => {
    const onVisibility = () => {
      setFrameloop(document.hidden ? "never" : "always");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // No WebGL2, or we degraded at runtime: render the static gradient instead.
  if (!supported || degraded) {
    return <StaticOcean />;
  }

  // Shared fallback: mark the scene ready + webgl unavailable so the loader fades,
  // then render the static ocean in place of the broken canvas subtree.
  const handleSceneError = () => {
    setDegraded(true);
    setWebglAvailable(false);
    setSceneReady(true);
  };

  return (
    <div aria-hidden="true" className="ocean-fixed-layer pointer-events-none -z-10">
      {/* Static gradient sits underneath the canvas so any transparent area or
          a WebGL context loss still reads as ocean, not white. */}
      <StaticOcean />
      <SceneErrorBoundary fallback={null} onError={handleSceneError}>
      <Canvas
        className="ocean-canvas-layer"
        frameloop={frameloop}
        // Debounce the WebGL buffer resize. R3F's default is `resize: 0`, which
        // reallocates + clears the drawing buffer on EVERY resize event; during a
        // continuous window-corner drag that strobes the canvas (the "blinking"
        // bug) because each clear flashes the StaticOcean layer behind it. With a
        // debounce the canvas just CSS-scales smoothly through the drag and does a
        // single crisp buffer-resize once the drag settles. (scroll kept at 50.)
        resize={{ debounce: { scroll: 50, resize: 200 } }}
        dpr={[dprMin, dprCeiling]}
        gl={{
          antialias: !isPhone, // MSAA off on phones: meaningful fill-rate saving
          alpha: true,
          // "default", not "high-performance": forcing the discrete GPU is a known
          // way to FAIL context creation (or select a blocklisted/buggy adapter)
          // on managed Windows/Edge machines, which is what rendered the hero as a
          // dark broken layer instead of the ocean. Let the browser pick the
          // adapter it can actually drive; the PerformanceMonitor above still sheds
          // resolution if that adapter can't hold frame rate.
          powerPreference: "default",
          // Accept a software/perf-caveat context rather than getting null: paired
          // with the paint watchdog + PerformanceMonitor, a slow context degrades
          // gracefully instead of leaving no background at all.
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 200 }}
        onCreated={({ gl }) => {
          // Context LOST after creation (GPU reset / process crash): degrade.
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              setDegraded(true);
              setWebglAvailable(false);
            },
            { once: true },
          );
          // Context CREATION error surfaced late on the element: same fallback.
          // (The up-front isWebGL2Available probe catches most of these before we
          // ever mount, but the live canvas uses different attributes, so guard
          // here too.)
          gl.domElement.addEventListener(
            "webglcontextcreationerror",
            () => {
              setDegraded(true);
              setWebglAvailable(false);
            },
            { once: true },
          );
        }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(dprMin)}
          onFallback={() => {
            if (isPhone) {
              // Fail SOFT on phones: shed resolution and step down to the
              // hero-only profile. NEVER blank to static here - that is what was
              // dropping the sailboat on every FPS dip.
              setDpr(dprMin);
              setLite(true);
            } else {
              setDegraded(true);
            }
          }}
        >
          <OceanScene tier={tier} lite={lite} hideActors={resizing} />
        </PerformanceMonitor>
      </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
