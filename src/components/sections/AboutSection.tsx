import Section from "./Section";
import { EXPERIENCE } from "@/data/content";

/**
 * AboutSection / Sunlit shallows = EXPERIENCE (zone id stays "about").
 *
 * The jobs, most recent first, as a clean timeline of role + org + period with
 * concrete bullet points.
 */
export default function AboutSection() {
  return (
    <Section id="about">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading sm:text-5xl">
        Experience
      </h2>
      <p className="measure mt-4 text-base text-ink-muted sm:text-lg">
        Where I have worked, building AI products and learning the markets.
      </p>

      <ol className="mt-10 space-y-4">
        {EXPERIENCE.map((job) => (
          <li
            key={`${job.org}-${job.role}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
                {job.role},{" "}
                <span className="text-bio-cyan">{job.org}</span>
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                {job.period}
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {job.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm text-ink-body sm:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bio-cyan/70"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
