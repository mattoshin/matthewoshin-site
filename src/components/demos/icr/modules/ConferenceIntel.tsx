"use client";

import { ACTIVE_COMPANY } from "@/data/icr-demo";
import { CONFERENCES, CONFERENCE_PREP, SOCIAL_SENTIMENT } from "@/data/icr-modules-demo";
import {
  Card,
  SectionHeading,
  AIBlock,
  Badge,
  Button,
  ProseSections,
  CompanyHeader,
} from "../BeaconKit";

/**
 * ConferenceIntel - upcoming investor-conference schedule, AI conference-prep, and
 * live social-sentiment on the focal company. Static, sample-data showcase.
 */
export default function ConferenceIntel() {
  const s = SOCIAL_SENTIMENT;
  const total = s.bullish + s.neutral + s.bearish || 1;
  const segs = [
    { v: s.bullish, c: "var(--icr-up)", l: "Bullish" },
    { v: s.neutral, c: "var(--icr-warn)", l: "Neutral" },
    { v: s.bearish, c: "var(--icr-down)", l: "Bearish" },
  ];
  const toneFor = (t: "bull" | "bear" | "neutral") =>
    t === "bull" ? "up" : t === "bear" ? "down" : "neutral";

  return (
    <div className="space-y-5">
      <CompanyHeader
        company={ACTIVE_COMPANY}
        right={<Button variant="outline" size="sm" icon="sparkles">Generate prep</Button>}
      />

      {/* conferences + prep */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeading title="Upcoming conferences" />
          <ul className="space-y-3">
            {CONFERENCES.map((c) => (
              <li
                key={c.name}
                className="rounded-lg border border-[var(--icr-border)] bg-[var(--icr-recessed)] p-3"
              >
                <div className="text-[13px] font-semibold text-[var(--icr-ink)]">{c.name}</div>
                <div className="mt-0.5 text-[11.5px] text-[var(--icr-muted)]">
                  {c.date} · {c.location}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.attending.split(",").map((t) => (
                    <Badge key={t.trim()} tone="neutral">{t.trim()}</Badge>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <AIBlock title="Conference prep">
          <ProseSections sections={CONFERENCE_PREP} />
        </AIBlock>
      </div>

      {/* social sentiment */}
      <Card>
        <SectionHeading
          title="Social sentiment"
          right={
            <span className="font-mono text-[12px] tabular-nums text-[var(--icr-muted)]">
              {s.mentions24h.toLocaleString()} mentions / 24h
            </span>
          }
        />
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--icr-surface-2)]">
          {segs.map((g) => (
            <span key={g.l} style={{ width: `${(g.v / total) * 100}%`, background: g.c }} />
          ))}
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[var(--icr-muted)]">
          {segs.map((g) => (
            <span key={g.l} className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.c }} />
              {g.l} <span className="font-mono tabular-nums text-[var(--icr-ink-2)]">{g.v}</span>
            </span>
          ))}
        </div>

        <ul className="mt-4 space-y-2.5">
          {s.recent.map((m, i) => (
            <li
              key={i}
              className="flex items-start gap-3 border-t border-[var(--icr-border)] pt-2.5 first:border-0 first:pt-0"
            >
              <span className="font-mono text-[12px] font-medium text-[var(--icr-accent)]">{m.handle}</span>
              <span className="min-w-0 flex-1 text-[13px] leading-relaxed text-[var(--icr-ink-2)]">{m.text}</span>
              <Badge tone={toneFor(m.tone)}>{m.tone}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
