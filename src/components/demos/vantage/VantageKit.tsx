/**
 * VantageKit - shared presentational primitives for the SecOps Command demo (an agentic
 * security + IT operations command center). Pure, dependency-free building blocks
 * that every SecOps Command module composes: an inline-SVG icon set, cards, KPI stats,
 * the severity scale, deltas, SSR-safe deterministic charts (sparkline, area,
 * bars, donut, score ring), the agent-provenance block, tabs, data tables, a
 * stylized threat map, a MITRE-style coverage matrix, status pills, and the
 * activity feed row.
 *
 * All visuals read the scoped `--vnt-*` tokens from VantageScope, so the dark
 * midnight-terminal theme stays consistent: low-contrast hairlines over heavy
 * shadows, mono tabular numerics, spectral-violet primary on a small share of
 * pixels, and a lime/violet left-border "agent" signature on autonomous output.
 *
 * CONTRACT NOTE: component names, prop shapes, the Severity union, and the
 * SEVERITY_META map below are frozen. Modules (built in parallel) depend on them.
 */
import React from "react";

export const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

/* ------------------------------------------------------------- severity --- */

export type Severity = "critical" | "high" | "medium" | "low" | "info";

/** Canonical severity metadata: ordering, label, token color, and tile wash.
 *  The single source of truth for every severity-colored surface in SecOps Command. */
export const SEVERITY_META: Record<
  Severity,
  { label: string; color: string; order: number }
> = {
  critical: { label: "Critical", color: "var(--vnt-crit)", order: 0 },
  high: { label: "High", color: "var(--vnt-high)", order: 1 },
  medium: { label: "Medium", color: "var(--vnt-med)", order: 2 },
  low: { label: "Low", color: "var(--vnt-low)", order: 3 },
  info: { label: "Info", color: "var(--vnt-info)", order: 4 },
};

export const SEVERITY_ORDER: readonly Severity[] = [
  "critical",
  "high",
  "medium",
  "low",
  "info",
];

/* ----------------------------------------------------------------- wordmark --- */

/** The SecOps Command lockup: a faceted shield/scope mark + wordmark. */
export function Wordmark({ size = "md" }: { size?: "sm" | "md" }) {
  const text = size === "sm" ? "text-sm" : "text-[15px]";
  return (
    <span className="flex items-center gap-2.5">
      <VantageMark size={size === "sm" ? 18 : 22} />
      <span className="leading-none">
        <span className={cx("block font-semibold tracking-tight text-[var(--vnt-ink)]", text)}>
          SecOps Command
        </span>
        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--vnt-faint)]">
          Command Center
        </span>
      </span>
    </span>
  );
}

/** A shield with an inner scope/crosshair in the accent colors. */
export function VantageMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect width="24" height="24" rx="6" fill="#1d2023" />
      <path d="M12 4.2 7 6v4.4c0 3.3 2 5.6 5 6.9 3-1.3 5-3.6 5-6.9V6l-5-1.8Z" fill="none" stroke="var(--vnt-primary)" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="12" cy="10.4" r="1.7" fill="var(--vnt-highlight)" />
      <path d="M12 7.4v1.1M12 12.3v1.1M9 10.4h1.1M13.9 10.4H15" stroke="var(--vnt-accent)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------- icons --- */

export type IconName =
  | "dashboard"
  | "activity"
  | "alert"
  | "shield"
  | "shieldCheck"
  | "crosshair"
  | "radar"
  | "bug"
  | "server"
  | "network"
  | "wifi"
  | "cloud"
  | "database"
  | "cpu"
  | "robot"
  | "key"
  | "lock"
  | "fingerprint"
  | "userCheck"
  | "users"
  | "user"
  | "eye"
  | "gauge"
  | "scale"
  | "fileText"
  | "clipboardCheck"
  | "terminal"
  | "globe"
  | "bell"
  | "search"
  | "filter"
  | "settings"
  | "plus"
  | "check"
  | "close"
  | "copy"
  | "download"
  | "refresh"
  | "external"
  | "dots"
  | "chevron"
  | "chevronDown"
  | "arrowUp"
  | "arrowDown"
  | "trendingUp"
  | "trendingDown"
  | "sparkles"
  | "bolt"
  | "clock"
  | "info"
  | "play"
  | "pause"
  | "link"
  | "mapPin"
  | "layers"
  | "gitBranch"
  | "power"
  | "skull"
  | "flag"
  | "zap";

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
    case "activity":
      return <svg {...c}><path d="M3 12h4l3 8 4-16 3 8h4" /></svg>;
    case "alert":
      return <svg {...c}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 9v5M12 17.5v.5" /></svg>;
    case "shield":
      return <svg {...c}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /></svg>;
    case "shieldCheck":
      return <svg {...c}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path d="m9 11.5 2 2 4-4.5" /></svg>;
    case "crosshair":
      return <svg {...c}><circle cx="12" cy="12" r="8.5" /><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></svg>;
    case "radar":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><path d="M12 12 19 7" /><circle cx="16" cy="9" r="0.9" fill="currentColor" stroke="none" /></svg>;
    case "bug":
      return <svg {...c}><rect x="8" y="7" width="8" height="12" rx="4" /><path d="M9 4l1.5 2M15 4l-1.5 2M4 11h4M16 11h4M4 17h4M16 17h4M12 7v12" /></svg>;
    case "server":
      return <svg {...c}><rect x="3" y="4" width="18" height="7" rx="1.6" /><rect x="3" y="13" width="18" height="7" rx="1.6" /><path d="M7 7.5h.01M7 16.5h.01" /></svg>;
    case "network":
      return <svg {...c}><circle cx="12" cy="5" r="2.2" /><circle cx="5" cy="19" r="2.2" /><circle cx="19" cy="19" r="2.2" /><path d="M12 7.2V12M12 12 6.4 17.2M12 12l5.6 5.2" /></svg>;
    case "wifi":
      return <svg {...c}><path d="M4 9a13 13 0 0 1 16 0M7 12.5a8 8 0 0 1 10 0M10 16a3.5 3.5 0 0 1 4 0" /><path d="M12 19.5h.01" /></svg>;
    case "cloud":
      return <svg {...c}><path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.8 3.8 0 0 1 18 18H7Z" /></svg>;
    case "database":
      return <svg {...c}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>;
    case "cpu":
      return <svg {...c}><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" /></svg>;
    case "robot":
      return <svg {...c}><rect x="4.5" y="8" width="15" height="11" rx="2.5" /><path d="M12 4v4M9.5 13h.01M14.5 13h.01M9 16.5h6" /><circle cx="12" cy="4" r="1.2" /></svg>;
    case "key":
      return <svg {...c}><circle cx="8" cy="14" r="3.5" /><path d="m10.5 11.5 8-8M16 6l2 2M14 8l2 2" /></svg>;
    case "lock":
      return <svg {...c}><rect x="4.5" y="10" width="15" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
    case "fingerprint":
      return <svg {...c}><path d="M6 11a6 6 0 0 1 12 0M9 11a3 3 0 0 1 6 0v2M9 13v2a3 3 0 0 0 1 2M15 13v3M12 11v6M6 14v2" /></svg>;
    case "userCheck":
      return <svg {...c}><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="m16 12 2 2 4-4" /></svg>;
    case "users":
      return <svg {...c}><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8" /><path d="M18 14a6 6 0 0 1 3 5" /></svg>;
    case "user":
      return <svg {...c}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
    case "eye":
      return <svg {...c}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "gauge":
      return <svg {...c}><path d="M4 18a8 8 0 1 1 16 0" /><path d="M12 18 16 9" /><circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none" /></svg>;
    case "scale":
      return <svg {...c}><path d="M12 3v18M7 21h10" /><path d="M6 7h12l-3 6h-6L6 7Z" /><path d="m6 7-3 6h6L6 7ZM18 7l-3 6h6l-3-6Z" /></svg>;
    case "fileText":
      return <svg {...c}><path d="M14 3v5h5" /><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z" /><path d="M8 13h8M8 17h6" /></svg>;
    case "clipboardCheck":
      return <svg {...c}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="m9 13 2 2 4-4" /></svg>;
    case "terminal":
      return <svg {...c}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M13 15h4" /></svg>;
    case "globe":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></svg>;
    case "bell":
      return <svg {...c}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
    case "search":
      return <svg {...c}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case "filter":
      return <svg {...c}><path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" /></svg>;
    case "settings":
      return <svg {...c}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L16 3H8l-.6 2.5a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2L8 21h8l.6-2.5a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5A7 7 0 0 0 19 12Z" /></svg>;
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
    case "chevron":
      return <svg {...c}><path d="m9 6 6 6-6 6" /></svg>;
    case "chevronDown":
      return <svg {...c}><path d="m6 9 6 6 6-6" /></svg>;
    case "arrowUp":
      return <svg {...c}><path d="M12 19V5M6 11l6-6 6 6" /></svg>;
    case "arrowDown":
      return <svg {...c}><path d="M12 5v14M6 13l6 6 6-6" /></svg>;
    case "trendingUp":
      return <svg {...c}><path d="m3 17 6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>;
    case "trendingDown":
      return <svg {...c}><path d="m3 7 6 6 4-4 8 8" /><path d="M17 17h4v-4" /></svg>;
    case "sparkles":
      return <svg {...c}><path d="M12 3l1.8 4.8L18 9l-4.2 1.2L12 15l-1.8-4.8L6 9l4.2-1.2L12 3Z" /><path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14Z" /></svg>;
    case "bolt":
      return <svg {...c}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" /></svg>;
    case "zap":
      return <svg {...c}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" /></svg>;
    case "clock":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>;
    case "info":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>;
    case "play":
      return <svg {...c}><path d="M8 5v14l11-7-11-7Z" /></svg>;
    case "pause":
      return <svg {...c}><path d="M9 5v14M15 5v14" /></svg>;
    case "link":
      return <svg {...c}><path d="M9 15 15 9" /><path d="M11 6.5 13 4.5a4 4 0 0 1 6 6l-2 2" /><path d="M13 17.5 11 19.5a4 4 0 0 1-6-6l2-2" /></svg>;
    case "mapPin":
      return <svg {...c}><path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case "layers":
      return <svg {...c}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>;
    case "gitBranch":
      return <svg {...c}><circle cx="6" cy="6" r="2.4" /><circle cx="6" cy="18" r="2.4" /><circle cx="18" cy="8" r="2.4" /><path d="M6 8.4v7.2M18 10.4c0 4-3 4.6-6 4.6" /></svg>;
    case "power":
      return <svg {...c}><path d="M12 4v8" /><path d="M7.5 7a7 7 0 1 0 9 0" /></svg>;
    case "skull":
      return <svg {...c}><path d="M12 3a8 8 0 0 0-5 14v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2a8 8 0 0 0-5-14Z" /><circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none" /><path d="M11 17h2" /></svg>;
    case "flag":
      return <svg {...c}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></svg>;
  }
}

/* ------------------------------------------------------------- typographic --- */

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cx("font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--vnt-faint)]", className)}>
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
        <h2 className="text-base font-semibold tracking-tight text-[var(--vnt-ink)]">{title}</h2>
        {hint && <p className="mt-0.5 text-[13px] text-[var(--vnt-muted)]">{hint}</p>}
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
        "rounded-[12px] border border-[var(--vnt-border)] bg-[var(--vnt-card)]",
        padded && "p-5",
        hover && "transition-colors hover:border-[var(--vnt-border-strong)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- buttons --- */

type BtnVariant = "primary" | "lime" | "outline" | "ghost" | "danger";
export function Button({
  children,
  variant = "primary",
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
    "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all disabled:opacity-50";
  const sizes = size === "sm" ? "px-3.5 py-1.5 text-xs" : "px-4 py-2 text-[13px]";
  const variants: Record<BtnVariant, string> = {
    primary: "bg-[var(--vnt-primary)] text-[#0e0f11] hover:bg-[var(--vnt-primary-700)]",
    lime: "bg-[var(--vnt-highlight)] text-[#0e0f11] hover:brightness-95",
    outline:
      "border border-[var(--vnt-border-strong)] bg-transparent text-[var(--vnt-ink)] hover:bg-[var(--vnt-surface-2)]",
    ghost: "text-[var(--vnt-muted)] hover:bg-[var(--vnt-surface-2)] hover:text-[var(--vnt-ink)]",
    danger: "bg-[var(--vnt-crit)] text-white hover:brightness-110",
  };
  return (
    <button className={cx(base, sizes, variants[variant], className)} {...rest}>
      {icon && <Icon name={icon} size={size === "sm" ? 13 : 15} />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ badges --- */

export type Tone = "neutral" | "primary" | "lime" | "teal" | "up" | "down" | "warn" | "crit";
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
    neutral: "border-[var(--vnt-border)] bg-[var(--vnt-surface-2)] text-[var(--vnt-muted)]",
    primary: "border-[var(--vnt-primary)]/30 bg-[var(--vnt-primary-wash)] text-[var(--vnt-primary)]",
    lime: "border-[var(--vnt-highlight)]/30 bg-[var(--vnt-highlight-wash)] text-[var(--vnt-highlight)]",
    teal: "border-[var(--vnt-accent)]/30 bg-[var(--vnt-accent-wash)] text-[var(--vnt-accent)]",
    up: "border-[var(--vnt-up)]/30 bg-[var(--vnt-up)]/10 text-[var(--vnt-up)]",
    down: "border-[var(--vnt-down)]/30 bg-[var(--vnt-down)]/10 text-[var(--vnt-down)]",
    warn: "border-[var(--vnt-warn)]/30 bg-[var(--vnt-warn)]/10 text-[var(--vnt-warn)]",
    crit: "border-[var(--vnt-crit)]/30 bg-[var(--vnt-crit)]/12 text-[var(--vnt-crit)]",
  };
  const dotColor: Record<Tone, string> = {
    neutral: "var(--vnt-faint)",
    primary: "var(--vnt-primary)",
    lime: "var(--vnt-highlight)",
    teal: "var(--vnt-accent)",
    up: "var(--vnt-up)",
    down: "var(--vnt-down)",
    warn: "var(--vnt-warn)",
    crit: "var(--vnt-crit)",
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
          <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: dotColor[tone], animation: "vnt-pulse-ring 1.8s ease-out infinite" }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: dotColor[tone] }} />
        </span>
      )}
      {children}
    </span>
  );
}

/** A severity-colored capsule driven by the canonical SEVERITY_META scale. */
export function SeverityBadge({ level, withDot = false }: { level: Severity; withDot?: boolean }) {
  const m = SEVERITY_META[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{ color: m.color, borderColor: `color-mix(in srgb, ${m.color} 35%, transparent)`, background: `color-mix(in srgb, ${m.color} 12%, transparent)` }}
    >
      {withDot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />}
      {m.label}
    </span>
  );
}

/** A small online/degraded/offline status pill with an optional live pulse. */
export type SystemStatus = "online" | "degraded" | "offline" | "unknown";
export function StatusPill({ status, label, live = false }: { status: SystemStatus; label?: string; live?: boolean }) {
  const map: Record<SystemStatus, { color: string; text: string }> = {
    online: { color: "var(--vnt-up)", text: "Online" },
    degraded: { color: "var(--vnt-warn)", text: "Degraded" },
    offline: { color: "var(--vnt-crit)", text: "Offline" },
    unknown: { color: "var(--vnt-faint)", text: "Unknown" },
  };
  const m = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: m.color }}>
      <span className="relative flex h-2 w-2">
        {live && status === "online" && (
          <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: m.color, animation: "vnt-pulse-ring 1.8s ease-out infinite" }} />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: m.color }} />
      </span>
      {label ?? m.text}
    </span>
  );
}

/* ------------------------------------------------------------------ deltas --- */

/** A colored, mono, signed change with a directional glyph. `invert` flips the
 *  good/bad coloring (e.g. a rising incident count is bad, not good). */
export function Delta({
  value,
  suffix = "%",
  size = "sm",
  invert = false,
}: {
  value: number;
  suffix?: string;
  size?: "sm" | "md";
  invert?: boolean;
}) {
  const up = value >= 0;
  const good = invert ? !up : up;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-0.5 font-mono tabular-nums font-medium",
        size === "md" ? "text-sm" : "text-[12px]",
      )}
      style={{ color: good ? "var(--vnt-up)" : "var(--vnt-down)" }}
    >
      <span aria-hidden="true">{up ? "▲" : "▼"}</span>
      {up ? "+" : ""}
      {value.toFixed(1)}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------- stat cards --- */

export function StatCard({
  label,
  value,
  delta,
  deltaInvert = false,
  hint,
  spark,
  accent,
  icon,
}: {
  label: string;
  value: string;
  delta?: number;
  deltaInvert?: boolean;
  hint?: string;
  spark?: number[];
  accent?: string;
  icon?: IconName;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {icon && (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--vnt-surface-2)]" style={{ color: accent ?? "var(--vnt-muted)" }}>
              <Icon name={icon} size={13} />
            </span>
          )}
          <p className="text-[12px] font-medium text-[var(--vnt-muted)]">{label}</p>
        </div>
        {/* Sparkline is decorative; on cramped 2-col mobile cards it would crowd
            the label, so it only appears once the card has room (sm+). */}
        {spark && (
          <span className="hidden shrink-0 sm:block">
            <Sparkline values={spark} color={accent} />
          </span>
        )}
      </div>
      <div className="mt-2.5 font-mono text-[28px] font-semibold leading-none tracking-tight tabular-nums text-[var(--vnt-ink)]">
        {value}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {delta !== undefined && <Delta value={delta} invert={deltaInvert} />}
        {hint && <span className="text-[12px] text-[var(--vnt-faint)]">{hint}</span>}
      </div>
    </Card>
  );
}

/** A compact recessed label/value tile (the metric-grid building block). */
export function MetricTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--vnt-border)] bg-[var(--vnt-surface-2)] p-2.5">
      <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--vnt-faint)]">{label}</div>
      <div className="mt-1 font-mono text-[15px] font-semibold tabular-nums" style={{ color: tone ?? "var(--vnt-ink)" }}>{value}</div>
      {sub && <div className="mt-0.5 text-[10px] text-[var(--vnt-faint)]">{sub}</div>}
    </div>
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
  const stroke = color ?? (values[values.length - 1] >= values[0] ? "var(--vnt-up)" : "var(--vnt-down)");
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

/** A filled area trend chart. Deterministic, SSR-safe. */
export function AreaMini({
  values,
  width = 320,
  height = 90,
  color = "var(--vnt-primary)",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 4;
  const xy = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = xy.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${(width - pad).toFixed(1)} ${height - pad} L${pad} ${height - pad} Z`;
  const gid = `vnt-area-${values.length}-${Math.round(max)}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A small vertical bar chart. Deterministic, SSR-safe. */
export function BarMini({
  bars,
  height = 90,
  max,
}: {
  bars: ReadonlyArray<{ label?: string; value: number; color?: string }>;
  height?: number;
  max?: number;
}) {
  const top = max ?? Math.max(...bars.map((b) => b.value), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {bars.map((b, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
          <div
            className="w-full rounded-t-[3px]"
            style={{ height: `${Math.max(2, (b.value / top) * (height - 16))}px`, background: b.color ?? "var(--vnt-primary)", opacity: 0.85 }}
          />
          {b.label && <span className="font-mono text-[9px] text-[var(--vnt-faint)]">{b.label}</span>}
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- donut --- */

export type DonutSegment = { label: string; value: number; color: string };
/** A deterministic donut/ring with an optional center label. SSR-safe. */
export function Donut({
  segments,
  size = 120,
  thickness = 14,
  centerLabel,
  centerSub,
}: {
  segments: readonly DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const cExtent = 2 * Math.PI * r;
  // Cumulative arc offsets, computed without mutation (no reassign during render).
  const arcs = segments.map((s, i) => {
    const len = (s.value / total) * cExtent;
    const start = segments.slice(0, i).reduce((a, x) => a + (x.value / total) * cExtent, 0);
    return { color: s.color, len, start };
  });
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--vnt-surface-2)" strokeWidth={thickness} />
        {arcs.map((a, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={a.color}
            strokeWidth={thickness}
            strokeDasharray={`${a.len} ${cExtent - a.len}`}
            strokeDashoffset={-a.start}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      {(centerLabel || centerSub) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerLabel && <span className="font-mono text-[20px] font-semibold tabular-nums text-[var(--vnt-ink)]">{centerLabel}</span>}
          {centerSub && <span className="text-[10px] uppercase tracking-wide text-[var(--vnt-faint)]">{centerSub}</span>}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- score ring --- */

/** A big single-value posture/score ring (0-max), tone-colored. SSR-safe. */
export function ScoreRing({
  score,
  max = 100,
  label,
  sub,
  tone = "var(--vnt-primary)",
  size = 140,
  thickness = 12,
}: {
  score: number;
  max?: number;
  label?: string;
  sub?: string;
  tone?: string;
  size?: number;
  thickness?: number;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / max));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--vnt-surface-2)" strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={thickness}
          strokeDasharray={`${(c * pct).toFixed(1)} ${c.toFixed(1)}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[30px] font-semibold leading-none tabular-nums" style={{ color: tone }}>{score}</span>
        {label && <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[var(--vnt-muted)]">{label}</span>}
        {sub && <span className="text-[10px] text-[var(--vnt-faint)]">{sub}</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ severity bar --- */

/** A compact stacked severity bar (critical -> low), with a legend + counts. */
export function SeverityBar({
  counts,
  showLegend = true,
}: {
  counts: Partial<Record<Severity, number>>;
  showLegend?: boolean;
}) {
  const segs = SEVERITY_ORDER.filter((s) => (counts[s] ?? 0) > 0).map((s) => ({
    s,
    v: counts[s] ?? 0,
    c: SEVERITY_META[s].color,
  }));
  const total = segs.reduce((a, x) => a + x.v, 0) || 1;
  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--vnt-surface-2)]">
        {segs.map((s) => (
          <span key={s.s} style={{ width: `${(s.v / total) * 100}%`, background: s.c }} />
        ))}
      </div>
      {showLegend && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11px] text-[var(--vnt-muted)]">
          {SEVERITY_ORDER.filter((s) => (counts[s] ?? 0) > 0).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: SEVERITY_META[s].color }} />
              {SEVERITY_META[s].label} <span className="font-mono tabular-nums text-[var(--vnt-ink-2)]">{counts[s]}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------- AI provenance --- */

/** The recurring "produced by an autonomous agent" signature: a lime-left-border
 *  block with an agent tag. Wrap any agent-authored content (triage, playbooks). */
export function AIBlock({
  children,
  title,
  agent,
  tag = "Agent",
  streaming = false,
  footer,
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  agent?: string;
  tag?: string;
  streaming?: boolean;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-r-[12px] border border-l-2 border-[var(--vnt-border)] border-l-[var(--vnt-highlight)] bg-[var(--vnt-card)] p-4",
        className,
      )}
    >
      {(title || agent || tag) && (
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge tone="lime">
            <Icon name="sparkles" size={11} /> {tag}
          </Badge>
          {agent && <span className="font-mono text-[11px] text-[var(--vnt-accent)]">{agent}</span>}
          {title && <span className="text-[13px] font-semibold text-[var(--vnt-ink)]">{title}</span>}
          {streaming && <TypingDots />}
        </div>
      )}
      <div className="text-[13.5px] leading-relaxed text-[var(--vnt-ink-2)]">{children}</div>
      {footer && <div className="mt-3 border-t border-[var(--vnt-border)] pt-2 text-[11px] text-[var(--vnt-faint)]">{footer}</div>}
    </div>
  );
}

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="generating">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1 w-1 rounded-full bg-[var(--vnt-highlight)]" style={{ animation: `vnt-dot 1.1s ease-in-out ${i * 0.15}s infinite` }} />
      ))}
    </span>
  );
}

/** Markdown-lite prose styling for agent text. */
export function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("space-y-2.5 text-[13.5px] leading-relaxed text-[var(--vnt-ink-2)] [&_h4]:text-[13px] [&_h4]:font-semibold [&_h4]:text-[var(--vnt-ink)] [&_strong]:font-semibold [&_strong]:text-[var(--vnt-ink)] [&_ul]:space-y-1.5 [&_ul]:pl-1 [&_li]:flex [&_li]:gap-2", className)}>
      {children}
    </div>
  );
}

export type ProseBlock = { heading: string; paras?: string[]; bullets?: string[] };
export function ProseSections({ sections }: { sections: readonly ProseBlock[] }) {
  return (
    <Prose>
      {sections.map((s, i) => (
        <div key={i} className="space-y-1.5">
          <h4>{s.heading}</h4>
          {s.paras?.map((p, j) => <p key={j}>{p}</p>)}
          {s.bullets && (
            <ul>
              {s.bullets.map((b, j) => (
                <li key={j}>
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--vnt-highlight)]" />
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
    <div className="inline-flex items-center rounded-full border border-[var(--vnt-border)] bg-[var(--vnt-surface-2)] p-0.5" role="tablist">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-full font-medium transition-all",
              size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3.5 py-1.5 text-[13px]",
              active ? "bg-[var(--vnt-raised)] text-[var(--vnt-ink)]" : "text-[var(--vnt-muted)] hover:text-[var(--vnt-ink)]",
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cx("rounded-full px-1.5 text-[10px] font-semibold tabular-nums", active ? "bg-[var(--vnt-primary-wash)] text-[var(--vnt-primary)]" : "bg-[var(--vnt-border)] text-[var(--vnt-muted)]")}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

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
    <div className="flex items-center gap-1 overflow-x-auto border-b border-[var(--vnt-border)]" role="tablist">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cx(
              "-mb-px shrink-0 border-b-2 px-3 py-2 text-[13px] font-medium transition-colors",
              active ? "border-[var(--vnt-primary)] text-[var(--vnt-ink)]" : "border-transparent text-[var(--vnt-muted)] hover:text-[var(--vnt-ink)]",
            )}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 font-mono text-[11px] tabular-nums text-[var(--vnt-faint)]">{t.count}</span>}
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
  onRowClick,
  dense = false,
}: {
  columns: ReadonlyArray<Column<T>>;
  rows: ReadonlyArray<T>;
  getKey: (row: T, i: number) => string;
  highlightRow?: (row: T) => boolean;
  onRowClick?: (row: T) => void;
  dense?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-[12px] border border-[var(--vnt-border)] bg-[var(--vnt-card)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--vnt-border)]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cx(
                  "px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--vnt-muted)]",
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
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cx(
                "border-b border-[var(--vnt-border)] last:border-0 transition-colors",
                onRowClick && "cursor-pointer",
                highlightRow?.(row) ? "bg-[var(--vnt-primary-wash)]" : "hover:bg-[var(--vnt-surface-2)]",
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cx(
                    dense ? "px-3.5 py-2" : "px-3.5 py-3",
                    "text-[13px] text-[var(--vnt-ink-2)]",
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

/* --------------------------------------------------------- activity feed --- */

/** A single live-feed row: an icon chip, message, source, and timestamp. */
export function ActivityRow({
  icon,
  tone = "var(--vnt-muted)",
  children,
  source,
  time,
  live = false,
}: {
  icon: IconName;
  tone?: string;
  children: React.ReactNode;
  source?: string;
  time: string;
  live?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 border-b border-[var(--vnt-border)] px-4 py-2.5 last:border-0 hover:bg-[var(--vnt-surface-2)]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)]" style={{ color: tone }}>
        <Icon name={icon} size={14} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--vnt-ink-2)]">{children}</span>
      {source && <span className="hidden shrink-0 text-[11px] text-[var(--vnt-muted)] sm:inline">{source}</span>}
      <span className="flex shrink-0 items-center gap-1.5">
        {live && <span className="h-1.5 w-1.5 rounded-full bg-[var(--vnt-up)]" style={{ animation: "vnt-blink 1.6s ease-in-out infinite" }} />}
        <span className="font-mono text-[11px] tabular-nums text-[var(--vnt-faint)]">{time}</span>
      </span>
    </li>
  );
}

/* ------------------------------------------------------------- threat map --- */

export type ThreatPoint = { x: number; y: number; level: Severity; label?: string };
/** A stylized dotted-grid "world" with plotted threat points. Purely decorative,
 *  deterministic. Coordinates are 0-100 in both axes. */
export function ThreatMap({ points, height = 220 }: { points: readonly ThreatPoint[]; height?: number }) {
  const cols = 28;
  const rows = 12;
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let cI = 0; cI < cols; cI++) {
      // a loose landmass silhouette so it reads as a map, not a plain grid
      const cx2 = (cI / (cols - 1)) * 100;
      const cy2 = (r / (rows - 1)) * 100;
      const land =
        (cx2 > 8 && cx2 < 32 && cy2 > 18 && cy2 < 78) ||
        (cx2 > 40 && cx2 < 58 && cy2 > 12 && cy2 < 88) ||
        (cx2 > 62 && cx2 < 92 && cy2 > 20 && cy2 < 70);
      if (!land) continue;
      dots.push(<circle key={`${r}-${cI}`} cx={cx2} cy={cy2} r="0.6" fill="var(--vnt-border-strong)" />);
    }
  }
  return (
    <div className="relative overflow-hidden rounded-[12px] border border-[var(--vnt-border)] bg-[var(--vnt-surface-2)]" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
        {dots}
        {points.map((p, i) => {
          const c = SEVERITY_META[p.level].color;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="2.6" fill={c} opacity="0.25">
                <animate attributeName="r" values="1.5;4;1.5" dur="2.4s" repeatCount="indefinite" begin={`${(i % 5) * 0.3}s`} />
                <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" begin={`${(i % 5) * 0.3}s`} />
              </circle>
              <circle cx={p.x} cy={p.y} r="1.1" fill={c} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------ mitre matrix --- */

export type MitreTactic = { name: string; techniques: ReadonlyArray<{ name: string; covered: boolean }> };
/** An ATT&CK-style coverage matrix: columns of tactics, cells of techniques
 *  shaded by whether a detection covers them. */
export function MitreMatrix({ tactics }: { tactics: readonly MitreTactic[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2">
        {tactics.map((t) => (
          <div key={t.name} className="w-[116px] shrink-0">
            <div className="mb-1.5 truncate font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--vnt-muted)]" title={t.name}>
              {t.name}
            </div>
            <div className="space-y-1">
              {t.techniques.map((tech) => (
                <div
                  key={tech.name}
                  title={tech.name}
                  className={cx(
                    "truncate rounded border px-1.5 py-1 text-[10px]",
                    tech.covered
                      ? "border-[var(--vnt-accent)]/30 bg-[var(--vnt-accent-wash)] text-[var(--vnt-accent)]"
                      : "border-[var(--vnt-border)] bg-[var(--vnt-surface-2)] text-[var(--vnt-faint)]",
                  )}
                >
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ misc bits --- */

export function ProgressBar({ value, max = 100, color = "var(--vnt-primary)" }: { value: number; max?: number; color?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--vnt-surface-2)]">
      <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cx("rounded bg-[length:200%_100%]", className)}
      style={{
        backgroundImage: "linear-gradient(90deg, var(--vnt-surface-2) 25%, #23272b 50%, var(--vnt-surface-2) 75%)",
        animation: "vnt-shimmer 1.4s ease-in-out infinite",
      }}
    />
  );
}

export function Chip({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
        active
          ? "border-[var(--vnt-primary)] bg-[var(--vnt-primary-wash)] text-[var(--vnt-primary)]"
          : "border-[var(--vnt-border)] bg-[var(--vnt-card)] text-[var(--vnt-muted)] hover:border-[var(--vnt-border-strong)] hover:text-[var(--vnt-ink)]",
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({ icon = "sparkles", title, body, cta }: { icon?: IconName; title: string; body?: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[var(--vnt-border-strong)] bg-[var(--vnt-card)] px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--vnt-surface-2)] text-[var(--vnt-muted)]">
        <Icon name={icon} size={18} />
      </span>
      <p className="mt-3 text-[13px] font-semibold text-[var(--vnt-ink)]">{title}</p>
      {body && <p className="mt-1 max-w-xs text-[12px] text-[var(--vnt-muted)]">{body}</p>}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
