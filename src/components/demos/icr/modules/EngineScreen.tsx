"use client";

import { ENGINES, type Engine, type EngineStat } from "@/data/icr-engines-demo";
import type { ModuleId } from "@/data/icr-demo";
import {
  Card,
  SectionHeading,
  AIBlock,
  ProseSections,
  Badge,
  Button,
  EmptyState,
  cx,
} from "../BeaconKit";

/**
 * EngineScreen - one shared, data-driven screen for the Capital Markets + Comms
 * engines (earnings prep, shareholder matching, media monitoring, newsjacking,
 * and the rest). Each engine's content lives in icr-engines-demo.ts; this renders
 * the request inputs, key stats, the AI output, and an optional ranked table.
 * Static, sample-data showcase; nothing talks to a server.
 */
function toneClass(tone?: EngineStat["tone"]) {
  if (tone === "up") return "text-[var(--icr-up)]";
  if (tone === "down") return "text-[var(--icr-down)]";
  return "text-[var(--icr-ink)]";
}

export default function EngineScreen({ engine }: { engine: ModuleId }) {
  const e: Engine | undefined = ENGINES[engine];
  if (!e) {
    return (
      <EmptyState
        title="Engine coming soon"
        body="This module isn't wired into the demo yet."
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* header: service line + what it does + run */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge tone="accent">{e.serviceLine}</Badge>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-[var(--icr-ink-2)]">
              {e.summary}
            </p>
          </div>
          <Button variant="ink" size="sm" icon="sparkles">
            {e.cta}
          </Button>
        </div>
      </Card>

      {/* inputs + key stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <SectionHeading title={e.inputLabel} />
          <ul className="space-y-2.5">
            {e.inputs.map((it) => (
              <li
                key={it.label}
                className="flex items-start justify-between gap-3 border-t border-[var(--icr-border)] pt-2.5 first:border-0 first:pt-0"
              >
                <span className="shrink-0 text-[11px] uppercase tracking-wide text-[var(--icr-faint)]">
                  {it.label}
                </span>
                <span className="min-w-0 flex-1 text-right text-[13px] text-[var(--icr-ink-2)]">
                  {it.value}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {e.stats.map((s) => (
            <Card key={s.label} className="flex flex-col justify-center">
              <div className="text-[11px] uppercase tracking-wide text-[var(--icr-faint)]">
                {s.label}
              </div>
              <div className={cx("mt-1 font-mono text-xl font-semibold tabular-nums", toneClass(s.tone))}>
                {s.value}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI output */}
      <AIBlock title={e.output.title} tag={e.output.tag ?? "AI"}>
        <ProseSections sections={e.output.sections} />
      </AIBlock>

      {/* optional ranked table */}
      {e.table && (
        <Card>
          <SectionHeading title={e.table.title} />
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--icr-border)] text-[11px] uppercase tracking-wide text-[var(--icr-faint)]">
                  {e.table.columns.map((c) => (
                    <th
                      key={c.key}
                      className={cx("py-2 font-medium", c.align === "right" ? "text-right" : "text-left")}
                    >
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {e.table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--icr-border)] last:border-0">
                    {e.table!.columns.map((c) => (
                      <td
                        key={c.key}
                        className={cx(
                          "py-2.5 text-[var(--icr-ink-2)]",
                          c.align === "right" ? "text-right font-mono tabular-nums" : "text-left",
                        )}
                      >
                        {row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
