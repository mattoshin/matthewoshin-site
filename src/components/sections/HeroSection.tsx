import Image from "next/image";
import { HERO } from "@/data/content";

/**
 * HeroSection - the SURFACE (0m). Full portrait on the left, compact text box
 * on the right. No dark scrim — the ocean shows fully around both elements.
 */
export default function HeroSection() {
  return (
    <section
      id="surface"
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">

        {/* Full portrait — no card, no border, just the photo */}
        <div className="shrink-0 overflow-hidden rounded-2xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)]">
          <Image
            src="/matthew.jpg"
            alt="Matthew Oshin"
            width={933}
            height={1400}
            priority
            className="h-80 w-auto sm:h-96 md:h-[28rem]"
          />
        </div>

        {/* Text — compact frosted box, no photo inside */}
        <div className="min-w-0 text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-reef-coral/30 bg-abyss-void/50 px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-reef-coral backdrop-blur-sm">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-reef-coral" />
            {HERO.positioning}
          </p>

          <h1 className="mt-5 font-display text-5xl font-semibold leading-none tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] sm:text-6xl lg:text-7xl">
            {HERO.name}
          </h1>

          <div className="mt-6 rounded-2xl border border-bio-cyan/15 bg-abyss-void/55 px-5 py-4 backdrop-blur-md">
            <p className="text-balance text-base font-medium leading-snug text-ink-body sm:text-lg">
              {HERO.hook}
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
              {HERO.bio}
            </p>
          </div>

          <p className="mt-7 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
            {HERO.scrollHint}
          </p>
        </div>

      </div>
    </section>
  );
}
