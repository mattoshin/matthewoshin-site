"use client";

import { useState } from "react";
import {
  INSIDER_TXNS,
  OWNERSHIP_MOVES,
  ACTIVISM_SIGNALS,
  type InsiderTxn,
  type OwnershipMove,
  type ActivismSignal,
} from "@/data/sec-modules-demo";
import {
  Card,
  Badge,
  Delta,
  DataTable,
  SegmentedTabs,
  AIBlock,
  SectionHeading,
  type Column,
} from "../SecKit";

/**
 * SecInsider - the ownership surveillance module. Three segmented views over the
 * same book: insider transactions (Form 4), institutional ownership moves (13F),
 * and activist campaigns (13D). Each panel opens with an AI signal call-out, then
 * a dense terminal table or campaign grid. The marquee read is the Cambria (CMBK)
 * cluster, where three insiders including the CEO bought inside 24 hours.
 */
type Tab = "insider" | "ownership" | "activism";

const TABS = [
  { id: "insider" as const, label: "Insider (Form 4)", count: INSIDER_TXNS.length },
  { id: "ownership" as const, label: "Ownership (13F)", count: OWNERSHIP_MOVES.length },
  { id: "activism" as const, label: "Activism (13D)", count: ACTIVISM_SIGNALS.length },
];

export default function SecInsider() {
  const [tab, setTab] = useState<Tab>("insider");

  return (
    <div className="space-y-7">
      <SectionHeading
        title="Ownership surveillance"
        hint="Form 4 insider flow, 13F institutional rotation, and 13D activist campaigns across your book."
        right={<SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />}
      />
      {tab === "insider" && <InsiderPanel />}
      {tab === "ownership" && <OwnershipPanel />}
      {tab === "activism" && <ActivismPanel />}
    </div>
  );
}

/* ----------------------------------------------------------------- insider --- */

const INSIDER_COLUMNS: ReadonlyArray<Column<InsiderTxn>> = [
  {
    key: "ticker",
    label: "Ticker",
    mono: true,
    render: (r) => <span className="font-semibold text-[var(--sec-accent)]">{r.ticker}</span>,
  },
  {
    key: "insider",
    label: "Insider",
    render: (r) => <span className="font-medium text-[var(--sec-ink)]">{r.insider}</span>,
  },
  { key: "role", label: "Role" },
  {
    key: "action",
    label: "Action",
    render: (r) => <Badge tone={r.action === "Buy" ? "up" : "down"}>{r.action}</Badge>,
  },
  { key: "shares", label: "Shares", align: "right", mono: true },
  { key: "value", label: "Value", align: "right", mono: true },
  {
    key: "price",
    label: "Price",
    align: "right",
    mono: true,
    render: (r) => <span>${r.price.toFixed(2)}</span>,
  },
  { key: "plan", label: "Plan" },
  {
    key: "filedAt",
    label: "Filed",
    align: "right",
    mono: true,
    render: (r) => <span className="text-[var(--sec-faint)]">{r.filedAt}</span>,
  },
];

function InsiderPanel() {
  return (
    <div className="space-y-5">
      <AIBlock
        tag="Signal"
        title="Cluster buy on Cambria (CMBK)"
        footer="Three Form 4 open-market buys inside 24h, all coded P. Constructive ownership signal on an income-mandate holding."
      >
        Three insiders, including CEO R. Calloway, bought Cambria Bancorp on the open
        market within the last 24 hours, totaling roughly $1.0M. Calloway&apos;s 12,000
        share purchase is the largest CEO buy in two years, and two independent
        directors added in the same window. Cluster buying after a 9% drawdown reads
        as conviction, not routine, and lands directly on the Brennan Trust income
        mandate and Continental Pension.
      </AIBlock>
      <DataTable<InsiderTxn>
        columns={INSIDER_COLUMNS}
        rows={INSIDER_TXNS}
        getKey={(r) => r.id}
        highlightRow={(r) => r.ticker === "CMBK"}
        dense
      />
    </div>
  );
}

/* --------------------------------------------------------------- ownership --- */

const OWNERSHIP_COLUMNS: ReadonlyArray<Column<OwnershipMove>> = [
  {
    key: "institution",
    label: "Institution",
    render: (r) => <span className="font-medium text-[var(--sec-ink)]">{r.institution}</span>,
  },
  {
    key: "ticker",
    label: "Ticker",
    mono: true,
    render: (r) => <span className="font-semibold text-[var(--sec-accent)]">{r.ticker}</span>,
  },
  {
    key: "action",
    label: "Action",
    render: (r) => (
      <Badge tone={r.action === "New" || r.action === "Add" ? "up" : "down"}>{r.action}</Badge>
    ),
  },
  { key: "shares", label: "Shares", align: "right", mono: true },
  {
    key: "changePct",
    label: "Change",
    align: "right",
    render: (r) => <Delta value={r.changePct} suffix="%" />,
  },
  { key: "value", label: "Value", align: "right", mono: true },
  { key: "quarter", label: "Quarter" },
];

function OwnershipPanel() {
  return (
    <div className="space-y-4">
      <p className="text-[13px] text-[var(--sec-muted)]">
        Quarterly 13F rotation across your watchlist. New positions and adds in green,
        trims and exits in red. Meridian&apos;s new ATLX stake is the activist 13D crossing
        the 5% threshold.
      </p>
      <DataTable<OwnershipMove>
        columns={OWNERSHIP_COLUMNS}
        rows={OWNERSHIP_MOVES}
        getKey={(r) => r.id}
        dense
      />
    </div>
  );
}

/* ---------------------------------------------------------------- activism --- */

function ActivismPanel() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIVISM_SIGNALS.map((s: ActivismSignal) => (
          <Card key={s.ticker}>
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-base font-semibold text-[var(--sec-accent)]">
                {s.ticker}
              </span>
              <Badge
                tone={
                  s.intensity === "Campaign"
                    ? "down"
                    : s.intensity === "Engaging"
                      ? "warn"
                      : "neutral"
                }
                dot={s.intensity === "Campaign"}
              >
                {s.intensity}
              </Badge>
            </div>
            <div className="mt-2 text-[13px] font-medium text-[var(--sec-ink)]">{s.fund}</div>
            <div className="mt-4 font-mono text-[30px] font-semibold leading-none tracking-tight tabular-nums text-[var(--sec-ink)]">
              {s.stakePct.toFixed(1)}%
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-[var(--sec-faint)]">
              Disclosed stake
            </div>
            <div className="mt-4 border-t border-[var(--sec-border)] pt-3 text-[12.5px] leading-relaxed text-[var(--sec-muted)]">
              <span className="font-medium text-[var(--sec-ink-2)]">Ask:</span> {s.ask}
            </div>
          </Card>
        ))}
      </div>
      <AIBlock
        tag="Signal"
        title="Governance is the live story on Atlas (ATLX)"
        footer="Cross-referenced: 13D activist filing plus an 8-K Item 5.02 on the same name."
      >
        Meridian Partners&apos; 5.4% 13D stake, pressing for a buyback and board refresh,
        now sits alongside today&apos;s abrupt CFO transition 8-K, filed four days before
        the 10-Q with no named successor. Two governance flags on one name inside 48
        hours makes Atlas the priority client call: Harborview is most exposed at an
        11% weight, with Maple Ridge and Aster also holding.
      </AIBlock>
    </div>
  );
}
