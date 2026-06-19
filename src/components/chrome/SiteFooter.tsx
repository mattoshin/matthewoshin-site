import Link from "next/link";
import { SITE } from "@/data/content";

/**
 * SiteFooter - a quiet footer at the bottom of every page (rides over the deep
 * ocean, where the water is dark, so light type reads). Carries the Writing
 * (blog) link plus socials so the blog is discoverable site-wide without
 * touching the depth-bucket nav.
 */
export default function SiteFooter() {
  return (
    <footer className="relative z-10 px-4 pb-12 pt-6 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
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
