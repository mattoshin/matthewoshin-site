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
import OceanScene from "./OceanScene";
import StaticOcean from "../chrome/StaticOcean";

export default function OceanCanvas() {
  const setWebglAvailable = useDescentStore((s) => s.setWebglAvailable);
  // This component is only ever mounted client-side (dynamic ssr:false), so it is
  // safe to detect WebGL2 in a lazy state initializer rather than an effect.
  const [supported] = useState<boolean>(() => isWebGL2Available());
  // dpr can be lowered by the PerformanceMonitor at runtime.
  const [dpr, setDpr] = useState<number>(1.5);
  // Hard fallback flag, raised on PerformanceMonitor onFallback or context loss.
  const [degraded, setDegraded] = useState(false);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

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
        dpr={[1, dpr]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
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
          onDecline={() => setDpr(1)}
          onFallback={() => setDegraded(true)}
        >
          <OceanScene />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
