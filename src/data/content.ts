/**
 * content.ts - seed copy for the site. Server-importable plain data.
 *
 * HARD RULES baked into this copy:
 *  - No em dashes anywhere. Use commas, periods, or "to" / "and".
 *  - No exact revenue or profit figures. Mocean is framed as
 *    "founded and sold a software company at 19", nothing more specific.
 *  - No phone numbers, NDA references, or venue/party details.
 *
 * Metrics on project cards are intentional placeholders (Matthew supplies the
 * real numbers). They are marked with `metricPlaceholder: true` so a later pass
 * can find and fill them.
 */

export const SITE = {
  name: "Matthew Oshin",
  role: "Serial entrepreneur and builder",
  tagline:
    "I build AI products and trading research tools, and I have founded and sold companies along the way.",
  // The single, working contact email (secondary CTA). Calendly is primary.
  email: "matthewoshin@gmail.com",
  linkedin: "https://www.linkedin.com/in/mattoshin",
  github: "https://github.com/mattoshin",
  // Placeholder for Matthew to fill in. Kept obvious so it cannot ship live.
  calendlyUrl: "CALENDLY_URL",
} as const;

export const HERO = {
  // The one giant headline. Light text is allowed here over the bright surface.
  headline: "Builder of AI products, trading tools, and companies.",
  positioning:
    "Serial entrepreneur. Chief AI Officer at BrachyClip. Previously VP of AI and Innovation at ICR. University of Michigan economics.",
  scrollHint: "Scroll to descend",
} as const;

export const ABOUT = {
  heading: "I have been swimming in this water a long time.",
  paragraphs: [
    "I started young. Reselling candy at summer camp, then washing dishes, then sneaker arbitrage under a banner I called Ocean Supply. The pattern was set early: find the gap, move fast, ship the thing.",
    "That turned into Profit Paradise, a paid community that grew to about 3,500 members, and Resell Network, an 11,000 member community. At 19 I founded and sold a software company, Mocean Technologies. I owned all of it. Its logo was a shark, which felt right.",
    "Then I went deep on fundamentals. Economics at the University of Michigan, equity research at Manatuck Hill Partners, and a coding habit that turned into a craft. Most recently I was VP of AI and Innovation at ICR, where I led an AI lab building tools and driving adoption across the firm.",
    "Today I am independent and building. Chief AI Officer at BrachyClip, plus a steady stream of new products. The water keeps getting deeper, and I keep diving.",
  ],
} as const;

export interface Project {
  slug: string;
  name: string;
  hook: string;
  /** Longer one-paragraph description for the case-study shell. */
  summary: string;
  /** What the work actually involved. Short, concrete. */
  highlights: string[];
  stack: string[];
  /** Placeholder hero metric. Matthew supplies the real number. */
  metricLabel: string;
  metricPlaceholder: true;
  /** Status badge for the card. */
  status: string;
  /** Optional external link (omit if none). */
  href?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    slug: "sigma",
    name: "Sigma",
    hook: "An options-implied distribution terminal for equity research.",
    summary:
      "Sigma turns the options market into a view on the future. It extracts the risk-neutral distribution priced into options, lets you lay your own distribution next to it, and surfaces the edge, the expected value, and a calibration scorecard so you can see whether your calls actually land.",
    highlights: [
      "Verified quant engine for risk-neutral density extraction.",
      "Edge, expected value, and half-Kelly sizing from your own view.",
      "Calibration scorecard that grades your forecasts over time.",
      "Terminal-style UI with an anchored AI analyst.",
    ],
    stack: ["Next.js", "TypeScript", "Python", "Options math"],
    metricLabel: "Headline metric",
    metricPlaceholder: true,
    status: "Active build",
  },
  {
    slug: "galactic-signals",
    name: "Galactic Signals",
    hook: "A trading-signals platform that turns market data into alerts.",
    summary:
      "Galactic Signals watches markets and ships signals to the people who need them. The work spanned the full stack: data pipelines that ingest and monitor feeds, a Next.js application layer, encrypted key management, and a Discord delivery surface.",
    highlights: [
      "Real-time data pipelines feeding a signal engine.",
      "Full-stack application with an admin and monitor builder.",
      "Encrypted API key management and deploy tooling.",
      "Discord bot for delivery to the community.",
    ],
    stack: ["Next.js", "PostgreSQL", "Python workers", "Discord"],
    metricLabel: "Headline metric",
    metricPlaceholder: true,
    status: "Live",
  },
  {
    slug: "brachyclip",
    name: "BrachyClip",
    hook: "A medical-device venture, affiliated with Brown University and Rhode Island Hospital.",
    summary:
      "BrachyClip is an early-stage medical-device company built around a clip-based delivery system for brachytherapy. I serve as Chief AI Officer, leading marketing and the AI side of the business while the clinical and engineering work advances with partners at Brown University and Rhode Island Hospital.",
    highlights: [
      "Clip-based brachytherapy delivery system.",
      "Affiliated with Brown University and Rhode Island Hospital.",
      "Chief AI Officer role spanning marketing and AI.",
      "Next.js company site and product positioning.",
    ],
    stack: ["Medical device", "Next.js", "Positioning", "AI"],
    metricLabel: "Headline metric",
    metricPlaceholder: true,
    status: "Early stage",
  },
  {
    slug: "icr-ai-tools",
    name: "ICR AI Tools and Beacon",
    hook: "An internal AI platform for an investor-relations firm.",
    summary:
      "At ICR I led the AI and Intelligence Lab and built Beacon, an internal platform of AI tools used across service lines. The work covered research and development of shipped tools, firm-wide adoption through hands-on training, and discovery of new applications across the business.",
    highlights: [
      "Built and shipped internal AI tools on the Beacon platform.",
      "Drove firm-wide adoption through embedded training.",
      "Owned the data pipeline behind the lab.",
      "Translated firm needs into shipped products.",
    ],
    stack: ["Next.js", "Supabase", "Agents", "RAG"],
    metricLabel: "Headline metric",
    metricPlaceholder: true,
    status: "Past role",
  },
] as const;

export interface Venture {
  name: string;
  oneLiner: string;
  era: string;
  note: string;
}

export const VENTURES: readonly Venture[] = [
  {
    name: "Mocean Technologies",
    oneLiner: "A software company I founded and sold at 19.",
    era: "Founded young, sold 2023",
    note: "I owned all of it. The name was M. Oshin plus Ocean, and the logo was a shark.",
  },
  {
    name: "Resell Network",
    oneLiner: "An 11,000 member community, sold alongside Mocean.",
    era: "Community",
    note: "Built and scaled a large membership community, then sold it with the software business.",
  },
  {
    name: "Profit Paradise",
    oneLiner: "A paid community that grew to about 3,500 members.",
    era: "Community",
    note: "A paid Discord community with a palm-tree logo. An early lesson in retention and value.",
  },
  {
    name: "Ocean Supply",
    oneLiner: "Sneaker arbitrage, my first real operation.",
    era: "Early venture",
    note: "Where the ocean theme started. Buying low, selling high, learning logistics one pair at a time.",
  },
] as const;

export interface SkillGroup {
  title: string;
  items: readonly string[];
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    title: "AI engineering",
    items: ["Claude Code", "Agents", "RAG", "Evals", "Prompt design"],
  },
  {
    title: "Full stack",
    items: ["Next.js", "TypeScript", "Supabase", "Vercel", "Tailwind"],
  },
  {
    title: "Markets",
    items: ["Equity research", "Financial modeling", "Options", "Valuation"],
  },
  {
    title: "Data and product",
    items: ["Data pipelines", "Product strategy", "Distribution", "Go to market"],
  },
] as const;

export const EDUCATION: readonly { school: string; detail: string }[] = [
  { school: "University of Michigan", detail: "B.A. Economics" },
  { school: "Georgia Tech OMSCS", detail: "Pursuing" },
] as const;

export const HOBBIES: readonly string[] = [
  "DJ with a real rig",
  "Sneakers",
  "Networking",
  "Markets",
] as const;

export const WRITING = {
  heading: "Dispatches from the deep.",
  blurb:
    "A log book is coming. Notes on building with AI, on markets, and on the unglamorous parts of shipping. Nothing fabricated here yet, real entries land soon.",
  cta: "Visit the log book",
} as const;

export const CONTACT = {
  heading: "Surface a signal.",
  blurb:
    "If you are building something at the intersection of AI, markets, or medicine, let us talk. Book a time or send a note.",
  primaryLabel: "Book a time",
  secondaryLabel: "Email me",
} as const;
