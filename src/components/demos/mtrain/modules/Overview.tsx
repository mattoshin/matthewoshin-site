"use client";

import {
  MTRAIN_USER,
  MTRAIN_KPIS,
  BOOKINGS_TREND,
  CLASS_MIX,
  FILL_RATE,
  SCHEDULE_UPCOMING,
  LEADS,
} from "@/data/mtrain-demo";
import {
  Card,
  StatCard,
  SectionHeading,
  TrendBars,
  Donut,
  CapacityBar,
  Avatar,
  Badge,
  MT_SERIF,
  cx,
} from "../MtrainKit";
import { useMtrainNav } from "../nav-context";

/**
 * Overview - the mTrain studio-admin home. The studio at a glance: a calm greeting,
 * the four headline KPIs, the eight-week bookings trend, this week's class mix and
 * fill rate, today's class lineup with live capacity, and the freshest leads to work.
 * Refero-grounded on the Runey / Teal KPI-dashboard pattern. Fictional sample data.
 */
export default function Overview() {
  const nav = useMtrainNav();
  const fillPct = Math.round((FILL_RATE.booked / FILL_RATE.capacity) * 100); // 81

  const today = SCHEDULE_UPCOMING[0];

  const freshLeads = LEADS.filter(
    (l) => l.stage === "New" || l.stage === "Contacted",
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* greeting -------------------------------------------------------- */}
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--mt-faint)]">
          Monday, Jun 16
        </p>
        <h2 className={cx("mt-1.5 text-[26px] font-semibold tracking-tight text-[var(--mt-ink)]", MT_SERIF)}>
          Good morning, {MTRAIN_USER.firstName}.
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--mt-muted)]">
          284 bookings on the calendar this week, 23 new leads to work, and 3 classes already full.
        </p>
      </div>

      {/* KPIs ----------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {MTRAIN_KPIS.map((k) => (
          <StatCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            hint={k.hint}
            spark={k.spark}
            icon={k.icon}
          />
        ))}
      </div>

      {/* bookings trend + class mix ------------------------------------- */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <SectionHeading title="Bookings" hint="Last 8 weeks" />
          <TrendBars data={BOOKINGS_TREND} />
        </Card>

        <Card>
          <SectionHeading title="Class mix" hint="This week" />
          <div className="flex flex-col items-center gap-5">
            <Donut
              segments={CLASS_MIX.map((c) => ({ value: c.value, color: c.color }))}
              centerTop={`${fillPct}%`}
              centerSub="filled"
            />
            <ul className="w-full space-y-2">
              {CLASS_MIX.map((c) => (
                <li key={c.label} className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: c.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--mt-ink-2)]">
                    {c.label}
                  </span>
                  <span className="shrink-0 font-mono text-[12px] tabular-nums text-[var(--mt-muted)]">
                    {c.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* today's classes + new leads ----------------------------------- */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* today's classes */}
        <Card>
          <SectionHeading
            title="Today's classes"
            right={
              <button
                onClick={() => nav("schedule")}
                className="font-mono text-[12px] font-medium text-[var(--mt-accent)] transition-colors hover:text-[var(--mt-accent-700)]"
              >
                View schedule →
              </button>
            }
          />
          <ul>
            {today.classes.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 border-b border-[var(--mt-border)] py-3 first:pt-0 last:border-0 last:pb-0"
              >
                <span className="w-12 shrink-0 font-mono text-[12px] tabular-nums text-[var(--mt-muted)]">
                  {c.start}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold text-[var(--mt-ink)]">
                    {c.name}
                  </div>
                  <div className="truncate text-[12px] text-[var(--mt-muted)]">
                    {c.instructor}
                  </div>
                </div>
                <div className="shrink-0">
                  <CapacityBar booked={c.booked} capacity={c.capacity} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* new leads */}
        <Card>
          <SectionHeading
            title="New leads"
            right={
              <button
                onClick={() => nav("leads")}
                className="font-mono text-[12px] font-medium text-[var(--mt-accent)] transition-colors hover:text-[var(--mt-accent-700)]"
              >
                View leads →
              </button>
            }
          />
          <ul>
            {freshLeads.map((l) => {
              const initials = l.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("");
              return (
                <li
                  key={l.id}
                  className="flex items-center gap-3 border-b border-[var(--mt-border)] py-3 first:pt-0 last:border-0 last:pb-0"
                >
                  <Avatar initials={initials} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-semibold text-[var(--mt-ink)]">
                      {l.name}
                    </div>
                    <div className="truncate text-[12px] text-[var(--mt-muted)]">
                      {l.source} · {l.interest}
                    </div>
                  </div>
                  <Badge tone={l.stage === "New" ? "accent" : "sage"} className="shrink-0">
                    {l.stage}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
