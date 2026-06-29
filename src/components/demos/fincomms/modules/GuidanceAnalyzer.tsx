import { ACTIVE_COMPANY } from "@/data/fincomms-demo";
import {
  GUIDANCE_SCENARIOS,
  GUIDANCE_PEERS,
  GUIDANCE_REC,
  type GuidancePeer,
} from "@/data/fincomms-modules-demo";
import {
  Card,
  CompanyHeader,
  SectionHeading,
  AIBlock,
  Badge,
  Button,
  DataTable,
  ProseSections,
} from "../BeaconKit";

/**
 * GuidanceAnalyzer - models conservative/base/optimistic revenue, margin, and FCF
 * paths for the focal company, benchmarks forward estimates against the peer set,
 * and surfaces an AI-authored guidance recommendation.
 */

type Tone = "neutral" | "accent" | "up" | "down" | "warn";

const TONE_BY_SCENARIO: Record<(typeof GUIDANCE_SCENARIOS)[number]["tone"], Tone> = {
  Conservative: "neutral",
  Base: "accent",
  Optimistic: "up",
};

const QUARTILE_TONE: Record<GuidancePeer["quartile"], Tone> = {
  1: "up",
  2: "neutral",
  3: "warn",
  4: "down",
};

export default function GuidanceAnalyzer() {
  return (
    <div className="space-y-7">
      <CompanyHeader
        company={ACTIVE_COMPANY}
        right={<Button variant="outline" size="sm" icon="refresh">Regenerate</Button>}
      />

      {/* scenarios */}
      <section>
        <SectionHeading title="Guidance scenarios" hint="Modeled revenue, margin, and FCF paths." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {GUIDANCE_SCENARIOS.map((s) => (
            <Card key={s.name}>
              <Badge tone={TONE_BY_SCENARIO[s.tone]}>{s.tone}</Badge>
              <h3 className="mt-2.5 text-[15px] font-semibold tracking-tight text-[var(--fc-ink)]">{s.name}</h3>
              <dl className="mt-3 space-y-2">
                {[
                  { label: "Revenue", value: s.revenue },
                  { label: "EBITDA margin", value: s.ebitdaMargin },
                  { label: "FCF", value: s.fcf },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between gap-3">
                    <dt className="text-[12px] text-[var(--fc-muted)]">{m.label}</dt>
                    <dd className="font-mono text-[13px] font-semibold tabular-nums text-[var(--fc-ink)]">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 border-t border-[var(--fc-border)] pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--fc-faint)]">Assumptions</p>
                <ul className="mt-2 space-y-1.5">
                  {s.assumptions.map((a, i) => (
                    <li key={i} className="flex gap-2 text-[12px] leading-snug text-[var(--fc-ink-2)]">
                      <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--fc-accent)]" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* peer benchmarking */}
      <section>
        <SectionHeading title="Peer benchmarking" />
        <DataTable<GuidancePeer>
          columns={[
            {
              key: "ticker",
              label: "Ticker",
              mono: true,
              render: (r) => (
                <span className={r.subject ? "font-semibold text-[var(--fc-accent)]" : undefined}>{r.ticker}</span>
              ),
            },
            { key: "name", label: "Name" },
            { key: "fwdRevGrowth", label: "Fwd rev growth", align: "right", mono: true },
            { key: "ebitdaTarget", label: "EBITDA target", align: "right", mono: true },
            {
              key: "quartile",
              label: "Quartile",
              render: (r) => <Badge tone={QUARTILE_TONE[r.quartile]}>{"Q" + r.quartile}</Badge>,
            },
          ]}
          rows={GUIDANCE_PEERS}
          getKey={(r) => r.ticker}
          highlightRow={(r) => !!r.subject}
        />
      </section>

      {/* recommendation */}
      <AIBlock title="Recommendation">
        <ProseSections sections={GUIDANCE_REC} />
      </AIBlock>
    </div>
  );
}
