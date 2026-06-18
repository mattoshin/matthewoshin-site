"use client";

/**
 * BucketEntries - the large entry-point buttons echoed on the front page hero,
 * in addition to the sticky top BucketNav. Each is a real <button> that
 * smooth-scrolls to its mapped zone via scrollToZone. Styled for the BRIGHT
 * surface (dark text on light), since the hero sits over the sunlit band.
 *
 * Active state isn't shown here (you're at the surface when you read these); the
 * top BucketNav owns the active/aria-current state during the dive.
 */

import { scrollToZone } from "@/lib/scroll";
import { BUCKETS } from "@/data/content";

export default function BucketEntries() {
  return (
    <ul className="mx-auto mt-12 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
      {BUCKETS.map((bucket) => (
        <li key={bucket.id}>
          <button
            type="button"
            onClick={() => scrollToZone(bucket.id)}
            className="group flex w-full items-center justify-center rounded-xl border border-ink-light-primary/20 bg-white/40 px-4 py-3.5 text-sm font-semibold text-ink-light-primary backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-ink-light-primary/45 hover:bg-white/65 sm:text-base"
          >
            {bucket.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
