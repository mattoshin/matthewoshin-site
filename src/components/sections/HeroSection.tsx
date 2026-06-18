import BucketEntries from "./BucketEntries";
import { HERO } from "@/data/content";

/**
 * HeroSection - the home launchpad, at the SURFACE (0m).
 *
 * The home is the bright open surface; the dive happens on navigation (clicking
 * a bucket card dives the camera to that page's depth). Over the sunlit surface,
 * so dark text on light per the contrast rules, and BARE (no scrim panel) so the
 * surface reads as open, airy water with the hero-halo legibility treatment.
 *
 * Hierarchy, top to bottom:
 *   1. eyebrow positioning line (with the warm coral marker for identity)
 *   2. the name, the loud anchor
 *   3. ONE strong hook line (the "builder is the throughline" sentence)
 *   4. the six bucket cards (the real navigation, each linking to its page)
 *   5. a single concise bio, distinct from the hook
 *   6. a subtle hint to explore
 */
export default function HeroSection() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col justify-center px-4 py-24 text-center sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <p className="hero-halo flex items-center justify-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-ink-light-primary sm:text-xs">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full bg-reef-coral ring-1 ring-ink-light-primary/20"
          />
          {HERO.positioning}
        </p>

        <h1 className="hero-halo-soft mt-7 font-display text-6xl font-semibold leading-[0.95] tracking-tight text-ink-light-primary sm:text-8xl md:text-9xl">
          {HERO.name}
        </h1>

        <p className="hero-halo measure mx-auto mt-7 text-balance text-xl font-semibold leading-snug text-ink-light-primary sm:text-3xl">
          {HERO.hook}
        </p>

        {/* The real navigation: the six bucket cards, each diving to its page. */}
        <BucketEntries />

        {/* A single concise bio, in his voice. No repeat of the hook. */}
        <p className="hero-halo measure mx-auto mt-14 text-balance text-base font-medium leading-relaxed text-ink-light-primary sm:text-lg">
          {HERO.bio}
        </p>

        <p className="hero-halo mt-12 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-ink-light-primary">
          {HERO.scrollHint}
        </p>
      </div>
    </main>
  );
}
