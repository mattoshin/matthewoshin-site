"use client";

import {
  MORNING_BRIEF,
  SEC_PLATFORM,
  SEC_COMPANIES,
  SEC_CLIENTS,
  QUICK_ACTIONS,
} from "@/data/sec-demo";
import { SEC_FILINGS, AI_THEMES } from "@/data/sec-modules-demo";
import {
  Card,
  StatCard,
  Delta,
  Badge,
  Sparkline,
  Icon,
  SectionHeading,
  AIBlock,
  FilingTape,
  FormBadge,
  SeverityFlag,
  type TapeItem,
  cx,
} from "../SecKit";
import { useSecNav, useSecRole } from "../console-context";

/**
 * SecDashboard - the role-aware Overview home. A morning AI brief, the filing tape,
 * KPI counters, today's material filings, and a role-tuned book section (clients +
 * exposure for the wealth manager, positions + speed for the trader). The reference
 * screen for the demo's craft.
 */
const TAPE: TapeItem[] = SEC_COMPANIES.map((c) => ({
  ticker: c.ticker,
  form: c.nextFiling?.form ?? "8-K",
  changePct: c.changePct,
}));

const TODAY = SEC_FILINGS.filter((f) => f.severity !== "routine").slice(0, 4);

export default function SecDashboard() {
  const go = useSecNav();
  const role = useSecRole();
  const advisor = role === "advisor";

  return (
    <div className="space-y-7">
      {/* morning briefing */}
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--sec-faint)]">{MORNING_BRIEF.date}</p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-[var(--sec-ink)]">
          {advisor ? MORNING_BRIEF.greetingAdvisor : MORNING_BRIEF.greetingTrader}
        </h2>
        <AIBlock
          tag="Morning brief"
          className="mt-3"
          footer={`Generated 6:42 AM · grounded in 18 filings across your ${advisor ? `${SEC_PLATFORM.clients} clients` : `${SEC_PLATFORM.watchlist} names`} overnight`}
        >
          {advisor ? MORNING_BRIEF.bodyAdvisor : MORNING_BRIEF.bodyTrader}
        </AIBlock>
      </div>

      {/* filing tape */}
      <FilingTape items={TAPE} />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {advisor ? (
          <>
            <StatCard label="Clients" value={String(SEC_PLATFORM.clients)} hint="across 4 mandates" />
            <StatCard label="Material today" value="2" hint="8-K events on your book" />
            <StatCard label="Exposed clients" value="4" hint="hold an affected name" />
            <StatCard label="Avg time to alert" value={SEC_PLATFORM.avgTimeToAlert} hint="filing to your phone" />
          </>
        ) : (
          <>
            <StatCard label="Watchlist names" value={String(SEC_PLATFORM.watchlist)} hint="positions tracked" />
            <StatCard label="Material today" value="2" hint="8-K events" />
            <StatCard label="Alerts delivered" value={String(SEC_PLATFORM.alertsDeliveredToday)} hint="across channels today" />
            <StatCard label="Avg time to alert" value={SEC_PLATFORM.avgTimeToAlert} hint="filing to your phone" />
          </>
        )}
      </div>

      {/* today's material filings */}
      <section>
        <SectionHeading
          title="Material on your book today"
          hint="Ranked by AI materiality. Click a filing to open the feed and its AI read."
          right={
            <button onClick={() => go("filings")} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--sec-accent)] hover:underline">
              Open feed <Icon name="chevron" size={13} />
            </button>
          }
        />
        <Card padded={false}>
          <ul>
            {TODAY.map((f) => (
              <li key={f.id}>
                <button onClick={() => go("filings")} className="flex w-full items-start gap-3 border-b border-[var(--sec-border)] px-4 py-3 text-left transition-colors last:border-0 hover:bg-[var(--sec-surface-2)]">
                  <span className="mt-0.5 shrink-0"><FormBadge form={f.form} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[13px] font-semibold text-[var(--sec-accent)]">{f.ticker}</span>
                      <span className="truncate text-[13px] font-medium text-[var(--sec-ink)]">{f.title}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--sec-muted)]">{f.summary}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <SeverityFlag severity={f.severity} />
                    <span className="font-mono text-[11px] tabular-nums text-[var(--sec-faint)]">{f.filedAt}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* role-aware: clients (advisor) vs positions (trader) */}
      {advisor ? (
        <section>
          <SectionHeading
            title="Your client book"
            hint="Clients holding a name that filed today are flagged. Click to open the book."
            right={<Badge tone="material" dot>4 exposed today</Badge>}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SEC_CLIENTS.map((c) => (
              <button key={c.id} onClick={() => go("watchlist")} className="text-left">
                <Card hover>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-[var(--sec-ink)]">{c.name}</div>
                      <div className="text-[11px] text-[var(--sec-muted)]">{c.type} · {c.riskBand}</div>
                    </div>
                    {c.unread > 0 && <Badge tone="accent">{c.unread} new</Badge>}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-mono text-lg font-semibold tabular-nums text-[var(--sec-ink)]">{c.aum}</span>
                    <span className="text-[11px] text-[var(--sec-faint)]">AUM</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    {c.topHoldings.map((t) => (
                      <span key={t} className={cx("rounded font-mono text-[10.5px] px-1.5 py-0.5", c.exposed.includes(t) ? "bg-[var(--sec-material-wash)] text-[var(--sec-material)]" : "bg-[var(--sec-surface-2)] text-[var(--sec-muted)]")}>{t}</span>
                    ))}
                  </div>
                  {c.flag && (
                    <div className="mt-2.5 flex items-start gap-1.5 text-[11.5px] leading-snug text-[var(--sec-material)]">
                      <Icon name="alert" size={13} className="mt-px shrink-0" /> {c.flag}
                    </div>
                  )}
                </Card>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <SectionHeading
            title="Your positions"
            hint="Live quotes, 30-day trend, unread filings, and the next scheduled filing per name."
            right={<button onClick={() => go("watchlist")} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--sec-accent)] hover:underline"><Icon name="plus" size={13} /> Add ticker</button>}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SEC_COMPANIES.map((c) => (
              <button key={c.ticker} onClick={() => go("filings")} className="text-left">
                <Card hover>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-[var(--sec-accent)]">{c.ticker}</span>
                      {c.unread > 0 && <Badge tone="material" dot>{c.unread}</Badge>}
                    </div>
                    <Sparkline values={c.spark} />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-lg font-semibold tabular-nums text-[var(--sec-ink)]">${c.price.toFixed(2)}</span>
                    <Delta value={c.changePct} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="truncate text-[12px] font-medium text-[var(--sec-ink-2)]">{c.name}</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="text-[11px] text-[var(--sec-muted)]">{c.position ? `${c.position.weightPct}% · ${c.position.value}` : c.sector}</span>
                    {c.nextFiling && <span className="font-mono text-[10px] text-[var(--sec-faint)]">{c.nextFiling.form} {c.nextFiling.in}</span>}
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* what's moving in AI (theme tracker teaser) */}
      <section>
        <SectionHeading
          title="What's moving in AI"
          hint="The theme tracker scans every filing for AI exposure across your book."
          right={
            <button onClick={() => go("ai-analyst")} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--sec-accent)] hover:underline">
              Open AI analyst <Icon name="chevron" size={13} />
            </button>
          }
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {AI_THEMES.slice(0, 2).map((t) => (
            <button key={t.id} onClick={() => go("ai-analyst")} className="text-left">
              <Card hover>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon name="lightbulb" size={15} className="text-[var(--sec-sec-ai)]" />
                    <span className="text-[13px] font-semibold text-[var(--sec-ink)]">{t.title}</span>
                  </div>
                  <Badge tone={t.trend === "new" ? "accent" : t.trend === "rising" ? "up" : "neutral"}>
                    {t.trend === "rising" ? "▲ rising" : t.trend === "new" ? "new" : "steady"}
                  </Badge>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--sec-muted)]">{t.summary}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-1">
                  {t.companies.map((tk) => (
                    <span key={tk} className="rounded bg-[var(--sec-surface-2)] px-1.5 py-0.5 font-mono text-[10.5px] text-[var(--sec-ink-2)]">{tk}</span>
                  ))}
                  <span className="ml-1 text-[11px] text-[var(--sec-faint)]">{t.mentions} mentions</span>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* quick actions */}
      <section>
        <SectionHeading title="Quick actions" hint="Jump straight into the part of the terminal you need." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.title} onClick={() => go(a.id)} className="text-left">
              <Card hover className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--sec-surface-2)", color: a.color }}>
                  <Icon name={a.icon} size={17} />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--sec-ink)]">{a.title}</div>
                  <div className="text-[11px] text-[var(--sec-muted)]">{a.sub}</div>
                </div>
                <Icon name="chevron" size={15} className="ml-auto text-[var(--sec-faint)]" />
              </Card>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
