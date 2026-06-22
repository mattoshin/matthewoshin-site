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
