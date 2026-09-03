import type {
  PortfolioCategory,
  PortfolioItem,
} from "@/components/portfolio/PortfolioGrid";
import { BUILDS, VENTURES } from "@/data/content";

/**
 * The curated card list for /portfolio. Lives outside the page file because
 * Next only allows route exports from a page module, and the tests need the
 * list to bind each card's thumbnail to a committed file.
 *
 * Thumbnails: public/portfolio/<slug>.webp, captured from the live demos and
 * sites by scripts/capture-portfolio-thumbs.sh. A card without a live surface
 * (BriefBridge) has no thumbnail and renders text-only.
 */
const thumbFor = (slug: string) => `/portfolio/${slug}.webp`;

/** Pull a build into a portfolio item; case study lives at /projects/<slug>. */
function fromBuild(
  slug: string,
  category: PortfolioCategory,
  opts: { thumb?: boolean } = {},
): PortfolioItem {
  const b = BUILDS.find((x) => x.slug === slug);
  if (!b) throw new Error(`portfolio: missing build "${slug}"`);
  return {
    name: b.name,
    hook: b.hook,
    status: b.status,
    category,
    caseHref: `/projects/${b.slug}`,
    demoHref: b.demoHref,
    thumb: opts.thumb === false ? undefined : thumbFor(slug),
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
    thumb: thumbFor(slug),
  };
}

const brachyclip = BUILDS.find((b) => b.slug === "brachyclip");
const doghouse = BUILDS.find((b) => b.slug === "dog-house");

// Curated order for the "All" view: demo-backed flagships first, then the
// web/client work, then the remaining case studies. BrachyClip and mTrain are
// active engagements, so they link to the live site ("View Site").
export const ITEMS: PortfolioItem[] = [
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
    thumb: thumbFor("brachyclip"),
  },
  {
    name: "mTrain",
    hook: "Marketing site for a strength-and-wellness studio in Westport, CT, built for conversion: route qualified traffic into the studio's booking flow and capture the leads it would otherwise miss.",
    status: "Active engagement",
    category: "web-client",
    caseHref: "/projects/mtrain",
    siteHref: "https://mtrainstudio.com",
    thumb: thumbFor("mtrain"),
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
  // No live surface to screenshot yet, so this one stays text-only.
  fromBuild("briefbridge", "ai-products", { thumb: false }),
];
