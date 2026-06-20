import Link from "next/link";
import HomeScrollDepth from "@/components/home/HomeScrollDepth";
import HeroSection from "@/components/sections/HeroSection";
import HomeSection from "@/components/home/HomeSection";
import {
  BUILDS,
  CONTACT,
  EDUCATION,
  ENTREPRENEURSHIP,
  EXPERIENCE,
  INTERESTS,
  INTERESTS_META,
  SITE,
  SKILL_GROUPS,
  SKILLS,
  VENTURES,
} from "@/data/content";

/**
 * Home - one long dive from the surface to the seabed.
 *
 * Scroll-driven single page: HomeScrollDepth maps window.scrollY into the
 * store's targetProgress, so the ocean descends with you. Every section lives
 * right here. The `beat` on each HomeSection is a one-line story narration that
 * turns the descent into Matthew's journey (a narrative overlay, not a rewrite).
 * Nav links are anchors that jump to each zone.
 */

// The story thread, in Matthew's voice, read top to bottom as you dive. Kept in
// one place so the narration is easy to wordsmith without touching markup.
const BEATS = {
  about:
    "Every desk I've sat at taught the same lesson a different way: find the edge, then go build it.",
  projects:
    "And it started young. Before any of this I was flipping sneakers as Ocean Supply. Yes, that's where the ocean comes from.",
  ventures:
    "All those years of shipping, across markets and code, became a real toolkit.",
  writing: "With the foundation underneath all of it.",
  skills: "And a life outside the work, though most of it circles back to it.",
  contact: "That's the dive. If any of it resonates, let's build something.",
} as const;

export default function HomePage() {
  const calendlyUrl: string = SITE.calendlyUrl;
  const calendlyReady =
    calendlyUrl !== "CALENDLY_URL" && calendlyUrl.startsWith("http");

  return (
    <>
      <HomeScrollDepth />
      <main>
        <HeroSection />

        {/* ── Experience ─────────────────────────────────────── */}
        <HomeSection zone="about" heading="Experience" beat={BEATS.about}>
          <ol className="mt-6 space-y-4">
            {EXPERIENCE.map((job) => (
              <li
                key={`${job.org}-${job.role}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
                    {job.role},{" "}
                    <span className="text-bio-cyan">{job.org}</span>
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    {job.period}
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {job.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm text-ink-body sm:text-base"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bio-cyan/70"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/roles/${job.slug}`}
                  className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-bio-cyan/70 transition-colors hover:text-bio-cyan"
                >
                  View full role
                  <span aria-hidden="true" className="ml-0.5">-&gt;</span>
                </Link>
              </li>
            ))}
          </ol>
        </HomeSection>

        {/* ── Entrepreneurship ───────────────────────────────── */}
        <HomeSection
          zone="projects"
          heading={ENTREPRENEURSHIP.heading}
          beat={BEATS.projects}
        >
          <p className="text-ink-body">{ENTREPRENEURSHIP.blurb}</p>

          <h3 className="mt-10 font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
            {ENTREPRENEURSHIP.venturesLabel}
          </h3>
          <ol className="mt-4 space-y-4">
            {VENTURES.map((venture) => (
              <li
                key={venture.name}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
                    {venture.name}
                  </h4>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-bio-cyan/80">
                    {venture.era}
                  </span>
                </div>
                <p className="mt-2 text-base text-ink-body">{venture.oneLiner}</p>
                <p className="mt-1 text-sm text-ink-muted">{venture.note}</p>
                <Link
                  href={`/ventures/${venture.slug}`}
                  className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-bio-cyan/70 transition-colors hover:text-bio-cyan"
                >
                  Read the story
                  <span aria-hidden="true" className="ml-0.5">-&gt;</span>
                </Link>
              </li>
            ))}
          </ol>

          <h3 className="mt-12 font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
            {ENTREPRENEURSHIP.buildsLabel}
          </h3>
          <ul className="mt-4 grid gap-5 sm:grid-cols-2">
            {BUILDS.map((build) => (
              <li key={build.slug}>
                <Link
                  href={`/projects/${build.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-bio-cyan/40 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-display text-2xl font-semibold text-ink-heading transition-colors group-hover:text-bio-cyan">
                      {build.name}
                    </h4>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                      {build.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-ink-body sm:text-base">
                    {build.hook}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-bio-cyan opacity-80 transition-opacity group-hover:opacity-100">
                    Open case study
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      -&gt;
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </HomeSection>

        {/* ── Skills ─────────────────────────────────────────── */}
        <HomeSection zone="ventures" heading={SKILLS.heading} beat={BEATS.ventures}>
          <p className="text-ink-body">{SKILLS.blurb}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {SKILL_GROUPS.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
              >
                <h3 className="font-display text-base font-semibold text-ink-heading">
                  {group.title}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-bio-cyan/20 bg-white/[0.03] px-2.5 py-0.5 text-xs text-ink-body"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </HomeSection>

        {/* ── Education ──────────────────────────────────────── */}
        <HomeSection zone="writing" heading="Education" beat={BEATS.writing}>
          <ul className="mt-6 space-y-4">
            {EDUCATION.map((e) => (
              <li
                key={e.school}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <span className="font-display text-xl font-semibold text-ink-heading">
                  {e.school}
                </span>
                {e.detail ? (
                  <p className="mt-1 text-ink-muted">{e.detail}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </HomeSection>

        {/* ── Interests ──────────────────────────────────────── */}
        <HomeSection
          zone="skills"
          heading={INTERESTS_META.heading}
          beat={BEATS.skills}
        >
          <p className="text-ink-body">{INTERESTS_META.blurb}</p>
          <ul className="mt-6 space-y-2">
            {INTERESTS.map((interest) => (
              <li key={interest} className="flex items-start gap-3 text-ink-body">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bio-aqua/70"
                />
                {interest}
              </li>
            ))}
          </ul>
        </HomeSection>

        {/* ── Contact ────────────────────────────────────────── */}
        <HomeSection zone="contact" heading={CONTACT.heading} beat={BEATS.contact}>
          <p className="text-ink-body">{CONTACT.blurb}</p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {calendlyReady ? (
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-hot rounded-full bg-bio-hot px-7 py-3.5 text-base font-semibold text-abyss-void transition-transform hover:scale-[1.02]"
              >
                {CONTACT.primaryLabel}
              </a>
            ) : (
              <span
                className="glow-hot inline-flex flex-col items-center rounded-full bg-bio-hot/90 px-7 py-3 text-base font-semibold text-abyss-void"
                aria-disabled="true"
                title="Calendly link pending"
              >
                {CONTACT.primaryLabel}
                <span className="font-mono text-[10px] font-normal uppercase tracking-wider opacity-70">
                  Calendly link coming soon
                </span>
              </span>
            )}
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-bio-cyan/40 px-7 py-3.5 text-base font-medium text-bio-cyan transition-colors hover:bg-bio-cyan/10"
            >
              Connect on LinkedIn
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-7 py-3.5 text-base font-medium text-ink-body transition-colors hover:border-white/40 hover:text-ink-heading"
            >
              View resume
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-5 font-mono text-xs uppercase tracking-wider text-ink-muted">
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bio-cyan"
            >
              LinkedIn
            </a>
            <span aria-hidden="true" className="text-ink-faint">
              /
            </span>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bio-cyan"
            >
              GitHub
            </a>
            <span aria-hidden="true" className="text-ink-faint">
              /
            </span>
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-bio-cyan"
            >
              {SITE.email}
            </a>
          </div>
        </HomeSection>
      </main>
    </>
  );
}
