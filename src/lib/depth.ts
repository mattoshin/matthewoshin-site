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
    id: "surface",
    label: "Surface",
    depthLabel: "0m",
    start: 0.0,
    end: 0.16,
    palette: {
      top: "#BFE9F0",
      body: "#5FC2D6",
      deep: "#2A8FB0",
      fog: "#7FD0E0",
    },
  },
  {
    id: "about",
    label: "About",
    depthLabel: "Sunlit shallows",
    start: 0.16,
    end: 0.32,
    palette: {
      top: "#2A8FB0",
      body: "#0E4D63",
      deep: "#0A3A52",
      fog: "#155873",
    },
  },
  {
    id: "projects",
    label: "Projects",
    depthLabel: "Twilight",
    start: 0.32,
    end: 0.5,
    palette: {
      top: "#0A3A52",
      body: "#072A42",
      deep: "#051F33",
      fog: "#0a3147",
    },
  },
  {
    id: "ventures",
    label: "Ventures",
    depthLabel: "Midnight",
    start: 0.5,
    end: 0.66,
    palette: {
      top: "#051F33",
      body: "#03162A",
      deep: "#020E1F",
      fog: "#04182c",
    },
  },
  {
    id: "writing",
    label: "Writing",
    depthLabel: "Abyss",
    start: 0.66,
    end: 0.8,
    palette: {
      top: "#020E1F",
      body: "#010A19",
      deep: "#01060F",
      fog: "#020b18",
    },
  },
  {
    id: "skills",
    label: "Skills",
    depthLabel: "Seabed",
    start: 0.8,
    end: 0.92,
    palette: {
      top: "#01060F",
      body: "#01060F",
      deep: "#000308",
      fog: "#010610",
    },
  },
  {
    id: "contact",
    label: "Contact",
    depthLabel: "The Floor",
    start: 0.92,
    end: 1.0,
    palette: {
      top: "#000308",
      body: "#01060F",
      deep: "#0B1420",
      fog: "#020912",
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
export const FOG_DENSITY_TOP = 0.012;
export const FOG_DENSITY_BOTTOM = 0.055;

export function fogDensityForProgress(progress: number): number {
  return lerp(FOG_DENSITY_TOP, FOG_DENSITY_BOTTOM, clamp01(progress));
}
