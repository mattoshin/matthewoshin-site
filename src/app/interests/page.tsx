import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { INTERESTS, INTERESTS_META } from "@/data/content";

/**
 * /interests - off the clock, at the seabed depth (zone id "skills").
 * DJ rig, sneakers, markets, networking, emerging tech.
 */
export const metadata: Metadata = {
  title: "Interests",
  description: "DJ with a real rig, sneakers, markets, networking, emerging tech.",
};

export default function InterestsPage() {
  return (
    <PageShell
      zone="skills"
      heading={INTERESTS_META.heading}
      intro={INTERESTS_META.blurb}
    >
      <ul className="mt-10 flex flex-wrap gap-2.5">
        {INTERESTS.map((interest) => (
          <li
            key={interest}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-ink-body sm:text-base"
          >
            {interest}
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
