import Section from "./Section";
import { SKILLS, SKILL_GROUPS } from "@/data/content";

/**
 * VenturesSection / Midnight = SKILLS (zone id stays "ventures").
 *
 * Grouped chips, no star ratings. Four groups: AI engineering, full-stack,
 * markets, and data and product.
 */
export default function VenturesSection() {
  return (
    <Section id="ventures">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading sm:text-5xl">
        {SKILLS.heading}
      </h2>
      <p className="measure mt-4 text-base text-ink-muted sm:text-lg">
        {SKILLS.blurb}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
              {group.title}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-ink-body"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
