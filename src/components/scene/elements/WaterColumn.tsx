"use client";

/**
 * WaterColumn - THE DEEP descent column. A single tall plane behind everything,
 * painted by a shader as a cinematic vertical gradient: a cold dim "light above"
 * at the surface, deepening to near-ink at the abyss, with ONE cold god-ray cone
 * descending from the surface (off-center for a film feel) plus a couple of faint
 * secondary shafts. The ray fades out as you sink past the surface.
 *
 * This is the backdrop the whole site rides on. It is self-contained, reads the
 * shared `progress` accessor each frame, and is wired in via the registry.
 */

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// Depth-gradient stops (top -> bottom of column). Dark from the first frame.
const TOP_COLOR = hexToRgb01("#2A4D5E"); // cold dim surface light
const MID_COLOR = hexToRgb01("#0B1F2A"); // deep teal-navy
const DEEP_COLOR = hexToRgb01("#03070D"); // near-ink abyss
const LIGHT_COLOR = hexToRgb01("#CDEEF7"); // cold shaft / god-ray tone

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
  uniform vec3 uLight;
  uniform float uTime;
  uniform float uProgress;

  void main() {
    // y goes 0 (bottom) -> 1 (top). Bias up slightly as we sink so the bright
    // band slides off the top of the view.
    float y = clamp(vUv.y - uProgress * 0.12, 0.0, 1.0);

    // Three-stop vertical gradient, eased.
    vec3 col;
    if (y > 0.55) {
      col = mix(uMid, uTop, smoothstep(0.0, 1.0, (y - 0.55) / 0.45));
    } else {
      col = mix(uDeep, uMid, smoothstep(0.0, 1.0, y / 0.55));
    }

    // Single cold god-ray cone from the surface, off-center for a cinematic feel.
    float cx = 0.42;
    float beam = smoothstep(0.32, 0.0, abs(vUv.x - cx));
    float topFall = smoothstep(0.15, 1.0, vUv.y);
    float flicker = 0.85 + 0.15 * sin(uTime * 0.4 + vUv.y * 5.0);
    float ray = beam * topFall * flicker;
    ray *= (1.0 - smoothstep(0.0, 0.5, uProgress)); // fades as we descend
    col += uLight * ray * 0.11;

    // Faint secondary shafts for texture, strongest near the surface.
    float shaft = sin(vUv.x * 8.0 + uTime * 0.1) * 0.5 + 0.5;
    shaft *= smoothstep(0.35, 1.0, vUv.y);
    col += uLight * shaft * 0.018 * (1.0 - uProgress);

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
      uLight: {
        value: new THREE.Color(LIGHT_COLOR[0], LIGHT_COLOR[1], LIGHT_COLOR[2]),
      },
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
