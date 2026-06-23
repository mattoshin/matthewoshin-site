"use client";

import {
  DAILY_BRIEF,
  HANDLED_TODAY,
  PENDING_FOR_YOU,
  ANNOUNCEMENTS,
  QUICK_LAUNCH,
  ATRIUM_PLATFORM,
  type PendingItem,
  type HandledItem,
} from "@/data/atrium-demo";
import {
  GlassCard,
  Card,
  StatCard,
  AIBlock,
  Badge,
  Icon,
  SectionHeading,
  AppTile,
  ATR_GRADIENT,
} from "../AtriumKit";
import { useAtriumNav } from "../nav-context";

/**
 * AtriumHome - the Workspace home and the showpiece. One calm landing place: the
 * AI daily brief, the "handled for you" automation feed (what AI did overnight so
 * you did not have to), the short list of things that genuinely need you, plus
 * quick-launch apps and company announcements. This is the reference screen for
 * the demo's craft; the other modules mirror its composition.
 */
export default function AtriumHome() {
  const go = useAtriumNav();
  const savedTodayMins = HANDLED_TODAY.reduce((s, h) => s + h.savedMins, 0);

  return (
    <div className="space-y-7">
      {/* greeting */}
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--atr-faint)]">{DAILY_BRIEF.date}</p>
        <h2 className="mt-1 text-[26px] font-extrabold tracking-tight text-[var(--atr-ink)]">{DAILY_BRIEF.greeting}</h2>
      </div>

      {/* AI daily brief */}
      <AIBlock
        tag="Daily brief"
        footer={`Generated 7:02 AM · ${formatSaved(savedTodayMins)} of your time saved so far today`}
      >
        {DAILY_BRIEF.body}
      </AIBlock>

      {/* stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Hours saved / week" value={`${ATRIUM_PLATFORM.hoursSavedWeekly}h`} icon="clock" accent hint="by your automations" />
        <StatCard label="Tasks auto-handled" value={String(ATRIUM_PLATFORM.tasksAutomatedMonth)} icon="bolt" hint="this month" />
        <StatCard label="Apps connected" value={String(ATRIUM_PLATFORM.appsConnected)} icon="grid" hint="one login" />
        <StatCard label="Open tickets" value={String(ATRIUM_PLATFORM.openTickets)} icon="lifebuoy" hint="both on track" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* main column */}
        <div className="space-y-7 lg:col-span-2">
          {/* needs you */}
          <section>
            <SectionHeading
              title="Needs you"
              hint="The short list. Everything else, Workplace AI handled."
              right={<Badge tone="warn" dot>{PENDING_FOR_YOU.length} waiting</Badge>}
            />
            <div className="space-y-3">
              {PENDING_FOR_YOU.map((p) => (
                <PendingCard key={p.id} item={p} onOpen={() => go(p.module)} />
              ))}
            </div>
          </section>

          {/* handled for you */}
          <section>
            <SectionHeading
              title="Handled for you today"
              hint={`${HANDLED_TODAY.length} things done automatically · ${formatSaved(savedTodayMins)} saved`}
            />
            <Card padded={false}>
              <ul>
                {HANDLED_TODAY.map((h) => (
                  <HandledRow key={h.id} item={h} onOpen={() => go(h.module)} />
                ))}
              </ul>
            </Card>
          </section>
        </div>

        {/* side column */}
        <div className="space-y-7">
          {/* quick launch */}
          <section>
            <SectionHeading
              title="Quick launch"
              right={
                <button onClick={() => go("apps")} className="text-[12px] font-medium text-[var(--atr-accent)] hover:underline">
                  All apps
                </button>
              }
            />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {QUICK_LAUNCH.map((a) => (
                <AppTile
                  key={a.name}
                  name={a.name}
                  category={a.category}
                  initial={a.initial}
                  color={a.color}
                  status={a.status}
                  onClick={() => go("apps")}
                />
              ))}
            </div>
          </section>

          {/* announcements */}
          <section>
            <SectionHeading title="Company" />
            <Card padded={false}>
              <ul>
                {ANNOUNCEMENTS.map((a) => (
                  <li key={a.id} className="flex gap-3 border-b border-[var(--atr-border)] px-4 py-3 last:border-0">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--atr-surface-2)] text-[var(--atr-accent)]">
                      <Icon name={a.icon} size={14} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--atr-faint)]">{a.tag}</span>
                        <span className="font-mono text-[10px] text-[var(--atr-faint)]">· {a.time}</span>
                      </div>
                      <div className="mt-0.5 text-[12.5px] font-semibold text-[var(--atr-ink)]">{a.title}</div>
                      <div className="mt-0.5 text-[12px] leading-relaxed text-[var(--atr-muted)]">{a.body}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- subviews --- */

function PendingCard({ item, onOpen }: { item: PendingItem; onOpen: () => void }) {
  return (
    <GlassCard hover className="flex items-center gap-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
        <Icon name={item.icon} size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-semibold text-[var(--atr-ink)]">{item.title}</span>
          {item.urgent && <Badge tone="down">Today</Badge>}
        </div>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--atr-muted)]">{item.detail}</p>
      </div>
      <button
        onClick={onOpen}
        className="shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(91,74,255,0.5)] transition-all hover:brightness-[1.06]"
        style={{ backgroundImage: ATR_GRADIENT }}
      >
        {item.cta}
      </button>
    </GlassCard>
  );
}

function HandledRow({ item, onOpen }: { item: HandledItem; onOpen: () => void }) {
  return (
    <li>
      <button onClick={onOpen} className="flex w-full items-center gap-3 border-b border-[var(--atr-border)] px-4 py-3 text-left transition-colors last:border-0 hover:bg-[var(--atr-surface-2)]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf3] text-[var(--atr-up)]">
          <Icon name="checkCircle" size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-[var(--atr-ink)]">{item.title}</div>
          <div className="truncate text-[12px] text-[var(--atr-muted)]">{item.detail}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[11px] font-medium text-[var(--atr-up)]">+{item.savedMins}m</div>
          <div className="font-mono text-[10px] text-[var(--atr-faint)]">{item.time}</div>
        </div>
      </button>
    </li>
  );
}

function formatSaved(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
