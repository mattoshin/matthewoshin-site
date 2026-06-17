import Link from "next/link";
import type { Metadata } from "next";
import { WRITING } from "@/data/content";

/**
 * /writing - simple index placeholder. Deferred for v1 by design: no fabricated
 * posts. Calm static depth background, fully server-rendered, fast.
 */

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on building with AI, on markets, and on shipping. Coming soon.",
};

export default function WritingPage() {
  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--abyss-top), var(--abyss-body) 50%, var(--abyss-void))",
        }}
      />

      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-5 py-20 sm:px-8">
        <Link
          href="/#writing"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-bio-cyan hover:underline"
        >
          <span aria-hidden="true">&lt;-</span> Back to the descent
        </Link>

        <h1 className="mt-8 font-display text-4xl font-semibold leading-tight text-ink-heading glow-cyan sm:text-6xl">
          {WRITING.heading}
        </h1>
        <p className="measure mt-6 text-base text-ink-body sm:text-lg">
          {WRITING.blurb}
        </p>

        <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            Log book status
          </p>
          <p className="mt-2 text-ink-muted">
            No entries published yet. When they land, they will appear here.
          </p>
        </div>

        <Link
          href="/#contact"
          className="mt-12 font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-bio-cyan"
        >
          In the meantime, surface a signal -&gt;
        </Link>
      </main>
    </div>
  );
}
