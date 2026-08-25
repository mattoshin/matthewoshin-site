import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VenturePage from "@/app/ventures/[slug]/page";
import { SYSTEM_PROMPT } from "@/app/api/oceanai/route";
import { ABOUT, BUCKETS, VENTURES } from "@/data/content";

/**
 * Exit claims are the one class of copy on this site that has to be exactly
 * true. Two companies were sold, Mocean Technologies and Resell Network, both
 * in the same 2023 deal. Profit Paradise was NOT: it was made free in 2023 and
 * wound down, no buyer, no sale. The site shipped the wrong claim in six places
 * because `ACQUIRED_SLUGS` was hardcoded in the case-study page, separate from
 * the copy in content.ts, and the two drifted (three ventures flagged acquired
 * while the headline stat said two). These tests bind the badge, the copy, the
 * count, and the AI assistant to one source of truth: `Venture.acquired`.
 */
describe("acquisition claims", () => {
  const acquired = VENTURES.filter((v) => v.acquired);

  it("marks exactly Mocean and Resell Network as acquired", () => {
    expect(acquired.map((v) => v.slug).sort()).toEqual([
      "mocean",
      "resell-network",
    ]);
  });

  it("keeps the ventures proof stat equal to the number actually acquired", () => {
    const bucket = BUCKETS.find((b) => b.href === "/entrepreneurship");
    expect(bucket?.proof).toContain(`${acquired.length} companies acquired`);
  });

  it("keeps the About page fact equal to the number actually acquired", () => {
    expect(ABOUT.facts).toContain(`${acquired.length} companies acquired`);
  });

  it("never claims an exit anywhere in the Profit Paradise copy", () => {
    const pp = VENTURES.find((v) => v.slug === "profit-paradise");
    expect(pp).toBeTruthy();
    expect(pp?.acquired).toBeUndefined();

    const copy = [pp!.oneLiner, pp!.era, pp!.note, ...(pp!.storyParagraphs ?? [])].join(" ");
    expect(copy).not.toMatch(/acquir/i);
    expect(copy).toMatch(/never sold/i);
    expect(copy).toMatch(/wound it down/i);
  });

  it("hides the 'Founded and acquired' badge on the Profit Paradise page", async () => {
    const props = {
      params: Promise.resolve({ slug: "profit-paradise" }),
    } as unknown as Parameters<typeof VenturePage>[0];
    render(await VenturePage(props));

    expect(screen.queryByText(/founded and acquired/i)).toBeNull();
    expect(screen.getByText(/made free in 2023, wound down\. never sold\./i)).toBeTruthy();
  });

  it("still shows the badge on a venture that really was acquired", async () => {
    const props = {
      params: Promise.resolve({ slug: "mocean" }),
    } as unknown as Parameters<typeof VenturePage>[0];
    render(await VenturePage(props));

    // Anchored: Mocean's era chip also reads "Founded and acquired, 2021 to
    // 2023", so match the badge's exact text and nothing else.
    expect(screen.getAllByText(/^founded and acquired$/i).length).toBeGreaterThan(0);
  });

  it("tells the OceanAI assistant that Profit Paradise was not sold", () => {
    expect(SYSTEM_PROMPT).toMatch(/Profit Paradise was NOT acquired and NOT sold/);
  });
});
