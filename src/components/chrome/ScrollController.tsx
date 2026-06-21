"use client";

/**
 * ScrollController - the smooth-scroll engine (Lenis).
 *
 * This owns ONE thing: buttery wheel/trackpad smoothing for the whole site. It
 * deliberately does NOT touch depth/progress. Depth stays route-driven
 * (ZoneSetter writes targetProgress) and, on the home, scroll-driven
 * (HomeScrollDepth reads window.scrollY). Lenis moves the REAL document scroll
 * position (not a virtual/overlay scroll), so those native `scroll` listeners
 * keep firing and the ocean dive is unaffected - it just becomes smooth.
 *
 * Lifecycle:
 *   - Wait for `hydrated` so we don't start before the OS motion pref is known.
 *   - Reduced motion -> never start Lenis; native scrolling stays (the .lenis
 *     CSS in globals.css only applies while the engine is live).
 *   - Otherwise run Lenis on its own rAF loop (GSAP is no longer used here, so
 *     there's no ticker to share - one plain rAF is simplest and robust).
 *   - On route change, snap to the top of the new page and remeasure height
 *     (the persistent layout means Lenis isn't torn down between routes).
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useDescentStore } from "@/lib/store";

// easeOutExpo - the curve the site shipped with originally. A long, soft glide
// out so flicks decelerate like sinking through water rather than stopping dead.
const easeOutExpo = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export default function ScrollController() {
  const reducedMotion = useDescentStore((s) => s.reducedMotion);
  const hydrated = useDescentStore((s) => s.hydrated);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Engine lifecycle: own a Lenis instance whenever motion is allowed.
  useEffect(() => {
    if (!hydrated || reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      easing: easeOutExpo,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [hydrated, reducedMotion]);

  // Route change: start the new page at the top and remeasure (content height
  // changes between routes; Lenis caches it until told to resize).
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => lenis.resize());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
