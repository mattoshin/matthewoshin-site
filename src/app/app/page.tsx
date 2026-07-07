import type { Metadata } from "next";
import Link from "next/link";
import { DEMOS } from "@/data/demos";

export const metadata: Metadata = {
  title: "App demos",
  description:
    "Interactive, clickable demos of products Matthew Oshin has built, from Mocean to current work.",
};

/**
 * The demos hub at /app. A simple index of clickable product demos. Styled with
 * the site's own dark palette (the ocean canvas is gated off for /app/*), so it
 * reads as a native section of matthewoshin.com rather than any one product.
 * The demo list itself lives in src/data/demos.ts, shared with the DemoBar
 * breadcrumb.
 */

export default function DemosHubPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-bio-cyan/80">
          Interactive demos
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink-heading sm:text-5xl">
          Click through the things I&apos;ve built.
        </h1>
        <p className="measure mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
          Faithful, clickable recreations of my products, seeded with sample
          data. Nothing here talks to a live server. Each one is the real
          interface, rebuilt so you can actually navigate it.
        </p>
      </header>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2">
        {DEMOS.map((d) => (
          <li key={d.slug}>
            <div
              className={`group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors ${
                d.status === "live"
                  ? "hover:border-bio-cyan/40 hover:bg-white/[0.05]"
                  : ""
              }`}
            >
              {/* Stretched link: covers the whole card for live demos, sibling
                  (not parent) of the inner case-study link so no <a> nests. */}
              {d.status === "live" && d.href && (
                <Link
                  href={d.href}
                  aria-label={`Open ${d.name} demo`}
                  className="absolute inset-0 z-10 rounded-2xl"
                />
              )}

              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: d.accent }}
                />
                <h2 className="font-display text-xl font-semibold text-ink-heading">
                  {d.name}
                </h2>
                {d.status === "live" ? (
                  <span className="ml-auto rounded-full border border-bio-cyan/40 bg-bio-cyan/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-bio-cyan">
                    Live
                  </span>
                ) : (
                  <span className="ml-auto rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                {d.era}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-body">
                {d.tagline}
              </p>
              <div className="mt-6 flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
                {d.status === "live" ? (
                  <span className="text-bio-cyan group-hover:underline">
                    Open demo <span aria-hidden="true">-&gt;</span>
                  </span>
                ) : (
                  <span className="text-ink-faint">In progress</span>
                )}
                {d.caseStudy && (
                  <Link
                    href={d.caseStudy}
                    className="relative z-20 text-ink-muted transition-colors hover:text-bio-cyan"
                  >
                    Case study
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
