import Section from "./Section";
import BucketEntries from "./BucketEntries";
import { HERO } from "@/data/content";

/**
 * HeroSection / Surface (0m) = the front-page launchpad.
 *
 * Over the bright sunlit surface, so dark text on light per the contrast rules.
 * Runs `bare` (no scrim panel) so the surface zone reads as open, airy water.
 * Hierarchy, top to bottom:
 *   1. eyebrow positioning line (with the warm coral marker for identity)
 *   2. the name, the loud anchor
 *   3. ONE strong hook line (the "builder is the throughline" sentence, kept
 *      here only, never repeated below)
 *   4. the bucket entry buttons (the real navigation, the front-page CTA)
 *   5. a single concise bio, distinct from the hook
 *   6. the scroll-to-descend hint
 */
export default function HeroSection() {
  return (
    <Section id="surface" tone="light" className="text-center" minScreen={false} bare>
      <div className="flex min-h-screen flex-col justify-center py-20">
        <p className="flex items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-light-secondary sm:text-xs">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full bg-reef-coral ring-1 ring-ink-light-primary/20"
          />
          {HERO.positioning}
        </p>

        <h1 className="mt-7 font-display text-6xl font-semibold leading-[0.95] tracking-tight text-ink-light-primary sm:text-8xl md:text-9xl">
          {HERO.name}
        </h1>

        <p className="measure mx-auto mt-7 text-balance text-xl font-medium leading-snug text-ink-light-primary sm:text-3xl">
          {HERO.hook}
        </p>

        {/* The real front-page navigation: large entry points into the dive. */}
        <BucketEntries />

        {/* A single concise bio, in his voice. No repeat of the hook. */}
        <p className="measure mx-auto mt-14 text-balance text-base leading-relaxed text-ink-light-secondary sm:text-lg">
          {HERO.bio}
        </p>

        <div className="mt-16 flex flex-col items-center gap-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-light-secondary">
            {HERO.scrollHint}
          </span>
          <span
            aria-hidden="true"
            className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-ink-light-secondary/55 p-1.5"
          >
            <span className="block h-2 w-1 rounded-full bg-ink-light-secondary motion-safe:animate-bounce" />
          </span>
        </div>
      </div>
    </Section>
  );
}
