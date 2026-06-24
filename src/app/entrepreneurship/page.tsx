import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page/PageShell";
import { ENTREPRENEURSHIP, VENTURES } from "@/data/content";

/**
 * Ventures with a clickable interactive demo at /app/<slug>-demo. Keyed by
 * venture slug so new demos (e.g. Galactic) plug in here without touching
 * content.ts.
 */
const VENTURE_DEMOS: Record<string, string> = {
  mocean: "/app/mocean-demo",
};

/**
 * /entrepreneurship - the ventures and companies, at the twilight depth (zone
 * "projects"). The full story of each is readable inline here, in roughly the
 * order they happened; the detail pages (/ventures/<slug>) add the extras
 * (numbers, demo, video, the engine, the community wall).
 */
export const metadata: Metadata = {
  title: "Entrepreneurship",
  description:
    "Mocean Technologies, Element Underground, Profit Paradise, Ocean Supply, and Resell Network.",
};

export default function EntrepreneurshipPage() {
  return (
    <PageShell
      zone="projects"
      heading={ENTREPRENEURSHIP.heading}
      intro="Five ventures, in roughly the order they happened. The thread: find an edge, package it, and get it to the people who need it. Sometimes that is software, sometimes a community, sometimes a room full of people who would not have found each other otherwise. The full story of each is below."
    >
      {/* The page is a long read now, so let visitors hop between ventures. */}
      <nav aria-label="Jump to a venture" className="mt-8 flex flex-wrap gap-2">
        {VENTURES.map((v) => (
          <a
            key={v.slug}
            href={`#${v.slug}`}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-muted transition-colors hover:border-bio-cyan/40 hover:text-bio-cyan"
          >
            {v.name}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        {VENTURES.map((venture) => (
          <section
            key={venture.slug}
            id={venture.slug}
            className="scroll-mt-24 border-t border-white/10 pt-10 first:border-t-0 first:pt-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl font-semibold text-ink-heading sm:text-3xl">
                {venture.name}
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-bio-cyan/80">
                {venture.era}
              </span>
            </div>
            <p className="mt-2 text-lg text-ink-body">{venture.oneLiner}</p>

            <div className="measure mt-5 space-y-4 text-base leading-relaxed text-ink-body sm:text-lg">
              {(venture.storyParagraphs ?? [venture.note]).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {VENTURE_DEMOS[venture.slug] && (
                <Link
                  href={VENTURE_DEMOS[venture.slug]}
                  className="inline-flex items-center gap-2 rounded-full border border-bio-cyan/40 bg-bio-cyan/10 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-bio-cyan transition-colors hover:bg-bio-cyan/20"
                >
                  Try the live demo <span aria-hidden="true">-&gt;</span>
                </Link>
              )}
              <Link
                href={`/ventures/${venture.slug}`}
                className="font-mono text-[11px] uppercase tracking-wider text-ink-muted transition-colors hover:text-bio-cyan"
              >
                Open the case study <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
