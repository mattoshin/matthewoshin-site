"use client";

import { useState } from "react";
import {
  VULNS,
  VULN_SEVERITY_COUNTS,
  EXPOSURE_TREND,
  PATCH_STATUS,
  TOP_VULN_ASSETS,
  type Vuln,
  type PatchStatusRow,
  type TopVulnAsset,
} from "@/data/vantage-modules-demo";
import {
  Card,
  StatCard,
  SectionHeading,
  SeverityBar,
  SeverityBadge,
  Badge,
  Button,
  Icon,
  AIBlock,
  AreaMini,
  Delta,
  DataTable,
  SegmentedTabs,
  ProgressBar,
  SEVERITY_META,
  SEVERITY_ORDER,
  cx,
  type Severity,
  type Column,
} from "../VantageKit";
import { useVantageNav } from "../nav-context";

/**
 * Vulnerabilities - the CVSS-scored remediation backlog. A KPI strip leads with
 * open-vuln count, critical+high, exploit-available, and patch compliance; a
 * two-up row pairs the severity breakdown with the 8-week exposure trend. The
 * vulns table filters by severity, and a footer surfaces patch windows and the
 * most-exposed assets. The Patch Orchestrator's staged 02:00 remediation is the
 * agentic through-line.
 */

type SevFilter = "all" | Severity;

const VULN_STATUS_TONE: Record<Vuln["status"], string> = {
  open: "var(--vnt-crit)",
  patching: "var(--vnt-primary)",
  mitigated: "var(--vnt-accent)",
  accepted: "var(--vnt-up)",
};

export default function Vulnerabilities() {
  const go = useVantageNav();
  const [filter, setFilter] = useState<SevFilter>("all");

  const openTotal = SEVERITY_ORDER.reduce((sum, s) => sum + (VULN_SEVERITY_COUNTS[s] ?? 0), 0);
  const critHigh = (VULN_SEVERITY_COUNTS.critical ?? 0) + (VULN_SEVERITY_COUNTS.high ?? 0);
  const exploited = VULNS.filter((v) => v.exploitAvailable).length;

  const exposureFirst = EXPOSURE_TREND[0];
  const exposureLast = EXPOSURE_TREND[EXPOSURE_TREND.length - 1];
  const exposureDelta = ((exposureLast - exposureFirst) / exposureFirst) * 100;

  const rows = filter === "all" ? VULNS : VULNS.filter((v) => v.severity === filter);

  const sevTabs: ReadonlyArray<{ id: SevFilter; label: string; count?: number }> = [
    { id: "all", label: "All", count: VULNS.length },
    ...SEVERITY_ORDER.filter((s) => VULNS.some((v) => v.severity === s)).map((s) => ({
      id: s,
      label: SEVERITY_META[s].label,
      count: VULNS.filter((v) => v.severity === s).length,
    })),
  ];

  const columns: ReadonlyArray<Column<Vuln>> = [
    {
      key: "cve",
      label: "CVE",
      width: "150px",
      mono: true,
      render: (r) => <span className="text-[var(--vnt-muted)]">{r.cve}</span>,
    },
    {
      key: "title",
      label: "Vulnerability",
      render: (r) => (
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-medium text-[var(--vnt-ink)]">{r.title}</span>
          {r.exploitAvailable && (
            <Badge tone="crit">
              <Icon name="skull" size={9} /> Exploit
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "cvss",
      label: "CVSS",
      width: "72px",
      align: "right",
      mono: true,
      render: (r) => (
        <span style={{ color: SEVERITY_META[r.severity].color }}>{r.cvss.toFixed(1)}</span>
      ),
    },
    {
      key: "severity",
      label: "Sev",
      width: "100px",
      render: (r) => <SeverityBadge level={r.severity} />,
    },
    {
      key: "asset",
      label: "Asset",
      width: "150px",
      render: (r) => <span className="font-mono text-[11px] text-[var(--vnt-ink-2)]">{r.asset}</span>,
    },
    {
      key: "ageDays",
      label: "Age",
      width: "72px",
      align: "right",
      mono: true,
      render: (r) => (
        <span className={cx(r.ageDays === 0 ? "text-[var(--vnt-crit)]" : "text-[var(--vnt-muted)]")}>
          {r.ageDays === 0 ? "today" : `${r.ageDays}d`}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "118px",
      render: (r) => (
        <span
          className="inline-flex items-center gap-1.5 text-[12px] font-medium capitalize"
          style={{ color: VULN_STATUS_TONE[r.status] }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: VULN_STATUS_TONE[r.status] }} />
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Open vulnerabilities" value={String(openTotal)} icon="bug" accent="var(--vnt-high)" hint="across the estate" />
        <StatCard label="Critical + high" value={String(critHigh)} icon="flag" accent="var(--vnt-crit)" hint="prioritize first" />
        <StatCard label="Exploit available" value={String(exploited)} icon="skull" accent="var(--vnt-crit)" hint="weaponized in the wild" />
        <StatCard label="Patch compliance" value="92%" delta={3.0} icon="shieldCheck" accent="var(--vnt-up)" hint="30-day SLA" />
      </div>

      {/* severity breakdown + exposure trend */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeading title="Open by severity" hint={`${openTotal} findings in the backlog`} />
          <SeverityBar counts={VULN_SEVERITY_COUNTS} showLegend={false} />
          <div className="mt-4 grid grid-cols-4 gap-2">
            {SEVERITY_ORDER.filter((s) => (VULN_SEVERITY_COUNTS[s] ?? 0) > 0).map((s) => (
              <div key={s} className="rounded-lg border border-[var(--vnt-border)] bg-[var(--vnt-surface-2)] p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: SEVERITY_META[s].color }} />
                  <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--vnt-faint)]">{SEVERITY_META[s].label}</span>
                </div>
                <div className="mt-1 font-mono text-[18px] font-semibold tabular-nums" style={{ color: SEVERITY_META[s].color }}>
                  {VULN_SEVERITY_COUNTS[s]}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading
            title="Exposure trend (8w)"
            hint="Total open vulnerabilities over time"
            right={
              <div className="flex items-center gap-1.5">
                <Delta value={exposureDelta} invert />
                <span className="text-[11px] text-[var(--vnt-faint)]">8 wks</span>
              </div>
            }
          />
          <AreaMini values={[...EXPOSURE_TREND]} color="var(--vnt-accent)" height={104} />
          <div className="mt-3 flex items-center justify-between border-t border-[var(--vnt-border)] pt-3 text-[11px]">
            <span className="text-[var(--vnt-muted)]">
              Down from <span className="font-mono tabular-nums text-[var(--vnt-ink-2)]">{exposureFirst}</span> to{" "}
              <span className="font-mono tabular-nums text-[var(--vnt-ink)]">{exposureLast}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[var(--vnt-accent)]">
              <Icon name="trendingDown" size={13} /> agents driving the backlog down
            </span>
          </div>
        </Card>
      </div>

      {/* agent: staged remediation */}
      <AIBlock
        tag="Remediation"
        agent="Patch Orchestrator"
        title="02:00 maintenance window staged"
        footer="3 hosts queued · auto-rollback on failed deployment · awaiting your approval"
      >
        The critical pre-auth RCE (<span className="font-mono text-[var(--vnt-ink)]">CVE-2026-3185</span>, CVSS 9.8) on the three
        internet-facing edge gateways is staged for the 02:00 window. A WAF virtual-patch rule is already live as a compensating
        control. Last night&apos;s window applied 39 of 41 staged patches; the 2 failures auto-rolled back and are re-queued for tonight.
        Exposure is down {Math.abs(Math.round(exposureDelta))}% over 8 weeks as the agents drive remediation SLAs to zero.
      </AIBlock>

      {/* vulns table */}
      <section className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <SegmentedTabs tabs={sevTabs} value={filter} onChange={setFilter} size="sm" />
          <Button variant="outline" size="sm" icon="filter">Filters</Button>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          getKey={(r) => r.cve}
          highlightRow={(r) => r.exploitAvailable && r.status === "open"}
        />
      </section>

      {/* footer: patch windows + most exposed assets */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section>
          <SectionHeading title="Patch windows" hint="Staged, applied, and failed by window." />
          <Card padded={false}>
            <ul>
              {PATCH_STATUS.map((p: PatchStatusRow) => {
                const completion = p.staged > 0 ? (p.applied / p.staged) * 100 : 0;
                return (
                  <li key={p.window} className="border-b border-[var(--vnt-border)] px-4 py-3 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--vnt-ink)]">
                        <Icon name="clock" size={13} className="text-[var(--vnt-muted)]" />
                        {p.window}
                      </span>
                      <span className="flex items-center gap-3 font-mono text-[11px] tabular-nums">
                        <span className="text-[var(--vnt-primary)]">{p.staged} staged</span>
                        <span className="text-[var(--vnt-up)]">{p.applied} applied</span>
                        <span className={p.failed > 0 ? "text-[var(--vnt-crit)]" : "text-[var(--vnt-faint)]"}>
                          {p.failed} failed
                        </span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={completion} color="var(--vnt-up)" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </section>

        <section>
          <SectionHeading
            title="Most exposed assets"
            hint="Highest open-vuln load."
            right={
              <button
                onClick={() => go("assets")}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--vnt-primary)] hover:underline"
              >
                Asset inventory <Icon name="chevron" size={13} />
              </button>
            }
          />
          <Card padded={false}>
            <ul>
              {TOP_VULN_ASSETS.map((a: TopVulnAsset) => (
                <li
                  key={a.asset}
                  className="flex items-center gap-3 border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)]"
                    style={{ color: SEVERITY_META[a.topSeverity].color }}
                  >
                    <Icon name="server" size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-[12.5px] text-[var(--vnt-ink)]">{a.asset}</div>
                    <div className="mt-0.5 text-[11px] text-[var(--vnt-faint)]">
                      <span className="font-mono tabular-nums text-[var(--vnt-ink-2)]">{a.openVulns}</span> open vuln
                      {a.openVulns > 1 ? "s" : ""}
                    </div>
                  </div>
                  <SeverityBadge level={a.topSeverity} />
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
}
