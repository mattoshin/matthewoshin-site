"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01 } from "@/lib/depth";
import type { SceneElementProps } from "../types";

const BAND_START = 0.29;
const BAND_END   = 0.52;
const FEATHER    = 0.04;
const SPEED      = 1.1;        // units/sec — slow, reads as large
const Z_DEPTH    = -12;
const Y_OFFSET   = -0.8;
const HW         = 4.2;        // hull half-width
const HH         = 0.44;       // hull half-height

function makeHull(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  // Rounded torpedo nose (right)
  s.moveTo( HW,  0);
  s.quadraticCurveTo( HW,       HH * 0.9,  HW * 0.78, HH);
  // Top edge back to stern
  s.lineTo(-HW * 0.82, HH);
  // Rounded stern
  s.quadraticCurveTo(-HW,       HH * 0.5, -HW,        0);
  s.quadraticCurveTo(-HW,      -HH * 0.5, -HW * 0.82,-HH);
  // Bottom edge to bow
  s.lineTo( HW * 0.78, -HH);
  s.quadraticCurveTo( HW,      -HH * 0.9,  HW,        0);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeHullHighlight(): THREE.BufferGeometry {
  // Lighter strip along top quarter of hull
  const s = new THREE.Shape();
  const yt = HH;
  const yb = HH * 0.4;
  s.moveTo( HW * 0.75, yt);
  s.lineTo(-HW * 0.80, yt);
  s.quadraticCurveTo(-HW * 0.95, (yt + yb) / 2, -HW * 0.82, yb);
  s.lineTo( HW * 0.75, yb);
  s.quadraticCurveTo( HW, (yt + yb) / 2, HW * 0.75, yt);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeTower(): THREE.BufferGeometry {
  const tx = -HW * 0.15;  // 15% from center toward stern
  const tw = HW * 0.22;
  const th = HH * 2.4;
  const s = new THREE.Shape();
  s.moveTo(tx - tw, HH);
  s.lineTo(tx - tw, HH + th * 0.7);
  s.quadraticCurveTo(tx - tw * 0.5, HH + th, tx, HH + th);
  s.quadraticCurveTo(tx + tw * 0.5, HH + th, tx + tw, HH + th * 0.7);
  s.lineTo(tx + tw, HH);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makePeriscope(): THREE.BufferGeometry {
  const tx = -HW * 0.15;
  const tw = HW * 0.03;
  const ph = HH * 3.8;
  const s = new THREE.Shape();
  s.moveTo(tx - tw, HH + HH * 2.4);
  s.lineTo(tx - tw, HH + ph);
  s.lineTo(tx + tw * 2, HH + ph);
  s.lineTo(tx + tw * 2, HH + ph - tw * 3);
  s.lineTo(tx + tw,     HH + ph - tw * 3);
  s.lineTo(tx + tw,     HH + HH * 2.4);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makePorthole(cx: number, cy: number, r: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.absarc(cx, cy, r, 0, Math.PI * 2, false);
  return new THREE.ShapeGeometry(s, 16);
}

function makePropBlade(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0,  0);
  s.quadraticCurveTo(-0.10, -0.28, -0.04, -0.52);
  s.quadraticCurveTo( 0.06, -0.42,  0.12, -0.08);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeHeadlight(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(HW, 0);
  s.lineTo(HW + 1.8,  0.55);
  s.lineTo(HW + 1.8, -0.55);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

const HULL_COL      = new THREE.Color("#0d3040");
const HIGHLIGHT_COL = new THREE.Color("#1e4d68");
const TOWER_COL     = new THREE.Color("#0b2838");
const PORTHOLE_COL  = new THREE.Color("#7ad4e8");

const PORTHOLES: [number, number][] = [
  [ HW * 0.48, 0],
  [ HW * 0.22, 0],
  [-HW * 0.06, 0],
];

export default function Submarine({ progress }: SceneElementProps) {
  const groupRef  = useRef<THREE.Group>(null);
  const propRef   = useRef<THREE.Group>(null);
  const solidMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const glowMats  = useRef<THREE.MeshBasicMaterial[]>([]);
  const subX      = useRef(-6);  // start near center so it's visible on load

  const hullGeo      = useMemo(makeHull,          []);
  const highlightGeo = useMemo(makeHullHighlight,  []);
  const towerGeo     = useMemo(makeTower,          []);
  const periGeo      = useMemo(makePeriscope,      []);
  const portholeGeos = useMemo(() => PORTHOLES.map(([cx, cy]) => makePorthole(cx, cy, HH * 0.22)), []);
  const bladeGeo     = useMemo(makePropBlade,      []);
  const lightGeo     = useMemo(makeHeadlight,      []);

  const sm = (i: number) => (m: THREE.MeshBasicMaterial | null) => { if (m) solidMats.current[i] = m; };
  const gm = (i: number) => (m: THREE.MeshBasicMaterial | null) => { if (m) glowMats.current[i] = m; };

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const p = progress.get();
    const fadeIn  = clamp01((p - BAND_START + FEATHER) / FEATHER);
    const fadeOut = clamp01((BAND_END - p + FEATHER)   / FEATHER);
    const raw = fadeIn * fadeOut;
    const vis = raw * raw * (3 - 2 * raw);

    if (vis <= 0) { if (g.visible) g.visible = false; return; }
    if (!g.visible) g.visible = true;

    subX.current += SPEED * delta;
    if (subX.current > 32) subX.current = -32;

    const t = state.clock.elapsedTime;
    g.position.x  = subX.current;
    g.position.y  = state.camera.position.y + Y_OFFSET + Math.sin(t * 0.45) * 0.14;
    g.position.z  = Z_DEPTH;

    if (propRef.current) {
      propRef.current.rotation.z -= delta * 3.0;
    }

    for (const m of solidMats.current) if (m) m.opacity = vis;
    for (const m of glowMats.current)  if (m) m.opacity = vis * 0.88;
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Hull */}
      <mesh geometry={hullGeo} position={[0, 0, 0]}>
        <meshBasicMaterial ref={sm(0)} color={HULL_COL} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Hull highlight strip */}
      <mesh geometry={highlightGeo} position={[0, 0, 0.01]}>
        <meshBasicMaterial ref={sm(1)} color={HIGHLIGHT_COL} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Conning tower */}
      <mesh geometry={towerGeo} position={[0, 0, 0.02]}>
        <meshBasicMaterial ref={sm(2)} color={TOWER_COL} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Periscope */}
      <mesh geometry={periGeo} position={[0, 0, 0.03]}>
        <meshBasicMaterial ref={sm(3)} color={TOWER_COL} transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Portholes */}
      {portholeGeos.map((geo, i) => (
        <mesh key={i} geometry={geo} position={[0, 0, 0.04]}>
          <meshBasicMaterial ref={gm(i)} color={PORTHOLE_COL} transparent opacity={0.88}
            depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}

      {/* Headlight cone */}
      <mesh geometry={lightGeo} position={[0, 0, -0.01]}>
        <meshBasicMaterial ref={sm(4)} color="#b8f0ff" transparent opacity={0.10}
          depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Propeller */}
      <group ref={propRef} position={[-HW, 0, 0.05]}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, 0, (i / 3) * Math.PI * 2]}>
            <mesh geometry={bladeGeo}>
              <meshBasicMaterial ref={sm(5 + i)} color={HULL_COL} transparent opacity={1} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
