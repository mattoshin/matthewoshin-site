import type { ReactNode } from "react";
import { zoneById, type ZoneId } from "@/lib/depth";
import ZoneSetter from "./ZoneSetter";

/**
 * PageShell - the readable column every SUBPAGE renders its content into, over
 * the persistent ocean. Server component (SEO + a11y); only ZoneSetter is client.
 *
 * Each page sits at its own ocean depth. PageShell:
 *   - mounts <ZoneSetter zone> so the camera dives to this zone on navigation;
 *   - paints a short page header (coral eyebrow with the zone's poetic depth +
 *     label, then a big Fraunces heading);
 *   - rides the content on the existing `.section-scrim` glass panel so light
 *     type clears WCAG AA over whatever swims behind it, while the ocean still
 *     glows around the panel.
 *
 * Page content scrolls normally inside this column; scroll does NOT change the
 * ocean depth anymore (depth = route).
 */

export default function PageShell({
  zone,
  heading,
  intro,
  children,
}: {
  zone: ZoneId;
  heading: string;
  intro?: string;
  children: ReactNode;
}) {
  const z = zoneById(zone);

  return (
    <>
      {/* Route -> depth: dive the persistent ocean to this zone's center. */}
      <ZoneSetter zone={zone} />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-28 pt-28 sm:px-8 sm:pt-32">
        <div className="section-scrim px-6 py-12 sm:px-10 sm:py-14">
          {/* Page header: coral eyebrow (depth + label) + Fraunces heading. */}
          <p className="mb-7 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-muted">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-reef-coral shadow-[0_0_8px_color-mix(in_srgb,var(--reef-coral)_55%,transparent)]"
            />
            <span className="text-reef-coral">{z.depthLabel}</span>
            <span aria-hidden="true" className="text-ink-faint">
              /
            </span>
            <span>{z.label}</span>
          </p>

          <h1 className="font-display text-4xl font-semibold leading-tight text-ink-heading sm:text-6xl">
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
