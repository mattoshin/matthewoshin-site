import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import PortfolioGrid, {
  type PortfolioCategory,
  type PortfolioItem,
} from "@/components/portfolio/PortfolioGrid";
import { BUILDS, VENTURES, PORTFOLIO } from "@/data/content";

/**
 * /portfolio - the products Matthew builds, at the "projects" zone: the same
 * depth as /entrepreneurship, right after it in the nav order (2026-07-09
 * fix: it was pinned to the "contact" floor zone, the same depth as the
 * Contact page itself, which broke the depth order between Ventures and the
 * demoted pages). Matches its own BUCKETS zone declaration and the home
 * Portfolio section's band. Every card carries the turquoise treatment and a
 * category, and the grid is filterable by type: AI Products, Web & Client,
 * and Ventures. Cards link to the full case studies; demo-backed ones also
 * show a bright "View Demo" button.
 */
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Products I build, filterable by type: AI products (GTM Engineering, Options-Implied Distribution Terminal, Galactic Signals, Financial Communications Platform, SEC Intelligence, Workplace AI, SecOps Command, Observly, BriefBridge), web & client work (BrachyClip, mTrain, Dog House), and ventures (Mocean, Element Underground).",
};

/** Pull a build into a portfolio item; case study lives at /projects/<slug>. */
function fromBuild(slug: string, category: PortfolioCategory): PortfolioItem {
  const b = BUILDS.find((x) => x.slug === slug);
  if (!b) throw new Error(`portfolio: missing build "${slug}"`);
  return {
    name: b.name,
    hook: b.hook,
    status: b.status,
    category,
    caseHref: `/projects/${b.slug}`,
    demoHref: b.demoHref,
  };
}

function fromVenture(slug: string, status: string, siteHref?: string): PortfolioItem {
  const v = VENTURES.find((x) => x.slug === slug);
  if (!v) throw new Error(`portfolio: missing venture "${slug}"`);
  return {
    name: v.name,
    hook: v.oneLiner,
    status,
    category: "ventures",
    caseHref: `/ventures/${v.slug}`,
    demoHref: v.demoHref,
    siteHref,
  };
}

const brachyclip = BUILDS.find((b) => b.slug === "brachyclip");
const doghouse = BUILDS.find((b) => b.slug === "dog-house");

// Curated order for the "All" view: demo-backed flagships first, then the
// web/client work, then the remaining case studies. BrachyClip and mTrain are
// active engagements, so they link to the live site ("View Site").
const ITEMS: PortfolioItem[] = [
  fromVenture("mocean", "Founded & acquired"),
  fromBuild("gtm-engineering", "ai-products"),
  fromBuild("galactic-signals", "ai-products"),
  fromBuild("financial-comms", "ai-products"),
  fromBuild("sec-intelligence", "ai-products"),
  fromBuild("atrium", "ai-products"),
  fromBuild("vantage", "ai-products"),
  fromBuild("riptide", "ai-products"),
  {
    name: "BrachyClip",
    hook: brachyclip?.hook ?? "",
    status: "Active engagement",
    category: "web-client",
    caseHref: "/projects/brachyclip",
    siteHref: "https://brachyclip.com",
  },
  {
    name: "mTrain",
    hook: "Marketing site for a strength-and-wellness studio in Westport, CT, built for conversion: route qualified traffic into the studio's booking flow and capture the leads it would otherwise miss.",
    status: "Active engagement",
    category: "web-client",
    caseHref: "/projects/mtrain",
    siteHref: "https://mtrainstudio.com",
  },
  {
    // Fail-loud: fromBuild throws at build time if the slug ever drifts,
    // instead of shipping a blank-hook card with a 404 case study.
    ...fromBuild("dog-house", "web-client"),
    siteHref: doghouse?.href,
  },
  fromVenture("element-underground", "Co-founded", "https://elementunderground.com"),
  {
    ...fromBuild("observly", "ai-products"),
    siteHref: "https://observlymd.com",
  },
  fromBuild("briefbridge", "ai-products"),
];

export default function PortfolioPage() {
  return (
    <PageShell
      zone="projects"
      navLabel="Portfolio"
      heading={PORTFOLIO.heading}
      intro={PORTFOLIO.blurb}
    >
      <PortfolioGrid items={ITEMS} />
    </PageShell>
  );
}
