import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SYSTEM_PROMPT } from "@/app/api/oceanai/route";
import DemosHubPage from "@/app/app/page";
import PortfolioPage, { metadata } from "@/app/portfolio/page";
import ProjectPage, { generateMetadata } from "@/app/projects/[slug]/page";
import { BUCKETS, BUILDS } from "@/data/content";
import { DEMOS, matchDemoByPath } from "@/data/demos";
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
    // Both real names say what the product is, the vertical is the
    // differentiator, and the hub name matches the build name.
    const names = GTM_SLUGS.map((slug) => {
      const build = BUILDS.find((b) => b.slug === slug)!;
      expect(build.name, slug).toContain("GTM Engineering");
      expect(DEMOS.find((d) => d.slug === slug)!.name, `${slug} hub name`).toBe(build.name);
      return build.name;
    });
    expect(new Set(names).size).toBe(GTM_SLUGS.length);
  });

  it("reach the copy surfaces: /portfolio metadata and the OceanAI grounding", () => {
    expect(metadata.description).toContain(FINTECH);
    expect(metadata.description).toContain(PROPMGMT);
    expect(metadata.description).not.toMatch(/\(GTM Engineering,/);
    expect(SYSTEM_PROMPT).toContain(FINTECH);
    expect(SYSTEM_PROMPT).toContain(PROPMGMT);
    expect(SYSTEM_PROMPT).not.toMatch(CLIENT_NAMES);
    // The home page introduces the portfolio with a teaser; the retired single
    // name must not survive there as a standalone list item.
    const teaser = BUCKETS.find((b) => b.id === "portfolio")?.teaser ?? "";
    expect(teaser).not.toMatch(/now: GTM Engineering,/);
    expect(teaser).toMatch(/fintech banking/i);
    expect(teaser).toMatch(/property management/i);
    expect(teaser).not.toMatch(CLIENT_NAMES);
  });

  it("render the rendered card CTAs: View Demo to each live domain, Case study to each route", () => {
    render(<PortfolioPage />);
    const demoLinks = screen.getAllByRole("link", { name: /view demo/i }).map((a) => a.getAttribute("href"));
    expect(demoLinks.slice(0, 2)).toEqual(["https://fintech.matthewoshin.com", "https://gotomarket.matthewoshin.com"]);
    const caseLinks = screen.getAllByRole("link", { name: /case study/i }).map((a) => a.getAttribute("href"));
    expect(caseLinks.slice(0, 2)).toEqual(["/projects/gtm-engineering-fintech", "/projects/gtm-engineering"]);
    // Long names break on a balanced line, like the case-study h1 does.
    for (const name of [FINTECH, PROPMGMT]) {
      const heading = screen.getByRole("heading", { name });
      expect((heading.getAttribute("class") ?? "").split(/\s+/), name).toContain("text-balance");
    }
  });

  it("lead the /app demos hub, open on their own domains, and the hub intro no longer denies it", () => {
    render(<DemosHubPage />);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings.slice(0, 2)).toEqual([FINTECH, PROPMGMT]);
    expect(screen.getByRole("link", { name: `Open ${FINTECH} demo` }).getAttribute("href")).toBe(
      "https://fintech.matthewoshin.com",
    );
    expect(screen.getByRole("link", { name: `Open ${PROPMGMT} demo` }).getAttribute("href")).toBe(
      "https://gotomarket.matthewoshin.com",
    );
    // Two live builds now sit first under the intro, so the intro must not
    // claim that nothing on the page talks to a live server.
    expect(screen.queryByText(/nothing here talks to a live server/i)).toBeNull();
    expect(screen.getByText(/live builds that open on their own domains/i)).toBeTruthy();
    // External demos never own a breadcrumb: an /app path shaped like their
    // slug matches nothing.
    expect(matchDemoByPath("/app/gtm-engineering")).toBeNull();
    expect(matchDemoByPath("/app/gtm-engineering-fintech")).toBeNull();
  });

  it("carry the new names into each case study's tab title and description", async () => {
    for (const slug of GTM_SLUGS) {
      const build = BUILDS.find((b) => b.slug === slug)!;
      const meta = await generateMetadata({
        params: Promise.resolve({ slug }),
      } as unknown as Parameters<typeof generateMetadata>[0]);
      expect(meta.title, slug).toBe(build.name);
      expect(meta.description, slug).toBe(build.hook);
    }
  });

  it("render the renamed property-management case study under its original slug", async () => {
    const props = {
      params: Promise.resolve({ slug: "gtm-engineering" }),
    } as unknown as Parameters<typeof ProjectPage>[0];
    render(await ProjectPage(props));
    expect(screen.getByRole("heading", { level: 1, name: PROPMGMT })).toBeTruthy();
    const build = BUILDS.find((b) => b.slug === "gtm-engineering")!;
    expect(screen.getByText(build.hook)).toBeTruthy();
    const demo = screen.getByRole("link", { name: /view demo/i });
    expect(demo.getAttribute("href")).toBe("https://gotomarket.matthewoshin.com");
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
