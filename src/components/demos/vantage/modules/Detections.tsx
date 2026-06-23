"use client";

import {
  DETECTION_RULES,
  ALERT_VOLUME,
  ALERT_DISPOSITION,
  TOP_SIGNALS,
  TUNING_SUGGESTIONS,
  type DetectionRule,
} from "@/data/vantage-modules-demo";
import {
  Card,
  StatCard,
  SectionHeading,
  SeverityBadge,
  Badge,
  Button,
  Icon,
  AIBlock,
  Delta,
  BarMini,
  Donut,
  DataTable,
  ProgressBar,
  type Column,
} from "../VantageKit";

/**
 * Detections - the SIEM detection-engineering surface. A KPI strip leads with
 * rule and alert health, then a paired alert-volume chart and disposition donut,
 * a top-signals breakdown, the full detection-rule table, and a set of agent
 * tuning suggestions that the Triage Agent proposes to kill noise automatically.
 */

const RULE_STATUS_TONE: Record<DetectionRule["status"], string> = {
  enabled: "var(--vnt-up)",
  tuning: "var(--vnt-warn)",
  disabled: "var(--vnt-faint)",
};

export default function Detections() {
  const enabledCount = DETECTION_RULES.filter((r) => r.status === "enabled").length;
  const alerts24h = ALERT_VOLUME.reduce((sum, b) => sum + b.value, 0);

  const dispositionTotal = ALERT_DISPOSITION.reduce((sum, s) => sum + s.value, 0) || 1;
  const autoClosed = ALERT_DISPOSITION.find((s) => s.label === "Auto-closed by agents")?.value ?? 0;
  const autoClosedPct = Math.round((autoClosed / dispositionTotal) * 100);

  const avgTpr = Math.round(
    (DETECTION_RULES.reduce((sum, r) => sum + r.truePositiveRate, 0) / DETECTION_RULES.length) * 100,
  );

  const columns: ReadonlyArray<Column<DetectionRule>> = [
    {
      key: "name",
      label: "Rule",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-[var(--vnt-ink)]">{r.name}</div>
          <div className="mt-0.5 font-mono text-[10px] text-[var(--vnt-faint)]">{r.id}</div>
        </div>
      ),
    },
    {
      key: "tactic",
      label: "Tactic",
      width: "150px",
      render: (r) => <span className="text-[12px] text-[var(--vnt-muted)]">{r.tactic}</span>,
    },
    {
      key: "source",
      label: "Source",
      width: "84px",
      render: (r) => (
        <span className="rounded-md border border-[var(--vnt-border)] bg-[var(--vnt-surface-2)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--vnt-ink-2)]">
          {r.source}
        </span>
      ),
    },
    { key: "severity", label: "Sev", width: "92px", render: (r) => <SeverityBadge level={r.severity} /> },
    {
      key: "status",
      label: "Status",
      width: "108px",
      render: (r) => (
        <span
          className="inline-flex items-center gap-1.5 text-[12px] font-medium capitalize"
          style={{ color: RULE_STATUS_TONE[r.status] }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: RULE_STATUS_TONE[r.status] }} />
          {r.status}
        </span>
      ),
    },
    {
      key: "fires24h",
      label: "Fires 24h",
      width: "96px",
      align: "right",
      mono: true,
      render: (r) => <span className="text-[var(--vnt-ink)]">{r.fires24h}</span>,
    },
    {
      key: "truePositiveRate",
      label: "TPR",
      width: "112px",
      align: "right",
      render: (r) => {
        const pct = Math.round(r.truePositiveRate * 100);
        return (
          <div className="ml-auto flex w-[88px] items-center gap-2">
            <ProgressBar
              value={pct}
              color={pct >= 75 ? "var(--vnt-up)" : pct >= 50 ? "var(--vnt-warn)" : "var(--vnt-crit)"}
            />
            <span className="w-9 shrink-0 text-right font-mono text-[12px] tabular-nums text-[var(--vnt-ink-2)]">
              {pct}%
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Enabled rules" value={String(enabledCount)} icon="radar" accent="var(--vnt-primary)" hint={`of ${DETECTION_RULES.length} detections`} />
        <StatCard label="Alerts (24h)" value={alerts24h.toLocaleString()} icon="bell" accent="var(--vnt-high)" hint="across all sources" />
        <StatCard label="Auto-closed" value={`${autoClosedPct}%`} icon="robot" accent="var(--vnt-up)" hint="by agents, no human" />
        <StatCard label="Avg true-positive" value={`${avgTpr}%`} icon="crosshair" accent="var(--vnt-accent)" hint="rule precision" />
      </div>

      {/* alert volume + disposition */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Card>
          <SectionHeading
            title="Alert volume (7d)"
            hint="Daily alert count across every detection source."
            right={<Badge tone="neutral">{alerts24h.toLocaleString()} total</Badge>}
          />
          <div className="mt-1">
            <BarMini bars={ALERT_VOLUME} height={150} />
          </div>
        </Card>

        <Card>
          <SectionHeading title="Disposition" hint="Where this week's alerts ended up." />
          <div className="flex items-center gap-5">
            <Donut
              segments={ALERT_DISPOSITION}
              centerLabel={`${autoClosedPct}%`}
              centerSub="auto"
            />
            <ul className="min-w-0 flex-1 space-y-2.5">
              {ALERT_DISPOSITION.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="min-w-0 flex-1 truncate text-[12px] text-[var(--vnt-muted)]">{s.label}</span>
                  <span className="shrink-0 font-mono text-[12px] tabular-nums text-[var(--vnt-ink-2)]">{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* top signals */}
      <section>
        <SectionHeading title="Top signals" hint="Highest-volume detections over the last 24h." />
        <Card padded={false}>
          <ul>
            {TOP_SIGNALS.map((s) => (
              <li
                key={s.signal}
                className="flex items-center gap-3 border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)] text-[var(--vnt-muted)]">
                  <Icon name="radar" size={14} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--vnt-ink-2)]">{s.signal}</span>
                <span className="shrink-0 font-mono text-[13px] tabular-nums text-[var(--vnt-ink)]">{s.count}</span>
                <span className="w-16 shrink-0 text-right">
                  <Delta value={s.trend} invert />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* detection rules table */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <SectionHeading title="Detection rules" hint="The active rule library, with fire counts and precision." />
          <Button variant="outline" size="sm" icon="plus">New rule</Button>
        </div>
        <DataTable columns={columns} rows={DETECTION_RULES} getKey={(r) => r.id} />
      </section>

      {/* agent tuning suggestions */}
      <section>
        <SectionHeading
          title="Agent tuning suggestions"
          hint="The Triage Agent proposes precision fixes to cut noise automatically."
          right={<Badge tone="lime" dot>{TUNING_SUGGESTIONS.length} pending</Badge>}
        />
        <div className="space-y-3">
          {TUNING_SUGGESTIONS.map((t) => (
            <AIBlock
              key={t.rule}
              tag="Tuning"
              agent="Triage Agent"
              footer="Proposed automatically · apply to take effect on the next evaluation cycle"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] font-semibold text-[var(--vnt-ink)]">{t.rule}</span>
                <Badge tone="lime">
                  <Icon name="trendingDown" size={11} /> {t.impact}
                </Badge>
              </div>
              <p className="mt-1.5">{t.suggestion}</p>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="lime" size="sm" icon="check">Apply tuning</Button>
                <Button variant="ghost" size="sm" icon="close">Dismiss</Button>
              </div>
            </AIBlock>
          ))}
        </div>
      </section>
    </div>
  );
}
