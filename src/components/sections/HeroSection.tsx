import Image from "next/image";
import { HERO } from "@/data/content";

/**
 * HeroSection - the SURFACE (0m). Shows the full ocean scene; text rides a
 * compact frosted pill so the sky, boats, and water show all around it.
 * Photo sits as a bare circular headshot above the name — no card, no border.
 */
export default function HeroSection() {
  return (
    <section
      id="surface"
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20"
    >
      <div className="mx-auto w-full max-w-xl text-center">
        {/* Circular headshot — no box, no border, just the face */}
        <div className="mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <Image
            src="/matthew.jpg"
            alt="Matthew Oshin"
            width={933}
            height={1400}
            priority
            className="h-full w-full object-cover object-top"
          />
        </div>

        {/* Positioning tag */}
        <p className="inline-flex items-center gap-2 rounded-full border border-reef-coral/30 bg-abyss-void/50 px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-reef-coral backdrop-blur-sm">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-reef-coral" />
          {HERO.positioning}
        </p>

        {/* Name — large, legible over the ocean via drop shadow */}
        <h1 className="mt-6 font-display text-6xl font-semibold leading-none tracking-tight text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.85)] sm:text-8xl">
          {HERO.name}
        </h1>

        {/* Hook + bio in a compact frosted box */}
        <div className="mt-7 rounded-2xl border border-bio-cyan/15 bg-abyss-void/55 px-6 py-5 backdrop-blur-md">
          <p className="text-balance text-lg font-medium leading-snug text-ink-body sm:text-xl">
            {HERO.hook}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
            {HERO.bio}
          </p>
        </div>

        {/* Scroll hint */}
        <p className="mt-8 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
          {HERO.scrollHint}
        </p>
      </div>
    </section>
  );
}
