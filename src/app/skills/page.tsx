import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PageShell from "@/components/page/PageShell";
import { SKILLS, SKILL_GROUPS } from "@/data/content";

/**
 * /skills - grouped skill chips, at the midnight depth (zone id "ventures").
 * Each group gets its own bioluminescent accent so the tag wall reads playful
 * instead of monotone (the Bun / JetBrains / Vapi "one accent per badge"
 * pattern); the chips glow through that color on hover (see .skill-chip).
 */
export const metadata: Metadata = {
  title: "Skills",
  description:
    "AI engineering, languages and frameworks, full-stack, markets, and data and product. The toolkit, grouped by where it lives.",
};

// One neon accent per group, cycled by index. Adjacent groups always differ in
// hue so the wall feels varied. Pulled from the site's bioluminescent palette.
const ACCENTS = [
  "var(--bio-cyan)",
  "var(--bio-violet)",
  "var(--bio-lumen)",
  "var(--reef-coral-soft)",
  "var(--bio-aqua)",
  "var(--bio-hot)",
] as const;

export default function SkillsPage() {
  return (
    <PageShell zone="ventures" heading={SKILLS.heading} intro={SKILLS.blurb}>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {SKILL_GROUPS.map((group, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <div
              key={group.title}
              style={{ "--chip": accent } as CSSProperties}
            >
              <h2
                className="font-mono text-xs font-semibold uppercase tracking-widest"
                style={{ color: accent }}
              >
                {group.title}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="skill-chip cursor-default rounded-full px-3.5 py-1.5 text-sm font-medium tracking-tight"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
