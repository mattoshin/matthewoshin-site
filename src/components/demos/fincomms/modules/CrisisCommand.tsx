"use client";

import { useState } from "react";
import {
  CRISIS_SCENARIOS,
  CRISIS_RESPONSE,
  CRISIS_DOC_TYPES,
} from "@/data/fincomms-modules-demo";
import {
  Card,
  AIBlock,
  Badge,
  Button,
  Icon,
  SegmentedTabs,
  ProseSections,
  cx,
} from "../FcKit";

/**
 * CrisisCommand - the crisis-response war room. Simulate a scenario to forecast
 * its market/media/investor impact and get a recommended response playbook, or
 * draft a specific response document. All AI output carries the provenance block.
 */

type View = "simulate" | "draft";

export default function CrisisCommand() {
  const [view, setView] = useState<View>("simulate");
  const [selectedId, setSelectedId] = useState(CRISIS_SCENARIOS[0].id);
  const [docType, setDocType] = useState(CRISIS_DOC_TYPES[0]);

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--fc-accent-wash)] text-[var(--fc-accent)]">
          <Icon name="shield" size={18} />
        </span>
        <h2 className="text-base font-semibold tracking-tight text-[var(--fc-ink)]">Crisis Command Center</h2>
        <div className="ml-auto">
          <SegmentedTabs
            tabs={[
              { id: "simulate", label: "Simulate" },
              { id: "draft", label: "Draft" },
            ]}
            value={view}
            onChange={setView}
          />
        </div>
      </div>

      {view === "simulate" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          {/* scenario selector */}
          <div className="space-y-3">
            <div className="space-y-2">
              {CRISIS_SCENARIOS.map((s) => {
                const active = s.id === selectedId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedId(s.id)}
                    aria-pressed={active}
                    className={cx(
                      "w-full rounded-[10px] border bg-[var(--fc-card)] p-3 text-left transition-colors",
                      active
                        ? "border-l-2 border-[var(--fc-accent)] bg-[var(--fc-accent-wash)]"
                        : "border-[var(--fc-border)] hover:border-[var(--fc-border-strong)]",
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={cx(
                          "mt-0.5 shrink-0",
                          active ? "text-[var(--fc-accent)]" : "text-[var(--fc-muted)]",
                        )}
                      >
                        <Icon name={s.icon} size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-semibold text-[var(--fc-ink)]">{s.title}</span>
                          <Badge tone={s.severity === "Severe" ? "down" : "neutral"}>{s.severity}</Badge>
                        </div>
                        <p className="mt-1 text-[11.5px] leading-snug text-[var(--fc-muted)]">{s.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <Button variant="accent" icon="play" className="w-full">Run simulation</Button>
          </div>

          {/* response panel */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Price risk", value: CRISIS_RESPONSE.impact.priceRisk },
                { label: "Media sentiment", value: CRISIS_RESPONSE.impact.mediaSentiment },
                { label: "Investor concern", value: CRISIS_RESPONSE.impact.investorConcern },
              ].map((m) => (
                <Card key={m.label}>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--fc-faint)]">{m.label}</div>
                  <div className="mt-1.5 text-[12.5px] font-medium leading-snug text-[var(--fc-ink)]">{m.value}</div>
                </Card>
              ))}
            </div>
            <AIBlock title={"Recommended response · " + CRISIS_RESPONSE.scenario}>
              <ProseSections sections={CRISIS_RESPONSE.sections} />
            </AIBlock>
          </div>
        </div>
      )}

      {view === "draft" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedTabs
              size="sm"
              tabs={CRISIS_DOC_TYPES.map((d) => ({ id: d, label: d }))}
              value={docType}
              onChange={setDocType}
            />
            <Button variant="ink" icon="sparkles" className="ml-auto">Generate draft</Button>
          </div>
          <AIBlock
            title={docType}
            footer={
              <div className="flex items-center justify-between">
                <span>Drafted on-voice and grounded in the {CRISIS_RESPONSE.scenario.toLowerCase()} playbook.</span>
                <span className="flex items-center gap-2">
                  <button className="rounded p-1 hover:bg-[var(--fc-surface-2)]"><Icon name="copy" size={14} /></button>
                  <button className="rounded p-1 hover:bg-[var(--fc-surface-2)]"><Icon name="download" size={14} /></button>
                </span>
              </div>
            }
          >
            <ProseSections sections={[CRISIS_RESPONSE.sections[0]]} />
          </AIBlock>
        </div>
      )}
    </div>
  );
}
