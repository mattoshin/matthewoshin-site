"use client";

import { useState } from "react";
import {
  cx,
  Card,
  Badge,
  Avatar,
  SectionHeading,
  SegmentedTabs,
  MT_SERIF,
  type Tone,
  type Column,
} from "../MtrainKit";
import { DataTable } from "../MtrainKit";
import {
  MEMBERS,
  MEMBER_SUMMARY,
  type Member,
  type MemberStatus,
} from "@/data/mtrain-demo";

/**
 * Members - the active roster as a clean CRM-style table. Refero-grounded on a
 * members/CRM list: a summary metric strip up top (total / active / trial / frozen
 * / retention), a status filter, then a scannable roster table with avatar, plan,
 * status pill, join date, last-visit recency, and a 30-day visit count with a tiny
 * inline cadence bar. Warm-sand + evergreen "Studio" theme via the scoped --mt-*
 * tokens; serif for display numerals, mono for labels and figures. Fictional sample
 * data; nothing talks to a live server.
 */

/** Initials from a member's name (first + last). */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Status pill tone, by member status. */
function statusBadge(status: MemberStatus): Tone {
  switch (status) {
    case "Active":
      return "up";
    case "Trial":
      return "accent";
    case "Frozen":
      return "warn";
    case "Lapsed":
      return "neutral";
  }
}

/** A small summary tile: faint mono label over a big serif value. */
function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--mt-faint)]">
        {label}
      </p>
      <p className={cx("mt-2 text-[26px] font-semibold leading-none tracking-tight text-[var(--mt-ink)]", MT_SERIF)}>
        {value}
      </p>
    </Card>
  );
}

/** The 30-day visit count with a tiny inline cadence bar (cap at 14 visits = full). */
function VisitsCell({ visits }: { visits: number }) {
  const pct = Math.min(100, (visits / 14) * 100);
  return (
    <span className="inline-flex items-center justify-end gap-2">
      <span className="h-1.5 w-9 shrink-0 overflow-hidden rounded-full bg-[var(--mt-surface-2)]">
        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: "var(--mt-accent)" }} />
      </span>
      <span className="font-mono tabular-nums text-[var(--mt-ink-2)]">{visits}</span>
    </span>
  );
}

const STATUS_TABS: ReadonlyArray<{ id: "all" | MemberStatus; label: string }> = [
  { id: "all", label: "All" },
  { id: "Active", label: "Active" },
  { id: "Trial", label: "Trial" },
  { id: "Frozen", label: "Frozen" },
  { id: "Lapsed", label: "Lapsed" },
];

const COLUMNS: ReadonlyArray<Column<Member>> = [
  {
    key: "member",
    label: "Member",
    render: (m) => (
      <span className="flex items-center gap-2.5">
        <Avatar initials={initialsOf(m.name)} size={28} />
        <span className="font-semibold text-[var(--mt-ink)]">{m.name}</span>
      </span>
    ),
  },
  { key: "plan", label: "Plan", render: (m) => m.plan },
  {
    key: "status",
    label: "Status",
    render: (m) => <Badge tone={statusBadge(m.status)}>{m.status}</Badge>,
  },
  { key: "joined", label: "Joined", render: (m) => <span className="text-[var(--mt-muted)]">{m.joined}</span> },
  { key: "lastVisit", label: "Last visit", render: (m) => <span className="text-[var(--mt-muted)]">{m.lastVisit}</span> },
  {
    key: "visits30",
    label: "Visits (30d)",
    align: "right",
    render: (m) => <VisitsCell visits={m.visits30} />,
  },
];

export default function Members() {
  const [status, setStatus] = useState<"all" | MemberStatus>("all");
  const rows = status === "all" ? MEMBERS : MEMBERS.filter((m) => m.status === status);

  return (
    <div className="space-y-6">
      <SectionHeading title="Members" hint="Active roster and visit cadence" />

      {/* summary metric strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <SummaryTile label="Total" value={String(MEMBER_SUMMARY.total)} />
        <SummaryTile label="Active" value={String(MEMBER_SUMMARY.active)} />
        <SummaryTile label="Trial" value={String(MEMBER_SUMMARY.trial)} />
        <SummaryTile label="Frozen" value={String(MEMBER_SUMMARY.frozen)} />
        <SummaryTile label="Retention" value={`${Math.round(MEMBER_SUMMARY.retention * 100)}%`} />
      </div>

      {/* status filter */}
      <SegmentedTabs tabs={STATUS_TABS} value={status} onChange={setStatus} />

      {/* roster */}
      <DataTable columns={COLUMNS} rows={rows} getKey={(m) => m.id} />
    </div>
  );
}
