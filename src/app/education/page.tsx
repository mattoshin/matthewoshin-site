import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { EDUCATION, EDUCATION_META } from "@/data/content";

/**
 * /education - schools, at the abyss depth (zone id "writing").
 * University of Michigan B.A. Economics, Weston High School.
 */
export const metadata: Metadata = {
  title: "Education",
  description: "University of Michigan, B.A. Economics. Weston High School.",
};

export default function EducationPage() {
  return (
    <PageShell zone="writing" heading={EDUCATION_META.heading}>
      <ul className="mt-10 space-y-4">
        {EDUCATION.map((e) => (
          <li
            key={e.school}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
          >
            <h2 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
              {e.school}
            </h2>
            {e.detail ? (
              <p className="mt-1 text-base text-ink-body">{e.detail}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
