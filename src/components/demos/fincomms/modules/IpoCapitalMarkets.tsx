"use client";

import { useState } from "react";
import {
  IPO_STATS,
  IPO_READINESS,
  IPO_S1_FINDINGS,
} from "@/data/fincomms-modules-demo";
import {
  Card,
  StatCard,
  AIBlock,
  Button,
  Icon,
  SegmentedTabs,
  UnderlineTabs,
  type IconName,
} from "../FcKit";
import EngineScreen from "./EngineScreen";

/**
 * IpoCapitalMarkets - the Coverage workspace for IPO & capital markets. Three
 * top-level tabs: Overview (IPO readiness scoring + S-1 analyzer, unchanged),
 * Roadshow Twin, and Model Standardizer (both EngineScreen fallbacks).
 */
type Workspace = "overview" | "roadshow-twin" | "model-standardizer";

const WORKSPACE_TABS = [
  { id: "overview" as const, label: "Overview" },
  { id: "roadshow-twin" as const, label: "Roadshow Twin" },
  { id: "model-standardizer" as const, label: "Model Standardizer" },
];

export default function IpoCapitalMarkets() {
  const [workspace, setWorkspace] = useState<Workspace>("overview");

  return (
    <div className="space-y-5">
      <UnderlineTabs tabs={WORKSPACE_TABS} value={workspace} onChange={setWorkspace} />
      {workspace === "overview" && <Overview />}
      {workspace === "roadshow-twin" && <EngineScreen engine="roadshow-twin" />}
      {workspace === "model-standardizer" && <EngineScreen engine="model-standardizer" />}
    </div>
  );
}

/* ------------------------------------------------------------- overview --- */

type View = "readiness" | "s1";

type ReadinessStatus = (typeof IPO_READINESS)[number]["items"][number]["status"];

const STATUS_META: Record<ReadinessStatus, { icon: IconName; color: string }> = {
  ready: { icon: "check", color: "var(--fc-up)" },
  progress: { icon: "clock", color: "var(--fc-warn)" },
  gap: { icon: "alert", color: "var(--fc-down)" },
};

function Overview() {
  const [view, setView] = useState<View>("readiness");
  const [toast, setToast] = useState<string | null>(null);
  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--fc-accent-wash)] text-[var(--fc-accent)]">
          <Icon name="rocket" size={18} />
        </span>
        <h2 className="text-base font-semibold tracking-tight text-[var(--fc-ink)]">IPO &amp; Capital Markets</h2>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="IPOs guided" value={String(IPO_STATS.iposGuided)} />
        <StatCard label="Capital raised" value={IPO_STATS.capitalRaised} />
        <StatCard label="Active mandates" value={String(IPO_STATS.activeMissions)} />
        <StatCard label="Success rate" value={IPO_STATS.successRate} />
      </div>

      <SegmentedTabs
        tabs={[
          { id: "readiness", label: "Readiness" },
          { id: "s1", label: "S-1 Analyzer" },
        ]}
        value={view}
        onChange={setView}
      />

      {view === "readiness" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {IPO_READINESS.map((g) => (
            <Card key={g.area}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[13.5px] font-semibold text-[var(--fc-ink)]">{g.area}</h3>
                <span className="font-mono text-[13px] font-semibold tabular-nums text-[var(--fc-ink)]">{g.score}</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--fc-surface-2)]">
                <span
                  className="block h-full rounded-full bg-[var(--fc-accent)]"
                  style={{ width: `${g.score}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((item) => {
                  const meta = STATUS_META[item.status];
                  return (
                    <li key={item.label} className="flex items-start gap-2 text-[13px] text-[var(--fc-ink-2)]">
                      <span className="mt-0.5 shrink-0" style={{ color: meta.color }}>
                        <Icon name={meta.icon} size={15} />
                      </span>
                      <span>{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {view === "s1" && (
        <div className="space-y-4">
          <Card>
            <label className="text-[12px] font-semibold text-[var(--fc-ink)]">S-1 document</label>
            <textarea
              disabled
              placeholder="Paste S-1 content..."
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-[var(--fc-border)] bg-[var(--fc-bg)] px-3 py-2 text-[13px] leading-relaxed text-[var(--fc-muted)] placeholder:text-[var(--fc-faint)] focus:outline-none"
            />
            <div className="relative mt-3 flex flex-wrap items-center gap-2">
              <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-[var(--fc-border)] bg-[var(--fc-bg)] px-3 py-2">
                <Icon name="search" size={14} className="shrink-0 text-[var(--fc-faint)]" />
                <input
                  disabled
                  placeholder="Search SEC EDGAR by ticker or CIK..."
                  className="w-full bg-transparent text-[13px] text-[var(--fc-muted)] placeholder:text-[var(--fc-faint)] focus:outline-none"
                />
              </div>
              <Button variant="outline" size="sm" icon="download" onClick={() => flash("Load filing — sample data only")}>
                Load filing
              </Button>
              <Button variant="ink" size="sm" icon="sparkles" onClick={() => flash("Re-analyzed — sample data only")}>
                Analyze
              </Button>
              {toast && (
                <span className="absolute right-0 top-full z-10 mt-1.5 whitespace-nowrap rounded-md border border-[var(--fc-border)] bg-[var(--fc-ink)] px-2.5 py-1 text-[11px] font-medium text-white shadow-sm">
                  {toast}
                </span>
              )}
            </div>
          </Card>

          <AIBlock title="S-1 analysis" footer="Benchmarked against recent software-comp registration statements.">
            <p>
              The draft registration reads well overall, with two disclosure gaps reviewers are likely to flag. Strengths
              and gaps below, in order of priority.
            </p>
            <ul className="mt-3 space-y-2.5">
              {IPO_S1_FINDINGS.map((f, i) => {
                const isStrength = f.kind === "strength";
                return (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--fc-ink-2)]">
                    <span
                      className="mt-0.5 shrink-0"
                      style={{ color: isStrength ? "var(--fc-up)" : "var(--fc-down)" }}
                    >
                      <Icon name={isStrength ? "check" : "alert"} size={15} />
                    </span>
                    <span>{f.text}</span>
                  </li>
                );
              })}
            </ul>
          </AIBlock>
        </div>
      )}
    </div>
  );
}
