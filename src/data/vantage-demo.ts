/**
 * vantage-demo.ts - core sample data for the SecOps Command demo: an agentic security +
 * IT operations command center. SecOps Command is a genericized portfolio showpiece
 * adapted from the internal "command center" admin console Matthew built at ICR.
 * It is NOT a real product and talks to no live server: every asset, host, IP,
 * CVE, threat actor, incident, operator, and figure below is fictional and
 * illustrative. No real customer or company data appears anywhere.
 *
 * Core data lives here (brand, operator, nav, overview, landing copy); the heavier
 * per-module datasets live in vantage-modules-demo.ts.
 *
 * Dark "midnight-terminal" theme grounded in a Refero pass over real cybersecurity
 * command centers (Twingate + Axiom).
 */

import type { IconName, Severity, ThreatPoint } from "@/components/demos/vantage/VantageKit";

/* ----------------------------------------------------------------- brand --- */

export const VANTAGE = {
  name: "SecOps Command",
  product: "Agentic Security + IT Operations Command Center",
  tagline: "One command center for security and IT, run by autonomous agents",
  domain: "vantage.example.com",
  primary: "#b6abff",
  highlight: "#eef35f",
} as const;

/** The signed-in operator (a SOC + IT ops lead). */
export const VANTAGE_ACCOUNT = {
  name: "Priya Raman",
  initials: "PR",
  role: "SOC & IT Operations Lead",
  org: "Northgate Industries",
  team: "Blue Team / NOC",
} as const;

/* ------------------------------------------------------- platform stats --- */

export const VANTAGE_PLATFORM = {
  endpoints: 4218,
  monitoredServices: 142,
  autonomousAgents: 6,
  dataSources: 24,
  hoursSavedWeekly: 58,
  meanTimeToRespond: "11m",
} as const;

/* ----------------------------------------------------------- navigation --- */

export type ModuleId =
  | "overview"
  | "activity"
  | "incidents"
  | "detections"
  | "threat-intel"
  | "assets"
  | "vulnerabilities"
  | "network"
  | "identity"
  | "compliance"
  | "agents"
  | "admin";

export type NavItem = { id: ModuleId; label: string; icon: IconName };
export type NavSection = { label: string; color: string; items: NavItem[] };

export const VANTAGE_NAV: readonly NavSection[] = [
  {
    label: "Operations",
    color: "var(--vnt-sec-ops)",
    items: [
      { id: "overview", label: "Command Overview", icon: "dashboard" },
      { id: "activity", label: "Live Activity", icon: "activity" },
    ],
  },
  {
    label: "SecOps",
    color: "var(--vnt-sec-secops)",
    items: [
      { id: "incidents", label: "Incidents", icon: "alert" },
      { id: "detections", label: "Detections", icon: "radar" },
      { id: "threat-intel", label: "Threat Intel", icon: "crosshair" },
    ],
  },
  {
    label: "IT Ops",
    color: "var(--vnt-sec-itops)",
    items: [
      { id: "assets", label: "Asset Inventory", icon: "server" },
      { id: "vulnerabilities", label: "Vulnerabilities", icon: "bug" },
      { id: "network", label: "Network & Services", icon: "network" },
      { id: "identity", label: "Identity & Access", icon: "fingerprint" },
    ],
  },
  {
    label: "Governance",
    color: "var(--vnt-sec-gov)",
    items: [{ id: "compliance", label: "Compliance", icon: "clipboardCheck" }],
  },
  {
    label: "Automation",
    color: "var(--vnt-sec-auto)",
    items: [
      { id: "agents", label: "AI Agents", icon: "robot" },
      { id: "admin", label: "Admin & Keys", icon: "settings" },
    ],
  },
] as const;

/** Flat lookup of module id -> label, for the topbar/title. */
export const MODULE_LABELS: Record<ModuleId, string> = Object.fromEntries(
  VANTAGE_NAV.flatMap((s) => s.items.map((i) => [i.id, i.label])),
) as Record<ModuleId, string>;

/* ---------------------------------------------------------- overview --- */

/** Global security posture (0-100) and trend. */
export const POSTURE = {
  score: 86,
  label: "Posture score",
  sub: "+4 this week",
  trend: [78, 79, 77, 81, 80, 83, 84, 86],
  threatLevel: "Elevated" as "Guarded" | "Elevated" | "High" | "Severe",
} as const;

export const SECURITY_BRIEF = {
  greeting: "Good morning, Priya.",
  date: "Monday, June 22",
  body: "Overnight, agents auto-triaged 47 alerts and closed 41 with no human action. Two incidents are open: a credential-stuffing burst against the SSO tenant (contained by the Phishing Responder) and an unpatched RCE on three edge hosts that the Patch Orchestrator has staged for the 02:00 window. Posture is up 4 points on improved MFA coverage. One threat-intel item worth your eyes: a new loader linked to the actor tracked as SILENTFORGE.",
} as const;

/** Headline KPI tiles on the overview. `invert` marks metrics where up = bad. */
export type OverviewKpi = {
  label: string;
  value: string;
  delta: number;
  invert?: boolean;
  hint: string;
  icon: IconName;
  accent: string;
  spark: number[];
};
export const OVERVIEW_KPIS: readonly OverviewKpi[] = [
  { label: "Open incidents", value: "2", delta: -50, invert: true, hint: "vs 4 last week", icon: "alert", accent: "var(--vnt-crit)", spark: [6, 5, 7, 4, 5, 3, 4, 2] },
  { label: "Mean time to respond", value: "11m", delta: -22, invert: true, hint: "agent-assisted", icon: "clock", accent: "var(--vnt-primary)", spark: [22, 20, 18, 16, 15, 13, 12, 11] },
  { label: "Endpoints healthy", value: "97.4%", delta: 1.2, hint: "4,108 of 4,218", icon: "server", accent: "var(--vnt-accent)", spark: [94, 95, 95, 96, 96, 97, 97, 97.4] },
  { label: "Patch compliance", value: "92%", delta: 3.0, hint: "30-day SLA", icon: "shieldCheck", accent: "var(--vnt-up)", spark: [84, 85, 86, 88, 89, 90, 91, 92] },
];

/** Severity breakdown of currently-open findings (incidents + alerts). */
export const OPEN_SEVERITY_COUNTS: Partial<Record<Severity, number>> = {
  critical: 2,
  high: 9,
  medium: 23,
  low: 41,
};

/** The scrolling incident ticker on the overview. */
export type TickerItem = { id: string; level: Severity; text: string; time: string };
export const INCIDENT_TICKER: readonly TickerItem[] = [
  { id: "INC-2042", level: "critical", text: "Unpatched RCE (CVE-2026-3185) on 3 edge hosts", time: "18m" },
  { id: "INC-2041", level: "high", text: "Credential-stuffing burst on SSO tenant", time: "1h" },
  { id: "INC-2039", level: "medium", text: "Anomalous data egress from FIN-DB-02", time: "3h" },
  { id: "INC-2038", level: "low", text: "Expired TLS cert on legacy intranet host", time: "5h" },
];

/** Plotted threat origins for the overview map (0-100 coords, fictional). */
export const THREAT_MAP_POINTS: readonly ThreatPoint[] = [
  { x: 20, y: 40, level: "critical", label: "Brute force" },
  { x: 47, y: 30, level: "high", label: "Loader C2" },
  { x: 50, y: 60, level: "medium", label: "Scanner" },
  { x: 72, y: 38, level: "high", label: "Phishing" },
  { x: 84, y: 52, level: "low", label: "Recon" },
  { x: 26, y: 64, level: "medium", label: "Egress" },
  { x: 66, y: 24, level: "info", label: "Crawler" },
];

/** Recent autonomous-agent actions surfaced on the overview feed. */
export type AgentFeedItem = { id: string; agent: string; icon: IconName; tone: string; text: string; time: string; live?: boolean };
export const AGENT_FEED: readonly AgentFeedItem[] = [
  { id: "f1", agent: "Triage Agent", icon: "robot", tone: "var(--vnt-primary)", text: "Auto-closed 12 low-severity alerts as benign (scanner noise from approved pentest range)", time: "2m", live: true },
  { id: "f2", agent: "Phishing Responder", icon: "shieldCheck", tone: "var(--vnt-accent)", text: "Quarantined 1 inbox and revoked 1 session after credential-stuffing detection", time: "9m" },
  { id: "f3", agent: "Patch Orchestrator", icon: "bolt", tone: "var(--vnt-highlight)", text: "Staged KB-rollout for CVE-2026-3185 across 3 hosts, awaiting 02:00 window", time: "21m" },
  { id: "f4", agent: "Threat Hunter", icon: "crosshair", tone: "var(--vnt-crit)", text: "Opened INC-2039 after correlating egress volume with off-hours DB access", time: "34m" },
  { id: "f5", agent: "Compliance Auditor", icon: "clipboardCheck", tone: "var(--vnt-up)", text: "Collected 18 control evidences for the SOC 2 Type II window", time: "52m" },
  { id: "f6", agent: "Triage Agent", icon: "robot", tone: "var(--vnt-primary)", text: "Escalated INC-2041 to on-call after 3 failed auto-remediation attempts", time: "1h" },
];

export type QuickAction = { id: ModuleId; title: string; sub: string; icon: IconName; color: string };
export const QUICK_ACTIONS: readonly QuickAction[] = [
  { id: "incidents", title: "Open incident queue", sub: "2 active · 1 critical", icon: "alert", color: "var(--vnt-crit)" },
  { id: "threat-intel", title: "Review threat intel", sub: "SILENTFORGE loader", icon: "crosshair", color: "var(--vnt-high)" },
  { id: "vulnerabilities", title: "Triage vulnerabilities", sub: "9 high · 2 critical", icon: "bug", color: "var(--vnt-high)" },
  { id: "agents", title: "Inspect AI agents", sub: "6 active · 1 needs review", icon: "robot", color: "var(--vnt-primary)" },
  { id: "compliance", title: "Check compliance", sub: "SOC 2 · 94% ready", icon: "clipboardCheck", color: "var(--vnt-up)" },
  { id: "identity", title: "Identity posture", sub: "MFA 96% · 4 risky", icon: "fingerprint", color: "var(--vnt-accent)" },
];

/** Environment snapshot tiles (assets by class). */
export type EnvTile = { label: string; value: string; sub: string };
export const ENVIRONMENT_TILES: readonly EnvTile[] = [
  { label: "Endpoints", value: "4,218", sub: "97% healthy" },
  { label: "Servers", value: "612", sub: "41 cloud VMs" },
  { label: "Cloud accounts", value: "9", sub: "AWS · Azure · GCP" },
  { label: "Identities", value: "3,140", sub: "96% MFA" },
  { label: "Services", value: "142", sub: "138 online" },
  { label: "Data sources", value: "24", sub: "EDR · SIEM · cloud" },
];

/* -------------------------------------------------------- landing copy --- */

export type ModuleBlurb = { id: ModuleId; name: string; icon: IconName; blurb: string };
export const VANTAGE_MODULES: readonly ModuleBlurb[] = [
  { id: "incidents", name: "Incidents", icon: "alert", blurb: "An AI-triaged incident queue: agents summarize, score, and draft the playbook before a human ever opens the ticket." },
  { id: "detections", name: "Detections", icon: "radar", blurb: "Detection rules, alert volume, and the top signals, with agent tuning suggestions to kill noise automatically." },
  { id: "threat-intel", name: "Threat Intel", icon: "crosshair", blurb: "IOC feeds, threat-actor profiles, a CVE watch, and live ATT&CK coverage in one intelligence picture." },
  { id: "assets", name: "Asset Inventory", icon: "server", blurb: "Every endpoint, server, and cloud asset with health, owner, and risk, continuously reconciled." },
  { id: "vulnerabilities", name: "Vulnerabilities", icon: "bug", blurb: "A CVSS-scored backlog with patch status, exposure trend, and remediation SLAs the agents drive to zero." },
  { id: "identity", name: "Identity & Access", icon: "fingerprint", blurb: "MFA coverage, risky sign-ins, privileged accounts, and an access-review queue that clears itself." },
  { id: "compliance", name: "Compliance", icon: "clipboardCheck", blurb: "SOC 2, ISO 27001, NIST, and PCI posture with control status and agent-collected evidence." },
  { id: "agents", name: "AI Agents", icon: "robot", blurb: "A roster of autonomous agents, each with an autonomy level, run history, and a full audit of every action." },
];

export const VANTAGE_PAIN_POINTS: readonly { title: string; body: string }[] = [
  { title: "Alert fatigue is real", body: "A mid-size SOC drowns in thousands of daily alerts. Analysts burn out triaging noise while the real signal waits in the queue." },
  { title: "Tools don't talk", body: "EDR, SIEM, vuln scanners, identity, and cloud each live in their own console. Correlation is a human copy-pasting between ten tabs." },
  { title: "Response is too slow", body: "When a credential-stuffing burst or an RCE lands, minutes matter. Manual playbooks and approval chains cost the time you don't have." },
];

export const VANTAGE_STEPS: readonly { n: number; title: string; body: string }[] = [
  { n: 1, title: "Connect your stack", body: "Wire in EDR, SIEM, cloud, and identity. SecOps Command reconciles assets, identities, and signals into one live picture." },
  { n: 2, title: "Set agent autonomy", body: "Choose how far each autonomous agent can act on its own, from suggest-only to fully auto-remediate within guardrails." },
  { n: 3, title: "Run the command center", body: "Agents triage, contain, patch, and collect evidence around the clock. You supervise the exceptions, not the noise." },
];

export const VANTAGE_FACTS: readonly { value: string; label: string }[] = [
  { value: "6", label: "autonomous agents" },
  { value: "24", label: "data sources" },
  { value: "11m", label: "mean response" },
  { value: "58h", label: "saved / week" },
];

export const VANTAGE_STACK: readonly { group: string; color: string; items: string[] }[] = [
  { group: "Frontend", color: "var(--vnt-sec-ops)", items: ["Next.js 16", "React 19", "Tailwind v4", "shadcn/ui"] },
  { group: "Agents", color: "var(--vnt-sec-auto)", items: ["Anthropic Claude", "Tool use + guardrails", "Autonomy levels", "Action audit log"] },
  { group: "Data", color: "var(--vnt-sec-itops)", items: ["Postgres", "EDR + SIEM ingest", "Cloud APIs", "SSE event stream"] },
  { group: "Platform", color: "var(--vnt-sec-gov)", items: ["Role-based access", "Append-only audit", "Secrets registry", "Compliance evidence"] },
];
