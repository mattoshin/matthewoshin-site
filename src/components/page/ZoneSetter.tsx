"use client";

/**
 * ZoneSetter - the route-to-depth bridge. The signature dive mechanic.
 *
 * Every page renders exactly one <ZoneSetter zone="..." />. On mount (and if the
 * zone prop ever changes) it sets the store's `targetProgress` to the CENTER of
 * that zone's depth band. The persistent ocean canvas in the root layout lerps
 * the camera + fog toward that target, so navigating from a shallow page to a
 * deeper one smoothly DIVES the camera down through the water to the new depth.
 *
 * It renders nothing. Depth lives with the route, not with scroll: page content
 * scrolls normally underneath without ever moving the ocean.
 *
 * Because the canvas persists across client-side navigations (it is in the
 * layout, not the page), there is no unmount/remount and no flash; only the DOM
 * content swaps and the camera glides to the new band.
 */

import { useEffect } from "react";
import { useDescentStore } from "@/lib/store";
import { zoneCenterProgress, type ZoneId } from "@/lib/depth";

export default function ZoneSetter({ zone }: { zone: ZoneId }) {
  useEffect(() => {
    useDescentStore.getState().setTargetProgress(zoneCenterProgress(zone));
  }, [zone]);

  return null;
}
