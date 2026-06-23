"use client";

import {
  THREAT_ACTORS,
  IOCS,
  CVE_WATCH,
  MITRE_TACTICS,
  INTEL_SOURCES,
  type ThreatActor,
  type Ioc,
  type CveWatchItem,
  type IntelSource,
} from "@/data/vantage-modules-demo";
import {
  Card,
  StatCard,
  SectionHeading,
  SeverityBadge,
  Badge,
  Button,
  Icon,
  Chip,
  AIBlock,
  DataTable,
  MitreMatrix,
  StatusPill,
  type Column,
} from "../VantageKit";

/**
 * ThreatIntel - the unified intelligence picture: a KPI strip (active actors,
 * tracked IOCs, exploited CVEs, live ATT&CK coverage), tracked threat-actor
 * profiles, an ATT&CK coverage matrix, an IOC table paired with a CVE watch
 * list, and the intel-source roster (connected vs available). Agent-authored
 * intel synthesis carries the lime-bordered AIBlock signature.
 */

const ACTIVITY_TONE: Record<ThreatActor["activity"], string> = {
  active: "var(--vnt-crit)",
  monitoring: "var(--vnt-warn)",
  dormant: "var(--vnt-faint)",
};

const CVE_STATUS_TONE: Record<CveWatchItem["status"], string> = {
  patching: "var(--vnt-primary)",
  open: "var(--vnt-crit)",
  mitigated: "var(--vnt-up)",
};

const IOC_TYPE_ICON: Record<Ioc["type"], "fileText" | "globe" | "network" | "link"> = {
  hash: "fileText",
  domain: "globe",
  ip: "network",
  url: "link",
};

const SOURCE_KIND_ICON: Record<IntelSource["kind"], "layers" | "robot" | "eye"> = {
  Feed: "layers",
  MCP: "robot",
  OSINT: "eye",
};

export default function ThreatIntel() {
  const activeActors = THREAT_ACTORS.filter((a) => a.activity === "active").length;
  const exploitedCves = CVE_WATCH.filter((c) => c.exploited).length;

  const totalTechniques = MITRE_TACTICS.reduce((n, t) => n + t.techniques.length, 0);
  const coveredTechniques = MITRE_TACTICS.reduce(
    (n, t) => n + t.techniques.filter((tech) => tech.covered).length,
    0,
  );
  const coveragePct = Math.round((coveredTechniques / totalTechniques) * 100);

  const iocColumns: ReadonlyArray<Column<Ioc>> = [
    {
      key: "indicator",
      label: "Indicator",
      mono: true,
      render: (r) => (
        <span className="inline-flex items-center gap-2">
          <Icon name={IOC_TYPE_ICON[r.type]} size={13} className="shrink-0 text-[var(--vnt-faint)]" />
          <span className="truncate text-[var(--vnt-ink)]">{r.indicator}</span>
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      width: "84px",
      render: (r) => <Badge tone="neutral">{r.type.toUpperCase()}</Badge>,
    },
    {
      key: "actor",
      label: "Actor",
      width: "132px",
      render: (r) => <span className="font-mono text-[11px] text-[var(--vnt-accent)]">{r.actor}</span>,
    },
    {
      key: "severity",
      label: "Sev",
      width: "92px",
      render: (r) => <SeverityBadge level={r.severity} />,
    },
    {
      key: "sightings",
      label: "Sightings",
      width: "84px",
      align: "right",
      mono: true,
      render: (r) => <span className="text-[var(--vnt-ink-2)]">{r.sightings}</span>,
    },
    {
      key: "firstSeen",
      label: "First seen",
      width: "92px",
      align: "right",
      render: (r) => <span className="font-mono text-[11px] text-[var(--vnt-faint)]">{r.firstSeen}</span>,
    },
  ];

  return (
    <div className="space-y-7">
      {/* summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active actors"
          value={String(activeActors)}
          icon="crosshair"
          accent="var(--vnt-crit)"
          hint={`${THREAT_ACTORS.length} tracked`}
        />
        <StatCard
          label="Tracked IOCs"
          value={String(IOCS.length)}
          icon="radar"
          accent="var(--vnt-primary)"
          hint="across feeds"
        />
        <StatCard
          label="Exploited CVEs"
          value={String(exploitedCves)}
          icon="bug"
          accent="var(--vnt-high)"
          hint="on the watchlist"
        />
        <StatCard
          label="ATT&CK coverage"
          value={`${coveragePct}%`}
          icon="layers"
          accent="var(--vnt-accent)"
          hint={`${coveredTechniques}/${totalTechniques} techniques`}
        />
      </div>

      {/* agent intel synthesis */}
      <AIBlock
        tag="Intel brief"
        agent="Threat Hunter"
        title="Today's intelligence picture"
        footer="Synthesized from 4 connected feeds, the ATT&CK taxonomy, and live environment sightings"
      >
        Two actors are worth your eyes today. <span className="font-semibold text-[var(--vnt-ink)]">SILENTFORGE</span> shipped a
        new loader already sighted twice in your environment, and <span className="font-semibold text-[var(--vnt-ink)]">GREYTIDE</span>{" "}
        matches the OAuth consent-grant pattern behind INC-2035. {exploitedCves} watched CVEs have public exploitation, led by the
        internet-facing edge-VPN RCE. Detection coverage stands at {coveragePct}% of mapped ATT&CK techniques.
      </AIBlock>

      {/* threat actors */}
      <section>
        <SectionHeading
          title="Threat actors"
          hint="Tracked adversaries, ranked by relevance to your environment."
          right={<Badge tone="crit" dot>{activeActors} active</Badge>}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {THREAT_ACTORS.map((actor) => (
            <ThreatActorCard key={actor.name} actor={actor} />
          ))}
        </div>
      </section>

      {/* ATT&CK coverage */}
      <section>
        <SectionHeading
          title="ATT&CK coverage"
          hint={`${coveredTechniques} of ${totalTechniques} mapped techniques have an active detection.`}
          right={<Badge tone="teal">{coveragePct}% covered</Badge>}
        />
        <Card>
          <MitreMatrix tactics={MITRE_TACTICS} />
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[var(--vnt-border)] pt-3 text-[11px] text-[var(--vnt-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm border border-[var(--vnt-accent)]/30 bg-[var(--vnt-accent-wash)]" />
              Covered by a detection
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm border border-[var(--vnt-border)] bg-[var(--vnt-surface-2)]" />
              No active detection
            </span>
          </div>
        </Card>
      </section>

      {/* IOCs + CVE watch */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr]">
        <section className="min-w-0">
          <SectionHeading
            title="Indicators of compromise"
            hint="Live IOC feed, matched against your telemetry."
            right={<Button variant="outline" size="sm" icon="download">Export</Button>}
          />
          <DataTable columns={iocColumns} rows={IOCS} getKey={(r) => r.indicator} dense />
        </section>

        <section className="min-w-0">
          <SectionHeading
            title="CVE watch"
            hint="Vulnerabilities under active monitoring."
            right={<Badge tone="warn" dot>{exploitedCves} exploited</Badge>}
          />
          <div className="space-y-3">
            {CVE_WATCH.map((cve) => (
              <CveWatchCard key={cve.cve} cve={cve} />
            ))}
          </div>
        </section>
      </div>

      {/* intel sources */}
      <section>
        <SectionHeading
          title="Intel sources"
          hint={`${INTEL_SOURCES.filter((s) => s.status === "connected").length} connected · ${INTEL_SOURCES.filter((s) => s.status === "available").length} available to wire in.`}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INTEL_SOURCES.map((src) => (
            <IntelSourceCard key={src.name} src={src} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------- threat actor card --- */

function ThreatActorCard({ actor }: { actor: ThreatActor }) {
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)] text-[var(--vnt-crit)]">
              <Icon name="skull" size={15} />
            </span>
            <span className="truncate text-[14px] font-semibold tracking-tight text-[var(--vnt-ink)]">{actor.name}</span>
          </div>
          <div className="mt-1 font-mono text-[11px] text-[var(--vnt-faint)]">{actor.aka}</div>
        </div>
        <SeverityBadge level={actor.relevance} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-medium capitalize"
          style={{ color: ACTIVITY_TONE[actor.activity] }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACTIVITY_TONE[actor.activity] }} />
          {actor.activity}
        </span>
        <span className="text-[11px] text-[var(--vnt-faint)]">·</span>
        <span className="text-[11px] text-[var(--vnt-muted)]">{actor.motivation}</span>
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--vnt-muted)]">{actor.summary}</p>

      <div className="mt-3 border-t border-[var(--vnt-border)] pt-3">
        <div className="mb-2 text-[10px] font-medium uppercase tracking-wide text-[var(--vnt-faint)]">TTPs</div>
        <div className="flex flex-wrap gap-1.5">
          {actor.ttps.map((ttp) => (
            <Chip key={ttp}>{ttp}</Chip>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------- cve watch card --- */

function CveWatchCard({ cve }: { cve: CveWatchItem }) {
  return (
    <Card padded={false} hover className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-semibold text-[var(--vnt-ink)]">{cve.cve}</span>
            <SeverityBadge level={cve.severity} />
          </div>
          <div className="mt-1 text-[12px] text-[var(--vnt-muted)]">{cve.product}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[18px] font-semibold leading-none tabular-nums" style={{ color: SEVERITY_TONE(cve.severity) }}>
            {cve.cvss.toFixed(1)}
          </div>
          <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-[var(--vnt-faint)]">CVSS</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--vnt-border)] pt-3">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-medium capitalize"
          style={{ color: CVE_STATUS_TONE[cve.status] }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: CVE_STATUS_TONE[cve.status] }} />
          {cve.status}
        </span>
        {cve.exploited && (
          <Badge tone="crit">
            <Icon name="bolt" size={10} /> Exploited
          </Badge>
        )}
        <span className="ml-auto font-mono text-[11px] tabular-nums text-[var(--vnt-faint)]">
          {cve.affectedAssets} asset{cve.affectedAssets === 1 ? "" : "s"}
        </span>
      </div>
    </Card>
  );
}

/** Map a severity to its canonical token color via the frozen SEVERITY scale. */
function SEVERITY_TONE(level: CveWatchItem["severity"]): string {
  return `var(--vnt-${level === "critical" ? "crit" : level === "high" ? "high" : level === "medium" ? "med" : level === "low" ? "low" : "info"})`;
}

/* ------------------------------------------------------- intel source card --- */

function IntelSourceCard({ src }: { src: IntelSource }) {
  const connected = src.status === "connected";
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--vnt-surface-2)]"
            style={{ color: connected ? "var(--vnt-accent)" : "var(--vnt-faint)" }}
          >
            <Icon name={SOURCE_KIND_ICON[src.kind]} size={15} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-[var(--vnt-ink)]">{src.name}</div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--vnt-faint)]">{src.kind}</div>
          </div>
        </div>
        {connected ? (
          <StatusPill status="online" label="Connected" live />
        ) : (
          <StatusPill status="unknown" label="Available" />
        )}
      </div>
      <p className="mt-3 flex-1 text-[12px] leading-relaxed text-[var(--vnt-muted)]">{src.blurb}</p>
      <div className="mt-3 border-t border-[var(--vnt-border)] pt-3">
        {connected ? (
          <Button variant="ghost" size="sm" icon="settings" className="w-full">Manage</Button>
        ) : (
          <Button variant="outline" size="sm" icon="plus" className="w-full">Connect</Button>
        )}
      </div>
    </Card>
  );
}
