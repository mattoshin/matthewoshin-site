"use client";

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

export type PortfolioCategory = "ai-products" | "web-client" | "ventures";

export interface PortfolioItem {
  name: string;
  hook: string;
  status: string;
  category: PortfolioCategory;
  /** Case-study detail route (/projects/* or /ventures/*). */
  caseHref: string;
  /** When set, the card shows a bright "View Demo" button to a clickable demo. */
  demoHref?: string;
  /** When set, the card shows a bright "View Site" button to the live external
   *  site (active engagements). Takes precedence over demoHref as the primary CTA. */
  siteHref?: string;
}

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

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const header = (
    <div className="flex items-center justify-between gap-3">
      <h2 className="min-w-0 font-display text-2xl font-semibold text-ink-heading">
        {item.name}
      </h2>
      <span className="shrink-0 whitespace-nowrap rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
        {item.status}
      </span>
    </div>
  );

  // Cards with a primary action (a live site or a clickable demo) keep two distinct
  // links (no nested anchors); case-study-only cards make the whole card a single link.
  const caseLink = (
    <Link
      href={item.caseHref}
      className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-bio-cyan opacity-80 transition-opacity hover:opacity-100"
    >
      Case study <Arrow />
    </Link>
  );

  if (item.siteHref) {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-bio-cyan/30 bg-bio-cyan/[0.06] p-6 backdrop-blur-sm transition-colors hover:border-bio-cyan/50">
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

  return (
    <Link
      href={item.caseHref}
      className="group flex h-full flex-col rounded-2xl border border-bio-cyan/30 bg-bio-cyan/[0.06] p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-bio-cyan/55 hover:bg-bio-cyan/[0.09]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="min-w-0 font-display text-2xl font-semibold text-ink-heading transition-colors group-hover:text-bio-cyan">
          {item.name}
        </h2>
        <span className="shrink-0 whitespace-nowrap rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
          {item.status}
        </span>
      </div>
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
      <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2.5">
        {FILTERS.map((f) => {
          const on = active === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(f.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
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

      {/* Keyed on the active filter so the cards do a subtle fade-in on switch. */}
      <ul
        key={active}
        className="mt-7 grid grid-cols-1 gap-5 motion-safe:animate-[rise_0.3s_cubic-bezier(0.16,1,0.3,1)_both] sm:grid-cols-2"
      >
        {shown.map((item) => (
          <li key={item.name} className="min-w-0">
            <PortfolioCard item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
