import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page/PageShell";
import { EDUCATION, EDUCATION_META } from "@/data/content";

/**
 * /education - schools, at the abyss depth (zone id "writing").
 * University of Michigan B.A. Economics, Weston High School.
 * Hairline rows, no cards (design audit F-008, 2026-09-03): the entries with
 * their own page are links, marked by the arrow and the hover colour, the
 * rest are plain rows. The whole row is the link and is well over 44px tall,
 * so it needs no `hit` area.
 */
export const metadata: Metadata = {
  title: "Education",
  description: "University of Michigan, B.A. Economics. Weston High School.",
};

// Stacked on phones (a long school name beside the arrow would wrap into a
// narrow column); one baseline row from sm.
const ROW = "flex flex-col items-start gap-y-3 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-6";

export default function EducationPage() {
  return (
    <PageShell zone="writing" heading={EDUCATION_META.heading}>
      <ul role="list" aria-label="Schools" className="mt-10 divide-y divide-white/15 border-y border-white/15">
        {EDUCATION.map((e) => {
          const body = (
            <div className="min-w-0">
              <h2
                className={`font-display text-xl font-semibold text-ink-heading sm:text-2xl ${
                  e.slug ? "transition-colors group-hover:text-bio-cyan" : ""
                }`}
              >
                {e.school}
              </h2>
              {e.detail ? (
                <p className="mt-1 text-base text-ink-body">{e.detail}</p>
              ) : null}
            </div>
          );
          return (
            <li key={e.school}>
              {e.slug ? (
                <Link href={`/education/${e.slug}`} className={`group ${ROW}`}>
                  {body}
                  <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-bio-cyan transition-colors group-hover:text-bio-aqua">
                    Read more
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                      -&gt;
                    </span>
                  </span>
                </Link>
              ) : (
                <div className={ROW}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
