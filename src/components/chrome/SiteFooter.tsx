"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MORE_BUCKETS, SITE } from "@/data/content";

/**
 * SiteFooter - a quiet footer at the bottom of every page (rides over the deep
 * ocean, where the water is dark, so light type reads). Carries the pages
 * demoted out of the top nav (Skills / Education / Interests, per the
 * 2026-07-03 nav curation), the Writing (blog) link, and socials, so everything
 * stays discoverable site-wide without re-crowding the depth-bucket nav.
 */
export default function SiteFooter() {
  // The /app/* demo section provides its own footer/chrome; hide the ocean one.
  const pathname = usePathname();
  if (pathname?.startsWith("/app")) return null;

  return (
    <footer className="relative z-10 px-4 pb-12 pt-6 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
        {/* /about is a digest page, not a bucket (a bucket would add a home
            dive section), so it is hand-linked here and in the mobile sheet. */}
        <Link href="/about" className="transition-colors hover:text-bio-cyan">
          About
        </Link>
        {MORE_BUCKETS.map((bucket) => (
          <Link
            key={bucket.id}
            href={bucket.href}
            className="transition-colors hover:text-bio-cyan"
          >
            {bucket.label}
          </Link>
        ))}
        <Link href="/blog" className="transition-colors hover:text-bio-cyan">
          Writing
        </Link>
        <a
          href={SITE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-bio-cyan"
        >
          LinkedIn
        </a>
        <a
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-bio-cyan"
        >
          GitHub
        </a>
        <span className="tracking-normal text-ink-faint">
          &copy; 2026 Matthew Oshin
        </span>
      </div>
    </footer>
  );
}
