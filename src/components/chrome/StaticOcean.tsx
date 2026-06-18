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
      {/* Base depth gradient (data-driven from the zone palette in depth.ts, so
          it always matches the WebGL fog and stays a smooth light->deep descent). */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: buildGradient() }}
      />
      {/* Bright, friendly god-ray wash at the surface: warm sun core fading into
          the airy aqua of the surface band, echoing the reference shot. */}
      <div
        className="absolute inset-x-0 top-0 h-[48vh]"
        style={{
          background:
            "radial-gradient(130% 90% at 50% -12%, color-mix(in srgb, var(--surface-sun) 70%, transparent), color-mix(in srgb, var(--surface-sky) 45%, transparent) 42%, transparent 70%)",
        }}
      />
      {/* A couple of soft slanted light shafts to keep the surface lively. */}
      <div
        className="absolute inset-x-0 top-0 h-[55vh] opacity-70"
        style={{
          background:
            "linear-gradient(105deg, transparent 38%, color-mix(in srgb, var(--surface-foam) 16%, transparent) 46%, transparent 54%), linear-gradient(80deg, transparent 60%, color-mix(in srgb, var(--surface-foam) 12%, transparent) 67%, transparent 74%)",
        }}
      />
      {/* Bioluminescent haze toward the floor - now sitting over a rich teal-navy
          deep rather than near-black, so the cyan glow reads as life, not noise. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[38vh]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 110%, color-mix(in srgb, var(--bio-cyan) 18%, transparent), transparent 65%)",
        }}
      />
    </div>
  );
}
