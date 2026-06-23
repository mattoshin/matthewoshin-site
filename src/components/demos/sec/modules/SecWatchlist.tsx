"use client";

import { SEC_COMPANIES, SEC_CLIENTS, SEC_PLATFORM, type SecCompany } from "@/data/sec-demo";
import {
  Card,
  Delta,
  Badge,
  Sparkline,
  Icon,
  SectionHeading,
  AIBlock,
  DataTable,
  FormBadge,
  type Column,
  type FormType,
  cx,
} from "../SecKit";
import { useSecNav, useSecRole } from "../console-context";

/**
 * SecWatchlist - the role-aware book. The wealth manager sees a client roster with
 * AUM, risk band, holdings, and which clients hold a name that filed today. The
 * trader sees positions: a dense table of quotes, weight, value, the next scheduled
 * filing, and unread filing alerts per name. Same data, two lenses.
 */
export default function SecWatchlist() {
  const go = useSecNav();
  const role = useSecRole();

  if (role === "advisor") return <AdvisorBook go={go} />;
  return <TraderBook go={go} />;
}

/* --------------------------------------------------------------- advisor --- */

function AdvisorBook({ go }: { go: (id: "filings" | "alerts") => void }) {
  const exposed = SEC_CLIENTS.filter((c) => c.exposed.length > 0).length;
  return (
    <div className="space-y-6">
      <AIBlock tag="Book summary" footer="Updated continuously from your client holdings and today's filings">
        {`You advise ${SEC_CLIENTS.length} clients. ${exposed} hold a name that filed today, and two of those filings are material: the Atlas CFO 8-K hits Harborview's concentrated 11% position, and the Carven Phase III readout hits Delgado's high-beta biotech sleeve. Suggested calls are flagged on each card.`}
      </AIBlock>

      <section>
        <SectionHeading
          title="Client book"
          hint="Names with a material filing today are highlighted in gold. Click a client to open the affected filings."
          right={<Badge tone="material" dot>{exposed} exposed today</Badge>}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEC_CLIENTS.map((c) => (
            <button key={c.id} onClick={() => go("filings")} className="text-left">
              <Card hover className="h-full">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-semibold text-[var(--sec-ink)]">{c.name}</div>
                    <div className="text-[11px] text-[var(--sec-muted)]">{c.type} · {c.riskBand}</div>
                  </div>
                  {c.unread > 0 ? <Badge tone="accent">{c.unread} new</Badge> : <Badge tone="neutral">clear</Badge>}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-xl font-semibold tabular-nums text-[var(--sec-ink)]">{c.aum}</span>
                  <span className="text-[11px] text-[var(--sec-faint)]">AUM</span>
                </div>
                <div className="mt-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sec-faint)]">Top holdings</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {c.topHoldings.map((t) => {
                      const hot = c.exposed.includes(t);
                      return (
                        <span key={t} className={cx("rounded font-mono text-[11px] px-1.5 py-0.5", hot ? "bg-[var(--sec-material-wash)] text-[var(--sec-material)]" : "bg-[var(--sec-surface-2)] text-[var(--sec-ink-2)]")}>{t}</span>
                      );
                    })}
                  </div>
                </div>
                {c.flag ? (
                  <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-[var(--sec-material)]/25 bg-[var(--sec-material-wash)] px-2.5 py-1.5 text-[11.5px] leading-snug text-[var(--sec-material)]">
                    <Icon name="alert" size={13} className="mt-px shrink-0" /> {c.flag}
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[var(--sec-muted)]">
                    <Icon name="check" size={13} className="text-[var(--sec-up)]" /> No material filings today
                  </div>
                )}
              </Card>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- trader --- */

function TraderBook({ go }: { go: (id: "filings" | "alerts") => void }) {
  const columns: ReadonlyArray<Column<SecCompany>> = [
    {
      key: "ticker",
      label: "Ticker",
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[13px] font-semibold text-[var(--sec-accent)]">{r.ticker}</span>
          {r.unread > 0 && <Badge tone="material">{r.unread}</Badge>}
        </div>
      ),
    },
    { key: "name", label: "Company", render: (r) => <span className="text-[var(--sec-ink-2)]">{r.name}</span> },
    { key: "price", label: "Price", align: "right", mono: true, render: (r) => `$${r.price.toFixed(2)}` },
    { key: "changePct", label: "Chg", align: "right", render: (r) => <Delta value={r.changePct} /> },
    { key: "weight", label: "Weight", align: "right", mono: true, render: (r) => (r.position ? `${r.position.weightPct}%` : "-") },
    { key: "value", label: "Value", align: "right", mono: true, render: (r) => (r.position ? r.position.value : "-") },
    {
      key: "next",
      label: "Next filing",
      render: (r) => (r.nextFiling ? <span className="inline-flex items-center gap-1.5"><FormBadge form={r.nextFiling.form} /> <span className="text-[11px] text-[var(--sec-muted)]">{r.nextFiling.in}</span></span> : <span className="text-[var(--sec-faint)]">-</span>),
    },
    { key: "trend", label: "30d", align: "right", render: (r) => <Sparkline values={r.spark} width={64} /> },
  ];

  const totalValue = "$4.76M";

  return (
    <div className="space-y-6">
      <AIBlock tag="Book summary" footer="Position-level view, refreshed on every filing">
        {`You hold ${SEC_COMPANIES.length} names worth ${totalValue}. Two printed material filings today: ATLX (your top weight at 8.4%) on a CFO transition, and CRVN on a positive Phase III. ${SEC_COMPANIES.filter((c) => c.nextFiling).length} names have a scheduled filing inside two weeks. Redwood is expected to file on trial data before the open.`}
      </AIBlock>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Positions" value={String(SEC_PLATFORM.watchlist)} />
        <StatTile label="Book value" value={totalValue} />
        <StatTile label="Unread filings" value={String(SEC_COMPANIES.reduce((a, c) => a + c.unread, 0))} accent />
        <StatTile label="Filings scheduled" value={String(SEC_COMPANIES.filter((c) => c.nextFiling).length)} />
      </div>

      <section>
        <SectionHeading
          title="Positions"
          hint="Click through to the filing feed for any name."
          right={<button onClick={() => go("alerts")} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--sec-accent)] hover:underline"><Icon name="bell" size={13} /> Alert rules</button>}
        />
        <DataTable
          columns={columns}
          rows={SEC_COMPANIES}
          getKey={(r) => r.ticker}
          highlightRow={(r) => r.unread >= 3}
          dense
        />
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--sec-muted)]">
          <span className="inline-block h-2 w-3 rounded-sm bg-[var(--sec-accent-wash)]" /> Rows highlighted have 3+ unread filings.
        </p>
      </section>

      <section>
        <SectionHeading title="Coverage" hint="What the terminal watches for every name you hold." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {COVERAGE.map((x) => (
            <Card key={x.form} className="flex flex-col items-start gap-2">
              <FormBadge form={x.form} />
              <span className="text-[11.5px] text-[var(--sec-muted)]">{x.l}</span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

const COVERAGE: { form: FormType; l: string }[] = [
  { form: "8-K", l: "Material events" },
  { form: "10-Q", l: "Quarterly" },
  { form: "Form 4", l: "Insider" },
  { form: "13D", l: "Activist" },
  { form: "13F", l: "Institutional" },
  { form: "S-1", l: "Offerings" },
];

function StatTile({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card>
      <p className="text-[12px] font-medium text-[var(--sec-muted)]">{label}</p>
      <p className={cx("mt-2 font-mono text-[24px] font-semibold leading-none tabular-nums", accent ? "text-[var(--sec-material)]" : "text-[var(--sec-ink)]")}>{value}</p>
    </Card>
  );
}
