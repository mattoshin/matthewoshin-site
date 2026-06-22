"use client";

/**
 * SharkLoader - the branded load veil that kills the "background hasn't loaded
 * yet" flash.
 *
 * The ocean paints in stages (instant CSS bg -> SSR StaticOcean gradient -> the
 * WebGL canvas a beat later, after hydration + the ssr:false dynamic import +
 * shader init). That last stage popping in is the flash. This overlay covers the
 * viewport from the first paint and fades out the moment the scene has actually
 * PAINTED (store `sceneReady`, set after the WebGL renders a few frames, or
 * immediately on a static-ocean fallback). A hard timeout is the safety net so it
 * can never get stuck.
 *
 * It is SSR'd so it covers the very first paint; a <noscript> rule in the layout
 * hides it when JS is off (so it never traps a no-JS visitor under the veil).
 * Plays once per hard load (module flag), never on client-side route nav.
 */

import { useEffect, useRef, useState } from "react";
import { useDescentStore } from "@/lib/store";

// Once per hard page load. DescentChrome remounts when leaving /app/*, but the
// loader should only ever play on the initial load, not on client navigation.
let dismissed = false;

const FADE_MS = 550;
const MAX_WAIT_MS = 2200; // safety net if sceneReady never fires

export default function SharkLoader() {
  const sceneReady = useDescentStore((s) => s.sceneReady);
  const [gone, setGone] = useState(dismissed);
  const [fading, setFading] = useState(false);
  const faded = useRef(false);
  const unmountTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (dismissed) return;
    const startFade = () => {
      if (faded.current) return;
      faded.current = true;
      setFading(true);
      unmountTimer.current = window.setTimeout(() => {
        dismissed = true;
        setGone(true);
      }, FADE_MS);
    };
    if (sceneReady) startFade();
    const cap = window.setTimeout(startFade, MAX_WAIT_MS);
    return () => window.clearTimeout(cap);
  }, [sceneReady]);

  // Clear the unmount timer if this ever unmounts mid-fade.
  useEffect(() => () => window.clearTimeout(unmountTimer.current), []);

  if (gone) return null;

  return (
    <div
      className="shark-loader"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        background:
          "radial-gradient(circle at 50% 42%, #0e3446 0%, #08222f 45%, #061824 100%)",
      }}
    >
      <span className="shark-loader__fish" style={{ width: 120, height: 120 }}>
        <svg
          viewBox="0 0 64 64"
          width="100%"
          height="100%"
          role="img"
          aria-label="Loading"
        >
          <defs>
            <linearGradient id="ldShark" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
              <stop offset="0" stopColor="#6ff3d8" />
              <stop offset="1" stopColor="#33c2e6" />
            </linearGradient>
          </defs>
          <g fill="url(#ldShark)">
            <path d="M58 31 C52 24 46 23 39 23 L33 8 L30 24 C24 25 19 26 16 28 L4 16 L13 30 L9 42 L17 33 C24 37 32 39 40 38 C48 37 53 35 58 31 Z" />
            <path d="M35 37 L28 48 L43 38 Z" />
          </g>
          <circle cx="52" cy="29" r="1.8" fill="#08222f" />
        </svg>
      </span>
    </div>
  );
}
