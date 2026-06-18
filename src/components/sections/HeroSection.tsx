import Section from "./Section";
import BucketEntries from "./BucketEntries";
import { ABOUT, HERO } from "@/data/content";

/**
 * HeroSection / Surface (0m) = the front-page launchpad.
 *
 * Over the bright sunlit surface, so dark text on light per the contrast rules.
 * Layout, top to bottom:
 *   - the name, prominent
 *   - a short punchy positioning line
 *   - a one-sentence hook drawn from the About
 *   - the bucket entry buttons (echoing the top BucketNav as large entry points)
 *   - a short About area in his voice
 *   - the scroll-to-descend hint
 */
export default function HeroSection() {
  return (
    <Section id="surface" tone="light" className="text-center" minScreen={false}>
      <div className="flex min-h-screen flex-col justify-center py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-light-secondary">
          {HERO.positioning}
        </p>

        <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.98] tracking-tight text-ink-light-primary sm:text-8xl md:text-9xl">
          {HERO.name}
        </h1>

        <p className="measure mx-auto mt-8 text-balance text-lg text-ink-light-secondary sm:text-2xl">
          {HERO.hook}
        </p>

        {/* Large entry points, echoing the sticky top bucket nav. */}
        <BucketEntries />

        {/* A short About area in his voice, on the front page. */}
        <div className="measure mx-auto mt-16 space-y-4 text-left text-base text-ink-light-secondary sm:text-lg">
          {ABOUT.paragraphs.slice(0, 3).map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-light-secondary">
            {HERO.scrollHint}
          </span>
          <span
            aria-hidden="true"
            className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-ink-light-secondary/60 p-1.5"
          >
            <span className="block h-2 w-1 rounded-full bg-ink-light-secondary motion-safe:animate-bounce" />
          </span>
        </div>
      </div>
    </Section>
  );
}
