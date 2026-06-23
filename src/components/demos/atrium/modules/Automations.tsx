"use client";

import { useState } from "react";
import {
  AUTOMATIONS,
  AUTOMATION_RUNLOG,
  AUTOMATION_IMPACT,
  AUTOMATION_BUILDER,
  AUTOMATION_TEMPLATES,
  type Automation,
  type AutomationRun,
  type AutomationCategory,
} from "@/data/atrium-modules-demo";
import {
  GlassCard,
  Card,
  StatCard,
  AIBlock,
  Badge,
  Button,
  Icon,
  SectionHeading,
  UnderlineTabs,
  Toggle,
  Chip,
  TypingDots,
  ATR_GRADIENT,
  cx,
  type Tone,
} from "../AtriumKit";
import { useAtriumNav } from "../nav-context";

/**
 * Automations - the thesis made tangible: AI doing the busywork. Three tabs:
 * Active (the running automation gallery with live toggles), Create (the
 * plain-English builder showpiece: describe a workflow, watch Workplace AI compile it
 * into runnable steps with a dry-run preview), and Activity (the run log of what
 * Workplace AI did and the time it gave back). Mirrors the Home module's composition.
 */
type Tab = "active" | "create" | "activity";

const CATEGORY_TONE: Record<AutomationCategory, Tone> = {
  IT: "info",
  HR: "accent",
  Finance: "up",
  Legal: "warn",
  Productivity: "neutral",
};

export default function Automations() {
  const [tab, setTab] = useState<Tab>("active");

  const tabs = [
    { id: "active" as const, label: "Active", count: AUTOMATIONS.length },
    { id: "create" as const, label: "Create" },
    { id: "activity" as const, label: "Activity", count: AUTOMATION_RUNLOG.length },
  ];

  return (
    <div className="space-y-7">
      {/* header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--atr-faint)]">Automations</p>
          <h2 className="mt-1 text-[26px] font-extrabold tracking-tight text-[var(--atr-ink)]">The busywork, handled.</h2>
        </div>
        <Button variant="accent" size="sm" icon="plus" onClick={() => setTab("create")}>
          New automation
        </Button>
      </div>

      {/* impact stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Hours saved" value={`${AUTOMATION_IMPACT.hoursSavedMonth}h`} icon="clock" accent hint="this month" />
        <StatCard label="Runs" value={String(AUTOMATION_IMPACT.runsMonth)} icon="bolt" hint="this month" />
        <StatCard label="Active automations" value={String(AUTOMATION_IMPACT.activeCount)} icon="activity" hint="running for you" />
        <StatCard label="Success rate" value={`${AUTOMATION_IMPACT.successRate}%`} icon="checkCircle" hint="no manual fixes" />
      </div>

      <UnderlineTabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === "active" && <ActiveTab />}
      {tab === "create" && <CreateTab />}
      {tab === "activity" && <ActivityTab />}
    </div>
  );
}

/* --------------------------------------------------------------- active --- */

function ActiveTab() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(AUTOMATIONS.map((a) => [a.id, a.enabled])),
  );
  const liveCount = Object.values(enabled).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <SectionHeading
        title="Your automations"
        hint="Each one runs quietly in the background. Flip a switch to pause or resume."
        right={<Badge tone="accent" dot>{liveCount} live</Badge>}
      />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {AUTOMATIONS.map((a) => (
          <AutomationCard
            key={a.id}
            item={a}
            on={enabled[a.id]}
            onToggle={(next) => setEnabled((m) => ({ ...m, [a.id]: next }))}
          />
        ))}
      </div>
    </div>
  );
}

function AutomationCard({ item, on, onToggle }: { item: Automation; on: boolean; onToggle: (next: boolean) => void }) {
  return (
    <GlassCard hover className={cx("flex flex-col gap-3", !on && "opacity-60")}>
      <div className="flex items-start gap-3">
        <span
          className={cx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            on ? "text-white" : "bg-[var(--atr-surface-2)] text-[var(--atr-faint)]",
          )}
          style={on ? { backgroundImage: ATR_GRADIENT } : undefined}
        >
          <Icon name={item.icon} size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-semibold text-[var(--atr-ink)]">{item.name}</span>
            <Badge tone={CATEGORY_TONE[item.category]}>{item.category}</Badge>
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--atr-muted)]">
            When {item.trigger.replace(/^When /i, "")}, {lowerFirst(item.action)}.
          </p>
        </div>
        <Toggle on={on} onChange={onToggle} label={`Toggle ${item.name}`} />
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--atr-border)] pt-3 text-[11px] text-[var(--atr-faint)]">
        <span className="inline-flex items-center gap-1">
          <Icon name="users" size={12} /> {item.scope}
        </span>
        <span className="text-[var(--atr-border-strong)]">·</span>
        <span className="font-mono tabular-nums">{item.runsMonth} runs / mo</span>
        <span className="ml-auto inline-flex items-center gap-1 font-mono font-medium text-[var(--atr-up)]">
          <Icon name="clock" size={12} /> {item.savedHrsMonth}h saved
        </span>
      </div>
    </GlassCard>
  );
}

/* --------------------------------------------------------------- create --- */

function CreateTab() {
  const [text, setText] = useState<string>(AUTOMATION_BUILDER.prompt);
  const [generated, setGenerated] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const generate = () => {
    setEnabled(false);
    setGenerated(true);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* builder */}
      <div className="space-y-4 lg:col-span-2">
        <GlassCard className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ backgroundImage: ATR_GRADIENT }}>
              <Icon name="wand" size={15} />
            </span>
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--atr-ink)]">Describe a workflow</h3>
              <p className="text-[12px] text-[var(--atr-muted)]">Plain English. Workplace AI compiles it into a runnable automation.</p>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setGenerated(false);
            }}
            rows={3}
            placeholder="When a candidate accepts an offer, set up their first day for me"
            className="w-full resize-none rounded-[12px] border border-[var(--atr-border)] bg-[var(--atr-card)] px-3.5 py-3 text-[13.5px] leading-relaxed text-[var(--atr-ink)] outline-none placeholder:text-[var(--atr-faint)] focus:border-[var(--atr-accent)]"
          />

          <div className="flex flex-wrap gap-2">
            {AUTOMATION_TEMPLATES.map((t) => (
              <Chip
                key={t.id}
                active={text === t.desc}
                onClick={() => {
                  setText(t.desc);
                  setGenerated(false);
                }}
              >
                {t.title}
              </Chip>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-[var(--atr-faint)]">Tip: name a trigger and what should happen. Workplace AI fills in the rest.</span>
            <Button variant="accent" icon="sparkles" onClick={generate}>
              Generate workflow
            </Button>
          </div>
        </GlassCard>

        {!generated && (
          <Card className="flex items-center gap-3 border-dashed">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
              <Icon name="bolt" size={16} />
            </span>
            <p className="text-[12.5px] text-[var(--atr-muted)]">
              Your compiled workflow will appear here: the trigger, the steps Workplace AI will run, and a dry run against your real data, before anything goes live.
            </p>
          </Card>
        )}

        {generated && (
          <div className="space-y-4">
            <AIBlock
              title={AUTOMATION_BUILDER.trigger}
              tag="Compiled workflow"
              footer={`${AUTOMATION_BUILDER.steps.length} steps · compiled from your description · runs across IT, Legal, and HR`}
            >
              <ol className="space-y-2.5">
                {AUTOMATION_BUILDER.steps.map((s) => (
                  <li key={s.n} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold text-white"
                      style={{ backgroundImage: ATR_GRADIENT }}
                    >
                      {s.n}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-[var(--atr-ink)]">{s.label}</span>
                      <span className="block text-[12.5px] leading-relaxed text-[var(--atr-muted)]">{s.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </AIBlock>

            <AIBlock title="Dry run" tag="Preview">
              <p className="text-[var(--atr-ink-2)]">{AUTOMATION_BUILDER.dryRun.summary}</p>
              <div className="mt-2.5 rounded-[12px] border border-[var(--atr-border)] bg-[var(--atr-surface-2)] p-3">
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-[var(--atr-faint)]">
                  <Icon name="play" size={11} className="text-[var(--atr-accent)]" /> Sample run
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--atr-ink-2)]">{AUTOMATION_BUILDER.dryRun.sample}</p>
              </div>
            </AIBlock>

            <div className="flex items-center gap-3">
              <Button variant="accent" icon={enabled ? "check" : "bolt"} onClick={() => setEnabled(true)} disabled={enabled}>
                {enabled ? "Automation enabled" : "Enable automation"}
              </Button>
              {enabled ? (
                <Badge tone="up" dot>Live · running on your next hire</Badge>
              ) : (
                <span className="text-[12px] text-[var(--atr-muted)]">No code. You can pause it any time.</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* side: templates + how it works */}
      <div className="space-y-6">
        <section>
          <SectionHeading title="Start from a template" />
          <Card padded={false}>
            <ul>
              {AUTOMATION_TEMPLATES.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => {
                      setText(t.desc);
                      setGenerated(false);
                    }}
                    className="flex w-full items-start gap-3 border-b border-[var(--atr-border)] px-4 py-3 text-left transition-colors last:border-0 hover:bg-[var(--atr-surface-2)]"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
                      <Icon name={t.icon} size={14} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-semibold text-[var(--atr-ink)]">{t.title}</span>
                      <span className="block text-[12px] leading-relaxed text-[var(--atr-muted)]">{t.desc}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <GlassCard className="space-y-3">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-[var(--atr-ink)]">
            <Icon name="info" size={15} className="text-[var(--atr-accent)]" /> How it works
          </p>
          <ul className="space-y-2.5 text-[12.5px] leading-relaxed text-[var(--atr-muted)]">
            {[
              "Describe the outcome you want, not the integrations.",
              "Workplace AI maps it to your connected tools and permissions.",
              "Dry-run against real data before anything goes live.",
            ].map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--atr-accent)" }} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--atr-faint)]">
            <TypingDots /> Built on Workplace AI tool use
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- activity --- */

function ActivityTab() {
  const go = useAtriumNav();
  const totalMins = AUTOMATION_RUNLOG.reduce((s, r) => s + r.savedMins, 0);

  return (
    <div className="space-y-3">
      <SectionHeading
        title="Recent activity"
        hint="Everything Workplace AI ran for you, and the time it gave back."
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--atr-up)]/25 bg-[#ecfdf3] px-3 py-1 font-mono text-[12px] font-medium text-[var(--atr-up)]">
            <Icon name="clock" size={13} /> {formatSaved(totalMins)} saved
          </span>
        }
      />
      <Card padded={false}>
        <ul>
          {AUTOMATION_RUNLOG.map((r) => (
            <RunRow key={r.id} run={r} onOpen={() => go("home")} />
          ))}
        </ul>
      </Card>
    </div>
  );
}

function RunRow({ run, onOpen }: { run: AutomationRun; onOpen: () => void }) {
  return (
    <li>
      <button
        onClick={onOpen}
        className="flex w-full items-center gap-3 border-b border-[var(--atr-border)] px-4 py-3.5 text-left transition-colors last:border-0 hover:bg-[var(--atr-surface-2)]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf3] text-[var(--atr-up)]">
          <Icon name="checkCircle" size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-[var(--atr-ink)]">{run.automation}</div>
          <div className="truncate text-[12px] text-[var(--atr-muted)]">{run.detail}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[11px] font-medium text-[var(--atr-up)]">+{run.savedMins}m</div>
          <div className="font-mono text-[10px] text-[var(--atr-faint)]">{run.time}</div>
        </div>
      </button>
    </li>
  );
}

/* --------------------------------------------------------------- helpers --- */

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function formatSaved(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
