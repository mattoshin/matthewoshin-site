import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PortfolioPage, { metadata } from "@/app/portfolio/page";
import { BUCKETS } from "@/data/content";

/**
 * /portfolio composes ITEMS from BUILDS/VENTURES lookups that throw (fromBuild/
 * fromVenture) or silently blank a hook (doghouse?.hook ?? "") when a slug goes
 * missing. Rendering the page end to end pins the composition, and the filter
 * test pins the Web & Client flow that Dog House ships under.
 */
describe("/portfolio page", () => {
  it("renders the grid with the Dog House card, its case study and live site", () => {
    render(<PortfolioPage />);
    expect(screen.getByRole("heading", { name: "Dog House" })).toBeTruthy();
    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/projects/dog-house");
    expect(hrefs).toContain("https://doghouseband.matthewoshin.com");
    // The hook must come through the BUILDS lookup, not the "" fallback.
    const dogHouseCard = screen
      .getByRole("heading", { name: "Dog House" })
      .closest("div");
    expect(dogHouseCard?.textContent).toContain(
      "A photo-led site and self-serve CMS",
    );
  });

  it("the Web & Client filter shows Dog House and hides the AI products", () => {
    render(<PortfolioPage />);
    fireEvent.click(screen.getByRole("tab", { name: /web & client/i }));
    expect(screen.getByRole("heading", { name: "Dog House" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "BrachyClip" })).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: "Riptide Research" }),
    ).toBeNull();
  });

  it("Dog House reaches the copy surfaces (metadata + portfolio teaser)", () => {
    expect(metadata.description).toContain("Dog House");
    const portfolio = BUCKETS.find((b) => b.id === "portfolio");
    expect(portfolio?.teaser).toContain("Dog House");
    // 2026-07-06 copy fix: "DJ rig" became "behind the decks".
    const interests = BUCKETS.find((b) => b.id === "interests");
    expect(interests?.teaser).not.toContain("DJ rig");
    expect(interests?.teaser).toContain("behind the decks");
  });
});
