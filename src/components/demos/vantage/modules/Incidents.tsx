"use client";

import { useState } from "react";
import {
  INCIDENTS,
  INCIDENT_DETAIL,
  type Incident,
  type IncidentStatus,
} from "@/data/vantage-modules-demo";
import {
  Card,
  StatCard,
  SeverityBadge,
  Badge,
  Button,
  Icon,
  AIBlock,
  ProseSections,
  DataTable,
  SegmentedTabs,
  ProgressBar,
  cx,
  type Column,
} from "../VantageKit";

/**
 * Incidents - the AI-triaged incident queue plus a bound detail panel. The queue
 * is filterable by status; selecting a row opens the detail on the right. The
 * focal critical incident (INC-2042) carries a full agent triage, response
 * playbook, and timeline - the agentic heart of the command center. Reference
 * screen for the demo's craft.
 */

type StatusFilter = "all" | IncidentStatus;

const STATUS_TONE: Record<IncidentStatus, string> = {
  open: "var(--vnt-crit)",
  investigating: "var(--vnt-high)",
  contained: "var(--vnt-accent)",
  resolved: "var(--vnt-up)",
};

export default function Incidents() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string>(INCIDENT_DETAIL.id);

  const rows = filter === "all" ? INCIDENTS : INCIDENTS.filter((i) => i.status === filter);
  const selected = INCIDENTS.find((i) => i.id === selectedId) ?? INCIDENTS[0];

  const openCount = INCIDENTS.filter((i) => i.status !== "resolved").length;
  const critCount = INCIDENTS.filter((i) => i.severity === "critical" && i.status !== "resolved").length;
  const agentOwned = Math.round((INCIDENTS.filter((i) => i.ownerIsAgent).length / INCIDENTS.length) * 100);

  const statusTabs: ReadonlyArray<{ id: StatusFilter; label: string; count?: number }> = [
    { id: "all", label: "All", count: INCIDENTS.length },
    { id: "open", label: "Open", count: INCIDENTS.filter((i) => i.status === "open").length },
    { id: "investigating", label: "Investigating", count: INCIDENTS.filter((i) => i.status === "investigating").length },
    { id: "contained", label: "Contained", count: INCIDENTS.filter((i) => i.status === "contained").length },
    { id: "resolved", label: "Resolved", count: INCIDENTS.filter((i) => i.status === "resolved").length },
  ];

  const columns: ReadonlyArray<Column<Incident>> = [
    { key: "id", label: "ID", width: "92px", mono: true, render: (r) => <span className="text-[var(--vnt-muted)]">{r.id}</span> },
    { key: "severity", label: "Sev", width: "92px", render: (r) => <SeverityBadge level={r.severity} /> },
    {
      key: "title",
      label: "Incident",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-[var(--vnt-ink)]">{r.title}</div>
          <div className="mt-0.5 text-[11px] text-[var(--vnt-faint)]">{r.category} · {r.source} · {r.assets} asset{r.assets > 1 ? "s" : ""}</div>
        </div>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      width: "150px",
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-[12px]">
          <Icon name={r.ownerIsAgent ? "robot" : "user"} size={13} className={r.ownerIsAgent ? "text-[var(--vnt-primary)]" : "text-[var(--vnt-faint)]"} />
          <span className={r.ownerIsAgent ? "text-[var(--vnt-primary)]" : "text-[var(--vnt-ink-2)]"}>{r.owner}</span>
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "120px",
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium capitalize" style={{ color: STATUS_TONE[r.status] }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_TONE[r.status] }} />
          {r.status}
        </span>
      ),
    },
    {
      key: "sla",
      label: "SLA",
      width: "92px",
      align: "right",
      render: (r) =>
        r.status === "resolved" ? (
          <span className="font-mono text-[11px] text-[var(--vnt-faint)]">met</span>
        ) : (
          <span className={cx("font-mono text-[12px] tabular-nums", r.slaMinsLeft < 60 ? "text-[var(--vnt-crit)]" : "text-[var(--vnt-muted)]")}>
            {r.slaMinsLeft < 60 ? `${r.slaMinsLeft}m` : `${Math.round(r.slaMinsLeft / 60)}h`}
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Open incidents" value={String(openCount)} icon="alert" accent="var(--vnt-crit)" hint="across the queue" />
        <StatCard label="Critical" value={String(critCount)} icon="flag" accent="var(--vnt-crit)" hint="needs attention now" />
        <StatCard label="Agent-owned" value={`${agentOwned}%`} icon="robot" accent="var(--vnt-primary)" hint="auto-driving response" />
        <StatCard label="Mean response" value="11m" icon="clock" accent="var(--vnt-accent)" hint="agent-assisted MTTR" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_1fr]">
        {/* queue */}
        <section className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <SegmentedTabs tabs={statusTabs} value={filter} onChange={setFilter} size="sm" />
            <Button variant="outline" size="sm" icon="filter">Filters</Button>
          </div>
          <DataTable
            columns={columns}
            rows={rows}
            getKey={(r) => r.id}
            onRowClick={(r) => setSelectedId(r.id)}
            highlightRow={(r) => r.id === selectedId}
          />
        </section>

        {/* detail */}
        <section className="min-w-0">
          {selected.id === INCIDENT_DETAIL.id ? <RichDetail /> : <CompactDetail incident={selected} />}
        </section>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- rich detail --- */

function RichDetail() {
  const d = INCIDENT_DETAIL;
  return (
    <Card className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] text-[var(--vnt-muted)]">{d.id}</span>
          <SeverityBadge level={d.severity} />
          <Badge tone="crit">CVSS {d.cvss}</Badge>
        </div>
        <h3 className="mt-2 text-[16px] font-semibold tracking-tight text-[var(--vnt-ink)]">{d.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[var(--vnt-faint)]">Affected:</span>
          {d.affected.map((h) => (
            <span key={h} className="rounded-md border border-[var(--vnt-border)] bg-[var(--vnt-surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--vnt-ink-2)]">{h}</span>
          ))}
        </div>
      </div>

      {/* agent triage */}
      <AIBlock
        tag="Triage"
        agent={d.triage.agent}
        title={`${Math.round(d.triage.confidence * 100)}% confidence`}
        footer={`${d.cve} · auto-scored and enriched on detection`}
      >
        <p>{d.triage.summary}</p>
        <div className="mt-3">
          <ProseSections sections={d.triage.sections} />
        </div>
      </AIBlock>

      {/* playbook */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Icon name="layers" size={14} className="text-[var(--vnt-muted)]" />
          <span className="text-[13px] font-semibold text-[var(--vnt-ink)]">Response playbook</span>
          <span className="ml-auto font-mono text-[11px] text-[var(--vnt-faint)]">
            {d.playbook.filter((p) => p.done).length}/{d.playbook.length} done
          </span>
        </div>
        <ProgressBar value={d.playbook.filter((p) => p.done).length} max={d.playbook.length} color="var(--vnt-highlight)" />
        <ul className="mt-3 space-y-2">
          {d.playbook.map((p) => (
            <li key={p.step} className="flex items-start gap-2.5">
              <span
                className={cx("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border", p.done ? "border-transparent bg-[var(--vnt-up)] text-[#0e0f11]" : "border-[var(--vnt-border-strong)] text-transparent")}
              >
                <Icon name="check" size={10} />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cx("text-[12.5px] font-medium", p.done ? "text-[var(--vnt-ink)]" : "text-[var(--vnt-ink-2)]")}>{p.step}</span>
                  <Badge tone={p.byAgent ? "primary" : "neutral"}>
                    <Icon name={p.byAgent ? "robot" : "user"} size={9} /> {p.byAgent ? "Agent" : "Human"}
                  </Badge>
                </div>
                <div className="text-[11.5px] text-[var(--vnt-muted)]">{p.detail}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* timeline */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Icon name="clock" size={14} className="text-[var(--vnt-muted)]" />
          <span className="text-[13px] font-semibold text-[var(--vnt-ink)]">Timeline</span>
        </div>
        <ul className="space-y-2.5 border-l border-[var(--vnt-border)] pl-4">
          {d.timeline.map((t, i) => (
            <li key={i} className="relative">
              <span
                className="absolute -left-[21px] top-1 h-2 w-2 rounded-full"
                style={{ background: t.isAgent ? "var(--vnt-primary)" : "var(--vnt-faint)" }}
              />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] tabular-nums text-[var(--vnt-faint)]">{t.time}</span>
                <span className={cx("text-[11px] font-medium", t.isAgent ? "text-[var(--vnt-primary)]" : "text-[var(--vnt-ink-2)]")}>{t.actor}</span>
              </div>
              <p className="text-[12.5px] text-[var(--vnt-muted)]">{t.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--vnt-border)] pt-3">
        <Button variant="primary" size="sm" icon="check">Approve response</Button>
        <Button variant="outline" size="sm" icon="user">Reassign</Button>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------- compact detail --- */

function CompactDetail({ incident }: { incident: Incident }) {
  const kv: Array<[string, React.ReactNode]> = [
    ["Status", <span key="s" className="capitalize" style={{ color: STATUS_TONE[incident.status] }}>{incident.status}</span>],
    ["Owner", <span key="o" className="inline-flex items-center gap-1"><Icon name={incident.ownerIsAgent ? "robot" : "user"} size={12} /> {incident.owner}</span>],
    ["Source", incident.source],
    ["Category", incident.category],
    ["Affected assets", String(incident.assets)],
    ["Opened", incident.opened],
    ["SLA remaining", incident.status === "resolved" ? "met" : incident.slaMinsLeft < 60 ? `${incident.slaMinsLeft}m` : `${Math.round(incident.slaMinsLeft / 60)}h`],
  ];
  return (
    <Card className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] text-[var(--vnt-muted)]">{incident.id}</span>
          <SeverityBadge level={incident.severity} />
        </div>
        <h3 className="mt-2 text-[16px] font-semibold tracking-tight text-[var(--vnt-ink)]">{incident.title}</h3>
      </div>

      <AIBlock tag="Triage" agent="Triage Agent" footer="Auto-scored on detection">
        Scored <span className="font-semibold capitalize text-[var(--vnt-ink)]">{incident.severity}</span> and routed to{" "}
        {incident.ownerIsAgent ? "an autonomous agent" : "a human analyst"} for {incident.status === "resolved" ? "closure" : "response"}.
        {incident.ownerIsAgent ? " The agent is driving remediation within its guardrails." : " Awaiting analyst action."}
      </AIBlock>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-[var(--vnt-border)] bg-[var(--vnt-border)]">
        {kv.map(([k, v]) => (
          <div key={k} className="bg-[var(--vnt-card)] p-3">
            <div className="text-[10px] uppercase tracking-wide text-[var(--vnt-faint)]">{k}</div>
            <div className="mt-1 text-[12.5px] text-[var(--vnt-ink-2)]">{v}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--vnt-border)] pt-3">
        <Button variant="primary" size="sm" icon="play">Open investigation</Button>
        <Button variant="ghost" size="sm" icon="check">Resolve</Button>
      </div>
    </Card>
  );
}
