"use client";

/**
 * DepthGauge - a slim, decorative descent progress indicator pinned to the right
 * edge on large screens. The PRIMARY navigation is now BucketNav (the top pill
 * bar); this rail just shows how deep you are in the dive: a vertical fill that
 * descends with you, the live depth percent, and the current zone's poetic depth
 * readout (e.g. "Twilight").
 *
 * Reads `scrollProgress` and `activeZone` from the store. No nav links here, so
 * it never competes with the top bucket bar for keyboard focus. Hidden below lg
 * where the top bar already gives full navigation.
 */

import { useDescentStore } from "@/lib/store";
import { ZONES } from "@/lib/depth";

export default function DepthGauge() {
  const progress = useDescentStore((s) => s.scrollProgress);
  const activeZone = useDescentStore((s) => s.activeZone);
  const pct = Math.round(progress * 100);
  const zone = ZONES.find((z) => z.id === activeZone);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      {/* Fixed outer box: only the fill bar animates, never the chrome dimensions. */}
      <div className="flex h-44 w-[6.5rem] shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-md">
        <div className="relative h-36 w-1 shrink-0 rounded-full bg-white/10">
          <div
            className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-surface-water via-bio-cyan to-bio-aqua transition-[height] duration-150 ease-out"
            style={{ height: `${pct}%` }}
          />
        </div>
        <div className="flex w-[3.25rem] shrink-0 flex-col items-start justify-center gap-0.5">
          <span className="block w-full truncate font-mono text-[10px] uppercase tracking-widest text-bio-cyan/80">
            {zone?.depthLabel ?? "\u00a0"}
          </span>
          <span className="block w-full font-mono text-[10px] tabular-nums text-ink-faint">
            Depth{" "}
            <span className="inline-block w-[1.35rem] text-right">{pct}</span>%
          </span>
        </div>
      </div>
    </div>
  );
}
