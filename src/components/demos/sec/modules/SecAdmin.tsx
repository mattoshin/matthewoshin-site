"use client";

import { useState } from "react";
import {
  DATA_SOURCES,
  ADMIN_USERS,
  API_KEYS,
  AI_SPEND,
  SPEND_TREND,
  type DataSource,
  type AdminUser,
  type ApiKey,
  type SpendRow,
} from "@/data/sec-modules-demo";
import {
  Card,
  Button,
  Badge,
  Icon,
  SegmentedTabs,
  SectionHeading,
  DataTable,
  type Column,
} from "../SecKit";

/**
 * SecAdmin - the back office for the SEC Intelligence terminal. Three tabs:
 * Data & channels (every ingest source and delivery channel as connectable
 * cards), Team (operators plus the API keys and agents that power delivery), and
 * AI spend (a monthly spend bar chart and a per-model cost ledger). Matches the
 * dark --sec-* terminal craft of SecDashboard.
 */
type Tab = "sources" | "team" | "spend";

const TABS = [
  { id: "sources" as const, label: "Data & channels" },
  { id: "team" as const, label: "Team" },
  { id: "spend" as const, label: "AI spend" },
];

export default function SecAdmin() {
  const [tab, setTab] = useState<Tab>("sources");

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between gap-4">
        <SectionHeading
          title="Admin"
          hint="Connect data sources, manage your team and agents, and watch AI spend."
        />
        <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      </div>

      {tab === "sources" && <Sources />}
      {tab === "team" && <Team />}
      {tab === "spend" && <Spend />}
    </div>
  );
}

/* ------------------------------------------------------------ data & channels --- */

function Sources() {
  const connected = DATA_SOURCES.filter((s) => s.status === "connected").length;
  return (
    <section className="space-y-6">
      <SectionHeading
        title="Data sources & delivery channels"
        hint="Filing, market, macro, and media feeds in. Email, SMS, voice, and agent webhooks out."
        right={
          <Badge tone="up" dot>
            {connected} connected
          </Badge>
        }
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DATA_SOURCES.map((s: DataSource) => (
          <Card key={s.name} hover className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[13px] font-semibold leading-snug text-[var(--sec-ink)]">{s.name}</span>
              <Badge tone="neutral">{s.kind}</Badge>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--sec-faint)]">{s.category}</p>
            <p className="text-[12.5px] leading-relaxed text-[var(--sec-muted)]">{s.blurb}</p>
            <div className="mt-auto pt-1">
              {s.status === "connected" ? (
                <Badge tone="up" dot>
                  Connected
                </Badge>
              ) : (
                <Badge tone="neutral">Available</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- team --- */

const USER_COLUMNS: ReadonlyArray<Column<AdminUser>> = [
  {
    key: "name",
    label: "Name",
    render: (r: AdminUser) => <span className="font-medium text-[var(--sec-ink)]">{r.name}</span>,
  },
  {
    key: "email",
    label: "Email",
    mono: true,
    render: (r: AdminUser) => <span className="text-[var(--sec-muted)]">{r.email}</span>,
  },
  {
    key: "role",
    label: "Role",
    render: (r: AdminUser) => <Badge tone="accent">{r.role}</Badge>,
  },
  { key: "lastActive", label: "Last active" },
];

function Team() {
  return (
    <section className="space-y-7">
      <div>
        <SectionHeading title="Team" hint="Operators with access to the terminal, plus the desk agent." />
        <DataTable columns={USER_COLUMNS} rows={ADMIN_USERS} getKey={(r: AdminUser) => r.email} />
      </div>

      <div>
        <SectionHeading
          title="API keys & agents"
          hint="The Research agent (MCP) key powers the Agent delivery channel, streaming filing events to your downstream agents."
        />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {API_KEYS.map((k: ApiKey) => (
            <Card key={k.label} className="flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-semibold leading-snug text-[var(--sec-ink)]">{k.label}</span>
                <Icon name="lock" size={15} className="shrink-0 text-[var(--sec-faint)]" />
              </div>
              <p className="font-mono text-[11px] tracking-tight text-[var(--sec-faint)]">{k.scope}</p>
              <div className="flex items-center gap-3 text-[11.5px] text-[var(--sec-muted)]">
                <span>Created {k.created}</span>
                <span className="text-[var(--sec-faint)]">·</span>
                <span>Used {k.lastUsed}</span>
              </div>
              <div className="mt-auto pt-1">
                <Button variant="ghost" size="sm" icon="copy">
                  Copy
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- spend --- */

const SPEND_COLUMNS: ReadonlyArray<Column<SpendRow>> = [
  {
    key: "model",
    label: "Model",
    render: (r: SpendRow) => <span className="font-medium text-[var(--sec-ink)]">{r.model}</span>,
  },
  { key: "calls", label: "Calls", align: "right", mono: true },
  {
    key: "spend",
    label: "Spend",
    align: "right",
    mono: true,
    render: (r: SpendRow) => `$${r.spend}`,
  },
];

function Spend() {
  const maxUsd = Math.max(...SPEND_TREND.map((p) => p.usd));
  const total = AI_SPEND.reduce((sum: number, r: SpendRow) => sum + r.spend, 0);
  const latest = SPEND_TREND[SPEND_TREND.length - 1];

  return (
    <section className="space-y-6">
      <SectionHeading
        title="AI spend"
        hint="Monthly platform spend across Claude and embeddings. All-in, including every channel."
        right={
          <span className="font-mono text-sm font-semibold tabular-nums text-[var(--sec-ink)]">
            ${latest.usd}
            <span className="ml-1.5 text-[11px] font-normal text-[var(--sec-faint)]">{latest.month}</span>
          </span>
        }
      />

      <Card>
        <p className="text-[12px] font-medium text-[var(--sec-muted)]">Monthly spend, USD</p>
        <div className="mt-4 flex items-end gap-3" style={{ height: 150 }}>
          {SPEND_TREND.map((p) => (
            <div key={p.month} className="flex flex-1 flex-col items-center justify-end gap-2 self-stretch">
              <div className="font-mono text-[10px] tabular-nums text-[var(--sec-faint)]">${p.usd}</div>
              <div className="flex w-full flex-1 items-end">
                <div
                  title={`${p.month}: $${p.usd}`}
                  className="w-full rounded-t-[4px] bg-[var(--sec-accent)] transition-opacity hover:opacity-80"
                  style={{ height: `${(p.usd / maxUsd) * 100}%` }}
                />
              </div>
              <div className="font-mono text-[11px] tabular-nums text-[var(--sec-muted)]">{p.month}</div>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <SectionHeading title="By model" hint="This month, across summarization, materiality scoring, the analyst, and RAG." />
        <DataTable columns={SPEND_COLUMNS} rows={AI_SPEND} getKey={(r: SpendRow) => r.model} />
        <div className="mt-2 flex items-center justify-end gap-3 px-3.5 text-[12px]">
          <span className="font-medium text-[var(--sec-muted)]">Total this month</span>
          <span className="font-mono text-[15px] font-semibold tabular-nums text-[var(--sec-ink)]">${total}</span>
        </div>
      </div>
    </section>
  );
}
