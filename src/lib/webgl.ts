/**
 * webgl.ts - feature detection for the hard fallback to StaticOcean.
 *
 * The detection here has to match what the REAL canvas does as closely as
 * possible. A probe that only asks for a bare `webgl2` context can report
 * "supported" on a machine where the actual canvas - created with the scene's
 * attributes - fails to get a context (e.g. a locked-down Edge/Windows box where
 * the GPU is blocklisted). That mismatch is what leaves a broken/blank canvas on
 * screen instead of the static ocean. So we probe with the same intent the scene
 * uses, listen for a `webglcontextcreationerror`, and treat any failure as
 * "unavailable" so the caller shows StaticOcean up front.
 */

// A soft creation error type (WebGLContextEvent isn't in every lib.dom).
interface ContextCreationErrorEvent extends Event {
  readonly statusMessage?: string;
}

/**
 * Attributes the probe context is created with. Intentionally mirrors the scene
 * canvas's intent (alpha, tolerate a software/perf-caveat context) WITHOUT
 * forcing `powerPreference: "high-performance"`: forcing the discrete GPU is
 * exactly what fails (or selects a buggy/blocklisted adapter) on some managed
 * machines, and the real canvas no longer forces it either.
 */
const PROBE_ATTRS: WebGLContextAttributes = {
  alpha: true,
  failIfMajorPerformanceCaveat: false,
};

export function isWebGL2Available(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");

    // `webglcontextcreationerror` fires synchronously during getContext when the
    // browser can create the <canvas> element but not a usable GL context (the
    // failure mode a plain null-check can miss on some drivers).
    let creationFailed = false;
    const onCreationError = () => {
      creationFailed = true;
    };
    canvas.addEventListener(
      "webglcontextcreationerror",
      onCreationError as EventListener,
      { once: true },
    );

    const gl = canvas.getContext("webgl2", PROBE_ATTRS) as WebGL2RenderingContext | null;

    canvas.removeEventListener(
      "webglcontextcreationerror",
      onCreationError as EventListener,
    );

    if (!gl || creationFailed) return false;

    // Release the probe context immediately. Some drivers hand out a very small
    // number of hardware contexts; holding this one could starve the real scene
    // canvas. Losing it is best-effort - never let cleanup throw.
    try {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      /* ignore - cleanup only */
    }

    return true;
  } catch {
    return false;
  }
}

// Re-exported so callers/tests can reference the exact event shape they listen
// for on the live canvas.
export type { ContextCreationErrorEvent };
