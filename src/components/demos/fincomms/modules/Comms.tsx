"use client";

import { useState } from "react";
import {
  COMMS_TEMPLATES,
  COMMS_DRAFT,
  NARRATIVE_DOCS,
  NARRATIVE_RESULT,
} from "@/data/fincomms-modules-demo";
import {
  Card,
  SegmentedTabs,
  SectionHeading,
  AIBlock,
  ProseSections,
  Button,
  Icon,
  cx,
} from "../BeaconKit";

/**
 * Comms - Corporate Comms workspace. Two views: a press-release generator (pick a
 * template, add context, generate an on-voice draft) and a narrative consistency
 * checker that scores cross-document alignment and surfaces conflicts.
 */
type View = "press" | "narrative";

const VIEW_TABS = [
  { id: "press" as const, label: "Press Release" },
  { id: "narrative" as const, label: "Narrative Checker" },
];

export default function Comms() {
  const [view, setView] = useState<View>("press");

  return (
    <div className="space-y-5">
      <SegmentedTabs tabs={VIEW_TABS} value={view} onChange={setView} />
      {view === "press" ? <PressRelease /> : <NarrativeChecker />}
    </div>
  );
}

/* ------------------------------------------------------------ press release --- */

function PressRelease() {
  const [selectedId, setSelectedId] = useState<string>("earnings");

  return (
    <div className="space-y-5">
      <section>
        <SectionHeading
          title="Choose a template"
          hint="On-voice templates grounded in your company profile and recent filings."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {COMMS_TEMPLATES.map((t) => {
            const active = t.id === selectedId;
            return (
              <button key={t.id} onClick={() => setSelectedId(t.id)} className="text-left">
                <Card
                  hover
                  className={cx(
                    "h-full transition-colors",
                    active
                      ? "border-[var(--fc-accent)] bg-[var(--fc-accent-wash)]"
                      : "hover:border-[var(--fc-border-strong)]",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cx(
                        "text-[13px] font-semibold",
                        active ? "text-[var(--fc-accent)]" : "text-[var(--fc-ink)]",
                      )}
                    >
                      {t.name}
                    </span>
                    {active && <Icon name="check" size={15} className="shrink-0 text-[var(--fc-accent)]" />}
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--fc-muted)]">{t.blurb}</p>
                </Card>
              </button>
            );
          })}
        </div>
      </section>

      <Card>
        <label className="text-[12px] font-semibold text-[var(--fc-ink)]">Context</label>
        <textarea
          disabled
          placeholder="Add specific details or context..."
          rows={3}
          className="mt-2 w-full resize-none rounded-lg border border-[var(--fc-border)] bg-[var(--fc-bg)] px-3 py-2 text-[13px] text-[var(--fc-muted)] placeholder:text-[var(--fc-faint)] focus:outline-none"
        />
        <div className="mt-3 flex justify-end">
          <Button variant="accent" icon="sparkles">Generate press release</Button>
        </div>
      </Card>

      <AIBlock
        title="Generated press release"
        footer={
          <div className="flex items-center justify-between">
            <span>Drafted on-voice from the earnings-release template and FY26 guidance.</span>
            <span className="flex items-center gap-2">
              <button className="rounded p-1 hover:bg-[var(--fc-surface-2)]"><Icon name="copy" size={14} /></button>
              <button className="rounded p-1 hover:bg-[var(--fc-surface-2)]"><Icon name="download" size={14} /></button>
            </span>
          </div>
        }
      >
        <ProseSections sections={COMMS_DRAFT} />
      </AIBlock>
    </div>
  );
}

/* --------------------------------------------------------- narrative check --- */

function NarrativeChecker() {
  return (
    <div className="space-y-5">
      <section>
        <SectionHeading
          title="Documents in scope"
          hint="Financial Comms checks these for a consistent message, numbers, and tone."
        />
        <div className="space-y-3">
          {NARRATIVE_DOCS.map((d) => (
            <Card key={d.name}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--fc-ink)]">{d.name}</div>
                  <p className="mt-1 truncate text-[12px] text-[var(--fc-muted)]">{d.excerpt}</p>
                </div>
                <button className="shrink-0 rounded p-1 text-[var(--fc-faint)] hover:bg-[var(--fc-surface-2)] hover:text-[var(--fc-ink)]">
                  <Icon name="close" size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" icon="plus">Add document</Button>
          <Button variant="ink">Check narrative consistency</Button>
        </div>
      </section>

      <section>
        <SectionHeading title="Consistency result" />
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium text-[var(--fc-muted)]">Consistency score</p>
              <div className="mt-1 font-mono text-[40px] font-semibold leading-none tabular-nums text-[var(--fc-ink)]">
                {NARRATIVE_RESULT.score}
                <span className="ml-1 text-[16px] text-[var(--fc-faint)]">/100</span>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--fc-surface-2)]">
            <span className="block h-full rounded-full bg-[var(--fc-accent)]" style={{ width: `${NARRATIVE_RESULT.score}%` }} />
          </div>

          <AIBlock className="mt-4">{NARRATIVE_RESULT.tone}</AIBlock>

          <div className="mt-4">
            <p className="text-[12px] font-semibold text-[var(--fc-ink)]">Conflicts found</p>
            <ul className="mt-2 space-y-3">
              {NARRATIVE_RESULT.conflicts.map((c, i) => (
                <li key={i} className="flex gap-2.5">
                  <span
                    className="mt-0.5 shrink-0"
                    style={{ color: c.severity === "high" ? "var(--fc-down)" : "var(--fc-warn)" }}
                  >
                    <Icon name="alert" size={16} />
                  </span>
                  <span className="text-[13px] leading-relaxed text-[var(--fc-ink-2)]">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}
