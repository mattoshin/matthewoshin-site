/**
 * scroll.ts - a tiny module-level handle to the active scroll engine.
 *
 * The ScrollController owns the Lenis instance but other client components (the
 * depth-gauge nav, the wordmark, the "back to surface" affordance) need to
 * trigger animated jumps without prop-drilling Lenis everywhere. They call
 * `scrollToZone("projects")` / `scrollToTop()` and this module forwards to Lenis
 * if it is live, or falls back to a native smooth scroll (reduced motion / SSR
 * edge cases) so navigation always works.
 */

"use client";

import type Lenis from "lenis";
import type { ZoneId } from "./depth";

let activeLenis: Lenis | null = null;

/** ScrollController registers/unregisters its instance here. */
export function registerLenis(instance: Lenis | null): void {
  activeLenis = instance;
}

function elementForZone(id: ZoneId): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.getElementById(id);
}

/** Animate-scroll to a zone section by id (#surface, #about, ...). */
export function scrollToZone(id: ZoneId): void {
  const el = elementForZone(id);
  if (!el) return;
  if (activeLenis) {
    activeLenis.scrollTo(el, { offset: 0, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Animate-scroll back to the surface (top). */
export function scrollToTop(): void {
  if (activeLenis) {
    activeLenis.scrollTo(0, { duration: 1.2 });
  } else if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
