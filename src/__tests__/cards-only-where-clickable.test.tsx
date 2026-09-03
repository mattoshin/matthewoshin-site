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
// A "card" on this site is the recipe, not one class: a rounded box with a
// border and a translucent fill. Matching all three keeps the invariant honest
// if someone reaches for rounded-xl or a different fill.
const isCard = (el: Element) => {
  const c = el.getAttribute("class") ?? "";
  return /\brounded-(xl|2xl)\b/.test(c) && /\bborder\b/.test(c) && /\bbg-(white|bio-cyan)\/\[/.test(c);
};
const cardsIn = (root: HTMLElement) => [...root.querySelectorAll("main *")].filter(isCard).length;

describe("cards only where the card is the link", () => {
  it("renders experience as a timeline on a rule, one dot and period per role, no cards", () => {
    const { container } = render(<ExperiencePage />);
    expect(cardsIn(container)).toBe(0);
    const list = screen.getByRole("list", { name: /roles/i });
    // Explicit role: WebKit drops list semantics once markers are styled away.
    expect(list.getAttribute("role")).toBe("list");
    const roles = within(list).getAllByRole("listitem").filter((li) => li.parentElement === list);
    expect(roles).toHaveLength(EXPERIENCE.length);
    // Each role draws the rule segment down to the next dot; the last draws none.
    for (const role of roles) {
      const classes = (role.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("before:w-px");
      expect(classes).toContain("last:before:hidden");
    }
    for (const [index, job] of EXPERIENCE.entries()) {
      const role = roles[index];
      expect(within(role).getByText(job.period)).toBeTruthy();
      const heading = within(role).getByRole("heading", { level: 2 }).textContent ?? "";
      expect(heading).toContain(job.role);
      expect(heading).toContain(job.org);
      expect(role.querySelector("[data-timeline-dot]")).toBeTruthy();
      // The bullets are the substance of each role; every point must render.
      for (const point of job.points) expect(within(role).getByText(point)).toBeTruthy();
    }
  });

  it("renders education as hairline rows; only entries with a page are links", () => {
    const { container } = render(<EducationPage />);
    expect(cardsIn(container)).toBe(0);
    const list = screen.getByRole("list", { name: /schools/i });
    expect(list.getAttribute("role")).toBe("list");
    expect((list.getAttribute("class") ?? "").split(/\s+/)).toContain("divide-y");
    for (const e of EDUCATION) {
      const heading = screen.getByRole("heading", { level: 2, name: e.school });
      if (e.detail) expect(within(heading.closest("li")!).getByText(e.detail)).toBeTruthy();
      const link = heading.closest("a");
      if (e.slug) {
        expect(link?.getAttribute("href")).toBe(`/education/${e.slug}`);
        expect(within(link!).getByText(/read more/i)).toBeTruthy();
        // The whole row is one link (tall enough on its own, no hit area
        // needed) and the keyboard lands on the row, not on the arrow text.
        // Stacked on phones so a long school name never fights the arrow.
        expect((link!.getAttribute("class") ?? "").split(/\s+/)).toEqual(
          expect.arrayContaining(["flex-col", "sm:flex-row"]),
        );
        link!.focus();
        expect(document.activeElement).toBe(link);
      } else {
        expect(link).toBeNull();
      }
    }
  });

  it("renders interests as two editorial columns with a top rule each, no cards", () => {
    const { container } = render(<InterestsPage />);
    expect(cardsIn(container)).toBe(0);
    const list = screen.getByRole("list", { name: /interests/i });
    expect(list.getAttribute("role")).toBe("list");
    expect((list.getAttribute("class") ?? "").split(/\s+/)).toContain("md:grid-cols-2");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(INTERESTS.length);
    for (const [index, item] of items.entries()) {
      expect((item.getAttribute("class") ?? "").split(/\s+/)).toContain("border-t");
      expect(within(item).getByRole("heading", { level: 2 }).textContent).toBe(INTERESTS[index].title);
      expect(within(item).getByText(INTERESTS[index].detail)).toBeTruthy();
    }
  });

  it("keeps the cards on the portfolio, where every card is a link", () => {
    const { container } = render(<PortfolioPage />);
    expect(cardsIn(container)).toBeGreaterThan(10);
  });
});
