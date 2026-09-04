import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SYSTEM_PROMPT } from "@/app/api/oceanai/route";
import PortfolioPage, { metadata } from "@/app/portfolio/page";
import ProjectPage from "@/app/projects/[slug]/page";
import { BUILDS } from "@/data/content";
import { DEMOS } from "@/data/demos";
import { ITEMS } from "@/data/portfolio-items";

/**
 * Two GTM engineering cards (2026-09-04). Matthew applies mostly to GTM
 * engineering roles, so the two builds closest to that work lead the
 * portfolio, and each name carries its vertical (fintech banking, AI property
 * management) so two cards that used to share one name read as two products.
 * The fintech one is the de-branded signal engine at fintech.matthewoshin.com;
 * the property-management one is the existing gotomarket.matthewoshin.com
 * platform under a new display name and its original slug, so the old case
 * study route and thumbnail keep working.
 */
const FINTECH = "Fintech Banking GTM Engineering";
const PROPMGMT = "AI Property Management GTM Engineering";
const GTM_SLUGS = ["gtm-engineering-fintech", "gtm-engineering"] as const;
// The two client names the copy must never carry.
const CLIENT_NAMES = /\b(rho|elise|eliseai)\b/i;

describe("the two GTM engineering cards", () => {
  it("lead the portfolio, fintech first, each with its own demo and case study", () => {
    expect(ITEMS.slice(0, 2).map((i) => i.name)).toEqual([FINTECH, PROPMGMT]);
    expect(ITEMS[0].demoHref).toBe("https://fintech.matthewoshin.com");
    expect(ITEMS[1].demoHref).toBe("https://gotomarket.matthewoshin.com");
    expect(ITEMS[0].caseHref).toBe("/projects/gtm-engineering-fintech");
    expect(ITEMS[1].caseHref).toBe("/projects/gtm-engineering");
    expect(ITEMS[0].category).toBe("ai-products");
    expect(ITEMS[1].category).toBe("ai-products");
  });

  it("render first on /portfolio in that order and both survive the AI Products filter", () => {
    render(<PortfolioPage />);
    const cardHeadings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(cardHeadings.slice(0, 2)).toEqual([FINTECH, PROPMGMT]);
    fireEvent.click(screen.getByRole("button", { name: /ai products/i }));
    expect(screen.getByRole("heading", { name: FINTECH })).toBeTruthy();
    expect(screen.getByRole("heading", { name: PROPMGMT })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /ventures/i }));
    expect(screen.queryByRole("heading", { name: FINTECH })).toBeNull();
    expect(screen.queryByRole("heading", { name: PROPMGMT })).toBeNull();
  });

  it("open the demos hub in the same order, with distinct accents and real case-study routes", () => {
    const [first, second] = DEMOS;
    expect([first.name, second.name]).toEqual([FINTECH, PROPMGMT]);
    expect(first.slug).toBe("gtm-engineering-fintech");
    expect(second.slug).toBe("gtm-engineering");
    expect(first.href).toBe("https://fintech.matthewoshin.com");
    expect(second.href).toBe("https://gotomarket.matthewoshin.com");
    expect(first.accent).not.toBe(second.accent);
    for (const demo of [first, second]) {
      expect(
        BUILDS.some((b) => `/projects/${b.slug}` === demo.caseStudy),
        `${demo.name} case study`,
      ).toBe(true);
    }
  });

  it("keep both builds unbranded: no client name in the card, case study, or hub copy", () => {
    for (const slug of GTM_SLUGS) {
      const build = BUILDS.find((b) => b.slug === slug)!;
      const buildText = [build.name, build.hook, build.summary, ...build.highlights, ...build.stack].join(" ");
      expect(buildText, slug).not.toMatch(CLIENT_NAMES);
      expect(buildText, `${slug} em dash`).not.toContain("—");
      const demo = DEMOS.find((d) => d.slug === slug)!;
      expect(`${demo.name} ${demo.tagline}`, slug).not.toMatch(CLIENT_NAMES);
      expect(demo.tagline, `${slug} em dash`).not.toContain("—");
    }
    expect(FINTECH).not.toBe(PROPMGMT);
    // Both names say what the product is; the vertical is the differentiator.
    expect(FINTECH).toContain("GTM Engineering");
    expect(PROPMGMT).toContain("GTM Engineering");
  });

  it("reach the copy surfaces: /portfolio metadata and the OceanAI grounding", () => {
    expect(metadata.description).toContain(FINTECH);
    expect(metadata.description).toContain(PROPMGMT);
    expect(metadata.description).not.toMatch(/\(GTM Engineering,/);
    expect(SYSTEM_PROMPT).toContain(FINTECH);
    expect(SYSTEM_PROMPT).toContain(PROPMGMT);
    expect(SYSTEM_PROMPT).not.toMatch(CLIENT_NAMES);
  });

  it("render the fintech case study with its highlights, stack, and View Demo link", async () => {
    const props = {
      params: Promise.resolve({ slug: "gtm-engineering-fintech" }),
    } as unknown as Parameters<typeof ProjectPage>[0];
    render(await ProjectPage(props));
    expect(screen.getByRole("heading", { level: 1, name: FINTECH })).toBeTruthy();
    const build = BUILDS.find((b) => b.slug === "gtm-engineering-fintech")!;
    for (const highlight of build.highlights) {
      expect(screen.getByText(highlight)).toBeTruthy();
    }
    for (const tool of build.stack) {
      expect(screen.getByText(tool)).toBeTruthy();
    }
    const demo = screen.getByRole("link", { name: /view demo/i });
    expect(demo.getAttribute("href")).toBe("https://fintech.matthewoshin.com");
  });
});
