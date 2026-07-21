import { describe, expect, it } from "vitest";
import {
  SCENE_ELEMENTS,
  SCENE_ELEMENTS_PHONE,
  SCENE_ELEMENTS_PHONE_LITE,
} from "@/components/scene/registry";

/**
 * Regression guard for the 2026-07-21 "lowkey ocean scene" pass: the
 * speedboat+skier and dolphin were removed as showy set-pieces. The
 * phone-lite fallback (which resurrects elements when FPS can't hold) must
 * not bring the boat back - that was the exact bug class fixed on 2026-06-22
 * for the original phone-tier work.
 */
describe("scene registry", () => {
  it("no longer includes the speedboat+skier or the dolphin", () => {
    const ids = SCENE_ELEMENTS.map((e) => e.id);
    expect(ids).not.toContain("water-skier");
    expect(ids).not.toContain("dolphin");
  });

  it("keeps the sailboat as the lone surface actor", () => {
    expect(SCENE_ELEMENTS.map((e) => e.id)).toContain("sailboats");
  });

  it("has 14 elements after the boat removal (was 16)", () => {
    expect(SCENE_ELEMENTS.length).toBe(14);
  });

  it("phone and phone-lite fallbacks never resurrect the speedboat+skier", () => {
    expect(SCENE_ELEMENTS_PHONE.map((e) => e.id)).not.toContain("water-skier");
    expect(SCENE_ELEMENTS_PHONE_LITE.map((e) => e.id)).not.toContain("water-skier");
  });
});
