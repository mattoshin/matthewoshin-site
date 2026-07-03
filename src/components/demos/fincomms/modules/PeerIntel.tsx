"use client";

import { useState } from "react";
import { ACTIVE_COMPANY } from "@/data/fincomms-demo";
import { PEER_ROWS, PEER_TRANSCRIPTS, type PeerRow } from "@/data/fincomms-modules-demo";
import {
  CompanyHeader,
  SegmentedTabs,
  AIBlock,
  DataTable,
  cx,
} from "../FcKit";

/**
 * PeerIntel - benchmark the focal company against its peer set, and mine peer
 * earnings-call transcripts for positioning. Two segmented views over the header.
 */
type Tab = "comparison" | "transcripts";

const TABS = [
  { id: "comparison" as const, label: "Comparison" },
  { id: "transcripts" as const, label: "Transcripts", count: PEER_TRANSCRIPTS.length },
];

export default function PeerIntel() {
  const [tab, setTab] = useState<Tab>("comparison");

  return (
    <div className="space-y-5">
      <CompanyHeader company={ACTIVE_COMPANY} />
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "comparison" && <Comparison />}
      {tab === "transcripts" && <Transcripts />}
    </div>
  );
}

/* ---------------------------------------------------------- comparison --- */

function Comparison() {
  return (
    <div className="space-y-2">
      <DataTable<PeerRow>
        highlightRow={(r) => !!r.subject}
        columns={[
          {
            key: "ticker",
            label: "Ticker",
            align: "left",
            render: (r) => (
              <span
                className={cx(
                  "font-mono tabular-nums",
                  r.subject && "font-semibold text-[var(--fc-accent)]",
                )}
              >
                {r.ticker}
              </span>
            ),
          },
          { key: "name", label: "Company", align: "left" },
          { key: "revGrowth", label: "Rev growth", align: "right", mono: true, render: (r) => `${r.revGrowth.toFixed(1)}%` },
          { key: "grossMargin", label: "Gross margin", align: "right", mono: true, render: (r) => `${r.grossMargin.toFixed(1)}%` },
          { key: "opMargin", label: "Op margin", align: "right", mono: true, render: (r) => `${r.opMargin.toFixed(1)}%` },
          { key: "pe", label: "P/E", align: "right", mono: true, render: (r) => `${r.pe}x` },
          { key: "roe", label: "ROE", align: "right", mono: true, render: (r) => `${r.roe.toFixed(1)}%` },
        ]}
        rows={PEER_ROWS}
        getKey={(r) => r.ticker}
      />
      <p className="text-[11px] text-[var(--fc-faint)]">{ACTIVE_COMPANY.ticker} pinned as the subject company.</p>
    </div>
  );
}

/* --------------------------------------------------------- transcripts --- */

function Transcripts() {
  return (
    <div className="space-y-3">
      {PEER_TRANSCRIPTS.map((t) => (
        <AIBlock key={t.company} title={`${t.company} · ${t.quarter}`}>
          <ul className="space-y-1.5">
            {t.takeaways.map((b, j) => (
              <li key={j} className="flex gap-2">
                <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--fc-accent)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </AIBlock>
      ))}
    </div>
  );
}
