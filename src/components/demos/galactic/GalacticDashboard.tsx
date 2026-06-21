"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  GALACTIC,
  GALACTIC_PLATFORM,
  GALACTIC_ACCOUNT,
  GALACTIC_CATEGORIES,
  GALACTIC_FEEDS,
  GALACTIC_WEBHOOKS,
  GALACTIC_MONITORS,
  GALACTIC_ALERTS,
  GALACTIC_PLANS,
  GALACTIC_USERS,
  GALACTIC_TEMPLATE,
  type GalacticWebhook,
  type GalacticAlert,
  type EmbedField,
} from "@/data/galactic-demo";
import { Icon, EmbedCard, type IconName } from "./GalacticKit";

/**
 * GalacticDashboard - a fully clickable recreation of the Galactic Signals app.
 * One client component holds the active-view state; the sidebar switches screens.
 * Every interaction runs locally on sample data: activate feeds, paste/test
 * webhooks (which fire branded embeds into a faux Discord channel), edit branding
 * with a live preview, build embed templates, and flip a feed between a Discord
 * embed and the structured agent stream (the MCP angle). Nothing hits a server.
 */

const BORDER = "var(--g-border)";
const PANEL = "var(--g-panel)";
const PANEL2 = "var(--g-panel-2)";
const TEAL = "var(--g-teal)";

type View =
  | "home"
  | "store"
  | "manage"
  | "monitors"
  | "branding"
  | "billing"
  | "builder"
  | "visualizer"
  | "users";

const NAV: { group: string; items: { id: View; label: string; icon: IconName }[] }[] = [
  {
    group: "Main",
    items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "store", label: "Feed Store", icon: "store" },
      { id: "manage", label: "Delivery", icon: "webhook" },
      { id: "monitors", label: "Monitors", icon: "activity" },
      { id: "branding", label: "Branding", icon: "palette" },
      { id: "billing", label: "Billing", icon: "bolt" },
    ],
  },
  {
    group: "Admin",
    items: [
      { id: "builder", label: "Monitor Builder", icon: "sparkles" },
      { id: "visualizer", label: "Embed Visualizer", icon: "eye" },
      { id: "users", label: "Users", icon: "users" },
    ],
  },
];

const TITLES: Record<View, string> = {
  home: "Home",
  store: "Feed Store",
  manage: "Delivery",
  monitors: "Monitors",
  branding: "Branding",
  billing: "Billing",
  builder: "Monitor Builder",
  visualizer: "Embed Visualizer",
  users: "Users",
};

const COLOR_SWATCHES = ["#1DD1A1", "#5865F2", "#22D3EE", "#F7931A", "#ED4245", "#8B5CF6", "#57F287"];

export default function GalacticDashboard() {
  const [view, setView] = useState<View>("home");
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] text-[var(--g-text)]">
      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r transition-transform duration-200 md:static md:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: PANEL2, borderColor: BORDER }}
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(29,209,161,0.14)", color: TEAL }}>
            <Icon name="rocket" size={18} />
          </span>
          <span className="text-base font-semibold text-white">Galactic</span>
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
                    style={active ? { background: "rgba(29,209,161,0.12)", color: TEAL } : { color: "var(--g-muted)" }}
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

      {/* mobile overlay */}
      {navOpen && (
        <button aria-label="Close menu" onClick={() => setNavOpen(false)} className="fixed inset-0 z-30 bg-black/50 md:hidden" />
      )}

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b px-5 py-3.5" style={{ borderColor: BORDER, background: PANEL }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setNavOpen(true)} className="text-[var(--g-muted)] md:hidden" aria-label="Open menu">
              <Icon name="menu" />
            </button>
            <h1 className="text-lg font-semibold text-white">{TITLES[view]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs sm:flex" style={{ borderColor: BORDER, color: TEAL }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: TEAL }} /> Live
            </span>
            <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm" style={{ borderColor: BORDER, background: PANEL2 }}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-[#04140f]" style={{ background: TEAL }}>
                {GALACTIC_ACCOUNT.avatarLetter}
              </span>
              <span className="hidden text-white sm:inline">{GALACTIC_ACCOUNT.community}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-7">
          {view === "home" && <HomeScreen onGo={setView} />}
          {view === "store" && <StoreScreen />}
          {view === "manage" && <ManageScreen />}
          {view === "monitors" && <MonitorsScreen />}
          {view === "branding" && <BrandingScreen />}
          {view === "billing" && <BillingScreen />}
          {view === "builder" && <BuilderScreen />}
          {view === "visualizer" && <VisualizerScreen />}
          {view === "users" && <UsersScreen />}
        </main>
      </div>
    </div>
  );
}

/* =============================== screens ================================== */

function HomeScreen({ onGo }: { onGo: (v: View) => void }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(id);
  }, []);

  const alertsToday = GALACTIC_PLATFORM.alertsToday + tick * 3;
  const activeFeeds = GALACTIC_FEEDS.filter((f) => f.activated).length;
  const rot = tick % GALACTIC_ALERTS.length;
  const liveFeed = [...GALACTIC_ALERTS.slice(rot), ...GALACTIC_ALERTS.slice(0, rot)].slice(0, 6);

  const stats = [
    { label: "Alerts today", value: alertsToday.toLocaleString(), hint: "↑ live" },
    { label: "Active feeds", value: String(activeFeeds), hint: `of ${GALACTIC_FEEDS.length}` },
    { label: "Members reached", value: GALACTIC_ACCOUNT.members.toLocaleString(), hint: GALACTIC_ACCOUNT.community },
    { label: "Delivery uptime", value: `${GALACTIC_PLATFORM.uptimePct}%`, hint: `${GALACTIC_PLATFORM.avgLatencyMs}ms avg` },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-6" style={{ borderColor: BORDER, background: "linear-gradient(135deg, var(--g-panel), var(--g-panel-2) 70%)" }}>
        <p className="text-sm text-[var(--g-muted)]">Welcome back</p>
        <h2 className="mt-1 text-2xl font-bold text-white">{GALACTIC_ACCOUNT.serverName}</h2>
        <p className="mt-2 text-sm text-[var(--g-text)]">
          You are on the <span style={{ color: TEAL }}>{GALACTIC_ACCOUNT.plan}</span> plan,
          delivering {activeFeeds} live feeds to {GALACTIC_ACCOUNT.members.toLocaleString()} members.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => onGo("store")} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#04140f]" style={{ background: TEAL }}>
            Browse feeds
          </button>
          <button onClick={() => onGo("manage")} className="rounded-lg border px-4 py-2 text-sm text-[var(--g-text)] transition-colors hover:bg-white/5" style={{ borderColor: BORDER }}>
            Manage delivery
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 !p-0">
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}>
            <CardTitle>Live activity</CardTitle>
            <span className="flex items-center gap-1.5 text-xs text-[var(--g-faint)]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: TEAL }} /> streaming
            </span>
          </div>
          <ul>
            {liveFeed.map((a, i) => (
              <li key={`${a.id}-${tick}-${i}`} className="flex items-center gap-3 border-b px-5 py-3 last:border-0" style={{ borderColor: BORDER, animation: i === 0 ? "g-pop .4s ease-out" : undefined }}>
                <span className="text-base">{a.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{a.title}</p>
                  <p className="truncate text-xs text-[var(--g-muted)]">{a.feed} → {a.destination}</p>
                </div>
                <span className="shrink-0 text-xs text-[var(--g-faint)]">{i === 0 ? "just now" : a.time}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardTitle>This week</CardTitle>
          <div className="mt-4 space-y-4">
            <Metric label="Alerts delivered" value={GALACTIC_PLATFORM.alertsThisWeek.toLocaleString()} />
            <Metric label="Channels connected" value={GALACTIC_PLATFORM.channelsConnected.toLocaleString()} />
            <Metric label="Communities live" value={`${GALACTIC_PLATFORM.communities.toLocaleString()}+`} />
          </div>
          <button onClick={() => onGo("billing")} className="mt-6 w-full rounded-lg border px-4 py-2 text-sm text-[var(--g-teal)] transition-colors hover:bg-white/5" style={{ borderColor: BORDER }}>
            View usage
          </button>
        </Card>
      </div>
    </div>
  );
}

function StoreScreen() {
  const [active, setActive] = useState<Set<string>>(() => new Set(GALACTIC_FEEDS.filter((f) => f.activated).map((f) => f.id)));
  const [cat, setCat] = useState<string>("all");
  const [toast, setToast] = useState<string | null>(null);

  const tabs = [{ id: "all", name: "All", emoji: "✦" }, ...GALACTIC_CATEGORIES.map((c) => ({ id: c.id, name: c.name, emoji: c.emoji }))];
  const shown = cat === "all" ? GALACTIC_FEEDS : GALACTIC_FEEDS.filter((f) => f.category === cat);

  function toggle(id: string, name: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setToast(`Deactivated ${name}`);
      } else {
        next.add(id);
        setToast(`Activated ${name}`);
      }
      return next;
    });
    window.setTimeout(() => setToast(null), 1800);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--g-muted)]">Activate any feed to start delivering it. {active.size} of {GALACTIC_FEEDS.length} active.</p>
        {toast && <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: "rgba(29,209,161,0.12)", color: TEAL }}>{toast}</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setCat(t.id)}
            className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors"
            style={cat === t.id ? { background: TEAL, borderColor: TEAL, color: "#04140f" } : { borderColor: BORDER, color: "var(--g-muted)" }}
          >
            <span>{t.emoji}</span> {t.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((f) => {
          const on = active.has(f.id);
          return (
            <div key={f.id} className="flex flex-col rounded-2xl border p-5" style={{ borderColor: on ? "rgba(29,209,161,0.4)" : BORDER, background: PANEL }}>
              <div className="flex items-center justify-between">
                <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: PANEL2, color: "var(--g-muted)" }}>{f.cadence}</span>
                <div className="flex items-center gap-2">
                  {f.popular && <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-300">Popular</span>}
                  <span className="rounded-full border px-2 py-0.5 text-[10px]" style={{ borderColor: BORDER, color: "var(--g-faint)" }}>{f.tier}</span>
                </div>
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">{f.name}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[var(--g-muted)]">{f.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-[var(--g-faint)]">
                <span>{f.source}</span>
                <span>{f.subscribers.toLocaleString()} subscribers</span>
              </div>
              <button
                onClick={() => toggle(f.id, f.name)}
                className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                style={on ? { background: "rgba(29,209,161,0.12)", color: TEAL } : { background: TEAL, color: "#04140f" }}
              >
                {on ? "Activated ✓" : "Activate"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ManageScreen() {
  const [rows, setRows] = useState<GalacticWebhook[]>([...GALACTIC_WEBHOOKS]);
  const [delivered, setDelivered] = useState<GalacticAlert[]>(GALACTIC_ALERTS.slice(0, 2));
  const [toast, setToast] = useState<string | null>(null);

  function fireTest(row: GalacticWebhook) {
    const match = GALACTIC_ALERTS.find((a) => a.feed === row.feed) ?? GALACTIC_ALERTS[0];
    const stamped: GalacticAlert = { ...match, id: `${match.id}-${delivered.length}-${row.id}`, time: "just now", destination: row.destination };
    setDelivered((prev) => [stamped, ...prev].slice(0, 6));
    setToast(`Test alert delivered to ${row.channel}`);
    window.setTimeout(() => setToast(null), 2000);
  }

  function toggleActive(id: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  }

  function addChannel() {
    setRows((prev) => [
      ...prev,
      { id: `w-${prev.length + 1}-${prev.length}`, feed: "Top Stock Movers", destination: "Discord", channel: "#new-channel", url: "", active: true, health: "healthy", deliveredToday: 0 },
    ]);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--g-muted)]">Wire each feed to a channel. Paste a webhook, then hit Test to fire a branded alert.</p>
          <button onClick={addChannel} className="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-[var(--g-teal)] transition-colors hover:bg-white/5" style={{ borderColor: BORDER }}>
            <Icon name="plus" size={15} /> Add channel
          </button>
        </div>

        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border p-4" style={{ borderColor: BORDER, background: PANEL }}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HealthDot health={r.health} />
                  <span className="text-sm font-medium text-white">{r.feed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border px-2 py-0.5 text-[11px]" style={{ borderColor: BORDER, color: "var(--g-muted)" }}>{r.destination}</span>
                  <Toggle on={r.active} onChange={() => toggleActive(r.id)} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="font-mono text-xs text-[var(--g-teal)]">{r.channel}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: PANEL2 }}>
                <span className="text-[var(--g-faint)]"><Icon name="link" size={15} /></span>
                <input
                  defaultValue={r.url}
                  placeholder="Paste a webhook URL"
                  className="w-full bg-transparent font-mono text-xs text-[var(--g-text)] outline-none placeholder:text-[var(--g-faint)]"
                />
                <button onClick={() => fireTest(r)} className="flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-[#04140f]" style={{ background: TEAL }}>
                  <Icon name="test" size={13} /> Test
                </button>
              </div>
              <p className="mt-2 text-xs text-[var(--g-faint)]">{r.deliveredToday} delivered today</p>
            </div>
          ))}
        </div>
      </div>

      {/* live preview channel */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <div className="overflow-hidden rounded-2xl border" style={{ borderColor: BORDER, background: "#313338" }}>
          <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "#26282c", background: "#2b2d31" }}>
            <span className="text-[var(--g-muted)]">#</span>
            <span className="text-sm font-semibold text-white">delivery-preview</span>
            <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(29,209,161,0.15)", color: TEAL }}>LIVE</span>
          </div>
          <div className="max-h-[520px] space-y-3 overflow-y-auto p-3">
            {delivered.map((a) => (
              <div key={a.id} style={{ animation: "g-pop .4s ease-out" }}>
                <EmbedCard alert={a} />
              </div>
            ))}
          </div>
        </div>
        {toast && <p className="mt-3 text-center text-sm" style={{ color: TEAL }}>{toast}</p>}
      </div>
    </div>
  );
}

function MonitorsScreen() {
  const [mons, setMons] = useState([...GALACTIC_MONITORS]);
  const [toast, setToast] = useState<string | null>(null);

  function run(id: string, name: string) {
    setMons((prev) => prev.map((m) => (m.id === id ? { ...m, lastRun: "now", runCount: m.runCount + 1, status: "completed" } : m)));
    setToast(`Ran ${name}`);
    window.setTimeout(() => setToast(null), 1600);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--g-muted)]">A fleet of async workers, each market-hours gated with a per-worker circuit breaker and heartbeats.</p>
        {toast && <span className="text-sm" style={{ color: TEAL }}>{toast}</span>}
      </div>
      <Card className="!p-0 overflow-hidden">
        <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[var(--g-faint)] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-3">Monitor</div>
          <div className="col-span-3">Schedule</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Last run</div>
          <div className="col-span-2 text-right">Runs</div>
        </div>
        {mons.map((m) => (
          <div key={m.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
            <div className="md:col-span-3">
              <p className="text-sm font-medium text-white">{m.name}</p>
              {m.marketHoursOnly && <span className="text-[11px] text-[var(--g-faint)]">market hours only</span>}
            </div>
            <div className="font-mono text-xs text-[var(--g-muted)] md:col-span-3">{m.cron}</div>
            <div className="md:col-span-2"><StatusPill status={m.status} /></div>
            <div className="text-sm text-[var(--g-muted)] md:col-span-2">{m.lastRun}</div>
            <div className="flex items-center justify-between gap-2 md:col-span-2 md:justify-end">
              <span className="font-mono text-sm text-[var(--g-text)]">{m.runCount.toLocaleString()}</span>
              <button onClick={() => run(m.id, m.name)} className="rounded-md border px-2.5 py-1 text-xs text-[var(--g-teal)] transition-colors hover:bg-white/5" style={{ borderColor: BORDER }}>
                Run
              </button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function BrandingScreen() {
  const [server, setServer] = useState<string>(GALACTIC_ACCOUNT.serverName);
  const [color, setColor] = useState<string>(GALACTIC_ACCOUNT.embedColor);
  const sample = GALACTIC_ALERTS[0];

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardTitle>Brand your alerts</CardTitle>
        <p className="mt-2 text-sm text-[var(--g-muted)]">Every delivered embed carries your name and accent color. Changes preview live.</p>
        <label className="mt-5 block text-xs uppercase tracking-wider text-[var(--g-faint)]">Server name</label>
        <input
          value={server}
          onChange={(e) => setServer(e.target.value)}
          className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--g-teal)]"
          style={{ borderColor: BORDER }}
        />
        <label className="mt-5 block text-xs uppercase tracking-wider text-[var(--g-faint)]">Embed accent</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={c}
              className="h-9 w-9 rounded-lg transition-transform hover:scale-105"
              style={{ background: c, outline: color === c ? "2px solid white" : "none", outlineOffset: 2 }}
            />
          ))}
        </div>
        <p className="mt-3 font-mono text-xs text-[var(--g-faint)]">{color}</p>
      </Card>

      <div>
        <CardTitle>Live preview</CardTitle>
        <div className="mt-3 overflow-hidden rounded-2xl border" style={{ borderColor: BORDER, background: "#313338" }}>
          <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "#26282c", background: "#2b2d31" }}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: color }}>
              {server.charAt(0) || "G"}
            </span>
            <span className="text-sm font-semibold text-white">{server || "Your Server"}</span>
            <span className="text-xs text-[var(--g-faint)]">via Galactic</span>
          </div>
          <div className="p-3">
            <EmbedCard alert={{ ...sample, time: "preview" }} brandColor={color} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingScreen() {
  const usage = [
    { label: "Alerts this month", used: 142_300, cap: 250_000 },
    { label: "Channels", used: 9, cap: 999 },
    { label: "Feeds active", used: GALACTIC_FEEDS.filter((f) => f.activated).length, cap: GALACTIC_FEEDS.length },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {usage.map((u) => (
          <Card key={u.label}>
            <CardTitle>{u.label}</CardTitle>
            <p className="mt-3 text-2xl font-bold text-white">{u.used.toLocaleString()}<span className="text-sm font-normal text-[var(--g-faint)]"> / {u.cap >= 999 ? "∞" : u.cap.toLocaleString()}</span></p>
            <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: PANEL2 }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, (u.used / u.cap) * 100)}%`, background: "linear-gradient(90deg, #1DD1A1, #22D3EE)" }} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {GALACTIC_PLANS.map((p) => {
          const current = p.name === GALACTIC_ACCOUNT.plan;
          return (
            <div key={p.name} className="relative flex flex-col rounded-2xl border p-6" style={{ borderColor: current ? TEAL : BORDER, background: PANEL }}>
              {current && <span className="absolute -top-3 left-6 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#04140f]" style={{ background: TEAL }}>Current plan</span>}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-bold text-white">${p.price}</span>
                <span className="pb-1 text-sm text-[var(--g-faint)]">/mo</span>
              </div>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--g-text)]">
                    <span className="mt-0.5 shrink-0" style={{ color: TEAL }}><Icon name="check" size={14} /></span>{f}
                  </li>
                ))}
              </ul>
              <button className="mt-5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors" style={current ? { border: `1px solid ${BORDER}`, color: "var(--g-muted)" } : { background: TEAL, color: "#04140f" }}>
                {current ? "Manage plan" : `Switch to ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BuilderScreen() {
  const [title, setTitle] = useState(GALACTIC_TEMPLATE.title);
  const [color, setColor] = useState(GALACTIC_TEMPLATE.color);
  const [fields, setFields] = useState<EmbedField[]>(GALACTIC_TEMPLATE.fields.map((f) => ({ ...f })));
  const sample = GALACTIC_TEMPLATE.sample;

  function subst(v: string) {
    return v.replace(/\{\{(\w+)\}\}/g, (_, k: string) => sample[k] ?? `{{${k}}}`);
  }
  const preview: GalacticAlert = {
    id: "preview",
    feed: GALACTIC_TEMPLATE.feed,
    icon: "🐋",
    title,
    color,
    time: "preview",
    destination: "Discord",
    fields: fields.map((f) => ({ name: f.name, value: subst(f.value), inline: f.inline })),
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardTitle>Embed template</CardTitle>
        <p className="mt-2 text-sm text-[var(--g-muted)]">Compose the embed an admin ships for a feed. Use <code className="font-mono text-[var(--g-teal)]">{"{{var}}"}</code> tokens; they fill from the sample payload.</p>
        <label className="mt-5 block text-xs uppercase tracking-wider text-[var(--g-faint)]">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--g-teal)]" style={{ borderColor: BORDER }} />

        <label className="mt-5 block text-xs uppercase tracking-wider text-[var(--g-faint)]">Accent</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => (
            <button key={c} onClick={() => setColor(c)} aria-label={c} className="h-8 w-8 rounded-lg transition-transform hover:scale-105" style={{ background: c, outline: color === c ? "2px solid white" : "none", outlineOffset: 2 }} />
          ))}
        </div>

        <label className="mt-5 block text-xs uppercase tracking-wider text-[var(--g-faint)]">Fields</label>
        <div className="mt-2 space-y-2">
          {fields.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={f.name}
                onChange={(e) => setFields((prev) => prev.map((p, j) => (j === i ? { ...p, name: e.target.value } : p)))}
                className="w-1/3 rounded-lg border bg-transparent px-2.5 py-2 text-xs text-white outline-none focus:border-[var(--g-teal)]"
                style={{ borderColor: BORDER }}
              />
              <input
                value={f.value}
                onChange={(e) => setFields((prev) => prev.map((p, j) => (j === i ? { ...p, value: e.target.value } : p)))}
                className="flex-1 rounded-lg border bg-transparent px-2.5 py-2 font-mono text-xs text-[var(--g-text)] outline-none focus:border-[var(--g-teal)]"
                style={{ borderColor: BORDER }}
              />
            </div>
          ))}
        </div>
      </Card>

      <div>
        <CardTitle>Live preview</CardTitle>
        <div className="mt-3 overflow-hidden rounded-2xl border p-3" style={{ borderColor: BORDER, background: "#313338" }}>
          <EmbedCard alert={preview} brandColor={color} />
        </div>
        <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: BORDER, background: PANEL }}>
          <CardTitle>Sample payload</CardTitle>
          <pre className="mt-3 overflow-x-auto font-mono text-xs text-[var(--g-muted)]">{JSON.stringify(sample, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

function VisualizerScreen() {
  const [sel, setSel] = useState(GALACTIC_ALERTS[0].id);
  const [mode, setMode] = useState<"embed" | "json">("embed");
  const alert = GALACTIC_ALERTS.find((a) => a.id === sel) ?? GALACTIC_ALERTS[0];

  const stream = {
    feed: alert.feed,
    event: alert.title,
    color: parseInt(alert.color.slice(1), 16),
    fields: alert.fields,
    footer: GALACTIC.footer,
    ts: "2026-06-21T18:42:11Z",
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-[var(--g-muted)]">Inspect any feed two ways: the branded Discord embed humans see, and the structured stream an AI agent consumes over MCP.</p>

      <div className="flex flex-wrap gap-2">
        {GALACTIC_ALERTS.slice(0, 8).map((a) => (
          <button
            key={a.id}
            onClick={() => setSel(a.id)}
            className="rounded-full border px-3 py-1.5 text-sm transition-colors"
            style={sel === a.id ? { background: TEAL, borderColor: TEAL, color: "#04140f" } : { borderColor: BORDER, color: "var(--g-muted)" }}
          >
            {a.icon} {a.feed}
          </button>
        ))}
      </div>

      <div className="inline-flex rounded-lg border p-1" style={{ borderColor: BORDER }}>
        {(["embed", "json"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className="rounded-md px-4 py-1.5 text-sm font-medium transition-colors" style={mode === m ? { background: PANEL2, color: "white" } : { color: "var(--g-muted)" }}>
            {m === "embed" ? "Discord embed" : "Agent stream (MCP)"}
          </button>
        ))}
      </div>

      {mode === "embed" ? (
        <div className="max-w-md overflow-hidden rounded-2xl border p-3" style={{ borderColor: BORDER, background: "#313338" }}>
          <EmbedCard alert={alert} />
        </div>
      ) : (
        <div className="rounded-2xl border p-4" style={{ borderColor: BORDER, background: PANEL2 }}>
          <div className="mb-2 flex items-center gap-2 text-xs text-[var(--g-faint)]"><Icon name="bolt" size={13} /> structured stream · any agent on Claude, ChatGPT, or a custom stack</div>
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[var(--g-text)]">{JSON.stringify(stream, null, 2)}</pre>
        </div>
      )}
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--g-muted)]">{GALACTIC_PLATFORM.traders.toLocaleString()}+ traders across {GALACTIC_PLATFORM.communities.toLocaleString()}+ communities. Showing a sample.</p>
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
          <div className="col-span-1">Channels</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        {filtered.map((u) => (
          <div key={u.id} className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-12 md:gap-4" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-3 md:col-span-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-[#04140f]" style={{ background: TEAL }}>{u.name.charAt(0)}</span>
              <div>
                <p className="text-sm font-medium text-white">{u.name}</p>
                <p className="text-xs text-[var(--g-faint)]">@{u.handle}</p>
              </div>
            </div>
            <div className="text-sm text-[var(--g-muted)] md:col-span-3">{u.community}</div>
            <div className="md:col-span-2"><span className="rounded-full border px-2 py-0.5 text-xs" style={{ borderColor: BORDER, color: "var(--g-muted)" }}>{u.plan}</span></div>
            <div className="text-sm text-[var(--g-text)] md:col-span-1">{u.channels}</div>
            <div className="md:col-span-2 md:text-right"><UserStatus status={u.status} /></div>
          </div>
        ))}
        {filtered.length === 0 && <div className="px-5 py-8 text-center text-sm text-[var(--g-faint)]">No users match &ldquo;{q}&rdquo;.</div>}
      </Card>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--g-muted)]">{label}</span>
      <span className="font-mono text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} role="switch" aria-checked={on} className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors" style={{ background: on ? "var(--g-teal)" : "#243349" }}>
      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" style={{ transform: on ? "translateX(22px)" : "translateX(4px)" }} />
    </button>
  );
}

function HealthDot({ health }: { health: GalacticWebhook["health"] }) {
  const map = { healthy: "#1DD1A1", degraded: "#F39C12", broken: "#ED4245" };
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: map[health], boxShadow: `0 0 8px ${map[health]}66` }} title={health} />;
}

function StatusPill({ status }: { status: "completed" | "in_progress" | "not_started" }) {
  const map = {
    completed: { bg: "rgba(29,209,161,0.12)", c: "#1DD1A1", label: "Healthy" },
    in_progress: { bg: "rgba(34,211,238,0.12)", c: "#22D3EE", label: "Running" },
    not_started: { bg: "rgba(124,141,168,0.12)", c: "#7C8DA8", label: "Paused" },
  }[status];
  return <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: map.bg, color: map.c }}>{map.label}</span>;
}

function UserStatus({ status }: { status: "active" | "trialing" | "churned" }) {
  const map = {
    active: { bg: "rgba(29,209,161,0.12)", c: "#1DD1A1", label: "Active" },
    trialing: { bg: "rgba(34,211,238,0.12)", c: "#22D3EE", label: "Trialing" },
    churned: { bg: "rgba(124,141,168,0.12)", c: "#7C8DA8", label: "Churned" },
  }[status];
  return <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: map.bg, color: map.c }}>{map.label}</span>;
}
