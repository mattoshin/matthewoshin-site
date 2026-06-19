"use client";

/**
 * Sailboats - a couple of clean PAPERCUT sailboats riding the waterline on the
 * left flank: a flat crescent hull in deep teal with cream triangular sails on a
 * slim mast, drawn as flat shapes that face the camera so they read instantly as
 * boats (Moana papercut language, not a 3D silhouette blob). They belong to the
 * SURFACE band: as the camera sinks past ~progress 0.2 they fade + lift away,
 * the group hides, and the per-frame work early-returns so they cost ~nothing
 * deeper down.
 *
 * Each boat is seated ON the painted horizon from Surface.tsx (its world height
 * scales with distance from the camera) and bobs/rocks gently on a shared swell.
 *
 * Contract: default-exported SceneElement; reads `progress` imperatively each
 * frame; mutates ONLY refs it owns (group transform + shared material opacities)
 * to satisfy the React-Compiler immutability lint.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01 } from "@/lib/depth";
import type { SceneElementProps } from "../types";

/** Shared sine-sum swell (same sea the water-skier rides). */
function swell(x: number, z: number, t: number): number {
  return (
    Math.sin(x * 0.6 + t * 0.9) * 0.16 +
    Math.sin(z * 0.8 - t * 0.7) * 0.12 +
    Math.sin((x + z) * 0.35 + t * 0.45) * 0.1
  );
}

// Papercut palette.
const HULL = "#0c4f63"; // deep teal hull
const MAST = "#0a3a48"; // darker mast
const SAIL_MAIN = "#f4eed6"; // warm cream mainsail
const SAIL_JIB = "#e7ddbe"; // slightly deeper cream jib (paper-layer contrast)

// Camera sits at z=8 looking level. Seat each boat ON the painted horizon:
// y = HORIZON_K * (CAM_Z - z). HORIZON_K matches WaterSkier so they share a sea.
const CAM_Z = 8;
const HORIZON_K = 0.286;

// Descent band: full at the surface, gone by FADE_END (group hides beyond).
const FADE_START = 0.08;
const FADE_END = 0.2;

interface BoatSpec {
  x: number;
  z: number;
  scale: number;
  phase: number; // swell time offset so they don't bob in lockstep
}

// One clean sailboat on the LEFT flank — uncluttered, sits clearly on the horizon.
const BOATS: readonly BoatSpec[] = [
  { x: -12.5, z: -13.0, scale: 1.05, phase: 0.0 },
];

const C = (hex: string) => new THREE.Color(hex);

/** Flat crescent hull shape (side profile, bow to the right), facing the camera. */
function makeHullGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-1.0, 0.04); // stern tip (left)
  s.quadraticCurveTo(-0.5, -0.46, 0.1, -0.48); // down the keel
  s.quadraticCurveTo(0.75, -0.46, 1.2, 0.06); // up to the raked bow (right)
  s.quadraticCurveTo(0.5, -0.07, 0.0, -0.08); // deck line back (gentle sheer)
  s.quadraticCurveTo(-0.5, -0.08, -1.0, 0.04); // back to the stern
  return new THREE.ShapeGeometry(s);
}

/** A triangular sail in the XY plane (luff up the mast at x≈0), facing camera. */
function makeSailGeometry(
  height: number,
  foot: number,
  curve: number,
): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0.04, 0.0); // tack (foot at the mast)
  s.lineTo(0.04, height); // up the luff to the head
  // leech curves back down to the clew, with a soft belly via the control point
  s.quadraticCurveTo(-foot * 0.5 - curve, height * 0.42, -foot, 0.0);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

export default function Sailboats({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const boatRefs = useRef<(THREE.Group | null)[]>([]);
  // All fade-able materials, collected via refs so the React Compiler permits the
  // per-frame opacity writes.
  const matRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  const hullGeo = useMemo(() => makeHullGeometry(), []);
  const mainGeo = useMemo(() => makeSailGeometry(1.55, 0.95, 0.18), []);
  const jibGeo = useMemo(() => makeSailGeometry(1.05, -0.62, -0.12), []); // forward
  const mastGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.05, 1.7);
    g.translate(0.04, 0.82, 0); // base at deck, up the mast
    return g;
  }, []);

  const hullColor = useMemo(() => C(HULL), []);
  const mastColor = useMemo(() => C(MAST), []);
  const mainColor = useMemo(() => C(SAIL_MAIN), []);
  const jibColor = useMemo(() => C(SAIL_JIB), []);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const p = progress.get();
    if (p >= FADE_END) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    const fadeT = clamp01((p - FADE_START) / (FADE_END - FADE_START));
    const vis = 1 - fadeT;
    const eased = vis * vis * (3 - 2 * vis);

    const mats = matRefs.current;
    for (let i = 0; i < mats.length; i++) {
      const m = mats[i];
      if (m) m.opacity = eased;
    }

    // Lift the fleet slightly as it fades (camera leaving the surface).
    group.position.y = (1 - eased) * 1.4;

    const t = state.clock.elapsedTime;
    for (let i = 0; i < BOATS.length; i++) {
      const boat = boatRefs.current[i];
      if (!boat) continue;
      const spec = BOATS[i];
      const tt = t + spec.phase;
      // Seat on the painted horizon (scales with distance), then bob on the swell.
      boat.position.y = HORIZON_K * (CAM_Z - spec.z) + swell(spec.x, spec.z, tt);
      // Gentle papercut rock (z only; flat shapes face the camera).
      boat.rotation.z = Math.sin(tt * 0.7) * 0.05;
    }
  });

  // Helper to register a material into the fade pool by a stable index.
  const reg = (idx: number) => (el: THREE.MeshBasicMaterial | null) => {
    matRefs.current[idx] = el;
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} renderOrder={-5}>
      {BOATS.map((spec, i) => {
        const base = i * 4;
        return (
          <group
            key={i}
            ref={(el) => {
              boatRefs.current[i] = el;
            }}
            position={[spec.x, 0, spec.z]}
            scale={spec.scale}
          >
            {/* Mast (drawn first, behind the sails) */}
            <mesh geometry={mastGeo} position={[0, 0, -0.01]}>
              <meshBasicMaterial ref={reg(base + 0)} color={mastColor} transparent opacity={1} fog side={THREE.DoubleSide} />
            </mesh>
            {/* Jib (small headsail, forward of the mast) */}
            <mesh geometry={jibGeo} position={[0.06, 0.02, 0.01]}>
              <meshBasicMaterial ref={reg(base + 1)} color={jibColor} transparent opacity={1} fog side={THREE.DoubleSide} />
            </mesh>
            {/* Mainsail */}
            <mesh geometry={mainGeo} position={[0.0, 0.02, 0.02]}>
              <meshBasicMaterial ref={reg(base + 2)} color={mainColor} transparent opacity={1} fog side={THREE.DoubleSide} />
            </mesh>
            {/* Hull (front-most) */}
            <mesh geometry={hullGeo} position={[0, 0, 0.03]}>
              <meshBasicMaterial ref={reg(base + 3)} color={hullColor} transparent opacity={1} fog side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
