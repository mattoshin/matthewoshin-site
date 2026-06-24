/**
 * MtrainKit - shared presentational primitives for the mTrain studio-admin demo.
 * Pure, dependency-free building blocks (inline-SVG icons, cards, KPI stats, deltas,
 * badges, SSR-safe sparkline/donut/trend-bars, capacity bars, segmented tabs, and a
 * generic data table) that every mTrain module composes. All visuals read the scoped
 * `--mt-*` tokens from MtrainScope, so the warm-sand + evergreen "Studio" theme stays
 * consistent. Editorial Fraunces serif for display text; the shared mono for numerics.
 *
 * mTrain is a real studio; this is a portfolio recreation of its back office on
 * fictional sample data. Nothing talks to a live server.
 */
import React from "react";

export const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

/** Editorial serif, for headings and display numerals. */
export const MT_SERIF = "[font-family:var(--font-mt-serif)]";

/* ----------------------------------------------------------------- wordmark --- */

export function Wordmark({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <MtrainMark size={26} />
      <span className="leading-none">
        <span className={cx("block text-[17px] font-semibold tracking-tight text-[var(--mt-ink)]", MT_SERIF)}>
          mTrain
        </span>
        {subtitle && (
          <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--mt-faint)]">
            Studio admin
          </span>
        )}
      </span>
    </span>
  );
}

/** A rounded-square evergreen mark: an upward "training" chevron / rising bar. */
export function MtrainMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
      <rect width="28" height="28" rx="8" fill="var(--mt-accent)" />
      {/* three rising bars = momentum / strength */}
      <rect x="7.5" y="15.5" width="3.2" height="5" rx="1.2" fill="#fff" opacity="0.55" />
      <rect x="12.4" y="11.5" width="3.2" height="9" rx="1.2" fill="#fff" opacity="0.8" />
      <rect x="17.3" y="7.5" width="3.2" height="13" rx="1.2" fill="#fff" />
    </svg>
  );
}

/* -------------------------------------------------------------------- icons --- */

export type IconName =
  | "home"
  | "calendar"
  | "users"
  | "spark"
  | "revenue"
  | "clock"
  | "mapPin"
  | "plus"
  | "search"
  | "bell"
  | "chevron"
  | "chevronDown"
  | "dots"
  | "arrowRight"
  | "check"
  | "checkCircle"
  | "settings"
  | "user"
  | "filter"
  | "trendingUp"
  | "close"
  | "mail"
  | "phone"
  | "instagram"
  | "dumbbell";

export function Icon({ name, size = 18, className = "" }: { name: IconName; size?: number; className?: string }) {
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
    case "calendar":
      return <svg {...c}><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v3M16 3v3" /></svg>;
    case "users":
      return <svg {...c}><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8" /><path d="M18 14a6 6 0 0 1 3 5" /></svg>;
    case "spark":
      return <svg {...c}><path d="M12 3l1.8 4.8L18 9l-4.2 1.2L12 15l-1.8-4.8L6 9l4.2-1.2L12 3Z" /><path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14Z" /></svg>;
    case "revenue":
      return <svg {...c}><path d="M12 3v18" /><path d="M16.5 7.5C16 5.8 14.2 5 12 5c-2.5 0-4 1.2-4 3 0 4.5 8 2.5 8 7 0 1.8-1.7 3-4 3-2.4 0-4.2-.9-4.6-2.6" /></svg>;
    case "clock":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>;
    case "mapPin":
      return <svg {...c}><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case "plus":
      return <svg {...c}><path d="M12 5v14M5 12h14" /></svg>;
    case "search":
      return <svg {...c}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case "bell":
      return <svg {...c}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
    case "chevron":
      return <svg {...c}><path d="m9 6 6 6-6 6" /></svg>;
    case "chevronDown":
      return <svg {...c}><path d="m6 9 6 6 6-6" /></svg>;
    case "dots":
      return <svg {...c}><circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" /></svg>;
    case "arrowRight":
      return <svg {...c}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "check":
      return <svg {...c}><path d="M5 12.5 10 17l9-10" /></svg>;
    case "checkCircle":
      return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>;
    case "settings":
      return <svg {...c}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L16 3H8l-.6 2.5a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2L8 21h8l.6-2.5a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5A7 7 0 0 0 19 12Z" /></svg>;
    case "user":
      return <svg {...c}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
    case "filter":
      return <svg {...c}><path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" /></svg>;
    case "trendingUp":
      return <svg {...c}><path d="m3 17 6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>;
    case "close":
      return <svg {...c}><path d="M6 6l12 12M18 6 6 18" /></svg>;
    case "mail":
      return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case "phone":
      return <svg {...c}><path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>;
    case "instagram":
      return <svg {...c}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></svg>;
    case "dumbbell":
      return <svg {...c}><path d="M6.5 6.5 17.5 17.5M4 9l2-2M9 4l-2 2M15 20l2-2M20 15l-2 2M2.5 11.5l2 2M11.5 2.5l2 2" /></svg>;
  }
}

/* ------------------------------------------------------------- typographic --- */

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cx("font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--mt-faint)]", className)}>
      {children}
    </p>
  );
}

export function SectionHeading({ title, hint, right }: { title: string; hint?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className={cx("text-[19px] font-semibold tracking-tight text-[var(--mt-ink)]", MT_SERIF)}>{title}</h2>
        {hint && <p className="mt-0.5 text-[13px] text-[var(--mt-muted)]">{hint}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
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
        "rounded-[14px] border border-[var(--mt-border)] bg-[var(--mt-card)]",
        padded && "p-5",
        hover && "transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-14px_rgba(31,61,52,0.22)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- buttons --- */

type BtnVariant = "accent" | "outline" | "ghost";
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
  const base = "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all disabled:opacity-50";
  const sizes = size === "sm" ? "px-3.5 py-1.5 text-xs" : "px-5 py-2.5 text-[13px]";
  const variants: Record<BtnVariant, string> = {
    accent: "bg-[var(--mt-accent)] text-white hover:bg-[var(--mt-accent-700)]",
    outline: "border border-[var(--mt-border-strong)] bg-[var(--mt-card)] text-[var(--mt-ink)] hover:bg-[var(--mt-surface-2)]",
    ghost: "text-[var(--mt-muted)] hover:bg-[var(--mt-surface-2)] hover:text-[var(--mt-ink)]",
  };
  return (
    <button className={cx(base, sizes, variants[variant], className)} {...rest}>
      {icon && <Icon name={icon} size={size === "sm" ? 13 : 15} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 13 : 15} />}
    </button>
  );
}

/* ------------------------------------------------------------------ badges --- */

export type Tone = "neutral" | "accent" | "sage" | "up" | "down" | "warn" | "clay";
const TONES: Record<Tone, string> = {
  neutral: "border-[var(--mt-border)] bg-[var(--mt-surface-2)] text-[var(--mt-muted)]",
  accent: "border-[var(--mt-accent)]/20 bg-[var(--mt-accent-wash)] text-[var(--mt-accent)]",
  sage: "border-[var(--mt-sage)]/35 bg-[#eef3ee] text-[#4e6b54]",
  up: "border-[var(--mt-up)]/25 bg-[#ecf6ef] text-[var(--mt-up)]",
  down: "border-[var(--mt-down)]/25 bg-[#fbeeea] text-[var(--mt-down)]",
  warn: "border-[var(--mt-warn)]/25 bg-[#fbf3e6] text-[var(--mt-warn)]",
  clay: "border-[var(--mt-clay)]/30 bg-[#f7ede3] text-[#9a5f34]",
};
export function Badge({ children, tone = "neutral", className = "" }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium", TONES[tone], className)}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ deltas --- */

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 font-mono text-[12px] font-medium tabular-nums"
      style={{ color: up ? "var(--mt-up)" : "var(--mt-down)" }}
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
  hint,
  spark,
  icon,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  spark?: number[];
  icon?: IconName;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <p className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium text-[var(--mt-muted)]">
          {icon && <Icon name={icon} size={14} className="shrink-0 text-[var(--mt-accent)]" />}
          <span className="truncate">{label}</span>
        </p>
        {spark && (
          <span className="hidden shrink-0 sm:block">
            <Sparkline values={spark} />
          </span>
        )}
      </div>
      <div className={cx("mt-2.5 text-[28px] font-semibold leading-none tracking-tight text-[var(--mt-ink)]", MT_SERIF)}>
        {value}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {delta !== undefined && <Delta value={delta} />}
        {hint && <span className="text-[12px] text-[var(--mt-faint)]">{hint}</span>}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------- sparkline --- */

export function Sparkline({ values, width = 78, height = 24, color }: { values: number[]; width?: number; height?: number; color?: string }) {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stroke = color ?? (values[values.length - 1] >= values[0] ? "var(--mt-up)" : "var(--mt-down)");
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

/* ----------------------------------------------------------- trend bars --- */

/** A deterministic, SSR-safe vertical bar chart (the weekly bookings trend). The
 *  last bar is accented as "this week". */
export function TrendBars({ data, height = 132 }: { data: ReadonlyArray<{ label: string; value: number }>; height?: number }) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const last = i === data.length - 1;
        const h = Math.max(6, (d.value / max) * (height - 22));
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-1.5">
            <span className="font-mono text-[10px] tabular-nums text-[var(--mt-faint)]">{d.value}</span>
            <span
              className="w-full rounded-t-[5px]"
              style={{
                height: h,
                background: last ? "var(--mt-accent)" : "var(--mt-sage)",
                opacity: last ? 1 : 0.5,
              }}
            />
            <span className="font-mono text-[9px] uppercase tracking-wide text-[var(--mt-faint)]">{d.label.split(" ")[1]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- donut --- */

/** A multi-segment donut (class mix / fill rate). Deterministic, SSR-safe. */
export function Donut({
  segments,
  size = 132,
  thickness = 16,
  centerTop,
  centerSub,
}: {
  segments: ReadonlyArray<{ value: number; color: string }>;
  size?: number;
  thickness?: number;
  centerTop?: string;
  centerSub?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--mt-surface-2)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.value / total) * circ;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      {(centerTop || centerSub) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerTop && <span className={cx("text-[22px] font-semibold leading-none text-[var(--mt-ink)]", MT_SERIF)}>{centerTop}</span>}
          {centerSub && <span className="mt-1 font-mono text-[9px] uppercase tracking-wide text-[var(--mt-faint)]">{centerSub}</span>}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ capacity --- */

/** A class-fill bar: booked / capacity, tinted by how full it is. */
export function CapacityBar({ booked, capacity }: { booked: number; capacity: number }) {
  const pct = Math.min(100, (booked / (capacity || 1)) * 100);
  const full = booked >= capacity;
  const color = full ? "var(--mt-clay)" : pct >= 75 ? "var(--mt-accent)" : "var(--mt-sage)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-[var(--mt-surface-2)]">
        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--mt-muted)]">
        {booked}/{capacity}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ tabs --- */

export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: ReadonlyArray<{ id: T; label: string }>;
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-[var(--mt-border)] bg-[var(--mt-surface-2)] p-0.5" role="tablist">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cx(
              "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all",
              active ? "bg-[var(--mt-card)] text-[var(--mt-ink)] shadow-[0_1px_3px_rgba(28,27,25,0.1)]" : "text-[var(--mt-muted)] hover:text-[var(--mt-ink)]",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- avatar --- */

export function Avatar({ initials, size = 32, color }: { initials: string; size?: number; color?: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36, background: color ?? "var(--mt-accent)" }}
    >
      {initials}
    </span>
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
}: {
  columns: ReadonlyArray<Column<T>>;
  rows: ReadonlyArray<T>;
  getKey: (row: T, i: number) => string;
}) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-[var(--mt-border)] bg-[var(--mt-card)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--mt-border)]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cx(
                  "whitespace-nowrap px-3.5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--mt-muted)]",
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
            <tr key={getKey(row, i)} className="border-b border-[var(--mt-border)] transition-colors last:border-0 hover:bg-[var(--mt-surface-2)]">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cx(
                    "px-3.5 py-3 text-[13px] text-[var(--mt-ink-2)]",
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
