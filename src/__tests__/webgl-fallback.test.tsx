/**
 * webgl-fallback.test.tsx
 *
 * Guards the graceful-degradation contract that keeps a broken WebGL context
 * (the Edge/managed-Windows failure that rendered the hero as a dark blank) from
 * ever showing instead of the static ocean:
 *
 *   1. isWebGL2Available() reports UNAVAILABLE for every "can't really render"
 *      path - null context, a fired webglcontextcreationerror, and a throwing
 *      getContext - not just the happy null case.
 *   2. SceneErrorBoundary renders its fallback (and notifies the parent) when the
 *      canvas subtree throws during render/init.
 */

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { isWebGL2Available } from "@/lib/webgl";
import SceneErrorBoundary from "@/components/scene/SceneErrorBoundary";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isWebGL2Available", () => {
  it("returns true when a webgl2 context is created", () => {
    const fakeGl = {
      getExtension: () => ({ loseContext: () => {} }),
    } as unknown as WebGL2RenderingContext;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(fakeGl);

    expect(isWebGL2Available()).toBe(true);
  });

  it("returns false when the context is null (WebGL2 unsupported)", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    expect(isWebGL2Available()).toBe(false);
  });

  it("returns false when the browser fires a webglcontextcreationerror", () => {
    // Emulate a driver that dispatches the creation-error event during
    // getContext and then hands back null (the managed-GPU failure mode).
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      function (this: HTMLCanvasElement) {
        this.dispatchEvent(new Event("webglcontextcreationerror"));
        return null;
      } as typeof HTMLCanvasElement.prototype.getContext,
    );

    expect(isWebGL2Available()).toBe(false);
  });

  it("returns false when getContext throws", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => {
      throw new Error("context creation blew up");
    });

    expect(isWebGL2Available()).toBe(false);
  });

  it("releases the probe context so it can't starve the real canvas", () => {
    const loseContext = vi.fn();
    const fakeGl = {
      getExtension: vi.fn(() => ({ loseContext })),
    } as unknown as WebGL2RenderingContext;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(fakeGl);

    isWebGL2Available();

    expect(loseContext).toHaveBeenCalledTimes(1);
  });
});

describe("SceneErrorBoundary", () => {
  function Boom(): never {
    throw new Error("shader link failed on ANGLE");
  }

  it("renders the fallback and notifies the parent when the subtree throws", () => {
    // React logs the caught error to console.error; silence it for a clean run.
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onError = vi.fn();

    render(
      <SceneErrorBoundary
        fallback={<div data-testid="static-fallback">ocean</div>}
        onError={onError}
      >
        <Boom />
      </SceneErrorBoundary>,
    );

    expect(screen.getByTestId("static-fallback")).toBeTruthy();
    expect(onError).toHaveBeenCalledTimes(1);
    errSpy.mockRestore();
  });

  it("renders children unchanged when nothing throws", () => {
    render(
      <SceneErrorBoundary fallback={<div>fallback</div>}>
        <div data-testid="live-scene">canvas</div>
      </SceneErrorBoundary>,
    );

    expect(screen.getByTestId("live-scene")).toBeTruthy();
  });
});
