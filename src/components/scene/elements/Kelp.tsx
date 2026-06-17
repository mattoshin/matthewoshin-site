"use client";

/**
 * Kelp - a bed of swaying kelp on the seabed.
 *
 * A single InstancedMesh of ~64 tall ribbon strands. Each strand is a thin
 * vertical strip (a subdivided plane) whose vertices are pushed sideways by a
 * vertex-shader sway weighted by height: the root is anchored and the tip sways
 * most, so the bed undulates like a real kelp forest in a slow current. A single
 * uTime uniform (mutated each frame) drives all of it - one instanced draw call.
 *
 * Colour: dark green-teal body deepening toward black at the root, with faintly
 * glowing bio-cyan tips that brighten with descent.
 *
 * Depth gating: the seabed lives at the bottom of the descent. Strands fade in
 * across the "writing" zone (soft start), reach full presence at "skills" and
 * "contact". When the camera is far above (shallower than writing), the whole
 * group goes .visible = false and the heavy per-frame work early-returns so the
 * element costs ~nothing off-zone.
 *
 * Self-contained: procedural geometry + shaders only, no external assets.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// ---------------------------------------------------------------------------
// Tuning constants
// ---------------------------------------------------------------------------

const STRAND_COUNT = 64; // single instanced draw call
const SEGMENTS = 14; // vertical subdivisions per ribbon (smooth bend)
const BED_RADIUS = 26; // horizontal spread of the bed (world units)
const FLOOR_Y = -67; // where the roots sit (camera bottoms out near y=-60)

// Palette (linear-ish 0..1 from the descent palette).
const ROOT_COLOR = hexToRgb01("#041014"); // near-black teal at the base
const BODY_COLOR = hexToRgb01("#0A3A3A"); // dark green-teal mid
const MID_COLOR = hexToRgb01("#127C72"); // brighter teal up the blade
const TIP_COLOR = hexToRgb01("#3FE0E6"); // bio-cyan glowing tip

// Progress band where kelp is relevant. Writing starts at 0.66; we begin a soft
// fade just inside it and reach full by the start of skills (0.8).
const FADE_IN_START = 0.6; // fully hidden below this -> cheap early-return
const FADE_IN_FULL = 0.8; // full presence from skills onward

const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPresence; // 0 hidden .. 1 full (drives scale + glow)

  attribute float aPhase;   // per-instance phase offset for desync
  attribute float aHeight;  // per-instance strand height (world units)
  attribute float aStiff;   // per-instance stiffness (0 floppy .. 1 stiff)
  attribute float aFacing;  // per-instance ribbon facing (radians)

  varying float vUp;        // 0 root .. 1 tip along the blade
  varying float vEdge;      // 0..1 across the ribbon width (for soft edges)

  void main() {
    // Local geometry: a unit plane, uv.y 0 (root) -> 1 (tip), x in [-0.5, 0.5].
    vUp = uv.y;
    vEdge = uv.x + 0.5;

    // Per-instance height: scale the blade up its length, shrink on fade-in so
    // the bed "grows" out of the seabed as you descend.
    float grow = mix(0.12, 1.0, uPresence);
    float up = uv.y * aHeight * grow;

    // Width tapers toward the tip so blades read as ribbons, not rectangles.
    float widthTaper = mix(1.0, 0.18, uv.y * uv.y);
    float across = position.x * widthTaper;

    // Sway: weighted by height (root anchored, tip sways most). Two octaves of
    // sine give a lazy primary bend plus a finer ripple traveling up the blade.
    float h = uv.y;
    float weight = h * h * mix(1.4, 0.55, aStiff); // quadratic -> rooted base
    float t = uTime;
    float primary = sin(t * 0.6 + aPhase + h * 1.6);
    float ripple  = sin(t * 1.7 + aPhase * 1.7 + h * 5.0) * 0.28;
    float bend = (primary + ripple) * weight;

    // Sway direction is the ribbon's facing, so blades bow in varied directions.
    vec2 dir = vec2(cos(aFacing), sin(aFacing));
    float swayAmp = aHeight * 0.16;
    vec2 swayXZ = dir * bend * swayAmp;

    // Compose the local position: lift along Y, offset width along the ribbon's
    // in-plane right vector, then add sway in XZ.
    vec2 rightXZ = vec2(-dir.y, dir.x); // perpendicular to facing, in-plane width
    vec3 local = vec3(
      rightXZ.x * across + swayXZ.x,
      up,
      rightXZ.y * across + swayXZ.y
    );

    // instanceMatrix places + rotates each strand around the bed.
    vec4 world = instanceMatrix * vec4(local, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uRoot;
  uniform vec3 uBody;
  uniform vec3 uMid;
  uniform vec3 uTip;
  uniform float uPresence;
  uniform float uGlow;   // extra tip glow that grows with depth

  varying float vUp;
  varying float vEdge;

  void main() {
    // Vertical colour ramp: root -> body -> mid -> bio tip.
    vec3 col = mix(uRoot, uBody, smoothstep(0.0, 0.28, vUp));
    col = mix(col, uMid, smoothstep(0.22, 0.72, vUp));
    col = mix(col, uTip, smoothstep(0.62, 1.0, vUp));

    // Glowing tip: concentrated in the top quarter, brighter with depth.
    float tipMask = smoothstep(0.7, 1.0, vUp);
    col += uTip * tipMask * (0.35 + uGlow * 0.9);

    // A faint central vein keeps the ribbon from looking flat.
    float vein = 1.0 - smoothstep(0.0, 0.42, abs(vEdge - 0.5));
    col += uMid * vein * 0.06;

    // Soft ribbon edges: fade alpha at the long edges and toward the very tip so
    // strands feather into the dark water instead of ending in hard lines.
    float edgeFade = smoothstep(0.0, 0.16, vEdge) * smoothstep(1.0, 0.84, vEdge);
    float tipFade = 1.0 - smoothstep(0.92, 1.0, vUp) * 0.5;
    float alpha = edgeFade * tipFade * uPresence;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function Kelp({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // --- Geometry: one ribbon, instanced. Built once. -----------------------
  const geometry = useMemo(() => {
    // Unit plane standing up: width 1 (x in [-0.5,0.5]), height 1 (y 0..1),
    // subdivided vertically for a smooth bend. uv.y maps root(0)->tip(1).
    const geo = new THREE.PlaneGeometry(0.7, 1, 1, SEGMENTS);
    // PlaneGeometry is centered on origin with y in [-0.5, 0.5]; shift so the
    // root sits at y=0 and the blade grows upward (matches the shader's uv math).
    geo.translate(0, 0.5, 0);
    return geo;
  }, []);

  // --- Per-instance attributes + transforms. Built once. ------------------
  const { instanceMatrix, phases, heights, stiffness, facings } = useMemo(() => {
    const count = STRAND_COUNT;
    const phases = new Float32Array(count);
    const heights = new Float32Array(count);
    const stiffness = new Float32Array(count);
    const facings = new Float32Array(count);

    const dummy = new THREE.Object3D();
    const matrices = new Float32Array(count * 16);

    // Deterministic pseudo-random so the layout is stable across reloads.
    let seed = 1337;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      // Scatter across a disc, denser toward the middle of the bed, biased to
      // sit in front of the camera path (negative z) so the descent passes
      // through the forest rather than past it.
      const ang = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * BED_RADIUS;
      const x = Math.cos(ang) * r;
      const z = Math.sin(ang) * r - 10; // shift the bed toward -z (in front)

      dummy.position.set(x, FLOOR_Y, z);
      // Slight random yaw + a tiny lean keeps the bed from looking gridded.
      dummy.rotation.set(
        (rand() - 0.5) * 0.18,
        rand() * Math.PI * 2,
        (rand() - 0.5) * 0.18,
      );
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      dummy.matrix.toArray(matrices, i * 16);

      phases[i] = rand() * Math.PI * 2;
      heights[i] = 7.5 + rand() * 6.5; // 7.5 .. 14 world units tall
      stiffness[i] = rand(); // varied floppiness
      facings[i] = rand() * Math.PI * 2; // sway direction
    }

    return {
      instanceMatrix: matrices,
      phases,
      heights,
      stiffness,
      facings,
    };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPresence: { value: 0 },
      uGlow: { value: 0 },
      uRoot: { value: new THREE.Color(ROOT_COLOR[0], ROOT_COLOR[1], ROOT_COLOR[2]) },
      uBody: { value: new THREE.Color(BODY_COLOR[0], BODY_COLOR[1], BODY_COLOR[2]) },
      uMid: { value: new THREE.Color(MID_COLOR[0], MID_COLOR[1], MID_COLOR[2]) },
      uTip: { value: new THREE.Color(TIP_COLOR[0], TIP_COLOR[1], TIP_COLOR[2]) },
    }),
    [],
  );

  // The InstancedMesh's instance matrix buffer, set once via the ref.
  const instRef = useRef<THREE.InstancedMesh>(null);
  const initialized = useRef(false);

  // Smoothed presence so scroll jumps fade rather than pop.
  const presence = useRef(0);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = progress.get();

    // Presence target: 0 below the fade-in, ramping to 1 by full depth.
    const target = clamp01((p - FADE_IN_START) / (FADE_IN_FULL - FADE_IN_START));

    // ZONE-GATE: if we're well above the kelp band and already faded out, hide
    // the group and skip ALL heavy work so the element is ~free off-zone.
    if (target <= 0 && presence.current < 0.01) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    // One-time instance-matrix upload (after the mesh exists).
    const inst = instRef.current;
    if (inst && !initialized.current) {
      inst.instanceMatrix.array.set(instanceMatrix);
      inst.instanceMatrix.needsUpdate = true;
      initialized.current = true;
    }

    presence.current = lerp(presence.current, target, Math.min(1, delta * 2.5));

    const mat = matRef.current;
    if (mat) {
      const u = mat.uniforms;
      u.uTime.value += delta;
      u.uPresence.value = presence.current;
      // Bio-glow strengthens with raw depth (clamped into the kelp band).
      u.uGlow.value = clamp01((p - 0.66) / 0.34) * presence.current;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <instancedMesh
        ref={instRef}
        args={[geometry, undefined, STRAND_COUNT]}
        frustumCulled={false}
      >
        <instancedBufferAttribute
          attach="geometry-attributes-aPhase"
          args={[phases, 1]}
        />
        <instancedBufferAttribute
          attach="geometry-attributes-aHeight"
          args={[heights, 1]}
        />
        <instancedBufferAttribute
          attach="geometry-attributes-aStiff"
          args={[stiffness, 1]}
        />
        <instancedBufferAttribute
          attach="geometry-attributes-aFacing"
          args={[facings, 1]}
        />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.NormalBlending}
        />
      </instancedMesh>
    </group>
  );
}
