/**
 * depth.ts - single source of truth for the descent.
 *
 * The homepage is one tall scroll. Scrolling DOWN = DESCENDING through the
 * water column. `scrollProgress` is normalized 0 (surface) to 1 (seabed).
 *
 * Every zone owns a `start` and `end` position along that 0..1 axis. The DOM
 * sections, the depth-gauge nav, the static fallback, and the WebGL fog all
 * read from this one array so they can never drift apart.
 *
 * NOTE: this file is intentionally framework-free (no React, no three). It is
 * imported by both server components (sections) and client code (store, canvas)
 * so keep it pure data + pure helpers.
 */

export type ZoneId =
  | "surface"
  | "about"
  | "projects"
  | "ventures"
  | "writing"
  | "skills"
  | "contact";

export interface DepthZone {
  /** Stable id, also used as the section's DOM id (#surface, #about, ...). */
  id: ZoneId;
  /** Short human label for the depth-gauge rail. */
  label: string;
  /** Approximate depth readout shown on the gauge (purely decorative copy). */
  depthLabel: string;
  /** Normalized scroll position where this zone begins (0..1). */
  start: number;
  /** Normalized scroll position where this zone ends (0..1). */
  end: number;
  /**
   * Water-column colors for this depth, used by BOTH the DOM static gradient
   * and the WebGL fog/column. `fog` is what useFrame lerps the scene fog to.
   * All are hex strings.
   */
  palette: {
    top: string;
    body: string;
    deep: string;
    /** Color the canvas fog should converge on at the MIDPOINT of this zone. */
    fog: string;
  };
}

/**
 * Seven zones, surface (0) to seabed (1). The `start`/`end` are deliberately
 * even-ish but weighted so the hero (surface) and the contact floor get a touch
 * more room to breathe. Keep them sorted and contiguous (end[n] === start[n+1]).
 */
export const ZONES: readonly DepthZone[] = [
  {
    // Bright, friendly, sunlit light-blue surface echoing the reference shot:
    // airy aqua sky fading into clean tropical water. Dark text rides on top.
    id: "surface",
    label: "Home",
    depthLabel: "0m",
    start: 0.0,
    end: 0.16,
    palette: {
      top: "#D6F4FB",
      body: "#9BE0EE",
      deep: "#5CC6E0",
      fog: "#A8E6F2",
    },
  },
  {
    // Sunlit shallows: a saturated, colorful teal-cyan where the god rays still
    // reach. Brighter/more alive in hue than the old muddy band, but kept dark
    // enough in luminance that the zone's LIGHT body/heading type stays WCAG AA.
    id: "about",
    label: "Experience",
    depthLabel: "Sunlit shallows",
    start: 0.16,
    end: 0.32,
    palette: {
      top: "#0A3B4E",
      body: "#093647",
      deep: "#082F3F",
      fog: "#0A3849",
    },
  },
  {
    // Midwater: a clean, confident medium ocean teal-blue. The descent visibly
    // deepens here but the water stays colorful, never murky-grey or black.
    id: "projects",
    label: "Entrepreneurship",
    depthLabel: "Twilight",
    start: 0.32,
    end: 0.5,
    palette: {
      top: "#082F3F",
      body: "#0A2E3F",
      deep: "#082A39",
      fog: "#093140",
    },
  },
  {
    // Deeper midwater rolling into the moody band: a rich ocean teal-blue.
    id: "ventures",
    label: "Skills",
    depthLabel: "Midnight",
    start: 0.5,
    end: 0.66,
    palette: {
      top: "#082A39",
      body: "#082633",
      deep: "#07212D",
      fog: "#082834",
    },
  },
  {
    // Deep zone: moody for contrast, but a RICH dark teal-navy, not a black
    // void, so the bioluminescence pops against a colored deep, not nothing.
    id: "writing",
    label: "Education",
    depthLabel: "Abyss",
    start: 0.66,
    end: 0.8,
    palette: {
      top: "#07212D",
      body: "#0A2532",
      deep: "#091F2B",
      fog: "#0A2531",
    },
  },
  {
    // Seabed: deepest teal-navy, still holding a clear blue-green cast so the
    // floor reads as deep ocean rather than ink.
    id: "skills",
    label: "Interests",
    depthLabel: "Seabed",
    start: 0.8,
    end: 0.92,
    palette: {
      top: "#091F2B",
      body: "#081C27",
      deep: "#071824",
      fog: "#091E29",
    },
  },
  {
    // The floor: lifts back to a warmer, lighter dark teal-navy to seat the reef
    // and give the closing zone a settled, grounded, not pitch-black, base.
    id: "contact",
    label: "Contact",
    depthLabel: "The Floor",
    start: 0.92,
    end: 1.0,
    palette: {
      top: "#071824",
      body: "#0A2735",
      deep: "#0D3144",
      fog: "#0A2A3A",
    },
  },
] as const;

/** Convenience: the ordered list of zone ids. */
export const ZONE_IDS: readonly ZoneId[] = ZONES.map((z) => z.id);

/** Clamp a number into [0, 1]. */
export function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Given normalized progress (0..1), return the active zone.
 * The last zone owns progress === 1.
 */
export function zoneAtProgress(progress: number): DepthZone {
  const p = clamp01(progress);
  for (const zone of ZONES) {
    if (p >= zone.start && p < zone.end) return zone;
  }
  return ZONES[ZONES.length - 1];
}

/** Index of a zone by id (used to compute scroll targets). */
export function zoneIndex(id: ZoneId): number {
  return ZONE_IDS.indexOf(id);
}

/** Look up a zone by id (falls back to the surface). */
export function zoneById(id: ZoneId): DepthZone {
  return ZONES.find((z) => z.id === id) ?? ZONES[0];
}

/**
 * The normalized progress (0..1) at the CENTER of a zone's depth band.
 *
 * Route-driven depth: each page declares its zone id and the camera dives to the
 * center of that band, so the right creatures (which zone-gate on this same
 * progress) are in view and the fog matches the zone. Surface sits at the very
 * top (0) so the launchpad reads as the open surface; the contact floor sits at
 * the very bottom (1) so the closing page reads as the seabed. Every interior
 * zone targets its midpoint.
 */
export function zoneCenterProgress(id: ZoneId): number {
  const zone = zoneById(id);
  if (id === ZONES[0].id) return 0;
  if (id === ZONES[ZONES.length - 1].id) return 1;
  return (zone.start + zone.end) / 2;
}

/**
 * Parse a hex color (#rgb or #rrggbb) into [r,g,b] in 0..1.
 * Used by the canvas fog lerp. Kept here so the color targets and the parser
 * live together.
 */
export function hexToRgb01(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(h, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
}

/**
 * Camera depth in world units the canvas should be at for a given progress.
 * 0 progress => CAMERA_TOP, 1 progress => CAMERA_BOTTOM. The scene lerps toward
 * this so fast scrolls feel like sinking rather than teleporting.
 */
export const CAMERA_TOP = 0;
export const CAMERA_BOTTOM = -60;

export function cameraYForProgress(progress: number): number {
  return lerp(CAMERA_TOP, CAMERA_BOTTOM, clamp01(progress));
}

/**
 * Fog density target. Deeper water is murkier, so density grows with depth.
 * Returned in a range tuned for THREE.FogExp2.
 */
export const FOG_DENSITY_TOP = 0.01;
export const FOG_DENSITY_BOTTOM = 0.048;

export function fogDensityForProgress(progress: number): number {
  return lerp(FOG_DENSITY_TOP, FOG_DENSITY_BOTTOM, clamp01(progress));
}
