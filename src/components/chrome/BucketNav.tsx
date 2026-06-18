"use client";

/**
 * BucketNav - the primary navigation. A sticky top button bar that rides over
 * BOTH the bright surface and the dark deep, so it uses a translucent pill
 * background with a backdrop blur and ink tokens that read either way.
 *
 * Layout:
 *   left   - the "Matthew Oshin" wordmark (a real <button> that returns to the
 *            surface/top).
 *   center - the six bucket pills, in fixed order: Experience, Entrepreneurship,
 *            Skills, Education, Interests, Contact. Each smooth-scrolls to its
 *            mapped zone via scrollToZone and shows an active state driven by the
 *            store's activeZone (aria-current="true" on the active one).
 *   right  - the "Skip the dive, read flat" affordance + the reduced-motion
 *            toggle (carried over from the old TopBar).
 *
 * Accessibility: every control is a real <button>, keyboard reachable, with a
 * focus-visible ring from globals.css. The active bucket carries aria-current.
 * On small screens the bucket pills scroll horizontally so they never wrap into
 * the controls.
 */

import { useDescentStore } from "@/lib/store";
import { scrollToTop, scrollToZone } from "@/lib/scroll";
import { BUCKETS, SITE } from "@/data/content";

export default function BucketNav() {
  const activeZone = useDescentStore((s) => s.activeZone);
  const manualReduced = useDescentStore((s) => s.manualReducedMotion);
  const reducedMotion = useDescentStore((s) => s.reducedMotion);
  const toggleReducedMotion = useDescentStore((s) => s.toggleReducedMotion);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-5">
        {/* Wordmark -> surface. Carries a subtle glass chip so the light wordmark
            reads over BOTH the bright surface and the dark deep. */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-current={activeZone === "surface" ? "page" : undefined}
          className="shrink-0 rounded-full border border-white/15 bg-deep-body/70 px-3 py-1.5 text-left backdrop-blur-md transition-colors hover:border-reef-coral/50"
          aria-label="Matthew Oshin, return to the top"
        >
          <span className="font-display text-base font-semibold tracking-tight text-ink-heading sm:text-lg">
            {SITE.name}
          </span>
        </button>

        {/* Bucket pills. The bar HUGS its content (inline-flex, w-auto) instead of
            stretching half-empty across the row; it stays centered on wide
            screens and scrolls horizontally on narrow ones. */}
        <nav
          aria-label="Sections"
          className="flex min-w-0 flex-1 justify-center"
        >
          <ul className="flex w-auto max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/15 bg-deep-body/70 px-1 py-1 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {BUCKETS.map((bucket) => {
              const active = bucket.id === activeZone;
              return (
                <li key={bucket.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollToZone(bucket.id)}
                    aria-current={active ? "true" : undefined}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm ${
                      active
                        ? "glow-coral bg-reef-coral text-abyss-void"
                        : "text-ink-body hover:bg-white/10 hover:text-ink-heading"
                    }`}
                  >
                    {bucket.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Motion / flat controls */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToZone("about")}
            className="hidden rounded-full border border-white/15 bg-deep-body/70 px-3 py-1.5 text-xs font-medium text-ink-body backdrop-blur-md transition-colors hover:border-bio-cyan/60 hover:text-bio-cyan lg:inline-flex"
          >
            Skip the dive, read flat
          </button>
          <button
            type="button"
            onClick={toggleReducedMotion}
            aria-pressed={manualReduced}
            aria-label={
              manualReduced
                ? "Motion reduced. Re-enable the dive."
                : "Reduce motion to a static background."
            }
            title={
              manualReduced
                ? "Motion reduced. Click to re-enable the dive."
                : "Reduce motion (static background)."
            }
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-deep-body/70 px-3 py-1.5 text-xs font-medium text-ink-body backdrop-blur-md transition-colors hover:border-bio-cyan/60 hover:text-bio-cyan"
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${
                reducedMotion
                  ? "bg-ink-faint"
                  : "bg-bio-aqua shadow-[0_0_8px_var(--bio-aqua)]"
              }`}
            />
            <span className="hidden sm:inline">
              {reducedMotion ? "Motion off" : "Motion on"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
