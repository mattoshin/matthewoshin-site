import Image from "next/image";
import { HERO, SITE } from "@/data/content";

/**
 * HeroSection - THE DEEP surface (0m). Type-forward and proof-first: the visitor
 * gets who + why-credible in three seconds. The portrait stays (Matthew likes it)
 * but is seated in a refined cool-graded frame so it belongs in the dark water
 * instead of fighting it. Light type on dark; no bright-surface halo hacks.
 */

// Tasteful, public proof points (no private figures, per docs/content-review.md).
const PROOF: readonly string[] = [
  "Founded + sold Mocean",
  "CAIO at BrachyClip",
  "Equity research alum",
  "6 live builds",
];

export default function HeroSection() {
  const calendlyReady =
    SITE.calendlyUrl !== "CALENDLY_URL" && SITE.calendlyUrl.startsWith("http");

  return (
    <section
      id="surface"
      className="relative z-10 flex min-h-screen items-center px-6 py-24"
    >
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[auto_1fr] md:gap-14">
        {/* Portrait - premium framed, lightly cool-graded to seat it in the deep */}
        <div className="relative mx-auto shrink-0">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[1.6rem] bg-bio-cyan/10 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-bio-cyan/25 shadow-[0_36px_90px_-32px_rgba(0,0,0,0.9)]">
            <Image
              src="/matthew.jpg"
              alt="Matthew Oshin"
              width={933}
              height={1400}
              priority
              className="h-72 w-auto object-cover [filter:saturate(0.92)_contrast(1.04)_brightness(0.97)] sm:h-80 md:h-[26rem]"
            />
            {/* cool grade + bottom seat so the photo melts into the water */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss-void/60 via-transparent to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-bio-cyan/15 mix-blend-soft-light"
            />
          </div>
        </div>

        {/* Text */}
        <div className="min-w-0 text-center md:text-left">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em] text-bio-cyan/90">
            <span
              aria-hidden="true"
              className="glow-cyan h-1.5 w-1.5 rounded-full bg-bio-cyan"
            />
            {HERO.positioning}
          </p>

          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.03] tracking-tight text-ink-heading [text-shadow:0_2px_22px_rgba(2,6,11,0.6)] sm:text-6xl lg:text-7xl">
            {HERO.name}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-balance text-lg font-medium leading-snug text-ink-body [text-shadow:0_1px_12px_rgba(2,6,11,0.6)] sm:text-xl md:mx-0">
            {SITE.tagline}
          </p>

          {/* Proof chips - credibility in three seconds */}
          <ul className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {PROOF.map((item) => (
              <li
                key={item}
                className="rounded-full border border-bio-cyan/20 bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted backdrop-blur-sm"
              >
                {item}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {calendlyReady ? (
              <a
                href={SITE.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-bio-cyan px-6 py-3 text-sm font-semibold text-abyss-void transition-transform hover:scale-[1.02]"
              >
                Book a time
              </a>
            ) : null}
            <a
              href="#projects"
              className="rounded-full border border-bio-cyan/30 px-6 py-3 text-sm font-medium text-bio-cyan transition-colors hover:bg-bio-cyan/10"
            >
              See the work
            </a>
          </div>

          <p className="mt-10 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-ink-faint">
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
