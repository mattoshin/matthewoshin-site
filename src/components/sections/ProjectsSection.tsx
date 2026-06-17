import Link from "next/link";
import Section from "./Section";
import { PROJECTS } from "@/data/content";

/**
 * ProjectsSection / Twilight. Glass cards. Each links to /projects/[slug].
 * The hero metric per project is a clearly-marked placeholder (Matthew supplies
 * the real numbers).
 */
export default function ProjectsSection() {
  return (
    <Section id="projects">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading sm:text-5xl">
        Things I have built.
      </h2>
      <p className="measure mt-4 text-base text-ink-muted sm:text-lg">
        Products and platforms, from market research tools to medical devices.
      </p>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-bio-cyan/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-semibold text-ink-heading transition-colors group-hover:text-bio-cyan">
                  {project.name}
                </h3>
                <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  {project.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-body sm:text-base">{project.hook}</p>

              {/* Placeholder hero metric. */}
              <div className="mt-5 rounded-lg border border-dashed border-white/15 px-3 py-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                  {project.metricLabel}
                </p>
                <p className="font-mono text-sm text-ink-muted">
                  [ metric to come ]
                </p>
              </div>

              <span className="mt-5 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-bio-cyan opacity-80 transition-opacity group-hover:opacity-100">
                Open case study
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  -&gt;
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
