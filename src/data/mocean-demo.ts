/**
 * mocean-demo.ts - dummy data for the Mocean interactive demo at
 * /app/mocean-demo. Mocean (2021-2023) was a Discord-native B2B research SaaS:
 * a customer (a research community / "business") subscribed to data PRODUCTS
 * (feeds), then wired each MONITOR to a Discord channel via webhook to deliver
 * alpha automatically. Data model: business -> products -> monitors -> webhook.
 *
 * Everything here is illustrative fake data for a non-functional showcase.
 * Marketing figures match the public /ventures/mocean case study. No invented
 * revenue/profit claims.
 */

export interface MoceanProduct {
  id: string;
  name: string;
  category: "On-chain" | "NFT" | "Research" | "Utility";
  description: string;
  price: number; // monthly USD
  feeds: number; // number of distinct alert feeds bundled
  popular?: boolean;
}

export interface MoceanMonitor {
  id: string;
  product: string;
  channel: string; // Discord channel the alerts post to
  webhook: string; // (fake) Discord webhook URL
  cadence: "Real-time" | "Hourly" | "Daily";
  enabled: boolean;
}

export interface MoceanActiveProduct {
  id: string;
  name: string;
  category: MoceanProduct["category"];
  status: "Active" | "Paused";
  members: number; // subscribers in the community receiving it
  monitorsLive: number;
  renews: string;
}

export interface MoceanInvoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  items: number;
  status: "Paid" | "Due";
}

export interface MoceanAnnouncement {
  id: string;
  title: string;
  body: string;
  date: string;
  tag: "New" | "Update" | "Notice";
}

export interface MoceanStat {
  value: string;
  label: string;
}

/** The signed-in customer (a research community using Mocean). */
export const MOCEAN_BUSINESS = {
  name: "Apex Alpha",
  handle: "apex-alpha",
  plan: "Scale",
  discord: "Apex Alpha DAO",
  members: 5170,
  owner: "matthewoshin",
  joined: "Jan 2022",
} as const;

/** Landing marketing stats, aligned to the public case study. */
export const MOCEAN_STATS: readonly MoceanStat[] = [
  { value: "100,000+", label: "Members reached" },
  { value: "1,000+", label: "Investor communities" },
  { value: "40+", label: "Full-time analysts" },
  { value: "Acquired", label: "May 2023" },
] as const;

/** Landing feature blurbs (from the original Info section). */
export const MOCEAN_FEATURES = [
  { title: "News & Macro Trends", body: "Keep up with the headlines and market structure shifts you need to know." },
  { title: "In-Depth Release Guides", body: "Step-by-step drop guides so your community never misses a profitable mint." },
  { title: "Project Analysis", body: "Diligence and ratings on new projects so members make informed calls." },
  { title: "Whitelist Opportunities", body: "Curated allowlist windows and entry points, surfaced the moment they open." },
  { title: "Educational Content", body: "Onboarding and explainers that turn new members into confident traders." },
  { title: "Smart-Money Flow", body: "Track curated alpha wallets and mirror their entries in real time." },
] as const;

export const MOCEAN_REVIEWS = [
  {
    quote:
      "The Mocean team are valuable and consistent characters in our emerging space. The information they deliver radiates reliability and accuracy.",
    name: "banksy",
    role: "Head of Administration, Notify",
  },
  {
    quote:
      "Love the team's responsiveness and dedication. Great flips and calls, and great options for any customer. They work with us on any update or question.",
    name: "Chris Mafia",
    role: "Owner, House of Carts",
  },
  {
    quote:
      "Plugging Mocean into our server was thirty seconds of work and instantly leveled up what we deliver to members. The branded alerts look like ours.",
    name: "0xMaria",
    role: "Founder, Genesis Council",
  },
] as const;

export const MOCEAN_PRODUCTS: readonly MoceanProduct[] = [
  {
    id: "p-smart-money",
    name: "Smart-Money Flow",
    category: "On-chain",
    description: "Track a curated set of alpha wallets and copy their entries and exits in real time across ETH and SOL.",
    price: 199,
    feeds: 4,
    popular: true,
  },
  {
    id: "p-whales",
    name: "Whale Movements",
    category: "On-chain",
    description: "Large wallet transfers, CEX in/outflows, and unusual accumulation, the moment they hit the chain.",
    price: 149,
    feeds: 3,
  },
  {
    id: "p-mint",
    name: "NFT Mint Monitor",
    category: "NFT",
    description: "New collection mints, whitelist windows, and reveal alerts before they trend.",
    price: 99,
    feeds: 3,
  },
  {
    id: "p-floor",
    name: "Floor Sweeps",
    category: "NFT",
    description: "Real-time floor sweeps and listing velocity on blue-chip collections.",
    price: 99,
    feeds: 2,
  },
  {
    id: "p-unlocks",
    name: "Token Unlocks",
    category: "On-chain",
    description: "Upcoming vesting cliffs and unlock schedules so members front-run the supply.",
    price: 89,
    feeds: 1,
  },
  {
    id: "p-guides",
    name: "Release Guides",
    category: "Research",
    description: "Curated drop calendars and analyst-written release guides, delivered daily.",
    price: 79,
    feeds: 2,
  },
  {
    id: "p-macro",
    name: "Macro & News",
    category: "Research",
    description: "Crypto macro trends, regulatory headlines, and market-moving news, hourly.",
    price: 59,
    feeds: 2,
  },
  {
    id: "p-gas",
    name: "Gas Tracker",
    category: "Utility",
    description: "Live gas, mempool congestion, and the optimal windows to mint.",
    price: 39,
    feeds: 1,
  },
];

export const MOCEAN_MONITORS: readonly MoceanMonitor[] = [
  { id: "m-1", product: "Smart-Money Flow", channel: "#alpha-wallets", webhook: "https://discord.com/api/webhooks/10846/apex-alpha-smartmoney", cadence: "Real-time", enabled: true },
  { id: "m-2", product: "Whale Movements", channel: "#whale-alerts", webhook: "https://discord.com/api/webhooks/10846/apex-alpha-whales", cadence: "Real-time", enabled: true },
  { id: "m-3", product: "NFT Mint Monitor", channel: "#mint-radar", webhook: "https://discord.com/api/webhooks/10846/apex-alpha-mints", cadence: "Real-time", enabled: true },
  { id: "m-4", product: "Floor Sweeps", channel: "#floor-watch", webhook: "https://discord.com/api/webhooks/10846/apex-alpha-floor", cadence: "Real-time", enabled: true },
  { id: "m-5", product: "Release Guides", channel: "#drops", webhook: "https://discord.com/api/webhooks/10846/apex-alpha-drops", cadence: "Daily", enabled: true },
  { id: "m-6", product: "Macro & News", channel: "#news-desk", webhook: "", cadence: "Hourly", enabled: false },
];

export const MOCEAN_ACTIVE_PRODUCTS: readonly MoceanActiveProduct[] = [
  { id: "a-1", name: "Smart-Money Flow", category: "On-chain", status: "Active", members: 920, monitorsLive: 1, renews: "Jul 22" },
  { id: "a-2", name: "Whale Movements", category: "On-chain", status: "Active", members: 2400, monitorsLive: 1, renews: "Jul 14" },
  { id: "a-3", name: "NFT Mint Monitor", category: "NFT", status: "Active", members: 1850, monitorsLive: 1, renews: "Jul 9" },
  { id: "a-4", name: "Floor Sweeps", category: "NFT", status: "Active", members: 1850, monitorsLive: 1, renews: "Jul 9" },
  { id: "a-5", name: "Release Guides", category: "Research", status: "Active", members: 3100, monitorsLive: 1, renews: "Jul 2" },
  { id: "a-6", name: "Macro & News", category: "Research", status: "Paused", members: 0, monitorsLive: 0, renews: "—" },
];

export const MOCEAN_INVOICES: readonly MoceanInvoice[] = [
  { id: "i-1", number: "INV-2041", date: "Jun 1, 2023", amount: 525, items: 5, status: "Paid" },
  { id: "i-2", number: "INV-1998", date: "May 1, 2023", amount: 525, items: 5, status: "Paid" },
  { id: "i-3", number: "INV-1955", date: "Apr 1, 2023", amount: 426, items: 4, status: "Paid" },
  { id: "i-4", number: "INV-1912", date: "Mar 1, 2023", amount: 386, items: 4, status: "Paid" },
  { id: "i-5", number: "INV-1869", date: "Feb 1, 2023", amount: 287, items: 3, status: "Paid" },
  { id: "i-6", number: "INV-1826", date: "Jan 1, 2023", amount: 287, items: 3, status: "Paid" },
];

/** Monthly spend series for the Invoices chart (oldest to newest). */
export const MOCEAN_SPEND: readonly { month: string; amount: number }[] = [
  { month: "Jan", amount: 287 },
  { month: "Feb", amount: 287 },
  { month: "Mar", amount: 386 },
  { month: "Apr", amount: 426 },
  { month: "May", amount: 525 },
  { month: "Jun", amount: 525 },
];

export const MOCEAN_ANNOUNCEMENTS: readonly MoceanAnnouncement[] = [
  { id: "an-1", title: "Whale Movements v2 is live", body: "Added Solana coverage and CEX in/outflow tagging to every whale alert.", date: "Jun 12, 2023", tag: "Update" },
  { id: "an-2", title: "New feed: Token Unlocks", body: "Track upcoming vesting cliffs and unlock schedules across 200+ tokens.", date: "Jun 3, 2023", tag: "New" },
  { id: "an-3", title: "Scheduled maintenance", body: "Webhook delivery will pause briefly Sunday 3-4am ET for an infrastructure upgrade.", date: "May 28, 2023", tag: "Notice" },
];
