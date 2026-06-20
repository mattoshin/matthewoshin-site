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
  instagram: "https://www.instagram.com/mattoshin/",
  x: "https://x.com/matthewsoshin",
  calendlyUrl: "https://calendly.com/mattoshin/1",
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
  /** Unique key + identity for this section (not necessarily the zone id). */
  id: string;
  /** Ocean depth this section dives to (several sections may share a zone). */
  zone: ZoneId;
  label: string;
  href: string;
  teaser: string;
}

export const BUCKETS: readonly Bucket[] = [
  {
    id: "experience",
    zone: "about",
    label: "Experience",
    href: "/experience",
    teaser: "CAIO at BrachyClip, ex-VP AI at ICR, hedge-fund equity research at Manatuck Hill.",
  },
  {
    id: "entrepreneurship",
    zone: "projects",
    label: "Entrepreneurship",
    href: "/entrepreneurship",
    teaser: "Five ventures, from sneaker arbitrage to Mocean. Founded, scaled, two acquired.",
  },
  {
    id: "portfolio",
    zone: "projects",
    label: "Portfolio",
    href: "/portfolio",
    teaser: "The products I build now: Sigma, Galactic Signals, Observly, BriefBridge, mTrain, Camp Ricky.",
  },
  {
    id: "skills",
    zone: "ventures",
    label: "Skills",
    href: "/skills",
    teaser: "AI engineering, full-stack, markets and quant, data, product, and design.",
  },
  {
    id: "education",
    zone: "writing",
    label: "Education",
    href: "/education",
    teaser: "University of Michigan, B.A. Economics.",
  },
  {
    id: "interests",
    zone: "skills",
    label: "Interests",
    href: "/interests",
    teaser: "Markets, a real DJ rig, sneakers, networking, and emerging tech.",
  },
  {
    id: "contact",
    zone: "contact",
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
  positioning: "Chief AI Officer at BrachyClip. Markets, AI, and emerging tech.",
  // One-sentence hook. This is the single strong instance of the "builder is the
  // throughline" line; the About block no longer repeats it.
  hook: "I'm a builder. It's the throughline of everything I've done, from scaling my first companies in high school to shipping AI products today.",
  // One concise bio for the front page, kept distinct from the hook so nothing
  // repeats. The full story lives in the deeper sections.
  bio: "Today I'm Chief AI Officer at BrachyClip, an early-stage cancer medical device company, and most recently I led the AI & Intelligence Lab at ICR. My foundation is in markets, equity research at a hedge fund, and that lens still shapes how I build. Michigan econ grad, always up to connect with other builders, especially around AI, investing, and emerging tech.",
  scrollHint: "Pick a depth to dive",
} as const;

/**
 * The About paragraph, in Matthew's voice. The deeper page tells the arc:
 * the builder throughline, markets as the foundation, and where it points now.
 * Tight enough to read in one clean column; the full long-form lives in the
 * deeper sections.
 */
export const ABOUT = {
  heading: "About me",
  paragraphs: [
    "I'm a builder. That's the one word that survives every chapter. I started flipping sneakers in high school, scaled a research-and-signal company in college, did equity research on a hedge-fund desk, and now I ship AI products end to end. Different surfaces, same instinct: find an edge, pressure-test it, and build the thing that captures or distributes it.",
    "My foundation is in markets. At Manatuck Hill, a Connecticut hedge fund, I produced differentiated views across AI, nuclear, and precious metals, sat in on management interviews, and built an intelligence-aggregation system. Markets taught me the edge part. Code let me build it myself, which is why my work leads with volatility, expected moves, and expected value around catalysts.",
    "At 19 I founded Mocean Technologies, a research platform I describe as Bloomberg for Discord: a team of 40-plus analysts producing alpha that my software reformatted, branded, and redistributed to other subscription businesses. It scaled to about $400K in revenue, 100,000+ users, and 1,000+ investor communities, and it was acquired. The lesson it taught me runs through everything since: distribution beats production.",
    "On the side I co-founded Element Underground, a dance-music events and media group that has drawn 17,000+ attendees across NYC, Miami, Boston, and Ann Arbor, and now keeps the content it shoots as its own owned asset. Earlier ventures, Ocean Supply, Profit Paradise, and Resell Network, are where the resale floor first taught me that the edge is the signal, not the shoe.",
    "Most recently I was VP of AI & Innovation at ICR, a leading investor-relations and strategic-communications firm, where I stood up the AI function from scratch and led the AI & Intelligence Lab across R&D, Education, and Discovery. I owned the data pipeline and shipped the firm's internal AI platform, prototyping most of it solo on Claude Code.",
    "Today I'm Chief AI Officer and Director of Marketing at BrachyClip, an early-stage cancer medical-device company, plus a portfolio of my own builds. The flagship is Sigma, a distribution-first equity-research terminal that quantifies how my view disagrees with what the options market is pricing. It's the cleanest expression of who I am, markets reasoning shipped as a product.",
    "University of Michigan econ grad. I think in probabilities and expected value, but I can also stand up the database, write the agent, and put a real UI in front of it. Always up to connect with other builders, especially around AI, investing, and emerging tech.",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* EXPERIENCE (jobs)                                                          */
/* -------------------------------------------------------------------------- */

export interface Job {
  slug: string;
  role: string;
  org: string;
  period: string;
  points: readonly string[];
}

export const EXPERIENCE: readonly Job[] = [
  {
    slug: "brachyclip",
    role: "Chief AI Officer & Director of Marketing",
    org: "BrachyClip",
    period: "2025 to present",
    points: [
      "BrachyClip is an early-stage medical device company (Brown University / Rhode Island Hospital affiliation) building a clip-based intraoperative permanent seed brachytherapy applicator for minimally invasive cancer surgery. $6.8B TAM across nine solid-tumor categories, 510(k) predicate pathway.",
      "Built the brand, positioning, and investor narrative from scratch for a pre-clearance device: Series A pitch deck, the brachyclip.com marketing site, and a gated investor portal on Next.js 16 with an approval-based access flow.",
      "Set digital-marketing strategy designed around FDA-compliant content as a hard constraint, not an afterthought.",
      "Driving AI integration into clinical and operational workflows, and supporting investor relations directly.",
    ],
  },
  {
    slug: "icr",
    role: "VP, AI & Innovation",
    org: "ICR",
    period: "2025 to 2026",
    points: [
      "Stood up the firm's AI function from scratch and led its AI & Intelligence Lab across three pillars: R&D, Education, and Discovery.",
      "Built and shipped the flagship internal AI platform: a Next.js app on Supabase and Vercel spanning IR, legal, project management, and intelligence, with Claude streaming under the hood.",
      "Owned the data pipeline and the technical roadmap, from a RAG layer over the firm's work product to a labeling loop that captured advisor edits.",
      "Drove firm-wide adoption with role-based training tied to real workflows, and hired and managed the technical staff.",
    ],
  },
  {
    slug: "manatuck-hill",
    role: "Equity Research Analyst",
    org: "Manatuck Hill Partners",
    period: "2024",
    points: [
      "Produced differentiated views on names and ran the classic buy-side loop: generate an edge, pressure-test it, size it with conviction.",
      "Built theses across AI, nuclear, and precious metals, and conducted management interviews.",
      "Built an intelligence-aggregation system to pull research signal from many sources, and supported portfolio reporting and due diligence.",
    ],
  },
  {
    slug: "qult",
    role: "AI Product Manager",
    org: "Qult.ai",
    period: "2023, internship",
    points: [
      "Led a team of four developers building an AI platform in the healthcare-career space.",
      "Owned product direction and the operational infrastructure of getting an early-stage product off the ground.",
      "Shipped on Python, React Native, and MongoDB.",
    ],
  },
  {
    slug: "top-floor",
    role: "Software Product Manager",
    org: "Top Floor",
    period: "2022 to 2023, internship",
    points: [
      "Early product-management experience on the software side, sharpening the build-and-ship muscle.",
      "Built community and marketing infrastructure for AI companies, with automated marketing products sold to 3 clients.",
    ],
  },
] as const;

/* -------------------------------------------------------------------------- */
/* ENTREPRENEURSHIP (ventures + current builds)                              */
/* -------------------------------------------------------------------------- */

export interface Venture {
  slug: string;
  name: string;
  oneLiner: string;
  era: string;
  note: string;
}

export const VENTURES: readonly Venture[] = [
  {
    slug: "mocean",
    name: "Mocean Technologies",
    oneLiner:
      "Bloomberg for Discord. Founded at 19 on a gap year, scaled to acquisition.",
    era: "Founded and acquired, 2021 to 2023",
    note: "I started this at 19 during a gap year, splitting time between ACL recovery and caring for my mom, who was fighting ALS. The insight was simple: 1,000+ Discord servers were selling their own research to subscribers, but all the alpha was scattered. I built proprietary software that let my 40-plus analysts produce branded research and mirror it across client servers simultaneously. The distribution edge was the moat. $400K in all-time revenue, peaking at $50K/month, 100,000+ users across 1,000+ investor communities. Sold May 1, 2023. It taught me the lesson that runs through everything since: distribution beats production.",
  },
  {
    slug: "element-underground",
    name: "Element Underground",
    oneLiner:
      "Underground music events across four cities, co-founded in 2023.",
    era: "Co-founder, 2023 to 2026",
    note: "Co-founded with two partners at U of M. My role was the back-end: ops, taxes, legal, and venue negotiations. The brand was built around exclusive underground events and female-forward DJ curation, modeled after Cercle. 17,000+ attendees, $117,000+ in all-time revenue, 1,540,000 social media views in 2025 alone. Events in NYC, Miami, Boston, and Ann Arbor. The NYC debut at The Crown cleared $5,000+ profit. Music for a While pulled 1,200+ RSVPs. We retained rights to every photo and video we shot, so every event built our owned media library. Do the service, keep the asset.",
  },
  {
    slug: "profit-paradise",
    name: "Profit Paradise",
    oneLiner: "A paid alpha community for resellers, $7K/month at peak. Founded and acquired.",
    era: "Co-founder, founded and acquired, 2019 to 2023",
    note: "Co-founded with my friend Peter. $35/month subscription Discord: guides, discount codes, release calendars, and the playbook to make money across sneakers, sports cards, Pokemon, toys, and collectibles. Grew to 200 paying members at peak, which is $7,000/month in recurring revenue. By 2023 there were 3,500+ members on the server. Made it free in 2023. Acquired. The lesson: when you know the edge, teach it. Members collectively generated over $2.1 million in profits from what we gave them.",
  },
  {
    slug: "ocean-supply",
    name: "Ocean Supply",
    oneLiner: "Sneaker arbitrage, my first real operation.",
    era: "Early venture, started at 16",
    note: "Where the ocean theme on this whole site comes from. I was buying 20 to 50 pairs of low-cost sneakers every week and flipping them for $10 to $20 a pair. Joined every Discord server that posted discount codes and early releases, including paid ones. It was arbitrage in the most literal sense: buying mispriced, selling into demand. The lesson that shaped everything after: the edge was the signal, not the shoe.",
  },
  {
    slug: "resell-network",
    name: "Resell Network",
    oneLiner: "An 11,000-member networking community. Founded and acquired.",
    era: "Founded and acquired, 2019 to 2023",
    note: "Built this alongside Mocean as the connective tissue of the reselling industry. The goal was to connect the researchers and subcontractors I worked with to the server owners and employers who needed them, and to give the broader reselling community access to the exclusive resources and people I had relationships with. Grew to 11,000+ Discord members organically. Sold as part of the Mocean deal. Years of compound brand recognition and a dense industry network are the kind of asset that looks quiet from the outside.",
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
    hook: "A distribution-first equity-research terminal.",
    summary:
      "Most research tools give you a consensus mean and a single price target, throwing away the shape of your own conviction and how it disagrees with what the market already prices. Sigma takes the live options chain, derives the market's full risk-neutral distribution, overlays my own Bull/Base/Bear view on the same axis, and shades the gap as edge. Then it grades me: a calibration view tracks my probabilistic calls over time with a Brier score and a reliability diagram.",
    highlights: [
      "Verified quant engine in pure, dependency-free TypeScript: Black-Scholes, the Breeden-Litzenberger risk-neutral density pipeline, expected move, EV, and Kelly, all unit-tested.",
      "Every view ends in an expected value, a strategy comparison, and a half-Kelly position size.",
      "Calibration scorecard that grades forecasts over time the way a serious poker player measures process over outcome.",
      "Honest math: the implied density is labeled risk-neutral (Q), not real-world (P), with a transparent Q-to-P drift adjustment instead of mislabeling it.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "d3", "Options math"],
    status: "Current build",
  },
  {
    slug: "galactic-signals",
    name: "Galactic Signals",
    hook: "Cross-asset monitoring for communities, built toward the AI agent data layer that sits underneath them.",
    summary:
      "Cross-asset monitoring is fragmented across dozens of vertical tools: stocks, crypto, sports betting, trading cards, real estate, macro, and news rarely live in one place, delivered where a community already is. Galactic unifies that monitoring behind a single subscription and fires branded webhook alerts into Discord, Telegram, Slack, email, or any endpoint the user points at it. Setup is thirty seconds: activate the feeds, paste a webhook URL, start receiving. The monitoring tool is the consumer wedge. The longer thesis is the marketplace and what comes after it: an MCP server that turns every Galactic feed into a structured stream any AI agent can natively consume. That is the 'Plaid for alternative data' bet, starting with a product that already has near-zero delivery costs and no direct cross-asset competitor.",
    highlights: [
      "A fleet of ~79 async Python workers, one per feed, each with market-hours gating, a per-worker circuit breaker, and heartbeats.",
      "A delivery engine that renders branded embeds and fans them out behind a token-bucket rate limiter tuned to Discord's limits.",
      "Next.js 16 web app with Stripe billing, a category store, NextAuth, and an admin surface.",
      "Self-hosted via Docker Compose behind nginx, with GitHub Actions auto-deploying on push to main.",
      "$35-40B TAM across five underserved verticals with no dominant cross-asset competitor.",
      "AI agent data layer roadmap: MCP integration turns every feed into a structured stream any agent on Claude, ChatGPT, or a custom system can natively consume.",
    ],
    stack: ["Next.js 16", "Prisma", "PostgreSQL", "Python workers", "Stripe", "Docker"],
    status: "Current build",
  },
  {
    slug: "observly",
    name: "Observly",
    hook: "A two-sided marketplace for clinical shadowing.",
    summary:
      "Pre-meds need shadowing hours and physician mentorship, and there's no clean way to find a willing doctor, book the time, and then prove the hours later. Observly connects students and physicians for shadowing, mentorship, and verified hour-tracking, with LinkedIn-style connections and real-time messaging on top of the booking layer. We launched free to dodge the pay-to-shadow stigma, then move to a freemium model: pay to win, not pay to play.",
    highlights: [
      "Two role-scoped experiences, a Doctor dashboard and a Student dashboard, over a dual-confirmation booking layer so verified hours actually mean something.",
      "Authorization enforced in Postgres with Row-Level Security, down to rate limits in RLS, not just in the app.",
      "A typed-database pipeline: fifteen sequential SQL migrations with auto-generated TypeScript types and a build-failing drift check.",
      "Real-time messaging via Supabase Realtime.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "Tailwind v4", "Radix"],
    status: "Active venture",
  },
  {
    slug: "briefbridge",
    name: "BriefBridge",
    hook: "Turn chaotic case files into findable records, in seconds instead of hours.",
    summary:
      "Insurance-defence firms receive case material as one giant PDF that staples together hundreds of pages of medical reports, court filings, insurer letters, and witness statements in no particular order. BriefBridge ingests that compiled PDF, detects document boundaries, classifies each resulting document, and files it under the case. The web app then gives the firm a case workspace with per-document review, full-text search, and a timeline view.",
    highlights: [
      "A Python FastAPI processing brain with five stages: extractor (PyMuPDF plus Tesseract OCR), boundary detector, splitter, a Claude-powered classifier, and an embedder.",
      "Multi-tenant by organization with audit logging on everything.",
      "A shared package of literal-union status enums that keep the TypeScript and Python sides from drifting across the service seam.",
      "A Turborepo monorepo: a Next.js web app on Supabase and Prisma, plus the FastAPI service.",
    ],
    stack: ["Turborepo", "Next.js", "Supabase", "Prisma", "Python FastAPI", "Claude"],
    status: "Active build",
  },
  {
    slug: "mtrain",
    name: "mTrain studio site",
    hook: "Marketing site and admin dashboard for a strength-and-wellness studio in Westport, CT.",
    summary:
      "The owner ran an aging WordPress site on a real, established business. I rebuilt the public surface on a modern stack and framed the engagement as a conversion problem, not a commerce problem: send qualified traffic into a third-party booking flow and capture the leads the booking platform alone would miss. A house rule I hold the project to: never fabricate business facts, hours, stats, credentials, and prices are real or honestly marked as placeholders.",
    highlights: [
      "Editorial hero with an animated ambient background and responsive fixes across breakpoints.",
      "An admin dashboard backed by Supabase auth with a Mindbody data layer.",
      "Lead capture wired into Resend so qualified inbound reaches the owner.",
      "Conversion-first information architecture that routes traffic into the studio's booking flow.",
    ],
    stack: ["Next.js 16", "Tailwind v4", "shadcn-style UI", "Supabase", "Resend", "Vercel"],
    status: "Active client engagement",
  },
  {
    slug: "camp-ricky",
    name: "Camp Ricky",
    hook: "A tiny weekend-availability poll for my friend group.",
    summary:
      "A friend has a lake house, and the group needed to pick which summer weekends to claim it. So I shipped a two-screen app: a poll where each person enters their name, checks off which of 15 candidate weekends they can make, and leaves a note, and a public dashboard that tallies everyone's picks. It's the lightweight counterpoint to my heavier builds, finished and doing its one job.",
    highlights: [
      "Name-keyed updates: responses key on the normalized name, so re-entering overwrites your prior answer instead of duplicating it.",
      "No accounts and no auth, every write goes through a server action on the service role, so the browser never holds credentials.",
      "Two screens: a response form and a public tally dashboard.",
      "Shipped fast and kept simple on purpose.",
    ],
    stack: ["Next.js 16", "TypeScript", "Tailwind v4", "Supabase Postgres", "Vercel"],
    status: "Shipped",
  },
] as const;

export const ENTREPRENEURSHIP = {
  heading: "What I've built.",
  blurb:
    "Five ventures so far, in roughly the order they happened, and the products I'm building now. The thread: find an edge, package it, and get it to the people who need it. Sometimes that's software. Sometimes it's a community. Sometimes it's a room full of people who wouldn't have found each other otherwise.",
  venturesLabel: "Ventures and companies",
  buildsLabel: "Building now",
} as const;

export const PORTFOLIO = {
  heading: "Portfolio.",
  blurb:
    "The products I'm building now, end to end. Each is a real bet on an edge, packaged and shipped. Open any of them for the full case study.",
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
    items: [
      "Claude Code",
      "Agentic systems",
      "Typed tool fleets",
      "RAG and grounding",
      "Evals and calibration",
      "Prompt and context engineering",
      "Anthropic SDK",
      "AI SDK",
      "MCP",
      "Streaming",
    ],
  },
  {
    title: "Full-stack engineering",
    items: [
      "Next.js 16",
      "React 19",
      "TypeScript (strict)",
      "Supabase",
      "Postgres + RLS",
      "Prisma",
      "Vercel",
      "Stripe",
      "Resend",
      "Python",
    ],
  },
  {
    title: "Markets and quant",
    items: [
      "Equity research",
      "Thematic investing",
      "Options and Black-Scholes",
      "Risk-neutral density",
      "Expected value and Kelly",
      "Volatility risk premium",
      "Forecast calibration",
      "Valuation and modeling",
    ],
  },
  {
    title: "Data and infrastructure",
    items: [
      "Real-time data pipelines",
      "Async Python workers",
      "Circuit breakers and rate limiting",
      "Market data APIs",
      "Docker and self-hosting",
      "GitHub Actions CI/CD",
      "d3 and Recharts",
    ],
  },
  {
    title: "Product, GTM, and brand",
    items: [
      "Zero-to-one product",
      "Positioning and brand",
      "Investor narrative",
      "Go-to-market",
      "Community building",
      "Events at scale",
      "AI adoption and enablement",
    ],
  },
  {
    title: "Design and craft",
    items: [
      "Tailwind v4",
      "shadcn/ui",
      "Radix",
      "framer-motion",
      "Terminal-style UIs",
      "react-three-fiber",
      "Accessibility and polish",
    ],
  },
] as const;

export const SKILLS = {
  heading: "What I work with.",
  blurb: "Less a list of buzzwords, more an inventory of things I've actually shipped, grouped by where the work lives.",
} as const;

/* -------------------------------------------------------------------------- */
/* EDUCATION                                                                   */
/* -------------------------------------------------------------------------- */

export const EDUCATION: readonly { school: string; detail: string }[] = [
  { school: "University of Michigan", detail: "B.A. Economics" },
  { school: "Weston High School", detail: "Weston, Connecticut" },
] as const;

export const EDUCATION_META = {
  heading: "Where I studied.",
} as const;

/* -------------------------------------------------------------------------- */
/* INTERESTS                                                                   */
/* -------------------------------------------------------------------------- */

export const INTERESTS: readonly string[] = [
  "Markets and investing, I still write long theses for fun",
  "DJ with a real rig",
  "Sneakers, the origin story",
  "Networking with other builders",
  "Emerging tech on the frontier",
  "Competitive by default",
] as const;

export const INTERESTS_META = {
  heading: "Off the clock.",
  blurb: "What I do when I'm not building, though most of it isn't far from it.",
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
