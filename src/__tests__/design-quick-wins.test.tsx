import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ContactPage from "@/app/contact/page";
import BlogIndex from "@/app/blog/page";
import PostPage from "@/app/blog/[slug]/page";
import PortfolioPage from "@/app/portfolio/page";
import DemosHubPage from "@/app/app/page";
import PageShell from "@/components/page/PageShell";
import BucketNav from "@/components/chrome/BucketNav";
import SiteFooter from "@/components/chrome/SiteFooter";
import HomeSection from "@/components/home/HomeSection";
import DemoBar from "@/components/demos/DemoBar";
import { getPostSlugs } from "@/lib/posts";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const read = (rel: string) =>
  readFileSync(path.resolve(process.cwd(), rel), "utf8");

/**
 * Design audit quick wins (2026-09-03). Each block pins one finding from
 * ~/.gstack/projects/mattoshin-matthewoshin-site/designs/design-audit-20260903
 * so it cannot quietly regress. The "hit" utility gives small text links and
 * icons a 44px hit area without changing what they look like; jsdom cannot
 * measure the pseudo-element, so the tests bind the class, and the CSS rule
 * that gives it meaning, separately.
 */
const classesOf = (el: Element) => (el.getAttribute("class") ?? "").split(/\s+/);

describe("F-004 contact eyebrow", () => {
  it("names the page, not the depth zone it borrows from Interests", () => {
    render(<ContactPage />);
    const eyebrow = screen.getByText("Contact", { selector: "p > span" });
    expect(eyebrow).toBeTruthy();
    expect(screen.queryByText("Interests", { selector: "p > span" })).toBeNull();
    // A page that passes no width or slots gets the wide column and no extras.
    const main = screen.getByRole("main");
    expect(classesOf(main)).toContain("max-w-5xl");
    expect(classesOf(main)).not.toContain("max-w-3xl");
    expect(screen.queryByRole("link", { name: /back to/i })).toBeNull();
    expect(classesOf(screen.getByRole("heading", { level: 1 }))).toContain("sm:text-6xl");
  });
});

describe("F-002 44px hit areas", () => {
  it("defines the hit utility as a centered 44px minimum box", () => {
    const css = read("src/app/globals.css");
    expect(css).toMatch(/\.hit\s*\{[^}]*position:\s*relative/);
    expect(css).toMatch(/\.hit::after\s*\{[^}]*max\(100%,\s*44px\)/);
  });

  it("gives the nav pills, the Contact pill and the hamburger a full-size target", () => {
    render(<BucketNav />);
    for (const name of ["Home", "Experience", "Ventures", "Portfolio", "About Me", "Contact", /return home/]) {
      const links = screen.getAllByRole("link", { name });
      expect(classesOf(links[0])).toContain("hit");
    }
    const burger = screen.getByRole("button", { name: "Open navigation menu" });
    expect(classesOf(burger)).toContain("p-3");
  });

  it("draws social icons inside 40px boxes (44 would crowd the nav at 1024px)", () => {
    render(<BucketNav />);
    for (const name of ["LinkedIn", "Instagram", "X (Twitter)", "Contact Matthew", "GitHub"]) {
      const links = screen.getAllByRole("link", { name });
      const classes = classesOf(links[0]);
      expect(classes).toContain("h-10");
      expect(classes).toContain("w-10");
    }
  });

  it("extends the footer links, the home section arrows and the case-study links", () => {
    const { unmount } = render(<SiteFooter />);
    for (const name of ["About", "Writing", "LinkedIn", "GitHub"]) {
      expect(classesOf(screen.getByRole("link", { name }))).toContain("hit");
    }
    // Wrapped rows need more than 26px between them or the 44px boxes overlap.
    const row = screen.getByRole("link", { name: "About" }).parentElement!;
    expect(classesOf(row)).toContain("gap-y-7");
    unmount();

    render(
      <HomeSection zone="about" heading="Experience" href="/experience" cta="Open Experience">
        <p>teaser</p>
      </HomeSection>,
    );
    expect(classesOf(screen.getByRole("link", { name: /open experience/i }))).toContain("hit");
  });

  it("extends every link in the demo bar", () => {
    render(<DemoBar />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) expect(classesOf(link)).toContain("hit");
  });

  it("extends the small Case study links on the portfolio grid and the demos hub", () => {
    const { unmount } = render(<PortfolioPage />);
    const caseLinks = screen.getAllByRole("link", { name: /^case study/i });
    expect(caseLinks.length).toBeGreaterThan(0);
    for (const link of caseLinks) expect(classesOf(link)).toContain("hit");
    unmount();

    render(<DemosHubPage />);
    const hubLinks = screen.getAllByRole("link", { name: /^case study$/i });
    expect(hubLinks.length).toBeGreaterThan(0);
    for (const link of hubLinks) expect(classesOf(link)).toContain("hit");
  });
});

describe("F-003 chat widget focus ring", () => {
  it("lets the global focus-visible ring show on every button", () => {
    const src = read("src/components/chrome/OceanAI.tsx");
    // Exactly one opt-out survives, on the <textarea>, which paints its own
    // border on focus. Every <button> falls through to the global ring.
    const optOuts = src.match(/focus-visible:outline-none/g) ?? [];
    expect(optOuts).toHaveLength(1);
    const at = src.indexOf("focus-visible:outline-none");
    expect(src.lastIndexOf("<textarea", at)).toBeGreaterThan(src.lastIndexOf("<button", at));
    const css = read("src/app/globals.css");
    const rule = css.match(/:where\(a, button, \[tabindex\]\):focus-visible \{[^}]*\}/)?.[0] ?? "";
    expect(rule).toContain("outline: 2px solid");
    // An unlayered border-radius here would square off every rounded-full pill on focus.
    expect(rule).not.toContain("border-radius");
  });
});

describe("F-015 balanced headings", () => {
  it("balances the shared page heading", () => {
    render(
      <PageShell zone="about" heading="A heading that could wrap awkwardly">
        <p>body</p>
      </PageShell>,
    );
    expect(classesOf(screen.getByRole("heading", { level: 1 }))).toContain("text-balance");
  });

  it("balances the case-study headings that do not use the shell", () => {
    for (const rel of [
      "src/app/projects/[slug]/page.tsx",
      "src/app/ventures/[slug]/page.tsx",
      "src/app/education/[slug]/page.tsx",
    ]) {
      const h1 = read(rel).match(/<h1[^>]*className="([^"]*)"/)?.[1] ?? "";
      expect(h1, rel).toContain("text-balance");
    }
  });
});

describe("F-009 portfolio filter semantics", () => {
  it("uses pressed buttons and announces the visible count", () => {
    render(<PortfolioPage />);
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    const all = screen.getByRole("button", { name: /^all/i });
    expect(all.getAttribute("aria-pressed")).toBe("true");

    const web = screen.getByRole("button", { name: /web & client/i });
    expect(web.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(web);
    expect(web.getAttribute("aria-pressed")).toBe("true");
    expect(all.getAttribute("aria-pressed")).toBe("false");

    const status = screen.getByRole("status");
    expect(status.textContent).toMatch(/showing \d+ of \d+ projects/i);
  });
});

describe("F-011 blog pages share the page shell", () => {
  it("shows the empty-state line when there are no posts", async () => {
    vi.resetModules();
    vi.doMock("@/lib/posts", () => ({ getAllPosts: () => [], getPostSlugs: () => [], getPost: () => null }));
    const { default: EmptyBlogIndex } = await import("@/app/blog/page");
    render(<EmptyBlogIndex />);
    expect(screen.getByText("First posts coming soon.")).toBeTruthy();
    expect(screen.queryByRole("list")).toBeNull();
    vi.doUnmock("@/lib/posts");
    vi.resetModules();
  });


  it("renders the index through PageShell at reading width with the Writing label", () => {
    render(<BlogIndex />);
    const main = screen.getByRole("main");
    expect(main.getAttribute("data-shell")).toBe("page");
    expect(classesOf(main)).toContain("max-w-3xl");
    expect(screen.getByText("Writing", { selector: "p > span" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Writing" })).toBeTruthy();
  });

  it("renders a post through PageShell with a back link and the date above the title", async () => {
    const slug = getPostSlugs()[0];
    expect(slug).toBeTruthy();
    const props = { params: Promise.resolve({ slug }) } as unknown as Parameters<typeof PostPage>[0];
    render(await PostPage(props));
    const main = screen.getByRole("main");
    expect(main.getAttribute("data-shell")).toBe("page");
    const back = screen.getByRole("link", { name: /back to writing/i });
    expect(back.getAttribute("href")).toBe("/blog");
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(classesOf(h1)).toContain("text-balance");
    // The reading column keeps the smaller display size the blog had before.
    expect(classesOf(h1)).toContain("sm:text-5xl");
    // Date sits between the eyebrow and the title, inside the shell header.
    const header = within(main);
    expect(header.getByText(/^\d{4}-\d{2}-\d{2}$/)).toBeTruthy();
  });
});
