import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BUILDS } from "@/data/content";

/**
 * /projects/[slug] - a calm, fast, depth-themed case-study shell for the current
 * builds (Sigma, Galactic Signals).
 *
 * Deliberately NO second 3D scene: this is a reading surface. It reuses the
 * static depth-gradient feel via a fixed CSS background so it still belongs to
 * the ocean, but it carries zero WebGL weight. Fully server-rendered and
 * statically generated for every known build.
 */

export function generateStaticParams() {
  return BUILDS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = BUILDS.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.hook,
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = BUILDS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="relative min-h-screen">
      {/* Calm static depth background, no canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--deep-top), var(--abyss-body) 55%, var(--abyss-void))",
        }}
      />

      <main className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-bio-cyan hover:underline"
        >
          <span aria-hidden="true">&lt;-</span> Back to projects
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {project.status}
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink-heading sm:text-6xl">
            {project.name}
          </h1>
          <p className="mt-4 text-lg text-ink-body sm:text-xl">{project.hook}</p>
        </header>

        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
            Overview
          </h2>
          <p className="measure mt-4 text-base text-ink-body sm:text-lg">
            {project.summary}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
            What it involved
          </h2>
          <ul className="mt-4 space-y-3">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-base text-ink-body">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bio-cyan" />
                {h}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
            Stack
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-ink-body"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 inline-flex items-center gap-2 rounded-full border border-bio-cyan/40 px-5 py-2.5 text-sm font-medium text-bio-cyan transition-colors hover:bg-bio-cyan/10"
          >
            Visit {project.name} <span aria-hidden="true">-&gt;</span>
          </a>
        ) : null}

        {/* Interactive in-site demo: a bright, pulsing call to action. */}
        {project.demoHref ? (
          <div className="mt-12">
            <Link
              href={project.demoHref}
              className="btn-demo inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm uppercase tracking-wider"
            >
              View Demo <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        ) : null}

        <footer className="mt-16 border-t border-white/10 pt-8">
          <Link
            href="/contact"
            className="font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-bio-cyan"
          >
            Want to talk about this? Surface a signal -&gt;
          </Link>
        </footer>
      </main>
    </div>
  );
}
