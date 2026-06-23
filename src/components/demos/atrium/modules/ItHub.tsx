"use client";

import { useState } from "react";
import {
  IT_TICKETS,
  IT_DEFLECTION_QUERY,
  IT_DEFLECTION_ANSWERS,
  IT_KB_ARTICLES,
  IT_REQUESTS,
  IT_SYSTEM_STATUS,
  IT_STATS,
  type Ticket,
  type TicketStatus,
  type Severity,
  type DeflectionAnswer,
  type KBArticle,
  type ITRequest,
  type SystemService,
  type ServiceStatus,
} from "@/data/atrium-modules-demo";
import {
  GlassCard,
  Card,
  StatCard,
  AIBlock,
  Badge,
  Button,
  Icon,
  SectionHeading,
  UnderlineTabs,
  DataTable,
  EmptyState,
  type Tone,
  type Column,
  type IconName,
} from "../AtriumKit";
import { useAtriumNav } from "../nav-context";

/**
 * ItHub - the self-service IT desk. The showpiece is the "Get help" tab, where a
 * typed issue is deflected by Workplace AI with a top fix before any ticket is filed.
 * The other tabs cover the employee's own tickets, the request catalog, and a live
 * system status board. Mirrors the Home module's composition and Aurora craft.
 */

type TabId = "help" | "tickets" | "requests" | "status";

const statusTone: Record<TicketStatus, Tone> = {
  auto_resolved: "up",
  resolved: "up",
  in_progress: "info",
  open: "warn",
};
const statusLabel: Record<TicketStatus, string> = {
  auto_resolved: "Auto-resolved",
  resolved: "Resolved",
  in_progress: "In progress",
  open: "Open",
};
const severityTone: Record<Severity, Tone> = { high: "down", medium: "warn", low: "neutral" };

const serviceTone: Record<ServiceStatus, Tone> = {
  operational: "up",
  degraded: "warn",
  maintenance: "info",
};
const serviceLabel: Record<ServiceStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  maintenance: "Maintenance",
};

export default function ItHub() {
  const go = useAtriumNav();
  const [tab, setTab] = useState<TabId>("help");

  const degraded = IT_SYSTEM_STATUS.filter((s) => s.status !== "operational").length;

  const tabs = [
    { id: "help" as const, label: "Get help" },
    { id: "tickets" as const, label: "My tickets", count: IT_TICKETS.length },
    { id: "requests" as const, label: "Requests", count: IT_REQUESTS.length },
    { id: "status" as const, label: "Status", count: degraded || undefined },
  ];

  return (
    <div className="space-y-7">
      {/* header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--atr-faint)]">Support</p>
          <h2 className="mt-1 text-[26px] font-extrabold tracking-tight text-[var(--atr-ink)]">IT Hub</h2>
          <p className="mt-1 text-[13px] text-[var(--atr-muted)]">
            Self-service help that resolves most issues instantly. Tickets, devices, access, and status in one place.
          </p>
        </div>
        <Button variant="outline" size="sm" icon="refresh">
          New ticket
        </Button>
      </div>

      {/* stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Auto-resolve rate" value={`${IT_STATS.autoResolveRate}%`} icon="sparkles" accent hint="no human needed" />
        <StatCard label="Avg resolve time" value={`${IT_STATS.avgResolveMins}m`} icon="clock" hint="across all tickets" />
        <StatCard label="Open tickets" value={String(IT_STATS.openTickets)} icon="lifebuoy" hint="both on track" />
        <StatCard label="Satisfaction" value={`${IT_STATS.satisfaction}/5`} icon="star" hint="last 90 days" />
      </div>

      <UnderlineTabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === "help" && <GetHelpTab onTicket={() => setTab("tickets")} />}
      {tab === "tickets" && <TicketsTab />}
      {tab === "requests" && <RequestsTab />}
      {tab === "status" && <StatusTab degraded={degraded} />}

      {/* footer assist */}
      <Card className="flex flex-wrap items-center justify-between gap-3 bg-[var(--atr-accent-wash)]">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundImage: "linear-gradient(135deg, var(--atr-accent) 0%, var(--atr-accent-2) 100%)" }}>
            <Icon name="sparkles" size={16} />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-[var(--atr-ink)]">Stuck on something we can automate?</p>
            <p className="text-[12px] text-[var(--atr-muted)]">Ask Workplace AI to fix it, request access, or file the ticket for you.</p>
          </div>
        </div>
        <Button size="sm" icon="sparkles" onClick={() => go("assistant")}>
          Ask Workplace AI
        </Button>
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------------- get help --- */

function GetHelpTab({ onTicket }: { onTicket: () => void }) {
  const [query, setQuery] = useState(IT_DEFLECTION_QUERY);
  const [searched, setSearched] = useState(true);

  const top = IT_DEFLECTION_ANSWERS.find((a) => a.resolves) ?? IT_DEFLECTION_ANSWERS[0];
  const rest = IT_DEFLECTION_ANSWERS.filter((a) => a !== top);

  return (
    <div className="space-y-7">
      {/* search */}
      <GlassCard>
        <SectionHeading title="Describe your issue" hint="Workplace AI searches the knowledge base and resolves most issues before a ticket is filed." />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(query.trim().length > 0);
          }}
          className="flex flex-col gap-2.5 sm:flex-row"
        >
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--atr-faint)]">
              <Icon name="search" size={16} />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. My VPN keeps disconnecting"
              className="w-full rounded-full border border-[var(--atr-border-strong)] bg-[var(--atr-card)] py-2.5 pl-10 pr-4 text-[13px] text-[var(--atr-ink)] outline-none transition-colors placeholder:text-[var(--atr-faint)] focus:border-[var(--atr-accent)]"
            />
          </div>
          <Button type="submit" icon="sparkles">
            Find a fix
          </Button>
        </form>
      </GlassCard>

      {searched ? (
        <div className="space-y-5">
          {/* top resolving answer */}
          <AIBlock
            title="Workplace AI found a fix"
            tag="Workplace AI"
            footer={`Resolved ${top.helpful} similar issues · no ticket needed`}
          >
            <p className="font-semibold text-[var(--atr-ink)]">{top.title}</p>
            <p className="mt-1">{top.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button size="sm" icon="check">
                This fixed it
              </Button>
              <Button size="sm" variant="outline">
                Didn&apos;t work
              </Button>
              <span className="ml-1 text-[12px] text-[var(--atr-faint)]">{top.helpful} found this helpful</span>
            </div>
          </AIBlock>

          {/* other answers */}
          <section>
            <SectionHeading title="Other things to try" hint="Ranked by how often they resolve this issue." />
            <div className="space-y-3">
              {rest.map((a) => (
                <AnswerCard key={a.title} answer={a} />
              ))}
            </div>
          </section>

          {/* escalate */}
          <Card className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--atr-surface-2)] text-[var(--atr-muted)]">
                <Icon name="lifebuoy" size={16} />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-[var(--atr-ink)]">Still need help?</p>
                <p className="text-[12px] text-[var(--atr-muted)]">Create a ticket and a human picks it up, usually within the hour.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" icon="ticket" onClick={onTicket}>
              Create a ticket
            </Button>
          </Card>
        </div>
      ) : (
        <EmptyState
          icon="search"
          title="Describe what's going wrong"
          body="Type your issue above and Workplace AI will surface the fastest known fix."
        />
      )}

      {/* knowledge base */}
      <section>
        <SectionHeading
          title="Knowledge base"
          hint="The most-read help articles."
          right={<Badge tone="neutral">{IT_KB_ARTICLES.length} articles</Badge>}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {IT_KB_ARTICLES.map((kb) => (
            <KBCard key={kb.id} article={kb} />
          ))}
        </div>
      </section>
    </div>
  );
}

function AnswerCard({ answer }: { answer: DeflectionAnswer }) {
  return (
    <Card hover>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13.5px] font-semibold text-[var(--atr-ink)]">{answer.title}</p>
        {answer.resolves && <Badge tone="up">Resolved most cases</Badge>}
      </div>
      <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--atr-muted)]">{answer.body}</p>
      <div className="mt-2.5 flex items-center gap-1.5 text-[12px] text-[var(--atr-faint)]">
        <Icon name="heart" size={13} className="text-[var(--atr-accent)]" />
        {answer.helpful} found this helpful
      </div>
    </Card>
  );
}

function KBCard({ article }: { article: KBArticle }) {
  return (
    <button className="text-left">
      <GlassCard hover className="flex h-full flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Badge tone="neutral">{article.category}</Badge>
          <span className="font-mono text-[11px] text-[var(--atr-faint)]">{article.readMins} min</span>
        </div>
        <p className="text-[13px] font-semibold leading-snug text-[var(--atr-ink)]">{article.title}</p>
        <div className="mt-auto flex items-center gap-1.5 pt-1 text-[11px] text-[var(--atr-faint)]">
          <Icon name="heart" size={12} className="text-[var(--atr-accent)]" />
          {article.helpful} helpful
          <Icon name="arrowRight" size={13} className="ml-auto text-[var(--atr-faint)]" />
        </div>
      </GlassCard>
    </button>
  );
}

/* ------------------------------------------------------------------ tickets --- */

function TicketsTab() {
  const columns: ReadonlyArray<Column<Ticket>> = [
    {
      key: "subject",
      label: "Ticket",
      render: (t) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-[var(--atr-ink)]">{t.subject}</span>
            {t.autoResolved && (
              <Badge tone="accent">
                <Icon name="sparkles" size={11} /> Auto-resolved by Workplace AI
              </Badge>
            )}
          </div>
          <span className="font-mono text-[11px] text-[var(--atr-faint)]">{t.id}</span>
        </div>
      ),
    },
    { key: "category", label: "Category", render: (t) => <Badge tone="neutral">{t.category}</Badge> },
    { key: "severity", label: "Severity", render: (t) => <Badge tone={severityTone[t.severity]}>{t.severity}</Badge> },
    {
      key: "status",
      label: "Status",
      render: (t) => (
        <Badge tone={statusTone[t.status]} dot={t.status === "in_progress" || t.status === "open"}>
          {statusLabel[t.status]}
        </Badge>
      ),
    },
    { key: "agent", label: "Owner", render: (t) => <span className="text-[var(--atr-muted)]">{t.agent}</span> },
    { key: "updated", label: "Updated", align: "right", render: (t) => <span className="text-[var(--atr-faint)]">{t.updated}</span> },
  ];

  if (!IT_TICKETS.length) {
    return <EmptyState icon="checkCircle" title="No tickets" body="You have nothing open. Workplace AI will keep it that way." />;
  }

  return (
    <div className="space-y-3">
      <p className="text-[12px] text-[var(--atr-muted)]">
        {IT_TICKETS.filter((t) => t.autoResolved).length} of your last {IT_TICKETS.length} tickets were resolved automatically.
      </p>
      <DataTable
        columns={columns}
        rows={IT_TICKETS}
        getKey={(t) => t.id}
        highlightRow={(t) => Boolean(t.autoResolved) && t.status === "auto_resolved"}
      />
    </div>
  );
}

/* ----------------------------------------------------------------- requests --- */

function RequestsTab() {
  const [requested, setRequested] = useState<string | null>(null);

  return (
    <section>
      <SectionHeading title="Request something" hint="Pick from the catalog. Role-standard requests are auto-approved." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {IT_REQUESTS.map((req) => (
          <RequestCard key={req.id} req={req} done={requested === req.id} onRequest={() => setRequested(req.id)} />
        ))}
      </div>
    </section>
  );
}

function RequestCard({ req, done, onRequest }: { req: ITRequest; done: boolean; onRequest: () => void }) {
  const instant = req.sla.toLowerCase().startsWith("instant");
  return (
    <GlassCard className="flex h-full flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
          <Icon name={req.icon as IconName} size={18} />
        </span>
        <Badge tone="neutral">{req.category}</Badge>
      </div>
      <div className="flex-1">
        <p className="text-[13.5px] font-semibold text-[var(--atr-ink)]">{req.name}</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--atr-muted)]">{req.desc}</p>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-[var(--atr-border)] pt-3">
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--atr-faint)]">
          <Icon name={instant ? "bolt" : "clock"} size={12} className={instant ? "text-[var(--atr-accent)]" : ""} />
          {req.sla}
        </span>
        {done ? (
          <Badge tone="up" dot>
            Requested
          </Badge>
        ) : (
          <Button size="sm" variant="outline" onClick={onRequest}>
            Request
          </Button>
        )}
      </div>
    </GlassCard>
  );
}

/* ------------------------------------------------------------------ status --- */

function StatusTab({ degraded }: { degraded: number }) {
  const allUp = degraded === 0;
  return (
    <div className="space-y-5">
      {/* summary header */}
      <GlassCard className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            allUp ? "bg-[#ecfdf3] text-[var(--atr-up)]" : "bg-[#fffbeb] text-[var(--atr-warn)]"
          }`}
        >
          <Icon name={allUp ? "checkCircle" : "alert"} size={20} />
        </span>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[var(--atr-ink)]">
            {allUp ? "All systems operational" : `${degraded} service${degraded > 1 ? "s" : ""} need attention`}
          </p>
          <p className="text-[12px] text-[var(--atr-muted)]">
            {IT_SYSTEM_STATUS.length} services monitored · updated continuously
          </p>
        </div>
        <Badge tone={allUp ? "up" : "warn"} dot>
          {allUp ? "Healthy" : "Watching"}
        </Badge>
      </GlassCard>

      <Card padded={false}>
        <ul>
          {IT_SYSTEM_STATUS.map((svc) => (
            <ServiceRow key={svc.name} svc={svc} />
          ))}
        </ul>
      </Card>
    </div>
  );
}

function ServiceRow({ svc }: { svc: SystemService }) {
  const dotColor: Record<ServiceStatus, string> = {
    operational: "var(--atr-up)",
    degraded: "var(--atr-warn)",
    maintenance: "var(--atr-accent-2)",
  };
  return (
    <li className="flex items-center gap-3 border-b border-[var(--atr-border)] px-4 py-3.5 last:border-0">
      <span className="relative flex h-2 w-2 shrink-0">
        {svc.status === "operational" && (
          <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: dotColor[svc.status], animation: "atr-pulse-ring 1.8s ease-out infinite" }} />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: dotColor[svc.status] }} />
      </span>
      <span className="flex-1 truncate text-[13px] font-medium text-[var(--atr-ink)]">{svc.name}</span>
      <span className="hidden font-mono text-[12px] text-[var(--atr-faint)] sm:inline">{svc.uptime} uptime</span>
      <Badge tone={serviceTone[svc.status]}>{serviceLabel[svc.status]}</Badge>
    </li>
  );
}
