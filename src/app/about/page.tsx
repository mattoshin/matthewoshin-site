import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/page/PageShell";
import {
  ABOUT,
  EDUCATION,
  INTERESTS,
  SKILL_GROUPS,
} from "@/data/content";

/**
 * /about - the whole person in one read, at the "contact" depth: the floor,
 * the deepest zone (2026-07-10, Matthew: the personal digest should be the
 * bottom of the dive, not shared with /experience). Refero pattern (Partiful,
 * portfolio About pages): quick facts for skimmers up top, then the long-form
 * story, then compact previews of skills, education, and interests that each
 * link to their full page. This page is deliberately a digest: the deep
 * pages stay the immersive versions.
 *
 * PORTRAIT moved here 2026-07-20 from the home hero (Matthew: "get rid of the
 * photo... we can put picture on the about me section"). A photo belongs on
 * a personal bio, not announcing itself on arrival, so it rides small and
 * quiet beside the at-a-glance facts.
 */
export const metadata: Metadata = {
  title: "About",
  description:
    "Who Matthew Oshin is in one read: the builder story from sneaker resale to AI leadership, the toolkit, Michigan econ, and everything off the clock.",
};

// One neon accent per section, from the site's bioluminescent palette (same
// cycling idea as /skills, fixed per section here so the page reads calm).
const ACCENT = {
  story: "var(--bio-cyan)",
  skills: "var(--bio-violet)",
  education: "var(--bio-lumen)",
  interests: "var(--reef-coral-soft)",
} as const;

function SectionHeader({ accent, title }: { accent: string; title: string }) {
  return (
    <h2
      className="font-mono text-xs font-semibold uppercase tracking-widest"
      style={{ color: accent }}
    >
      {title}
    </h2>
  );
}

/** The mono arrow-link every section uses to open its full page. */
function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group mt-5 inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-bio-cyan transition-colors hover:text-bio-aqua"
    >
      {label}
      <span
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-0.5"
      >
        -&gt;
      </span>
    </Link>
  );
}

export default function AboutPage() {
  return (
    <PageShell
      zone="contact"
      navLabel="About"
      heading={ABOUT.heading}
      intro={ABOUT.blurb}
    >
      {/* Portrait + at-a-glance facts: the five-second version for skimmers. */}
      <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row">
        <div className="shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15">
          <Image
            src="/matthew.jpg"
            alt="Matthew Oshin"
            width={933}
            height={1400}
            className="h-40 w-auto sm:h-48"
          />
        </div>
        <ul className="flex flex-wrap gap-2.5">
          {ABOUT.facts.map((fact) => (
            <li
              key={fact}
              className="cursor-default rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[13px] font-medium tracking-tight text-ink-body backdrop-blur-sm"
            >
              {fact}
            </li>
          ))}
        </ul>
      </div>

      {/* The story: the arc in Matthew's voice. */}
      <section className="mt-12">
        <SectionHeader accent={ACCENT.story} title="The story" />
        <div className="measure mt-4 space-y-4">
          {ABOUT.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-ink-body">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Skills: a taste of the toolkit, grouped like /skills but trimmed.
          Chips ride slightly smaller than /skills on purpose: digest scale. */}
      <section className="mt-12">
        <SectionHeader accent={ACCENT.skills} title="The toolkit" />
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title} style={{ "--chip": ACCENT.skills } as CSSProperties}>
              <h3 className="text-sm font-semibold text-ink-heading">
                {group.title}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.items.slice(0, 4).map((item) => (
                  <li
                    key={item}
                    className="skill-chip cursor-default rounded-full px-3 py-1 text-[13px] font-medium tracking-tight"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <MoreLink href="/skills" label="The full toolkit" />
      </section>

      {/* Education: the schools, linking into the story pages. */}
      <section className="mt-12">
        <SectionHeader accent={ACCENT.education} title="Education" />
        <ul className="mt-4 space-y-3">
          {EDUCATION.map((school) => {
            const inner = (
              <>
                <span className="font-display text-base font-semibold text-ink-heading sm:text-lg">
                  {school.school}
                </span>
                <span className="mt-0.5 block text-sm text-ink-muted">
                  {school.detail}
                </span>
              </>
            );
            return (
              <li key={school.school}>
                {"slug" in school && school.slug ? (
                  <Link
                    href={`/education/${school.slug}`}
                    className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-bio-cyan/50 hover:bg-white/[0.06]"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <MoreLink href="/education" label="Where I studied" />
      </section>

      {/* Interests: the first few, off the clock. */}
      <section className="mt-12">
        <SectionHeader accent={ACCENT.interests} title="Off the clock" />
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {INTERESTS.slice(0, 4).map((interest) => (
            <li
              key={interest.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
            >
              <h3 className="font-display text-base font-semibold text-ink-heading">
                {interest.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-body">
                {interest.detail}
              </p>
            </li>
          ))}
        </ul>
        <MoreLink href="/interests" label="More off the clock" />
      </section>
    </PageShell>
  );
}
