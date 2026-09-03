import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type { ReactElement } from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PageShell from "@/components/page/PageShell";
import AboutPage from "@/app/about/page";
import RootLayout from "@/app/layout";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// next/font wants the network; the mock hands back the variable name as the
// class so the rendered <html> can be checked for each family.
vi.mock("next/font/google", () => ({
  Poppins: (o: { variable: string }) => ({ variable: o.variable, className: "poppins" }),
  Fraunces: (o: { variable: string }) => ({ variable: o.variable, className: "fraunces" }),
}));

const SRC = path.join(process.cwd(), "src");
const read = (p: string) => readFileSync(path.join(SRC, p), "utf8");
const tsxUnder = (dir: string) =>
  (readdirSync(path.join(SRC, dir), { recursive: true }) as string[])
    .filter((f) => f.endsWith(".tsx") && !f.includes("__tests__"))
    .map((f) => path.join(dir, f));

/**
 * Display type split (design audit F-013, 2026-09-03): Fraunces, the share
 * card's serif, on every heading inside a glass panel (subpages and the home
 * descent panels) via `font-serif`; Poppins stays on type that sits on the
 * water (hero, nav, bucket labels, OceanAI), which is what the June
 * Poppins-only pass (#53) was protecting. These tests bind the config to the
 * rendered output so neither half can drift silently.
 */
describe("display type", () => {
  it("exposes Poppins, Fraunces roman and Fraunces italic as variables on <html>", () => {
    const html = RootLayout({ children: null }) as ReactElement<{ className?: string }>;
    expect(html.type).toBe("html");
    const classes = (html.props.className ?? "").split(/\s+/);
    for (const v of ["--font-poppins", "--font-fraunces", "--font-fraunces-italic"]) {
      expect(classes, v).toContain(v);
    }
  });

  it("preloads only the roman; the italic is a separate family fetched on use", () => {
    const layout = read("app/layout.tsx");
    const roman = layout.match(/Fraunces\(\{[^}]*variable: "--font-fraunces",[^}]*\}\)/);
    const italic = layout.match(/Fraunces\(\{[^}]*variable: "--font-fraunces-italic",[^}]*\}\)/);
    expect(roman?.[0]).toMatch(/style: "normal"/);
    expect(roman?.[0]).not.toContain("preload: false");
    expect(italic?.[0]).toMatch(/style: "italic"/);
    expect(italic?.[0]).toContain("preload: false");
  });

  it("maps the serif tokens to Fraunces, keeps display on Poppins, and routes italics to the italic family", () => {
    const css = read("app/globals.css");
    expect(css).toContain("--font-serif: var(--font-fraunces), Georgia, serif;");
    expect(css).toContain("--font-serif-italic: var(--font-fraunces-italic), Georgia, serif;");
    expect(css).toContain("--font-display: var(--font-poppins), system-ui, sans-serif;");
    expect(css).toMatch(/\.font-serif\.italic \{\s*font-family: var\(--font-serif-italic\);/);
    // No unlayered copies of the utilities: they would block responsive variants.
    expect(css).not.toMatch(/^\.font-(serif|display) \{/m);
    // Blog prose headings follow the serif token.
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

  it("renders the home descent panels in the serif like the subpages they open", () => {
    const src = read("components/home/HomeSection.tsx");
    expect(src).toMatch(/<h2 className="font-serif /);
    expect(src).toMatch(/font-serif text-lg italic/);
    expect(src).not.toContain("font-display");
  });

  it("leaves no heading inside a glass panel on font-display", () => {
    const files = [...tsxUnder("app"), ...tsxUnder("components/page"), ...tsxUnder("components/portfolio"), ...tsxUnder("components/home")];
    let seen = 0;
    for (const f of files) {
      const src = read(f);
      for (const tag of src.match(/<h[1-3]\b[^>]*>/g) ?? []) {
        seen += 1;
        expect(tag, `${f}: ${tag.slice(0, 80)}`).not.toContain("font-display");
      }
    }
    expect(seen).toBeGreaterThan(20);
  });

  it("keeps type on the water on Poppins", () => {
    for (const p of [
      "components/sections/HeroSection.tsx",
      "components/chrome/BucketNav.tsx",
      "components/chrome/OceanAI.tsx",
      "components/sections/BucketEntries.tsx",
    ]) {
      const src = read(p);
      expect(src, p).toMatch(/className=[^>]*font-display/);
      expect(src, p).not.toContain("font-serif");
    }
  });
});
