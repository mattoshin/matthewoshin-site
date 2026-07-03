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
  type IconName,
} from "../FcKit";

/**
 * IpoCapitalMarkets - IPO readiness scoring and an S-1 analyzer. Score the four
 * readiness areas with item-level checklists, or paste an S-1 to pressure-test it
 * for disclosure gaps and narrative consistency.
 */

type View = "readiness" | "s1";

type ReadinessStatus = (typeof IPO_READINESS)[number]["items"][number]["status"];

const STATUS_META: Record<ReadinessStatus, { icon: IconName; color: string }> = {
  ready: { icon: "check", color: "var(--fc-up)" },
  progress: { icon: "clock", color: "var(--fc-warn)" },
  gap: { icon: "alert", color: "var(--fc-down)" },
};

export default function IpoCapitalMarkets() {
  const [view, setView] = useState<View>("readiness");

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
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-[var(--fc-border)] bg-[var(--fc-bg)] px-3 py-2">
                <Icon name="search" size={14} className="shrink-0 text-[var(--fc-faint)]" />
                <input
                  disabled
                  placeholder="Search SEC EDGAR by ticker or CIK..."
                  className="w-full bg-transparent text-[13px] text-[var(--fc-muted)] placeholder:text-[var(--fc-faint)] focus:outline-none"
                />
              </div>
              <Button variant="outline" size="sm" icon="download">Load filing</Button>
              <Button variant="ink" size="sm" icon="sparkles">Analyze</Button>
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
