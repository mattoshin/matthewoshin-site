"use client";

import {
  SECURITY_BRIEF,
  POSTURE,
  OVERVIEW_KPIS,
  OPEN_SEVERITY_COUNTS,
  INCIDENT_TICKER,
  THREAT_MAP_POINTS,
  AGENT_FEED,
  QUICK_ACTIONS,
  ENVIRONMENT_TILES,
  VANTAGE_PLATFORM,
} from "@/data/vantage-demo";
import {
  Card,
  StatCard,
  ScoreRing,
  SeverityBar,
  SeverityBadge,
  ThreatMap,
  AIBlock,
  ActivityRow,
  SectionHeading,
  AreaMini,
  Icon,
  Badge,
  cx,
} from "../VantageKit";
import { useVantageNav } from "../nav-context";

/**
 * Overview - the Command Overview home. Security brief, posture score, headline
 * KPIs, a live threat map, the autonomous-agent activity feed, the open-incident
 * ticker, quick actions into every module, and the environment snapshot. This is
 * a reference screen for the demo's craft.
 */
export default function Overview() {
  const go = useVantageNav();
  const openTotal = Object.values(OPEN_SEVERITY_COUNTS).reduce((a, b) => a + (b ?? 0), 0);

  return (
    <div className="space-y-7">
      {/* security brief */}
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--vnt-faint)]">{SECURITY_BRIEF.date}</p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-[var(--vnt-ink)]">{SECURITY_BRIEF.greeting}</h2>
        <AIBlock tag="Overnight brief" agent="Triage Agent" className="mt-3" footer="Synthesized 07:00 from 47 triaged alerts, 6 agents, and live threat intel">
          {SECURITY_BRIEF.body}
        </AIBlock>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {OVERVIEW_KPIS.map((k) => (
          <StatCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            deltaInvert={k.invert}
            hint={k.hint}
            icon={k.icon}
            accent={k.accent}
            spark={k.spark}
          />
        ))}
      </div>

      {/* posture + threat map */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionHeading
            title="Security posture"
            right={<Badge tone="warn" dot>{POSTURE.threatLevel}</Badge>}
          />
          <div className="flex items-center gap-5">
            <ScoreRing score={POSTURE.score} label="Posture" sub={POSTURE.sub} tone="var(--vnt-primary)" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="text-[var(--vnt-muted)]">Open findings</span>
                <span className="font-mono tabular-nums text-[var(--vnt-ink)]">{openTotal}</span>
              </div>
              <SeverityBar counts={OPEN_SEVERITY_COUNTS} />
              <div className="mt-4">
                <div className="mb-1 text-[11px] uppercase tracking-wide text-[var(--vnt-faint)]">8-week trend</div>
                <AreaMini values={[...POSTURE.trend]} height={56} color="var(--vnt-primary)" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeading
            title="Live threat map"
            hint="Active threat origins, fictional"
            right={<Badge tone="crit" dot>Live</Badge>}
          />
          <ThreatMap points={THREAT_MAP_POINTS} height={196} />
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[var(--vnt-muted)]">
            {THREAT_MAP_POINTS.slice(0, 5).map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(--vnt-${p.level === "critical" ? "crit" : p.level === "high" ? "high" : p.level === "medium" ? "med" : p.level === "low" ? "low" : "info"})` }} />
                {p.label}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* agent feed + incident ticker */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <section>
          <SectionHeading
            title="Autonomous agent activity"
            hint="What the agents did while you were away."
            right={
              <button onClick={() => go("agents")} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--vnt-primary)] hover:underline">
                All agents <Icon name="chevron" size={13} />
              </button>
            }
          />
          <Card padded={false}>
            <ul>
              {AGENT_FEED.map((f) => (
                <ActivityRow key={f.id} icon={f.icon} tone={f.tone} source={f.agent} time={f.time} live={f.live}>
                  {f.text}
                </ActivityRow>
              ))}
            </ul>
          </Card>
        </section>

        <section>
          <SectionHeading
            title="Open incidents"
            right={
              <button onClick={() => go("incidents")} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--vnt-primary)] hover:underline">
                Queue <Icon name="chevron" size={13} />
              </button>
            }
          />
          <Card padded={false}>
            <ul>
              {INCIDENT_TICKER.map((t) => (
                <li key={t.id} className="flex items-center gap-3 border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]">
                  <SeverityBadge level={t.level} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] text-[var(--vnt-ink-2)]">{t.text}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-[var(--vnt-faint)]">{t.id}</div>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--vnt-faint)]">{t.time}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>

      {/* quick actions */}
      <section>
        <SectionHeading title="Quick actions" hint="Jump straight into a module." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.id} onClick={() => go(a.id)} className="text-left">
              <Card hover className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)]" style={{ color: a.color }}>
                  <Icon name={a.icon} size={17} />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--vnt-ink)]">{a.title}</div>
                  <div className="text-[11px] text-[var(--vnt-muted)]">{a.sub}</div>
                </div>
                <Icon name="chevron" size={15} className="ml-auto text-[var(--vnt-faint)]" />
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* environment snapshot */}
      <section>
        <SectionHeading title="Environment" hint={`${VANTAGE_PLATFORM.endpoints.toLocaleString()} endpoints · ${VANTAGE_PLATFORM.monitoredServices} services · ${VANTAGE_PLATFORM.autonomousAgents} agents`} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ENVIRONMENT_TILES.map((t) => (
            <div key={t.label} className={cx("rounded-[12px] border border-[var(--vnt-border)] bg-[var(--vnt-card)] p-3.5")}>
              <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--vnt-faint)]">{t.label}</div>
              <div className="mt-1.5 font-mono text-[20px] font-semibold tabular-nums text-[var(--vnt-ink)]">{t.value}</div>
              <div className="mt-0.5 text-[10px] text-[var(--vnt-muted)]">{t.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
