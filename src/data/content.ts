/**
 * content.ts - the site's real content. Server-importable plain data.
 *
 * HARD RULES baked into this copy:
 *  - No em dashes anywhere. Use commas, periods, or "to" / "and".
 *  - Voice: confident, warm, direct. First person where it reads as Matthew.
 *  - All figures here are public and approved to publish (sourced from LinkedIn).
 *
 * Structure mirrors the bucket nav:
 *   surface  -> Home (HERO + ABOUT)
 *   about    -> Experience (EXPERIENCE)
 *   projects -> Entrepreneurship (VENTURES past + BUILDS current)
 *   ventures -> Skills (SKILL_GROUPS)
 *   writing  -> Education (EDUCATION)
 *   skills   -> Interests (INTERESTS)
 *   contact  -> Contact (CONTACT)
 *
 * The zone IDs above are immutable (WebGL creatures gate on them). Only the
 * labels and the content mapped onto each zone change.
 */

import type { ZoneId } from "@/lib/depth";

export const SITE = {
  name: "Matthew Oshin",
  role: "Builder",
  tagline:
    "I build AI products, trading research tools, and companies.",
  email: "matthewoshin@gmail.com",
  linkedin: "https://www.linkedin.com/in/mattoshin",
  github: "https://github.com/mattoshin",
  // Placeholder for Matthew to fill in. Kept obvious so it cannot ship live.
  calendlyUrl: "CALENDLY_URL",
} as const;

/**
 * The site map. Each bucket is its OWN PAGE at its own ocean depth.
 *
 *   `id`      immutable zone id (WebGL creatures gate on it; never rename)
 *   `label`   nav + header display label
 *   `href`    the route this bucket lives at
 *   `teaser`  one-line preview shown on the home launchpad card
 *
 * Order is fixed by the brief: Experience -> Entrepreneurship -> Skills ->
 * Education -> Interests -> Contact, descending from the sunlit shallows to the
 * floor. "surface" (Home, "/") is intentionally NOT in this list: the wordmark
 * returns home.
 */
export interface Bucket {
  id: ZoneId;
  label: string;
  href: string;
  teaser: string;
}

export const BUCKETS: readonly Bucket[] = [
  {
    id: "about",
    label: "Experience",
    href: "/experience",
    teaser: "CAIO at BrachyClip, VP of AI at ICR, equity research before that.",
  },
  {
    id: "projects",
    label: "Entrepreneurship",
    href: "/entrepreneurship",
    teaser: "Mocean, Element Underground, and the products I'm shipping now.",
  },
  {
    id: "ventures",
    label: "Skills",
    href: "/skills",
    teaser: "AI engineering, full-stack, markets, data and product.",
  },
  {
    id: "writing",
    label: "Education",
    href: "/education",
    teaser: "University of Michigan, B.A. Economics.",
  },
  {
    id: "skills",
    label: "Interests",
    href: "/interests",
    teaser: "DJ rig, sneakers, markets, networking, emerging tech.",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    teaser: "Email, LinkedIn, GitHub, or book a time.",
  },
] as const;

/** Quick lookups for the nav active-state + page headers. */
export const BUCKET_BY_HREF: Readonly<Record<string, Bucket>> =
  Object.fromEntries(BUCKETS.map((b) => [b.href, b]));

export const HERO = {
  name: "Matthew Oshin",
  // Short punchy positioning line (eyebrow).
  positioning: "Builder. Chief AI Officer at BrachyClip. Markets, AI, and emerging tech.",
  // One-sentence hook. This is the single strong instance of the "builder is the
  // throughline" line; the About block no longer repeats it.
  hook: "I'm a builder. It's the throughline of everything I've done, from scaling my first companies in high school to shipping AI products today.",
  // One concise bio for the front page, kept distinct from the hook so nothing
  // repeats. The full story lives in the deeper sections.
  bio: "Today I'm Chief AI Officer at BrachyClip and most recently led the AI & Intelligence Lab at ICR. My foundation is in markets, equity research at a hedge fund, and that lens still shapes how I build. Michigan econ grad, always up to connect with other builders.",
  scrollHint: "Pick a depth to dive",
} as const;

/**
 * The About paragraph, in Matthew's voice, largely verbatim. Split into
 * sentences-as-paragraphs for a readable column on the front page.
 */
export const ABOUT = {
  heading: "About me",
  paragraphs: [
    "I'm a builder. It's the throughline of everything I've done, from scaling my first companies in high school to shipping AI products today.",
    "I'm the Chief AI Officer at BrachyClip, an early-stage cancer medical device company, and most recently I was VP of AI & Innovation at ICR, one of the leading investor relations and strategic communications firms, where I led the AI & Intelligence Lab: building internal tools and client-facing products, driving firm-wide AI adoption, and finding new applications across the business.",
    "My foundation is in markets. I cut my teeth in equity research at Manatuck Hill, a hedge fund, developing investment strategies across AI, nuclear energy, and precious metals that the firm put into practice. That lens still shapes how I build, with an eye on where value is heading.",
    "On the side, I co-founded Element Underground, a hospitality group running large-scale events across NYC, Miami, Boston, and Ann Arbor that have drawn 17,000+ attendees. Before all this, I founded Mocean Technologies, a research platform I scaled to $400K in revenue and 100,000+ users across 1,000+ investor communities before its acquisition.",
    "University of Michigan econ grad. Always up for connecting with other builders, especially around AI, investing, and emerging tech.",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* EXPERIENCE (jobs)                                                          */
/* -------------------------------------------------------------------------- */

export interface Job {
  role: string;
  org: string;
  period: string;
  points: readonly string[];
}

export const EXPERIENCE: readonly Job[] = [
  {
    role: "Chief AI Officer",
    org: "BrachyClip",
    period: "2025 to present",
    points: [
      "Built brand, positioning, and the investor narrative from scratch.",
      "Stood up AI infrastructure that cut time on research, content, and ops.",
      "Builds internal AI tools for market analysis, regulatory research, and outreach.",
    ],
  },
  {
    role: "VP, AI & Innovation",
    org: "ICR",
    period: "Recent",
    points: [
      "Headed the firm's AI & Intelligence Lab.",
      "Built and shipped internal AI tools and client-facing products.",
      "Drove firm-wide AI adoption through training and embedded sessions.",
      "Set and executed the firm's AI strategy.",
    ],
  },
  {
    role: "Equity Research Analyst",
    org: "Manatuck Hill Partners",
    period: "2024",
    points: [
      "Thematic research across AI infrastructure, nuclear energy, and precious metals that informed portfolio decisions.",
      "Conducted management interviews.",
      "Built an automated intelligence aggregation system.",
    ],
  },
  {
    role: "AI Project Manager",
    org: "Qult.ai",
    period: "2023, internship",
    points: [
      "Led 4 developers building an AI healthcare career platform.",
      "Shipped on Python, React Native, and MongoDB.",
    ],
  },
  {
    role: "Software Product Manager",
    org: "Top Floor",
    period: "2022 to 2023, internship",
    points: [
      "Built community and marketing infrastructure for AI companies.",
      "Automated marketing products sold to 3 clients.",
    ],
  },
] as const;

/* -------------------------------------------------------------------------- */
/* ENTREPRENEURSHIP (ventures + current builds)                              */
/* -------------------------------------------------------------------------- */

export interface Venture {
  name: string;
  oneLiner: string;
  era: string;
  note: string;
}

export const VENTURES: readonly Venture[] = [
  {
    name: "Mocean Technologies",
    oneLiner:
      "A research platform I founded at 19 and scaled before its acquisition.",
    era: "Founded and acquired",
    note: "$400K in revenue, 100,000+ users, and 1,000+ investor communities.",
  },
  {
    name: "Element Underground",
    oneLiner:
      "A hospitality group running large-scale events, co-founded.",
    era: "Co-founder",
    note: "Events across NYC, Miami, Boston, and Ann Arbor that have drawn 17,000+ attendees.",
  },
  {
    name: "Profit Paradise",
    oneLiner: "A paid community I grew to about 3,500 members.",
    era: "Community",
    note: "Built it as a paid community, then later made it free.",
  },
  {
    name: "Ocean Supply",
    oneLiner: "Sneaker arbitrage, my first real operation.",
    era: "Early venture",
    note: "Where the ocean theme started. Buying low, selling high, learning logistics one pair at a time.",
  },
  {
    name: "Resell Network",
    oneLiner: "An 11,000 member community, sold alongside Mocean.",
    era: "Community",
    note: "Built and scaled a large membership community, then sold it with the software business.",
  },
] as const;

/**
 * Current builds. These also back the /projects/[slug] case-study route, so they
 * carry the richer fields that page reads.
 */
export interface Build {
  slug: string;
  name: string;
  hook: string;
  summary: string;
  highlights: readonly string[];
  stack: readonly string[];
  status: string;
  href?: string;
}

export const BUILDS: readonly Build[] = [
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
    status: "Current build",
  },
  {
    slug: "galactic-signals",
    name: "Galactic Signals",
    hook: "A trading-signals platform that turns market data into alerts.",
    summary:
      "Galactic Signals watches markets and ships signals to the people who need them. The work spans the full stack: data pipelines that ingest and monitor feeds, a Next.js application layer, encrypted key management, and a Discord delivery surface.",
    highlights: [
      "Real-time data pipelines feeding a signal engine.",
      "Full-stack application with an admin and monitor builder.",
      "Encrypted API key management and deploy tooling.",
      "Discord bot for delivery to the community.",
    ],
    stack: ["Next.js", "PostgreSQL", "Python workers", "Discord"],
    status: "Current build",
  },
] as const;

export const ENTREPRENEURSHIP = {
  heading: "What I've built.",
  blurb:
    "The ventures, in roughly the order they happened, and the products I'm building now.",
  venturesLabel: "Ventures and companies",
  buildsLabel: "Building now",
} as const;

/* -------------------------------------------------------------------------- */
/* SKILLS                                                                      */
/* -------------------------------------------------------------------------- */

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
    title: "Full-stack",
    items: ["Next.js", "TypeScript", "React", "Supabase", "Vercel", "Python", "MongoDB"],
  },
  {
    title: "Markets",
    items: ["Equity research", "Financial modeling", "Valuation", "Thematic investing"],
  },
  {
    title: "Data & product",
    items: ["Data pipelines", "Product strategy", "Go-to-market"],
  },
] as const;

export const SKILLS = {
  heading: "What I work with.",
  blurb: "The toolkit, grouped by where it lives.",
} as const;

/* -------------------------------------------------------------------------- */
/* EDUCATION                                                                   */
/* -------------------------------------------------------------------------- */

export const EDUCATION: readonly { school: string; detail: string }[] = [
  { school: "University of Michigan", detail: "B.A. Economics" },
  { school: "Weston High School", detail: "" },
] as const;

export const EDUCATION_META = {
  heading: "Where I studied.",
} as const;

/* -------------------------------------------------------------------------- */
/* INTERESTS                                                                   */
/* -------------------------------------------------------------------------- */

export const INTERESTS: readonly string[] = [
  "DJ with a real rig",
  "Sneakers",
  "Markets and investing",
  "Networking",
  "Emerging tech",
] as const;

export const INTERESTS_META = {
  heading: "Off the clock.",
  blurb: "What I do when I'm not building.",
} as const;

/* -------------------------------------------------------------------------- */
/* CONTACT                                                                     */
/* -------------------------------------------------------------------------- */

export const CONTACT = {
  heading: "Let's talk.",
  blurb:
    "If you're building something at the intersection of AI, markets, or medicine, I'd love to connect. Book a time or send a note.",
  primaryLabel: "Book a time",
  secondaryLabel: "Email me",
} as const;
