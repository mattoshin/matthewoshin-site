"use client";

import { useState } from "react";
import {
  ASSISTANT_PROMPTS,
  ASSISTANT_CAPABILITIES,
  ASSISTANT_THREAD,
  type ActionCard,
  type AssistantTurn,
  type AssistantCapability,
} from "@/data/atrium-modules-demo";
import { ATRIUM_USER, MODULE_LABELS } from "@/data/atrium-demo";
import {
  GlassCard,
  AtriumMark,
  AIBlock,
  ChatBubble,
  Chip,
  Button,
  Icon,
  Badge,
  GradientText,
  Eyebrow,
  ATR_GRADIENT,
} from "../AtriumKit";
import { useAtriumNav } from "../nav-context";

/**
 * Assistant - "Ask Atrium", the AI assistant as a full chat surface that acts
 * across every module. Two states: a centered welcome hero (gradient mark,
 * capability cards, prompt chips) and a scripted conversation that shows the
 * assistant taking real action in other modules. The inline ActionCards under
 * each AI turn are the showpiece: they deep-link into Legal, the App Hub, People,
 * and Home, demonstrating cross-module agency. A composer is pinned at the bottom
 * of the module area; sending (button or Enter) starts the scripted thread.
 */
export default function Assistant() {
  const go = useAtriumNav();
  const [started, setStarted] = useState(false);
  const [value, setValue] = useState("");

  function send() {
    if (!value.trim()) return;
    setValue("");
    setStarted(true);
  }

  /** A prompt chip drops its text into the composer so the user can send it. */
  function seed(prompt: string) {
    setValue(prompt);
  }

  function reset() {
    setStarted(false);
    setValue("");
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      {/* message / welcome region - the scrollable part */}
      <div className="flex-1 overflow-y-auto">
        {started ? <Conversation go={go} onReset={reset} /> : <Welcome onSeed={seed} />}
      </div>

      {/* composer - pinned at the bottom of the module area, not the viewport */}
      <div className="sticky bottom-0 mt-4 pt-3">
        <GlassCard padded={false} className="flex items-center gap-2 p-2 pl-4">
          <Icon name="sparkles" size={16} className="shrink-0 text-[var(--atr-accent)]" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                send();
              }
            }}
            placeholder={`Ask Atrium anything, ${ATRIUM_USER.firstName}. It can act across every tool.`}
            className="min-w-0 flex-1 bg-transparent py-2 text-[14px] text-[var(--atr-ink)] outline-none placeholder:text-[var(--atr-faint)]"
            aria-label="Message Atrium"
          />
          <Button icon="send" onClick={send} disabled={!value.trim()} className="shrink-0">
            Send
          </Button>
        </GlassCard>
        <p className="mt-2 text-center text-[11px] text-[var(--atr-faint)]">
          Atrium can take action in IT, Legal, People, and your apps. It always asks before anything irreversible.
        </p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- welcome --- */

function Welcome({ onSeed }: { onSeed: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-2 pt-8 text-center sm:pt-12">
      {/* gradient mark with a soft sparkle halo */}
      <div className="relative">
        <span
          className="absolute -inset-3 rounded-[24px] opacity-25 blur-2xl"
          style={{ background: ATR_GRADIENT }}
          aria-hidden="true"
        />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/70 shadow-[0_10px_30px_-12px_rgba(91,74,255,0.4)] backdrop-blur-xl">
          <AtriumMark size={38} />
        </span>
      </div>

      <Eyebrow className="mt-5">Ask Atrium</Eyebrow>
      <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight text-[var(--atr-ink)] sm:text-[34px]">
        How can I help, <GradientText>{ATRIUM_USER.firstName}</GradientText>?
      </h2>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-[var(--atr-muted)]">
        One assistant for your whole workspace. I can fix IT issues, get you access, answer policy questions, and take
        action across every tool, not just point you to a link.
      </p>

      {/* capability cards */}
      <div className="mt-7 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {ASSISTANT_CAPABILITIES.map((cap) => (
          <CapabilityCard key={cap.title} cap={cap} />
        ))}
      </div>

      {/* prompt chips */}
      <div className="mt-7 w-full">
        <p className="mb-2.5 text-[12px] font-medium text-[var(--atr-faint)]">Try one of these</p>
        <div className="flex flex-wrap justify-center gap-2">
          {ASSISTANT_PROMPTS.map((p) => (
            <Chip key={p} onClick={() => onSeed(p)}>
              {p}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

function CapabilityCard({ cap }: { cap: AssistantCapability }) {
  return (
    <GlassCard padded={false} hover className="text-left">
      <div className="flex items-start gap-3 p-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: ATR_GRADIENT }}
        >
          <Icon name={cap.icon} size={17} />
        </span>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-[var(--atr-ink)]">{cap.title}</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--atr-muted)]">{cap.desc}</p>
        </div>
      </div>
    </GlassCard>
  );
}

/* ------------------------------------------------------------ conversation --- */

function Conversation({ go, onReset }: { go: (id: ActionCard["module"]) => void; onReset: () => void }) {
  // Tally what Atrium did across the thread, for the closing recap. Pure derive,
  // computed from the scripted data: no clocks, no randomness.
  const actionsTaken = ASSISTANT_THREAD.reduce((n, t) => n + (t.actions?.length ?? 0), 0);
  const modulesTouched = new Set(
    ASSISTANT_THREAD.flatMap((t) => (t.actions ?? []).map((a) => MODULE_LABELS[a.module])),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-1 pt-2">
      {/* live-session header: status on the left, reset on the right */}
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex min-w-0 items-center gap-2">
          <Badge tone="accent" dot>
            Live session
          </Badge>
          <span className="hidden truncate text-[11px] text-[var(--atr-faint)] sm:inline">
            Atrium is acting across your tools in real time
          </span>
        </div>
        <Button variant="ghost" size="sm" icon="plus" onClick={onReset} className="shrink-0">
          New chat
        </Button>
      </div>

      {ASSISTANT_THREAD.map((turn, i) => (
        <Turn key={i} turn={turn} go={go} />
      ))}

      {/* closing recap: the cross-module agency, summed up */}
      <AIBlock tag="Session recap" footer="You only had to ask once. Atrium handled the rest.">
        In this conversation Atrium took{" "}
        <strong className="font-semibold text-[var(--atr-ink)]">{actionsTaken} actions</strong> across{" "}
        <strong className="font-semibold text-[var(--atr-ink)]">{modulesTouched.size} of your tools</strong>:{" "}
        {[...modulesTouched].join(" · ")}. Everything irreversible still waits for your sign-off.
      </AIBlock>
    </div>
  );
}

function Turn({ turn, go }: { turn: AssistantTurn; go: (id: ActionCard["module"]) => void }) {
  return (
    <div className="space-y-2.5">
      <ChatBubble role={turn.role}>{turn.text}</ChatBubble>

      {turn.role === "ai" && turn.actions && turn.actions.length > 0 && (
        <div className="ml-[38px] space-y-2">
          {turn.actions.map((action, i) => (
            <ActionRow key={i} action={action} onOpen={() => go(action.module)} />
          ))}
        </div>
      )}
    </div>
  );
}

/** The cross-module agency wow: a compact glass card showing what Atrium did in
 *  another module, with a one-click jump to where the work landed. */
function ActionRow({ action, onOpen }: { action: ActionCard; onOpen: () => void }) {
  return (
    <div className="group relative overflow-hidden rounded-[14px] border border-[var(--atr-glass-border)] bg-[var(--atr-glass)] p-3 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-16px_rgba(91,74,255,0.32)]">
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: ATR_GRADIENT }} aria-hidden="true" />
      <div className="flex items-center gap-3 pl-1.5">
        {/* icon tile */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
          <Icon name={action.icon} size={17} />
        </span>

        <div className="min-w-0 flex-1">
          <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--atr-faint)]">
            <Icon name="checkCircle" size={11} className="text-[var(--atr-up)]" />
            Done in {MODULE_LABELS[action.module]}
          </span>
          <p className="mt-0.5 truncate text-[13px] font-semibold text-[var(--atr-ink)]">{action.label}</p>
          <p className="mt-0.5 truncate text-[12px] leading-relaxed text-[var(--atr-muted)]">{action.detail}</p>
        </div>

        <Button variant="outline" size="sm" iconRight="arrowRight" onClick={onOpen} className="shrink-0">
          View
        </Button>
      </div>
    </div>
  );
}
