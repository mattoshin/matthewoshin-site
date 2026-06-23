/**
 * vantage-modules-demo.ts - the heavier per-module sample datasets for the SecOps Command
 * demo (agentic security + IT operations command center). All data is fictional
 * and illustrative: invented hosts, IPs, CVE ids, actor names, users, and figures.
 * Nothing here is real and nothing talks to a live server.
 *
 * One typed export block per module. Module components (built in parallel) consume
 * these as a frozen contract, alongside the VantageKit primitives.
 */

import type {
  Severity,
  MitreTactic,
  DonutSegment,
  SystemStatus,
  IconName,
} from "@/components/demos/vantage/VantageKit";
import type { ProseBlock } from "@/components/demos/vantage/VantageKit";

/* =========================================================== ACTIVITY === */

export type ActivityEvent = {
  id: string;
  kind: "detection" | "agent" | "auth" | "config" | "asset" | "intel";
  icon: IconName;
  tone: string;
  level?: Severity;
  message: string;
  source: string;
  time: string;
  actor: string;
};

export const ACTIVITY_EVENTS: readonly ActivityEvent[] = [
  { id: "a1", kind: "agent", icon: "robot", tone: "var(--vnt-primary)", message: "Triage Agent auto-closed 12 scanner-noise alerts from the approved pentest range", source: "Triage Agent", time: "10:42:18", actor: "agent" },
  { id: "a2", kind: "detection", icon: "radar", tone: "var(--vnt-crit)", level: "critical", message: "EDR flagged process injection on EDGE-GW-07 (T1055)", source: "CrowdGuard EDR", time: "10:41:02", actor: "sensor" },
  { id: "a3", kind: "auth", icon: "fingerprint", tone: "var(--vnt-high)", level: "high", message: "127 failed SSO logins for j.okafor from 14 distinct IPs in 90s", source: "Okta", time: "10:39:55", actor: "identity" },
  { id: "a4", kind: "agent", icon: "shieldCheck", tone: "var(--vnt-accent)", message: "Phishing Responder revoked session and forced re-auth for j.okafor", source: "Phishing Responder", time: "10:39:58", actor: "agent" },
  { id: "a5", kind: "config", icon: "settings", tone: "var(--vnt-muted)", message: "Firewall rule FW-2207 changed: inbound 3389 closed on prod VPC", source: "NetOps", time: "10:35:11", actor: "m.alvarez" },
  { id: "a6", kind: "asset", icon: "server", tone: "var(--vnt-muted)", message: "3 new cloud VMs discovered in azure-prod-eus and auto-enrolled in EDR", source: "Asset Sync", time: "10:31:40", actor: "agent" },
  { id: "a7", kind: "intel", icon: "crosshair", tone: "var(--vnt-high)", level: "high", message: "New IOC batch ingested: 38 hashes linked to SILENTFORGE loader", source: "Threat Intel Feed", time: "10:28:03", actor: "feed" },
  { id: "a8", kind: "detection", icon: "bug", tone: "var(--vnt-high)", level: "high", message: "Vuln scanner found CVE-2026-3185 (RCE) on 3 edge hosts", source: "Tenable", time: "10:22:47", actor: "scanner" },
  { id: "a9", kind: "agent", icon: "bolt", tone: "var(--vnt-highlight)", message: "Patch Orchestrator staged remediation for CVE-2026-3185, window 02:00", source: "Patch Orchestrator", time: "10:23:10", actor: "agent" },
  { id: "a10", kind: "detection", icon: "database", tone: "var(--vnt-med)", level: "medium", message: "Anomalous 4.2GB egress from FIN-DB-02 to unrecognized ASN", source: "Zeek", time: "10:18:22", actor: "sensor" },
  { id: "a11", kind: "auth", icon: "userCheck", tone: "var(--vnt-up)", message: "Access review cleared: 14 dormant accounts disabled", source: "Identity Governance", time: "10:12:09", actor: "agent" },
  { id: "a12", kind: "config", icon: "key", tone: "var(--vnt-warn)", level: "low", message: "API key svc-billing-prod is 84 days old and flagged for rotation", source: "Secrets Registry", time: "10:05:51", actor: "system" },
  { id: "a13", kind: "agent", icon: "clipboardCheck", tone: "var(--vnt-up)", message: "Compliance Auditor attached 18 evidence artifacts to SOC 2 controls", source: "Compliance Auditor", time: "09:58:30", actor: "agent" },
  { id: "a14", kind: "intel", icon: "globe", tone: "var(--vnt-info)", level: "info", message: "Recon scan from known crawler ASN, no action required", source: "Perimeter", time: "09:51:14", actor: "sensor" },
];

/* ========================================================== INCIDENTS === */

export type IncidentStatus = "open" | "investigating" | "contained" | "resolved";
export type Incident = {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  owner: string;
  ownerIsAgent: boolean;
  source: string;
  category: string;
  slaMinsLeft: number;
  opened: string;
  assets: number;
};

export const INCIDENTS: readonly Incident[] = [
  { id: "INC-2042", title: "Unpatched RCE on internet-facing edge gateways", severity: "critical", status: "investigating", owner: "Patch Orchestrator", ownerIsAgent: true, source: "Tenable", category: "Vulnerability", slaMinsLeft: 42, opened: "18m ago", assets: 3 },
  { id: "INC-2041", title: "Credential-stuffing burst against SSO tenant", severity: "high", status: "contained", owner: "Phishing Responder", ownerIsAgent: true, source: "Okta", category: "Identity", slaMinsLeft: 120, opened: "1h ago", assets: 1 },
  { id: "INC-2039", title: "Anomalous data egress from finance database", severity: "medium", status: "open", owner: "Priya Raman", ownerIsAgent: false, source: "Zeek", category: "Exfiltration", slaMinsLeft: 280, opened: "3h ago", assets: 1 },
  { id: "INC-2038", title: "Expired TLS certificate on legacy intranet host", severity: "low", status: "open", owner: "Triage Agent", ownerIsAgent: true, source: "Cert Monitor", category: "Hygiene", slaMinsLeft: 1440, opened: "5h ago", assets: 1 },
  { id: "INC-2035", title: "Suspicious OAuth grant to unverified third-party app", severity: "high", status: "investigating", owner: "M. Alvarez", ownerIsAgent: false, source: "Microsoft 365", category: "Identity", slaMinsLeft: 95, opened: "6h ago", assets: 1 },
  { id: "INC-2031", title: "Beaconing traffic to newly-registered domain", severity: "medium", status: "investigating", owner: "Threat Hunter", ownerIsAgent: true, source: "DNS", category: "C2", slaMinsLeft: 210, opened: "9h ago", assets: 4 },
  { id: "INC-2028", title: "Privilege escalation attempt on build server", severity: "high", status: "resolved", owner: "Triage Agent", ownerIsAgent: true, source: "EDR", category: "Privilege", slaMinsLeft: 0, opened: "1d ago", assets: 1 },
  { id: "INC-2024", title: "Phishing campaign targeting finance team", severity: "medium", status: "resolved", owner: "Phishing Responder", ownerIsAgent: true, source: "Email Security", category: "Phishing", slaMinsLeft: 0, opened: "2d ago", assets: 12 },
];

/** The expanded detail for the focal incident (INC-2042), opened in the drawer. */
export type IncidentTimelineEntry = { time: string; actor: string; isAgent: boolean; text: string };
export const INCIDENT_DETAIL = {
  id: "INC-2042",
  title: "Unpatched RCE on internet-facing edge gateways",
  severity: "critical" as Severity,
  status: "investigating" as IncidentStatus,
  cve: "CVE-2026-3185",
  cvss: 9.8,
  category: "Vulnerability / RCE",
  affected: ["EDGE-GW-05", "EDGE-GW-06", "EDGE-GW-07"],
  triage: {
    agent: "Triage Agent",
    confidence: 0.94,
    summary:
      "A pre-auth remote code execution vulnerability (CVE-2026-3185, CVSS 9.8) was confirmed on three internet-facing edge gateways running an unpatched build of the VPN appliance. No exploitation observed yet, but a public PoC dropped 6 hours ago and perimeter logs show scanning against the affected path. Recommend emergency patch in the next maintenance window with a temporary WAF rule as compensating control now.",
    sections: [
      { heading: "Why this is critical", bullets: ["Pre-auth RCE, internet-facing, CVSS 9.8", "Public PoC released 6h ago; scanning already observed", "Affected hosts terminate VPN for 1,900 remote users"] },
      { heading: "Recommended response", bullets: ["Deploy WAF virtual-patch rule now (staged)", "Emergency-patch all 3 hosts in the 02:00 window", "Rotate VPN pre-shared keys post-patch", "Hunt for prior exploitation across the 6h exposure window"] },
    ] as ProseBlock[],
  },
  playbook: [
    { step: "Isolate", detail: "Apply WAF virtual patch to block the vulnerable path", done: true, byAgent: true },
    { step: "Stage fix", detail: "Patch Orchestrator queued vendor KB for 02:00 window", done: true, byAgent: true },
    { step: "Hunt", detail: "Threat Hunter sweeping 6h exposure window for IOCs", done: false, byAgent: true },
    { step: "Rotate", detail: "Rotate VPN PSKs and admin creds after patch", done: false, byAgent: false },
    { step: "Verify", detail: "Re-scan and confirm CVE closed on all 3 hosts", done: false, byAgent: false },
  ],
  timeline: [
    { time: "10:22", actor: "Tenable", isAgent: false, text: "Scanner confirmed CVE-2026-3185 on EDGE-GW-05/06/07" } as IncidentTimelineEntry,
    { time: "10:22", actor: "Triage Agent", isAgent: true, text: "Auto-opened INC-2042, scored Critical (0.94 confidence)" },
    { time: "10:23", actor: "Patch Orchestrator", isAgent: true, text: "Staged vendor KB rollout for the 02:00 maintenance window" },
    { time: "10:24", actor: "Triage Agent", isAgent: true, text: "Deployed WAF virtual-patch rule as compensating control" },
    { time: "10:31", actor: "Threat Hunter", isAgent: true, text: "Started retro-hunt across 6h perimeter-log exposure window" },
    { time: "10:40", actor: "Priya Raman", isAgent: false, text: "Acknowledged, approved emergency-patch window" },
  ],
};

/* ========================================================= DETECTIONS === */

export type DetectionRule = {
  id: string;
  name: string;
  tactic: string;
  source: string;
  severity: Severity;
  status: "enabled" | "tuning" | "disabled";
  fires24h: number;
  truePositiveRate: number;
};

export const DETECTION_RULES: readonly DetectionRule[] = [
  { id: "DET-118", name: "Process injection (CreateRemoteThread)", tactic: "Defense Evasion", source: "EDR", severity: "critical", status: "enabled", fires24h: 4, truePositiveRate: 0.91 },
  { id: "DET-094", name: "Impossible travel sign-in", tactic: "Initial Access", source: "Okta", severity: "high", status: "enabled", fires24h: 11, truePositiveRate: 0.62 },
  { id: "DET-076", name: "Mass failed auth (credential stuffing)", tactic: "Credential Access", source: "Okta", severity: "high", status: "enabled", fires24h: 7, truePositiveRate: 0.88 },
  { id: "DET-141", name: "DNS beaconing to new domain", tactic: "Command & Control", source: "DNS", severity: "medium", status: "enabled", fires24h: 23, truePositiveRate: 0.34 },
  { id: "DET-052", name: "Anomalous data egress volume", tactic: "Exfiltration", source: "Zeek", severity: "medium", status: "enabled", fires24h: 9, truePositiveRate: 0.55 },
  { id: "DET-160", name: "Suspicious OAuth consent grant", tactic: "Persistence", source: "M365", severity: "high", status: "tuning", fires24h: 16, truePositiveRate: 0.41 },
  { id: "DET-033", name: "Privilege escalation via service", tactic: "Privilege Escalation", source: "EDR", severity: "high", status: "enabled", fires24h: 2, truePositiveRate: 0.79 },
  { id: "DET-205", name: "Cloud IAM policy made public", tactic: "Defense Evasion", source: "AWS", severity: "critical", status: "enabled", fires24h: 1, truePositiveRate: 0.95 },
];

export const ALERT_VOLUME: readonly { label: string; value: number; color?: string }[] = [
  { label: "Mo", value: 320 }, { label: "Tu", value: 410 }, { label: "We", value: 380 },
  { label: "Th", value: 520 }, { label: "Fr", value: 470 }, { label: "Sa", value: 240 }, { label: "Su", value: 290 },
];

export const ALERT_DISPOSITION: readonly DonutSegment[] = [
  { label: "Auto-closed by agents", value: 71, color: "var(--vnt-primary)" },
  { label: "Escalated to analyst", value: 18, color: "var(--vnt-high)" },
  { label: "Open / triaging", value: 11, color: "var(--vnt-muted)" },
];

export type TopSignal = { signal: string; count: number; trend: number };
export const TOP_SIGNALS: readonly TopSignal[] = [
  { signal: "DNS beaconing to new domain", count: 23, trend: 18 },
  { signal: "Impossible travel sign-in", count: 11, trend: -6 },
  { signal: "Suspicious OAuth consent", count: 16, trend: 40 },
  { signal: "Anomalous egress volume", count: 9, trend: 4 },
];

export type TuningSuggestion = { rule: string; suggestion: string; impact: string };
export const TUNING_SUGGESTIONS: readonly TuningSuggestion[] = [
  { rule: "DET-141 · DNS beaconing", suggestion: "Allowlist 3 approved telemetry domains driving 61% of fires", impact: "-14 alerts/day" },
  { rule: "DET-160 · OAuth consent", suggestion: "Raise threshold to first-party-publisher-only for low-risk scopes", impact: "-9 alerts/day" },
  { rule: "DET-094 · Impossible travel", suggestion: "Exclude corporate VPN egress IPs from geo-velocity calc", impact: "-5 alerts/day" },
];

/* ======================================================= THREAT INTEL === */

export type Ioc = { indicator: string; type: "hash" | "domain" | "ip" | "url"; actor: string; firstSeen: string; severity: Severity; sightings: number };
export const IOCS: readonly Ioc[] = [
  { indicator: "a3f9...c21e (loader.dll)", type: "hash", actor: "SILENTFORGE", firstSeen: "6h ago", severity: "high", sightings: 2 },
  { indicator: "cdn-update[.]live", type: "domain", actor: "SILENTFORGE", firstSeen: "6h ago", severity: "high", sightings: 4 },
  { indicator: "193.41.x.88", type: "ip", actor: "GREYTIDE", firstSeen: "1d ago", severity: "critical", sightings: 11 },
  { indicator: "hxxps://invoice-portal[.]top/u", type: "url", actor: "GREYTIDE", firstSeen: "2d ago", severity: "medium", sightings: 7 },
  { indicator: "7be2...90af (stage2.bin)", type: "hash", actor: "Unattributed", firstSeen: "3d ago", severity: "medium", sightings: 1 },
  { indicator: "auth-verify[.]click", type: "domain", actor: "PHANTOMQUILL", firstSeen: "4d ago", severity: "low", sightings: 3 },
];

export type ThreatActor = { name: string; aka: string; motivation: string; activity: "active" | "monitoring" | "dormant"; ttps: string[]; relevance: Severity; summary: string };
export const THREAT_ACTORS: readonly ThreatActor[] = [
  { name: "SILENTFORGE", aka: "TA-0419", motivation: "Financial / ransomware", activity: "active", ttps: ["Loader delivery", "DLL sideloading", "Living-off-the-land"], relevance: "high", summary: "Recently shifted to a new loader observed targeting VPN appliances in your sector. Two IOCs already sighted in your environment." },
  { name: "GREYTIDE", aka: "TA-0277", motivation: "Espionage", activity: "monitoring", ttps: ["Spear-phishing", "OAuth abuse", "Cloud persistence"], relevance: "critical", summary: "Known for OAuth consent-grant persistence; matches the pattern behind INC-2035. Elevated relevance after the suspicious grant this morning." },
  { name: "PHANTOMQUILL", aka: "TA-0612", motivation: "Credential theft", activity: "dormant", ttps: ["Phishing kits", "Adversary-in-the-middle"], relevance: "low", summary: "Commodity phishing operator. No active campaigns against your domains in 30 days." },
];

export type CveWatchItem = { cve: string; product: string; cvss: number; severity: Severity; affectedAssets: number; exploited: boolean; status: "patching" | "open" | "mitigated" };
export const CVE_WATCH: readonly CveWatchItem[] = [
  { cve: "CVE-2026-3185", product: "Edge VPN Appliance", cvss: 9.8, severity: "critical", affectedAssets: 3, exploited: true, status: "patching" },
  { cve: "CVE-2026-2901", product: "OpenSSL 3.x", cvss: 7.5, severity: "high", affectedAssets: 64, exploited: false, status: "patching" },
  { cve: "CVE-2026-2744", product: "Apache Struts", cvss: 8.1, severity: "high", affectedAssets: 12, exploited: true, status: "open" },
  { cve: "CVE-2026-1180", product: "Windows Print Spooler", cvss: 6.8, severity: "medium", affectedAssets: 210, exploited: false, status: "mitigated" },
];

/** ATT&CK coverage for the MitreMatrix kit component. */
export const MITRE_TACTICS: readonly MitreTactic[] = [
  { name: "Initial Access", techniques: [{ name: "Phishing", covered: true }, { name: "Valid Accounts", covered: true }, { name: "Exploit Public App", covered: true }] },
  { name: "Execution", techniques: [{ name: "Command/Script", covered: true }, { name: "Scheduled Task", covered: false }] },
  { name: "Persistence", techniques: [{ name: "OAuth Tokens", covered: true }, { name: "Account Manip.", covered: true }, { name: "Boot/Logon", covered: false }] },
  { name: "Priv. Esc.", techniques: [{ name: "Token Abuse", covered: true }, { name: "Valid Accounts", covered: true }] },
  { name: "Defense Evasion", techniques: [{ name: "Process Inject.", covered: true }, { name: "Masquerading", covered: false }, { name: "Disable Tools", covered: true }] },
  { name: "Cred. Access", techniques: [{ name: "Brute Force", covered: true }, { name: "Cred. Dumping", covered: true }] },
  { name: "C2", techniques: [{ name: "App Layer Proto", covered: true }, { name: "DNS Tunneling", covered: true }] },
  { name: "Exfiltration", techniques: [{ name: "Over C2", covered: true }, { name: "Over Web Svc", covered: false }] },
];

export type IntelSource = { name: string; kind: "Feed" | "MCP" | "OSINT"; status: "connected" | "available"; blurb: string };
export const INTEL_SOURCES: readonly IntelSource[] = [
  { name: "MITRE ATT&CK", kind: "Feed", status: "connected", blurb: "Tactic/technique taxonomy and coverage mapping." },
  { name: "NVD / CVE", kind: "Feed", status: "connected", blurb: "National Vulnerability Database CVE enrichment." },
  { name: "AbuseCH / URLhaus", kind: "Feed", status: "connected", blurb: "Malware URLs and payload hashes." },
  { name: "Threat Intel MCP", kind: "MCP", status: "connected", blurb: "Agent-queryable actor + IOC graph." },
  { name: "GreyNoise", kind: "Feed", status: "available", blurb: "Internet background-noise scoring." },
  { name: "OSINT Crawler", kind: "OSINT", status: "available", blurb: "Paste sites and forum mention monitoring." },
];

/* ============================================================== ASSETS === */

export type Asset = {
  hostname: string;
  type: "endpoint" | "server" | "cloud" | "network";
  os: string;
  owner: string;
  ip: string;
  status: SystemStatus;
  risk: Severity;
  patchLevel: number;
  lastSeen: string;
};

export const ASSETS: readonly Asset[] = [
  { hostname: "EDGE-GW-07", type: "network", os: "VPN Appliance 4.2", owner: "NetOps", ip: "10.0.4.7", status: "degraded", risk: "critical", patchLevel: 61, lastSeen: "now" },
  { hostname: "FIN-DB-02", type: "server", os: "Ubuntu 22.04", owner: "Data Platform", ip: "10.2.1.12", status: "online", risk: "high", patchLevel: 88, lastSeen: "now" },
  { hostname: "BUILD-CI-04", type: "server", os: "Ubuntu 24.04", owner: "Platform Eng", ip: "10.2.3.41", status: "online", risk: "medium", patchLevel: 95, lastSeen: "2m ago" },
  { hostname: "WS-OKAFOR", type: "endpoint", os: "Windows 11", owner: "j.okafor", ip: "10.8.22.140", status: "online", risk: "high", patchLevel: 79, lastSeen: "1m ago" },
  { hostname: "azure-prod-eus-vm9", type: "cloud", os: "Windows Server 2022", owner: "Cloud Ops", ip: "172.16.9.31", status: "online", risk: "low", patchLevel: 99, lastSeen: "now" },
  { hostname: "WS-ALVAREZ", type: "endpoint", os: "macOS 15", owner: "m.alvarez", ip: "10.8.19.88", status: "online", risk: "low", patchLevel: 100, lastSeen: "4m ago" },
  { hostname: "INTRANET-LEG-01", type: "server", os: "Windows Server 2016", owner: "IT", ip: "10.1.0.9", status: "offline", risk: "medium", patchLevel: 72, lastSeen: "5h ago" },
  { hostname: "gcp-analytics-vm3", type: "cloud", os: "Debian 12", owner: "Analytics", ip: "192.168.5.23", status: "online", risk: "low", patchLevel: 97, lastSeen: "now" },
];

export const ASSET_STATUS: readonly DonutSegment[] = [
  { label: "Healthy", value: 4108, color: "var(--vnt-up)" },
  { label: "At risk", value: 86, color: "var(--vnt-high)" },
  { label: "Offline", value: 24, color: "var(--vnt-crit)" },
];

export const OS_DISTRIBUTION: readonly { label: string; value: number; color?: string }[] = [
  { label: "Win", value: 2420, color: "var(--vnt-info)" },
  { label: "macOS", value: 980, color: "var(--vnt-primary)" },
  { label: "Linux", value: 612, color: "var(--vnt-accent)" },
  { label: "Cloud", value: 206, color: "var(--vnt-highlight)" },
];

export type RiskAsset = { hostname: string; risk: Severity; reason: string; score: number };
export const TOP_RISK_ASSETS: readonly RiskAsset[] = [
  { hostname: "EDGE-GW-07", risk: "critical", reason: "Unpatched RCE, internet-facing", score: 98 },
  { hostname: "FIN-DB-02", risk: "high", reason: "Anomalous egress + sensitive data", score: 84 },
  { hostname: "WS-OKAFOR", risk: "high", reason: "Targeted by credential stuffing", score: 77 },
  { hostname: "INTRANET-LEG-01", risk: "medium", reason: "EOL OS, expired TLS cert", score: 61 },
];

/* ===================================================== VULNERABILITIES === */

export type Vuln = {
  cve: string;
  title: string;
  cvss: number;
  severity: Severity;
  asset: string;
  exploitAvailable: boolean;
  ageDays: number;
  status: "open" | "patching" | "mitigated" | "accepted";
};

export const VULNS: readonly Vuln[] = [
  { cve: "CVE-2026-3185", title: "Pre-auth RCE in edge VPN appliance", cvss: 9.8, severity: "critical", asset: "EDGE-GW-05/06/07", exploitAvailable: true, ageDays: 0, status: "patching" },
  { cve: "CVE-2026-2744", title: "Struts OGNL injection", cvss: 8.1, severity: "high", asset: "BUILD-CI-04", exploitAvailable: true, ageDays: 2, status: "open" },
  { cve: "CVE-2026-2901", title: "OpenSSL buffer overflow", cvss: 7.5, severity: "high", asset: "64 hosts", exploitAvailable: false, ageDays: 5, status: "patching" },
  { cve: "CVE-2026-2188", title: "Privilege escalation in service host", cvss: 7.8, severity: "high", asset: "WS-OKAFOR", exploitAvailable: false, ageDays: 3, status: "open" },
  { cve: "CVE-2026-1180", title: "Print Spooler RCE", cvss: 6.8, severity: "medium", asset: "210 endpoints", exploitAvailable: false, ageDays: 14, status: "mitigated" },
  { cve: "CVE-2026-0944", title: "Outdated TLS cipher suites", cvss: 5.3, severity: "medium", asset: "INTRANET-LEG-01", exploitAvailable: false, ageDays: 30, status: "open" },
  { cve: "CVE-2025-8821", title: "Verbose error info disclosure", cvss: 4.1, severity: "low", asset: "gcp-analytics-vm3", exploitAvailable: false, ageDays: 22, status: "accepted" },
];

export const VULN_SEVERITY_COUNTS: Partial<Record<Severity, number>> = { critical: 2, high: 9, medium: 31, low: 58 };

export const EXPOSURE_TREND: readonly number[] = [142, 138, 131, 129, 120, 116, 108, 100];

export type PatchStatusRow = { window: string; staged: number; applied: number; failed: number };
export const PATCH_STATUS: readonly PatchStatusRow[] = [
  { window: "02:00 tonight", staged: 3, applied: 0, failed: 0 },
  { window: "Last night", staged: 41, applied: 39, failed: 2 },
  { window: "This week", staged: 188, applied: 181, failed: 7 },
];

export type TopVulnAsset = { asset: string; openVulns: number; topSeverity: Severity };
export const TOP_VULN_ASSETS: readonly TopVulnAsset[] = [
  { asset: "EDGE-GW-07", openVulns: 6, topSeverity: "critical" },
  { asset: "INTRANET-LEG-01", openVulns: 14, topSeverity: "medium" },
  { asset: "WS-OKAFOR", openVulns: 5, topSeverity: "high" },
  { asset: "BUILD-CI-04", openVulns: 4, topSeverity: "high" },
];

/* ============================================================= NETWORK === */

export type Service = { name: string; tier: string; status: SystemStatus; uptime: number; latencyMs: number; region: string };
export const SERVICES: readonly Service[] = [
  { name: "Identity Provider (SSO)", tier: "Tier 0", status: "online", uptime: 99.99, latencyMs: 42, region: "us-east" },
  { name: "VPN Gateway", tier: "Tier 0", status: "degraded", uptime: 99.2, latencyMs: 180, region: "us-east" },
  { name: "Core API", tier: "Tier 1", status: "online", uptime: 99.95, latencyMs: 88, region: "us-east" },
  { name: "Finance Database", tier: "Tier 1", status: "online", uptime: 99.98, latencyMs: 12, region: "us-east" },
  { name: "Email Security Gateway", tier: "Tier 1", status: "online", uptime: 100, latencyMs: 31, region: "global" },
  { name: "Legacy Intranet", tier: "Tier 3", status: "offline", uptime: 91.4, latencyMs: 0, region: "on-prem" },
  { name: "Object Storage", tier: "Tier 2", status: "online", uptime: 99.97, latencyMs: 56, region: "multi" },
];

export type NetSegment = { name: string; posture: "enforced" | "monitor" | "open"; devices: number; flagged: number };
export const NETWORK_SEGMENTS: readonly NetSegment[] = [
  { name: "Production VPC", posture: "enforced", devices: 612, flagged: 1 },
  { name: "Corporate LAN", posture: "enforced", devices: 2840, flagged: 3 },
  { name: "Guest / IoT", posture: "monitor", devices: 410, flagged: 6 },
  { name: "DMZ", posture: "enforced", devices: 22, flagged: 1 },
  { name: "Legacy on-prem", posture: "open", devices: 88, flagged: 4 },
];

export type TrafficAnomaly = { description: string; severity: Severity; src: string; dst: string; time: string };
export const TRAFFIC_ANOMALIES: readonly TrafficAnomaly[] = [
  { description: "Large outbound transfer to unrecognized ASN", severity: "medium", src: "FIN-DB-02", dst: "AS-49xxx", time: "10:18" },
  { description: "DNS beaconing on 60s interval", severity: "medium", src: "WS-OKAFOR", dst: "cdn-update.live", time: "09:54" },
  { description: "Port-scan sweep across DMZ", severity: "low", src: "193.41.x.88", dst: "DMZ /24", time: "09:31" },
];

export const ZERO_TRUST = {
  score: 88,
  enforcedSegments: 3,
  totalSegments: 5,
  mfaOnAdmin: 100,
  microsegmented: 74,
} as const;

/* ============================================================ IDENTITY === */

export type IdentityUser = {
  user: string;
  name: string;
  role: string;
  mfa: boolean;
  privileged: boolean;
  riskScore: number;
  risk: Severity;
  lastSignin: string;
};

export const IDENTITY_USERS: readonly IdentityUser[] = [
  { user: "j.okafor", name: "Joseph Okafor", role: "Finance Analyst", mfa: true, privileged: false, riskScore: 77, risk: "high", lastSignin: "1m ago" },
  { user: "m.alvarez", name: "Maria Alvarez", role: "NetOps Engineer", mfa: true, privileged: true, riskScore: 22, risk: "low", lastSignin: "4m ago" },
  { user: "svc-billing", name: "Billing Service Acct", role: "Service Account", mfa: false, privileged: true, riskScore: 64, risk: "medium", lastSignin: "12m ago" },
  { user: "d.nguyen", name: "David Nguyen", role: "Domain Admin", mfa: true, privileged: true, riskScore: 38, risk: "low", lastSignin: "26m ago" },
  { user: "contractor-04", name: "Contractor (Temp)", role: "Vendor", mfa: false, privileged: false, riskScore: 58, risk: "medium", lastSignin: "2h ago" },
  { user: "k.bauer", name: "Karen Bauer", role: "Marketing", mfa: true, privileged: false, riskScore: 14, risk: "low", lastSignin: "33m ago" },
];

export const MFA_COVERAGE = { covered: 96, total: 100, privilegedCovered: 91, serviceAccountsGap: 7 } as const;

export type RiskySignin = { user: string; reason: string; severity: Severity; location: string; time: string };
export const RISKY_SIGNINS: readonly RiskySignin[] = [
  { user: "j.okafor", reason: "127 failed attempts from 14 IPs", severity: "high", location: "Multiple", time: "10:39" },
  { user: "contractor-04", reason: "Sign-in from unmanaged device, no MFA", severity: "medium", location: "Remote", time: "08:51" },
  { user: "svc-billing", reason: "Interactive login on a service account", severity: "medium", location: "Datacenter", time: "10:05" },
  { user: "d.nguyen", reason: "Off-hours admin sign-in (cleared)", severity: "low", location: "Corp VPN", time: "02:14" },
];

export type PrivAccount = { account: string; type: string; lastReview: string; status: "ok" | "review-due" | "stale" };
export const PRIV_ACCOUNTS: readonly PrivAccount[] = [
  { account: "Domain Admins (4)", type: "AD group", lastReview: "12 days ago", status: "ok" },
  { account: "AWS root + 3 IAM admins", type: "Cloud", lastReview: "40 days ago", status: "review-due" },
  { account: "svc-billing", type: "Service acct", lastReview: "94 days ago", status: "stale" },
  { account: "Break-glass (2)", type: "Emergency", lastReview: "8 days ago", status: "ok" },
];

export type AccessReview = { scope: string; items: number; cleared: number; agent: string };
export const ACCESS_REVIEWS: readonly AccessReview[] = [
  { scope: "Dormant accounts (>90d)", items: 22, cleared: 14, agent: "Identity Agent" },
  { scope: "Over-privileged finance roles", items: 9, cleared: 6, agent: "Identity Agent" },
  { scope: "Stale service-account keys", items: 7, cleared: 2, agent: "Identity Agent" },
];

/* ========================================================== COMPLIANCE === */

export type Framework = { name: string; readiness: number; controlsPassing: number; controlsTotal: number; status: "audit-ready" | "in-progress" | "gaps"; nextMilestone: string };
export const FRAMEWORKS: readonly Framework[] = [
  { name: "SOC 2 Type II", readiness: 94, controlsPassing: 58, controlsTotal: 62, status: "audit-ready", nextMilestone: "Audit window opens Aug 1" },
  { name: "ISO 27001", readiness: 88, controlsPassing: 102, controlsTotal: 114, status: "in-progress", nextMilestone: "Stage 2 in 6 weeks" },
  { name: "NIST CSF 2.0", readiness: 81, controlsPassing: 88, controlsTotal: 108, status: "in-progress", nextMilestone: "Govern fn at 64%" },
  { name: "PCI DSS 4.0", readiness: 72, controlsPassing: 188, controlsTotal: 264, status: "gaps", nextMilestone: "Segmentation test due" },
];

export type ControlRow = { id: string; name: string; framework: string; status: "pass" | "fail" | "partial"; owner: string; evidence: number };
export const CONTROLS: readonly ControlRow[] = [
  { id: "CC6.1", name: "Logical access controls enforced", framework: "SOC 2", status: "pass", owner: "Identity Agent", evidence: 12 },
  { id: "CC7.2", name: "Security monitoring + alerting", framework: "SOC 2", status: "pass", owner: "SOC", evidence: 9 },
  { id: "CC7.3", name: "Incident response evaluated + executed", framework: "SOC 2", status: "partial", owner: "SOC", evidence: 4 },
  { id: "A.8.8", name: "Management of technical vulnerabilities", framework: "ISO 27001", status: "partial", owner: "Patch Orchestrator", evidence: 6 },
  { id: "PR.AA", name: "Identity management + access control", framework: "NIST", status: "pass", owner: "Identity Agent", evidence: 11 },
  { id: "1.2.1", name: "Network segmentation controls", framework: "PCI DSS", status: "fail", owner: "NetOps", evidence: 1 },
];

export const AUDIT_READINESS = { overall: 84, evidenceCollected: 248, evidenceAuto: 71, openGaps: 9 } as const;

export type EvidenceItem = { control: string; artifact: string; collectedBy: string; when: string; auto: boolean };
export const EVIDENCE_FEED: readonly EvidenceItem[] = [
  { control: "CC6.1", artifact: "MFA enrollment export (3,140 identities)", collectedBy: "Compliance Auditor", when: "52m ago", auto: true },
  { control: "CC7.2", artifact: "30-day alert + triage log bundle", collectedBy: "Compliance Auditor", when: "1h ago", auto: true },
  { control: "A.8.8", artifact: "Vulnerability scan + remediation report", collectedBy: "Patch Orchestrator", when: "2h ago", auto: true },
  { control: "CC7.3", artifact: "INC-2024 post-incident review (manual)", collectedBy: "Priya Raman", when: "1d ago", auto: false },
];

/* ============================================================== AGENTS === */

export type AutonomyLevel = "suggest" | "approve" | "auto";
export type AutonomousAgent = {
  name: string;
  role: string;
  icon: IconName;
  tone: string;
  status: "active" | "needs-review" | "paused";
  autonomy: AutonomyLevel;
  runs7d: number;
  actions7d: number;
  successRate: number;
  lastAction: string;
  summary: string;
};

export const AGENTS: readonly AutonomousAgent[] = [
  { name: "Triage Agent", role: "Alert triage + enrichment", icon: "robot", tone: "var(--vnt-primary)", status: "active", autonomy: "auto", runs7d: 1840, actions7d: 1192, successRate: 0.97, lastAction: "2m ago", summary: "Triages every inbound alert, enriches with asset + identity context, auto-closes benign noise, and opens incidents for the rest." },
  { name: "Phishing Responder", role: "Email + credential threats", icon: "shieldCheck", tone: "var(--vnt-accent)", status: "active", autonomy: "auto", runs7d: 410, actions7d: 96, successRate: 0.95, lastAction: "9m ago", summary: "Quarantines malicious mail, revokes compromised sessions, and forces re-auth on credential-stuffing detections." },
  { name: "Patch Orchestrator", role: "Vulnerability remediation", icon: "bolt", tone: "var(--vnt-highlight)", status: "active", autonomy: "approve", runs7d: 188, actions7d: 181, successRate: 0.96, lastAction: "21m ago", summary: "Stages and applies patches in maintenance windows, tracks SLAs, and rolls back on failed deployments." },
  { name: "Threat Hunter", role: "Proactive hunting", icon: "crosshair", tone: "var(--vnt-crit)", status: "active", autonomy: "suggest", runs7d: 64, actions7d: 22, successRate: 0.88, lastAction: "34m ago", summary: "Runs hypothesis-driven hunts across logs, correlates weak signals, and opens incidents when it finds a real lead." },
  { name: "Compliance Auditor", role: "Evidence + control checks", icon: "clipboardCheck", tone: "var(--vnt-up)", status: "active", autonomy: "auto", runs7d: 96, actions7d: 248, successRate: 0.99, lastAction: "52m ago", summary: "Continuously collects control evidence, maps it to frameworks, and flags drift before an audit ever starts." },
  { name: "Identity Agent", role: "Access governance", icon: "fingerprint", tone: "var(--vnt-info)", status: "needs-review", autonomy: "approve", runs7d: 120, actions7d: 38, successRate: 0.92, lastAction: "1h ago", summary: "Reviews dormant and over-privileged accounts and proposes deprovisioning. Currently paused on 3 stale service keys awaiting your approval." },
];

export type AgentRun = { agent: string; action: string; result: "auto-resolved" | "escalated" | "staged" | "pending"; time: string };
export const AGENT_RUNS: readonly AgentRun[] = [
  { agent: "Triage Agent", action: "Closed 12 scanner-noise alerts", result: "auto-resolved", time: "2m ago" },
  { agent: "Phishing Responder", action: "Revoked session for j.okafor", result: "auto-resolved", time: "9m ago" },
  { agent: "Patch Orchestrator", action: "Staged CVE-2026-3185 rollout", result: "staged", time: "21m ago" },
  { agent: "Threat Hunter", action: "Opened INC-2039 (egress)", result: "escalated", time: "34m ago" },
  { agent: "Identity Agent", action: "Proposed disabling 3 stale keys", result: "pending", time: "1h ago" },
  { agent: "Compliance Auditor", action: "Attached 18 SOC 2 evidences", result: "auto-resolved", time: "52m ago" },
];

/* =============================================================== ADMIN === */

export type Operator = { name: string; initials: string; role: string; lastActive: string; mfa: boolean };
export const OPERATORS: readonly Operator[] = [
  { name: "Priya Raman", initials: "PR", role: "SOC & IT Ops Lead", lastActive: "now", mfa: true },
  { name: "Maria Alvarez", initials: "MA", role: "NetOps Engineer", lastActive: "4m ago", mfa: true },
  { name: "David Nguyen", initials: "DN", role: "Domain Admin", lastActive: "26m ago", mfa: true },
  { name: "Sam Cole", initials: "SC", role: "Tier-1 Analyst", lastActive: "1h ago", mfa: true },
];

export type ApiKey = { name: string; scope: string; created: string; lastUsed: string; ageDays: number; status: "active" | "rotate-soon" | "expired" };
export const API_KEYS: readonly ApiKey[] = [
  { name: "edr-ingest-prod", scope: "read:events", created: "2026-01-12", lastUsed: "now", ageDays: 41, status: "active" },
  { name: "siem-forwarder", scope: "write:alerts", created: "2025-11-02", lastUsed: "2m ago", ageDays: 112, status: "rotate-soon" },
  { name: "svc-billing-prod", scope: "read:assets", created: "2025-09-30", lastUsed: "12m ago", ageDays: 84, status: "rotate-soon" },
  { name: "cloud-scanner", scope: "read:cloud", created: "2026-02-01", lastUsed: "5m ago", ageDays: 21, status: "active" },
  { name: "legacy-webhook", scope: "write:tickets", created: "2025-03-14", lastUsed: "31d ago", ageDays: 280, status: "expired" },
];

export type Connector = { name: string; category: "EDR" | "SIEM" | "Cloud" | "Identity" | "Email" | "Vuln"; status: SystemStatus; events24h: string };
export const CONNECTORS: readonly Connector[] = [
  { name: "CrowdGuard EDR", category: "EDR", status: "online", events24h: "1.2M" },
  { name: "Splunk SIEM", category: "SIEM", status: "online", events24h: "8.4M" },
  { name: "AWS CloudTrail", category: "Cloud", status: "online", events24h: "640K" },
  { name: "Okta", category: "Identity", status: "online", events24h: "92K" },
  { name: "Microsoft 365", category: "Email", status: "degraded", events24h: "210K" },
  { name: "Tenable", category: "Vuln", status: "online", events24h: "18K" },
];

export type AuditEntry = { actor: string; isAgent: boolean; action: string; target: string; time: string };
export const AUDIT_LOG: readonly AuditEntry[] = [
  { actor: "Patch Orchestrator", isAgent: true, action: "Staged patch rollout", target: "EDGE-GW-05/06/07", time: "10:23:10" },
  { actor: "m.alvarez", isAgent: false, action: "Closed firewall rule FW-2207", target: "Production VPC", time: "10:35:11" },
  { actor: "Phishing Responder", isAgent: true, action: "Revoked active session", target: "j.okafor", time: "10:39:58" },
  { actor: "Priya Raman", isAgent: false, action: "Approved emergency-patch window", target: "INC-2042", time: "10:40:22" },
  { actor: "Identity Agent", isAgent: true, action: "Disabled dormant accounts (14)", target: "Directory", time: "10:12:09" },
  { actor: "system", isAgent: false, action: "Flagged API key for rotation", target: "svc-billing-prod", time: "10:05:51" },
];

export const USAGE_SPEND = {
  monthlyAgentRuns: 12840,
  monthlyActions: 3120,
  aiSpendMtd: "$1,840",
  aiSpendCap: "$3,000",
  ingestVolume: "11.1M events/day",
  retention: "400 days",
} as const;

export const SPEND_TREND: readonly { label: string; value: number; color?: string }[] = [
  { label: "W1", value: 410 }, { label: "W2", value: 470 }, { label: "W3", value: 520 }, { label: "W4", value: 440 },
];
