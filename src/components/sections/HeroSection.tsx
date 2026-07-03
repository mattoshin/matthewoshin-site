import Image from "next/image";
import Link from "next/link";
import { HERO, HERO_PROOF } from "@/data/content";

/**
 * HeroSection - the SURFACE (0m). Decluttered per Matthew: no eyebrow line and no
 * big name (the wordmark up top carries the identity). Light + bold type with a
 * crisp dark shadow so it reads over the water.
 *
 * CURATED 2026-07-03 (Gabe's feedback): seven static chips became FOUR clickable
 * proof stats (HERO_PROOF in content.ts), each routing to its evidence, with an
 * arrow affordance so they read as doors, not decoration.
 *
 * CUT DOWN 2026-07-03 round two (Matthew: "too much going on... especially the
 * motion"): the rotating six-identity headline is GONE, replaced by the static
 * throughline "I'm a builder." The four-sentence bio paragraph left the hero
 * too (its facts live on /experience, About, and the chips). First view is now:
 * headline, tagline, four proof chips, scroll hint. Do not re-add motion or
 * copy here without asking him.
 */

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

        {/* Text - one static line, one beat, proof. Calm over the water. */}
        <div className="min-w-0 max-w-xl text-center md:text-left">
          <h1
            className={`font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl ${SHADOW}`}
          >
            I&rsquo;m a <span className="text-bio-cyan">builder</span>.
          </h1>

          {/* Resume positioning line, a tight three-beat sub-headline. */}
          <p
            className={`mt-3 font-display text-lg font-semibold text-bio-cyan sm:text-xl ${SHADOW}`}
          >
            {HERO.tagline}
          </p>

          {/* Proof stats - dark glass chips, each a LINK to its evidence. The
              arrow slides in on hover so they read as doors, not decoration. */}
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5 md:justify-start">
            {HERO_PROOF.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="proof-chip group inline-flex items-center gap-1.5 rounded-full border border-bio-cyan/50 bg-abyss-void/80 px-4 py-2 text-[13px] font-medium uppercase tracking-wide text-ink-heading backdrop-blur-sm transition-colors hover:border-bio-cyan hover:bg-abyss-void/95 hover:text-bio-cyan"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="text-bio-cyan transition-transform group-hover:translate-x-0.5"
                  >
                    -&gt;
                  </span>
                </Link>
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
