import type { ReactNode } from "react";
import Link from "next/link";
import { zoneById, type ZoneId } from "@/lib/depth";

/**
 * HomeSection - one surface-level preview block on the long-scroll home.
 *
 * The home is a single tall dive: the hero is the surface, then one of these per
 * depth zone. Each shows a teaser of that section and a "dive deeper" link to
 * the full page. An optional `beat` is a one-line story narration that frames
 * this depth as a chapter of Matthew's journey, so the descent reads as his
 * story. Rides the `.section-scrim` glass so light type clears WCAG AA over the
 * descending ocean. The matching zone (#id) is the DOM anchor.
 */
export default function HomeSection({
  zone,
  heading,
  beat,
  children,
  href,
  cta,
}: {
  zone: ZoneId;
  heading: string;
  beat?: string;
  children: ReactNode;
  href?: string;
  cta?: string;
}) {
  const z = zoneById(zone);

  return (
    <section
      id={zone}
      className="relative z-10 flex min-h-screen items-center px-4 py-24 sm:px-8"
    >
      <div className="section-scrim mx-auto w-full max-w-3xl px-6 py-12 sm:px-10 sm:py-14">
        <p className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-muted">
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

        <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading sm:text-5xl">
          {heading}
        </h2>

        {beat ? (
          <p className="mt-4 max-w-prose border-l-2 border-bio-cyan/50 pl-4 font-display text-lg italic leading-snug text-ink-heading/85 sm:text-xl">
            {beat}
          </p>
        ) : null}

        <div className="measure mt-5 text-base leading-relaxed text-ink-body sm:text-lg">
          {children}
        </div>

        {href && cta ? (
          <Link
            href={href}
            className="group mt-9 inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-bio-cyan transition-colors hover:text-bio-aqua"
          >
            {cta}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              -&gt;
            </span>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
