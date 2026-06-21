"use client";

/**
 * Octopus - one characterful orange octopus resting on a coral mound near the
 * seabed. It belongs to the SKILLS + CONTACT band (the seabed, progress
 * 0.8..1.0) and fades in softly from the bottom of WRITING so it emerges out of
 * the dark rather than popping in.
 *
 * Build (procedural only, a handful of draw calls):
 *   - HEAD/MANTLE: a single low-poly bulb. A sphere-ish lathe-free dome built
 *     from stacked rings, squashed and pulled into the classic rounded mantle +
 *     a slight brow over the eyes. One BufferGeometry, one draw call.
 *   - EYES: two tiny meshes (sclera dome + dark pupil) instanced-cheap; they give
 *     the "a little curious" character (eyes track a slow look-around target).
 *   - TENTACLES: all EIGHT arms are merged into ONE BufferGeometry (one draw
 *     call). Each arm is a tapered tube swept along a curling rest curve; every
 *     vertex carries an `aArm` index, a `aLen` 0..1 along-arm param, and an
 *     `aAng` around-tube param so the VERTEX SHADER can sway each arm with its
 *     own slow per-tentacle sine (bones-free vertex sway), curling more toward
 *     the tips and drifting like they rest in a gentle current.
 *
 * Colour: warm orange body (#E0653C) with a darker orange (#C24E2E) hint of
 * suckers speckled along the underside of each arm, a soft top-down key light
 * (the shot's god rays), and a faint cool fresnel rim so it separates from the
 * dark water. Brightness lifts with depth/presence so it reads "lit from above".
 *
 * Zone gate: above the fade-in the whole group goes `.visible = false` and the
 * per-frame work early-returns, so the element costs ~nothing off-band.
 *
 * Contract: default-exported SceneElement (see scene/types.ts). Reads `progress`
 * imperatively each frame; never subscribes. Mutates ONLY refs/live objects it
 * owns (its material uniforms, its group transform, its eye meshes) to satisfy
 * the React-Compiler immutability lint. No Math.random() at render (seeded PRNG).
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// ---------------------------------------------------------------------------
// Placement + band tuning
// ---------------------------------------------------------------------------

// Kelp roots sit at y = -67 (its FLOOR_Y); the camera bottoms out near y = -60.
// Rest the octopus on a low coral mound just above that floor and a little in
// front of the descent path so the camera drifts down to meet it.
const FLOOR_Y = -64.5;
const REST_Z = -9; // in front of the camera (camera z ~ 8)
const REST_X = 5.5; // off to one side so it shares the seabed with the kelp bed

// Skills = 0.8..0.92, Contact = 0.92..1.0. Begin a soft emerge inside the bottom
// of writing (Abyss) and reach full presence by the start of skills.
const FADE_IN_START = 0.89; // octopus lives ONLY on the floor (contact); hidden above
const FADE_IN_FULL = 0.96; // full presence at the very bottom

const ARMS = 8;

// Palette (linear-ish 0..1).
const BODY = hexToRgb01("#E0653C"); // warm orange body
const BODY_DEEP = hexToRgb01("#B24A2A"); // shaded underside / core
const SUCKER = hexToRgb01("#C24E2E"); // darker orange sucker hint
const BELLY = hexToRgb01("#F08A5E"); // warm lit highlight up top
const RIM = hexToRgb01("#7FD6E0"); // cool water rim so it pops off the dark

// ---------------------------------------------------------------------------
// Tiny seeded PRNG (mulberry32). React Compiler forbids Math.random() at render;
// a fixed seed also keeps the pose reproducible across reloads.
// ---------------------------------------------------------------------------
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// MANTLE/HEAD geometry: a squashed bulb with a soft brow. Built from stacked
// rings (v: 0 bottom .. 1 top) so we can sculpt the silhouette by hand. One
// BufferGeometry. A `aFres` is not needed; we compute fresnel from normals.
// ---------------------------------------------------------------------------
function buildHeadGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const RINGS = 16;
  const RADIAL = 18;

  // Silhouette: radius(v) and height(v) carve a rounded mantle that is widest a
  // bit below the middle (heavy brow) and pinches gently toward a domed top.
  const radiusAt = (v: number): number => {
    // v: 0 (bottom, where arms attach) -> 1 (top of the head)
    const dome = Math.sin(v * Math.PI); // 0 at both poles, 1 mid
    const lift = Math.pow(v, 0.6); // fuller toward the top -> bulbous head
    return (0.55 * dome + 0.35 * lift) * 1.0;
  };
  const heightAt = (v: number): number => {
    // Stretch the mantle taller than wide for that classic octopus head.
    return v * 1.55 - 0.1;
  };

  const ringStart: number[] = [];
  for (let i = 0; i <= RINGS; i++) {
    const v = i / RINGS;
    const r = Math.max(radiusAt(v), 0.001);
    const y = heightAt(v);
    ringStart.push(positions.length / 3);
    for (let j = 0; j < RADIAL; j++) {
      const a = (j / RADIAL) * Math.PI * 2;
      // Squash slightly in Z so the head reads with a "front", and add a faint
      // brow bump on the forward-lower quadrant for character.
      const cx = Math.cos(a) * r;
      const cz = Math.sin(a) * r * 0.92;
      positions.push(cx, y, cz);
      // Approximate normal: blend the radial outward with a vertical component
      // from the profile slope so the dome shades smoothly.
      const n = new THREE.Vector3(Math.cos(a), 0.45 * (1 - v) + 0.2, Math.sin(a))
        .normalize();
      normals.push(n.x, n.y, n.z);
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < RINGS; i++) {
    const a0 = ringStart[i];
    const b0 = ringStart[i + 1];
    for (let j = 0; j < RADIAL; j++) {
      const jn = (j + 1) % RADIAL;
      const a = a0 + j;
      const b = a0 + jn;
      const c = b0 + j;
      const d = b0 + jn;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  // Cap the top pole so the dome is watertight.
  {
    const center = positions.length / 3;
    const topV = 1;
    positions.push(0, heightAt(topV) + 0.04, 0);
    normals.push(0, 1, 0);
    const rN = ringStart[RINGS];
    for (let j = 0; j < RADIAL; j++) {
      const jn = (j + 1) % RADIAL;
      indices.push(center, rN + j, rN + jn);
    }
  }
  // Cap the bottom (the arms hide it, but keep it solid).
  {
    const center = positions.length / 3;
    positions.push(0, heightAt(0) - 0.02, 0);
    normals.push(0, -1, 0);
    const r0 = ringStart[0];
    for (let j = 0; j < RADIAL; j++) {
      const jn = (j + 1) % RADIAL;
      indices.push(center, r0 + jn, r0 + j);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return geo;
}

// ---------------------------------------------------------------------------
// TENTACLES geometry: eight tapered tubes merged into ONE buffer. Each arm is
// swept along a rest curve that fans outward from the head base then curls. We
// bake into the geometry, per vertex:
//   aArm  - 0..7 which arm (for per-tentacle phase in the shader)
//   aLen  - 0..1 along the arm (0 root at head, 1 tip)
//   aAng  - 0..1 around the tube (for sucker speckle on the underside)
// The shader sways each arm with its own slow sine, ramping toward the tip, so
// the eight arms curl + drift independently. Tube radius tapers to a point.
// ---------------------------------------------------------------------------
function buildArmsGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const aArm: number[] = [];
  const aLen: number[] = [];
  const aAng: number[] = [];
  const indices: number[] = [];

  const STEPS = 18; // rings along each arm
  const RADIAL = 7; // verts around the tube (low-poly)
  const rng = makeRng(0x0c700b05);

  // Reusable vectors to build the Frenet-ish frame for each ring.
  const p = new THREE.Vector3();
  const pNext = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const side = new THREE.Vector3();
  const norm = new THREE.Vector3();
  const ringPt = new THREE.Vector3();
  const ringN = new THREE.Vector3();

  // Rest curve for one arm: starts at the head base, fans outward + down, then
  // curls back up at the tip. `k` shapes per-arm variety (length/curl/droop).
  const curveAt = (
    s: number,
    baseAng: number,
    outFan: number,
    droop: number,
    curl: number,
    len: number,
    out: THREE.Vector3,
  ) => {
    // s: 0 root .. 1 tip
    const reach = len * s;
    // Horizontal fan outward from the head, easing as it extends.
    const outR = (0.55 + outFan * Math.pow(s, 0.85)) * 1.0;
    const x = Math.cos(baseAng) * outR;
    const z = Math.sin(baseAng) * outR;
    // Vertical: dip down toward the seabed then curl the tip up a touch.
    const dip = -droop * Math.sin(s * Math.PI * 0.85);
    const tipCurl = curl * Math.pow(s, 2.2);
    const y = -0.15 + dip + tipCurl - reach * 0.04;
    // A little lateral S-curl so arms aren't straight spokes.
    const swirl = Math.sin(s * Math.PI * 1.4) * 0.35 * (1 - s * 0.4);
    out.set(
      x - Math.sin(baseAng) * swirl,
      y,
      z + Math.cos(baseAng) * swirl,
    );
  };

  for (let arm = 0; arm < ARMS; arm++) {
    const baseAng = (arm / ARMS) * Math.PI * 2 + 0.18;
    // Per-arm character (deterministic).
    const len = 2.7 + rng() * 0.7;
    const outFan = 1.1 + rng() * 0.5;
    const droop = 0.7 + rng() * 0.5;
    const curl = 0.5 + rng() * 0.7;
    const rootR = 0.34 + rng() * 0.05; // thickness at the root

    const ringStartIdx: number[] = [];

    for (let i = 0; i <= STEPS; i++) {
      const s = i / STEPS;
      curveAt(s, baseAng, outFan, droop, curl, len, p);
      const sN = Math.min(1, s + 1 / STEPS);
      curveAt(sN, baseAng, outFan, droop, curl, len, pNext);

      tangent.copy(pNext).sub(p);
      if (tangent.lengthSq() < 1e-8) tangent.set(0, -1, 0);
      tangent.normalize();
      // Build a stable frame from tangent + world up.
      side.copy(tangent).cross(up);
      if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
      side.normalize();
      norm.copy(side).cross(tangent).normalize();

      // Taper: thick root -> fine tip, with a tiny bulge near the base.
      const taper = Math.pow(1 - s, 1.25);
      const bulge = 1 + 0.18 * Math.sin(s * Math.PI * 0.5);
      const radius = Math.max(rootR * taper * bulge, 0.012);

      ringStartIdx.push(positions.length / 3);
      for (let j = 0; j < RADIAL; j++) {
        const a = (j / RADIAL) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        ringPt
          .copy(p)
          .addScaledVector(side, ca * radius)
          .addScaledVector(norm, sa * radius);
        ringN.copy(side).multiplyScalar(ca).addScaledVector(norm, sa).normalize();
        positions.push(ringPt.x, ringPt.y, ringPt.z);
        normals.push(ringN.x, ringN.y, ringN.z);
        aArm.push(arm);
        aLen.push(s);
        aAng.push(j / RADIAL);
      }
    }

    // Stitch rings into the tube.
    for (let i = 0; i < STEPS; i++) {
      const a0 = ringStartIdx[i];
      const b0 = ringStartIdx[i + 1];
      for (let j = 0; j < RADIAL; j++) {
        const jn = (j + 1) % RADIAL;
        const a = a0 + j;
        const b = a0 + jn;
        const c = b0 + j;
        const d = b0 + jn;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    // Round the tip with a single fan to a point.
    {
      const center = positions.length / 3;
      curveAt(1, baseAng, outFan, droop, curl, len, p);
      positions.push(p.x, p.y, p.z);
      // Tip normal points roughly along the curve tangent.
      curveAt(0.96, baseAng, outFan, droop, curl, len, pNext);
      tangent.copy(p).sub(pNext).normalize();
      normals.push(tangent.x, tangent.y, tangent.z);
      aArm.push(arm);
      aLen.push(1);
      aAng.push(0);
      const last = ringStartIdx[STEPS];
      for (let j = 0; j < RADIAL; j++) {
        const jn = (j + 1) % RADIAL;
        indices.push(center, last + j, last + jn);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("aArm", new THREE.Float32BufferAttribute(aArm, 1));
  geo.setAttribute("aLen", new THREE.Float32BufferAttribute(aLen, 1));
  geo.setAttribute("aAng", new THREE.Float32BufferAttribute(aAng, 1));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return geo;
}

// ---------------------------------------------------------------------------
// Coral mound geometry: a small rounded rock the octopus rests on, so it isn't
// floating. Low-poly bumpy dome. One draw call, shares no shader with the body.
// ---------------------------------------------------------------------------
function buildMoundGeometry(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(2.6, 1);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const rng = makeRng(0xc07a1999);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const bump = 1 + (rng() - 0.5) * 0.28;
    v.multiplyScalar(bump);
    v.y *= 0.55; // flatten into a mound
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// ---------------------------------------------------------------------------
// Shared body shader (used by head + arms). Warm orange with a top-down key
// light, darker shaded underside, a cool fresnel rim, and (for arms) a sucker
// speckle along the underside driven by aLen/aAng. Arms additionally sway in the
// vertex shader with a per-tentacle sine.
// ---------------------------------------------------------------------------
const bodyVertex = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPresence;
  uniform float uIsArm;     // 1.0 for the tentacles, 0.0 for the head

  attribute float aArm;     // 0..7 (arms only; 0 for head)
  attribute float aLen;     // 0..1 along arm (arms only; 0 for head)
  attribute float aAng;     // 0..1 around tube (arms only)

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vLen;
  varying float vAng;
  varying float vIsArm;
  varying float vUpFacing;  // how much this surface faces up (for key light tint)

  void main() {
    vLen = aLen;
    vAng = aAng;
    vIsArm = uIsArm;

    vec3 pos = position;

    if (uIsArm > 0.5) {
      // Per-tentacle slow sine sway. Each arm gets its own phase from aArm so the
      // eight arms drift independently; sway ramps toward the tip (aLen^2) so the
      // root stays anchored to the head and the tips curl + breathe the most.
      float phase = aArm * 2.39996; // golden-angle spread of phases
      float ramp = aLen * aLen;     // anchored root, expressive tip

      // Primary lazy curl + a finer ripple travelling down the arm.
      float primary = sin(uTime * 0.7 + phase + aLen * 2.2);
      float ripple  = sin(uTime * 1.6 + phase * 1.7 + aLen * 5.5) * 0.3;
      float swayMag = (primary + ripple) * ramp * 0.55;

      // Sway direction: rotate the offset around the arm's base angle so each arm
      // bends in its own outward plane (curls in/out + a little side drift).
      float dir = phase;
      vec2 d1 = vec2(cos(dir), sin(dir));
      vec2 d2 = vec2(-d1.y, d1.x);
      float side = sin(uTime * 0.5 + phase * 0.6) * ramp * 0.32;
      pos.x += d1.x * swayMag + d2.x * side;
      pos.z += d1.y * swayMag + d2.y * side;
      // A gentle vertical breathe so the tips lift and settle.
      pos.y += sin(uTime * 0.6 + phase + aLen * 3.0) * ramp * 0.22;
    } else {
      // The head breathes very subtly (mantle inflate/deflate).
      float breathe = 1.0 + sin(uTime * 0.8) * 0.012;
      pos.xz *= breathe;
      pos.y += sin(uTime * 0.8) * 0.02;
    }

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    vUpFacing = clamp(vNormalW.y, 0.0, 1.0);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const bodyFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uBody;
  uniform vec3 uDeep;
  uniform vec3 uBelly;
  uniform vec3 uSucker;
  uniform vec3 uRim;
  uniform float uPresence;  // 0 hidden .. 1 full (opacity + brightness)
  uniform float uTime;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vLen;
  varying float vAng;
  varying float vIsArm;
  varying float vUpFacing;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);

    // Soft top-down key light (the shot's god rays from the surface).
    vec3 L = normalize(vec3(0.1, 1.0, 0.25));
    float diff = clamp(dot(N, L), 0.0, 1.0);

    // Base orange, darker on the shaded underside, warmer/lit on the top.
    vec3 base = mix(uDeep, uBody, smoothstep(-0.6, 0.7, N.y));
    vec3 col = base * (0.5 + 0.5 * diff);
    // Warm lit highlight where the key light grazes the top of the mantle/arms.
    col = mix(col, uBelly, smoothstep(0.45, 1.0, vUpFacing) * 0.55 * diff);

    // Sucker hint: along the underside of each arm (vAng near the down side),
    // a row of soft darker-orange dots running down the length. Arms only.
    if (vIsArm > 0.5) {
      // Underside of the tube: aAng ~0.5 region (built so 0.5 ~ down). Use a
      // smooth band around it, then a periodic dot pattern down the arm.
      float underside = smoothstep(0.34, 0.5, vAng) * smoothstep(0.66, 0.5, vAng);
      float dots = 0.5 + 0.5 * sin(vLen * 64.0);
      dots = smoothstep(0.55, 0.95, dots);
      float sucker = underside * dots * (1.0 - vLen * 0.3);
      col = mix(col, uSucker, sucker * 0.7);
    }

    // Cool fresnel rim so the warm body separates from the dark seabed water.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    col += uRim * fres * 0.4;

    // Presence lifts overall brightness a touch as it emerges from the dark.
    col *= mix(0.7, 1.08, uPresence);

    gl_FragColor = vec4(col, uPresence);
  }
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Octopus({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);
  const headMatRef = useRef<THREE.ShaderMaterial>(null);
  const armsMatRef = useRef<THREE.ShaderMaterial>(null);
  const eyeLRef = useRef<THREE.Group>(null);
  const eyeRRef = useRef<THREE.Group>(null);
  const moundMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const headGeo = useMemo(() => buildHeadGeometry(), []);
  const armsGeo = useMemo(() => buildArmsGeometry(), []);
  const moundGeo = useMemo(() => buildMoundGeometry(), []);
  const eyeWhiteGeo = useMemo(() => new THREE.SphereGeometry(0.26, 14, 12), []);
  const pupilGeo = useMemo(() => new THREE.SphereGeometry(0.13, 12, 10), []);

  // Two materials (head + arms) sharing the same shader source; arms toggle the
  // uIsArm uniform. Two draw calls for the lit body, plus eyes + mound.
  const headUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPresence: { value: 0 },
      uIsArm: { value: 0 },
      uBody: { value: new THREE.Color(BODY[0], BODY[1], BODY[2]) },
      uDeep: { value: new THREE.Color(BODY_DEEP[0], BODY_DEEP[1], BODY_DEEP[2]) },
      uBelly: { value: new THREE.Color(BELLY[0], BELLY[1], BELLY[2]) },
      uSucker: { value: new THREE.Color(SUCKER[0], SUCKER[1], SUCKER[2]) },
      uRim: { value: new THREE.Color(RIM[0], RIM[1], RIM[2]) },
    }),
    [],
  );
  const armsUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPresence: { value: 0 },
      uIsArm: { value: 1 },
      uBody: { value: new THREE.Color(BODY[0], BODY[1], BODY[2]) },
      uDeep: { value: new THREE.Color(BODY_DEEP[0], BODY_DEEP[1], BODY_DEEP[2]) },
      uBelly: { value: new THREE.Color(BELLY[0], BELLY[1], BELLY[2]) },
      uSucker: { value: new THREE.Color(SUCKER[0], SUCKER[1], SUCKER[2]) },
      uRim: { value: new THREE.Color(RIM[0], RIM[1], RIM[2]) },
    }),
    [],
  );

  // Smoothed presence so scroll jumps fade instead of popping.
  const presence = useRef(0);
  // A slow "look-around" target so the eyes feel curious.
  const lookPhase = useRef(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = progress.get();

    // Presence target: 0 above the fade-in, ramping to 1 by full depth.
    const target = clamp01(
      (p - FADE_IN_START) / (FADE_IN_FULL - FADE_IN_START),
    );

    // ZONE GATE: hidden + faded out above the band -> skip ALL heavy work.
    if (target <= 0 && presence.current < 0.01) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    presence.current = lerp(presence.current, target, Math.min(1, delta * 2.5));
    const pr = presence.current;
    const t = state.clock.elapsedTime;

    // Animate the shared shader uniforms (own live materials -> lint-safe).
    const hm = headMatRef.current;
    if (hm) {
      hm.uniforms.uTime.value = t;
      hm.uniforms.uPresence.value = pr;
    }
    const am = armsMatRef.current;
    if (am) {
      am.uniforms.uTime.value = t;
      am.uniforms.uPresence.value = pr;
    }
    const mm = moundMatRef.current;
    if (mm) mm.opacity = pr;

    // Whole-creature character: a slow settle/bob + the faintest sway, as if
    // resting in a gentle current. Scale eases in from the seabed.
    const bodyGroup = bodyGroupRef.current;
    if (bodyGroup) {
      bodyGroup.position.y = Math.sin(t * 0.5) * 0.12;
      bodyGroup.rotation.z = Math.sin(t * 0.35) * 0.04;
      bodyGroup.rotation.y = Math.sin(t * 0.22) * 0.12;
      const grow = lerp(0.6, 1, pr);
      bodyGroup.scale.setScalar(grow);
    }

    // Curious eyes: drift the pupils toward a slowly wandering look target.
    lookPhase.current += delta * 0.45;
    const lp = lookPhase.current;
    const lookX = Math.sin(lp) * 0.06 + Math.sin(lp * 0.37) * 0.03;
    const lookY = Math.sin(lp * 0.6 + 1.1) * 0.04;
    if (eyeLRef.current) {
      eyeLRef.current.children[1]?.position.set(lookX, lookY, 0.16);
    }
    if (eyeRRef.current) {
      eyeRRef.current.children[1]?.position.set(lookX, lookY, 0.16);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[REST_X, FLOOR_Y, REST_Z]}
      visible={false}
    >
      {/* Coral mound it rests on (grounds the creature on the seabed). */}
      <mesh
        geometry={moundGeo}
        position={[0, -0.4, 0]}
        frustumCulled={false}
        renderOrder={1}
      >
        <meshStandardMaterial
          ref={moundMatRef}
          color="#0c2733"
          roughness={0.95}
          metalness={0}
          transparent
          opacity={0}
        />
      </mesh>

      {/* The animated body: head + arms + eyes, bobbing as one. */}
      <group ref={bodyGroupRef} position={[0, 1.0, 0]}>
        {/* Eight tentacles - ONE merged draw call, swayed in the vertex shader. */}
        <mesh geometry={armsGeo} frustumCulled={false} renderOrder={2}>
          <shaderMaterial
            ref={armsMatRef}
            vertexShader={bodyVertex}
            fragmentShader={bodyFragment}
            uniforms={armsUniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Mantle / head. */}
        <mesh
          geometry={headGeo}
          position={[0, 0.05, 0]}
          frustumCulled={false}
          renderOrder={3}
        >
          <shaderMaterial
            ref={headMatRef}
            vertexShader={bodyVertex}
            fragmentShader={bodyFragment}
            uniforms={headUniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Eyes: a sclera dome + a dark pupil that tracks a curious look target.
            Placed on the forward (+z) face of the brow. */}
        <group ref={eyeLRef} position={[-0.5, 0.62, 0.72]}>
          <mesh geometry={eyeWhiteGeo} renderOrder={4}>
            <meshStandardMaterial
              color="#FBE9C8"
              roughness={0.5}
              metalness={0}
              transparent
              opacity={0.96}
            />
          </mesh>
          <mesh geometry={pupilGeo} position={[0, 0, 0.16]} renderOrder={5}>
            <meshBasicMaterial color="#141414" transparent opacity={0.96} />
          </mesh>
        </group>
        <group ref={eyeRRef} position={[0.5, 0.62, 0.72]}>
          <mesh geometry={eyeWhiteGeo} renderOrder={4}>
            <meshStandardMaterial
              color="#FBE9C8"
              roughness={0.5}
              metalness={0}
              transparent
              opacity={0.96}
            />
          </mesh>
          <mesh geometry={pupilGeo} position={[0, 0, 0.16]} renderOrder={5}>
            <meshBasicMaterial color="#141414" transparent opacity={0.96} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
