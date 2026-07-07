"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { matchDemoByPath } from "@/data/demos";

/**
 * DemoBar - the universal strip across the top of every /app/* demo. It is
 * brand-neutral (sits above any demo's own chrome), loudly marks the page as a
 * non-functional showcase via a yellow, blinking "sample data" badge, and
 * carries the standard demo navigation.
 *
 * The left side is a hierarchy-aware breadcrumb: Portfolio › <Demo> › <Sub>.
 * From a demo's dashboard (or any sub-route) the <Demo> crumb links back to
 * that demo's own landing page, so you can step up one level without detouring
 * through Portfolio. On the landing page itself the <Demo> crumb is the plain
 * current page, and on the /app index only the Portfolio crumb shows. The right
 * side always exits to the main site.
 */
export default function DemoBar() {
  const pathname = usePathname();
  const match = pathname ? matchDemoByPath(pathname) : null;

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-[#05080f]/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-3 px-4 font-mono text-[11px] uppercase tracking-[0.18em] sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5 text-white/55 sm:gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <Link
              href="/portfolio"
              className="flex shrink-0 items-center gap-2 text-white/80 transition-colors hover:text-white"
            >
              <span aria-hidden="true">&lt;-</span> Portfolio
            </Link>

            {match && (
              <>
                <span aria-hidden="true" className="shrink-0 text-white/25">
                  &rsaquo;
                </span>
                {match.subPage ? (
                  <Link
                    href={match.landingHref}
                    className="min-w-0 shrink truncate text-white/70 transition-colors hover:text-white"
                  >
                    {match.demo.name}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="min-w-0 shrink truncate text-white/45"
                  >
                    {match.demo.name}
                  </span>
                )}

                {match.subPage && (
                  <>
                    <span
                      aria-hidden="true"
                      className="hidden shrink-0 text-white/25 sm:inline"
                    >
                      &rsaquo;
                    </span>
                    <span
                      aria-current="page"
                      className="hidden min-w-0 shrink truncate text-white/45 sm:inline"
                    >
                      {match.subPage}
                    </span>
                  </>
                )}
              </>
            )}
          </nav>

          <span className="demo-blink flex shrink-0 items-center gap-1.5 rounded-full border border-yellow-400/70 bg-yellow-400/15 px-3 py-1 text-[10px] font-semibold tracking-[0.15em] text-yellow-300">
            <span className="h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
            <span className="hidden sm:inline">Interactive demo · sample data</span>
            <span className="sm:hidden">Sample data</span>
          </span>
        </div>

        <Link
          href="/"
          className="shrink-0 text-white/60 transition-colors hover:text-white"
        >
          <span className="hidden sm:inline">Exit to matthewoshin.com </span>
          <span className="sm:hidden">Exit </span>
          <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </div>
  );
}
