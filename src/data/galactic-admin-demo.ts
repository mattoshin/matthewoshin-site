/**
 * Sample data for the Galactic Signals ADMIN console demo. Mirrors the real
 * galactic-app admin panel (dashboard, system health, users, AI usage) with
 * realistic, deterministic figures. No Math.random so server and client render
 * identically. All illustrative — see the demo's sample-data badge.
 */

/* --------------------------------------------------------------- overview --- */

export const ADMIN_SERVER_HEALTH = {
  memory: { usedPct: 63, usedGb: 5.0, totalGb: 8 },
  cpu: { load1: 1.84, load5: 1.62, load15: 1.41, cores: 4 },
  disk: { usedPct: 47, usedGb: 94, totalGb: 200 },
  uptime: "27d 14h",
  node: "v22.11.0",
} as const;

/** Last 14 days of total daily deliveries (oldest -> newest), for the area chart. */
export const ADMIN_DELIVERY_VOLUME: number[] = [
  248_900, 261_400, 257_800, 273_100, 289_600, 268_200, 241_700, 252_300,
  279_900, 296_400, 312_800, 305_600, 318_500, 331_200,
];

/** Last 14 days delivery success rate (%), aligned to ADMIN_DELIVERY_VOLUME. */
export const ADMIN_SUCCESS_RATE: number[] = [
  99.91, 99.94, 99.88, 99.96, 99.97, 99.93, 99.71, 99.9, 99.95, 99.97, 99.98,
  99.96, 99.96, 99.98,
];

/** Top feeds by deliveries (24h), for the busiest-feeds bar list. */
export const ADMIN_BUSIEST_FEEDS: { name: string; count: number }[] = [
  { name: "Crypto Top Movers", count: 18_420 },
  { name: "Top Stock Movers", count: 15_980 },
  { name: "Unusual Options Volume", count: 12_640 },
  { name: "Whale Transfers", count: 9_870 },
  { name: "Polymarket Trending", count: 7_410 },
  { name: "SEC Filings", count: 5_290 },
];

export type AdminLogStatus = 200 | 204 | 429 | 502;

export interface AdminDeliveryLog {
  id: string;
  time: string;
  feed: string;
  user: string;
  status: AdminLogStatus;
  payload: string;
}

export const ADMIN_DELIVERY_LOGS: AdminDeliveryLog[] = [
  { id: "d1", time: "12:41:08", feed: "crypto-top-movers", user: "apex-capital", status: 200, payload: "{ symbol: BTC, change: +4.2% }" },
  { id: "d2", time: "12:41:02", feed: "options-unusual-volume", user: "delta-desk", status: 200, payload: "{ ticker: NVDA, iv: 71% }" },
  { id: "d3", time: "12:40:55", feed: "whale-transfers", user: "onchain-alpha", status: 200, payload: "{ amount: 1240 ETH, to: Kraken }" },
  { id: "d4", time: "12:40:51", feed: "top-stock-movers", user: "apex-capital", status: 429, payload: "{ retry_after: 2s }" },
  { id: "d5", time: "12:40:44", feed: "polymarket-trending", user: "macro-room", status: 200, payload: "{ market: Fed cut, odds: 63% }" },
  { id: "d6", time: "12:40:39", feed: "sec-filings", user: "value-vault", status: 200, payload: "{ form: 8-K, co: TSLA }" },
  { id: "d7", time: "12:40:31", feed: "halts-up", user: "scalp-squad", status: 502, payload: "{ error: webhook timeout }" },
  { id: "d8", time: "12:40:22", feed: "fred-rates", user: "macro-room", status: 200, payload: "{ series: DFF, value: 4.33 }" },
  { id: "d9", time: "12:40:18", feed: "crypto-fear-greed", user: "onchain-alpha", status: 200, payload: "{ index: 72, label: Greed }" },
  { id: "d10", time: "12:40:09", feed: "odds-best-bets", user: "edge-bettors", status: 204, payload: "{ no_qualifying_games: true }" },
  { id: "d11", time: "12:40:01", feed: "social-x-traders", user: "apex-capital", status: 200, payload: "{ ticker: AMD, mentions: +312% }" },
  { id: "d12", time: "12:39:54", feed: "metals-gold-silver", user: "macro-room", status: 200, payload: "{ gold: 2418.40, ratio: 84.1 }" },
];

/* ------------------------------------------------------------------ users --- */

/** Cumulative communities by month (last 12), for the growth line. */
export const ADMIN_USER_GROWTH: { month: string; total: number }[] = [
  { month: "Jul", total: 4_120 },
  { month: "Aug", total: 4_980 },
  { month: "Sep", total: 5_910 },
  { month: "Oct", total: 6_840 },
  { month: "Nov", total: 7_720 },
  { month: "Dec", total: 8_460 },
  { month: "Jan", total: 9_310 },
  { month: "Feb", total: 10_180 },
  { month: "Mar", total: 11_040 },
  { month: "Apr", total: 11_760 },
  { month: "May", total: 12_390 },
  { month: "Jun", total: 12_840 },
];

/** Plan distribution across the user base, for the donut + legend. */
export const ADMIN_PLAN_SPLIT: { label: string; value: number; color: string }[] = [
  { label: "Free", value: 8_910, color: "#7C8DA8" },
  { label: "Pro", value: 3_120, color: "#22D3EE" },
  { label: "Business", value: 810, color: "#1DD1A1" },
];

export const ADMIN_REVENUE = {
  mrr: 71_480,
  mrrGrowthPct: 8.4,
  arpu: 17.4,
  netRevenueRetentionPct: 118,
} as const;

/* --------------------------------------------------------------- products --- */

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  tier: "free" | "pro" | "business";
  feeds: number;
  users: number;
  status: "active" | "draft";
}

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: "p1", name: "Equities Pro", category: "Stocks", tier: "pro", feeds: 11, users: 6_240, status: "active" },
  { id: "p2", name: "Crypto Signals", category: "Crypto", tier: "pro", feeds: 9, users: 5_810, status: "active" },
  { id: "p3", name: "Options Flow", category: "Stocks", tier: "business", feeds: 4, users: 2_180, status: "active" },
  { id: "p4", name: "Prediction Markets", category: "Prediction", tier: "free", feeds: 4, users: 3_960, status: "active" },
  { id: "p5", name: "Macro & Rates", category: "Macro", tier: "free", feeds: 7, users: 4_410, status: "active" },
  { id: "p6", name: "Sports Edge", category: "Sports", tier: "pro", feeds: 4, users: 1_730, status: "active" },
  { id: "p7", name: "On-Chain Intel", category: "Crypto", tier: "business", feeds: 6, users: 1_290, status: "active" },
  { id: "p8", name: "News & Filings", category: "News", tier: "free", feeds: 8, users: 5_020, status: "active" },
  { id: "p9", name: "Collectibles", category: "Collectibles", tier: "pro", feeds: 3, users: 640, status: "draft" },
  { id: "p10", name: "Weather Risk", category: "Weather", tier: "business", feeds: 2, users: 410, status: "draft" },
];

/* -------------------------------------------------------------- ai usage --- */

export interface AdminModelUsage {
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  calls: number;
  cost: number;
}

export const ADMIN_AI_MODELS: AdminModelUsage[] = [
  { model: "claude-haiku-4-5", provider: "Anthropic", promptTokens: 4_820_000, completionTokens: 1_240_000, calls: 18_640, cost: 9.42 },
  { model: "claude-sonnet-4-6", provider: "Anthropic", promptTokens: 1_910_000, completionTokens: 690_000, calls: 3_280, cost: 21.7 },
  { model: "llama-3.3-70b", provider: "Groq", promptTokens: 6_140_000, completionTokens: 980_000, calls: 24_110, cost: 0 },
];

export const ADMIN_AI_FEATURES: { feature: string; tokens: number; calls: number; cost: number }[] = [
  { feature: "Monitor Builder", tokens: 5_910_000, calls: 12_400, cost: 14.8 },
  { feature: "Embed Generator", tokens: 3_120_000, calls: 9_870, cost: 7.1 },
  { feature: "Context Generation", tokens: 2_440_000, calls: 14_220, cost: 4.9 },
  { feature: "Help Chat (Artoo)", tokens: 2_390_000, calls: 8_640, cost: 4.32 },
];

/** Daily AI cost ($) for the last 14 days, split by the two paid models. */
export const ADMIN_AI_DAILY: { haiku: number; sonnet: number }[] = [
  { haiku: 0.41, sonnet: 0.92 }, { haiku: 0.48, sonnet: 1.04 }, { haiku: 0.52, sonnet: 0.88 },
  { haiku: 0.61, sonnet: 1.21 }, { haiku: 0.58, sonnet: 1.35 }, { haiku: 0.44, sonnet: 0.97 },
  { haiku: 0.39, sonnet: 0.71 }, { haiku: 0.55, sonnet: 1.1 }, { haiku: 0.67, sonnet: 1.42 },
  { haiku: 0.72, sonnet: 1.55 }, { haiku: 0.78, sonnet: 1.68 }, { haiku: 0.69, sonnet: 1.49 },
  { haiku: 0.81, sonnet: 1.73 }, { haiku: 0.88, sonnet: 1.9 },
];

/* ----------------------------------------------- monitor builder fallback --- */

/** Canned monitor returned by the live builder when the API key is missing,
 *  rate-limited, or the upstream call fails. Keeps the demo always responsive. */
export const ADMIN_BUILDER_FALLBACK = {
  name: "Crypto Fear & Greed Monitor",
  slug: "crypto-fear-greed",
  feedSlug: "crypto-fear-greed",
  category: "crypto",
  cron: "every 30 minutes",
  marketHoursOnly: false,
  summary:
    "Polls the Alternative.me Fear & Greed index and posts a branded alert whenever the sentiment band flips (e.g. Greed -> Extreme Greed).",
  embed: {
    title: "₿ Crypto Fear & Greed",
    color: "#F7931A",
    fields: [
      { name: "Index", value: "72 / 100", inline: true },
      { name: "Sentiment", value: "Greed", inline: true },
      { name: "24h Change", value: "+6", inline: true },
    ],
    footer: "Galactic Signals · sample",
  },
} as const;

/* ------------------------------------------------------- stack / hood --- */
/** The real production architecture, grouped for the "Under the hood" panel.
 *  Frontend / Backend / Data / Infra so the polyglot stack (TypeScript +
 *  Python + SQL) reads clearly, not just the frontend. */
export interface AdminStackGroup {
  group: string;
  color: string;
  blurb: string;
  items: string[];
}

export const ADMIN_STACK: AdminStackGroup[] = [
  { group: "Frontend", color: "#1DD1A1", blurb: "Type-safe React app, server components.", items: ["TypeScript", "React 19", "Next.js 16 (App Router)", "Tailwind CSS v4", "shadcn/ui"] },
  { group: "Backend", color: "#5865F2", blurb: "Polyglot: a Node API layer plus an async Python worker fleet.", items: ["Node.js (Next route handlers)", "Prisma ORM", "Python 3.11 workers", "asyncpg · discord.py · aiohttp", "NextAuth (Google + Discord OAuth)"] },
  { group: "Data", color: "#22D3EE", blurb: "One Postgres brain shared by the app and the workers.", items: ["PostgreSQL 16", "PgBouncer (transaction pooling)", "~50 Prisma models", "SQL (raw worker queries)"] },
  { group: "Infra & Integrations", color: "#7C8DA8", blurb: "Self-hosted, auto-deployed, instrumented.", items: ["Docker Compose + nginx", "GitHub Actions CI/CD", "Stripe · Resend · Sentry", "Discord delivery", "80+ data-source APIs"] },
];

/** Quick language summary line under the stack panel. */
export const ADMIN_STACK_LANGUAGES = ["TypeScript", "Python", "SQL"] as const;

/* ----------------------------------------------------- data sources --- */

export type DataSourceStatus = "connected" | "unconfigured" | "error";

export interface AdminDataSource {
  id: string;
  name: string;
  category: string;
  status: DataSourceStatus;
  calls24h: number;
  tier: "free" | "freemium" | "paid";
  keyHint: string; // masked, illustrative
}

export const ADMIN_DATA_SOURCES: AdminDataSource[] = [
  { id: "ds-polygon", name: "Polygon", category: "Stocks", status: "connected", calls24h: 184_200, tier: "paid", keyHint: "pk_live_••••7Q2f" },
  { id: "ds-finnhub", name: "Finnhub", category: "Stocks", status: "connected", calls24h: 41_900, tier: "freemium", keyHint: "fh_••••a91c" },
  { id: "ds-opra", name: "OPRA Options", category: "Stocks", status: "connected", calls24h: 96_300, tier: "paid", keyHint: "op_••••dd31" },
  { id: "ds-sec", name: "SEC EDGAR", category: "Stocks", status: "connected", calls24h: 12_400, tier: "free", keyHint: "no key needed" },
  { id: "ds-coingecko", name: "CoinGecko", category: "Crypto", status: "connected", calls24h: 158_700, tier: "freemium", keyHint: "cg_••••5b8e" },
  { id: "ds-whale", name: "Whale Alert", category: "Crypto", status: "connected", calls24h: 22_600, tier: "paid", keyHint: "wa_••••1f07" },
  { id: "ds-etherscan", name: "Etherscan", category: "Crypto", status: "connected", calls24h: 33_100, tier: "freemium", keyHint: "es_••••9c4d" },
  { id: "ds-defillama", name: "DefiLlama", category: "Crypto", status: "connected", calls24h: 8_900, tier: "free", keyHint: "no key needed" },
  { id: "ds-tokenunlocks", name: "TokenUnlocks", category: "Crypto", status: "unconfigured", calls24h: 0, tier: "paid", keyHint: "not configured" },
  { id: "ds-polymarket", name: "Polymarket", category: "Prediction", status: "connected", calls24h: 14_200, tier: "free", keyHint: "no key needed" },
  { id: "ds-kalshi", name: "Kalshi", category: "Prediction", status: "error", calls24h: 410, tier: "freemium", keyHint: "ks_••••e2 (401)" },
  { id: "ds-odds", name: "The Odds API", category: "Sports", status: "connected", calls24h: 27_800, tier: "freemium", keyHint: "od_••••77b1" },
  { id: "ds-espn", name: "ESPN", category: "Sports", status: "connected", calls24h: 19_500, tier: "free", keyHint: "no key needed" },
  { id: "ds-fred", name: "FRED", category: "Macro", status: "connected", calls24h: 6_300, tier: "free", keyHint: "fr_••••0a55" },
  { id: "ds-eia", name: "EIA", category: "Macro", status: "connected", calls24h: 4_100, tier: "free", keyHint: "ei_••••b3f2" },
  { id: "ds-benzinga", name: "Benzinga", category: "News", status: "connected", calls24h: 52_400, tier: "paid", keyHint: "bz_••••4e90" },
  { id: "ds-reddit", name: "Reddit", category: "News", status: "connected", calls24h: 38_200, tier: "freemium", keyHint: "rd_••••c7a1" },
  { id: "ds-adsb", name: "ADS-B Exchange", category: "Alt-data", status: "connected", calls24h: 71_600, tier: "paid", keyHint: "ab_••••18de" },
  { id: "ds-usaspending", name: "USASpending", category: "Alt-data", status: "unconfigured", calls24h: 0, tier: "free", keyHint: "not configured" },
  { id: "ds-tcgplayer", name: "TCGplayer", category: "Collectibles", status: "connected", calls24h: 9_700, tier: "freemium", keyHint: "tc_••••6b2f" },
  { id: "ds-noaa", name: "NOAA / USGS", category: "Weather", status: "connected", calls24h: 15_300, tier: "free", keyHint: "no key needed" },
];

/* --------------------------------------------------------- rss feeds --- */

export interface AdminRssFeed {
  id: string;
  title: string;
  url: string;
  vertical: string;
  status: "active" | "error";
  lastFetched: string;
}

export const ADMIN_RSS_FEEDS: AdminRssFeed[] = [
  { id: "rss-gdelt", title: "GDELT Global Events", url: "https://gdeltproject.org/rss", vertical: "News", status: "active", lastFetched: "2m ago" },
  { id: "rss-stocktwits", title: "StockTwits Trending", url: "https://api.stocktwits.com/trending.rss", vertical: "Sentiment", status: "active", lastFetched: "4m ago" },
  { id: "rss-fed", title: "Federal Reserve Press", url: "https://federalreserve.gov/feeds/press_all.xml", vertical: "Macro", status: "active", lastFetched: "11m ago" },
  { id: "rss-cointelegraph", title: "Cointelegraph", url: "https://cointelegraph.com/rss", vertical: "Crypto", status: "active", lastFetched: "1m ago" },
  { id: "rss-sec", title: "SEC Litigation Releases", url: "https://sec.gov/rss/litigation.xml", vertical: "Filings", status: "error", lastFetched: "3h ago" },
  { id: "rss-nws", title: "NWS Severe Weather", url: "https://alerts.weather.gov/cap/us.atom", vertical: "Weather", status: "active", lastFetched: "6m ago" },
];

/* ------------------------------------------------------- mcp servers --- */

export interface AdminMcpServer {
  id: string;
  name: string;
  transport: "stdio" | "sse" | "http";
  tools: number;
  status: "online" | "offline";
}

export const ADMIN_MCP_SERVERS: AdminMcpServer[] = [
  { id: "mcp-galactic", name: "galactic-feeds", transport: "http", tools: 14, status: "online" },
  { id: "mcp-market", name: "market-data", transport: "sse", tools: 9, status: "online" },
  { id: "mcp-onchain", name: "onchain-intel", transport: "stdio", tools: 6, status: "online" },
  { id: "mcp-sandbox", name: "agent-sandbox", transport: "stdio", tools: 4, status: "offline" },
];

/* ----------------------------------------------------------- dev logs --- */

export interface AdminActionItem {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "open" | "in_progress" | "done";
}

export const ADMIN_DEV_ACTION_ITEMS: AdminActionItem[] = [
  { id: "ai-1", title: "Add Telegram + Slack native delivery (beta behind flag)", priority: "high", status: "in_progress" },
  { id: "ai-2", title: "Ship MCP server v1 to early-access communities", priority: "high", status: "open" },
  { id: "ai-3", title: "Backfill circuit-breaker telemetry into the system dashboard", priority: "medium", status: "open" },
  { id: "ai-4", title: "Tune token-bucket limiter for Discord 30-msg burst windows", priority: "medium", status: "done" },
  { id: "ai-5", title: "Add per-feed cost attribution to the AI usage page", priority: "low", status: "open" },
];

export interface AdminCommit {
  sha: string;
  msg: string;
  author: string;
  when: string;
}

export const ADMIN_DEV_COMMITS: AdminCommit[] = [
  { sha: "9f4c2a1", msg: "feat(workers): add token-unlocks worker with vesting-cliff alerts", author: "matthew", when: "3h ago" },
  { sha: "c81de07", msg: "fix(delivery): respect Discord 429 retry-after in token bucket", author: "matthew", when: "8h ago" },
  { sha: "4a90b3f", msg: "feat(admin): monitor builder generates embeds from plain English", author: "matthew", when: "1d ago" },
  { sha: "2b77e9c", msg: "chore(db): add ai_usage_log model + per-feature rollup query", author: "matthew", when: "1d ago" },
  { sha: "e0512da", msg: "feat(store): category reordering + draft product workflow", author: "matthew", when: "2d ago" },
];

export interface AdminSkillDoc {
  name: string;
  type: "skill" | "md";
  desc: string;
}

export const ADMIN_DEV_SKILLS: AdminSkillDoc[] = [
  { name: "audit-auth", type: "skill", desc: "Security audit of NextAuth config, sessions, and protected routes." },
  { name: "sync-schema", type: "skill", desc: "Verify Python worker queries match the live Prisma schema." },
  { name: "ARCHITECTURE.md", type: "md", desc: "App + worker topology, the shared-DB control seam, deploy flow." },
  { name: "FEEDS.md", type: "md", desc: "How to add a feed: worker file, slug, schema, embed template." },
];

/** The "Artoo PM" AI-generated product summary shown on the Dev Logs tab. */
export const ADMIN_PM_SUMMARY =
  "This cycle shipped the Monitor Builder (plain-English to a live branded monitor), category reordering with a draft product workflow, and per-feature AI cost attribution. The delivery engine now honors Discord retry-after inside the token bucket, cutting 429 fallout. Next up: native Telegram and Slack delivery behind a flag, and the MCP server v1 for early-access communities, the first step of the agent data layer.";

/* ---------------------------------------------------------- marketing --- */

export interface AdminCampaign {
  id: string;
  name: string;
  channel: "Email" | "Discord" | "In-app";
  audience: string;
  sent: number;
  openRate: number;
  status: "sent" | "scheduled" | "draft";
}

export const ADMIN_CAMPAIGNS: AdminCampaign[] = [
  { id: "c-1", name: "MCP early-access invite", channel: "Email", audience: "Business plan", sent: 810, openRate: 61.2, status: "sent" },
  { id: "c-2", name: "New: Token Unlocks feed", channel: "In-app", audience: "Crypto activators", sent: 8_470, openRate: 44.8, status: "sent" },
  { id: "c-3", name: "Pro upgrade nudge", channel: "Email", audience: "Free, 30d active", sent: 12_900, openRate: 38.1, status: "scheduled" },
  { id: "c-4", name: "Quarterly product recap", channel: "Discord", audience: "All communities", sent: 0, openRate: 0, status: "draft" },
];

export interface AdminContact {
  id: string;
  name: string;
  email: string;
  segment: string;
  joined: string;
}

export const ADMIN_CONTACTS: AdminContact[] = [
  { id: "ct-1", name: "Marcus Chen", email: "marcus@apexcapital.io", segment: "Business", joined: "Mar 2025" },
  { id: "ct-2", name: "Sofia Reyes", email: "sofia@genesiscouncil.gg", segment: "Pro", joined: "Apr 2025" },
  { id: "ct-3", name: "Liam O'Brien", email: "liam@northwind.desk", segment: "Business", joined: "Jan 2025" },
  { id: "ct-4", name: "Priya Nair", email: "priya@vegatraders.com", segment: "Pro", joined: "Feb 2025" },
  { id: "ct-5", name: "Diego Santos", email: "diego@helixgroup.io", segment: "Business", joined: "Dec 2024" },
];

export interface AdminSurvey {
  id: string;
  title: string;
  responses: number;
  status: "open" | "closed";
}

export const ADMIN_SURVEYS: AdminSurvey[] = [
  { id: "s-1", title: "Which vertical should we deepen next?", responses: 1_284, status: "open" },
  { id: "s-2", title: "Would you pay for MCP / agent access?", responses: 612, status: "open" },
  { id: "s-3", title: "Onboarding friction (first 30s)", responses: 904, status: "closed" },
];

export interface AdminAutomation {
  id: string;
  name: string;
  trigger: string;
  active: boolean;
  runs: number;
}

export const ADMIN_AUTOMATIONS: AdminAutomation[] = [
  { id: "au-1", name: "Welcome + first-feed nudge", trigger: "On signup", active: true, runs: 12_840 },
  { id: "au-2", name: "Webhook-broken re-engage", trigger: "On 3 failed deliveries", active: true, runs: 1_910 },
  { id: "au-3", name: "Trial ending in 3 days", trigger: "Trial day 11", active: true, runs: 4_220 },
  { id: "au-4", name: "Win-back churned community", trigger: "30d inactive", active: false, runs: 760 },
];
