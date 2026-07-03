/**
 * FcKit - shared presentational primitives for the Financial Comms demo. Pure,
 * dependency-free building blocks (inline-SVG icon set, cards, KPI stats, badges,
 * deltas, SSR-safe sparklines, the AI-provenance block, tabs, data tables, and the
 * company context header) that every Financial Comms module composes. All visuals read the
 * scoped `--fc-*` tokens from FcScope, so the institutional light theme stays
 * consistent: hairline borders over shadows, mono tabular numerics, ultramarine
 * accent on ~5% of pixels, and an accent-left-border "AI" signature on generated
 * content.
 */
import React from "react";

export const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

/* ----------------------------------------------------------------- wordmark --- */

/** The Financial Comms lockup: a concentric-signal mark + wordmark. */
export function Wordmark({ size = "md" }: { size?: "sm" | "md" }) {
  const text = size === "sm" ? "text-sm" : "text-[15px]";
  return (
    <span className="flex items-center gap-2.5">
      <FcMark size={size === "sm" ? 18 : 22} />
      <span className="leading-none">
        <span
          className={cx("block font-semibold tracking-tight text-[var(--fc-ink)]", text)}
        >
          Financial Comms
        </span>
        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--fc-faint)]">
          Financial Communications
        </span>
      </span>
    </span>
  );
}

/** A small concentric-arc "signal" mark in the accent color. */
export function FcMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="24" height="24" rx="6" fill="var(--fc-ink)" />
      <circle cx="12" cy="12" r="2.4" fill="var(--fc-accent)" />
      <path
        d="M8.2 15.8a5.4 5.4 0 0 1 0-7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6"
        stroke="var(--fc-accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M6 18a8.6 8.6 0 0 1 0-12M18 6a8.6 8.6 0 0 1 0 12"
        stroke="#5e7cff"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------- icons --- */

export type IconName =
  | "dashboard"
  | "database"
  | "barchart"
  | "compass"
  | "target"
  | "users"
  | "calendar"
  | "shield"
  | "rocket"
  | "scale"
  | "megaphone"
  | "lightbulb"
  | "heart"
  | "activity"
  | "search"
  | "bell"
  | "chevron"
  | "chevronDown"
  | "settings"
  | "user"
  | "plus"
  | "check"
  | "close"
  | "copy"
  | "download"
  | "refresh"
  | "external"
  | "dots"
  | "send"
  | "sparkles"
  | "arrowUp"
  | "arrowDown"
  | "trendingUp"
  | "fileText"
  | "building"
  | "briefcase"
  | "globe"
  | "mail"
  | "clock"
  | "alert"
  | "info"
  | "star"
  | "filter"
  | "play"
  | "link"
  | "lock"
  | "home"
  | "bolt"
  | "layers";

export function Icon({
  name,
  size = 18,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const c = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (name) {
    case "dashboard":
      return <svg {...c}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>;
    case "database":
      return <svg {...c}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>;
    case "barchart":
      return <svg {...c}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>;
    case "compass":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>;
    case "target":
      return <svg {...c}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></svg>;
    case "users":
      return <svg {...c}><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8" /><path d="M18 14a6 6 0 0 1 3 5" /></svg>;
    case "calendar":
      return <svg {...c}><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v3M16 3v3" /></svg>;
    case "shield":
      return <svg {...c}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /></svg>;
    case "rocket":
      return <svg {...c}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M9 13a14 14 0 0 1 8-9c2.5 0 3 .5 3 3a14 14 0 0 1-9 8l-2-2Z" /><circle cx="15" cy="9" r="1.4" /></svg>;
    case "scale":
      return <svg {...c}><path d="M12 3v18M7 21h10" /><path d="M6 7h12l-3 6h-6L6 7Z" /><path d="m6 7-3 6h6L6 7ZM18 7l-3 6h6l-3-6Z" /></svg>;
    case "megaphone":
      return <svg {...c}><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z" /><path d="M15 8a4 4 0 0 1 0 8" /></svg>;
    case "lightbulb":
      return <svg {...c}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0 0 12 3Z" /></svg>;
    case "heart":
      return <svg {...c}><path d="M12 20s-7-4.3-9.3-8.3C1 8.5 2.5 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.5 0 5 3.5 3.3 6.7C19 15.7 12 20 12 20Z" /></svg>;
    case "activity":
      return <svg {...c}><path d="M3 12h4l3 8 4-16 3 8h4" /></svg>;
    case "search":
      return <svg {...c}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case "bell":
      return <svg {...c}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
    case "chevron":
      return <svg {...c}><path d="m9 6 6 6-6 6" /></svg>;
    case "chevronDown":
      return <svg {...c}><path d="m6 9 6 6 6-6" /></svg>;
    case "settings":
      return <svg {...c}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L16 3H8l-.6 2.5a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2L8 21h8l.6-2.5a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5A7 7 0 0 0 19 12Z" /></svg>;
    case "user":
      return <svg {...c}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
    case "plus":
      return <svg {...c}><path d="M12 5v14M5 12h14" /></svg>;
    case "check":
      return <svg {...c}><path d="M5 12.5 10 17l9-10" /></svg>;
    case "close":
      return <svg {...c}><path d="M6 6l12 12M18 6 6 18" /></svg>;
    case "copy":
      return <svg {...c}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>;
    case "download":
      return <svg {...c}><path d="M12 4v11" /><path d="m7 11 5 4 5-4" /><path d="M5 20h14" /></svg>;
    case "refresh":
      return <svg {...c}><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>;
    case "external":
      return <svg {...c}><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5H5V5h5" /></svg>;
    case "dots":
      return <svg {...c}><circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" /></svg>;
    case "send":
      return <svg {...c}><path d="M4 12 20 4l-6 16-3-7-7-1Z" /></svg>;
    case "sparkles":
      return <svg {...c}><path d="M12 3l1.8 4.8L18 9l-4.2 1.2L12 15l-1.8-4.8L6 9l4.2-1.2L12 3Z" /><path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14Z" /></svg>;
    case "arrowUp":
      return <svg {...c}><path d="M12 19V5M6 11l6-6 6 6" /></svg>;
    case "arrowDown":
      return <svg {...c}><path d="M12 5v14M6 13l6 6 6-6" /></svg>;
    case "trendingUp":
      return <svg {...c}><path d="m3 17 6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>;
    case "fileText":
      return <svg {...c}><path d="M14 3v5h5" /><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z" /><path d="M8 13h8M8 17h6" /></svg>;
    case "building":
      return <svg {...c}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" /></svg>;
    case "briefcase":
      return <svg {...c}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></svg>;
    case "globe":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></svg>;
    case "mail":
      return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case "clock":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>;
    case "alert":
      return <svg {...c}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 9v5M12 17.5v.5" /></svg>;
    case "info":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>;
    case "star":
      return <svg {...c}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.8 6.6 20l1-6.1L3.2 9.5l6.1-.9L12 3Z" /></svg>;
    case "filter":
      return <svg {...c}><path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" /></svg>;
    case "play":
      return <svg {...c}><path d="M8 5v14l11-7-11-7Z" /></svg>;
    case "link":
      return <svg {...c}><path d="M9 15 15 9" /><path d="M11 6.5 13 4.5a4 4 0 0 1 6 6l-2 2" /><path d="M13 17.5 11 19.5a4 4 0 0 1-6-6l2-2" /></svg>;
    case "lock":
      return <svg {...c}><rect x="4.5" y="10" width="15" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
    case "home":
      return <svg {...c}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>;
    case "bolt":
      return <svg {...c}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" /></svg>;
    case "layers":
      return <svg {...c}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>;
  }
}

/* ------------------------------------------------------------- typographic --- */

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cx("font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--fc-faint)]", className)}>
      {children}
    </p>
  );
}

export function SectionHeading({
  title,
  hint,
  right,
}: {
  title: string;
  hint?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-[var(--fc-ink)]">{title}</h2>
        {hint && <p className="mt-0.5 text-[13px] text-[var(--fc-muted)]">{hint}</p>}
      </div>
      {right}
    </div>
  );
}

/* --------------------------------------------------------------------- card --- */

export function Card({
  children,
  className = "",
  padded = true,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-[10px] border border-[var(--fc-border)] bg-[var(--fc-card)]",
        padded && "p-5",
        hover && "transition-shadow hover:shadow-[0_1px_3px_rgba(12,14,19,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- buttons --- */

type BtnVariant = "ink" | "accent" | "outline" | "ghost";
export function Button({
  children,
  variant = "ink",
  size = "md",
  icon,
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  variant?: BtnVariant;
  size?: "sm" | "md";
  icon?: IconName;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all disabled:opacity-50";
  const sizes = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-[13px]";
  const variants: Record<BtnVariant, string> = {
    ink: "bg-[var(--fc-ink)] text-white hover:bg-[#000]",
    accent: "bg-[var(--fc-accent)] text-white hover:bg-[var(--fc-accent-700)]",
    outline:
      "border border-[var(--fc-border-strong)] bg-[var(--fc-card)] text-[var(--fc-ink)] hover:bg-[var(--fc-surface-2)]",
    ghost: "text-[var(--fc-muted)] hover:bg-[var(--fc-surface-2)] hover:text-[var(--fc-ink)]",
  };
  return (
    <button className={cx(base, sizes, variants[variant], className)} {...rest}>
      {icon && <Icon name={icon} size={size === "sm" ? 13 : 15} />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ badges --- */

type Tone = "neutral" | "accent" | "up" | "down" | "warn";
export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  const tones: Record<Tone, string> = {
    neutral: "border-[var(--fc-border)] bg-[var(--fc-surface-2)] text-[var(--fc-muted)]",
    accent: "border-[var(--fc-accent)]/25 bg-[var(--fc-accent-wash)] text-[var(--fc-accent)]",
    up: "border-[var(--fc-up)]/25 bg-[#ecfdf3] text-[var(--fc-up)]",
    down: "border-[var(--fc-down)]/25 bg-[#fef2f2] text-[var(--fc-down)]",
    warn: "border-[var(--fc-warn)]/25 bg-[#fffbeb] text-[var(--fc-warn)]",
  };
  const dotColor: Record<Tone, string> = {
    neutral: "var(--fc-faint)",
    accent: "var(--fc-accent)",
    up: "var(--fc-up)",
    down: "var(--fc-down)",
    warn: "var(--fc-warn)",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: dotColor[tone], animation: "fc-pulse-ring 1.8s ease-out infinite" }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: dotColor[tone] }} />
        </span>
      )}
      {children}
    </span>
  );
}

/** A small rating badge for analyst consensus. */
export function RatingBadge({ rating }: { rating: "Buy" | "Hold" | "Sell" | "Overweight" | "Underweight" }) {
  const tone: Tone = rating === "Buy" || rating === "Overweight" ? "up" : rating === "Sell" || rating === "Underweight" ? "down" : "warn";
  return <Badge tone={tone}>{rating}</Badge>;
}

/* ------------------------------------------------------------------ deltas --- */

/** A colored, mono, signed change with a directional glyph. */
export function Delta({
  value,
  suffix = "%",
  size = "sm",
}: {
  value: number;
  suffix?: string;
  size?: "sm" | "md";
}) {
  const up = value >= 0;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-0.5 font-mono tabular-nums font-medium",
        size === "md" ? "text-sm" : "text-[12px]",
      )}
      style={{ color: up ? "var(--fc-up)" : "var(--fc-down)" }}
    >
      <span aria-hidden="true">{up ? "▲" : "▼"}</span>
      {up ? "+" : ""}
      {value.toFixed(2)}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------- stat cards --- */

export function StatCard({
  label,
  value,
  delta,
  hint,
  spark,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  spark?: number[];
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-medium text-[var(--fc-muted)]">{label}</p>
        {spark && <Sparkline values={spark} />}
      </div>
      <div className="mt-2 font-mono text-[28px] font-semibold leading-none tracking-tight tabular-nums text-[var(--fc-ink)]">
        {value}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {delta !== undefined && <Delta value={delta} />}
        {hint && <span className="text-[12px] text-[var(--fc-faint)]">{hint}</span>}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------- sparkline --- */

/** SSR-safe inline sparkline. Deterministic; no axes/fill, just a trend line. */
export function Sparkline({
  values,
  width = 80,
  height = 24,
  color,
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stroke = color ?? (values[values.length - 1] >= values[0] ? "var(--fc-up)" : "var(--fc-down)");
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * (width - 2) + 1;
      const y = height - 2 - ((v - min) / span) * (height - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} aria-hidden="true" className="overflow-visible">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* --------------------------------------------------------- AI provenance --- */

/** The recurring "generated by your AI analyst" signature: an accent-left-border
 *  block with an AI tag. Wrap any AI-authored content (briefs, drafts, scenarios). */
export function AIBlock({
  children,
  title,
  tag = "AI",
  streaming = false,
  footer,
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  tag?: string;
  streaming?: boolean;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-r-[10px] border border-l-2 border-[var(--fc-border)] border-l-[var(--fc-accent)] bg-[var(--fc-card)] p-4",
        className,
      )}
    >
      {(title || tag) && (
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="accent">
            <Icon name="sparkles" size={11} /> {tag}
          </Badge>
          {title && <span className="text-[13px] font-semibold text-[var(--fc-ink)]">{title}</span>}
          {streaming && <TypingDots />}
        </div>
      )}
      <div className="text-[13.5px] leading-relaxed text-[var(--fc-ink-2)]">{children}</div>
      {footer && <div className="mt-3 border-t border-[var(--fc-border)] pt-2 text-[11px] text-[var(--fc-faint)]">{footer}</div>}
    </div>
  );
}

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="generating">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full bg-[var(--fc-accent)]"
          style={{ animation: `fc-dot 1.1s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
    </span>
  );
}

/** Markdown-lite prose styling for AI text. Pass paragraphs/headings as children. */
export function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("space-y-2.5 text-[13.5px] leading-relaxed text-[var(--fc-ink-2)] [&_h4]:text-[13px] [&_h4]:font-semibold [&_h4]:text-[var(--fc-ink)] [&_strong]:font-semibold [&_strong]:text-[var(--fc-ink)] [&_ul]:space-y-1.5 [&_ul]:pl-1 [&_li]:flex [&_li]:gap-2", className)}>
      {children}
    </div>
  );
}

/** Renders an array of heading + paragraphs + bullets as styled prose. The
 *  canonical way modules render AI-generated documents (briefs, drafts, recs). */
export type ProseBlock = { heading: string; paras?: string[]; bullets?: string[] };
export function ProseSections({ sections }: { sections: readonly ProseBlock[] }) {
  return (
    <Prose>
      {sections.map((s, i) => (
        <div key={i} className="space-y-1.5">
          <h4>{s.heading}</h4>
          {s.paras?.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
          {s.bullets && (
            <ul>
              {s.bullets.map((b, j) => (
                <li key={j}>
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--fc-accent)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </Prose>
  );
}

/* -------------------------------------------------------------------- tabs --- */

/** Segmented control - for switching views within a panel. */
export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  size = "md",
}: {
  tabs: ReadonlyArray<{ id: T; label: string; count?: number }>;
  value: T;
  onChange: (id: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-[var(--fc-border)] bg-[var(--fc-surface-2)] p-0.5" role="tablist">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-md font-medium transition-all",
              size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-[13px]",
              active
                ? "bg-[var(--fc-card)] text-[var(--fc-ink)] shadow-[0_1px_2px_rgba(12,14,19,0.06)]"
                : "text-[var(--fc-muted)] hover:text-[var(--fc-ink)]",
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cx("rounded-full px-1.5 text-[10px] font-semibold tabular-nums", active ? "bg-[var(--fc-accent-wash)] text-[var(--fc-accent)]" : "bg-[var(--fc-border)] text-[var(--fc-muted)]")}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Underline tabs - for page-level sections. */
export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: ReadonlyArray<{ id: T; label: string; count?: number }>;
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-[var(--fc-border)]" role="tablist">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cx(
              "-mb-px border-b-2 px-3 py-2 text-[13px] font-medium transition-colors",
              active
                ? "border-[var(--fc-accent)] text-[var(--fc-ink)]"
                : "border-transparent text-[var(--fc-muted)] hover:text-[var(--fc-ink)]",
            )}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 font-mono text-[11px] tabular-nums text-[var(--fc-faint)]">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------- data table --- */

export type Column<T> = {
  key: string;
  label: string;
  align?: "left" | "right";
  mono?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  getKey,
  highlightRow,
  dense = false,
}: {
  columns: ReadonlyArray<Column<T>>;
  rows: ReadonlyArray<T>;
  getKey: (row: T, i: number) => string;
  highlightRow?: (row: T) => boolean;
  dense?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-[var(--fc-border)] bg-[var(--fc-card)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--fc-border)]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cx(
                  "px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--fc-muted)]",
                  col.align === "right" ? "text-right" : "text-left",
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={getKey(row, i)}
              className={cx(
                "border-b border-[var(--fc-border)] last:border-0 transition-colors",
                highlightRow?.(row) ? "bg-[var(--fc-accent-wash)]" : "hover:bg-[var(--fc-bg)]",
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cx(
                    dense ? "px-3.5 py-2" : "px-3.5 py-3",
                    "text-[13px] text-[var(--fc-ink-2)]",
                    col.align === "right" ? "text-right" : "text-left",
                    col.mono && "font-mono tabular-nums",
                  )}
                >
                  {col.render ? col.render(row) : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------- consensus --- */

/** A compact stacked Buy/Hold/Sell bar. */
export function ConsensusBar({ buy, hold, sell }: { buy: number; hold: number; sell: number }) {
  const total = buy + hold + sell || 1;
  const seg = [
    { v: buy, c: "var(--fc-up)", l: "Buy" },
    { v: hold, c: "var(--fc-warn)", l: "Hold" },
    { v: sell, c: "var(--fc-down)", l: "Sell" },
  ];
  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--fc-surface-2)]">
        {seg.map((s) => (
          <span key={s.l} style={{ width: `${(s.v / total) * 100}%`, background: s.c }} />
        ))}
      </div>
      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[var(--fc-muted)]">
        {seg.map((s) => (
          <span key={s.l} className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.c }} />
            {s.l} <span className="font-mono tabular-nums text-[var(--fc-ink-2)]">{s.v}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- company header --- */

export type CompanyCtx = {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  changePct: number;
  consensus: "Buy" | "Hold" | "Sell";
  earningsIn?: string;
};

/** The sticky company-context header used across the analyst modules. */
export function CompanyHeader({ company, right }: { company: CompanyCtx; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[10px] border border-[var(--fc-border)] bg-[var(--fc-card)] px-4 py-3">
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-base font-semibold text-[var(--fc-accent)]">{company.ticker}</span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-[var(--fc-ink)]">{company.name}</div>
          <div className="text-[11px] text-[var(--fc-muted)]">{company.sector}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold tabular-nums text-[var(--fc-ink)]">${company.price.toFixed(2)}</span>
        <Delta value={company.changePct} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[var(--fc-muted)]">Consensus</span>
        <RatingBadge rating={company.consensus} />
      </div>
      {company.earningsIn && (
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--fc-muted)]">
          <Icon name="calendar" size={13} /> Earnings {company.earningsIn}
        </div>
      )}
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

/* ------------------------------------------------------------ misc bits --- */

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cx("rounded bg-[length:200%_100%]", className)}
      style={{
        backgroundImage: "linear-gradient(90deg, var(--fc-surface-2) 25%, #e9ebef 50%, var(--fc-surface-2) 75%)",
        animation: "fc-shimmer 1.4s ease-in-out infinite",
      }}
    />
  );
}

/** A pill suggestion chip (AI prompt starters, filters). */
export function Chip({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
        active
          ? "border-[var(--fc-accent)] bg-[var(--fc-accent-wash)] text-[var(--fc-accent)]"
          : "border-[var(--fc-border)] bg-[var(--fc-card)] text-[var(--fc-muted)] hover:border-[var(--fc-border-strong)] hover:text-[var(--fc-ink)]",
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({ icon = "sparkles", title, body, cta }: { icon?: IconName; title: string; body?: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[var(--fc-border-strong)] bg-[var(--fc-card)] px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fc-surface-2)] text-[var(--fc-muted)]">
        <Icon name={icon} size={18} />
      </span>
      <p className="mt-3 text-[13px] font-semibold text-[var(--fc-ink)]">{title}</p>
      {body && <p className="mt-1 max-w-xs text-[12px] text-[var(--fc-muted)]">{body}</p>}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
