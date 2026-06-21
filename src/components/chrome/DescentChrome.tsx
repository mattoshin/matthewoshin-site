"use client";

/**
 * DescentChrome - the persistent ocean chrome. Mounted ONCE in the root layout,
 * so the canvas + every overlay piece persist across client-side route
 * navigations (no unmount/remount, no flash). None of these render page content;
 * they are the engine + overlay UI that sit around the per-route content.
 *
 *   MotionController   - resolves reduced-motion, marks store hydrated
 *   ScrollController   - the Lenis smooth-scroll engine (wheel smoothing only)
 *   DescentBackground  - the fixed canvas (or static ocean) behind everything
 *   BucketNav          - sticky top nav: wordmark + section links + motion toggle
 *   DepthGauge         - the right-rail depth progress indicator
 *   OceanAI            - floating deep-sea chat widget, on every page (manages
 *                        its own fixed position + pointer-events; sits on top)
 *
 * Depth is ROUTE-DRIVEN (each page's ZoneSetter writes targetProgress and the
 * canvas lerps to it) and, on the home, scroll-driven. ScrollController only
 * smooths the wheel; it never touches depth/progress.
 */

import MotionController from "./MotionController";
import ScrollController from "./ScrollController";
import DescentBackground from "./DescentBackground";
import BucketNav from "./BucketNav";
import DepthGauge from "./DepthGauge";
import OceanAI from "./OceanAI";
import { usePathname } from "next/navigation";

export default function DescentChrome() {
  // The /app/* demos render full-bleed as their own apps; suppress the ocean
  // chrome (canvas, nav, depth gauge, chat widget) entirely on that section.
  const pathname = usePathname();
  if (pathname?.startsWith("/app")) return null;

  return (
    <>
      <MotionController />
      <ScrollController />
      <DescentBackground />
      <BucketNav />
      <DepthGauge />
      <OceanAI />
    </>
  );
}
