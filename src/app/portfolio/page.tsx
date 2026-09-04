import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import { PORTFOLIO } from "@/data/content";
import { ITEMS } from "@/data/portfolio-items";

/**
 * /portfolio - the products Matthew builds, at the "projects" zone: the same
 * depth as /entrepreneurship, right after it in the nav order (2026-07-09
 * fix: it was pinned to the "contact" floor zone, the same depth as the
 * Contact page itself, which broke the depth order between Ventures and the
 * demoted pages). Matches its own BUCKETS zone declaration and the home
 * Portfolio section's band. Every card carries the turquoise treatment and a
 * category, and the grid is filterable by type: AI Products, Web & Client,
 * and Ventures. Cards link to the full case studies; demo-backed ones also
 * show a bright "View Demo" button. The card list itself lives in
 * src/data/portfolio-items.ts (with the thumbnail per card).
 */
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Products I build, filterable by type: AI products (Fintech Banking GTM Engineering, AI Property Management GTM Engineering, Options-Implied Distribution Terminal, Galactic Signals, Financial Communications Platform, SEC Intelligence, Workplace AI, SecOps Command, Observly, BriefBridge), web & client work (BrachyClip, mTrain, Dog House), and ventures (Mocean, Element Underground).",
};

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
