import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VenturePage from "@/app/ventures/[slug]/page";

/**
 * Every VENTURES entry backs a statically generated /ventures/[slug] case study.
 * The "Back to ventures" link must return to the ventures index (/entrepreneurship,
 * the "What I've built." page), NOT the homepage #projects scroll zone. Regression
 * guard: it previously pointed at /#projects and dumped visitors on the homepage.
 */
describe("/ventures/[slug] case study", () => {
  it("sends 'Back to ventures' to the /entrepreneurship index, not the homepage", async () => {
    const props = {
      params: Promise.resolve({ slug: "mocean" }),
    } as unknown as Parameters<typeof VenturePage>[0];
    render(await VenturePage(props));

    const back = screen.getByRole("link", { name: /back to ventures/i });
    expect(back.getAttribute("href")).toBe("/entrepreneurship");
  });
});
