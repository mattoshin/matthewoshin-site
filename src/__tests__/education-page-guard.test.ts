import { describe, expect, it } from "vitest";
import { EDUCATION, hasEducationPage, type School } from "@/data/content";

/**
 * hasEducationPage is the one rule for "does this school link anywhere".
 * /education/[slug] renders only when both the slug and the story exist, so
 * a school that has a slug but no story must never become a link (About and
 * Education would otherwise send readers to a 404).
 */
describe("hasEducationPage", () => {
  const base: School = { school: "Somewhere", detail: "A degree" };

  it("rejects a school with no slug", () => {
    expect(hasEducationPage(base)).toBe(false);
  });

  it("rejects a slug without a story (the 404 case)", () => {
    expect(hasEducationPage({ ...base, slug: "somewhere" })).toBe(false);
    expect(hasEducationPage({ ...base, slug: "somewhere", storyParagraphs: [] })).toBe(false);
  });

  it("accepts a slug with a story", () => {
    expect(hasEducationPage({ ...base, slug: "somewhere", storyParagraphs: ["p"] })).toBe(true);
  });

  it("every real school with a slug also has its story", () => {
    const slugged = EDUCATION.filter((s) => s.slug);
    expect(slugged.length).toBeGreaterThan(0);
    for (const s of slugged) expect(hasEducationPage(s), s.school).toBe(true);
  });
});
