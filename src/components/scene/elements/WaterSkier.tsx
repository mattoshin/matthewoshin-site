"use client";

/**
 * WaterSkier - a Lamborghini speedboat + skier silhouette at the surface.
 *
 * The boat is a papercut speedboat: a yellow hull with black cockpit and smoked
 * windshield. It tows a deep teal skier silhouette on two white skis, well behind
 * the stern on a long rope. No lettering on the hull (removed 2026-07-19 by
 * Matthew's call).
 *
 * CAROUSEL: the rig glides RIGHT -> LEFT and loops seamlessly. As it nears either
 * screen edge its opacity fades to 0, so the wrap from the left edge back to the
 * right is an invisible dissolve, never a teleport. Endless, like a reel.
 *
 * It rides the visual waterline and drifts UP with the surface as the camera
 * descends, then hides past the surface band. No foam/wake - clean and calm.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01 } from "@/lib/depth";
import { useDeviceTier } from "@/lib/useDeviceTier";
import type { SceneElementProps } from "../types";

// Phone-only staggered intro: the Lamborghini eases in FIRST, then the Black
// Pearl follows (see Sailboats). Desktop/tablet keep their original instant
// presence, so the scene there is unchanged.
const INTRO_DELAY = 0.2; // seconds after load before the boat starts to appear
const INTRO_DURATION = 0.9; // seconds to ease to full opacity

function swell(x: number, z: number, t: number): number {
  return (
    Math.sin(x * 0.6 + t * 0.9) * 0.16 +
    Math.sin(z * 0.8 - t * 0.7) * 0.12 +
    Math.sin((x + z) * 0.35 + t * 0.45) * 0.1
  );
}

const HULL_RGB       = hexToRgb01("#F4C20D"); // Lamborghini giallo yellow hull
const STRIPE_RGB     = hexToRgb01("#0A0A0A"); // black gunwale stripe
const WINDSHIELD_RGB = hexToRgb01("#0E1822"); // smoked glass
const COCKPIT_RGB    = hexToRgb01("#101010"); // black cockpit interior
const SKIER_RGB      = hexToRgb01("#0d3a52"); // deep teal silhouette (papercut)
const SKI_RGB        = hexToRgb01("#e2f4ff"); // near-white skis

const SURFACE_DRIFT = 1900;
const SURFACE_GONE  = 0.24;

const CAM_Z      = 8;
const HORIZON_K  = 0.295;
const RIG_Z      = -10.0;
const RIG_SCALE  = 1.05;
const HEADING    = 0.14;

// Right-to-left traverse, wrapping. Speed is a slow cruise.
const TRAVEL_RIGHT = 12.0;
const TRAVEL_LEFT  = -13.5;
const TRAVEL_SPAN  = TRAVEL_RIGHT - TRAVEL_LEFT;
const TRAVEL_SPEED = 0.5;   // world units / second

// Asymmetric carousel fade: near-instant fade-IN at the entering (right) edge,
// slow graceful fade-OUT at the exiting (left) edge.
const ENTER_AT = 11.4;   // x where it begins to appear (right)
const ENTER_SOFT = 0.7;  // narrow band -> almost instant fade-in
const EXIT_AT = -12.8;   // x where it's fully gone (left)
const EXIT_SOFT = 4.8;   // wide band -> slow fade-out

// PHONE carousel: the desktop range/speed (±12, slow) leaves the boat off-screen
// most of each ~50s loop on a narrow portrait viewport. Tighten the range to the
// visible band at z=-10 and cruise faster so the Lamborghini actually stays seen
// and reappears every ~12s. RIG_Z / horizon are unchanged, so it still sits on
// the water exactly as before.
const PHONE_TRAVEL_RIGHT = 6.5;
const PHONE_TRAVEL_LEFT  = -6.5;
const PHONE_TRAVEL_SPAN  = PHONE_TRAVEL_RIGHT - PHONE_TRAVEL_LEFT;
const PHONE_TRAVEL_SPEED = 1.1;
const PHONE_ENTER_AT = 6.0;
const PHONE_EXIT_AT  = -6.3;

// Rope endpoints in rig-local space. The skier sits well behind the stern.
const STERN_TOP: [number, number, number] = [0.95, 0.14, 0];
const SKIER_POS: [number, number, number] = [2.75, 0.0, 0.34];
const HANDS:     [number, number, number] = [2.48, 0.46, 0.34];

const C = (rgb: readonly [number, number, number]) =>
  new THREE.Color(rgb[0], rgb[1], rgb[2]);

// ---------------------------------------------------------------------------
// Boat geometry
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

// ---------------------------------------------------------------------------
// Skier silhouette — single connected ShapeGeometry, papercut style.
// ---------------------------------------------------------------------------

function makeSkierBodyGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo( 0.17, -0.22);
  s.quadraticCurveTo( 0.22,  0.08,  0.20,  0.36);
  s.quadraticCurveTo( 0.18,  0.48,  0.10,  0.54);
  s.quadraticCurveTo( 0.12,  0.62,  0.06,  0.72);
  s.quadraticCurveTo(-0.02,  0.78, -0.08,  0.72);
  s.quadraticCurveTo(-0.14,  0.62, -0.10,  0.52);
  s.lineTo(-0.04,  0.44);
  s.lineTo(-0.48,  0.30);   // fingertips
  s.lineTo(-0.46,  0.21);   // underside
  s.lineTo(-0.02,  0.34);   // back to lower chest
  s.lineTo( 0.00,  0.14);
  s.lineTo(-0.04,  0.00);
  s.quadraticCurveTo(-0.20, -0.06, -0.20, -0.18);
  s.lineTo(-0.06, -0.28);
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
  const isPhone  = useDeviceTier() === "phone";
  // Clock time of the first rendered frame, for the phone intro stagger.
  const introStart = useRef<number | null>(null);

  // Pool of every fade-able material; opacity is written each frame from these
  // refs only (React-Compiler-safe). userData.b stores each material's base.
  const fadeMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const collect = (el: THREE.MeshBasicMaterial | null) => {
    if (el && !fadeMats.current.includes(el)) {
      el.userData.b = el.opacity;
      fadeMats.current.push(el);
    }
  };

  const hullGeo       = useMemo(() => makeHullGeometry(), []);
  const stripeGeo     = useMemo(() => makeStripeGeometry(), []);
  const windshieldGeo = useMemo(() => makeWindshieldGeometry(), []);
  const cockpitGeo    = useMemo(() => makeCockpitGeometry(), []);
  const skierBodyGeo  = useMemo(() => makeSkierBodyGeometry(), []);
  const skiGeo        = useMemo(() => makeSkiGeometry(), []);

  const hullCol       = useMemo(() => C(HULL_RGB), []);
  const stripeCol     = useMemo(() => C(STRIPE_RGB), []);
  const windshieldCol = useMemo(() => C(WINDSHIELD_RGB), []);
  const cockpitCol    = useMemo(() => C(COCKPIT_RGB), []);
  const skierCol      = useMemo(() => C(SKIER_RGB), []);
  const skiCol        = useMemo(() => C(SKI_RGB), []);

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
    const rig   = rigRef.current;
    if (!group || !rig) return;

    // Stamp the intro clock on the first frame so the stagger is measured from
    // load, regardless of where the carousel happens to start.
    if (introStart.current === null) introStart.current = state.clock.elapsedTime;

    const p = progress.get();
    if (p >= SURFACE_GONE) {
      if (group.visible) group.visible = false;
      return;
    }

    const t = state.clock.elapsedTime;

    // Phone intro: ease opacity in after INTRO_DELAY. 1 (no effect) elsewhere.
    let intro = 1;
    if (isPhone) {
      const lin = clamp01((t - introStart.current - INTRO_DELAY) / INTRO_DURATION);
      intro = lin * lin * (3 - 2 * lin); // smoothstep
    }

    // Right -> left traverse, wrapping. Subtract so x decreases over time.
    // Phones use a tighter, faster loop matched to the narrow visible band.
    const travelRight = isPhone ? PHONE_TRAVEL_RIGHT : TRAVEL_RIGHT;
    const travelSpan = isPhone ? PHONE_TRAVEL_SPAN : TRAVEL_SPAN;
    const travelSpeed = isPhone ? PHONE_TRAVEL_SPEED : TRAVEL_SPEED;
    const enterAt = isPhone ? PHONE_ENTER_AT : ENTER_AT;
    const exitAt = isPhone ? PHONE_EXIT_AT : EXIT_AT;
    const x = travelRight - ((t * travelSpeed) % travelSpan);

    // Fast fade-in at the entering edge, slow fade-out at the exiting edge.
    const fadeIn = clamp01((enterAt - x) / ENTER_SOFT);
    const fadeOut = clamp01((x - exitAt) / EXIT_SOFT);
    const fade = Math.min(fadeIn, fadeOut);
    if (fade <= 0.001) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;
    for (const m of fadeMats.current) {
      if (m) m.opacity = (m.userData.b ?? 1) * fade * intro;
    }

    // Drift up with the surface (same constant as Surface.tsx).
    group.position.y = state.camera.position.y + p * p * SURFACE_DRIFT;
    group.scale.setScalar(1);

    rig.position.x = x;
    rig.position.y = HORIZON_K * (CAM_Z - RIG_Z) + swell(x, RIG_Z, t);

    // Gentle bob/roll from the swell so it sits on the water, not above it.
    const eps = 0.6;
    const dzx = (swell(x + eps, RIG_Z, t) - swell(x - eps, RIG_Z, t)) / (2 * eps);
    const dzz = (swell(x, RIG_Z + eps, t) - swell(x, RIG_Z - eps, t)) / (2 * eps);
    rig.rotation.x =  -dzz * 0.7;
    rig.rotation.z =   dzx * 0.7 - Math.sin(t * 0.25) * 0.04;
    rig.rotation.y = HEADING + Math.cos(t * 0.2) * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} renderOrder={-4}>
      <group ref={rigRef} position={[TRAVEL_RIGHT, 0, RIG_Z]} rotation={[0, HEADING, 0]} scale={RIG_SCALE}>

        {/* Hull body */}
        <mesh geometry={hullGeo}>
          <meshBasicMaterial ref={collect} color={hullCol} transparent side={THREE.DoubleSide} fog />
        </mesh>

        {/* Gunwale stripe */}
        <mesh geometry={stripeGeo} position={[0, 0, 0.27]}>
          <meshBasicMaterial ref={collect} color={stripeCol} transparent side={THREE.DoubleSide} fog />
        </mesh>

        {/* Cockpit interior */}
        <mesh geometry={cockpitGeo} position={[0, 0, 0.28]}>
          <meshBasicMaterial ref={collect} color={cockpitCol} transparent side={THREE.DoubleSide} fog />
        </mesh>

        {/* Windshield glass */}
        <mesh geometry={windshieldGeo} position={[0, 0, 0.29]}>
          <meshBasicMaterial ref={collect} color={windshieldCol} transparent opacity={0.9} side={THREE.DoubleSide} fog />
        </mesh>

        {/* Tow rope */}
        <mesh position={rope.mid} quaternion={rope.quat}>
          <cylinderGeometry args={[0.010, 0.010, rope.len, 4]} />
          <meshBasicMaterial ref={collect} color={skierCol} transparent fog />
        </mesh>

        {/* ── SKIER ── papercut silhouette, well behind the stern */}
        <group position={SKIER_POS}>
          <group rotation={[0, 0, -0.60]}>
            <mesh geometry={skierBodyGeo} position={[0, 0, 0.01]}>
              <meshBasicMaterial ref={collect} color={skierCol} transparent side={THREE.DoubleSide} fog />
            </mesh>
          </group>

          {/* Skis — bright white, sit below the figure */}
          <mesh geometry={skiGeo} position={[-0.14, -0.30,  0.13]} rotation={[0, 0, 0.05]}>
            <meshBasicMaterial ref={collect} color={skiCol} transparent side={THREE.DoubleSide} fog />
          </mesh>
          <mesh geometry={skiGeo} position={[-0.14, -0.30, -0.13]} rotation={[0, 0, 0.05]}>
            <meshBasicMaterial ref={collect} color={skiCol} transparent side={THREE.DoubleSide} fog />
          </mesh>
        </group>

      </group>
    </group>
  );
}
