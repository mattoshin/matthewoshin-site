/**
 * atrium-modules-demo.ts - per-module sample data for the Workplace AI demo.
 *
 * Datasets for the IT Hub, Legal, People & HR, Automations, and Ask Workplace AI
 * modules. Everything is fictional and illustrative (the company is Northwind,
 * the employee Maya Chen). Nothing talks to a live server. Core brand/persona/nav
 * and the Home + App Hub data live in atrium-demo.ts.
 */

import type { IconName } from "@/components/demos/atrium/AtriumKit";
import type { ModuleId } from "@/data/atrium-demo";

/* ======================================================================== IT */

export type TicketStatus = "open" | "in_progress" | "auto_resolved" | "resolved";
export type Severity = "high" | "medium" | "low";

export type Ticket = {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  severity: Severity;
  opened: string;
  updated: string;
  agent: string;
  autoResolved?: boolean;
};

export const IT_TICKETS: readonly Ticket[] = [
  { id: "IT-4821", subject: "VPN won't connect from home network", category: "Network", status: "auto_resolved", severity: "medium", opened: "2d ago", updated: "Resolved 2:14 AM", agent: "Workplace AI", autoResolved: true },
  { id: "IT-4799", subject: "Request: external monitor for desk", category: "Hardware", status: "in_progress", severity: "low", opened: "3d ago", updated: "Shipping, arrives Wed", agent: "Ravi (IT)" },
  { id: "IT-4760", subject: "Figma SSO login loop", category: "Access", status: "auto_resolved", severity: "medium", opened: "1w ago", updated: "Resolved automatically", agent: "Workplace AI", autoResolved: true },
  { id: "IT-4712", subject: "Laptop running hot during calls", category: "Hardware", status: "resolved", severity: "low", opened: "2w ago", updated: "Closed", agent: "Dana (IT)" },
  { id: "IT-4690", subject: "Add me to the #design-system channel", category: "Access", status: "resolved", severity: "low", opened: "2w ago", updated: "Closed", agent: "Workplace AI", autoResolved: true },
];

/** The AI deflection flow: a typed issue resolves before a ticket is ever filed. */
export const IT_DEFLECTION_QUERY = "My VPN keeps disconnecting every few minutes";

export type DeflectionAnswer = { title: string; body: string; helpful: number; resolves: boolean };
export const IT_DEFLECTION_ANSWERS: readonly DeflectionAnswer[] = [
  { title: "Switch your VPN protocol to WireGuard", body: "Frequent drops on home Wi-Fi are usually the older IKEv2 profile. In the VPN client, open Settings, choose WireGuard, and reconnect. This fixes it for ~80% of cases.", helpful: 412, resolves: true },
  { title: "Forget and rejoin your home network", body: "A stale DHCP lease can interrupt the tunnel. Forget the network, rejoin, then reconnect the VPN.", helpful: 173, resolves: false },
  { title: "Disable IPv6 on the adapter", body: "Some ISPs misroute IPv6 traffic outside the tunnel. Disabling IPv6 on the active adapter stabilizes the connection.", helpful: 96, resolves: false },
];

export type KBArticle = { id: string; title: string; category: string; readMins: number; helpful: number };
export const IT_KB_ARTICLES: readonly KBArticle[] = [
  { id: "kb1", title: "Set up a passkey for every internal app", category: "Security", readMins: 2, helpful: 980 },
  { id: "kb2", title: "Connect to the VPN from any device", category: "Network", readMins: 3, helpful: 642 },
  { id: "kb3", title: "Request software and manage app access", category: "Access", readMins: 2, helpful: 511 },
  { id: "kb4", title: "Reset your password or recover your account", category: "Security", readMins: 1, helpful: 1230 },
  { id: "kb5", title: "Print to the NYC office printers", category: "Hardware", readMins: 2, helpful: 188 },
  { id: "kb6", title: "Set up email on your phone", category: "Email", readMins: 2, helpful: 274 },
];

export type ITRequest = { id: string; name: string; icon: IconName; category: "Device" | "Access" | "Software"; sla: string; desc: string };
export const IT_REQUESTS: readonly ITRequest[] = [
  { id: "r1", name: "New laptop", icon: "laptop", category: "Device", sla: "3 to 5 days", desc: "Refresh or replacement, auto-configured to your role." },
  { id: "r2", name: "External monitor", icon: "laptop", category: "Device", sla: "2 to 3 days", desc: "27-inch 4K, shipped to your desk or home." },
  { id: "r3", name: "App access", icon: "key", category: "Access", sla: "Instant to 1 day", desc: "Request access to any app, auto-approved by role policy." },
  { id: "r4", name: "Software license", icon: "grid", category: "Software", sla: "Instant", desc: "Add a paid seat for a tool you already have access to." },
  { id: "r5", name: "Phone or accessory", icon: "phone", category: "Device", sla: "3 to 5 days", desc: "Company phone, headset, dock, or peripherals." },
  { id: "r6", name: "Guest Wi-Fi or visitor access", icon: "globe", category: "Access", sla: "Instant", desc: "Temporary network and building access for a guest." },
];

export type ServiceStatus = "operational" | "degraded" | "maintenance";
export type SystemService = { name: string; status: ServiceStatus; uptime: string };
export const IT_SYSTEM_STATUS: readonly SystemService[] = [
  { name: "Email & Calendar", status: "operational", uptime: "99.99%" },
  { name: "Single sign-on (Okta)", status: "operational", uptime: "99.98%" },
  { name: "VPN & Network", status: "operational", uptime: "99.95%" },
  { name: "Slack", status: "operational", uptime: "99.99%" },
  { name: "Figma", status: "degraded", uptime: "98.20%" },
  { name: "Workday", status: "maintenance", uptime: "99.90%" },
];

export const IT_STATS = { autoResolveRate: 78, avgResolveMins: 9, openTickets: 2, satisfaction: 4.8 } as const;

/* ==================================================================== LEGAL */

export type RequestStatus = "submitted" | "in_review" | "approved" | "completed";

export type LegalRequestType = { id: string; name: string; icon: IconName; desc: string; turnaround: string };
export const LEGAL_REQUEST_TYPES: readonly LegalRequestType[] = [
  { id: "nda", name: "NDA", icon: "lock", desc: "Mutual or one-way non-disclosure agreement.", turnaround: "Same day" },
  { id: "vendor", name: "Vendor agreement", icon: "briefcase", desc: "Review or draft a vendor or SaaS contract.", turnaround: "2 to 3 days" },
  { id: "review", name: "Contract review", icon: "fileText", desc: "AI first-pass plus attorney review of any contract.", turnaround: "1 to 2 days" },
  { id: "sow", name: "Statement of work", icon: "fileText", desc: "Scope, deliverables, and terms for a project.", turnaround: "2 days" },
  { id: "employment", name: "Employment / offer", icon: "users", desc: "Offer letters, contractor agreements, amendments.", turnaround: "1 day" },
  { id: "trademark", name: "Brand / IP question", icon: "shield", desc: "Trademark, copyright, and brand-use questions.", turnaround: "3 days" },
];

export type LegalRequest = { id: string; title: string; type: string; status: RequestStatus; submitted: string; owner: string };
export const LEGAL_REQUESTS: readonly LegalRequest[] = [
  { id: "L-2041", title: "Brightwave Studios mutual NDA", type: "NDA", status: "in_review", submitted: "Today, 8:51 AM", owner: "Workplace AI + you" },
  { id: "L-2032", title: "Senior Motion Designer offer letter", type: "Employment", status: "approved", submitted: "Friday", owner: "Priya (Legal)" },
  { id: "L-2018", title: "Lumen Analytics data processing addendum", type: "Vendor", status: "completed", submitted: "2 weeks ago", owner: "Priya (Legal)" },
];

/** The AI contract-review showpiece: a risk score plus clause-level flags. */
export type ReviewSeverity = "high" | "medium" | "low";
export type ReviewFlag = { clause: string; severity: ReviewSeverity; issue: string; suggestion: string };
export type ContractReview = {
  docName: string;
  parties: string;
  riskScore: number;
  recommendation: string;
  summary: string;
  flags: readonly ReviewFlag[];
};
export const LEGAL_CONTRACT_REVIEW: ContractReview = {
  docName: "Brightwave Studios - Mutual NDA (v2).pdf",
  parties: "Northwind, Inc. and Brightwave Studios LLC",
  riskScore: 34,
  recommendation: "Low to moderate risk. Two clauses need a redline before signature.",
  summary:
    "This is a standard mutual NDA. Definitions, governing law (Delaware), and the confidentiality scope are all market-standard. Two terms deviate from Northwind's playbook and should be tightened before you sign.",
  flags: [
    { clause: "Term (Section 6)", severity: "high", issue: "Confidentiality survives for 7 years. Northwind's standard is 3 years for a mutual NDA.", suggestion: "Redline 'seven (7) years' to 'three (3) years' to match policy." },
    { clause: "Governing law (Section 9)", severity: "medium", issue: "Specifies California courts. Northwind defaults to Delaware for inbound NDAs.", suggestion: "Propose Delaware, or accept California only if the relationship warrants it." },
    { clause: "Definition of Confidential Information (Section 1)", severity: "low", issue: "Carve-out for independently developed information is present and correct.", suggestion: "No change needed. Flagging as reviewed and acceptable." },
  ],
};

export type LegalPolicy = { id: string; title: string; category: string; updated: string; summary: string };
export const LEGAL_POLICIES: readonly LegalPolicy[] = [
  { id: "po1", title: "Code of Conduct", category: "Company", updated: "Apr 2026", summary: "How we treat each other, conflicts of interest, and reporting." },
  { id: "po2", title: "Acceptable Use & Data Security", category: "Security", updated: "May 2026", summary: "Handling company data, devices, and customer information." },
  { id: "po3", title: "Travel & Expense Policy", category: "Finance", updated: "Mar 2026", summary: "What is reimbursable, limits, and how to file." },
  { id: "po4", title: "Remote & Hybrid Work", category: "People", updated: "Feb 2026", summary: "Expectations, stipends, and in-office days." },
  { id: "po5", title: "Intellectual Property & Inventions", category: "Legal", updated: "Jan 2026", summary: "Ownership of work product and open-source contributions." },
  { id: "po6", title: "Parental & Family Leave", category: "People", updated: "Apr 2026", summary: "16 weeks paid for all new parents, plus phased return." },
];

export type SignatureStatus = "awaiting_you" | "awaiting_them" | "completed";
export type SignatureDoc = { id: string; doc: string; counterparty: string; status: SignatureStatus; date: string };
export const LEGAL_SIGNATURES: readonly SignatureDoc[] = [
  { id: "s1", doc: "Senior Motion Designer - Offer Letter", counterparty: "Jordan Avery", status: "awaiting_you", date: "Sent Friday" },
  { id: "s2", doc: "Brightwave Studios - Mutual NDA", counterparty: "Brightwave Studios", status: "awaiting_them", date: "Sent today" },
  { id: "s3", doc: "Lumen Analytics - DPA", counterparty: "Lumen Analytics", status: "completed", date: "Completed 2w ago" },
  { id: "s4", doc: "Conference Speaker Release", counterparty: "DesignWeek NYC", status: "completed", date: "Completed 3w ago" },
];

/* ============================================================== PEOPLE & HR */

export type PtoBucket = { label: string; icon: IconName; used: number; total: number; unit: string };
export const PTO_BALANCE: readonly PtoBucket[] = [
  { label: "Vacation", icon: "umbrella", used: 8, total: 20, unit: "days" },
  { label: "Sick", icon: "heart", used: 2, total: 10, unit: "days" },
  { label: "Personal", icon: "star", used: 1, total: 5, unit: "days" },
];

export type PtoRequest = { id: string; type: string; dates: string; days: number; status: RequestStatus };
export const PTO_REQUESTS: readonly PtoRequest[] = [
  { id: "t1", type: "Vacation", dates: "Aug 18 to Aug 22", days: 5, status: "approved" },
  { id: "t2", type: "Personal", dates: "Jul 3", days: 1, status: "submitted" },
  { id: "t3", type: "Vacation", dates: "May 12 to May 16", days: 5, status: "completed" },
];

export type TeamOut = { name: string; initials: string; dates: string; reason: string; color: string };
export const TEAM_OUT: readonly TeamOut[] = [
  { name: "Devin Park", initials: "DP", dates: "Jul 8 to Jul 12", reason: "Vacation", color: "#6d4aff" },
  { name: "Sara Lin", initials: "SL", dates: "Jul 1", reason: "Personal", color: "#22b8e0" },
  { name: "Omar Reyes", initials: "OR", dates: "Jun 30 to Jul 2", reason: "Conference", color: "#0ea5a3" },
];

export const PAY_SUMMARY = {
  nextPayDate: "June 30",
  netPay: "$4,820.16",
  gross: "$6,750.00",
  taxes: "$1,512.40",
  deductions: "$417.44",
  ytdGross: "$40,500.00",
} as const;

export type Paystub = { id: string; period: string; net: string; date: string };
export const PAYSTUBS: readonly Paystub[] = [
  { id: "ps1", period: "Jun 1 to Jun 15", net: "$4,820.16", date: "Jun 15" },
  { id: "ps2", period: "May 16 to May 31", net: "$4,820.16", date: "May 31" },
  { id: "ps3", period: "May 1 to May 15", net: "$4,795.02", date: "May 15" },
];

export type DirectoryPerson = { name: string; initials: string; role: string; team: string; location: string; color: string; isManager?: boolean };
export const DIRECTORY: readonly DirectoryPerson[] = [
  { name: "Elena Voss", initials: "EV", role: "Director of Design", team: "Design", location: "New York", color: "#6d4aff", isManager: true },
  { name: "Devin Park", initials: "DP", role: "Product Designer", team: "Design", location: "New York", color: "#22b8e0" },
  { name: "Sara Lin", initials: "SL", role: "Design Engineer", team: "Design", location: "Remote", color: "#0ea5a3" },
  { name: "Omar Reyes", initials: "OR", role: "UX Researcher", team: "Design", location: "Austin", color: "#a855f7" },
  { name: "Priya Nair", initials: "PN", role: "Corporate Counsel", team: "Legal", location: "New York", color: "#d97706" },
  { name: "Ravi Shah", initials: "RS", role: "IT Support Lead", team: "IT", location: "New York", color: "#0ea5a3" },
];

export type Benefit = { id: string; name: string; icon: IconName; plan: string; detail: string };
export const BENEFITS: readonly Benefit[] = [
  { id: "b1", name: "Health insurance", icon: "heart", plan: "Aetna PPO, Family", detail: "$0 premium, $250 deductible." },
  { id: "b2", name: "401(k) match", icon: "creditCard", plan: "6% match, fully vested", detail: "Currently contributing 8%." },
  { id: "b3", name: "Learning stipend", icon: "star", plan: "$2,000 / year", detail: "$1,400 remaining for 2026." },
  { id: "b4", name: "Wellness", icon: "umbrella", plan: "$75 / month", detail: "Gym, therapy, and wellness apps." },
];

/* =============================================================== AUTOMATIONS */

export type AutomationCategory = "IT" | "HR" | "Finance" | "Legal" | "Productivity";
export type Automation = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  category: AutomationCategory;
  icon: IconName;
  runsMonth: number;
  savedHrsMonth: number;
  enabled: boolean;
  scope: "Just me" | "My team" | "Company";
};
export const AUTOMATIONS: readonly Automation[] = [
  { id: "au1", name: "Auto-resolve common IT tickets", trigger: "When you file an IT ticket", action: "Match to a known fix and resolve it before a human sees it", category: "IT", icon: "lifebuoy", runsMonth: 64, savedHrsMonth: 9.2, enabled: true, scope: "Company" },
  { id: "au2", name: "Provision app access by role", trigger: "When you request a role-standard app", action: "Auto-approve and provision the SSO seat", category: "IT", icon: "key", runsMonth: 38, savedHrsMonth: 5.1, enabled: true, scope: "Company" },
  { id: "au3", name: "File expenses from receipts", trigger: "When a receipt lands in your inbox", action: "Read it, categorize it, and submit the expense report", category: "Finance", icon: "creditCard", runsMonth: 27, savedHrsMonth: 3.4, enabled: true, scope: "Just me" },
  { id: "au4", name: "Pre-review inbound NDAs", trigger: "When an NDA is sent to Legal", action: "Run a clause-level risk review and draft redlines", category: "Legal", icon: "scale", runsMonth: 12, savedHrsMonth: 4.0, enabled: true, scope: "Company" },
  { id: "au5", name: "Summarize meetings into action items", trigger: "After a recorded meeting", action: "Post a summary and assign action items in the project", category: "Productivity", icon: "message", runsMonth: 31, savedHrsMonth: 2.6, enabled: true, scope: "My team" },
  { id: "au6", name: "Onboard new designers", trigger: "When a designer joins your team", action: "Grant the design app bundle and share the starter docs", category: "HR", icon: "users", runsMonth: 3, savedHrsMonth: 1.2, enabled: false, scope: "My team" },
];

export type AutomationRun = { id: string; automation: string; detail: string; time: string; savedMins: number };
export const AUTOMATION_RUNLOG: readonly AutomationRun[] = [
  { id: "ar1", automation: "Auto-resolve common IT tickets", detail: "Closed IT-4821 (VPN) by switching your profile to WireGuard.", time: "2:14 AM", savedMins: 35 },
  { id: "ar2", automation: "Pre-review inbound NDAs", detail: "Flagged 2 clauses on the Brightwave NDA and drafted redlines.", time: "8:51 AM", savedMins: 40 },
  { id: "ar3", automation: "File expenses from receipts", detail: "Submitted 6 Lisbon receipts as one report ($1,284.50).", time: "Yesterday", savedMins: 25 },
  { id: "ar4", automation: "Provision app access by role", detail: "Granted your Figma Organization seat under the Design policy.", time: "Yesterday", savedMins: 20 },
  { id: "ar5", automation: "Summarize meetings into action items", detail: "Turned the design crit recording into 7 action items in Linear.", time: "2d ago", savedMins: 18 },
];

export const AUTOMATION_IMPACT = { hoursSavedMonth: 26, runsMonth: 184, activeCount: 12, successRate: 99 } as const;

/** The plain-English automation builder: intent in, a runnable workflow out. */
export type BuilderStep = { n: number; label: string; detail: string };
export const AUTOMATION_BUILDER = {
  prompt: "When a candidate accepts an offer, set up their first day for me",
  trigger: "Greenhouse: candidate marked 'Offer accepted'",
  steps: [
    { n: 1, label: "Create their accounts", detail: "Provision email, Slack, and the role-standard app bundle via Okta." },
    { n: 2, label: "Order their laptop", detail: "File an IT device request configured to their role and ship to their address." },
    { n: 3, label: "Schedule onboarding", detail: "Book the orientation, a manager 1:1, and a buddy intro on their first day." },
    { n: 4, label: "Share the starter kit", detail: "Send the welcome doc, org chart, and team norms in a Slack DM." },
  ] as readonly BuilderStep[],
  dryRun: {
    summary: "Tested against the last 3 hires. Would have run end to end with no manual steps.",
    sample: "Jordan Avery accepted today. Workplace AI would create 5 accounts, order a 16-inch laptop to Brooklyn, book 3 meetings, and send the starter kit. Est. time saved: 2.5 hours per hire.",
  },
} as const;

export type AutomationTemplate = { id: string; title: string; desc: string; icon: IconName };
export const AUTOMATION_TEMPLATES: readonly AutomationTemplate[] = [
  { id: "tp1", title: "Weekly status roundup", desc: "Every Friday, summarize my team's updates and post to Slack.", icon: "message" },
  { id: "tp2", title: "Renewal reminders", desc: "Alert me 30 days before any software contract renews.", icon: "clock" },
  { id: "tp3", title: "PTO coverage check", desc: "When someone requests time off, confirm coverage before I approve.", icon: "umbrella" },
  { id: "tp4", title: "New-vendor intake", desc: "Route every new vendor through security and legal review.", icon: "shield" },
];

/* ================================================================ ASSISTANT */

export const ASSISTANT_PROMPTS: readonly string[] = [
  "Request a new laptop",
  "What's our parental-leave policy?",
  "Summarize what needs my approval today",
  "Get me access to Salesforce",
  "How many vacation days do I have left?",
  "Draft a PTO request for next Friday",
];

export type AssistantCapability = { icon: IconName; title: string; desc: string };
export const ASSISTANT_CAPABILITIES: readonly AssistantCapability[] = [
  { icon: "lifebuoy", title: "Fix IT issues", desc: "Troubleshoot and file or resolve tickets for you." },
  { icon: "key", title: "Get you access", desc: "Request and provision the apps you need." },
  { icon: "scale", title: "Answer policy questions", desc: "Search every policy and give you the grounded answer." },
  { icon: "bolt", title: "Take action", desc: "File requests, draft documents, and book time across your tools." },
];

/** A card the assistant attaches to a turn to show it acted in another module. */
export type ActionCard = { icon: IconName; label: string; detail: string; module: ModuleId };
export type AssistantTurn = { role: "user" | "ai"; text: string; actions?: readonly ActionCard[] };

/** A scripted thread that shows the assistant acting across modules. */
export const ASSISTANT_THREAD: readonly AssistantTurn[] = [
  { role: "user", text: "I'm starting a new project with an outside studio. Can you get me set up?" },
  {
    role: "ai",
    text: "Happy to. I will get the paperwork moving, set up access, and put it on your radar. Here is what I just did and what is waiting on you.",
    actions: [
      { icon: "scale", label: "Sent a mutual NDA to Brightwave Studios", detail: "Pre-reviewed it first: 2 redlines drafted for your approval.", module: "legal" },
      { icon: "grid", label: "Requested a FigJam seat for the kickoff", detail: "Auto-approved under your Design role policy.", module: "apps" },
      { icon: "umbrella", label: "Blocked focus time for the kickoff", detail: "Thursday 2 to 4pm, with the studio invited.", module: "home" },
    ],
  },
  { role: "user", text: "Perfect. Also, how much of my learning stipend is left?" },
  {
    role: "ai",
    text: "You have $1,400 of your $2,000 learning stipend left for 2026. Conferences, courses, and books all qualify. Want me to start a reimbursement, or hold a course you have in mind?",
    actions: [{ icon: "creditCard", label: "Learning stipend: $1,400 remaining", detail: "Resets January 1. View in People & HR.", module: "people" }],
  },
];
