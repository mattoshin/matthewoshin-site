"use client";

import { useState } from "react";
import { ACTIVE_COMPANY } from "@/data/fincomms-demo";
import {
  GOVERNANCE_RISK,
  ACTIVIST_HOLDERS,
  GOVERNANCE_FILINGS,
  CONGRESS_TRADES,
  type GovFiling,
  type CongressTrade,
} from "@/data/fincomms-modules-demo";
import {
  Card,
  CompanyHeader,
  SectionHeading,
  AIBlock,
  Badge,
  DataTable,
  UnderlineTabs,
} from "../BeaconKit";

/**
 * Governance - governance & activism intelligence for the focal company. Scan
 * activism risk (AI assessment + weighted signals + activist holders), review
 * recent SEC ownership filings, and track disclosed congressional trades.
 */

type Tab = "activism" | "filings" | "congress";

type Tone = "neutral" | "accent" | "up" | "down" | "warn";

const WEIGHT_TONE: Record<string, Tone> = {
  High: "down",
  Medium: "warn",
  Low: "neutral",
};

export default function Governance() {
  const [tab, setTab] = useState<Tab>("activism");

  return (
    <div className="space-y-5">
      <CompanyHeader company={ACTIVE_COMPANY} />

      <UnderlineTabs
        tabs={[
          { id: "activism", label: "Activism Scan" },
          { id: "filings", label: "SEC Filings" },
          { id: "congress", label: "Congress Trades" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "activism" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="text-[12px] font-medium text-[var(--fc-muted)]">Risk level</span>
            <Badge tone="warn">{GOVERNANCE_RISK.level}</Badge>
          </div>

          <AIBlock title="Activism risk assessment">
            <p>{GOVERNANCE_RISK.summary}</p>
          </AIBlock>

          <Card padded={false}>
            <ul>
              {GOVERNANCE_RISK.signals.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 border-b border-[var(--fc-border)] px-4 py-3 last:border-0"
                >
                  <span className="text-[13px] text-[var(--fc-ink-2)]">{s.label}</span>
                  <Badge tone={WEIGHT_TONE[s.weight] ?? "neutral"}>{s.weight}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <section>
            <SectionHeading title="Activist holders" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ACTIVIST_HOLDERS.map((h) => (
                <Card key={h.name}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13.5px] font-semibold text-[var(--fc-ink)]">{h.name}</span>
                    <Badge tone="neutral"><span className="font-mono tabular-nums">{h.stake}</span></Badge>
                  </div>
                  <p className="mt-2 text-[12.5px] leading-snug text-[var(--fc-muted)]">{h.posture}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "filings" && (
        <DataTable<GovFiling>
          columns={[
            { key: "form", label: "Form", mono: true },
            { key: "filer", label: "Filer" },
            { key: "date", label: "Date" },
            {
              key: "type",
              label: "Type",
              render: (r) => <Badge tone={r.type === "Activist" ? "down" : "neutral"}>{r.type}</Badge>,
            },
          ]}
          rows={GOVERNANCE_FILINGS}
          getKey={(r, i) => r.form + i}
        />
      )}

      {tab === "congress" && (
        <DataTable<CongressTrade>
          columns={[
            { key: "rep", label: "Representative" },
            {
              key: "party",
              label: "Party",
              render: (r) => <Badge tone="neutral">{r.party}</Badge>,
            },
            { key: "date", label: "Date" },
            {
              key: "action",
              label: "Action",
              render: (r) => <Badge tone={r.action === "Buy" ? "up" : "down"}>{r.action}</Badge>,
            },
            { key: "amount", label: "Amount", align: "right", mono: true },
            { key: "ticker", label: "Ticker", align: "right", mono: true },
          ]}
          rows={CONGRESS_TRADES}
          getKey={(r, i) => r.rep + i}
        />
      )}
    </div>
  );
}
