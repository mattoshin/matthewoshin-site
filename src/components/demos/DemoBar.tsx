import Link from "next/link";

/**
 * DemoBar - the slim universal strip across the top of every /app/* demo. It is
 * brand-neutral (sits above any demo's own chrome), marks the page as a
 * non-functional showcase, and provides the "standard demo linking": back to the
 * Portfolio page (where the demos are launched from) and out to the main site.
 */
export default function DemoBar() {
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-[#05080f]/95 backdrop-blur">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 font-mono text-[11px] uppercase tracking-[0.18em] sm:px-6">
        <div className="flex items-center gap-3 text-white/55">
          <Link
            href="/portfolio"
            className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <span aria-hidden="true">&lt;-</span> Portfolio
          </Link>
          <span className="hidden text-white/25 sm:inline">/</span>
          <span className="hidden rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[9px] tracking-[0.15em] text-amber-300/90 sm:inline">
            Interactive demo · sample data
          </span>
        </div>
        <Link
          href="/"
          className="text-white/60 transition-colors hover:text-white"
        >
          Exit to matthewoshin.com <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </div>
  );
}
