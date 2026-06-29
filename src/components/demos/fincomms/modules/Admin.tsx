"use client";

import { useState } from "react";
import { LAB_FINANCE, ADMIN_USERS, ADMIN_KEYS } from "@/data/fincomms-modules-demo";
import {
  Card,
  StatCard,
  UnderlineTabs,
  Badge,
  DataTable,
  type Column,
} from "../BeaconKit";

/**
 * Admin - the Admin & Lab back office. Three tabs: Lab Finance (MRR, spend trend,
 * subscriptions), Users (roles + activity), and API Keys (masked credentials).
 */
type Tab = "finance" | "users" | "keys";

const TABS = [
  { id: "finance" as const, label: "Lab Finance" },
  { id: "users" as const, label: "Users" },
  { id: "keys" as const, label: "API Keys" },
];

const fmtUsd = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function Admin() {
  const [tab, setTab] = useState<Tab>("finance");

  return (
    <div className="space-y-5">
      <UnderlineTabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === "finance" && <LabFinance />}
      {tab === "users" && <Users />}
      {tab === "keys" && <Keys />}
    </div>
  );
}

/* -------------------------------------------------------------- lab finance --- */

type Subscription = (typeof LAB_FINANCE.subscriptions)[number];
type SpendPoint = (typeof LAB_FINANCE.spend)[number];

function LabFinance() {
  const spend = LAB_FINANCE.spend;
  const latest = spend[spend.length - 1].amount;
  const max = Math.max(...spend.map((s) => s.amount));

  const subColumns: ReadonlyArray<Column<Subscription>> = [
    { key: "name", label: "Service", render: (r) => <span className="font-medium text-[var(--fc-ink)]">{r.name}</span> },
    { key: "category", label: "Category", render: (r) => <Badge tone="neutral">{r.category}</Badge> },
    { key: "cost", label: "Cost", align: "right", mono: true },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="MRR" value={LAB_FINANCE.mrr} hint="recurring" />
        <StatCard label="Active users" value={String(LAB_FINANCE.activeUsers)} hint="this month" />
        <StatCard label="Monthly spend" value={fmtUsd(latest)} hint="Jun, all tools" />
      </div>

      <Card>
        <p className="text-[12px] font-semibold text-[var(--fc-ink)]">Monthly spend</p>
        <div className="mt-4 flex items-end gap-3" style={{ height: 140 }}>
          {spend.map((s: SpendPoint) => (
            <div key={s.month} className="flex flex-1 flex-col items-center justify-end gap-2">
              <div className="font-mono text-[10px] tabular-nums text-[var(--fc-faint)]">{(s.amount / 1000).toFixed(1)}k</div>
              <div
                title={`${s.month}: ${fmtUsd(s.amount)}`}
                className="w-full rounded-t-[4px] bg-[var(--fc-accent)] transition-opacity hover:opacity-80"
                style={{ height: `${(s.amount / max) * 100}%` }}
              />
              <div className="font-mono text-[11px] tabular-nums text-[var(--fc-muted)]">{s.month}</div>
            </div>
          ))}
        </div>
      </Card>

      <section>
        <p className="mb-3 text-[12px] font-semibold text-[var(--fc-ink)]">Subscriptions</p>
        <DataTable columns={subColumns} rows={LAB_FINANCE.subscriptions} getKey={(r) => r.name} />
      </section>
    </div>
  );
}

/* --------------------------------------------------------------------- users --- */

type AdminUser = (typeof ADMIN_USERS)[number];

const USER_COLUMNS: ReadonlyArray<Column<AdminUser>> = [
  { key: "name", label: "Name", render: (r) => <span className="font-medium text-[var(--fc-ink)]">{r.name}</span> },
  {
    key: "role",
    label: "Role",
    render: (r) => <Badge tone={r.role === "Admin" ? "accent" : "neutral"}>{r.role}</Badge>,
  },
  { key: "clients", label: "Clients", align: "right", mono: true },
  { key: "lastActive", label: "Last active" },
];

function Users() {
  return <DataTable columns={USER_COLUMNS} rows={ADMIN_USERS} getKey={(r) => r.name} />;
}

/* ------------------------------------------------------------------ api keys --- */

type ApiKey = (typeof ADMIN_KEYS)[number];

const KEY_COLUMNS: ReadonlyArray<Column<ApiKey>> = [
  { key: "service", label: "Service", render: (r) => <span className="font-medium text-[var(--fc-ink)]">{r.service}</span> },
  { key: "key", label: "Key", mono: true },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge tone={r.status === "active" ? "up" : "warn"}>{r.status}</Badge>,
  },
];

function Keys() {
  return (
    <div className="space-y-3">
      <p className="text-[12px] text-[var(--fc-muted)]">Keys are masked. Rotate from the provider console.</p>
      <DataTable columns={KEY_COLUMNS} rows={ADMIN_KEYS} getKey={(r) => r.service} />
    </div>
  );
}
