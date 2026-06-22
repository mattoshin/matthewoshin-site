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
  const tier = useDeviceTier();
  const isPhone = tier === "phone";

  // This component is only ever mounted client-side (dynamic ssr:false), so it is
  // safe to detect WebGL2 in a lazy state initializer rather than an effect.
  const [supported] = useState<boolean>(() => isWebGL2Available());
  // dpr ceiling can be lowered by the PerformanceMonitor at runtime. Phones cap
  // at 1.0 (a 3x panel rendered at 1.5 is the single biggest fill-rate cost).
  const [dpr, setDpr] = useState<number>(isPhone ? 1 : 1.5);
  // Hard fallback flag: only raised for genuinely unusable WebGL (no context, or
  // a lost context). FPS dips DO NOT raise this anymore - see onFallback below.
  const [degraded, setDegraded] = useState(false);
  // Phone graceful-degradation step: drop to the hero-only registry rather than
  // blanking the whole scene to static when FPS can't hold. The Lamborghini +
  // Black Pearl survive every degradation path.
  const [lite, setLite] = useState(false);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  // Phones cap DPR at 1.0 with a 0.75 floor; desktop/tablet keep the full range.
  // The ceiling is clamped to dprMax at render time so a stale runtime `dpr` from
  // before a tier change (e.g. desktop -> phone resize) can never exceed the
  // tier's budget, which avoids needing a setState-in-effect to reset it.
  const dprMin = isPhone ? 0.75 : 1;
  const dprMax = isPhone ? 1 : 1.5;
  const dprCeiling = Math.min(dpr, dprMax);

  // Sync detection result into the shared store (external-system sync).
  useEffect(() => {
    setWebglAvailable(supported && !degraded);
  }, [supported, degraded, setWebglAvailable]);

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
