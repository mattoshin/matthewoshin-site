import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExperiencePage from "@/app/experience/page";
import EducationPage from "@/app/education/page";
import InterestsPage from "@/app/interests/page";
import PortfolioPage from "@/app/portfolio/page";
import { EDUCATION, EXPERIENCE, INTERESTS } from "@/data/content";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

/**
 * Design audit F-008 (2026-09-03): a glass card means "you can open this".
 * Experience roles, education entries and interests are not clickable, so
 * they no longer wear the card. Experience is a timeline on a rule, education
 * is hairline rows (linked rows keep an arrow), interests are editorial
 * columns. Portfolio keeps its cards because there the card is the link.
 */
const CARD = "rounded-2xl";
const cardsIn = (root: HTMLElement) => root.querySelectorAll(`main .${CARD}`).length;

describe("cards only where the card is the link", () => {
  it("renders experience as a timeline on a rule, one dot and period per role, no cards", () => {
    const { container } = render(<ExperiencePage />);
    expect(cardsIn(container)).toBe(0);
    const list = screen.getByRole("list", { name: /roles/i });
    expect((list.getAttribute("class") ?? "").split(/\s+/)).toContain("border-l");
    const roles = within(list).getAllByRole("listitem").filter((li) => li.parentElement === list);
    expect(roles).toHaveLength(EXPERIENCE.length);
    for (const [index, job] of EXPERIENCE.entries()) {
      const role = roles[index];
      expect(within(role).getByText(job.period)).toBeTruthy();
      expect(within(role).getByRole("heading", { level: 2 }).textContent).toContain(job.role);
      expect(role.querySelector("[data-timeline-dot]")).toBeTruthy();
    }
  });

  it("renders education as hairline rows; only entries with a page are links", () => {
    const { container } = render(<EducationPage />);
    expect(cardsIn(container)).toBe(0);
    const list = screen.getByRole("list", { name: /schools/i });
    expect((list.getAttribute("class") ?? "").split(/\s+/)).toContain("divide-y");
    for (const e of EDUCATION) {
      const heading = screen.getByRole("heading", { level: 2, name: e.school });
      const link = heading.closest("a");
      if (e.slug) {
        expect(link?.getAttribute("href")).toBe(`/education/${e.slug}`);
        expect(within(link!).getByText(/read more/i)).toBeTruthy();
      } else {
        expect(link).toBeNull();
      }
    }
  });

  it("renders interests as two editorial columns with a top rule each, no cards", () => {
    const { container } = render(<InterestsPage />);
    expect(cardsIn(container)).toBe(0);
    const list = screen.getByRole("list", { name: /interests/i });
    expect((list.getAttribute("class") ?? "").split(/\s+/)).toContain("sm:grid-cols-2");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(INTERESTS.length);
    for (const item of items) {
      expect((item.getAttribute("class") ?? "").split(/\s+/)).toContain("border-t");
    }
  });

  it("keeps the cards on the portfolio, where every card is a link", () => {
    const { container } = render(<PortfolioPage />);
    expect(cardsIn(container)).toBeGreaterThan(10);
  });
});
