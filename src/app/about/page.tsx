import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import PageShell from "@/components/page/PageShell";
import {
  ABOUT,
  SKILLS,
  SKILL_GROUPS,
  EDUCATION,
  EDUCATION_META,
  INTERESTS,
  INTERESTS_META,
} from "@/data/content";

/**
 * /about - who Matthew is, in one scroll, at the abyss depth (zone "writing").
 * Consolidates what used to be four nav stops (the story, /skills, /education,
 * /interests) into one page with anchored sections, so "who is he" is a single
 * read instead of a navigation decision. A jump row under the intro deep-links
 * each section (#story, #skills, #education, #interests); the old routes 308 to
 * those anchors via next.config.ts.
 */
export const metadata: Metadata = {
  title: "About",
  description:
    "Matthew Oshin's story, skills, education, and interests. Builder, Chief AI Officer at BrachyClip, University of Michigan economics, musician, and markets nerd.",
};

// One neon accent per skill group, cycled by index (same pattern the old
// /skills page used). Adjacent groups always differ in hue.
const ACCENTS = [
  "var(--bio-cyan)",
  "var(--bio-violet)",
  "var(--bio-lumen)",
  "var(--reef-coral-soft)",
  "var(--bio-aqua)",
  "var(--bio-hot)",
] as const;

const JUMPS = [
  { href: "#story", label: "Story" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#interests", label: "Interests" },
] as const;

/** Section eyebrow, matching the coral mono style used across the site. */
function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 font-mono text-xs uppercase tracking-widest text-bio-cyan/80"
    >
      {children}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <PageShell
      zone="writing"
      navLabel="About"
      heading={ABOUT.heading}
      intro={ABOUT.blurb}
    >
      {/* Jump row: the four sections, one tap away. */}
      <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2.5">
        {JUMPS.map((j) => (
          <a
            key={j.href}
            href={j.href}
            className="rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink-muted transition-colors hover:border-bio-cyan/40 hover:text-bio-cyan"
          >
            {j.label}
          </a>
        ))}
      </nav>

      {/* THE STORY */}
      <section className="mt-12">
        <SectionHeading id="story">The story</SectionHeading>
        <div className="measure mt-4 space-y-4 text-base leading-relaxed text-ink-body sm:text-lg">
          {ABOUT.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="mt-14 border-t border-white/10 pt-10">
        <SectionHeading id="skills">{SKILLS.heading}</SectionHeading>
        <p className="measure mt-3 text-base text-ink-muted">{SKILLS.blurb}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {SKILL_GROUPS.map((group, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div key={group.title} style={{ "--chip": accent } as CSSProperties}>
                <h3
                  className="font-mono text-xs font-semibold uppercase tracking-widest"
                  style={{ color: accent }}
                >
                  {group.title}
                </h3>
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
      </section>

      {/* EDUCATION */}
      <section className="mt-14 border-t border-white/10 pt-10">
        <SectionHeading id="education">{EDUCATION_META.heading}</SectionHeading>
        <ul className="mt-6 space-y-4">
          {EDUCATION.map((e) => {
            const body = (
              <>
                <h3 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
                  {e.school}
                </h3>
                {e.detail ? (
                  <p className="mt-1 text-base text-ink-body">{e.detail}</p>
                ) : null}
                {e.slug ? (
                  <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-bio-cyan">
                    Read more <span aria-hidden="true">-&gt;</span>
                  </span>
                ) : null}
              </>
            );
            return (
              <li key={e.school}>
                {e.slug ? (
                  <Link
                    href={`/education/${e.slug}`}
                    className="block rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-bio-cyan/40"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* INTERESTS */}
      <section className="mt-14 border-t border-white/10 pt-10">
        <SectionHeading id="interests">{INTERESTS_META.heading}</SectionHeading>
        <p className="measure mt-3 text-base text-ink-muted">
          {INTERESTS_META.blurb}
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {INTERESTS.map((interest) => (
            <li
              key={interest.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <h3 className="font-display text-lg font-semibold text-ink-heading sm:text-xl">
                {interest.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-ink-body">
                {interest.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
