import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { BUILDS, PORTFOLIO } from "@/data/content";

/**
 * /portfolio - the products Matthew builds now, at the twilight depth (shares the
 * "projects" zone with /entrepreneurship). Cards link to the full case studies at
 * /projects/[slug]. The navLabel override keeps the eyebrow reading "Portfolio".
 */
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Products I build now: Sigma, Galactic Signals, Observly, BriefBridge, mTrain, and Camp Ricky.",
};

export default function PortfolioPage() {
  return (
    <PageShell
      zone="projects"
      navLabel="Portfolio"
      heading={PORTFOLIO.heading}
      intro={PORTFOLIO.blurb}
    >
      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {BUILDS.map((build) => (
          <li key={build.slug}>
            <Link
              href={`/projects/${build.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-bio-cyan/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold text-ink-heading transition-colors group-hover:text-bio-cyan">
                  {build.name}
                </h2>
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
