"use client";

import {
  OPERATORS,
  API_KEYS,
  CONNECTORS,
  AUDIT_LOG,
  USAGE_SPEND,
  SPEND_TREND,
  type Operator,
  type ApiKey,
  type Connector,
  type AuditEntry,
} from "@/data/vantage-modules-demo";
import {
  Card,
  StatCard,
  MetricTile,
  SectionHeading,
  StatusPill,
  Badge,
  Button,
  Icon,
  AIBlock,
  BarMini,
  DataTable,
  ProgressBar,
  cx,
  type Tone,
  type Column,
} from "../VantageKit";

/**
 * Admin & Keys - the platform-administration screen. A usage + spend summary
 * strip, the integrations/connectors grid, an API-keys & secrets table (the
 * Secrets Registry auto-flags rotation), an operators roster paired with the
 * 4-week spend trend against the cap, and the append-only audit log. Composed
 * entirely from the SecOps Command kit + scoped tokens.
 */

const KEY_STATUS: Record<ApiKey["status"], { tone: Tone; label: string }> = {
  active: { tone: "up", label: "Active" },
  "rotate-soon": { tone: "warn", label: "Rotate soon" },
  expired: { tone: "crit", label: "Expired" },
};

const CONNECTOR_ICON: Record<Connector["category"], "shield" | "database" | "cloud" | "fingerprint" | "bell" | "bug"> = {
  EDR: "shield",
  SIEM: "database",
  Cloud: "cloud",
  Identity: "fingerprint",
  Email: "bell",
  Vuln: "bug",
};

// AI spend MTD vs cap, as a deterministic 0-100 fill (figures are strings).
function spendPct(spent: string, cap: string): number {
  const num = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0;
  const c = num(cap);
  return c === 0 ? 0 : Math.round((num(spent) / c) * 100);
}

export default function Admin() {
  const onlineConnectors = CONNECTORS.filter((c) => c.status === "online").length;
  const keysToRotate = API_KEYS.filter((k) => k.status !== "active").length;
  const mfaCovered = OPERATORS.filter((o) => o.mfa).length;
  const aiPct = spendPct(USAGE_SPEND.aiSpendMtd, USAGE_SPEND.aiSpendCap);
  const spendTop = Math.max(...SPEND_TREND.map((b) => b.value), 1);

  const keyColumns: ReadonlyArray<Column<ApiKey>> = [
    {
      key: "name",
      label: "Key",
      mono: true,
      render: (r) => (
        <span className="inline-flex items-center gap-2">
          <Icon name="key" size={13} className="text-[var(--vnt-faint)]" />
          <span className="text-[var(--vnt-ink)]">{r.name}</span>
        </span>
      ),
    },
    {
      key: "scope",
      label: "Scope",
      width: "130px",
      mono: true,
      render: (r) => <span className="text-[var(--vnt-muted)]">{r.scope}</span>,
    },
    {
      key: "created",
      label: "Created",
      width: "118px",
      mono: true,
      render: (r) => <span className="text-[var(--vnt-muted)]">{r.created}</span>,
    },
    {
      key: "lastUsed",
      label: "Last used",
      width: "104px",
      render: (r) => <span className="text-[var(--vnt-ink-2)]">{r.lastUsed}</span>,
    },
    {
      key: "ageDays",
      label: "Age",
      width: "78px",
      align: "right",
      mono: true,
      render: (r) => (
        <span className={cx("tabular-nums", r.ageDays >= 90 ? "text-[var(--vnt-warn)]" : "text-[var(--vnt-muted)]")}>
          {r.ageDays}d
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "124px",
      align: "right",
      render: (r) => {
        const s = KEY_STATUS[r.status];
        return (
          <Badge tone={s.tone} dot>
            {s.label}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-7">
      {/* usage + spend summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Agent runs / mo"
          value={USAGE_SPEND.monthlyAgentRuns.toLocaleString()}
          icon="robot"
          accent="var(--vnt-primary)"
          hint="autonomous executions"
        />
        <StatCard
          label="Actions / mo"
          value={USAGE_SPEND.monthlyActions.toLocaleString()}
          icon="bolt"
          accent="var(--vnt-highlight)"
          hint="changes the agents made"
        />
        <StatCard
          label="AI spend MTD"
          value={USAGE_SPEND.aiSpendMtd}
          icon="gauge"
          accent="var(--vnt-accent)"
          hint={`of ${USAGE_SPEND.aiSpendCap} cap`}
        />
        <StatCard
          label="Ingest volume"
          value={USAGE_SPEND.ingestVolume}
          icon="database"
          accent="var(--vnt-up)"
          hint={`${USAGE_SPEND.retention} retention`}
        />
      </div>

      {/* integrations / connectors */}
      <section>
        <SectionHeading
          title="Integrations / connectors"
          hint="Data sources feeding the command center."
          right={
            <Badge tone="up" dot>
              {onlineConnectors}/{CONNECTORS.length} online
            </Badge>
          }
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONNECTORS.map((c) => (
            <Card key={c.name} hover className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)] text-[var(--vnt-muted)]">
                <Icon name={CONNECTOR_ICON[c.category]} size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-semibold text-[var(--vnt-ink)]">{c.name}</span>
                  <Badge tone="neutral">{c.category}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <StatusPill status={c.status} live={c.status === "online"} />
                  <span className="font-mono text-[12px] tabular-nums text-[var(--vnt-ink-2)]">{c.events24h}</span>
                </div>
                <div className="mt-0.5 text-right text-[10px] uppercase tracking-wide text-[var(--vnt-faint)]">events / 24h</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* api keys & secrets */}
      <section>
        <SectionHeading
          title="API keys & secrets"
          hint="Scoped credentials for every connector and service account."
          right={
            <Badge tone="warn" dot>
              {keysToRotate} flagged
            </Badge>
          }
        />
        <AIBlock
          tag="Secrets Registry"
          agent="Identity Agent"
          className="mb-3"
          footer="Append-only registry · rotation policy 90 days"
        >
          The Secrets Registry continuously tracks key age against the rotation policy and{" "}
          <span className="font-semibold text-[var(--vnt-ink)]">auto-flags rotation</span> at 90 days. {keysToRotate} of{" "}
          {API_KEYS.length} keys are past or nearing the window and have been surfaced for action.
        </AIBlock>
        <DataTable columns={keyColumns} rows={API_KEYS} getKey={(r) => r.name} dense />
      </section>

      {/* operators + spend */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* operators */}
        <section className="min-w-0">
          <SectionHeading
            title="Operators"
            hint={`${OPERATORS.length} with console access`}
            right={
              <Badge tone="up" dot>
                {mfaCovered}/{OPERATORS.length} MFA
              </Badge>
            }
          />
          <Card padded={false}>
            <ul>
              {OPERATORS.map((o: Operator) => (
                <li
                  key={o.name}
                  className="flex items-center gap-3 border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--vnt-surface-2)] font-mono text-[11px] font-semibold text-[var(--vnt-ink-2)]">
                    {o.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-[var(--vnt-ink)]">{o.name}</div>
                    <div className="text-[11px] text-[var(--vnt-muted)]">{o.role}</div>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--vnt-faint)]">{o.lastActive}</span>
                  {o.mfa ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--vnt-up)]">
                      <Icon name="check" size={12} /> MFA
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--vnt-warn)]">
                      <Icon name="alert" size={12} /> No MFA
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* spend (4w) */}
        <section className="min-w-0">
          <SectionHeading title="Spend (4w)" hint="Weekly AI spend against the monthly cap." />
          <Card>
            <BarMini bars={[...SPEND_TREND]} height={104} max={spendTop} />
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <MetricTile label="Spend MTD" value={USAGE_SPEND.aiSpendMtd} sub={`${aiPct}% of cap`} tone="var(--vnt-accent)" />
              <MetricTile label="Monthly cap" value={USAGE_SPEND.aiSpendCap} sub="hard ceiling" />
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="uppercase tracking-wide text-[var(--vnt-faint)]">Cap usage</span>
                <span className="font-mono tabular-nums text-[var(--vnt-ink-2)]">{aiPct}%</span>
              </div>
              <ProgressBar value={aiPct} color="var(--vnt-accent)" />
            </div>
          </Card>
        </section>
      </div>

      {/* audit log */}
      <section>
        <SectionHeading
          title="Audit log"
          hint="Append-only · every operator and agent action."
          right={<Button variant="outline" size="sm" icon="download">Export</Button>}
        />
        <Card padded={false}>
          <ul>
            {AUDIT_LOG.map((e: AuditEntry, i) => (
              <li
                key={`${e.time}-${i}`}
                className="flex items-center gap-3 border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)]"
                  style={{ color: e.isAgent ? "var(--vnt-primary)" : "var(--vnt-faint)" }}
                >
                  <Icon name={e.isAgent ? "robot" : "user"} size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] text-[var(--vnt-ink-2)]">
                    <span className={cx("font-medium", e.isAgent ? "text-[var(--vnt-primary)]" : "text-[var(--vnt-ink)]")}>{e.actor}</span>{" "}
                    {e.action}
                  </div>
                  <div className="mt-0.5 inline-flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-[var(--vnt-faint)]">target</span>
                    <span className="font-mono text-[11px] tabular-nums text-[var(--vnt-muted)]">{e.target}</span>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--vnt-faint)]">{e.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
