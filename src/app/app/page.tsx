import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "App demos",
  description:
    "Interactive, clickable demos of products Matthew Oshin has built, from Mocean to current work.",
};

/**
 * The demos hub at /app. A simple index of clickable product demos. Styled with
 * the site's own dark palette (the ocean canvas is gated off for /app/*), so it
 * reads as a native section of matthewoshin.com rather than any one product.
 */

type DemoCard = {
  slug: string;
  name: string;
  tagline: string;
  era: string;
  status: "live" | "soon";
  href?: string;
  caseStudy?: string;
  accent: string; // brand dot color
};

const DEMOS: DemoCard[] = [
  {
    slug: "mocean",
    name: "Mocean",
    tagline:
      "Discord-native B2B research SaaS. Subscribe to data feeds, wire each to a Discord channel, deliver alpha automatically.",
    era: "2021 to 2023 · Founded and acquired",
    status: "live",
    href: "/app/mocean-demo",
    caseStudy: "/ventures/mocean",
    accent: "#5ecdd1",
  },
  {
    slug: "galactic",
    name: "Galactic Signals",
    tagline:
      "A cross-asset monitoring marketplace for retail investors and online communities. Subscribe to feeds, wire a webhook, get branded real-time alerts, built toward the AI agent data layer beneath it.",
    era: "Current build",
    status: "live",
    href: "/app/galactic-signals",
    caseStudy: "/projects/galactic-signals",
    accent: "#1DD1A1",
  },
  {
    slug: "icr-intelligence",
    name: "Financial Communications Platform",
    tagline:
      "The AI platform for investor relations, PR, and capital markets: earnings prep, peer and investor intelligence, crisis command, and on-voice drafting in one console.",
    era: "2024 to 2026 · Production build",
    status: "live",
    href: "/app/icr-intelligence",
    caseStudy: "/projects/icr-intelligence",
    accent: "#0027b3",
  },
  {
    slug: "sonar",
    name: "Sonar Media",
    tagline:
      "Real-time media monitoring your team builds in plain English. Describe a monitor, AI wires up the agentic workflow, dry-run it over the last 48 hours, and it watches the internet for you.",
    era: "Recent build",
    status: "live",
    href: "/app/sonar",
    caseStudy: "/projects/sonar",
    accent: "#FFB224",
  },
  {
    slug: "sec-intelligence",
    name: "SEC Intelligence",
    tagline:
      "A real-time SEC-filing terminal for wealth managers and traders. Every material filing the moment it lands, an AI analyst that reads it for you, and alerts routed to email, phone, or your own agents.",
    era: "Current build",
    status: "live",
    href: "/app/sec-intelligence",
    caseStudy: "/projects/sec-intelligence",
    accent: "#3da9fc",
  },
  {
    slug: "atrium",
    name: "Workplace AI",
    tagline:
      "An unbranded concept: the corporate employee workspace, reimagined. An app hub, IT, legal, and HR in one calm place, with an AI assistant that automates the busywork and shows you what it handled.",
    era: "Concept · self-directed",
    status: "live",
    href: "/app/atrium",
    caseStudy: "/projects/atrium",
    accent: "#6d4aff",
  },
  {
    slug: "vantage",
    name: "SecOps Command",
    tagline:
      "An agentic security and IT operations command center. Autonomous agents triage incidents, hunt threats, patch vulnerabilities, and collect compliance evidence, in one console.",
    era: "Concept build · Security + IT ops",
    status: "live",
    href: "/app/vantage",
    caseStudy: "/projects/vantage",
    accent: "#b6abff",
  },
  {
    slug: "riptide",
    name: "Riptide Research",
    tagline:
      "Agentic equity-research terminal. Research in distributions: the options market's implied distribution versus your own models, scanned for gaps and graded over time.",
    era: "Current build, live",
    status: "live",
    href: "https://riptide.matthewoshin.com",
    caseStudy: "/projects/riptide",
    accent: "#2fe3bf",
  },
  {
    slug: "mtrain",
    name: "mTrain",
    tagline:
      "The back office for a strength-and-wellness studio in Westport, CT. The class schedule, the lead pipeline, and every member over a Mindbody-style data layer, in one calm dashboard.",
    era: "Client engagement · Studio admin",
    status: "live",
    href: "/app/mtrain",
    caseStudy: "/projects/mtrain",
    accent: "#1f3d34",
  },
];

export default function DemosHubPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-bio-cyan/80">
          Interactive demos
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink-heading sm:text-5xl">
          Click through the things I&apos;ve built.
        </h1>
        <p className="measure mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
          Faithful, clickable recreations of my products, seeded with sample
          data. Nothing here talks to a live server. Each one is the real
          interface, rebuilt so you can actually navigate it.
        </p>
      </header>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2">
        {DEMOS.map((d) => (
          <li key={d.slug}>
            <div
              className={`group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors ${
                d.status === "live"
                  ? "hover:border-bio-cyan/40 hover:bg-white/[0.05]"
                  : ""
              }`}
            >
              {/* Stretched link: covers the whole card for live demos, sibling
                  (not parent) of the inner case-study link so no <a> nests. */}
              {d.status === "live" && d.href && (
                <Link
                  href={d.href}
                  aria-label={`Open ${d.name} demo`}
                  className="absolute inset-0 z-10 rounded-2xl"
                />
              )}

              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: d.accent }}
                />
                <h2 className="font-display text-xl font-semibold text-ink-heading">
                  {d.name}
                </h2>
                {d.status === "live" ? (
                  <span className="ml-auto rounded-full border border-bio-cyan/40 bg-bio-cyan/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-bio-cyan">
                    Live
                  </span>
                ) : (
                  <span className="ml-auto rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                {d.era}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-body">
                {d.tagline}
              </p>
              <div className="mt-6 flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
                {d.status === "live" ? (
                  <span className="text-bio-cyan group-hover:underline">
                    Open demo <span aria-hidden="true">-&gt;</span>
                  </span>
                ) : (
                  <span className="text-ink-faint">In progress</span>
                )}
                {d.caseStudy && (
                  <Link
                    href={d.caseStudy}
                    className="relative z-20 text-ink-muted transition-colors hover:text-bio-cyan"
                  >
                    Case study
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
