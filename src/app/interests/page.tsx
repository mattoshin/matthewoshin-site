import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { INTERESTS, INTERESTS_META } from "@/data/content";

/**
 * /interests - off the clock, at the seabed depth (zone id "skills").
 * Music, film and photography, markets, sneakers, networking, emerging tech.
 * Editorial columns with a thin rule above each entry, no cards (design
 * audit F-008, 2026-09-03): nothing here is clickable, so nothing is boxed.
 * Two columns from md (768px): at sm a column would be ~260px, too narrow
 * for a paragraph.
 */
export const metadata: Metadata = {
  title: "Interests",
  description:
    "Musician (sax, piano, beats, house, DJ sets), film and photography on Sony and DJI, markets, sneakers, networking, emerging tech.",
};

export default function InterestsPage() {
  return (
    <PageShell
      zone="skills"
      heading={INTERESTS_META.heading}
      intro={INTERESTS_META.blurb}
    >
      <ul role="list" aria-label="Interests" className="mt-12 grid gap-x-8 gap-y-9 md:grid-cols-2">
        {INTERESTS.map((interest) => (
          <li key={interest.title} className="border-t border-white/15 pt-5">
            <h2 className="font-serif text-lg font-semibold text-ink-heading sm:text-xl">
              {interest.title}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-ink-body">
              {interest.detail}
            </p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
