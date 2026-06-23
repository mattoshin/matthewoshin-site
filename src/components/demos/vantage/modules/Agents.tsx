"use client";

import {
  AGENTS,
  AGENT_RUNS,
  type AutonomousAgent,
  type AutonomyLevel,
  type AgentRun,
} from "@/data/vantage-modules-demo";
import {
  Card,
  StatCard,
  SectionHeading,
  AIBlock,
  Badge,
  Button,
  Icon,
  StatusPill,
  cx,
  type Tone,
  type SystemStatus,
} from "../VantageKit";

/**
 * Agents - the agentic centerpiece. A fleet roster of autonomous agents, each as
 * a rich card: a tone-tinted icon chip, role, run/status, an autonomy badge, a
 * 3-up metric row, the agent's mandate, and a last-action footer with inspect /
 * pause-tune controls. The needs-review agent is highlighted with a warm border.
 * Below, a recent-actions log with result chips. The whole screen is led by a
 * SecOps Command fleet one-liner. Reference screen for the demo's agentic motif.
 */

/* map agent status -> the StatusPill's online/degraded/offline vocabulary */
const STATUS_TO_PILL: Record<AutonomousAgent["status"], SystemStatus> = {
  active: "online",
  "needs-review": "degraded",
  paused: "unknown",
};
const STATUS_LABEL: Record<AutonomousAgent["status"], string> = {
  active: "Active",
  "needs-review": "Needs review",
  paused: "Paused",
};

/* autonomy level -> badge tone + a tiny descriptor */
const AUTONOMY_TONE: Record<AutonomyLevel, Tone> = {
  suggest: "neutral",
  approve: "primary",
  auto: "lime",
};
const AUTONOMY_LABEL: Record<AutonomyLevel, string> = {
  suggest: "Suggest only",
  approve: "Approve to act",
  auto: "Full auto",
};

/* recent-action result -> chip tone */
const RESULT_TONE: Record<AgentRun["result"], Tone> = {
  "auto-resolved": "up",
  escalated: "warn",
  staged: "primary",
  pending: "neutral",
};
const RESULT_LABEL: Record<AgentRun["result"], string> = {
  "auto-resolved": "Auto-resolved",
  escalated: "Escalated",
  staged: "Staged",
  pending: "Pending",
};

export default function Agents() {
  const activeCount = AGENTS.filter((a) => a.status === "active").length;
  const reviewCount = AGENTS.filter((a) => a.status === "needs-review").length;
  const totalActions = AGENTS.reduce((sum, a) => sum + a.actions7d, 0);
  const avgSuccess = Math.round(
    (AGENTS.reduce((sum, a) => sum + a.successRate, 0) / AGENTS.length) * 100,
  );

  return (
    <div className="space-y-7">
      {/* fleet one-liner */}
      <AIBlock
        tag="Fleet"
        agent="SecOps Command"
        title="Last 24h"
        footer={`${AGENTS.length} agents · ${totalActions.toLocaleString()} actions taken · ${reviewCount} awaiting your approval`}
      >
        The fleet ran continuously overnight: the Triage Agent auto-closed scanner
        noise and opened incidents for the rest, the Phishing Responder contained a
        credential-stuffing burst, and the Patch Orchestrator staged the CVE-2026-3185
        rollout for the 02:00 window. One agent, the Identity Agent, is paused on 3
        stale service keys and needs your sign-off.
      </AIBlock>

      {/* summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active agents" value={`${activeCount}/${AGENTS.length}`} icon="robot" accent="var(--vnt-primary)" hint="running autonomously" />
        <StatCard label="Actions (7d)" value={totalActions.toLocaleString()} icon="bolt" accent="var(--vnt-highlight)" hint="taken across the fleet" />
        <StatCard label="Avg success rate" value={`${avgSuccess}%`} icon="shieldCheck" accent="var(--vnt-up)" hint="clean completions" />
        <StatCard label="Needs review" value={String(reviewCount)} icon="alert" accent="var(--vnt-warn)" hint="awaiting approval" />
      </div>

      {/* roster */}
      <section>
        <SectionHeading
          title="Agent roster"
          hint="Each agent's mandate, autonomy level, and 7-day track record."
          right={<Button variant="outline" size="sm" icon="plus">New agent</Button>}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>
      </section>

      {/* recent actions */}
      <section>
        <SectionHeading
          title="Recent agent actions"
          hint="Every autonomous action is logged and reversible."
        />
        <Card padded={false}>
          <ul>
            {AGENT_RUNS.map((run, i) => (
              <li
                key={`${run.agent}-${i}`}
                className="flex items-center gap-3 border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)] text-[var(--vnt-primary)]">
                  <Icon name="robot" size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] text-[var(--vnt-ink-2)]">{run.action}</div>
                  <div className="mt-0.5 text-[11px] text-[var(--vnt-faint)]">{run.agent}</div>
                </div>
                <Badge tone={RESULT_TONE[run.result]} dot>{RESULT_LABEL[run.result]}</Badge>
                <span className="hidden shrink-0 font-mono text-[11px] tabular-nums text-[var(--vnt-faint)] sm:inline">{run.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}

/* ----------------------------------------------------------- agent card --- */

function AgentCard({ agent }: { agent: AutonomousAgent }) {
  const needsReview = agent.status === "needs-review";
  const metrics: ReadonlyArray<{ label: string; value: string }> = [
    { label: "Runs 7d", value: agent.runs7d.toLocaleString() },
    { label: "Actions 7d", value: agent.actions7d.toLocaleString() },
    { label: "Success", value: `${Math.round(agent.successRate * 100)}%` },
  ];

  return (
    <Card
      className={cx(
        "flex flex-col gap-4",
        needsReview && "border-[color-mix(in_srgb,var(--vnt-warn)_45%,transparent)]",
      )}
    >
      {/* header: icon chip + name/role + status */}
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            color: agent.tone,
            background: `color-mix(in srgb, ${agent.tone} 14%, transparent)`,
          }}
        >
          <Icon name={agent.icon} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-[var(--vnt-ink)]">{agent.name}</h3>
            {needsReview && <Badge tone="warn">Review</Badge>}
          </div>
          <p className="mt-0.5 truncate text-[12px] text-[var(--vnt-muted)]">{agent.role}</p>
        </div>
        <StatusPill
          status={STATUS_TO_PILL[agent.status]}
          label={STATUS_LABEL[agent.status]}
          live={agent.status === "active"}
        />
      </div>

      {/* autonomy */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--vnt-faint)]">Autonomy</span>
        <Badge tone={AUTONOMY_TONE[agent.autonomy]} dot>
          <span className="font-mono uppercase tracking-wide">{agent.autonomy}</span>
        </Badge>
        <span className="text-[11px] text-[var(--vnt-muted)]">{AUTONOMY_LABEL[agent.autonomy]}</span>
      </div>

      {/* 3-up metric row */}
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-[var(--vnt-border)] bg-[var(--vnt-border)]">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[var(--vnt-surface-2)] px-3 py-2.5">
            <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--vnt-faint)]">{m.label}</div>
            <div className="mt-1 font-mono text-[16px] font-semibold tabular-nums text-[var(--vnt-ink)]">{m.value}</div>
          </div>
        ))}
      </div>

      {/* summary */}
      <p className="text-[12.5px] leading-relaxed text-[var(--vnt-ink-2)]">{agent.summary}</p>

      {/* footer */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--vnt-border)] pt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--vnt-faint)]">
          <Icon name="clock" size={12} />
          Last action {agent.lastAction}
        </span>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" icon="eye">Inspect</Button>
          <Button variant="ghost" size="sm" icon={needsReview ? "settings" : "pause"}>
            {needsReview ? "Tune" : "Pause"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
