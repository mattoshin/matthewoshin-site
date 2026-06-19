"use client";

/**
 * HomeScrollDepth - the home page's scroll-to-depth bridge.
 *
 * On the home (and ONLY the home), depth is scroll-driven: scrolling DOWN the
 * long surface-to-seabed page DIVES the persistent ocean with you. It maps the
 * window scroll fraction (0 at the top surface, 1 at the contact floor) into the
 * store's `targetProgress`; the canvas (OceanScene) lerps the camera + fog
 * toward it and reports the smoothed value back, so the descent feels like
 * sinking, not snapping.
 *
 * The interior pages keep their route-driven depth (ZoneSetter). The home has no
 * ZoneSetter, so nothing fights this. Renders nothing.
 *
 * Reduced motion: the canvas is not mounted, so nothing lerps scrollProgress.
 * We set it directly here so the depth gauge still tracks the scroll.
 */

import { useEffect } from "react";
import { useDescentStore } from "@/lib/store";

export default function HomeScrollDepth() {
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
      const s = useDescentStore.getState();
      s.setTargetProgress(clamped);
      // No canvas in reduced motion -> drive the gauge directly.
      if (s.reducedMotion) s.setScrollProgress(clamped);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return null;
}
