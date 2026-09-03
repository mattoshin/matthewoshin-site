import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page/PageShell";
import ReadMore from "@/components/page/ReadMore";
import { EDUCATION, EDUCATION_META, hasEducationPage } from "@/data/content";

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
          const page = hasEducationPage(e) ? e : null;
          const body = (
            <div className="min-w-0">
              <h2
                className={`font-serif text-xl font-semibold text-ink-heading sm:text-2xl ${
                  page ? "transition-colors group-hover:text-bio-cyan" : ""
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
              {page ? (
                <Link href={`/education/${page.slug}`} className={`group ${ROW}`}>
                  {body}
                  <ReadMore />
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
