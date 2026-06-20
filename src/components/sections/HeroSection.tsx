import Image from "next/image";
import { HERO, SITE } from "@/data/content";

/**
 * HeroSection - the SURFACE (0m) quick overview, optimized to let the cartoon
 * scene (sunset, sailboat, water-skier) breathe behind it. No heavy dark box:
 * dark type rides bare on the bright sky with the `.hero-halo` light glow that
 * globals.css provides for exactly this. Leads with Matthew's own line, then
 * at-a-glance proof, so the overview reads in two seconds.
 */

// Matthew's own line (from his About copy) - personal, and it sets up the
// "chapters" = the story you dive through below.
const STATEMENT = "I'm a builder. That's the one word that survives every chapter.";

// Tasteful, public proof points only (no private figures, per content-review.md).
const PROOF: readonly string[] = [
  "5 ventures, 3 acquired",
  "CAIO at BrachyClip",
  "Hedge fund equity research",
  "6 live builds",
];

export default function HeroSection() {
  const calendlyReady =
    SITE.calendlyUrl !== "CALENDLY_URL" && SITE.calendlyUrl.startsWith("http");

  return (
    <section
      id="surface"
      className="relative z-10 flex min-h-screen items-center justify-center px-5 py-20"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:gap-12">
        {/* Portrait - kept (Matthew likes it); softer frame so it sits in the
            scene instead of floating on a heavy black shadow. */}
        <div className="shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/45 shadow-[0_24px_60px_-18px_rgba(4,34,46,0.55)]">
          <Image
            src="/matthew.jpg"
            alt="Matthew Oshin"
            width={933}
            height={1400}
            priority
            className="h-72 w-auto sm:h-80 md:h-[26rem]"
          />
        </div>

        {/* Text - bare with a light halo so the sunset + boats show through. */}
        <div className="min-w-0 text-center md:text-left">
          <p className="hero-halo inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink-light-secondary">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-reef-coral"
            />
            {HERO.positioning}
          </p>

          <h1 className="hero-halo mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink-light-primary sm:text-6xl lg:text-7xl">
            {HERO.name}
          </h1>

          <p className="hero-halo mx-auto mt-4 max-w-md text-balance text-lg font-semibold leading-snug text-ink-light-primary sm:text-xl md:mx-0">
            {STATEMENT}
          </p>

          {/* Proof chips - light glass so they read on the bright sky. */}
          <ul className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {PROOF.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/55 bg-white/35 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-light-primary backdrop-blur-sm"
              >
                {item}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {calendlyReady ? (
              <a
                href={SITE.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-ink-light-primary px-6 py-3 text-sm font-semibold text-surface-foam shadow-lg transition-transform hover:scale-[1.02]"
              >
                Book a time
              </a>
            ) : null}
            <a
              href="#projects"
              className="rounded-full border border-ink-light-primary/40 bg-white/35 px-6 py-3 text-sm font-semibold text-ink-light-primary backdrop-blur-sm transition-colors hover:bg-white/55"
            >
              See the work
            </a>
          </div>

          <p className="hero-halo mt-9 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-light-secondary">
            {HERO.scrollHint}
            <span aria-hidden="true" className="ml-2">
              &darr;
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
