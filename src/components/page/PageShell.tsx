import type { ReactNode } from "react";
import Link from "next/link";
import { zoneById, type ZoneId } from "@/lib/depth";
import ZoneSetter from "./ZoneSetter";

/**
 * PageShell - the readable column every SUBPAGE renders its content into, over
 * the persistent ocean. Server component (SEO + a11y); only ZoneSetter is client.
 *
 * Each page sits at its own ocean depth. PageShell:
 *   - mounts <ZoneSetter zone> so the camera dives to this zone on navigation;
 *   - paints a short page header (coral eyebrow with the zone's poetic depth +
 *     label, then a big display heading);
 *   - rides the content on the existing `.section-scrim` glass panel so light
 *     type clears WCAG AA over whatever swims behind it, while the ocean still
 *     glows around the panel.
 *
 * Page content scrolls normally inside this column; scroll does NOT change the
 * ocean depth anymore (depth = route).
 *
 * Two widths: "wide" (max-w-5xl, the default for grids and card pages) and
 * "reading" (max-w-3xl, for the blog where a long text column wants a shorter
 * measure). The case-study routes (/projects, /ventures, /education [slug]) do
 * NOT use this shell on purpose: they read on a flat gradient with no glass
 * panel, see the note at the top of src/app/projects/[slug]/page.tsx.
 */

export default function PageShell({
  zone,
  heading,
  intro,
  navLabel,
  width = "wide",
  backLink,
  kicker,
  children,
}: {
  zone: ZoneId;
  heading: string;
  intro?: string;
  /** Eyebrow label when the page is not the zone's own bucket (Contact borrows
      the Interests depth; Writing borrows the Education depth). */
  navLabel?: string;
  width?: "wide" | "reading";
  /** A small "back" link above the eyebrow, for pages nested under a list. */
  backLink?: { href: string; label: string };
  /** One short line between the eyebrow and the heading (a date, a category). */
  kicker?: ReactNode;
  children: ReactNode;
}) {
  const z = zoneById(zone);
  const maxWidth = width === "reading" ? "max-w-3xl" : "max-w-5xl";

  return (
    <>
      {/* Route -> depth: dive the persistent ocean to this zone's center. */}
      <ZoneSetter zone={zone} />

      <main
        data-shell="page"
        className={`relative z-10 mx-auto flex min-h-screen w-full ${maxWidth} flex-col px-4 pb-28 pt-28 sm:px-8 sm:pt-32`}
      >
        <div className="section-scrim px-6 py-12 sm:px-10 sm:py-14">
          {backLink ? (
            <Link
              href={backLink.href}
              className="hit mb-7 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bio-cyan transition-colors hover:text-bio-aqua"
            >
              <span aria-hidden="true">&lt;-</span> {backLink.label}
            </Link>
          ) : null}

          {/* Page header: coral eyebrow (depth + label) + display heading. */}
          <p className="mb-7 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-muted">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-reef-coral shadow-[0_0_8px_color-mix(in_srgb,var(--reef-coral)_55%,transparent)]"
            />
            <span className="text-reef-coral">{z.depthLabel}</span>
            <span aria-hidden="true" className="text-ink-faint">
              /
            </span>
            <span>{navLabel ?? z.label}</span>
          </p>

          {kicker ? (
            <p className="-mt-4 mb-2 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              {kicker}
            </p>
          ) : null}

          <h1 className="font-display text-4xl font-semibold leading-tight text-balance text-ink-heading sm:text-6xl">
            {heading}
          </h1>
          {intro ? (
            <p className="measure mt-4 text-base text-ink-muted sm:text-lg">
              {intro}
            </p>
          ) : null}

          {children}
        </div>
      </main>
    </>
  );
}
