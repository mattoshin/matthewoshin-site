import Link from "next/link";
import Section from "./Section";
import { BUILDS, ENTREPRENEURSHIP, VENTURES } from "@/data/content";

/**
 * ProjectsSection / Twilight = ENTREPRENEURSHIP (zone id stays "projects").
 *
 * Two parts:
 *   - Ventures and companies: the things I founded or co-founded, roughly in
 *     order, rendered as a list.
 *   - Building now: current products (Sigma, Galactic Signals) as glass cards
 *     linking to their case-study pages at /projects/[slug].
 */
export default function ProjectsSection() {
  return (
    <Section id="projects">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading sm:text-5xl">
        {ENTREPRENEURSHIP.heading}
      </h2>
      <p className="measure mt-4 text-base text-ink-muted sm:text-lg">
        {ENTREPRENEURSHIP.blurb}
      </p>

      {/* Ventures and companies */}
      <h3 className="mt-10 font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        {ENTREPRENEURSHIP.venturesLabel}
      </h3>
      <ol className="mt-4 space-y-4">
        {VENTURES.map((venture) => (
          <li
            key={venture.name}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
                {venture.name}
              </h4>
              <span className="font-mono text-[11px] uppercase tracking-wider text-bio-cyan/80">
                {venture.era}
              </span>
            </div>
            <p className="mt-2 text-base text-ink-body">{venture.oneLiner}</p>
            <p className="mt-1 text-sm text-ink-muted">{venture.note}</p>
          </li>
        ))}
      </ol>

      {/* Building now */}
      <h3 className="mt-12 font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        {ENTREPRENEURSHIP.buildsLabel}
      </h3>
      <ul className="mt-4 grid gap-5 sm:grid-cols-2">
        {BUILDS.map((build) => (
          <li key={build.slug}>
            <Link
              href={`/projects/${build.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-bio-cyan/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-display text-2xl font-semibold text-ink-heading transition-colors group-hover:text-bio-cyan">
                  {build.name}
                </h4>
                <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  {build.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-body sm:text-base">
                {build.hook}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-bio-cyan opacity-80 transition-opacity group-hover:opacity-100">
                Open case study
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  -&gt;
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
