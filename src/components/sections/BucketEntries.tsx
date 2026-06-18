import Link from "next/link";
import { BUCKETS } from "@/data/content";

/**
 * BucketEntries - the home launchpad's primary navigation: the six bucket cards.
 *
 * Each card is a Next <Link> to its own route. Clicking one navigates
 * client-side and the persistent ocean dives the camera down to that page's
 * depth. Styled for the BRIGHT surface (dark text on light), since the hero sits
 * over the sunlit band. Each card carries a one-line teaser so the home reads as
 * a real launchpad, not just a label wall.
 */
export default function BucketEntries() {
  return (
    <ul className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
      {BUCKETS.map((bucket) => (
        <li key={bucket.id}>
          <Link
            href={bucket.href}
            className="group flex h-full flex-col rounded-2xl border border-ink-light-primary/20 bg-white/45 px-5 py-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-ink-light-primary/45 hover:bg-white/70"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-display text-lg font-semibold text-ink-light-primary sm:text-xl">
                {bucket.label}
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-ink-light-primary/70 transition-transform group-hover:translate-x-0.5"
              >
                -&gt;
              </span>
            </span>
            <span className="mt-1.5 text-sm leading-snug text-ink-light-secondary">
              {bucket.teaser}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
