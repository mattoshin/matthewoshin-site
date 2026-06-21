import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EDUCATION } from "@/data/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return EDUCATION.filter((s) => s.slug).map((s) => ({ slug: s.slug as string }));
}

export async function generateMetadata({
  params,
}: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const school = EDUCATION.find((s) => s.slug === slug);
  if (!school) return { title: "Not found" };
  return { title: school.school, description: school.detail };
}

export default async function SchoolPage({ params }: { params: Params }) {
  const { slug } = await params;
  const school = EDUCATION.find((s) => s.slug === slug);
  if (!school || !school.storyParagraphs) notFound();

  return (
    <div className="relative min-h-screen">
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
          href="/education"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-bio-cyan hover:underline"
        >
          <span aria-hidden="true">&lt;-</span> Back to education
        </Link>

        <header className="mt-8">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            {school.detail}
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink-heading sm:text-6xl">
            {school.school}
          </h1>
        </header>

        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
            The story
          </h2>
          <div className="measure mt-4 space-y-4 text-base leading-relaxed text-ink-body sm:text-lg">
            {school.storyParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-8">
          <Link
            href="/#contact"
            className="font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-bio-cyan"
          >
            Want to talk about this? Surface a signal -&gt;
          </Link>
        </footer>
      </main>
    </div>
  );
}
