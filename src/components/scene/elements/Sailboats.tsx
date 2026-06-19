"use client";

/**
 * Sailboats - a small flotilla of stylized low-poly sailboats riding the very
 * top of the water column. They belong to the SURFACE band only: as the camera
 * sinks past ~progress 0.2 they fade and scale away, the group's `.visible` is
 * dropped, and the per-frame work early-returns so they cost ~nothing below.
 *
 * Everything is procedural three geometry (no external models/textures):
 *   - the hull is a LatheGeometry: a curved keel profile revolved a half turn
 *     and squashed in Z, giving an elegant tapered-bow boat shape from a handful
 *     of points;
 *   - the deck is a thin capping disc so the open hull never shows hollow;
 *   - the mast is a slim cylinder and the sail is a gently bowed triangular
 *     BufferGeometry (mainsail + a small jib) for a clean, premium silhouette.
 *
 * The boats are rendered as flat near-black silhouettes (unlit MeshBasic) so
 * they read as cut-outs against the bright surface light above - that contrast
 * is the whole point of the shot. Each boat bobs in Y and pitches/rolls by
 * sampling the same gentle sine-sum wave the sea uses, so the fleet feels like
 * it shares one swell.
 *
 * Contract: default-exported SceneElement; reads `progress` imperatively each
 * frame; mutates only refs it owns (group transform + a shared material opacity)
 * to satisfy the React-Compiler immutability lint.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01 } from "@/lib/depth";
import type { SceneElementProps } from "../types";

/**
 * Shared sine-sum swell. Returns wave height at a world (x, z) for a given time.
 * Kept tiny and deterministic so a boat can also numerically sample its local
 * gradient for pitch/roll without a second function. The frequencies are low and
 * the amplitudes small: this is a calm, glassy surface, not a storm.
 */
function swell(x: number, z: number, t: number): number {
  return (
    Math.sin(x * 0.6 + t * 0.9) * 0.16 +
    Math.sin(z * 0.8 - t * 0.7) * 0.12 +
    Math.sin((x + z) * 0.35 + t * 0.45) * 0.1
  );
}

// Silhouette tone: a deep TEAL-navy rather than pure black, drawn from the new
// brighter palette so the cut-outs still read as "ocean dark" against the bright
// surface band without punching a black hole in the friendlier scene.
const HULL_RGB = hexToRgb01("#0A2532"); // deep teal-navy (writing body)
const SAIL_RGB = hexToRgb01("#07212D"); // a touch deeper, sails sit darker

// Where the fleet lives on the descent axis. The surface zone is 0..0.16; we let
// the boats linger a hair past it then fully clear by FADE_END.
const FADE_START = 0.08; // begin dimming
const FADE_END = 0.2; // fully gone (group.visible -> false beyond)

// One boat's static placement + character. Position is the resting waterline
// position; phase staggers the bob so they don't move in lockstep; scale/heading
// give the little fleet some variety without looking random.
interface BoatSpec {
  x: number;
  z: number;
  scale: number;
  heading: number; // y-rotation, radians
  phase: number; // time offset into the swell sampling
}

// Placement FRAMES the centered hero headline rather than colliding with it:
// the fleet is pushed well back (more negative z -> smaller on screen), spread
// wide to the left and right flanks (large |x|), and lifted into the bright
// surface band above the headline. Nothing sits in the central column where the
// type lives. The camera is at [0, 0, 8] / fov 55, so at these depths the visible
// half-width is large and ±x of 12-17 reads as "out at the edges".
// The right flank now belongs to the WaterSkier (powerboat + skier action), so
// the sail fleet frames the LEFT: a near boat and a smaller one set further back.
const BOATS: readonly BoatSpec[] = [
  { x: -13.5, z: -13.0, scale: 0.6, heading: 0.4, phase: 0.0 },
  { x: -16.5, z: -18.0, scale: 0.42, heading: 0.2, phase: 3.1 },
];

// World height of the resting waterline. The camera starts at y=0 looking
// roughly level (z=8); lifting the fleet higher floats it into the bright
// surface band ABOVE the centered headline so the boats frame, not overlap, it.
const WATERLINE_Y = 3.6;

/** Build the hull geometry once: a lathed, Z-squashed tapered boat shell. */
function makeHullGeometry(): THREE.BufferGeometry {
  // Half profile of the keel (x = half-beam, y = height). Bottom is rounded,
  // sides flare out to a gunwale. Revolving this 180deg and squashing Z gives a
  // pointed-bow/stern hull rather than a round tub.
  const profile: THREE.Vector2[] = [
    new THREE.Vector2(0.02, -0.42),
    new THREE.Vector2(0.16, -0.36),
    new THREE.Vector2(0.3, -0.22),
    new THREE.Vector2(0.4, -0.04),
    new THREE.Vector2(0.44, 0.12),
  ];
  // Half revolution (PI) so the open side faces up; 14 radial segments is plenty
  // for a faceted low-poly read.
  const geo = new THREE.LatheGeometry(profile, 14, 0, Math.PI);
  // Squash along Z and stretch along X to taper the ends into a bow/stern.
  geo.scale(1.0, 1.0, 2.6);
  geo.rotateY(Math.PI / 2); // point the long axis down +X
  geo.computeVertexNormals();
  return geo;
}

/**
 * Build a gently bowed triangular sail in the X-Y plane, luff along +Y at x=0,
 * foot along +X at y=0, clew pulled out. A mid control row gives the canvas a
 * soft belly so the silhouette isn't a dead-flat triangle.
 */
function makeSailGeometry(
  height: number,
  base: number,
  belly: number,
): THREE.BufferGeometry {
  const cols = 5;
  const rows = 5;
  const positions: number[] = [];
  const indices: number[] = [];
  // Parameterize as a right triangle collapsing to the masthead. For each row j
  // (0 at foot -> 1 at head) the available width shrinks linearly to a point.
  for (let j = 0; j <= rows; j++) {
    const v = j / rows; // 0..1 up the luff
    const y = v * height;
    const rowWidth = base * (1 - v);
    for (let i = 0; i <= cols; i++) {
      const u = i / cols; // 0 at mast -> 1 at leech
      const x = u * rowWidth;
      // Belly: a sine bow in Z, strongest mid-sail, zero at all three edges.
      const z = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * belly;
      positions.push(x, y, z);
    }
  }
  const stride = cols + 1;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = j * stride + i;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export default function Sailboats({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  // Per-boat pivot groups we own and animate; refs[i] === boat i's group.
  const boatRefs = useRef<(THREE.Group | null)[]>([]);

  // Geometry + materials built once and shared across all boats (low draw-call,
  // single allocation). We hold material refs so we can fade opacity per frame.
  const hullGeo = useMemo(() => makeHullGeometry(), []);
  const deckGeo = useMemo(() => {
    // Thin elliptical cap that closes the open hull top. CircleGeometry scaled to
    // the hull footprint, laid flat just under the gunwale.
    const g = new THREE.CircleGeometry(0.42, 16);
    g.rotateX(-Math.PI / 2);
    g.scale(1.0, 1.0, 2.6);
    return g;
  }, []);
  const mainsailGeo = useMemo(() => makeSailGeometry(1.5, 0.95, 0.18), []);
  const jibGeo = useMemo(() => makeSailGeometry(0.95, 0.55, 0.1), []);
  const mastGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.018, 0.024, 1.7, 6);
    g.translate(0, 0.85, 0); // base at deck, extends up
    return g;
  }, []);

  // Per-mesh materials, owned via refs so the React Compiler permits the
  // per-frame opacity writes (a hook-returned material may not be mutated, and a
  // material object read during render counts as a forbidden ref access). Each is
  // declared as a JSX child below and collected here; we fade every one together.
  const hullMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const sailMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  // Shared color constants for the materials (render-safe to read in JSX).
  const hullColor = useMemo(
    () => new THREE.Color(HULL_RGB[0], HULL_RGB[1], HULL_RGB[2]),
    [],
  );
  const sailColor = useMemo(
    () => new THREE.Color(SAIL_RGB[0], SAIL_RGB[1], SAIL_RGB[2]),
    [],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const p = progress.get();

    // Zone gate: once we're below the surface band, kill visibility and bail
    // before doing any wave math so off-zone frames are essentially free.
    if (p >= FADE_END) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    // Fade: 1 at the surface, easing to 0 at FADE_END. Drives both opacity and a
    // gentle sink/shrink so the fleet drops away with the surface rather than
    // popping off.
    const fadeT = clamp01((p - FADE_START) / (FADE_END - FADE_START));
    const vis = 1 - fadeT;
    const eased = vis * vis * (3 - 2 * vis); // smoothstep for a softer exit

    const hullMats = hullMatRefs.current;
    for (let i = 0; i < hullMats.length; i++) {
      const m = hullMats[i];
      if (m) m.opacity = eased;
    }
    const sailMats = sailMatRefs.current;
    for (let i = 0; i < sailMats.length; i++) {
      const m = sailMats[i];
      if (m) m.opacity = eased * 0.96;
    }

    // The whole fleet drifts up and out of frame slightly as it fades, selling
    // the camera leaving the surface behind. The faded target sits ABOVE the
    // resting waterline so the boats lift away rather than sink as they vanish.
    group.position.y = THREE.MathUtils.lerp(WATERLINE_Y + 1.6, WATERLINE_Y, eased);
    const s = THREE.MathUtils.lerp(0.85, 1, eased);
    group.scale.setScalar(s);

    const t = state.clock.elapsedTime;

    for (let i = 0; i < BOATS.length; i++) {
      const boat = boatRefs.current[i];
      if (!boat) continue;
      const spec = BOATS[i];
      const tt = t + spec.phase;

      // Vertical bob: sample the swell at the boat's resting position.
      const h = swell(spec.x, spec.z, tt);
      boat.position.y = h;

      // Pitch (rock fore/aft) and roll (rock side/side) from the local slope of
      // the swell - a cheap finite-difference gradient. Small epsilon keeps it a
      // gentle lean, never a capsize.
      const eps = 0.6;
      const dzx =
        (swell(spec.x + eps, spec.z, tt) - swell(spec.x - eps, spec.z, tt)) /
        (2 * eps);
      const dzz =
        (swell(spec.x, spec.z + eps, tt) - swell(spec.x, spec.z - eps, tt)) /
        (2 * eps);

      // Heading is baked into a child below; here we tilt the outer pivot in
      // world axes so pitch/roll read consistently regardless of heading.
      boat.rotation.x = -dzz * 0.9;
      boat.rotation.z = dzx * 0.9;
      // A whisper of yaw sway so the boats feel alive at anchor.
      boat.rotation.y = spec.heading + Math.sin(tt * 0.5) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, WATERLINE_Y, 0]} renderOrder={-5}>
      {BOATS.map((spec, i) => (
        <group
          key={i}
          ref={(el) => {
            boatRefs.current[i] = el;
          }}
          position={[spec.x, 0, spec.z]}
          rotation={[0, spec.heading, 0]}
          scale={spec.scale}
        >
          {/* Hull shell + deck cap (hull material) */}
          <mesh geometry={hullGeo}>
            <meshBasicMaterial
              ref={(el) => {
                hullMatRefs.current[i * 3 + 0] = el;
              }}
              color={hullColor}
              transparent
              opacity={1}
              fog
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh geometry={deckGeo} position={[0, 0.06, 0]}>
            <meshBasicMaterial
              ref={(el) => {
                hullMatRefs.current[i * 3 + 1] = el;
              }}
              color={hullColor}
              transparent
              opacity={1}
              fog
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Mast stepped a little forward of center */}
          <mesh geometry={mastGeo} position={[0.1, 0.08, 0]}>
            <meshBasicMaterial
              ref={(el) => {
                hullMatRefs.current[i * 3 + 2] = el;
              }}
              color={hullColor}
              transparent
              opacity={1}
              fog
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Mainsail: luff up the mast, foot trailing aft (-X), bellied to +Z */}
          <mesh
            geometry={mainsailGeo}
            position={[0.08, 0.12, 0]}
            rotation={[0, Math.PI, 0]}
          >
            <meshBasicMaterial
              ref={(el) => {
                sailMatRefs.current[i * 2 + 0] = el;
              }}
              color={sailColor}
              transparent
              opacity={1}
              fog
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Jib: small headsail forward of the mast (+X), bellied opposite */}
          <mesh geometry={jibGeo} position={[0.12, 0.1, 0]}>
            <meshBasicMaterial
              ref={(el) => {
                sailMatRefs.current[i * 2 + 1] = el;
              }}
              color={sailColor}
              transparent
              opacity={1}
              fog
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
