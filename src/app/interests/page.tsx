import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { INTERESTS, INTERESTS_META } from "@/data/content";

/**
 * /interests - off the clock, at the seabed depth (zone id "skills").
 * Music, film and photography, markets, sneakers, networking, emerging tech.
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
      <ul className="mt-10 space-y-4">
        {INTERESTS.map((interest) => (
          <li
            key={interest.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
          >
            <h2 className="font-display text-lg font-semibold text-ink-heading sm:text-xl">
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
