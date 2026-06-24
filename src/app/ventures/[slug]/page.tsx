import { Fragment } from "react";
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

        {slug === "resell-network" && <ResellMarketplace />}

        {slug === "element-underground" && <ElementCircuit />}

        {slug === "ocean-supply" && <OceanSupplyLoop />}

        {slug === "ocean-supply" && <OceanSupplyReel />}

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
      { label: "Community make-up", value: "Group owners, freelancers, developers" },
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
    handle: "louieeovo",
    quote:
      "I've been reselling since I was 16, I'm 33 now with four kids, and this group made real money for my family. When I hit a rough patch, Ocean gave me a lifetime membership out of nowhere. God bless.",
  },
  {
    handle: "UziFBA",
    quote:
      "I started as an eBay seller at 13 and got into shoes at 14. This group helped me reach my highest potential, and Ocean legit gifted me lifetime. One of the most generous cook groups ever.",
  },
  {
    handle: "mattyice",
    quote:
      "Joining Profit Paradise will be one of the best decisions you ever make, the best cook group I've ever been in. Keep working hard, Ocean. I appreciate everything you've done for me and this community.",
  },
  {
    handle: "ayusuf16",
    quote:
      "I joined knowing nothing about reselling, and the staff helped me grow so much. Joining Profit Paradise was one of the best decisions I've ever made. So happy to be part of this family.",
  },
  {
    handle: "remmynyc",
    quote:
      "Less than 24 hours in and I could already see the work ethic of the staff and owner. Not many owners go out of their way to make sure you're comfortable, but Ocean took the time to.",
  },
  {
    handle: "Tweezerss",
    quote:
      "This is literally the best cook group I've ever seen. The owners are so freaking helpful, constantly trying to help us make money. Even when the market is dead, they help you find cash.",
  },
  {
    handle: "Blankaultra1",
    quote:
      "Ocean is a motivated leader who comes up with amazing giveaways and group buys. Thank you for the NBA Top Shot win!",
  },
  {
    handle: "Chase shhh",
    quote:
      "One of the best groups I've ever been in. The owner is active in the server, and you'll probably be in a voice call with him your first week. This group is going to be big. No doubt.",
  },
  {
    handle: "MYST",
    quote:
      "Great group. I spend more time with them than my family. I waited two months to join because I didn't think it was worth it, then joined and they helped me cop so much.",
  },
  {
    handle: "WayneDang",
    quote:
      "The owner is friendly and helpful, you can DM him anytime and get a fast response. The cheapest group I ever joined, and the team is the best.",
  },
  {
    handle: "HK",
    quote:
      "Definitely worth the money. I joined two weeks ago and made the monthly fee back in two days. Utilize all the resources. I appreciate the support and admins. Much love.",
  },
  {
    handle: "axcn",
    quote:
      "Profit Paradise introduced me to the botting world. So many successful cops, including a PS5 and a 3070 Ti. Worth every bit of the small fee. Best group ever.",
  },
  {
    handle: "Sobail",
    quote:
      "From experience, this is the cook group you want to join. I've been in tons of top-tier groups and none of them are like Profit Paradise. If you don't join, you don't like making money.",
  },
  {
    handle: "squire8016",
    quote:
      "I do this with my kids and wife, and we compete over who wins on each drop. Family-focused admins. This group helped us cover all the extras for our family the budget didn't have room for.",
  },
  {
    handle: "Denny_P",
    quote:
      "I've already felt more at home than I have with any other cook group. The price is awesome, the info is on point, and they're always teaching me something new. This group is OP.",
  },
  {
    handle: "bobbytwogee",
    quote:
      "After taking L after L, I got connected with Profit Paradise and finally got my bag up. The staff and members support each other, from market advice to bot support. Always good vibes here.",
  },
  {
    handle: "Rainmankicks",
    quote:
      "Since joining, my cops have increased tremendously. The auto-fill, early links, and free caps are unreal. I made my money back easily. If you're looking to make money, this is the group.",
  },
  {
    handle: "Sanada",
    quote:
      "I joined a month ago and have already hit three or four group buys. The admins actually help and answer you, unlike other discords. With the giveaways and ACOs, you can't lose in here.",
  },
  {
    handle: "xp1r4te",
    quote:
      "Hands down one of my favorites. It offers things you didn't know you were missing and a bunch of ways to make money. The community is welcoming and always there for support.",
  },
  {
    handle: "Apaulo",
    quote:
      "This is the ultimate start to this community. With the guides, the support, and the involvement, you don't really need any other group. Everything but the kitchen sink.",
  },
  {
    handle: "Ouroborosk",
    quote:
      "I'm new to reselling, but Profit Paradise made it feel like a breeze. The team really cares about you, a genuine one-on-one treatment. I had such a good time that I feel I owe them.",
  },
  {
    handle: "TheLastGinger",
    quote:
      "I'm really surprised at how great this group turned out to be. Partnered servers, a ton of documentation, even a bot group buy, all in my first week. Looking forward to the next one.",
  },
  {
    handle: "sayf",
    quote:
      "Ever since I joined, my chances of getting what I want have gone way up. I've cooked a lot: a box-logo hoodie, Supreme, a Smurf skateboard. I don't regret joining, and I'm staying.",
  },
  {
    handle: "MDIGN",
    quote:
      "If you're looking for a reasonably priced group with constant group buys on solid, proven bots, ProfitParadise is the place to be.",
  },
  {
    handle: "Fklic",
    quote:
      "This group has helped me tremendously. Great knowledge, great ACOs, and support is always available.",
  },
  {
    handle: "Fernandixx",
    quote:
      "Best staff ever. Profit Paradise is going to be one of the best cook groups this year.",
  },
  {
    handle: "YB",
    quote:
      "COP the membership, folks. A group full of cookers always keeping you up to date on the game. No regrets, never losing my key.",
  },
  {
    handle: "Colt",
    quote:
      "Love this server. It tells me what's hot on the market and where to buy it. Would recommend you join, it's worth it.",
  },
  {
    handle: "depresso",
    quote: "Great support team.",
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
  // Best-first order is preserved within each row by splitting on even/odd
  // index, so both rows open with the strongest testimonials.
  const rowA = TESTIMONIALS.filter((_, i) => i % 2 === 0);
  const rowB = TESTIMONIALS.filter((_, i) => i % 2 === 1);
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

/* -------------------------------------------------------------------------- */
/* Resell Network: "The marketplace" - the real Discord channel map, proving   */
/* it was the town square of the reselling industry.                           */
/* -------------------------------------------------------------------------- */
const RESELL_MAP: { group: string; channels: readonly string[] }[] = [
  { group: "Infrastructure & fulfillment", channels: ["bot-rental", "servers", "discount-codes"] },
  { group: "Bots & monitors", channels: ["discord-bots", "twitter-monitors", "retail-monitors"] },
  { group: "PR & marketing", channels: ["social-media-mgmt", "group-pr", "influencer"] },
  { group: "Designers", channels: ["graphic-designers"] },
  { group: "Developers", channels: ["developers"] },
  { group: "Marketplace", channels: ["wtb-digital", "wts-digital"] },
];

const RESELL_STATS = [
  { v: "11,000+", l: "members" },
  { v: "100%", l: "organic growth" },
  { v: "~4 yrs", l: "compounded" },
  { v: "Acquired", l: "with Mocean" },
];

function ResellMarketplace() {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        The marketplace
      </h2>
      <p className="measure mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
        Resell Network was not a feed, it was a floor: 11,000 people and every service the
        reselling industry runs on, in one room. Channel by channel, this is how the marketplace
        was laid out.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RESELL_MAP.map(({ group, channels }) => (
          <div key={group} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-bio-cyan/70">
              {group}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {channels.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-ink-muted"
                >
                  #{c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {RESELL_STATS.map(({ v, l }) => (
          <div
            key={l}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center"
          >
            <dt className="font-display text-2xl font-semibold text-ink-heading">{v}</dt>
            <dd className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {l}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-mono text-xs text-ink-faint">
        Monetized through paid plugs and ad partnerships. Sold in the Mocean deal, 2023.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Element Underground: "The circuit" - the events-to-media-agency arc + the   */
/* numbers behind it.                                                          */
/* -------------------------------------------------------------------------- */
const ELEMENT_ARC = [
  { tag: "2023", title: "Rooftops", body: "Free parties in Ann Arbor, built to grow the brand." },
  { tag: "Scale", title: "The circuit", body: "Ticketed shows across NYC, Miami, and Boston." },
  { tag: "Now", title: "Media company", body: "Turned a live-events audience into a content engine: cinematic, multi-camera nightlife film." },
];

const ELEMENT_STATS = [
  { v: "1.5M+", l: "views in 2025" },
  { v: "17,000+", l: "attendees" },
  { v: "50+", l: "shows produced" },
  { v: "4", l: "cities" },
  { v: "40+", l: "team at peak" },
];

function ElementCircuit() {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        The circuit
      </h2>
      <p className="measure mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
        Element started as free rooftop parties and became a media company. The arc, and the
        numbers behind it.
      </p>
      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {ELEMENT_ARC.map((p, i) => (
          <Fragment key={p.title}>
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-bio-cyan/70">
                {p.tag}
              </div>
              <div className="mt-1 font-display text-lg font-semibold text-ink-heading">
                {p.title}
              </div>
              <p className="mt-1 text-sm text-ink-muted">{p.body}</p>
            </div>
            {i < ELEMENT_ARC.length - 1 && (
              <span
                aria-hidden="true"
                className="mx-auto rotate-90 font-mono text-bio-cyan/50 sm:rotate-0"
              >
                -&gt;
              </span>
            )}
          </Fragment>
        ))}
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {ELEMENT_STATS.map(({ v, l }) => (
          <div
            key={l}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center"
          >
            <dt className="font-display text-xl font-semibold text-ink-heading">{v}</dt>
            <dd className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {l}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-mono text-xs text-ink-faint">
        Now shooting cinematic, multi-camera film at Club Space, the Brooklyn Storehouse, and a
        museum in LA.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Ocean Supply: "The arbitrage loop" - the repeatable model + the lineage     */
/* into everything after.                                                      */
/* -------------------------------------------------------------------------- */
const OCEAN_LOOP = [
  { n: "01", title: "Source the signal", body: "A private network of sourcing signals on what was about to be mispriced." },
  { n: "02", title: "Buy mispriced", body: "20 to 50 pairs a week, bought below market." },
  { n: "03", title: "Flip into demand", body: "$10 to $20 of profit on every pair." },
  { n: "04", title: "Reinvest", body: "Compound the float and run it again." },
];

const OCEAN_CHAIN = ["Candy at camp", "Dishwasher", "Ocean Supply", "Profit Paradise"];

function OceanSupplyLoop() {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        The arbitrage loop
      </h2>
      <p className="measure mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
        The whole business was one loop, run every week from the age of 16. The edge was never the
        shoe. It was the signal: knowing what was mispriced before anyone else did.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OCEAN_LOOP.map(({ n, title, body }) => (
          <div key={n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="font-mono text-sm font-semibold text-bio-cyan/70">{n}</div>
            <div className="mt-2 font-display text-base font-semibold text-ink-heading">
              {title}
            </div>
            <p className="mt-1 text-sm text-ink-muted">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
        {OCEAN_CHAIN.map((step, i) => (
          <Fragment key={step}>
            <span className={i === OCEAN_CHAIN.length - 1 ? "text-bio-cyan/80" : undefined}>
              {step}
            </span>
            {i < OCEAN_CHAIN.length - 1 && (
              <span aria-hidden="true" className="text-bio-cyan/50">
                -&gt;
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Ocean Supply: "The flips" - a rotating reel of the real pairs from the      */
/* Ocean Supply Instagram, two rows scrolling opposite directions.            */
/* -------------------------------------------------------------------------- */
const OCEAN_FLIPS = Array.from({ length: 11 }, (_, i) => `/ventures/ocean-supply-flips/os-${i + 1}.jpg`);

function FlipCard({ src }: { src: string }) {
  return (
    <div className="mr-4 h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:h-44 sm:w-44">
      <Image
        src={src}
        alt="A pair flipped through Ocean Supply"
        width={400}
        height={400}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function OceanSupplyReel() {
  const rowA = OCEAN_FLIPS.filter((_, i) => i % 2 === 0);
  const rowB = OCEAN_FLIPS.filter((_, i) => i % 2 === 1);
  const fade = {
    maskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
    WebkitMaskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
  } as const;
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
        The flips
      </h2>
      <p className="measure mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
        Real pairs that moved through the operation, straight off the Ocean Supply feed.
      </p>
      <div className="marquee-wall relative mt-6 flex flex-col gap-4 overflow-hidden" style={fade}>
        <div className="marquee-track flex w-max">
          {[...rowA, ...rowA].map((src, i) => (
            <FlipCard key={`a-${i}`} src={src} />
          ))}
        </div>
        <div className="marquee-track marquee-track--reverse flex w-max">
          {[...rowB, ...rowB].map((src, i) => (
            <FlipCard key={`b-${i}`} src={src} />
          ))}
        </div>
      </div>
    </section>
  );
}
