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
 *   TopBar             - wordmark + skip/flat + motion toggle
 *   DepthGauge         - the right-rail depth navigation
 */

import MotionController from "./MotionController";
import ScrollController from "./ScrollController";
import DescentBackground from "./DescentBackground";
import TopBar from "./TopBar";
import DepthGauge from "./DepthGauge";

export default function DescentChrome() {
  return (
    <>
      <MotionController />
      <ScrollController />
      <DescentBackground />
      <TopBar />
      <DepthGauge />
    </>
  );
}
