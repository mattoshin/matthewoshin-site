"use client";

import { useState } from "react";
import {
  PTO_BALANCE,
  PTO_REQUESTS,
  TEAM_OUT,
  PAY_SUMMARY,
  PAYSTUBS,
  DIRECTORY,
  BENEFITS,
  type PtoBucket,
  type PtoRequest,
  type RequestStatus,
  type TeamOut,
  type Paystub,
  type DirectoryPerson,
  type Benefit,
} from "@/data/atrium-modules-demo";
import { ATRIUM_USER } from "@/data/atrium-demo";
import {
  GlassCard,
  Card,
  Button,
  Badge,
  Icon,
  Avatar,
  ProgressBar,
  UnderlineTabs,
  SectionHeading,
  Eyebrow,
  EmptyState,
  type Tone,
} from "../AtriumKit";

/**
 * People - the People & HR module. A consumer-grade HR portal across four tabs:
 * Time off (balances, requests, who is out), Pay (next paycheck breakdown and
 * paystub history), Directory (searchable team cards), and Benefits. Aurora craft,
 * deterministic, SSR-safe.
 */

type PeopleTab = "time" | "pay" | "directory" | "benefits";

const TABS: ReadonlyArray<{ id: PeopleTab; label: string }> = [
  { id: "time", label: "Time off" },
  { id: "pay", label: "Pay" },
  { id: "directory", label: "Directory" },
  { id: "benefits", label: "Benefits" },
];

const REQUEST_TONE: Record<RequestStatus, Tone> = {
  approved: "up",
  submitted: "warn",
  in_review: "info",
  completed: "neutral",
};

const REQUEST_LABEL: Record<RequestStatus, string> = {
  approved: "Approved",
  submitted: "Submitted",
  in_review: "In review",
  completed: "Completed",
};

export default function People() {
  const [tab, setTab] = useState<PeopleTab>("time");

  return (
    <div className="space-y-7">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>People &amp; HR</Eyebrow>
          <h2 className="mt-1.5 text-[26px] font-extrabold tracking-tight text-[var(--atr-ink)]">
            Your workplace, sorted
          </h2>
          <p className="mt-1 text-[13px] text-[var(--atr-muted)]">
            Time off, pay, the directory, and benefits for {ATRIUM_USER.name} · {ATRIUM_USER.team} team
          </p>
        </div>
        <Avatar initials={ATRIUM_USER.initials} size={44} />
      </div>

      <UnderlineTabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "time" && <TimeOff />}
      {tab === "pay" && <Pay />}
      {tab === "directory" && <Directory />}
      {tab === "benefits" && <BenefitsTab />}
    </div>
  );
}

/* ----------------------------------------------------------------- time off --- */

function TimeOff() {
  return (
    <div className="space-y-7">
      {/* balances */}
      <section>
        <SectionHeading
          title="Time off balance"
          hint="Your accrued days for this year"
          right={<Button size="sm" icon="plus">Request time off</Button>}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PTO_BALANCE.map((b) => (
            <PtoCard key={b.label} bucket={b} />
          ))}
        </div>
      </section>

      {/* requests */}
      <section>
        <SectionHeading title="Your requests" hint="Recent and upcoming time off" />
        <Card padded={false}>
          <ul>
            {PTO_REQUESTS.map((r) => (
              <RequestRow key={r.id} req={r} />
            ))}
          </ul>
        </Card>
      </section>

      {/* who is out */}
      <section>
        <SectionHeading
          title="Who is out"
          hint="Coverage across your team"
          right={<Badge tone="info">{TEAM_OUT.length} scheduled</Badge>}
        />
        <Card padded={false}>
          <ul>
            {TEAM_OUT.map((p) => (
              <TeamOutRow key={p.name} person={p} />
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}

function PtoCard({ bucket }: { bucket: PtoBucket }) {
  const remaining = bucket.total - bucket.used;
  return (
    <GlassCard hover>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-[var(--atr-ink)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
            <Icon name={bucket.icon} size={16} />
          </span>
          {bucket.label}
        </p>
        <span className="font-mono text-[11px] tabular-nums text-[var(--atr-faint)]">
          {remaining} left
        </span>
      </div>
      <div className="mt-3.5 flex items-baseline gap-1.5">
        <span className="font-mono text-[22px] font-semibold leading-none tabular-nums text-[var(--atr-ink)]">
          {bucket.used}
        </span>
        <span className="text-[12px] text-[var(--atr-muted)]">
          of {bucket.total} {bucket.unit} used
        </span>
      </div>
      <div className="mt-2.5">
        <ProgressBar value={bucket.used} max={bucket.total} />
      </div>
    </GlassCard>
  );
}

function RequestRow({ req }: { req: PtoRequest }) {
  return (
    <li className="flex items-center gap-3.5 border-b border-[var(--atr-border)] px-4 py-3 last:border-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--atr-surface-2)] text-[var(--atr-accent)]">
        <Icon name="calendar" size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-[var(--atr-ink)]">{req.type}</div>
        <div className="text-[12px] text-[var(--atr-muted)]">{req.dates}</div>
      </div>
      <span className="shrink-0 font-mono text-[12px] tabular-nums text-[var(--atr-muted)]">
        {req.days} {req.days === 1 ? "day" : "days"}
      </span>
      <Badge tone={REQUEST_TONE[req.status]}>{REQUEST_LABEL[req.status]}</Badge>
    </li>
  );
}

function TeamOutRow({ person }: { person: TeamOut }) {
  return (
    <li className="flex items-center gap-3 border-b border-[var(--atr-border)] px-4 py-3 last:border-0">
      <Avatar initials={person.initials} size={32} color={person.color} />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-[var(--atr-ink)]">{person.name}</div>
        <div className="text-[12px] text-[var(--atr-muted)]">{person.dates}</div>
      </div>
      <Badge tone="neutral">{person.reason}</Badge>
    </li>
  );
}

/* ---------------------------------------------------------------------- pay --- */

function Pay() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* next paycheck */}
      <div className="lg:col-span-2">
        <GlassCard className="h-full">
          <Eyebrow>Next paycheck</Eyebrow>
          <div className="mt-2 flex items-center gap-2">
            <Icon name="calendar" size={18} className="text-[var(--atr-accent)]" />
            <span className="text-[20px] font-bold tracking-tight text-[var(--atr-ink)]">
              {PAY_SUMMARY.nextPayDate}
            </span>
          </div>
          <div className="mt-4 rounded-[12px] bg-[var(--atr-accent-wash)] px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--atr-accent)]">Net pay</p>
            <p className="mt-1 font-mono text-[28px] font-semibold leading-none tabular-nums text-[var(--atr-ink)]">
              {PAY_SUMMARY.netPay}
            </p>
          </div>
          <dl className="mt-4 space-y-2.5">
            <PayRow label="Gross pay" value={PAY_SUMMARY.gross} />
            <PayRow label="Taxes" value={`- ${PAY_SUMMARY.taxes}`} muted />
            <PayRow label="Deductions" value={`- ${PAY_SUMMARY.deductions}`} muted />
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-[var(--atr-border)] pt-3">
            <span className="text-[12px] font-medium text-[var(--atr-muted)]">Year to date (gross)</span>
            <span className="font-mono text-[14px] font-semibold tabular-nums text-[var(--atr-ink)]">
              {PAY_SUMMARY.ytdGross}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* paystub history */}
      <div className="lg:col-span-3">
        <SectionHeading title="Paystub history" hint="Download any statement" />
        <Card padded={false}>
          <ul>
            {PAYSTUBS.map((p) => (
              <PaystubRow key={p.id} stub={p} />
            ))}
          </ul>
        </Card>
        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[var(--atr-faint)]">
          <Icon name="info" size={13} />
          Pay runs the last business day of each pay period.
        </p>
      </div>
    </div>
  );
}

function PayRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[12.5px] text-[var(--atr-muted)]">{label}</dt>
      <dd
        className="font-mono text-[13px] tabular-nums"
        style={{ color: muted ? "var(--atr-down)" : "var(--atr-ink-2)" }}
      >
        {value}
      </dd>
    </div>
  );
}

function PaystubRow({ stub }: { stub: Paystub }) {
  const [downloaded, setDownloaded] = useState(false);
  return (
    <li className="flex items-center gap-3.5 border-b border-[var(--atr-border)] px-4 py-3 last:border-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--atr-surface-2)] text-[var(--atr-accent)]">
        <Icon name="fileText" size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-[var(--atr-ink)]">{stub.period}</div>
        <div className="font-mono text-[11px] text-[var(--atr-faint)]">Paid {stub.date}</div>
      </div>
      <span className="shrink-0 font-mono text-[13px] font-semibold tabular-nums text-[var(--atr-ink)]">
        {stub.net}
      </span>
      <button
        onClick={() => setDownloaded(true)}
        aria-label={`Download paystub for ${stub.period}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--atr-muted)] transition-colors hover:bg-[var(--atr-surface-2)] hover:text-[var(--atr-accent)]"
      >
        <Icon name={downloaded ? "check" : "download"} size={15} />
      </button>
    </li>
  );
}

/* ---------------------------------------------------------------- directory --- */

function Directory() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const people = q
    ? DIRECTORY.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q),
      )
    : DIRECTORY;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeading title="Directory" hint={`${DIRECTORY.length} teammates`} />
        <label className="flex items-center gap-2 rounded-full border border-[var(--atr-border)] bg-[var(--atr-card)] px-3.5 py-2">
          <Icon name="search" size={15} className="text-[var(--atr-faint)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people"
            className="w-40 bg-transparent text-[13px] text-[var(--atr-ink)] placeholder:text-[var(--atr-faint)] focus:outline-none"
          />
        </label>
      </div>

      {people.length === 0 ? (
        <EmptyState
          icon="users"
          title="No teammates found"
          body={`Nobody matches "${query}". Try a different name, role, or team.`}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PersonCard({ person }: { person: DirectoryPerson }) {
  return (
    <GlassCard hover>
      <div className="flex items-start gap-3">
        <Avatar initials={person.initials} size={42} color={person.color} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[14px] font-semibold text-[var(--atr-ink)]">{person.name}</span>
            {person.isManager && <Badge tone="accent">Manager</Badge>}
          </div>
          <p className="mt-0.5 truncate text-[12.5px] text-[var(--atr-muted)]">{person.role}</p>
        </div>
      </div>
      <div className="mt-3.5 flex items-center gap-3 border-t border-[var(--atr-border)] pt-3 text-[12px] text-[var(--atr-muted)]">
        <span className="flex items-center gap-1.5">
          <Icon name="users" size={13} className="text-[var(--atr-faint)]" />
          {person.team}
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="building" size={13} className="text-[var(--atr-faint)]" />
          {person.location}
        </span>
      </div>
    </GlassCard>
  );
}

/* ----------------------------------------------------------------- benefits --- */

function BenefitsTab() {
  return (
    <div className="space-y-5">
      <SectionHeading
        title="Benefits"
        hint="Your active plans and stipends"
        right={
          <Badge tone="warn" dot>
            Open enrollment closes Friday
          </Badge>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BENEFITS.map((b) => (
          <BenefitCard key={b.id} benefit={b} />
        ))}
      </div>
    </div>
  );
}

function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <GlassCard hover className="flex items-start gap-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
        <Icon name={benefit.icon} size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold text-[var(--atr-ink)]">{benefit.name}</div>
        <div className="mt-0.5 text-[12.5px] font-medium text-[var(--atr-accent)]">{benefit.plan}</div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--atr-muted)]">{benefit.detail}</p>
      </div>
    </GlassCard>
  );
}
