import Image from "next/image";
import { HERO } from "@/data/content";
import RotatingHeadline from "./RotatingHeadline";

/**
 * HeroSection - the SURFACE (0m). Decluttered per Matthew: no eyebrow line and no
 * big name (the wordmark up top carries the identity). Just the portrait, the
 * one-line hook as the headline, the short bio paragraph he likes, and the proof
 * chips. Light + bold type with a crisp dark shadow so it reads over the water.
 */

// Tasteful, public proof points only (no private figures, per content-review.md).
const PROOF: readonly string[] = [
  "2 acquisitions",
  "20+ products shipped",
  "Chief AI Officer, BrachyClip",
  "SaaS developer",
  "Hedge fund equity research",
  "Community builder",
  "Hospitality operator",
];

// Crisp dark legibility shadow for light type over the variable surface.
const SHADOW =
  "[text-shadow:0_2px_10px_rgba(2,6,11,0.9),0_1px_3px_rgba(2,6,11,0.95)]";

export default function HeroSection() {
  return (
    <section
      id="surface"
      className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20"
    >
      {/* Compressed, centered cluster (photo + text) over the full-bleed ocean. */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 md:flex-row md:gap-12">
        {/* Portrait - kept; soft frame so it sits in the scene. */}
        <div className="shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/45 shadow-[0_24px_60px_-18px_rgba(4,34,46,0.6)]">
          <Image
            src="/matthew.jpg"
            alt="Matthew Oshin"
            width={933}
            height={1400}
            priority
            className="h-72 w-auto sm:h-80 md:h-[28rem]"
          />
        </div>

        {/* Text - the hook is the headline now (name lives in the wordmark). */}
        <div className="min-w-0 max-w-xl text-center md:text-left">
          <RotatingHeadline
            className={`font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl ${SHADOW}`}
          />

          {/* Resume positioning line, a tight three-beat sub-headline. */}
          <p
            className={`mt-3 font-display text-lg font-semibold text-bio-cyan sm:text-xl ${SHADOW}`}
          >
            {HERO.tagline}
          </p>

          {/* The short bio paragraph (the one Matthew likes). */}
          <p
            className={`mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-body ${SHADOW} sm:text-lg md:mx-0`}
          >
            {HERO.bio}
          </p>

          {/* Proof chips - dark glass + light type so they read on the water. */}
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5 md:justify-start">
            {PROOF.map((item) => (
              <li
                key={item}
                className="proof-chip cursor-default rounded-full border border-bio-cyan/50 bg-abyss-void/80 px-4 py-2 text-[13px] font-medium uppercase tracking-wide text-ink-heading backdrop-blur-sm"
              >
                {item}
              </li>
            ))}
          </ul>

          <p
            className={`mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-ink-muted ${SHADOW}`}
          >
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
