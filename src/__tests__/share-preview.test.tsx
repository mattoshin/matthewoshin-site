import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { SITE } from "@/data/content";

// layout.tsx loads Poppins through next/font/google, which wants the network.
// The metadata object is all we need, so stub the font loader.
vi.mock("next/font/google", () => ({
  Poppins: () => ({ variable: "--font-poppins", className: "poppins" }),
}));

/**
 * The share card (what iMessage, LinkedIn, and X render when someone pastes
 * matthewoshin.com) used to be a static PNG with "Chief AI Officer at
 * BrachyClip" painted into the pixels, and the description tag named the
 * employer's industry. Matthew wants the card to outlive any one job, so the
 * copy lives in SITE.ogTagline and is rendered at build time. These tests keep
 * every share-facing string employer-free and make sure the static file cannot
 * quietly come back as a second source of truth. The pixel render itself is
 * covered in share-preview-render.test.ts (node environment).
 */
const EMPLOYER_SPECIFIC = /brachy|chief ai officer|caio|medical.device|communications firm/i;

describe("share preview card", () => {
  it("uses the approved general tagline with no employer or title", () => {
    expect(SITE.ogTagline).toBe(
      "Builder. AI products, trading research tools, and companies.",
    );
    expect(SITE.ogTagline).not.toMatch(EMPLOYER_SPECIFIC);
  });

  it("keeps the tagline inside the card's two-line budget and font coverage", () => {
    // The card renders the tagline at 30px in a 620px column: about 38
    // characters a line, two lines before it crowds the domain footer. The
    // renderer clips silently rather than failing, so a longer FOCUS edit would
    // ship a broken card with no build error. Cap it here instead.
    expect(SITE.ogTagline.length).toBeLessThanOrEqual(80);
    // Only two font files are bundled, with no glyph fallback. Anything outside
    // printable ASCII (curly quotes, emoji, accents) would make the otherwise
    // hermetic build reach for a network fallback or render tofu.
    const printableAscii = /^[\x20-\x7e]+$/;
    expect(SITE.ogTagline).toMatch(printableAscii);
    expect(SITE.name).toMatch(printableAscii);
  });

  it("keeps every metadata description general", async () => {
    const { metadata } = await import("@/app/layout");
    const descriptions = [
      metadata.description,
      metadata.openGraph?.description,
      metadata.twitter?.description,
    ];
    for (const description of descriptions) {
      expect(typeof description).toBe("string");
      expect(description).not.toMatch(EMPLOYER_SPECIFIC);
    }
  });

  it("has retired the static og.png so the generated card is the only source", () => {
    // The path itself still answers (src/app/og.png/route.ts serves the live
    // card) but no static file may come back as a second source of truth.
    expect(existsSync(path.resolve(process.cwd(), "public/og.png"))).toBe(false);
    const layoutSource = readFileSync(
      path.resolve(process.cwd(), "src/app/layout.tsx"),
      "utf8",
    );
    expect(layoutSource).not.toContain("og.png");
  });
});
