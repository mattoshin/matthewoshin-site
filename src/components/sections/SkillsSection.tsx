import Section from "./Section";
import { EDUCATION, HOBBIES, SKILL_GROUPS } from "@/data/content";

/**
 * SkillsSection / Seabed. Education + hobbies + skills as grouped chips. No star
 * ratings.
 */
export default function SkillsSection() {
  return (
    <Section id="skills">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading sm:text-5xl">
        On the seabed.
      </h2>
      <p className="measure mt-4 text-base text-ink-muted sm:text-lg">
        What I work with, where I learned, and what I do when I am not building.
      </p>

      {/* Skills */}
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

      {/* Education + hobbies */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
            Education
          </h3>
          <ul className="mt-3 space-y-2">
            {EDUCATION.map((e) => (
              <li key={e.school} className="text-ink-body">
                <span className="font-medium text-ink-heading">{e.school}</span>{" "}
                <span className="text-ink-muted">{e.detail}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
            Off the clock
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {HOBBIES.map((h) => (
              <li
                key={h}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-ink-body"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
