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
  calendlyUrl: "https://calendly.com/mattoshin",
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
    teaser: "Chief AI Officer at BrachyClip, ex-VP AI at ICR, hedge-fund equity research at Manatuck Hill.",
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
    teaser: "The products I build now: Riptide Research, Galactic Signals, Sonar Media, Observly, BriefBridge, mTrain.",
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
    teaser: "Music from sax to house sets, film and photography, markets, sneakers, and emerging tech.",
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
  // Resume's opening positioning line, shown as a sub-headline under the hero.
  tagline: "Engineer's hands, investor's judgment, founder's speed.",
  // Short punchy positioning line (eyebrow).
  positioning: "Chief AI Officer at BrachyClip. Markets, AI, and emerging tech.",
  // One-sentence hook. This is the single strong instance of the "builder is the
  // throughline" line; the About block no longer repeats it.
  hook: "I'm a builder. It's the throughline of everything I've done, from scaling my first companies in high school to shipping AI products today.",
  // One concise bio for the front page, kept distinct from the hook so nothing
  // repeats. The full story lives in the deeper sections.
  bio: "Today I'm Chief AI Officer at BrachyClip, a cancer medical device company, and most recently I led the AI & Intelligence Lab at ICR. My foundation is in markets, equity research at a hedge fund, and that lens still shapes how I build. Michigan econ grad, always up to connect with other builders, especially around AI, investing, and emerging tech.",
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
    "Today I'm Chief AI Officer and Director of Marketing at BrachyClip, a cancer medical-device company, plus a portfolio of my own builds. The flagship is Sigma, a distribution-first equity-research terminal that quantifies how my view disagrees with what the options market is pricing. It's the cleanest expression of who I am, markets reasoning shipped as a product.",
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
      "BrachyClip is a cancer medical device company (Brown University / Rhode Island Hospital affiliation) building a clip-based intraoperative permanent seed brachytherapy applicator for minimally invasive cancer surgery. $6.8B TAM across nine solid-tumor categories, 510(k) predicate pathway.",
      "Built the brand, positioning, and investor narrative from scratch for a pre-clearance device: Series A pitch deck, the brachyclip.com marketing site, and a gated investor portal on Next.js 16 with an approval-based access flow, supporting an active eight-figure raise.",
      "Set digital-marketing strategy designed around FDA-compliant content as a hard constraint, not an afterthought.",
      "Driving agentic AI automations across clinical and operational workflows under FDA constraints (saving ~5 hours a week), and supporting investor relations directly.",
    ],
  },
  {
    slug: "icr",
    role: "VP, AI & Innovation",
    org: "ICR",
    period: "2026",
    points: [
      "Stood up the firm's AI function from scratch and led its AI & Intelligence Lab across three pillars: R&D, Education, and Discovery.",
      "Built and shipped the flagship internal AI platform, a Next.js app on Supabase and Vercel with Claude streaming, then embedded with practice teams to ship 11 custom production apps, including real-time media monitoring, an SEC intelligence platform, and an agentic security and IT-ops dashboard, with working prototypes inside four weeks.",
      "Engineered the data pipeline: a RAG layer over the firm's 27 TB corpus, plus an advisor-edit labeling loop that captured training signal.",
      "Drove the platform to 61% adoption across the 400-person firm with role-based training tied to real workflows, and hired and managed the technical team.",
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
    period: "2023",
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
    period: "2022 to 2023",
    points: [
      "Early product-management experience on the software side, sharpening the build-and-ship muscle.",
      "Built community and marketing infrastructure for AI companies, with automated marketing products sold to 3 clients.",
    ],
  },
  {
    slug: "powerhouse-assets",
    role: "Wealth Management Analyst",
    org: "PowerHouse Assets",
    period: "2020, internship",
    points: [
      "Conducted sector analysis and return modeling across equities and alternative asset classes to support client portfolio allocation decisions.",
      "Prepared investment memos and maintained CRM documentation for client strategy updates.",
      "Utilized analytical skills to provide valuable insights for wealth management strategies.",
    ],
  },
  {
    slug: "saturn",
    role: "User Experience Specialist",
    org: "Saturn",
    period: "2019 to 2020, internship",
    points: [
      "Streamlined Saturn's beta app into WHS community, improving scheduling features.",
      "Acted as liaison between WHS students and Saturn development team.",
      "Enhanced aesthetic appearance of app's scheduling portion for better user experience.",
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
  /** Long-form, multi-paragraph story for the detail page (falls back to `note`). */
  storyParagraphs?: readonly string[];
  /** When set, the detail page shows a bright "View Demo" button to this route. */
  demoHref?: string;
  /** An embedded interview/feature video for the detail page. */
  video?: {
    youtubeId: string;
    title: string;
    source: string;
    date: string;
    href: string;
    /** One-line framing shown under the player. */
    blurb: string;
  };
  /** Pull-quotes (e.g. lines from the interview video), shown in an "In his words" block. */
  quotes?: readonly string[];
  /** A brand logo/mark shown in the detail-page hero. */
  logo?: { src: string; alt: string };
  /** Live site for the venture; renders a "Visit the site" link. */
  website?: string;
  /** The venture's own social links, shown on its case-study page. */
  socials?: readonly { label: string; href: string }[];
}

export const VENTURES: readonly Venture[] = [
  {
    slug: "mocean",
    name: "Mocean Technologies",
    oneLiner:
      "Bloomberg for Discord. Founded at 19 on a gap year, scaled to acquisition.",
    era: "Founded and acquired, 2021 to 2023",
    demoHref: "/app/mocean-demo",
    note: "I started this at 19 during a gap year, splitting time between ACL recovery and caring for my mom, who was fighting ALS. The insight was simple: 1,000+ Discord servers were selling their own research to subscribers, but all the alpha was scattered. I built proprietary software that let my 40-plus analysts produce branded research and mirror it across client servers simultaneously. The distribution edge was the moat. $400K in all-time revenue, peaking at almost $60K/month, 100,000+ users across 1,000+ investor communities. Sold May 1, 2023. It taught me the lesson that runs through everything since: distribution beats production.",
    storyParagraphs: [
      "Mocean was Bloomberg for Discord, and I started it at 19 on a gap year, splitting my time between recovering from ACL surgery and helping care for my mom as she fought ALS. The opening was structural and almost no one else saw it: more than a thousand Discord communities were each selling their own market research, but every server was an island. The alpha was real and it was everywhere, and none of it could travel. The bottleneck was never the research. It was distribution, so that is what I went and built.",
      "I built the rails. I designed a branded distribution engine that took one piece of research and mirrored it across hundreds of client communities at once, with per-server templating and category- and channel-level syncing, so every client received exactly the streams they paid for. On top of it I built a fleet of custom market monitors across NFTs, crypto, and equities, and a self-serve dashboard that turned the whole operation into a product: pick your feeds, point them at your server, and start receiving branded, real-time alpha in minutes. Forty-plus analysts produced the signal. The software was the moat.",
      "At its peak more than 100,000 people read our research every single day, across 1,000-plus investor communities, on a pricing engine that set every contract to the client's willingness to pay. Our best months were clearing almost $60K, on roughly $400K in all-time revenue. I sold the company on May 1, 2023.",
      "Underneath the research business I was building the bigger thing: the first e-commerce platform for information, a Shopify for everyone selling intelligence. Mocean taught me the lesson that still runs through everything I build. Distribution beats production. Anyone can write a good thesis; almost no one can put it in front of a hundred thousand people at the same instant, and whoever owns that distribution layer owns the market.",
    ],
    video: {
      youtubeId: "jMkukkvVUVw",
      title: "Matthew Oshin on building Mocean Technologies",
      source: "THINK Business LIVE with Jon Dwoskin",
      date: "March 2023",
      href: "https://www.youtube.com/watch?v=jMkukkvVUVw",
      blurb:
        "Recorded weeks before the acquisition: the full story, from washing dishes to building the first e-commerce platform for information.",
    },
    quotes: [
      "Don't go for the gold yourself. Always ask: is there a way I can sell a shovel for other people to look for the gold? Because then you'll always have customers.",
      "You don't have a business until you can step away and nothing changes.",
      "I didn't see exponential success until I was doing something no one else was doing. Now other people are trying to copy me, and that's how I know I really have something.",
      "At one point, over a hundred thousand people were reading our research every single day.",
    ],
    logo: { src: "/ventures/mocean.png", alt: "Mocean Technologies shark logo" },
  },
  {
    slug: "resell-network",
    name: "Resell Network",
    oneLiner: "An 11,000-member networking community. Founded and acquired.",
    era: "Founded and acquired, 2019 to 2023",
    note: "Built this alongside Mocean as the connective tissue of the reselling industry. The goal was to connect the researchers and subcontractors I worked with to the server owners and employers who needed them, and to give the broader reselling community access to the exclusive resources and people I had relationships with. Grew to 11,000+ Discord members organically. Sold as part of the Mocean deal. Years of compound brand recognition and a dense industry network are the kind of asset that looks quiet from the outside.",
    storyParagraphs: [
      "Resell Network was the town square of the entire reselling industry, and I spent close to four years building it into one. It was not a paid alpha group like Profit Paradise. It was the open marketplace where everyone in the ecosystem actually gathered: hundreds of group owners, thousands of resellers, graphic designers, bot makers, cook groups, and freelancers, all in one Discord. If you did anything in reselling, you were in Resell Network.",
      "It grew past 11,000 members, entirely organic, and it ran hot. People paid every month to plug: dedicated channels where groups and freelancers marketed themselves to the whole industry, plus a live floor where members bought, sold, hired, and traded all day long. It was less a product than an economy, and I monetized it through advertising and marketing partnerships rather than a subscription. At its peak it was busy enough to get spammed and even knocked offline by attacks, which is its own kind of proof: it was the room everyone in the space wanted into. Some of the people and groups who came up in that world went on to real things, including one that is now a billion-dollar company.",
      "The real asset was years of brand recognition you cannot buy and a network you cannot fake. I sold it in 2023 as part of the Mocean deal, and it still runs today under its new owner. The lesson has shaped everything since: own the marketplace where an industry meets and you own the most defensible thing there is, because the network itself is the product.",
    ],
    logo: { src: "/ventures/resell-network.png", alt: "Resell Network logo" },
  },
  {
    slug: "element-underground",
    name: "Element Underground",
    oneLiner:
      "Underground music events that became a dance-music media agency. Co-founded in 2023.",
    era: "Co-founder, 2023 to 2026",
    note: "Co-founded with two partners at U of M. My role was the back-end: ops, taxes, legal, and venue negotiations. The brand was built around exclusive underground events and female-forward DJ curation, modeled after Cercle. 17,000+ attendees, $117,000+ in all-time revenue, 1,540,000 social media views in 2025 alone. Events in NYC, Miami, Boston, and Ann Arbor. The NYC debut at The Crown cleared $5,000+ profit. Music for a While pulled 1,200+ RSVPs. We retained rights to every photo and video we shot, so every event built our owned media library. Do the service, keep the asset.",
    storyParagraphs: [
      "Element Underground is a live-music brand I co-founded in 2023 at the University of Michigan. The idea was the kind of nightlife you have to know someone to get into: curated, female-forward DJ sets, tech house and techno, rooms that feel like a community instead of a club. The reference point was Cercle, the way they turned events into a content engine.",
      "It started as free rooftop parties in Ann Arbor and grew into a real circuit across NYC, Miami, Boston, and Ann Arbor. We have produced more than 50 shows, with multiple nights clearing over $20,000, run by a team that grew past 40 people. The NYC debut at The Crown validated the biggest market, a later show pulled more than 1,200 RSVPs, and across 2025 the brand did 17,000-plus attendees, $117,000-plus in revenue, and over 1.5 million social views. Every event earned on tickets and venue bar partnerships, and we kept the rights to every photo and video we shot.",
      "That last part turned out to be the whole business. We got so good at capturing our own events that the content became the product, and Element evolved into a media agency for dance music: we capture what you create. We shoot cinematic, multi-camera films of nightlife the way almost no one does well, and now clubs, artists, and venues pay us to do it, from Club Space in Miami to the Brooklyn Storehouse to a shoot at a museum in LA. Five or six cameras stitched into one story. It is hard and expensive to pull off, and that difficulty is the moat.",
      "We scale the live side through an agent model: local partners run their market under the Element brand, legal, and marketing umbrella while the core team supplies the strategy and the playbook. It lets the brand travel without diluting what it stands for.",
      "Element is the venture I am proudest of, and not because it made the most money. It is the one where the craft is visible, where the brand became art, and where I learned that if you do the service well enough, the asset you keep can quietly become a bigger business than the service ever was.",
    ],
    logo: { src: "/ventures/element-underground.png", alt: "Element Underground logo" },
    website: "https://elementunderground.com",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/element.underground/" },
      { label: "YouTube", href: "https://www.youtube.com/@element.underground" },
      { label: "TikTok", href: "https://www.tiktok.com/@element.underground" },
    ],
  },
  {
    slug: "profit-paradise",
    name: "Profit Paradise",
    oneLiner: "A paid alpha community for resellers, $7K/month at peak. Founded and acquired.",
    era: "Co-founder, founded and acquired, 2019 to 2023",
    note: "Co-founded with my friend Peter. $35/month subscription Discord: guides, discount codes, release calendars, and the playbook to make money across sneakers, sports cards, Pokemon, toys, and collectibles. Grew to 200 paying members at peak, which is $7,000/month in recurring revenue. By 2023 there were 3,500+ members on the server. Made it free in 2023. Acquired. The lesson: when you know the edge, teach it. Members collectively generated over $2.1 million in profits from what we gave them.",
    storyParagraphs: [
      "Profit Paradise was my first company, and I started it in high school. It grew straight out of a hustle: I had been a dishwasher making $10 an hour, and my co-founder Peter had taught himself to flip sneakers at fourteen, walking out of Sneaker Con with more shoes and more cash than he came in with. He started texting me the drops, the raffles, and the discount codes, I made more in a weekend than a week of dishes, and we realized the real product was never the shoes. It was the information.",
      "So we packaged it. Profit Paradise was a paid, invite-only Discord where resellers got a daily feed of profitable opportunities: discount-code 'brick' buys that let you purchase a model in bulk below market, hype-release and raffle alerts on the limited drops where demand outruns supply, and the research to know which was actually worth your capital. We charged a flat monthly membership and wrapped it in a real product, an organized server of essential and important channels, a twenty-page onboarding Starter Pack, release guides, and 24/7 one-on-one support.",
      "The piece I am proudest of building is the automation layer. We ran a managed checkout operation: members handed us their slots, and on a limited release our bots would secure the item within milliseconds of it going live, far faster than anyone could by hand. We only took a small percentage of the profit on a successful checkout, so we earned only when our members did. It was the first time I productized a service and tied the price directly to the outcome.",
      "At its peak Profit Paradise had 200 members paying $35 a month, roughly $7,000 in monthly recurring revenue, and by 2023 the server had grown past 3,500 people. We made it free in 2023, and it was acquired.",
      "The number I am proudest of is not ours. Our members collectively made over $2.1 million in profit from what we taught and sourced for them. That is the whole thesis, and it has shaped every company since, from Mocean to today: when you genuinely have the edge, you package it, distribute it, and take a small cut of the upside everyone else makes. Profit Paradise is where I learned that teaching and distribution beat hoarding the secret.",
    ],
    logo: { src: "/ventures/profit-paradise.png", alt: "Profit Paradise logo" },
  },
  {
    slug: "ocean-supply",
    name: "Ocean Supply",
    oneLiner: "Sneaker arbitrage, my first real operation.",
    era: "Early venture, started at 16",
    note: "Where the ocean theme on this whole site comes from. I was buying 20 to 50 pairs of low-cost sneakers every week and flipping them for $10 to $20 a pair. Joined every Discord server that posted discount codes and early releases, including paid ones. It was arbitrage in the most literal sense: buying mispriced, selling into demand. The lesson that shaped everything after: the edge was the signal, not the shoe.",
    storyParagraphs: [
      "Ocean Supply is where the ocean theme on this whole site comes from, but the story starts before it. My first real business was selling candy out of my bunk at sleepaway camp, buying the giant combo packs at Target with my dad before each summer and reselling them to the other campers. My first actual job was washing dishes at a local supermarket, up at six every Saturday and Sunday for about four years. It taught me one thing very clearly: I never wanted to make money with my hands again.",
      "So at 16 I moved to sneakers. My friend Peter was already a serious reseller, he had bought a Range Rover with his own money in high school, and he taught me brick arbitrage. I would buy 20 to 50 pairs of low-cost sneakers a week and flip them for $10 to $20 a pair, sourcing drops and discount codes from a stack of Discord servers, some of which I paid to get into. It was arbitrage in the most literal sense: buy mispriced, sell into demand.",
      "The real lesson was that the edge was never the shoe, it was the signal: knowing which codes and which drops actually mattered before everyone else did. That insight still runs through everything I build. And at 18, when I realized I would rather help a thousand people make money than keep flipping shoes myself, Ocean Supply became Profit Paradise.",
    ],
    logo: { src: "/ventures/ocean-supply.png", alt: "Ocean Supply logo" },
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
  /** When set, the case study shows a bright "View Demo" button to this route. */
  demoHref?: string;
}

export const BUILDS: readonly Build[] = [
  {
    slug: "riptide",
    name: "Riptide Research",
    hook: "An agentic equity-research terminal that researches in distributions, not price targets.",
    demoHref: "https://riptide.matthewoshin.com",
    summary:
      "Every research tool ships a single number where the honest answer is a distribution. Riptide takes the live options chain, derives the market's full risk-neutral distribution, and puts my own Bull/Base/Bear view on the same axis, shading the gap between them as expected value and a half-Kelly size. On top of that sits an agentic layer: a Model Lab to author and save my own models, an Edge Radar that scans the whole universe for names where a model's distribution most disagrees with what options are pricing, and a Model Arena that overlays the market, my view, the Street, and an AI analyst on one axis and then grades which of them has actually been right. The quant engine is verified, dependency-free TypeScript with unit tests; the AI analyst is anchored to the implied base rate so it can't free-run overconfident.",
    highlights: [
      "Verified quant engine in pure, dependency-free TypeScript: Black-Scholes, the Breeden-Litzenberger risk-neutral density, expected move, EV, and Kelly, all unit-tested.",
      "Model Lab: author, save, and reload my own probabilistic models, with the expected value and half-Kelly size recomputing live.",
      "Edge Radar: an agentic scan that ranks the universe by where a model's distribution diverges most from the options market, the gaps a single price target hides.",
      "Model Arena: the market, my view, the Street, and an AI analyst overlaid on one axis, with a Brier-score scoreboard that grades which model has actually been calibrated.",
      "Honest math: the implied density is labeled risk-neutral (Q), not real-world (P), with the volatility risk premium surfaced instead of mislabeled.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "d3", "Claude (anchored AI analyst)", "Options math"],
    status: "Live",
  },
  {
    slug: "galactic-signals",
    name: "Galactic Signals",
    hook: "Cross-asset monitoring for retail investors and online communities, sold through a feed marketplace and built toward the AI agent data layer that sits underneath it.",
    demoHref: "/app/galactic-signals",
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
    stack: ["TypeScript", "React 19", "Next.js 16", "Tailwind v4", "Node.js", "Prisma", "Python workers", "PostgreSQL", "PgBouncer", "NextAuth", "Stripe", "Resend", "Sentry", "Docker"],
    status: "Current build",
  },
  {
    slug: "icr-intelligence",
    name: "Financial Communications Platform",
    hook: "An AI platform for investor relations, PR, and capital-markets teams: earnings prep, peer and investor intelligence, crisis command, and on-voice drafting in one workspace.",
    demoHref: "/app/icr-intelligence",
    summary:
      "A single workspace for the work an investor-relations, PR, and capital-markets team does: earnings prep, peer and investor intelligence, crisis response, governance and activism monitoring, IPO readiness, and on-voice drafting, all grounded in live market data. Twelve modules sit on a Postgres brain fed by SEC EDGAR, FMP, FRED, Polygon, and other sources, with an AI layer on Anthropic Claude doing streaming generation, tool use, and retrieval over filings. I designed and shipped it as the in-house AI platform at a leading financial-communications firm, prototyping most of it solo on Claude Code. This is a faithful recreation on sample data: every company, figure, holder, and filing in the demo is fictional.",
    highlights: [
      "Earnings Hub: AI prep briefs, predicted analyst Q&A, a live earnings-call simulator, post-call analysis, and consensus tracking in one workspace.",
      "Intelligence suite: investor targeting with 13F and ownership tracking, peer benchmarking with transcript mining, and conference prep.",
      "Crisis Command: simulate a scenario, forecast market and media impact, and generate the full response playbook in minutes.",
      "Corporate Comms: on-voice press-release drafting across ten templates plus a narrative-consistency checker across documents.",
      "Grounded in live data: SEC EDGAR, FMP, FRED, Polygon, Finnhub, and more, behind an Anthropic Claude AI layer with tool use and retrieval over filings.",
      "Built largely solo on Claude Code: Next.js 16, React 19, Supabase Postgres, and Prisma, deployed on Vercel.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Anthropic Claude", "Supabase", "Prisma", "PostgreSQL", "SEC EDGAR", "Vercel"],
    status: "Production build",
  },
  {
    slug: "sonar",
    name: "Sonar Media",
    hook: "Real-time media monitoring you build in plain English. Describe what to watch and AI assembles the agentic workflow that watches it for you.",
    demoHref: "/app/sonar",
    summary:
      "Investor-relations and communications teams drown in signal: a story that moves the stock can break on SEC EDGAR, a newswire, a regulator's feed, or social, and legacy monitoring makes you hand-write boolean queries to catch it. Sonar Media flips that. You describe what you care about in a sentence, an LLM resolves it into a validated monitor spec, and you dry-run it against the last 48 hours before it ever fires. Matches arrive tagged with the source, a sentiment read, the terms that hit, and a one-line summary of why it matters, gated by severity and capped so they never flood you. I built this as the media-intelligence layer of an enterprise platform: thousands of sources, an AI relevance gate to kill noise, and per-workspace AI-spend caps so a monitoring run never becomes a surprise bill.",
    highlights: [
      "A plain-English monitor builder: an LLM turns a sentence into a validated, schema-checked spec (entities, keywords, sources, cadence, delivery), with no boolean syntax.",
      "A 48-hour dry run that replays real history, so a monitor earns trust before a single alert goes out.",
      "A cheap AI relevance gate on every candidate match, so delivered alerts are the real story and not every keyword hit.",
      "Severity gating and per-monitor flood caps: instant for the urgent, digest for the rest, with AI spend tracked per model and capped per workspace.",
      "Source-grade coverage across SEC EDGAR, the wires, regulators, social, and cyber feeds, parsed in near real time.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Claude (Opus, Sonnet, Haiku)", "Zod", "Async workers", "PostgreSQL"],
    status: "Recent build",
  },
  {
    slug: "sec-intelligence",
    name: "SEC Intelligence",
    hook: "A real-time SEC-filing intelligence terminal for financial professionals. Every material filing the moment it lands, an AI analyst that reads it, and alerts routed to email, phone, or your own agents.",
    demoHref: "/app/sec-intelligence",
    summary:
      "Wealth managers and traders find out about a market-moving filing too late, after the price has already moved and the client has already seen it. SEC Intelligence watches EDGAR in real time, scores every filing for materiality, and has an AI analyst read each one in plain English: what changed, why it matters, and what to tell your clients, cited to the exact item. It is built for two roles from one product, a wealth-manager view of clients and exposure and a trader view of positions and speed. The signature is the channel router, which fans each alert to email, SMS, a phone call, or straight to your downstream AI agents over a webhook, by rules you set once. A theme tracker also scans every filing for AI exposure, so you see where the AI story is moving across your book.",
    highlights: [
      "A real-time filing feed across 8-K, 10-K/Q, S-1, Form 4, 13D/G, and proxy, filtered to your book and ranked by AI materiality.",
      "An AI read on every filing: a plain-English summary of what changed and why it matters, cited to the exact item, plus a diff against the prior filing.",
      "A role switch: a wealth-manager view of clients, exposure, and suitability, and a trader view of positions, the pre-market tape, and speed.",
      "The channel router: fan each alert to email, SMS, a phone call, push, or a downstream AI agent over a webhook or MCP, by rules you set once.",
      "Insider and ownership surveillance: Form 4 cluster buying, 13D activist stakes, and 13F rotation surfaced as signals, not noise.",
      "An AI theme tracker that scans filings for AI capex, AI-attach revenue, and AI risk-factor language across every name you follow.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Anthropic Claude", "SEC EDGAR", "Postgres + pgvector", "Twilio", "Resend"],
    status: "Current build",
  },
  {
    slug: "atrium",
    name: "Workplace AI",
    hook: "One calm workspace that unifies every internal tool (app hub, IT, HR, legal) with an AI layer on top that clears the busywork and shows you exactly what it handled.",
    demoHref: "/app/atrium",
    summary:
      "Corporate software is a junk drawer of disconnected portals: a separate app launcher, IT desk, HR system, and legal inbox, each with its own login and its own busywork. Workplace AI is my concept for fixing that, a single calm, consumer-grade workspace that unifies every internal tool and makes AI the connective tissue. It resolves common IT tickets, provisions app access by role, files expenses from receipts, and pre-reviews contracts before anyone sees them, then surfaces only what genuinely needs a person: an approval, a signature, a decision. Every screen shows what AI handled for you and the time it saved. This is a fully clickable design concept on fictional sample data, not a shipped product.",
    highlights: [
      "A unified employee home: an AI daily brief, a 'handled for you' automation feed with time saved, and a short list of only what needs you.",
      "An internal App Hub: every company app in one launcher with one-click SSO, request-access flows, and role-based recommendations.",
      "An Automations studio: describe a workflow in plain English, watch AI propose the steps and dry-run it against real history, then see the hours it saves.",
      "A self-service IT Hub that deflects and auto-resolves common issues, plus Legal with an AI first-pass contract review that flags risky clauses.",
      "An assistant that acts across every module: it files tickets, requests access, drafts documents, and deep-links you to where the work landed.",
      "The 'Aurora' design system: a light, glassmorphic theme hand-rolled with zero UI dependencies, fully scoped so it never touches the rest of the site.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Plus Jakarta Sans", "Hand-rolled SVG UI", "Anthropic Claude (concept)"],
    status: "Concept",
  },
  {
    slug: "vantage",
    name: "SecOps Command",
    hook: "A security and IT operations center run by autonomous agents: they triage alerts, contain threats, patch systems, and gather audit evidence, while a human supervises only the exceptions.",
    demoHref: "/app/vantage",
    summary:
      "SecOps Command is a concept build that turns the kind of internal command-center console I've built into a security and IT operations cockpit. It unifies the SOC and the NOC into one console, an incident queue, detections and ATT&CK coverage, threat intel, asset inventory, vulnerability management, network and service health, identity and access, and compliance, and puts a roster of autonomous agents on the front line. A Triage Agent enriches and auto-closes alert noise, a Phishing Responder revokes compromised sessions, a Patch Orchestrator stages and applies fixes in maintenance windows, a Threat Hunter opens incidents from weak signals, and a Compliance Auditor collects control evidence continuously. Every agent has an autonomy level and a full, append-only action audit. This is a clickable recreation on sample data: every host, IP, CVE, threat actor, and figure is fictional.",
    highlights: [
      "AI-triaged incident queue: agents summarize, score, and draft the response playbook before a human opens the ticket, with a full action timeline.",
      "Autonomous agent roster with per-agent autonomy levels (suggest, approve, auto), run history, success rates, and an append-only audit of every action taken.",
      "Unified SOC and IT ops: detections and ATT&CK coverage, threat intel and IOCs, asset inventory, a CVSS-scored vulnerability backlog, network and zero-trust posture, and identity risk in one console.",
      "Continuous compliance: SOC 2, ISO 27001, NIST, and PCI posture with agent-collected control evidence and audit-readiness scoring.",
      "A dark command-center interface designed from a research pass over real security consoles: severity-driven color, mono telemetry, deterministic SVG charts, a live threat map, and an ATT&CK coverage matrix.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Anthropic Claude", "Autonomous agents", "PostgreSQL"],
    status: "Concept demo",
  },
  {
    slug: "observly",
    name: "Observly",
    hook: "A two-sided marketplace that connects pre-meds with physicians for clinical shadowing, with booking and verified hour-tracking built in.",
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
    slug: "brachyclip",
    name: "BrachyClip",
    hook: "The brand, investor narrative, and web presence for a pre-clearance medical-device company: a marketing site plus a gated, approval-based investor portal.",
    demoHref: undefined,
    summary:
      "BrachyClip is a cancer medical-device company affiliated with Brown University and Rhode Island Hospital. I lead its marketing and AI as Chief AI Officer, and I built its entire digital presence from scratch under a hard FDA-compliance constraint. The public surface is a brand and marketing site for a device that cannot yet make clinical claims; behind it sits a gated investor portal on Next.js 16 with an approval-based access flow, so the Series A materials reach vetted investors and no one else. The work is as much positioning as it is engineering: building trust and a credible narrative for a pre-clearance device where every word is a regulatory decision.",
    highlights: [
      "Brand, positioning, and investor narrative built from scratch for a pre-clearance device, including the Series A story.",
      "A marketing site on the public web and a separate gated investor portal with an approval-based access flow, both on Next.js 16.",
      "FDA-compliant content treated as a hard design constraint, not an afterthought: what the site can and cannot claim shaped the IA.",
      "Driving AI integration into clinical and operational workflows alongside the marketing build.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase (gated access)", "Vercel"],
    status: "Current build",
  },
  {
    slug: "mtrain",
    name: "mTrain studio site",
    hook: "Marketing site and admin dashboard for a strength-and-wellness studio in Westport, CT.",
    demoHref: "/app/fitness-os",
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
    "Everything I've built, past and present: the AI products I'm shipping now, the web and client work I've delivered, and the ventures I founded and ran. Each one is a real bet on an edge, taken end to end from idea to shipped, never just a concept. Open any of them for the full case study.",
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
      "Codex",
      "Cursor",
      "pgvector",
      "Pinecone",
      "Ollama",
      "Local open models (Llama, Qwen, Hermes)",
      "Hugging Face",
      "Whisper",
      "Exa",
      "Firecrawl",
    ],
  },
  {
    title: "Languages & frameworks",
    items: [
      "Python",
      "JavaScript",
      "TypeScript",
      "C++",
      "Java",
      "PHP",
      "React",
      "React Native",
      "Node.js",
      "Laravel",
      "SQL",
    ],
  },
  {
    title: "Full-stack engineering",
    items: [
      "Next.js 16",
      "React 19",
      "Supabase",
      "Postgres + RLS",
      "Prisma",
      "Vercel",
      "Stripe",
      "Resend",
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
      "MongoDB",
      "Circuit breakers and rate limiting",
      "Market data APIs",
      "Docker and self-hosting",
      "GitHub Actions CI/CD",
      "d3 and Recharts",
      "AWS",
      "Azure",
      "n8n",
      "Playwright",
      "Sentry",
      "PostHog",
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

export interface School {
  school: string;
  detail: string;
  /** When set, the school gets a detail page at /education/[slug]. */
  slug?: string;
  /** Long-form, multi-paragraph story for the detail page. */
  storyParagraphs?: readonly string[];
}

export const EDUCATION: readonly School[] = [
  {
    slug: "michigan",
    school: "University of Michigan",
    detail: "B.A. Economics",
    storyParagraphs: [
      "I graduated from the University of Michigan in August 2025 with a B.A. in Economics. The degree gave me the lens I still build with: markets, incentives, and how value actually moves through a system.",
      "The bigger education ran in parallel. I was operating companies the entire time I was enrolled, usually remotely. Mocean scaled to an acquisition, Element Underground grew across multiple cities, and earlier ventures had already taught me how to find an edge and sell it. Michigan was the backdrop; building was the real major.",
      "Economics is also what pulled me toward markets directly, from an equity-research seat at Manatuck Hill to building Sigma, my distribution-first research terminal. The classroom gave me the vocabulary and the ventures gave me the reps.",
    ],
  },
  {
    slug: "washu",
    school: "Washington University in St. Louis",
    detail: "Entrepreneurship · freshman year",
    storyParagraphs: [
      "I started college at Washington University in St. Louis, and I gravitated straight to the entrepreneurship department. I was already running Profit Paradise, my first company, and two professors there took me under their wing: they helped me think about how to scale it and plugged me into the founder community in St. Louis.",
      "That year they selected me as the first freshman ever to speak at the department's alumni events, talking about building a real business while still in school. It was the first time I saw that the company I was running at night could stand next to anything in the classroom.",
      "I left after freshman year to take a gap year, both to spend time with my mom and because building had started to outrun school. That gap year is when Mocean was born, and I went on to finish my degree at the University of Michigan.",
    ],
  },
  { school: "Weston High School", detail: "Weston, Connecticut" },
] as const;

export const EDUCATION_META = {
  heading: "Where I studied.",
} as const;

/* -------------------------------------------------------------------------- */
/* INTERESTS                                                                   */
/* -------------------------------------------------------------------------- */

export interface Interest {
  title: string;
  detail: string;
}

export const INTERESTS: readonly Interest[] = [
  {
    title: "Markets and investing",
    detail:
      "I still write long-form theses for fun, the same buy-side loop I ran at Manatuck Hill: build a view, pressure-test it, size it. They range from a Meta bull case to a Constellation Brands valuation, and lately I track how AI infrastructure gets priced.",
  },
  {
    title: "A musician, first",
    detail:
      "I grew up playing saxophone and piano. Over time I taught myself to make rap beats and produce house music, and now I DJ for fun. The instruments came first, and everything since has grown out of that.",
  },
  {
    title: "Film and photography",
    detail:
      "I shoot on a Sony A7 IV and fly a DJI drone, chasing the intersection of film and photo. What I love is capturing a moment that holds up as both a still and a frame of motion.",
  },
  {
    title: "Sneakers, the origin story",
    detail:
      "Where all of this started. I was flipping sneakers at 16 with Ocean Supply, which is where I learned the edge was the signal, not the shoe. I still find the resale market and its lore, from Air Mags to release cycles, genuinely fascinating.",
  },
  {
    title: "Networking with other builders",
    detail:
      "I keep a real system for it: a running list of people I believe in and who think differently, with reminders to reconnect a few times a year. The Michigan network and the founders I have met along the way are some of my most valuable assets.",
  },
  {
    title: "Emerging tech on the frontier",
    detail:
      "I live on it for work and for fun, from building Claude-native agents to thinking about the agentic economy and where AI-native infrastructure goes next. My first company rode the crypto and NFT wave, so I have watched a few frontiers form up close.",
  },
  {
    title: "Competitive by default",
    detail:
      "I believe the air gets thinner the higher you aim, and that there is less competition at the top than most people assume. It shows up everywhere I build, from stacking ventures in college to treating every event and product like something to win.",
  },
  {
    title: "Real estate and small businesses",
    detail:
      "Outside software I am drawn to real assets and the unglamorous businesses that quietly compound. I have an eye on Miami and on the tools that make small and mid-sized businesses run better.",
  },
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
