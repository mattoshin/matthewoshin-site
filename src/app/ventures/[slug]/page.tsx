import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VENTURES } from "@/data/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return VENTURES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const venture = VENTURES.find((v) => v.slug === slug);
  if (!venture) return { title: "Venture not found" };
  return {
    title: venture.name,
    description: venture.oneLiner,
  };
}

const ACQUIRED_SLUGS = ["mocean", "profit-paradise", "resell-network"];

export default async function VenturePage({
  params,
}: { params: Params }) {
  const { slug } = await params;
  const venture = VENTURES.find((v) => v.slug === slug);
  if (!venture) notFound();

  const wasAcquired = ACQUIRED_SLUGS.includes(slug);

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--deep-top), var(--abyss-body) 55%, var(--abyss-void))",
        }}
      />

      <main className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-bio-cyan hover:underline"
        >
          <span aria-hidden="true">&lt;-</span> Back to ventures
        </Link>

        <header className="mt-8">
          {venture.logo && (
            <div className="mb-5 inline-flex h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:h-20 sm:w-20">
              <Image
                src={venture.logo.src}
                alt={venture.logo.alt}
                width={160}
                height={160}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {venture.era}
            </span>
            {wasAcquired && (
              <span className="rounded-full border border-reef-coral/40 bg-reef-coral/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-reef-coral">
                Founded and acquired
              </span>
            )}
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink-heading sm:text-6xl">
            {venture.name}
          </h1>
          <p className="mt-4 text-lg text-ink-body sm:text-xl">{venture.oneLiner}</p>
          {venture.demoHref && (
            <Link
              href={venture.demoHref}
              className="btn-demo mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-wider"
            >
              View Demo <span aria-hidden="true">-&gt;</span>
            </Link>
          )}
        </header>

        {venture.video && <InterviewVideo video={venture.video} />}

        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
            The story
          </h2>
          {venture.storyParagraphs ? (
            <div className="measure mt-4 space-y-4 text-base leading-relaxed text-ink-body sm:text-lg">
              {venture.storyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : (
            <p className="measure mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
              {venture.note}
            </p>
          )}
        </section>

        {venture.quotes && venture.quotes.length > 0 && (
          <InWords quotes={venture.quotes} />
        )}

        {slug === "mocean" && <MoceanEngine />}

        {slug === "profit-paradise" && <TestimonialWall />}

        <KeyNumbers slug={slug} />

        <WhatILearned slug={slug} />

        <footer className="mt-16 border-t border-white/10 pt-8">
          <Link
            href="/#contact"
            className="font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-bio-cyan"
          >
            Want to talk about this? Surface a signal -&gt;
          </Link>
        </footer>
      </main>
    </div>
  );
}

function KeyNumbers({ slug }: { slug: string }) {
  const numbers: Record<string, { label: string; value: string }[]> = {
    mocean: [
      { label: "All-time revenue", value: "$400K+" },
      { label: "Peak monthly revenue", value: "~$60K/month" },
      { label: "Total users", value: "100,000+" },
      { label: "Investor communities served", value: "1,000+" },
      { label: "Analyst team size", value: "40+" },
      { label: "First month, solo", value: "$12K" },
      { label: "Per-client pricing", value: "$500–$2,000/mo" },
      { label: "Outcome", value: "Acquired May 1, 2023" },
    ],
    "element-underground": [
      { label: "Total attendees", value: "17,000+" },
      { label: "All-time revenue", value: "$117,000+" },
      { label: "Shows produced", value: "50+" },
      { label: "Peak team size", value: "40+" },
      { label: "Social media views (2025)", value: "1,540,000" },
      { label: "NYC debut profit (The Crown)", value: "$5,000+" },
      { label: "RSVPs for Music for a While", value: "1,200+" },
      { label: "Cities", value: "NYC, Miami, Boston, Ann Arbor" },
    ],
    "profit-paradise": [
      { label: "Peak paying members", value: "200" },
      { label: "Peak monthly recurring revenue", value: "$7,000/month" },
      { label: "Total server members by 2023", value: "3,500+" },
      { label: "Member profits generated", value: "$2.1M+" },
      { label: "Subscription price", value: "$35/month" },
      { label: "Outcome", value: "Acquired" },
    ],
    "ocean-supply": [
      { label: "Weekly volume", value: "20 to 50 pairs" },
      { label: "Margin per pair", value: "$10 to $20" },
      { label: "Age started", value: "16" },
    ],
    "resell-network": [
      { label: "Total Discord members", value: "11,000+" },
      { label: "Community make-up", value: "100s of groups, 1,000s of resellers" },
      { label: "Growth method", value: "100% organic" },
      { label: "Monetization", value: "Paid plugs + ad partnerships" },
      { label: "Outcome", value: "Sold as part of Mocean deal" },
    ],
  };

  const data = numbers[slug];
  if (!data) return null;

  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        Key numbers
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {data.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
          >
            <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {label}
            </dt>
            <dd className="mt-1 font-display text-xl font-semibold text-ink-heading">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function WhatILearned({ slug }: { slug: string }) {
  const lessons: Record<string, string[]> = {
    mocean: [
      "Distribution beats production. I had 40-plus analysts producing alpha, but the real moat was the software that let me mirror it across 1,000 communities simultaneously.",
      "The edge in research is packaging and delivery, not just the insight. Anyone can write a good thesis. Not everyone can get it to 100,000 people at once.",
      "Founding a company during personal hardship (ACL recovery, mom's ALS) showed me that necessity is a sharper motivator than opportunity.",
    ],
    "element-underground": [
      "Do the service, keep the asset. We retained rights to every photo and video, so each event built our owned media library instead of someone else's.",
      "Brand exclusivity compounds. Positioning around curated, underground, and female-forward DJ sets in a sea of generic events created real differentiation.",
      "Ops is the actual product at events. Venue negotiation, logistics, and legal infrastructure determine whether you profit or just break even.",
    ],
    "profit-paradise": [
      "When you know the edge, teach it. Our 200 paying members generated $2.1M+ in profits from what we shared, which proved the value of the intelligence more than our own P&L.",
      "Recurring revenue is a fundamentally different business than one-time sales. $35/month times 200 members is a real business.",
      "Community is defensible. Our server grew to 3,500 members even after we made it free, because the relationships stuck.",
    ],
    "ocean-supply": [
      "The edge was the signal, not the shoe. I learned early that information asymmetry, knowing which discount codes and drops mattered, was the actual business.",
      "Arbitrage is the purest form of edge. Buy mispriced, sell into demand. That logic still runs through everything I build.",
      "Starting at 16 taught me that you don't need permission or credentials to build a real operation.",
    ],
    "resell-network": [
      "A dense network is the kind of asset that looks quiet from the outside but compounds for years. 11,000 Discord members built organically is more valuable than a bought list of 100,000.",
      "Infrastructure that connects people in an industry is sticky. The relationships formed in that server outlasted the community itself.",
      "Selling as part of a larger deal showed me how assets can have different values to different buyers.",
    ],
  };

  const data = lessons[slug];
  if (!data) return null;

  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        What this taught me
      </h2>
      <ul className="mt-4 space-y-4">
        {data.map((lesson) => (
          <li key={lesson} className="flex gap-4 text-base text-ink-body">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-reef-coral/70" />
            {lesson}
          </li>
        ))}
      </ul>
    </section>
  );
}

type VentureVideo = {
  youtubeId: string;
  title: string;
  source: string;
  date: string;
  href: string;
  blurb: string;
};

function InterviewVideo({ video }: { video: VentureVideo }) {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        Watch the story
      </h2>
      <figure className="mt-4">
        {/* Responsive 16:9 player. youtube-nocookie + lazy so it never blocks the
            page and sets no cookies until the visitor presses play. */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)]">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            title={video.title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-ink-muted">
          <a
            href={video.href}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-bio-cyan hover:underline"
          >
            {video.source}
          </a>
          <span aria-hidden="true" className="text-ink-faint">
            ·
          </span>
          <span>{video.date}</span>
        </figcaption>
      </figure>
      <p className="measure mt-3 text-sm leading-relaxed text-ink-muted">{video.blurb}</p>
    </section>
  );
}

function InWords({ quotes }: { quotes: readonly string[] }) {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        From the interview
      </h2>
      <div className="mt-5 space-y-6">
        {quotes.map((q) => (
          <blockquote key={q} className="border-l-2 border-bio-cyan/50 pl-5">
            <p className="font-display text-xl italic leading-snug text-ink-heading sm:text-2xl">
              &ldquo;{q}&rdquo;
            </p>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

/**
 * The Mocean "engine" block: a real (redacted) Python monitor plus the full
 * fleet of 33 monitors, as an engineering proof-point that the moat was software.
 */
type CodeTok = { t: string; c?: "comment" | "str" };

const ETH_MINTS_PY: CodeTok[][] = [
  [{ t: "# Pull every collection minting today from rarity.tools", c: "comment" }],
  [{ t: "r = requests.get(" }, { t: '"https://collections.rarity.tools/upcoming2"', c: "str" }, { t: ").json()" }],
  [{ t: "" }],
  [{ t: "desc = " }, { t: '""', c: "str" }],
  [{ t: "for drop in r:" }],
  [{ t: "    if drop[" }, { t: '"Sale Date"', c: "str" }, { t: "] == today:" }],
  [{ t: "        desc += " }, { t: "f\"{drop['Project']} -> {drop['Website']}\\n\"", c: "str" }],
  [{ t: "" }],
  [{ t: "# Push a branded embed straight into every client server", c: "comment" }],
  [{ t: "requests.post(WEBHOOK_URL, json={" }],
  [
    { t: "    " },
    { t: '"embeds"', c: "str" },
    { t: ": [{" },
    { t: '"title"', c: "str" },
    { t: ": " },
    { t: '"ETH Mints"', c: "str" },
    { t: ", " },
    { t: '"description"', c: "str" },
    { t: ": desc}]" },
  ],
  [{ t: "})" }],
];

const MONITOR_GROUPS: { group: string; items: readonly string[] }[] = [
  {
    group: "NFT mints & sales",
    items: ["eth-mints", "free-mints", "hourly-mints", "hourly-sales", "trending-collections", "upcoming-drops", "crypto-punks", "top-buyers"],
  },
  {
    group: "Crypto markets",
    items: ["coingecko-marketcap", "coingecko-rockets", "coingecko-dumps", "coinmarketcap", "exchanges", "volume-traded", "top-sellers", "currencies"],
  },
  {
    group: "Equities & macro",
    items: ["dow", "nasdaq", "spy-monitor", "gold", "oil", "bonds", "company-holdings", "top-stock-gainers"],
  },
];

function MoceanEngine() {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        Under the hood
      </h2>
      <p className="measure mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
        Mocean&rsquo;s moat was software. I built a fleet of custom monitors in Python that
        scraped NFT mints, crypto markets, and equities in real time and pushed branded,
        formatted alerts straight into client Discord servers through webhooks. Here is one of
        them, lightly trimmed.
      </p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-reef-coral/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-bio-cyan/50" />
          <span className="ml-2 font-mono text-xs text-ink-muted">eth-mints.py</span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            Mocean monitor
          </span>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-xs leading-relaxed sm:text-[13px]">
          <code className="whitespace-pre text-ink-body">
            {ETH_MINTS_PY.map((line, i) => (
              <div key={i}>
                {line.length === 1 && line[0].t === ""
                  ? " "
                  : line.map((tok, j) => (
                      <span
                        key={j}
                        className={
                          tok.c === "comment"
                            ? "text-ink-faint italic"
                            : tok.c === "str"
                              ? "text-bio-cyan/70"
                              : undefined
                        }
                      >
                        {tok.t}
                      </span>
                    ))}
              </div>
            ))}
          </code>
        </pre>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {MONITOR_GROUPS.map(({ group, items }) => (
          <div key={group} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-bio-cyan/70">
              {group}
            </div>
            <ul className="mt-3 space-y-1.5">
              {items.map((m) => (
                <li key={m} className="font-mono text-xs text-ink-muted">
                  {m}.py
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-xs text-ink-faint">
        33 monitors. One engine. Over 100,000 readers a day.
      </p>
    </section>
  );
}

/**
 * The Profit Paradise community wall: real member testimonials from the server's
 * #testimonials channel, lightly trimmed, in two rows that auto-scroll opposite
 * directions (a "rotating scroll wheel"). Handles are the members' own public
 * Discord names. The marquee animation lives in globals.css.
 */
const TESTIMONIALS: { handle: string; quote: string }[] = [
  {
    handle: "WayneDang",
    quote:
      "The owner is friendly and helpful, you can DM him anytime and get a fast response. The info is exact: early links, brick flips. The cheapest group I ever joined, and the team is the best.",
  },
  {
    handle: "UziFBA",
    quote:
      "I started as an eBay seller at 13 and got into shoes at 14. I had no idea where to start, and this group helped me reach my highest potential. One of the most generous cook groups ever.",
  },
  {
    handle: "louieeovo",
    quote:
      "I've been reselling since I was 16, I'm 33 now with four kids, and this group made real money for my family. When I hit a rough patch, Ocean gave me a lifetime membership out of nowhere.",
  },
  {
    handle: "YB",
    quote:
      "COP the membership, folks. A group full of cookers always keeping you up to date on the game. No regrets, never losing my key.",
  },
  {
    handle: "Fklic",
    quote:
      "This group has helped me tremendously. Great knowledge, great ACOs, and support is always available.",
  },
  {
    handle: "Anonymous",
    quote:
      "The only cook group I knew of with an NFT section. I followed their guides and made over $3K on an NFT in my first month in the group.",
  },
  {
    handle: "Colt",
    quote:
      "Love this server. It tells me what's hot on the market and where to buy it. Would recommend you join, it's worth it.",
  },
];

function TestimonialCard({ handle, quote }: { handle: string; quote: string }) {
  return (
    <figure className="mr-4 flex w-72 shrink-0 flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:w-80">
      <blockquote className="text-sm leading-relaxed text-ink-body">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bio-cyan/15 font-mono text-[11px] font-semibold uppercase text-bio-cyan">
          {handle.slice(0, 2)}
        </span>
        <span className="font-mono text-xs text-ink-muted">{handle}</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          Profit Paradise
        </span>
      </figcaption>
    </figure>
  );
}

function TestimonialWall() {
  const rowA = TESTIMONIALS.slice(0, 4);
  const rowB = TESTIMONIALS.slice(3);
  const fade = {
    maskImage:
      "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
    WebkitMaskImage:
      "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
  } as const;
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        From the community
      </h2>
      <p className="measure mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
        Profit Paradise lived or died on one thing: whether members actually made money.
        Here is what they said, lightly trimmed, in the server&rsquo;s testimonials channel.
      </p>
      <div className="marquee-wall relative mt-6 flex flex-col gap-4 overflow-hidden" style={fade}>
        <div className="marquee-track flex w-max">
          {[...rowA, ...rowA].map((t, i) => (
            <TestimonialCard key={`a-${i}`} {...t} />
          ))}
        </div>
        <div className="marquee-track marquee-track--reverse flex w-max">
          {[...rowB, ...rowB].map((t, i) => (
            <TestimonialCard key={`b-${i}`} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
