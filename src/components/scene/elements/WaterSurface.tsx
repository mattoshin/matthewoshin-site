"use client";

/**
 * WaterSurface - the underside of the sea, seen from just below the surface.
 *
 * A large plane displaced by 4 summed Gerstner waves in a GLSL vertex shader,
 * animated through a `uTime` uniform mutated each frame via matRef.current.
 * The water is translucent blue-green; crests catch a bright sun glint and a
 * hint of foam, so the ceiling reads as a living, light-shot membrane above the
 * camera at the surface.
 *
 * Zone-gating: full presence at progress 0, fades opacity to 0 by ~0.28 (just
 * past the About zone). Below that the group is made invisible and the heavy
 * part of useFrame early-returns, so it costs ~nothing for the rest of the dive.
 *
 * Contract: self-contained SceneElement. Reads the shared `progress` accessor
 * imperatively each frame; mutates ONLY its own refs + the live shader material
 * it owns (never a hook return or a memoized object's fields), to satisfy the
 * React-Compiler immutability lint.
 *
 * Target zones: surface, about.
 */

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// Palette (canvas hex -> linear-ish rgb01 for shader use).
const WATER = hexToRgb01("#5FC2D6"); // surface water, translucent blue-green
const SKY = hexToRgb01("#BFE9F0"); // pale sky seen through thin water
const SUN = hexToRgb01("#FFE9A8"); // warm sun glint on the crests
const FOAM = hexToRgb01("#FFFFFF"); // foam hint at the very tops

// Progress at which the surface has fully dissolved (after the About zone).
const FADE_END = 0.28;
// A hair of slack so the group keeps rendering until just past full fade.
const VISIBLE_UNTIL = 0.32;

const v3 = (rgb: readonly [number, number, number]) =>
  new THREE.Vector3(rgb[0], rgb[1], rgb[2]);

const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;

  // Each wave: xy = direction (normalized), z = wavelength, w = steepness(0..1).
  uniform vec4 uWaveA;
  uniform vec4 uWaveB;
  uniform vec4 uWaveC;
  uniform vec4 uWaveD;
  uniform float uAmp; // global amplitude scale

  varying vec3 vWorldNormal;
  varying vec3 vViewDir;
  varying float vCrest;   // 0..1 how high this point rode (for foam/sun)
  varying vec2 vUv;

  // Returns the xyz displacement for one Gerstner wave and accumulates the
  // partial derivatives (tangent/binormal contributions) into T and B.
  vec3 gerstner(vec4 wave, vec3 p, inout vec3 tangent, inout vec3 binormal) {
    vec2 dir = normalize(wave.xy);
    float wavelength = wave.z;
    float steepness = wave.w;

    float k = 6.28318530718 / wavelength;   // 2*PI / wavelength
    float c = sqrt(9.8 / k);                // phase speed (gravity waves)
    float f = k * (dot(dir, p.xz) - c * uTime);
    float a = steepness / k;                // amplitude from steepness

    float cosf = cos(f);
    float sinf = sin(f);

    // Tangent (d/dx) and binormal (d/dz) accumulation for a correct normal.
    tangent += vec3(
      -dir.x * dir.x * (steepness * sinf),
      dir.x * (steepness * cosf),
      -dir.x * dir.y * (steepness * sinf)
    );
    binormal += vec3(
      -dir.x * dir.y * (steepness * sinf),
      dir.y * (steepness * cosf),
      -dir.y * dir.y * (steepness * sinf)
    );

    return vec3(
      dir.x * (a * cosf),
      a * sinf,
      dir.y * (a * cosf)
    );
  }

  void main() {
    vUv = uv;

    vec3 pos = position;
    vec3 tangent = vec3(1.0, 0.0, 0.0);
    vec3 binormal = vec3(0.0, 0.0, 1.0);
    vec3 disp = vec3(0.0);

    disp += gerstner(uWaveA, pos, tangent, binormal);
    disp += gerstner(uWaveB, pos, tangent, binormal);
    disp += gerstner(uWaveC, pos, tangent, binormal);
    disp += gerstner(uWaveD, pos, tangent, binormal);

    pos += disp * uAmp;

    // Height above the rest plane, normalized to a soft 0..1 crest factor.
    vCrest = clamp(disp.y * uAmp * 0.9 + 0.5, 0.0, 1.0);

    vec3 normal = normalize(cross(binormal, tangent));

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uWater;
  uniform vec3 uSky;
  uniform vec3 uSun;
  uniform vec3 uFoam;
  uniform float uOpacity;
  uniform float uTime;

  varying vec3 vWorldNormal;
  varying vec3 vViewDir;
  varying float vCrest;
  varying vec2 vUv;

  void main() {
    // We view the underside, so flip toward whichever face points at us.
    vec3 n = normalize(vWorldNormal);
    vec3 viewDir = normalize(vViewDir);
    if (dot(n, viewDir) < 0.0) n = -n;

    float facing = clamp(dot(n, viewDir), 0.0, 1.0);

    // Fresnel-ish rim: glancing angles let more pale sky-light through.
    float fresnel = pow(1.0 - facing, 3.0);

    // Base translucent blue-green, brightened toward the sky color where the
    // membrane is thin (steeper viewing / crests).
    vec3 col = mix(uWater, uSky, fresnel * 0.65);

    // A broad sun disc smeared across the crests via a moving band, so glints
    // travel with the swell instead of sitting in fixed pixels.
    float band = sin(vUv.x * 7.0 + uTime * 0.6) * sin(vUv.y * 5.0 - uTime * 0.4);
    float glint = smoothstep(0.55, 1.0, vCrest) * (0.5 + 0.5 * band);
    glint = pow(glint, 2.0);
    col += uSun * glint * 0.9;

    // A specular hotspot when the view aligns with the steep face: tight, bright.
    float spec = pow(facing, 14.0) * smoothstep(0.4, 1.0, vCrest);
    col += uSun * spec * 0.6;

    // Foam hints right at the very tops of the crests.
    float foam = smoothstep(0.82, 1.0, vCrest);
    col = mix(col, uFoam, foam * 0.5);

    // Alpha: mostly translucent, more opaque on crests + glancing rim so the
    // ceiling has body where it catches light, near-glass in the troughs.
    float alpha = 0.30 + fresnel * 0.45 + vCrest * 0.25 + glint * 0.35;
    alpha = clamp(alpha, 0.0, 1.0) * uOpacity;

    gl_FragColor = vec4(col, alpha);
  }
`;

export default function WaterSurface({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // Smoothed opacity so fast scroll jumps fade the ceiling, not snap it.
  const smoothedOpacity = useRef(1);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      // Four Gerstner waves: cross-running directions, varied wavelength/steepness
      // for a natural, non-repeating swell. (dirX, dirY, wavelength, steepness)
      uWaveA: { value: new THREE.Vector4(1.0, 0.35, 9.0, 0.32) },
      uWaveB: { value: new THREE.Vector4(-0.7, 0.9, 6.0, 0.26) },
      uWaveC: { value: new THREE.Vector4(0.4, -1.0, 3.6, 0.2) },
      uWaveD: { value: new THREE.Vector4(-1.0, -0.25, 2.2, 0.14) },
      uAmp: { value: 1.0 },
      uWater: { value: v3(WATER) },
      uSky: { value: v3(SKY) },
      uSun: { value: v3(SUN) },
      uFoam: { value: v3(FOAM) },
      uOpacity: { value: 1 },
    }),
    [],
  );

  // Plane sized to overfill the upper view at the surface. Generous segment count
  // for smooth Gerstner displacement; single static mesh = one draw call.
  const size = useMemo(() => {
    const w = Math.max(60, viewport.width * 8 + 80);
    const d = Math.max(60, viewport.height * 8 + 80);
    return { w, d };
  }, [viewport.width, viewport.height]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const mat = matRef.current;
    if (!group || !mat) return;

    const p = progress.get();

    // Zone-gate: once we're well past the fade, hide entirely + early-return so
    // the (cheap but pointless) shader work and group transform stop.
    if (p > VISIBLE_UNTIL) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    // Target opacity: full at surface, easing to 0 by FADE_END.
    const targetOpacity = 1 - clamp01(p / FADE_END);
    const k = Math.min(1, delta * 3);
    smoothedOpacity.current = lerp(smoothedOpacity.current, targetOpacity, k);

    const u = mat.uniforms;
    u.uOpacity.value = smoothedOpacity.current;
    u.uTime.value += delta;

    // Drift the whole membrane gently upward as we descend so it recedes toward
    // the real surface, reinforcing the "leaving the light behind" read.
    group.position.y = lerp(9, 13, clamp01(p / FADE_END));
  });

  return (
    // Parked above the camera path, tilted so its underside faces the descending
    // camera. The camera looks down -z, so a slight forward lean fills the top of
    // the frame with shimmering ceiling.
    <group ref={groupRef} position={[0, 9, -6]} rotation={[-Math.PI / 2 + 0.42, 0, 0]}>
      <mesh renderOrder={-5}>
        <planeGeometry args={[size.w, size.d, 96, 96]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>
    </group>
  );
}
