/**
 * AtriumKit - shared presentational primitives for the Workplace AI demo. Pure,
 * dependency-free building blocks (inline-SVG icon set, glass + solid cards, KPI
 * stats, badges, toggles, SSR-safe sparklines, the AI block, tabs, data tables,
 * app tiles, chat bubbles) that every Workplace AI module composes. All visuals read
 * the scoped `--atr-*` tokens from AtriumScope, so the light "Aurora" theme stays
 * consistent: frosted-glass surfaces over a soft violet-to-cyan field, a single
 * violet accent with a cyan partner, hairline borders, and a gradient AI signature.
 *
 * Workplace AI is an unbranded concept: a redesign of the corporate employee workspace
 * that puts every tool in one place and lets AI automate the busywork. Nothing
 * here talks to a live server; all content is illustrative sample data.
 */
import React from "react";

export const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

/** The Aurora accent gradient, reused on the wordmark, primary CTA, and AI marks. */
export const ATR_GRADIENT = "linear-gradient(135deg, var(--atr-accent) 0%, var(--atr-accent-2) 100%)";

/* ----------------------------------------------------------------- wordmark --- */

/** The Workplace AI lockup: an open-arch mark + wordmark in the gradient. */
export function Wordmark({ size = "md", subtitle = true }: { size?: "sm" | "md"; subtitle?: boolean }) {
  const text = size === "sm" ? "text-sm" : "text-[15px]";
  return (
    <span className="flex items-center gap-2.5">
      <AtriumMark size={size === "sm" ? 18 : 22} />
      <span className="leading-none">
        <span
          className={cx("block bg-clip-text font-semibold tracking-tight text-transparent", text)}
          style={{ backgroundImage: ATR_GRADIENT }}
        >
          Workplace AI
        </span>
        {subtitle && (
          <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--atr-faint)]">
            Employee workspace
          </span>
        )}
      </span>
    </span>
  );
}

/** A rounded-square "open atrium arch" mark filled with the accent gradient. */
export function AtriumMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id="atr-mark" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--atr-accent)" />
          <stop offset="1" stopColor="var(--atr-accent-2)" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#atr-mark)" />
      {/* an open arch / doorway: the bright heart of the building */}
      <path d="M7 18V11a5 5 0 0 1 10 0v7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 18v-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/* -------------------------------------------------------------------- icons --- */

export type IconName =
  | "home"
  | "grid"
  | "bolt"
  | "lifebuoy"
  | "scale"
  | "users"
  | "sparkles"
  | "search"
  | "bell"
  | "settings"
  | "chevron"
  | "chevronDown"
  | "close"
  | "check"
  | "checkCircle"
  | "plus"
  | "send"
  | "clock"
  | "calendar"
  | "fileText"
  | "shield"
  | "lock"
  | "download"
  | "external"
  | "alert"
  | "info"
  | "star"
  | "filter"
  | "refresh"
  | "arrowUp"
  | "arrowDown"
  | "arrowRight"
  | "trendingUp"
  | "user"
  | "mail"
  | "building"
  | "briefcase"
  | "globe"
  | "dots"
  | "plug"
  | "laptop"
  | "creditCard"
  | "umbrella"
  | "megaphone"
  | "play"
  | "pause"
  | "link"
  | "heart"
  | "activity"
  | "layers"
  | "copy"
  | "gift"
  | "key"
  | "rocket"
  | "target"
  | "database"
  | "palette"
  | "code"
  | "message"
  | "wrench"
  | "ticket"
  | "wand"
  | "phone";

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
    case "home":
      return <svg {...c}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>;
    case "grid":
      return <svg {...c}><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></svg>;
    case "bolt":
      return <svg {...c}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" /></svg>;
    case "lifebuoy":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.6" /><path d="m5.6 5.6 3.3 3.3M15.1 15.1l3.3 3.3M18.4 5.6l-3.3 3.3M8.9 15.1l-3.3 3.3" /></svg>;
    case "scale":
      return <svg {...c}><path d="M12 3v18M7 21h10" /><path d="M6 7h12l-3 6h-6L6 7Z" /><path d="m6 7-3 6h6L6 7ZM18 7l-3 6h6l-3-6Z" /></svg>;
    case "users":
      return <svg {...c}><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8" /><path d="M18 14a6 6 0 0 1 3 5" /></svg>;
    case "sparkles":
      return <svg {...c}><path d="M12 3l1.8 4.8L18 9l-4.2 1.2L12 15l-1.8-4.8L6 9l4.2-1.2L12 3Z" /><path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14Z" /></svg>;
    case "search":
      return <svg {...c}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case "bell":
      return <svg {...c}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
    case "settings":
      return <svg {...c}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L16 3H8l-.6 2.5a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2L8 21h8l.6-2.5a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5A7 7 0 0 0 19 12Z" /></svg>;
    case "chevron":
      return <svg {...c}><path d="m9 6 6 6-6 6" /></svg>;
    case "chevronDown":
      return <svg {...c}><path d="m6 9 6 6 6-6" /></svg>;
    case "close":
      return <svg {...c}><path d="M6 6l12 12M18 6 6 18" /></svg>;
    case "check":
      return <svg {...c}><path d="M5 12.5 10 17l9-10" /></svg>;
    case "checkCircle":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>;
    case "plus":
      return <svg {...c}><path d="M12 5v14M5 12h14" /></svg>;
    case "send":
      return <svg {...c}><path d="M4 12 20 4l-6 16-3-7-7-1Z" /></svg>;
    case "clock":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>;
    case "calendar":
      return <svg {...c}><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v3M16 3v3" /></svg>;
    case "fileText":
      return <svg {...c}><path d="M14 3v5h5" /><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z" /><path d="M8 13h8M8 17h6" /></svg>;
    case "shield":
      return <svg {...c}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /></svg>;
    case "lock":
      return <svg {...c}><rect x="4.5" y="10" width="15" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
    case "download":
      return <svg {...c}><path d="M12 4v11" /><path d="m7 11 5 4 5-4" /><path d="M5 20h14" /></svg>;
    case "external":
      return <svg {...c}><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5H5V5h5" /></svg>;
    case "alert":
      return <svg {...c}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 9v5M12 17.5v.5" /></svg>;
    case "info":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.5" /></svg>;
    case "star":
      return <svg {...c}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.8 6.6 20l1-6.1L3.2 9.5l6.1-.9L12 3Z" /></svg>;
    case "filter":
      return <svg {...c}><path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" /></svg>;
    case "refresh":
      return <svg {...c}><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>;
    case "arrowUp":
      return <svg {...c}><path d="M12 19V5M6 11l6-6 6 6" /></svg>;
    case "arrowDown":
      return <svg {...c}><path d="M12 5v14M6 13l6 6 6-6" /></svg>;
    case "arrowRight":
      return <svg {...c}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "trendingUp":
      return <svg {...c}><path d="m3 17 6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>;
    case "user":
      return <svg {...c}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
    case "mail":
      return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case "building":
      return <svg {...c}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" /></svg>;
    case "briefcase":
      return <svg {...c}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></svg>;
    case "globe":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></svg>;
    case "dots":
      return <svg {...c}><circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" /></svg>;
    case "plug":
      return <svg {...c}><path d="M9 3v5M15 3v5" /><path d="M7 8h10v3a5 5 0 0 1-10 0V8Z" /><path d="M12 16v5" /></svg>;
    case "laptop":
      return <svg {...c}><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 20h20" /></svg>;
    case "creditCard":
      return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></svg>;
    case "umbrella":
      return <svg {...c}><path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Z" /><path d="M12 12v6a2.5 2.5 0 0 0 5 0" /></svg>;
    case "megaphone":
      return <svg {...c}><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z" /><path d="M15 8a4 4 0 0 1 0 8" /></svg>;
    case "play":
      return <svg {...c}><path d="M8 5v14l11-7-11-7Z" /></svg>;
    case "pause":
      return <svg {...c}><path d="M9 5v14M15 5v14" /></svg>;
    case "link":
      return <svg {...c}><path d="M9 15 15 9" /><path d="M11 6.5 13 4.5a4 4 0 0 1 6 6l-2 2" /><path d="M13 17.5 11 19.5a4 4 0 0 1-6-6l2-2" /></svg>;
    case "heart":
      return <svg {...c}><path d="M12 20s-7-4.3-9.3-8.3C1 8.5 2.5 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.5 0 5 3.5 3.3 6.7C19 15.7 12 20 12 20Z" /></svg>;
    case "activity":
      return <svg {...c}><path d="M3 12h4l3 8 4-16 3 8h4" /></svg>;
    case "layers":
      return <svg {...c}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>;
    case "copy":
      return <svg {...c}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>;
    case "gift":
      return <svg {...c}><rect x="3" y="8" width="18" height="5" rx="1" /><path d="M5 13v8h14v-8M12 8v13" /><path d="M12 8S10 3 7.5 4.5 9 8 12 8ZM12 8s2-5 4.5-3.5S15 8 12 8Z" /></svg>;
    case "key":
      return <svg {...c}><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M17 6l2 2M14 9l2 2" /></svg>;
    case "rocket":
      return <svg {...c}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M9 13a14 14 0 0 1 8-9c2.5 0 3 .5 3 3a14 14 0 0 1-9 8l-2-2Z" /><circle cx="15" cy="9" r="1.4" /></svg>;
    case "target":
      return <svg {...c}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></svg>;
    case "database":
      return <svg {...c}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>;
    case "palette":
      return <svg {...c}><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.5 1-2 2.5-2H18a3 3 0 0 0 3-3c0-5-4-9-9-9Z" /><circle cx="8" cy="11" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" /><circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" /></svg>;
    case "code":
      return <svg {...c}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></svg>;
    case "message":
      return <svg {...c}><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4V6a1 1 0 0 1 1-1Z" /></svg>;
    case "wrench":
      return <svg {...c}><path d="M14.5 6.5a4 4 0 0 1-5 5L4 17l3 3 5.5-5.5a4 4 0 0 1 5-5l-2.5-2.5 1.5-1.5-2.5 1Z" /></svg>;
    case "ticket":
      return <svg {...c}><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" /><path d="M14 6v12" strokeDasharray="2 2" /></svg>;
    case "wand":
      return <svg {...c}><path d="M15 4 20 9 9 20 4 15 15 4Z" /><path d="m13 6 5 5" /><path d="M18 3v2M21 6h-2M5 11v2M3 12h2" /></svg>;
    case "phone":
      return <svg {...c}><path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>;
  }
}

/* ------------------------------------------------------------- typographic --- */

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cx("font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--atr-faint)]", className)}>
      {children}
    </p>
  );
}

/** Gradient display text, for hero headlines and section accents. */
export function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cx("bg-clip-text text-transparent", className)} style={{ backgroundImage: ATR_GRADIENT }}>
      {children}
    </span>
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
        <h2 className="text-base font-semibold tracking-tight text-[var(--atr-ink)]">{title}</h2>
        {hint && <p className="mt-0.5 text-[13px] text-[var(--atr-muted)]">{hint}</p>}
      </div>
      {right}
    </div>
  );
}

/* --------------------------------------------------------------------- cards --- */

/** A solid card - use for dense content (tables, lists) where legibility matters. */
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
        "rounded-[14px] border border-[var(--atr-border)] bg-[var(--atr-card)]",
        padded && "p-5",
        hover && "transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-10px_rgba(91,74,255,0.18)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** The signature Aurora surface: frosted glass over the violet-cyan field. Use
 *  for feature panels, hero tiles, and anything you want to feel premium. */
export function GlassCard({
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
        "rounded-[16px] border border-[var(--atr-glass-border)] bg-[var(--atr-glass)] shadow-[0_8px_30px_-12px_rgba(20,18,31,0.12)] backdrop-blur-xl",
        padded && "p-5",
        hover && "transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(91,74,255,0.28)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- buttons --- */

type BtnVariant = "accent" | "ink" | "outline" | "ghost";
export function Button({
  children,
  variant = "accent",
  size = "md",
  icon,
  iconRight,
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  variant?: BtnVariant;
  size?: "sm" | "md";
  icon?: IconName;
  iconRight?: IconName;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all disabled:opacity-50";
  const sizes = size === "sm" ? "px-3.5 py-1.5 text-xs" : "px-5 py-2.5 text-[13px]";
  const variants: Record<BtnVariant, string> = {
    accent: "text-white shadow-[0_6px_18px_-6px_rgba(91,74,255,0.5)] hover:brightness-[1.06]",
    ink: "bg-[var(--atr-ink)] text-white hover:bg-black",
    outline:
      "border border-[var(--atr-border-strong)] bg-[var(--atr-card)] text-[var(--atr-ink)] hover:bg-[var(--atr-surface-2)]",
    ghost: "text-[var(--atr-muted)] hover:bg-[var(--atr-surface-2)] hover:text-[var(--atr-ink)]",
  };
  return (
    <button
      className={cx(base, sizes, variants[variant], className)}
      style={variant === "accent" ? { backgroundImage: ATR_GRADIENT } : undefined}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 13 : 15} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 13 : 15} />}
    </button>
  );
}

/* ------------------------------------------------------------------ badges --- */

export type Tone = "neutral" | "accent" | "up" | "down" | "warn" | "info";
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
    neutral: "border-[var(--atr-border)] bg-[var(--atr-surface-2)] text-[var(--atr-muted)]",
    accent: "border-[var(--atr-accent)]/25 bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]",
    up: "border-[var(--atr-up)]/25 bg-[#ecfdf3] text-[var(--atr-up)]",
    down: "border-[var(--atr-down)]/25 bg-[#fef2f2] text-[var(--atr-down)]",
    warn: "border-[var(--atr-warn)]/25 bg-[#fffbeb] text-[var(--atr-warn)]",
    info: "border-[var(--atr-accent-2)]/30 bg-[#ecfeff] text-[#0e7490]",
  };
  const dotColor: Record<Tone, string> = {
    neutral: "var(--atr-faint)",
    accent: "var(--atr-accent)",
    up: "var(--atr-up)",
    down: "var(--atr-down)",
    warn: "var(--atr-warn)",
    info: "var(--atr-accent-2)",
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
          <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: dotColor[tone], animation: "atr-pulse-ring 1.8s ease-out infinite" }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: dotColor[tone] }} />
        </span>
      )}
      {children}
    </span>
  );
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
      style={{ color: up ? "var(--atr-up)" : "var(--atr-down)" }}
    >
      <span aria-hidden="true">{up ? "▲" : "▼"}</span>
      {up ? "+" : ""}
      {value.toFixed(1)}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------- stat cards --- */

/** A KPI tile. Pass `accent` to tint the value in the gradient (for hero stats). */
export function StatCard({
  label,
  value,
  delta,
  hint,
  spark,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  spark?: number[];
  icon?: IconName;
  accent?: boolean;
}) {
  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--atr-muted)]">
          {icon && <Icon name={icon} size={14} className="text-[var(--atr-accent)]" />}
          {label}
        </p>
        {spark && <Sparkline values={spark} />}
      </div>
      <div
        className={cx(
          "mt-2 font-mono text-[28px] font-semibold leading-none tracking-tight tabular-nums",
          accent ? "bg-clip-text text-transparent" : "text-[var(--atr-ink)]",
        )}
        style={accent ? { backgroundImage: ATR_GRADIENT } : undefined}
      >
        {value}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {delta !== undefined && <Delta value={delta} />}
        {hint && <span className="text-[12px] text-[var(--atr-faint)]">{hint}</span>}
      </div>
    </GlassCard>
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
  const stroke = color ?? (values[values.length - 1] >= values[0] ? "var(--atr-up)" : "var(--atr-down)");
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

/* ---------------------------------------------------------------- progress --- */

/** A thin progress/usage bar in the accent gradient. */
export function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color?: string }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--atr-surface-2)]">
      <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color ?? ATR_GRADIENT }} />
    </div>
  );
}

/* ------------------------------------------------------------------ toggle --- */

/** A controlled on/off switch (e.g. enabling an automation). */
export function Toggle({ on, onChange, label }: { on: boolean; onChange?: (next: boolean) => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange?.(!on)}
      className={cx("relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors", on ? "" : "bg-[var(--atr-border-strong)]")}
      style={on ? { backgroundImage: ATR_GRADIENT } : undefined}
    >
      <span className={cx("inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform", on ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  );
}

/* ---------------------------------------------------------------- avatar --- */

/** Initials avatar. `gradient` fills it with the accent; otherwise a tone color. */
export function Avatar({ initials, size = 32, color }: { initials: string; size?: number; color?: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: color ?? ATR_GRADIENT,
      }}
    >
      {initials}
    </span>
  );
}

/* ----------------------------------------------------------------- app tile --- */

/** An app-launcher tile for the App Hub: a colored monogram + name + meta. */
export function AppTile({
  name,
  category,
  initial,
  color,
  status,
  onClick,
}: {
  name: string;
  category: string;
  initial: string;
  color: string;
  status?: "installed" | "available";
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="text-left">
      <GlassCard hover className="flex h-full items-center gap-3 p-3.5">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[15px] font-semibold text-white"
          style={{ background: color }}
        >
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-[var(--atr-ink)]">{name}</span>
          <span className="block truncate text-[11px] text-[var(--atr-muted)]">{category}</span>
        </span>
        {status === "available" ? (
          <Icon name="plus" size={15} className="shrink-0 text-[var(--atr-faint)]" />
        ) : (
          <Icon name="arrowRight" size={15} className="shrink-0 text-[var(--atr-faint)]" />
        )}
      </GlassCard>
    </button>
  );
}

/* --------------------------------------------------------- AI provenance --- */

/** The recurring "done by Workplace AI" signature: a gradient-left-border block with
 *  an AI tag. Wrap any AI-authored or AI-automated content (briefs, drafts, plans). */
export function AIBlock({
  children,
  title,
  tag = "Workplace AI",
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
        "relative overflow-hidden rounded-[14px] border border-[var(--atr-glass-border)] bg-[var(--atr-glass)] p-4 backdrop-blur-xl",
        className,
      )}
    >
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: ATR_GRADIENT }} />
      {(title || tag) && (
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="accent">
            <Icon name="sparkles" size={11} /> {tag}
          </Badge>
          {title && <span className="text-[13px] font-semibold text-[var(--atr-ink)]">{title}</span>}
          {streaming && <TypingDots />}
        </div>
      )}
      <div className="text-[13.5px] leading-relaxed text-[var(--atr-ink-2)]">{children}</div>
      {footer && <div className="mt-3 border-t border-[var(--atr-border)] pt-2 text-[11px] text-[var(--atr-faint)]">{footer}</div>}
    </div>
  );
}

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="generating">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full bg-[var(--atr-accent)]"
          style={{ animation: `atr-dot 1.1s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
    </span>
  );
}

/** Markdown-lite prose styling for AI text. */
export function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("space-y-2.5 text-[13.5px] leading-relaxed text-[var(--atr-ink-2)] [&_h4]:text-[13px] [&_h4]:font-semibold [&_h4]:text-[var(--atr-ink)] [&_strong]:font-semibold [&_strong]:text-[var(--atr-ink)] [&_ul]:space-y-1.5 [&_ul]:pl-1 [&_li]:flex [&_li]:gap-2", className)}>
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
          {s.paras?.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
          {s.bullets && (
            <ul>
              {s.bullets.map((b, j) => (
                <li key={j}>
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--atr-accent)" }} />
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
    <div className="inline-flex items-center rounded-full border border-[var(--atr-border)] bg-[var(--atr-surface-2)] p-0.5" role="tablist">
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
              size === "sm" ? "px-3 py-1 text-[12px]" : "px-3.5 py-1.5 text-[13px]",
              active
                ? "bg-[var(--atr-card)] text-[var(--atr-ink)] shadow-[0_1px_3px_rgba(20,18,31,0.1)]"
                : "text-[var(--atr-muted)] hover:text-[var(--atr-ink)]",
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cx("rounded-full px-1.5 text-[10px] font-semibold tabular-nums", active ? "bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]" : "bg-[var(--atr-border)] text-[var(--atr-muted)]")}>
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
    <div className="flex items-center gap-1 overflow-x-auto border-b border-[var(--atr-border)]" role="tablist">
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
              active
                ? "border-[var(--atr-accent)] text-[var(--atr-ink)]"
                : "border-transparent text-[var(--atr-muted)] hover:text-[var(--atr-ink)]",
            )}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 font-mono text-[11px] tabular-nums text-[var(--atr-faint)]">{t.count}</span>}
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
    <div className="overflow-x-auto rounded-[14px] border border-[var(--atr-border)] bg-[var(--atr-card)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--atr-border)]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cx(
                  "px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--atr-muted)]",
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
                "border-b border-[var(--atr-border)] transition-colors last:border-0",
                highlightRow?.(row) ? "bg-[var(--atr-accent-wash)]" : "hover:bg-[var(--atr-surface-2)]",
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cx(
                    dense ? "px-3.5 py-2" : "px-3.5 py-3",
                    "text-[13px] text-[var(--atr-ink-2)]",
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

/* --------------------------------------------------------------- chat bits --- */

/** A single chat bubble for the assistant. `role` styles user vs Workplace AI. */
export function ChatBubble({ role, children }: { role: "user" | "ai"; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-[16px] rounded-br-sm px-4 py-2.5 text-[13.5px] leading-relaxed text-white" style={{ backgroundImage: ATR_GRADIENT }}>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white" style={{ background: ATR_GRADIENT }}>
        <Icon name="sparkles" size={14} />
      </span>
      <div className="max-w-[85%] rounded-[16px] rounded-tl-sm border border-[var(--atr-border)] bg-[var(--atr-card)] px-4 py-2.5 text-[13.5px] leading-relaxed text-[var(--atr-ink-2)]">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- misc bits --- */

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cx("rounded bg-[length:200%_100%]", className)}
      style={{
        backgroundImage: "linear-gradient(90deg, var(--atr-surface-2) 25%, #eef0fb 50%, var(--atr-surface-2) 75%)",
        animation: "atr-shimmer 1.4s ease-in-out infinite",
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
          ? "border-[var(--atr-accent)] bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]"
          : "border-[var(--atr-border)] bg-[var(--atr-card)] text-[var(--atr-muted)] hover:border-[var(--atr-border-strong)] hover:text-[var(--atr-ink)]",
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({ icon = "sparkles", title, body, cta }: { icon?: IconName; title: string; body?: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[var(--atr-border-strong)] bg-[var(--atr-card)] px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
        <Icon name={icon} size={18} />
      </span>
      <p className="mt-3 text-[13px] font-semibold text-[var(--atr-ink)]">{title}</p>
      {body && <p className="mt-1 max-w-xs text-[12px] text-[var(--atr-muted)]">{body}</p>}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
