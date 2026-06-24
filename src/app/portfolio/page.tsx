import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import PortfolioGrid, {
  type PortfolioCategory,
  type PortfolioItem,
} from "@/components/portfolio/PortfolioGrid";
import { BUILDS, VENTURES, PORTFOLIO } from "@/data/content";

/**
 * /portfolio - the products Matthew builds, at the twilight depth (shares the
 * "projects" zone with /entrepreneurship). Every card carries the turquoise
 * treatment and a category, and the grid is filterable by type: AI Products,
 * Web & Client, and Ventures. Cards link to the full case studies; demo-backed
 * ones also show a bright "View Demo" button.
 */
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Products I build, filterable by type: AI products (Riptide, Galactic Signals, Financial Communications Platform, SEC Intelligence, Sonar Media, Workplace AI, SecOps Command, Observly, BriefBridge), web & client work (BrachyClip, mTrain), and ventures (Mocean, Element Underground).",
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

function fromVenture(
  slug: string,
  status: string
): PortfolioItem {
  const v = VENTURES.find((x) => x.slug === slug);
  if (!v) throw new Error(`portfolio: missing venture "${slug}"`);
  return {
    name: v.name,
    hook: v.oneLiner,
    status,
    category: "ventures",
    caseHref: `/ventures/${v.slug}`,
    demoHref: v.demoHref,
  };
}

// Curated order for the "All" view: demo-backed flagships first, then the
// web/client work, then the remaining case studies. (Camp Ricky is intentionally
// not surfaced here.)
const ITEMS: PortfolioItem[] = [
  fromVenture("mocean", "Founded & acquired"),
  fromBuild("galactic-signals", "ai-products"),
  fromBuild("icr-intelligence", "ai-products"),
  fromBuild("sec-intelligence", "ai-products"),
  fromBuild("sonar", "ai-products"),
  fromBuild("atrium", "ai-products"),
  fromBuild("vantage", "ai-products"),
  fromBuild("riptide", "ai-products"),
  fromBuild("brachyclip", "web-client"),
  fromBuild("mtrain", "web-client"),
  fromVenture("element-underground", "Co-founded"),
  fromBuild("observly", "ai-products"),
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
