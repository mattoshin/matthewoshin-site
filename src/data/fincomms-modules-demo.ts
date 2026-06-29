/**
 * fincomms-modules-demo.ts - per-module sample data for the Financial Comms demo.
 *
 * Everything here is fictional and illustrative (see fincomms-demo.ts header). The
 * focal company across the analyst modules is Quanta Labs (QNTA), a made-up
 * developer-tools company reporting this week. No real client data, no real
 * filings, no proprietary scoring.
 */

import type { IconName } from "@/components/demos/fincomms/BeaconKit";

export type ProseSection = { heading: string; paras?: string[]; bullets?: string[] };

/* =============================================================== EARNINGS === */

export const EARNINGS_PREP: readonly ProseSection[] = [
  {
    heading: "Setup",
    paras: [
      "Quanta Labs reports Q2 FY26 after the close on Thursday. The Street is constructive (11 Buy, 4 Hold, 0 Sell) with a $158 average target. The print is being framed as a referendum on whether platform consumption re-accelerated after a soft Q1.",
    ],
  },
  {
    heading: "What the Street is watching",
    bullets: [
      "Net revenue retention: did NRR stabilize above 118% after two quarters of decel?",
      "Consumption trends: usage-based revenue mix and any commentary on AI-agent workloads.",
      "Operating margin: progress toward the 22% exit-rate target management guided to.",
      "Large-deal momentum: $1M+ ACV customer count and any platform-expansion proof points.",
    ],
  },
  {
    heading: "Recommended framing",
    paras: [
      "Lead with consumption durability and the AI-workload tailwind, then bridge to margin discipline. Pre-empt the NRR question with the cohort data from the Q1 deck. If guidance is raised, anchor it to bookings visibility rather than macro.",
    ],
  },
];

export type PredictedQuestion = { q: string; answer: string; category: string; confidence: number };
export const PREDICTED_QUESTIONS: readonly PredictedQuestion[] = [
  { q: "What drove the sequential change in net revenue retention?", answer: "Frame NRR as stabilizing on improving gross retention while expansion normalizes off the FY24 peak. Point to the enterprise cohort holding above 130%.", category: "Growth", confidence: 92 },
  { q: "How much of consumption growth is AI-agent workloads versus core?", answer: "Avoid a hard split. Characterize AI workloads as the fastest-growing vector off a small base, additive to a healthy core, without quantifying to protect future comps.", category: "Product", confidence: 84 },
  { q: "Are you still committed to the 22% operating-margin exit rate?", answer: "Reaffirm. Tie it to the hiring slowdown and infra-efficiency program already in the numbers, and note opex leverage is structural, not one-time.", category: "Margins", confidence: 88 },
  { q: "What are you seeing in deal cycles given the macro?", answer: "Cycles elongated modestly in Q1 and have since stabilized. Emphasize the $1M+ ACV cohort and that no deals were lost to budget, only to timing.", category: "Macro", confidence: 79 },
  { q: "How should we think about the pace of buybacks from here?", answer: "Point to the existing authorization and a leverage-neutral posture; avoid signaling acceleration that would pull forward expectations.", category: "Capital", confidence: 73 },
];

export type SimAnalyst = { name: string; firm: string; style: string };
export const SIMULATOR_ANALYSTS: readonly SimAnalyst[] = [
  { name: "Priya Raman", firm: "Cedar Ridge Securities", style: "Numbers-first, presses on guidance bridges" },
  { name: "Marcus Hale", firm: "Lansing & Co.", style: "Skeptical bear, hunts for decel" },
  { name: "Joel Tanaka", firm: "Brookline Equity", style: "Long-only, narrative and TAM focused" },
];

export type SimTurn = { role: "analyst" | "ir"; name: string; text: string };
export const SIMULATOR_TRANSCRIPT: readonly SimTurn[] = [
  { role: "analyst", name: "Marcus Hale", text: "Net revenue retention has now decelerated two quarters running. Why should we believe this is the bottom and not a structural reset lower?" },
  { role: "ir", name: "CFO (you)", text: "Fair question, Marcus. Gross retention actually improved 60 bps this quarter, so the move is entirely expansion normalizing off a FY24 peak. The enterprise cohort, which is the leading indicator, held above 130%." },
  { role: "analyst", name: "Marcus Hale", text: "But expansion is the part the bulls underwrite. If that keeps normalizing, where does NRR settle?" },
  { role: "ir", name: "CFO (you)", text: "We are not guiding a specific NRR floor, but the cohort math and the AI-workload ramp give us confidence it stabilizes in the high-110s rather than reverting toward 110." },
];

export const POST_CALL = {
  summary:
    "QNTA delivered a clean beat-and-raise. Revenue topped consensus by 2.1% and management lifted the FY revenue range while reaffirming the 22% margin exit rate. NRR stabilized at 119%, easing the central bear concern.",
  reaction: "Shares +6.4% after-hours",
  sentiment: { bull: 68, neutral: 24, bear: 8 },
  metrics: [
    { label: "Revenue", actual: "$612M", est: "$599M", beat: true },
    { label: "EPS", actual: "$0.84", est: "$0.78", beat: true },
    { label: "NRR", actual: "119%", est: "117%", beat: true },
    { label: "Op. margin", actual: "20.4%", est: "20.1%", beat: true },
  ],
  followUps: [
    "Publish the cohort NRR slide management referenced for the buy-side follow-ups.",
    "Schedule three non-deal roadshow days with the funds that flagged the margin question.",
    "Draft the upgraded guidance language for the IR website within 24 hours.",
  ],
};

export type ConsensusRow = { metric: string; estimate: string; priorYear: string; yoy: number };
export const EARNINGS_CONSENSUS = {
  rating: { buy: 11, hold: 4, sell: 0 },
  priceTarget: { avg: 158, high: 185, low: 132, current: 142.5 },
  rows: [
    { metric: "Revenue", estimate: "$599M", priorYear: "$508M", yoy: 17.9 },
    { metric: "EPS (adj.)", estimate: "$0.78", priorYear: "$0.61", yoy: 27.9 },
    { metric: "Gross margin", estimate: "78.4%", priorYear: "77.1%", yoy: 1.3 },
    { metric: "Op. margin", estimate: "20.1%", priorYear: "16.8%", yoy: 3.3 },
    { metric: "FCF margin", estimate: "24.0%", priorYear: "21.2%", yoy: 2.8 },
  ] as ConsensusRow[],
};

/* =============================================================== GUIDANCE === */

export type GuidanceScenario = { name: string; tone: "Conservative" | "Base" | "Optimistic"; revenue: string; ebitdaMargin: string; fcf: string; assumptions: string[] };
export const GUIDANCE_SCENARIOS: readonly GuidanceScenario[] = [
  { name: "Conservative", tone: "Conservative", revenue: "$2.42B", ebitdaMargin: "26%", fcf: "$520M", assumptions: ["NRR drifts to 114%", "No AI-workload acceleration", "Deal cycles stay elongated"] },
  { name: "Base", tone: "Base", revenue: "$2.55B", ebitdaMargin: "29%", fcf: "$610M", assumptions: ["NRR stabilizes ~118%", "AI workloads additive", "Margin exit-rate of 22% holds"] },
  { name: "Optimistic", tone: "Optimistic", revenue: "$2.68B", ebitdaMargin: "31%", fcf: "$705M", assumptions: ["NRR re-accelerates >120%", "Large-deal cohort expands", "Opex leverage ahead of plan"] },
];

export type GuidancePeer = { ticker: string; name: string; fwdRevGrowth: string; ebitdaTarget: string; quartile: 1 | 2 | 3 | 4; subject?: boolean };
export const GUIDANCE_PEERS: readonly GuidancePeer[] = [
  { ticker: "QNTA", name: "Quanta Labs", fwdRevGrowth: "16.5%", ebitdaTarget: "29%", quartile: 1, subject: true },
  { ticker: "FLXN", name: "Flexion Systems", fwdRevGrowth: "14.2%", ebitdaTarget: "27%", quartile: 2 },
  { ticker: "CRTX", name: "Cortex Data", fwdRevGrowth: "19.8%", ebitdaTarget: "24%", quartile: 1 },
  { ticker: "BSTK", name: "Bedrock Stack", fwdRevGrowth: "11.0%", ebitdaTarget: "31%", quartile: 3 },
  { ticker: "NMBL", name: "Nimble Cloud", fwdRevGrowth: "9.4%", ebitdaTarget: "22%", quartile: 4 },
];

export const GUIDANCE_REC: readonly ProseSection[] = [
  {
    heading: "Recommendation",
    paras: [
      "Guide the FY revenue range to $2.52B to $2.58B (base case midpoint) and reaffirm the 22% margin exit rate. This clears the bar set by the buy-side without underwriting the optimistic NRR re-acceleration that the bears will short.",
    ],
  },
  {
    heading: "Risk factors to flag",
    bullets: [
      "A wide range invites a 'sandbagging' narrative; keep the band tight at roughly 240 bps.",
      "Last year guidance came in 130 bps below the eventual print, so anchor credibility to that beat history.",
      "Avoid quantifying AI-workload contribution to protect next year's comps.",
    ],
  },
];

/* =============================================================== INVESTOR === */

export type Shareholder = { holder: string; shares: string; pct: number; value: string; change: number; type: "Index" | "Active" | "Hedge" | "Activist" };
export const SHAREHOLDERS: readonly Shareholder[] = [
  { holder: "Vanguard Group", shares: "12.4M", pct: 8.7, value: "$1.77B", change: 0.3, type: "Index" },
  { holder: "BlackRock", shares: "10.9M", pct: 7.6, value: "$1.55B", change: -0.2, type: "Index" },
  { holder: "Sands Capital", shares: "6.1M", pct: 4.3, value: "$869M", change: 1.4, type: "Active" },
  { holder: "Whale Rock", shares: "4.8M", pct: 3.4, value: "$684M", change: 2.1, type: "Hedge" },
  { holder: "T. Rowe Price", shares: "4.2M", pct: 2.9, value: "$599M", change: -0.6, type: "Active" },
  { holder: "Coatue", shares: "3.5M", pct: 2.5, value: "$499M", change: 0.9, type: "Hedge" },
  { holder: "Starboard Value", shares: "2.1M", pct: 1.5, value: "$299M", change: 1.5, type: "Activist" },
];

export type InvestorTarget = { name: string; style: string; fit: number; thesis: string };
export const INVESTOR_MATCH: readonly InvestorTarget[] = [
  { name: "Brookline Equity", style: "Long-only growth", fit: 94, thesis: "Owns the developer-tools theme and is underweight QNTA versus its software book. The consumption-durability story maps directly to their TAM-led process." },
  { name: "Cedar Ridge Securities", style: "GARP", fit: 88, thesis: "Values margin inflection over pure growth. The 22% exit-rate target and FCF profile fit their quality-at-a-reasonable-price screen." },
  { name: "Lansing & Co.", style: "Concentrated quality", fit: 81, thesis: "Holds two adjacent platform names. A non-deal roadshow could anchor a new position around the AI-workload optionality." },
];

export type Filing13F = { manager: string; filed: string; reportDate: string; shares: string; change: string };
export const OWNERSHIP_13F: readonly Filing13F[] = [
  { manager: "Whale Rock Capital", filed: "May 15", reportDate: "Q1", shares: "4.8M", change: "+640K" },
  { manager: "Coatue Management", filed: "May 15", reportDate: "Q1", shares: "3.5M", change: "+310K" },
  { manager: "Starboard Value", filed: "May 14", reportDate: "Q1", shares: "2.1M", change: "NEW" },
  { manager: "Sands Capital", filed: "May 12", reportDate: "Q1", shares: "6.1M", change: "+85K" },
  { manager: "T. Rowe Price", filed: "May 10", reportDate: "Q1", shares: "4.2M", change: "-250K" },
];

/* ================================================================== PEERS === */

export type PeerRow = { ticker: string; name: string; revGrowth: number; grossMargin: number; opMargin: number; pe: number; roe: number; subject?: boolean };
export const PEER_ROWS: readonly PeerRow[] = [
  { ticker: "QNTA", name: "Quanta Labs", revGrowth: 17.9, grossMargin: 78.4, opMargin: 20.1, pe: 42, roe: 18.2, subject: true },
  { ticker: "FLXN", name: "Flexion Systems", revGrowth: 14.2, grossMargin: 75.0, opMargin: 18.6, pe: 38, roe: 15.1 },
  { ticker: "CRTX", name: "Cortex Data", revGrowth: 21.4, grossMargin: 80.2, opMargin: 14.0, pe: 55, roe: 9.8 },
  { ticker: "BSTK", name: "Bedrock Stack", revGrowth: 9.8, grossMargin: 82.1, opMargin: 26.3, pe: 31, roe: 22.5 },
  { ticker: "NMBL", name: "Nimble Cloud", revGrowth: 8.1, grossMargin: 71.5, opMargin: 11.2, pe: 24, roe: 7.4 },
];

export type PeerTranscript = { company: string; quarter: string; takeaways: string[] };
export const PEER_TRANSCRIPTS: readonly PeerTranscript[] = [
  { company: "Cortex Data (CRTX)", quarter: "Q1 FY26", takeaways: ["Called out AI-agent workloads as the fastest-growing consumption vector.", "Conceded deal cycles elongated ~2 weeks, since stabilized.", "Reaffirmed margin targets despite top-line beat."] },
  { company: "Bedrock Stack (BSTK)", quarter: "Q1 FY26", takeaways: ["Leaned hard on FCF and buybacks over growth narrative.", "Flagged pricing pressure at the low end of the market.", "Raised the floor of FY guidance only modestly."] },
];

/* ============================================================= CONFERENCE === */

export type Conference = { name: string; date: string; location: string; attending: string };
export const CONFERENCES: readonly Conference[] = [
  { name: "Cedar Ridge Software Summit", date: "Jul 14", location: "San Francisco", attending: "QNTA, CRTX, FLXN" },
  { name: "Brookline Growth Conference", date: "Aug 6", location: "New York", attending: "QNTA, BSTK" },
  { name: "Lansing Tech Forum", date: "Sep 9", location: "Boston", attending: "QNTA, NMBL, CRTX" },
];

export const CONFERENCE_PREP: readonly ProseSection[] = [
  {
    heading: "Talking points for Cedar Ridge",
    bullets: [
      "Open with consumption durability and the AI-workload ramp, the two themes Cedar Ridge's analysts have pushed on.",
      "Have the cohort-NRR slide ready; Priya Raman will ask for the bridge.",
      "Contrast QNTA's margin discipline against CRTX, which presents the slot before you.",
    ],
  },
  {
    heading: "Likely investor questions",
    bullets: ["Where does NRR settle structurally?", "How additive are AI workloads, really?", "Capital-allocation priorities into FY27?"],
  },
];

export const SOCIAL_SENTIMENT = {
  bullish: 64,
  bearish: 22,
  neutral: 14,
  mentions24h: 1840,
  recent: [
    { handle: "@swdev_alpha", text: "QNTA consumption checks look better than feared into the print.", tone: "bull" as const },
    { handle: "@macro_skeptic", text: "Still worried NRR resets lower. Expansion is rolling over.", tone: "bear" as const },
    { handle: "@buyside_notes", text: "Watching the $1M+ ACV cohort count. That's the whole story.", tone: "neutral" as const },
  ],
};

/* ================================================================= CRISIS === */

export type CrisisScenario = { id: string; title: string; desc: string; severity: "Standard" | "Severe"; icon: IconName };
export const CRISIS_SCENARIOS: readonly CrisisScenario[] = [
  { id: "breach", title: "Data breach", desc: "Customer data exposure disclosed by a security researcher.", severity: "Severe", icon: "lock" },
  { id: "activist", title: "Activist letter", desc: "A 13D filer publishes a letter demanding board change.", severity: "Severe", icon: "scale" },
  { id: "short", title: "Short report", desc: "A short seller alleges aggressive revenue recognition.", severity: "Severe", icon: "alert" },
  { id: "exec", title: "Executive departure", desc: "An unexpected CFO resignation ahead of earnings.", severity: "Standard", icon: "user" },
  { id: "miss", title: "Earnings miss", desc: "A material guidance cut driven by a large-deal slip.", severity: "Standard", icon: "trendingUp" },
  { id: "product", title: "Product outage", desc: "A multi-region platform outage hits enterprise customers.", severity: "Standard", icon: "bolt" },
];

export const CRISIS_RESPONSE = {
  scenario: "Short report",
  impact: {
    priceRisk: "-8% to -14% intraday",
    mediaSentiment: "Sharply negative for 48h, stabilizing if rebutted within the day",
    investorConcern: "High among retail, measured among long-only holders",
  },
  sections: [
    {
      heading: "Recommended holding statement",
      paras: [
        "Quanta Labs is aware of the report published this morning. The company stands firmly behind its financial reporting, which is audited and prepared in accordance with GAAP. We will respond substantively to the specific claims and remain focused on serving our customers and shareholders.",
      ],
    },
    {
      heading: "Talking points",
      bullets: [
        "Revenue recognition follows ASC 606 and is reviewed quarterly by the audit committee and external auditors.",
        "The consumption model the report mischaracterizes is disclosed in the 10-K under revenue policies.",
        "No change to guidance; the business fundamentals are unchanged by a third-party opinion.",
      ],
    },
    {
      heading: "Response timeline",
      bullets: [
        "Hour 0: Issue holding statement, notify the board, brief the top 10 holders.",
        "Hour 4: Publish a point-by-point rebuttal with filing citations.",
        "Day 1: CFO availability for key analysts; monitor and correct misinformation.",
      ],
    },
  ] as ProseSection[],
};

export const CRISIS_DOC_TYPES: readonly string[] = ["Press release", "Board notification", "Employee memo", "Investor talking points", "Social media templates", "Customer FAQ"];

/* ==================================================================== IPO === */

export const IPO_STATS = { iposGuided: 47, capitalRaised: "$12.8B", activeMissions: 6, successRate: "92%" } as const;

export type ReadinessGroup = { area: string; score: number; items: { label: string; status: "ready" | "progress" | "gap" }[] };
export const IPO_READINESS: readonly ReadinessGroup[] = [
  { area: "Financial reporting", score: 86, items: [{ label: "3 years audited financials", status: "ready" }, { label: "Quarterly close under 5 days", status: "progress" }, { label: "SOX-readiness assessment", status: "progress" }] },
  { area: "Governance", score: 72, items: [{ label: "Independent board majority", status: "ready" }, { label: "Audit committee charter", status: "ready" }, { label: "Two additional independent directors", status: "gap" }] },
  { area: "Equity story", score: 90, items: [{ label: "TAM and growth narrative", status: "ready" }, { label: "Cohort and unit economics", status: "ready" }, { label: "Comp set and positioning", status: "ready" }] },
  { area: "Infrastructure", score: 64, items: [{ label: "Investor-relations site", status: "progress" }, { label: "ESG disclosure baseline", status: "gap" }, { label: "Capitalization table cleanup", status: "ready" }] },
];

export const IPO_S1_FINDINGS: readonly { kind: "strength" | "gap"; text: string }[] = [
  { kind: "strength", text: "Risk-factor section is comprehensive and well-ordered relative to recent software comps." },
  { kind: "gap", text: "Revenue-recognition policy lacks a worked example for the consumption model; reviewers will flag it." },
  { kind: "gap", text: "MD&A omits a cohort-retention bridge that the equity story leans on; add it for consistency." },
  { kind: "strength", text: "Use-of-proceeds language is specific and ties cleanly to the growth plan." },
];

/* ============================================================= GOVERNANCE === */

export const GOVERNANCE_RISK = {
  level: "Elevated" as const,
  summary:
    "Activism risk has stepped up following a new 13D position and below-peer governance scores on board independence. The setup favors a settlement-oriented activist seeking one or two board seats rather than a control contest.",
  signals: [
    { label: "New 13D filer (1.5% stake)", weight: "High" },
    { label: "Board independence below peer median", weight: "Medium" },
    { label: "Two-year TSR underperformance vs proxy peers", weight: "Medium" },
    { label: "Say-on-pay support slipped to 84%", weight: "Low" },
  ],
};

export type ActivistHolder = { name: string; stake: string; posture: string };
export const ACTIVIST_HOLDERS: readonly ActivistHolder[] = [
  { name: "Starboard Value", stake: "1.5%", posture: "Newly disclosed; history of board-seat settlements" },
  { name: "Legion Partners", stake: "0.8%", posture: "Engaged privately on capital allocation" },
];

export type GovFiling = { form: string; filer: string; date: string; type: "Activist" | "Passive" };
export const GOVERNANCE_FILINGS: readonly GovFiling[] = [
  { form: "SC 13D", filer: "Starboard Value", date: "Jun 18", type: "Activist" },
  { form: "SC 13G/A", filer: "Vanguard Group", date: "Jun 10", type: "Passive" },
  { form: "SC 13G", filer: "BlackRock", date: "Jun 09", type: "Passive" },
  { form: "DEF 14A", filer: "Quanta Labs", date: "Apr 22", type: "Passive" },
];

export type CongressTrade = { rep: string; party: "D" | "R"; date: string; action: "Buy" | "Sell"; amount: string; ticker: string };
export const CONGRESS_TRADES: readonly CongressTrade[] = [
  { rep: "Rep. A. Coleman", party: "D", date: "Jun 12", action: "Buy", amount: "$15K–50K", ticker: "QNTA" },
  { rep: "Sen. R. Whitman", party: "R", date: "Jun 05", action: "Buy", amount: "$50K–100K", ticker: "QNTA" },
  { rep: "Rep. M. Diaz", party: "D", date: "May 28", action: "Sell", amount: "$1K–15K", ticker: "CRTX" },
];

/* ================================================================== COMMS === */

export type CommsTemplate = { id: string; name: string; blurb: string };
export const COMMS_TEMPLATES: readonly CommsTemplate[] = [
  { id: "earnings", name: "Earnings release", blurb: "Quarterly results with the standard financial tables and quote block." },
  { id: "guidance", name: "Guidance update", blurb: "Raise, lower, or reaffirm forward guidance." },
  { id: "ma", name: "M&A announcement", blurb: "Acquisition or merger with deal rationale and terms." },
  { id: "exec", name: "Executive change", blurb: "Appointment or departure of a named executive." },
  { id: "product", name: "Product launch", blurb: "New product or platform capability." },
  { id: "esg", name: "ESG / impact", blurb: "Sustainability milestone or report." },
];

export const COMMS_DRAFT: readonly ProseSection[] = [
  {
    heading: "Quanta Labs Raises Full-Year Revenue Guidance on Accelerating Platform Consumption",
    paras: [
      "SAN FRANCISCO, June 22 - Quanta Labs (NYSE: QNTA), the developer-tools platform, today raised its full-year revenue guidance, citing durable consumption growth and an accelerating contribution from AI-agent workloads.",
      "\"Our customers are building more on Quanta every quarter, and the platform's role in production AI workloads is expanding faster than we anticipated,\" said the company's Chief Executive Officer. \"We are raising guidance while holding firm on our margin commitments.\"",
    ],
  },
  {
    heading: "Updated outlook",
    bullets: ["Full-year revenue of $2.52B to $2.58B, up from $2.46B to $2.54B.", "Operating-margin exit rate of approximately 22%, reaffirmed.", "Net revenue retention stabilized at 119%."],
  },
];

export type NarrativeDoc = { name: string; excerpt: string };
export const NARRATIVE_DOCS: readonly NarrativeDoc[] = [
  { name: "Q2 earnings release (draft)", excerpt: "...raising full-year revenue guidance to $2.52B-$2.58B on accelerating consumption..." },
  { name: "CEO prepared remarks", excerpt: "...we are seeing broad-based strength and remain confident in our margin trajectory..." },
  { name: "IR website outlook page", excerpt: "...the company expects full-year revenue in the range of $2.46B to $2.54B..." },
];

export const NARRATIVE_RESULT = {
  score: 82,
  tone: "Confident, consistent voice across the release and prepared remarks.",
  conflicts: [
    { severity: "high" as const, text: "The IR website outlook page still shows the prior $2.46B-$2.54B range, conflicting with the raised guidance in the release." },
    { severity: "low" as const, text: "Prepared remarks say 'broad-based strength' while the release attributes growth specifically to AI workloads; align the emphasis." },
  ],
};

/* ============================================================== RESOURCES === */

export type Resource = { name: string; category: "Deck" | "Doc" | "Sheet" | "Filing"; updated: string; size: string; tags: string[] };
export const RESOURCES: readonly Resource[] = [
  { name: "QNTA Q2 Earnings Deck (draft)", category: "Deck", updated: "2h ago", size: "8.4 MB", tags: ["earnings", "qnta"] },
  { name: "Cohort NRR Bridge", category: "Sheet", updated: "Yesterday", size: "1.2 MB", tags: ["earnings", "model"] },
  { name: "Crisis Playbook Template", category: "Doc", updated: "3d ago", size: "640 KB", tags: ["crisis", "template"] },
  { name: "Peer Comp Set FY26", category: "Sheet", updated: "1w ago", size: "920 KB", tags: ["peers", "model"] },
  { name: "QNTA 10-K (FY25)", category: "Filing", updated: "2mo ago", size: "3.1 MB", tags: ["filing", "qnta"] },
  { name: "Investor Targeting List", category: "Sheet", updated: "5d ago", size: "410 KB", tags: ["investor", "ir"] },
];

/* ============================================================ ADMIN / LAB === */

export const LAB_FINANCE = {
  spend: [
    { month: "Jan", amount: 4200 },
    { month: "Feb", amount: 4600 },
    { month: "Mar", amount: 5100 },
    { month: "Apr", amount: 4800 },
    { month: "May", amount: 5400 },
    { month: "Jun", amount: 5900 },
  ],
  subscriptions: [
    { name: "Anthropic Claude", cost: "$1,800/mo", category: "AI" },
    { name: "Polygon.io", cost: "$1,200/mo", category: "Market data" },
    { name: "Financial Modeling Prep", cost: "$600/mo", category: "Fundamentals" },
    { name: "Supabase Pro", cost: "$240/mo", category: "Infra" },
    { name: "Vercel Pro", cost: "$200/mo", category: "Infra" },
  ],
  mrr: "$5,900",
  activeUsers: 18,
};

export type AdminUser = { name: string; role: "Admin" | "Strategist" | "Analyst"; clients: number; lastActive: string };
export const ADMIN_USERS: readonly AdminUser[] = [
  { name: "Dana Whitfield", role: "Admin", clients: 14, lastActive: "now" },
  { name: "Sam Ortega", role: "Strategist", clients: 9, lastActive: "12m ago" },
  { name: "Riya Kapoor", role: "Analyst", clients: 6, lastActive: "1h ago" },
  { name: "Tom Becker", role: "Analyst", clients: 4, lastActive: "Yesterday" },
];

export type ApiKey = { service: string; key: string; status: "active" | "rotating" };
export const ADMIN_KEYS: readonly ApiKey[] = [
  { service: "Anthropic", key: "sk-ant-••••••••••3f9a", status: "active" },
  { service: "Polygon.io", key: "pk_••••••••••7c21", status: "active" },
  { service: "FMP", key: "fmp_••••••••••a8e0", status: "rotating" },
  { service: "Resend", key: "re_••••••••••44bd", status: "active" },
];
