"use client";

/**
 * Dolphin - a single bottlenose dolphin leaping repeatedly out of the water on
 * the left-center surface band. Pure papercut silhouette (deep teal, matching the
 * sailboat language) built from flat ShapeGeometry: a streamlined body with a
 * dorsal fin, pectoral fin, and split flukes. The jump follows a parabolic arc
 * repeated every JUMP_PERIOD seconds; between jumps the dolphin sinks below the
 * waterline (group.position.y < waterline) and the group is invisible.
 *
 * Body pitch tracks velocity direction (atan2(dy, dx)) so the nose points forward
 * through the arc — explosive upward angle on the way up, gentle levelling at the
 * apex, steep downward dive on re-entry.
 *
 * Belongs to the SURFACE band only: fades out with the sailboats by ~progress 0.2.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01 } from "@/lib/depth";
import type { SceneElementProps } from "../types";

const FADE_START = 0.08;
const FADE_END = 0.2;

// Dolphin silhouette palette (matches deep-teal papercut boats).
const BODY_COLOR = "#0c4a5e";

// World position: left-center flank, between the sailboat and the hero card.
const DOL_X = -6.5;
const DOL_Z = -10.5;
const DOL_SCALE = 0.82;

// Jump timing.
const JUMP_PERIOD = 5.2;    // seconds between jump starts
const JUMP_DURATION = 1.6;  // seconds the dolphin is airborne
const JUMP_HEIGHT = 3.8;    // world units above the waterline at the apex
const EXIT_ANGLE = 0.72;    // radians — body pitch at water exit (~41 deg up)

// Waterline for this position (matches HORIZON_K from sailboats/skier).
const CAM_Z = 8;
const HORIZON_K = 0.286;
const WATERLINE_Y = HORIZON_K * (CAM_Z - DOL_Z);

function makeDolphinBody(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  // Bottlenose profile, facing +x (nose right), +y up.
  // Body: streamlined torpedo, widest at the dorsal fin, tapers to a pointed beak.
  s.moveTo(-1.1, 0.0);                              // tail junction
  s.quadraticCurveTo(-0.55, -0.28, 0.0, -0.22);    // ventral keel
  s.quadraticCurveTo(0.5, -0.18, 0.85, -0.08);
  s.quadraticCurveTo(1.05, -0.04, 1.2, 0.03);      // beak tip (lower)
  s.quadraticCurveTo(1.22, 0.06, 1.18, 0.1);       // beak tip (upper)
  s.quadraticCurveTo(1.0, 0.14, 0.78, 0.16);
  s.quadraticCurveTo(0.4, 0.22, 0.0, 0.28);
  s.quadraticCurveTo(-0.4, 0.32, -0.78, 0.24);
  s.quadraticCurveTo(-1.0, 0.12, -1.1, 0.0);       // back to tail
  return new THREE.ShapeGeometry(s);
}

function makeDorsalFin(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  // Upright triangular dorsal fin mounted at ~x=0.
  s.moveTo(-0.1, 0.28);
  s.quadraticCurveTo(0.0, 0.72, 0.1, 0.62);
  s.lineTo(0.28, 0.28);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makePecFin(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  // Small swept-back pectoral fin on the right side (visible from camera).
  s.moveTo(0.3, -0.18);
  s.quadraticCurveTo(0.5, -0.46, 0.18, -0.52);
  s.quadraticCurveTo(-0.02, -0.38, 0.3, -0.18);
  return new THREE.ShapeGeometry(s);
}

function makeFlukes(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  // Horizontal split tail flukes at -x.
  s.moveTo(-1.1, 0.0);
  s.quadraticCurveTo(-1.3, 0.08, -1.5, 0.28);   // upper lobe
  s.quadraticCurveTo(-1.6, 0.38, -1.52, 0.46);
  s.quadraticCurveTo(-1.35, 0.44, -1.22, 0.36);
  s.quadraticCurveTo(-1.15, 0.3, -1.12, 0.22);
  s.lineTo(-1.1, 0.0);
  // Lower lobe (mirrored in -y).
  s.quadraticCurveTo(-1.12, -0.22, -1.22, -0.36);
  s.quadraticCurveTo(-1.35, -0.44, -1.52, -0.46);
  s.quadraticCurveTo(-1.6, -0.38, -1.5, -0.28);
  s.quadraticCurveTo(-1.3, -0.08, -1.1, 0.0);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

export default function Dolphin({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rigRef = useRef<THREE.Group>(null);
  const matRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  const bodyGeo = useMemo(() => makeDolphinBody(), []);
  const dorsalGeo = useMemo(() => makeDorsalFin(), []);
  const pecGeo = useMemo(() => makePecFin(), []);
  const flukesGeo = useMemo(() => makeFlukes(), []);
  const color = useMemo(() => new THREE.Color(BODY_COLOR), []);

  const reg = (i: number) => (el: THREE.MeshBasicMaterial | null) => {
    matRefs.current[i] = el;
  };

  useFrame((state) => {
    const group = groupRef.current;
    const rig = rigRef.current;
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

    // Jump cycle: phase 0..1 within the jump, >1 means we're underwater (hidden).
    const cycleT = t % JUMP_PERIOD;
    const jumpPhase = cycleT / JUMP_DURATION; // 0..1 airborne, >1 submerged

    if (jumpPhase > 1.02) {
      // Hidden between jumps — dolphin is "underwater".
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    // Parabolic arc: y = sin(jumpPhase * PI) * JUMP_HEIGHT above the waterline.
    const arcY = Math.sin(jumpPhase * Math.PI) * JUMP_HEIGHT;
    const worldY = WATERLINE_Y + arcY;

    // Pitch: atan2 of dy/dPhase (derivative of sin(phase*PI) is PI*cos(phase*PI)).
    // Map so 0 = exit angle, 0.5 = level, 1 = re-entry (negative).
    const dyDphase = Math.PI * Math.cos(jumpPhase * Math.PI);
    // Clamp pitch to ±EXIT_ANGLE so the exit looks like a real leap.
    const pitch = Math.atan2(dyDphase * JUMP_HEIGHT, JUMP_DURATION) * 0.55;

    rig.position.set(DOL_X, worldY, DOL_Z);
    rig.rotation.set(0, 0, clamp01(pitch / EXIT_ANGLE) * EXIT_ANGLE * Math.sign(pitch));
    rig.scale.setScalar(DOL_SCALE);
  });

  return (
    <group ref={groupRef} renderOrder={-4}>
      <group ref={rigRef} position={[DOL_X, WATERLINE_Y, DOL_Z]} scale={DOL_SCALE}>
        {/* Flukes (rendered behind body) */}
        <mesh geometry={flukesGeo} position={[0, 0, -0.02]}>
          <meshBasicMaterial ref={reg(0)} color={color} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>
        {/* Main body */}
        <mesh geometry={bodyGeo} position={[0, 0, 0]}>
          <meshBasicMaterial ref={reg(1)} color={color} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>
        {/* Dorsal fin */}
        <mesh geometry={dorsalGeo} position={[0, 0, 0.01]}>
          <meshBasicMaterial ref={reg(2)} color={color} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>
        {/* Pec fin */}
        <mesh geometry={pecGeo} position={[0, 0, 0.01]}>
          <meshBasicMaterial ref={reg(3)} color={color} transparent opacity={1} side={THREE.DoubleSide} fog />
        </mesh>
      </group>
    </group>
  );
}
