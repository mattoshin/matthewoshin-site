import type { Sentiment, Severity, Health, SourceType } from "@/data/sonar-demo";

/**
 * SonarKit - shared presentational primitives for the Sonar demo: the wordmark,
 * a deterministic SSR-safe radar "sweep" visual (no Math.random), an inline-SVG
 * icon set (no extra deps), and the small status chips (sentiment, severity,
 * source health, source type) used across the landing and the console.
 */

/* ------------------------------------------------------------- wordmark --- */

export function Wordmark({ size = "md" }: { size?: "sm" | "md" }) {
  const text = size === "sm" ? "text-sm" : "text-base";
  return (
    <span className="flex items-center gap-2">
      <SonarGlyph size={size === "sm" ? 16 : 20} />
      <span
        className={`font-semibold tracking-[0.22em] text-white ${text}`}
        style={{ fontFamily: "var(--font-s-sans)" }}
      >
        SONAR
      </span>
    </span>
  );
}

/** Compact concentric-ping glyph used in the wordmark and sidebar. */
export function SonarGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2.4" fill="var(--s-amber)" />
      <circle cx="12" cy="12" r="6" stroke="var(--s-amber)" strokeOpacity="0.55" strokeWidth="1.4" fill="none" />
      <circle cx="12" cy="12" r="10" stroke="var(--s-amber)" strokeOpacity="0.25" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

/* --------------------------------------------------------------- sweep --- */

/** A deterministic radar sweep: concentric rings, a rotating amber wedge, and a
 *  few fixed blips. SSR-safe (positions derived from constants, no randomness). */
export function SonarSweep({ size = 320 }: { size?: number }) {
  const blips = [
    { angle: 38, radius: 0.42, delay: 0.2 },
    { angle: 118, radius: 0.74, delay: 1.1 },
    { angle: 206, radius: 0.55, delay: 0.6 },
    { angle: 300, radius: 0.8, delay: 1.6 },
    { angle: 162, radius: 0.3, delay: 2.0 },
    { angle: 255, radius: 0.62, delay: 0.9 },
  ];
  return (
    <div
      aria-hidden="true"
      className="relative shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at center, rgba(255,178,36,0.08), transparent 70%)",
      }}
    >
      {/* concentric rings */}
      {[1, 0.72, 0.46, 0.22].map((r) => (
        <span
          key={r}
          className="absolute rounded-full border"
          style={{
            inset: `${(1 - r) * 50}%`,
            borderColor: "rgba(255,178,36,0.18)",
          }}
        />
      ))}
      {/* cross hairs */}
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: "rgba(255,178,36,0.1)" }} />
      <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2" style={{ background: "rgba(255,178,36,0.1)" }} />
      {/* rotating sweep wedge */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, rgba(255,178,36,0.32), rgba(255,178,36,0) 60deg)",
          animation: "s-sweep 4.5s linear infinite",
          maskImage: "radial-gradient(circle at center, #000 70%, transparent 71%)",
          WebkitMaskImage: "radial-gradient(circle at center, #000 70%, transparent 71%)",
        }}
      />
      {/* center dot */}
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "var(--s-amber)" }} />
      {/* blips */}
      {blips.map((b, i) => {
        const rad = (b.angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * b.radius * 50;
        const y = 50 + Math.sin(rad) * b.radius * 50;
        return (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              background: "var(--s-amber)",
              boxShadow: "0 0 8px rgba(255,178,36,0.9)",
              animation: `s-blip 2.8s ease-in-out ${b.delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------- grid overlay --- */

/** A faint command-center grid for section backgrounds. Pure CSS, decorative. */
export function GridField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
      }}
    />
  );
}

/* ----------------------------------------------------------------- chips --- */

export function SentimentChip({ sentiment, dense = false }: { sentiment: Sentiment; dense?: boolean }) {
  const map = {
    positive: { c: "var(--s-bull)", label: "Positive", icon: "↑" },
    neutral: { c: "var(--s-neutral)", label: "Neutral", icon: "·" },
    negative: { c: "var(--s-bear)", label: "Negative", icon: "↓" },
  }[sentiment];
  if (dense) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold" style={{ background: `${map.c}1f`, color: map.c }} title={map.label}>
        {map.icon}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: `${map.c}1f`, color: map.c }}>
      <span aria-hidden="true">{map.icon}</span> {map.label}
    </span>
  );
}

export function SeverityChip({ severity }: { severity: Severity }) {
  if (severity === "instant") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: "var(--s-amber-dim)", color: "var(--s-amber)" }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--s-amber)" }} /> Instant
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ borderColor: "var(--s-border)", color: "var(--s-muted)" }}>
      Digest
    </span>
  );
}

export function HealthDot({ health }: { health: Health | "active" | "paused" | "error" }) {
  const map: Record<string, string> = {
    healthy: "var(--s-bull)",
    active: "var(--s-bull)",
    degraded: "var(--s-amber)",
    paused: "var(--s-neutral)",
    down: "var(--s-bear)",
    error: "var(--s-bear)",
  };
  const c = map[health] ?? "var(--s-neutral)";
  return <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}66` }} title={health} />;
}

export function SourceTypeBadge({ type }: { type: SourceType }) {
  return (
    <span className="rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider" style={{ borderColor: "var(--s-border)", color: "var(--s-faint)" }}>
      {type}
    </span>
  );
}

/* ---------------------------------------------------------------- icons --- */

export type IconName =
  | "grid"
  | "bell"
  | "activity"
  | "sparkles"
  | "chart"
  | "layers"
  | "search"
  | "plus"
  | "check"
  | "close"
  | "chevron"
  | "dots"
  | "trash"
  | "pencil"
  | "play"
  | "pause"
  | "bolt"
  | "filter"
  | "sliders"
  | "mail"
  | "shield"
  | "rss"
  | "globe"
  | "eye"
  | "refresh"
  | "external"
  | "clock"
  | "link"
  | "send"
  | "menu"
  | "building"
  | "tag"
  | "arrowUp"
  | "arrowDown";

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
    case "grid":
      return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
    case "bell":
      return <svg {...common}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
    case "activity":
      return <svg {...common}><path d="M3 12h4l3 8 4-16 3 8h4" /></svg>;
    case "sparkles":
      return <svg {...common}><path d="M12 3l1.8 4.8L18 9l-4.2 1.2L12 15l-1.8-4.8L6 9l4.2-1.2L12 3Z" /><path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14Z" /></svg>;
    case "chart":
      return <svg {...common}><path d="M4 20V4" /><path d="M4 20h16" /><rect x="7" y="11" width="3" height="6" rx="0.5" /><rect x="12" y="7" width="3" height="10" rx="0.5" /><rect x="17" y="13" width="3" height="4" rx="0.5" /></svg>;
    case "layers":
      return <svg {...common}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "check":
      return <svg {...common}><path d="M5 12.5 10 17l9-10" /></svg>;
    case "close":
      return <svg {...common}><path d="M6 6l12 12M18 6 6 18" /></svg>;
    case "chevron":
      return <svg {...common}><path d="m9 6 6 6-6 6" /></svg>;
    case "dots":
      return <svg {...common}><circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" /></svg>;
    case "trash":
      return <svg {...common}><path d="M4 7h16" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /><path d="M10 11v6M14 11v6" /></svg>;
    case "pencil":
      return <svg {...common}><path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 17v3Z" /><path d="m14 6 3 3" /></svg>;
    case "play":
      return <svg {...common}><path d="M8 5v14l11-7-11-7Z" /></svg>;
    case "pause":
      return <svg {...common}><path d="M9 5v14M15 5v14" /></svg>;
    case "bolt":
      return <svg {...common}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" /></svg>;
    case "filter":
      return <svg {...common}><path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" /></svg>;
    case "sliders":
      return <svg {...common}><path d="M4 6h10M18 6h2" /><path d="M4 12h4M12 12h8" /><path d="M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg>;
    case "mail":
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /></svg>;
    case "rss":
      return <svg {...common}><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1.4" fill="currentColor" stroke="none" /></svg>;
    case "globe":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></svg>;
    case "eye":
      return <svg {...common}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "refresh":
      return <svg {...common}><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>;
    case "external":
      return <svg {...common}><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5H5V5h5" /></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "link":
      return <svg {...common}><path d="M9 15 15 9" /><path d="M11 6.5 13 4.5a4 4 0 0 1 6 6l-2 2" /><path d="M13 17.5 11 19.5a4 4 0 0 1-6-6l2-2" /></svg>;
    case "send":
      return <svg {...common}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></svg>;
    case "menu":
      return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
    case "building":
      return <svg {...common}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></svg>;
    case "tag":
      return <svg {...common}><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z" /><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" /></svg>;
    case "arrowUp":
      return <svg {...common}><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></svg>;
    case "arrowDown":
      return <svg {...common}><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></svg>;
  }
}
