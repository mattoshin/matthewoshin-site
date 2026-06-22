"use client";

/**
 * Dolphin - a single bottlenose dolphin leaping out of the water on the
 * left-center surface band. Pure papercut silhouette (deep teal) built from
 * flat ShapeGeometry: body + dorsal fin + pec fin + split flukes. Jump follows
 * a parabolic arc every JUMP_PERIOD seconds; body pitch tracks velocity
 * direction for a realistic launch/apex/dive. Includes additive-white splash
 * fans at water exit and re-entry. Fades with the surface band by progress 0.2.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01 } from "@/lib/depth";
import type { SceneElementProps } from "../types";

const FADE_START = 0.0;
const FADE_END = 0.05; // dolphin shows ONLY at the very top; gone as soon as you scroll

const BODY_COLOR = "#0c4a5e";
const SPRAY_COLOR = "#d8f8ff"; // cool-white spray, additive so it glows

const DOL_X = -6.5;
const DOL_Z = -10.5;
const DOL_SCALE = 0.82;

const JUMP_PERIOD = 19.0; // a jump roughly every 19s
const JUMP_DURATION = 1.7; // quick, lively leap (jumps stay ~19s apart via JUMP_PERIOD)
const JUMP_HEIGHT = 3.8;
const EXIT_ANGLE = 0.72;

const CAM_Z = 8;
const HORIZON_K = 0.286;
const WATERLINE_Y = HORIZON_K * (CAM_Z - DOL_Z);

// Splash fades in when jumpPhase < EXIT_WINDOW (launch) or > 1 - ENTRY_WINDOW (entry).
const EXIT_WINDOW = 0.12;
const ENTRY_WINDOW = 0.10;

function makeDolphinBody(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-1.1, 0.0);
  s.quadraticCurveTo(-0.55, -0.28, 0.0, -0.22);
  s.quadraticCurveTo(0.5, -0.18, 0.85, -0.08);
  s.quadraticCurveTo(1.05, -0.04, 1.2, 0.03);
  s.quadraticCurveTo(1.22, 0.06, 1.18, 0.1);
  s.quadraticCurveTo(1.0, 0.14, 0.78, 0.16);
  s.quadraticCurveTo(0.4, 0.22, 0.0, 0.28);
  s.quadraticCurveTo(-0.4, 0.32, -0.78, 0.24);
  s.quadraticCurveTo(-1.0, 0.12, -1.1, 0.0);
  return new THREE.ShapeGeometry(s);
}

function makeDorsalFin(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-0.1, 0.28);
  s.quadraticCurveTo(0.0, 0.72, 0.1, 0.62);
  s.lineTo(0.28, 0.28);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makePecFin(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0.3, -0.18);
  s.quadraticCurveTo(0.5, -0.46, 0.18, -0.52);
  s.quadraticCurveTo(-0.02, -0.38, 0.3, -0.18);
  return new THREE.ShapeGeometry(s);
}

function makeFlukes(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-1.1, 0.0);
  s.quadraticCurveTo(-1.3, 0.08, -1.5, 0.28);
  s.quadraticCurveTo(-1.6, 0.38, -1.52, 0.46);
  s.quadraticCurveTo(-1.35, 0.44, -1.22, 0.36);
  s.quadraticCurveTo(-1.15, 0.3, -1.12, 0.22);
  s.lineTo(-1.1, 0.0);
  s.quadraticCurveTo(-1.12, -0.22, -1.22, -0.36);
  s.quadraticCurveTo(-1.35, -0.44, -1.52, -0.46);
  s.quadraticCurveTo(-1.6, -0.38, -1.5, -0.28);
  s.quadraticCurveTo(-1.3, -0.08, -1.1, 0.0);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** Fan of triangles radiating upward — splash at water entry/exit. */
function makeSplashGeometry(): THREE.BufferGeometry {
  const tips: [number, number, number][] = [
    [0.0,  1.1, 0.0],  // straight up, center
    [0.5,  0.9, 0.0],  // angled right
    [-0.5, 0.9, 0.0],  // angled left
    [0.9,  0.5, 0.0],  // wide right
    [-0.9, 0.5, 0.0],  // wide left
    [0.25, 1.3, 0.0],  // slight right high
    [-0.25,1.3, 0.0],  // slight left high
  ];
  const verts: number[] = [];
  for (const [tx, ty, tz] of tips) {
    // Each spike is a thin triangle from a base pair to its tip.
    verts.push(-0.06, 0, 0,  0.06, 0, 0,  tx * 0.55, ty * 0.55, tz);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

export default function Dolphin({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rigRef = useRef<THREE.Group>(null);
  const splashRef = useRef<THREE.Group>(null);
  const matRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const exitSplashRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const entrySplashRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const bodyGeo   = useMemo(() => makeDolphinBody(), []);
  const dorsalGeo = useMemo(() => makeDorsalFin(), []);
  const pecGeo    = useMemo(() => makePecFin(), []);
  const flukesGeo = useMemo(() => makeFlukes(), []);
  const splashGeo = useMemo(() => makeSplashGeometry(), []);
  const color     = useMemo(() => new THREE.Color(BODY_COLOR), []);
  const sprayCol  = useMemo(() => new THREE.Color(SPRAY_COLOR), []);

  const reg = (i: number) => (el: THREE.MeshBasicMaterial | null) => {
    matRefs.current[i] = el;
  };

  useFrame((state) => {
    const group = groupRef.current;
    const rig   = rigRef.current;
    if (!group || !rig) return;

    const p = progress.get();
    if (p >= FADE_END) {
      if (group.visible) group.visible = false;
      return;
    }

    const fadeT = clamp01((p - FADE_START) / (FADE_END - FADE_START));
    const eased = (() => { const v = 1 - fadeT; return v * v * (3 - 2 * v); })();

    const mats = matRefs.current;
    for (let i = 0; i < mats.length; i++) {
      const m = mats[i];
      if (m) m.opacity = eased;
    }

    const t = state.clock.elapsedTime;
    const cycleT  = t % JUMP_PERIOD;
    const jumpPhase = cycleT / JUMP_DURATION;

    if (jumpPhase > 1.02) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    const arcY  = Math.sin(jumpPhase * Math.PI) * JUMP_HEIGHT;
    const worldY = WATERLINE_Y + arcY;

    const dyDphase = Math.PI * Math.cos(jumpPhase * Math.PI);
    const pitch = Math.atan2(dyDphase * JUMP_HEIGHT, JUMP_DURATION) * 0.55;

    // Camera-lock group in Y so dolphin stays at the visual waterline as camera descends.
    const groupNode = groupRef.current;
    if (groupNode) groupNode.position.y = state.camera.position.y;

    rig.position.set(DOL_X, worldY, DOL_Z);
    rig.rotation.set(0, 0, clamp01(pitch / EXIT_ANGLE) * EXIT_ANGLE * Math.sign(pitch));
    rig.scale.setScalar(DOL_SCALE);

    // Splash: exit fan (near phase=0) and entry fan (near phase=1).
    const exitAlpha   = eased * (1 - clamp01(jumpPhase / EXIT_WINDOW));
    const entryAlpha  = eased * clamp01((jumpPhase - (1 - ENTRY_WINDOW)) / ENTRY_WINDOW);
    if (exitSplashRef.current)  exitSplashRef.current.opacity  = exitAlpha  * 0.75;
    if (entrySplashRef.current) entrySplashRef.current.opacity = entryAlpha * 0.75;
  });

  return (
    <group ref={groupRef} renderOrder={-4}>
      {/* Moving rig: body follows the parabolic arc */}
      <group ref={rigRef} position={[DOL_X, WATERLINE_Y, DOL_Z]} scale={DOL_SCALE}>
        <mesh geometry={flukesGeo} position={[0, 0, -0.02]}>
          <meshBasicMaterial ref={reg(0)} color={color} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>
        <mesh geometry={bodyGeo} position={[0, 0, 0]}>
          <meshBasicMaterial ref={reg(1)} color={color} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>
        <mesh geometry={dorsalGeo} position={[0, 0, 0.01]}>
          <meshBasicMaterial ref={reg(2)} color={color} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>
        <mesh geometry={pecGeo} position={[0, 0, 0.01]}>
          <meshBasicMaterial ref={reg(3)} color={color} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>
      </group>

      {/* Splash fans: fixed at the waterline, not parented to the rig */}
      <group ref={splashRef} position={[DOL_X, WATERLINE_Y, DOL_Z]}>
        {/* Exit splash — launches upward as dolphin leaves the water */}
        <mesh geometry={splashGeo} scale={[1.1, 1.1, 1.1]}>
          <meshBasicMaterial
            ref={(el) => { exitSplashRef.current = el; }}
            color={sprayCol}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Entry splash — smaller burst on re-entry */}
        <mesh geometry={splashGeo} scale={[0.7, 0.7, 0.7]}>
          <meshBasicMaterial
            ref={(el) => { entrySplashRef.current = el; }}
            color={sprayCol}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
