"use client";

/**
 * DepthGauge - the fixed vertical depth-gauge navigation rail.
 *
 * Desktop: a rail pinned to the right edge listing all seven zones, showing live
 * scroll progress (a fill that descends as you do) and jump-links that animate
 * the scroll to each zone.
 *
 * Mobile: collapses to a single button (bottom-right) that opens the same list
 * as an overlay sheet.
 *
 * Reads `scrollProgress` and `activeZone` from the store. Jumps via scrollToZone.
 */

import { useState } from "react";
import { useDescentStore } from "@/lib/store";
import { ZONES, type ZoneId } from "@/lib/depth";
import { scrollToZone } from "@/lib/scroll";

function ZoneList({ onJump }: { onJump?: () => void }) {
  const activeZone = useDescentStore((s) => s.activeZone);

  const handle = (id: ZoneId) => {
    scrollToZone(id);
    onJump?.();
  };

  return (
    <ol className="flex flex-col gap-1">
      {ZONES.map((zone, i) => {
        const active = zone.id === activeZone;
        return (
          <li key={zone.id}>
            <button
              type="button"
              onClick={() => handle(zone.id)}
              aria-current={active ? "true" : undefined}
              className="group flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-white/5"
            >
              <span
                aria-hidden="true"
                className="font-mono text-[10px] tabular-nums text-ink-faint"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all ${
                  active
                    ? "bg-bio-cyan shadow-[0_0_10px_var(--bio-cyan)]"
                    : "bg-ink-faint group-hover:bg-ink-muted"
                }`}
              />
              <span className="flex flex-col">
                <span
                  className={`text-sm font-medium transition-colors ${
                    active ? "text-bio-cyan glow-cyan" : "text-ink-muted group-hover:text-ink-body"
                  }`}
                >
                  {zone.label}
                </span>
                <span className="font-mono text-[10px] text-ink-faint">
                  {zone.depthLabel}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export default function DepthGauge() {
  const progress = useDescentStore((s) => s.scrollProgress);
  const activeZone = useDescentStore((s) => s.activeZone);
  const [open, setOpen] = useState(false);
  const pct = Math.round(progress * 100);

  return (
    <>
      {/* Desktop rail */}
      <nav
        aria-label="Depth navigation"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <div className="flex items-stretch gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-md">
          {/* Progress track */}
          <div className="relative w-1 rounded-full bg-white/10" aria-hidden="true">
            <div
              className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-surface-water via-bio-cyan to-bio-aqua"
              style={{ height: `${pct}%` }}
            />
          </div>
          <div>
            <ZoneList />
            <p className="mt-2 px-2 font-mono text-[10px] text-ink-faint" aria-live="polite">
              Depth {pct}%
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="depth-gauge-sheet"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2.5 text-sm font-medium text-ink-body backdrop-blur-md lg:hidden"
      >
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-bio-cyan shadow-[0_0_8px_var(--bio-cyan)]"
        />
        {ZONES.find((z) => z.id === activeZone)?.label ?? "Navigate"}
        <span className="font-mono text-[10px] text-ink-faint">{pct}%</span>
      </button>

      {/* Mobile sheet */}
      {open && (
        <div
          id="depth-gauge-sheet"
          className="fixed inset-0 z-40 flex flex-col justify-end bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        >
          <nav
            aria-label="Depth navigation"
            className="m-3 rounded-2xl border border-white/10 bg-abyss-body/95 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Descend to
            </p>
            <ZoneList onJump={() => setOpen(false)} />
          </nav>
        </div>
      )}
    </>
  );
}
