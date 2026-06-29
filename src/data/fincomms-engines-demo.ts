/**
 * fincomms-engines-demo.ts - sample data for the Capital Markets + Comms engines added
 * to the Financial Comms demo. Each entry drives the shared EngineScreen module.
 *
 * Faithful, mock-data recreations of the real platform's engine suite. Every
 * company, ticker, figure, holder, and headline is fictional and illustrative.
 * No real client data, no proprietary scoring logic, nothing talks to a server.
 */

import type { ModuleId } from "./fincomms-demo";
import type { ProseBlock } from "@/components/demos/fincomms/BeaconKit";

export type EngineStat = { label: string; value: string; tone?: "up" | "down" | "neutral" };
export type EngineTable = {
  title: string;
  columns: { key: string; header: string; align?: "left" | "right" }[];
  rows: Record<string, string>[];
};
export type Engine = {
  id: ModuleId;
  serviceLine: string;
  summary: string;
  inputLabel: string;
  inputs: { label: string; value: string }[];
  cta: string;
  stats: EngineStat[];
  output: { title: string; tag?: string; sections: readonly ProseBlock[] };
  table?: EngineTable;
};

export const ENGINES: Partial<Record<ModuleId, Engine>> = {
  "earnings-prep": {
    id: "earnings-prep",
    serviceLine: "Investor Relations",
    summary:
      "Surfaces the toughest probable analyst questions before the call, ranked by likelihood and difficulty, each tagged with a recommended answer frame.",
    inputLabel: "Inputs",
    inputs: [
      { label: "Company", value: "Quanta Labs (QNTA)" },
      { label: "Quarter", value: "Q2 FY26, reports in 5 days" },
      { label: "Sources", value: "Last 4 transcripts, sell-side notes, peer prints" },
    ],
    cta: "Generate question set",
    stats: [
      { label: "Questions ranked", value: "24" },
      { label: "High-risk", value: "6", tone: "down" },
      { label: "New vs last Q", value: "+5", tone: "up" },
    ],
    output: {
      title: "Top questions to expect",
      sections: [
        {
          heading: "Most likely, and hardest",
          bullets: [
            "NRR slipped to 119% from 124%. Is the deceleration macro or competitive, and where does it bottom?",
            "The margin guide implies a step-down in S&M leverage. What changed in the go-to-market?",
            "With Atlas slipping a quarter, how should we think about the FY26 ramp?",
          ],
        },
        {
          heading: "Recommended frame",
          paras: [
            "Lead with cohort data: gross retention is stable at 94%, so the NRR move is expansion timing, not churn. Bridge to the reacceleration you expect as Atlas ships. Do not relitigate the slip, frame it as scope, not capability.",
          ],
        },
      ],
    },
    table: {
      title: "Ranked questions",
      columns: [
        { key: "q", header: "Question" },
        { key: "topic", header: "Topic" },
        { key: "risk", header: "Risk", align: "right" },
      ],
      rows: [
        { q: "NRR trajectory and where it bottoms", topic: "Retention", risk: "High" },
        { q: "S&M leverage embedded in the guide", topic: "Margins", risk: "High" },
        { q: "Atlas launch timing and FY26 ramp", topic: "Product", risk: "Med" },
        { q: "Pricing actions into renewals", topic: "Pricing", risk: "Med" },
        { q: "Capital allocation and buyback pace", topic: "Capital", risk: "Low" },
      ],
    },
  },

  "shareholder-match": {
    id: "shareholder-match",
    serviceLine: "Investor Relations",
    summary:
      "Ranks the institutional accounts most likely to buy the stock: gap investors that hold the peer set heavily but own little of the company.",
    inputLabel: "Inputs",
    inputs: [
      { label: "Company", value: "Quanta Labs (QNTA)" },
      { label: "Peer set", value: "8 names, developer-tools + infra software" },
      { label: "Universe", value: "13F holders of peers, last 4 quarters" },
    ],
    cta: "Rank targets",
    stats: [
      { label: "Gap accounts", value: "37" },
      { label: "Top-tier fit", value: "9", tone: "up" },
      { label: "Est. demand", value: "$420M" },
    ],
    output: {
      title: "Targeting read",
      sections: [
        {
          heading: "Why these names",
          paras: [
            "Each holds at least three peers at conviction weight but is underweight or absent in QNTA. Style, turnover, and average hold period match the profile of holders who have added on prints like this one. Prioritize the first five for the next non-deal roadshow.",
          ],
        },
      ],
    },
    table: {
      title: "Top gap investors",
      columns: [
        { key: "fund", header: "Account" },
        { key: "style", header: "Style" },
        { key: "peers", header: "Peers held", align: "right" },
        { key: "fit", header: "Fit", align: "right" },
      ],
      rows: [
        { fund: "Marewood Capital", style: "GARP", peers: "5 of 8", fit: "94" },
        { fund: "Talbot Ridge", style: "Growth", peers: "4 of 8", fit: "91" },
        { fund: "Anvil Point Partners", style: "Core growth", peers: "4 of 8", fit: "88" },
        { fund: "Cedar Lane Asset Mgmt", style: "Quality", peers: "3 of 8", fit: "84" },
        { fund: "Hollis & Greer", style: "Long/short", peers: "3 of 8", fit: "80" },
      ],
    },
  },

  surveillance: {
    id: "surveillance",
    serviceLine: "Investor Relations",
    summary:
      "Infers weekly ownership change that beats the 45-day 13F lag, blending registrar records with Form 4 insider activity against the 13F baseline.",
    inputLabel: "Inputs",
    inputs: [
      { label: "Company", value: "Apex Gaming (APXG)" },
      { label: "Window", value: "Trailing 4 weeks" },
      { label: "Signals", value: "Registrar, Form 4, 13F baseline, short interest" },
    ],
    cta: "Run surveillance",
    stats: [
      { label: "Net inst. flow", value: "-1.4M sh", tone: "down" },
      { label: "New 13D risk", value: "Elevated", tone: "down" },
      { label: "Days to 13F", value: "31" },
    ],
    output: {
      title: "Ownership read",
      sections: [
        {
          heading: "What moved this week",
          bullets: [
            "Two index-style holders trimmed into the downgrade, consistent with rebalancing, not a view change.",
            "A new fast-money account crossed 2.1%, building through block prints. Watch for a 13D if it crosses 5%.",
            "Insider activity is quiet: no Form 4 sales, one small option exercise-and-hold.",
          ],
        },
        {
          heading: "Recommendation",
          paras: [
            "Brief the CEO before the conference. If the new holder is activist-adjacent, get ahead of it with a proactive outreach call rather than waiting for the filing.",
          ],
        },
      ],
    },
  },

  "media-monitoring": {
    id: "media-monitoring",
    serviceLine: "Corporate Comms & PR",
    summary:
      "Tracks coverage across 80k+ sources in real time with sentiment and share-of-voice, and alerts the moment a story breaks on a client or a peer.",
    inputLabel: "Watchlist",
    inputs: [
      { label: "Clients", value: "14 companies, 9 sectors" },
      { label: "Peers tracked", value: "62 public peers" },
      { label: "Alert triggers", value: "Sentiment swing, peer break, analyst note, exec mention" },
    ],
    cta: "Open live feed",
    stats: [
      { label: "Mentions / 24h", value: "1,284" },
      { label: "Net sentiment", value: "+12", tone: "up" },
      { label: "Breaking alerts", value: "3", tone: "down" },
    ],
    output: {
      title: "What needs a response",
      sections: [
        {
          heading: "Priority items",
          bullets: [
            "Apex Gaming: a downgrade note is driving negative coverage. Holding language is drafted in Crisis Command.",
            "Meridian Apparel: a peer drew an activist letter. Newsjacking flagged a same-day pitch opening.",
            "Quanta Labs: a reporter is sourcing a developer-tools trend piece. Good fit for a proactive CEO comment.",
          ],
        },
      ],
    },
    table: {
      title: "Live coverage",
      columns: [
        { key: "outlet", header: "Outlet" },
        { key: "headline", header: "Headline" },
        { key: "tone", header: "Tone", align: "right" },
        { key: "time", header: "Time", align: "right" },
      ],
      rows: [
        { outlet: "Bloomberg", headline: "Apex Gaming cut to Hold on cooling bookings", tone: "Negative", time: "18m" },
        { outlet: "The Information", headline: "Developer-tools spend resilient in CIO survey", tone: "Positive", time: "1h" },
        { outlet: "Reuters", headline: "Activist builds stake in mid-cap apparel name", tone: "Neutral", time: "2h" },
        { outlet: "Axios", headline: "Clean-power credits clear Treasury review", tone: "Positive", time: "3h" },
      ],
    },
  },

  newsjacking: {
    id: "newsjacking",
    serviceLine: "Corporate Comms & PR",
    summary:
      "Surfaces the stories of the day and exactly how each can be made relevant to a client, so practitioners can pitch reporters and win media hits.",
    inputLabel: "Inputs",
    inputs: [
      { label: "Client", value: "Verdant Energy (VRDN)" },
      { label: "Angle bank", value: "Spokesperson topics, data, customer stories" },
      { label: "Beat", value: "Energy, climate, policy" },
    ],
    cta: "Find newsjacks",
    stats: [
      { label: "Stories scanned", value: "340" },
      { label: "Strong fits", value: "5", tone: "up" },
      { label: "Reporters matched", value: "11" },
    ],
    output: {
      title: "Best openings today",
      sections: [
        {
          heading: "Pitch-ready",
          bullets: [
            "Treasury cleared clean-power credit guidance. Offer the CEO as a same-day source on what it means for project economics.",
            "A grid-reliability story is trending. Verdant has proprietary uptime data that reframes the debate.",
          ],
        },
        {
          heading: "Drafted pitch",
          paras: [
            "Subject: Reframe on today's clean-power guidance, real project math. Two sentences of relevance, one data point only Verdant has, and a same-day interview offer. Reporter and outlet are matched below.",
          ],
        },
      ],
    },
    table: {
      title: "Story, angle, reporter",
      columns: [
        { key: "story", header: "Story" },
        { key: "angle", header: "Client angle" },
        { key: "reporter", header: "Reporter", align: "right" },
      ],
      rows: [
        { story: "Treasury clears clean-power credits", angle: "Project-economics impact", reporter: "Axios / Energy" },
        { story: "Grid reliability under strain", angle: "Proprietary uptime data", reporter: "Bloomberg / Power" },
        { story: "Data-center power demand", angle: "Clean baseload customer", reporter: "WSJ / Tech" },
      ],
    },
  },

  "ir-chatbot": {
    id: "ir-chatbot",
    serviceLine: "Investor Relations",
    summary:
      "A scoped, privacy-respecting chatbot that answers IR-site visitor questions strictly from a company's filings, transcripts, and news, with citations.",
    inputLabel: "Configuration",
    inputs: [
      { label: "Company", value: "Quanta Labs (QNTA)" },
      { label: "Corpus", value: "10-K/Q, 8-K, transcripts, press releases" },
      { label: "Guardrails", value: "No forward guidance, cite-or-decline, log every turn" },
    ],
    cta: "Open preview",
    stats: [
      { label: "Docs indexed", value: "146" },
      { label: "Answer w/ citation", value: "100%" },
      { label: "Avg. response", value: "1.4s" },
    ],
    output: {
      title: "Sample exchange",
      sections: [
        {
          heading: "Visitor: What was net revenue retention last quarter?",
          paras: [
            "Net revenue retention was 119% in Q1 FY26, down from 124% in the prior quarter. Source: Q1 FY26 earnings release, page 2. I can only answer from filed materials and cannot comment on forward expectations.",
          ],
        },
      ],
    },
  },

  "roadshow-twin": {
    id: "roadshow-twin",
    serviceLine: "Capital Markets",
    summary:
      "A simulated investor for management practice. The model role-plays a persona, asks tough questions in voice, then scores each answer against the prep.",
    inputLabel: "Session",
    inputs: [
      { label: "Company", value: "Helios Therapeutics (HELO)" },
      { label: "Persona", value: "Skeptical healthcare long/short PM" },
      { label: "Focus", value: "Trial readout, cash runway, competitive set" },
    ],
    cta: "Start session",
    stats: [
      { label: "Questions asked", value: "18" },
      { label: "Avg. score", value: "7.4 / 10" },
      { label: "Flagged answers", value: "4", tone: "down" },
    ],
    output: {
      title: "Session scorecard",
      sections: [
        {
          heading: "Where it got tough",
          bullets: [
            "Cash runway: the answer ran long and buried the 18-month figure. Lead with the number.",
            "Competitive readout: hedged too much. State the differentiation in one line, then support it.",
          ],
        },
        {
          heading: "Coaching",
          paras: [
            "Strongest on the mechanism-of-action question. Repeat that structure: claim, one proof point, stop. Re-run the runway and competitive questions before the real meeting.",
          ],
        },
      ],
    },
  },

  "model-standardizer": {
    id: "model-standardizer",
    serviceLine: "Capital Markets",
    summary:
      "Ingests a sell-side analyst model (PDF or Excel), standardizes the projections to a common template, and flags arithmetic errors plus consensus variance.",
    inputLabel: "Upload",
    inputs: [
      { label: "Model", value: "Covering analyst, QNTA, 3-statement (xlsx)" },
      { label: "Template", value: "Standard SaaS, quarterly to FY28" },
      { label: "Checks", value: "Cross-foot, consensus diff, driver sanity" },
    ],
    cta: "Standardize model",
    stats: [
      { label: "Line items mapped", value: "212" },
      { label: "Errors flagged", value: "3", tone: "down" },
      { label: "vs consensus", value: "+4% rev", tone: "up" },
    ],
    output: {
      title: "Standardization report",
      sections: [
        {
          heading: "Flags",
          bullets: [
            "FY27 gross margin does not tie to COGS build, a 90 bps cross-foot error.",
            "Billings growth implies an NRR above the company's own disclosed range.",
            "Modeled S&M as a percent of revenue diverges from the last two prints.",
          ],
        },
        {
          heading: "Consensus read",
          paras: [
            "This model sits 4% above Street revenue in FY26 on faster seat expansion, but below on margin. The variance is the bull-case driver to pressure-test with the analyst.",
          ],
        },
      ],
    },
  },

  "buyside-report": {
    id: "buyside-report",
    serviceLine: "Capital Markets",
    summary:
      "What the buy-side actually asks in a sector, mined from real earnings-call Q&A across the peer set and clustered into ranked themes and concerns.",
    inputLabel: "Inputs",
    inputs: [
      { label: "Sector", value: "Developer-tools software" },
      { label: "Peer set", value: "11 companies, last 4 calls" },
      { label: "Corpus", value: "1,240 analyst questions" },
    ],
    cta: "Build report",
    stats: [
      { label: "Questions mined", value: "1,240" },
      { label: "Themes", value: "8" },
      { label: "Rising concern", value: "Margins", tone: "down" },
    ],
    output: {
      title: "What the buy-side is asking",
      sections: [
        {
          heading: "Top themes this cycle",
          bullets: [
            "Durability of consumption revenue as budgets tighten, the single most-asked theme.",
            "AI-feature monetization: are customers paying, or is it table stakes?",
            "Path to margin leverage now that growth has normalized.",
          ],
        },
      ],
    },
    table: {
      title: "Ranked themes",
      columns: [
        { key: "theme", header: "Theme" },
        { key: "share", header: "% of Q&A", align: "right" },
        { key: "trend", header: "Trend", align: "right" },
      ],
      rows: [
        { theme: "Consumption durability", share: "22%", trend: "Rising" },
        { theme: "AI monetization", share: "18%", trend: "Rising" },
        { theme: "Margin leverage", share: "16%", trend: "Rising" },
        { theme: "Competitive displacement", share: "11%", trend: "Flat" },
        { theme: "Pricing and packaging", share: "9%", trend: "Flat" },
      ],
    },
  },

  "retail-voice": {
    id: "retail-voice",
    serviceLine: "Investor Relations",
    summary:
      "Clusters what retail investors say around an earnings call, then diffs it against what management actually covered, surfacing the gaps.",
    inputLabel: "Inputs",
    inputs: [
      { label: "Company", value: "Apex Gaming (APXG)" },
      { label: "Window", value: "48h around the print" },
      { label: "Sources", value: "Retail forums, social, comment threads" },
    ],
    cta: "Analyze voice",
    stats: [
      { label: "Posts clustered", value: "3,410" },
      { label: "Net sentiment", value: "-8", tone: "down" },
      { label: "Coverage gaps", value: "2", tone: "down" },
    ],
    output: {
      title: "Retail vs management",
      sections: [
        {
          heading: "What retail cared about that the call underweighted",
          bullets: [
            "Live-service bookings cadence: heavy retail discussion, one line on the call. Address it proactively next quarter.",
            "Refund and chargeback policy questions spiked after a press story. Worth a clear FAQ.",
          ],
        },
      ],
    },
  },

  "rils-trends": {
    id: "rils-trends",
    serviceLine: "Capital Markets",
    summary:
      "A productionized retail-loyalty score with weekly persistence: a composite, the signal breakdown, and the week-over-week trend per name.",
    inputLabel: "Inputs",
    inputs: [
      { label: "Company", value: "Northwind Foods (NWND)" },
      { label: "Signals", value: "App ranks, search interest, sentiment, foot traffic" },
      { label: "Cadence", value: "Weekly, 52-week history" },
    ],
    cta: "Open trend",
    stats: [
      { label: "Loyalty composite", value: "61 / 100" },
      { label: "WoW", value: "-3", tone: "down" },
      { label: "Percentile vs peers", value: "44th" },
    ],
    output: {
      title: "Loyalty read",
      sections: [
        {
          heading: "Signal breakdown",
          bullets: [
            "Search interest softened for the third straight week, the largest negative contributor.",
            "App ranking held; sentiment ticked down on a pricing change.",
            "Foot-traffic proxy is roughly flat, so the weakness is demand intent, not visits.",
          ],
        },
      ],
    },
  },

  "ir-hosting": {
    id: "ir-hosting",
    serviceLine: "Investor Relations",
    summary:
      "A server-rendered IR filings page sourced directly from SEC EDGAR. Enter a ticker and it assembles recent filings, events, and a clean investor view.",
    inputLabel: "Inputs",
    inputs: [
      { label: "Ticker", value: "QNTA" },
      { label: "Source", value: "SEC EDGAR, live" },
      { label: "Sections", value: "Filings, events, stock, contacts" },
    ],
    cta: "Render page",
    stats: [
      { label: "Filings pulled", value: "28" },
      { label: "Latest", value: "8-K, 2d ago" },
      { label: "Render", value: "SSR, <100ms" },
    ],
    output: {
      title: "Recent filings",
      sections: [
        {
          heading: "Assembled from EDGAR",
          paras: [
            "The hosted page renders the latest 10-Q, two 8-Ks, and a Form 4 cluster, plus an events strip and a quote module. Everything is sourced live from EDGAR, so the IR site never goes stale between manual updates.",
          ],
        },
      ],
    },
    table: {
      title: "Filing feed",
      columns: [
        { key: "form", header: "Form" },
        { key: "desc", header: "Description" },
        { key: "date", header: "Filed", align: "right" },
      ],
      rows: [
        { form: "8-K", desc: "Leadership appointment", date: "2d ago" },
        { form: "10-Q", desc: "Q1 FY26 quarterly report", date: "3w ago" },
        { form: "4", desc: "Insider option exercise", date: "4w ago" },
        { form: "8-K", desc: "Q1 results and call", date: "3w ago" },
      ],
    },
  },

  "ask-firm": {
    id: "ask-firm",
    serviceLine: "New Business",
    summary:
      "A client-facing assistant that answers what the firm can do for you, grounded in the firm corpus and the firm's investor-grade house voice.",
    inputLabel: "Configuration",
    inputs: [
      { label: "Corpus", value: "Service lines, case studies, sector pages, team" },
      { label: "Voice", value: "Investor-grade, no hype, cite-or-decline" },
      { label: "Scope", value: "Firm capabilities only, hands off to a human for scoping" },
    ],
    cta: "Open preview",
    stats: [
      { label: "Pages indexed", value: "310" },
      { label: "Service lines", value: "8" },
      { label: "Handoff rate", value: "On scope asks" },
    ],
    output: {
      title: "Sample exchange",
      sections: [
        {
          heading: "Prospect: We are pre-IPO in healthcare. What could you run?",
          paras: [
            "For a pre-IPO healthcare company, the firm typically pairs IPO and capital-markets advisory with investor relations and corporate communications: equity-story development, analyst targeting, and a launch communications plan. Healthcare is a core sector. I can connect you with the team to scope it.",
          ],
        },
      ],
    },
  },
};

export const ENGINE_IDS = Object.keys(ENGINES) as ModuleId[];
