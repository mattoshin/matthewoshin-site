"use client";

import { useState } from "react";
import {
  cx,
  Card,
  Badge,
  Icon,
  Avatar,
  SectionHeading,
  SegmentedTabs,
  DataTable,
  MT_SERIF,
  type Tone,
  type IconName,
  type Column,
} from "../MtrainKit";
import {
  LEADS,
  LEAD_STAGES,
  LEADS_THIS_WEEK,
  TRIAL_CONVERSION,
  type Lead,
  type LeadStage,
  type LeadSource,
} from "@/data/mtrain-demo";

/**
 * Leads - the studio's inbound pipeline from the site form, socials, and referrals.
 * Refero-grounded on Rox CRM's opportunities view: a pipeline summary strip up top,
 * then a clean data table with colored stage pills, source, and owner. A stage filter
 * narrows the table. Warm-sand + evergreen "Studio" theme via the scoped --mt-* tokens;
 * serif for display counts, mono for labels and dates. Fictional sample data; nothing
 * talks to a live server.
 */

/** Stage -> dot/accent color, used in the pipeline strip. */
const STAGE_COLOR: Record<LeadStage, string> = {
  New: "var(--mt-accent)",
  Contacted: "var(--mt-sage)",
  "Trial booked": "var(--mt-clay)",
  Member: "var(--mt-up)",
  Lost: "var(--mt-muted)",
};

/** Stage -> badge tone. */
const STAGE_TONE: Record<LeadStage, Tone> = {
  New: "accent",
  Contacted: "sage",
  "Trial booked": "clay",
  Member: "up",
  Lost: "neutral",
};

/** Lead source -> inline icon. */
const SOURCE_ICON: Record<LeadSource, IconName> = {
  Instagram: "instagram",
  "Site form": "mail",
  Referral: "users",
  "Walk-in": "mapPin",
  ClassPass: "calendar",
};

/** Shared stage pill, reused in the pipeline strip and the table. */
function stageBadge(stage: LeadStage) {
  return <Badge tone={STAGE_TONE[stage]}>{stage}</Badge>;
}

/** First letters of the first and last word of a name, e.g. "Ava Thompson" -> "AT". */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/* ----------------------------------------------------------------- columns --- */

const COLUMNS: ReadonlyArray<Column<Lead>> = [
  {
    key: "name",
    label: "Lead",
    render: (lead) => (
      <span className="inline-flex items-center gap-2.5">
        <Avatar initials={initialsOf(lead.name)} size={28} />
        <span className="font-semibold text-[var(--mt-ink)]">{lead.name}</span>
      </span>
    ),
  },
  {
    key: "source",
    label: "Source",
    render: (lead) => (
      <span className="inline-flex items-center gap-1.5 text-[var(--mt-muted)]">
        <Icon name={SOURCE_ICON[lead.source]} size={14} className="shrink-0 text-[var(--mt-faint)]" />
        <span>{lead.source}</span>
      </span>
    ),
  },
  {
    key: "interest",
    label: "Interest",
    render: (lead) => <span className="text-[var(--mt-muted)]">{lead.interest}</span>,
  },
  {
    key: "stage",
    label: "Stage",
    render: (lead) => stageBadge(lead.stage),
  },
  {
    key: "added",
    label: "Added",
    render: (lead) => <span className="font-mono text-[12px] tabular-nums text-[var(--mt-muted)]">{lead.added}</span>,
  },
  {
    key: "owner",
    label: "Owner",
    render: (lead) => <span className="text-[var(--mt-muted)]">{lead.owner}</span>,
  },
];

/* -------------------------------------------------------------- pipeline --- */

function PipelineTile({ stage, count }: { stage: LeadStage; count: number }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--mt-faint)]">
          {stage}
        </p>
        <span
          aria-hidden="true"
          className="mt-1 h-2 w-2 shrink-0 rounded-full"
          style={{ background: STAGE_COLOR[stage] }}
        />
      </div>
      <div className={cx("mt-2 text-[26px] font-semibold leading-none tracking-tight text-[var(--mt-ink)]", MT_SERIF)}>
        {count}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ module --- */

export default function Leads() {
  const [stage, setStage] = useState<"all" | LeadStage>("all");

  const rows = stage === "all" ? LEADS : LEADS.filter((l) => l.stage === stage);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Leads"
        hint="From the site form, socials, and referrals"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">
              <Icon name="spark" size={12} />
              {LEADS_THIS_WEEK} new this week
            </Badge>
            <Badge tone="up">
              <Icon name="trendingUp" size={12} />
              {Math.round(TRIAL_CONVERSION * 100)}% trial → member
            </Badge>
          </div>
        }
      />

      {/* pipeline summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {LEAD_STAGES.map(({ stage: s, count }) => (
          <PipelineTile key={s} stage={s} count={count} />
        ))}
      </div>

      {/* stage filter */}
      <SegmentedTabs
        tabs={[
          { id: "all", label: "All" },
          { id: "New", label: "New" },
          { id: "Contacted", label: "Contacted" },
          { id: "Trial booked", label: "Trial booked" },
          { id: "Member", label: "Member" },
        ]}
        value={stage}
        onChange={setStage}
      />

      {/* leads table */}
      <DataTable columns={COLUMNS} rows={rows} getKey={(lead) => lead.id} />
    </div>
  );
}
