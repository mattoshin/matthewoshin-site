"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  GALACTIC_PLATFORM,
  GALACTIC_FEEDS,
  GALACTIC_MONITORS,
  GALACTIC_USERS,
  GALACTIC_ALERTS,
  GALACTIC_CATEGORIES,
  type GalacticAlert,
  type GalacticFeed,
  type GalacticMonitor,
  type GalacticUser,
  type GalacticCategory,
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
  ADMIN_STACK,
  ADMIN_STACK_LANGUAGES,
  ADMIN_DATA_SOURCES,
  ADMIN_RSS_FEEDS,
  ADMIN_MCP_SERVERS,
  ADMIN_DEV_ACTION_ITEMS,
  ADMIN_DEV_COMMITS,
  ADMIN_DEV_SKILLS,
  ADMIN_PM_SUMMARY,
  ADMIN_CAMPAIGNS,
  ADMIN_CONTACTS,
  ADMIN_SURVEYS,
  ADMIN_AUTOMATIONS,
  type AdminLogStatus,
  type AdminProduct,
  type AdminDataSource,
  type AdminRssFeed,
  type AdminMcpServer,
  type AdminAutomation,
} from "@/data/galactic-admin-demo";
import { Icon, EmbedCard, type IconName } from "./GalacticKit";
import { AreaChart, BarList, Donut, StackedBars } from "./GalacticCharts";
import {
  ToastProvider,
  useToast,
  Toggle,
  Badge,
  Modal,
  Drawer,
  Tabs,
  ActionMenu,
  Stepper,
  FieldLabel,
  TextInput,
  Btn,
} from "./GalacticAdminControls";

/**
 * GalacticAdmin - the admin-side console for the Galactic Signals demo, a faithful
 * recreation of the real galactic-app admin panel and its level of control: an
 * operations overview, system analytics, an operable feeds/monitors fleet, the
 * product catalog with a creation wizard, category management with drag-reorder,
 * data-source/API-key configuration, a marketing suite, AI usage + cost tracking,
 * a dev-logs view, a cross-platform embed visualizer, the flagship live Monitor
 * Builder (Claude Haiku), and an "Under the hood" stack panel. Tables are operable
 * (toggles, row actions, create flows) over optimistic local state; the Monitor
 * Builder is the one live call. Everything else is deterministic sample data.
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
  | "categories"
  | "datasources"
  | "ai"
  | "builder"
  | "visualizer"
  | "marketing"
  | "devlogs"
  | "stack";

const NAV: { group: string; items: { id: AdminView; label: string; icon: IconName }[] }[] = [
  { group: "Overview", items: [{ id: "overview", label: "Dashboard", icon: "home" }, { id: "system", label: "System", icon: "shield" }] },
  {
    group: "Content",
    items: [
      { id: "feeds", label: "Feeds", icon: "store" },
      { id: "monitors", label: "Monitors", icon: "activity" },
      { id: "products", label: "Products", icon: "rocket" },
      { id: "categories", label: "Categories", icon: "palette" },
      { id: "datasources", label: "Data Sources", icon: "globe" },
    ],
  },
  {
    group: "Tools",
    items: [
      { id: "builder", label: "Monitor Builder", icon: "sparkles" },
      { id: "visualizer", label: "Embed Visualizer", icon: "eye" },
      { id: "marketing", label: "Marketing", icon: "megaphone" },
    ],
  },
  { group: "Data", items: [{ id: "users", label: "Users", icon: "users" }, { id: "ai", label: "AI Usage", icon: "bolt" }] },
  { group: "Dev", items: [{ id: "devlogs", label: "Dev Logs", icon: "code" }] },
  { group: "Platform", items: [{ id: "stack", label: "Stack", icon: "layers" }] },
];

const TITLES: Record<AdminView, string> = {
  overview: "Admin Dashboard",
  system: "System Health",
  users: "Users",
  monitors: "Monitors",
  feeds: "Feeds",
  products: "Products",
  categories: "Categories",
  datasources: "Data Sources",
  ai: "Artoo Models & Usage",
  builder: "Monitor Builder",
  visualizer: "Embed Visualizer",
  marketing: "Marketing Suite",
  devlogs: "Dev Logs",
  stack: "Stack · Under the Hood",
};

export default function GalacticAdmin({ modeToggle }: { modeToggle?: React.ReactNode }) {
  const [view, setView] = useState<AdminView>("overview");
  const [navOpen, setNavOpen] = useState(false);

  return (
    <ToastProvider>
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
            <div className="flex items-center gap-3">{modeToggle}</div>
          </header>

          <main className="flex-1 overflow-y-auto p-5 sm:p-7">
            {view === "overview" && <OverviewScreen />}
            {view === "system" && <SystemScreen />}
            {view === "users" && <UsersScreen />}
            {view === "monitors" && <MonitorsScreen />}
            {view === "feeds" && <FeedsScreen />}
            {view === "products" && <ProductsScreen />}
            {view === "categories" && <CategoriesScreen />}
            {view === "datasources" && <DataSourcesScreen />}
            {view === "ai" && <AiUsageScreen />}
            {view === "builder" && <BuilderScreen />}
            {view === "visualizer" && <VisualizerScreen />}
            {view === "marketing" && <MarketingScreen />}
            {view === "devlogs" && <DevLogsScreen />}
            {view === "stack" && <StackScreen />}
          </main>
        </div>
      </div>
    </ToastProvider>
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

/* ------------------------------ users (operable) ------------------------- */

const USERS_PER_PAGE = 6;

function UsersScreen() {
  const toast = useToast();
  const [users, setUsers] = useState<GalacticUser[]>(() => GALACTIC_USERS.map((u) => ({ ...u })));
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) => `${u.name} ${u.handle} ${u.community} ${u.email}`.toLowerCase().includes(s));
  }, [q, users]);

  const pages = Math.max(1, Math.ceil(filtered.length / USERS_PER_PAGE));
  const safePage = Math.min(page, pages - 1);
  const shown = filtered.slice(safePage * USERS_PER_PAGE, safePage * USERS_PER_PAGE + USERS_PER_PAGE);
  const admins = users.filter((u) => u.role === "ADMIN").length;

  function setRole(id: string, role: GalacticUser["role"]) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    toast(`Role set to ${role}`, { icon: "shield", tone: role === "ADMIN" ? "blurple" : "teal" });
  }
  function suspend(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "churned" } : u)));
    toast("Community suspended", { icon: "pause", tone: "warn" });
  }
  function remove(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast("User deleted", { icon: "trash", tone: "error" });
  }

  const cards = [
    { label: "Communities", value: GALACTIC_PLATFORM.communities.toLocaleString() },
    { label: "Admins", value: admins.toLocaleString() },
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

      <SearchRow
        q={q}
        setQ={(v) => { setQ(v); setPage(0); }}
        placeholder="Search users"
        hint={`${GALACTIC_PLATFORM.traders.toLocaleString()}+ traders. Showing a sample of communities.`}
      />

      <Card className="!p-0 overflow-hidden">
        <div className="hidden grid-cols-12 items-center gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-4">User</div>
          <div className="col-span-2">Community</div>
          <div className="col-span-1">Plan</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        {shown.map((u) => (
          <div key={u.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3 md:col-span-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-[#04140f]" style={{ background: u.role === "ADMIN" ? BLURPLE : TEAL }}>{u.name.charAt(0)}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{u.name}</p>
                <p className="truncate text-xs text-[var(--g-faint)]">{u.email} · {u.channels} ch.</p>
              </div>
            </div>
            <div className="text-sm text-[var(--g-muted)] md:col-span-2">{u.community}</div>
            <div className="md:col-span-1"><Badge tone="muted">{u.plan}</Badge></div>
            <div className="md:col-span-3"><RoleSwitch role={u.role} onChange={(r) => setRole(u.id, r)} /></div>
            <div className="flex items-center justify-end gap-2 md:col-span-2">
              <Pill kind={u.status} />
              <ActionMenu
                items={[
                  u.role === "ADMIN"
                    ? { label: "Demote to USER", icon: "users", onClick: () => setRole(u.id, "USER") }
                    : { label: "Promote to ADMIN", icon: "shield", onClick: () => setRole(u.id, "ADMIN") },
                  { label: "Suspend", icon: "pause", onClick: () => suspend(u.id) },
                  { label: "Delete", icon: "trash", danger: true, onClick: () => remove(u.id) },
                ]}
              />
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="px-5 py-8 text-center text-sm text-[var(--g-faint)]">No users match &ldquo;{q}&rdquo;.</div>}
        {filtered.length > USERS_PER_PAGE && (
          <div className="flex items-center justify-between border-t px-5 py-3 text-sm" style={{ borderColor: BORDER }}>
            <span className="text-[var(--g-faint)]">Page {safePage + 1} of {pages}</span>
            <div className="flex gap-2">
              <Btn variant="ghost" size="sm" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>Prev</Btn>
              <Btn variant="ghost" size="sm" disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)}>Next</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function RoleSwitch({ role, onChange }: { role: GalacticUser["role"]; onChange: (r: GalacticUser["role"]) => void }) {
  return (
    <div className="inline-flex rounded-lg border p-0.5" style={{ borderColor: BORDER }} role="group" aria-label="Set role">
      {(["USER", "ADMIN"] as const).map((r) => {
        const on = role === r;
        return (
          <button
            key={r}
            onClick={() => !on && onChange(r)}
            className="rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors"
            style={on ? (r === "ADMIN" ? { background: "rgba(88,101,242,0.2)", color: "#aab4fc" } : { background: "rgba(29,209,161,0.16)", color: TEAL }) : { color: "var(--g-faint)" }}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------- monitors (operable) ------------------------ */

function MonitorsScreen() {
  const toast = useToast();
  const [monitors, setMonitors] = useState<GalacticMonitor[]>(() => GALACTIC_MONITORS.map((m) => ({ ...m })));
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c = { total: monitors.length, active: 0, running: 0, paused: 0, errors: 0 };
    for (const m of monitors) {
      if (m.status === "completed") c.active++;
      else if (m.status === "in_progress") c.running++;
      else c.paused++;
      if (m.errorCount > 0) c.errors++;
    }
    return c;
  }, [monitors]);
  const filtered = monitors.filter((m) => `${m.name} ${m.slug}`.toLowerCase().includes(q.trim().toLowerCase()));

  function setActive(id: string, on: boolean) {
    setMonitors((prev) => prev.map((m) => (m.id === id ? { ...m, status: on ? "completed" : "not_started", lastRun: on ? "just now" : m.lastRun } : m)));
    toast(on ? "Monitor resumed" : "Monitor paused", { icon: on ? "play" : "pause", tone: on ? "teal" : "warn" });
  }
  function runNow(id: string) {
    setMonitors((prev) => prev.map((m) => (m.id === id ? { ...m, status: "in_progress", lastRun: "now" } : m)));
    toast("Run queued", { icon: "play", tone: "blurple" });
    setTimeout(() => {
      // only complete if it is still running (user may have paused it mid-run)
      setMonitors((prev) => prev.map((m) => (m.id === id && m.status === "in_progress" ? { ...m, status: "completed", lastRun: "just now", runCount: m.runCount + 1 } : m)));
    }, 1100);
  }
  function regen() {
    toast("Regenerating context with AI…", { icon: "sparkles", tone: "blurple" });
    setTimeout(() => toast("Context regenerated", { icon: "check", tone: "teal" }), 1200);
  }
  function remove(id: string) {
    setMonitors((prev) => prev.filter((m) => m.id !== id));
    toast("Monitor deleted", { icon: "trash", tone: "error" });
  }

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
      <SearchRow q={q} setQ={setQ} placeholder="Search monitors by name or slug" hint="Curated data streams with per-worker circuit breakers. Toggle, run, or regenerate any one." />
      <Card className="!p-0 overflow-hidden">
        <div className="hidden grid-cols-12 items-center gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-5">Monitor</div>
          <div className="col-span-3">Schedule</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-center">Active</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {filtered.map((m) => (
          <div key={m.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
            <div className="md:col-span-5">
              <p className="text-sm font-medium text-white">{m.name}</p>
              <p className="font-mono text-[11px] text-[var(--g-faint)]">{m.slug} · {m.runCount.toLocaleString()} runs · <span style={{ color: m.errorCount > 0 ? "#ED4245" : undefined }}>{m.errorCount} err</span></p>
            </div>
            <div className="font-mono text-xs text-[var(--g-muted)] md:col-span-3">{m.cron}</div>
            <div className="md:col-span-2"><MonitorStatus status={m.status} /></div>
            <div className="flex md:col-span-1 md:justify-center"><Toggle on={m.status !== "not_started"} onChange={(v) => setActive(m.id, v)} label={`Activate ${m.name}`} /></div>
            <div className="flex justify-end md:col-span-1">
              <ActionMenu
                items={[
                  { label: "Run now", icon: "play", onClick: () => runNow(m.id) },
                  { label: "Regenerate context", icon: "refresh", onClick: () => regen() },
                  m.status === "not_started"
                    ? { label: "Resume", icon: "play", onClick: () => setActive(m.id, true) }
                    : { label: "Pause", icon: "pause", onClick: () => setActive(m.id, false) },
                  { label: "Delete", icon: "trash", danger: true, onClick: () => remove(m.id) },
                ]}
              />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ------------------------------ feeds (operable) ------------------------- */

function FeedsScreen() {
  const toast = useToast();
  const [feeds, setFeeds] = useState<GalacticFeed[]>(() => GALACTIC_FEEDS.map((f) => ({ ...f })));
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<GalacticFeed | null>(null);
  const [cadence, setCadence] = useState("");

  const filtered = feeds.filter((f) => `${f.name} ${f.category} ${f.source}`.toLowerCase().includes(q.trim().toLowerCase()));
  const active = feeds.filter((f) => f.activated).length;
  const cards = [
    { label: "Total feeds", value: feeds.length, c: "#FFFFFF" },
    { label: "Active", value: active, c: "#1DD1A1" },
    { label: "Free tier", value: feeds.filter((f) => f.tier === "Free").length, c: "#7C8DA8" },
    { label: "Pro+", value: feeds.filter((f) => f.tier !== "Free").length, c: "#22D3EE" },
  ];

  function setActiveFeed(id: string, on: boolean) {
    setFeeds((prev) => prev.map((f) => (f.id === id ? { ...f, activated: on } : f)));
    toast(on ? "Feed activated" : "Feed paused", { icon: on ? "play" : "pause", tone: on ? "teal" : "warn" });
  }
  function openEdit(f: GalacticFeed) {
    setEditing(f);
    setCadence(f.cadence);
  }
  function saveEdit() {
    if (!editing) return;
    setFeeds((prev) => prev.map((f) => (f.id === editing.id ? { ...f, cadence } : f)));
    toast("Schedule updated", { icon: "check", tone: "teal" });
    setEditing(null);
  }

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
      <SearchRow q={q} setQ={setQ} placeholder="Search feeds by name, category, or source" hint={`${feeds.length} feeds across ${new Set(feeds.map((f) => f.category)).size} verticals. Toggle any feed live.`} />
      <Card className="!p-0 overflow-hidden">
        <div className="hidden grid-cols-12 items-center gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-4">Feed</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Source</div>
          <div className="col-span-2">Tier</div>
          <div className="col-span-1 text-center">Active</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {filtered.map((f) => (
          <div key={f.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
            <div className="md:col-span-4"><p className="text-sm font-medium text-white">{f.name}</p><p className="text-[11px] text-[var(--g-faint)]">{f.cadence} · {f.subscribers.toLocaleString()} subs</p></div>
            <div className="text-sm text-[var(--g-muted)] md:col-span-2 capitalize">{f.category}</div>
            <div className="text-xs text-[var(--g-muted)] md:col-span-2">{f.source}</div>
            <div className="md:col-span-2"><Badge tone={f.tier === "Free" ? "muted" : f.tier === "Pro" ? "cyan" : "teal"}>{f.tier}</Badge></div>
            <div className="flex md:col-span-1 md:justify-center"><Toggle on={!!f.activated} onChange={(v) => setActiveFeed(f.id, v)} label={`Activate ${f.name}`} /></div>
            <div className="flex justify-end md:col-span-1">
              <ActionMenu
                items={[
                  { label: "Edit schedule", icon: "pencil", onClick: () => openEdit(f) },
                  { label: "Test delivery", icon: "bolt", onClick: () => toast("Test alert delivered", { icon: "check", tone: "teal" }) },
                  f.activated
                    ? { label: "Pause", icon: "pause", onClick: () => setActiveFeed(f.id, false) }
                    : { label: "Activate", icon: "play", onClick: () => setActiveFeed(f.id, true) },
                ]}
              />
            </div>
          </div>
        ))}
      </Card>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={`Edit schedule · ${editing?.name ?? ""}`}
        footer={<><Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn><Btn onClick={saveEdit}>Save</Btn></>}
      >
        <FieldLabel>Cadence</FieldLabel>
        <TextInput value={cadence} onChange={setCadence} placeholder="e.g. Real-time, 1m, 15m, Hourly" mono />
        <p className="mt-3 text-xs text-[var(--g-faint)]">How often the worker polls the source and fans out alerts.</p>
      </Modal>
    </div>
  );
}

/* ---------------------------- products (operable) ------------------------ */

const PRODUCT_TIERS = ["free", "pro", "business"] as const;

function ProductsScreen() {
  const toast = useToast();
  const [products, setProducts] = useState<AdminProduct[]>(() => ADMIN_PRODUCTS.map((p) => ({ ...p })));
  const [tab, setTab] = useState<"all" | "active" | "draft">("all");
  const [wizard, setWizard] = useState(false);
  const idRef = useRef(0);

  const shown = products.filter((p) => (tab === "all" ? true : p.status === tab));
  const cards = [
    { label: "Total", value: products.length, c: "#FFFFFF" },
    { label: "Active", value: products.filter((p) => p.status === "active").length, c: "#1DD1A1" },
    { label: "Draft", value: products.filter((p) => p.status === "draft").length, c: "#F39C12" },
    { label: "Feeds", value: products.reduce((s, p) => s + p.feeds, 0), c: "#22D3EE" },
    { label: "Users", value: `${(products.reduce((s, p) => s + p.users, 0) / 1000).toFixed(0)}k`, c: "#22D3EE" },
  ];

  function toggleStatus(id: string) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: p.status === "active" ? "draft" : "active" } : p)));
    toast("Product status updated", { icon: "check", tone: "teal" });
  }
  function remove(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast("Product deleted", { icon: "trash", tone: "error" });
  }
  function create(p: Omit<AdminProduct, "id">) {
    const id = `np-${++idRef.current}`;
    setProducts((prev) => [{ ...p, id }, ...prev]);
    toast("Product created as draft", { icon: "rocket", tone: "teal" });
    setWizard(false);
  }

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs<"all" | "active" | "draft">
          tabs={[{ id: "all", label: "All" }, { id: "active", label: "Active" }, { id: "draft", label: "Draft" }]}
          active={tab}
          onChange={setTab}
        />
        <Btn onClick={() => setWizard(true)}><Icon name="plus" size={15} /> New product</Btn>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="hidden grid-cols-12 items-center gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
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
            <div className="md:col-span-2"><Badge tone={p.tier === "free" ? "muted" : p.tier === "pro" ? "cyan" : "teal"}>{p.tier}</Badge></div>
            <div className="font-mono text-sm text-[var(--g-text)] md:col-span-1 md:text-right">{p.feeds}</div>
            <div className="font-mono text-sm text-[var(--g-text)] md:col-span-1 md:text-right">{p.users.toLocaleString()}</div>
            <div className="flex items-center justify-end gap-2 md:col-span-2">
              <Badge tone={p.status === "active" ? "teal" : "warn"}>{p.status}</Badge>
              <ActionMenu
                items={[
                  { label: p.status === "active" ? "Unpublish" : "Publish", icon: p.status === "active" ? "pause" : "play", onClick: () => toggleStatus(p.id) },
                  { label: "Delete", icon: "trash", danger: true, onClick: () => remove(p.id) },
                ]}
              />
            </div>
          </div>
        ))}
      </Card>

      {wizard && <ProductWizard onClose={() => setWizard(false)} onCreate={create} />}
    </div>
  );
}

function ProductWizard({ onClose, onCreate }: { onClose: () => void; onCreate: (p: Omit<AdminProduct, "id">) => void }) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(GALACTIC_CATEGORIES[0].name);
  const [tier, setTier] = useState<AdminProduct["tier"]>("pro");
  const [picked, setPicked] = useState<string[]>([]);

  const steps = ["Details", "Feeds", "Review"];
  const canNext = step === 0 ? name.trim().length > 0 : step === 1 ? picked.length > 0 : true;

  function aiFill() {
    setName("On-Chain Alpha");
    setCategory("Crypto & DeFi");
    setTier("business");
    setPicked(GALACTIC_FEEDS.filter((f) => f.category === "crypto").slice(0, 4).map((f) => f.id));
    setStep(2);
    toast("Draft generated by AI", { icon: "sparkles", tone: "blurple" });
  }
  function finish() {
    onCreate({ name: name.trim(), category, tier, feeds: picked.length, users: 0, status: "draft" });
  }

  return (
    <Drawer
      open
      onClose={onClose}
      title="New product"
      subtitle="Bundle feeds into a purchasable product"
      footer={
        step < 2 ? (
          <>
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn disabled={!canNext} onClick={() => setStep(step + 1)}>Next</Btn>
          </>
        ) : (
          <>
            <Btn variant="ghost" onClick={() => setStep(1)}>Back</Btn>
            <Btn onClick={finish}>Create product</Btn>
          </>
        )
      }
    >
      <div className="mb-6"><Stepper steps={steps} current={step} /></div>

      {step === 0 && (
        <div className="space-y-4">
          <button onClick={aiFill} className="flex w-full items-center gap-2 rounded-lg border border-dashed px-3 py-2.5 text-sm transition-colors hover:border-[var(--g-blurple)]" style={{ borderColor: BORDER, color: "#aab4fc" }}>
            <Icon name="sparkles" size={15} /> Create with AI from a description
          </button>
          <div>
            <FieldLabel>Product name</FieldLabel>
            <TextInput value={name} onChange={setName} placeholder="e.g. Equities Pro" />
          </div>
          <div>
            <FieldLabel>Category</FieldLabel>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-[var(--g-blurple)]" style={{ borderColor: BORDER }}>
              {GALACTIC_CATEGORIES.map((c) => <option key={c.id} value={c.name} style={{ background: PANEL }}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>Tier</FieldLabel>
            <div className="flex gap-2">
              {PRODUCT_TIERS.map((t) => (
                <button key={t} onClick={() => setTier(t)} className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors" style={tier === t ? { background: PANEL2, color: "white", borderColor: BLURPLE } : { borderColor: BORDER, color: "var(--g-muted)" }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-2">
          <p className="text-xs text-[var(--g-faint)]">Pick the feeds this product bundles ({picked.length} selected).</p>
          <div className="max-h-[360px] space-y-1.5 overflow-y-auto pr-1">
            {GALACTIC_FEEDS.map((f) => {
              const on = picked.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => setPicked((prev) => (on ? prev.filter((x) => x !== f.id) : [...prev, f.id]))}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors"
                  style={{ borderColor: on ? BLURPLE : BORDER, background: on ? "rgba(88,101,242,0.1)" : "transparent" }}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-white">{f.name}</span>
                    <span className="block truncate text-[11px] text-[var(--g-faint)] capitalize">{f.category} · {f.source}</span>
                  </span>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border" style={{ borderColor: on ? BLURPLE : BORDER, background: on ? BLURPLE : "transparent", color: "#fff" }}>{on && <Icon name="check" size={13} />}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-xl border p-4" style={{ borderColor: BORDER, background: PANEL2 }}>
            <p className="text-base font-semibold text-white">{name || "Untitled product"}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="muted">{category}</Badge>
              <Badge tone={tier === "free" ? "muted" : tier === "pro" ? "cyan" : "teal"}>{tier}</Badge>
              <Badge tone="blurple">{picked.length} feeds</Badge>
            </div>
          </div>
          <p className="text-sm text-[var(--g-muted)]">Creates a <span className="text-white">draft</span> product. Publish it from the table when you are ready.</p>
        </div>
      )}
    </Drawer>
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

/* --------------------------- categories (operable) ----------------------- */

function CategoriesScreen() {
  const toast = useToast();
  const [cats, setCats] = useState<GalacticCategory[]>(() => GALACTIC_CATEGORIES.map((c) => ({ ...c })));
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [blurb, setBlurb] = useState("");
  const idRef = useRef(0);

  const feedCount = (id: string) => GALACTIC_FEEDS.filter((f) => f.category === id).length;

  function onDrop(target: number) {
    if (dragIdx === null || dragIdx === target) return setDragIdx(null);
    setCats((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(target, 0, moved);
      return next;
    });
    setDragIdx(null);
    toast("Order saved", { icon: "check", tone: "teal" });
  }
  function addCategory() {
    if (!name.trim()) return;
    setCats((prev) => [...prev, { id: `nc-${++idRef.current}`, name: name.trim(), emoji: emoji.trim() || "✨", blurb: blurb.trim() || "New category." }]);
    toast("Category created", { icon: "plus", tone: "teal" });
    setAdding(false);
    setName(""); setEmoji("✨"); setBlurb("");
  }
  function remove(id: string) {
    setCats((prev) => prev.filter((c) => c.id !== id));
    toast("Category deleted", { icon: "trash", tone: "error" });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--g-muted)]">Drag to reorder how categories appear in the store. {cats.length} categories.</p>
        <Btn onClick={() => setAdding(true)}><Icon name="plus" size={15} /> New category</Btn>
      </div>

      <div className="space-y-2">
        {cats.map((c, i) => (
          <div
            key={c.id}
            draggable
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(i)}
            onDragEnd={() => setDragIdx(null)}
            className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-opacity"
            style={{ borderColor: dragIdx === i ? BLURPLE : BORDER, background: PANEL, opacity: dragIdx === i ? 0.6 : 1 }}
          >
            <span className="cursor-grab text-[var(--g-faint)] active:cursor-grabbing" aria-hidden="true"><Icon name="drag" size={16} /></span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ background: PANEL2 }}>{c.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">{c.name}</p>
              <p className="truncate text-xs text-[var(--g-faint)]">{c.blurb}</p>
            </div>
            <Badge tone="cyan">{feedCount(c.id)} feeds</Badge>
            <ActionMenu
              items={[
                { label: "Edit", icon: "pencil", onClick: () => toast("Edit category (demo)", { icon: "pencil", tone: "blurple" }) },
                { label: "Delete", icon: "trash", danger: true, onClick: () => remove(c.id) },
              ]}
            />
          </div>
        ))}
      </div>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="New category"
        footer={<><Btn variant="ghost" onClick={() => setAdding(false)}>Cancel</Btn><Btn onClick={addCategory}>Create</Btn></>}
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-20">
              <FieldLabel>Emoji</FieldLabel>
              <TextInput value={emoji} onChange={setEmoji} />
            </div>
            <div className="flex-1">
              <FieldLabel>Name</FieldLabel>
              <TextInput value={name} onChange={setName} placeholder="e.g. Commodities" />
            </div>
          </div>
          <div>
            <FieldLabel>Blurb</FieldLabel>
            <TextInput value={blurb} onChange={setBlurb} placeholder="One line describing the category" />
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* --------------------------- data sources (operable) --------------------- */

type DataTab = "keys" | "rss" | "mcp";

function DataSourcesScreen() {
  const toast = useToast();
  const [tab, setTab] = useState<DataTab>("keys");
  const [sources, setSources] = useState<AdminDataSource[]>(() => ADMIN_DATA_SOURCES.map((s) => ({ ...s })));
  const [rss, setRss] = useState<AdminRssFeed[]>(() => ADMIN_RSS_FEEDS.map((r) => ({ ...r })));
  const [mcp, setMcp] = useState<AdminMcpServer[]>(() => ADMIN_MCP_SERVERS.map((m) => ({ ...m })));
  const [configuring, setConfiguring] = useState<AdminDataSource | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [testing, setTesting] = useState(false);
  const rssIdRef = useRef(0);

  const connected = sources.filter((s) => s.status === "connected").length;

  function openConfig(s: AdminDataSource) {
    setConfiguring(s);
    setKeyInput("");
  }
  function testConnection() {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      if (!configuring) return;
      setSources((prev) => prev.map((s) => (s.id === configuring.id ? { ...s, status: "connected", keyHint: keyInput ? `${keyInput.slice(0, 2)}_••••${keyInput.slice(-4)}` : s.keyHint } : s)));
      toast("Connection verified", { icon: "check", tone: "teal" });
      setConfiguring(null);
    }, 850);
  }
  function aiFinder() {
    toast("AI found env var: POLYGON_API_KEY", { icon: "sparkles", tone: "blurple" });
  }
  function toggleMcp(id: string) {
    setMcp((prev) => prev.map((m) => (m.id === id ? { ...m, status: m.status === "online" ? "offline" : "online" } : m)));
    toast("MCP server toggled", { icon: "server", tone: "teal" });
  }
  function removeRss(id: string) {
    setRss((prev) => prev.filter((r) => r.id !== id));
    toast("RSS source removed", { icon: "trash", tone: "error" });
  }

  const dsTone = (s: AdminDataSource["status"]) => (s === "connected" ? "teal" : s === "error" ? "error" : "muted");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs<DataTab>
          tabs={[{ id: "keys", label: "API Keys", count: sources.length }, { id: "rss", label: "RSS Feeds", count: rss.length }, { id: "mcp", label: "MCP Servers", count: mcp.length }]}
          active={tab}
          onChange={setTab}
        />
        {tab === "keys" && <span className="text-sm text-[var(--g-faint)]">{connected}/{sources.length} connected</span>}
      </div>

      {tab === "keys" && (
        <Card className="!p-0 overflow-hidden">
          <div className="hidden grid-cols-12 items-center gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
            <div className="col-span-3">Source</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Key</div>
            <div className="col-span-2 text-right">Calls 24h</div>
            <div className="col-span-3 text-right">Status</div>
          </div>
          {sources.map((s) => (
            <div key={s.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-3.5 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
              <div className="text-sm font-medium text-white md:col-span-3">{s.name}</div>
              <div className="text-sm text-[var(--g-muted)] md:col-span-2">{s.category}</div>
              <div className="font-mono text-xs text-[var(--g-faint)] md:col-span-2">{s.keyHint}</div>
              <div className="font-mono text-sm text-[var(--g-text)] md:col-span-2 md:text-right">{s.calls24h.toLocaleString()}</div>
              <div className="flex items-center justify-end gap-2 md:col-span-3">
                <Badge tone={dsTone(s.status)}>{s.status}</Badge>
                <Btn size="sm" variant="ghost" onClick={() => openConfig(s)}><Icon name="key" size={13} /> Configure</Btn>
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === "rss" && (
        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: BORDER }}>
            <CardTitle>Custom RSS sources</CardTitle>
            <Btn size="sm" variant="ghost" onClick={() => { setRss((p) => [...p, { id: `rss-new-${++rssIdRef.current}`, title: "New feed", url: "https://example.com/rss", vertical: "News", status: "active", lastFetched: "just now" }]); toast("RSS source added", { icon: "rss", tone: "teal" }); }}><Icon name="plus" size={13} /> Add RSS</Btn>
          </div>
          {rss.map((r) => (
            <div key={r.id} className="flex items-center gap-3 border-b px-5 py-3.5 last:border-0" style={{ borderColor: BORDER }}>
              <span className="text-[var(--g-faint)]"><Icon name="rss" size={16} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{r.title}</p>
                <p className="truncate font-mono text-[11px] text-[var(--g-faint)]">{r.url}</p>
              </div>
              <span className="hidden text-xs text-[var(--g-faint)] sm:inline">{r.lastFetched}</span>
              <Badge tone={r.status === "active" ? "teal" : "error"}>{r.status}</Badge>
              <ActionMenu items={[{ label: "Remove", icon: "trash", danger: true, onClick: () => removeRss(r.id) }]} />
            </div>
          ))}
        </Card>
      )}

      {tab === "mcp" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {mcp.map((m) => (
            <Card key={m.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: PANEL2, color: CYAN }}><Icon name="server" size={17} /></span>
                  <div>
                    <p className="font-mono text-sm font-medium text-white">{m.name}</p>
                    <p className="text-[11px] uppercase tracking-wider text-[var(--g-faint)]">{m.transport} · {m.tools} tools</p>
                  </div>
                </div>
                <Toggle on={m.status === "online"} onChange={() => toggleMcp(m.id)} label={`Toggle ${m.name}`} />
              </div>
              <div className="mt-3"><Badge tone={m.status === "online" ? "teal" : "muted"}>{m.status}</Badge></div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!configuring}
        onClose={() => setConfiguring(null)}
        title={`Configure · ${configuring?.name ?? ""}`}
        footer={<><Btn variant="ghost" onClick={aiFinder}><Icon name="sparkles" size={13} /> AI finder</Btn><Btn disabled={testing} onClick={testConnection}>{testing ? "Testing…" : "Test & save"}</Btn></>}
      >
        <FieldLabel>API key</FieldLabel>
        <TextInput value={keyInput} onChange={setKeyInput} placeholder="paste key · stored encrypted" mono />
        <p className="mt-3 text-xs text-[var(--g-faint)]">Keys are encrypted at rest. &ldquo;Test &amp; save&rdquo; runs a live probe before storing.</p>
      </Modal>
    </div>
  );
}

/* ----------------------------- marketing (operable) ---------------------- */

type MktTab = "campaigns" | "contacts" | "surveys" | "automations";

function MarketingScreen() {
  const toast = useToast();
  const [tab, setTab] = useState<MktTab>("campaigns");
  const [autos, setAutos] = useState<AdminAutomation[]>(() => ADMIN_AUTOMATIONS.map((a) => ({ ...a })));
  const [contacts, setContacts] = useState(() => ADMIN_CONTACTS.map((c) => ({ ...c })));
  const [importing, setImporting] = useState(false);
  const importIdRef = useRef(0);

  function toggleAuto(id: string) {
    setAutos((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
    toast("Automation toggled", { icon: "check", tone: "teal" });
  }
  function importCsv() {
    const n = ++importIdRef.current;
    const extra = [
      { id: `ct-i${n}-1`, name: "Imported Lead 1", email: "lead1@imported.csv", segment: "Free", joined: "Jun 2025" },
      { id: `ct-i${n}-2`, name: "Imported Lead 2", email: "lead2@imported.csv", segment: "Free", joined: "Jun 2025" },
      { id: `ct-i${n}-3`, name: "Imported Lead 3", email: "lead3@imported.csv", segment: "Pro", joined: "Jun 2025" },
    ];
    setContacts((prev) => [...extra, ...prev]);
    toast("3 contacts imported", { icon: "upload", tone: "teal" });
    setImporting(false);
  }

  return (
    <div className="space-y-5">
      <Tabs<MktTab>
        tabs={[{ id: "campaigns", label: "Campaigns" }, { id: "contacts", label: "Contacts" }, { id: "surveys", label: "Surveys" }, { id: "automations", label: "Automations" }]}
        active={tab}
        onChange={setTab}
      />

      {tab === "campaigns" && (
        <Card className="!p-0 overflow-hidden">
          <div className="hidden grid-cols-12 items-center gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
            <div className="col-span-4">Campaign</div>
            <div className="col-span-2">Channel</div>
            <div className="col-span-3">Audience</div>
            <div className="col-span-1 text-right">Open</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          {ADMIN_CAMPAIGNS.map((c) => (
            <div key={c.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-3.5 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
              <div className="md:col-span-4"><p className="text-sm font-medium text-white">{c.name}</p><p className="text-[11px] text-[var(--g-faint)]">{c.sent.toLocaleString()} sent</p></div>
              <div className="text-sm text-[var(--g-muted)] md:col-span-2">{c.channel}</div>
              <div className="text-sm text-[var(--g-muted)] md:col-span-3">{c.audience}</div>
              <div className="font-mono text-sm text-[var(--g-text)] md:col-span-1 md:text-right">{c.openRate ? `${c.openRate}%` : "—"}</div>
              <div className="flex items-center justify-end gap-2 md:col-span-2">
                <Badge tone={c.status === "sent" ? "teal" : c.status === "scheduled" ? "cyan" : "muted"}>{c.status}</Badge>
                {c.status === "draft" && <Btn size="sm" variant="ghost" onClick={() => toast("Campaign scheduled", { icon: "mail", tone: "teal" })}>Send</Btn>}
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === "contacts" && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--g-muted)]">{contacts.length.toLocaleString()} contacts</p>
            <Btn onClick={() => setImporting(true)}><Icon name="upload" size={15} /> Import CSV</Btn>
          </div>
          <Card className="!p-0 overflow-hidden">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 border-b px-5 py-3.5 last:border-0" style={{ borderColor: BORDER }}>
                <div className="min-w-0"><p className="text-sm font-medium text-white">{c.name}</p><p className="truncate font-mono text-[11px] text-[var(--g-faint)]">{c.email}</p></div>
                <div className="flex items-center gap-3"><Badge tone="muted">{c.segment}</Badge><span className="hidden text-xs text-[var(--g-faint)] sm:inline">{c.joined}</span></div>
              </div>
            ))}
          </Card>
        </>
      )}

      {tab === "surveys" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_SURVEYS.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[var(--g-faint)]"><Icon name="test" size={18} /></span>
                <Badge tone={s.status === "open" ? "teal" : "muted"}>{s.status}</Badge>
              </div>
              <p className="mt-3 text-sm font-medium text-white">{s.title}</p>
              <p className="mt-2 font-mono text-2xl font-bold text-white">{s.responses.toLocaleString()}</p>
              <p className="text-[11px] uppercase tracking-wider text-[var(--g-faint)]">responses</p>
            </Card>
          ))}
        </div>
      )}

      {tab === "automations" && (
        <Card className="!p-0 overflow-hidden">
          {autos.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 border-b px-5 py-4 last:border-0" style={{ borderColor: BORDER }}>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{a.name}</p>
                <p className="text-[11px] text-[var(--g-faint)]">{a.trigger} · {a.runs.toLocaleString()} runs</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={a.active ? "teal" : "muted"}>{a.active ? "active" : "paused"}</Badge>
                <Toggle on={a.active} onChange={() => toggleAuto(a.id)} label={`Toggle ${a.name}`} />
              </div>
            </div>
          ))}
        </Card>
      )}

      <Modal
        open={importing}
        onClose={() => setImporting(false)}
        title="Import contacts"
        footer={<><Btn variant="ghost" onClick={() => setImporting(false)}>Cancel</Btn><Btn onClick={importCsv}>Import</Btn></>}
      >
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center" style={{ borderColor: BORDER }}>
          <span className="text-[var(--g-faint)]"><Icon name="upload" size={28} /></span>
          <p className="mt-3 text-sm text-[var(--g-muted)]">Drop a CSV here, or click to browse</p>
          <p className="mt-1 text-[11px] text-[var(--g-faint)]">name, email, segment</p>
        </div>
      </Modal>
    </div>
  );
}

/* ------------------------------- dev logs -------------------------------- */

type DevTab = "actions" | "summary" | "commits" | "skills";

function DevLogsScreen() {
  const toast = useToast();
  const [tab, setTab] = useState<DevTab>("actions");
  const [items, setItems] = useState(() => ADMIN_DEV_ACTION_ITEMS.map((i) => ({ ...i })));

  function cycle(id: string) {
    const order = ["open", "in_progress", "done"] as const;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: order[(order.indexOf(i.status) + 1) % order.length] } : i)));
  }

  return (
    <div className="space-y-5">
      <Tabs<DevTab>
        tabs={[{ id: "actions", label: "Action Items" }, { id: "summary", label: "Artoo PM" }, { id: "commits", label: "Commits" }, { id: "skills", label: "Skills & MDs" }]}
        active={tab}
        onChange={setTab}
      />

      {tab === "actions" && (
        <Card className="!p-0 overflow-hidden">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3 border-b px-5 py-3.5 last:border-0" style={{ borderColor: BORDER }}>
              <button onClick={() => cycle(i.id)} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border" style={{ borderColor: i.status === "done" ? TEAL : BORDER, background: i.status === "done" ? TEAL : "transparent", color: "#04140f" }} aria-label="Cycle status">
                {i.status === "done" && <Icon name="check" size={12} />}
              </button>
              <span className={`flex-1 text-sm ${i.status === "done" ? "text-[var(--g-faint)] line-through" : "text-white"}`}>{i.title}</span>
              <Badge tone={i.status === "in_progress" ? "cyan" : i.status === "done" ? "teal" : "muted"}>{i.status.replace("_", " ")}</Badge>
              <Badge tone={i.priority === "high" ? "error" : i.priority === "medium" ? "warn" : "muted"}>{i.priority}</Badge>
            </div>
          ))}
        </Card>
      )}

      {tab === "summary" && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(88,101,242,0.16)", color: "#aab4fc" }}><Icon name="sparkles" size={16} /></span><CardTitle>Artoo PM summary</CardTitle></div>
            <Btn size="sm" variant="ghost" onClick={() => toast("Regenerating summary…", { icon: "refresh", tone: "blurple" })}><Icon name="refresh" size={13} /> Regenerate</Btn>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--g-text)]">{ADMIN_PM_SUMMARY}</p>
        </Card>
      )}

      {tab === "commits" && (
        <Card className="!p-0 overflow-hidden">
          {ADMIN_DEV_COMMITS.map((c) => (
            <div key={c.sha} className="flex items-center gap-3 border-b px-5 py-3.5 last:border-0" style={{ borderColor: BORDER }}>
              <span className="rounded-md px-2 py-0.5 font-mono text-[11px]" style={{ background: PANEL2, color: CYAN }}>{c.sha}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-[var(--g-text)]">{c.msg}</span>
              <span className="hidden text-xs text-[var(--g-faint)] sm:inline">{c.author} · {c.when}</span>
            </div>
          ))}
        </Card>
      )}

      {tab === "skills" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {ADMIN_DEV_SKILLS.map((s) => (
            <Card key={s.name}>
              <div className="flex items-center gap-2">
                <span className="text-[var(--g-faint)]"><Icon name={s.type === "skill" ? "bolt" : "code"} size={15} /></span>
                <span className="font-mono text-sm font-medium text-white">{s.name}</span>
                <Badge tone={s.type === "skill" ? "blurple" : "muted"}>{s.type}</Badge>
              </div>
              <p className="mt-2 text-sm text-[var(--g-muted)]">{s.desc}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ stack / hood ----------------------------- */

function StackScreen() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(88,101,242,0.3)", background: "linear-gradient(135deg, var(--g-panel), var(--g-panel-2) 65%), radial-gradient(420px 200px at 90% 0%, rgba(88,101,242,0.16), transparent)" }}>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: CYAN }}><Icon name="layers" size={14} /> Under the hood</div>
        <h2 className="mt-3 max-w-2xl text-2xl font-bold text-white">A polyglot, self-hosted system.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--g-muted)]">
          The real architecture behind Galactic Signals: a type-safe React app, a Node API layer, and an async Python worker fleet sharing one Postgres brain. This demo is the frontend, running on sample data.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ADMIN_STACK_LANGUAGES.map((l) => (
            <span key={l} className="rounded-full border px-3 py-1 font-mono text-xs" style={{ borderColor: BORDER, color: TEAL }}>{l}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {ADMIN_STACK.map((g) => (
          <Card key={g.group}>
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.color }} />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{g.group}</h3>
            </div>
            <p className="mt-2 text-xs text-[var(--g-faint)]">{g.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {g.items.map((it) => (
                <span key={it} className="rounded-lg border px-2.5 py-1 text-xs" style={{ borderColor: BORDER, background: PANEL2, color: "var(--g-text)" }}>{it}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
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
