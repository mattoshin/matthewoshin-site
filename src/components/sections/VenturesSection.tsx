import Section from "./Section";
import { VENTURES } from "@/data/content";

/**
 * VenturesSection / Midnight. Companies and communities founded, framed as orgs.
 * Mocean is framed only as "a software company I founded and sold at 19"; no
 * money figures anywhere.
 */
export default function VenturesSection() {
  return (
    <Section id="ventures">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading sm:text-5xl">
        Companies and communities.
      </h2>
      <p className="measure mt-4 text-base text-ink-muted sm:text-lg">
        The ventures, in roughly the order they happened. The ocean theme was
        never a costume, it has been there the whole time.
      </p>

      <ol className="mt-10 space-y-4">
        {VENTURES.map((venture) => (
          <li
            key={venture.name}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
                {venture.name}
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-wider text-bio-cyan/80">
                {venture.era}
              </span>
            </div>
            <p className="mt-2 text-base text-ink-body">{venture.oneLiner}</p>
            <p className="mt-1 text-sm text-ink-muted">{venture.note}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
