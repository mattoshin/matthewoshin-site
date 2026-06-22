/**
 * sonar-demo.ts - dummy data for the Sonar interactive demo at /app/sonar.
 *
 * Sonar is a real-time media-monitoring platform for investor-relations and
 * communications teams. The product Matthew built: you describe what you care
 * about in PLAIN ENGLISH, an LLM translates it into a validated monitor spec,
 * you DRY-RUN it against the last 48 hours before activating, and it pings you
 * the moment a real match lands. Severity gating, per-monitor flood caps, an
 * AI relevance gate, and visible/capped AI spend keep it signal, not noise.
 * Data model: source -> monitor -> match (alert) -> delivery.
 *
 * Everything here is illustrative SAMPLE data for a non-functional showcase. The
 * whole /app surface is badged "Interactive demo · sample data". Companies named
 * are well-known public issuers used purely as generic monitoring targets;
 * nothing here is a real client relationship, and no figures are audited claims.
 */

/* ------------------------------------------------------------------ brand --- */

export const SONAR = {
  name: "Sonar",
  wordmark: "SONAR",
  tagline: "Real-time media intelligence",
  pitch: "Describe what you care about. Sonar listens across every source and pings you the moment it matters.",
  footer: "Sonar",
  // amber "midnight command-center" palette (adapted from a Refero style pass)
  bg: "#0A0C10",
  amber: "#FFB224", // primary accent / signal
  bull: "#36D399", // positive sentiment
  bear: "#F87171", // negative sentiment
  neutral: "#8B98A8",
} as const;

/* ----------------------------------------------------- platform-wide stats --- */
/** Headline counters for social proof + the command-center header. */
export const SONAR_PLATFORM = {
  sourcesLive: 1_240,
  mentionsScannedToday: 412_800,
  alertsToday: 1_940,
  alertsLifetime: 18_600_000,
  monitorsActive: 12,
  teamsUsing: 340,
  avgLatencySec: 38,
  uptimePct: 99.98,
  precisionPct: 96.4, // share of delivered items rated relevant
} as const;

/** The signed-in demo workspace: a fictional IR / comms team. */
export const SONAR_ACCOUNT = {
  workspace: "Northwater IR",
  handle: "northwater",
  plan: "Enterprise",
  role: "ADMIN",
  seat: "Maya Okafor",
  avatarLetter: "M",
  joined: "Jan 2026",
  slotsUsed: 12,
  slotsTotal: 50,
  aiSpendMtd: 184.2,
  aiSpendCap: 500,
} as const;

/* ------------------------------------------------------------- delivery --- */

export const DELIVERY_CHANNELS = [
  "In-app",
  "Email",
  "Slack",
  "Microsoft Teams",
  "SMS",
] as const;
export type DeliveryChannel = (typeof DELIVERY_CHANNELS)[number];

export type Severity = "instant" | "digest";
export type Sentiment = "positive" | "neutral" | "negative";

/* -------------------------------------------------------------- sources --- */

export interface SourceCategory {
  id: string;
  name: string;
  icon: string; // IconName from SonarKit
  blurb: string;
}

export const SONAR_SOURCE_CATEGORIES: readonly SourceCategory[] = [
  { id: "regulatory", name: "Regulatory & filings", icon: "shield", blurb: "SEC EDGAR, Federal Register, FDA, FTC, and DOJ, parsed the moment they post." },
  { id: "wires", name: "Wires & news", icon: "rss", blurb: "Reuters, Bloomberg, AP, CNBC, and the business wires, deduped and tagged." },
  { id: "social", name: "Social & sentiment", icon: "globe", blurb: "X, Reddit, StockTwits, and GDELT global event signal in real time." },
  { id: "data", name: "Financial data", icon: "activity", blurb: "Finnhub, FMP, and FRED for prints, estimates, and macro series." },
  { id: "cyber", name: "Cyber & risk", icon: "bolt", blurb: "CISA advisories, NVD CVEs, and security press for breach and risk watch." },
  { id: "trade", name: "Trade & vertical", icon: "layers", blurb: "Sector and trade press, from tech to housing to healthcare." },
] as const;

export type SourceType = "Filing" | "Wire" | "News" | "Social" | "Data" | "Advisory";
export type Health = "healthy" | "degraded" | "down";

export interface SonarSource {
  id: string;
  name: string;
  slug: string;
  category: SourceCategory["id"];
  type: SourceType;
  cadence: string; // "Real-time" | "1m" | "15m" | "Hourly" | "Daily"
  health: Health;
  itemsToday: number;
  licensed?: boolean;
}

export const SONAR_SOURCES: readonly SonarSource[] = [
  // regulatory
  { id: "s-edgar", name: "SEC EDGAR", slug: "sec_edgar", category: "regulatory", type: "Filing", cadence: "Real-time", health: "healthy", itemsToday: 8420, licensed: true },
  { id: "s-fedreg", name: "Federal Register", slug: "federal_register", category: "regulatory", type: "Filing", cadence: "Daily", health: "healthy", itemsToday: 210 },
  { id: "s-fda", name: "FDA Announcements", slug: "fda", category: "regulatory", type: "Filing", cadence: "Hourly", health: "healthy", itemsToday: 96 },
  { id: "s-ftc", name: "FTC Enforcement", slug: "ftc", category: "regulatory", type: "Filing", cadence: "Hourly", health: "healthy", itemsToday: 38 },
  { id: "s-doj", name: "DOJ Press", slug: "doj", category: "regulatory", type: "Filing", cadence: "Hourly", health: "degraded", itemsToday: 41 },
  // wires & news
  { id: "s-reuters", name: "Reuters", slug: "reuters", category: "wires", type: "Wire", cadence: "Real-time", health: "healthy", itemsToday: 12640, licensed: true },
  { id: "s-bloomberg", name: "Bloomberg", slug: "bloomberg", category: "wires", type: "Wire", cadence: "Real-time", health: "healthy", itemsToday: 9880, licensed: true },
  { id: "s-ap", name: "Associated Press", slug: "ap", category: "wires", type: "Wire", cadence: "Real-time", health: "healthy", itemsToday: 7320, licensed: true },
  { id: "s-cnbc", name: "CNBC", slug: "cnbc", category: "wires", type: "News", cadence: "Real-time", health: "healthy", itemsToday: 5410 },
  { id: "s-mw", name: "MarketWatch", slug: "marketwatch", category: "wires", type: "News", cadence: "15m", health: "healthy", itemsToday: 4180 },
  { id: "s-sa", name: "Seeking Alpha", slug: "seeking_alpha", category: "wires", type: "News", cadence: "15m", health: "healthy", itemsToday: 3260 },
  { id: "s-bwire", name: "Business Wire", slug: "business_wire", category: "wires", type: "Wire", cadence: "Real-time", health: "healthy", itemsToday: 2940, licensed: true },
  { id: "s-prn", name: "PR Newswire", slug: "pr_newswire", category: "wires", type: "Wire", cadence: "Real-time", health: "healthy", itemsToday: 2710, licensed: true },
  { id: "s-nasdaq", name: "Nasdaq", slug: "nasdaq", category: "wires", type: "News", cadence: "Hourly", health: "healthy", itemsToday: 1820 },
  // social & sentiment
  { id: "s-x", name: "X / Twitter", slug: "x", category: "social", type: "Social", cadence: "Real-time", health: "healthy", itemsToday: 41200 },
  { id: "s-reddit", name: "Reddit", slug: "reddit", category: "social", type: "Social", cadence: "15m", health: "healthy", itemsToday: 18600 },
  { id: "s-stocktwits", name: "StockTwits", slug: "stocktwits", category: "social", type: "Social", cadence: "15m", health: "degraded", itemsToday: 9400 },
  { id: "s-gdelt", name: "GDELT", slug: "gdelt", category: "social", type: "Social", cadence: "15m", health: "healthy", itemsToday: 22800 },
  // financial data
  { id: "s-finnhub", name: "Finnhub", slug: "finnhub", category: "data", type: "Data", cadence: "Real-time", health: "healthy", itemsToday: 6200, licensed: true },
  { id: "s-fmp", name: "Financial Modeling Prep", slug: "fmp", category: "data", type: "Data", cadence: "Hourly", health: "healthy", itemsToday: 3100, licensed: true },
  { id: "s-fred", name: "FRED", slug: "fred", category: "data", type: "Data", cadence: "Daily", health: "healthy", itemsToday: 140 },
  // cyber & risk
  { id: "s-cisa", name: "CISA Advisories", slug: "cisa", category: "cyber", type: "Advisory", cadence: "Hourly", health: "healthy", itemsToday: 64 },
  { id: "s-nvd", name: "NVD CVEs", slug: "nvd", category: "cyber", type: "Advisory", cadence: "Hourly", health: "healthy", itemsToday: 320 },
  { id: "s-krebs", name: "Krebs on Security", slug: "krebs", category: "cyber", type: "News", cadence: "Daily", health: "healthy", itemsToday: 12 },
  // trade & vertical
  { id: "s-tc", name: "TechCrunch", slug: "techcrunch", category: "trade", type: "News", cadence: "Hourly", health: "healthy", itemsToday: 280 },
  { id: "s-verge", name: "The Verge", slug: "the_verge", category: "trade", type: "News", cadence: "Hourly", health: "healthy", itemsToday: 240 },
  { id: "s-hw", name: "HousingWire", slug: "housingwire", category: "trade", type: "News", cadence: "Daily", health: "healthy", itemsToday: 58 },
  { id: "s-statnews", name: "STAT News", slug: "stat_news", category: "trade", type: "News", cadence: "Daily", health: "down", itemsToday: 0 },
] as const;

/* -------------------------------------------------------------- monitors --- */

export type MonitorHealth = "active" | "paused" | "error";

export interface SonarMonitor {
  id: string;
  name: string;
  entities: string[]; // company names and / or tickers
  keywords: { any: string[]; exclude: string[] };
  sources: string[]; // source slugs
  cadence: string; // human-readable
  severity: Severity;
  maxItemsPerDay: number;
  delivery: DeliveryChannel[];
  health: MonitorHealth;
  lastRun: string;
  itemsPerDay: number; // average matches / day
  createdVia: "builder" | "manual";
  owner: string; // for the fleet view
}

export const SONAR_MONITORS: readonly SonarMonitor[] = [
  {
    id: "m-13d", name: "13D and going-concern triggers", entities: ["Watchlist (24 tickers)"],
    keywords: { any: ["13D", "schedule 13D", "going concern", "material weakness"], exclude: [] },
    sources: ["sec_edgar"], cadence: "every 2 min", severity: "instant", maxItemsPerDay: 20,
    delivery: ["In-app", "Email", "SMS"], health: "active", lastRun: "41s ago", itemsPerDay: 2, createdVia: "builder", owner: "Maya Okafor",
  },
  {
    id: "m-nvda", name: "Nvidia: export controls and China", entities: ["Nvidia", "NVDA"],
    keywords: { any: ["export control", "China", "restriction", "license", "BIS"], exclude: ["gaming"] },
    sources: ["sec_edgar", "reuters", "bloomberg", "seeking_alpha"], cadence: "every 15 min", severity: "digest", maxItemsPerDay: 15,
    delivery: ["In-app", "Email"], health: "active", lastRun: "3m ago", itemsPerDay: 6, createdVia: "builder", owner: "Maya Okafor",
  },
  {
    id: "m-aapl", name: "Apple: supply chain and labor", entities: ["Apple", "AAPL"],
    keywords: { any: ["supply chain", "Foxconn", "labor", "union", "factory"], exclude: ["app store"] },
    sources: ["reuters", "ap", "cnbc", "gdelt"], cadence: "every 15 min", severity: "digest", maxItemsPerDay: 12,
    delivery: ["In-app", "Slack"], health: "active", lastRun: "1m ago", itemsPerDay: 9, createdVia: "manual", owner: "Maya Okafor",
  },
  {
    id: "m-activist", name: "Activist and proxy watch", entities: ["Watchlist (24 tickers)"],
    keywords: { any: ["activist", "proxy contest", "board seat", "nominate", "stake"], exclude: [] },
    sources: ["sec_edgar", "reuters", "bloomberg"], cadence: "every 5 min", severity: "instant", maxItemsPerDay: 15,
    delivery: ["In-app", "Email", "Microsoft Teams"], health: "active", lastRun: "2m ago", itemsPerDay: 3, createdVia: "builder", owner: "Devin Cole",
  },
  {
    id: "m-breach", name: "Portfolio breach and CISA watch", entities: ["Watchlist (24 tickers)"],
    keywords: { any: ["data breach", "ransomware", "advisory", "CVE", "incident"], exclude: ["patch tuesday"] },
    sources: ["cisa", "nvd", "krebs", "reuters"], cadence: "every 10 min", severity: "instant", maxItemsPerDay: 10,
    delivery: ["In-app", "Slack"], health: "active", lastRun: "6m ago", itemsPerDay: 1, createdVia: "builder", owner: "Devin Cole",
  },
  {
    id: "m-tsla", name: "Tesla: recalls and NHTSA", entities: ["Tesla", "TSLA"],
    keywords: { any: ["recall", "NHTSA", "investigation", "Autopilot", "defect"], exclude: [] },
    sources: ["federal_register", "reuters", "cnbc"], cadence: "every 30 min", severity: "digest", maxItemsPerDay: 10,
    delivery: ["In-app", "Email"], health: "active", lastRun: "12m ago", itemsPerDay: 4, createdVia: "manual", owner: "Maya Okafor",
  },
  {
    id: "m-fda", name: "Biotech: FDA decisions", entities: ["Moderna", "MRNA", "tracked biotech"],
    keywords: { any: ["FDA", "approval", "PDUFA", "complete response", "clinical hold"], exclude: [] },
    sources: ["fda", "business_wire", "stat_news"], cadence: "every 15 min", severity: "instant", maxItemsPerDay: 10,
    delivery: ["In-app", "Email"], health: "paused", lastRun: "4h ago", itemsPerDay: 0, createdVia: "builder", owner: "Devin Cole",
  },
  {
    id: "m-exec", name: "C-suite departures", entities: ["Watchlist (24 tickers)"],
    keywords: { any: ["steps down", "resign", "departure", "CEO transition", "8-K item 5.02"], exclude: [] },
    sources: ["sec_edgar", "pr_newswire", "reuters"], cadence: "every 10 min", severity: "instant", maxItemsPerDay: 12,
    delivery: ["In-app", "Microsoft Teams"], health: "active", lastRun: "8m ago", itemsPerDay: 2, createdVia: "builder", owner: "Maya Okafor",
  },
  {
    id: "m-earn", name: "Tracked tickers: earnings and guidance", entities: ["Watchlist (24 tickers)"],
    keywords: { any: ["earnings", "guidance", "revises", "preliminary results", "pre-announce"], exclude: [] },
    sources: ["sec_edgar", "business_wire", "nasdaq", "cnbc"], cadence: "every 5 min", severity: "digest", maxItemsPerDay: 20,
    delivery: ["In-app", "Email", "Slack"], health: "active", lastRun: "30s ago", itemsPerDay: 14, createdVia: "manual", owner: "Maya Okafor",
  },
  {
    id: "m-sov", name: "Daily share-of-voice digest", entities: ["Watchlist (24 tickers)"],
    keywords: { any: ["coverage", "mention", "headline"], exclude: [] },
    sources: ["reuters", "bloomberg", "cnbc", "marketwatch", "seeking_alpha", "x", "reddit"], cadence: "daily at 7:00 ET", severity: "digest", maxItemsPerDay: 1,
    delivery: ["In-app", "Email"], health: "active", lastRun: "today 7:00 ET", itemsPerDay: 1, createdVia: "manual", owner: "Devin Cole",
  },
  {
    id: "m-macro", name: "Semis macro and policy", entities: ["Semiconductors", "CHIPS Act"],
    keywords: { any: ["CHIPS Act", "tariff", "subsidy", "fab", "export"], exclude: [] },
    sources: ["federal_register", "reuters", "fred"], cadence: "every 30 min", severity: "digest", maxItemsPerDay: 8,
    delivery: ["In-app"], health: "error", lastRun: "stalled 22m ago", itemsPerDay: 5, createdVia: "manual", owner: "Devin Cole",
  },
];

/* ---------------------------------------------------------------- alerts --- */
/** A delivered match: the output of a monitor against the live feed. */
export interface SonarAlert {
  id: string;
  monitorId: string;
  monitor: string; // monitor name, denormalized for the feed
  headline: string;
  outlet: string;
  sourceType: SourceType;
  ticker?: string;
  sentiment: Sentiment;
  severity: Severity;
  matched: string[];
  summary: string; // one-line AI summary
  time: string;
}

export const SONAR_ALERTS: readonly SonarAlert[] = [
  { id: "a-1", monitorId: "m-activist", monitor: "Activist and proxy watch", headline: "Riverbend Capital discloses 5.4% stake in Halcyon Logistics, urges board refresh", outlet: "Reuters", sourceType: "Wire", ticker: "HALC", sentiment: "negative", severity: "instant", matched: ["activist", "stake", "board seat"], summary: "Activist 13D with a public board-refresh demand. IR should expect inbound within the hour.", time: "just now" },
  { id: "a-2", monitorId: "m-13d", monitor: "13D and going-concern triggers", headline: "Schedule 13D filed on Meridian Foods by Oakhill Partners", outlet: "SEC EDGAR", sourceType: "Filing", ticker: "MFDS", sentiment: "neutral", severity: "instant", matched: ["13D", "schedule 13D"], summary: "New 13D crosses the 5% threshold. No demands stated yet in the filing body.", time: "2m ago" },
  { id: "a-3", monitorId: "m-nvda", monitor: "Nvidia: export controls and China", headline: "Nvidia flags expanded export-license exposure in latest 10-Q risk factors", outlet: "SEC EDGAR", sourceType: "Filing", ticker: "NVDA", sentiment: "neutral", severity: "digest", matched: ["export control", "license"], summary: "Risk-factor language broadened around China licensing. Worth a proactive holding statement.", time: "6m ago" },
  { id: "a-4", monitorId: "m-earn", monitor: "Tracked tickers: earnings and guidance", headline: "Cedar Park Devices pre-announces Q3 revenue above the high end of guidance", outlet: "Business Wire", sourceType: "Wire", ticker: "CPDV", sentiment: "positive", severity: "digest", matched: ["pre-announce", "guidance"], summary: "Positive pre-announcement. Prep a confirming quote and brief the analyst list.", time: "11m ago" },
  { id: "a-5", monitorId: "m-breach", monitor: "Portfolio breach and CISA watch", headline: "CISA issues advisory on actively exploited flaw in widely used VPN appliance", outlet: "CISA Advisories", sourceType: "Advisory", sentiment: "negative", severity: "instant", matched: ["advisory", "CVE", "incident"], summary: "Two tracked names run the affected appliance. Loop in security comms now.", time: "18m ago" },
  { id: "a-6", monitorId: "m-exec", monitor: "C-suite departures", headline: "Atlas Health CFO to step down, search underway, names interim", outlet: "PR Newswire", sourceType: "Wire", ticker: "ATLH", sentiment: "negative", severity: "instant", matched: ["steps down", "CEO transition"], summary: "CFO transition via 8-K item 5.02. Expect questions on the timing into earnings.", time: "26m ago" },
  { id: "a-7", monitorId: "m-aapl", monitor: "Apple: supply chain and labor", headline: "Apple supplier reports production normalizing at flagship assembly site", outlet: "Reuters", sourceType: "Wire", ticker: "AAPL", sentiment: "positive", severity: "digest", matched: ["supply chain", "factory"], summary: "Supply normalization narrative, mildly positive. Low urgency, route to digest.", time: "34m ago" },
  { id: "a-8", monitorId: "m-tsla", monitor: "Tesla: recalls and NHTSA", headline: "NHTSA opens preliminary evaluation into driver-assist feature", outlet: "Federal Register", sourceType: "Filing", ticker: "TSLA", sentiment: "negative", severity: "digest", matched: ["NHTSA", "investigation"], summary: "Preliminary, not a recall. Track for escalation and prepare a factual line.", time: "48m ago" },
  { id: "a-9", monitorId: "m-nvda", monitor: "Nvidia: export controls and China", headline: "Analysts debate China revenue mix after policy headlines, mixed notes", outlet: "Seeking Alpha", sourceType: "News", ticker: "NVDA", sentiment: "neutral", severity: "digest", matched: ["China", "restriction"], summary: "Sell-side commentary, no new facts. Useful color for the daily digest.", time: "1h ago" },
  { id: "a-10", monitorId: "m-earn", monitor: "Tracked tickers: earnings and guidance", headline: "Northwind Materials revises full-year guidance lower on demand softness", outlet: "Nasdaq", sourceType: "News", ticker: "NWMT", sentiment: "negative", severity: "digest", matched: ["guidance", "revises"], summary: "Guidance cut. Coordinate messaging with the company before the call.", time: "1h ago" },
  { id: "a-11", monitorId: "m-activist", monitor: "Activist and proxy watch", headline: "Proxy advisor recommends against two incumbent directors at Lumen Grid", outlet: "Bloomberg", sourceType: "Wire", ticker: "LMNG", sentiment: "negative", severity: "instant", matched: ["proxy contest", "board seat"], summary: "Adverse proxy recommendation ahead of the annual meeting. High priority.", time: "2h ago" },
  { id: "a-12", monitorId: "m-13d", monitor: "13D and going-concern triggers", headline: "Auditor flags going-concern doubt in annual report for Sable Retail", outlet: "SEC EDGAR", sourceType: "Filing", ticker: "SABL", sentiment: "negative", severity: "instant", matched: ["going concern"], summary: "Going-concern language in the 10-K. Expect media follow-up by morning.", time: "2h ago" },
  { id: "a-13", monitorId: "m-aapl", monitor: "Apple: supply chain and labor", headline: "Labor group plans organizing push at two retail locations", outlet: "Associated Press", sourceType: "Wire", ticker: "AAPL", sentiment: "negative", severity: "digest", matched: ["labor", "union"], summary: "Localized labor story. Monitor for spread before responding.", time: "3h ago" },
  { id: "a-14", monitorId: "m-exec", monitor: "C-suite departures", headline: "Vista Payments names new COO, effective next month", outlet: "PR Newswire", sourceType: "Wire", ticker: "VSTP", sentiment: "neutral", severity: "instant", matched: ["departure", "CEO transition"], summary: "Planned leadership add, neutral. Update the bio kit and spokesperson list.", time: "4h ago" },
  { id: "a-15", monitorId: "m-earn", monitor: "Tracked tickers: earnings and guidance", headline: "Cobalt Software reaffirms guidance, raises buyback authorization", outlet: "Business Wire", sourceType: "Wire", ticker: "CBLT", sentiment: "positive", severity: "digest", matched: ["guidance", "earnings"], summary: "Reaffirm plus buyback, net positive. Good for the morning roundup.", time: "5h ago" },
  { id: "a-16", monitorId: "m-breach", monitor: "Portfolio breach and CISA watch", headline: "Security researchers publish details on flaw affecting popular CMS", outlet: "Krebs on Security", sourceType: "News", sentiment: "neutral", severity: "instant", matched: ["CVE", "incident"], summary: "No tracked name confirmed affected yet. Holding for confirmation.", time: "6h ago" },
  { id: "a-17", monitorId: "m-macro", monitor: "Semis macro and policy", headline: "Commerce finalizes next tranche of CHIPS Act incentive awards", outlet: "Reuters", sourceType: "Wire", sentiment: "positive", severity: "digest", matched: ["CHIPS Act", "subsidy"], summary: "Policy tailwind for the semis book. Color for the macro digest.", time: "7h ago" },
  { id: "a-18", monitorId: "m-sov", monitor: "Daily share-of-voice digest", headline: "Daily digest: 142 mentions across the watchlist, sentiment net positive", outlet: "Sonar", sourceType: "News", sentiment: "positive", severity: "digest", matched: ["coverage", "mention"], summary: "Volume up 12% day over day, led by Cedar Park Devices coverage.", time: "today 7:00 ET" },
];

/* --------------------------------------------------- builder presets --- */
/** The plain-English builder: a preset ask, the assistant reply, the resolved
 *  spec, and the dry-run result. Scripted so the demo is fully clickable. */

export interface SonarSpec {
  entities: string[];
  keywords: { any: string[]; exclude: string[] };
  sources: string[]; // human-readable
  cadence: string;
  severity: Severity;
  maxItemsPerDay: number;
  delivery: DeliveryChannel[];
  estItemsPerDay: number;
  estCostPerMonth: number;
  unresolved: string[];
}

export interface SonarDryRun {
  scanned: number;
  sources: number;
  windowHours: number;
  matches: { headline: string; outlet: string; ticker?: string; time: string }[];
}

export interface SonarBuilderPreset {
  id: string;
  prompt: string;
  reply: string;
  spec: SonarSpec;
  dryRun: SonarDryRun;
}

export const SONAR_BUILDER_PRESETS: readonly SonarBuilderPreset[] = [
  {
    id: "b-13d",
    prompt: "Alert me the instant any tracked ticker has a 13D filing or a going-concern flag. Send it to my phone and email.",
    reply: "Got it. I will watch SEC EDGAR for Schedule 13D filings and going-concern language across your 24-ticker watchlist, fire instantly on a match, and route to in-app, email, and SMS. I capped it at 20 items a day so a filing storm cannot flood you.",
    spec: {
      entities: ["Watchlist (24 tickers)"],
      keywords: { any: ["13D", "schedule 13D", "going concern", "material weakness"], exclude: [] },
      sources: ["SEC EDGAR"],
      cadence: "every 2 min",
      severity: "instant",
      maxItemsPerDay: 20,
      delivery: ["In-app", "Email", "SMS"],
      estItemsPerDay: 2,
      estCostPerMonth: 6,
      unresolved: [],
    },
    dryRun: {
      scanned: 1284, sources: 1, windowHours: 48,
      matches: [
        { headline: "Schedule 13D filed on Meridian Foods by Oakhill Partners", outlet: "SEC EDGAR", ticker: "MFDS", time: "yesterday 2:11 PM" },
        { headline: "Auditor flags going-concern doubt in annual report for Sable Retail", outlet: "SEC EDGAR", ticker: "SABL", time: "yesterday 6:40 AM" },
        { headline: "Amended 13D adds board-nominee slate at Halcyon Logistics", outlet: "SEC EDGAR", ticker: "HALC", time: "2 days ago 9:02 AM" },
      ],
    },
  },
  {
    id: "b-nvda",
    prompt: "Watch Nvidia for anything about export controls or China restrictions. A daily digest is fine, I do not need to be pinged all day.",
    reply: "Done. I will track Nvidia and NVDA across SEC EDGAR, Reuters, Bloomberg, and Seeking Alpha for export-control and China-restriction language, run an AI relevance gate so you only get the real ones, and batch everything into your 7:00 AM digest. I excluded gaming chatter.",
    spec: {
      entities: ["Nvidia", "NVDA"],
      keywords: { any: ["export control", "China", "restriction", "license", "BIS"], exclude: ["gaming"] },
      sources: ["SEC EDGAR", "Reuters", "Bloomberg", "Seeking Alpha"],
      cadence: "every 15 min",
      severity: "digest",
      maxItemsPerDay: 15,
      delivery: ["In-app", "Email"],
      estItemsPerDay: 6,
      estCostPerMonth: 14,
      unresolved: [],
    },
    dryRun: {
      scanned: 3960, sources: 4, windowHours: 48,
      matches: [
        { headline: "Nvidia flags expanded export-license exposure in latest 10-Q risk factors", outlet: "SEC EDGAR", ticker: "NVDA", time: "today 8:14 AM" },
        { headline: "Analysts debate China revenue mix after policy headlines", outlet: "Seeking Alpha", ticker: "NVDA", time: "yesterday 4:30 PM" },
        { headline: "Reuters: chipmakers weigh response to tightened licensing rules", outlet: "Reuters", ticker: "NVDA", time: "yesterday 11:05 AM" },
      ],
    },
  },
  {
    id: "b-breach",
    prompt: "Tell me the moment a portfolio company has a data breach or shows up in a CISA advisory.",
    reply: "Set up. I will watch CISA advisories, the NVD CVE feed, Krebs, and the wires for breach and incident language tied to your watchlist, fire instantly, and send to in-app and Slack. SMS is available too if you want me to add it.",
    spec: {
      entities: ["Watchlist (24 tickers)"],
      keywords: { any: ["data breach", "ransomware", "advisory", "CVE", "incident"], exclude: ["patch tuesday"] },
      sources: ["CISA Advisories", "NVD CVEs", "Krebs on Security", "Reuters"],
      cadence: "every 10 min",
      severity: "instant",
      maxItemsPerDay: 10,
      delivery: ["In-app", "Slack"],
      estItemsPerDay: 1,
      estCostPerMonth: 9,
      unresolved: ["SMS is available on this monitor. Say the word and I will add it."],
    },
    dryRun: {
      scanned: 842, sources: 4, windowHours: 48,
      matches: [
        { headline: "CISA issues advisory on actively exploited VPN appliance flaw", outlet: "CISA Advisories", time: "today 6:20 AM" },
        { headline: "Researchers publish details on flaw affecting popular CMS", outlet: "Krebs on Security", time: "yesterday 1:15 PM" },
      ],
    },
  },
];

/* ------------------------------------------------------------- ai usage --- */
/** Per-model AI spend, surfaced so cost is visible and capped per workspace. */
export const SONAR_AI_USAGE = {
  total: 184.2,
  cap: 500,
  byModel: [
    { model: "Opus 4.8", role: "Spec translation", cost: 41.4, calls: 276, color: "#FFB224" },
    { model: "Haiku 4.5", role: "Relevance gate", cost: 96.8, calls: 1_240_000, color: "#36D399" },
    { model: "Sonnet 4.6", role: "Digest prose", cost: 46.0, calls: 920, color: "#60A5FA" },
  ],
  /** Last 14 days of cost by model, for the stacked bars. */
  daily: [
    { opus: 1.2, haiku: 3.1, sonnet: 1.4 }, { opus: 1.4, haiku: 3.4, sonnet: 1.5 },
    { opus: 1.1, haiku: 2.9, sonnet: 1.3 }, { opus: 1.6, haiku: 3.6, sonnet: 1.7 },
    { opus: 1.5, haiku: 3.3, sonnet: 1.5 }, { opus: 0.9, haiku: 2.4, sonnet: 1.1 },
    { opus: 0.8, haiku: 2.2, sonnet: 1.0 }, { opus: 1.7, haiku: 3.8, sonnet: 1.8 },
    { opus: 1.8, haiku: 4.0, sonnet: 1.9 }, { opus: 1.5, haiku: 3.5, sonnet: 1.6 },
    { opus: 1.3, haiku: 3.2, sonnet: 1.4 }, { opus: 1.6, haiku: 3.7, sonnet: 1.7 },
    { opus: 1.9, haiku: 4.2, sonnet: 2.0 }, { opus: 1.7, haiku: 3.9, sonnet: 1.8 },
  ],
} as const;

/* ------------------------------------------------------------ analytics --- */

export const SONAR_ANALYTICS = {
  /** Coverage volume over the last 14 days (mentions across the watchlist). */
  coverageVolume: [820, 910, 760, 1040, 980, 540, 480, 1120, 1180, 990, 870, 1060, 1240, 1140],
  /** Sentiment split of delivered alerts this week. */
  sentiment: [
    { label: "Positive", value: 38, color: "#36D399" },
    { label: "Neutral", value: 47, color: "#8B98A8" },
    { label: "Negative", value: 28, color: "#F87171" },
  ],
  /** Share of voice by outlet (mentions captured). */
  shareOfVoice: [
    { name: "Reuters", count: 184 },
    { name: "Bloomberg", count: 156 },
    { name: "SEC EDGAR", count: 132 },
    { name: "CNBC", count: 98 },
    { name: "Seeking Alpha", count: 74 },
    { name: "Business Wire", count: 61 },
  ],
  /** Most-active monitors by matches this week. */
  topMonitors: [
    { name: "Earnings and guidance", count: 98 },
    { name: "Share-of-voice digest", count: 71 },
    { name: "Nvidia: export controls", count: 42 },
    { name: "Apple: supply chain", count: 63 },
    { name: "Activist and proxy watch", count: 21 },
  ],
} as const;

/* ------------------------------------------------------------- landing copy --- */

export const SONAR_PAIN_POINTS = [
  { title: "Drowning in feeds", body: "Signal hides across SEC filings, a dozen wires, social, and regulators. Nobody can watch them all in real time." },
  { title: "Configuration tax", body: "Legacy monitoring means boolean query builders and saved searches. Setting up one good alert can take an afternoon." },
  { title: "Noise and surprise bills", body: "Untuned alerts flood your inbox, and AI-powered tools rack up costs you only discover at month end." },
] as const;

export const SONAR_STEPS = [
  { n: 1, title: "Describe it", body: "Type what you care about in plain English. Sonar resolves the entities, keywords, and sources for you." },
  { n: 2, title: "Dry-run it", body: "Replay the last 48 hours and see exactly what the monitor would have caught before you turn it on." },
  { n: 3, title: "Get pinged", body: "Real matches land in-app, email, Slack, or Teams, gated by severity and capped so they never flood you." },
] as const;

export const SONAR_FEATURES = [
  { icon: "sparkles", title: "Plain-English builder", body: "An LLM turns your ask into a validated monitor spec. No boolean syntax, no saved-search archaeology." },
  { icon: "eye", title: "Dry run before launch", body: "Every monitor previews against real history, so you trust it before a single alert goes out." },
  { icon: "filter", title: "AI relevance gate", body: "A cheap relevance model filters each match, so you get the real story and not every keyword hit." },
  { icon: "bell", title: "Severity and flood caps", body: "High-severity fires instantly, the rest batches into a digest. Per-monitor caps keep volume sane." },
  { icon: "bolt", title: "Visible AI spend", body: "Cost is tracked per model and capped per workspace, so an alert run never turns into a surprise bill." },
  { icon: "shield", title: "Source-grade coverage", body: "SEC EDGAR, the wires, regulators, social, and cyber feeds, licensed where it counts." },
] as const;

/** Source names for the marketing logo strip. */
export const SONAR_SOURCE_STRIP = [
  "SEC EDGAR", "Reuters", "Bloomberg", "Associated Press", "CNBC", "Business Wire",
  "GDELT", "CISA", "Finnhub", "FRED", "Seeking Alpha", "PR Newswire",
] as const;

/** Hero facts. No revenue or audited-metric claims. */
export const SONAR_FACTS = [
  { value: "1,200+", label: "sources" },
  { value: "<60s", label: "to set up" },
  { value: "plain English", label: "to build" },
  { value: "48h", label: "dry run" },
] as const;
