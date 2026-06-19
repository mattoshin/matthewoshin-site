import HomeScrollDepth from "@/components/home/HomeScrollDepth";
import HeroSection from "@/components/sections/HeroSection";
import HomeSection from "@/components/home/HomeSection";
import {
  EXPERIENCE,
  ENTREPRENEURSHIP,
  VENTURES,
  SKILLS,
  SKILL_GROUPS,
  EDUCATION,
  INTERESTS,
  INTERESTS_META,
  CONTACT,
  SITE,
} from "@/data/content";

/**
 * Home - one long dive from the surface to the seabed.
 *
 * The ocean is one persistent WebGL canvas in the root layout. On the home,
 * depth is SCROLL-DRIVEN: HomeScrollDepth maps the page scroll into the store's
 * targetProgress, so scrolling down DIVES the camera with you. The surface hero
 * is the top; below it, one preview block per depth zone gives a surface-level
 * teaser of that section and a "dive deeper" link to the full page. The interior
 * pages stay route-driven (each renders its own ZoneSetter via PageShell).
 *
 * Server component (SEO + a11y). Only HomeScrollDepth is client.
 */
export default function HomePage() {
  return (
    <>
      <HomeScrollDepth />
      <main>
        <HeroSection />

        <HomeSection
          zone="about"
          heading="Experience"
          href="/experience"
          cta="See all experience"
        >
          <p>
            From a hedge-fund research desk to leading an AI lab, the throughline
            holds: build the thing that captures the edge. A few of the most
            recent stops.
          </p>
          <ul className="mt-5 space-y-2">
            {EXPERIENCE.slice(0, 3).map((job) => (
              <li key={job.org} className="flex flex-wrap items-baseline gap-x-2">
                <span aria-hidden="true" className="text-bio-cyan">
                  ·
                </span>
                <span className="font-medium text-ink-heading">{job.role}</span>
                <span className="text-ink-muted">at {job.org}</span>
              </li>
            ))}
          </ul>
        </HomeSection>

        <HomeSection
          zone="projects"
          heading="Entrepreneurship"
          href="/entrepreneurship"
          cta="Explore the ventures and builds"
        >
          <p>{ENTREPRENEURSHIP.blurb}</p>
          <p className="mt-4 text-ink-muted">
            {VENTURES.map((v) => v.name).join(", ")}, and the products I am
            shipping now.
          </p>
        </HomeSection>

        <HomeSection
          zone="ventures"
          heading="Skills"
          href="/skills"
          cta="See the toolkit"
        >
          <p>{SKILLS.blurb}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {SKILL_GROUPS.map((group) => (
              <span
                key={group.title}
                className="rounded-full border border-bio-cyan/25 bg-white/[0.03] px-3 py-1 text-sm text-ink-body"
              >
                {group.title}
              </span>
            ))}
          </div>
        </HomeSection>

        <HomeSection
          zone="writing"
          heading="Education"
          href="/education"
          cta="More on education"
        >
          <ul className="space-y-1.5">
            {EDUCATION.map((e) => (
              <li key={e.school}>
                <span className="font-medium text-ink-heading">{e.school}</span>
                {e.detail ? (
                  <span className="text-ink-muted">, {e.detail}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </HomeSection>

        <HomeSection
          zone="skills"
          heading="Interests"
          href="/interests"
          cta="More"
        >
          <p>{INTERESTS_META.blurb}</p>
          <p className="mt-4 text-ink-muted">{INTERESTS.join("  ·  ")}</p>
        </HomeSection>

        <HomeSection
          zone="contact"
          heading={CONTACT.heading}
          href="/contact"
          cta="Go to contact"
        >
          <p>{CONTACT.blurb}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href={SITE.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-hot rounded-full bg-bio-hot px-6 py-3 text-base font-semibold text-abyss-void transition-transform hover:scale-[1.02]"
            >
              {CONTACT.primaryLabel}
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-bio-cyan/40 px-6 py-3 text-base font-medium text-bio-cyan transition-colors hover:bg-bio-cyan/10"
            >
              Connect on LinkedIn
            </a>
          </div>
        </HomeSection>
      </main>
    </>
  );
}
