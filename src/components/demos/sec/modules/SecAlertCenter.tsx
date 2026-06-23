"use client";

import { useState } from "react";
import {
  SEC_ALERTS,
  CHANNEL_ROWS,
  DEFAULT_CHANNEL_MATRIX,
  ALERT_RULES,
} from "@/data/sec-modules-demo";
import { SEC_CHANNELS } from "@/data/sec-demo";
import {
  Card,
  Badge,
  Icon,
  SectionHeading,
  SegmentedTabs,
  SeverityFlag,
  ChannelMatrix,
  Button,
  CHANNEL_META,
  type Channel,
  cx,
} from "../SecKit";

/**
 * SecAlertCenter - the signature surface. Three views: an inbox of fired alerts, the
 * Channel Router (an alert-type x delivery-channel toggle matrix, including a column
 * that fans structured events to your downstream AI agents), and the rule builder.
 * All state is local to the demo.
 */
type Tab = "inbox" | "router" | "rules";

export default function SecAlertCenter() {
  const [tab, setTab] = useState<Tab>("inbox");
  const [matrix, setMatrix] = useState<Record<string, Channel[]>>(() =>
    Object.fromEntries(Object.entries(DEFAULT_CHANNEL_MATRIX).map(([k, v]) => [k, [...v]])),
  );
  const [read, setRead] = useState<Set<string>>(() => new Set(SEC_ALERTS.filter((a) => a.read).map((a) => a.id)));
  const [ruleOn, setRuleOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ALERT_RULES.map((r) => [r.id, r.enabled])),
  );

  const unread = SEC_ALERTS.filter((a) => !read.has(a.id)).length;

  const toggleCell = (rowId: string, channel: Channel) =>
    setMatrix((m) => {
      const cur = m[rowId] ?? [];
      const next = cur.includes(channel) ? cur.filter((c) => c !== channel) : [...cur, channel];
      return { ...m, [rowId]: next };
    });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedTabs<Tab>
          tabs={[
            { id: "inbox", label: "Inbox", count: unread },
            { id: "router", label: "Channel router" },
            { id: "rules", label: "Rules", count: ALERT_RULES.length },
          ]}
          value={tab}
          onChange={setTab}
        />
        {tab === "inbox" && (
          <Button variant="ghost" size="sm" icon="check" onClick={() => setRead(new Set(SEC_ALERTS.map((a) => a.id)))}>
            Mark all read
          </Button>
        )}
      </div>

      {tab === "inbox" && <Inbox read={read} onRead={(id) => setRead((s) => new Set(s).add(id))} />}
      {tab === "router" && <Router matrix={matrix} onToggle={toggleCell} />}
      {tab === "rules" && <Rules ruleOn={ruleOn} onToggle={(id) => setRuleOn((r) => ({ ...r, [id]: !r[id] }))} />}
    </div>
  );
}

/* ---------------------------------------------------------------- inbox --- */

function Inbox({ read, onRead }: { read: Set<string>; onRead: (id: string) => void }) {
  return (
    <div className="space-y-2.5">
      {SEC_ALERTS.map((a) => {
        const isRead = read.has(a.id);
        return (
          <button
            key={a.id}
            onClick={() => onRead(a.id)}
            className={cx(
              "flex w-full items-start gap-3 rounded-[12px] border px-4 py-3 text-left transition-colors",
              isRead
                ? "border-[var(--sec-border)] bg-[var(--sec-card)] hover:bg-[var(--sec-surface-2)]"
                : "border-[var(--sec-border-strong)] bg-[var(--sec-surface-2)]",
            )}
          >
            <span className={cx("mt-1.5 h-2 w-2 shrink-0 rounded-full", isRead ? "bg-transparent" : "bg-[var(--sec-accent)]")} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] font-semibold text-[var(--sec-accent)]">{a.ticker}</span>
                <span className="text-[13px] font-semibold text-[var(--sec-ink)]">{a.title}</span>
                <SeverityFlag severity={a.severity} withLabel={false} />
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--sec-muted)]">{a.body}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sec-faint)]">Routed to</span>
                <span className="flex items-center gap-1.5">
                  {a.delivered.map((ch) => (
                    <span key={ch} title={CHANNEL_META[ch].label} className={cx("flex h-5 w-5 items-center justify-center rounded-md border", ch === "agent" ? "border-[var(--sec-accent)]/40 bg-[var(--sec-accent-wash)] text-[var(--sec-accent)]" : "border-[var(--sec-border)] bg-[var(--sec-recessed)] text-[var(--sec-muted)]")}>
                      <Icon name={CHANNEL_META[ch].icon} size={11} />
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--sec-faint)]">{a.time}</span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- router --- */

function Router({ matrix, onToggle }: { matrix: Record<string, Channel[]>; onToggle: (rowId: string, channel: Channel) => void }) {
  return (
    <div className="space-y-5">
      <section>
        <SectionHeading title="Connected channels" hint="Where SEC Intelligence can reach you and your systems." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEC_CHANNELS.map((ch) => (
            <Card key={ch.channel} className="flex items-center gap-3">
              <span className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", ch.channel === "agent" ? "bg-[var(--sec-accent-wash)] text-[var(--sec-accent)]" : "bg-[var(--sec-surface-2)] text-[var(--sec-ink-2)]")}>
                <Icon name={CHANNEL_META[ch.channel].icon} size={17} />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[var(--sec-ink)]">{ch.label}</span>
                  <Badge tone="up" dot>connected</Badge>
                </div>
                <div className="truncate text-[11px] text-[var(--sec-muted)]">{ch.detail}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title="Channel router"
          hint="Pick where each kind of filing event goes. Toggle any cell. The Agent column streams the structured event to your downstream AI agents."
        />
        <ChannelMatrix rows={CHANNEL_ROWS} value={matrix} onToggle={onToggle} />
        <div className="mt-3 flex items-start gap-2 rounded-[10px] border border-[var(--sec-accent)]/25 bg-[var(--sec-accent-wash)] px-3 py-2.5 text-[12px] leading-relaxed text-[var(--sec-ink-2)]">
          <Icon name="webhook" size={15} className="mt-px shrink-0 text-[var(--sec-accent)]" />
          <span>
            <strong className="font-semibold text-[var(--sec-ink)]">Agent delivery</strong> posts a structured JSON filing event to your webhook or MCP server, so a downstream AI agent can act on it: draft the client note, update the model, or open a task. The material row calls your phone; everything routes to your agents.
          </span>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- rules --- */

function Rules({ ruleOn, onToggle }: { ruleOn: Record<string, boolean>; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <SectionHeading title="Alert rules" hint="Each rule maps a filing pattern to a set of channels. Set them once; the terminal runs them." />
      {ALERT_RULES.map((r) => {
        const on = ruleOn[r.id];
        return (
          <Card key={r.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13.5px] font-semibold text-[var(--sec-ink)]">{r.name}</span>
                <Badge tone="neutral">{r.scope}</Badge>
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--sec-muted)]">{r.trigger}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  {r.channels.map((ch) => (
                    <span key={ch} title={CHANNEL_META[ch].label} className={cx("flex h-5 w-5 items-center justify-center rounded-md border", ch === "agent" ? "border-[var(--sec-accent)]/40 bg-[var(--sec-accent-wash)] text-[var(--sec-accent)]" : "border-[var(--sec-border)] bg-[var(--sec-recessed)] text-[var(--sec-muted)]")}>
                      <Icon name={CHANNEL_META[ch].icon} size={11} />
                    </span>
                  ))}
                </span>
                <span className="text-[11px] text-[var(--sec-faint)]">Last fired {r.lastFired}</span>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={on}
              aria-label={`Toggle ${r.name}`}
              onClick={() => onToggle(r.id)}
              className={cx(
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors",
                on ? "border-[var(--sec-accent)] bg-[var(--sec-accent)]" : "border-[var(--sec-border-strong)] bg-[var(--sec-recessed)]",
              )}
            >
              <span className={cx("inline-block h-4 w-4 rounded-full bg-white transition-transform", on ? "translate-x-[22px]" : "translate-x-[3px]")} />
            </button>
          </Card>
        );
      })}
      <button className="flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[var(--sec-border-strong)] py-3 text-[13px] font-medium text-[var(--sec-muted)] transition-colors hover:border-[var(--sec-accent)] hover:text-[var(--sec-accent)]">
        <Icon name="plus" size={15} /> New rule
      </button>
    </div>
  );
}
