import Image from "next/image";
import { HERO } from "@/data/content";

/**
 * HeroSection - the SURFACE (0m), the first thing seen and the top of the dive.
 *
 * Readability first: the content rides on the strong dark glass panel (so light
 * Georgia type is crisp over the bright, moving surface, no white-glow guesswork)
 * while the sunlit ocean still shows around the panel. The full headshot sits
 * beside the copy (framed, uncropped). Below this section the page keeps
 * descending; HomeScrollDepth dives the ocean as you scroll.
 */
export default function HeroSection() {
  return (
    <section
      id="surface"
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-28 sm:px-8"
    >
      <div className="section-scrim mx-auto flex w-full max-w-4xl flex-col items-center gap-9 px-6 py-12 text-center sm:px-12 sm:py-14 md:flex-row md:gap-12 md:text-left">
        {/* Full headshot, framed, no crop. */}
        <div className="shrink-0 overflow-hidden rounded-2xl ring-1 ring-bio-cyan/25 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
          <Image
            src="/matthew.jpg"
            alt="Matthew Oshin"
            width={933}
            height={1400}
            priority
            className="h-72 w-auto sm:h-80 md:h-96"
          />
        </div>

        <div className="min-w-0">
          <p className="flex items-center justify-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-reef-coral md:justify-start">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full bg-reef-coral"
            />
            {HERO.positioning}
          </p>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.0] tracking-tight text-ink-heading sm:text-7xl">
            {HERO.name}
          </h1>

          <p className="measure mt-6 text-balance text-lg font-medium leading-snug text-ink-body sm:text-2xl">
            {HERO.hook}
          </p>

          <p className="measure mt-6 text-base leading-relaxed text-ink-muted sm:text-lg">
            {HERO.bio}
          </p>

          <p className="mt-9 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-ink-faint">
            {HERO.scrollHint}
          </p>
        </div>
      </div>
    </section>
  );
}
