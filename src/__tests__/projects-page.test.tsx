import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectPage from "@/app/projects/[slug]/page";
import { BUILDS } from "@/data/content";

/**
 * Every BUILDS entry backs a statically generated /projects/[slug] case study.
 * Dog House is the entry this branch adds, so its route is the one pinned here:
 * portfolio card -> "Case study" -> this page must render the full build.
 */
describe("/projects/dog-house case study", () => {
  it("renders the Dog House build: heading, highlights, stack, live-site link", async () => {
    const props = {
      params: Promise.resolve({ slug: "dog-house" }),
    } as unknown as Parameters<typeof ProjectPage>[0];
    render(await ProjectPage(props));

    expect(
      screen.getByRole("heading", { level: 1, name: "Dog House" }),
    ).toBeTruthy();

    const doghouse = BUILDS.find((b) => b.slug === "dog-house");
    for (const highlight of doghouse?.highlights ?? []) {
      expect(screen.getByText(highlight)).toBeTruthy();
    }
    for (const tool of doghouse?.stack ?? []) {
      expect(screen.getByText(tool)).toBeTruthy();
    }

    const visit = screen.getByRole("link", { name: /visit dog house/i });
    expect(visit.getAttribute("href")).toBe(
      "https://doghouseband.matthewoshin.com",
    );
  });
});
