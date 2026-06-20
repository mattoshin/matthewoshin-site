import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { ENTREPRENEURSHIP, VENTURES } from "@/data/content";

/**
 * /entrepreneurship - the ventures and companies, at the twilight depth (zone
 * "projects"). The things Matthew founded or co-founded, roughly in order. The
 * current products he ships now live on their own /portfolio page.
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
      intro="Five ventures, in roughly the order they happened. The thread: find an edge, package it, and get it to the people who need it. Sometimes that is software, sometimes a community, sometimes a room full of people who would not have found each other otherwise."
    >
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
    </PageShell>
  );
}
