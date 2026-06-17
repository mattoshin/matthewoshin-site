"use client";

/**
 * MotionController - reconciles the OS prefers-reduced-motion query with the
 * user's manual toggle, and marks the store as hydrated.
 *
 * It owns no UI. It listens to the media query and pushes the result into the
 * store via setReducedMotion (the store ORs in the manual override). It sets
 * `hydrated` once on mount so DescentBackground can stop showing the SSR
 * fallback and decide whether to mount the canvas.
 */

import { useEffect } from "react";
import { useDescentStore } from "@/lib/store";

export default function MotionController() {
  const setReducedMotion = useDescentStore((s) => s.setReducedMotion);
  const setHydrated = useDescentStore((s) => s.setHydrated);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      // If the user manually forced reduced motion, keep it on. Otherwise track
      // the OS preference exactly.
      const manual = useDescentStore.getState().manualReducedMotion;
      setReducedMotion(manual ? true : mq.matches);
    };

    apply();
    setHydrated(true);

    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [setReducedMotion, setHydrated]);

  return null;
}
