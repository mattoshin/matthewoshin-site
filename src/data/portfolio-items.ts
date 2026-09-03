import { BUILDS, VENTURES } from "@/data/content";

export type PortfolioCategory = "ai-products" | "web-client" | "ventures";

export interface PortfolioItem {
  name: string;
  hook: string;
  status: string;
  category: PortfolioCategory;
  /** Case-study detail route (/projects/* or /ventures/*). Optional: demo/site-only
   *  cards (e.g. a standalone product concept) can omit it. */
  caseHref?: string;
  /** When set, the card shows a bright "View Demo" button to a clickable demo. */
  demoHref?: string;
  /** When set, the card shows a bright "View Site" button to the live external
   *  site (active engagements). Takes precedence over demoHref as the primary CTA. */
  siteHref?: string;
  /** Screenshot of the product, /portfolio/<slug>.webp (1200x750). Captured
   *  from the live demo or site by scripts/capture-portfolio-thumbs.sh. */
  thumb?: string;
}

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

/** Pull a venture in; `site: true` links the card to the venture's own website
    (from content.ts, one source of truth) instead of only the case study. */
function fromVenture(slug: string, status: string, opts: { site?: boolean } = {}): PortfolioItem {
  const v = VENTURES.find((x) => x.slug === slug);
  if (!v) throw new Error(`portfolio: missing venture "${slug}"`);
  if (opts.site && !v.website) throw new Error(`portfolio: venture "${slug}" has no website`);
  return {
    name: v.name,
    hook: v.oneLiner,
    status,
    category: "ventures",
    caseHref: `/ventures/${v.slug}`,
    demoHref: v.demoHref,
    siteHref: opts.site ? v.website : undefined,
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
  fromVenture("element-underground", "Co-founded", { site: true }),
  {
    ...fromBuild("observly", "ai-products"),
    siteHref: "https://observlymd.com",
  },
  // No live surface to screenshot yet, so this one stays text-only.
  fromBuild("briefbridge", "ai-products", { thumb: false }),
];
