"use client";

/**
 * DescentChrome - mounts every client-only piece of the descent in one place so
 * the home page (a server component) stays clean. None of these render section
 * content; they are the engine + overlay UI that sit around the server-rendered
 * sections.
 *
 *   MotionController   - resolves reduced-motion, marks store hydrated
 *   ScrollController   - Lenis + GSAP ScrollTrigger -> store progress
 *   DescentBackground  - the fixed canvas (or static ocean) behind everything
 *   BucketNav          - sticky top bucket nav: wordmark + section pills + motion
 *   DepthGauge         - the right-rail depth progress indicator
 */

import MotionController from "./MotionController";
import ScrollController from "./ScrollController";
import DescentBackground from "./DescentBackground";
import BucketNav from "./BucketNav";
import DepthGauge from "./DepthGauge";

export default function DescentChrome() {
  return (
    <>
      <MotionController />
      <ScrollController />
      <DescentBackground />
      <BucketNav />
      <DepthGauge />
    </>
  );
}
