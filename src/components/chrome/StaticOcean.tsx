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
 * It is a single fixed, full-viewport element painting a vertical gradient that
 * walks through every zone palette top to bottom. It is fully deterministic, so
 * it renders identically on server and client (no hydration mismatch) and needs
 * no animation to look intentional.
 */

import { ZONES } from "@/lib/depth";

// Build CSS gradient stops from the zone palette, mapping each zone's depth band
// (start..end of the descent) onto the 0..100% of the visible column.
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
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* Base depth gradient. */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: buildGradient() }}
      />
      {/* Soft surface sunlight glow at the very top. */}
      <div
        className="absolute inset-x-0 top-0 h-[40vh]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--surface-sun) 55%, transparent), transparent 60%)",
        }}
      />
      {/* Faint bioluminescent haze toward the floor. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[35vh]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 110%, color-mix(in srgb, var(--bio-cyan) 14%, transparent), transparent 65%)",
        }}
      />
    </div>
  );
}
