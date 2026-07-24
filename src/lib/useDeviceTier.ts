"use client";

/**
 * useDeviceTier - the single source of truth for "is this a phone-class viewport".
 *
 * The ocean is far heavier than a phone GPU/memory budget can hold at full
 * fidelity (14 elements, DPR up to 1.5, shader surfaces, 4k plankton). Left
 * unchecked, FPS collapses and the canvas hard-falls-back to the flat static
 * gradient, taking the sailboat with it. So phones run a
 * trimmed, lower-DPR profile (see OceanCanvas + the phone registries).
 *
 * "phone" is a WIDTH class, not a user-agent sniff: <= 767px matches the site's
 * Tailwind `md` breakpoint - it covers every phone and excludes iPads, which
 * keep the full scene.
 *
 * SSR-safe: getDeviceTier() returns "full" when there is no window. Every caller
 * lives under the ssr:false canvas anyway, so there is never a hydration
 * mismatch from this.
 */

import { useEffect, useState } from "react";

export type DeviceTier = "phone" | "full";

/** Phones: viewport width at or below this run the trimmed scene. */
export const PHONE_MAX_WIDTH = 767;

const PHONE_QUERY = `(max-width: ${PHONE_MAX_WIDTH}px)`;

/** Read the current tier synchronously. Returns "full" on the server. */
export function getDeviceTier(): DeviceTier {
  if (typeof window === "undefined" || !window.matchMedia) return "full";
  return window.matchMedia(PHONE_QUERY).matches ? "phone" : "full";
}

/**
 * Subscribe to the phone/full tier. Re-renders the caller ONLY when the viewport
 * crosses the breakpoint (phone rotation, desktop window resize across 767px),
 * never on every resize pixel.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(getDeviceTier);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(PHONE_QUERY);
    const onChange = () => setTier(mq.matches ? "phone" : "full");
    onChange(); // reconcile in case the width changed between render and effect
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return tier;
}
