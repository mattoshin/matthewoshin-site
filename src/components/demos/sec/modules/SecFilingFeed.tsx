"use client";

import { useState } from "react";
import { SEC_FILINGS, FILING_FORM_FILTERS, type SecFiling } from "@/data/sec-modules-demo";
import {
  Card,
  Button,
  Badge,
  Chip,
  Icon,
  SectionHeading,
  SegmentedTabs,
  AIBlock,
  FormBadge,
  SeverityFlag,
  SentimentBadge,
  EmptyState,
  cx,
  type FormType,
  type Severity,
} from "../SecKit";

/**
 * SecFilingFeed - the signature filing feed. A live, AI-graded stream of every
 * filing on the book, filterable by form type (chip row) and materiality
 * (segmented tabs). Each row expands into an inline "AI Reader": the why-it-matters
 * read, AI-pulled key extracts, a what-changed / your-exposure split, a filing
 * citation with sentiment and page count, and EDGAR / route-alert actions. The
 * heart of the product, mirroring the dashboard's news-list pattern but richer.
 */

type SevFilter = "all" | "material" | "notable" | "routine";

const SEV_TABS: ReadonlyArray<{ id: SevFilter; label: string; count: number }> = [
  { id: "all", label: "All", count: SEC_FILINGS.length },
  { id: "material", label: "Material", count: SEC_FILINGS.filter((f) => f.severity === "material").length },
  { id: "notable", label: "Notable", count: SEC_FILINGS.filter((f) => f.severity === "notable").length },
  { id: "routine", label: "Routine", count: SEC_FILINGS.filter((f) => f.severity === "routine").length },
];

export default function SecFilingFeed() {
  const [form, setForm] = useState<FormType | "All">("All");
  const [sev, setSev] = useState<SevFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(SEC_FILINGS[0]?.id ?? null);

  const filtered = SEC_FILINGS.filter((f) => {
    const formOk = form === "All" || f.form === form;
    const sevOk = sev === "all" || f.severity === (sev as Severity);
    return formOk && sevOk;
  });

  const materialCount = filtered.filter((f) => f.severity === "material").length;

  return (
    <div className="space-y-6">
      {/* header */}
      <SectionHeading
        title="Filing feed"
        hint="Every filing on your watchlist, AI-graded for materiality. Click a row to open its AI read."
        right={<Badge tone="up" dot>live</Badge>}
      />

      {/* filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILING_FORM_FILTERS.map((f) => (
            <Chip key={f} active={form === f} onClick={() => setForm(f)}>
              {f}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SegmentedTabs<SevFilter> tabs={SEV_TABS} value={sev} onChange={setSev} size="sm" />
          <span className="font-mono text-[11px] tabular-nums text-[var(--sec-faint)]">
            {filtered.length} filing{filtered.length === 1 ? "" : "s"}
            {materialCount > 0 && (
              <span className="text-[var(--sec-material)]"> · {materialCount} material</span>
            )}
          </span>
        </div>
      </div>

      {/* feed */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="filter"
          title="No filings match"
          body="No filings match this form type and severity. Reset the filters or widen the materiality band to see more."
        />
      ) : (
        <Card padded={false}>
          <ul>
            {filtered.map((f) => (
              <FilingRow
                key={f.id}
                filing={f}
                expanded={expandedId === f.id}
                onToggle={() => setExpandedId((cur) => (cur === f.id ? null : f.id))}
              />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function FilingRow({
  filing,
  expanded,
  onToggle,
}: {
  filing: SecFiling;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="border-b border-[var(--sec-border)] last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className={cx(
          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
          expanded ? "bg-[var(--sec-surface-2)]" : "hover:bg-[var(--sec-surface-2)]",
        )}
      >
        <span className="mt-0.5 shrink-0">
          <FormBadge form={filing.form} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[13px] font-semibold text-[var(--sec-accent)]">{filing.ticker}</span>
            <span className="truncate text-[13px] font-medium text-[var(--sec-ink)]">{filing.title}</span>
          </div>
          <p className="mt-1 truncate text-[12.5px] leading-relaxed text-[var(--sec-muted)]">{filing.summary}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <SeverityFlag severity={filing.severity} />
          <span className="flex items-center gap-2">
            <span className="font-mono text-[11px] tabular-nums text-[var(--sec-faint)]">{filing.filedAt}</span>
            <Icon
              name="chevronDown"
              size={15}
              className={cx(
                "text-[var(--sec-faint)] transition-transform",
                expanded && "rotate-180 text-[var(--sec-accent)]",
              )}
            />
          </span>
        </div>
      </button>

      {expanded && <FilingReader filing={filing} />}
    </li>
  );
}

function FilingReader({ filing }: { filing: SecFiling }) {
  const citation = filing.item ? `${filing.form} · ${filing.item}` : filing.form;
  return (
    <div className="space-y-4 border-t border-[var(--sec-border)] bg-[var(--sec-recessed)] px-4 py-4">
      {/* AI read */}
      <AIBlock
        title="AI read"
        tag="AI"
        footer={`${filing.company} · ${filing.pages} page${filing.pages === 1 ? "" : "s"} · summarized at filing time`}
      >
        {filing.summary}
      </AIBlock>

      {/* key extracts */}
      <div>
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sec-faint)]">
          Key extracts
        </p>
        <ul className="space-y-1.5">
          {filing.extracts.map((ex, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-[var(--sec-ink-2)]">
              <span className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--sec-accent)]" />
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* what changed / your exposure */}
      {(filing.priorDiff || filing.affected) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filing.priorDiff && (
            <ReaderPanel icon="refresh" label="What changed" body={filing.priorDiff} />
          )}
          {filing.affected && (
            <ReaderPanel icon="target" label="Your exposure" body={filing.affected} accent />
          )}
        </div>
      )}

      {/* citation + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sec-border)] pt-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--sec-border)] bg-[var(--sec-card)] px-2 py-1 font-mono text-[11px] text-[var(--sec-muted)]">
            <Icon name="fileText" size={12} className="text-[var(--sec-faint)]" />
            {citation}
          </span>
          <SentimentBadge sentiment={filing.sentiment} />
          <span className="font-mono text-[11px] tabular-nums text-[var(--sec-faint)]">{filing.pages}p</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon="bell">
            Route an alert
          </Button>
          <Button variant="accent" size="sm" icon="external">
            Open on EDGAR
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReaderPanel({
  icon,
  label,
  body,
  accent = false,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[10px] border border-[var(--sec-border)] bg-[var(--sec-card)] p-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon
          name={icon}
          size={13}
          className={accent ? "text-[var(--sec-accent)]" : "text-[var(--sec-faint)]"}
        />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sec-faint)]">
          {label}
        </span>
      </div>
      <p className="text-[12.5px] leading-relaxed text-[var(--sec-ink-2)]">{body}</p>
    </div>
  );
}
