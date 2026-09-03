import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PortfolioPage from "@/app/portfolio/page";
import { ITEMS } from "@/data/portfolio-items";

/**
 * Portfolio thumbnails (design audit F-007, 2026-09-03). Every card shows a
 * screenshot of the real product so the work is seen, not described. The
 * pictures are captured from the live demos and sites by
 * scripts/capture-portfolio-thumbs.sh and committed under public/portfolio.
 * These tests bind the data to the files and the files to the rendered grid,
 * so a renamed slug or a missing capture fails here instead of shipping a
 * broken image.
 */
describe("portfolio thumbnails", () => {
  const withThumb = ITEMS.filter((i) => i.thumb);
  const withoutThumb = ITEMS.filter((i) => !i.thumb);

  it("gives every card a thumbnail except the ones with nothing to screenshot", () => {
    expect(withThumb.length).toBeGreaterThanOrEqual(13);
    // BriefBridge has no live surface yet, so it is the one text-only card.
    expect(withoutThumb.map((i) => i.name)).toEqual(["BriefBridge"]);
  });

  it("points every thumbnail at a committed WebP that is a real capture", () => {
    for (const item of withThumb) {
      expect(item.thumb, item.name).toMatch(/^\/portfolio\/[a-z0-9-]+\.webp$/);
      const file = path.resolve(process.cwd(), "public", item.thumb!.slice(1));
      expect(existsSync(file), `${item.name}: ${item.thumb} missing`).toBe(true);
      // A blank or failed capture is a few hundred bytes; a real page is not.
      expect(statSync(file).size, `${item.name}: ${item.thumb} too small`).toBeGreaterThan(8_000);
    }
  });

  it("renders one image per thumbnail card, named after the product, and none for the rest", () => {
    render(<PortfolioPage />);
    withThumb.forEach((item, index) => {
      const img = screen.getByRole("img", { name: `${item.name} screenshot` });
      expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain(item.thumb!);
      // The first row is the largest paint and loads eagerly; every card after
      // it lazy-loads so thirteen screenshots do not compete with the page.
      if (index < 2) {
        expect(img.getAttribute("loading")).not.toBe("lazy");
      } else {
        expect(img.getAttribute("loading")).toBe("lazy");
      }
    });
    expect(screen.queryByRole("img", { name: /briefbridge/i })).toBeNull();
  });
});
