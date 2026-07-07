/**
 * Shared registry of the /app/* product demos. Single source of truth for the
 * demos hub (src/app/app/page.tsx) and the breadcrumb in the DemoBar chrome
 * (src/components/demos/DemoBar.tsx), so a demo's name and landing path are
 * defined once.
 */

export type DemoCard = {
  slug: string;
  name: string;
  tagline: string;
  era: string;
  status: "live" | "soon";
  href?: string;
  caseStudy?: string;
  accent: string; // brand dot color
};

export const DEMOS: DemoCard[] = [
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
    slug: "financial-comms",
    name: "Financial Communications Platform",
    tagline:
      "The AI platform for investor relations, PR, and capital markets: earnings prep, peer and investor intelligence, crisis command, and on-voice drafting in one console.",
    era: "2024 to 2026 · Production build",
    status: "live",
    href: "/app/financial-comms",
    caseStudy: "/projects/financial-comms",
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
    slug: "fitness-os",
    name: "Fitness OS",
    tagline:
      "Gym and studio operation software: the class schedule, the lead pipeline, and every member over a Mindbody-style data layer, in one calm back office. A concept drawn from a real studio engagement.",
    era: "Product concept · Studio operations",
    status: "live",
    href: "/app/fitness-os",
    accent: "#1f3d34",
  },
];

/** A demo matched to the current path, with the crumbs the DemoBar should show. */
export type DemoCrumbMatch = {
  demo: DemoCard;
  /** The demo's own landing path, e.g. "/app/galactic-signals". */
  landingHref: string;
  /**
   * Title-cased label for the sub-route below the landing (e.g. "Dashboard"),
   * or null when the current path IS the landing page.
   */
  subPage: string | null;
};

function titleCaseSegment(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Resolve which demo (if any) a pathname belongs to, and how deep. Only the
 * internal /app/* demos are matchable; demos with an external href (e.g.
 * Riptide) never match a local route. Returns null for the /app index or any
 * unrelated path, so the DemoBar falls back to just the Portfolio crumb.
 */
export function matchDemoByPath(pathname: string): DemoCrumbMatch | null {
  for (const demo of DEMOS) {
    const href = demo.href;
    if (!href || !href.startsWith("/app/")) continue;

    if (pathname === href) {
      return { demo, landingHref: href, subPage: null };
    }
    // Segment-boundary match so "/app/sec" can't claim "/app/sec-intelligence".
    if (pathname.startsWith(href + "/")) {
      const nextSegment = pathname.slice(href.length + 1).split("/")[0] ?? "";
      return { demo, landingHref: href, subPage: titleCaseSegment(nextSegment) };
    }
  }
  return null;
}
