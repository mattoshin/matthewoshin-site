import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSection from "@/components/sections/HeroSection";
import { HERO_PROOF } from "@/data/content";

describe("HeroSection", () => {
  it("renders every proof chip plus the About door", () => {
    render(<HeroSection />);
    for (const chip of HERO_PROOF) {
      expect(screen.getByRole("link", { name: chip.label })).toBeTruthy();
    }
    const about = screen.getByRole("link", { name: /more about me/i });
    expect(about.getAttribute("href")).toBe("/about");
  });

  it("leads with the positioning line as the h1", () => {
    render(<HeroSection />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toMatch(
      /engineer.s hands, investor.s judgment, founder.s speed\./i,
    );
  });
});
