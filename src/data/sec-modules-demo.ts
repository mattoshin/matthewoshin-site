/**
 * sec-modules-demo.ts - the heavier per-module sample data for the SEC
 * Intelligence demo: the filing feed (with AI reads), insider and ownership
 * surveillance, the alert inbox and channel-routing rules, the AI analyst threads
 * and theme tracker, and the admin/lab data. All fictional and illustrative.
 */

import type { FormType, Severity, Sentiment, Channel, ChannelRow } from "@/components/demos/sec/SecKit";

/* -------------------------------------------------------------- filing feed --- */

export type SecFiling = {
  id: string;
  ticker: string;
  company: string;
  form: FormType;
  /** 8-K item code or sub-type, when relevant. */
  item?: string;
  title: string;
  filedAt: string;
  severity: Severity;
  sentiment: Sentiment;
  /** The AI "why it matters" read. */
  summary: string;
  /** AI-pulled key extracts from the filing. */
  extracts: string[];
  /** What changed vs the prior comparable filing. */
  priorDiff?: string;
  /** Affected positions / client exposure note. */
  affected?: string;
  pages: number;
  inWatchlist: boolean;
};

export const SEC_FILINGS: readonly SecFiling[] = [
  {
    id: "f-atlx-8k",
    ticker: "ATLX",
    company: "Atlas Semiconductors",
    form: "8-K",
    item: "Item 5.02",
    title: "CFO transition: Maran steps down, interim named",
    filedAt: "2m",
    severity: "material",
    sentiment: "bearish",
    summary:
      "Atlas disclosed the abrupt departure of CFO E. Maran effective immediately, with the controller named interim. A CFO exit four days before the 10-Q, with no successor lined up, is a governance and continuity flag worth a proactive client call.",
    extracts: [
      "CFO E. Maran resigned effective immediately; no separation-for-cause language.",
      "Controller D. Hsu appointed interim CFO while the board runs a search.",
      "Filing reaffirms prior quarterly guidance, which partially offsets the headline.",
    ],
    priorDiff: "No prior officer changes in the last eight quarters. The reaffirmed guidance language is new versus the typical 5.02.",
    affected: "Held by Harborview (11%), Maple Ridge, and Aster. ATLX is your largest watchlist weight.",
    pages: 4,
    inWatchlist: true,
  },
  {
    id: "f-crvn-8k",
    ticker: "CRVN",
    company: "Carven Pharma",
    form: "8-K",
    item: "Item 8.01",
    title: "Positive Phase III readout for lead oncology asset",
    filedAt: "9m",
    severity: "material",
    sentiment: "bullish",
    summary:
      "Carven reported the Phase III CRV-201 trial met its primary endpoint with statistical significance. This is the de-risking event the Street was waiting on; a filing-to-fill on the registration path likely follows.",
    extracts: [
      "Primary endpoint met (p<0.001); safety profile consistent with Phase II.",
      "Management to request a pre-BLA meeting with the FDA next quarter.",
      "No financing announced in this filing, watch for a follow-on S-1 or 424B.",
    ],
    priorDiff: "Upgrades the prior 'data expected mid-year' 8-K to a confirmed positive readout.",
    affected: "Held by Delgado (high biotech beta) and Harborview. RDWD is a read-through peer.",
    pages: 3,
    inWatchlist: true,
  },
  {
    id: "f-cmbk-4-cluster",
    ticker: "CMBK",
    company: "Cambria Bancorp",
    form: "Form 4",
    title: "Cluster insider buying: CEO + two directors",
    filedAt: "27m",
    severity: "notable",
    sentiment: "bullish",
    summary:
      "Three insiders, including the CEO, filed Form 4 open-market purchases within 24 hours, totaling roughly $1.4M. Cluster buying after a 9% drawdown is a constructive ownership signal for an income-mandate holder.",
    extracts: [
      "CEO bought 12,000 shares at ~$47.6, the largest open-market buy in two years.",
      "Two independent directors added on the same window.",
      "All coded 'P' (open-market purchase), not option exercises.",
    ],
    affected: "Held by the Brennan Trust (income mandate) and Continental Pension.",
    pages: 2,
    inWatchlist: true,
  },
  {
    id: "f-pyln-10q",
    ticker: "PYLN",
    company: "Pylon Data",
    form: "10-Q",
    title: "Q2 10-Q: AI-attach revenue mix raised",
    filedAt: "43m",
    severity: "notable",
    sentiment: "bullish",
    summary:
      "Pylon's 10-Q shows net revenue retention stabilizing at 121% and a new disclosure breaking out AI-attach revenue at 18% of the mix, up from an unquantified mention last quarter. The MD&A leans harder into AI as a growth driver.",
    extracts: [
      "NRR 121% vs 118% prior quarter.",
      "New line item: AI-attach revenue 18% of total, first time quantified.",
      "Operating margin +180bps on lower S&M intensity.",
    ],
    priorDiff: "The AI-attach revenue line is a new disclosure versus the Q1 10-Q.",
    affected: "Held by Aster and the Harborview office.",
    pages: 58,
    inWatchlist: true,
  },
  {
    id: "f-rdwd-8k",
    ticker: "RDWD",
    company: "Redwood Biosciences",
    form: "8-K",
    item: "Item 7.01",
    title: "Regulation FD: interim trial data disclosed",
    filedAt: "1h",
    severity: "notable",
    sentiment: "bullish",
    summary:
      "Redwood posted an investor deck under Reg FD with interim data trending positive. Read-through to Carven's confirmed readout is supportive, but interim is not a primary-endpoint result; treat as momentum, not de-risking.",
    extracts: [
      "Interim response rate ahead of the protocol-defined bar.",
      "Full data event still expected next quarter.",
      "No change to cash runway guidance.",
    ],
    affected: "Held by Delgado. Peer read-through from CRVN.",
    pages: 22,
    inWatchlist: true,
  },
  {
    id: "f-lmnr-10q",
    ticker: "LMNR",
    company: "Luminar Retail",
    form: "10-Q",
    title: "Q2 10-Q filed ahead of schedule",
    filedAt: "1h",
    severity: "routine",
    sentiment: "neutral",
    summary:
      "Luminar's 10-Q is in line: comps +4.1%, inventory normalized, no guidance change. Filed two days early. Nothing here demands action, but the early file removes a near-term overhang.",
    extracts: [
      "Same-store sales +4.1%, in line with consensus.",
      "Inventory days back to pre-2024 baseline.",
      "Reaffirmed full-year guidance.",
    ],
    affected: "Held by Aster and Delgado.",
    pages: 47,
    inWatchlist: true,
  },
  {
    id: "f-orbt-8k",
    ticker: "ORBT",
    company: "Orbital Defense",
    form: "8-K",
    item: "Item 1.01",
    title: "Material definitive agreement: multi-year award",
    filedAt: "2h",
    severity: "notable",
    sentiment: "bullish",
    summary:
      "Orbital entered a multi-year supply agreement disclosed under Item 1.01. Backlog-positive and recurring in nature; the contract value is within the range the Street already modeled, so it confirms rather than surprises.",
    extracts: [
      "Multi-year award, framed as recurring revenue.",
      "Value consistent with prior bookings commentary.",
      "No customer concentration disclosure change.",
    ],
    affected: "Held by Maple Ridge Endowment and Harborview.",
    pages: 6,
    inWatchlist: true,
  },
  {
    id: "f-cmbk-def14a",
    ticker: "CMBK",
    company: "Cambria Bancorp",
    form: "DEF 14A",
    title: "Proxy statement: say-on-pay and board slate",
    filedAt: "2h",
    severity: "routine",
    sentiment: "neutral",
    summary:
      "Cambria filed its annual proxy. Standard say-on-pay, uncontested board slate, and a modest equity-plan share increase. Low drama, but the dividend-policy language matters for the income mandate in the Brennan Trust.",
    extracts: [
      "Uncontested 9-member board slate.",
      "Equity plan share reserve +1.5M.",
      "Dividend-policy language reaffirmed.",
    ],
    affected: "Brennan Trust (income), Continental Pension.",
    pages: 84,
    inWatchlist: true,
  },
  {
    id: "f-nwav-8k",
    ticker: "NWAV",
    company: "Newave Energy",
    form: "8-K",
    item: "Item 2.02",
    title: "Results of operations: prelim quarterly update",
    filedAt: "3h",
    severity: "routine",
    sentiment: "neutral",
    summary:
      "Newave pre-announced quarterly metrics roughly in line. Capacity additions on track, tax-credit recognition timing unchanged. A maintenance update, no action required.",
    extracts: ["Capacity additions on plan.", "Tax-credit timing unchanged.", "No guidance revision."],
    affected: "Brennan Trust.",
    pages: 5,
    inWatchlist: true,
  },
  {
    id: "f-grve-4",
    ticker: "GRVE",
    company: "Grove Markets",
    form: "Form 4",
    title: "Routine 10b5-1 sale by EVP",
    filedAt: "4h",
    severity: "routine",
    sentiment: "neutral",
    summary:
      "An EVP sold shares under a pre-arranged 10b5-1 plan. Scheduled, not discretionary, so it carries little signal. Flagged only because it is on a watchlist name.",
    extracts: ["Coded 'S' under a 10b5-1 plan adopted 6 months ago.", "Small relative to holdings."],
    affected: "Continental Pension.",
    pages: 1,
    inWatchlist: true,
  },
  {
    id: "f-hlog-8k",
    ticker: "HLOG",
    company: "Helios Logistics",
    form: "8-K",
    item: "Item 5.02",
    title: "Board appointment: new independent director",
    filedAt: "5h",
    severity: "routine",
    sentiment: "neutral",
    summary:
      "Helios added an independent director with supply-chain operating experience. Governance-positive, no strategic read-through.",
    extracts: ["New independent director, operating background.", "No committee chair changes."],
    affected: "Maple Ridge Endowment.",
    pages: 3,
    inWatchlist: true,
  },
  {
    id: "f-vextra-s1",
    ticker: "VXRA",
    company: "Vextra Robotics",
    form: "S-1",
    title: "S-1 filed: robotics IPO, off your watchlist",
    filedAt: "6h",
    severity: "routine",
    sentiment: "neutral",
    summary:
      "A robotics company filed to go public. Off your watchlist but a sector read-through for Atlas and Orbital: heavy AI-compute disclosure in the risk factors. Tagged for the AI theme tracker.",
    extracts: ["First-time S-1, robotics + AI compute.", "Risk factors lean on AI-chip supply.", "No terms yet."],
    affected: "Watchlist read-through to ATLX, ORBT.",
    pages: 212,
    inWatchlist: false,
  },
  {
    id: "f-atlx-13d",
    ticker: "ATLX",
    company: "Atlas Semiconductors",
    form: "13D",
    title: "13D: activist discloses 5.4% stake",
    filedAt: "yesterday",
    severity: "notable",
    sentiment: "neutral",
    summary:
      "An activist fund disclosed a 5.4% stake with a letter pressing for capital-return discipline. Combined with today's CFO exit, governance is now the live story on Atlas. Worth getting ahead of with concentrated holders.",
    extracts: [
      "Meridian Partners disclosed 5.4%, crossing the 5% threshold.",
      "Letter requests a buyback and board refresh.",
      "Filed one day before the CFO transition 8-K.",
    ],
    affected: "Harborview (11% position), Maple Ridge, Aster.",
    pages: 14,
    inWatchlist: true,
  },
  {
    id: "f-pyln-4",
    ticker: "PYLN",
    company: "Pylon Data",
    form: "Form 4",
    title: "Director open-market purchase",
    filedAt: "yesterday",
    severity: "routine",
    sentiment: "bullish",
    summary: "A director bought on the open market after the recent pullback. Small but directionally positive insider signal alongside the strong 10-Q.",
    extracts: ["Coded 'P', open-market purchase.", "Follows a 7% two-week drawdown."],
    affected: "Aster, Harborview.",
    pages: 1,
    inWatchlist: true,
  },
  {
    id: "f-grve-13g",
    ticker: "GRVE",
    company: "Grove Markets",
    form: "13G",
    title: "13G: passive manager crosses 5%",
    filedAt: "yesterday",
    severity: "routine",
    sentiment: "neutral",
    summary: "A passive index manager crossed 5% via a 13G. Passive, not activist, so it is a flow note rather than a governance event.",
    extracts: ["13G (passive intent).", "Crossed 5.1%."],
    affected: "Continental Pension.",
    pages: 8,
    inWatchlist: true,
  },
  {
    id: "f-orbt-424b",
    ticker: "ORBT",
    company: "Orbital Defense",
    form: "424B",
    title: "424B5: shelf takedown, senior notes",
    filedAt: "yesterday",
    severity: "routine",
    sentiment: "neutral",
    summary: "Orbital priced senior notes off its shelf to term out maturities. Refinancing, leverage-neutral, no equity dilution. Informational for fixed-income-aware clients.",
    extracts: ["Senior notes, used to refinance near-term maturities.", "No equity component.", "Leverage roughly neutral."],
    affected: "Maple Ridge Endowment.",
    pages: 11,
    inWatchlist: true,
  },
] as const;

/** Form-type filters for the feed. */
export const FILING_FORM_FILTERS: readonly (FormType | "All")[] = [
  "All",
  "8-K",
  "10-Q",
  "10-K",
  "Form 4",
  "13D",
  "13G",
  "13F",
  "S-1",
  "424B",
  "DEF 14A",
];

/* -------------------------------------------------------- insider & 13F --- */

export type InsiderTxn = {
  id: string;
  ticker: string;
  insider: string;
  role: string;
  action: "Buy" | "Sell";
  shares: string;
  value: string;
  price: number;
  filedAt: string;
  plan: "Open market" | "10b5-1" | "Option exercise";
  note?: string;
};

export const INSIDER_TXNS: readonly InsiderTxn[] = [
  { id: "i1", ticker: "CMBK", insider: "R. Calloway", role: "CEO", action: "Buy", shares: "12,000", value: "$571K", price: 47.6, filedAt: "27m", plan: "Open market", note: "Largest CEO buy in 2 years" },
  { id: "i2", ticker: "CMBK", insider: "P. Ndiaye", role: "Director", action: "Buy", shares: "5,000", value: "$238K", price: 47.5, filedAt: "31m", plan: "Open market", note: "Same-window cluster" },
  { id: "i3", ticker: "CMBK", insider: "S. Whitlock", role: "Director", action: "Buy", shares: "4,200", value: "$200K", price: 47.55, filedAt: "44m", plan: "Open market", note: "Same-window cluster" },
  { id: "i4", ticker: "PYLN", insider: "M. Oyelaran", role: "Director", action: "Buy", shares: "3,000", value: "$288K", price: 96.0, filedAt: "yesterday", plan: "Open market" },
  { id: "i5", ticker: "RDWD", insider: "T. Voss", role: "CSO", action: "Buy", shares: "8,000", value: "$330K", price: 41.2, filedAt: "yesterday", plan: "Open market", note: "Ahead of the data event" },
  { id: "i6", ticker: "GRVE", insider: "L. Bauer", role: "EVP", action: "Sell", shares: "6,500", value: "$476K", price: 73.2, filedAt: "4h", plan: "10b5-1", note: "Scheduled, low signal" },
  { id: "i7", ticker: "ATLX", insider: "E. Maran", role: "Former CFO", action: "Sell", shares: "9,400", value: "$2.05M", price: 218.0, filedAt: "3m", plan: "Open market", note: "Filed with the 5.02 departure" },
  { id: "i8", ticker: "LMNR", insider: "K. Park", role: "COO", action: "Buy", shares: "10,000", value: "$286K", price: 28.6, filedAt: "2h", plan: "Open market" },
];

export type OwnershipMove = {
  id: string;
  institution: string;
  ticker: string;
  action: "New" | "Add" | "Trim" | "Exit";
  shares: string;
  changePct: number;
  value: string;
  quarter: string;
};

export const OWNERSHIP_MOVES: readonly OwnershipMove[] = [
  { id: "o1", institution: "Meridian Partners", ticker: "ATLX", action: "New", shares: "2.9M", changePct: 100, value: "$634M", quarter: "Q2 (13D)" },
  { id: "o2", institution: "Granite Capital", ticker: "PYLN", action: "Add", shares: "1.2M", changePct: 34, value: "$115M", quarter: "Q2" },
  { id: "o3", institution: "Northbridge Advisors", ticker: "CRVN", action: "Add", shares: "880K", changePct: 22, value: "$54M", quarter: "Q2" },
  { id: "o4", institution: "Sterling Index Fund", ticker: "GRVE", action: "New", shares: "3.4M", changePct: 100, value: "$249M", quarter: "Q2 (13G)" },
  { id: "o5", institution: "Halcyon Asset Mgmt", ticker: "CMBK", action: "Trim", shares: "-410K", changePct: -18, value: "$19M", quarter: "Q2" },
  { id: "o6", institution: "Cobalt Pension", ticker: "ORBT", action: "Exit", shares: "-1.1M", changePct: -100, value: "$168M", quarter: "Q2" },
  { id: "o7", institution: "Greenline Capital", ticker: "RDWD", action: "Add", shares: "640K", changePct: 41, value: "$26M", quarter: "Q2" },
];

export type ActivismSignal = {
  ticker: string;
  fund: string;
  stakePct: number;
  ask: string;
  intensity: "Watch" | "Engaging" | "Campaign";
};

export const ACTIVISM_SIGNALS: readonly ActivismSignal[] = [
  { ticker: "ATLX", fund: "Meridian Partners", stakePct: 5.4, ask: "Buyback + board refresh", intensity: "Campaign" },
  { ticker: "CMBK", fund: "Pinecrest Value", stakePct: 3.1, ask: "Cost-efficiency review", intensity: "Engaging" },
  { ticker: "HLOG", fund: "Tidewater Capital", stakePct: 2.4, ask: "Network optimization", intensity: "Watch" },
];

/* --------------------------------------------------------- alert center --- */

export type SecAlert = {
  id: string;
  ticker: string;
  type: string;
  title: string;
  body: string;
  severity: Severity;
  delivered: Channel[];
  time: string;
  read: boolean;
};

export const SEC_ALERTS: readonly SecAlert[] = [
  { id: "a1", ticker: "ATLX", type: "Material 8-K", title: "ATLX 8-K Item 5.02 - CFO departure", body: "Routed to all channels. Phone call placed to you; client distro emailed for Harborview.", severity: "material", delivered: ["email", "sms", "phone", "push", "agent"], time: "2m", read: false },
  { id: "a2", ticker: "CRVN", type: "Material 8-K", title: "CRVN Phase III primary endpoint met", body: "Material event. SMS + push sent; structured event posted to your research agent.", severity: "material", delivered: ["email", "sms", "push", "agent"], time: "9m", read: false },
  { id: "a3", ticker: "CMBK", type: "Insider cluster", title: "CMBK cluster insider buying detected", body: "Three Form 4 buys in 24h, including the CEO. Email + push delivered.", severity: "notable", delivered: ["email", "push", "agent"], time: "44m", read: false },
  { id: "a4", ticker: "PYLN", type: "Periodic report", title: "PYLN 10-Q filed, AI-attach revenue up", body: "Digest alert. Emailed and pushed; full read in the feed.", severity: "notable", delivered: ["email", "push", "agent"], time: "43m", read: true },
  { id: "a5", ticker: "ATLX", type: "Ownership", title: "ATLX 13D - activist 5.4% stake", body: "Notable ownership event. Emailed; posted to agent for the governance workflow.", severity: "notable", delivered: ["email", "agent"], time: "1d", read: true },
  { id: "a6", ticker: "LMNR", type: "Periodic report", title: "LMNR 10-Q filed (in line)", body: "Routine digest. Email only.", severity: "routine", delivered: ["email"], time: "1h", read: true },
];

/** Alert-type rows for the channel router. */
export const CHANNEL_ROWS: readonly ChannelRow[] = [
  { id: "material", label: "Material 8-K", hint: "Item 1.01, 2.02, 5.02, restatements" },
  { id: "periodic", label: "Periodic reports", hint: "10-K and 10-Q" },
  { id: "insider", label: "Insider activity", hint: "Form 4 cluster buys and sells" },
  { id: "ownership", label: "Ownership & activism", hint: "13D / 13G / 13F" },
  { id: "offering", label: "Capital markets", hint: "S-1, 424B, shelf takedowns" },
  { id: "governance", label: "Governance & proxy", hint: "DEF 14A, votes" },
];

/** Default channel matrix: which channels are on per alert type. The material row
 *  fires everywhere including a phone call; routine governance is email-only. */
export const DEFAULT_CHANNEL_MATRIX: Record<string, Channel[]> = {
  material: ["email", "sms", "phone", "push", "agent"],
  periodic: ["email", "push", "agent"],
  insider: ["email", "push", "agent"],
  ownership: ["email", "sms", "push", "agent"],
  offering: ["email", "agent"],
  governance: ["email"],
};

export type AlertRule = {
  id: string;
  name: string;
  scope: string;
  trigger: string;
  channels: Channel[];
  enabled: boolean;
  lastFired: string;
};

export const ALERT_RULES: readonly AlertRule[] = [
  { id: "r1", name: "Call me on any material 8-K", scope: "Whole watchlist", trigger: "Form 8-K with Item 1.02 / 2.02 / 5.02 and AI materiality = material", channels: ["phone", "sms", "push", "agent"], enabled: true, lastFired: "2m ago" },
  { id: "r2", name: "Concentrated-position events", scope: "Clients > 8% in one name", trigger: "Any material filing on an over-weighted client holding", channels: ["email", "phone"], enabled: true, lastFired: "2m ago" },
  { id: "r3", name: "Insider cluster buying", scope: "Whole watchlist", trigger: "3+ Form 4 open-market buys on one name within 48h", channels: ["email", "push", "agent"], enabled: true, lastFired: "44m ago" },
  { id: "r4", name: "Activist stake crosses 5%", scope: "Whole watchlist", trigger: "New 13D filed", channels: ["email", "sms", "agent"], enabled: true, lastFired: "1d ago" },
  { id: "r5", name: "Feed my research agent everything", scope: "Whole watchlist", trigger: "Any filing, structured event over webhook / MCP", channels: ["agent"], enabled: true, lastFired: "2m ago" },
  { id: "r6", name: "Pre-earnings 10-Q digest", scope: "Whole watchlist", trigger: "10-Q or 10-K filed, batched into a daily digest", channels: ["email"], enabled: false, lastFired: "never" },
];

/* ----------------------------------------------------------- AI analyst --- */

export const AI_PROMPTS: readonly string[] = [
  "What changed in Atlas's 8-K and what should I tell Harborview?",
  "Which of my names disclosed new AI exposure this quarter?",
  "Summarize all material filings on my book today.",
  "Is the Carven readout a buy signal or already priced in?",
  "Show insider cluster buying across my watchlist.",
];

export type AIThread = {
  id: string;
  question: string;
  answer: string[];
  sources: { ticker: string; form: FormType; ref: string }[];
};

export const AI_THREADS: readonly AIThread[] = [
  {
    id: "t1",
    question: "Summarize the material filings on my book today and who is exposed.",
    answer: [
      "Two filings cleared the materiality bar today.",
      "Atlas Semiconductors (ATLX) filed an 8-K, Item 5.02: the CFO departed effective immediately with no named successor, four days before the 10-Q. Guidance was reaffirmed, which softens it, but combined with yesterday's activist 13D, governance is now the live story. Harborview is your most exposed client at an 11% weight.",
      "Carven Pharma (CRVN) filed an 8-K, Item 8.01: the Phase III lead met its primary endpoint with p<0.001. This is a de-risking event, not yet priced for a registration path. Delgado holds it with high biotech beta; Redwood is a read-through peer.",
      "Recommended actions: a proactive call to Harborview on Atlas governance, and a note to Delgado framing the Carven readout against position size.",
    ],
    sources: [
      { ticker: "ATLX", form: "8-K", ref: "Item 5.02" },
      { ticker: "ATLX", form: "13D", ref: "5.4% stake" },
      { ticker: "CRVN", form: "8-K", ref: "Item 8.01" },
    ],
  },
  {
    id: "t2",
    question: "Which of my names disclosed new AI exposure this quarter?",
    answer: [
      "Three names added or expanded AI disclosure this quarter.",
      "Pylon Data (PYLN) quantified AI-attach revenue for the first time at 18% of the mix in its 10-Q, and leaned the MD&A into AI as a growth driver.",
      "Atlas Semiconductors (ATLX) and Orbital Defense (ORBT) both appear in the AI-capex theme via a read-through from Vextra Robotics' S-1, which leans heavily on AI-chip supply in its risk factors.",
      "Cambria Bancorp (CMBK) and Grove Markets (GRVE) added AI as a new risk-factor line, defensive framing rather than a growth story.",
    ],
    sources: [
      { ticker: "PYLN", form: "10-Q", ref: "AI-attach revenue" },
      { ticker: "VXRA", form: "S-1", ref: "AI-chip risk factors" },
      { ticker: "CMBK", form: "DEF 14A", ref: "risk factors" },
    ],
  },
];

export type AITheme = {
  id: string;
  title: string;
  summary: string;
  companies: string[];
  mentions: number;
  trend: "rising" | "steady" | "new";
  lastSeen: string;
};

/** The "what's going on with AI" tracker: AI exposure across the book. */
export const AI_THEMES: readonly AITheme[] = [
  { id: "th1", title: "AI capex acceleration", summary: "Compute and data-center spend showing up as a growth driver in semis, data infra, and defense suppliers.", companies: ["ATLX", "PYLN", "ORBT"], mentions: 14, trend: "rising", lastSeen: "today" },
  { id: "th2", title: "AI as a quantified revenue line", summary: "Companies beginning to break out AI-attach revenue as a discrete disclosure rather than a narrative mention.", companies: ["PYLN"], mentions: 3, trend: "new", lastSeen: "43m ago" },
  { id: "th3", title: "AI as a risk factor", summary: "Defensive framing: banks and staples adding AI to risk factors around competition, fraud, and model governance.", companies: ["CMBK", "GRVE"], mentions: 6, trend: "steady", lastSeen: "2h ago" },
  { id: "th4", title: "AI-chip supply dependency", summary: "Issuers naming AI-chip availability as a supply-chain risk, a read-through to your semis and defense names.", companies: ["ATLX", "ORBT", "VXRA"], mentions: 5, trend: "rising", lastSeen: "6h ago" },
];

/* --------------------------------------------------------------- admin --- */

export type DataSource = {
  name: string;
  category: "Filings" | "Market" | "Macro" | "Media" | "AI" | "Delivery";
  kind: "API" | "MCP" | "RSS" | "Webhook";
  blurb: string;
  status: "connected" | "available";
};

export const DATA_SOURCES: readonly DataSource[] = [
  { name: "SEC EDGAR full-text", category: "Filings", kind: "API", blurb: "Real-time ingest of every 10-K/Q, 8-K, S-1, 13D/G, Form 4, and proxy.", status: "connected" },
  { name: "Financial Modeling Prep", category: "Market", kind: "API", blurb: "Fundamentals, estimates, and price history for context.", status: "connected" },
  { name: "Polygon.io", category: "Market", kind: "API", blurb: "Real-time quotes and the pre-market tape.", status: "connected" },
  { name: "FRED", category: "Macro", kind: "API", blurb: "Rates and macro context for filing read-throughs.", status: "connected" },
  { name: "Anthropic Claude", category: "AI", kind: "API", blurb: "Filing summarization, materiality scoring, and the analyst.", status: "connected" },
  { name: "Resend", category: "Delivery", kind: "API", blurb: "Transactional email to you and client distros.", status: "connected" },
  { name: "Twilio", category: "Delivery", kind: "API", blurb: "SMS and outbound voice calls for material-only events.", status: "connected" },
  { name: "Agent webhook / MCP", category: "Delivery", kind: "MCP", blurb: "Structured filing events streamed to your downstream AI agents.", status: "connected" },
  { name: "13F aggregator", category: "Filings", kind: "API", blurb: "Quarterly institutional holdings and rotation.", status: "available" },
  { name: "Social sentiment", category: "Media", kind: "RSS", blurb: "Retail mention volume for context, off by default.", status: "available" },
];

export type AdminUser = { name: string; email: string; role: "Owner" | "Advisor" | "Trader" | "Analyst"; lastActive: string };
export const ADMIN_USERS: readonly AdminUser[] = [
  { name: "Jordan Avery", email: "jordan@independent.app", role: "Owner", lastActive: "now" },
  { name: "Sam Reyes", email: "sam@independent.app", role: "Analyst", lastActive: "12m ago" },
  { name: "Priya Nadar", email: "priya@independent.app", role: "Advisor", lastActive: "1h ago" },
  { name: "Desk Agent (bot)", email: "agent@independent.app", role: "Trader", lastActive: "streaming" },
];

export type ApiKey = { label: string; scope: string; created: string; lastUsed: string };
export const API_KEYS: readonly ApiKey[] = [
  { label: "Research agent (MCP)", scope: "filings:read, alerts:write", created: "Apr 2026", lastUsed: "2m ago" },
  { label: "Client portal webhook", scope: "alerts:read", created: "Mar 2026", lastUsed: "1h ago" },
  { label: "Backtest export", scope: "filings:read", created: "Feb 2026", lastUsed: "3d ago" },
];

export type SpendRow = { model: string; calls: string; spend: number };
export const AI_SPEND: readonly SpendRow[] = [
  { model: "Claude (summarization)", calls: "41,200", spend: 184 },
  { model: "Claude (materiality)", calls: "38,900", spend: 96 },
  { model: "Claude (analyst chat)", calls: "2,140", spend: 61 },
  { model: "Embeddings (RAG)", calls: "120,400", spend: 22 },
];

/** Monthly spend trend for the admin chart (USD). */
export const SPEND_TREND: readonly { month: string; usd: number }[] = [
  { month: "Jan", usd: 210 },
  { month: "Feb", usd: 245 },
  { month: "Mar", usd: 268 },
  { month: "Apr", usd: 301 },
  { month: "May", usd: 332 },
  { month: "Jun", usd: 363 },
];
