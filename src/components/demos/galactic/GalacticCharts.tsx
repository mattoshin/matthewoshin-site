/**
 * GalacticCharts - tiny, dependency-free SVG/CSS charts for the Galactic admin
 * console. Hand-rolled so the demo carries no chart library and the visuals
 * match the brand palette exactly. All presentational, all deterministic.
 */

const TEAL = "#1DD1A1";

/** Filled area + line sparkline from a series of numbers. Scales to its box. */
export function AreaChart({
  data,
  color = TEAL,
  height = 72,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const w = 100;
  const h = 100;
  const pad = 6;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height }} aria-hidden="true">
      <path d={area} fill={color} fillOpacity={0.13} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.75} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Horizontal bar list with a label and value per row (CSS bars). */
export function BarList({
  items,
  color = TEAL,
  format = (n: number) => n.toLocaleString(),
}: {
  items: { name: string; count: number }[];
  color?: string;
  format?: (n: number) => string;
}) {
  const max = Math.max(...items.map((i) => i.count)) || 1;
  return (
    <div className="space-y-2.5">
      {items.map((i) => (
        <div key={i.name}>
          <div className="flex items-center justify-between text-xs">
            <span className="truncate text-[var(--g-text)]">{i.name}</span>
            <span className="ml-3 shrink-0 font-mono text-[var(--g-muted)]">{format(i.count)}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--g-panel-2)" }}>
            <div className="h-full rounded-full" style={{ width: `${(i.count / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Donut chart with a center label and a legend on the side. */
export function Donut({
  segments,
  size = 132,
  centerLabel,
  centerSub,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = 42;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--g-panel-2)" strokeWidth="11" />
        {segments.map((seg, idx) => {
          const prior = segments.slice(0, idx).reduce((s, x) => s + x.value, 0);
          const len = (seg.value / total) * circ;
          const off = (prior / total) * circ;
          return (
            <circle
              key={seg.label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="11"
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-off}
              transform="rotate(-90 50 50)"
              strokeLinecap="butt"
            />
          );
        })}
        {centerLabel && (
          <text x="50" y="48" textAnchor="middle" className="fill-white" style={{ fontSize: 15, fontWeight: 700 }}>
            {centerLabel}
          </text>
        )}
        {centerSub && (
          <text x="50" y="62" textAnchor="middle" style={{ fontSize: 7, fill: "var(--g-faint)", letterSpacing: 1 }}>
            {centerSub}
          </text>
        )}
      </svg>
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: seg.color }} />
            <span className="text-[var(--g-text)]">{seg.label}</span>
            <span className="font-mono text-xs text-[var(--g-faint)]">{seg.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Stacked vertical bars for two series (e.g. daily cost by model). */
export function StackedBars({
  data,
  keys,
  height = 96,
}: {
  data: Record<string, number>[];
  keys: { key: string; color: string; label: string }[];
  height?: number;
}) {
  const totals = data.map((d) => keys.reduce((s, k) => s + (d[k.key] ?? 0), 0));
  const max = Math.max(...totals) || 1;
  return (
    <div>
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col justify-end overflow-hidden rounded-sm" style={{ height: "100%" }}>
            {keys.map((k) => {
              const v = d[k.key] ?? 0;
              return <div key={k.key} style={{ height: `${(v / max) * 100}%`, background: k.color }} title={`${k.label}: ${v}`} />;
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4">
        {keys.map((k) => (
          <div key={k.key} className="flex items-center gap-1.5 text-xs text-[var(--g-muted)]">
            <span className="h-2 w-2 rounded-sm" style={{ background: k.color }} /> {k.label}
          </div>
        ))}
      </div>
    </div>
  );
}
