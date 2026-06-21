import type { GalacticAlert } from "@/data/galactic-demo";

/**
 * GalacticKit - shared presentational primitives for the Galactic demo: the
 * wordmark, an inline-SVG icon set (no extra deps), a deterministic cosmic
 * starfield (SSR-safe, no Math.random), and the Discord-style embed renderer
 * used by the delivery preview, the embed visualizer, and the monitor builder.
 */

/* ------------------------------------------------------------- wordmark --- */

export function Wordmark({
  size = "md",
}: {
  size?: "sm" | "md";
}) {
  const text = size === "sm" ? "text-sm" : "text-base";
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="text-lg leading-none"
        style={{ color: "var(--g-teal)" }}
      >
        ✦
      </span>
      <span
        className={`font-semibold tracking-[0.18em] text-white ${text}`}
        style={{ fontFamily: "var(--font-g-sans)" }}
      >
        GALACTIC
      </span>
    </span>
  );
}

/* ------------------------------------------------------------- starfield --- */

/** A fixed, SSR-safe starfield. Positions are derived from the index so the
 *  server and client render identically (no hydration mismatch). */
export function Starfield({ count = 60 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => {
    const top = (i * 53) % 100;
    const left = (i * 37 + 13) % 100;
    const size = (i % 3) + 1;
    const delay = (i % 7) * 0.4;
    const dur = 2.5 + (i % 5) * 0.6;
    return { top, left, size, delay, dur, key: i };
  });
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.key}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: 0.5,
            animation: `g-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ embed card --- */

/** Renders one alert as a Discord-style embed (left accent bar, title, fields,
 *  footer). Used wherever Galactic shows a delivered alert. */
export function EmbedCard({
  alert,
  brandColor,
}: {
  alert: GalacticAlert;
  brandColor?: string;
}) {
  const color = brandColor ?? alert.color;
  return (
    <div className="overflow-hidden rounded-md" style={{ background: "#2B2D31" }}>
      <div className="flex gap-3 p-3" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">{alert.icon}</span>
            <span className="truncate text-sm font-semibold text-white">{alert.title}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {alert.fields.map((f, i) => (
              <div key={i} className={f.inline ? "" : "w-full"}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[#b5bac1]">
                  {f.name}
                </div>
                <div className="mt-0.5 text-[13px] leading-snug text-[#dbdee1]">{f.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#949ba4]">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: "var(--g-teal)" }}
            />
            <span>galacticsignals.com</span>
            <span>·</span>
            <span>{alert.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- icons --- */

export type IconName =
  | "home"
  | "store"
  | "webhook"
  | "palette"
  | "settings"
  | "sparkles"
  | "eye"
  | "users"
  | "rocket"
  | "activity"
  | "bell"
  | "search"
  | "menu"
  | "check"
  | "plus"
  | "link"
  | "shield"
  | "external"
  | "chevron"
  | "bolt"
  | "globe"
  | "test"
  | "close";

export function Icon({
  name,
  size = 18,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (name) {
    case "home":
      return <svg {...common}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>;
    case "store":
      return <svg {...common}><path d="M4 7h16l-1 4a3 3 0 0 1-6 0 3 3 0 0 1-6 0L4 7Z" /><path d="M5 11v9h14v-9" /><path d="M5 7l1.5-4h11L19 7" /></svg>;
    case "webhook":
      return <svg {...common}><path d="M18 16.5a3.5 3.5 0 1 1-3.4-3.5" /><path d="M8.5 9a3.5 3.5 0 1 1 4 3.4" /><path d="m12 12.5-3 5.5" /><path d="M15 18h-6" /></svg>;
    case "palette":
      return <svg {...common}><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2 0-1.5 1-2 2-2h1a4 4 0 0 0 4-4c0-4.5-4-8-9-8Z" /><circle cx="8" cy="11" r="1" /><circle cx="12" cy="8" r="1" /><circle cx="16" cy="11" r="1" /></svg>;
    case "settings":
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L16 3H8l-.6 2.5a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2L8 21h8l.6-2.5a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5A7 7 0 0 0 19 12Z" /></svg>;
    case "sparkles":
      return <svg {...common}><path d="M12 3l1.8 4.8L18 9l-4.2 1.2L12 15l-1.8-4.8L6 9l4.2-1.2L12 3Z" /><path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14Z" /></svg>;
    case "eye":
      return <svg {...common}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "users":
      return <svg {...common}><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8" /><path d="M18 14a6 6 0 0 1 3 5" /></svg>;
    case "rocket":
      return <svg {...common}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M9 13a14 14 0 0 1 8-9c2.5 0 3 .5 3 3a14 14 0 0 1-9 8l-2-2Z" /><circle cx="15" cy="9" r="1.4" /></svg>;
    case "activity":
      return <svg {...common}><path d="M3 12h4l3 8 4-16 3 8h4" /></svg>;
    case "bell":
      return <svg {...common}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case "menu":
      return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
    case "check":
      return <svg {...common}><path d="M5 12.5 10 17l9-10" /></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "link":
      return <svg {...common}><path d="M9 15 15 9" /><path d="M11 6.5 13 4.5a4 4 0 0 1 6 6l-2 2" /><path d="M13 17.5 11 19.5a4 4 0 0 1-6-6l2-2" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "external":
      return <svg {...common}><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5H5V5h5" /></svg>;
    case "chevron":
      return <svg {...common}><path d="m9 6 6 6-6 6" /></svg>;
    case "bolt":
      return <svg {...common}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" /></svg>;
    case "globe":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></svg>;
    case "test":
      return <svg {...common}><path d="M9 3h6" /><path d="M10 3v6l-4 9a2 2 0 0 0 2 3h8a2 2 0 0 0 2-3l-4-9V3" /><path d="M7.5 15h9" /></svg>;
    case "close":
      return <svg {...common}><path d="M6 6l12 12M18 6 6 18" /></svg>;
  }
}
