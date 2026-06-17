/**
 * webgl.ts - feature detection for the hard fallback to StaticOcean.
 */

export function isWebGL2Available(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    return !!gl;
  } catch {
    return false;
  }
}
