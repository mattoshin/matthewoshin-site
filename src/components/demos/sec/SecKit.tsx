/**
 * SecKit - shared presentational primitives for the SEC Intelligence demo. Pure,
 * dependency-free building blocks (inline-SVG icon set, glassy cards, KPI stats,
 * badges, deltas, SSR-safe sparklines, the AI-provenance block, tabs, data tables,
 * a filing tape, a channel-router matrix, and the role toggle) that every SEC
 * module composes. All visuals read the scoped `--sec-*` tokens from SecScope, so
 * the dark terminal theme stays consistent: hairline borders over shadows, mono
 * tabular numerics, azure accent on ~5% of pixels, green/red for market and filing
 * sentiment, one gold flag for "material", and an accent-left-border "AI"
 * signature on generated content.
 *
 * No "use client" directive on purpose (mirrors FcKit): these are pure
 * presentational components. Stateful behavior lives in the modules/console, which
 * carry their own "use client". The one interactive piece here, ChannelMatrix, is
 * fully controlled (value + onToggle).
 */
import React from "react";

export const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

/* --------------------------------------------------------------- shared types --- */

export type FormType =
  | "10-K"
  | "10-Q"
  | "8-K"
  | "S-1"
  | "13D"
  | "13G"
  | "Form 4"
  | "DEF 14A"
  | "6-K"
  | "424B"
  | "13F";

export type Severity = "material" | "notable" | "routine";
export type Sentiment = "bullish" | "bearish" | "neutral";
export type Channel = "email" | "sms" | "phone" | "push" | "agent";
export type Role = "advisor" | "trader";

export const ROLE_LABEL: Record<Role, string> = {
  advisor: "Wealth Manager",
  trader: "Trader",
};

export const CHANNEL_META: Record<Channel, { label: string; icon: IconName }> = {
  email: { label: "Email", icon: "mail" },
  sms: { label: "SMS", icon: "chat" },
  phone: { label: "Phone call", icon: "phone" },
  push: { label: "Push", icon: "bell" },
  agent: { label: "Agent", icon: "webhook" },
};

/* ----------------------------------------------------------------- wordmark --- */

/** The SEC Intelligence lockup: a filing/scan mark + wordmark. */
export function Wordmark({ size = "md" }: { size?: "sm" | "md" }) {
  const text = size === "sm" ? "text-sm" : "text-[15px]";
  return (
    <span className="flex items-center gap-2.5">
      <SecMark size={size === "sm" ? 18 : 22} />
      <span className="leading-none">
        <span className={cx("block font-semibold tracking-tight text-[var(--sec-ink)]", text)}>
          SEC Intelligence
        </span>
        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--sec-faint)]">
          Filing surveillance
        </span>
      </span>
    </span>
  );
}

/** A document-with-pulse mark in the accent color. */
export function SecMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect width="24" height="24" rx="6" fill="#11151a" stroke="rgba(255,255,255,0.08)" />
      <path d="M9 6.5h4.2L16 9.3V17a.8.8 0 0 1-.8.8H9a.8.8 0 0 1-.8-.8V7.3A.8.8 0 0 1 9 6.5Z" stroke="var(--sec-accent)" strokeWidth="1.3" />
      <path d="M10.4 11.5h3.2M10.4 14h2.2" stroke="var(--sec-accent)" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="16.4" cy="15.4" r="1.5" fill="var(--sec-material)" />
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
  | "layers"
  | "phone"
  | "chat"
  | "webhook"
  | "inbox"
  | "sliders"
  | "eye"
  | "newspaper";

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
    case "phone":
      return <svg {...c}><path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" /></svg>;
    case "chat":
      return <svg {...c}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z" /></svg>;
    case "webhook":
      return <svg {...c}><path d="M9 8a3 3 0 1 1 4 2.8l2.4 4.2" /><path d="M15.5 13a3 3 0 1 1-1 4H9.5" /><path d="M11 9.5 7.5 15.5A3 3 0 1 0 9 17" /></svg>;
    case "inbox":
      return <svg {...c}><path d="M3 13h4l1.5 2.5h7L17 13h4" /><path d="M5 5h14l2 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5L5 5Z" /></svg>;
    case "sliders":
      return <svg {...c}><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5" /><circle cx="15" cy="6" r="1.8" /><circle cx="8" cy="12" r="1.8" /><circle cx="13" cy="18" r="1.8" /></svg>;
    case "eye":
      return <svg {...c}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "newspaper":
      return <svg {...c}><path d="M4 5h13v14a1 1 0 0 0 1 1H6a2 2 0 0 1-2-2V5Z" /><path d="M17 8h3v10a2 2 0 0 1-2 2M7 9h7M7 13h7M7 17h4" /></svg>;
  }
}

/* ------------------------------------------------------------- typographic --- */

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cx("font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sec-faint)]", className)}>
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
        <h2 className="text-base font-semibold tracking-tight text-[var(--sec-ink)]">{title}</h2>
        {hint && <p className="mt-0.5 text-[13px] text-[var(--sec-muted)]">{hint}</p>}
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
        "rounded-[12px] border border-[var(--sec-border)] bg-[var(--sec-card)]",
        padded && "p-5",
        hover && "transition-colors hover:border-[var(--sec-border-strong)] hover:bg-[var(--sec-surface-2)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- buttons --- */

type BtnVariant = "accent" | "solid" | "outline" | "ghost";
export function Button({
  children,
  variant = "accent",
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
    accent: "bg-[var(--sec-accent)] text-[#04121f] hover:bg-[#5bb8ff]",
    solid: "bg-[var(--sec-ink)] text-[#06080a] hover:bg-white",
    outline:
      "border border-[var(--sec-border-strong)] bg-[var(--sec-surface-2)] text-[var(--sec-ink)] hover:bg-[var(--sec-elevated)]",
    ghost: "text-[var(--sec-muted)] hover:bg-[var(--sec-surface-2)] hover:text-[var(--sec-ink)]",
  };
  return (
    <button className={cx(base, sizes, variants[variant], className)} {...rest}>
      {icon && <Icon name={icon} size={size === "sm" ? 13 : 15} />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ badges --- */

type Tone = "neutral" | "accent" | "up" | "down" | "warn" | "material";
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
    neutral: "border-[var(--sec-border)] bg-[var(--sec-surface-2)] text-[var(--sec-muted)]",
    accent: "border-[var(--sec-accent)]/30 bg-[var(--sec-accent-wash)] text-[var(--sec-accent)]",
    up: "border-[var(--sec-up)]/30 bg-[var(--sec-up-wash)] text-[var(--sec-up)]",
    down: "border-[var(--sec-down)]/30 bg-[var(--sec-down-wash)] text-[var(--sec-down)]",
    warn: "border-[var(--sec-material)]/30 bg-[var(--sec-material-wash)] text-[var(--sec-material)]",
    material: "border-[var(--sec-material)]/40 bg-[var(--sec-material-wash)] text-[var(--sec-material)]",
  };
  const dotColor: Record<Tone, string> = {
    neutral: "var(--sec-faint)",
    accent: "var(--sec-accent)",
    up: "var(--sec-up)",
    down: "var(--sec-down)",
    warn: "var(--sec-material)",
    material: "var(--sec-material)",
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
          <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: dotColor[tone], animation: "sec-pulse-ring 1.8s ease-out infinite" }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: dotColor[tone] }} />
        </span>
      )}
      {children}
    </span>
  );
}

/** A consensus rating badge. */
export function RatingBadge({ rating }: { rating: "Buy" | "Hold" | "Sell" | "Overweight" | "Underweight" }) {
  const tone: Tone = rating === "Buy" || rating === "Overweight" ? "up" : rating === "Sell" || rating === "Underweight" ? "down" : "warn";
  return <Badge tone={tone}>{rating}</Badge>;
}

/** Form-type pill, color-keyed by family (annual/quarterly, current, ownership, etc). */
export function FormBadge({ form }: { form: FormType }) {
  const tone: Tone =
    form === "8-K" || form === "6-K"
      ? "warn"
      : form === "13D" || form === "13G" || form === "Form 4" || form === "13F"
        ? "accent"
        : form === "S-1" || form === "424B"
          ? "up"
          : "neutral";
  return (
    <span className={cx("inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10.5px] font-semibold tracking-tight")}
      style={badgeStyle(tone)}>
      {form}
    </span>
  );
}

function badgeStyle(tone: Tone): React.CSSProperties {
  const map: Record<Tone, { c: string; b: string; bg: string }> = {
    neutral: { c: "var(--sec-ink-2)", b: "var(--sec-border)", bg: "var(--sec-surface-2)" },
    accent: { c: "var(--sec-accent)", b: "var(--sec-accent)", bg: "var(--sec-accent-wash)" },
    up: { c: "var(--sec-up)", b: "var(--sec-up)", bg: "var(--sec-up-wash)" },
    down: { c: "var(--sec-down)", b: "var(--sec-down)", bg: "var(--sec-down-wash)" },
    warn: { c: "var(--sec-material)", b: "var(--sec-material)", bg: "var(--sec-material-wash)" },
    material: { c: "var(--sec-material)", b: "var(--sec-material)", bg: "var(--sec-material-wash)" },
  };
  const t = map[tone];
  return { color: t.c, borderColor: t.b, background: t.bg };
}

/** Severity flag: the single gold "material" signal, plus notable/routine. */
export function SeverityFlag({ severity, withLabel = true }: { severity: Severity; withLabel?: boolean }) {
  const meta: Record<Severity, { label: string; color: string }> = {
    material: { label: "Material", color: "var(--sec-material)" },
    notable: { label: "Notable", color: "var(--sec-accent)" },
    routine: { label: "Routine", color: "var(--sec-faint)" },
  };
  const m = meta[severity];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: m.color }}>
      <span className="relative flex h-1.5 w-1.5">
        {severity === "material" && (
          <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: m.color, animation: "sec-pulse-ring 1.8s ease-out infinite" }} />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
      </span>
      {withLabel && m.label}
    </span>
  );
}

/** Bullish / bearish / neutral sentiment chip for AI filing reads. */
export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const tone: Tone = sentiment === "bullish" ? "up" : sentiment === "bearish" ? "down" : "neutral";
  const label = sentiment === "bullish" ? "Bullish" : sentiment === "bearish" ? "Bearish" : "Neutral";
  return <Badge tone={tone}>{label}</Badge>;
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
      style={{ color: up ? "var(--sec-up)" : "var(--sec-down)" }}
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
        <p className="text-[12px] font-medium text-[var(--sec-muted)]">{label}</p>
        {spark && <Sparkline values={spark} />}
      </div>
      <div className="mt-2 font-mono text-[26px] font-semibold leading-none tracking-tight tabular-nums text-[var(--sec-ink)]">
        {value}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {delta !== undefined && <Delta value={delta} />}
        {hint && <span className="text-[12px] text-[var(--sec-faint)]">{hint}</span>}
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
  const stroke = color ?? (values[values.length - 1] >= values[0] ? "var(--sec-up)" : "var(--sec-down)");
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
 *  block with an AI tag. Wrap any AI-authored content (summaries, briefs, reads). */
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
        "rounded-r-[12px] border border-l-2 border-[var(--sec-border)] border-l-[var(--sec-accent)] bg-[var(--sec-card)] p-4",
        className,
      )}
    >
      {(title || tag) && (
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="accent">
            <Icon name="sparkles" size={11} /> {tag}
          </Badge>
          {title && <span className="text-[13px] font-semibold text-[var(--sec-ink)]">{title}</span>}
          {streaming && <TypingDots />}
        </div>
      )}
      <div className="text-[13.5px] leading-relaxed text-[var(--sec-ink-2)]">{children}</div>
      {footer && <div className="mt-3 border-t border-[var(--sec-border)] pt-2 text-[11px] text-[var(--sec-faint)]">{footer}</div>}
    </div>
  );
}

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="generating">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full bg-[var(--sec-accent)]"
          style={{ animation: `sec-dot 1.1s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
    </span>
  );
}

/** Markdown-lite prose styling for AI text. */
export function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("space-y-2.5 text-[13.5px] leading-relaxed text-[var(--sec-ink-2)] [&_h4]:text-[13px] [&_h4]:font-semibold [&_h4]:text-[var(--sec-ink)] [&_strong]:font-semibold [&_strong]:text-[var(--sec-ink)] [&_ul]:space-y-1.5 [&_ul]:pl-1 [&_li]:flex [&_li]:gap-2", className)}>
      {children}
    </div>
  );
}

/** Renders an array of heading + paragraphs + bullets as styled prose. */
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
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--sec-accent)]" />
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
    <div className="inline-flex items-center rounded-lg border border-[var(--sec-border)] bg-[var(--sec-recessed)] p-0.5" role="tablist">
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
                ? "bg-[var(--sec-surface-2)] text-[var(--sec-ink)] shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                : "text-[var(--sec-muted)] hover:text-[var(--sec-ink)]",
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cx("rounded-full px-1.5 text-[10px] font-semibold tabular-nums", active ? "bg-[var(--sec-accent-wash)] text-[var(--sec-accent)]" : "bg-[var(--sec-surface-2)] text-[var(--sec-muted)]")}>
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
    <div className="flex items-center gap-1 overflow-x-auto border-b border-[var(--sec-border)]" role="tablist">
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
                ? "border-[var(--sec-accent)] text-[var(--sec-ink)]"
                : "border-transparent text-[var(--sec-muted)] hover:text-[var(--sec-ink)]",
            )}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 font-mono text-[11px] tabular-nums text-[var(--sec-faint)]">{t.count}</span>}
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
    <div className="overflow-x-auto rounded-[12px] border border-[var(--sec-border)] bg-[var(--sec-card)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--sec-border)]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cx(
                  "px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--sec-muted)]",
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
                "border-b border-[var(--sec-border)] last:border-0 transition-colors",
                highlightRow?.(row) ? "bg-[var(--sec-accent-wash)]" : "hover:bg-[var(--sec-surface-2)]",
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cx(
                    dense ? "px-3.5 py-2" : "px-3.5 py-3",
                    "text-[13px] text-[var(--sec-ink-2)]",
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
    { v: buy, c: "var(--sec-up)", l: "Buy" },
    { v: hold, c: "var(--sec-material)", l: "Hold" },
    { v: sell, c: "var(--sec-down)", l: "Sell" },
  ];
  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--sec-surface-2)]">
        {seg.map((s) => (
          <span key={s.l} style={{ width: `${(s.v / total) * 100}%`, background: s.c }} />
        ))}
      </div>
      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[var(--sec-muted)]">
        {seg.map((s) => (
          <span key={s.l} className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.c }} />
            {s.l} <span className="font-mono tabular-nums text-[var(--sec-ink-2)]">{s.v}</span>
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
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[12px] border border-[var(--sec-border)] bg-[var(--sec-card)] px-4 py-3">
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-base font-semibold text-[var(--sec-accent)]">{company.ticker}</span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-[var(--sec-ink)]">{company.name}</div>
          <div className="text-[11px] text-[var(--sec-muted)]">{company.sector}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold tabular-nums text-[var(--sec-ink)]">${company.price.toFixed(2)}</span>
        <Delta value={company.changePct} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[var(--sec-muted)]">Consensus</span>
        <RatingBadge rating={company.consensus} />
      </div>
      {company.earningsIn && (
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--sec-muted)]">
          <Icon name="calendar" size={13} /> Earnings {company.earningsIn}
        </div>
      )}
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

/* ------------------------------------------------------------- filing tape --- */

export type TapeItem = { ticker: string; form: FormType; changePct: number };

/** The top "ticker tape" of recent filings, an infinite marquee. The track is
 *  duplicated so the loop is seamless; SSR-safe and reduced-motion aware. */
export function FilingTape({ items, speed = 42 }: { items: readonly TapeItem[]; speed?: number }) {
  const track = [...items, ...items];
  return (
    <div className="relative overflow-hidden rounded-[10px] border border-[var(--sec-border)] bg-[var(--sec-recessed)]">
      <div
        className="sec-tape-track flex w-max items-center gap-6 whitespace-nowrap py-2"
        style={{ animation: `sec-tape ${speed}s linear infinite` }}
      >
        {track.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-1 text-[12px]">
            <FormBadge form={t.form} />
            <span className="font-mono font-semibold text-[var(--sec-ink)]">{t.ticker}</span>
            <span className="font-mono tabular-nums" style={{ color: t.changePct >= 0 ? "var(--sec-up)" : "var(--sec-down)" }}>
              {t.changePct >= 0 ? "▲" : "▼"}{Math.abs(t.changePct).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12" style={{ background: "linear-gradient(90deg, var(--sec-recessed), transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12" style={{ background: "linear-gradient(270deg, var(--sec-recessed), transparent)" }} />
    </div>
  );
}

/* ------------------------------------------------------- channel matrix --- */

export type ChannelRow = { id: string; label: string; hint?: string };

/** The signature alert Channel Router: alert-type rows x delivery-channel columns
 *  of toggle cells. Fully controlled. `value[rowId]` is the set of enabled
 *  channels for that row; onToggle flips one cell. */
export function ChannelMatrix({
  rows,
  value,
  onToggle,
}: {
  rows: readonly ChannelRow[];
  value: Record<string, readonly Channel[]>;
  onToggle: (rowId: string, channel: Channel) => void;
}) {
  const channels: Channel[] = ["email", "sms", "phone", "push", "agent"];
  return (
    <div className="overflow-x-auto rounded-[12px] border border-[var(--sec-border)] bg-[var(--sec-card)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--sec-border)]">
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--sec-muted)]">Alert type</th>
            {channels.map((ch) => (
              <th key={ch} className="px-3 py-3 text-center">
                <span className="inline-flex flex-col items-center gap-1 text-[var(--sec-muted)]">
                  <Icon name={CHANNEL_META[ch].icon} size={15} className={ch === "agent" ? "text-[var(--sec-accent)]" : undefined} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">{CHANNEL_META[ch].label}</span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const on = value[row.id] ?? [];
            return (
              <tr key={row.id} className="border-b border-[var(--sec-border)] last:border-0">
                <td className="px-4 py-3">
                  <div className="text-[13px] font-medium text-[var(--sec-ink)]">{row.label}</div>
                  {row.hint && <div className="text-[11px] text-[var(--sec-muted)]">{row.hint}</div>}
                </td>
                {channels.map((ch) => {
                  const enabled = on.includes(ch);
                  return (
                    <td key={ch} className="px-3 py-3 text-center">
                      <button
                        role="switch"
                        aria-checked={enabled}
                        aria-label={`${CHANNEL_META[ch].label} for ${row.label}`}
                        onClick={() => onToggle(row.id, ch)}
                        className={cx(
                          "inline-flex h-6 w-6 items-center justify-center rounded-md border transition-colors",
                          enabled
                            ? "border-[var(--sec-accent)] bg-[var(--sec-accent-wash)] text-[var(--sec-accent)]"
                            : "border-[var(--sec-border)] bg-[var(--sec-recessed)] text-transparent hover:border-[var(--sec-border-strong)]",
                        )}
                      >
                        <Icon name="check" size={13} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------ misc bits --- */

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cx("rounded bg-[length:200%_100%]", className)}
      style={{
        backgroundImage: "linear-gradient(90deg, var(--sec-surface-2) 25%, var(--sec-elevated) 50%, var(--sec-surface-2) 75%)",
        animation: "sec-shimmer 1.4s ease-in-out infinite",
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
          ? "border-[var(--sec-accent)] bg-[var(--sec-accent-wash)] text-[var(--sec-accent)]"
          : "border-[var(--sec-border)] bg-[var(--sec-card)] text-[var(--sec-muted)] hover:border-[var(--sec-border-strong)] hover:text-[var(--sec-ink)]",
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({ icon = "sparkles", title, body, cta }: { icon?: IconName; title: string; body?: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[var(--sec-border-strong)] bg-[var(--sec-card)] px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sec-surface-2)] text-[var(--sec-muted)]">
        <Icon name={icon} size={18} />
      </span>
      <p className="mt-3 text-[13px] font-semibold text-[var(--sec-ink)]">{title}</p>
      {body && <p className="mt-1 max-w-xs text-[12px] text-[var(--sec-muted)]">{body}</p>}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}

/* --------------------------------------------------------------- role toggle --- */

/** Wealth Manager | Trader role switch (mirrors Galactic's ConsoleToggle). */
export function RoleToggle({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sec-faint)] sm:inline">View as</span>
      <div
        className="inline-flex items-center rounded-xl border border-[var(--sec-border)] bg-[var(--sec-recessed)] p-1"
        role="tablist"
        aria-label="Switch between the wealth-manager and trader view"
      >
        {(["advisor", "trader"] as const).map((r) => {
          const active = role === r;
          return (
            <button
              key={r}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(r)}
              className={cx(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all sm:text-xs",
                active
                  ? "bg-[var(--sec-accent)] text-[#04121f] shadow-[0_4px_14px_rgba(61,169,252,0.3)]"
                  : "text-[var(--sec-muted)] hover:text-[var(--sec-ink)]",
              )}
            >
              <Icon name={r === "advisor" ? "users" : "bolt"} size={13} />
              {ROLE_LABEL[r]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
