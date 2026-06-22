"use client";

import {
  MORNING_BRIEF,
  BEACON_PLATFORM,
  ICR_COMPANIES,
  QUICK_ACTIONS,
  MACRO_INDICATORS,
  MACRO_NARRATIVE,
  YIELD_CURVE,
  YIELD_SPREAD_2S10S,
  MARKET_NEWS,
} from "@/data/icr-demo";
import {
  Card,
  StatCard,
  Delta,
  Badge,
  Sparkline,
  Icon,
  SectionHeading,
  AIBlock,
  cx,
} from "../BeaconKit";
import { useBeaconNav } from "../nav-context";

/**
 * BeaconDashboard - the Overview home. Morning briefing, portfolio KPIs, the
 * pinned-client roster, quick actions into every module, and the macro + market
 * context (indicators, yield curve, news). Reference screen for the demo's craft.
 */
export default function BeaconDashboard() {
  const go = useBeaconNav();

  return (
    <div className="space-y-7">
      {/* morning briefing */}
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--icr-faint)]">{MORNING_BRIEF.date}</p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-[var(--icr-ink)]">{MORNING_BRIEF.greeting}</h2>
        <AIBlock tag="Morning brief" className="mt-3" footer="Generated 7:02 AM · grounded in your 14 pinned clients and live macro data">
          {MORNING_BRIEF.body}
        </AIBlock>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pinned clients" value={String(BEACON_PLATFORM.clients)} hint="across 6 sectors" />
        <StatCard label="Briefs generated" value="2,840" hint="+186 this month" />
        <StatCard label="Hours saved / week" value={`${BEACON_PLATFORM.hoursSavedWeekly}h`} hint="team average" />
        <StatCard label="Scenarios run" value={String(BEACON_PLATFORM.scenariosRun)} hint="crisis + guidance" />
      </div>

      {/* pinned clients */}
      <section>
        <SectionHeading
          title="Pinned clients"
          hint="Live quotes and 30-day trend. Click a card to open its earnings workspace."
          right={
            <button className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--icr-accent)] hover:underline">
              <Icon name="plus" size={13} /> Add ticker
            </button>
          }
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ICR_COMPANIES.map((c) => (
            <button key={c.ticker} onClick={() => go("earnings")} className="text-left">
              <Card hover className="transition-colors hover:border-[var(--icr-border-strong)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-[var(--icr-accent)]">{c.ticker}</span>
                    <Badge tone="up" dot>Live</Badge>
                  </div>
                  <Sparkline values={c.spark} />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-lg font-semibold tabular-nums text-[var(--icr-ink)]">${c.price.toFixed(2)}</span>
                  <Delta value={c.changePct} />
                </div>
                <div className="mt-1.5 text-[12px] font-medium text-[var(--icr-ink-2)]">{c.name}</div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="text-[11px] text-[var(--icr-muted)]">{c.sector}</span>
                  {c.earningsIn && <span className="font-mono text-[10px] text-[var(--icr-faint)]">{c.earningsIn}</span>}
                </div>
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* quick actions */}
      <section>
        <SectionHeading title="Quick actions" hint="Jump straight into a module for your focused company." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.id} onClick={() => go(a.id)} className="text-left">
              <Card hover className="flex items-center gap-3 transition-colors hover:border-[var(--icr-border-strong)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--icr-surface-2)", color: a.color }}>
                  <QuickIcon id={a.id} />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--icr-ink)]">{a.title}</div>
                  <div className="text-[11px] text-[var(--icr-muted)]">{a.sub}</div>
                </div>
                <Icon name="chevron" size={15} className="ml-auto text-[var(--icr-faint)]" />
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* macro + yield */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeading title="Macro environment" />
          <p className="text-[12.5px] leading-relaxed text-[var(--icr-muted)]">{MACRO_NARRATIVE}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {MACRO_INDICATORS.map((m) => (
              <div key={m.label} className="rounded-lg border border-[var(--icr-border)] bg-[var(--icr-recessed)] p-2.5">
                <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--icr-faint)]">{m.label}</div>
                <div className="mt-1 font-mono text-[15px] font-semibold tabular-nums text-[var(--icr-ink)]">{m.value}</div>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--icr-faint)]">
                  <Trend v={m.trend} /> {m.asOf}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading
            title="Treasury yield curve"
            right={
              <Badge tone={YIELD_SPREAD_2S10S < 0 ? "down" : "up"}>
                2s10s {YIELD_SPREAD_2S10S > 0 ? "+" : ""}
                {YIELD_SPREAD_2S10S.toFixed(2)} {YIELD_SPREAD_2S10S < 0 ? "· Inverted" : ""}
              </Badge>
            }
          />
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {YIELD_CURVE.map((p) => (
              <div
                key={p.maturity}
                className={cx(
                  "rounded-lg border p-2 text-center",
                  p.key
                    ? "border-[var(--icr-accent)]/30 bg-[var(--icr-accent-wash)]"
                    : "border-[var(--icr-border)] bg-[var(--icr-recessed)]",
                )}
              >
                <div className={cx("text-[10px] font-medium uppercase", p.key ? "text-[var(--icr-accent)]" : "text-[var(--icr-faint)]")}>{p.maturity}</div>
                <div className={cx("mt-1 font-mono text-[13px] font-semibold tabular-nums", p.key ? "text-[var(--icr-accent)]" : "text-[var(--icr-ink)]")}>{p.yield.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* market news */}
      <section>
        <SectionHeading title="Market & macro news" hint="Filtered to your clients' sectors." />
        <Card padded={false}>
          <ul>
            {MARKET_NEWS.map((n, i) => (
              <li key={i} className="flex items-center gap-3 border-b border-[var(--icr-border)] px-4 py-2.5 last:border-0 hover:bg-[var(--icr-bg)]">
                <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--icr-ink-2)] hover:text-[var(--icr-accent)]">{n.title}</span>
                <span className="shrink-0 text-[11px] text-[var(--icr-muted)]">{n.source}</span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--icr-faint)]">{n.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}

function Trend({ v }: { v: number }) {
  if (v === 0) return <span className="text-[var(--icr-faint)]">—</span>;
  const up = v > 0;
  return (
    <span style={{ color: up ? "var(--icr-up)" : "var(--icr-down)" }}>
      {up ? "▲" : "▼"} {Math.abs(v).toFixed(1)}
    </span>
  );
}

function QuickIcon({ id }: { id: string }) {
  const map: Record<string, Parameters<typeof Icon>[0]["name"]> = {
    earnings: "barchart",
    comms: "megaphone",
    crisis: "shield",
    governance: "scale",
    peers: "users",
    ipo: "rocket",
  };
  return <Icon name={map[id] ?? "sparkles"} size={17} />;
}
