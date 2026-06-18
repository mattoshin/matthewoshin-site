import Section from "./Section";
import { INTERESTS, INTERESTS_META } from "@/data/content";

/**
 * SkillsSection / Seabed = INTERESTS (zone id stays "skills").
 *
 * What I do off the clock, as chips. DJ rig, sneakers, markets, networking,
 * emerging tech.
 */
export default function SkillsSection() {
  return (
    <Section id="skills">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading sm:text-5xl">
        {INTERESTS_META.heading}
      </h2>
      <p className="measure mt-4 text-base text-ink-muted sm:text-lg">
        {INTERESTS_META.blurb}
      </p>

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
    </Section>
  );
}
