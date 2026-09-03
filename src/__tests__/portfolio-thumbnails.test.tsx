import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
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
      // Lossy WebP (VP8): "RIFF....WEBPVP8 " then the frame header; width and
      // height are 14-bit little-endian values at bytes 26 and 28.
      const buf = readFileSync(file);
      expect(buf.subarray(0, 4).toString("ascii"), item.name).toBe("RIFF");
      expect(buf.subarray(8, 16).toString("ascii"), item.name).toBe("WEBPVP8 ");
      const width = buf.readUInt16LE(26) & 0x3fff;
      const height = buf.readUInt16LE(28) & 0x3fff;
      expect([width, height], `${item.name} dimensions`).toEqual([1200, 750]);
    }
    // No two cards may share a picture.
    expect(new Set(withThumb.map((i) => i.thumb)).size).toBe(withThumb.length);
  });

  it("renders one image per thumbnail card, named after the product, and none for the rest", () => {
    render(<PortfolioPage />);
    withThumb.forEach((item, index) => {
      const img = screen.getByRole("img", { name: `${item.name} screenshot` });
      expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain(item.thumb!);
      // The first row is the largest paint and loads eagerly (no preload, so it
      // cannot compete with the ocean bundle); every card after it lazy-loads.
      expect(img.getAttribute("loading")).toBe(index < 2 ? "eager" : "lazy");
      expect(img.getAttribute("fetchpriority")).not.toBe("high");
      // The declared size is the real 430px desktop column, not half the viewport.
      expect(img.getAttribute("sizes")).toContain("(min-width: 1024px) 380px");
    });
    expect(screen.queryByRole("img", { name: /briefbridge/i })).toBeNull();
    // The text-only card sizes to its copy instead of stretching to the row.
    const briefbridge = screen.getByRole("heading", { name: "BriefBridge" }).closest("a")!;
    expect((briefbridge.getAttribute("class") ?? "").split(/\s+/)).toContain("h-auto");
  });

  it("makes the first two cards of a filtered view eager, not the first two overall", () => {
    render(<PortfolioPage />);
    fireEvent.click(screen.getByRole("button", { name: /web & client/i }));
    const shown = ITEMS.filter((i) => i.category === "web-client" && i.thumb);
    expect(shown.length).toBeGreaterThanOrEqual(3);
    shown.forEach((item, index) => {
      const img = screen.getByRole("img", { name: `${item.name} screenshot` });
      expect(img.getAttribute("loading"), item.name).toBe(index < 2 ? "eager" : "lazy");
    });
  });

  it("keeps the capture script's source list in step with the cards", () => {
    // The script cannot read the TS data, so the slug list is duplicated there.
    // This binds the two: a card added without a capture source, or a source
    // left behind after a card is removed, fails here.
    const script = readFileSync(path.resolve(process.cwd(), "scripts/capture-portfolio-thumbs.sh"), "utf8");
    const scriptSources = Object.fromEntries(
      [...script.matchAll(/^\s*"([a-z0-9-]+)\|(https?:\/\/[^"]+)"/gm)].map((m) => [m[1], m[2]]),
    );
    // What the script should capture for each card: the live site if there is
    // one, else the demo (internal /app demos are captured from production).
    const expected = Object.fromEntries(
      withThumb.map((i) => {
        const slug = i.thumb!.replace(/^\/portfolio\//, "").replace(/\.webp$/, "");
        const url = i.siteHref ?? (i.demoHref?.startsWith("/") ? `https://matthewoshin.com${i.demoHref}` : i.demoHref);
        return [slug, url];
      }),
    );
    expect(scriptSources).toEqual(expected);
  });
});
