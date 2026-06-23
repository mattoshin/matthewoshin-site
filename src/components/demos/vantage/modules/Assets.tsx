"use client";

import { useState } from "react";
import {
  ASSETS,
  ASSET_STATUS,
  OS_DISTRIBUTION,
  TOP_RISK_ASSETS,
  type Asset,
  type RiskAsset,
} from "@/data/vantage-modules-demo";
import {
  Card,
  StatCard,
  SectionHeading,
  SeverityBadge,
  StatusPill,
  Donut,
  BarMini,
  ProgressBar,
  SegmentedTabs,
  DataTable,
  SEVERITY_META,
  Icon,
  type Column,
} from "../VantageKit";

/**
 * Assets - the Asset Inventory module. A fleet-health summary strip, a fleet-status
 * donut + a by-platform breakdown, an agent-ranked top-risk list, and the full
 * asset grid filterable by class (endpoint / server / cloud / network). Mirrors the
 * Overview/Incidents craft: stat row, section headings, Card-wrapped panels, mono
 * tabular figures, and hairline borders over heavy shadows.
 */

type TypeFilter = "all" | Asset["type"];

const TYPE_ICON: Record<Asset["type"], "cpu" | "server" | "cloud" | "network"> = {
  endpoint: "cpu",
  server: "server",
  cloud: "cloud",
  network: "network",
};

export default function Assets() {
  const [filter, setFilter] = useState<TypeFilter>("all");

  // Fleet-health rollup from the donut segments (the source of truth for counts).
  const byLabel = (label: string) => ASSET_STATUS.find((s) => s.label === label)?.value ?? 0;
  const healthy = byLabel("Healthy");
  const atRisk = byLabel("At risk");
  const offline = byLabel("Offline");
  const total = healthy + atRisk + offline;
  const healthyPct = total ? Math.round((healthy / total) * 1000) / 10 : 0;

  const rows = filter === "all" ? ASSETS : ASSETS.filter((a) => a.type === filter);

  const typeTabs: ReadonlyArray<{ id: TypeFilter; label: string; count?: number }> = [
    { id: "all", label: "All", count: ASSETS.length },
    { id: "endpoint", label: "Endpoints", count: ASSETS.filter((a) => a.type === "endpoint").length },
    { id: "server", label: "Servers", count: ASSETS.filter((a) => a.type === "server").length },
    { id: "cloud", label: "Cloud", count: ASSETS.filter((a) => a.type === "cloud").length },
    { id: "network", label: "Network", count: ASSETS.filter((a) => a.type === "network").length },
  ];

  const columns: ReadonlyArray<Column<Asset>> = [
    {
      key: "hostname",
      label: "Asset",
      render: (r) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)] text-[var(--vnt-muted)]">
            <Icon name={TYPE_ICON[r.type]} size={14} />
          </span>
          <div className="min-w-0">
            <div className="truncate font-mono text-[12.5px] font-medium text-[var(--vnt-ink)]">{r.hostname}</div>
            <div className="mt-0.5 truncate text-[11px] text-[var(--vnt-faint)]">{r.os}</div>
          </div>
        </div>
      ),
    },
    { key: "owner", label: "Owner", width: "150px", render: (r) => <span className="text-[var(--vnt-ink-2)]">{r.owner}</span> },
    { key: "ip", label: "IP", width: "128px", mono: true, render: (r) => <span className="text-[var(--vnt-muted)]">{r.ip}</span> },
    { key: "status", label: "Status", width: "108px", render: (r) => <StatusPill status={r.status} live={r.status === "online"} /> },
    { key: "risk", label: "Risk", width: "104px", render: (r) => <SeverityBadge level={r.risk} /> },
    {
      key: "patchLevel",
      label: "Patch",
      width: "132px",
      render: (r) => (
        <div className="flex items-center gap-2">
          <ProgressBar
            value={r.patchLevel}
            color={r.patchLevel >= 90 ? "var(--vnt-up)" : r.patchLevel >= 75 ? "var(--vnt-warn)" : "var(--vnt-crit)"}
          />
          <span className="w-9 shrink-0 text-right font-mono text-[12px] tabular-nums text-[var(--vnt-ink-2)]">{r.patchLevel}%</span>
        </div>
      ),
    },
    {
      key: "lastSeen",
      label: "Last seen",
      width: "96px",
      align: "right",
      render: (r) => <span className="font-mono text-[11px] tabular-nums text-[var(--vnt-faint)]">{r.lastSeen}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total endpoints" value={total.toLocaleString()} icon="server" accent="var(--vnt-primary)" hint="under management" />
        <StatCard label="Healthy" value={`${healthyPct}%`} delta={1.2} icon="shieldCheck" accent="var(--vnt-up)" hint={`${healthy.toLocaleString()} assets`} />
        <StatCard label="At risk" value={atRisk.toLocaleString()} icon="alert" accent="var(--vnt-high)" hint="flagged by agents" />
        <StatCard label="Offline" value={offline.toLocaleString()} icon="power" accent="var(--vnt-crit)" hint="not reporting in" />
      </div>

      {/* fleet status + by platform */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeading title="Fleet status" hint="Reconciled across EDR, cloud, and network sources" />
          <div className="flex items-center gap-6">
            <Donut
              segments={ASSET_STATUS}
              centerLabel={`${healthyPct}%`}
              centerSub="Healthy"
            />
            <ul className="min-w-0 flex-1 space-y-2.5">
              {ASSET_STATUS.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="flex-1 truncate text-[12.5px] text-[var(--vnt-muted)]">{s.label}</span>
                  <span className="shrink-0 font-mono text-[13px] tabular-nums text-[var(--vnt-ink)]">{s.value.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <SectionHeading title="By platform" hint="Operating-system distribution across the fleet" />
          <BarMini bars={OS_DISTRIBUTION} height={132} />
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[var(--vnt-muted)]">
            {OS_DISTRIBUTION.map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.color ?? "var(--vnt-primary)" }} />
                {b.label} <span className="font-mono tabular-nums text-[var(--vnt-ink-2)]">{b.value.toLocaleString()}</span>
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* top risk assets */}
      <section>
        <SectionHeading title="Top risk assets" hint="Ranked by the asset-risk agent on exposure, exploitability, and sensitivity." />
        <Card padded={false}>
          <ul>
            {TOP_RISK_ASSETS.map((a: RiskAsset) => (
              <li
                key={a.hostname}
                className="flex items-center gap-4 border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]"
              >
                <span className="w-36 shrink-0 truncate font-mono text-[12.5px] font-medium text-[var(--vnt-ink)]">{a.hostname}</span>
                <span className="shrink-0">
                  <SeverityBadge level={a.risk} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--vnt-muted)]">{a.reason}</span>
                <div className="flex w-32 shrink-0 items-center gap-2">
                  <ProgressBar value={a.score} color={SEVERITY_META[a.risk].color} />
                  <span className="w-7 shrink-0 text-right font-mono text-[12px] font-semibold tabular-nums text-[var(--vnt-ink)]">{a.score}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* asset grid */}
      <section>
        <SectionHeading
          title="Asset inventory"
          hint="Every endpoint, server, and cloud asset, continuously reconciled."
          right={<SegmentedTabs tabs={typeTabs} value={filter} onChange={setFilter} size="sm" />}
        />
        <DataTable columns={columns} rows={rows} getKey={(r) => r.hostname} />
      </section>
    </div>
  );
}
