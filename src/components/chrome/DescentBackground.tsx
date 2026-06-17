"use client";

/**
 * DescentBackground - chooses what fills the fixed background layer.
 *
 *   reduced motion OR not yet hydrated  ->  StaticOcean (no canvas)
 *   otherwise                           ->  OceanCanvas (lazy, ssr:false)
 *
 * The canvas is imported with next/dynamic({ ssr:false }) so three/R3F never run
 * on the server. Until the client hydrates and we know the motion preference, we
 * render StaticOcean so the first paint is always the ocean and there is no
 * white flash or hydration mismatch.
 */

import dynamic from "next/dynamic";
import { useDescentStore } from "@/lib/store";
import StaticOcean from "./StaticOcean";

// ssr:false: keep WebGL strictly client-side. The fallback during load is the
// static ocean, not a blank box.
const OceanCanvas = dynamic(() => import("../scene/OceanCanvas"), {
  ssr: false,
  loading: () => <StaticOcean />,
});

export default function DescentBackground() {
  const reducedMotion = useDescentStore((s) => s.reducedMotion);
  const hydrated = useDescentStore((s) => s.hydrated);

  if (!hydrated || reducedMotion) {
    return <StaticOcean />;
  }
  return <OceanCanvas />;
}
