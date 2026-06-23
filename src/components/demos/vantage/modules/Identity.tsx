"use client";

import { useMemo, useState } from "react";
import {
  IDENTITY_USERS,
  MFA_COVERAGE,
  RISKY_SIGNINS,
  PRIV_ACCOUNTS,
  ACCESS_REVIEWS,
  type IdentityUser,
  type PrivAccount,
} from "@/data/vantage-modules-demo";
import {
  Card,
  StatCard,
  ScoreRing,
  SectionHeading,
  SeverityBadge,
  Badge,
  Button,
  Chip,
  Icon,
  AIBlock,
  ProgressBar,
  DataTable,
  type Column,
  type Tone,
} from "../VantageKit";

/**
 * Identity - the Identity & Access posture screen. An MFA-coverage ring beside
 * the headline identity KPIs, a risky-sign-ins watchlist, the full identity
 * directory as a filterable table (all / privileged / risky), and a two-column
 * footer pairing privileged-account review status with the agent-cleared access
 * reviews. The Identity Agent drives dormant-account and key clearing in the
 * background, surfaced via the agentic lime-border block.
 */

type DirectoryFilter = "all" | "privileged" | "risky";

const PRIV_STATUS_META: Record<PrivAccount["status"], { tone: Tone; label: string }> = {
  ok: { tone: "up", label: "OK" },
  "review-due": { tone: "warn", label: "Review due" },
  stale: { tone: "crit", label: "Stale" },
};

/** Map a 0-100 risk score onto the violet/teal token band for the inline bar. */
function riskColor(risk: IdentityUser["risk"]): string {
  if (risk === "high") return "var(--vnt-high)";
  if (risk === "medium") return "var(--vnt-med)";
  return "var(--vnt-accent)";
}

export default function Identity() {
  const [filter, setFilter] = useState<DirectoryFilter>("all");

  const riskyCount = RISKY_SIGNINS.length;

  const rows = useMemo<readonly IdentityUser[]>(() => {
    if (filter === "privileged") return IDENTITY_USERS.filter((u) => u.privileged);
    if (filter === "risky") return IDENTITY_USERS.filter((u) => u.risk === "high" || u.risk === "medium");
    return IDENTITY_USERS;
  }, [filter]);

  const filterTabs: ReadonlyArray<{ id: DirectoryFilter; label: string; count: number }> = [
    { id: "all", label: "All", count: IDENTITY_USERS.length },
    { id: "privileged", label: "Privileged", count: IDENTITY_USERS.filter((u) => u.privileged).length },
    { id: "risky", label: "Risky", count: IDENTITY_USERS.filter((u) => u.risk === "high" || u.risk === "medium").length },
  ];

  const columns: ReadonlyArray<Column<IdentityUser>> = [
    {
      key: "user",
      label: "Identity",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-mono text-[12.5px] text-[var(--vnt-ink)]">{r.user}</div>
          <div className="mt-0.5 text-[11px] text-[var(--vnt-faint)]">{r.name}</div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      width: "150px",
      render: (r) => <span className="text-[12.5px] text-[var(--vnt-ink-2)]">{r.role}</span>,
    },
    {
      key: "mfa",
      label: "MFA",
      width: "70px",
      render: (r) =>
        r.mfa ? (
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--vnt-up)]">
            <Icon name="check" size={13} />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-mono text-[13px] font-semibold text-[var(--vnt-crit)]">﹣</span>
        ),
    },
    {
      key: "privileged",
      label: "Access",
      width: "108px",
      render: (r) =>
        r.privileged ? (
          <Badge tone="primary">
            <Icon name="key" size={9} /> Privileged
          </Badge>
        ) : (
          <span className="text-[11px] text-[var(--vnt-faint)]">Standard</span>
        ),
    },
    {
      key: "riskScore",
      label: "Risk score",
      width: "132px",
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="w-7 shrink-0 font-mono text-[12px] tabular-nums text-[var(--vnt-ink-2)]">{r.riskScore}</span>
          <div className="min-w-0 flex-1">
            <ProgressBar value={r.riskScore} color={riskColor(r.risk)} />
          </div>
        </div>
      ),
    },
    {
      key: "risk",
      label: "Risk",
      width: "92px",
      render: (r) => <SeverityBadge level={r.risk} />,
    },
    {
      key: "lastSignin",
      label: "Last sign-in",
      width: "104px",
      align: "right",
      mono: true,
      render: (r) => <span className="text-[11px] text-[var(--vnt-faint)]">{r.lastSignin}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* summary strip: MFA ring + headline KPIs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_2.4fr]">
        <Card className="flex items-center gap-4">
          <ScoreRing score={MFA_COVERAGE.covered} label="MFA coverage" tone="var(--vnt-accent)" />
          <div className="min-w-0">
            <div className="text-[12px] text-[var(--vnt-muted)]">Of all identities</div>
            <div className="mt-1 font-mono text-[13px] tabular-nums text-[var(--vnt-ink-2)]">
              {MFA_COVERAGE.covered}
              <span className="text-[var(--vnt-faint)]"> / {MFA_COVERAGE.total}</span>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="text-[var(--vnt-faint)]">Privileged MFA</span>
                <span className="font-mono tabular-nums text-[var(--vnt-ink-2)]">{MFA_COVERAGE.privilegedCovered}%</span>
              </div>
              <ProgressBar value={MFA_COVERAGE.privilegedCovered} color="var(--vnt-primary)" />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Identities"
            value={String(IDENTITY_USERS.length)}
            icon="users"
            accent="var(--vnt-primary)"
            hint="in directory"
          />
          <StatCard
            label="Privileged MFA"
            value={`${MFA_COVERAGE.privilegedCovered}%`}
            icon="key"
            accent="var(--vnt-accent)"
            hint="admin accounts"
          />
          <StatCard
            label="Risky sign-ins"
            value={String(riskyCount)}
            icon="fingerprint"
            accent="var(--vnt-high)"
            hint="last 24h"
          />
          <StatCard
            label="Service-acct gaps"
            value={String(MFA_COVERAGE.serviceAccountsGap)}
            icon="lock"
            accent="var(--vnt-crit)"
            hint="no MFA / unrotated"
          />
        </div>
      </div>

      {/* risky sign-ins */}
      <section>
        <SectionHeading
          title="Risky sign-ins"
          hint="Anomalous authentication flagged in the last 24 hours."
          right={<Badge tone="warn" dot>Live</Badge>}
        />
        <Card padded={false}>
          <ul>
            {RISKY_SIGNINS.map((s, i) => (
              <li
                key={`${s.user}-${i}`}
                className="flex items-center gap-3 border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)] text-[var(--vnt-muted)]">
                  <Icon name="fingerprint" size={14} />
                </span>
                <div className="w-[120px] shrink-0">
                  <div className="font-mono text-[12.5px] text-[var(--vnt-ink)]">{s.user}</div>
                </div>
                <div className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--vnt-ink-2)]">{s.reason}</div>
                <span className="hidden shrink-0 items-center gap-1.5 text-[11px] text-[var(--vnt-muted)] sm:inline-flex">
                  <Icon name="mapPin" size={12} className="text-[var(--vnt-faint)]" />
                  {s.location}
                </span>
                <SeverityBadge level={s.severity} />
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--vnt-faint)]">{s.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* identity directory */}
      <section className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <SectionHeading title="Identity directory" hint="Every account with MFA state, privilege, and risk." />
          <div className="flex items-center gap-2">
            {filterTabs.map((t) => (
              <Chip key={t.id} active={filter === t.id} onClick={() => setFilter(t.id)}>
                {t.label}
                <span className="ml-1.5 font-mono text-[10px] tabular-nums text-[var(--vnt-faint)]">{t.count}</span>
              </Chip>
            ))}
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          getKey={(r) => r.user}
          highlightRow={(r) => r.risk === "high"}
          dense
        />
      </section>

      {/* footer: privileged accounts + access reviews */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* privileged accounts */}
        <section className="min-w-0">
          <SectionHeading
            title="Privileged accounts"
            hint="Standing high-privilege access and review cadence."
            right={<Button variant="outline" size="sm" icon="shieldCheck">Run review</Button>}
          />
          <Card padded={false}>
            <ul>
              {PRIV_ACCOUNTS.map((p) => {
                const m = PRIV_STATUS_META[p.status];
                return (
                  <li
                    key={p.account}
                    className="flex items-center gap-3 border-b border-[var(--vnt-border)] px-4 py-3 last:border-0 hover:bg-[var(--vnt-surface-2)]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)] text-[var(--vnt-primary)]">
                      <Icon name="key" size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-medium text-[var(--vnt-ink)]">{p.account}</div>
                      <div className="mt-0.5 text-[11px] text-[var(--vnt-faint)]">
                        {p.type} · reviewed {p.lastReview}
                      </div>
                    </div>
                    <Badge tone={m.tone} dot={p.status !== "ok"}>{m.label}</Badge>
                  </li>
                );
              })}
            </ul>
          </Card>
        </section>

        {/* access reviews */}
        <section className="min-w-0">
          <SectionHeading
            title="Access reviews"
            hint="Recertification campaigns the Identity Agent is clearing."
          />
          <div className="space-y-3">
            {ACCESS_REVIEWS.map((r) => {
              const pct = Math.round((r.cleared / r.items) * 100);
              return (
                <Card key={r.scope}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-[var(--vnt-ink)]">{r.scope}</div>
                      <div className="mt-0.5 text-[11px] text-[var(--vnt-muted)]">
                        Owned by {r.agent}
                      </div>
                    </div>
                    <Badge tone={pct === 100 ? "up" : "primary"}>
                      <span className="font-mono tabular-nums">{pct}%</span>
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                      <span className="text-[var(--vnt-faint)]">Cleared</span>
                      <span className="font-mono tabular-nums text-[var(--vnt-ink-2)]">
                        {r.cleared}
                        <span className="text-[var(--vnt-faint)]"> / {r.items}</span>
                      </span>
                    </div>
                    <ProgressBar value={r.cleared} max={r.items} color="var(--vnt-highlight)" />
                  </div>
                </Card>
              );
            })}

            <AIBlock
              tag="Agent"
              agent="Identity Agent"
              title="Clearing access reviews"
              footer="Approve to deprovision the remaining flagged accounts and rotate stale keys"
            >
              The Identity Agent has auto-cleared{" "}
              <span className="font-semibold text-[var(--vnt-ink)]">
                {ACCESS_REVIEWS.reduce((a, r) => a + r.cleared, 0)} of{" "}
                {ACCESS_REVIEWS.reduce((a, r) => a + r.items, 0)}
              </span>{" "}
              items across the open campaigns, disabling dormant accounts and right-sizing
              over-privileged roles within its guardrails. It has paused on{" "}
              <span className="font-semibold text-[var(--vnt-ink)]">
                {MFA_COVERAGE.serviceAccountsGap}
              </span>{" "}
              stale service-account keys that need your approval before rotation.
            </AIBlock>
          </div>
        </section>
      </div>
    </div>
  );
}
