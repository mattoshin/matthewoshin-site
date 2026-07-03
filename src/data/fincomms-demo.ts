/**
 * fincomms-demo.ts - sample data for the Financial Communications Platform demo.
 *
 * Financial Comms is the AI investor-relations + strategic-comms intelligence platform
 * Matthew built in-house. This is a faithful, mock-data RECREATION for
 * the portfolio, not the real app: every company, ticker, figure, holder, and
 * filing below is fictional and illustrative. No real client data, no
 * proprietary scoring logic, nothing talks to a live server.
 *
 * Core data lives here (brand, companies, nav, dashboard); the heavier per-module
 * datasets live in fincomms-modules-demo.ts.
 */

import type { CompanyCtx, IconName } from "@/components/demos/fincomms/FcKit";

/* ----------------------------------------------------------------- brand --- */

export const FINCOMMS = {
  name: "Financial Comms",
  product: "Financial Communications Platform",
  tagline: "The AI intelligence layer for IR, PR, and capital markets",
  domain: "financialcomms.io",
  ink: "#0c0e13",
  accent: "#0027b3",
} as const;

/** The signed-in advisory user (a strategic-comms MD at the firm). */
export const FINCOMMS_ACCOUNT = {
  name: "Dana Whitfield",
  initials: "DW",
  role: "Managing Director, Strategic Communications",
  firm: "Crosswind Partners",
  clients: 14,
} as const;

/* ------------------------------------------------------------- companies --- */

export type FcCompany = {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  changePct: number;
  consensus: "Buy" | "Hold" | "Sell";
  marketCap: string;
  spark: number[];
  earningsIn?: string;
};

/** The advisor's pinned client roster (all fictional). */
export const FC_COMPANIES: readonly FcCompany[] = [
  { ticker: "QNTA", name: "Quanta Labs", sector: "Software / Developer Tools", price: 142.5, changePct: 1.82, consensus: "Buy", marketCap: "$18.4B", spark: [128, 131, 129, 134, 138, 136, 140, 142.5], earningsIn: "in 5 days" },
  { ticker: "NWND", name: "Northwind Foods", sector: "Consumer / Restaurants", price: 88.13, changePct: -0.74, consensus: "Hold", marketCap: "$6.1B", spark: [92, 91, 90, 91, 89, 90, 88.8, 88.13], earningsIn: "in 12 days" },
  { ticker: "MRDN", name: "Meridian Apparel", sector: "Consumer Discretionary / Apparel", price: 54.07, changePct: 2.41, consensus: "Buy", marketCap: "$4.3B", spark: [48, 49, 51, 50, 52, 53, 52.6, 54.07], earningsIn: "in 3 weeks" },
  { ticker: "APXG", name: "Apex Gaming", sector: "Communication Services / Gaming", price: 31.62, changePct: -1.95, consensus: "Hold", marketCap: "$2.8B", spark: [36, 35, 34, 33, 34, 32, 32.4, 31.62], earningsIn: "in 8 days" },
  { ticker: "HELO", name: "Helios Therapeutics", sector: "Healthcare / Biotech", price: 19.84, changePct: 4.12, consensus: "Buy", marketCap: "$1.5B", spark: [15, 16, 15.5, 17, 18, 17.6, 19, 19.84] },
  { ticker: "VRDN", name: "Verdant Energy", sector: "Energy / Clean Power", price: 27.45, changePct: 0.36, consensus: "Hold", marketCap: "$3.9B", spark: [26, 27, 26.5, 27.2, 27, 27.3, 27.1, 27.45] },
] as const;

/** The focused company for the analyst modules (CompanyHeader-compatible). */
export const ACTIVE_COMPANY: CompanyCtx = {
  ticker: "QNTA",
  name: "Quanta Labs",
  sector: "Software / Developer Tools",
  price: 142.5,
  changePct: 1.82,
  consensus: "Buy",
  earningsIn: "in 5 days",
};

/* ------------------------------------------------------- platform stats --- */

export const FINCOMMS_PLATFORM = {
  clients: 14,
  briefsGenerated: 2840,
  modules: 26,
  dataSources: 14,
  hoursSavedWeekly: 32,
  scenariosRun: 410,
} as const;

/* ----------------------------------------------------------- navigation --- */

export type ModuleId =
  | "dashboard"
  | "data-sources"
  | "earnings"
  | "earnings-prep"
  | "guidance"
  | "investor"
  | "shareholder-match"
  | "surveillance"
  | "peers"
  | "conference"
  | "comms"
  | "media-monitoring"
  | "newsjacking"
  | "ir-chatbot"
  | "crisis"
  | "ipo"
  | "governance"
  | "roadshow-twin"
  | "model-standardizer"
  | "buyside-report"
  | "retail-voice"
  | "rils-trends"
  | "ir-hosting"
  | "ask-firm"
  | "resources"
  | "admin";

export type NavItem = { id: ModuleId; label: string; icon: IconName };
export type NavSection = { label: string; color: string; items: NavItem[] };

export const FINCOMMS_NAV: readonly NavSection[] = [
  {
    label: "Overview",
    color: "var(--fc-sec-overview)",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard" },
      { id: "data-sources", label: "Data Sources", icon: "database" },
    ],
  },
  {
    label: "Earnings & IR",
    color: "var(--fc-sec-earnings)",
    items: [
      { id: "earnings", label: "Earnings Hub", icon: "barchart" },
      { id: "earnings-prep", label: "Earnings Prep", icon: "bolt" },
      { id: "guidance", label: "Guidance Analyzer", icon: "compass" },
    ],
  },
  {
    label: "Investor Intelligence",
    color: "var(--fc-sec-intel)",
    items: [
      { id: "investor", label: "Investor Intel", icon: "target" },
      { id: "shareholder-match", label: "Shareholder Matching", icon: "users" },
      { id: "surveillance", label: "Stock Surveillance", icon: "search" },
      { id: "peers", label: "Peer Intel", icon: "users" },
      { id: "conference", label: "Conference Intel", icon: "calendar" },
    ],
  },
  {
    label: "Comms & Media",
    color: "var(--fc-sec-comms)",
    items: [
      { id: "comms", label: "Corporate Comms & PR", icon: "megaphone" },
      { id: "media-monitoring", label: "Media Monitoring", icon: "globe" },
      { id: "newsjacking", label: "Newsjacking", icon: "sparkles" },
      { id: "ir-chatbot", label: "IR Site Chatbot", icon: "send" },
    ],
  },
  {
    label: "Strategy & Situations",
    color: "var(--fc-sec-strategy)",
    items: [
      { id: "crisis", label: "Crisis Command", icon: "shield" },
      { id: "ipo", label: "IPO & Capital Markets", icon: "rocket" },
      { id: "governance", label: "Governance & Activism", icon: "scale" },
      { id: "roadshow-twin", label: "Roadshow Twin", icon: "play" },
    ],
  },
  {
    label: "Capital Markets Engines",
    color: "var(--fc-sec-capmkts)",
    items: [
      { id: "model-standardizer", label: "Model Standardizer", icon: "fileText" },
      { id: "buyside-report", label: "Sector Buy-Side Report", icon: "barchart" },
      { id: "retail-voice", label: "Retail Investor Voice", icon: "heart" },
      { id: "rils-trends", label: "Retail Loyalty Trends", icon: "trendingUp" },
      { id: "ir-hosting", label: "IR Page Hosting", icon: "building" },
      { id: "ask-firm", label: "Ask the Firm", icon: "info" },
    ],
  },
  {
    label: "Workspace",
    color: "var(--fc-sec-rnd)",
    items: [
      { id: "resources", label: "Resources", icon: "fileText" },
      { id: "admin", label: "Admin & Lab", icon: "settings" },
    ],
  },
] as const;

/** Flat lookup of module id -> label, for the topbar/title. */
export const MODULE_LABELS: Record<ModuleId, string> = Object.fromEntries(
  FINCOMMS_NAV.flatMap((s) => s.items.map((i) => [i.id, i.label])),
) as Record<ModuleId, string>;

/* ------------------------------------------------------------ dashboard --- */

export const MORNING_BRIEF = {
  greeting: "Good morning, Dana.",
  date: "Monday, June 22",
  body: "Three of your fourteen clients report this week, led by Quanta Labs on Thursday. A peer of Meridian Apparel drew an activist letter overnight, a newsjacking opening worth a same-day pitch. Coverage on Apex Gaming turned negative after a downgrade, and Crisis Command already has a holding statement drafted for your review.",
} as const;

export const QUICK_ACTIONS: readonly { id: ModuleId; title: string; sub: string; color: string }[] = [
  { id: "comms", title: "Draft a press release", sub: "On-voice, 10 templates", color: "var(--fc-sec-comms)" },
  { id: "media-monitoring", title: "Scan today's coverage", sub: "Sentiment + breaking alerts", color: "var(--fc-sec-comms)" },
  { id: "newsjacking", title: "Find a newsjack", sub: "Stories you can pitch today", color: "var(--fc-sec-comms)" },
  { id: "earnings-prep", title: "Anticipate analyst Q&A", sub: "Ranked tough questions", color: "var(--fc-sec-earnings)" },
  { id: "crisis", title: "Run a crisis scenario", sub: "Simulate + draft response", color: "var(--fc-down)" },
  { id: "shareholder-match", title: "Find gap investors", sub: "Accounts likely to buy", color: "var(--fc-sec-intel)" },
];

export type MacroIndicator = { label: string; value: string; trend: number; asOf: string };
export const MACRO_INDICATORS: readonly MacroIndicator[] = [
  { label: "CPI (YoY)", value: "2.9%", trend: -0.2, asOf: "May" },
  { label: "Fed Funds", value: "4.50%", trend: 0, asOf: "Jun" },
  { label: "Unemployment", value: "4.1%", trend: 0.1, asOf: "May" },
  { label: "WTI Crude", value: "$74.20", trend: -1.4, asOf: "Today" },
  { label: "10Y Yield", value: "4.28%", trend: 0.05, asOf: "Today" },
  { label: "USD Index", value: "104.6", trend: -0.3, asOf: "Today" },
];

export const MACRO_NARRATIVE =
  "Disinflation is holding and the market has fully priced one cut by Q4. Rate-sensitive growth names have re-rated; energy is soft on demand concerns.";

export type YieldPoint = { maturity: string; yield: number; key?: boolean };
export const YIELD_CURVE: readonly YieldPoint[] = [
  { maturity: "1M", yield: 4.52 },
  { maturity: "3M", yield: 4.48 },
  { maturity: "6M", yield: 4.41 },
  { maturity: "1Y", yield: 4.36 },
  { maturity: "2Y", yield: 4.39, key: true },
  { maturity: "5Y", yield: 4.21 },
  { maturity: "10Y", yield: 4.28, key: true },
  { maturity: "30Y", yield: 4.46 },
];
export const YIELD_SPREAD_2S10S = -0.11;

export type NewsItem = { title: string; source: string; time: string };
export const MARKET_NEWS: readonly NewsItem[] = [
  { title: "Software multiples expand as disinflation narrative firms up", source: "MarketWatch", time: "32m" },
  { title: "Developer-tools spend resilient in latest CIO survey", source: "The Information", time: "1h" },
  { title: "Restaurant traffic softens in June, casual dining hit hardest", source: "Bloomberg", time: "2h" },
  { title: "Activist fund builds position in mid-cap gaming names", source: "Reuters", time: "3h" },
  { title: "Apparel inventories normalize ahead of back-to-school", source: "WSJ", time: "4h" },
  { title: "Clean-power tax-credit guidance clears Treasury review", source: "Axios", time: "5h" },
  { title: "Biotech IPO window reopens with two oversubscribed deals", source: "Endpoints", time: "6h" },
  { title: "Fed minutes signal patience, one cut still the base case", source: "CNBC", time: "7h" },
];

/* ----------------------------------------------------------- data sources --- */

export type DataSource = {
  name: string;
  category: "Financial" | "Regulatory" | "Macro" | "Market" | "Media" | "Intelligence" | "AI";
  kind: "API" | "MCP" | "RSS";
  blurb: string;
  status: "connected" | "available";
};

export const DATA_SOURCES: readonly DataSource[] = [
  { name: "Financial Modeling Prep", category: "Financial", kind: "API", blurb: "Fundamentals, ratios, estimates, and price history.", status: "connected" },
  { name: "SEC EDGAR", category: "Regulatory", kind: "API", blurb: "10-K/Q, 8-K, S-1, 13D/G, and proxy filings.", status: "connected" },
  { name: "FRED", category: "Macro", kind: "API", blurb: "US economic indicators and the Treasury yield curve.", status: "connected" },
  { name: "Polygon.io", category: "Market", kind: "API", blurb: "Real-time and historical equities + options data.", status: "connected" },
  { name: "Finnhub", category: "Financial", kind: "API", blurb: "Analyst estimates, earnings calendar, sentiment.", status: "connected" },
  { name: "Alpha Vantage", category: "Market", kind: "API", blurb: "Quotes, technicals, and FX series.", status: "connected" },
  { name: "NewsAPI", category: "Media", kind: "API", blurb: "Global news search across 80k+ sources.", status: "connected" },
  { name: "SerpAPI", category: "Media", kind: "API", blurb: "Search interest and SERP monitoring.", status: "connected" },
  { name: "Congress Trades", category: "Intelligence", kind: "API", blurb: "Disclosed congressional trading activity.", status: "connected" },
  { name: "13F Aggregator", category: "Intelligence", kind: "API", blurb: "Quarterly institutional manager holdings.", status: "connected" },
  { name: "Anthropic Claude", category: "AI", kind: "API", blurb: "Generation, analysis, and the analyst simulator.", status: "connected" },
  { name: "Transcript Feed", category: "Financial", kind: "MCP", blurb: "Earnings-call transcripts across the peer set.", status: "available" },
  { name: "Social Sentiment", category: "Media", kind: "RSS", blurb: "Retail sentiment and mention volume.", status: "available" },
  { name: "Proxy Advisor Feed", category: "Regulatory", kind: "RSS", blurb: "ISS/Glass-Lewis style proxy recommendations.", status: "available" },
];

/* -------------------------------------------------------- landing copy --- */

export type ModuleBlurb = { id: ModuleId; name: string; icon: IconName; blurb: string };
export const FINCOMMS_MODULES: readonly ModuleBlurb[] = [
  { id: "comms", name: "Corporate Comms & PR", icon: "megaphone", blurb: "Draft press releases, messaging, and media materials on-voice, and check narrative consistency across every document." },
  { id: "media-monitoring", name: "Media Monitoring", icon: "globe", blurb: "Track coverage across 80k+ sources in real time, with sentiment, share-of-voice, and alerts the moment a story breaks." },
  { id: "newsjacking", name: "Newsjacking", icon: "sparkles", blurb: "Surface the stories of the day and exactly how each can be made relevant to a client, so you can pitch reporters and win the hit." },
  { id: "crisis", name: "Crisis Command", icon: "shield", blurb: "Simulate a crisis, forecast impact, and generate the full response playbook and holding statements in minutes." },
  { id: "earnings", name: "Earnings Hub", icon: "barchart", blurb: "Prep briefs, predicted Q&A, a live analyst simulator, and post-call analysis in one workspace." },
  { id: "earnings-prep", name: "Earnings Prep", icon: "bolt", blurb: "Surface the toughest probable analyst questions before the call, ranked and tagged with a recommended answer frame." },
  { id: "investor", name: "Investor Intel", icon: "target", blurb: "Profile holders, find sweet-spot targets, and track 13F and ownership shifts." },
  { id: "shareholder-match", name: "Shareholder Matching", icon: "users", blurb: "Rank the institutions most likely to buy: gap investors who hold your peers heavily but little of you." },
  { id: "roadshow-twin", name: "Roadshow Twin", icon: "play", blurb: "A simulated investor that role-plays the toughest persona, grills management, and scores every answer." },
  { id: "governance", name: "Governance & Activism", icon: "scale", blurb: "Scan activism risk, analyze proxy exposure, and prep for shareholder engagement." },
  { id: "ipo", name: "IPO & Capital Markets", icon: "rocket", blurb: "Score IPO readiness and pressure-test an S-1 for disclosure gaps and narrative." },
  { id: "ask-firm", name: "Ask the Firm", icon: "info", blurb: "A client-facing assistant that answers what the firm can do for you, grounded in the firm corpus and its house voice." },
];

export const FINCOMMS_PAIN_POINTS: readonly { title: string; body: string }[] = [
  { title: "The work is manual and slow", body: "An earnings cycle, a press release, or a crisis response eats hours stitching filings, coverage, and transcripts together by hand." },
  { title: "Intelligence is scattered", body: "Market data, media coverage, ownership, and peer signals live in ten tools that never talk to each other." },
  { title: "Speed wins the narrative", body: "When a story breaks, an activist files, or a peer stumbles, the team that drafts the right response first controls the narrative." },
];

export const FINCOMMS_STEPS: readonly { n: number; title: string; body: string }[] = [
  { n: 1, title: "Pin your companies", body: "Add the tickers you advise. Financial Comms pulls fundamentals, filings, ownership, media coverage, and macro context automatically." },
  { n: 2, title: "Open a module", body: "A press release, a media scan, an earnings prep, a crisis sim, a shareholder match. Each one is grounded in live data." },
  { n: 3, title: "Generate and ship", body: "Financial Comms drafts the brief, the release, the statement, or the pitch, on-voice. You edit, approve, and send." },
];

export const FINCOMMS_FACTS: readonly { value: string; label: string }[] = [
  { value: "26", label: "modules" },
  { value: "14", label: "data sources" },
  { value: "32h", label: "saved / week" },
  { value: "2.8k", label: "briefs generated" },
];

export const FINCOMMS_STACK: readonly { group: string; color: string; items: string[] }[] = [
  { group: "Frontend", color: "var(--fc-sec-overview)", items: ["Next.js 16", "React 19", "Tailwind v4", "shadcn/ui"] },
  { group: "AI", color: "var(--fc-sec-strategy)", items: ["Anthropic Claude", "Streaming generation", "Tool use", "RAG over filings"] },
  { group: "Data", color: "var(--fc-sec-earnings)", items: ["Supabase Postgres", "Prisma", "SEC EDGAR", "FMP · FRED · Polygon"] },
  { group: "Platform", color: "var(--fc-sec-intel)", items: ["Vercel", "Role-based access", "Resend", "PostHog"] },
];
