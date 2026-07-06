import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BucketNav from "@/components/chrome/BucketNav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

/**
 * Regression net for the Contact CTA treatment (2026-07-06): the pill rests as
 * translucent dark glass and only turns bio-cyan on hover or press. A future
 * class edit that re-fills it at rest fails here.
 */
describe("BucketNav Contact CTA", () => {
  afterEach(cleanup);

  it("is not filled turquoise at rest, only on hover and press", () => {
    render(<BucketNav />);
    const contact = screen.getByRole("link", { name: "Contact" });
    const classes = (contact.getAttribute("class") ?? "").split(/\s+/);
    expect(classes).not.toContain("bg-bio-cyan");
    expect(classes).toContain("hover:bg-bio-cyan");
    expect(classes).toContain("active:bg-bio-cyan");
  });
});
