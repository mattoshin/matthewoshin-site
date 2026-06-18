"use client";

/**
 * CoralReef - a colourful reef carpeting the seabed.
 *
 * This is the SET the other seabed creatures live in: mostly static structure
 * with a very gentle ambient sway on the coral tips and a faint bio-glow on a
 * subset of tips down in the deep. It sits on the floor next to the kelp bed,
 * at the same seabed Y, and is friendly + saturated (orange-red, warm pink, a
 * few purple) to match the Dribbble reference's lively-but-premium vibe.
 *
 * DRAW-CALL BUDGET: a handful of draws total. Everything is instanced per type:
 *   - branching coral  (1 instanced draw)  -> orange-red / pink / purple tinted
 *   - rounded boulders (1 instanced draw)  -> dark slate
 *   - starfish         (1 instanced draw)  -> warm orange
 * Three InstancedMeshes, three materials, three draw calls for the whole reef.
 *
 * The branching coral is ONE low-poly clump geometry (a central trunk with a few
 * upswept branches, each capped by a rounded tip). A vertex-shader sway weighted
 * by height nudges only the upper branches/tips so the structure reads as solid
 * rock at the base and softly alive at the crown - no per-instance simulation.
 * Per-instance hue is chosen from the palette via an `aTint` attribute and a
 * `aGlow` flag marks the handful that luminesce in the dark.
 *
 * Depth gating: the reef fades in across the "writing" zone (soft start), reaches
 * full presence through "skills" + "contact". Above that band the whole group
 * goes .visible = false and the per-frame work early-returns, so it costs
 * ~nothing off-zone. Procedural geometry + shaders only; no external assets.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// ---------------------------------------------------------------------------
// Tuning constants
// ---------------------------------------------------------------------------

const CORAL_COUNT = 46; // branching coral clumps (one instanced draw)
const ROCK_COUNT = 22; // rounded boulders (one instanced draw)
const STAR_COUNT = 5; // starfish (one instanced draw)

const BED_RADIUS = 30; // horizontal spread of the reef (world units)
const BED_Z_SHIFT = -10; // push the bed toward -z so the descent ends inside it
const FLOOR_Y = -67; // seabed Y - matches the kelp bed roots exactly

// Palette (0..1). Three confident coral hues + slate rock + warm starfish.
const CORAL_ORANGE = hexToRgb01("#FF6B4A"); // orange-red branching coral
const CORAL_PINK = hexToRgb01("#FF9DB0"); // warm pink coral
const CORAL_PURPLE = hexToRgb01("#9B7BD0"); // accent purple coral
const CORAL_BASE = hexToRgb01("#7A2E3A"); // shaded crimson root (anchors hues)
const TIP_GLOW = hexToRgb01("#7FF0E6"); // faint bio-cyan glow on deep tips

const ROCK_DARK = hexToRgb01("#1E2730"); // dark slate boulder, shaded side
const ROCK_LIGHT = hexToRgb01("#384350"); // lit top of the boulder

const STAR_ORANGE = hexToRgb01("#FF8A3C"); // friendly orange starfish
const STAR_DEEP = hexToRgb01("#C0431F"); // its shaded underside

// Progress band where the reef is relevant. Writing starts at 0.66; we begin a
// soft fade just inside it and reach full presence by the start of skills (0.8).
const FADE_IN_START = 0.6; // fully hidden below this -> cheap early-return
const FADE_IN_FULL = 0.8; // full presence from skills onward

// Deterministic PRNG (mulberry32). React Compiler forbids Math.random() during
// render; a fixed seed keeps the reef layout reproducible across reloads.
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
// Procedural BRANCHING CORAL geometry.
//
// A central tapered trunk plus a handful of upswept branches, each a tapered
// tube of square-ish rings ending in a rounded cap. Every vertex carries:
//   - normal              (lit facets)
//   - aUp (0 root .. 1 tip)  drives the height-weighted sway + the tip colour ramp
//   - aTipMask (0 body .. 1 only at the very ends) concentrates glow at the tips
// Built once, instanced ~46x. Local height ~1; per-instance scale sets real size.
// ---------------------------------------------------------------------------
function buildCoralGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const ups: number[] = [];
  const tips: number[] = [];
  const indices: number[] = [];

  const RADIAL = 6; // verts around each ring (hex tube -> chunky low-poly)
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();

  // Lay down a tapered tube from `from` to `to`. `r0`/`r1` are start/end radii.
  // `up0`/`up1` are the aUp values at each end (so branches inherit trunk height).
  // The final ring is collapsed to a rounded point for a soft coral tip.
  const addBranch = (
    fx: number,
    fy: number,
    fz: number,
    tx: number,
    ty: number,
    tz: number,
    r0: number,
    r1: number,
    up0: number,
    up1: number,
    rings: number,
  ) => {
    // Branch axis + an orthonormal frame to sweep rings around it.
    const ax = tx - fx;
    const ay = ty - fy;
    const az = tz - fz;
    const axis = new THREE.Vector3(ax, ay, az).normalize();
    // Pick a reference not parallel to the axis, build perpendiculars.
    const ref =
      Math.abs(axis.y) > 0.9
        ? new THREE.Vector3(1, 0, 0)
        : new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(axis, ref).normalize();
    const fwd = new THREE.Vector3().crossVectors(axis, side).normalize();

    const ringStart: number[] = [];
    for (let i = 0; i <= rings; i++) {
      const t = i / rings;
      // Ease the radius taper so branches swell slightly then narrow to the tip.
      const swell = Math.sin(t * Math.PI) * 0.12;
      const r = (r0 + (r1 - r0) * t) * (1 + swell);
      const cx = fx + ax * t;
      const cy = fy + ay * t;
      const cz = fz + az * t;
      const up = up0 + (up1 - up0) * t;
      ringStart.push(positions.length / 3);
      for (let j = 0; j < RADIAL; j++) {
        const a = (j / RADIAL) * Math.PI * 2;
        const ox = side.x * Math.cos(a) * r + fwd.x * Math.sin(a) * r;
        const oy = side.y * Math.cos(a) * r + fwd.y * Math.sin(a) * r;
        const oz = side.z * Math.cos(a) * r + fwd.z * Math.sin(a) * r;
        v.set(cx + ox, cy + oy, cz + oz);
        n.set(ox, oy, oz).normalize();
        positions.push(v.x, v.y, v.z);
        normals.push(n.x, n.y, n.z);
        ups.push(up);
        // Tip mask ramps up sharply over the last fifth of the branch.
        tips.push(clamp01((t - 0.8) / 0.2));
      }
    }
    // Stitch the tube.
    for (let i = 0; i < rings; i++) {
      const a0 = ringStart[i];
      const b0 = ringStart[i + 1];
      for (let j = 0; j < RADIAL; j++) {
        const jn = (j + 1) % RADIAL;
        indices.push(a0 + j, b0 + j, a0 + jn);
        indices.push(a0 + jn, b0 + j, b0 + jn);
      }
    }
    // Rounded cap at the tip (a small fan to a point pushed past the last ring).
    const cap = positions.length / 3;
    v.set(tx + axis.x * r1 * 0.9, ty + axis.y * r1 * 0.9, tz + axis.z * r1 * 0.9);
    positions.push(v.x, v.y, v.z);
    normals.push(axis.x, axis.y, axis.z);
    ups.push(up1);
    tips.push(1);
    const last = ringStart[rings];
    for (let j = 0; j < RADIAL; j++) {
      const jn = (j + 1) % RADIAL;
      indices.push(cap, last + j, last + jn);
    }
  };

  // Trunk: a stout vertical stalk from the floor up to the crown.
  addBranch(0, 0, 0, 0, 0.46, 0, 0.13, 0.085, 0, 0.46, 5);

  // Branches: sweep outward + upward from staggered heights on the trunk, each
  // ending higher than its base so the silhouette is a friendly upswept fan.
  // Deterministic angles keep the clump readable rather than tangled.
  const branchDefs: Array<[number, number, number, number, number]> = [
    // [baseHeight, yaw(rad), reach, rise, baseUp]
    [0.18, 0.4, 0.26, 0.5, 0.34],
    [0.24, 2.5, 0.3, 0.46, 0.46],
    [0.3, 4.5, 0.24, 0.5, 0.56],
    [0.14, 5.6, 0.3, 0.42, 0.28],
    [0.36, 1.4, 0.2, 0.4, 0.66],
    [0.22, 3.5, 0.28, 0.48, 0.42],
  ];
  for (const [bh, yaw, reach, rise, baseUp] of branchDefs) {
    const fx = Math.cos(yaw) * 0.05;
    const fz = Math.sin(yaw) * 0.05;
    const tx = Math.cos(yaw) * reach;
    const tz = Math.sin(yaw) * reach;
    const ty = bh + rise;
    const tipUp = clamp01(baseUp + rise);
    addBranch(fx, bh, fz, tx, ty, tz, 0.07, 0.028, baseUp, tipUp, 4);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("aUp", new THREE.Float32BufferAttribute(ups, 1));
  geo.setAttribute("aTipMask", new THREE.Float32BufferAttribute(tips, 1));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return geo;
}

// ---------------------------------------------------------------------------
// Procedural ROUNDED BOULDER geometry: a low-poly lumpy sphere. One per draw,
// instanced; per-instance non-uniform scale gives boulders of varied shape.
// ---------------------------------------------------------------------------
function buildRockGeometry(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, 1); // chunky low-poly facets
  const pos = geo.attributes.position as THREE.BufferAttribute;
  // Deterministic lumpiness: nudge each vertex along its normal by a hash so the
  // boulders read as weathered rock rather than perfect spheres.
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const h =
      Math.sin(v.x * 5.1 + 1.3) * Math.cos(v.y * 4.7 + 2.1) * Math.sin(v.z * 5.9);
    const k = 1 + h * 0.14;
    v.multiplyScalar(k);
    // Flatten the base a touch so boulders sit on the floor, not float.
    if (v.y < -0.2) v.y *= 0.7;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

// ---------------------------------------------------------------------------
// Procedural STARFISH geometry: a flat 5-armed star, slightly domed in the
// centre, thin in Y so it lies on the floor / drapes on rock. Built in the XZ
// plane (Y up) so it sits flat without per-instance rotation gymnastics.
// ---------------------------------------------------------------------------
function buildStarGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const ARMS = 5;
  const outer = 1.0;
  const inner = 0.42;
  const dome = 0.22; // centre lift

  // Centre vertex (domed up).
  positions.push(0, dome, 0);
  const ring: number[] = [];
  for (let i = 0; i < ARMS * 2; i++) {
    const a = (i / (ARMS * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    const y = i % 2 === 0 ? 0.04 : 0.12; // arm tips drape, valleys lift slightly
    positions.push(Math.cos(a) * r, y, Math.sin(a) * r);
    ring.push(i + 1);
  }
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    indices.push(0, a, b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

// ---------------------------------------------------------------------------
// CORAL shader: lit low-poly body with a base->hue->bright-tip colour ramp, an
// ambient height-weighted sway, and a depth-driven bio-glow on flagged tips.
// ---------------------------------------------------------------------------
const coralVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPresence;

  attribute float aUp;       // 0 root .. 1 tip
  attribute float aTipMask;  // ~1 only at the very ends
  attribute vec3 aTint;      // per-instance coral hue
  attribute float aPhase;    // per-instance sway phase
  attribute float aGlowI;    // per-instance glow flag (0 or 1)

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vUp;
  varying float vTip;
  varying vec3 vTint;
  varying float vGlowI;

  void main() {
    vUp = aUp;
    vTip = aTipMask;
    vTint = aTint;
    vGlowI = aGlowI;

    vec3 pos = position;

    // Grow out of the seabed as the reef fades in (base stays put, crown rises).
    float grow = mix(0.55, 1.0, uPresence);
    pos.y *= grow;

    // Ambient sway: very gentle, weighted by height so the rock-solid base is
    // anchored and only the branch tips drift in the current. Two slow octaves.
    float w = aUp * aUp;
    float s = sin(uTime * 0.7 + aPhase + aUp * 2.0)
            + sin(uTime * 1.6 + aPhase * 1.7 + aUp * 4.0) * 0.3;
    float amp = 0.05 * w;
    pos.x += s * amp;
    pos.z += cos(uTime * 0.6 + aPhase * 1.3 + aUp * 2.2) * amp * 0.7;

    vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);
    mat3 nm = mat3(modelMatrix) * mat3(instanceMatrix);
    vNormalW = normalize(nm * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const coralFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uBase;   // shaded crimson root
  uniform vec3 uGlow;   // bio-cyan tip glow
  uniform float uDepthGlow; // 0..1 grows with descent
  uniform float uFade;  // group opacity

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vUp;
  varying float vTip;
  varying vec3 vTint;
  varying float vGlowI;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);

    // Soft top-down key light (what little filters to the seabed).
    vec3 L = normalize(vec3(0.2, 1.0, 0.35));
    float diff = clamp(dot(N, L), 0.0, 1.0);

    // Colour ramp: shaded root -> the instance's coral hue -> a brighter tip.
    vec3 tipCol = mix(vTint, vTint * 1.35 + 0.08, smoothstep(0.6, 1.0, vUp));
    vec3 col = mix(uBase, vTint, smoothstep(0.0, 0.45, vUp));
    col = mix(col, tipCol, smoothstep(0.4, 1.0, vUp));
    col *= (0.5 + 0.6 * diff); // gentle form shading keeps facets readable

    // Fresnel sheen for a faint wet look at grazing angles.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    col += vTint * fres * 0.18;

    // Bio-glow: only flagged instances, concentrated at the tips, grows in the
    // deep so the reef twinkles faintly once you reach the floor.
    col += uGlow * vTip * vGlowI * uDepthGlow * 0.9;

    gl_FragColor = vec4(col, uFade);
  }
`;

// ---------------------------------------------------------------------------
// ROCK shader: matte dark slate, top-lit so boulders read as solid volume.
// ---------------------------------------------------------------------------
const rockVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying float vTopness;
  void main() {
    vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
    mat3 nm = mat3(modelMatrix) * mat3(instanceMatrix);
    vNormalW = normalize(nm * normal);
    vTopness = clamp(vNormalW.y * 0.5 + 0.5, 0.0, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const rockFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uDark;
  uniform vec3 uLight;
  uniform float uFade;
  varying vec3 vNormalW;
  varying float vTopness;
  void main() {
    vec3 L = normalize(vec3(0.15, 1.0, 0.3));
    float diff = clamp(dot(normalize(vNormalW), L), 0.0, 1.0);
    vec3 col = mix(uDark, uLight, vTopness * 0.7 + diff * 0.3);
    gl_FragColor = vec4(col, uFade);
  }
`;

// ---------------------------------------------------------------------------
// STARFISH shader: flat warm orange with shaded arms; reads at a glance.
// ---------------------------------------------------------------------------
const starVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying float vR;
  void main() {
    vR = length(position.xz); // 0 centre .. ~1 arm tip
    vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
    mat3 nm = mat3(modelMatrix) * mat3(instanceMatrix);
    vNormalW = normalize(nm * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const starFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uOrange;
  uniform vec3 uDeep;
  uniform float uFade;
  varying vec3 vNormalW;
  varying float vR;
  void main() {
    vec3 L = normalize(vec3(0.2, 1.0, 0.3));
    float diff = clamp(dot(normalize(vNormalW), L), 0.0, 1.0);
    // Brighter centre dome, slightly deeper toward the arm tips.
    vec3 col = mix(uOrange, uDeep, smoothstep(0.3, 1.0, vR));
    col *= (0.55 + 0.55 * diff);
    gl_FragColor = vec4(col, uFade);
  }
`;

export default function CoralReef({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);

  const coralMeshRef = useRef<THREE.InstancedMesh>(null);
  const rockMeshRef = useRef<THREE.InstancedMesh>(null);
  const starMeshRef = useRef<THREE.InstancedMesh>(null);

  const coralMatRef = useRef<THREE.ShaderMaterial>(null);
  const rockMatRef = useRef<THREE.ShaderMaterial>(null);
  const starMatRef = useRef<THREE.ShaderMaterial>(null);

  const coralGeo = useMemo(() => buildCoralGeometry(), []);
  const rockGeo = useMemo(() => buildRockGeometry(), []);
  const starGeo = useMemo(() => buildStarGeometry(), []);

  // --- Per-instance layout + attributes, built once (deterministic). --------
  const layout = useMemo(() => {
    const rng = makeRng(0xc04a1ee5);

    // Scatter helper: a point on the bed disc, denser toward the middle, biased
    // toward -z so the descent finishes inside the reef rather than beside it.
    const scatter = (radius: number): [number, number] => {
      const ang = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * radius;
      return [Math.cos(ang) * r, Math.sin(ang) * r + BED_Z_SHIFT];
    };

    const dummy = new THREE.Object3D();

    // CORAL instances ------------------------------------------------------
    const coralMat = new Float32Array(CORAL_COUNT * 16);
    const tints = new Float32Array(CORAL_COUNT * 3);
    const phases = new Float32Array(CORAL_COUNT);
    const glows = new Float32Array(CORAL_COUNT);
    const palette = [CORAL_ORANGE, CORAL_PINK, CORAL_PURPLE];
    // Weighted hue mix: mostly orange-red + pink, a few purple accents.
    const huePick = (n: number) => (n < 0.45 ? 0 : n < 0.82 ? 1 : 2);
    for (let i = 0; i < CORAL_COUNT; i++) {
      const [x, z] = scatter(BED_RADIUS);
      dummy.position.set(x, FLOOR_Y, z);
      dummy.rotation.set(0, rng() * Math.PI * 2, (rng() - 0.5) * 0.12);
      const s = 3.2 + rng() * 3.6; // clump size (world units tall-ish)
      dummy.scale.set(s, s * (0.9 + rng() * 0.3), s);
      dummy.updateMatrix();
      dummy.matrix.toArray(coralMat, i * 16);

      const hue = palette[huePick(rng())];
      tints[i * 3] = hue[0];
      tints[i * 3 + 1] = hue[1];
      tints[i * 3 + 2] = hue[2];
      phases[i] = rng() * Math.PI * 2;
      glows[i] = rng() < 0.3 ? 1 : 0; // ~a third of tips luminesce in the deep
    }

    // ROCK instances -------------------------------------------------------
    const rockMat = new Float32Array(ROCK_COUNT * 16);
    for (let i = 0; i < ROCK_COUNT; i++) {
      const [x, z] = scatter(BED_RADIUS * 1.05);
      const s = 1.6 + rng() * 3.4;
      // Half-buried: lower the centre so boulders emerge from the floor.
      dummy.position.set(x, FLOOR_Y + s * 0.35, z);
      dummy.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
      dummy.scale.set(s * (0.8 + rng() * 0.5), s * (0.6 + rng() * 0.4), s * (0.8 + rng() * 0.5));
      dummy.updateMatrix();
      dummy.matrix.toArray(rockMat, i * 16);
    }

    // STARFISH instances ---------------------------------------------------
    const starMat = new Float32Array(STAR_COUNT * 16);
    for (let i = 0; i < STAR_COUNT; i++) {
      const [x, z] = scatter(BED_RADIUS * 0.8);
      const s = 1.4 + rng() * 1.0;
      dummy.position.set(x, FLOOR_Y + 0.08 * s, z);
      dummy.rotation.set(0, rng() * Math.PI * 2, 0); // lie flat, varied spin
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      dummy.matrix.toArray(starMat, i * 16);
    }

    return { coralMat, tints, phases, glows, rockMat, starMat };
  }, []);

  // --- Uniforms (allocated once per material). ------------------------------
  const coralUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPresence: { value: 0 },
      uDepthGlow: { value: 0 },
      uFade: { value: 0 },
      uBase: { value: new THREE.Color(CORAL_BASE[0], CORAL_BASE[1], CORAL_BASE[2]) },
      uGlow: { value: new THREE.Color(TIP_GLOW[0], TIP_GLOW[1], TIP_GLOW[2]) },
    }),
    [],
  );
  const rockUniforms = useMemo(
    () => ({
      uFade: { value: 0 },
      uDark: { value: new THREE.Color(ROCK_DARK[0], ROCK_DARK[1], ROCK_DARK[2]) },
      uLight: { value: new THREE.Color(ROCK_LIGHT[0], ROCK_LIGHT[1], ROCK_LIGHT[2]) },
    }),
    [],
  );
  const starUniforms = useMemo(
    () => ({
      uFade: { value: 0 },
      uOrange: { value: new THREE.Color(STAR_ORANGE[0], STAR_ORANGE[1], STAR_ORANGE[2]) },
      uDeep: { value: new THREE.Color(STAR_DEEP[0], STAR_DEEP[1], STAR_DEEP[2]) },
    }),
    [],
  );

  // One-time instance-buffer upload (after the meshes exist).
  const initialized = useRef(false);
  // Smoothed presence so scroll jumps fade rather than pop.
  const presence = useRef(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = progress.get();

    // Presence target: 0 below the fade-in, ramping to 1 by full depth.
    const target = clamp01(
      (p - FADE_IN_START) / (FADE_IN_FULL - FADE_IN_START),
    );

    // ZONE-GATE: above the band and already faded out -> hide + skip all work.
    if (target <= 0 && presence.current < 0.01) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    // One-time instance-matrix + attribute upload once all meshes exist.
    const coral = coralMeshRef.current;
    const rock = rockMeshRef.current;
    const star = starMeshRef.current;
    if (coral && rock && star && !initialized.current) {
      coral.instanceMatrix.array.set(layout.coralMat);
      coral.instanceMatrix.needsUpdate = true;
      coral.geometry.setAttribute(
        "aTint",
        new THREE.InstancedBufferAttribute(layout.tints, 3),
      );
      coral.geometry.setAttribute(
        "aPhase",
        new THREE.InstancedBufferAttribute(layout.phases, 1),
      );
      coral.geometry.setAttribute(
        "aGlowI",
        new THREE.InstancedBufferAttribute(layout.glows, 1),
      );
      rock.instanceMatrix.array.set(layout.rockMat);
      rock.instanceMatrix.needsUpdate = true;
      star.instanceMatrix.array.set(layout.starMat);
      star.instanceMatrix.needsUpdate = true;
      initialized.current = true;
    }

    presence.current = lerp(
      presence.current,
      target,
      Math.min(1, delta * 2.5),
    );
    const fade = presence.current;

    // Bio-glow strengthens with raw depth within the reef band.
    const depthGlow = clamp01((p - 0.66) / 0.34) * fade;

    const coralMat = coralMatRef.current;
    if (coralMat) {
      const u = coralMat.uniforms;
      u.uTime.value += delta;
      u.uPresence.value = fade;
      u.uDepthGlow.value = depthGlow;
      u.uFade.value = fade;
    }
    const rockMat = rockMatRef.current;
    if (rockMat) rockMat.uniforms.uFade.value = fade;
    const starMat = starMatRef.current;
    if (starMat) starMat.uniforms.uFade.value = fade;
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Rounded boulders (drawn first so coral + starfish layer on top). */}
      <instancedMesh
        ref={rockMeshRef}
        args={[rockGeo, undefined, ROCK_COUNT]}
        frustumCulled={false}
        renderOrder={0}
      >
        <shaderMaterial
          ref={rockMatRef}
          vertexShader={rockVertex}
          fragmentShader={rockFragment}
          uniforms={rockUniforms}
          transparent
          depthWrite
          side={THREE.FrontSide}
          fog={false}
        />
      </instancedMesh>

      {/* Starfish lying on the floor / draped on rock. */}
      <instancedMesh
        ref={starMeshRef}
        args={[starGeo, undefined, STAR_COUNT]}
        frustumCulled={false}
        renderOrder={1}
      >
        <shaderMaterial
          ref={starMatRef}
          vertexShader={starVertex}
          fragmentShader={starFragment}
          uniforms={starUniforms}
          transparent
          depthWrite
          side={THREE.DoubleSide}
          fog={false}
        />
      </instancedMesh>

      {/* Branching coral - the colourful star of the reef. */}
      <instancedMesh
        ref={coralMeshRef}
        args={[coralGeo, undefined, CORAL_COUNT]}
        frustumCulled={false}
        renderOrder={2}
      >
        <shaderMaterial
          ref={coralMatRef}
          vertexShader={coralVertex}
          fragmentShader={coralFragment}
          uniforms={coralUniforms}
          transparent
          depthWrite
          side={THREE.DoubleSide}
          fog={false}
        />
      </instancedMesh>
    </group>
  );
}
