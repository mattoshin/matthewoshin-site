import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import HeroSection from "@/components/sections/HeroSection";
import { HERO_PROOF } from "@/data/content";

describe("HeroSection", () => {
  afterEach(cleanup);

  it("renders every proof chip plus the About door", () => {
    render(<HeroSection />);
    for (const chip of HERO_PROOF) {
      expect(
        screen.getByRole("link", { name: (name) => name.includes(chip.label) }),
      ).toBeTruthy();
    }
    const about = screen.getByRole("link", { name: /more about me/i });
    expect(about.getAttribute("href")).toBe("/about");
  });
});
