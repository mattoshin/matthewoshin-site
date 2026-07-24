import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { EXPERIENCE, SITE } from "@/data/content";

/**
 * /experience - the jobs, at the sunlit-shallows depth (zone id "about").
 * Most recent first: a clean timeline of role + org + period with bullets.
 * The one-page resume PDF anchors the top (Fingerprint case-study pattern):
 * institutional readers get the takeaway artifact before the scroll.
 */
export const metadata: Metadata = {
  title: "Experience",
  description:
    "AI strategy and marketing leadership, equity research, and product management, across a medical device company, a communications firm, and more.",
};

export default function ExperiencePage() {
  return (
    <PageShell
      zone="about"
      heading="Experience"
      intro="Where I have worked, building AI products and learning the markets."
    >
      {/* The takeaway artifact, before the scroll: the one-page resume. */}
      <div className="mt-8">
        <a
          href={SITE.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full bg-bio-cyan px-5 py-2.5 text-sm font-semibold text-abyss-void shadow-[0_0_22px_-4px_var(--bio-cyan)] transition-colors hover:bg-bio-aqua"
        >
          Resume (PDF)
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-y-0.5"
          >
            &darr;
          </span>
        </a>
      </div>

      <ol className="mt-10 space-y-4">
        {EXPERIENCE.map((job) => (
          <li
            key={`${job.org}-${job.role}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h2 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
                {job.role} <span className="text-bio-cyan">at {job.org}</span>
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                {job.period}
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {job.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm text-ink-body sm:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bio-cyan/70"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
