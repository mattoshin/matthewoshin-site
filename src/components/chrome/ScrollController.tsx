"use client";

/**
 * ScrollController - the scroll engine. Owns Lenis, wires it to GSAP
 * ScrollTrigger on a single ticker, and writes normalized progress to the store.
 *
 * The exact wiring required by the design:
 *   - lenis.raf is driven by gsap.ticker (one ticker, no double rAF).
 *   - lenis.on('scroll', ScrollTrigger.update) keeps triggers in sync.
 *   - gsap.ticker.lagSmoothing(0) so big tab-away gaps don't get smoothed.
 *
 * Progress is computed from window scrollY over the full scrollable height and
 * pushed to the store; OceanScene/StaticOcean read it from there.
 *
 * When reduced motion is active we do NOT start Lenis (native scrolling stays).
 * We still track progress via a scroll listener so the depth gauge updates.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDescentStore } from "@/lib/store";
import { registerLenis } from "@/lib/scroll";

function computeProgress(): number {
  if (typeof document === "undefined") return 0;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

export default function ScrollController() {
  const reducedMotion = useDescentStore((s) => s.reducedMotion);
  const hydrated = useDescentStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    const setScrollProgress = useDescentStore.getState().setScrollProgress;

    // Reduced motion: skip Lenis entirely, keep native scroll, but still report
    // progress so the gauge and (if any) static visuals stay in sync.
    if (reducedMotion) {
      const onScroll = () => setScrollProgress(computeProgress());
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    // Full smooth-scroll path.
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // Standard easeOutExpo-ish curve.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    registerLenis(lenis);

    const onLenisScroll = () => {
      ScrollTrigger.update();
      setScrollProgress(computeProgress());
    };
    lenis.on("scroll", onLenisScroll);

    const raf = (time: number) => {
      // gsap.ticker passes seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Seed initial progress.
    setScrollProgress(computeProgress());

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      registerLenis(null);
    };
  }, [reducedMotion, hydrated]);

  return null;
}
