"use client";

/**
 * Sky - the bright tropical sky + horizon you see at the surface, fading out as
 * you dive. An inward-facing dome centered on the camera with a vertical
 * gradient (vivid blue overhead, warm bright horizon, turquoise where sky meets
 * sea) and a soft warm sun glow. Original art, a "bright Pacific day" mood.
 *
 * Backdrop: drawn first (renderOrder -20), no fog, depthWrite off. Opacity is
 * depth-gated like WaterSurface, full at the surface, gone a touch into the dive,
 * then the group hides and useFrame early-returns so it costs nothing in the deep.
 *
 * Target zone: surface.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

const FADE_END = 0.22;
const VISIBLE_UNTIL = 0.26;

const C = (hex: string) => {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
};

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uWater;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  uniform float uOpacity;
  varying vec3 vDir;

  void main() {
    vec3 d = normalize(vDir);
    float h = d.y; // -1 down .. 1 up

    // Sky above the horizon eases warm -> vivid blue; below it drops to turquoise.
    vec3 sky = mix(uHorizon, uTop, smoothstep(0.0, 0.55, h));
    vec3 col = mix(uWater, sky, smoothstep(-0.07, 0.05, h));

    // Soft warm sun: a tight disc plus a broad halo.
    float s = max(dot(d, normalize(uSunDir)), 0.0);
    col += uSun * pow(s, 110.0) * 1.4;
    col += uSun * pow(s, 7.0) * 0.16;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

export default function Sky({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const smoothedOpacity = useRef(1);

  const uniforms = useMemo(
    () => ({
      uTop: { value: C("#17b1e6") }, // vivid tropical sky blue
      uHorizon: { value: C("#e2fbf0") }, // luminous bright aqua-white horizon
      uWater: { value: C("#12bdd6") }, // vivid turquoise where sky meets sea
      uSun: { value: C("#fff0bc") }, // warm sun
      uSunDir: { value: new THREE.Vector3(0.34, 0.4, -1.0) },
      uOpacity: { value: 1 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    const mat = matRef.current;
    if (!group || !mat) return;

    const p = progress.get();
    if (p > VISIBLE_UNTIL) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    const target = 1 - clamp01(p / FADE_END);
    smoothedOpacity.current = lerp(
      smoothedOpacity.current,
      target,
      Math.min(1, delta * 3),
    );
    mat.uniforms.uOpacity.value = smoothedOpacity.current;

    // Keep the dome centered on the camera so it is always the backdrop.
    group.position.copy(state.camera.position);
  });

  return (
    <group ref={groupRef}>
      {/* Just in front of the WaterColumn backdrop (-10) but behind every
          foreground element + the wave ceiling, so at the surface the bright
          sky/sea dome IS the backdrop, then it fades to the dark column. */}
      <mesh renderOrder={-9}>
        <sphereGeometry args={[140, 32, 16]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={THREE.BackSide}
          depthWrite={false}
          transparent
          fog={false}
        />
      </mesh>
    </group>
  );
}
