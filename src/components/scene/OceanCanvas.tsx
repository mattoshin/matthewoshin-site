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
import OceanScene from "./OceanScene";
import StaticOcean from "../chrome/StaticOcean";

export default function OceanCanvas() {
  const setWebglAvailable = useDescentStore((s) => s.setWebglAvailable);
  const setSceneReady = useDescentStore((s) => s.setSceneReady);
  const tier = useDeviceTier();
  const isPhone = tier === "phone";

  // This component is only ever mounted client-side (dynamic ssr:false), so it is
  // safe to detect WebGL2 in a lazy state initializer rather than an effect.
  const [supported] = useState<boolean>(() => isWebGL2Available());
  // Phones render at their native device pixel ratio (capped at 2) so the surface
  // hero (Lamborghini + Black Pearl) reads crisp on retina panels. The trimmed
  // phone registry plus the PerformanceMonitor below keep that within budget,
  // shedding resolution only if FPS actually dips. dpr ceiling can be lowered by
  // the PerformanceMonitor at runtime.
  const phoneCeil = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1.5;
  const [dpr, setDpr] = useState<number>(isPhone ? phoneCeil : 1.5);
  // Hard fallback flag: only raised for genuinely unusable WebGL (no context, or
  // a lost context). FPS dips DO NOT raise this anymore - see onFallback below.
  const [degraded, setDegraded] = useState(false);
  // Phone graceful-degradation step: drop to the hero-only registry rather than
  // blanking the whole scene to static when FPS can't hold. The Lamborghini +
  // Black Pearl survive every degradation path.
  const [lite, setLite] = useState(false);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

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

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* Static gradient sits underneath the canvas so any transparent area or
          a WebGL context loss still reads as ocean, not white. */}
      <StaticOcean />
      <Canvas
        className="!fixed !inset-0"
        frameloop={frameloop}
        dpr={[dprMin, dprCeiling]}
        gl={{
          antialias: !isPhone, // MSAA off on phones: meaningful fill-rate saving
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 200 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
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
              // dropping the Lamborghini + Black Pearl on every FPS dip.
              setDpr(dprMin);
              setLite(true);
            } else {
              setDegraded(true);
            }
          }}
        >
          <OceanScene tier={tier} lite={lite} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
