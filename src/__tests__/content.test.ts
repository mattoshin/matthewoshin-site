import { describe, expect, it } from "vitest";
import {
  ABOUT,
  BUILDS,
  EDUCATION,
  HERO_PROOF,
  SKILL_GROUPS,
} from "@/data/content";

/**
 * Data-integrity net for content.ts: every page composes from this file, so a
 * bad slug or an emptied group breaks routes silently at runtime. These tests
 * catch that at commit time instead.
 */
describe("content.ts integrity", () => {
  it("build slugs are unique (each backs a /projects/[slug] route)", () => {
    const slugs = BUILDS.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("Dog House ships as a build with its live site link", () => {
    const doghouse = BUILDS.find((b) => b.slug === "dog-house");
    expect(doghouse).toBeDefined();
    expect(doghouse?.href).toBe("https://doghouseband.matthewoshin.com");
    expect(doghouse?.highlights.length).toBeGreaterThan(0);
  });

  it("the About block carries facts and the full story", () => {
    expect(ABOUT.facts.length).toBeGreaterThanOrEqual(3);
    expect(ABOUT.paragraphs.length).toBeGreaterThanOrEqual(5);
    for (const fact of ABOUT.facts) expect(fact.trim()).not.toBe("");
  });

  it("every skill group has items to render", () => {
    expect(SKILL_GROUPS.length).toBeGreaterThan(0);
    for (const group of SKILL_GROUPS) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("slugged schools have story paragraphs for their detail pages", () => {
    for (const school of EDUCATION) {
      if (school.slug) {
        expect(school.storyParagraphs?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it("hero proof chips all route somewhere", () => {
    for (const chip of HERO_PROOF) {
      expect(chip.label.trim()).not.toBe("");
      expect(chip.href).toMatch(/^\//);
    }
  });
});
