/**
 * atrium-demo.ts - core sample data for the Atrium demo.
 *
 * Atrium is an UNBRANDED concept by Matthew Oshin: a redesign of the corporate
 * employee workspace that puts every internal tool (app launcher, IT, legal, HR)
 * in one place and lets AI quietly automate the busywork. This is a portfolio
 * design piece on entirely fictional sample data: the company (Northwind), the
 * employee (Maya Chen), every app, ticket, policy, and automation below is made
 * up and illustrative. Nothing talks to a live server.
 *
 * Core data (brand, persona, nav, home, apps, landing copy) lives here; the
 * heavier per-module datasets (IT, Legal, People, Automations, Assistant) live in
 * atrium-modules-demo.ts.
 */

import type { IconName } from "@/components/demos/atrium/AtriumKit";

/* ----------------------------------------------------------------- brand --- */

export const ATRIUM = {
  name: "Atrium",
  product: "The employee workspace",
  tagline: "Everything you need at work, in one place. Automated.",
  domain: "atrium.work",
  accent: "#6d4aff",
} as const;

/** The fictional company whose workspace this is. */
export const ATRIUM_COMPANY = {
  name: "Northwind",
  employees: "2,400",
  team: "Design",
} as const;

/** The signed-in employee. */
export const ATRIUM_USER = {
  name: "Maya Chen",
  firstName: "Maya",
  initials: "MC",
  role: "Product Designer",
  team: "Design",
  location: "New York",
} as const;

/* ----------------------------------------------------------- navigation --- */

export type ModuleId =
  | "home"
  | "apps"
  | "automations"
  | "it"
  | "legal"
  | "people"
  | "assistant";

export type NavItem = { id: ModuleId; label: string; icon: IconName };
export type NavSection = { label: string; color: string; items: NavItem[] };

export const ATRIUM_NAV: readonly NavSection[] = [
  {
    label: "Workspace",
    color: "var(--atr-sec-workspace)",
    items: [{ id: "home", label: "Home", icon: "home" }],
  },
  {
    label: "Tools",
    color: "var(--atr-sec-tools)",
    items: [
      { id: "apps", label: "App Hub", icon: "grid" },
      { id: "automations", label: "Automations", icon: "bolt" },
    ],
  },
  {
    label: "Support",
    color: "var(--atr-sec-support)",
    items: [
      { id: "it", label: "IT Hub", icon: "lifebuoy" },
      { id: "legal", label: "Legal", icon: "scale" },
      { id: "people", label: "People & HR", icon: "users" },
    ],
  },
  {
    label: "Assistant",
    color: "var(--atr-sec-assistant)",
    items: [{ id: "assistant", label: "Ask Atrium", icon: "sparkles" }],
  },
] as const;

/** Flat lookup of module id -> label, for the topbar/title. */
export const MODULE_LABELS: Record<ModuleId, string> = Object.fromEntries(
  ATRIUM_NAV.flatMap((s) => s.items.map((i) => [i.id, i.label])),
) as Record<ModuleId, string>;

/* ------------------------------------------------------- platform stats --- */

export const ATRIUM_PLATFORM = {
  appsConnected: 38,
  automationsActive: 12,
  hoursSavedWeekly: 6.5,
  tasksAutomatedMonth: 184,
  openTickets: 2,
  pendingApprovals: 3,
} as const;

/* ------------------------------------------------------------ home: brief --- */

export const DAILY_BRIEF = {
  date: "Monday, June 22",
  greeting: "Good morning, Maya.",
  body: "You are clear to focus today. I closed your VPN ticket overnight, provisioned the Figma seat you requested, and filed your Lisbon expenses. Three things still need you: a teammate's PTO request to approve, an offer letter to sign, and a vendor NDA waiting on your review. Nothing is overdue.",
} as const;

/* ----------------------------------------------- home: handled-for-you feed --- */

/** One thing Atrium automated for the employee, no action required. */
export type HandledItem = {
  id: string;
  icon: IconName;
  title: string;
  detail: string;
  savedMins: number;
  module: ModuleId;
  time: string;
};

export const HANDLED_TODAY: readonly HandledItem[] = [
  { id: "h1", icon: "lifebuoy", title: "Resolved your VPN connection ticket", detail: "Matched to a known fix, pushed the config, and verified you reconnected. Closed IT-4821.", savedMins: 35, module: "it", time: "2:14 AM" },
  { id: "h2", icon: "grid", title: "Provisioned your Figma Organization seat", detail: "Auto-approved under the Design role policy and added you to the Northwind team.", savedMins: 20, module: "apps", time: "Yesterday, 4:02 PM" },
  { id: "h3", icon: "creditCard", title: "Filed your Lisbon trip expenses", detail: "Read 6 receipts from your inbox, categorized them, and submitted the report for approval.", savedMins: 25, module: "people", time: "Yesterday, 9:30 AM" },
  { id: "h4", icon: "scale", title: "Pre-reviewed the Brightwave NDA", detail: "Flagged 2 non-standard clauses and drafted suggested redlines for your review.", savedMins: 40, module: "legal", time: "8:51 AM" },
];

/* --------------------------------------------------- home: pending for you --- */

/** Something that genuinely needs the employee. */
export type PendingItem = {
  id: string;
  kind: "approval" | "signature" | "task" | "review";
  icon: IconName;
  title: string;
  detail: string;
  module: ModuleId;
  cta: string;
  urgent?: boolean;
};

export const PENDING_FOR_YOU: readonly PendingItem[] = [
  { id: "p1", kind: "approval", icon: "umbrella", title: "Approve PTO for Devin Park", detail: "5 days, July 8 to July 12. Coverage confirmed by the design pod.", module: "people", cta: "Review" },
  { id: "p2", kind: "signature", icon: "fileText", title: "Sign the contractor offer letter", detail: "Senior Motion Designer, 6-month contract. Legal cleared it Friday.", module: "legal", cta: "Sign", urgent: true },
  { id: "p3", kind: "review", icon: "scale", title: "Review the Brightwave NDA redlines", detail: "Atrium drafted 2 redlines. Approve to send back to the vendor.", module: "legal", cta: "Open" },
];

/* ----------------------------------------------------- home: announcements --- */

export type Announcement = {
  id: string;
  tag: string;
  icon: IconName;
  title: string;
  body: string;
  time: string;
};

export const ANNOUNCEMENTS: readonly Announcement[] = [
  { id: "a1", tag: "All hands", icon: "megaphone", title: "Q3 all-hands moved to Thursday 11am ET", body: "The product keynote is now Thursday. Calendar invites updated automatically.", time: "1h" },
  { id: "a2", tag: "Benefits", icon: "heart", title: "Open enrollment closes Friday", body: "Make your 2027 benefits elections by end of day Friday. Two plans changed.", time: "3h" },
  { id: "a3", tag: "Security", icon: "shield", title: "New: passkeys are live for all apps", body: "You can now sign in to every internal app with a passkey. Set yours up in two minutes.", time: "1d" },
  { id: "a4", tag: "Facilities", icon: "building", title: "NYC office: new 8th-floor focus rooms", body: "Six bookable focus rooms opened on 8. Reserve them from the Rooms app.", time: "2d" },
];

/* ------------------------------------------------------------ apps catalog --- */

export type AppCategory =
  | "Communication"
  | "Productivity"
  | "Design"
  | "Engineering"
  | "HR & Finance"
  | "Sales & CRM"
  | "IT & Security"
  | "Analytics";

export const APP_CATEGORIES: readonly AppCategory[] = [
  "Communication",
  "Productivity",
  "Design",
  "Engineering",
  "HR & Finance",
  "Sales & CRM",
  "IT & Security",
  "Analytics",
];

export type App = {
  name: string;
  category: AppCategory;
  initial: string;
  color: string;
  status: "installed" | "available";
  desc: string;
  popular?: boolean;
  /** Recommended for Maya's Design role. */
  roleRec?: boolean;
  /** Pinned to the home quick-launch row. */
  pinned?: boolean;
};

export const APPS: readonly App[] = [
  { name: "Slack", category: "Communication", initial: "S", color: "#4A154B", status: "installed", desc: "Team messaging and channels.", popular: true, pinned: true },
  { name: "Gmail", category: "Communication", initial: "G", color: "#EA4335", status: "installed", desc: "Company email.", popular: true, pinned: true },
  { name: "Zoom", category: "Communication", initial: "Z", color: "#2D8CFF", status: "installed", desc: "Video meetings and webinars.", pinned: true },
  { name: "Notion", category: "Productivity", initial: "N", color: "#111111", status: "installed", desc: "Docs, wikis, and project notes.", popular: true, pinned: true },
  { name: "Google Drive", category: "Productivity", initial: "D", color: "#1FA463", status: "installed", desc: "Files, docs, and shared drives." },
  { name: "Calendar", category: "Productivity", initial: "C", color: "#4285F4", status: "installed", desc: "Schedule and meeting rooms." },
  { name: "Figma", category: "Design", initial: "F", color: "#A259FF", status: "installed", desc: "Interface design and prototyping.", roleRec: true, pinned: true },
  { name: "FigJam", category: "Design", initial: "J", color: "#7B61FF", status: "available", desc: "Whiteboarding and workshops.", roleRec: true },
  { name: "Miro", category: "Design", initial: "M", color: "#FFD02F", status: "available", desc: "Collaborative whiteboards.", roleRec: true },
  { name: "Loom", category: "Design", initial: "L", color: "#625DF5", status: "available", desc: "Async video walkthroughs.", roleRec: true },
  { name: "GitHub", category: "Engineering", initial: "G", color: "#181717", status: "installed", desc: "Code, reviews, and CI." },
  { name: "Linear", category: "Engineering", initial: "L", color: "#5E6AD2", status: "installed", desc: "Issue tracking and sprints.", pinned: true },
  { name: "Jira", category: "Engineering", initial: "J", color: "#0052CC", status: "available", desc: "Project and bug tracking." },
  { name: "Vercel", category: "Engineering", initial: "V", color: "#000000", status: "available", desc: "Frontend deploys and previews." },
  { name: "Workday", category: "HR & Finance", initial: "W", color: "#F38B00", status: "installed", desc: "HR, payroll, and time off." },
  { name: "Expensify", category: "HR & Finance", initial: "E", color: "#0185FF", status: "installed", desc: "Expense reports and receipts." },
  { name: "Carta", category: "HR & Finance", initial: "C", color: "#00B4A0", status: "available", desc: "Equity and cap table." },
  { name: "Salesforce", category: "Sales & CRM", initial: "S", color: "#00A1E0", status: "available", desc: "Customer relationships and pipeline." },
  { name: "HubSpot", category: "Sales & CRM", initial: "H", color: "#FF7A59", status: "available", desc: "Marketing and CRM." },
  { name: "Gong", category: "Sales & CRM", initial: "G", color: "#8950FC", status: "available", desc: "Call recording and revenue intel." },
  { name: "Okta", category: "IT & Security", initial: "O", color: "#007DC1", status: "installed", desc: "Single sign-on and identity." },
  { name: "1Password", category: "IT & Security", initial: "1", color: "#3B66BC", status: "installed", desc: "Team password manager." },
  { name: "ServiceNow", category: "IT & Security", initial: "S", color: "#62D84E", status: "available", desc: "IT service management." },
  { name: "Tableau", category: "Analytics", initial: "T", color: "#E97627", status: "available", desc: "Dashboards and BI." },
  { name: "Amplitude", category: "Analytics", initial: "A", color: "#1E61F0", status: "available", desc: "Product analytics." },
  { name: "Datadog", category: "Analytics", initial: "D", color: "#632CA6", status: "available", desc: "Monitoring and observability." },
];

/** The home quick-launch row: the employee's pinned, installed apps. */
export const QUICK_LAUNCH: readonly App[] = APPS.filter((a) => a.pinned);

/* --------------------------------------------------------- landing copy --- */

export type ModuleBlurb = { id: ModuleId; name: string; icon: IconName; blurb: string };
export const ATRIUM_MODULES: readonly ModuleBlurb[] = [
  { id: "home", name: "Home", icon: "home", blurb: "One calm landing place: your day, what AI handled overnight, and what still needs you." },
  { id: "apps", name: "App Hub", icon: "grid", blurb: "Every company app in one launcher. One-click SSO, request access, and role-based recommendations." },
  { id: "automations", name: "Automations", icon: "bolt", blurb: "Describe a workflow in plain English and Atrium runs it. See exactly what it saved you." },
  { id: "it", name: "IT Hub", icon: "lifebuoy", blurb: "Self-service help that resolves most issues instantly. Tickets, devices, access, and status in one place." },
  { id: "legal", name: "Legal", icon: "scale", blurb: "Request a contract, get an AI first-pass review, search policies, and sign, without the email chain." },
  { id: "people", name: "People & HR", icon: "users", blurb: "Time off, pay, the directory, and benefits. The HR portal that does not feel like one." },
  { id: "assistant", name: "Ask Atrium", icon: "sparkles", blurb: "One assistant that can act across every tool: file a ticket, request access, summarize a policy, draft a request." },
];

export const ATRIUM_PAINS: readonly { title: string; body: string }[] = [
  { title: "A dozen disconnected portals", body: "The app launcher, the IT desk, the HR system, the legal inbox. Each one a separate login, a separate tab, a separate mental model." },
  { title: "Busywork eats the day", body: "Filing expenses, chasing access, opening tickets, hunting for a policy. The work around the work is its own full-time job." },
  { title: "Nothing talks to anything", body: "Your tools do not know about each other, so you become the integration: copying, pasting, forwarding, and following up." },
];

export const ATRIUM_STEPS: readonly { n: number; title: string; body: string }[] = [
  { n: 1, title: "Everything in one place", body: "Atrium unifies your apps, IT, legal, HR, and approvals behind a single, calm workspace and one login." },
  { n: 2, title: "AI does the busywork", body: "It resolves common tickets, provisions access, files expenses, and pre-reviews contracts before you ever see them." },
  { n: 3, title: "You handle what matters", body: "What is left is the judgment only you can give: an approval, a signature, a decision. Nothing more." },
];

export const ATRIUM_FACTS: readonly { value: string; label: string }[] = [
  { value: "1", label: "place for everything" },
  { value: "38", label: "apps unified" },
  { value: "6.5h", label: "saved / week" },
  { value: "184", label: "tasks auto-handled" },
];

export const ATRIUM_STACK: readonly { group: string; color: string; items: string[] }[] = [
  { group: "Frontend", color: "var(--atr-sec-workspace)", items: ["Next.js 16", "React 19", "Tailwind v4", "Plus Jakarta Sans"] },
  { group: "AI", color: "var(--atr-sec-assistant)", items: ["Anthropic Claude", "Tool use / actions", "Plain-English automations", "RAG over policies"] },
  { group: "Platform", color: "var(--atr-sec-tools)", items: ["SSO / SCIM provisioning", "Okta + passkeys", "Role-based access", "Webhooks"] },
  { group: "Integrations", color: "var(--atr-sec-support)", items: ["Slack / Google", "Workday / Expensify", "ServiceNow", "DocuSign"] },
];
