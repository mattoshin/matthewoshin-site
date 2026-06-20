"use client";

/**
 * WaterSkier - a papercut speedboat + skier silhouette, consistent with the
 * Dolphin and Sailboats elements. The boat is a light cream extruded hull with
 * dark stripe and tinted windshield. The skier is a single connected
 * ShapeGeometry silhouette in deep teal — clean, minimal, artsy. Two bright
 * white skis beneath. All live at the visual waterline, camera-locked so they
 * stay pegged to the horizon as the camera descends.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01 } from "@/lib/depth";
import type { SceneElementProps } from "../types";

function swell(x: number, z: number, t: number): number {
  return (
    Math.sin(x * 0.6 + t * 0.9) * 0.16 +
    Math.sin(z * 0.8 - t * 0.7) * 0.12 +
    Math.sin((x + z) * 0.35 + t * 0.45) * 0.1
  );
}

const HULL_RGB       = hexToRgb01("#ddeef4"); // light cream hull
const STRIPE_RGB     = hexToRgb01("#0d3d54"); // dark navy gunwale stripe
const WINDSHIELD_RGB = hexToRgb01("#4fc8e8"); // teal glass
const COCKPIT_RGB    = hexToRgb01("#1a5272"); // cockpit interior
const SKIER_RGB      = hexToRgb01("#0d3a52"); // deep teal silhouette (papercut)
const SKI_RGB        = hexToRgb01("#e2f4ff"); // near-white skis
const FOAM_RGB       = hexToRgb01("#FFFFFF"); // additive white spray

const FADE_START = 0.02;
const FADE_END   = 0.07;

const CAM_Z      = 8;
const HORIZON_K  = 0.272;
const RIG_X      = 7.8;
const RIG_Z      = -10.0;
const RIG_SCALE  = 1.05;
const HEADING    = 0.18;

// Rope endpoints in rig-local space.
const STERN_TOP: [number, number, number] = [0.95, 0.14, 0];
const SKIER_POS: [number, number, number] = [1.6, 0.0, 0.38];
const HANDS:     [number, number, number] = [1.38, 0.50, 0.38];

const C = (rgb: readonly [number, number, number]) =>
  new THREE.Color(rgb[0], rgb[1], rgb[2]);

// ---------------------------------------------------------------------------
// Boat geometry (unchanged from visual redesign)
// ---------------------------------------------------------------------------

function makeHullGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo( 1.0, -0.16);
  s.lineTo(-0.92, -0.10);
  s.lineTo(-1.22,  0.05);
  s.lineTo(-0.88,  0.20);
  s.lineTo(-0.18,  0.18);
  s.lineTo(-0.04,  0.18);
  s.lineTo( 0.06,  0.42);
  s.lineTo( 0.32,  0.42);
  s.lineTo( 0.48,  0.18);
  s.lineTo( 1.0,   0.13);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.52, bevelEnabled: false });
  geo.translate(0, 0, -0.26);
  return geo;
}

function makeStripeGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-1.22,  0.05); s.lineTo(-0.88,  0.20);
  s.lineTo(-0.18,  0.18); s.lineTo(-0.04,  0.18);
  s.lineTo( 0.48,  0.18); s.lineTo( 1.0,   0.13);
  s.lineTo( 1.0,   0.06); s.lineTo( 0.48,  0.11);
  s.lineTo(-0.04,  0.11); s.lineTo(-0.18,  0.11);
  s.lineTo(-0.88,  0.13); s.lineTo(-1.22,  0.05);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeWindshieldGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-0.04, 0.18); s.lineTo( 0.06, 0.42);
  s.lineTo( 0.32, 0.42); s.lineTo( 0.48, 0.18);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeCockpitGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0.06, 0.14); s.lineTo(0.06, 0.38);
  s.lineTo(0.60, 0.38); s.lineTo(0.60, 0.14);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeWakeGeometry(): THREE.BufferGeometry {
  const verts: number[] = [
    // Outer wide V
     0,   0,  0,  3.2, 0,  1.8,  3.2, 0, -1.8,
    // Inner brighter V
     0,   0,  0,  2.2, 0,  0.9,  2.2, 0, -0.9,
    // Tight stern foam
     0,   0.02,  0,  0.8, 0.02,  0.28,  0.8, 0.02, -0.28,
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

function makeRoosterGeometry(): THREE.BufferGeometry {
  const tips: [number, number, number][] = [
    [ 0.75,  0.90, 0.00], [ 0.55,  0.75, 0.38], [ 0.55,  0.75,-0.38],
    [ 0.35,  0.50, 0.60], [ 0.35,  0.50,-0.60], [ 0.90,  0.55, 0.14],
    [ 0.90,  0.55,-0.14], [ 0.65,  1.05, 0.10], [ 0.65,  1.05,-0.10],
  ];
  const verts: number[] = [];
  for (const [tx, ty, tz] of tips) {
    verts.push(0, 0, 0.10, 0, 0, -0.10, tx, ty, tz);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

// ---------------------------------------------------------------------------
// Skier silhouette — single connected ShapeGeometry, papercut style.
// Designed in the pre-rotation local frame (figure roughly upright).
// The parent group applies z=-0.60 rotation to lean the body back.
// Arms extend in the -x direction (toward the tow rope).
// ---------------------------------------------------------------------------

function makeSkierBodyGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();

  // Back edge: from hip up the spine to shoulder
  s.moveTo( 0.17, -0.22);
  s.quadraticCurveTo( 0.22,  0.08,  0.20,  0.36);
  s.quadraticCurveTo( 0.18,  0.48,  0.10,  0.54);

  // Back of neck / head
  s.quadraticCurveTo( 0.12,  0.62,  0.06,  0.72);
  s.quadraticCurveTo(-0.02,  0.78, -0.08,  0.72);

  // Face → chin
  s.quadraticCurveTo(-0.14,  0.62, -0.10,  0.52);

  // Front of chest → arm root
  s.lineTo(-0.04,  0.44);

  // Arm reaching forward (toward boat / rope)
  s.lineTo(-0.48,  0.30);   // fingertips
  s.lineTo(-0.46,  0.21);   // underside
  s.lineTo(-0.02,  0.34);   // back to lower chest

  // Stomach → hip front
  s.lineTo( 0.00,  0.14);
  s.lineTo(-0.04,  0.00);

  // Knee (comes forward, bent crouch)
  s.quadraticCurveTo(-0.20, -0.06, -0.20, -0.18);

  // Shin / ankle
  s.lineTo(-0.06, -0.28);

  // Close across the hip
  s.lineTo( 0.17, -0.22);
  s.closePath();

  return new THREE.ShapeGeometry(s);
}

/** Single ski shape — thin plank with a slightly upturned front tip. */
function makeSkiGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-0.62, -0.03);
  s.quadraticCurveTo(-0.68,  0.01, -0.62,  0.07); // tip curl
  s.lineTo( 0.36,  0.07);
  s.lineTo( 0.36, -0.03);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WaterSkier({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rigRef   = useRef<THREE.Group>(null);

  const solidRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const sprayRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  const hullGeo       = useMemo(() => makeHullGeometry(), []);
  const stripeGeo     = useMemo(() => makeStripeGeometry(), []);
  const windshieldGeo = useMemo(() => makeWindshieldGeometry(), []);
  const cockpitGeo    = useMemo(() => makeCockpitGeometry(), []);
  const wakeGeo       = useMemo(() => makeWakeGeometry(), []);
  const roosterGeo    = useMemo(() => makeRoosterGeometry(), []);
  const skierBodyGeo  = useMemo(() => makeSkierBodyGeometry(), []);
  const skiGeo        = useMemo(() => makeSkiGeometry(), []);

  const hullCol       = useMemo(() => C(HULL_RGB), []);
  const stripeCol     = useMemo(() => C(STRIPE_RGB), []);
  const windshieldCol = useMemo(() => C(WINDSHIELD_RGB), []);
  const cockpitCol    = useMemo(() => C(COCKPIT_RGB), []);
  const skierCol      = useMemo(() => C(SKIER_RGB), []);
  const skiCol        = useMemo(() => C(SKI_RGB), []);
  const foamCol       = useMemo(() => C(FOAM_RGB), []);

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

  const sr = (i: number) => (el: THREE.MeshBasicMaterial | null) => { solidRefs.current[i] = el; };
  const sp = (i: number) => (el: THREE.MeshBasicMaterial | null) => { sprayRefs.current[i] = el; };

  useFrame((state) => {
    const group = groupRef.current;
    const rig   = rigRef.current;
    if (!group || !rig) return;

    const p = progress.get();
    if (p >= FADE_END) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    const fadeT = clamp01((p - FADE_START) / (FADE_END - FADE_START));
    const vis   = 1 - fadeT;
    const eased = vis * vis * (3 - 2 * vis);

    for (const m of solidRefs.current) { if (m) m.opacity = eased; }

    const t = state.clock.elapsedTime;
    const shimmer = 0.78 + 0.22 * Math.sin(t * 5.5);
    for (const m of sprayRefs.current) { if (m) m.opacity = eased * shimmer; }

    group.position.y = state.camera.position.y + (1 - eased) * 1.4;
    group.scale.setScalar(THREE.MathUtils.lerp(0.85, 1, eased));

    const drift = Math.sin(t * 0.25) * 0.5;
    const x = RIG_X + drift;
    rig.position.x = x;
    rig.position.y = HORIZON_K * (CAM_Z - RIG_Z) + swell(x, RIG_Z, t);

    const eps = 0.6;
    const dzx = (swell(x + eps, RIG_Z, t) - swell(x - eps, RIG_Z, t)) / (2 * eps);
    const dzz = (swell(x, RIG_Z + eps, t) - swell(x, RIG_Z - eps, t)) / (2 * eps);
    rig.rotation.x =  -dzz * 0.7;
    rig.rotation.z =   dzx * 0.7 - Math.sin(t * 0.25) * 0.06;
    rig.rotation.y = HEADING + Math.cos(t * 0.25) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} renderOrder={-4}>
      <group ref={rigRef} position={[RIG_X, 0, RIG_Z]} rotation={[0, HEADING, 0]} scale={RIG_SCALE}>

        {/* Hull body */}
        <mesh geometry={hullGeo}>
          <meshBasicMaterial ref={sr(0)} color={hullCol} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>

        {/* Gunwale stripe */}
        <mesh geometry={stripeGeo} position={[0, 0, 0.27]}>
          <meshBasicMaterial ref={sr(1)} color={stripeCol} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>

        {/* Cockpit interior */}
        <mesh geometry={cockpitGeo} position={[0, 0, 0.28]}>
          <meshBasicMaterial ref={sr(2)} color={cockpitCol} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>

        {/* Windshield glass */}
        <mesh geometry={windshieldGeo} position={[0, 0, 0.29]}>
          <meshBasicMaterial ref={sr(3)} color={windshieldCol} transparent opacity={0.85} side={THREE.DoubleSide} fog />
        </mesh>

        {/* Tow rope */}
        <mesh position={rope.mid} quaternion={rope.quat}>
          <cylinderGeometry args={[0.010, 0.010, rope.len, 4]} />
          <meshBasicMaterial ref={sr(4)} color={skierCol} transparent opacity={1} fog />
        </mesh>

        {/* V-wake */}
        <mesh geometry={wakeGeo} position={[1.0, -0.13, 0]}>
          <meshBasicMaterial ref={sp(0)} color={foamCol} transparent opacity={0.80}
            depthWrite={false} blending={THREE.AdditiveBlending} fog={false} side={THREE.DoubleSide} />
        </mesh>

        {/* ── SKIER ── papercut silhouette */}
        <group position={SKIER_POS}>
          {/* Body silhouette — lean back via z rotation */}
          <group rotation={[0, 0, -0.60]}>
            <mesh geometry={skierBodyGeo} position={[0, 0, 0.01]}>
              <meshBasicMaterial ref={sr(5)} color={skierCol} transparent opacity={1} side={THREE.DoubleSide} fog />
            </mesh>
          </group>

          {/* Skis — bright white, sit below the figure */}
          <mesh geometry={skiGeo} position={[-0.14, -0.30,  0.13]} rotation={[0, 0, 0.05]}>
            <meshBasicMaterial ref={sr(6)} color={skiCol} transparent opacity={1} side={THREE.DoubleSide} fog />
          </mesh>
          <mesh geometry={skiGeo} position={[-0.14, -0.30, -0.13]} rotation={[0, 0, 0.05]}>
            <meshBasicMaterial ref={sr(7)} color={skiCol} transparent opacity={1} side={THREE.DoubleSide} fog />
          </mesh>

          {/* Rooster tail behind skis */}
          <mesh geometry={roosterGeo} position={[0.24, -0.16, 0]}>
            <meshBasicMaterial ref={sp(1)} color={foamCol} transparent opacity={0.80}
              depthWrite={false} blending={THREE.AdditiveBlending} fog={false} side={THREE.DoubleSide} />
          </mesh>
        </group>

      </group>
    </group>
  );
}
