"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  GALACTIC_PLATFORM,
  GALACTIC_FEEDS,
  GALACTIC_MONITORS,
  GALACTIC_USERS,
  GALACTIC_ALERTS,
  type GalacticAlert,
} from "@/data/galactic-demo";
import {
  ADMIN_SERVER_HEALTH,
  ADMIN_DELIVERY_VOLUME,
  ADMIN_SUCCESS_RATE,
  ADMIN_BUSIEST_FEEDS,
  ADMIN_DELIVERY_LOGS,
  ADMIN_USER_GROWTH,
  ADMIN_PLAN_SPLIT,
  ADMIN_REVENUE,
  ADMIN_PRODUCTS,
  ADMIN_AI_MODELS,
  ADMIN_AI_FEATURES,
  ADMIN_AI_DAILY,
  ADMIN_BUILDER_FALLBACK,
  type AdminLogStatus,
} from "@/data/galactic-admin-demo";
import { Icon, EmbedCard, type IconName } from "./GalacticKit";
import { AreaChart, BarList, Donut, StackedBars } from "./GalacticCharts";

/**
 * GalacticAdmin - the admin-side console for the Galactic Signals demo, mirroring
 * the real galactic-app admin panel: an operations overview, system analytics,
 * users with growth + plan charts, monitors/feeds/products tables, AI usage and
 * cost tracking, a cross-platform embed visualizer, and the flagship Monitor
 * Builder, which calls Claude live (Haiku) to turn plain English into a real
 * branded monitor. Everything else runs on deterministic sample data.
 */

const BORDER = "var(--g-border)";
const PANEL = "var(--g-panel)";
const PANEL2 = "var(--g-panel-2)";
const TEAL = "var(--g-teal)";
const CYAN = "var(--g-cyan)";
const BLURPLE = "var(--g-blurple)";

type AdminView =
  | "overview"
  | "system"
  | "users"
  | "monitors"
  | "feeds"
  | "products"
  | "ai"
  | "builder"
  | "visualizer";

const NAV: { group: string; items: { id: AdminView; label: string; icon: IconName }[] }[] = [
  { group: "Overview", items: [{ id: "overview", label: "Dashboard", icon: "home" }, { id: "system", label: "System", icon: "shield" }] },
  {
    group: "Content",
    items: [
      { id: "feeds", label: "Feeds", icon: "store" },
      { id: "monitors", label: "Monitors", icon: "activity" },
      { id: "products", label: "Products", icon: "rocket" },
    ],
  },
  {
    group: "Tools",
    items: [
      { id: "builder", label: "Monitor Builder", icon: "sparkles" },
      { id: "visualizer", label: "Embed Visualizer", icon: "eye" },
    ],
  },
  { group: "Data", items: [{ id: "users", label: "Users", icon: "users" }, { id: "ai", label: "AI Usage", icon: "bolt" }] },
];

const TITLES: Record<AdminView, string> = {
  overview: "Admin Dashboard",
  system: "System Health",
  users: "Users",
  monitors: "Monitors",
  feeds: "Feeds",
  products: "Products",
  ai: "Artoo Models & Usage",
  builder: "Monitor Builder",
  visualizer: "Embed Visualizer",
};

export default function GalacticAdmin({ modeToggle }: { modeToggle?: React.ReactNode }) {
  const [view, setView] = useState<AdminView>("overview");
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-3rem)] text-[var(--g-text)]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r transition-transform duration-200 md:static md:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: PANEL2, borderColor: BORDER }}
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(88,101,242,0.16)", color: BLURPLE }}>
            <Icon name="shield" size={18} />
          </span>
          <div className="leading-tight">
            <span className="block text-base font-semibold text-white">Galactic</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-[var(--g-faint)]">Admin console</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3">
          {NAV.map((g) => (
            <div key={g.group} className="mb-3">
              <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--g-faint)]">{g.group}</p>
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
                    style={active ? { background: "rgba(88,101,242,0.14)", color: "#aab4fc" } : { color: "var(--g-muted)" }}
                  >
                    <Icon name={item.icon} size={17} />
                    <span className={active ? "font-medium" : ""}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t p-3" style={{ borderColor: BORDER }}>
          <Link href="/app/galactic-signals" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--g-faint)] transition-colors hover:text-[var(--g-text)]">
            <span aria-hidden="true">&lt;-</span> Back to landing
          </Link>
        </div>
      </aside>

      {navOpen && <button aria-label="Close menu" onClick={() => setNavOpen(false)} className="fixed inset-0 z-30 bg-black/50 md:hidden" />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b px-5 py-3" style={{ borderColor: BORDER, background: PANEL }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setNavOpen(true)} className="text-[var(--g-muted)] md:hidden" aria-label="Open menu">
              <Icon name="menu" />
            </button>
            <h1 className="text-lg font-semibold text-white">{TITLES[view]}</h1>
            <span className="hidden rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider sm:inline" style={{ background: "rgba(88,101,242,0.16)", color: "#aab4fc" }}>
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            {modeToggle}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-7">
          {view === "overview" && <OverviewScreen />}
          {view === "system" && <SystemScreen />}
          {view === "users" && <UsersScreen />}
          {view === "monitors" && <MonitorsScreen />}
          {view === "feeds" && <FeedsScreen />}
          {view === "products" && <ProductsScreen />}
          {view === "ai" && <AiUsageScreen />}
          {view === "builder" && <BuilderScreen />}
          {view === "visualizer" && <VisualizerScreen />}
        </main>
      </div>
    </div>
  );
}

/* =============================== screens ================================== */

function OverviewScreen() {
  const deliveries24h = ADMIN_DELIVERY_VOLUME[ADMIN_DELIVERY_VOLUME.length - 1];
  const kpis = [
    { label: "Communities", value: GALACTIC_PLATFORM.communities.toLocaleString(), hint: "+312 this wk", icon: "users" as IconName },
    { label: "Active webhooks", value: GALACTIC_PLATFORM.channelsConnected.toLocaleString(), hint: "21.6k channels", icon: "webhook" as IconName },
    { label: "Deliveries (24h)", value: `${(deliveries24h / 1000).toFixed(1)}k`, hint: "↑ live", icon: "bolt" as IconName },
    { label: "MRR", value: `$${(ADMIN_REVENUE.mrr / 1000).toFixed(1)}k`, hint: `+${ADMIN_REVENUE.mrrGrowthPct}%`, icon: "rocket" as IconName },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardTitle>Server health</CardTitle>
          <div className="mt-4 space-y-4">
            <HealthBar label="Memory" pct={ADMIN_SERVER_HEALTH.memory.usedPct} detail={`${ADMIN_SERVER_HEALTH.memory.usedGb} / ${ADMIN_SERVER_HEALTH.memory.totalGb} GB`} />
            <HealthBar label="Disk" pct={ADMIN_SERVER_HEALTH.disk.usedPct} detail={`${ADMIN_SERVER_HEALTH.disk.usedGb} / ${ADMIN_SERVER_HEALTH.disk.totalGb} GB`} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--g-muted)]">CPU load</span>
              <span className="font-mono text-white">{ADMIN_SERVER_HEALTH.cpu.load1} / {ADMIN_SERVER_HEALTH.cpu.load5} / {ADMIN_SERVER_HEALTH.cpu.load15}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--g-muted)]">Uptime</span>
              <span className="font-mono text-white">{ADMIN_SERVER_HEALTH.uptime} · {ADMIN_SERVER_HEALTH.node}</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 !p-0">
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}>
            <CardTitle>Delivery stream</CardTitle>
            <span className="flex items-center gap-1.5 text-xs text-[var(--g-faint)]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: TEAL }} /> streaming
            </span>
          </div>
          <div className="hidden grid-cols-12 gap-3 border-b px-5 py-2.5 text-[10px] uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
            <div className="col-span-2">Time</div>
            <div className="col-span-3">Feed</div>
            <div className="col-span-2">User</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Payload</div>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {ADMIN_DELIVERY_LOGS.map((l) => (
              <div key={l.id} className="grid grid-cols-2 gap-3 border-b px-5 py-2.5 text-xs last:border-0 md:grid-cols-12" style={{ borderColor: BORDER }}>
                <div className="font-mono text-[var(--g-faint)] md:col-span-2">{l.time}</div>
                <div className="font-mono text-[var(--g-text)] md:col-span-3">{l.feed}</div>
                <div className="text-[var(--g-muted)] md:col-span-2">{l.user}</div>
                <div className="md:col-span-2"><LogStatus status={l.status} /></div>
                <div className="hidden truncate font-mono text-[var(--g-faint)] md:col-span-3 md:block">{l.payload}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SystemScreen() {
  const cards = [
    { label: "Deliveries (24h)", value: `${(ADMIN_DELIVERY_VOLUME[ADMIN_DELIVERY_VOLUME.length - 1] / 1000).toFixed(1)}k`, c: TEAL },
    { label: "Success rate", value: `${ADMIN_SUCCESS_RATE[ADMIN_SUCCESS_RATE.length - 1]}%`, c: TEAL },
    { label: "Avg latency", value: `${GALACTIC_PLATFORM.avgLatencyMs}ms`, c: CYAN },
    { label: "Feeds live", value: String(GALACTIC_PLATFORM.feedsLive), c: CYAN },
    { label: "Uptime", value: `${GALACTIC_PLATFORM.uptimePct}%`, c: TEAL },
  ];
  const feedStatus = (i: number, activated?: boolean) =>
    i % 13 === 0 ? "error" : i % 9 === 0 ? "stale" : activated ? "active" : "idle";
  const statusColor: Record<string, string> = { active: "#1DD1A1", stale: "#F39C12", error: "#ED4245", idle: "#3B4A63" };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border p-4" style={{ borderColor: BORDER, background: PANEL }}>
            <div className="text-xl font-bold" style={{ color: c.c }}>{c.value}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--g-faint)]">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <CardTitle>Delivery volume · 14d</CardTitle>
            <span className="text-xs text-[var(--g-faint)]">{(ADMIN_DELIVERY_VOLUME.reduce((a, b) => a + b, 0) / 1_000_000).toFixed(2)}M total</span>
          </div>
          <div className="mt-4"><AreaChart data={ADMIN_DELIVERY_VOLUME} height={120} /></div>
        </Card>
        <Card>
          <CardTitle>Success rate · 14d</CardTitle>
          <div className="mt-4"><AreaChart data={ADMIN_SUCCESS_RATE} color="#22D3EE" height={120} /></div>
          <p className="mt-2 text-xs text-[var(--g-faint)]">Low of {Math.min(...ADMIN_SUCCESS_RATE)}% during a Discord incident.</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Busiest feeds · 24h</CardTitle>
          <div className="mt-4"><BarList items={ADMIN_BUSIEST_FEEDS} /></div>
        </Card>
        <Card>
          <CardTitle>Feed status</CardTitle>
          <div className="mt-4 grid grid-cols-12 gap-1.5 sm:[grid-template-columns:repeat(16,minmax(0,1fr))]">
            {GALACTIC_FEEDS.map((f, i) => {
              const st = feedStatus(i, f.activated);
              return <span key={f.id} title={`${f.name} · ${st}`} className="aspect-square rounded-[3px]" style={{ background: statusColor[st] }} />;
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--g-muted)]">
            {Object.entries(statusColor).map(([k, c]) => (
              <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-[2px]" style={{ background: c }} /> {k}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function UsersScreen() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return GALACTIC_USERS;
    return GALACTIC_USERS.filter((u) => `${u.name} ${u.handle} ${u.community}`.toLowerCase().includes(s));
  }, [q]);

  const cards = [
    { label: "Communities", value: GALACTIC_PLATFORM.communities.toLocaleString() },
    { label: "Pro subscribers", value: ADMIN_PLAN_SPLIT[1].value.toLocaleString() },
    { label: "Business", value: ADMIN_PLAN_SPLIT[2].value.toLocaleString() },
    { label: "Net rev. retention", value: `${ADMIN_REVENUE.netRevenueRetentionPct}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Community growth · 12mo</CardTitle>
          <div className="mt-4"><AreaChart data={ADMIN_USER_GROWTH.map((m) => m.total)} height={130} /></div>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-[var(--g-faint)]">
            {ADMIN_USER_GROWTH.filter((_, i) => i % 2 === 0).map((m) => <span key={m.month}>{m.month}</span>)}
          </div>
        </Card>
        <Card>
          <CardTitle>Plan distribution</CardTitle>
          <div className="mt-5"><Donut segments={ADMIN_PLAN_SPLIT} centerLabel={GALACTIC_PLATFORM.communities.toLocaleString()} centerSub="TOTAL" /></div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--g-muted)]">{GALACTIC_PLATFORM.traders.toLocaleString()}+ traders. Showing a sample of communities.</p>
        <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5" style={{ borderColor: BORDER }}>
          <span className="text-[var(--g-faint)]"><Icon name="search" size={15} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users" className="bg-transparent text-sm text-white outline-none placeholder:text-[var(--g-faint)]" />
        </div>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-4">User</div>
          <div className="col-span-3">Community</div>
          <div className="col-span-2">Plan</div>
          <div className="col-span-1">Chan.</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        {filtered.map((u) => (
          <div key={u.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3 md:col-span-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-[#04140f]" style={{ background: TEAL }}>{u.name.charAt(0)}</span>
              <div><p className="text-sm font-medium text-white">{u.name}</p><p className="text-xs text-[var(--g-faint)]">@{u.handle}</p></div>
            </div>
            <div className="text-sm text-[var(--g-muted)] md:col-span-3">{u.community}</div>
            <div className="md:col-span-2"><span className="rounded-full border px-2 py-0.5 text-xs" style={{ borderColor: BORDER, color: "var(--g-muted)" }}>{u.plan}</span></div>
            <div className="text-sm text-[var(--g-text)] md:col-span-1">{u.channels}</div>
            <div className="md:col-span-2 md:text-right"><Pill kind={u.status} /></div>
          </div>
        ))}
        {filtered.length === 0 && <div className="px-5 py-8 text-center text-sm text-[var(--g-faint)]">No users match &ldquo;{q}&rdquo;.</div>}
      </Card>
    </div>
  );
}

function MonitorsScreen() {
  const [q, setQ] = useState("");
  const counts = useMemo(() => {
    const c = { total: GALACTIC_MONITORS.length, active: 0, running: 0, paused: 0, errors: 0 };
    for (const m of GALACTIC_MONITORS) {
      if (m.status === "completed") c.active++;
      else if (m.status === "in_progress") c.running++;
      else c.paused++;
      if (m.errorCount > 0) c.errors++;
    }
    return c;
  }, []);
  const filtered = GALACTIC_MONITORS.filter((m) => `${m.name} ${m.slug}`.toLowerCase().includes(q.trim().toLowerCase()));
  const statusCards = [
    { label: "Total", value: counts.total, c: "#FFFFFF" },
    { label: "Active", value: counts.active, c: "#1DD1A1" },
    { label: "Running", value: counts.running, c: "#22D3EE" },
    { label: "Paused", value: counts.paused, c: "#7C8DA8" },
    { label: "With errors", value: counts.errors, c: "#ED4245" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {statusCards.map((s) => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: BORDER, background: PANEL }}>
            <div className="text-2xl font-bold" style={{ color: s.c }}>{s.value}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--g-faint)]">{s.label}</div>
          </div>
        ))}
      </div>
      <SearchRow q={q} setQ={setQ} placeholder="Search monitors by name or slug" hint="Curated data streams with per-worker circuit breakers." />
      <Card className="!p-0 overflow-hidden">
        <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-4">Monitor</div>
          <div className="col-span-3">Schedule</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Runs</div>
          <div className="col-span-2 text-right">Errors</div>
        </div>
        {filtered.map((m) => (
          <div key={m.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
            <div className="md:col-span-4">
              <p className="text-sm font-medium text-white">{m.name}</p>
              <p className="font-mono text-[11px] text-[var(--g-faint)]">{m.slug}</p>
            </div>
            <div className="font-mono text-xs text-[var(--g-muted)] md:col-span-3">{m.cron}</div>
            <div className="md:col-span-2"><MonitorStatus status={m.status} /></div>
            <div className="font-mono text-sm text-[var(--g-text)] md:col-span-1 md:text-right">{m.runCount.toLocaleString()}</div>
            <div className="md:col-span-2 md:text-right">
              <span className="font-mono text-sm" style={{ color: m.errorCount > 0 ? "#ED4245" : "var(--g-faint)" }}>{m.errorCount}</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function FeedsScreen() {
  const [q, setQ] = useState("");
  const filtered = GALACTIC_FEEDS.filter((f) => `${f.name} ${f.category} ${f.source}`.toLowerCase().includes(q.trim().toLowerCase()));
  const active = GALACTIC_FEEDS.filter((f) => f.activated).length;
  const cards = [
    { label: "Total feeds", value: GALACTIC_FEEDS.length, c: "#FFFFFF" },
    { label: "Active", value: active, c: "#1DD1A1" },
    { label: "Free tier", value: GALACTIC_FEEDS.filter((f) => f.tier === "Free").length, c: "#7C8DA8" },
    { label: "Pro+", value: GALACTIC_FEEDS.filter((f) => f.tier !== "Free").length, c: "#22D3EE" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((s) => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: BORDER, background: PANEL }}>
            <div className="text-2xl font-bold" style={{ color: s.c }}>{s.value}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--g-faint)]">{s.label}</div>
          </div>
        ))}
      </div>
      <SearchRow q={q} setQ={setQ} placeholder="Search feeds by name, category, or source" hint={`${GALACTIC_FEEDS.length} feeds across ${new Set(GALACTIC_FEEDS.map((f) => f.category)).size} verticals.`} />
      <Card className="!p-0 overflow-hidden">
        <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-4">Feed</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-3">Source</div>
          <div className="col-span-1">Tier</div>
          <div className="col-span-2 text-right">Subscribers</div>
        </div>
        {filtered.map((f) => (
          <div key={f.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
            <div className="md:col-span-4"><p className="text-sm font-medium text-white">{f.name}</p><p className="text-[11px] text-[var(--g-faint)]">{f.cadence}</p></div>
            <div className="text-sm text-[var(--g-muted)] md:col-span-2">{f.category}</div>
            <div className="text-xs text-[var(--g-muted)] md:col-span-3">{f.source}</div>
            <div className="md:col-span-1"><span className="rounded-full border px-2 py-0.5 text-[11px]" style={{ borderColor: BORDER, color: "var(--g-faint)" }}>{f.tier}</span></div>
            <div className="font-mono text-sm text-[var(--g-text)] md:col-span-2 md:text-right">{f.subscribers.toLocaleString()}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ProductsScreen() {
  const [tab, setTab] = useState<"all" | "active" | "draft">("all");
  const shown = ADMIN_PRODUCTS.filter((p) => (tab === "all" ? true : p.status === tab));
  const cards = [
    { label: "Total", value: ADMIN_PRODUCTS.length, c: "#FFFFFF" },
    { label: "Active", value: ADMIN_PRODUCTS.filter((p) => p.status === "active").length, c: "#1DD1A1" },
    { label: "Draft", value: ADMIN_PRODUCTS.filter((p) => p.status === "draft").length, c: "#F39C12" },
    { label: "Feeds", value: ADMIN_PRODUCTS.reduce((s, p) => s + p.feeds, 0), c: "#22D3EE" },
    { label: "Users", value: `${(ADMIN_PRODUCTS.reduce((s, p) => s + p.users, 0) / 1000).toFixed(0)}k`, c: "#22D3EE" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map((s) => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: BORDER, background: PANEL }}>
            <div className="text-2xl font-bold" style={{ color: s.c }}>{s.value}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--g-faint)]">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="inline-flex rounded-lg border p-1" style={{ borderColor: BORDER }}>
        {(["all", "active", "draft"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors" style={tab === t ? { background: PANEL2, color: "white" } : { color: "var(--g-muted)" }}>{t}</button>
        ))}
      </div>
      <Card className="!p-0 overflow-hidden">
        <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-4">Product</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Tier</div>
          <div className="col-span-1 text-right">Feeds</div>
          <div className="col-span-1 text-right">Users</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        {shown.map((p) => (
          <div key={p.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
            <div className="text-sm font-medium text-white md:col-span-4">{p.name}</div>
            <div className="text-sm text-[var(--g-muted)] md:col-span-2">{p.category}</div>
            <div className="md:col-span-2"><span className="rounded-full border px-2 py-0.5 text-[11px] capitalize" style={{ borderColor: BORDER, color: "var(--g-faint)" }}>{p.tier}</span></div>
            <div className="font-mono text-sm text-[var(--g-text)] md:col-span-1 md:text-right">{p.feeds}</div>
            <div className="font-mono text-sm text-[var(--g-text)] md:col-span-1 md:text-right">{p.users.toLocaleString()}</div>
            <div className="md:col-span-2 md:text-right"><span className="rounded-full px-2.5 py-0.5 text-xs" style={p.status === "active" ? { background: "rgba(29,209,161,0.12)", color: "#1DD1A1" } : { background: "rgba(243,156,18,0.12)", color: "#F39C12" }}>{p.status}</span></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AiUsageScreen() {
  const totalCost = ADMIN_AI_MODELS.reduce((s, m) => s + m.cost, 0);
  const totalCalls = ADMIN_AI_MODELS.reduce((s, m) => s + m.calls, 0);
  const totalTokens = ADMIN_AI_MODELS.reduce((s, m) => s + m.promptTokens + m.completionTokens, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Est. cost · 30d" value={`$${totalCost.toFixed(2)}`} hint="2 paid models" />
        <StatCard label="API calls" value={totalCalls.toLocaleString()} />
        <StatCard label="Tokens" value={`${(totalTokens / 1_000_000).toFixed(1)}M`} />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>Daily AI cost · 14d</CardTitle>
          <span className="text-xs text-[var(--g-faint)]">Haiku vs Sonnet</span>
        </div>
        <div className="mt-4">
          <StackedBars
            data={ADMIN_AI_DAILY as unknown as Record<string, number>[]}
            keys={[{ key: "haiku", color: "#1DD1A1", label: "Haiku 4.5" }, { key: "sonnet", color: "#5865F2", label: "Sonnet 4.6" }]}
            height={120}
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {ADMIN_AI_MODELS.map((m) => (
          <Card key={m.model}>
            <div className="flex items-center justify-between">
              <span className="rounded-md px-2 py-0.5 font-mono text-[11px]" style={{ background: PANEL2, color: CYAN }}>{m.model}</span>
              <span className="text-[11px] text-[var(--g-faint)]">{m.provider}</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-white">${m.cost.toFixed(2)}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Mini label="Prompt" value={`${(m.promptTokens / 1_000_000).toFixed(1)}M`} />
              <Mini label="Compl." value={`${(m.completionTokens / 1_000_000).toFixed(1)}M`} />
              <Mini label="Calls" value={m.calls.toLocaleString()} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="border-b px-5 py-4" style={{ borderColor: BORDER }}><CardTitle>Usage by feature · 30d</CardTitle></div>
        <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-5">Feature</div>
          <div className="col-span-3 text-right">Tokens</div>
          <div className="col-span-2 text-right">Calls</div>
          <div className="col-span-2 text-right">Est. cost</div>
        </div>
        {ADMIN_AI_FEATURES.map((f) => (
          <div key={f.feature} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-3.5 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
            <div className="text-sm font-medium text-white md:col-span-5">{f.feature}</div>
            <div className="font-mono text-sm text-[var(--g-muted)] md:col-span-3 md:text-right">{(f.tokens / 1_000_000).toFixed(1)}M</div>
            <div className="font-mono text-sm text-[var(--g-muted)] md:col-span-2 md:text-right">{f.calls.toLocaleString()}</div>
            <div className="font-mono text-sm text-[var(--g-text)] md:col-span-2 md:text-right">${f.cost.toFixed(2)}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ----------------------------- live builder ------------------------------ */

interface BuilderMonitor {
  name: string;
  slug: string;
  feedSlug: string;
  category: string;
  cron: string;
  marketHoursOnly: boolean;
  summary: string;
  embed: { title: string; color: string; fields: { name: string; value: string; inline?: boolean }[]; footer: string };
}

const BUILDER_SUGGESTIONS = [
  "A crypto fear & greed monitor that posts when the band flips",
  "Alert on unusual options volume in mega-cap tech",
  "Track S&P 500 sector performance every market hour",
  "Monitor NBA live scores and post final results",
];

function BuilderScreen() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BuilderMonitor | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function build(prompt: string) {
    const p = prompt.trim();
    if (!p || loading) return;
    setLoading(true);
    setNote(null);
    try {
      const res = await fetch("/api/galactic/monitor-builder", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: p }),
      });
      const data = (await res.json()) as { monitor: BuilderMonitor; fallback?: boolean };
      setResult(data.monitor);
      setNote(data.fallback ? "Showing a sample monitor (live model offline or rate-limited)." : "Generated live by Claude Haiku.");
    } catch {
      setResult(ADMIN_BUILDER_FALLBACK as unknown as BuilderMonitor);
      setNote("Showing a sample monitor (request failed).");
    } finally {
      setLoading(false);
    }
  }

  const preview: GalacticAlert | null = result
    ? {
        id: "builder",
        feed: result.name,
        icon: result.embed.title.match(/^\p{Emoji}/u)?.[0] ?? "✦",
        title: result.embed.title,
        color: result.embed.color,
        time: "preview",
        destination: "Discord",
        fields: result.embed.fields,
      }
    : null;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-2xl border p-5" style={{ borderColor: BORDER, background: "linear-gradient(135deg, var(--g-panel), var(--g-panel-2) 70%)" }}>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(88,101,242,0.16)", color: "#aab4fc" }}><Icon name="sparkles" size={18} /></span>
            <div>
              <h3 className="text-base font-semibold text-white">Monitor Builder</h3>
              <p className="text-xs text-[var(--g-faint)]">Describe a monitor in plain English. Claude builds it live.</p>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) build(input); }}
            rows={3}
            placeholder="e.g. Alert me when Bitcoin moves more than 4% in an hour"
            className="mt-4 w-full resize-none rounded-lg border bg-transparent px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--g-blurple)]"
            style={{ borderColor: BORDER }}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] text-[var(--g-faint)]">⌘/Ctrl + Enter</span>
            <button
              onClick={() => build(input)}
              disabled={loading || !input.trim()}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              style={{ background: BLURPLE }}
            >
              {loading ? "Building…" : <>Build monitor <Icon name="bolt" size={14} /></>}
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-[var(--g-faint)]">Try one</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {BUILDER_SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => { setInput(s); build(s); }} disabled={loading} className="rounded-lg border p-3 text-left text-xs text-[var(--g-muted)] transition-colors hover:border-[var(--g-blurple)]/50 hover:text-white disabled:opacity-50" style={{ borderColor: BORDER, background: PANEL }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <CardTitle>Generated monitor</CardTitle>
        {!result && !loading && (
          <div className="mt-3 flex h-64 items-center justify-center rounded-2xl border border-dashed text-center text-sm text-[var(--g-faint)]" style={{ borderColor: BORDER }}>
            Describe a monitor to see it built here, live.
          </div>
        )}
        {loading && (
          <div className="mt-3 flex h-64 items-center justify-center rounded-2xl border text-sm text-[var(--g-muted)]" style={{ borderColor: BORDER, background: PANEL }}>
            <span className="animate-pulse">Claude is building your monitor…</span>
          </div>
        )}
        {result && preview && (
          <div className="mt-3 space-y-4">
            <div className="rounded-2xl border p-4" style={{ borderColor: BORDER, background: PANEL }}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-white">{result.name}</span>
                <span className="rounded-full border px-2 py-0.5 text-[11px] capitalize" style={{ borderColor: BORDER, color: "var(--g-faint)" }}>{result.category}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--g-muted)]">{result.summary}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-[var(--g-faint)]">
                <span>slug: <span style={{ color: CYAN }}>{result.slug}</span></span>
                <span>schedule: <span style={{ color: CYAN }}>{result.cron}</span></span>
                <span>market hours: {result.marketHoursOnly ? "yes" : "no"}</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border p-3" style={{ borderColor: BORDER, background: "#313338" }}>
              <EmbedCard alert={preview} brandColor={result.embed.color} />
            </div>
            {note && <p className="text-xs" style={{ color: note.startsWith("Generated live") ? TEAL : "#F39C12" }}>{note}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function VisualizerScreen() {
  const PLATFORMS = ["Discord", "Slack", "Telegram", "Email", "SMS", "WhatsApp", "Custom API"] as const;
  const [sel, setSel] = useState(GALACTIC_ALERTS[0].id);
  const [plat, setPlat] = useState<(typeof PLATFORMS)[number]>("Discord");
  const alert = GALACTIC_ALERTS.find((a) => a.id === sel) ?? GALACTIC_ALERTS[0];

  return (
    <div className="space-y-5">
      <p className="text-sm text-[var(--g-muted)]">Preview any alert across every delivery platform. The same event, rendered for humans and for agents.</p>
      <div className="flex flex-wrap gap-2">
        {GALACTIC_ALERTS.slice(0, 8).map((a) => (
          <button key={a.id} onClick={() => setSel(a.id)} className="rounded-full border px-3 py-1.5 text-sm transition-colors" style={sel === a.id ? { background: TEAL, borderColor: TEAL, color: "#04140f" } : { borderColor: BORDER, color: "var(--g-muted)" }}>
            {a.icon} {a.feed}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <button key={p} onClick={() => setPlat(p)} className="rounded-lg border px-3 py-1.5 text-xs transition-colors" style={plat === p ? { background: PANEL2, borderColor: BLURPLE, color: "white" } : { borderColor: BORDER, color: "var(--g-muted)" }}>{p}</button>
        ))}
      </div>

      {plat === "Discord" ? (
        <div className="max-w-md overflow-hidden rounded-2xl border p-3" style={{ borderColor: BORDER, background: "#313338" }}>
          <EmbedCard alert={alert} />
        </div>
      ) : plat === "Custom API" ? (
        <div className="rounded-2xl border p-4" style={{ borderColor: BORDER, background: PANEL2 }}>
          <div className="mb-2 flex items-center gap-2 text-xs text-[var(--g-faint)]"><Icon name="bolt" size={13} /> structured payload · any agent over MCP</div>
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[var(--g-text)]">{JSON.stringify({ feed: alert.feed, event: alert.title, color: alert.color, fields: alert.fields, footer: "galacticsignals.com", ts: "2026-06-22T16:42:11Z" }, null, 2)}</pre>
        </div>
      ) : (
        <div className="max-w-md rounded-2xl border p-4" style={{ borderColor: BORDER, background: PANEL }}>
          <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: BORDER }}>
            <span className="text-lg">{alert.icon}</span>
            <span className="text-sm font-semibold text-white">{alert.title}</span>
            <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider" style={{ background: PANEL2, color: "var(--g-faint)" }}>{plat}</span>
          </div>
          <div className="mt-3 space-y-1.5 text-sm">
            {alert.fields.map((f, i) => (
              <div key={i} className="flex justify-between gap-4">
                <span className="text-[var(--g-faint)]">{f.name}</span>
                <span className="text-right text-[var(--g-text)]">{f.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-[var(--g-faint)]">Delivered via {plat} · galacticsignals.com</p>
        </div>
      )}
    </div>
  );
}

/* ============================== primitives =============================== */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border p-6 ${className}`} style={{ borderColor: BORDER, background: PANEL }}>{children}</div>;
}
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--g-muted)]">{children}</h3>;
}
function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: BORDER, background: PANEL }}>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-[var(--g-faint)]">{label}</span>
        {hint && <span className="text-[11px]" style={{ color: TEAL }}>{hint}</span>}
      </div>
    </div>
  );
}
function KpiCard({ label, value, hint, icon }: { label: string; value: string; hint?: string; icon: IconName }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: BORDER, background: PANEL }}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[var(--g-faint)]">{label}</span>
        <span className="text-[var(--g-faint)]"><Icon name={icon} size={16} /></span>
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
      {hint && <div className="mt-1 text-[11px]" style={{ color: TEAL }}>{hint}</div>}
    </div>
  );
}
function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg py-2" style={{ background: PANEL2 }}>
      <div className="font-mono text-sm text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--g-faint)]">{label}</div>
    </div>
  );
}
function HealthBar({ label, pct, detail }: { label: string; pct: number; detail: string }) {
  const c = pct > 85 ? "#ED4245" : pct > 70 ? "#F39C12" : "#1DD1A1";
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--g-muted)]">{label}</span>
        <span className="font-mono text-xs text-[var(--g-faint)]">{detail}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: PANEL2 }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c }} />
      </div>
    </div>
  );
}
function SearchRow({ q, setQ, placeholder, hint }: { q: string; setQ: (v: string) => void; placeholder: string; hint: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-[var(--g-muted)]">{hint}</p>
      <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5" style={{ borderColor: BORDER }}>
        <span className="text-[var(--g-faint)]"><Icon name="search" size={15} /></span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="bg-transparent text-sm text-white outline-none placeholder:text-[var(--g-faint)]" />
      </div>
    </div>
  );
}
function LogStatus({ status }: { status: AdminLogStatus }) {
  const ok = status >= 200 && status < 300;
  const c = ok ? "#1DD1A1" : status === 429 ? "#F39C12" : "#ED4245";
  return <span className="rounded-full px-2 py-0.5 font-mono text-[11px]" style={{ background: `${c}1f`, color: c }}>{status}</span>;
}
function MonitorStatus({ status }: { status: "completed" | "in_progress" | "not_started" }) {
  const map = {
    completed: { bg: "rgba(29,209,161,0.12)", c: "#1DD1A1", label: "Active" },
    in_progress: { bg: "rgba(34,211,238,0.12)", c: "#22D3EE", label: "Running" },
    not_started: { bg: "rgba(124,141,168,0.12)", c: "#7C8DA8", label: "Paused" },
  }[status];
  return <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: map.bg, color: map.c }}>{map.label}</span>;
}
function Pill({ kind }: { kind: "active" | "trialing" | "churned" }) {
  const map = {
    active: { bg: "rgba(29,209,161,0.12)", c: "#1DD1A1", label: "Active" },
    trialing: { bg: "rgba(34,211,238,0.12)", c: "#22D3EE", label: "Trialing" },
    churned: { bg: "rgba(124,141,168,0.12)", c: "#7C8DA8", label: "Churned" },
  }[kind];
  return <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: map.bg, color: map.c }}>{map.label}</span>;
}
