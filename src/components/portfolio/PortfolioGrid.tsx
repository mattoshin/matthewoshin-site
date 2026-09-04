"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * The filterable portfolio grid. The page builds the ordered item list (server side)
 * and hands it here; this client component owns the active-category filter and renders
 * the pill row plus the filtered cards. Every card carries the turquoise (bio-cyan)
 * treatment, so the grid reads as one consistent set rather than "featured vs the rest".
 *
 * Filter pattern is the common one across Designstripe / Glorify / Twitch (Refero pass):
 * a horizontal pill row, the active pill filled with the accent, the rest ghost-outline,
 * each with a live count. Filtering is instant and client-side (no route change).
 */

import type { PortfolioCategory, PortfolioItem } from "@/data/portfolio-items";

// Re-exported so existing importers keep working; the data module owns them.
export type { PortfolioCategory, PortfolioItem };

type FilterId = "all" | PortfolioCategory;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai-products", label: "AI Products" },
  { id: "web-client", label: "Web & Client" },
  { id: "ventures", label: "Ventures" },
];

function Arrow() {
  return <span aria-hidden="true">-&gt;</span>;
}

function PortfolioCard({ item, eager }: { item: PortfolioItem; eager: boolean }) {
  // Status tags dropped from the card header (Matthew, 2026-07-03): the CTA
  // already says live vs demo, so the top-right chip was noise.
  const header = (
    <h2 className="min-w-0 font-serif text-2xl font-semibold leading-snug text-balance text-ink-heading">
      {item.name}
    </h2>
  );

  // The picture does the talking: a real screenshot above the name, cropped
  // from the top so the product's own header shows. The first row is the
  // page's largest paint on desktop, so it loads eagerly (plain eager, not
  // `priority`: a preload would compete with the ocean bundle on phones where
  // the grid starts below the fold); the rest lazy-load as the grid scrolls.
  // `sizes` states the real rendered width: the shell caps at 64rem, minus
  // main and scrim padding, the column gap and the card's own padding, the
  // image is 380px wide on desktop (measured), narrower below that.
  const media = item.thumb ? (
    <Image
      src={item.thumb}
      alt={`${item.name} screenshot`}
      width={1200}
      height={750}
      loading={eager ? "eager" : "lazy"}
      sizes="(min-width: 1024px) 380px, (min-width: 640px) calc(50vw - 130px), calc(100vw - 128px)"
      className="mb-5 aspect-[16/10] w-full rounded-xl border border-white/15 object-cover object-top"
    />
  ) : null;

  // Cards with a primary action (a live site or a clickable demo) keep two distinct
  // links (no nested anchors); case-study-only cards make the whole card a single link.
  const caseLink = item.caseHref ? (
    <Link
      href={item.caseHref}
      className="hit inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-bio-cyan opacity-80 transition-opacity hover:opacity-100"
    >
      Case study <Arrow />
    </Link>
  ) : null;

  if (item.siteHref) {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-bio-cyan/30 bg-bio-cyan/[0.06] p-6 backdrop-blur-sm transition-colors hover:border-bio-cyan/50">
        {media}
        {header}
        <p className="mt-3 text-sm text-ink-body sm:text-base">{item.hook}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          <a
            href={item.siteHref}
            target="_blank"
            rel="noreferrer"
            className="btn-demo inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-wider"
          >
            View Site <span aria-hidden="true">&#8599;</span>
          </a>
          {caseLink}
        </div>
      </div>
    );
  }

  if (item.demoHref) {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-bio-cyan/30 bg-bio-cyan/[0.06] p-6 backdrop-blur-sm transition-colors hover:border-bio-cyan/50">
        {media}
        {header}
        <p className="mt-3 text-sm text-ink-body sm:text-base">{item.hook}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          <Link
            href={item.demoHref}
            className="btn-demo inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-wider"
          >
            View Demo <Arrow />
          </Link>
          {caseLink}
        </div>
      </div>
    );
  }

  if (item.caseHref) {
    // A card with a screenshot fills the row like its neighbours; a text-only
    // card (no live surface to capture) sizes to its copy instead of
    // stretching to a picture-height neighbour and leaving an empty band.
    return (
      <Link
        href={item.caseHref}
        className={`group flex ${item.thumb ? "h-full" : "h-auto"} flex-col rounded-2xl border border-bio-cyan/30 bg-bio-cyan/[0.06] p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-bio-cyan/55 hover:bg-bio-cyan/[0.09]`}
      >
        {media}
        <h2 className="min-w-0 font-serif text-2xl font-semibold leading-snug text-balance text-ink-heading transition-colors group-hover:text-bio-cyan">
          {item.name}
        </h2>
        <p className="mt-3 text-sm text-ink-body sm:text-base">{item.hook}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-5 font-mono text-xs uppercase tracking-wider text-bio-cyan opacity-80 transition-opacity group-hover:opacity-100">
          Open case study
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            -&gt;
          </span>
        </span>
      </Link>
    );
  }

  // No primary action and no case study: a non-interactive card (e.g. a concept
  // with only a demo handled above). Unreachable in practice.
  return (
    <div className="flex h-full flex-col rounded-2xl border border-bio-cyan/30 bg-bio-cyan/[0.06] p-6 backdrop-blur-sm">
      {media}
      {header}
      <p className="mt-3 text-sm text-ink-body sm:text-base">{item.hook}</p>
    </div>
  );
}

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<FilterId>("all");

  const counts = useMemo(() => {
    const c: Record<FilterId, number> = {
      all: items.length,
      "ai-products": 0,
      "web-client": 0,
      ventures: 0,
    };
    for (const it of items) c[it.category] += 1;
    return c;
  }, [items]);

  const shown = useMemo(
    () => (active === "all" ? items : items.filter((it) => it.category === active)),
    [items, active]
  );

  return (
    <div className="mt-8">
      {/* Filter pills. Wraps rather than scrolls so it never forces horizontal
          overflow on small phones. */}
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-3">
        {FILTERS.map((f) => {
          const on = active === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(f.id)}
              className={`hit inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                on
                  ? "btn-demo"
                  : "border border-white/15 text-ink-muted hover:border-bio-cyan/40 hover:text-ink-body"
              }`}
            >
              {f.label}
              <span className={on ? "opacity-70" : "opacity-50"}>{counts[f.id]}</span>
            </button>
          );
        })}
      </div>
      {/* Screen readers hear the result of a filter press; sighted users see the
          grid change. Plain buttons with aria-pressed match what this is (a
          filter), where the old tabs ARIA promised panels that never existed. */}
      <p role="status" aria-live="polite" className="sr-only">
        Showing {shown.length} of {items.length} projects
      </p>

      {/* Keyed on the active filter so the cards do a subtle fade-in on switch. */}
      <ul
        key={active}
        className="mt-7 grid grid-cols-1 gap-5 motion-safe:animate-[rise_0.3s_cubic-bezier(0.16,1,0.3,1)_both] sm:grid-cols-2"
      >
        {shown.map((item, index) => (
          <li key={item.name} className="min-w-0">
            <PortfolioCard item={item} eager={index < 2} />
          </li>
        ))}
      </ul>
    </div>
  );
}
