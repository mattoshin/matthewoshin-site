"use client";

import { useState } from "react";
import { ACTIVE_COMPANY } from "@/data/icr-demo";
import {
  EARNINGS_PREP,
  PREDICTED_QUESTIONS,
  SIMULATOR_ANALYSTS,
  SIMULATOR_TRANSCRIPT,
  POST_CALL,
  EARNINGS_CONSENSUS,
} from "@/data/icr-modules-demo";
import {
  Card,
  CompanyHeader,
  UnderlineTabs,
  SegmentedTabs,
  AIBlock,
  Badge,
  Button,
  Delta,
  Icon,
  DataTable,
  ConsensusBar,
  ProseSections,
  cx,
} from "../BeaconKit";

/**
 * EarningsHub - the flagship earnings workspace. Five tabs (Prep Brief, Predicted
 * Q&A, Live Simulator, Post-Call, Consensus). Reference screen for the AI-panel,
 * chat, and tabbed-analysis patterns the other modules reuse.
 */
type Tab = "prep" | "qa" | "sim" | "post" | "consensus";

const TABS = [
  { id: "prep" as const, label: "Prep Brief" },
  { id: "qa" as const, label: "Predicted Q&A", count: PREDICTED_QUESTIONS.length },
  { id: "sim" as const, label: "Live Simulator" },
  { id: "post" as const, label: "Post-Call" },
  { id: "consensus" as const, label: "Consensus" },
];

export default function EarningsHub() {
  const [tab, setTab] = useState<Tab>("prep");

  return (
    <div className="space-y-5">
      <CompanyHeader
        company={ACTIVE_COMPANY}
        right={<Button variant="outline" size="sm" icon="refresh">Regenerate</Button>}
      />

      <UnderlineTabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "prep" && <PrepBrief />}
      {tab === "qa" && <PredictedQA />}
      {tab === "sim" && <Simulator />}
      {tab === "post" && <PostCall />}
      {tab === "consensus" && <Consensus />}
    </div>
  );
}

/* ---------------------------------------------------------------- prep --- */

function PrepBrief() {
  return (
    <AIBlock
      title="Earnings call prep document"
      footer={
        <div className="flex items-center justify-between">
          <span>Grounded in the FY25 10-K, consensus estimates, and 4 peer transcripts.</span>
          <span className="flex items-center gap-2">
            <button className="rounded p-1 hover:bg-[var(--icr-surface-2)]"><Icon name="copy" size={14} /></button>
            <button className="rounded p-1 hover:bg-[var(--icr-surface-2)]"><Icon name="download" size={14} /></button>
          </span>
        </div>
      }
    >
      <ProseSections sections={EARNINGS_PREP} />
    </AIBlock>
  );
}

/* ------------------------------------------------------------------ qa --- */

function PredictedQA() {
  return (
    <div className="space-y-3">
      {PREDICTED_QUESTIONS.map((q, i) => (
        <Card key={i}>
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-[13.5px] font-semibold text-[var(--icr-ink)]">{q.q}</h4>
            <Badge tone="neutral">{q.category}</Badge>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--icr-ink-2)]">
            <span className="font-medium text-[var(--icr-accent)]">Suggested: </span>
            {q.answer}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] text-[var(--icr-muted)]">Confidence</span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--icr-surface-2)]">
              <span className="block h-full rounded-full bg-[var(--icr-accent)]" style={{ width: `${q.confidence}%` }} />
            </div>
            <span className="font-mono text-[11px] tabular-nums text-[var(--icr-ink-2)]">{q.confidence}%</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- sim --- */

function Simulator() {
  const [mode, setMode] = useState<"standard" | "tough">("tough");
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
      {/* config */}
      <div className="space-y-3">
        <Card>
          <p className="text-[12px] font-semibold text-[var(--icr-ink)]">Mode</p>
          <div className="mt-2">
            <SegmentedTabs
              size="sm"
              tabs={[{ id: "standard", label: "Standard" }, { id: "tough", label: "Tough" }]}
              value={mode}
              onChange={setMode}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--icr-muted)]">
            {mode === "tough" ? "Analysts press hard on guidance and decel." : "A realistic, balanced call cadence."}
          </p>
        </Card>
        <Card>
          <p className="text-[12px] font-semibold text-[var(--icr-ink)]">Analysts on the line</p>
          <ul className="mt-2 space-y-2.5">
            {SIMULATOR_ANALYSTS.map((a) => (
              <li key={a.name} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--icr-surface-2)] text-[10px] font-semibold text-[var(--icr-muted)]">
                  {a.name.split(" ").map((p) => p[0]).join("")}
                </span>
                <div className="leading-tight">
                  <div className="text-[12px] font-medium text-[var(--icr-ink)]">{a.name}</div>
                  <div className="text-[11px] text-[var(--icr-muted)]">{a.firm}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* transcript */}
      <Card padded={false} className="flex min-h-[420px] flex-col">
        <div className="flex items-center justify-between border-b border-[var(--icr-border)] px-4 py-2.5">
          <span className="flex items-center gap-2 text-[12px] font-semibold text-[var(--icr-ink)]">
            <Badge tone="down" dot>Live call</Badge> Q2 FY26 simulation
          </span>
          <Button variant="outline" size="sm" icon="close">End call</Button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {SIMULATOR_TRANSCRIPT.map((t, i) => (
            <div key={i} className={cx("flex", t.role === "ir" ? "justify-end" : "justify-start")}>
              <div className={cx("max-w-[80%] rounded-[10px] px-3 py-2", t.role === "ir" ? "bg-[var(--icr-accent-wash)]" : "border border-[var(--icr-border)] bg-[var(--icr-card)]")}>
                <div className={cx("mb-0.5 text-[10px] font-semibold uppercase tracking-wide", t.role === "ir" ? "text-[var(--icr-accent)]" : "text-[var(--icr-muted)]")}>{t.name}</div>
                <p className="text-[13px] leading-relaxed text-[var(--icr-ink-2)]">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-[var(--icr-border)] p-3">
          <input disabled placeholder="Type your response as CFO..." className="flex-1 rounded-lg border border-[var(--icr-border)] bg-[var(--icr-bg)] px-3 py-2 text-[13px] text-[var(--icr-muted)] placeholder:text-[var(--icr-faint)] focus:outline-none" />
          <Button variant="accent" size="sm" icon="send">Send</Button>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- post --- */

function PostCall() {
  return (
    <div className="space-y-4">
      <AIBlock title="Post-call analysis" footer={POST_CALL.reaction}>
        {POST_CALL.summary}
      </AIBlock>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {POST_CALL.metrics.map((m) => (
          <Card key={m.label}>
            <div className="text-[11px] font-medium uppercase tracking-wide text-[var(--icr-faint)]">{m.label}</div>
            <div className="mt-1 font-mono text-[18px] font-semibold tabular-nums text-[var(--icr-ink)]">{m.actual}</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[var(--icr-muted)]">
              est {m.est} {m.beat && <Badge tone="up">Beat</Badge>}
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <p className="text-[12px] font-semibold text-[var(--icr-ink)]">Recommended follow-ups</p>
        <ul className="mt-2 space-y-2">
          {POST_CALL.followUps.map((f, i) => (
            <li key={i} className="flex gap-2 text-[13px] text-[var(--icr-ink-2)]">
              <Icon name="check" size={15} className="mt-0.5 shrink-0 text-[var(--icr-accent)]" /> {f}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------- consensus --- */

function Consensus() {
  const c = EARNINGS_CONSENSUS;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[12px] font-semibold text-[var(--icr-ink)]">Analyst rating</p>
          <div className="mt-3"><ConsensusBar buy={c.rating.buy} hold={c.rating.hold} sell={c.rating.sell} /></div>
        </Card>
        <Card>
          <p className="text-[12px] font-semibold text-[var(--icr-ink)]">Price target</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-[22px] font-semibold tabular-nums text-[var(--icr-ink)]">${c.priceTarget.avg}</span>
            <span className="text-[11px] text-[var(--icr-muted)]">avg</span>
            <span className="ml-auto"><Delta value={((c.priceTarget.avg - c.priceTarget.current) / c.priceTarget.current) * 100} /></span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--icr-muted)]">
            <span>Low <span className="font-mono text-[var(--icr-ink-2)]">${c.priceTarget.low}</span></span>
            <span>High <span className="font-mono text-[var(--icr-ink-2)]">${c.priceTarget.high}</span></span>
            <span>Now <span className="font-mono text-[var(--icr-ink-2)]">${c.priceTarget.current}</span></span>
          </div>
        </Card>
      </div>
      <DataTable
        columns={[
          { key: "metric", label: "Metric", align: "left" },
          { key: "estimate", label: "Consensus est.", align: "right", mono: true },
          { key: "priorYear", label: "Prior year", align: "right", mono: true },
          { key: "yoy", label: "YoY", align: "right", render: (r) => <Delta value={r.yoy as number} /> },
        ]}
        rows={c.rows}
        getKey={(r) => r.metric as string}
      />
    </div>
  );
}
