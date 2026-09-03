import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { EXPERIENCE, SITE } from "@/data/content";

/**
 * /experience - the jobs, at the sunlit-shallows depth (zone id "about").
 * Most recent first, as a timeline: a vertical rule with a dot per role, the
 * period above the role. No cards (design audit F-008, 2026-09-03): a glass
 * card on this site means "open this", and a role is not a link.
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

      {/* Timeline. One --gutter variable sets the list padding, the dot's
          offset (gutter + half the dot) and the rule's position, so the three
          cannot drift apart. Each role draws its own segment of the rule from
          its dot down to the next role's dot (bottom-[-9px] reaches the next
          dot's centre), and the last role draws none, so the rule ends at the
          final dot instead of running on beside its bullets. top 5px centres
          the 8px dot on the period's 18px line. role="list" keeps WebKit
          announcing these as lists once the markers are styled away. */}
      <ol
        role="list"
        aria-label="Roles"
        className="relative mt-12 pl-(--gutter) [--gutter:1.5rem] sm:[--gutter:2rem]"
      >
        {EXPERIENCE.map((job) => (
          <li
            key={`${job.org}-${job.role}`}
            className="relative pb-10 last:pb-0 before:absolute before:top-[9px] before:bottom-[-9px] before:-left-[calc(var(--gutter)+0.5px)] before:w-px before:bg-white/15 before:content-[''] last:before:hidden"
          >
            <span
              aria-hidden="true"
              data-timeline-dot=""
              className="absolute top-[5px] -left-[calc(var(--gutter)+4.5px)] h-2 w-2 rounded-full bg-bio-cyan shadow-[0_0_8px_var(--bio-cyan)]"
            />
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              {job.period}
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold break-words text-ink-heading sm:text-2xl">
              {job.role} <span className="text-bio-cyan">at {job.org}</span>
            </h2>
            <ul role="list" className="mt-3 space-y-2">
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
