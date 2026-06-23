"use client";

import { useState } from "react";
import {
  SERVICES,
  NETWORK_SEGMENTS,
  TRAFFIC_ANOMALIES,
  ZERO_TRUST,
  type Service,
  type NetSegment,
} from "@/data/vantage-modules-demo";
import {
  Card,
  ScoreRing,
  MetricTile,
  SectionHeading,
  SeverityBadge,
  StatusPill,
  StatCard,
  DataTable,
  SegmentedTabs,
  Badge,
  AIBlock,
  Icon,
  cx,
  type Column,
  type Tone,
} from "../VantageKit";

/**
 * Network - the Network & Services module. A zero-trust posture ring beside the
 * enforcement metric tiles, a service-status board (DataTable of monitored
 * services with live status pills, uptime, latency, and region), a network-
 * segment posture panel (enforced / monitor / open tone badges with device and
 * flagged counts), and a traffic-anomaly feed. Matches the Overview / Incidents
 * craft: a top summary row, section headings, card-wrapped panels, mono tabular
 * numerics, hairline borders, and the agentic lime-bordered signature.
 */

type ServiceFilter = "all" | "issues";

/** Map a segment posture to a Vantage Badge tone (enforced -> teal, monitor ->
 *  warn, open -> crit) per the module contract. */
const POSTURE_TONE: Record<NetSegment["posture"], Tone> = {
  enforced: "teal",
  monitor: "warn",
  open: "crit",
};

const POSTURE_LABEL: Record<NetSegment["posture"], string> = {
  enforced: "Enforced",
  monitor: "Monitor",
  open: "Open",
};

export default function Network() {
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");

  const servicesOnline = SERVICES.filter((s) => s.status === "online").length;
  const servicesDegraded = SERVICES.filter((s) => s.status === "degraded").length;
  const servicesOffline = SERVICES.filter((s) => s.status === "offline").length;
  const flaggedTotal = NETWORK_SEGMENTS.reduce((a, s) => a + s.flagged, 0);

  const serviceRows =
    serviceFilter === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.status !== "online");

  const serviceTabs: ReadonlyArray<{ id: ServiceFilter; label: string; count?: number }> = [
    { id: "all", label: "All services", count: SERVICES.length },
    { id: "issues", label: "Needs attention", count: servicesDegraded + servicesOffline },
  ];

  const serviceColumns: ReadonlyArray<Column<Service>> = [
    {
      key: "name",
      label: "Service",
      render: (s) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-[var(--vnt-ink)]">{s.name}</div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-[var(--vnt-faint)]">{s.tier}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "118px",
      render: (s) => <StatusPill status={s.status} live={s.status === "online"} />,
    },
    {
      key: "uptime",
      label: "Uptime",
      width: "92px",
      align: "right",
      mono: true,
      render: (s) => (
        <span style={{ color: s.uptime >= 99.9 ? "var(--vnt-ink)" : "var(--vnt-warn)" }}>
          {s.uptime.toFixed(2)}%
        </span>
      ),
    },
    {
      key: "latency",
      label: "Latency",
      width: "92px",
      align: "right",
      mono: true,
      render: (s) => (
        <span className={cx(s.status === "offline" && "text-[var(--vnt-faint)]")}>
          {s.status === "offline" ? "—" : `${s.latencyMs}ms`}
        </span>
      ),
    },
    {
      key: "region",
      label: "Region",
      width: "96px",
      align: "right",
      mono: true,
      render: (s) => <span className="text-[var(--vnt-muted)]">{s.region}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Services online"
          value={`${servicesOnline}/${SERVICES.length}`}
          icon="server"
          accent="var(--vnt-up)"
          hint={`${servicesDegraded} degraded · ${servicesOffline} offline`}
        />
        <StatCard
          label="Zero-trust score"
          value={String(ZERO_TRUST.score)}
          icon="shieldCheck"
          accent="var(--vnt-accent)"
          hint="segmentation + MFA posture"
        />
        <StatCard
          label="Enforced segments"
          value={`${ZERO_TRUST.enforcedSegments}/${ZERO_TRUST.totalSegments}`}
          icon="layers"
          accent="var(--vnt-primary)"
          hint="under zero-trust policy"
        />
        <StatCard
          label="Flagged flows"
          value={String(flaggedTotal)}
          icon="network"
          accent="var(--vnt-warn)"
          hint="across all segments"
        />
      </div>

      {/* zero-trust posture */}
      <Card>
        <SectionHeading
          title="Zero-trust posture"
          hint="Segmentation, MFA enforcement, and microsegmentation coverage."
          right={<Badge tone="teal" dot>Enforcing</Badge>}
        />
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <div className="shrink-0">
            <ScoreRing score={ZERO_TRUST.score} label="Zero-trust" tone="var(--vnt-accent)" />
          </div>
          <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
            <MetricTile
              label="Enforced segments"
              value={`${ZERO_TRUST.enforcedSegments}/${ZERO_TRUST.totalSegments}`}
              sub="under policy"
              tone="var(--vnt-accent)"
            />
            <MetricTile
              label="MFA on admin"
              value={`${ZERO_TRUST.mfaOnAdmin}%`}
              sub="privileged access"
              tone={ZERO_TRUST.mfaOnAdmin >= 100 ? "var(--vnt-up)" : "var(--vnt-warn)"}
            />
            <MetricTile
              label="Microsegmented"
              value={`${ZERO_TRUST.microsegmented}%`}
              sub="of east-west traffic"
              tone="var(--vnt-primary)"
            />
          </div>
        </div>
        <AIBlock
          tag="Network posture"
          agent="Identity Agent"
          className="mt-5"
          footer="Recomputed continuously from segment policy + identity signals"
        >
          Zero-trust posture holds at <span className="font-semibold text-[var(--vnt-ink)]">{ZERO_TRUST.score}</span> with{" "}
          {ZERO_TRUST.enforcedSegments} of {ZERO_TRUST.totalSegments} segments under enforcement and MFA covering{" "}
          {ZERO_TRUST.mfaOnAdmin}% of admin access. The largest gap is the legacy on-prem segment, which still runs in
          open mode; microsegmentation sits at {ZERO_TRUST.microsegmented}% as that traffic is brought under policy.
        </AIBlock>
      </Card>

      {/* service status board */}
      <section className="min-w-0">
        <SectionHeading
          title="Service status"
          hint="Monitored services with live health, uptime, and latency."
          right={<SegmentedTabs tabs={serviceTabs} value={serviceFilter} onChange={setServiceFilter} size="sm" />}
        />
        <DataTable columns={serviceColumns} rows={serviceRows} getKey={(s) => s.name} dense />
      </section>

      {/* segments + anomalies */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        {/* network segments */}
        <section className="min-w-0">
          <SectionHeading
            title="Network segments"
            hint="Per-segment posture, device counts, and flagged flows."
          />
          <Card padded={false}>
            <ul>
              {NETWORK_SEGMENTS.map((seg) => (
                <li
                  key={seg.name}
                  className="flex items-center gap-3 border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)] text-[var(--vnt-muted)]">
                    <Icon name="network" size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-[var(--vnt-ink)]">{seg.name}</div>
                    <div className="mt-0.5 font-mono text-[10px] tabular-nums text-[var(--vnt-faint)]">
                      {seg.devices.toLocaleString()} devices
                    </div>
                  </div>
                  {seg.flagged > 0 && (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums text-[var(--vnt-warn)]">
                      <Icon name="flag" size={12} />
                      {seg.flagged}
                    </span>
                  )}
                  <Badge tone={POSTURE_TONE[seg.posture]} dot>
                    {POSTURE_LABEL[seg.posture]}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* traffic anomalies */}
        <section className="min-w-0">
          <SectionHeading
            title="Traffic anomalies"
            hint="Flagged east-west and egress flows."
            right={<Badge tone="warn" dot>{TRAFFIC_ANOMALIES.length} active</Badge>}
          />
          <Card padded={false}>
            <ul>
              {TRAFFIC_ANOMALIES.map((a, i) => (
                <li
                  key={i}
                  className="border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[12.5px] text-[var(--vnt-ink-2)]">{a.description}</div>
                      <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-[var(--vnt-muted)]">
                        <span className="text-[var(--vnt-ink-2)]">{a.src}</span>
                        <Icon name="chevron" size={11} className="text-[var(--vnt-faint)]" />
                        <span className="text-[var(--vnt-ink-2)]">{a.dst}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <SeverityBadge level={a.severity} />
                      <span className="font-mono text-[11px] tabular-nums text-[var(--vnt-faint)]">{a.time}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
}
