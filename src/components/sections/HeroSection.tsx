import Image from "next/image";
import { HERO } from "@/data/content";

/**
 * HeroSection - the SURFACE (0m) quick overview over the cartoon scene.
 *
 * Decluttered per Matthew: no CTAs and no social row here (socials live in the
 * top nav now). Just the portrait, name, a one-line hook, the short bio paragraph
 * he likes, and the proof chips. Light + bold type with a crisp dark shadow so it
 * reads over the dark water.
 */

const STATEMENT = "I'm a builder. That's the one word that survives every chapter.";

// Tasteful, public proof points only (no private figures, per content-review.md).
const PROOF: readonly string[] = [
  "5 ventures, 2 acquired",
  "CAIO at BrachyClip",
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
      className="relative z-10 flex min-h-screen items-center justify-center px-5 py-20"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:gap-12">
        {/* Portrait - kept; soft frame so it sits in the scene. */}
        <div className="shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/45 shadow-[0_24px_60px_-18px_rgba(4,34,46,0.6)]">
          <Image
            src="/matthew.jpg"
            alt="Matthew Oshin"
            width={933}
            height={1400}
            priority
            className="h-72 w-auto sm:h-80 md:h-[26rem]"
          />
        </div>

        {/* Text - LIGHT + bold + dark shadow so it pops on the dark water. */}
        <div className="min-w-0 text-center md:text-left">
          <p
            className={`inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-bio-cyan ${SHADOW}`}
          >
            <span
              aria-hidden="true"
              className="glow-cyan h-1.5 w-1.5 rounded-full bg-bio-cyan"
            />
            {HERO.positioning}
          </p>

          <h1
            className={`mt-4 font-display text-5xl font-bold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl ${SHADOW}`}
          >
            {HERO.name}
          </h1>

          <p
            className={`mx-auto mt-4 max-w-md text-balance text-lg font-semibold leading-snug text-ink-heading sm:text-xl md:mx-0 ${SHADOW}`}
          >
            {STATEMENT}
          </p>

          {/* The short bio paragraph (the one Matthew likes). */}
          <p
            className={`mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-body ${SHADOW} sm:text-base md:mx-0`}
          >
            {HERO.bio}
          </p>

          {/* Proof chips - dark glass + light type so they read on the water. */}
          <ul className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {PROOF.map((item) => (
              <li
                key={item}
                className="rounded-full border border-bio-cyan/40 bg-abyss-void/55 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-heading backdrop-blur-sm"
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
              &uarr;
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
