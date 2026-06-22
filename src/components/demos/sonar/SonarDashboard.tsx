"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  SONAR_PLATFORM,
  SONAR_ACCOUNT,
  SONAR_SOURCES,
  SONAR_SOURCE_CATEGORIES,
  SONAR_MONITORS,
  SONAR_ALERTS,
  SONAR_BUILDER_PRESETS,
  SONAR_AI_USAGE,
  SONAR_ANALYTICS,
  type SonarAlert,
  type SonarMonitor,
  type Sentiment,
  type Severity,
} from "@/data/sonar-demo";
import {
  Icon,
  SonarGlyph,
  SentimentChip,
  SeverityChip,
  HealthDot,
  SourceTypeBadge,
  type IconName,
} from "./SonarKit";
import { AreaChart, BarList, Donut, StackedBars } from "./SonarCharts";

/**
 * SonarDashboard - a fully clickable recreation of the Sonar console. One client
 * component holds the active-view state; the sidebar switches screens. Every
 * interaction runs locally on sample data: scan the live feed, triage alerts,
 * pause and run monitors, and build a brand-new monitor in plain English with a
 * 48-hour dry run before activation. Nothing hits a server.
 */

const BORDER = "var(--s-border)";
const PANEL = "var(--s-panel)";
const PANEL2 = "var(--s-panel-2)";
const RAISED = "var(--s-raised)";
const AMBER = "var(--s-amber)";

/** Clamp a value/total ratio to a 0-100 width percentage, guarding divide-by-zero. */
const pct = (value: number, total: number) => (total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0);

/** slug -> display name, for rendering a monitor's sources. */
const SOURCE_NAME: Record<string, string> = Object.fromEntries(
  SONAR_SOURCES.map((s) => [s.slug, s.name]),
);

type View = "overview" | "alerts" | "monitors" | "builder" | "analytics" | "sources";

const NAV: { group: string; items: { id: View; label: string; icon: IconName }[] }[] = [
  {
    group: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: "grid" },
      { id: "alerts", label: "Alerts", icon: "bell" },
      { id: "monitors", label: "Monitors", icon: "activity" },
      { id: "builder", label: "New monitor", icon: "sparkles" },
      { id: "analytics", label: "Analytics", icon: "chart" },
    ],
  },
  {
    group: "Data",
    items: [{ id: "sources", label: "Sources", icon: "layers" }],
  },
];

const TITLES: Record<View, string> = {
  overview: "Overview",
  alerts: "Alerts",
  monitors: "Monitors",
  builder: "New monitor",
  analytics: "Analytics",
  sources: "Sources",
};

export default function SonarDashboard() {
  const [view, setView] = useState<View>("overview");
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-3rem)] text-[var(--s-text)]">
      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r transition-transform duration-200 md:static md:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: PANEL2, borderColor: BORDER }}
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--s-amber-dim)" }}>
            <SonarGlyph size={18} />
          </span>
          <span className="text-base font-semibold tracking-[0.18em] text-white">SONAR</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3">
          {NAV.map((g) => (
            <div key={g.group} className="mb-3">
              <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--s-faint)]">{g.group}</p>
              {g.items.map((item) => {
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setNavOpen(false);
                    }}
                    className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
                    style={active ? { background: "var(--s-amber-dim)", color: AMBER } : { color: "var(--s-muted)" }}
                  >
                    <Icon name={item.icon} size={17} />
                    <span className={active ? "font-medium" : ""}>{item.label}</span>
                    {item.id === "alerts" && (
                      <span className="ml-auto rounded-full px-1.5 py-0.5 font-mono text-[10px]" style={{ background: "var(--s-amber-dim)", color: AMBER }}>
                        {SONAR_ALERTS.filter((a) => a.severity === "instant").length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t p-3" style={{ borderColor: BORDER }}>
          <Link href="/app/sonar" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--s-faint)] transition-colors hover:text-[var(--s-text)]">
            <span aria-hidden="true">&lt;-</span> Back to landing
          </Link>
        </div>
      </aside>

      {/* mobile overlay */}
      {navOpen && (
        <button aria-label="Close menu" onClick={() => setNavOpen(false)} className="fixed inset-0 z-30 bg-black/50 md:hidden" />
      )}

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b px-5 py-3.5" style={{ borderColor: BORDER, background: PANEL }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setNavOpen(true)} className="text-[var(--s-muted)] md:hidden" aria-label="Open menu">
              <Icon name="menu" />
            </button>
            <h1 className="text-lg font-semibold tracking-[-0.01em] text-white">{TITLES[view]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs sm:flex" style={{ borderColor: BORDER, color: AMBER }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: AMBER }} /> Live
            </span>
            <span className="hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs text-[var(--s-muted)] sm:flex" style={{ borderColor: BORDER }} title="AI spend this month">
              <Icon name="bolt" size={13} /> ${SONAR_ACCOUNT.aiSpendMtd.toFixed(0)}/${SONAR_ACCOUNT.aiSpendCap}
            </span>
            <button onClick={() => setView("alerts")} className="relative text-[var(--s-muted)] transition-colors hover:text-white" aria-label="Alerts">
              <Icon name="bell" size={19} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full" style={{ background: AMBER }} />
            </button>
            <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm" style={{ borderColor: BORDER, background: PANEL2 }}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-[#0A0C10]" style={{ background: AMBER }}>
                {SONAR_ACCOUNT.avatarLetter}
              </span>
              <span className="hidden text-white sm:inline">{SONAR_ACCOUNT.workspace}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-7">
          {view === "overview" && <OverviewScreen onGo={setView} />}
          {view === "alerts" && <AlertsScreen />}
          {view === "monitors" && <MonitorsScreen onNew={() => setView("builder")} />}
          {view === "builder" && <BuilderScreen />}
          {view === "analytics" && <AnalyticsScreen />}
          {view === "sources" && <SourcesScreen />}
        </main>
      </div>
    </div>
  );
}

/* =============================== screens ================================== */

function OverviewScreen({ onGo }: { onGo: (v: View) => void }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, []);

  const alertsToday = SONAR_PLATFORM.alertsToday + tick * 2;
  const rot = tick % SONAR_ALERTS.length;
  const liveFeed = [...SONAR_ALERTS.slice(rot), ...SONAR_ALERTS.slice(0, rot)].slice(0, 6);
  const activeMonitors = SONAR_MONITORS.filter((m) => m.health === "active");

  const stats = [
    { label: "Alerts today", value: alertsToday.toLocaleString(), hint: "live" },
    { label: "Monitors active", value: String(activeMonitors.length), hint: `of ${SONAR_MONITORS.length}` },
    { label: "Sources live", value: SONAR_PLATFORM.sourcesLive.toLocaleString(), hint: `${SONAR_PLATFORM.avgLatencySec}s median` },
    { label: "Rated relevant", value: `${SONAR_PLATFORM.precisionPct}%`, hint: "AI gate" },
  ];

  return (
    <div className="space-y-6">
      {/* welcome banner */}
      <div className="rounded-2xl border p-6" style={{ borderColor: BORDER, background: "linear-gradient(135deg, var(--s-panel), var(--s-panel-2) 70%)" }}>
        <p className="text-sm text-[var(--s-muted)]">Welcome back, {SONAR_ACCOUNT.seat.split(" ")[0]}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-0.02em] text-white">{SONAR_ACCOUNT.workspace}</h2>
        <p className="mt-2 text-sm text-[var(--s-text)]">
          On the <span style={{ color: AMBER }}>{SONAR_ACCOUNT.plan}</span> plan, running {activeMonitors.length} live monitors across {SONAR_PLATFORM.sourcesLive.toLocaleString()} sources.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => onGo("builder")} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-[#0A0C10]" style={{ background: AMBER }}>
            <Icon name="plus" size={15} /> New monitor
          </button>
          <button onClick={() => onGo("alerts")} className="rounded-lg border px-4 py-2 text-sm text-[var(--s-text)] transition-colors hover:bg-white/5" style={{ borderColor: BORDER }}>
            Triage alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* live feed */}
        <Card className="lg:col-span-2 !p-0">
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}>
            <CardTitle>Live capture</CardTitle>
            <span className="flex items-center gap-1.5 text-xs text-[var(--s-faint)]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: AMBER }} /> streaming
            </span>
          </div>
          <ul>
            {liveFeed.map((a, i) => (
              <li key={`${a.id}-${tick}-${i}`} className="flex items-start gap-3 border-b px-5 py-3.5 last:border-0" style={{ borderColor: BORDER, animation: i === 0 ? "s-pop .4s ease-out" : undefined }}>
                <span className="mt-0.5"><SentimentChip sentiment={a.sentiment} dense /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{a.headline}</p>
                  <p className="mt-0.5 truncate text-xs text-[var(--s-muted)]">
                    <span className="font-mono">{a.outlet}</span> · {a.monitor}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-[var(--s-faint)]">{i === 0 ? "now" : a.time}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => onGo("alerts")} className="block w-full border-t px-5 py-3 text-center text-xs font-medium text-[var(--s-amber)] transition-colors hover:bg-white/5" style={{ borderColor: BORDER }}>
            View all alerts
          </button>
        </Card>

        {/* right rail */}
        <div className="space-y-5">
          <Card>
            <CardTitle>Monitor slots</CardTitle>
            <SlotMeter used={SONAR_ACCOUNT.slotsUsed} total={SONAR_ACCOUNT.slotsTotal} />
            <div className="mt-5 border-t pt-4" style={{ borderColor: BORDER }}>
              <CardTitle>AI spend this month</CardTitle>
              <p className="mt-2 text-2xl font-bold text-white">
                ${SONAR_AI_USAGE.total.toFixed(0)}
                <span className="text-sm font-normal text-[var(--s-faint)]"> / {SONAR_AI_USAGE.cap}</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: PANEL2 }}>
                <div className="h-full rounded-full" style={{ width: `${pct(SONAR_AI_USAGE.total, SONAR_AI_USAGE.cap)}%`, background: AMBER }} />
              </div>
              <div className="mt-3 space-y-1.5">
                {SONAR_AI_USAGE.byModel.map((m) => (
                  <div key={m.model} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-[var(--s-muted)]">
                      <span className="h-2 w-2 rounded-full" style={{ background: m.color }} /> {m.model}
                    </span>
                    <span className="font-mono text-[var(--s-faint)]">${m.cost.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Sentiment this week</CardTitle>
            <div className="mt-4">
              <Donut
                segments={SONAR_ANALYTICS.sentiment.map((s) => ({ ...s }))}
                size={120}
                centerLabel={`${SONAR_ANALYTICS.sentiment.reduce((s, x) => s + x.value, 0)}`}
                centerSub="ALERTS"
                unit="%"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AlertsScreen() {
  const [sev, setSev] = useState<"all" | Severity>("all");
  const [sent, setSent] = useState<"all" | Sentiment>("all");
  const [read, setRead] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<SonarAlert | null>(null);

  const filtered = SONAR_ALERTS.filter(
    (a) => (sev === "all" || a.severity === sev) && (sent === "all" || a.sentiment === sent),
  );

  function openAlert(a: SonarAlert) {
    setOpen(a);
    setRead((prev) => new Set(prev).add(a.id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <FilterGroup
          label="Severity"
          value={sev}
          onChange={(v) => setSev(v as typeof sev)}
          options={[{ id: "all", label: "All" }, { id: "instant", label: "Instant" }, { id: "digest", label: "Digest" }]}
        />
        <FilterGroup
          label="Sentiment"
          value={sent}
          onChange={(v) => setSent(v as typeof sent)}
          options={[{ id: "all", label: "All" }, { id: "positive", label: "Positive" }, { id: "neutral", label: "Neutral" }, { id: "negative", label: "Negative" }]}
        />
        <span className="ml-auto font-mono text-xs text-[var(--s-faint)]">{filtered.length} alerts</span>
      </div>

      <Card className="!p-0 overflow-hidden">
        {filtered.map((a) => {
          const isRead = read.has(a.id);
          return (
            <button
              key={a.id}
              onClick={() => openAlert(a)}
              className="flex w-full items-start gap-3 border-b px-5 py-4 text-left transition-colors last:border-0 hover:bg-white/[0.02]"
              style={{ borderColor: BORDER }}
            >
              {!isRead ? (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: AMBER }} />
              ) : (
                <span className="mt-1.5 h-2 w-2 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-sm leading-snug ${isRead ? "text-[var(--s-muted)]" : "font-medium text-white"}`}>{a.headline}</p>
                  <span className="shrink-0 font-mono text-[11px] text-[var(--s-faint)]">{a.time}</span>
                </div>
                <p className="mt-1 truncate text-xs text-[var(--s-muted)]">{a.summary}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-[var(--s-faint)]">{a.outlet}</span>
                  {a.ticker && <span className="rounded border px-1.5 py-0.5 font-mono text-[10px] text-[var(--s-muted)]" style={{ borderColor: BORDER }}>{a.ticker}</span>}
                  <SentimentChip sentiment={a.sentiment} />
                  <SeverityChip severity={a.severity} />
                </div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && <div className="px-5 py-10 text-center text-sm text-[var(--s-faint)]">No alerts match this filter.</div>}
      </Card>

      {open && <AlertDrawer alert={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function AlertDrawer({ alert, onClose }: { alert: SonarAlert; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div role="dialog" aria-modal="true" aria-labelledby={`alert-title-${alert.id}`} className="relative z-10 flex h-full w-full max-w-md flex-col border-l shadow-2xl" style={{ borderColor: BORDER, background: PANEL }}>
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2">
            <SeverityChip severity={alert.severity} />
            <span className="font-mono text-xs text-[var(--s-faint)]">{alert.time}</span>
          </div>
          <button onClick={onClose} className="text-[var(--s-muted)] transition-colors hover:text-white" aria-label="Close"><Icon name="close" size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <h3 id={`alert-title-${alert.id}`} className="text-lg font-semibold leading-snug text-white">{alert.headline}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[var(--s-muted)]">{alert.outlet}</span>
            <SourceTypeBadge type={alert.sourceType} />
            {alert.ticker && <span className="rounded border px-1.5 py-0.5 font-mono text-[10px] text-[var(--s-muted)]" style={{ borderColor: BORDER }}>{alert.ticker}</span>}
            <SentimentChip sentiment={alert.sentiment} />
          </div>

          <div className="mt-5 rounded-xl border p-4" style={{ borderColor: BORDER, background: PANEL2 }}>
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--s-amber)]"><Icon name="sparkles" size={12} /> Why it matters</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--s-text)]">{alert.summary}</p>
          </div>

          <div className="mt-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--s-faint)]">Triggered by</p>
            <p className="mt-1.5 text-sm text-[var(--s-text)]">{alert.monitor}</p>
          </div>

          <div className="mt-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--s-faint)]">Matched terms</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {alert.matched.map((m) => (
                <span key={m} className="rounded-md px-2 py-0.5 font-mono text-[11px]" style={{ background: "var(--s-amber-dim)", color: AMBER }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t p-4" style={{ borderColor: BORDER }}>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0A0C10]" style={{ background: AMBER }}>
            <Icon name="send" size={15} /> Route to team
          </button>
          <button className="flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm text-[var(--s-text)] transition-colors hover:bg-white/5" style={{ borderColor: BORDER }}>
            <Icon name="external" size={15} /> Source
          </button>
        </div>
      </div>
    </div>
  );
}

function MonitorsScreen({ onNew }: { onNew: () => void }) {
  const [mons, setMons] = useState<SonarMonitor[]>([...SONAR_MONITORS]);
  const [q, setQ] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mons;
    return mons.filter((m) => `${m.name} ${m.entities.join(" ")}`.toLowerCase().includes(s));
  }, [q, mons]);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }
  function togglePause(id: string, name: string) {
    setMons((prev) => prev.map((m) => (m.id === id ? { ...m, health: m.health === "paused" ? "active" : "paused" } : m)));
    flash(`Updated ${name}`);
  }
  function dryRun(name: string) {
    flash(`Dry run queued for ${name}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--s-muted)]">{SONAR_ACCOUNT.slotsUsed} of {SONAR_ACCOUNT.slotsTotal} monitor slots in use.</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5" style={{ borderColor: BORDER }}>
            <span className="text-[var(--s-faint)]"><Icon name="search" size={15} /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search monitors" className="w-32 bg-transparent text-sm text-white outline-none placeholder:text-[var(--s-faint)] sm:w-44" />
          </div>
          <button onClick={onNew} className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#0A0C10]" style={{ background: AMBER }}>
            <Icon name="plus" size={15} /> New
          </button>
        </div>
      </div>
      {toast && <span className="inline-block text-sm" style={{ color: AMBER }}>{toast}</span>}

      <Card className="!p-0 overflow-hidden">
        <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--s-faint)] lg:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-4">Monitor</div>
          <div className="col-span-2">Cadence</div>
          <div className="col-span-2">Severity</div>
          <div className="col-span-1 text-right">Per day</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        {filtered.map((m) => (
          <div key={m.id} className="grid grid-cols-1 gap-3 border-b px-5 py-4 last:border-0 lg:grid-cols-12 lg:items-center lg:gap-4" style={{ borderColor: BORDER }}>
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2">
                <HealthDot health={m.health} />
                <p className="text-sm font-medium text-white">{m.name}</p>
              </div>
              <p className="mt-1 truncate font-mono text-[11px] text-[var(--s-faint)]">
                {m.entities.join(", ")} · {m.sources.map((s) => SOURCE_NAME[s] ?? s).slice(0, 2).join(", ")}{m.sources.length > 2 ? ` +${m.sources.length - 2}` : ""}
              </p>
            </div>
            <div className="font-mono text-xs text-[var(--s-muted)] lg:col-span-2">{m.cadence}</div>
            <div className="lg:col-span-2"><SeverityChip severity={m.severity} /></div>
            <div className="font-mono text-sm text-[var(--s-text)] lg:col-span-1 lg:text-right">{m.itemsPerDay}</div>
            <div className="flex items-center gap-2 lg:col-span-3 lg:justify-end">
              <button onClick={() => dryRun(m.name)} className="rounded-md border px-2.5 py-1 text-xs text-[var(--s-text)] transition-colors hover:bg-white/5" style={{ borderColor: BORDER }}>
                Dry run
              </button>
              <button onClick={() => togglePause(m.id, m.name)} className="flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs text-[var(--s-text)] transition-colors hover:bg-white/5" style={{ borderColor: BORDER }}>
                <Icon name={m.health === "paused" ? "play" : "pause"} size={12} /> {m.health === "paused" ? "Resume" : "Pause"}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="px-5 py-10 text-center text-sm text-[var(--s-faint)]">No monitors match &ldquo;{q}&rdquo;.</div>}
      </Card>
    </div>
  );
}

function BuilderScreen() {
  const [presetId, setPresetId] = useState(SONAR_BUILDER_PRESETS[0].id);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [activated, setActivated] = useState(false);
  const preset = SONAR_BUILDER_PRESETS.find((p) => p.id === presetId) ?? SONAR_BUILDER_PRESETS[0];

  function pick(id: string) {
    setPresetId(id);
    setPhase("idle");
    setActivated(false);
  }
  function runDry() {
    setPhase("running");
    window.setTimeout(() => setPhase("done"), 950);
  }

  const spec = preset.spec;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      {/* left: conversation */}
      <div className="flex flex-col rounded-2xl border" style={{ borderColor: BORDER, background: PANEL }}>
        <div className="flex items-center gap-2 border-b px-5 py-4" style={{ borderColor: BORDER }}>
          <Icon name="sparkles" size={15} className="text-[var(--s-amber)]" />
          <CardTitle>Describe your monitor</CardTitle>
        </div>
        <div className="flex-1 space-y-3 p-5">
          <p className="text-xs text-[var(--s-faint)]">Try one of these, or imagine your own:</p>
          <div className="flex flex-col gap-2">
            {SONAR_BUILDER_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => pick(p.id)}
                className="rounded-lg border px-3 py-2 text-left text-xs leading-relaxed transition-colors"
                style={presetId === p.id ? { borderColor: "rgba(255,178,36,0.4)", background: "var(--s-amber-dim)", color: "var(--s-text)" } : { borderColor: BORDER, color: "var(--s-muted)" }}
              >
                {p.prompt}
              </button>
            ))}
          </div>

          <div className="mt-2 space-y-3 border-t pt-4" style={{ borderColor: BORDER }}>
            <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-[#0A0C10]" style={{ background: AMBER }}>
              {preset.prompt}
            </div>
            <div className="max-w-[92%] rounded-2xl rounded-bl-sm border px-3.5 py-2.5 text-sm leading-relaxed text-[var(--s-text)]" style={{ borderColor: BORDER, background: PANEL2 }}>
              {preset.reply}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t p-4" style={{ borderColor: BORDER }}>
          <div className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2.5" style={{ borderColor: BORDER, background: PANEL2 }}>
            <Icon name="sparkles" size={15} className="text-[var(--s-faint)]" />
            <span className="text-sm text-[var(--s-faint)]">Describe what to watch...</span>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-[#0A0C10]" style={{ background: AMBER }} aria-label="Send">
            <Icon name="send" size={16} />
          </button>
        </div>
      </div>

      {/* right: resolved spec + dry run */}
      <div className="space-y-5">
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Resolved spec</CardTitle>
            <span className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider" style={{ background: "var(--s-amber-dim)", color: AMBER }}>Validated</span>
          </div>
          <div className="mt-4 space-y-3">
            <SpecRow label="Entities">{spec.entities.join(", ")}</SpecRow>
            <SpecRow label="Match any">
              <span className="flex flex-wrap gap-1.5">
                {spec.keywords.any.map((k) => (
                  <span key={k} className="rounded-md px-1.5 py-0.5 font-mono text-[11px]" style={{ background: PANEL2, color: "var(--s-text)" }}>{k}</span>
                ))}
              </span>
            </SpecRow>
            {spec.keywords.exclude.length > 0 && (
              <SpecRow label="Exclude">
                <span className="flex flex-wrap gap-1.5">
                  {spec.keywords.exclude.map((k) => (
                    <span key={k} className="rounded-md px-1.5 py-0.5 font-mono text-[11px] text-[var(--s-faint)] line-through" style={{ background: PANEL2 }}>{k}</span>
                  ))}
                </span>
              </SpecRow>
            )}
            <SpecRow label="Sources">{spec.sources.join(", ")}</SpecRow>
            <SpecRow label="Cadence">{spec.cadence}</SpecRow>
            <SpecRow label="Delivery">
              <span className="flex flex-wrap gap-1.5">
                {spec.delivery.map((d) => (
                  <span key={d} className="rounded-full border px-2 py-0.5 text-[11px] text-[var(--s-muted)]" style={{ borderColor: BORDER }}>{d}</span>
                ))}
              </span>
            </SpecRow>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4" style={{ borderColor: BORDER }}>
            <MiniStat label="Severity" value={spec.severity === "instant" ? "Instant" : "Digest"} accent={spec.severity === "instant"} />
            <MiniStat label="Est / day" value={`~${spec.estItemsPerDay}`} />
            <MiniStat label="Est / mo" value={`~$${spec.estCostPerMonth}`} />
          </div>

          {spec.unresolved.length > 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs leading-relaxed" style={{ borderColor: "rgba(255,178,36,0.3)", background: "var(--s-amber-dim)", color: "var(--s-text)" }}>
              <span className="mt-0.5 text-[var(--s-amber)]"><Icon name="bolt" size={13} /></span>
              <span>{spec.unresolved.join(" ")}</span>
            </div>
          )}
        </Card>

        {/* dry run */}
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Dry run</CardTitle>
            <span className="font-mono text-[11px] text-[var(--s-faint)]">last 48 hours</span>
          </div>

          {phase === "idle" && (
            <div className="mt-4">
              <p className="text-sm text-[var(--s-muted)]">Replay the last 48 hours to see exactly what this monitor would have caught before it goes live.</p>
              <button onClick={runDry} className="mt-4 flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0A0C10]" style={{ background: AMBER }}>
                <Icon name="play" size={15} /> Run dry run
              </button>
            </div>
          )}

          {phase === "running" && (
            <div className="mt-6 flex items-center gap-3 text-sm text-[var(--s-muted)]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--s-faint)] border-t-[var(--s-amber)]" />
              Scanning {preset.dryRun.scanned.toLocaleString()} items across {preset.dryRun.sources} {preset.dryRun.sources === 1 ? "source" : "sources"}...
            </div>
          )}

          {phase === "done" && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-[var(--s-text)]">
                Scanned <span className="font-mono text-white">{preset.dryRun.scanned.toLocaleString()}</span> items across {preset.dryRun.sources} {preset.dryRun.sources === 1 ? "source" : "sources"}.{" "}
                <span style={{ color: AMBER }}>{preset.dryRun.matches.length} matches</span> would have fired.
              </p>
              <div className="space-y-2">
                {preset.dryRun.matches.map((m, i) => (
                  <div key={i} className="rounded-lg border p-3" style={{ borderColor: BORDER, background: PANEL2, animation: "s-pop .35s ease-out" }}>
                    <p className="text-sm leading-snug text-white">{m.headline}</p>
                    <div className="mt-1.5 flex items-center gap-2 font-mono text-[11px] text-[var(--s-faint)]">
                      <span>{m.outlet}</span>{m.ticker && <span className="text-[var(--s-muted)]">{m.ticker}</span>}<span>·</span><span>{m.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              {activated ? (
                <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium" style={{ background: "rgba(54,211,153,0.12)", color: "var(--s-bull)" }}>
                  <Icon name="check" size={16} /> Monitor activated. It is now watching live.
                </div>
              ) : (
                <button onClick={() => setActivated(true)} className="flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0A0C10]" style={{ background: AMBER }}>
                  <Icon name="check" size={15} /> Activate monitor
                </button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function AnalyticsScreen() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <CardTitle>Coverage volume</CardTitle>
            <span className="font-mono text-[11px] text-[var(--s-faint)]">last 14 days</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-white">
            {SONAR_ANALYTICS.coverageVolume.reduce((a, b) => a + b, 0).toLocaleString()}
            <span className="text-sm font-normal text-[var(--s-faint)]"> mentions</span>
          </p>
          <div className="mt-3">
            <AreaChart data={[...SONAR_ANALYTICS.coverageVolume]} height={120} />
          </div>
        </Card>

        <Card>
          <CardTitle>Sentiment mix</CardTitle>
          <div className="mt-5">
            <Donut
              segments={SONAR_ANALYTICS.sentiment.map((s) => ({ ...s }))}
              centerLabel={`${SONAR_ANALYTICS.sentiment.reduce((s, x) => s + x.value, 0)}`}
              centerSub="ALERTS"
              unit="%"
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardTitle>Share of voice</CardTitle>
          <p className="mt-1 text-xs text-[var(--s-faint)]">Mentions captured by outlet</p>
          <div className="mt-4">
            <BarList items={SONAR_ANALYTICS.shareOfVoice.map((s) => ({ ...s }))} />
          </div>
        </Card>

        <Card>
          <CardTitle>Most active monitors</CardTitle>
          <p className="mt-1 text-xs text-[var(--s-faint)]">Matches this week</p>
          <div className="mt-4">
            <BarList items={SONAR_ANALYTICS.topMonitors.map((s) => ({ ...s }))} color="var(--s-bull)" />
          </div>
        </Card>

        <Card>
          <CardTitle>AI spend by model</CardTitle>
          <p className="mt-1 text-xs text-[var(--s-faint)]">Daily, last 14 days</p>
          <div className="mt-5">
            <StackedBars
              data={SONAR_AI_USAGE.daily.map((d) => ({ ...d }))}
              keys={[
                { key: "haiku", color: "#36D399", label: "Haiku gate" },
                { key: "opus", color: "#FFB224", label: "Opus spec" },
                { key: "sonnet", color: "#60A5FA", label: "Sonnet digest" },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function SourcesScreen() {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");

  const tabs = [{ id: "all", name: "All" }, ...SONAR_SOURCE_CATEGORIES.map((c) => ({ id: c.id, name: c.name }))];
  const shown = SONAR_SOURCES.filter((s) => {
    const inCat = cat === "all" || s.category === cat;
    const inQ = !q.trim() || s.name.toLowerCase().includes(q.trim().toLowerCase());
    return inCat && inQ;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--s-muted)]">{SONAR_SOURCES.length} connected sources across {SONAR_SOURCE_CATEGORIES.length} categories.</p>
        <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5" style={{ borderColor: BORDER }}>
          <span className="text-[var(--s-faint)]"><Icon name="search" size={15} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sources" className="w-32 bg-transparent text-sm text-white outline-none placeholder:text-[var(--s-faint)] sm:w-44" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setCat(t.id)}
            className="rounded-full border px-3.5 py-1.5 text-sm transition-colors"
            style={cat === t.id ? { background: AMBER, borderColor: AMBER, color: "#0A0C10" } : { borderColor: BORDER, color: "var(--s-muted)" }}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s) => (
          <div key={s.id} className="flex flex-col rounded-2xl border p-5" style={{ borderColor: BORDER, background: PANEL }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HealthDot health={s.health} />
                <h3 className="text-sm font-semibold text-white">{s.name}</h3>
              </div>
              <SourceTypeBadge type={s.type} />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[var(--s-faint)]">
              <span className="font-mono">{s.cadence}</span>
              <span>{s.itemsToday.toLocaleString()} today</span>
            </div>
            {s.licensed && (
              <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px]" style={{ background: "var(--s-amber-dim)", color: AMBER }}>
                <Icon name="shield" size={10} /> Licensed
              </span>
            )}
          </div>
        ))}
      </div>
      {shown.length === 0 && <div className="py-10 text-center text-sm text-[var(--s-faint)]">No sources match.</div>}
    </div>
  );
}

/* ============================== primitives =============================== */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border p-6 ${className}`} style={{ borderColor: BORDER, background: PANEL }}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--s-muted)]">{children}</h3>;
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: BORDER, background: PANEL }}>
      <div className="text-2xl font-bold tracking-[-0.02em] text-white">{value}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-[var(--s-faint)]">{label}</span>
        {hint && <span className="text-[11px]" style={{ color: AMBER }}>{hint}</span>}
      </div>
    </div>
  );
}

function SlotMeter({ used, total }: { used: number; total: number }) {
  return (
    <div className="mt-3">
      <p className="text-2xl font-bold text-white">
        {used}<span className="text-sm font-normal text-[var(--s-faint)]"> / {total}</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: PANEL2 }}>
        <div className="h-full rounded-full" style={{ width: `${pct(used, total)}%`, background: "linear-gradient(90deg, var(--s-amber), #FFCE73)" }} />
      </div>
      <p className="mt-1.5 text-xs text-[var(--s-faint)]">{total - used} slots available</p>
    </div>
  );
}

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-wider text-[var(--s-faint)]">{label}</span>
      <span className="min-w-0 flex-1 text-[var(--s-text)]">{children}</span>
    </div>
  );
}

function MiniStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border px-3 py-2 text-center" style={{ borderColor: BORDER, background: PANEL2 }}>
      <div className="text-sm font-semibold" style={{ color: accent ? AMBER : "#fff" }}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-[var(--s-faint)]">{label}</div>
    </div>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--s-faint)] sm:inline">{label}</span>
      <div className="inline-flex items-center rounded-lg border p-1" style={{ borderColor: BORDER, background: PANEL2 }}>
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
              style={active ? { background: RAISED, color: "#fff" } : { color: "var(--s-muted)" }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
