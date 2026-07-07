import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DemoBar from "@/components/demos/DemoBar";
import { matchDemoByPath } from "@/data/demos";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));
const mockUsePathname = vi.mocked(usePathname);

beforeEach(() => {
  mockUsePathname.mockReset();
});

describe("matchDemoByPath", () => {
  it("matches a demo landing page with no sub-page", () => {
    const match = matchDemoByPath("/app/galactic-signals");
    expect(match?.demo.name).toBe("Galactic Signals");
    expect(match?.landingHref).toBe("/app/galactic-signals");
    expect(match?.subPage).toBeNull();
  });

  it("matches a demo sub-route and title-cases the sub-page crumb", () => {
    const match = matchDemoByPath("/app/galactic-signals/dashboard");
    expect(match?.demo.name).toBe("Galactic Signals");
    expect(match?.landingHref).toBe("/app/galactic-signals");
    expect(match?.subPage).toBe("Dashboard");
  });

  it("returns null for the /app index and unrelated paths", () => {
    expect(matchDemoByPath("/app")).toBeNull();
    expect(matchDemoByPath("/portfolio")).toBeNull();
  });

  it("does not match on a partial segment", () => {
    // "/app/sec" must not claim the "/app/sec-intelligence" demo.
    expect(matchDemoByPath("/app/sec")).toBeNull();
  });
});

describe("DemoBar breadcrumb", () => {
  it("always links back to Portfolio", () => {
    mockUsePathname.mockReturnValue("/app/galactic-signals/dashboard");
    render(<DemoBar />);
    expect(
      screen.getByRole("link", { name: "Portfolio" }).getAttribute("href"),
    ).toBe("/portfolio");
  });

  it("on a dashboard, the demo name links to its landing page and the sub-page shows", () => {
    mockUsePathname.mockReturnValue("/app/galactic-signals/dashboard");
    render(<DemoBar />);
    const demo = screen.getByRole("link", { name: "Galactic Signals" });
    expect(demo.getAttribute("href")).toBe("/app/galactic-signals");
    expect(screen.getByText("Dashboard")).toBeTruthy();
  });

  it("on the landing page, the demo name is the current crumb (not a link)", () => {
    mockUsePathname.mockReturnValue("/app/galactic-signals");
    render(<DemoBar />);
    expect(
      screen.queryByRole("link", { name: "Galactic Signals" }),
    ).toBeNull();
    expect(screen.getByText("Galactic Signals")).toBeTruthy();
  });

  it("on the /app index, shows only the Portfolio crumb", () => {
    mockUsePathname.mockReturnValue("/app");
    render(<DemoBar />);
    expect(screen.getByRole("link", { name: "Portfolio" })).toBeTruthy();
    expect(screen.queryByText("Galactic Signals")).toBeNull();
  });
});
