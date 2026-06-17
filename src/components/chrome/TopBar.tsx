"use client";

/**
 * TopBar - fixed wordmark (top-left, returns to surface) plus the motion / flat
 * controls (top-right):
 *   - "Skip the dive, read flat": jumps straight to the About section so a
 *     visitor who does not want the descent can read content immediately. It is
 *     an in-page anchor so it works without JS too.
 *   - Reduced-motion toggle: flips the manual override in the store. When on, the
 *     canvas unmounts and the static ocean renders.
 */

import { useDescentStore } from "@/lib/store";
import { scrollToTop, scrollToZone } from "@/lib/scroll";
import { SITE } from "@/data/content";

export default function TopBar() {
  const manualReduced = useDescentStore((s) => s.manualReducedMotion);
  const reducedMotion = useDescentStore((s) => s.reducedMotion);
  const toggleReducedMotion = useDescentStore((s) => s.toggleReducedMotion);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between p-4 sm:p-5">
      {/* Wordmark -> surface */}
      <button
        type="button"
        onClick={scrollToTop}
        className="pointer-events-auto rounded-md text-left"
        aria-label="Matthew Oshin, return to surface"
      >
        <span className="font-display text-lg font-semibold tracking-tight text-ink-heading">
          {SITE.name}
        </span>
      </button>

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollToZone("about")}
          className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium text-ink-body backdrop-blur-md transition-colors hover:border-bio-cyan/60 hover:text-bio-cyan"
        >
          Skip the dive, read flat
        </button>
        <button
          type="button"
          onClick={toggleReducedMotion}
          aria-pressed={manualReduced}
          title={
            manualReduced
              ? "Motion reduced. Click to re-enable the dive."
              : "Reduce motion (static background)."
          }
          className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium text-ink-body backdrop-blur-md transition-colors hover:border-bio-cyan/60 hover:text-bio-cyan"
        >
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${
              reducedMotion ? "bg-ink-faint" : "bg-bio-aqua shadow-[0_0_8px_var(--bio-aqua)]"
            }`}
          />
          {reducedMotion ? "Motion off" : "Motion on"}
        </button>
      </div>
    </header>
  );
}
