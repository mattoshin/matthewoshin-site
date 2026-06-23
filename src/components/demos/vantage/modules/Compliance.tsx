"use client";

import {
  FRAMEWORKS,
  CONTROLS,
  AUDIT_READINESS,
  EVIDENCE_FEED,
  type Framework,
  type ControlRow,
  type EvidenceItem,
} from "@/data/vantage-modules-demo";
import {
  Card,
  MetricTile,
  ScoreRing,
  ProgressBar,
  SectionHeading,
  DataTable,
  Badge,
  AIBlock,
  Icon,
  cx,
  type Column,
} from "../VantageKit";

/**
 * Compliance - the governance posture screen. An audit-readiness ring beside
 * evidence metric tiles, a per-framework readiness grid, a controls table with
 * pass/fail/partial status and agent-vs-human ownership, and an evidence feed
 * where autonomous-agent collection carries the lime "Auto" agent signature.
 */

const FRAMEWORK_STATUS: Record<
  Framework["status"],
  { tone: "up" | "warn" | "crit"; color: string; label: string }
> = {
  "audit-ready": { tone: "up", color: "var(--vnt-up)", label: "Audit-ready" },
  "in-progress": { tone: "warn", color: "var(--vnt-warn)", label: "In progress" },
  gaps: { tone: "crit", color: "var(--vnt-crit)", label: "Gaps" },
};

const CONTROL_STATUS: Record<ControlRow["status"], { color: string; label: string }> = {
  pass: { color: "var(--vnt-up)", label: "Pass" },
  fail: { color: "var(--vnt-crit)", label: "Fail" },
  partial: { color: "var(--vnt-warn)", label: "Partial" },
};

const AGENT_OWNERS = new Set(["Identity Agent", "Patch Orchestrator", "Compliance Auditor"]);

export default function Compliance() {
  const autoPct = Math.round((AUDIT_READINESS.evidenceAuto / AUDIT_READINESS.evidenceCollected) * 100);

  const columns: ReadonlyArray<Column<ControlRow>> = [
    {
      key: "id",
      label: "Control",
      width: "96px",
      mono: true,
      render: (r) => <span className="text-[var(--vnt-muted)]">{r.id}</span>,
    },
    {
      key: "name",
      label: "Requirement",
      render: (r) => <span className="font-medium text-[var(--vnt-ink)]">{r.name}</span>,
    },
    {
      key: "framework",
      label: "Framework",
      width: "120px",
      render: (r) => <span className="text-[var(--vnt-muted)]">{r.framework}</span>,
    },
    {
      key: "status",
      label: "Status",
      width: "110px",
      render: (r) => {
        const s = CONTROL_STATUS[r.status];
        return (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: s.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        );
      },
    },
    {
      key: "owner",
      label: "Owner",
      width: "162px",
      render: (r) => {
        const isAgent = AGENT_OWNERS.has(r.owner);
        return (
          <span className="inline-flex items-center gap-1.5 text-[12px]">
            <Icon
              name={isAgent ? "robot" : "user"}
              size={13}
              className={isAgent ? "text-[var(--vnt-primary)]" : "text-[var(--vnt-faint)]"}
            />
            <span className={isAgent ? "text-[var(--vnt-primary)]" : "text-[var(--vnt-ink-2)]"}>{r.owner}</span>
          </span>
        );
      },
    },
    {
      key: "evidence",
      label: "Evidence",
      width: "92px",
      align: "right",
      mono: true,
      render: (r) => <span className="text-[var(--vnt-ink-2)]">{r.evidence}</span>,
    },
  ];

  return (
    <div className="space-y-7">
      {/* readiness + evidence metrics */}
      <Card>
        <SectionHeading
          title="Audit readiness"
          hint="Continuous control evidence, mapped to frameworks by the Compliance Auditor."
          right={<Badge tone="lime" dot>Auto-evidenced</Badge>}
        />
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <ScoreRing score={AUDIT_READINESS.overall} label="Audit readiness" tone="var(--vnt-highlight)" />
          <div className="grid w-full flex-1 grid-cols-2 gap-3 lg:grid-cols-3">
            <MetricTile
              label="Evidence collected"
              value={String(AUDIT_READINESS.evidenceCollected)}
              sub="artifacts in window"
            />
            <MetricTile
              label="Auto-collected"
              value={`${autoPct}%`}
              sub={`${AUDIT_READINESS.evidenceAuto} by agents`}
              tone="var(--vnt-highlight)"
            />
            <MetricTile
              label="Open gaps"
              value={String(AUDIT_READINESS.openGaps)}
              sub="controls failing or partial"
              tone="var(--vnt-warn)"
            />
          </div>
        </div>
      </Card>

      {/* frameworks grid */}
      <section>
        <SectionHeading
          title="Frameworks"
          hint="Readiness and control coverage across every active framework."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FRAMEWORKS.map((f) => {
            const meta = FRAMEWORK_STATUS[f.status];
            return (
              <Card key={f.name} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)] text-[var(--vnt-muted)]">
                      <Icon name="clipboardCheck" size={15} />
                    </div>
                    <h3 className="mt-2.5 text-[13.5px] font-semibold tracking-tight text-[var(--vnt-ink)]">{f.name}</h3>
                  </div>
                  <Badge tone={meta.tone} dot>{meta.label}</Badge>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[11px]">
                    <span className="uppercase tracking-wide text-[var(--vnt-faint)]">Readiness</span>
                    <span className="font-mono tabular-nums" style={{ color: meta.color }}>{f.readiness}%</span>
                  </div>
                  <ProgressBar value={f.readiness} color={meta.color} />
                </div>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-mono text-[18px] font-semibold tabular-nums text-[var(--vnt-ink)]">{f.controlsPassing}</span>
                  <span className="font-mono text-[12px] tabular-nums text-[var(--vnt-faint)]">/ {f.controlsTotal} controls passing</span>
                </div>

                <div className="mt-3 flex items-center gap-1.5 border-t border-[var(--vnt-border)] pt-3 text-[11.5px] text-[var(--vnt-muted)]">
                  <Icon name="flag" size={12} className="shrink-0 text-[var(--vnt-faint)]" />
                  <span className="min-w-0 truncate">{f.nextMilestone}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* controls table */}
      <section>
        <SectionHeading
          title="Controls"
          hint="Mapped requirements, evaluated continuously, owned by an agent or a human."
        />
        <DataTable columns={columns} rows={CONTROLS} getKey={(r) => r.id} />
      </section>

      {/* evidence feed */}
      <section>
        <SectionHeading
          title="Evidence feed"
          hint="Most recent artifacts attached to controls."
          right={
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--vnt-faint)]">
              <Icon name="sparkles" size={12} className="text-[var(--vnt-highlight)]" />
              {autoPct}% auto-collected
            </span>
          }
        />
        <div className="space-y-3">
          {EVIDENCE_FEED.map((e: EvidenceItem) =>
            e.auto ? (
              <AIBlock
                key={`${e.control}-${e.artifact}`}
                tag="Auto"
                agent="Compliance Auditor"
                footer={
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[var(--vnt-muted)]">{e.control}</span>
                    <span>·</span>
                    <span>collected by {e.collectedBy}</span>
                    <span>·</span>
                    <span>{e.when}</span>
                  </span>
                }
              >
                Attached <span className="font-semibold text-[var(--vnt-ink)]">{e.artifact}</span> to control{" "}
                <span className="font-mono text-[var(--vnt-ink)]">{e.control}</span>, mapped and verified against the framework
                with no human action.
              </AIBlock>
            ) : (
              <Card
                key={`${e.control}-${e.artifact}`}
                className={cx("flex items-start gap-3 border-l-2 border-l-[var(--vnt-border-strong)]")}
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)] text-[var(--vnt-muted)]">
                  <Icon name="user" size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">Manual</Badge>
                    <span className="font-mono text-[11px] text-[var(--vnt-muted)]">{e.control}</span>
                  </div>
                  <div className="text-[13.5px] text-[var(--vnt-ink-2)]">
                    <span className="font-semibold text-[var(--vnt-ink)]">{e.artifact}</span>
                  </div>
                  <div className="mt-2 border-t border-[var(--vnt-border)] pt-2 text-[11px] text-[var(--vnt-faint)]">
                    collected by {e.collectedBy} · {e.when}
                  </div>
                </div>
              </Card>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
