import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
  it("is not filled turquoise at rest, only on hover and press", () => {
    render(<BucketNav />);
    const contact = screen.getByRole("link", { name: "Contact" });
    const classes = (contact.getAttribute("class") ?? "").split(/\s+/);
    expect(classes).not.toContain("bg-bio-cyan");
    expect(classes).toContain("hover:bg-bio-cyan");
    expect(classes).toContain("active:bg-bio-cyan");
  });

  it("the mobile-menu Contact CTA gets the same treatment", () => {
    render(<BucketNav />);
    fireEvent.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    const sheet = screen.getByRole("dialog", { name: "Site navigation" });
    const contact = within(sheet).getByRole("link", { name: "Contact" });
    const classes = (contact.getAttribute("class") ?? "").split(/\s+/);
    expect(classes).not.toContain("bg-bio-cyan");
    expect(classes).toContain("hover:bg-bio-cyan");
    expect(classes).toContain("active:bg-bio-cyan");
  });
});

describe("BucketNav About Me", () => {
  it("puts an About Me link in the primary desktop nav pointing to /about", () => {
    render(<BucketNav />);
    const sections = screen.getByRole("navigation", { name: "Sections" });
    const about = within(sections).getByRole("link", { name: "About Me" });
    expect(about.getAttribute("href")).toBe("/about");
  });
});
