"use client";

import { useState } from "react";
import {
  LEGAL_REQUEST_TYPES,
  LEGAL_REQUESTS,
  LEGAL_CONTRACT_REVIEW,
  LEGAL_POLICIES,
  LEGAL_SIGNATURES,
  type LegalRequest,
  type ReviewFlag,
  type ReviewSeverity,
  type LegalPolicy,
  type SignatureDoc,
  type RequestStatus,
} from "@/data/atrium-modules-demo";
import {
  GlassCard,
  Card,
  AIBlock,
  Badge,
  Button,
  Icon,
  SectionHeading,
  UnderlineTabs,
  DataTable,
  ProgressBar,
  Chip,
  EmptyState,
  GradientText,
  type Tone,
  type Column,
} from "../AtriumKit";
import { useAtriumNav } from "../nav-context";

/**
 * Legal - the contract + policy workspace. Four tabs: request standard legal work,
 * the AI contract-review showpiece (a risk gauge plus clause-level redlines), a
 * searchable policy library, and a signature queue. Mirrors AtriumHome's craft:
 * Aurora glass surfaces, the gradient AI signature for anything AI authored, a
 * single violet accent, and generous whitespace.
 */

type TabId = "requests" | "review" | "policies" | "signatures";
const TABS: ReadonlyArray<{ id: TabId; label: string; count?: number }> = [
  { id: "requests", label: "Requests", count: LEGAL_REQUESTS.length },
  { id: "review", label: "AI review", count: LEGAL_CONTRACT_REVIEW.flags.length },
  { id: "policies", label: "Policies", count: LEGAL_POLICIES.length },
  { id: "signatures", label: "Signatures", count: LEGAL_SIGNATURES.length },
];

const REQUEST_TONE: Record<RequestStatus, Tone> = {
  submitted: "neutral",
  in_review: "info",
  approved: "accent",
  completed: "up",
};
const REQUEST_LABEL: Record<RequestStatus, string> = {
  submitted: "Submitted",
  in_review: "In review",
  approved: "Approved",
  completed: "Completed",
};

export default function Legal() {
  const [tab, setTab] = useState<TabId>("requests");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--atr-faint)]">Support · Legal</p>
        <h2 className="mt-1 text-[26px] font-extrabold tracking-tight text-[var(--atr-ink)]">
          The legal desk, <GradientText>without the email chain</GradientText>
        </h2>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-[var(--atr-muted)]">
          Request a contract, get an AI first-pass review with drafted redlines, search every policy, and sign. Atrium does the first read so counsel does the judgment.
        </p>
      </div>

      <UnderlineTabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "requests" && <RequestsTab />}
      {tab === "review" && <ReviewTab />}
      {tab === "policies" && <PoliciesTab />}
      {tab === "signatures" && <SignaturesTab />}
    </div>
  );
}

/* ---------------------------------------------------------------- requests --- */

function RequestsTab() {
  const [started, setStarted] = useState<string | null>(null);

  return (
    <div className="space-y-7">
      <section>
        <SectionHeading title="Start a request" hint="Pick a type. Atrium drafts the first version and routes it." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEGAL_REQUEST_TYPES.map((t) => {
            const isStarted = started === t.id;
            return (
              <GlassCard key={t.id} hover className="flex flex-col">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
                    <Icon name={t.icon} size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-[var(--atr-ink)]">{t.name}</div>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--atr-muted)]">{t.desc}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge tone="neutral">
                    <Icon name="clock" size={11} /> {t.turnaround}
                  </Badge>
                  <Button
                    size="sm"
                    variant={isStarted ? "outline" : "accent"}
                    icon={isStarted ? "check" : "plus"}
                    onClick={() => setStarted(isStarted ? null : t.id)}
                  >
                    {isStarted ? "Drafting" : "Start request"}
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeading
          title="Your active requests"
          hint="What is open with Legal right now."
          right={<Badge tone="info" dot>{LEGAL_REQUESTS.filter((r) => r.status === "in_review").length} in review</Badge>}
        />
        <DataTable<LegalRequest>
          getKey={(r) => r.id}
          columns={REQUEST_COLUMNS}
          rows={LEGAL_REQUESTS}
        />
      </section>
    </div>
  );
}

const REQUEST_COLUMNS: ReadonlyArray<Column<LegalRequest>> = [
  {
    key: "title",
    label: "Request",
    render: (r) => (
      <div>
        <div className="font-semibold text-[var(--atr-ink)]">{r.title}</div>
        <div className="font-mono text-[11px] text-[var(--atr-faint)]">{r.id}</div>
      </div>
    ),
  },
  { key: "type", label: "Type", render: (r) => <Badge tone="neutral">{r.type}</Badge> },
  { key: "owner", label: "Owner", render: (r) => <span className="text-[var(--atr-muted)]">{r.owner}</span> },
  { key: "submitted", label: "Submitted", render: (r) => <span className="text-[var(--atr-muted)]">{r.submitted}</span> },
  {
    key: "status",
    label: "Status",
    align: "right",
    render: (r) => (
      <Badge tone={REQUEST_TONE[r.status]} dot={r.status === "in_review"}>
        {REQUEST_LABEL[r.status]}
      </Badge>
    ),
  },
];

/* ------------------------------------------------------------------ review --- */

function ReviewTab() {
  const go = useAtriumNav();
  const [decision, setDecision] = useState<"none" | "approved" | "returned">("none");
  const r = LEGAL_CONTRACT_REVIEW;
  const risk = riskBand(r.riskScore);

  return (
    <div className="space-y-6">
      {/* document header + risk gauge */}
      <GlassCard className="overflow-hidden">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge tone="accent">
                <Icon name="sparkles" size={11} /> AI reviewed
              </Badge>
              <span className="font-mono text-[11px] text-[var(--atr-faint)]">{r.flags.length} clauses flagged</span>
            </div>
            <div className="mt-2.5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--atr-surface-2)] text-[var(--atr-accent)]">
                <Icon name="fileText" size={18} />
              </span>
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold text-[var(--atr-ink)]">{r.docName}</div>
                <div className="mt-0.5 text-[12.5px] text-[var(--atr-muted)]">{r.parties}</div>
              </div>
            </div>
          </div>
          <RiskRing score={r.riskScore} band={risk} />
        </div>

        <div className="mt-5 border-t border-[var(--atr-border)] pt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-[12px] font-medium text-[var(--atr-muted)]">Risk score · lower is better</span>
            <Badge tone={risk.tone}>{risk.label} risk</Badge>
          </div>
          <ProgressBar value={r.riskScore} color={risk.color} />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-[var(--atr-faint)]">
            <span>0 · low</span>
            <span>50</span>
            <span>100 · high</span>
          </div>
        </div>
      </GlassCard>

      {/* AI recommendation + summary */}
      <AIBlock title="Contract review" footer="First-pass review · grounded in Northwind's contract playbook · attorney review available">
        <p className="font-medium text-[var(--atr-ink)]">{r.recommendation}</p>
        <p className="mt-1.5">{r.summary}</p>
      </AIBlock>

      {/* clause flags */}
      <section>
        <SectionHeading
          title="Clause-level flags"
          hint="Each flag carries a drafted redline. Approve to apply them all."
          right={<Badge tone="warn">{r.flags.filter((f) => f.severity !== "low").length} need a change</Badge>}
        />
        <div className="space-y-3">
          {r.flags.map((f, i) => (
            <FlagCard key={i} flag={f} />
          ))}
        </div>
      </section>

      {/* decision */}
      {decision === "none" ? (
        <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-[13.5px] font-semibold text-[var(--atr-ink)]">Ready to act on the redlines?</div>
            <p className="mt-0.5 text-[12.5px] text-[var(--atr-muted)]">Approving applies both redlines and queues the NDA for signature.</p>
          </div>
          <div className="flex shrink-0 gap-2.5">
            <Button variant="outline" icon="refresh" onClick={() => setDecision("returned")}>
              Send back to vendor
            </Button>
            <Button icon="check" onClick={() => setDecision("approved")}>
              Approve redlines
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="flex items-center gap-3.5">
          <span
            className={
              decision === "approved"
                ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf3] text-[var(--atr-up)]"
                : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--atr-surface-2)] text-[var(--atr-accent)]"
            }
          >
            <Icon name={decision === "approved" ? "checkCircle" : "send"} size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold text-[var(--atr-ink)]">
              {decision === "approved" ? "Redlines applied" : "Sent back to Brightwave"}
            </div>
            <p className="mt-0.5 text-[12.5px] text-[var(--atr-muted)]">
              {decision === "approved"
                ? "The revised NDA is queued for signature. Track it in the Signatures tab."
                : "Atrium emailed the two proposed redlines to the counterparty for review."}
            </p>
          </div>
          <Button size="sm" variant="ghost" iconRight="arrowRight" onClick={() => go("home")}>
            Back to home
          </Button>
        </Card>
      )}
    </div>
  );
}

function FlagCard({ flag }: { flag: ReviewFlag }) {
  const sev = severityMeta(flag.severity);
  return (
    <Card className="relative overflow-hidden" padded>
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: sev.color }} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--atr-surface-2)]" style={{ color: sev.color }}>
            <Icon name={sev.icon} size={16} />
          </span>
          <span className="text-[13.5px] font-semibold text-[var(--atr-ink)]">{flag.clause}</span>
        </div>
        <Badge tone={sev.tone}>{sev.label}</Badge>
      </div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--atr-ink-2)]">{flag.issue}</p>
      <div className="mt-3 rounded-[12px] border border-[var(--atr-border)] bg-[var(--atr-surface-2)] p-3">
        <div className="mb-1 flex items-center gap-1.5">
          <Icon name="wand" size={12} className="text-[var(--atr-accent)]" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--atr-accent)]">Suggested redline</span>
        </div>
        <p className="text-[12.5px] leading-relaxed text-[var(--atr-ink-2)]">{flag.suggestion}</p>
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- policies --- */

function PoliciesTab() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");
  const q = query.trim().toLowerCase();
  const categories = ["All", ...Array.from(new Set(LEGAL_POLICIES.map((p) => p.category)))];

  const filtered = LEGAL_POLICIES.filter((p) => {
    const matchesCat = cat === "All" || p.category === cat;
    const matchesQuery =
      q === "" || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--atr-faint)]">
            <Icon name="search" size={16} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search policies"
            className="w-full rounded-full border border-[var(--atr-border)] bg-[var(--atr-card)] py-2.5 pl-10 pr-4 text-[13px] text-[var(--atr-ink)] placeholder:text-[var(--atr-faint)] focus:border-[var(--atr-accent)] focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <Chip key={c} active={c === cat} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="search"
          title="No policies match"
          body="Try a different search term or category."
          cta={<Button size="sm" variant="outline" icon="refresh" onClick={() => { setQuery(""); setCat("All"); }}>Clear filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((p) => (
            <PolicyCard key={p.id} policy={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PolicyCard({ policy }: { policy: LegalPolicy }) {
  return (
    <Card hover className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
            <Icon name="fileText" size={16} />
          </span>
          <Badge tone="neutral">{policy.category}</Badge>
        </div>
        <span className="font-mono text-[10px] text-[var(--atr-faint)]">Updated {policy.updated}</span>
      </div>
      <div className="mt-3 text-[14px] font-semibold text-[var(--atr-ink)]">{policy.title}</div>
      <p className="mt-1 flex-1 text-[12.5px] leading-relaxed text-[var(--atr-muted)]">{policy.summary}</p>
      <div className="mt-3 flex items-center justify-between border-t border-[var(--atr-border)] pt-2.5">
        <button className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--atr-accent)] hover:underline">
          Read policy <Icon name="chevron" size={13} />
        </button>
        <button className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--atr-muted)] hover:text-[var(--atr-ink)]">
          <Icon name="sparkles" size={12} /> Ask about this
        </button>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------- signatures --- */

function SignaturesTab() {
  const [signed, setSigned] = useState<string[]>([]);
  const awaitingYou = LEGAL_SIGNATURES.filter((s) => s.status === "awaiting_you" && !signed.includes(s.id)).length;

  return (
    <div className="space-y-5">
      <SectionHeading
        title="Signature queue"
        hint="Documents waiting on you and the counterparty."
        right={
          awaitingYou > 0 ? (
            <Badge tone="warn" dot>{awaitingYou} need your signature</Badge>
          ) : (
            <Badge tone="up">All caught up</Badge>
          )
        }
      />
      <Card padded={false}>
        <ul>
          {LEGAL_SIGNATURES.map((s) => (
            <SignatureRow
              key={s.id}
              doc={s}
              justSigned={signed.includes(s.id)}
              onSign={() => setSigned((prev) => (prev.includes(s.id) ? prev : [...prev, s.id]))}
            />
          ))}
        </ul>
      </Card>
    </div>
  );
}

function SignatureRow({ doc, justSigned, onSign }: { doc: SignatureDoc; justSigned: boolean; onSign: () => void }) {
  const effective: SignatureDoc["status"] = justSigned ? "completed" : doc.status;
  return (
    <li className="flex items-center gap-3.5 border-b border-[var(--atr-border)] px-4 py-3.5 last:border-0">
      <span
        className={
          effective === "completed"
            ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf3] text-[var(--atr-up)]"
            : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--atr-surface-2)] text-[var(--atr-accent)]"
        }
      >
        <Icon name={effective === "completed" ? "checkCircle" : "fileText"} size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-[var(--atr-ink)]">{doc.doc}</div>
        <div className="truncate text-[12px] text-[var(--atr-muted)]">
          {doc.counterparty} · {justSigned ? "Signed just now" : doc.date}
        </div>
      </div>
      <div className="shrink-0">
        {effective === "awaiting_you" ? (
          <div className="flex items-center gap-2.5">
            <Badge tone="warn">Awaiting you</Badge>
            <Button size="sm" icon="send" onClick={onSign}>
              Sign
            </Button>
          </div>
        ) : effective === "awaiting_them" ? (
          <Badge tone="neutral">
            <Icon name="clock" size={11} /> Awaiting counterparty
          </Badge>
        ) : (
          <Badge tone="up">
            <Icon name="check" size={11} /> Completed
          </Badge>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ helpers --- */

type RiskBand = { label: string; tone: Tone; color: string };
function riskBand(score: number): RiskBand {
  if (score <= 33) return { label: "Low", tone: "up", color: "var(--atr-up)" };
  if (score <= 66) return { label: "Moderate", tone: "warn", color: "var(--atr-warn)" };
  return { label: "High", tone: "down", color: "var(--atr-down)" };
}

function severityMeta(sev: ReviewSeverity): { label: string; tone: Tone; color: string; icon: "alert" | "info" | "check" } {
  switch (sev) {
    case "high":
      return { label: "High", tone: "down", color: "var(--atr-down)", icon: "alert" };
    case "medium":
      return { label: "Medium", tone: "warn", color: "var(--atr-warn)", icon: "info" };
    case "low":
      return { label: "Low", tone: "up", color: "var(--atr-up)", icon: "check" };
  }
}

/** A deterministic SVG ring gauge for the risk score (0 to 100, lower is better). */
function RiskRing({ score, band }: { score: number; band: RiskBand }) {
  const size = 116;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const dash = circ * pct;

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--atr-surface-2)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={band.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[30px] font-semibold leading-none tabular-nums text-[var(--atr-ink)]">{score}</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-wide" style={{ color: band.color }}>
            {band.label} risk
          </span>
        </div>
      </div>
    </div>
  );
}
