import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/page/PageShell";
import { ENTREPRENEURSHIP, VENTURES, type Venture } from "@/data/content";

/**
 * Ventures with a clickable interactive demo at /app/<slug>-demo. Keyed by
 * venture slug so new demos plug in here without touching content.ts.
 */
const VENTURE_DEMOS: Record<string, string> = {
  mocean: "/app/mocean-demo",
};

/**
 * /entrepreneurship - a scannable index of the ventures: a logo, a short summary
 * per card, in roughly the order they happened. The full, comprehensive write-up
 * lives on each venture's own case study at /ventures/<slug>.
 */
export const metadata: Metadata = {
  title: "Entrepreneurship",
  description:
    "Mocean Technologies, Element Underground, Profit Paradise, Ocean Supply, and Resell Network.",
};

/** Same place, same scale on every card: the brand logo, or an initials monogram
 *  when a venture (e.g. Ocean Supply) has no brand asset. */
function CardLogo({ venture }: { venture: Venture }) {
  const initials = venture.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:h-16 sm:w-16">
      {venture.logo ? (
        <Image
          src={venture.logo.src}
          alt={venture.logo.alt}
          width={128}
          height={128}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-display text-base font-semibold text-bio-cyan/80 sm:text-lg">
          {initials}
        </span>
      )}
    </div>
  );
}

export default function EntrepreneurshipPage() {
  return (
    <PageShell
      zone="projects"
      heading={ENTREPRENEURSHIP.heading}
      intro="Five ventures, in roughly the order they happened. The thread: find an edge, package it, and get it to the people who need it. Open any one for the full case study."
    >
      <h2 className="mt-10 font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        {ENTREPRENEURSHIP.venturesLabel}
      </h2>
      <ol className="mt-4 space-y-5">
        {VENTURES.map((venture) => {
          // The first story paragraph is written as a self-contained hook
          // (3-5 sentences); it is the card summary. Full story is on the case study.
          const summary = venture.storyParagraphs?.[0] ?? venture.note;
          return (
            <li
              key={venture.slug}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <CardLogo venture={venture} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
                      {venture.name}
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-bio-cyan/80">
                      {venture.era}
                    </span>
                  </div>
                  <p className="mt-1 text-base font-medium text-ink-body">{venture.oneLiner}</p>
                </div>
              </div>
              <p className="measure mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                {summary}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link
                  href={`/ventures/${venture.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-bio-cyan/40 bg-bio-cyan/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-bio-cyan transition-colors hover:bg-bio-cyan/20"
                >
                  Open the case study <span aria-hidden="true">-&gt;</span>
                </Link>
                {VENTURE_DEMOS[venture.slug] && (
                  <Link
                    href={VENTURE_DEMOS[venture.slug]}
                    className="font-mono text-[11px] uppercase tracking-wider text-ink-muted transition-colors hover:text-bio-cyan"
                  >
                    Try the live demo <span aria-hidden="true">-&gt;</span>
                  </Link>
                )}
                {venture.website && (
                  <a
                    href={venture.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] uppercase tracking-wider text-ink-muted transition-colors hover:text-bio-cyan"
                  >
                    Visit the site <span aria-hidden="true">-&gt;</span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </PageShell>
  );
}
