import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PageShell from "@/components/page/PageShell";
import AboutPage from "@/app/about/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const read = (p: string) => readFileSync(path.join(process.cwd(), "src", p), "utf8");

/**
 * Display type split (design audit F-013, 2026-09-03): Fraunces, the share
 * card's serif, on content-page headings via `font-serif`; Poppins stays on
 * the ocean chrome (hero, nav, descent sections), which is what the June
 * Poppins-only pass (#53) was protecting. These tests bind the config to the
 * rendered classes so neither half can drift silently.
 */
describe("display type", () => {
  it("loads Fraunces in the root layout and exposes it as --font-fraunces on <html>", () => {
    const layout = read("app/layout.tsx");
    expect(layout).toMatch(/Fraunces\(\{[\s\S]*variable: "--font-fraunces"/);
    expect(layout).toMatch(/style: \["normal", "italic"\]/);
    expect(layout).toMatch(/\$\{poppins\.variable\} \$\{fraunces\.variable\}/);
  });

  it("maps the serif token to Fraunces and keeps display type on Poppins", () => {
    const css = read("app/globals.css");
    expect(css).toContain("--font-serif: var(--font-fraunces), Georgia, serif;");
    expect(css).toContain("--font-display: var(--font-poppins), system-ui, sans-serif;");
    expect(css).toMatch(/\.font-serif \{\s*font-family: var\(--font-serif\), Georgia, serif;\s*font-optical-sizing: auto;/);
    // Blog prose headings follow the same token.
    const prose = css.slice(css.indexOf(".prose-ocean h2"), css.indexOf(".prose-ocean h3") + 200);
    expect(prose.match(/var\(--font-serif\)/g)).toHaveLength(2);
    expect(prose).not.toContain("var(--font-display)");
  });

  it("renders content-page headings in the serif", () => {
    render(
      <PageShell zone="about" heading="Heading" intro="Intro" navLabel="About">
        <p>body</p>
      </PageShell>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Heading" }).className).toContain("font-serif");
  });

  it("renders About digests' headings in the serif", () => {
    render(<AboutPage />);
    // The Education and Off-the-clock digests; toolkit group labels stay small sans.
    for (const name of [/schools/i, /interests/i]) {
      const list = screen.getByRole("list", { name });
      const heads = within(list).getAllByRole("heading", { level: 3 });
      expect(heads.length).toBeGreaterThan(0);
      for (const h of heads) {
        expect(h.className).toContain("font-serif");
        expect(h.className).not.toContain("font-display");
      }
    }
  });

  it("keeps the ocean chrome on Poppins", () => {
    for (const p of [
      "components/sections/HeroSection.tsx",
      "components/chrome/BucketNav.tsx",
      "components/chrome/OceanAI.tsx",
      "components/sections/BucketEntries.tsx",
      "components/home/HomeSection.tsx",
    ]) {
      const src = read(p);
      expect(src, p).toContain("font-display");
      expect(src, p).not.toContain("font-serif");
    }
  });
});
