"use client";

/**
 * CausticsLight - sunlight in the shallows.
 *
 * Two cooperating visuals, both additive-blended and fully procedural:
 *
 *   1. GOD RAYS: a handful of large, soft, vertical light shafts angling down
 *      from the surface. Each is a tall plane with a shader that paints a warm
 *      sun-colored gradient that is brightest at the top (the surface) and feathers
 *      to nothing at the bottom, with soft animated horizontal banding so the
 *      shafts breathe. They are billboarded around the up axis so they always face
 *      the camera while keeping their vertical "shaft" orientation.
 *
 *   2. CAUSTICS DAPPLE: a single wide horizontal plane just under the surface,
 *      shaded with cheap layered Worley/sine noise to make the moving caustic net
 *      of light you see on a shallow sea floor, additively glowing.
 *
 * Both live near the SURFACE band and fade entirely by ~progress 0.42 (into
 * twilight). When far from that band the whole group is .visible = false and the
 * heavy per-frame work early-returns, so it costs ~nothing once you have sunk past
 * the shallows. This element is purely sunlight: it does NOT add bio-glow (that is
 * other elements' job, and would not read at the surface anyway).
 *
 * Self-contained SceneElement. Reads the shared `progress` accessor imperatively
 * each frame; never subscribes. Mutates only its own refs / owned three objects.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// --- palette ---------------------------------------------------------------
const SUN = hexToRgb01("#FFE9A8"); // warm sun core
const SKY = hexToRgb01("#BFE9F0"); // cool surface sky tint
const FOAM = hexToRgb01("#FFFFFF"); // bright highlight

// --- tuning ----------------------------------------------------------------
// Sunlight is strongest at the surface, full through about, gone by twilight.
// progress: 0 surface .. 0.42 fully faded. We square the falloff for a soft tail.
const FADE_END = 0.42;

// Number of god-ray shafts. Kept low: each is one transparent draw call.
const RAY_COUNT = 6;

// Where the shaft curtain lives in world space. The camera starts at y=0 and
// descends to y=-60; the surface band is roughly camera y in [0, -25]. We hang
// the shafts high and let them be very tall so they read as coming "from above".
const RAY_TOP_Y = 18; // top of the shafts (near the surface plane)
const RAY_HEIGHT = 54; // how tall each shaft is
const RAY_Z = -14; // a touch in front of the WaterColumn (z = -40)

// -------------------------------------------------------------------------
// GOD RAY shader: a soft warm shaft, brightest at top, with drifting bands.
// -------------------------------------------------------------------------
const rayVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const rayFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec3  uSun;
  uniform vec3  uSky;
  uniform float uTime;
  uniform float uFade;   // 0 invisible .. 1 full sun
  uniform float uSeed;   // per-shaft phase so they don't pulse in lockstep
  uniform float uWidth;  // horizontal core sharpness

  void main() {
    // vUv.y: 0 bottom (deep) -> 1 top (surface). vUv.x: 0..1 across the shaft.

    // Vertical falloff: bright at the surface, feathering to nothing as it sinks.
    float topGlow = pow(clamp(vUv.y, 0.0, 1.0), 1.35);
    // Also feather the very top edge so it doesn't look like a hard ceiling.
    topGlow *= smoothstep(1.0, 0.86, vUv.y);

    // Horizontal profile: a soft Gaussian-ish core that gently wanders sideways,
    // giving the shaft a living, refracted wobble.
    float wobble = sin(vUv.y * 3.0 + uTime * 0.35 + uSeed) * 0.06
                 + sin(vUv.y * 7.3 - uTime * 0.22 + uSeed * 1.7) * 0.03;
    float dx = (vUv.x - 0.5 + wobble) / uWidth;
    float core = exp(-dx * dx * 4.0);

    // Slow brightness breathing per shaft.
    float breathe = 0.78 + 0.22 * sin(uTime * 0.5 + uSeed * 2.3);

    float intensity = topGlow * core * breathe;

    // Warm sun core blended toward cool sky at the shaft edges/depth.
    vec3 col = mix(uSky, uSun, clamp(core * topGlow + 0.15, 0.0, 1.0));

    float alpha = intensity * uFade;
    // Additive blend: premultiply color by alpha, output alpha 1 is irrelevant
    // but we keep it tidy for correctness with AdditiveBlending.
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

// -------------------------------------------------------------------------
// CAUSTICS shader: layered cheap noise -> a moving net of light. Additive.
// -------------------------------------------------------------------------
const causticVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const causticFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec3  uSun;
  uniform vec3  uFoam;
  uniform float uTime;
  uniform float uFade;

  // Cheap 2D value-noise via hashed gradients. No textures, no loops over many
  // octaves; two scrolling sine-lattices approximate a caustic web well enough.
  float band(vec2 p, float t) {
    float a = sin(p.x * 6.2831 + t) + sin(p.y * 6.2831 - t * 0.8);
    float b = sin((p.x + p.y) * 4.8 + t * 1.3) + sin((p.x - p.y) * 5.6 - t);
    return a + b;
  }

  void main() {
    vec2 uv = vUv;
    // Two layers drifting at different speeds/scales make the web shimmer.
    float t = uTime * 0.18;
    float n1 = band(uv * 2.4, t);
    float n2 = band(uv * 4.1 + vec2(0.35, -0.2), t * 1.7);
    float web = n1 * 0.6 + n2 * 0.4;

    // Sharpen into bright filaments: caustics are thin bright lines, dark between.
    float lines = pow(clamp(web * 0.25 + 0.5, 0.0, 1.0), 6.0);

    // Radial vignette so the dapple fades out at the plane edges (no hard square).
    vec2 c = uv - 0.5;
    float vign = smoothstep(0.72, 0.18, length(c));

    float intensity = lines * vign;

    vec3 col = mix(uSun, uFoam, lines);
    float alpha = intensity * uFade * 0.85;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

export default function CausticsLight({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const causticMatRef = useRef<THREE.ShaderMaterial>(null);
  // Per-shaft material refs so we can animate uTime/uFade on each.
  const rayMatRefs = useRef<(THREE.ShaderMaterial | null)[]>([]);

  // Smoothed fade so a fast scroll past the surface eases out, not snaps.
  const fade = useRef(0);

  // Build per-shaft transforms + uniforms once. Each shaft gets a spread-out x,
  // a small z jitter for depth, a slight tilt so they "angle down" from the
  // surface, and its own seed/width.
  const shafts = useMemo(() => {
    const divisor = Math.max(1, RAY_COUNT - 1);
    return Array.from({ length: RAY_COUNT }, (_, i) => {
      const t = i / divisor; // 0..1
      // Spread horizontally across a wide curtain, centered on x=0.
      const x = lerp(-26, 26, t) + (i % 2 === 0 ? 2.2 : -2.2);
      const z = RAY_Z - (i % 3) * 3.5; // staggered depth
      // Tilt each shaft slightly so the curtain fans, angling down/outward.
      const tilt = lerp(0.16, -0.16, t); // radians around Z
      const width = 0.34 + ((i * 37) % 11) / 40; // 0.34 .. ~0.6 core width
      const seed = i * 1.618; // golden-ish phase offset
      const widthScale = lerp(5.5, 8.5, ((i * 53) % 7) / 6); // plane width
      return {
        position: [x, RAY_TOP_Y - RAY_HEIGHT / 2, z] as [number, number, number],
        rotation: [0, 0, tilt] as [number, number, number],
        width,
        seed,
        widthScale,
      };
    });
  }, []);

  // One shared, reusable geometry for all shafts (tall thin plane, unit-ish).
  const rayGeometry = useMemo(
    () => new THREE.PlaneGeometry(1, RAY_HEIGHT, 1, 1),
    [],
  );

  // Uniforms are created per-shaft so each has independent seed/width and its
  // own animatable uTime/uFade. We hold them in useMemo and mutate via matRef.
  const rayUniforms = useMemo(
    () =>
      shafts.map((s) => ({
        uSun: { value: new THREE.Color(SUN[0], SUN[1], SUN[2]) },
        uSky: { value: new THREE.Color(SKY[0], SKY[1], SKY[2]) },
        uTime: { value: 0 },
        uFade: { value: 0 },
        uSeed: { value: s.seed },
        uWidth: { value: s.width },
      })),
    [shafts],
  );

  const causticUniforms = useMemo(
    () => ({
      uSun: { value: new THREE.Color(SUN[0], SUN[1], SUN[2]) },
      uFoam: { value: new THREE.Color(FOAM[0], FOAM[1], FOAM[2]) },
      uTime: { value: 0 },
      uFade: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = progress.get();

    // Target fade: full sun at the surface, 0 by FADE_END (twilight), soft tail.
    const lin = clamp01(1 - p / FADE_END);
    const target = lin * lin; // ease-out so it lingers in the shallows
    const k = Math.min(1, delta * 2.5);
    fade.current = lerp(fade.current, target, k);

    // Hard gate: once effectively faded, hide + early-return so this element is
    // free below the shallows. Small epsilon keeps it from flickering at the edge.
    if (fade.current < 0.004 && target < 0.004) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    const time = state.clock.elapsedTime;

    // Billboard the whole curtain around Y toward the camera so the shafts always
    // present their broad face, while staying vertical. Subtle, capped rotation.
    const camX = state.camera.position.x;
    const camZ = state.camera.position.z;
    const groupZ = RAY_TOP_Y; // notional curtain center for the yaw calc
    const yaw = Math.atan2(camX - 0, camZ - groupZ) * 0.12; // damped, never full
    group.rotation.y = lerp(group.rotation.y, yaw, k);

    // Drive each shaft material.
    for (let i = 0; i < rayMatRefs.current.length; i++) {
      const m = rayMatRefs.current[i];
      if (!m) continue;
      m.uniforms.uTime.value = time;
      m.uniforms.uFade.value = fade.current;
    }

    // Drive the caustic dapple.
    const cm = causticMatRef.current;
    if (cm) {
      cm.uniforms.uTime.value = time;
      // Dapple fades a touch faster than the shafts and is strongest right at top.
      cm.uniforms.uFade.value = fade.current * fade.current;
    }
  });

  return (
    <group ref={groupRef} renderOrder={-5} visible={false}>
      {/* GOD RAYS */}
      {shafts.map((s, i) => (
        <mesh
          key={`ray-${i}`}
          position={s.position}
          rotation={s.rotation}
          scale={[s.widthScale, 1, 1]}
          geometry={rayGeometry}
          renderOrder={-5}
        >
          <shaderMaterial
            ref={(m) => {
              rayMatRefs.current[i] = m;
            }}
            vertexShader={rayVertex}
            fragmentShader={rayFragment}
            uniforms={rayUniforms[i]}
            transparent
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
            fog={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* CAUSTICS DAPPLE: a wide horizontal sheet just beneath the surface,
          lying flat (rotated -90deg about X) so the camera looks up into the
          shimmering net of light as it floats near the top. */}
      <mesh
        position={[0, RAY_TOP_Y - 2, RAY_Z + 4]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={-6}
      >
        <planeGeometry args={[110, 90, 1, 1]} />
        <shaderMaterial
          ref={causticMatRef}
          vertexShader={causticVertex}
          fragmentShader={causticFragment}
          uniforms={causticUniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          fog={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
