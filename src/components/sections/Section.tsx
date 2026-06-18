import type { ReactNode } from "react";
import { ZONES, type ZoneId } from "@/lib/depth";

/**
 * Section - server-rendered wrapper for one depth zone.
 *
 * Gives every zone: a stable DOM id (used as the scroll anchor and by the depth
 * gauge), a min-height so the descent has room, a depth label marker, and a
 * consistent content column. Content stays server-rendered; only the chrome and
 * canvas are client components.
 *
 * `tone="light"` switches the type colors for the bright surface zone (dark text
 * on light), per the contrast rules.
 *
 * Readability: the content column rides on a `.section-scrim` glass panel (a
 * darkening veil for deep zones, a luminous pane for the bright surface) so type
 * always clears WCAG AA regardless of what swims behind it, while the ocean still
 * glows around the panel. The hero opts out of the panel chrome via
 * `bare`, supplying its own full-bleed surface treatment.
 */

export default function Section({
  id,
  children,
  tone = "dark",
  className = "",
  minScreen = true,
  bare = false,
}: {
  id: ZoneId;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  minScreen?: boolean;
  bare?: boolean;
}) {
  const zone = ZONES.find((z) => z.id === id);
  const isLight = tone === "light";

  return (
    <section
      id={id}
      aria-label={zone?.label}
      data-zone={id}
      className={`relative flex w-full scroll-mt-0 flex-col justify-center px-4 py-24 sm:px-8 ${
        minScreen ? "min-h-screen" : ""
      } ${className}`}
    >
      <div
        className={`mx-auto w-full max-w-5xl ${
          bare
            ? ""
            : `section-scrim ${
                isLight ? "section-scrim--light" : ""
              } px-6 py-12 sm:px-10 sm:py-14`
        }`}
      >
        <p
          className={`mb-7 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] ${
            isLight ? "text-ink-light-secondary" : "text-ink-muted"
          }`}
        >
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-reef-coral shadow-[0_0_8px_color-mix(in_srgb,var(--reef-coral)_55%,transparent)]"
          />
          <span className="text-reef-coral">{zone?.depthLabel}</span>
          <span aria-hidden="true" className="text-ink-faint">
            /
          </span>
          <span>{zone?.label}</span>
        </p>
        {children}
      </div>
    </section>
  );
}
