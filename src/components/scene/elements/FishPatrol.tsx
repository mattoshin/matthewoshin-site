"use client";

/**
 * FishPatrol - three independent schools of papercut ShapeGeometry fish,
 * each zone-gated: shallow mackerel, twilight orange, deep violet.
 * All schools are rendered by a single component to keep registry.ts clean.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01 } from "@/lib/depth";
import type { SceneElementProps } from "../types";

function makeFishBody(s: number): THREE.BufferGeometry {
  const sh = new THREE.Shape();
  sh.moveTo( s * 0.85,  0);
  sh.quadraticCurveTo( s * 0.55,  s * 0.30,  0,        s * 0.22);
  sh.quadraticCurveTo(-s * 0.30,  s * 0.16, -s * 0.72, 0);
  sh.quadraticCurveTo(-s * 0.30, -s * 0.16,  0,       -s * 0.22);
  sh.quadraticCurveTo( s * 0.55, -s * 0.30,  s * 0.85, 0);
  sh.closePath();
  return new THREE.ShapeGeometry(sh);
}

function makeTailFin(s: number): THREE.BufferGeometry {
  const sh = new THREE.Shape();
  sh.moveTo(-s * 0.72,  0);
  sh.lineTo(-s * 1.18,  s * 0.28);
  sh.lineTo(-s * 0.98,  0);
  sh.lineTo(-s * 1.18, -s * 0.28);
  sh.closePath();
  return new THREE.ShapeGeometry(sh);
}

interface SchoolConfig {
  count: number;
  bandStart: number;
  bandEnd: number;
  yOffset: number;
  zDepth: number;
  speed: number;
  scale: number;
  bodyHex: string;
  tailHex: string;
  rtl?: boolean;
}

const SCHOOLS: SchoolConfig[] = [
  // Shallow / experience zone — silver-blue mackerel
  {
    count: 6, bandStart: 0.14, bandEnd: 0.32,
    yOffset: -1.0, zDepth: -11, speed: 3.8, scale: 0.70,
    bodyHex: "#6bbdd4", tailHex: "#4898b4",
  },
  // Same zone, second school going the other way
  {
    count: 4, bandStart: 0.18, bandEnd: 0.32,
    yOffset: -2.8, zDepth: -14, speed: 2.8, scale: 0.58,
    bodyHex: "#5aa8c2", tailHex: "#3a88a2",
    rtl: true,
  },
  // Twilight / entrepreneurship zone — warm orange
  {
    count: 5, bandStart: 0.34, bandEnd: 0.52,
    yOffset: -1.0, zDepth: -11, speed: 2.4, scale: 0.72,
    bodyHex: "#e0702a", tailHex: "#c05010",
  },
  // Deep / ventures zone — violet-blue
  {
    count: 3, bandStart: 0.52, bandEnd: 0.68,
    yOffset: -0.6, zDepth: -12, speed: 1.6, scale: 0.80,
    bodyHex: "#3a6888", tailHex: "#1a4868",
    rtl: true,
  },
];

const FEATHER = 0.04;

function buildOffsets(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    return {
      dx: Math.sin(t * 1.3) * 1.4,
      dy: Math.cos(t * 0.8) * 0.5,
      dz: Math.sin(t * 2.1) * 1.8,
      ph: t,
    };
  });
}

interface SchoolState {
  groupRef: React.RefObject<THREE.Group | null>;
  fishRefs: React.RefObject<(THREE.Group | null)[]>;
  matRefs:  React.RefObject<THREE.MeshBasicMaterial[]>;
  bodyGeo:  THREE.BufferGeometry;
  tailGeo:  THREE.BufferGeometry;
  bodyCol:  THREE.Color;
  tailCol:  THREE.Color;
  x:        React.RefObject<number>;
  offsets:  ReturnType<typeof buildOffsets>;
  cfg:      SchoolConfig;
}

function School({ s }: { s: SchoolState }) {
  const { cfg } = s;
  const count = cfg.count;

  return (
    <group ref={s.groupRef} visible={false}>
      {Array.from({ length: count }, (_, i) => (
        <group key={i} ref={(el) => { s.fishRefs.current[i] = el; }}>
          <mesh geometry={s.bodyGeo}>
            <meshBasicMaterial
              ref={(m) => { if (m) s.matRefs.current[i * 2] = m; }}
              color={s.bodyCol}
              transparent
              opacity={1}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh geometry={s.tailGeo}>
            <meshBasicMaterial
              ref={(m) => { if (m) s.matRefs.current[i * 2 + 1] = m; }}
              color={s.tailCol}
              transparent
              opacity={1}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function FishPatrol({ progress }: SceneElementProps) {
  const schools = useMemo<SchoolState[]>(() =>
    SCHOOLS.map((cfg, idx) => ({
      groupRef: { current: null } as React.RefObject<THREE.Group | null>,
      fishRefs: { current: [] }   as React.RefObject<(THREE.Group | null)[]>,
      matRefs:  { current: [] }   as React.RefObject<THREE.MeshBasicMaterial[]>,
      bodyGeo:  makeFishBody(cfg.scale),
      tailGeo:  makeTailFin(cfg.scale),
      bodyCol:  new THREE.Color(cfg.bodyHex),
      tailCol:  new THREE.Color(cfg.tailHex),
      // stagger start so each school is immediately visible, not off-screen
      x:        { current: cfg.rtl ? 8 - idx * 6 : -8 + idx * 6 } as React.RefObject<number>,
      offsets:  buildOffsets(cfg.count),
      cfg,
    })),
  []);

  useFrame((state, delta) => {
    const p = progress.get();
    const t = state.clock.elapsedTime;

    for (const s of schools) {
      const g = s.groupRef.current;
      if (!g) continue;

      const { cfg } = s;
      const fadeIn  = clamp01((p - cfg.bandStart + FEATHER) / FEATHER);
      const fadeOut = clamp01((cfg.bandEnd - p + FEATHER)   / FEATHER);
      const raw = fadeIn * fadeOut;
      const vis = raw * raw * (3 - 2 * raw);

      if (vis <= 0) { if (g.visible) g.visible = false; continue; }
      if (!g.visible) g.visible = true;

      const dir = cfg.rtl ? -1 : 1;
      s.x.current = (s.x.current ?? (cfg.rtl ? 24 : -24)) + dir * cfg.speed * delta;
      if (!cfg.rtl && s.x.current > 26)  s.x.current = -26;
      if ( cfg.rtl && s.x.current < -26) s.x.current =  26;

      g.position.y = state.camera.position.y + cfg.yOffset;
      g.position.z = cfg.zDepth;
      g.scale.x    = cfg.rtl ? -1 : 1;

      for (let i = 0; i < cfg.count; i++) {
        const fish = s.fishRefs.current[i];
        if (!fish) continue;
        const o = s.offsets[i];
        fish.position.x  = s.x.current + o.dx;
        fish.position.y  = o.dy + Math.sin(t * 1.8 + o.ph) * 0.20;
        fish.position.z  = o.dz;
        fish.rotation.z  = Math.sin(t * 1.8 + o.ph) * 0.06;
        const tail = fish.children[1] as THREE.Mesh | undefined;
        if (tail) tail.rotation.z = Math.sin(t * 5.0 + o.ph) * 0.35;
      }

      for (const m of s.matRefs.current) {
        if (m) m.opacity = vis;
      }
    }
  });

  return (
    <>
      {schools.map((s, i) => <School key={i} s={s} />)}
    </>
  );
}
