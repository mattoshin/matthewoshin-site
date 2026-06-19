"use client";

/**
 * WaterSkier - the surface "hero action": a sleek powerboat towing a water-skier
 * across the right flank, both read as dark cut-out silhouettes against the
 * bright Moana surface light, with the one luminous accent being bright white
 * spray - a V-wake fanning off the transom and a rooster-tail kicking up behind
 * the skis. It belongs to the SURFACE band only: as the camera sinks past
 * ~progress 0.2 the whole rig fades, lifts away, the group's `.visible` drops and
 * the per-frame work early-returns so it costs ~nothing for the rest of the dive.
 *
 * Everything is procedural three geometry (no external models/textures):
 *   - the hull is an ExtrudeGeometry of a classic speedboat SIDE profile (raked
 *     bow, low transom, a small windshield), extruded across its beam - so it
 *     reads instantly as a boat from the camera's roughly-level vantage;
 *   - the skier is a handful of thin boxes (skis, legs, leaning torso, arms to a
 *     tow handle) + a tiny head, leaning back against the pull;
 *   - the tow rope is one slim cylinder solved once between transom and hands;
 *   - the spray is additive white foam geometry (a wake triangle + a rooster fan)
 *     drawn unlit and fog-free so it glows over the blue and sells the speed.
 *
 * The rig rides + banks on the SAME sine-sum swell the sailboats use, and drifts
 * gently along its heading so it feels like it is carving, not parked. The spray
 * shimmers via a clock-driven opacity pulse (deterministic, no per-frame random).
 *
 * Contract: default-exported SceneElement; reads `progress` imperatively each
 * frame; mutates ONLY refs it owns (group transforms + shared material opacities)
 * to satisfy the React-Compiler immutability lint.
 *
 * Target zone: surface.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01 } from "@/lib/depth";
import type { SceneElementProps } from "../types";

/** Shared sine-sum swell (matches the sailboats so the fleet shares one sea). */
function swell(x: number, z: number, t: number): number {
  return (
    Math.sin(x * 0.6 + t * 0.9) * 0.16 +
    Math.sin(z * 0.8 - t * 0.7) * 0.12 +
    Math.sin((x + z) * 0.35 + t * 0.45) * 0.1
  );
}

// Silhouette tones (match the sailboats' deep teal-navy cut-out language).
const HULL_RGB = hexToRgb01("#0A2532"); // boat hull + windshield
const FIGURE_RGB = hexToRgb01("#07212D"); // skier, a touch deeper
const FOAM_RGB = hexToRgb01("#EAFBFF"); // bright cool-white spray

// Descent band: full at the surface, gone by FADE_END (group hides beyond).
const FADE_START = 0.08;
const FADE_END = 0.2;

// Seat the rig on the painted horizon (Surface.tsx): y scales with distance from
// the camera (at z=8). HORIZON_K matches the sailboats so they share one sea.
const CAM_Z = 8;
const HORIZON_K = 0.272; // seats hull bottom on the painted waterline (K=0.265 is true horizon; +0.007 for hull depth)

// Where the rig lives: out on the right flank, clear of the centered hero panel.
const RIG_X = 12.5;
const RIG_Z = -12.0;
const RIG_SCALE = 0.9;
const HEADING = 0.18; // mostly side-on so the speedboat profile reads cleanly

// Local layout inside the rig (unit space; bow at -x, stern + tow at +x). Kept
// compact (short tow gap) so the whole boat + skier fits the off-panel band.
const STERN_TOP: [number, number, number] = [0.95, 0.14, 0];
const SKIER_POS: [number, number, number] = [2.0, 0, 0.6];
const HANDS: [number, number, number] = [1.6, 0.42, 0.6];

const C = (rgb: readonly [number, number, number]) =>
  new THREE.Color(rgb[0], rgb[1], rgb[2]);

/** Speedboat hull: extrude a side profile across the beam, bow at -x. */
function makeHullGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(1.0, -0.16); // stern bottom
  s.lineTo(-0.95, -0.1); // run forward along the keel
  s.lineTo(-1.18, 0.06); // raked bow tip
  s.lineTo(-0.9, 0.18); // bow top
  s.lineTo(-0.2, 0.16); // foredeck
  s.lineTo(-0.05, 0.16); // windshield base
  s.lineTo(0.05, 0.4); // windshield top (front)
  s.lineTo(0.3, 0.4); // windshield top (back)
  s.lineTo(0.45, 0.16); // cockpit coaming
  s.lineTo(1.0, 0.12); // stern top
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.5,
    bevelEnabled: false,
  });
  geo.translate(0, 0, -0.25); // center across the beam
  return geo;
}

/** Flat foam wake: an elongated triangle on the water, apex at the transom. */
function makeWakeGeometry(): THREE.BufferGeometry {
  // Built directly on the XZ plane (y = 0); apex at origin, widening downstream.
  const positions = new Float32Array([
    0, 0, 0, // apex at the stern
    1.15, 0, 0.5, // trailing edge, outboard
    1.15, 0, -0.5, // trailing edge, inboard
  ]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geo;
}

/** Rooster tail: a small upward fan kicked back off the skis. */
function makeRoosterGeometry(): THREE.BufferGeometry {
  // Three thin triangles fanning up-and-back from a shared base point.
  const tips: [number, number, number][] = [
    [0.55, 0.5, 0.0],
    [0.42, 0.34, 0.22],
    [0.42, 0.34, -0.22],
  ];
  const verts: number[] = [];
  for (const [tx, ty, tz] of tips) {
    verts.push(0, 0, 0.08, 0, 0, -0.08, tx, ty, tz);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(verts, 3),
  );
  return geo;
}

export default function WaterSkier({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rigRef = useRef<THREE.Group>(null);

  // Materials owned via refs so the React Compiler permits per-frame opacity
  // writes (a hook-returned/memoized material may not be mutated in render).
  const darkMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const sprayMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  const hullGeo = useMemo(() => makeHullGeometry(), []);
  const wakeGeo = useMemo(() => makeWakeGeometry(), []);
  const roosterGeo = useMemo(() => makeRoosterGeometry(), []);

  const hullColor = useMemo(() => C(HULL_RGB), []);
  const figureColor = useMemo(() => C(FIGURE_RGB), []);
  const foamColor = useMemo(() => C(FOAM_RGB), []);

  // Tow rope solved once: a slim cylinder from the transom to the skier's hands.
  const rope = useMemo(() => {
    const a = new THREE.Vector3(...STERN_TOP);
    const b = new THREE.Vector3(...HANDS);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize(),
    );
    return { mid, len, quat };
  }, []);

  useFrame((state) => {
    const group = groupRef.current;
    const rig = rigRef.current;
    if (!group || !rig) return;

    const p = progress.get();

    // Zone gate: below the surface band, hide + bail before any wave math.
    if (p >= FADE_END) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    // Fade 1 -> 0 across the band, smoothstepped for a soft exit.
    const fadeT = clamp01((p - FADE_START) / (FADE_END - FADE_START));
    const vis = 1 - fadeT;
    const eased = vis * vis * (3 - 2 * vis);

    const darks = darkMatRefs.current;
    for (let i = 0; i < darks.length; i++) {
      const m = darks[i];
      if (m) m.opacity = eased;
    }

    const t = state.clock.elapsedTime;
    // Spray shimmers as it fades: a quick pulse keeps the foam alive.
    const shimmer = 0.72 + 0.18 * Math.sin(t * 6.0);
    const sprays = sprayMatRefs.current;
    for (let i = 0; i < sprays.length; i++) {
      const m = sprays[i];
      if (m) m.opacity = eased * shimmer;
    }

    // Camera-lock in Y: keeps the rig at the visual waterline as the camera descends.
    group.position.y = state.camera.position.y + (1 - eased) * 1.4;
    group.scale.setScalar(THREE.MathUtils.lerp(0.85, 1, eased));

    // Carve: a slow lateral drift along the flank + ride/bank on the swell.
    const drift = Math.sin(t * 0.25) * 0.5;
    const x = RIG_X + drift;
    rig.position.x = x;
    // Seat on the painted horizon (scales with distance), then bob on the swell.
    const h = swell(x, RIG_Z, t);
    rig.position.y = HORIZON_K * (CAM_Z - RIG_Z) + h;

    // Pitch/roll from the local swell slope so the hull leans into the carve.
    const eps = 0.6;
    const dzx =
      (swell(x + eps, RIG_Z, t) - swell(x - eps, RIG_Z, t)) / (2 * eps);
    const dzz =
      (swell(x, RIG_Z + eps, t) - swell(x, RIG_Z - eps, t)) / (2 * eps);
    rig.rotation.x = -dzz * 0.7;
    rig.rotation.z = dzx * 0.7 - Math.sin(t * 0.25) * 0.06; // lean into the turn
    rig.rotation.y = HEADING + Math.cos(t * 0.25) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} renderOrder={-4}>
      <group
        ref={rigRef}
        position={[RIG_X, 0, RIG_Z]}
        rotation={[0, HEADING, 0]}
        scale={RIG_SCALE}
      >
        {/* Hull (dark silhouette) */}
        <mesh geometry={hullGeo}>
          <meshBasicMaterial
            ref={(el) => {
              darkMatRefs.current[0] = el;
            }}
            color={hullColor}
            transparent
            opacity={1}
            fog
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Tow rope */}
        <mesh position={rope.mid} quaternion={rope.quat}>
          <cylinderGeometry args={[0.012, 0.012, rope.len, 5]} />
          <meshBasicMaterial
            ref={(el) => {
              darkMatRefs.current[1] = el;
            }}
            color={figureColor}
            transparent
            opacity={1}
            fog
          />
        </mesh>

        {/* Boat V-wake (additive foam, on the water just aft of the transom) */}
        <mesh geometry={wakeGeo} position={[1.0, -0.12, 0]}>
          <meshBasicMaterial
            ref={(el) => {
              sprayMatRefs.current[0] = el;
            }}
            color={foamColor}
            transparent
            opacity={0.7}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Skier: a leaning silhouette on two skis, towed off the +x quarter */}
        <group position={SKIER_POS}>
          <group rotation={[0, 0, -0.5]}>
            {/* torso */}
            <mesh position={[0, 0.32, 0]}>
              <boxGeometry args={[0.12, 0.34, 0.16]} />
              <meshBasicMaterial
                ref={(el) => {
                  darkMatRefs.current[2] = el;
                }}
                color={figureColor}
                transparent
                opacity={1}
                fog
              />
            </mesh>
            {/* head */}
            <mesh position={[0, 0.56, 0]}>
              <sphereGeometry args={[0.075, 8, 8]} />
              <meshBasicMaterial
                ref={(el) => {
                  darkMatRefs.current[3] = el;
                }}
                color={figureColor}
                transparent
                opacity={1}
                fog
              />
            </mesh>
            {/* legs (angled toward the skis at -x/-y) */}
            <mesh position={[-0.06, 0.04, 0]} rotation={[0, 0, 0.6]}>
              <boxGeometry args={[0.1, 0.32, 0.16]} />
              <meshBasicMaterial
                ref={(el) => {
                  darkMatRefs.current[4] = el;
                }}
                color={figureColor}
                transparent
                opacity={1}
                fog
              />
            </mesh>
            {/* arms reaching forward-down to the handle */}
            <mesh position={[-0.28, 0.34, 0]} rotation={[0, 0, 0.9]}>
              <boxGeometry args={[0.36, 0.05, 0.05]} />
              <meshBasicMaterial
                ref={(el) => {
                  darkMatRefs.current[5] = el;
                }}
                color={figureColor}
                transparent
                opacity={1}
                fog
              />
            </mesh>
          </group>
          {/* skis on the water */}
          <mesh position={[-0.16, -0.16, 0.09]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.5, 0.02, 0.06]} />
            <meshBasicMaterial
              ref={(el) => {
                darkMatRefs.current[6] = el;
              }}
              color={figureColor}
              transparent
              opacity={1}
              fog
            />
          </mesh>
          <mesh position={[-0.16, -0.16, -0.09]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.5, 0.02, 0.06]} />
            <meshBasicMaterial
              ref={(el) => {
                darkMatRefs.current[7] = el;
              }}
              color={figureColor}
              transparent
              opacity={1}
              fog
            />
          </mesh>
          {/* rooster-tail spray kicked up behind the skis */}
          <mesh geometry={roosterGeo} position={[0.18, -0.12, 0]}>
            <meshBasicMaterial
              ref={(el) => {
                sprayMatRefs.current[1] = el;
              }}
              color={foamColor}
              transparent
              opacity={0.7}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              fog={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
