import Image from "next/image";
import { HERO } from "@/data/content";

/**
 * HeroSection - the SURFACE (0m), the first thing seen and the top of the dive.
 *
 * Bright open water, so dark text on light, BARE (no scrim) with the hero-halo
 * legibility treatment. Leads with Matthew's photo, then the positioning, name,
 * one strong hook, a concise bio, and a hint to scroll. Below this section the
 * page keeps descending (HomeSection blocks per depth zone), and HomeScrollDepth
 * dives the ocean as you go.
 */
export default function HeroSection() {
  return (
    <section
      id="surface"
      className="relative z-10 flex min-h-screen flex-col justify-center px-4 py-24 text-center sm:px-8"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto mb-9 h-36 w-36 overflow-hidden rounded-full ring-2 ring-white/75 shadow-[0_12px_44px_-14px_rgba(4,34,46,0.55)] sm:h-40 sm:w-40">
          <Image
            src="/matthew.jpg"
            alt="Matthew Oshin"
            width={320}
            height={320}
            priority
            className="h-full w-full object-cover object-top"
          />
        </div>

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

        <p className="hero-halo measure mx-auto mt-8 text-balance text-base font-medium leading-relaxed text-ink-light-primary sm:text-lg">
          {HERO.bio}
        </p>

        <p className="hero-halo mt-14 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-ink-light-primary">
          {HERO.scrollHint}
        </p>
      </div>
    </section>
  );
}
