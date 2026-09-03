// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { SITE } from "@/data/content";

/**
 * Rasterizing the card runs next/og (satori + resvg wasm). Under jsdom the
 * wasm rejects the SVG bytes because typed arrays cross realms, so this one
 * assertion lives in a node-environment file. It proves the route actually
 * produces a card, not just that the copy in share-preview.test.tsx is right.
 */
describe("share preview card render", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the generated card as a real 1200x630 PNG", async () => {
    const card = await import("@/app/opengraph-image");
    expect(card.size).toEqual({ width: 1200, height: 630 });
    expect(card.contentType).toBe("image/png");
    expect(card.alt).toBe(SITE.name);

    const response = await card.default();
    const bytes = new Uint8Array(await response.arrayBuffer());
    const pngMagic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    expect(Array.from(bytes.slice(0, 8))).toEqual(pngMagic);
    // IHDR is the first chunk: width and height as big-endian u32 at 16 and 20.
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    expect([view.getUint32(16), view.getUint32(20)]).toEqual([1200, 630]);
    // A blank or broken render is a few KB; the real card with a photo is not.
    expect(bytes.byteLength).toBeGreaterThan(50_000);
  }, 30_000);

  it("folds every rendered input into the image id so a copy edit gets a new URL", async () => {
    const { cardVersion, generateImageMetadata } = await import("@/app/opengraph-image");
    const before = await cardVersion();
    expect(before).toMatch(/^[0-9a-f]{12}$/);
    expect(await generateImageMetadata()).toEqual([
      { id: before, alt: SITE.name, size: { width: 1200, height: 630 }, contentType: "image/png" },
    ]);

    // Same inputs, same id: crawlers keep their cache while nothing changed.
    expect(await cardVersion()).toBe(before);

    // Change only the tagline in content.ts and the id must move. Next only
    // fingerprints the route file, so this is what saves a stale card.
    vi.resetModules();
    vi.doMock("@/data/content", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/data/content")>();
      return { ...actual, SITE: { ...actual.SITE, ogTagline: "Something else entirely." } };
    });
    const edited = await import("@/app/opengraph-image");
    expect(await edited.cardVersion()).not.toBe(before);
    vi.doUnmock("@/data/content");
    vi.resetModules();
  });

  it("still answers the retired /og.png path with the live card", async () => {
    const { GET, dynamic } = await import("@/app/og.png/route");
    expect(dynamic).toBe("force-static");
    const response = await GET();
    expect(response.headers.get("content-type")).toMatch(/image\/png/);
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect(bytes.byteLength).toBeGreaterThan(50_000);
  }, 30_000);

  it("fails loudly when the portrait is missing instead of shipping a blank card", async () => {
    // The portrait path is resolved from process.cwd() at render time. Point it
    // somewhere empty: the build must fail, not quietly render a card with no face.
    vi.spyOn(process, "cwd").mockReturnValue("/nonexistent-og-root");
    const card = await import("@/app/opengraph-image");
    await expect(card.default()).rejects.toThrow(/ENOENT/);
  });

  it("serves X/Twitter the identical card through the twitter-image re-export", async () => {
    const [og, tw] = await Promise.all([
      import("@/app/opengraph-image"),
      import("@/app/twitter-image"),
    ]);
    expect(tw.default).toBe(og.default);
    expect(tw.alt).toBe(og.alt);
    expect(tw.size).toEqual(og.size);
    expect(tw.contentType).toBe(og.contentType);
    expect(tw.generateImageMetadata).toBe(og.generateImageMetadata);
  });
});
