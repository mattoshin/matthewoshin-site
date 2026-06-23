"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01 } from "@/lib/depth";
import type { SceneElementProps } from "../types";

/**
 * Submarine - a slow, large nuclear submarine drifting bow-first through the
 * projects depth band. Built as flat THREE.ShapeGeometry profiles with unlit
 * materials to match the rest of the ocean scene (no lights, no extra deps).
 *
 * Realism comes from the silhouette and tonal banding rather than 3D geometry:
 * a teardrop (Albacore) hull in near-black anechoic charcoal, a tall faired sail
 * set forward of midships with fairwater planes and a mast cluster, a cruciform
 * tail (swept rudders + stern planes), a skewed seven-blade screw, a row of
 * limber holes, a plating seam, and a cool deck highlight over a dark belly that
 * together fake the cylindrical hull. No portholes or headlight: real boats run
 * dark and blacked-out when submerged.
 *
 * Each material carries its base opacity in userData.base; the band fade
 * multiplies into it every frame by traversing the group (keeps refs out of the
 * render path).
 */

const BAND_START = 0.33;
const BAND_END   = 0.49;
const FEATHER    = 0.04;
const SPEED      = 0.55;        // units/sec, slow so it reads as large
const Z_DEPTH    = -12;
const Y_OFFSET   = -0.8;
const HW         = 4.4;         // hull half-length
const HH         = 0.5;         // hull half-height (at max beam)

const SX         = HW * 0.30;   // sail center, forward of midships
const SW         = HW * 0.12;   // sail half-chord
const SH         = HH * 3.2;    // sail height above deck
const SAIL_BASE  = HH * 0.78;   // y where the sail meets the deck

/* ------------------------------------------------------------------ hull --- */

/** Teardrop hull: rounded sonar-dome bow (right), full forward third, long taper
 *  to a fine stern (left) where the propulsor and fins attach. */
function makeHull(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(HW, 0);                                                      // bow tip
  s.bezierCurveTo(HW, HH * 0.72, HW * 0.72, HH, HW * 0.42, HH);         // bow shoulder up to max beam
  s.bezierCurveTo(HW * 0.05, HH, -HW * 0.55, HH * 0.6, -HW, HH * 0.12); // long top taper to stern
  s.lineTo(-HW, -HH * 0.12);                                            // narrow stern face
  s.bezierCurveTo(-HW * 0.55, -HH * 0.6, HW * 0.05, -HH, HW * 0.42, -HH); // long bottom taper
  s.bezierCurveTo(HW * 0.72, -HH, HW, -HH * 0.72, HW, 0);               // bow shoulder back to tip
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** Lighter top band: surface light catching the upper curve of the round hull. */
function makeDeckHighlight(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(HW * 0.9, HH * 0.34);
  s.bezierCurveTo(HW, HH * 0.72, HW * 0.72, HH, HW * 0.42, HH);
  s.bezierCurveTo(HW * 0.05, HH, -HW * 0.55, HH * 0.6, -HW, HH * 0.12);
  s.lineTo(-HW, HH * 0.02);
  s.bezierCurveTo(-HW * 0.5, HH * 0.34, HW * 0.05, HH * 0.46, HW * 0.55, HH * 0.42);
  s.quadraticCurveTo(HW * 0.8, HH * 0.4, HW * 0.9, HH * 0.34);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** Darker bottom band: the underside in shadow, completing the round-hull read. */
function makeBellyShadow(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(HW * 0.88, -HH * 0.32);
  s.bezierCurveTo(HW, -HH * 0.72, HW * 0.72, -HH, HW * 0.42, -HH);
  s.bezierCurveTo(HW * 0.05, -HH, -HW * 0.55, -HH * 0.6, -HW, -HH * 0.12);
  s.lineTo(-HW, -HH * 0.02);
  s.bezierCurveTo(-HW * 0.5, -HH * 0.3, HW * 0.05, -HH * 0.46, HW * 0.55, -HH * 0.42);
  s.quadraticCurveTo(HW * 0.8, -HH * 0.4, HW * 0.88, -HH * 0.32);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** Thin metallic rim hugging the very top edge of the hull. */
function makeTopRim(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  const drop = HH * 0.12;
  s.moveTo(HW * 0.44, HH);
  s.bezierCurveTo(HW * 0.05, HH, -HW * 0.55, HH * 0.6, -HW * 0.98, HH * 0.13);
  s.lineTo(-HW * 0.98, HH * 0.13 - drop);
  s.bezierCurveTo(-HW * 0.55, HH * 0.6 - drop, HW * 0.05, HH - drop, HW * 0.44, HH - drop);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** A faint horizontal plating seam down the hull side. */
function makeSeam(): THREE.BufferGeometry {
  const y = -HH * 0.02;
  const h = HH * 0.05;
  const s = new THREE.Shape();
  s.moveTo(HW * 0.7, y + h);
  s.lineTo(-HW * 0.9, y + h);
  s.lineTo(-HW * 0.9, y - h);
  s.lineTo(HW * 0.7, y - h);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** A row of small limber (flood) holes along the lower hull. */
function makeLimberHoles(): THREE.BufferGeometry {
  const shapes: THREE.Shape[] = [];
  const y = -HH * 0.5;
  const w = HH * 0.07;
  const h = HH * 0.26;
  const n = 11;
  const x0 = -HW * 0.6;
  const x1 = HW * 0.5;
  for (let i = 0; i < n; i++) {
    const cx = x0 + ((x1 - x0) * i) / (n - 1);
    const s = new THREE.Shape();
    s.moveTo(cx - w, y - h);
    s.lineTo(cx + w, y - h);
    s.lineTo(cx + w, y + h);
    s.lineTo(cx - w, y + h);
    s.closePath();
    shapes.push(s);
  }
  return new THREE.ShapeGeometry(shapes);
}

/* ------------------------------------------------------------------ sail --- */

/** Streamlined sail (fairwater) faired into the deck, leading edge raked. */
function makeSail(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(SX + SW * 1.05, SAIL_BASE);                                  // aft base, faired
  s.bezierCurveTo(SX + SW, SAIL_BASE + SH * 0.5, SX + SW * 0.85, SAIL_BASE + SH * 0.86, SX + SW * 0.55, SAIL_BASE + SH); // aft edge up
  s.quadraticCurveTo(SX + SW * 0.1, SAIL_BASE + SH + HH * 0.1, SX - SW * 0.35, SAIL_BASE + SH * 0.96); // rounded top, slightly forward
  s.bezierCurveTo(SX - SW * 0.95, SAIL_BASE + SH * 0.78, SX - SW, SAIL_BASE + SH * 0.4, SX - SW * 0.95, SAIL_BASE); // raked leading edge
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** Lighter sliver up the leading edge of the sail. */
function makeSailEdge(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(SX - SW * 0.95, SAIL_BASE);
  s.bezierCurveTo(SX - SW, SAIL_BASE + SH * 0.4, SX - SW * 0.95, SAIL_BASE + SH * 0.78, SX - SW * 0.35, SAIL_BASE + SH * 0.96);
  s.lineTo(SX - SW * 0.5, SAIL_BASE + SH * 0.9);
  s.bezierCurveTo(SX - SW * 0.75, SAIL_BASE + SH * 0.7, SX - SW * 0.78, SAIL_BASE + SH * 0.4, SX - SW * 0.68, SAIL_BASE);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** Fairwater (sail) planes: a horizontal foil through the sail, seen foreshortened. */
function makeSailPlane(): THREE.BufferGeometry {
  const py = SAIL_BASE + SH * 0.5;
  const span = SW * 3.0;
  const t = HH * 0.13;
  const s = new THREE.Shape();
  s.moveTo(SX - span, py + t * 0.5);
  s.lineTo(SX + span, py + t * 0.5);
  s.quadraticCurveTo(SX + span + t * 1.6, py, SX + span, py - t * 0.5);
  s.lineTo(SX - span, py - t * 0.5);
  s.quadraticCurveTo(SX - span - t * 1.6, py, SX - span, py + t * 0.5);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** Mast cluster atop the sail: photonics / periscope / ESM, varied heights. */
function makeMasts(): THREE.BufferGeometry {
  const top = SAIL_BASE + SH;
  const specs: [number, number, number][] = [
    // [x, height, half-width]
    [SX - SW * 0.45, SH * 0.42, SW * 0.1],
    [SX - SW * 0.1, SH * 0.62, SW * 0.12],
    [SX + SW * 0.28, SH * 0.34, SW * 0.08],
  ];
  const shapes = specs.map(([x, h, w]) => {
    const s = new THREE.Shape();
    s.moveTo(x - w, top - SH * 0.05);
    s.lineTo(x - w, top + h);
    s.lineTo(x + w, top + h);
    s.lineTo(x + w, top - SH * 0.05);
    s.closePath();
    return s;
  });
  return new THREE.ShapeGeometry(shapes);
}

/* ------------------------------------------------------------------ tail --- */

/** Cruciform vertical fins at the stern: swept upper rudder + lower rudder. */
function makeRudders(): THREE.BufferGeometry {
  const baseX = -HW * 0.6;   // leading edge of fin root
  const chord = HW * 0.4;
  const fh    = HH * 2.7;
  const sweep = fh * 0.28;   // tip rakes aft
  const upper = new THREE.Shape();
  upper.moveTo(baseX, HH * 0.12);
  upper.lineTo(baseX - chord, HH * 0.12);
  upper.lineTo(baseX - chord - sweep, HH * 0.12 + fh);
  upper.lineTo(baseX - sweep * 0.7, HH * 0.12 + fh);
  upper.closePath();
  const lower = new THREE.Shape();
  lower.moveTo(baseX, -HH * 0.12);
  lower.lineTo(baseX - chord, -HH * 0.12);
  lower.lineTo(baseX - chord - sweep, -HH * 0.12 - fh);
  lower.lineTo(baseX - sweep * 0.7, -HH * 0.12 - fh);
  lower.closePath();
  return new THREE.ShapeGeometry([upper, lower]);
}

/** Horizontal stern planes seen edge-on: a thin foil across the tail. */
function makeSternPlane(): THREE.BufferGeometry {
  const t = HH * 0.16;
  const s = new THREE.Shape();
  s.moveTo(-HW * 0.42, t * 0.5);
  s.lineTo(-HW * 0.98, t * 0.5);
  s.lineTo(-HW * 1.02, 0);
  s.lineTo(-HW * 0.98, -t * 0.5);
  s.lineTo(-HW * 0.42, -t * 0.5);
  s.quadraticCurveTo(-HW * 0.36, 0, -HW * 0.42, t * 0.5);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** One highly skewed (scimitar) screw blade for a quieting seven-blade prop. */
function makeSkewBlade(): THREE.BufferGeometry {
  const R = HH * 1.05;
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(R * 0.22, R * 0.3, R * 0.16, R * 0.74, -R * 0.1, R);  // skewed outer edge
  s.bezierCurveTo(R * 0.02, R * 0.72, R * 0.3, R * 0.34, R * 0.14, 0);  // back to hub
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeHub(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.absarc(0, 0, HH * 0.2, 0, Math.PI * 2, false);
  return new THREE.ShapeGeometry(s, 16);
}

/* --------------------------------------------------------------- palette --- */

const HULL_MID = new THREE.Color("#16222b"); // anechoic charcoal, cool
const DECK_HI  = new THREE.Color("#33505f"); // surface light on the deck
const BELLY    = new THREE.Color("#0a1016"); // underside shadow
const RIM      = new THREE.Color("#3e5d6e"); // metallic top rim
const SEAM     = new THREE.Color("#0a1217"); // recessed plating seam
const SAIL_COL = new THREE.Color("#101a22");
const SAIL_HI  = new THREE.Color("#2a4150");
const FIN_COL  = new THREE.Color("#0d161d");
const MAST_COL = new THREE.Color("#22333f");
const PROP_COL = new THREE.Color("#0c141b");
const HUB_COL  = new THREE.Color("#1a2832");

const BLADES = [0, 1, 2, 3, 4, 5, 6]; // seven-blade skewed screw

export default function Submarine({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const propRef  = useRef<THREE.Group>(null);
  const subX     = useRef(-6); // start near center so it is visible on load

  const hullGeo   = useMemo(() => makeHull(),          []);
  const deckGeo   = useMemo(() => makeDeckHighlight(), []);
  const bellyGeo  = useMemo(() => makeBellyShadow(),   []);
  const rimGeo    = useMemo(() => makeTopRim(),        []);
  const seamGeo   = useMemo(() => makeSeam(),          []);
  const limberGeo = useMemo(() => makeLimberHoles(),   []);
  const sailGeo   = useMemo(() => makeSail(),          []);
  const sailEdge  = useMemo(() => makeSailEdge(),      []);
  const planeGeo  = useMemo(() => makeSailPlane(),     []);
  const mastGeo   = useMemo(() => makeMasts(),         []);
  const rudderGeo = useMemo(() => makeRudders(),       []);
  const sternGeo  = useMemo(() => makeSternPlane(),    []);
  const bladeGeo  = useMemo(() => makeSkewBlade(),     []);
  const hubGeo    = useMemo(() => makeHub(),           []);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const p = progress.get();
    const fadeIn  = clamp01((p - BAND_START + FEATHER) / FEATHER);
    const fadeOut = clamp01((BAND_END - p + FEATHER) / FEATHER);
    const raw = fadeIn * fadeOut;
    const vis = raw * raw * (3 - 2 * raw);

    if (vis <= 0) { if (g.visible) g.visible = false; return; }
    if (!g.visible) g.visible = true;

    subX.current += SPEED * delta;
    if (subX.current > 32) subX.current = -32;

    const t = state.clock.elapsedTime;
    g.position.x = subX.current;
    g.position.y = state.camera.position.y + Y_OFFSET + Math.sin(t * 0.4) * 0.12;
    g.position.z = Z_DEPTH;

    if (propRef.current) propRef.current.rotation.z -= delta * 2.2;

    // Fade the whole boat together; each material keeps its own base opacity.
    g.traverse((o) => {
      const mat = (o as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
      if (mat && mat.isMaterial) {
        const base = (mat.userData.base as number | undefined) ?? 1;
        mat.opacity = vis * base;
      }
    });
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Hull base */}
      <mesh geometry={hullGeo}>
        <meshBasicMaterial color={HULL_MID} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Belly shadow + deck highlight fake the round cross-section */}
      <mesh geometry={bellyGeo} position={[0, 0, 0.005]}>
        <meshBasicMaterial color={BELLY} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={deckGeo} position={[0, 0, 0.01]}>
        <meshBasicMaterial color={DECK_HI} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={rimGeo} position={[0, 0, 0.015]}>
        <meshBasicMaterial color={RIM} transparent opacity={1} userData={{ base: 0.85 }} side={THREE.DoubleSide} />
      </mesh>

      {/* Hull detail */}
      <mesh geometry={seamGeo} position={[0, 0, 0.012]}>
        <meshBasicMaterial color={SEAM} transparent opacity={1} userData={{ base: 0.5 }} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={limberGeo} position={[0, 0, 0.012]}>
        <meshBasicMaterial color={BELLY} transparent opacity={1} userData={{ base: 0.55 }} side={THREE.DoubleSide} />
      </mesh>

      {/* Horizontal stern plane (edge-on) behind the hull */}
      <mesh geometry={sternGeo} position={[0, 0, -0.005]}>
        <meshBasicMaterial color={FIN_COL} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Cruciform rudders */}
      <mesh geometry={rudderGeo} position={[0, 0, -0.008]}>
        <meshBasicMaterial color={FIN_COL} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Sail, leading-edge highlight, fairwater planes, masts */}
      <mesh geometry={sailGeo} position={[0, 0, 0.02]}>
        <meshBasicMaterial color={SAIL_COL} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={sailEdge} position={[0, 0, 0.025]}>
        <meshBasicMaterial color={SAIL_HI} transparent opacity={1} userData={{ base: 0.9 }} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={planeGeo} position={[0, 0, 0.03]}>
        <meshBasicMaterial color={FIN_COL} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={mastGeo} position={[0, 0, 0.018]}>
        <meshBasicMaterial color={MAST_COL} transparent opacity={1} userData={{ base: 0.95 }} side={THREE.DoubleSide} />
      </mesh>

      {/* Skewed seven-blade screw at the stern */}
      <group ref={propRef} position={[-HW * 1.02, 0, 0.005]}>
        {BLADES.map((i) => (
          <group key={i} rotation={[0, 0, (i / BLADES.length) * Math.PI * 2]}>
            <mesh geometry={bladeGeo}>
              <meshBasicMaterial color={PROP_COL} transparent opacity={1} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
        <mesh geometry={hubGeo} position={[0, 0, 0.01]}>
          <meshBasicMaterial color={HUB_COL} transparent opacity={1} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
