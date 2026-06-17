"use client";

/**
 * WaterColumn - the Phase-1 hero visual: a tall vertical gradient "water column"
 * the camera sinks through. It is a single large plane behind everything with a
 * shader that paints a vertical depth gradient (surface light at top, abyss at
 * bottom) plus a faint moving caustic shimmer.
 *
 * This is a reference SceneElement. It demonstrates the contract: it is fully
 * self-contained, reads the shared `progress` accessor each frame, and is wired
 * in purely via the registry. Later elements (fish, kelp, particles) follow the
 * same shape.
 */

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// Depth-gradient stops sampled from the zone palette (top -> bottom of column).
const TOP_COLOR = hexToRgb01("#BFE9F0"); // surface sky
const MID_COLOR = hexToRgb01("#0A3A52"); // twilight body
const DEEP_COLOR = hexToRgb01("#01060F"); // abyss body

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uDeep;
  uniform float uTime;
  uniform float uProgress;

  void main() {
    // y goes 0 (bottom) -> 1 (top) of the plane. Map it through the gradient,
    // biased by descent progress so the bright band slides up as we sink.
    float y = clamp(vUv.y - uProgress * 0.15, 0.0, 1.0);

    vec3 col;
    if (y > 0.5) {
      col = mix(uMid, uTop, (y - 0.5) * 2.0);
    } else {
      col = mix(uDeep, uMid, y * 2.0);
    }

    // Faint vertical light shafts that drift sideways over time.
    float shaft = sin(vUv.x * 14.0 + uTime * 0.15) * 0.5 + 0.5;
    shaft *= smoothstep(0.0, 1.0, vUv.y); // stronger near the surface
    col += shaft * 0.03 * (1.0 - uProgress);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function WaterColumn({ progress }: SceneElementProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(TOP_COLOR[0], TOP_COLOR[1], TOP_COLOR[2]) },
      uMid: { value: new THREE.Color(MID_COLOR[0], MID_COLOR[1], MID_COLOR[2]) },
      uDeep: { value: new THREE.Color(DEEP_COLOR[0], DEEP_COLOR[1], DEEP_COLOR[2]) },
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }),
    [],
  );

  // Smoothed progress so fast scroll jumps feel like sinking, not snapping.
  const smoothed = useRef(0);

  useFrame((_, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    // Mutate via the live material's uniforms (the ref), not the memoized object,
    // so the React Compiler immutability lint is satisfied.
    const u = mat.uniforms;
    const target = progress.get();
    smoothed.current = lerp(smoothed.current, target, Math.min(1, delta * 3));
    u.uProgress.value = smoothed.current;
    u.uTime.value += delta;
  });

  // Park the plane far behind the camera path and make it big enough to fill the
  // view at every depth. It does not move with the camera intentionally; the
  // camera descends past a fixed tall gradient.
  return (
    <mesh position={[0, -30, -40]} renderOrder={-10}>
      <planeGeometry args={[viewport.width * 6 + 120, 240, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}
