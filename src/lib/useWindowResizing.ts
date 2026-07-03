"use client";

/**
 * useWindowResizing - true while the window is actively being resized.
 *
 * Flips true on the first `resize` event and back to false once the events go
 * quiet for `settleMs`. OceanCanvas uses this to hide the moving actors (boats,
 * dolphin, creatures) during a window-corner drag - a stretched stale frame
 * turns them into visible artifacts - while the water keeps rendering; the
 * actors pop back in once the drag settles.
 *
 * `enabled` exists because phones fire `resize` on every URL-bar collapse while
 * scrolling - the ocean must NOT blink out there, so callers gate this to
 * desktop/tablet tiers.
 */

import { useEffect, useState } from "react";

export function useWindowResizing(settleMs: number, enabled = true): boolean {
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    let timer: number | undefined;
    const onResize = () => {
      setResizing(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setResizing(false), settleMs);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      // If we unmount (or get disabled) mid-drag, don't leave the scene hidden.
      setResizing(false);
    };
  }, [settleMs, enabled]);

  return resizing;
}
