"use client";

/**
 * Surface - the clean, defined sea-and-sky backdrop you see at the very top,
 * before the dive. A flat, camera-locked plane painted by a shader as three
 * clear bands: a bright tropical SKY up top, a CRISP WATERLINE (a thin bright
 * horizon strip + a warm sun haze), and TURQUOISE WATER below it with a moving
 * sun-glitter column and gentle ripple banding. Moana-bright, illustrated, with
 * a definite horizon rather than a mushy gradient.
 *
 * Camera-locked (the group copies the camera position each frame) so the horizon
 * holds a fixed screen height while the camera sinks - the surface boats use the
 * same trick, so the whole surface reads as one coherent plane. It fades out by
 * ~progress 0.22 to reveal the dark dive column beneath, then hides + early-
 * returns so it costs nothing in the deep.
 *
 * Original art. Tunable horizon (uHorizon) + sun position (uSunX).
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

// Horizon height in plane-uv (1 = top, 0 = bottom). ~0.74 puts the waterline in
// the upper third of the view, on the flanks beside the hero card.
const HORIZON = 0.74;
// Sun horizontal position in uv. 0.85 seats it in the RIGHT FLANK (visible
// beside the hero card, above the speedboat).
const SUN_X = 0.85;

const C = (hex: string) => {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uHorizon;
  uniform float uSunX;
  uniform float uAspect;
  uniform vec3 uSkyTop;
  uniform vec3 uSkyHaze;
  uniform vec3 uLine;
  uniform vec3 uSun;
  uniform vec3 uW0;
  uniform vec3 uW1;
  uniform vec3 uW2;
  uniform vec3 uW3;
  uniform vec3 uW4;
  varying vec2 vUv;

  float wave(float baseY, float x, float amp, float freq, float phase, float speed) {
    return baseY
      + amp * sin(x * freq + phase + uTime * speed)
      + amp * 0.4 * sin(x * freq * 2.3 + phase * 1.7 - uTime * speed * 0.6);
  }

  // Aspect-corrected distance so circles/ellipses look round on non-square UVs.
  float aDist(vec2 p, vec2 c) {
    return length(vec2((p.x - c.x) * uAspect, p.y - c.y));
  }

  // Soft filled disk: 1 inside, 0 outside.
  float disk(vec2 p, vec2 c, float r) {
    return 1.0 - smoothstep(r * 0.75, r, aDist(p, c));
  }

  // Distance to a flying-V bird centered at (bx,by): two line segments going
  // upward and outward from the center point. hw = half wingspan, rise = height.
  float birdDist(vec2 p, float bx, float by, float hw, float rise) {
    vec2 d = vec2((p.x - bx) * uAspect, p.y - by);
    float wLen = length(vec2(hw * uAspect, rise));
    vec2 lv = vec2(-hw * uAspect, rise) / wLen;
    float lt = clamp(dot(d, lv), 0.0, wLen);
    float ld = length(d - lv * lt);
    vec2 rv = vec2( hw * uAspect, rise) / wLen;
    float rt = clamp(dot(d, rv), 0.0, wLen);
    float rd = length(d - rv * rt);
    return min(ld, rd);
  }

  void main() {
    float x = vUv.x;
    float y = vUv.y;
    vec2 uv = vec2(x, y);
    float hor = uHorizon;

    // --- SKY ---
    float skyT = clamp((y - hor) / (1.0 - hor), 0.0, 1.0);
    vec3 sky = mix(uSkyHaze, uSkyTop, smoothstep(0.0, 0.8, skyT));

    // Soft sun halo resting on the horizon.
    float haloD = aDist(uv, vec2(uSunX, hor + 0.02));
    sky += uSun * pow(smoothstep(0.42, 0.0, haloD), 1.7) * 0.6;

    // Sun disk (crisp circle above the haze).
    vec2 sunC = vec2(uSunX, hor + 0.058);
    float sunDisk = disk(uv, sunC, 0.036) * step(hor, y);
    sky = mix(sky, vec3(1.0, 0.97, 0.82), sunDisk);

    // Clouds: papercut blobs on the FLANKS (where sky is visible beside the card)
    // and one small one high in the center (above the card top edge ~UV y 0.88).
    float cd = uTime * 0.004;
    // LEFT FLANK cloud (x~0.08, visible at screen x < ~260px)
    float c1x = 0.08 - cd * 0.3;
    float c1y = hor + 0.095;
    float cl1 = clamp(
      disk(uv, vec2(c1x,                    c1y        ), 0.052) +
      disk(uv, vec2(c1x + 0.028 / uAspect,  c1y + 0.016), 0.042) +
      disk(uv, vec2(c1x + 0.052 / uAspect,  c1y - 0.004), 0.038),
      0.0, 1.0);
    // RIGHT FLANK cloud (x~0.88, visible at screen x > ~1170px, near the sun)
    float c2x = 0.90 - cd * 0.2;
    float c2y = hor + 0.118;
    float cl2 = clamp(
      disk(uv, vec2(c2x,                    c2y        ), 0.046) +
      disk(uv, vec2(c2x - 0.030 / uAspect,  c2y + 0.015), 0.037) +
      disk(uv, vec2(c2x - 0.055 / uAspect,  c2y - 0.002), 0.033),
      0.0, 1.0);
    // CENTER HIGH cloud (x~0.50, y high enough to peek above the card top)
    float c3x = 0.48 - cd * 0.15;
    float c3y = hor + 0.178;
    float cl3 = clamp(
      disk(uv, vec2(c3x,                    c3y        ), 0.032) +
      disk(uv, vec2(c3x + 0.022 / uAspect,  c3y + 0.012), 0.026),
      0.0, 1.0);
    float allClouds = clamp(cl1 + cl2 + cl3, 0.0, 1.0) * step(hor + 0.006, y);
    sky = mix(sky, vec3(1.0, 0.985, 0.96), allClouds * 0.88);

    // Birds: V-silhouettes on the LEFT FLANK (3) and RIGHT FLANK (2) where
    // sky is visible beside the hero card.
    float bThick = 0.0042;
    float birds = 0.0;
    // Left flank flock
    birds = max(birds, 1.0 - smoothstep(bThick * 0.3, bThick, birdDist(uv, 0.065, hor + 0.076, 0.020, 0.013)));
    birds = max(birds, 1.0 - smoothstep(bThick * 0.3, bThick, birdDist(uv, 0.105, hor + 0.098, 0.016, 0.010)));
    birds = max(birds, 1.0 - smoothstep(bThick * 0.3, bThick, birdDist(uv, 0.145, hor + 0.082, 0.018, 0.012)));
    // Right flank pair (near the sun and speedboat)
    birds = max(birds, 1.0 - smoothstep(bThick * 0.3, bThick, birdDist(uv, 0.835, hor + 0.072, 0.015, 0.010)));
    birds = max(birds, 1.0 - smoothstep(bThick * 0.3, bThick, birdDist(uv, 0.875, hor + 0.092, 0.013, 0.009)));
    birds *= step(hor + 0.004, y);
    sky = mix(sky, vec3(0.06, 0.10, 0.20), birds);

    // --- WATER ---
    float b1 = wave(hor - 0.05, x, 0.012, 22.0, 0.0,  0.5);
    float b2 = wave(hor - 0.13, x, 0.018, 16.0, 1.7, -0.42);
    float b3 = wave(hor - 0.25, x, 0.026, 12.0, 3.1,  0.36);
    float b4 = wave(hor - 0.42, x, 0.034,  9.0, 4.6, -0.30);

    vec3 water = uW4;
    if (y > b4) water = uW3;
    if (y > b3) water = uW2;
    if (y > b2) water = uW1;
    if (y > b1) water = uW0;

    vec3 wFoam = mix(uW0, vec3(1.0), 0.65);
    float rim = smoothstep(0.006, 0.0, abs(y - b1))
              + smoothstep(0.008, 0.0, abs(y - b2))
              + smoothstep(0.010, 0.0, abs(y - b3));
    water = mix(water, wFoam, clamp(rim, 0.0, 1.0) * 0.35);

    float colm = smoothstep(0.12, 0.0, abs(x - uSunX));
    float sparkle = 0.5 + 0.5 * sin((hor - y) * 70.0 - uTime * 3.0);
    water += uSun * colm * smoothstep(0.35, 0.0, (hor - y)) * sparkle * 0.18;

    vec3 col = y > hor ? sky : water;

    // Crisp waterline strip.
    float lineEdge = smoothstep(0.009, 0.0, abs(y - hor));
    col = mix(col, uLine, lineEdge * 0.85);

    gl_FragColor = vec4(col, uOpacity);
  }
`;

export default function Surface({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const smoothedOpacity = useRef(1);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uHorizon: { value: HORIZON },
      uSunX: { value: SUN_X },
      uAspect: { value: 1.6 }, // updated each frame from state.size
      uSkyTop: { value: C("#1f9fe0") },
      uSkyHaze: { value: C("#f4f7df") },
      uLine: { value: C("#ffffff") },
      uSun: { value: C("#ffe6a0") },
      uW0: { value: C("#c4f1ea") },
      uW1: { value: C("#6fdadf") },
      uW2: { value: C("#36c0d6") },
      uW3: { value: C("#179fc1") },
      uW4: { value: C("#0b7aa2") },
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
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uAspect.value = state.size.width / state.size.height;

    // Camera-lock: keep the backdrop centered on the camera so the horizon holds
    // a fixed screen height as the camera sinks.
    group.position.copy(state.camera.position);
  });

  return (
    <group ref={groupRef}>
      {/* Parked far in front of the camera (behind every surface element) and
          sized to overfill the view; renderOrder -9 sits just in front of the
          WaterColumn (-10) so this bright surface IS the backdrop, then it fades
          to reveal the dark column on the dive. */}
      <mesh position={[0, 0, -80]} renderOrder={-9}>
        <planeGeometry args={[150, 92]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          depthWrite={false}
          transparent
          fog={false}
        />
      </mesh>
    </group>
  );
}
