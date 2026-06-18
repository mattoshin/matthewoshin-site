"use client";

/**
 * StaticOcean - the gorgeous, zero-motion, zero-WebGL background.
 *
 * Used in three situations:
 *   1. prefers-reduced-motion (OS) or the manual reduced-motion toggle.
 *   2. WebGL2 unavailable (hard fallback).
 *   3. Underneath the live canvas, so transparent areas / context loss still
 *      read as ocean rather than white.
 *
 * MULTI-PAGE / route depth: depth is route-driven, so the static fallback shows
 * the color of the CURRENT page's depth. It paints the full zone-palette column
 * (a smooth light->deep descent identical to the WebGL fog targets) and slides it
 * vertically so the active route's depth band fills the viewport. The slide eases
 * via a CSS transition, so even without WebGL, navigating between pages reads as a
 * gentle dive between depths. Reduced-motion users get an instant (no-transition)
 * shift instead, honoring prefers-reduced-motion.
 */

import { useDescentStore } from "@/lib/store";
import { ZONES, clamp01 } from "@/lib/depth";

// How many viewport-heights tall the painted column is. Taller than 1 so we can
// pan a single zone band into view. 3.2 gives every band breathing room.
const COLUMN_VH = 3.2;

// Build CSS gradient stops from the zone palette, mapping each zone's depth band
// (start..end of the descent) onto the 0..100% of the painted column.
function buildGradient(): string {
  const stops: string[] = [];
  for (const zone of ZONES) {
    const startPct = (zone.start * 100).toFixed(1);
    const endPct = (zone.end * 100).toFixed(1);
    stops.push(`${zone.palette.top} ${startPct}%`);
    stops.push(`${zone.palette.deep} ${endPct}%`);
  }
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

export default function StaticOcean() {
  // Live depth (canvas feeds it back; reduced-motion sets it directly). Used to
  // pan the gradient column so the current page's band fills the viewport.
  const progress = useDescentStore((s) => s.scrollProgress);
  const reducedMotion = useDescentStore((s) => s.reducedMotion);

  // The column is COLUMN_VH viewports tall; translate it up so the band at
  // `progress` (0..1) sits in the middle of the viewport. Travel range is the
  // overflow height: (COLUMN_VH - 1) viewports.
  const travel = COLUMN_VH - 1;
  const offsetVh = clamp01(progress) * travel * -100;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base depth gradient (data-driven from the zone palette in depth.ts, so
          it always matches the WebGL fog and stays a smooth light->deep descent).
          Panned vertically to the active route's depth band. */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: `${COLUMN_VH * 100}vh`,
          backgroundImage: buildGradient(),
          transform: `translateY(${offsetVh}vh)`,
          transition: reducedMotion
            ? "none"
            : "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      />
      {/* Surface light: a warm god-ray wash + soft slanted shafts. Pinned to the
          viewport (these are surface light, not part of the panned column), and
          faded OUT as the route depth descends so deep pages aren't lit. */}
      <div
        className="absolute inset-x-0 top-0 h-[48vh]"
        style={{
          opacity: clamp01(1 - progress / 0.25),
          transition: reducedMotion ? "none" : "opacity 1.1s ease",
          background:
            "radial-gradient(130% 90% at 50% -12%, color-mix(in srgb, var(--surface-sun) 70%, transparent), color-mix(in srgb, var(--surface-sky) 45%, transparent) 42%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[55vh]"
        style={{
          opacity: clamp01(1 - progress / 0.25) * 0.7,
          transition: reducedMotion ? "none" : "opacity 1.1s ease",
          background:
            "linear-gradient(105deg, transparent 38%, color-mix(in srgb, var(--surface-foam) 16%, transparent) 46%, transparent 54%), linear-gradient(80deg, transparent 60%, color-mix(in srgb, var(--surface-foam) 12%, transparent) 67%, transparent 74%)",
        }}
      />
      {/* Bioluminescent haze toward the floor, faded IN as the route depth
          descends so the cyan glow reads as life on the deep pages. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[38vh]"
        style={{
          opacity: clamp01((progress - 0.45) / 0.45),
          transition: reducedMotion ? "none" : "opacity 1.1s ease",
          background:
            "radial-gradient(120% 90% at 50% 110%, color-mix(in srgb, var(--bio-cyan) 18%, transparent), transparent 65%)",
        }}
      />
    </div>
  );
}
