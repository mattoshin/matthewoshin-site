/**
 * galactic-demo.ts - dummy data for the Galactic Signals interactive demo at
 * /app/galactic-signals. Galactic Signals is a Discord-first cross-asset
 * monitoring SaaS: a user activates data FEEDS across verticals (stocks, crypto,
 * prediction markets, sports, macro, real estate, news, government, collectibles,
 * weather), wires each to a WEBHOOK (Discord / Telegram / Slack / email), and
 * receives branded ALERT embeds. Data model: feed -> monitor -> webhook -> alert.
 *
 * Everything here is illustrative SAMPLE data for a non-functional showcase. The
 * whole /app surface is badged "Interactive demo · sample data". Usage/activity
 * figures are demo numbers (no real revenue or audited-metric claims). Product
 * facts (a fleet of ~79 async workers, market-hours gating, a token-bucket
 * delivery limiter, ~30-second setup, a $35-40B TAM, the MCP / AI-agent-layer
 * roadmap) match the public /projects/galactic-signals case study.
 */

/* ------------------------------------------------------------------ brand --- */

export const GALACTIC = {
  name: "Galactic Signals",
  wordmark: "GALACTIC",
  tagline: "Financial Alpha for the Investors of Tomorrow",
  domain: "galacticsignals.com",
  footer: "galacticsignals.com",
  // exact brand hexes pulled from the real app
  bg: "#0B1120",
  blurple: "#5865F2", // Discord blurple, default embed color
  teal: "#1DD1A1", // primary accent
  cyan: "#22D3EE",
} as const;

/* ----------------------------------------------------- platform-wide stats --- */
/** Headline "lots of people use this" social-proof / dashboard counters. */
export const GALACTIC_PLATFORM = {
  communities: 12_840,
  traders: 48_300,
  feedsLive: 79,
  alertsLifetime: 9_420_000,
  alertsToday: 41_280,
  alertsThisWeek: 318_500,
  channelsConnected: 21_600,
  uptimePct: 99.96,
  avgLatencyMs: 340,
  countriesReached: 92,
} as const;

/** The signed-in demo account (an admin running a busy community). */
export const GALACTIC_ACCOUNT = {
  community: "Apex Capital Group",
  handle: "apex-capital",
  plan: "Business",
  role: "ADMIN",
  members: 18_420,
  serverName: "Apex Capital",
  embedColor: "#1DD1A1",
  joined: "Mar 2025",
  avatarLetter: "A",
} as const;

/* --------------------------------------------------------------- channels --- */

export const DELIVERY_CHANNELS = [
  "Discord",
  "Slack",
  "Telegram",
  "WhatsApp",
  "Email",
  "SMS",
  "Custom API",
] as const;
export type DeliveryChannel = (typeof DELIVERY_CHANNELS)[number];

/* ------------------------------------------------------------- categories --- */

export interface GalacticCategory {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
}

export const GALACTIC_CATEGORIES: readonly GalacticCategory[] = [
  { id: "stocks", name: "Stocks & Equities", emoji: "📈", blurb: "Movers, volume, halts, insider and congressional flow, unusual options." },
  { id: "crypto", name: "Crypto & DeFi", emoji: "🪙", blurb: "Prices, whale transfers, DeFi TVL, funding rates, gas, token unlocks." },
  { id: "prediction", name: "Prediction Markets", emoji: "🎲", blurb: "Polymarket and Kalshi swings, new markets, and resolution odds." },
  { id: "sports", name: "Sports Betting", emoji: "🏈", blurb: "Live odds, line moves, best bets, and real-time scores." },
  { id: "macro", name: "Macro & Economic", emoji: "🏛️", blurb: "Fed and Treasury, CPI and jobs, yield curve, forex, energy." },
  { id: "realestate", name: "Real Estate", emoji: "🏠", blurb: "Housing market shifts, mortgage rates, and regional trends." },
  { id: "news", name: "News & Sentiment", emoji: "📰", blurb: "Market-moving headlines, Reddit and X sentiment, Wikipedia spikes." },
  { id: "gov", name: "Government & Alt-Data", emoji: "🛰️", blurb: "Federal contracts and spending, analyst moves, CEO jet tracking." },
  { id: "collectibles", name: "Collectibles", emoji: "🃏", blurb: "Pokémon and MTG card prices, gaming deals, and grading pops." },
  { id: "weather", name: "Weather & Events", emoji: "🌪️", blurb: "Event-trading signals: weather, earthquakes, and catastrophe alerts." },
] as const;

/* ----------------------------------------------------------------- feeds --- */

export type FeedTier = "Free" | "Pro" | "Business";

export interface GalacticFeed {
  id: string;
  name: string;
  category: GalacticCategory["id"];
  description: string;
  cadence: string; // "Real-time" | "1m" | "15m" | "Hourly" | "Daily"
  source: string; // underlying data source label
  subscribers: number; // popularity, drives the "lots of people" feel
  tier: FeedTier;
  popular?: boolean;
  activated?: boolean; // pre-activated in the demo account
}

export const GALACTIC_FEEDS: readonly GalacticFeed[] = [
  // stocks
  { id: "f-movers", name: "Top Stock Movers", category: "stocks", description: "Top gainers, losers, and most-active names with volume and % change.", cadence: "1m", source: "Polygon", subscribers: 9240, tier: "Free", popular: true, activated: true },
  { id: "f-volume", name: "Volume Scanner", category: "stocks", description: "Unusual volume spikes versus 30-day average, filtered by float and price.", cadence: "1m", source: "Polygon", subscribers: 6110, tier: "Pro", activated: true },
  { id: "f-halts", name: "Trading Halts", category: "stocks", description: "LULD halts and resumptions, tagged up / down / news, the moment they fire.", cadence: "Real-time", source: "NYSE/Nasdaq", subscribers: 4880, tier: "Pro", activated: true },
  { id: "f-whales", name: "Whale Scanner", category: "stocks", description: "Block trades and dark-pool prints above a notional threshold.", cadence: "Real-time", source: "FINRA ADF", subscribers: 5320, tier: "Business", popular: true },
  { id: "f-insider", name: "Insider Trades", category: "stocks", description: "Form 4 insider buys and sells, parsed and ranked by conviction.", cadence: "15m", source: "SEC EDGAR", subscribers: 3970, tier: "Pro" },
  { id: "f-congress", name: "Congressional Trades", category: "stocks", description: "Disclosed trades by members of Congress, by ticker and committee.", cadence: "Daily", source: "House/Senate", subscribers: 7450, tier: "Free", popular: true },
  { id: "f-options", name: "Unusual Options", category: "stocks", description: "Sweeps, blocks, and high-IV prints with call/put skew.", cadence: "Real-time", source: "OPRA", subscribers: 6680, tier: "Business", activated: true },
  { id: "f-ipo", name: "IPO Radar", category: "stocks", description: "Upcoming and updated IPO filings, pricing, and first-day pops.", cadence: "Daily", source: "SEC EDGAR", subscribers: 2410, tier: "Free" },
  { id: "f-earnings", name: "Earnings Calendar", category: "stocks", description: "Upcoming earnings with estimates, plus surprises and revisions.", cadence: "Daily", source: "Nasdaq", subscribers: 5190, tier: "Free" },

  // crypto
  { id: "f-cryptoprices", name: "Crypto Prices", category: "crypto", description: "Top-cap price moves, % change, and market cap in a single embed.", cadence: "1m", source: "CoinGecko", subscribers: 11230, tier: "Free", popular: true, activated: true },
  { id: "f-feargreed", name: "Fear & Greed", category: "crypto", description: "Real-time crypto Fear & Greed index with regime change alerts.", cadence: "Hourly", source: "Alternative.me", subscribers: 6040, tier: "Free", activated: true },
  { id: "f-cryptowhale", name: "Crypto Whale Transfers", category: "crypto", description: "Large on-chain transfers and exchange in/outflows across chains.", cadence: "Real-time", source: "Whale Alert", subscribers: 8470, tier: "Pro", popular: true, activated: true },
  { id: "f-defi", name: "DeFi TVL Movers", category: "crypto", description: "Protocols with the biggest TVL swings and top stablecoin flows.", cadence: "15m", source: "DefiLlama", subscribers: 3320, tier: "Pro" },
  { id: "f-gas", name: "ETH Gas Tracker", category: "crypto", description: "Live gas, mempool congestion, and the cheapest windows to transact.", cadence: "1m", source: "Etherscan", subscribers: 4150, tier: "Free" },
  { id: "f-unlocks", name: "Token Unlocks", category: "crypto", description: "Upcoming vesting cliffs and unlock schedules across 300+ tokens.", cadence: "Daily", source: "TokenUnlocks", subscribers: 3890, tier: "Pro", activated: true },
  { id: "f-funding", name: "Funding Rates", category: "crypto", description: "Perp funding extremes and basis across major venues.", cadence: "Hourly", source: "Binance/Bybit", subscribers: 2960, tier: "Business" },
  { id: "f-dex", name: "DEX Movers", category: "crypto", description: "New pools, top gainers, and unusual volume on on-chain DEXes.", cadence: "Real-time", source: "GeckoTerminal", subscribers: 3540, tier: "Pro" },

  // prediction markets
  { id: "f-poly", name: "Polymarket Swings", category: "prediction", description: "Biggest probability moves and new high-volume Polymarket markets.", cadence: "5m", source: "Polymarket", subscribers: 5870, tier: "Free", popular: true, activated: true },
  { id: "f-kalshi", name: "Kalshi Movers", category: "prediction", description: "Event-contract price moves and fresh markets on Kalshi.", cadence: "5m", source: "Kalshi", subscribers: 2730, tier: "Pro" },

  // sports
  { id: "f-odds", name: "Sports Odds", category: "sports", description: "Line moves, best bets, and steam across major sportsbooks.", cadence: "Real-time", source: "The Odds API", subscribers: 6620, tier: "Pro", popular: true, activated: true },
  { id: "f-scores", name: "Live Scores", category: "sports", description: "Real-time scores and game-changing in-play events.", cadence: "Real-time", source: "ESPN", subscribers: 4400, tier: "Free" },

  // macro
  { id: "f-fed", name: "Fed & Treasury", category: "macro", description: "Fed decisions, Treasury auctions, and daily yields.", cadence: "Daily", source: "FRED", subscribers: 5010, tier: "Free", activated: true },
  { id: "f-cpi", name: "CPI & Jobs", category: "macro", description: "CPI, PCE, and nonfarm payrolls the second they print.", cadence: "Event", source: "BLS", subscribers: 5760, tier: "Free", popular: true },
  { id: "f-yield", name: "Yield Curve", category: "macro", description: "2s10s and recession-watch spreads with inversion alerts.", cadence: "Daily", source: "Treasury", subscribers: 2280, tier: "Pro" },
  { id: "f-energy", name: "Oil & Energy", category: "macro", description: "WTI, Brent, and nat-gas moves with inventory prints.", cadence: "15m", source: "EIA", subscribers: 2640, tier: "Pro" },
  { id: "f-forex", name: "Forex Majors", category: "macro", description: "USD pairs and DXY moves with session highs and lows.", cadence: "5m", source: "OANDA", subscribers: 2090, tier: "Pro" },
  { id: "f-metals", name: "Gold & Silver", category: "macro", description: "Precious-metals spot moves and miner divergence.", cadence: "15m", source: "Metals API", subscribers: 1980, tier: "Free" },

  // real estate
  { id: "f-mortgage", name: "Mortgage Rates", category: "realestate", description: "Daily 30y / 15y rate moves and weekly application volume.", cadence: "Daily", source: "Freddie Mac", subscribers: 2870, tier: "Free", activated: true },
  { id: "f-housing", name: "Housing Market", category: "realestate", description: "Regional price, inventory, and days-on-market shifts.", cadence: "Daily", source: "Redfin", subscribers: 2150, tier: "Pro" },

  // news & sentiment
  { id: "f-news", name: "Market News", category: "news", description: "Market-moving headlines, deduped and tagged by ticker.", cadence: "Real-time", source: "Benzinga", subscribers: 9120, tier: "Free", popular: true, activated: true },
  { id: "f-reddit", name: "Reddit Sentiment", category: "news", description: "Trending tickers and sentiment swings across finance subreddits.", cadence: "15m", source: "Reddit", subscribers: 5380, tier: "Pro", activated: true },
  { id: "f-wiki", name: "Wikipedia Spikes", category: "news", description: "Unusual pageview spikes that front-run attention and volume.", cadence: "Hourly", source: "Wikimedia", subscribers: 1740, tier: "Pro" },

  // government / alt-data
  { id: "f-contracts", name: "Federal Contracts", category: "gov", description: "New federal contract awards and spending by agency and ticker.", cadence: "Daily", source: "USASpending", subscribers: 2520, tier: "Business" },
  { id: "f-analyst", name: "Analyst Moves", category: "gov", description: "Rating changes, price-target revisions, and initiations.", cadence: "15m", source: "Benzinga", subscribers: 4310, tier: "Pro", activated: true },
  { id: "f-jets", name: "CEO Jet Tracker", category: "gov", description: "Corporate-jet movements that hint at deals before they break.", cadence: "Real-time", source: "ADS-B", subscribers: 6890, tier: "Business", popular: true },

  // collectibles
  { id: "f-pokemon", name: "Pokémon TCG", category: "collectibles", description: "Sealed and graded card price moves and grading-pop reports.", cadence: "Hourly", source: "TCGplayer", subscribers: 3260, tier: "Free", popular: true },
  { id: "f-mtg", name: "MTG Singles", category: "collectibles", description: "Magic: The Gathering single-card price spikes and reprints.", cadence: "Hourly", source: "Scryfall", subscribers: 1620, tier: "Pro" },
  { id: "f-gaming", name: "Gaming Deals", category: "collectibles", description: "Steam and console price drops and limited restocks.", cadence: "Hourly", source: "IsThereAnyDeal", subscribers: 2980, tier: "Free" },

  // weather / events
  { id: "f-weather", name: "Event Trading Signals", category: "weather", description: "Severe weather, earthquakes, and catastrophe alerts for event trades.", cadence: "Real-time", source: "NOAA/USGS", subscribers: 2040, tier: "Business" },
] as const;

/* --------------------------------------------------------------- webhooks --- */

export type ChannelHealth = "healthy" | "degraded" | "broken";

export interface GalacticWebhook {
  id: string;
  feed: string; // feed name
  destination: DeliveryChannel;
  channel: string; // target channel / address
  url: string; // (fake) webhook url
  active: boolean;
  health: ChannelHealth;
  deliveredToday: number;
}

export const GALACTIC_WEBHOOKS: readonly GalacticWebhook[] = [
  { id: "w-1", feed: "Top Stock Movers", destination: "Discord", channel: "#movers", url: "https://discord.com/api/webhooks/118264/apex-movers", active: true, health: "healthy", deliveredToday: 412 },
  { id: "w-2", feed: "Crypto Whale Transfers", destination: "Discord", channel: "#whale-watch", url: "https://discord.com/api/webhooks/118264/apex-whales", active: true, health: "healthy", deliveredToday: 287 },
  { id: "w-3", feed: "Unusual Options", destination: "Telegram", channel: "@apex_options", url: "https://api.telegram.org/bot72…/apex-options", active: true, health: "healthy", deliveredToday: 365 },
  { id: "w-4", feed: "Market News", destination: "Discord", channel: "#news-desk", url: "https://discord.com/api/webhooks/118264/apex-news", active: true, health: "healthy", deliveredToday: 1240 },
  { id: "w-5", feed: "Polymarket Swings", destination: "Slack", channel: "#prediction-markets", url: "https://hooks.slack.com/services/T03…/apex-poly", active: true, health: "degraded", deliveredToday: 96 },
  { id: "w-6", feed: "Sports Odds", destination: "Discord", channel: "#sportsbook", url: "https://discord.com/api/webhooks/118264/apex-odds", active: true, health: "healthy", deliveredToday: 540 },
  { id: "w-7", feed: "Congressional Trades", destination: "Email", channel: "desk@apexcapital.io", url: "mailto:desk@apexcapital.io", active: true, health: "healthy", deliveredToday: 22 },
  { id: "w-8", feed: "Analyst Moves", destination: "Discord", channel: "#ratings", url: "https://discord.com/api/webhooks/118264/apex-ratings", active: true, health: "healthy", deliveredToday: 178 },
  { id: "w-9", feed: "Fed & Treasury", destination: "Discord", channel: "#macro", url: "https://discord.com/api/webhooks/118264/apex-macro", active: false, health: "broken", deliveredToday: 0 },
  { id: "w-10", feed: "Reddit Sentiment", destination: "Telegram", channel: "@apex_retail", url: "https://api.telegram.org/bot72…/apex-retail", active: true, health: "healthy", deliveredToday: 134 },
];

/* --------------------------------------------------------------- monitors --- */

export type MonitorStatus = "completed" | "in_progress" | "not_started";

export interface GalacticMonitor {
  id: string;
  name: string;
  slug: string;
  cron: string;
  marketHoursOnly: boolean;
  status: MonitorStatus;
  lastRun: string;
  runCount: number;
  errorCount: number;
}

export const GALACTIC_MONITORS: readonly GalacticMonitor[] = [
  { id: "mo-1", name: "Top Stock Movers", slug: "stock-movers", cron: "*/1 9-16 * * 1-5", marketHoursOnly: true, status: "completed", lastRun: "42s ago", runCount: 18420, errorCount: 3 },
  { id: "mo-2", name: "Crypto Prices", slug: "crypto-prices", cron: "*/1 * * * *", marketHoursOnly: false, status: "completed", lastRun: "12s ago", runCount: 94110, errorCount: 11 },
  { id: "mo-3", name: "Crypto Whale Transfers", slug: "crypto-whale", cron: "*/1 * * * *", marketHoursOnly: false, status: "completed", lastRun: "8s ago", runCount: 88240, errorCount: 0 },
  { id: "mo-4", name: "Unusual Options", slug: "unusual-options", cron: "*/2 9-16 * * 1-5", marketHoursOnly: true, status: "completed", lastRun: "1m ago", runCount: 9870, errorCount: 1 },
  { id: "mo-5", name: "Market News", slug: "market-news", cron: "*/1 * * * *", marketHoursOnly: false, status: "completed", lastRun: "5s ago", runCount: 142300, errorCount: 24 },
  { id: "mo-6", name: "Polymarket Swings", slug: "polymarket", cron: "*/5 * * * *", marketHoursOnly: false, status: "in_progress", lastRun: "now", runCount: 22410, errorCount: 6 },
  { id: "mo-7", name: "Sports Odds", slug: "sports-odds", cron: "*/1 * * * *", marketHoursOnly: false, status: "completed", lastRun: "30s ago", runCount: 51200, errorCount: 9 },
  { id: "mo-8", name: "Fed & Treasury", slug: "fed-treasury", cron: "0 8 * * 1-5", marketHoursOnly: false, status: "not_started", lastRun: "—", runCount: 0, errorCount: 0 },
  { id: "mo-9", name: "CEO Jet Tracker", slug: "ceo-jets", cron: "*/1 * * * *", marketHoursOnly: false, status: "completed", lastRun: "1m ago", runCount: 67430, errorCount: 2 },
  { id: "mo-10", name: "Analyst Moves", slug: "analyst-moves", cron: "*/15 * * * *", marketHoursOnly: false, status: "completed", lastRun: "4m ago", runCount: 12090, errorCount: 0 },
];

/* ----------------------------------------------------------------- alerts --- */
/** A branded alert embed (Discord-style). Drives the live preview + activity. */
export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}
export interface GalacticAlert {
  id: string;
  feed: string;
  icon: string; // emoji shown in the embed title
  title: string;
  color: string; // embed accent
  fields: EmbedField[];
  time: string;
  destination: DeliveryChannel;
}

export const GALACTIC_ALERTS: readonly GalacticAlert[] = [
  {
    id: "al-1", feed: "Crypto Prices", icon: "🪙", title: "Crypto Prices", color: "#F7931A", time: "just now", destination: "Discord",
    fields: [
      { name: "BTC", value: "`$67,840` 🟢 +2.34%", inline: true },
      { name: "ETH", value: "`$3,512` 🟢 +1.87%", inline: true },
      { name: "SOL", value: "`$184.20` 🔴 -0.92%", inline: true },
    ],
  },
  {
    id: "al-2", feed: "Crypto Whale Transfers", icon: "🐋", title: "Whale Transfer Detected", color: "#5865F2", time: "1m ago", destination: "Discord",
    fields: [
      { name: "Amount", value: "`4,200 ETH` ($14.7M)", inline: true },
      { name: "Flow", value: "Binance → Unknown", inline: true },
    ],
  },
  {
    id: "al-3", feed: "Top Stock Movers", icon: "📈", title: "Top Stock Movers", color: "#1DD1A1", time: "2m ago", destination: "Discord",
    fields: [
      { name: "#1 NVDA", value: "▲ +5.23% · $145.67 · Vol 52.3M", inline: false },
      { name: "#2 TSLA", value: "▲ +3.88% · $249.10 · Vol 81.1M", inline: false },
    ],
  },
  {
    id: "al-4", feed: "Unusual Options", icon: "🎯", title: "Unusual Options Sweep", color: "#8B5CF6", time: "4m ago", destination: "Telegram",
    fields: [
      { name: "AAPL", value: "$5.4M sweep · 230C 6/27 · IV 38%", inline: false },
    ],
  },
  {
    id: "al-5", feed: "Polymarket Swings", icon: "🎲", title: "Polymarket Probability Swing", color: "#22D3EE", time: "6m ago", destination: "Slack",
    fields: [
      { name: "Fed cuts in July?", value: "`38% → 51%` (+13pts) · $2.1M vol", inline: false },
    ],
  },
  {
    id: "al-6", feed: "Sports Odds", icon: "🏈", title: "Line Move Alert", color: "#ED4245", time: "9m ago", destination: "Discord",
    fields: [
      { name: "Lakers @ Celtics", value: "BOS -4.5 → -6.0 · 71% tickets", inline: false },
    ],
  },
  {
    id: "al-7", feed: "Market News", icon: "📰", title: "Market-Moving Headline", color: "#3498DB", time: "11m ago", destination: "Discord",
    fields: [
      { name: "$AMZN", value: "Amazon to invest $4B in Anthropic — Reuters", inline: false },
    ],
  },
  {
    id: "al-8", feed: "Congressional Trades", icon: "🏛️", title: "Congressional Disclosure", color: "#57F287", time: "18m ago", destination: "Email",
    fields: [
      { name: "Rep. disclosure", value: "Bought `$250K–$500K` $MSFT", inline: false },
    ],
  },
  {
    id: "al-9", feed: "CEO Jet Tracker", icon: "🛩️", title: "Corporate Jet Movement", color: "#FF9100", time: "24m ago", destination: "Discord",
    fields: [
      { name: "N628TS", value: "Austin → Omaha · dwell 3 days", inline: false },
    ],
  },
  {
    id: "al-10", feed: "Analyst Moves", icon: "⭐", title: "Analyst Rating Change", color: "#1DD1A1", time: "31m ago", destination: "Discord",
    fields: [
      { name: "$META", value: "Morgan Stanley: Overweight · PT $600 (+12%)", inline: false },
    ],
  },
];

/* --------------------------------------------------- monitor builder sample --- */
/** A default embed template + sample payload for the Monitor Builder screen. */
export const GALACTIC_TEMPLATE = {
  feed: "Crypto Whale Transfers",
  title: "🐋 Whale Transfer Detected",
  color: "#5865F2",
  footer: "galacticsignals.com",
  fields: [
    { name: "Amount", value: "{{amount}} ({{usd}})", inline: true },
    { name: "Flow", value: "{{from}} → {{to}}", inline: true },
    { name: "Asset", value: "{{symbol}}", inline: true },
  ] as EmbedField[],
  sample: {
    amount: "4,200 ETH",
    usd: "$14.7M",
    from: "Binance",
    to: "Unknown Wallet",
    symbol: "ETH",
  } as Record<string, string>,
};

/* ------------------------------------------------------------------ plans --- */

export interface GalacticPlan {
  name: string;
  price: number; // monthly USD
  blurb: string;
  features: string[];
  subscribers: number;
  cta: string;
  popular?: boolean;
}

export const GALACTIC_PLANS: readonly GalacticPlan[] = [
  {
    name: "Free",
    price: 0,
    blurb: "Get started with core feeds and one delivery channel.",
    features: ["12 free feeds", "1 webhook channel", "15-minute cadence", "Community support"],
    subscribers: 31_500,
    cta: "Start free",
  },
  {
    name: "Pro",
    price: 29,
    blurb: "Real-time feeds, multi-channel delivery, and custom branding.",
    features: ["All 79 feeds", "10 webhook channels", "Real-time cadence", "Branded embeds", "Priority delivery"],
    subscribers: 12_900,
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Business",
    price: 99,
    blurb: "Unlimited delivery, the Monitor Builder, and the MCP agent stream.",
    features: ["Unlimited channels", "Monitor Builder", "Embed Visualizer", "MCP / agent feed access", "SLA + dedicated support"],
    subscribers: 3_400,
    cta: "Contact sales",
  },
];

/* -------------------------------------------------------------- admin users --- */
/** A populated users table for the admin surface (the "lots of people" view). */
export interface GalacticUser {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: "USER" | "ADMIN";
  plan: FeedTier;
  community: string;
  channels: number;
  joined: string;
  status: "active" | "trialing" | "churned";
}

export const GALACTIC_USERS: readonly GalacticUser[] = [
  { id: "u-1", name: "Marcus Chen", handle: "mchen", email: "marcus@apexcapital.io", role: "ADMIN", plan: "Business", community: "Apex Capital", channels: 9, joined: "Mar 2025", status: "active" },
  { id: "u-2", name: "Sofia Reyes", handle: "sreyes", email: "sofia@genesiscouncil.gg", role: "USER", plan: "Pro", community: "Genesis Council", channels: 6, joined: "Apr 2025", status: "active" },
  { id: "u-3", name: "Dev Patel", handle: "dpatel", email: "dev@quantlab.dev", role: "USER", plan: "Pro", community: "Quant Lab", channels: 4, joined: "Apr 2025", status: "active" },
  { id: "u-4", name: "Hana Kim", handle: "hkim", email: "hana@retailradar.co", role: "USER", plan: "Free", community: "Retail Radar", channels: 1, joined: "May 2025", status: "trialing" },
  { id: "u-5", name: "Liam O'Brien", handle: "lobrien", email: "liam@northwind.desk", role: "ADMIN", plan: "Business", community: "Northwind Desk", channels: 12, joined: "Jan 2025", status: "active" },
  { id: "u-6", name: "Aaliyah Brooks", handle: "abrooks", email: "aaliyah@deltasignals.io", role: "USER", plan: "Pro", community: "Delta Signals", channels: 5, joined: "May 2025", status: "active" },
  { id: "u-7", name: "Noah Schmidt", handle: "nschmidt", email: "noah@cryptocorner.gg", role: "USER", plan: "Free", community: "Crypto Corner", channels: 2, joined: "Jun 2025", status: "trialing" },
  { id: "u-8", name: "Priya Nair", handle: "pnair", email: "priya@vegatraders.com", role: "USER", plan: "Pro", community: "Vega Traders", channels: 7, joined: "Feb 2025", status: "active" },
  { id: "u-9", name: "Diego Santos", handle: "dsantos", email: "diego@helixgroup.io", role: "USER", plan: "Business", community: "Helix Group", channels: 11, joined: "Dec 2024", status: "active" },
  { id: "u-10", name: "Emma Wilson", handle: "ewilson", email: "emma@sidelinebets.co", role: "USER", plan: "Free", community: "Sideline Bets", channels: 1, joined: "Jun 2025", status: "churned" },
];

/* ------------------------------------------------------------- landing copy --- */

export const GALACTIC_PAIN_POINTS = [
  { title: "Expensive tools", body: "Bloomberg-grade monitoring runs $100–300/mo per vertical. Most retail traders are priced out." },
  { title: "Information overload", body: "Alpha is scattered across 80+ APIs and a dozen dashboards. Nobody watches them all." },
  { title: "Always a step behind", body: "By the time you refresh a tab, the move is gone. Manual monitoring does not scale." },
] as const;

export const GALACTIC_STEPS = [
  { n: 1, title: "Activate feeds", body: "Pick from 79 feeds across 10 verticals in the store. One click each." },
  { n: 2, title: "Paste a webhook", body: "Drop in a Discord, Slack, Telegram, or email endpoint. ~30 seconds." },
  { n: 3, title: "Receive branded alerts", body: "Real-time embeds, fanned out behind a rate limiter tuned to each platform." },
] as const;

/** Hero / case-study aligned facts. No revenue or audited-metric claims. */
export const GALACTIC_FACTS = [
  { value: "79", label: "async feeds" },
  { value: "10", label: "verticals" },
  { value: "30s", label: "to set up" },
  { value: "$35–40B", label: "TAM" },
] as const;
