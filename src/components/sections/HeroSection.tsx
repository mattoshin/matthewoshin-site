import Link from "next/link";
import { HERO, HERO_PROOF } from "@/data/content";

/**
 * HeroSection - the SURFACE (0m). Decluttered per Matthew: no eyebrow line and no
 * big name (the wordmark up top carries the identity). Light type with a crisp
 * dark shadow so it reads over the water.
 *
 * CURATED 2026-07-03 (Gabe's feedback): seven static chips became FOUR clickable
 * proof stats (HERO_PROOF in content.ts), each routing to its evidence, with an
 * arrow affordance so they read as doors, not decoration.
 *
 * EXTENDED 2026-07-06 (Matthew's ask): a "More about me" chip rides at the end
 * of the proof row as the door to the person (/about digest). Softer white
 * border on purpose: it is a door, not a stat.
 *
 * CUT DOWN 2026-07-03 round two (Matthew: "too much going on... especially the
 * motion"): the rotating six-identity headline is GONE, replaced by the static
 * throughline "I'm a builder." The four-sentence bio paragraph left the hero
 * too (its facts live on /experience, About, and the chips).
 *
 * HUMBLED FURTHER 2026-07-20 (Matthew: "get rid of the headline, get rid of
 * the photo... I need to see humble and easy to work with"). The bold
 * display headline and its cyan-accented beats are GONE, replaced by a plain,
 * quiet greeting at normal weight. The portrait moved to /about, where a photo
 * belongs on a personal bio rather than announcing itself on arrival. Source
 * copy: HERO.tagline in content.ts, keep in sync. Do not re-add a big display
 * headline, motion, or the portrait here without asking him.
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
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        {/* Plain, quiet greeting. Normal weight, modest size, single color: no
            display-scale type, no per-word accents. Semantic <h1> kept for
            SEO/a11y, just styled humbly. */}
        <h1
          className={`font-display text-2xl font-medium leading-snug text-white sm:text-3xl ${SHADOW}`}
        >
          {HERO.tagline}
        </h1>

        {/* Proof stats - dark glass chips, each a LINK to its evidence. The
            arrow slides in on hover so they read as doors, not decoration. */}
        <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
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
          {/* The door to the person, not a stat: /about gathers the story,
              skills, education, and interests in one read. */}
          <li>
            <Link
              href="/about"
              className="proof-chip group inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-abyss-void/80 px-4 py-2 text-[13px] font-medium uppercase tracking-wide text-ink-heading backdrop-blur-sm transition-colors hover:border-bio-cyan hover:bg-abyss-void/95 hover:text-bio-cyan"
            >
              More about me
              <span
                aria-hidden="true"
                className="text-bio-cyan transition-transform group-hover:translate-x-0.5"
              >
                -&gt;
              </span>
            </Link>
          </li>
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
    </section>
  );
}
