/**
 * sec-demo.ts - core sample data for the SEC Intelligence demo.
 *
 * SEC Intelligence is a real-time SEC-filing intelligence terminal for financial
 * professionals: wealth managers who answer to clients and traders who hold
 * positions. It surfaces material filings the moment they hit EDGAR, has an AI
 * analyst explain what each one means, and routes alerts to email, phone, and your
 * own downstream agents.
 *
 * This is a portfolio RECREATION on sample data, framed as Matthew's own product.
 * Every company, ticker, figure, holder, insider, and filing below is fictional
 * and illustrative. Nothing talks to a live server. No real-company attribution.
 *
 * Core data lives here (brand, account, nav, watchlist, clients, channels, landing
 * copy); the heavier per-module datasets live in sec-modules-demo.ts.
 */

import type { CompanyCtx, IconName, Channel, FormType } from "@/components/demos/sec/SecKit";

/* ----------------------------------------------------------------- brand --- */

export const SEC = {
  name: "SEC Intelligence",
  product: "SEC Intelligence",
  tagline: "Every material filing, read and routed before your client calls you.",
  domain: "secintelligence.app",
  ink: "#f3f5f7",
  accent: "#3da9fc",
} as const;

/** The signed-in professional. Role is chosen live via the topbar toggle. */
export const SEC_ACCOUNT = {
  name: "Jordan Avery",
  initials: "JA",
  advisorRole: "Senior Wealth Advisor",
  traderRole: "Portfolio Trader",
  firm: "Independent",
} as const;

/* -------------------------------------------------------------- watchlist --- */

export type SecCompany = {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  changePct: number;
  consensus: "Buy" | "Hold" | "Sell";
  marketCap: string;
  spark: number[];
  /** Next scheduled filing, trader-relevant countdown. */
  nextFiling?: { form: FormType; in: string };
  /** Unread filing alerts on this name. */
  unread: number;
  /** Trader position context. */
  position?: { shares: string; value: string; weightPct: number };
};

/** The professional's watchlist. All tickers fictional. */
export const SEC_COMPANIES: readonly SecCompany[] = [
  { ticker: "ATLX", name: "Atlas Semiconductors", sector: "Semiconductors", price: 218.44, changePct: 2.91, consensus: "Buy", marketCap: "$214B", spark: [188, 192, 190, 198, 205, 209, 214, 218.44], nextFiling: { form: "10-Q", in: "in 4 days" }, unread: 3, position: { shares: "4,200", value: "$917K", weightPct: 8.4 } },
  { ticker: "PYLN", name: "Pylon Data", sector: "Software / Data Infrastructure", price: 96.12, changePct: -1.74, consensus: "Buy", marketCap: "$28B", spark: [104, 102, 101, 99, 100, 98, 97, 96.12], unread: 2, position: { shares: "6,000", value: "$577K", weightPct: 5.3 } },
  { ticker: "CRVN", name: "Carven Pharma", sector: "Healthcare / Pharma", price: 61.83, changePct: 5.62, consensus: "Hold", marketCap: "$12B", spark: [52, 54, 53, 56, 58, 57, 60, 61.83], nextFiling: { form: "8-K", in: "expected" }, unread: 4, position: { shares: "9,500", value: "$587K", weightPct: 5.4 } },
  { ticker: "NWAV", name: "Newave Energy", sector: "Energy / Renewables", price: 34.07, changePct: 0.44, consensus: "Hold", marketCap: "$9.1B", spark: [33, 34, 33.5, 34.2, 33.8, 34.1, 33.9, 34.07], unread: 1, position: { shares: "12,000", value: "$409K", weightPct: 3.8 } },
  { ticker: "CMBK", name: "Cambria Bancorp", sector: "Financials / Regional Banks", price: 47.55, changePct: -2.86, consensus: "Hold", marketCap: "$6.4B", spark: [52, 51, 50, 49, 50, 48, 48.2, 47.55], nextFiling: { form: "DEF 14A", in: "in 9 days" }, unread: 2, position: { shares: "8,800", value: "$418K", weightPct: 3.9 } },
  { ticker: "ORBT", name: "Orbital Defense", sector: "Aerospace & Defense", price: 152.9, changePct: 1.18, consensus: "Buy", marketCap: "$41B", spark: [142, 145, 144, 148, 150, 149, 151, 152.9], unread: 1, position: { shares: "3,100", value: "$474K", weightPct: 4.4 } },
  { ticker: "GRVE", name: "Grove Markets", sector: "Consumer Staples / Grocery", price: 73.21, changePct: -0.39, consensus: "Hold", marketCap: "$15B", spark: [75, 74, 74.5, 73.8, 74, 73.5, 73.4, 73.21], unread: 0, position: { shares: "5,400", value: "$395K", weightPct: 3.6 } },
  { ticker: "LMNR", name: "Luminar Retail", sector: "Consumer Discretionary / Retail", price: 28.66, changePct: 3.74, consensus: "Buy", marketCap: "$3.2B", spark: [24, 25, 26, 25.5, 27, 27.4, 28, 28.66], nextFiling: { form: "10-Q", in: "in 2 days" }, unread: 3, position: { shares: "14,000", value: "$401K", weightPct: 3.7 } },
  { ticker: "HLOG", name: "Helios Logistics", sector: "Industrials / Freight", price: 109.4, changePct: 0.92, consensus: "Buy", marketCap: "$18B", spark: [102, 104, 103, 106, 107, 108, 108.5, 109.4], unread: 1, position: { shares: "2,600", value: "$284K", weightPct: 2.6 } },
  { ticker: "RDWD", name: "Redwood Biosciences", sector: "Healthcare / Biotech", price: 41.27, changePct: 7.85, consensus: "Buy", marketCap: "$5.8B", spark: [31, 33, 34, 36, 38, 37, 39, 41.27], nextFiling: { form: "8-K", in: "expected" }, unread: 5, position: { shares: "7,200", value: "$297K", weightPct: 2.7 } },
] as const;

/** The focused company for the analyst views (CompanyHeader-compatible). */
export const ACTIVE_COMPANY: CompanyCtx = {
  ticker: "ATLX",
  name: "Atlas Semiconductors",
  sector: "Semiconductors",
  price: 218.44,
  changePct: 2.91,
  consensus: "Buy",
  earningsIn: "in 4 days",
};

/* ----------------------------------------------------------------- clients --- */

export type SecClient = {
  id: string;
  name: string;
  type: "Household" | "Trust" | "Endowment" | "Institution";
  aum: string;
  topHoldings: string[];
  /** Tickers in this client's book that printed a material filing today. */
  exposed: string[];
  unread: number;
  /** A suitability / mandate flag worth a call. */
  flag?: string;
  riskBand: "Conservative" | "Balanced" | "Growth" | "Aggressive";
};

/** The wealth advisor's book of clients (fictional). */
export const SEC_CLIENTS: readonly SecClient[] = [
  { id: "harborview", name: "Harborview Family Office", type: "Institution", aum: "$184M", topHoldings: ["ATLX", "ORBT", "PYLN"], exposed: ["ATLX", "CRVN"], unread: 3, flag: "Concentrated 11% in ATLX, material 8-K today", riskBand: "Growth" },
  { id: "brennan-trust", name: "The Brennan Trust", type: "Trust", aum: "$62M", topHoldings: ["CMBK", "GRVE", "NWAV"], exposed: ["CMBK"], unread: 2, flag: "Income mandate, CMBK dividend filing", riskBand: "Conservative" },
  { id: "maple-ridge", name: "Maple Ridge Endowment", type: "Endowment", aum: "$310M", topHoldings: ["ORBT", "HLOG", "ATLX"], exposed: ["ORBT", "ATLX"], unread: 1, riskBand: "Balanced" },
  { id: "delgado", name: "Delgado Household", type: "Household", aum: "$8.4M", topHoldings: ["CRVN", "RDWD", "LMNR"], exposed: ["CRVN", "RDWD"], unread: 4, flag: "High biotech beta, two material filings", riskBand: "Aggressive" },
  { id: "continental", name: "Continental Pension", type: "Institution", aum: "$540M", topHoldings: ["GRVE", "CMBK", "HLOG"], exposed: [], unread: 0, riskBand: "Conservative" },
  { id: "aster", name: "Aster Wealth Group", type: "Household", aum: "$21M", topHoldings: ["PYLN", "LMNR", "ATLX"], exposed: ["ATLX", "LMNR"], unread: 2, riskBand: "Growth" },
] as const;

/* ------------------------------------------------------- platform stats --- */

export const SEC_PLATFORM = {
  companiesCovered: 8400,
  watchlist: SEC_COMPANIES.length,
  clients: SEC_CLIENTS.length,
  filingsParsedToday: 1284,
  filingsParsedTotal: "3.2M",
  avgTimeToAlert: "41s",
  alertsDeliveredToday: 37,
  uptime: "99.98%",
  formsTracked: 11,
} as const;

/* ----------------------------------------------------------- navigation --- */

export type ModuleId =
  | "dashboard"
  | "watchlist"
  | "filings"
  | "insider"
  | "ai-analyst"
  | "alerts"
  | "admin";

export type NavItem = { id: ModuleId; label: string; icon: IconName };
export type NavSection = { label: string; color: string; items: NavItem[] };

export const SEC_NAV: readonly NavSection[] = [
  {
    label: "Overview",
    color: "var(--sec-sec-overview)",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard" },
      { id: "watchlist", label: "Watchlist & Clients", icon: "eye" },
    ],
  },
  {
    label: "Filings",
    color: "var(--sec-sec-filings)",
    items: [
      { id: "filings", label: "Filing Feed", icon: "fileText" },
      { id: "insider", label: "Insider & Ownership", icon: "users" },
    ],
  },
  {
    label: "Intelligence",
    color: "var(--sec-sec-ai)",
    items: [{ id: "ai-analyst", label: "AI Analyst", icon: "sparkles" }],
  },
  {
    label: "Alerts",
    color: "var(--sec-sec-alerts)",
    items: [{ id: "alerts", label: "Alert Center", icon: "bell" }],
  },
  {
    label: "Workspace",
    color: "var(--sec-sec-surveillance)",
    items: [{ id: "admin", label: "Admin & Lab", icon: "settings" }],
  },
] as const;

/** Flat lookup of module id -> label, for the topbar title. */
export const MODULE_LABELS: Record<ModuleId, string> = Object.fromEntries(
  SEC_NAV.flatMap((s) => s.items.map((i) => [i.id, i.label])),
) as Record<ModuleId, string>;

/* ------------------------------------------------------------ dashboard --- */

export const MORNING_BRIEF = {
  date: "Monday, June 23",
  greetingAdvisor: "Good morning, Jordan.",
  greetingTrader: "Markets open in 47 minutes.",
  bodyAdvisor:
    "Overnight your book printed 18 filings across 10 names. Two are material: Atlas Semiconductors filed an 8-K on a CFO transition, and Carven Pharma disclosed a positive Phase III readout. Four of your six clients hold an affected name, led by Harborview's 11% Atlas position. Suggested calls are queued.",
  bodyTrader:
    "18 filings hit your watchlist overnight, two material. Atlas Semiconductors 8-K (Item 5.02, CFO out) is moving the pre-market tape, ATLX +2.9%. Redwood Biosciences is expected to file an 8-K on trial data before the open. Insider cluster-buying flagged on Cambria Bancorp.",
} as const;

export type QuickAction = { id: ModuleId; title: string; sub: string; icon: IconName; color: string };
export const QUICK_ACTIONS: readonly QuickAction[] = [
  { id: "filings", title: "Open the filing feed", sub: "Live, AI-read, filterable", icon: "fileText", color: "var(--sec-sec-filings)" },
  { id: "ai-analyst", title: "Ask the AI analyst", sub: "Query across your filings", icon: "sparkles", color: "var(--sec-sec-ai)" },
  { id: "alerts", title: "Route an alert", sub: "Email, phone, your agents", icon: "bell", color: "var(--sec-sec-alerts)" },
  { id: "insider", title: "Scan insider activity", sub: "Form 4 + 13D/13F", icon: "users", color: "var(--sec-sec-overview)" },
  { id: "watchlist", title: "Review your book", sub: "Clients + positions", icon: "eye", color: "var(--sec-sec-overview)" },
  { id: "admin", title: "Connect a channel", sub: "Sources, agents, seats", icon: "settings", color: "var(--sec-sec-surveillance)" },
];

/* --------------------------------------------------------- channels meta --- */

export type ChannelStatus = {
  channel: Channel;
  label: string;
  detail: string;
  status: "connected" | "available";
};

export const SEC_CHANNELS: readonly ChannelStatus[] = [
  { channel: "email", label: "Email", detail: "jordan@independent.app + 2 client distros", status: "connected" },
  { channel: "sms", label: "SMS", detail: "Mobile, +1 (•••) •••-4827", status: "connected" },
  { channel: "phone", label: "Phone call", detail: "Voice alert for material-only events", status: "connected" },
  { channel: "push", label: "Push", detail: "iOS + desktop app", status: "connected" },
  { channel: "agent", label: "Agent", detail: "Webhook / MCP to your downstream AI agents", status: "connected" },
] as const;

/* -------------------------------------------------------- landing copy --- */

export const SEC_FACTS: readonly { value: string; label: string }[] = [
  { value: "8.4k", label: "companies covered" },
  { value: "41s", label: "avg time to alert" },
  { value: "11", label: "filing forms tracked" },
  { value: "99.98%", label: "uptime" },
];

export type FeatureBlurb = { id: ModuleId; name: string; icon: IconName; blurb: string };
export const SEC_FEATURES: readonly FeatureBlurb[] = [
  { id: "filings", name: "Real-time filing feed", icon: "fileText", blurb: "Every 8-K, 10-Q, S-1, Form 4, and 13D the moment it hits EDGAR, filtered to your book and ranked by materiality." },
  { id: "ai-analyst", name: "AI that reads the filing", icon: "sparkles", blurb: "Each filing comes with a plain-English read: what changed, why it matters, and what to tell your clients, cited to the exact item." },
  { id: "alerts", name: "Route to anyone, anything", icon: "bell", blurb: "Send alerts to email, SMS, a phone call, or straight to your downstream AI agents over a webhook. You set the rules." },
  { id: "watchlist", name: "Built for your role", icon: "eye", blurb: "Flip between a wealth-manager view of clients and exposure and a trader view of positions and speed. One product, two lenses." },
  { id: "insider", name: "Insider & ownership radar", icon: "users", blurb: "Cluster insider buying, 13D activist stakes, and 13F rotation across your names, surfaced as signals not noise." },
  { id: "ai-analyst", name: "Track what's going on with AI", icon: "lightbulb", blurb: "A theme tracker scans every filing for AI exposure, capex, and risk disclosures, so you see where the AI story is moving across your book." },
];

export const SEC_PAIN_POINTS: readonly { title: string; body: string }[] = [
  { title: "You find out too late", body: "A material 8-K can move a position before you have read past the headline. By the time it reaches your inbox, your client has already seen the price." },
  { title: "Filings are dense and slow", body: "An 8-K Item 5.02 or a 10-Q footnote change is buried in legal language. Reading every filing across a book of names by hand does not scale." },
  { title: "Alerts live in the wrong place", body: "The signal that matters needs to reach you on your phone, your team by email, and your downstream systems, not just one dashboard you have to remember to check." },
];

export const SEC_STEPS: readonly { n: number; title: string; body: string }[] = [
  { n: 1, title: "Add your book", body: "Drop in the tickers you trade or the clients you advise. SEC Intelligence pulls every filing, ownership change, and insider transaction automatically." },
  { n: 2, title: "Let the AI read", body: "The moment a filing lands, an AI analyst reads it, flags materiality, and writes a plain-English summary cited to the exact item." },
  { n: 3, title: "Route the signal", body: "Set rules once: email the routine, call me on the material, and fan the structured event out to your downstream agents. It runs itself." },
];

export const SEC_STACK: readonly { group: string; color: string; items: string[] }[] = [
  { group: "Frontend", color: "var(--sec-sec-overview)", items: ["Next.js 16", "React 19", "Tailwind v4", "Terminal UI"] },
  { group: "AI", color: "var(--sec-sec-ai)", items: ["Anthropic Claude", "Filing summarization", "Tool use", "RAG over EDGAR"] },
  { group: "Data", color: "var(--sec-sec-filings)", items: ["SEC EDGAR full-text", "FMP · Polygon", "Real-time ingest", "Postgres + pgvector"] },
  { group: "Delivery", color: "var(--sec-sec-alerts)", items: ["Resend (email)", "Twilio (SMS + voice)", "Web push", "Agent webhooks / MCP"] },
];
