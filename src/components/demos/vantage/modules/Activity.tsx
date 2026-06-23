"use client";

import { useMemo, useState } from "react";
import { ACTIVITY_EVENTS, type ActivityEvent } from "@/data/vantage-modules-demo";
import {
  Card,
  StatCard,
  MetricTile,
  SectionHeading,
  SeverityBadge,
  ActivityRow,
  Chip,
  Badge,
  Icon,
  cx,
} from "../VantageKit";

/**
 * Activity - the Live Activity feed: a real-time stream of detections, autonomous
 * agent actions, auth events, config changes, asset discovery, and threat intel.
 * A summary strip headlines today's volume, the agent-handled share, and the
 * machine-vs-human split (all derived once from ACTIVITY_EVENTS). A kind filter
 * scopes the feed; agent-kind rows read as autonomous actions with a live dot.
 */

type KindFilter = "all" | ActivityEvent["kind"];

const KIND_FILTERS: ReadonlyArray<{ id: KindFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "detection", label: "Detections" },
  { id: "agent", label: "Agent" },
  { id: "auth", label: "Auth" },
  { id: "config", label: "Config" },
  { id: "asset", label: "Assets" },
  { id: "intel", label: "Intel" },
];

export default function Activity() {
  const [kind, setKind] = useState<KindFilter>("all");

  // Derived once, deterministically, from the frozen ACTIVITY_EVENTS array.
  const stats = useMemo(() => {
    const total = ACTIVITY_EVENTS.length;
    const byAgentKind = ACTIVITY_EVENTS.filter((e) => e.kind === "agent").length;
    const agentActor = ACTIVITY_EVENTS.filter((e) => e.actor === "agent").length;
    const sensorActor = ACTIVITY_EVENTS.filter(
      (e) => e.actor === "sensor" || e.actor === "scanner",
    ).length;
    const autoPct = Math.round((byAgentKind / total) * 100);
    const counts: Record<KindFilter, number> = {
      all: total,
      detection: ACTIVITY_EVENTS.filter((e) => e.kind === "detection").length,
      agent: byAgentKind,
      auth: ACTIVITY_EVENTS.filter((e) => e.kind === "auth").length,
      config: ACTIVITY_EVENTS.filter((e) => e.kind === "config").length,
      asset: ACTIVITY_EVENTS.filter((e) => e.kind === "asset").length,
      intel: ACTIVITY_EVENTS.filter((e) => e.kind === "intel").length,
    };
    return { total, byAgentKind, agentActor, sensorActor, autoPct, counts };
  }, []);

  const rows = kind === "all" ? ACTIVITY_EVENTS : ACTIVITY_EVENTS.filter((e) => e.kind === kind);

  return (
    <div className="space-y-6">
      {/* summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Events today"
          value="1,284"
          icon="activity"
          accent="var(--vnt-primary)"
          hint="across all sources"
          spark={[42, 58, 51, 73, 66, 88, 79, 94]}
        />
        <StatCard
          label="Auto-handled"
          value={`${stats.autoPct}%`}
          delta={6.0}
          icon="robot"
          accent="var(--vnt-highlight)"
          hint="by autonomous agents"
        />
        <StatCard
          label="From sensors"
          value={String(stats.sensorActor)}
          icon="radar"
          accent="var(--vnt-accent)"
          hint="EDR · network · scanners"
        />
        <StatCard
          label="Agent actions"
          value={String(stats.agentActor)}
          icon="bolt"
          accent="var(--vnt-up)"
          hint="autonomous, in-window"
        />
      </div>

      {/* source mix */}
      <section>
        <SectionHeading title="Source mix" hint="Where this window's events originated." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetricTile label="Detections" value={String(stats.counts.detection)} sub="EDR + scanners" tone="var(--vnt-crit)" />
          <MetricTile label="Agent" value={String(stats.counts.agent)} sub="autonomous" tone="var(--vnt-primary)" />
          <MetricTile label="Auth" value={String(stats.counts.auth)} sub="identity" tone="var(--vnt-high)" />
          <MetricTile label="Config" value={String(stats.counts.config)} sub="change control" />
          <MetricTile label="Asset" value={String(stats.counts.asset)} sub="discovery" />
          <MetricTile label="Intel" value={String(stats.counts.intel)} sub="feeds" tone="var(--vnt-accent)" />
        </div>
      </section>

      {/* live feed */}
      <section>
        <SectionHeading
          title="Live activity feed"
          hint="Streaming events across security and IT operations."
          right={<Badge tone="crit" dot>Live</Badge>}
        />

        {/* filter row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {KIND_FILTERS.map((f) => (
            <Chip key={f.id} active={kind === f.id} onClick={() => setKind(f.id)}>
              {f.label}
              <span className="ml-1.5 font-mono text-[10px] tabular-nums text-[var(--vnt-faint)]">
                {stats.counts[f.id]}
              </span>
            </Chip>
          ))}
        </div>

        <Card padded={false}>
          <ul>
            {rows.map((e) => {
              const isAgent = e.kind === "agent";
              return (
                <ActivityRow
                  key={e.id}
                  icon={e.icon}
                  tone={e.tone}
                  source={e.source}
                  time={e.time}
                  live={isAgent}
                >
                  <span className="inline-flex items-center gap-2">
                    {e.level && <SeverityBadge level={e.level} />}
                    <span
                      className={cx(
                        "truncate",
                        isAgent ? "text-[var(--vnt-ink)]" : "text-[var(--vnt-ink-2)]",
                      )}
                    >
                      {e.message}
                    </span>
                    {isAgent && (
                      <span className="hidden shrink-0 items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-[var(--vnt-highlight)] md:inline-flex">
                        <Icon name="sparkles" size={10} /> Autonomous
                      </span>
                    )}
                  </span>
                </ActivityRow>
              );
            })}
          </ul>
        </Card>
      </section>
    </div>
  );
}
