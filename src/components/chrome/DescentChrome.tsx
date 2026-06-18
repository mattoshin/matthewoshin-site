"use client";

/**
 * DescentChrome - the persistent ocean chrome. Mounted ONCE in the root layout,
 * so the canvas + every overlay piece persist across client-side route
 * navigations (no unmount/remount, no flash). None of these render page content;
 * they are the engine + overlay UI that sit around the per-route content.
 *
 *   MotionController   - resolves reduced-motion, marks store hydrated
 *   DescentBackground  - the fixed canvas (or static ocean) behind everything
 *   BucketNav          - sticky top nav: wordmark + section links + motion toggle
 *   DepthGauge         - the right-rail depth progress indicator
 *   OceanAI            - floating deep-sea chat widget, on every page (manages
 *                        its own fixed position + pointer-events; sits on top)
 *
 * Depth is ROUTE-DRIVEN now (each page's ZoneSetter writes targetProgress and the
 * canvas lerps to it), so there is no scroll engine here anymore.
 */

import MotionController from "./MotionController";
import DescentBackground from "./DescentBackground";
import BucketNav from "./BucketNav";
import DepthGauge from "./DepthGauge";
import OceanAI from "./OceanAI";

export default function DescentChrome() {
  return (
    <>
      <MotionController />
      <DescentBackground />
      <BucketNav />
      <DepthGauge />
      <OceanAI />
    </>
  );
}
