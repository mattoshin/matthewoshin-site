"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MOCEAN_BUSINESS,
  MOCEAN_PRODUCTS,
  MOCEAN_MONITORS,
  MOCEAN_ACTIVE_PRODUCTS,
  MOCEAN_INVOICES,
  MOCEAN_SPEND,
  MOCEAN_ANNOUNCEMENTS,
  type MoceanProduct,
} from "@/data/mocean-demo";

/**
 * MoceanDashboard - a clickable recreation of Mocean's customer dashboard. One
 * client component holding the active-view state; the sidebar switches screens.
 * Nothing hits a server: toggles and the "apply" button mutate local state and
 * show a demo toast. Mocean's own teal-on-navy brand throughout.
 */

const TEAL = "#5ecdd1";
const PANEL = "#0a1b28";
const BORDER = "#173040";

type View = "home" | "monitors" | "products" | "active" | "invoices" | "account";

const NAV: { id: View; label: string; icon: IconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "monitors", label: "Manage Monitors", icon: "feed" },
  { id: "products", label: "Products", icon: "bag" },
  { id: "active", label: "Active Products", icon: "box" },
  { id: "invoices", label: "Invoices", icon: "invoice" },
  { id: "account", label: "Account", icon: "user" },
];

const TITLES: Record<View, string> = {
  home: "Home",
  monitors: "Manage Monitors",
  products: "Products",
  active: "Active Products",
  invoices: "Invoices",
  account: "Account",
};

export default function MoceanDashboard() {
  const [view, setView] = useState<View>("home");
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] text-[#c2c4d1]">
      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r transition-transform duration-200 md:static md:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: PANEL, borderColor: BORDER }}
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <Image src="/demos/mocean/logo.png" alt="Mocean" width={32} height={32} className="rounded" />
          <span className="text-base font-semibold text-white">Mocean</span>
        </div>
        <nav className="px-3">
          {NAV.map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setNavOpen(false);
                }}
                className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
                style={
                  active
                    ? { background: "rgba(94,205,209,0.12)", color: TEAL }
                    : { color: "#8b97a8" }
                }
              >
                <Icon name={item.icon} />
                <span className={active ? "font-medium" : ""}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="absolute inset-x-3 bottom-4">
          <Link
            href="/app/mocean-demo"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-[#6c8696] transition-colors hover:text-[#c2c4d1]"
          >
            <span aria-hidden="true">&lt;-</span> Back to landing
          </Link>
        </div>
      </aside>

      {/* mobile overlay */}
      {navOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* topbar */}
        <header
          className="flex items-center justify-between gap-4 border-b px-5 py-3.5"
          style={{ borderColor: BORDER, background: "#0c222f" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNavOpen(true)}
              className="text-[#8b97a8] md:hidden"
              aria-label="Open menu"
            >
              <Icon name="menu" />
            </button>
            <h1 className="text-lg font-semibold text-white">{TITLES[view]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-[#8b97a8] sm:flex" style={{ borderColor: BORDER }}>
              <Icon name="search" />
              <span>Search</span>
            </div>
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
              style={{ borderColor: BORDER, background: PANEL }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-[#061427]" style={{ background: TEAL }}>
                {MOCEAN_BUSINESS.name.charAt(0)}
              </span>
              <span className="hidden text-white sm:inline">{MOCEAN_BUSINESS.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-7">
          {view === "home" && <HomeScreen onGo={setView} />}
          {view === "monitors" && <MonitorsScreen />}
          {view === "products" && <ProductsScreen />}
          {view === "active" && <ActiveScreen onGo={setView} />}
          {view === "invoices" && <InvoicesScreen />}
          {view === "account" && <AccountScreen />}
        </main>
      </div>
    </div>
  );
}

/* ----------------------------- screens ----------------------------------- */

function HomeScreen({ onGo }: { onGo: (v: View) => void }) {
  const liveMonitors = MOCEAN_MONITORS.filter((m) => m.enabled).length;
  const activeCount = MOCEAN_ACTIVE_PRODUCTS.filter((p) => p.status === "Active").length;
  const stats = [
    { label: "Active products", value: String(activeCount) },
    { label: "Monitors live", value: String(liveMonitors) },
    { label: "Members reached", value: MOCEAN_BUSINESS.members.toLocaleString() },
    { label: "This month", value: "$525" },
  ];
  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl border p-6"
        style={{
          borderColor: BORDER,
          background: "linear-gradient(135deg, #0c222f, #0a1b28 70%)",
        }}
      >
        <p className="text-sm text-[#8b97a8]">Welcome back</p>
        <h2 className="mt-1 text-2xl font-bold text-white">{MOCEAN_BUSINESS.discord}</h2>
        <p className="mt-2 text-sm text-[#c2c4d1]">
          You are on the <span style={{ color: TEAL }}>{MOCEAN_BUSINESS.plan}</span> plan,
          delivering {liveMonitors} live feeds across your community.
        </p>
        <button
          onClick={() => onGo("monitors")}
          className="mt-5 rounded-lg px-4 py-2 text-sm font-semibold text-[#061427]"
          style={{ background: TEAL }}
        >
          Manage monitors
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Announcements</CardTitle>
          <ul className="mt-4 space-y-4">
            {MOCEAN_ANNOUNCEMENTS.map((a) => (
              <li key={a.id} className="flex gap-3">
                <Tag label={a.tag} />
                <div>
                  <p className="text-sm font-medium text-white">{a.title}</p>
                  <p className="mt-0.5 text-sm text-[#8b97a8]">{a.body}</p>
                  <p className="mt-1 text-xs text-[#6c8696]">{a.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle>Latest invoice</CardTitle>
          <div className="mt-4">
            <p className="text-3xl font-bold text-white">${MOCEAN_INVOICES[0].amount}</p>
            <p className="mt-1 text-sm text-[#8b97a8]">
              {MOCEAN_INVOICES[0].number} · {MOCEAN_INVOICES[0].date}
            </p>
            <span className="mt-3 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
              {MOCEAN_INVOICES[0].status}
            </span>
          </div>
          <button
            onClick={() => onGo("invoices")}
            className="mt-6 w-full rounded-lg border px-4 py-2 text-sm text-[#5ecdd1] transition-colors hover:bg-[#0c222f]"
            style={{ borderColor: BORDER }}
          >
            View all invoices
          </button>
        </Card>
      </div>
    </div>
  );
}

function MonitorsScreen() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCEAN_MONITORS.map((m) => [m.id, m.enabled])),
  );
  const [toast, setToast] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-[#8b97a8]">
          Wire each data feed to a Discord channel. Paste a webhook URL, set the
          cadence, and Mocean delivers branded alerts automatically.
        </p>
      </div>

      <Card className="!p-0">
        <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[#6c8696] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-3">Feed</div>
          <div className="col-span-2">Channel</div>
          <div className="col-span-4">Webhook URL</div>
          <div className="col-span-2">Cadence</div>
          <div className="col-span-1 text-right">On</div>
        </div>
        {MOCEAN_MONITORS.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-1 items-center gap-3 border-b px-5 py-4 md:grid-cols-12 md:gap-4"
            style={{ borderColor: BORDER }}
          >
            <div className="md:col-span-3">
              <p className="text-sm font-medium text-white">{m.product}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-mono text-sm text-[#5ecdd1]">{m.channel}</span>
            </div>
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "rgba(23,26,35,0.5)" }}>
                <Icon name="link" />
                <input
                  defaultValue={m.webhook}
                  placeholder="Insert webhook URL"
                  className="w-full bg-transparent text-sm text-[#c2c4d1] outline-none placeholder:text-[#6c8696]"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <span className="rounded-full border px-2.5 py-0.5 text-xs text-[#8b97a8]" style={{ borderColor: BORDER }}>
                {m.cadence}
              </span>
            </div>
            <div className="md:col-span-1 md:text-right">
              <Toggle
                on={toggles[m.id]}
                onChange={() => setToggles((t) => ({ ...t, [m.id]: !t[m.id] }))}
              />
            </div>
          </div>
        ))}
      </Card>

      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setToast(true);
            setTimeout(() => setToast(false), 2200);
          }}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-[#061427]"
          style={{ background: TEAL }}
        >
          Apply changes
        </button>
        {toast && (
          <span className="text-sm text-emerald-400">Saved. Alerts updated (demo).</span>
        )}
      </div>
    </div>
  );
}

function ProductsScreen() {
  const categories = ["All", "On-chain", "NFT", "Research", "Utility"] as const;
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const shown =
    cat === "All" ? MOCEAN_PRODUCTS : MOCEAN_PRODUCTS.filter((p) => p.category === cat);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="rounded-full border px-4 py-1.5 text-sm transition-colors"
            style={
              cat === c
                ? { background: TEAL, borderColor: TEAL, color: "#061427" }
                : { borderColor: BORDER, color: "#8b97a8" }
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product: p }: { product: MoceanProduct }) {
  return (
    <div className="flex flex-col rounded-2xl border p-5" style={{ borderColor: BORDER, background: PANEL }}>
      <div className="flex items-center justify-between">
        <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: "rgba(94,205,209,0.1)", color: TEAL }}>
          {p.category}
        </span>
        {p.popular && (
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs text-amber-300">
            Popular
          </span>
        )}
      </div>
      <h3 className="mt-3 text-base font-semibold text-white">{p.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#8b97a8]">{p.description}</p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-white">${p.price}</span>
          <span className="text-sm text-[#6c8696]">/mo</span>
        </div>
        <span className="text-xs text-[#6c8696]">{p.feeds} feeds</span>
      </div>
      <button
        className="mt-4 w-full rounded-lg border px-4 py-2 text-sm font-medium text-[#5ecdd1] transition-colors hover:bg-[#0c222f]"
        style={{ borderColor: BORDER }}
      >
        Subscribe
      </button>
    </div>
  );
}

function ActiveScreen({ onGo }: { onGo: (v: View) => void }) {
  return (
    <Card className="!p-0">
      <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[#6c8696] md:grid" style={{ borderColor: BORDER }}>
        <div className="col-span-4">Product</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Members</div>
        <div className="col-span-2">Monitors</div>
        <div className="col-span-2 text-right">Renews</div>
      </div>
      {MOCEAN_ACTIVE_PRODUCTS.map((a) => (
        <div
          key={a.id}
          className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 md:grid-cols-12 md:gap-4"
          style={{ borderColor: BORDER }}
        >
          <div className="md:col-span-4">
            <p className="text-sm font-medium text-white">{a.name}</p>
            <p className="text-xs text-[#6c8696]">{a.category}</p>
          </div>
          <div className="md:col-span-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs"
              style={
                a.status === "Active"
                  ? { background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }
                  : { background: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.2)" }
              }
            >
              {a.status}
            </span>
          </div>
          <div className="text-sm text-[#c2c4d1] md:col-span-2">{a.members.toLocaleString()}</div>
          <div className="text-sm text-[#c2c4d1] md:col-span-2">{a.monitorsLive}</div>
          <div className="text-sm text-[#8b97a8] md:col-span-2 md:text-right">
            <button onClick={() => onGo("monitors")} className="text-[#5ecdd1] hover:underline">
              {a.renews === "—" ? "Resume" : `Renews ${a.renews}`}
            </button>
          </div>
        </div>
      ))}
    </Card>
  );
}

function InvoicesScreen() {
  const max = Math.max(...MOCEAN_SPEND.map((s) => s.amount));
  const total = MOCEAN_INVOICES.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Monthly spend</CardTitle>
          <div className="mt-6 flex h-44 items-end gap-3">
            {MOCEAN_SPEND.map((s) => (
              <div key={s.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${(s.amount / max) * 100}%`,
                      background: "linear-gradient(180deg, #5ecdd1, #2f8f93)",
                    }}
                    title={`$${s.amount}`}
                  />
                </div>
                <span className="text-xs text-[#6c8696]">{s.month}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Summary</CardTitle>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#6c8696]">Paid this period</dt>
              <dd className="text-2xl font-bold text-white">${total.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#6c8696]">Avg / month</dt>
              <dd className="text-xl font-semibold text-white">
                ${Math.round(total / MOCEAN_INVOICES.length)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[#6c8696]">Next charge</dt>
              <dd className="text-sm text-[#c2c4d1]">Jul 1, 2023</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="!p-0">
        <div className="hidden grid-cols-12 gap-4 border-b px-5 py-3 text-xs uppercase tracking-wider text-[#6c8696] md:grid" style={{ borderColor: BORDER }}>
          <div className="col-span-3">Invoice</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-2">Items</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        {MOCEAN_INVOICES.map((inv) => (
          <div
            key={inv.id}
            className="grid grid-cols-2 items-center gap-3 border-b px-5 py-4 md:grid-cols-12 md:gap-4"
            style={{ borderColor: BORDER }}
          >
            <div className="font-mono text-sm text-white md:col-span-3">{inv.number}</div>
            <div className="text-sm text-[#8b97a8] md:col-span-3">{inv.date}</div>
            <div className="text-sm text-[#c2c4d1] md:col-span-2">{inv.items}</div>
            <div className="text-sm font-medium text-white md:col-span-2">${inv.amount}</div>
            <div className="md:col-span-2 md:text-right">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                {inv.status}
              </span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AccountScreen() {
  const b = MOCEAN_BUSINESS;
  const rows = [
    { label: "Business", value: b.name },
    { label: "Handle", value: `@${b.handle}` },
    { label: "Plan", value: b.plan },
    { label: "Discord", value: b.discord },
    { label: "Members", value: b.members.toLocaleString() },
    { label: "Member since", value: b.joined },
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardTitle>Business profile</CardTitle>
        <dl className="mt-4 divide-y" style={{ borderColor: BORDER }}>
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between py-3">
              <dt className="text-sm text-[#8b97a8]">{r.label}</dt>
              <dd className="text-sm font-medium text-white">{r.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
      <div className="space-y-5">
        <Card>
          <CardTitle>Payment method</CardTitle>
          <div
            className="mt-4 flex items-center justify-between rounded-xl border p-4"
            style={{ borderColor: BORDER, background: "rgba(23,26,35,0.5)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-12 items-center justify-center rounded-md bg-gradient-to-br from-[#5ecdd1] to-[#2f8f93] text-xs font-bold text-[#061427]">
                VISA
              </div>
              <div>
                <p className="text-sm text-white">•••• •••• •••• 4242</p>
                <p className="text-xs text-[#6c8696]">Expires 09/26</p>
              </div>
            </div>
            <button className="text-sm text-[#5ecdd1] hover:underline">Update</button>
          </div>
        </Card>
        <Card>
          <CardTitle>Billing</CardTitle>
          <p className="mt-3 text-sm text-[#8b97a8]">
            Your plan renews monthly. The next charge of{" "}
            <span className="text-white">$525</span> is scheduled for Jul 1, 2023.
          </p>
          <button
            className="mt-4 rounded-lg border px-4 py-2 text-sm text-[#5ecdd1] transition-colors hover:bg-[#0c222f]"
            style={{ borderColor: BORDER }}
          >
            Manage plan
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ----------------------------- primitives -------------------------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border p-6 ${className}`} style={{ borderColor: BORDER, background: PANEL }}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8b97a8]">{children}</h3>;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: BORDER, background: PANEL }}>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-[#6c8696]">{label}</div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  const map: Record<string, string> = {
    New: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    Update: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    Notice: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  };
  return (
    <span className={`h-fit shrink-0 rounded-full border px-2.5 py-0.5 text-xs ${map[label] ?? ""}`}>
      {label}
    </span>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      style={{ background: on ? TEAL : "#243441" }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        style={{ transform: on ? "translateX(22px)" : "translateX(4px)" }}
      />
    </button>
  );
}

/* ------------------------------- icons ----------------------------------- */

type IconName = "home" | "feed" | "bag" | "box" | "invoice" | "user" | "menu" | "search" | "link";

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
      );
    case "feed":
      return (
        <svg {...common}><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1.5" /></svg>
      );
    case "bag":
      return (
        <svg {...common}><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
      );
    case "box":
      return (
        <svg {...common}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M4 7.5 12 12l8-4.5" /><path d="M12 12v9" /></svg>
      );
    case "invoice":
      return (
        <svg {...common}><path d="M6 2h9l3 3v17H6V2Z" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>
      );
    case "user":
      return (
        <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
      );
    case "menu":
      return (
        <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      );
    case "search":
      return (
        <svg {...common} width={16} height={16}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      );
    case "link":
      return (
        <svg {...common} width={15} height={15} stroke="#8b97a8"><path d="M9 15 15 9" /><path d="M11 6.5 13 4.5a4 4 0 0 1 6 6l-2 2" /><path d="M13 17.5 11 19.5a4 4 0 0 1-6-6l2-2" /></svg>
      );
  }
}
