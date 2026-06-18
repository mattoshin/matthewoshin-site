import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { SKILLS, SKILL_GROUPS } from "@/data/content";

/**
 * /skills - grouped skill chips, at the midnight depth (zone id "ventures").
 * Four groups: AI engineering, full-stack, markets, and data and product.
 */
export const metadata: Metadata = {
  title: "Skills",
  description:
    "AI engineering, full-stack, markets, and data and product. The toolkit, grouped by where it lives.",
};

export default function SkillsPage() {
  return (
    <PageShell zone="ventures" heading={SKILLS.heading} intro={SKILLS.blurb}>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
              {group.title}
            </h2>
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
    </PageShell>
  );
}
