"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDescentStore } from "@/lib/store";
import type { SceneElementProps } from "../types";

const POOL = 100;
const OFF_Y = 99999;

function seed(i: number, s: number): number {
  return (((Math.sin(i * 127.1 + s * 311.7) * 43758.5453) % 1) + 1) % 1;
}

export default function DescentBubbles(_: SceneElementProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geoRef    = useRef<any>(null);
  const positions = useRef(new Float32Array(POOL * 3).fill(0));
  const rise      = useRef(new Float32Array(POOL));
  const alive     = useRef(new Uint8Array(POOL));
  const spawnAcc  = useRef(0);

  // Pre-fill Y to off-screen so nothing visible before first frame
  for (let i = 0; i < POOL; i++) positions.current[i * 3 + 1] = OFF_Y;

  useFrame((state, delta) => {
    const curP  = useDescentStore.getState().scrollProgress;
    const targP = useDescentStore.getState().targetProgress;
    const diff  = targP - curP;
    const diving = diff > 0.003;

    const camY = state.camera.position.y;
    const t    = state.clock.elapsedTime;
    const pos  = positions.current;
    const vel  = rise.current;
    const alv  = alive.current;

    for (let i = 0; i < POOL; i++) {
      if (!alv[i]) continue;
      pos[i * 3 + 1] += vel[i] * delta;
      if (pos[i * 3 + 1] > camY + 20) {
        alv[i] = 0;
        pos[i * 3 + 1] = OFF_Y;
      }
    }

    if (diving) {
      spawnAcc.current += delta;
      const rate = Math.min(diff * 120, 8);
      while (spawnAcc.current > 1 / rate) {
        spawnAcc.current -= 1 / rate;
        for (let i = 0; i < POOL; i++) {
          if (!alv[i]) {
            const si = (i * 17 + Math.floor(t * 113)) & 0xffff;
            pos[i * 3]     = (seed(si, 1) - 0.5) * 22;
            pos[i * 3 + 1] = camY - seed(si, 2) * 10;
            pos[i * 3 + 2] = -(5 + seed(si, 3) * 18);
            vel[i]         = 4 + seed(si, 4) * 6;
            alv[i] = 1;
            break;
          }
        }
      }
    } else {
      spawnAcc.current = 0;
    }

    if (geoRef.current) {
      (geoRef.current.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <points>
      <bufferGeometry
        ref={(g) => {
          if (g && !geoRef.current) {
            geoRef.current = g;
            const attr = new THREE.BufferAttribute(positions.current, 3);
            attr.setUsage(THREE.DynamicDrawUsage);
            g.setAttribute("position", attr);
          }
        }}
      />
      <pointsMaterial
        color="#c4f0ff"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </points>
  );
}
