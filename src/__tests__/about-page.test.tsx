import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/about/page";
import { ABOUT, INTERESTS, SKILL_GROUPS } from "@/data/content";

/**
 * /about is the one-read digest: facts, story, toolkit, education, interests,
 * each section linking to its full page. These tests pin that composition.
 */
describe("/about page", () => {
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

  it("renders the story, toolkit groups, interest cards, and non-linked school", () => {
    render(<AboutPage />);
    // The long-form story renders in full, not just the facts.
    for (const paragraph of ABOUT.paragraphs) {
      expect(screen.getByText(paragraph)).toBeTruthy();
    }
    // Every toolkit group shows up (items are trimmed to 4 per group).
    for (const group of SKILL_GROUPS) {
      expect(screen.getByRole("heading", { name: group.title })).toBeTruthy();
    }
    // The first four interests preview as cards.
    for (const interest of INTERESTS.slice(0, 4)) {
      expect(
        screen.getByRole("heading", { name: interest.title }),
      ).toBeTruthy();
    }
    // A school without a slug renders as a plain card, not a link.
    const weston = screen.getByText("Weston High School");
    expect(weston.closest("a")).toBeNull();
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
