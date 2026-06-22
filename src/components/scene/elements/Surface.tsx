"use client";

/**
 * Surface - the clean, defined sea-and-sky backdrop you see at the very top,
 * before the dive. A flat, camera-locked plane painted by a shader as three
 * clear bands: a bright tropical SKY up top, a CRISP WATERLINE (a thin bright
 * horizon strip + a warm sun haze), and TURQUOISE WATER below it with a moving
 * sun-glitter column and gentle ripple banding. Moana-bright, illustrated, with
 * a definite horizon rather than a mushy gradient.
 *
 * As you scroll DOWN the camera descends and the whole surface DRIFTS UP out of
 * frame (kinetic, NOT a fade): it follows the camera in x/z but rises above it by
 * `p * SURFACE_DRIFT`, sliding the sky + sun + sea up to reveal the deep water
 * column beneath. Past VISIBLE_UNTIL it hides + early-returns so it costs nothing
 * in the deep. The surface boats + water-skier use the same drift so the whole
 * surface reads as one coherent plane lifting away.
 *
 * Original art. Tunable horizon (uHorizon) + sun position (uSunX).
 *
 * Target zone: surface.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneElementProps } from "../types";

// Eased drift coefficient: the surface rises by p*p*SURFACE_DRIFT relative to
// the camera, so it HOLDS behind the hero (p^2 is tiny at small p), then
// accelerates up and out of frame by the first section (kinetic, not a fade).
const SURFACE_DRIFT = 1900;
const VISIBLE_UNTIL = 0.26;

// Horizon height in plane-uv (1 = top, 0 = bottom). ~0.74 puts the waterline in
// the upper third of the view, on the flanks beside the hero card.
const HORIZON = 0.77;
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

  void main() {
    float x = vUv.x;
    float y = vUv.y;
    vec2 uv = vec2(x, y);
    float hor = uHorizon;

    // --- SKY (golden hour — natural warm-to-blue sweep) ---
    float skyT = clamp((y - hor) / (1.0 - hor), 0.0, 1.0);
    // Natural two-stop: warm golden haze at horizon → soft powder blue mid → clear ocean blue zenith.
    vec3 powder = vec3(0.62, 0.74, 0.86); // soft powder blue transition
    vec3 sky = mix(uSkyHaze, powder,  smoothstep(0.0,  0.48, skyT));
    sky       = mix(sky,     uSkyTop, smoothstep(0.35, 0.92, skyT));

    // Sun — bold golden-hour sun with wide halo, bright inner core, and corona ring.
    vec2 sunC = vec2(uSunX, hor + 0.058);
    float haloD = aDist(uv, sunC);
    // Wide warm halo: golden bloom spreads across the right third of the sky.
    sky += uSun * pow(smoothstep(0.58, 0.0, haloD), 1.6) * 0.80;
    // Inner bright core: hot white-gold tight around the disk.
    sky += vec3(1.0, 0.90, 0.60) * pow(smoothstep(0.22, 0.0, haloD), 2.5) * 0.65;
    // Corona ring just outside the disk edge.
    sky += uSun * smoothstep(0.022, 0.0, abs(haloD - 0.080)) * 0.55;
    // Sun disk (large, crisp warm-white).
    float sunDisk = disk(uv, sunC, 0.064) * step(hor, y);
    sky = mix(sky, vec3(1.0, 0.97, 0.88), sunDisk);

    // Clouds: five papercut blobs — two on each flank (visible beside the hero
    // card) and one high in the center (peeks above the card top edge).
    // All drift very slowly left so the scene feels alive without being distracting.
    float cd = uTime * 0.004;
    // Cloud 1 — LEFT FLANK, lower (above the sailboat)
    float c1x = 0.08 - cd * 0.3;
    float c1y = hor + 0.095;
    float cl1 = clamp(
      disk(uv, vec2(c1x,                    c1y        ), 0.052) +
      disk(uv, vec2(c1x + 0.028 / uAspect,  c1y + 0.016), 0.042) +
      disk(uv, vec2(c1x + 0.052 / uAspect,  c1y - 0.004), 0.038),
      0.0, 1.0);
    // Cloud 2 — LEFT FLANK, higher (card-top level, adds depth)
    float c2x = 0.13 - cd * 0.22;
    float c2y = hor + 0.155;
    float cl2 = clamp(
      disk(uv, vec2(c2x,                    c2y        ), 0.034) +
      disk(uv, vec2(c2x + 0.022 / uAspect,  c2y + 0.011), 0.027),
      0.0, 1.0);
    // Cloud 3 — CENTER HIGH (above the card top, visible even in center strip)
    float c3x = 0.48 - cd * 0.12;
    float c3y = hor + 0.182;
    float cl3 = clamp(
      disk(uv, vec2(c3x,                    c3y        ), 0.038) +
      disk(uv, vec2(c3x + 0.025 / uAspect,  c3y + 0.013), 0.030) +
      disk(uv, vec2(c3x - 0.018 / uAspect,  c3y + 0.008), 0.024),
      0.0, 1.0);
    // Right flank clouds removed — keep sun clear and unobstructed.
    float allClouds = clamp(cl1 + cl2 + cl3, 0.0, 1.0) * step(hor + 0.006, y);
    // Golden-hour clouds: soft cream with just a hint of peach/lavender.
    vec3 cloudCol = vec3(0.97, 0.92, 0.90) + uSkyTop * 0.08;
    sky = mix(sky, cloudCol, allClouds * 0.88);

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

    // Bottom alpha fade: the deepest surface water dissolves to transparent so
    // the bright surface blends into the dark WaterColumn behind it instead of
    // revealing a hard edge as the plane drifts up. Turns the "clear drop-off"
    // into a smooth surface->underwater gradient.
    float depthFade = smoothstep(0.0, 0.34, y);
    gl_FragColor = vec4(col, uOpacity * depthFade);
  }
`;

export default function Surface({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uHorizon: { value: HORIZON },
      uSunX: { value: SUN_X },
      uAspect: { value: 1.6 }, // updated each frame from state.size
      // Natural golden-hour palette: warm gold horizon → clear ocean blue zenith.
      uSkyTop:  { value: C("#4880b0") }, // clear medium blue at zenith (not purple)
      uSkyHaze: { value: C("#c8b468") }, // warm muted gold at horizon (not saturated orange)
      uLine:    { value: C("#f0dea0") }, // warm cream waterline
      uSun:     { value: C("#f5c060") }, // golden sun
      // Ocean water — darker, desaturated vs. the old pool-blue, warm golden-hour cast.
      uW0: { value: C("#72b4b0") }, // horizon water: muted sea-green catches sky warmth
      uW1: { value: C("#3890a8") }, // mid surface: real ocean teal-blue
      uW2: { value: C("#1e6e98") }, // below surface: deeper blue
      uW3: { value: C("#145680") }, // dark blue
      uW4: { value: C("#0b3e68") }, // darkest band, approaches abyss
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

    // Widen the plane HORIZONTALLY to reach both edges on wide monitors (the
    // original fixed 150-wide plane left a flat StaticOcean band on the sides).
    // CRITICAL: scale X only. The painted horizon sits off-center (uv 0.74), so
    // any Y-scale moves the horizon in world space and desyncs every element that
    // pegs to the waterline via HORIZON_K (dolphin, boats). Keep Y at 1 so the
    // 92-tall plane (which already over-covers vertically) holds the horizon
    // exactly where those elements expect it.
    const mesh = meshRef.current;
    if (mesh) {
      const cam = state.camera as THREE.PerspectiveCamera;
      const dist = 80; // camera z (8) to the plane's world z (-72)
      const hVis = 2 * dist * Math.tan(((cam.fov || 55) * Math.PI) / 360);
      const wVis = hVis * (state.size.width / state.size.height);
      mesh.scale.set(Math.max(1, (wVis * 1.06) / 150), 1, 1);
    }

    // Full opacity always; the surface DRIFTS up rather than dissolving.
    mat.uniforms.uOpacity.value = 1;
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uAspect.value = state.size.width / state.size.height;

    // Follow the camera in x/z, but rise ABOVE it with progress so the sky + sun
    // + sea slide up out of frame and reveal the deep water beneath.
    group.position.x = state.camera.position.x;
    group.position.z = state.camera.position.z;
    group.position.y = state.camera.position.y + p * p * SURFACE_DRIFT;
  });

  return (
    <group ref={groupRef}>
      {/* Parked far in front of the camera (behind every surface element) and
          sized to overfill the view; renderOrder -9 sits just in front of the
          WaterColumn (-10) so this bright surface IS the backdrop, then it fades
          to reveal the dark column on the dive. */}
      <mesh ref={meshRef} position={[0, 0, -80]} renderOrder={-9}>
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
