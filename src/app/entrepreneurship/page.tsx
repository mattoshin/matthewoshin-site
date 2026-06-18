import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { BUILDS, ENTREPRENEURSHIP, VENTURES } from "@/data/content";

/**
 * /entrepreneurship - ventures + current builds, at the twilight depth (zone id
 * "projects"). Two parts: the things I founded or co-founded, roughly in order,
 * then the products I'm building now (Sigma, Galactic Signals) as cards linking
 * to their case-study pages at /projects/[slug].
 */
export const metadata: Metadata = {
  title: "Entrepreneurship",
  description:
    "Mocean Technologies, Element Underground, Profit Paradise, Ocean Supply, Resell Network, plus current builds Sigma and Galactic Signals.",
};

export default function EntrepreneurshipPage() {
  return (
    <PageShell
      zone="projects"
      heading={ENTREPRENEURSHIP.heading}
      intro={ENTREPRENEURSHIP.blurb}
    >
      {/* Ventures and companies */}
      <h2 className="mt-10 font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        {ENTREPRENEURSHIP.venturesLabel}
      </h2>
      <ol className="mt-4 space-y-4">
        {VENTURES.map((venture) => (
          <li
            key={venture.name}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
                {venture.name}
              </h3>
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
      <h2 className="mt-12 font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        {ENTREPRENEURSHIP.buildsLabel}
      </h2>
      <ul className="mt-4 grid gap-5 sm:grid-cols-2">
        {BUILDS.map((build) => (
          <li key={build.slug}>
            <Link
              href={`/projects/${build.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-bio-cyan/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-semibold text-ink-heading transition-colors group-hover:text-bio-cyan">
                  {build.name}
                </h3>
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
    </PageShell>
  );
}
