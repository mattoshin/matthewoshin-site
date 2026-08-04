"use client";

import { useState } from "react";
import { ACTIVE_COMPANY } from "@/data/fincomms-demo";
import {
  SHAREHOLDERS,
  INVESTOR_MATCH,
  OWNERSHIP_13F,
  type Shareholder,
  type Filing13F,
} from "@/data/fincomms-modules-demo";
import {
  Card,
  CompanyHeader,
  UnderlineTabs,
  AIBlock,
  Badge,
  Button,
  Delta,
  DataTable,
} from "../FcKit";
import EngineScreen from "./EngineScreen";

/**
 * InvestorIntel - the Coverage workspace for investor intelligence. Five
 * top-level tabs: Overview (holder profiling, AI-matched targets, and 13F
 * filings, unchanged), plus four EngineScreen fallbacks for the engines that
 * folded in here (Shareholder Matching, Stock Surveillance, Retail Voice,
 * Loyalty Trends). Overview's own "Match" inner tab is a distinct, bespoke
 * view and is intentionally left in place alongside the Shareholder Matching
 * engine tab.
 */
type Workspace = "overview" | "shareholder-match" | "surveillance" | "retail-voice" | "rils-trends";

const WORKSPACE_TABS = [
  { id: "overview" as const, label: "Overview" },
  { id: "shareholder-match" as const, label: "Shareholder Matching" },
  { id: "surveillance" as const, label: "Stock Surveillance" },
  { id: "retail-voice" as const, label: "Retail Voice" },
  { id: "rils-trends" as const, label: "Loyalty Trends" },
];

export default function InvestorIntel() {
  const [workspace, setWorkspace] = useState<Workspace>("overview");

  return (
    <div className="space-y-5">
      <UnderlineTabs tabs={WORKSPACE_TABS} value={workspace} onChange={setWorkspace} />
      {workspace === "overview" && <Overview />}
      {workspace === "shareholder-match" && <EngineScreen engine="shareholder-match" />}
      {workspace === "surveillance" && <EngineScreen engine="surveillance" />}
      {workspace === "retail-voice" && <EngineScreen engine="retail-voice" />}
      {workspace === "rils-trends" && <EngineScreen engine="rils-trends" />}
    </div>
  );
}

/* ------------------------------------------------------------- overview --- */

type Tab = "shareholders" | "match" | "filings";

const TABS = [
  { id: "shareholders" as const, label: "Shareholders", count: SHAREHOLDERS.length },
  { id: "match" as const, label: "Match", count: INVESTOR_MATCH.length },
  { id: "filings" as const, label: "13F Filings", count: OWNERSHIP_13F.length },
];

function Overview() {
  const [tab, setTab] = useState<Tab>("shareholders");

  return (
    <div className="space-y-5">
      <CompanyHeader company={ACTIVE_COMPANY} />
      <UnderlineTabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "shareholders" && <Shareholders />}
      {tab === "match" && <Match />}
      {tab === "filings" && <Filings />}
    </div>
  );
}

/* -------------------------------------------------------- shareholders --- */

const HOLDER_TONE: Record<Shareholder["type"], "down" | "accent" | "neutral"> = {
  Activist: "down",
  Hedge: "accent",
  Active: "neutral",
  Index: "neutral",
};

function Shareholders() {
  const [min, setMin] = useState<0 | 1 | 5>(0);
  const rows = SHAREHOLDERS.filter((s) => s.pct >= min);
  const filters: { label: string; value: 0 | 1 | 5 }[] = [
    { label: "All", value: 0 },
    { label: "1%+", value: 1 },
    { label: "5%+", value: 5 },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => setMin(f.value)}
            className={
              min === f.value
                ? "rounded-full border border-[var(--fc-accent)] bg-[var(--fc-accent-wash)] px-3 py-1 text-[12px] font-medium text-[var(--fc-accent)]"
                : "rounded-full border border-[var(--fc-border)] bg-[var(--fc-card)] px-3 py-1 text-[12px] font-medium text-[var(--fc-muted)] transition-colors hover:border-[var(--fc-border-strong)] hover:text-[var(--fc-ink)]"
            }
          >
            {f.label}
          </button>
        ))}
      </div>
      <DataTable<Shareholder>
        columns={[
          { key: "holder", label: "Holder", align: "left" },
          {
            key: "type",
            label: "Type",
            align: "left",
            render: (r) => <Badge tone={HOLDER_TONE[r.type]}>{r.type}</Badge>,
          },
          { key: "shares", label: "Shares", align: "right", mono: true },
          {
            key: "pct",
            label: "Ownership",
            align: "right",
            mono: true,
            render: (r) => `${r.pct.toFixed(1)}%`,
          },
          { key: "value", label: "Value", align: "right", mono: true },
          {
            key: "change",
            label: "Change",
            align: "right",
            render: (r) => <Delta value={r.change} />,
          },
        ]}
        rows={rows}
        getKey={(r) => r.holder}
      />
    </div>
  );
}

/* --------------------------------------------------------------- match --- */

function Match() {
  const [added, setAdded] = useState<Set<string>>(new Set());
  return (
    <div className="space-y-3">
      <AIBlock tag="Targeting">
        AI-matched investor targets for {ACTIVE_COMPANY.ticker}, ranked by fit.
      </AIBlock>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {INVESTOR_MATCH.map((m) => {
          const isAdded = added.has(m.name);
          return (
            <Card key={m.name}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[13.5px] font-semibold text-[var(--fc-ink)]">{m.name}</div>
                  <div className="mt-1"><Badge tone="neutral">{m.style}</Badge></div>
                </div>
                <span className="font-mono text-[15px] font-semibold tabular-nums text-[var(--fc-accent)]">{m.fit}</span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--fc-surface-2)]">
                  <span className="block h-full rounded-full bg-[var(--fc-accent)]" style={{ width: `${m.fit}%` }} />
                </div>
                <span className="text-[11px] text-[var(--fc-muted)]">fit</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--fc-ink-2)]">{m.thesis}</p>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  icon={isAdded ? "check" : undefined}
                  disabled={isAdded}
                  onClick={() => setAdded((s) => new Set(s).add(m.name))}
                >
                  {isAdded ? "Added to roadshow" : "Add to roadshow"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- filings --- */

function ChangeCell({ change }: { change: string }) {
  if (change === "NEW") return <Badge tone="accent">NEW</Badge>;
  const color = change.startsWith("+")
    ? "var(--fc-up)"
    : change.startsWith("-")
      ? "var(--fc-down)"
      : "var(--fc-ink-2)";
  return <span style={{ color }}>{change}</span>;
}

function Filings() {
  return (
    <DataTable<Filing13F>
      columns={[
        { key: "manager", label: "Manager", align: "left" },
        { key: "filed", label: "Filed", align: "left" },
        { key: "reportDate", label: "Report", align: "left" },
        { key: "shares", label: "Shares", align: "right", mono: true },
        {
          key: "change",
          label: "Change",
          align: "right",
          mono: true,
          render: (r) => <ChangeCell change={r.change} />,
        },
      ]}
      rows={OWNERSHIP_13F}
      getKey={(r) => r.manager}
    />
  );
}
