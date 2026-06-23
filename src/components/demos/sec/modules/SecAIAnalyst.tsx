"use client";

import { useState } from "react";
import { AI_PROMPTS, AI_THREADS, AI_THEMES, type AIThread, type AITheme } from "@/data/sec-modules-demo";
import {
  Card,
  Button,
  Badge,
  Chip,
  Icon,
  Prose,
  AIBlock,
  SegmentedTabs,
  SectionHeading,
  FormBadge,
  cx,
} from "../SecKit";

/**
 * SecAIAnalyst - the conversational centerpiece. An "Ask the analyst" panel pairs a
 * (demo-disabled) search-style prompt input and prompt starters with a grounded
 * conversation: each user question, an AIBlock answer, and a footer of cited filing
 * sources. The "AI themes" panel renders the cross-book AI-exposure tracker. All AI
 * content carries the accent-left-border AIBlock signature.
 */

type Tab = "ask" | "themes";

const TABS: ReadonlyArray<{ id: Tab; label: string; count?: number }> = [
  { id: "ask", label: "Ask the analyst" },
  { id: "themes", label: "AI themes", count: AI_THEMES.length },
];

function TrendBadge({ trend }: { trend: AITheme["trend"] }) {
  if (trend === "rising") return <Badge tone="up">▲ rising</Badge>;
  if (trend === "new") return <Badge tone="accent">new</Badge>;
  return <Badge tone="neutral">steady</Badge>;
}

function SourcePill({ source }: { source: AIThread["sources"][number] }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--sec-border)] bg-[var(--sec-surface-2)] px-2 py-1 text-[11px] text-[var(--sec-muted)]">
      <FormBadge form={source.form} />
      <span className="font-mono font-semibold text-[var(--sec-ink-2)]">{source.ticker}</span>
      <span className="text-[var(--sec-faint)]">{source.ref}</span>
    </span>
  );
}

function Thread({ thread }: { thread: AIThread }) {
  return (
    <div className="space-y-3">
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm border border-[var(--sec-border)] bg-[var(--sec-surface-2)] px-3.5 py-2 text-[13px] text-[var(--sec-ink)]">
        {thread.question}
      </div>
      <AIBlock
        title="Analyst"
        streaming={false}
        footer={
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 inline-flex items-center gap-1 text-[var(--sec-faint)]">
              <Icon name="link" size={12} /> Sources
            </span>
            {thread.sources.map((s, i) => (
              <SourcePill key={i} source={s} />
            ))}
          </div>
        }
      >
        <Prose>
          {thread.answer.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Prose>
      </AIBlock>
    </div>
  );
}

export default function SecAIAnalyst() {
  const [tab, setTab] = useState<Tab>("ask");
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="space-y-7">
      <SectionHeading
        title="AI analyst"
        hint="Ask anything about your filings in plain English. Every answer is grounded in the source documents and cites them."
        right={<SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />}
      />

      {tab === "ask" ? (
        <div className="space-y-6">
          {/* prompt input (demo-disabled, styled like the console search) */}
          <Card padded={false}>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5">
              <Icon name="sparkles" size={17} className="shrink-0 text-[var(--sec-accent)]" />
              <input
                disabled
                placeholder="Ask anything about your filings..."
                className="min-w-0 flex-1 cursor-not-allowed bg-transparent text-[13.5px] text-[var(--sec-ink)] placeholder:text-[var(--sec-faint)] focus:outline-none"
              />
              <Button variant="accent" size="sm" icon="send" disabled className="shrink-0">
                Ask
              </Button>
            </div>
          </Card>

          {/* prompt starters */}
          <div className="flex flex-wrap gap-2">
            {AI_PROMPTS.map((p) => (
              <Chip key={p} active={active === p} onClick={() => setActive(active === p ? null : p)}>
                {p}
              </Chip>
            ))}
          </div>

          {/* grounded conversation */}
          <div className="space-y-6">
            {AI_THREADS.map((t) => (
              <Thread key={t.id} thread={t} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <AIBlock
            tag="Theme tracker"
            title="What's moving in AI"
            footer="Synthesized across every filing on your book overnight"
          >
            AI capex acceleration is the rising cross-book theme this quarter, showing up as a growth driver in your
            semis, data-infra, and defense names. A second wave is the shift from AI as narrative to AI as a quantified
            revenue line, led by Pylon Data, while banks and staples add it defensively as a risk factor.
          </AIBlock>

          <p className="text-[13px] text-[var(--sec-muted)]">
            The theme tracker scans every filing for AI exposure across your book.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {AI_THEMES.map((th) => (
              <Card key={th.id} hover>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon name="lightbulb" size={16} className="shrink-0 text-[var(--sec-sec-ai)]" />
                    <span className="text-[13.5px] font-semibold leading-snug text-[var(--sec-ink)]">{th.title}</span>
                  </div>
                  <span className="shrink-0">
                    <TrendBadge trend={th.trend} />
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--sec-muted)]">{th.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {th.companies.map((tk) => (
                    <span
                      key={tk}
                      className="rounded bg-[var(--sec-surface-2)] px-1.5 py-0.5 font-mono text-[10.5px] text-[var(--sec-ink-2)]"
                    >
                      {tk}
                    </span>
                  ))}
                </div>
                <div className={cx("mt-3 border-t border-[var(--sec-border)] pt-2 text-[11px] text-[var(--sec-faint)]")}>
                  <span className="font-mono tabular-nums">{th.mentions}</span> mentions · last {th.lastSeen}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
