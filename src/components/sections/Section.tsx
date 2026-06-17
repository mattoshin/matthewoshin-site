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
 */

export default function Section({
  id,
  children,
  tone = "dark",
  className = "",
  minScreen = true,
}: {
  id: ZoneId;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  minScreen?: boolean;
}) {
  const zone = ZONES.find((z) => z.id === id);
  const isLight = tone === "light";

  return (
    <section
      id={id}
      aria-label={zone?.label}
      data-zone={id}
      className={`relative flex w-full scroll-mt-0 flex-col justify-center px-5 py-24 sm:px-8 ${
        minScreen ? "min-h-screen" : ""
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-5xl">
        <p
          className={`mb-6 font-mono text-[11px] uppercase tracking-[0.25em] ${
            isLight ? "text-ink-light-secondary" : "text-ink-faint"
          }`}
        >
          {zone?.depthLabel} <span aria-hidden="true">/</span> {zone?.label}
        </p>
        {children}
      </div>
    </section>
  );
}
