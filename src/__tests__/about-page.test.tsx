import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AboutPage from "@/app/about/page";
import { ABOUT } from "@/data/content";

/**
 * /about is the one-read digest: facts, story, toolkit, education, interests,
 * each section linking to its full page. These tests pin that composition.
 */
describe("/about page", () => {
  afterEach(cleanup);

  it("renders the heading and every section header", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: ABOUT.heading }),
    ).toBeTruthy();
    for (const section of [
      "The story",
      "The toolkit",
      "Education",
      "Off the clock",
    ]) {
      expect(screen.getByRole("heading", { name: section })).toBeTruthy();
    }
  });

  it("shows the at-a-glance facts", () => {
    render(<AboutPage />);
    for (const fact of ABOUT.facts) {
      expect(screen.getByText(fact)).toBeTruthy();
    }
  });

  it("links out to the full skills, interests, and education pages", () => {
    render(<AboutPage />);
    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/skills");
    expect(hrefs).toContain("/interests");
    expect(hrefs).toContain("/education/michigan");
    expect(hrefs).toContain("/education/washu");
  });
});
