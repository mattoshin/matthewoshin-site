import Section from "./Section";
import { HERO } from "@/data/content";

/**
 * HeroSection / Surface (0m). Bright, sunlit. The giant headline is the one
 * place light text is allowed over the surface (it sits over the brightest band
 * with its own glow), but the positioning line uses dark-on-light per the rules.
 */
export default function HeroSection() {
  return (
    <Section id="surface" tone="light" className="text-center">
      <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink-light-primary sm:text-7xl md:text-8xl">
        {HERO.headline}
      </h1>
      <p className="measure mx-auto mt-8 text-balance text-lg text-ink-light-secondary sm:text-xl">
        {HERO.positioning}
      </p>
      <div className="mt-14 flex flex-col items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-light-secondary">
          {HERO.scrollHint}
        </span>
        <span
          aria-hidden="true"
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-ink-light-secondary/60 p-1.5"
        >
          <span className="block h-2 w-1 rounded-full bg-ink-light-secondary motion-safe:animate-bounce" />
        </span>
      </div>
    </Section>
  );
}
