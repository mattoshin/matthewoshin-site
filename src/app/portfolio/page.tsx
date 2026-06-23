import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { BUILDS, VENTURES, PORTFOLIO } from "@/data/content";

/**
 * /portfolio - the products Matthew builds now, at the twilight depth (shares the
 * "projects" zone with /entrepreneurship). Demo-backed products (Mocean, Galactic
 * Signals, Sonar) lead as featured cards with a bright "View Demo" button; the
 * rest of the current builds follow, and any of those that also have a live demo
 * (ICR Intelligence) shows a "View Demo" button in place. Cards link to the full
 * case studies. The navLabel override keeps the eyebrow reading "Portfolio".
 */
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Products I build: Riptide, Galactic Signals, ICR Intelligence, SEC Intelligence, Sonar, Workplace AI, SecOps Command, Observly, BriefBridge, mTrain, and Camp Ricky.",
};

// The demo-backed products that lead the portfolio.
const mocean = VENTURES.find((v) => v.slug === "mocean");
const galactic = BUILDS.find((b) => b.slug === "galactic-signals");
const sonar = BUILDS.find((b) => b.slug === "sonar");

interface FeaturedCard {
  name: string;
  hook: string;
  status: string;
  caseHref: string;
  demoHref?: string;
}

const FEATURED: FeaturedCard[] = [
  mocean && {
    name: mocean.name,
    hook: mocean.oneLiner,
    status: "Founded & acquired",
    caseHref: "/ventures/mocean",
    demoHref: mocean.demoHref,
  },
  galactic && {
    name: galactic.name,
    hook: galactic.hook,
    status: galactic.status,
    caseHref: "/projects/galactic-signals",
    demoHref: galactic.demoHref,
  },
  sonar && {
    name: sonar.name,
    hook: sonar.hook,
    status: sonar.status,
    caseHref: "/projects/sonar",
    demoHref: sonar.demoHref,
  },
].filter(Boolean) as FeaturedCard[];

export default function PortfolioPage() {
  // The rest of the builds (galactic + sonar lead as featured cards above).
  const rest = BUILDS.filter((b) => b.slug !== "galactic-signals" && b.slug !== "sonar");

  return (
    <PageShell
      zone="projects"
      navLabel="Portfolio"
      heading={PORTFOLIO.heading}
      intro={PORTFOLIO.blurb}
    >
      {/* Featured: the two products you can try live, right now. */}
      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {FEATURED.map((f) => (
          <li key={f.name}>
            <div className="flex h-full flex-col rounded-2xl border border-bio-cyan/30 bg-bio-cyan/[0.06] p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold text-ink-heading">
                  {f.name}
                </h2>
                <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  {f.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-body sm:text-base">{f.hook}</p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                {f.demoHref ? (
                  <Link
                    href={f.demoHref}
                    className="btn-demo inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-wider"
                  >
                    View Demo <span aria-hidden="true">-&gt;</span>
                  </Link>
                ) : null}
                <Link
                  href={f.caseHref}
                  className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-bio-cyan opacity-80 transition-opacity hover:opacity-100"
                >
                  Case study <span aria-hidden="true">-&gt;</span>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* The rest of the current builds. */}
      <ul className="mt-5 grid gap-5 sm:grid-cols-2">
        {rest.map((build) =>
          build.demoHref ? (
            // Demo-backed build kept in place: bright "View Demo" button plus a
            // separate case-study link (so no nested anchors).
            <li key={build.slug}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-2xl font-semibold text-ink-heading">
                    {build.name}
                  </h2>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {build.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-ink-body sm:text-base">
                  {build.hook}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                  <Link
                    href={build.demoHref}
                    className="btn-demo inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-wider"
                  >
                    View Demo <span aria-hidden="true">-&gt;</span>
                  </Link>
                  <Link
                    href={`/projects/${build.slug}`}
                    className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-bio-cyan opacity-80 transition-opacity hover:opacity-100"
                  >
                    Case study <span aria-hidden="true">-&gt;</span>
                  </Link>
                </div>
              </div>
            </li>
          ) : (
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
                <span className="mt-auto inline-flex items-center gap-1 pt-5 font-mono text-xs uppercase tracking-wider text-bio-cyan opacity-80 transition-opacity group-hover:opacity-100">
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
          )
        )}
      </ul>
    </PageShell>
  );
}
