"use client";

/**
 * Anglerfish - the deep payoff. ONE stylized anglerfish lurking in the abyss
 * (the "writing" band), drifting slowly and menacingly while its bioluminescent
 * lure bobs on its illicium stalk and casts a faint cyan key onto its own face.
 *
 * Anatomy (all procedural, baked into a handful of meshes that share the group):
 *   - BODY: a fat, bulbous low-poly mesh built nose(+x) -> tail(-x) from elliptical
 *     rings. Near-black abyssal teal (#0A1A26) with a fresnel rim + a cyan key that
 *     is brightest near the head (lit by the lure). A `spine` attribute lets the
 *     rear of the body + the tail fin undulate in the vertex shader so the swim is
 *     free. The mouth is a wide gash with an UPPER and LOWER jaw plus a row of
 *     stylized fang triangles, so it reads as an anglerfish at a glance.
 *   - ILLICIUM: a thin tapered stalk that arcs up and forward from above the brow.
 *   - LURE: a small additive, self-glowing sphere at the stalk tip (#9FF7E6) wrapped
 *     in a soft camera-facing halo sprite. No bloom pass; the glow is pure additive
 *     blending + a bright emissive + radial falloff (matches BioParticles' approach).
 *     A point-ish key term in the body shader uses the lure's live world position so
 *     the face brightens on the side facing the lure.
 *
 * Motion: the whole fish follows its own slow closed Catmull-Rom loop (a small,
 * lazy path) and is oriented to a look-ahead point with a gentle banking roll. The
 * loop is centered on the LIVE camera depth each frame so the creature stays framed
 * through the whole writing band rather than scrolling past in one beat. The lure
 * bobs on a sine and trails slightly behind the head's motion for a lifelike wobble.
 *
 * Zone gate: lives in "writing" (Abyss, 0.66..0.8) with soft feather into ventures
 * (above) and skills (below). Off-band the group goes `.visible=false` and the heavy
 * per-frame work early-returns, so it costs ~nothing elsewhere.
 *
 * Self-contained SceneElement per scene/types.ts: procedural geometry + small
 * custom shaders only. No external models/textures/network. Reads the shared
 * `progress` accessor imperatively each frame; never subscribes.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
const BODY_DARK = hexToRgb01("#0A1A26"); // dark abyssal teal body
const BODY_BELLY = hexToRgb01("#040C13"); // near-black underside (counter-shading)
const RIM_CYAN = hexToRgb01("#3FE0E6"); // fresnel silhouette edge
const LURE_CYAN = hexToRgb01("#9FF7E6"); // bio-aqua/white lure glow (additive)
const TOOTH_COLOR = hexToRgb01("#DDEFF2"); // pale fangs

// The writing (Abyss) band, plus a soft feather into the neighbours. Drives the
// global fade. (Zone bounds live in depth.ts: writing = 0.66..0.8.)
const BAND_START = 0.66;
const BAND_END = 0.8;
const FEATHER = 0.06; // how far the fade bleeds into ventures / skills

// ---------------------------------------------------------------------------
// Deterministic PRNG (mulberry32). React Compiler forbids Math.random() during
// render; a fixed seed makes the path + tooth layout reproducible across reloads.
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
// Procedural anglerfish BODY geometry.
//
// Built nose(+x) to tail(-x). We extrude elliptical rings along a bulbous,
// fat-bellied profile (the classic round anglerfish silhouette), cap the tail,
// then weld on: an upper jaw + lower jaw (forming a wide open mouth), a row of
// fang triangles, a tall caudal fin and two small pectoral fins. Every vertex
// carries a `spine` attribute (0 at the snout, 1 at the tail tip) so the shader
// can undulate the rear smoothly. A `mouthGlow` attribute (1 near the maw, 0
// elsewhere) lets the fragment shader add an inner-mouth darkness + tooth bias.
// ---------------------------------------------------------------------------
function buildBodyGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const spine: number[] = []; // 0..1 along body length, for tail undulation
  const mouthGlow: number[] = []; // marks mouth-region verts (teeth/jaw)

  const LENGTH = 2.2;
  const SEGMENTS = 24; // rings along the body
  const RADIAL = 14; // verts around each ring

  // Body profile: bulbous head + fat belly tapering hard to a thin tail.
  // half-height (vertical) and half-width (horizontal) per t (0 nose -> 1 tail).
  const profile = (t: number): { h: number; w: number } => {
    // Big rounded head bulge in the front third, deflating toward the tail.
    const head = Math.pow(Math.sin(clamp01(t / 0.5) * Math.PI * 0.5), 0.7);
    const taper = Math.pow(1 - clamp01((t - 0.34) / 0.66), 1.5);
    const base = t < 0.34 ? head : head * 0.0 + taper;
    // Round, slightly taller-than-wide cross-section (a chunky globe of a fish).
    const h = base * 0.62;
    const w = base * 0.55;
    return { h: Math.max(h, 0.02), w: Math.max(w, 0.015) };
  };

  // Generate rings of vertices.
  const ringStart: number[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const x = (0.45 - t) * LENGTH; // nose near +x, tail at -x
    const { h, w } = profile(t);
    ringStart.push(positions.length / 3);
    for (let j = 0; j < RADIAL; j++) {
      const a = (j / RADIAL) * Math.PI * 2;
      const cy = Math.sin(a) * h;
      const cz = Math.cos(a) * w;
      // Lower the belly a touch so the underside reads heavy + the brow juts.
      const sag = -Math.max(0, -Math.sin(a)) * 0.04 * (1 - t);
      positions.push(x, cy + sag, cz);
      const n = new THREE.Vector3(0, Math.sin(a) / h, Math.cos(a) / w).normalize();
      normals.push(n.x, n.y, n.z);
      spine.push(t);
      mouthGlow.push(0);
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < SEGMENTS; i++) {
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

  // --- Tail cap (close the thin caudal peduncle) ---
  {
    const center = positions.length / 3;
    const tailX = (0.45 - 1) * LENGTH;
    positions.push(tailX, 0, 0);
    normals.push(-1, 0, 0);
    spine.push(1);
    mouthGlow.push(0);
    const rN = ringStart[SEGMENTS];
    for (let j = 0; j < RADIAL; j++) {
      const jn = (j + 1) % RADIAL;
      indices.push(center, rN + jn, rN + j);
    }
  }

  // Geometry helpers ---------------------------------------------------------

  // Append a double-sided flat fin from a flat list of triangles. `glow` tags
  // the verts (0 = ordinary fin, 3 = pale fang) for the fragment shader.
  const addFin = (tris: number[][], s: number, glow = 0) => {
    const base = positions.length / 3;
    for (const v of tris) {
      positions.push(v[0], v[1], v[2]);
      normals.push(0, 0, v[2] >= 0 ? 1 : -1);
      spine.push(s);
      mouthGlow.push(glow);
    }
    for (let k = 0; k < tris.length; k += 3) {
      indices.push(base + k, base + k + 1, base + k + 2);
      indices.push(base + k + 2, base + k + 1, base + k); // back face
    }
  };

  // Append an arbitrary triangle list (double-sided), tagging mouthGlow.
  const addTris = (tris: number[][], s: number, glow: number) => {
    const base = positions.length / 3;
    for (const v of tris) {
      positions.push(v[0], v[1], v[2]);
      normals.push(0, 1, 0); // overwritten by smooth normals later for the maw
      spine.push(s);
      mouthGlow.push(glow);
    }
    for (let k = 0; k < tris.length; k += 3) {
      indices.push(base + k, base + k + 1, base + k + 2);
      indices.push(base + k + 2, base + k + 1, base + k);
    }
  };

  // The mouth sits at the front. Nose tip x:
  const noseX = 0.45 * LENGTH;
  const { h: hNose } = profile(0.06);
  // Mouth opening parameters (a wide downturned anglerfish gash).
  const mouthHalfW = profile(0.08).w * 0.9; // width across the maw
  const mouthY = -hNose * 0.12; // mouth line a touch below center
  const upperFront = noseX - 0.02;
  const lowerJut = 0.16; // the jutting underbite the angler is known for
  const gape = 0.34; // vertical opening

  // --- Upper jaw lip: a thin downward-facing wedge at the front-top of the maw
  {
    const yTop = mouthY + gape * 0.5;
    addTris(
      [
        [upperFront, yTop, mouthHalfW],
        [upperFront, yTop, -mouthHalfW],
        [upperFront - 0.18, yTop + 0.05, 0],
      ],
      0.02,
      1.0,
    );
  }

  // --- Lower jaw: an underbite plate jutting forward + down, forming the floor
  {
    const yBot = mouthY - gape * 0.5;
    addTris(
      [
        // forward-jutting plate (two tris -> a quad)
        [upperFront + lowerJut, yBot, mouthHalfW * 0.8],
        [upperFront + lowerJut, yBot, -mouthHalfW * 0.8],
        [upperFront - 0.16, yBot - 0.02, mouthHalfW],
        [upperFront + lowerJut, yBot, -mouthHalfW * 0.8],
        [upperFront - 0.16, yBot - 0.02, -mouthHalfW],
        [upperFront - 0.16, yBot - 0.02, mouthHalfW],
      ],
      0.04,
      1.0,
    );
  }

  // --- Inner mouth (dark cavity): a recessed quad behind the jaws.
  {
    const yTop = mouthY + gape * 0.5;
    const yBot = mouthY - gape * 0.5;
    const backX = upperFront - 0.22;
    addTris(
      [
        [backX, yTop, mouthHalfW * 0.7],
        [backX, yTop, -mouthHalfW * 0.7],
        [backX, yBot, mouthHalfW * 0.7],
        [backX, yTop, -mouthHalfW * 0.7],
        [backX, yBot, -mouthHalfW * 0.7],
        [backX, yBot, mouthHalfW * 0.7],
      ],
      0.06,
      2.0, // glow=2 -> shader treats as deep cavity (extra dark)
    );
  }

  // --- Fang teeth: a row along the upper + lower jaw lines, the menace cue.
  {
    const rng = makeRng(0xfa9651);
    const teethPerJaw = 7;
    const yTop = mouthY + gape * 0.5;
    const yBot = mouthY - gape * 0.5;
    for (let k = 0; k < teethPerJaw; k++) {
      const f = (k + 0.5) / teethPerJaw; // 0..1 across the mouth width
      const z = (f - 0.5) * 2 * mouthHalfW * 0.92;
      const jitter = (rng() - 0.5) * 0.02;
      const len = 0.08 + rng() * 0.06; // fang length
      const halfBase = 0.028;
      // Upper fangs point DOWN into the maw. glow=3 -> pale fang in the shader.
      addFin(
        [
          [upperFront - 0.01 + jitter, yTop, z - halfBase],
          [upperFront - 0.01 + jitter, yTop, z + halfBase],
          [upperFront - 0.04 + jitter, yTop - len, z],
        ],
        0.02,
        3.0,
      );
      // Lower fangs point UP from the jutting jaw.
      addFin(
        [
          [upperFront + lowerJut * 0.7 + jitter, yBot, z - halfBase],
          [upperFront + lowerJut * 0.7 + jitter, yBot, z + halfBase],
          [upperFront + lowerJut * 0.7 - 0.02 + jitter, yBot + len * 0.85, z],
        ],
        0.04,
        3.0,
      );
    }
  }

  // --- Caudal (tail) fin: a tall rounded paddle, swept slightly. ---
  {
    const tx = (0.45 - 1) * LENGTH;
    const s = 1.0;
    addFin(
      [
        [tx + 0.05, 0.12, 0],
        [tx - 0.3, 0.34, 0],
        [tx - 0.34, 0.0, 0],
        [tx + 0.05, 0.12, 0],
        [tx - 0.34, 0.0, 0],
        [tx + 0.05, -0.12, 0],
        [tx + 0.05, -0.12, 0],
        [tx - 0.34, 0.0, 0],
        [tx - 0.3, -0.34, 0],
      ],
      s,
    );
  }

  // --- Dorsal fin (a low rounded sail along the back, soft) ---
  {
    const baseT = 0.45;
    const xb = (0.45 - baseT) * LENGTH;
    const { h } = profile(baseT);
    addFin(
      [
        [xb + 0.18, h * 0.92, 0],
        [xb - 0.3, h * 0.92, 0],
        [xb - 0.06, h + 0.22, 0],
      ],
      baseT,
    );
  }

  // --- Pectoral fins (one each side), small flared paddles. ---
  for (const side of [1, -1]) {
    const baseT = 0.4;
    const xb = (0.45 - baseT) * LENGTH;
    const { w } = profile(baseT);
    const root = w * 0.85 * side;
    const s = baseT;
    addFin(
      [
        [xb + 0.08, -0.06, root],
        [xb - 0.16, -0.04, root],
        [xb - 0.14, -0.26, root + 0.3 * side],
      ],
      s,
    );
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("spine", new THREE.Float32BufferAttribute(spine, 1));
  geo.setAttribute("mouthGlow", new THREE.Float32BufferAttribute(mouthGlow, 1));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return geo;
}

// Build the illicium stalk: a thin tapered tube arcing up + forward from the
// brow. Returned in BODY-LOCAL space so it swims with the fish. We also return
// the tip position so the lure mesh + the body's lure-key uniform can use it.
function buildStalkGeometry(tip: THREE.Vector3): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const SEG = 18;
  const RAD = 6;
  // Root just above + ahead of the brow, arcing forward over the mouth.
  const root = new THREE.Vector3(0.55, 0.5, 0);
  const ctrl = new THREE.Vector3(1.05, 1.05, 0);
  const end = new THREE.Vector3(1.35, 0.95, 0);
  const curve = new THREE.QuadraticBezierCurve3(root, ctrl, end);
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG;
    const c = curve.getPoint(t);
    // Frame: approximate tangent for a tube cross-section.
    const tan = curve.getTangent(t).normalize();
    const up = new THREE.Vector3(0, 0, 1);
    const sideV = new THREE.Vector3().crossVectors(tan, up).normalize();
    const upV = new THREE.Vector3().crossVectors(sideV, tan).normalize();
    const r = lerp(0.035, 0.012, t); // taper to the tip
    for (let j = 0; j < RAD; j++) {
      const a = (j / RAD) * Math.PI * 2;
      const off = sideV
        .clone()
        .multiplyScalar(Math.cos(a) * r)
        .add(upV.clone().multiplyScalar(Math.sin(a) * r));
      positions.push(c.x + off.x, c.y + off.y, c.z + off.z);
    }
  }
  for (let i = 0; i < SEG; i++) {
    for (let j = 0; j < RAD; j++) {
      const jn = (j + 1) % RAD;
      const a = i * RAD + j;
      const b = i * RAD + jn;
      const cc = (i + 1) * RAD + j;
      const d = (i + 1) * RAD + jn;
      indices.push(a, cc, b);
      indices.push(b, cc, d);
    }
  }
  tip.copy(end);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

// ---------------------------------------------------------------------------
// BODY shader: dark abyssal silhouette + fresnel rim + a cyan KEY cast by the
// lure (uses the lure's live world position so the side facing it brightens).
// The mouth cavity is darkened, teeth bias bright. Tail undulates via `spine`.
// ---------------------------------------------------------------------------
const bodyVert = /* glsl */ `
  attribute float spine;
  attribute float mouthGlow;
  uniform float uTime;
  uniform float uSwayAmp;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying float vSpine;
  varying float vMouth;

  void main() {
    vSpine = spine;
    vMouth = mouthGlow;
    vec3 pos = position;

    // Undulate the rear of the body left/right; ramp from mid-body to the tail
    // so it reads as a slow, heavy sweep rather than the whole fish wagging.
    float t = smoothstep(0.45, 1.0, spine);
    float wave = sin(uTime * 1.3 - spine * 3.4);
    float yaw = wave * t * uSwayAmp;
    float c = cos(yaw);
    float s = sin(yaw);
    float px = pos.x;
    float pz = pos.z;
    pos.x = px * c - pz * s;
    pos.z = px * s + pz * c;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const bodyFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uBody;
  uniform vec3 uBelly;
  uniform vec3 uRim;
  uniform vec3 uLureColor;
  uniform vec3 uTooth;
  uniform vec3 uLurePos;     // lure world position (the local key light)
  uniform vec3 uCamPos;
  uniform float uRimStrength;
  uniform float uLureKey;    // 0..1 strength of the lure's cast light
  uniform float uOpacity;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying float vSpine;
  varying float vMouth;

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(uCamPos - vWorldPos);
    float ndv = clamp(dot(N, V), 0.0, 1.0);

    // Counter-shaded base: darker belly, slightly lifted back.
    float up = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(uBelly, uBody, up);

    // --- Lure key light: a point light at the lure casting cyan onto the face.
    vec3 toLure = uLurePos - vWorldPos;
    float dist = length(toLure);
    vec3 Ld = toLure / max(dist, 0.001);
    float lambert = clamp(dot(N, Ld), 0.0, 1.0);
    // Inverse-falloff so only nearby surfaces (the head/face) catch it.
    float falloff = 1.0 / (1.0 + dist * dist * 0.55);
    col += uLureColor * lambert * falloff * uLureKey * 1.6;

    // Fresnel rim: cool cyan silhouette edge, a hair stronger toward the tail.
    float fres = pow(1.0 - ndv, 4.0);
    float tailBias = 0.7 + 0.3 * vSpine;
    col += uRim * fres * uRimStrength * tailBias;

    // Mouth + teeth: tagged via the mouthGlow attribute.
    //   ~2 -> deep dark gullet (recessed cavity behind the jaws)
    //   ~3 -> pale fang, catching the lure key + a soft self-light so the
    //         menacing grin reads even in the abyssal dark.
    if (vMouth > 2.5) {
      vec3 fang = uTooth * (0.5 + 0.5 * lambert * falloff);
      fang += uLureColor * lambert * falloff * uLureKey * 0.6;
      col = fang;
    } else if (vMouth > 1.5) {
      col *= 0.22;                       // deep dark gullet
      col += uLureColor * lambert * falloff * uLureKey * 0.3; // faint lit throat
    }

    gl_FragColor = vec4(col, uOpacity);
  }
`;

// Illicium stalk: dark, with a faint glow toward the tip (proximity to lure).
const stalkVert = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const stalkFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uBody;
  uniform vec3 uLureColor;
  uniform vec3 uLurePos;
  uniform vec3 uCamPos;
  uniform float uLureKey;
  uniform float uOpacity;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(uCamPos - vWorldPos);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    float dist = length(uLurePos - vWorldPos);
    float prox = 1.0 / (1.0 + dist * dist * 4.0); // glow ramps toward the tip
    vec3 col = uBody * 0.6 + uLureColor * fres * 0.3;
    col += uLureColor * prox * uLureKey * 0.9;
    gl_FragColor = vec4(col, uOpacity);
  }
`;

// Lure core: a self-glowing additive sphere. Hot white-ish center -> bio-aqua.
const lureVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const lureFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uLureColor;
  uniform float uPulse;   // 0..1 brightness pulse
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float ndv = clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
    // Bright facing center fading to a cyan rim; hot white nucleus.
    float core = pow(ndv, 1.4);
    vec3 col = mix(uLureColor, vec3(1.0), core * 0.7);
    float bright = (0.9 + uPulse * 0.6);
    gl_FragColor = vec4(col * bright, uOpacity);
  }
`;

// Soft camera-facing halo around the lure (additive sprite, radial falloff).
const haloVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uLureColor;
  uniform float uPulse;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 d = vUv - 0.5;
    float r = length(d) * 2.0;
    if (r > 1.0) discard;
    float halo = pow(1.0 - r, 2.2);
    float glow = pow(1.0 - r, 5.0);
    float a = (halo * 0.5 + glow * 0.9) * uOpacity;
    vec3 col = mix(uLureColor, vec3(1.0), glow * 0.6);
    float bright = 0.8 + uPulse * 0.5;
    gl_FragColor = vec4(col * bright, a);
  }
`;

// One slow closed Catmull-Rom loop. Coordinates are LOCAL to the group (slid to
// the live camera depth each frame). A small, lazy path that keeps the angler
// lurking in frame: it drifts a little, turns slowly, never crosses itself.
function buildLoop(): THREE.CatmullRomCurve3 {
  const rng = makeRng(0xa17ce5);
  const radiusX = 4.5 + rng() * 1.5;
  const radiusZ = 2.5 + rng() * 1.5;
  const yWobble = 1.0 + rng() * 0.6;
  const zOff = -14 - rng() * 3; // sit out in front of the camera (camera z ~ 8)
  const pts: THREE.Vector3[] = [];
  const N = 7;
  const seedA = rng() * Math.PI * 2;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + seedA;
    const x = Math.cos(a) * radiusX;
    const z = Math.sin(a) * radiusZ + zOff;
    const y = Math.sin(a * 1.5 + seedA) * yWobble - 1.0; // hangs a touch low
    pts.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);
}

// Convenience: build a Color uniform from a 0..1 rgb tuple.
function color3(c: readonly [number, number, number]): THREE.Color {
  return new THREE.Color(c[0], c[1], c[2]);
}

export default function Anglerfish({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null); // path-following + orientation
  const lureGroupRef = useRef<THREE.Group>(null); // bobs the lure on the stalk tip

  const bodyMatRef = useRef<THREE.ShaderMaterial>(null);
  const stalkMatRef = useRef<THREE.ShaderMaterial>(null);
  const lureMatRef = useRef<THREE.ShaderMaterial>(null);
  const haloMatRef = useRef<THREE.ShaderMaterial>(null);
  const haloRef = useRef<THREE.Mesh>(null); // billboard the halo to the camera

  // Smoothed band intensity (0 off-zone .. 1 deep in writing) so fades glide.
  const intensity = useRef(0);
  const clockRef = useRef(0);

  // Lure tip (body-local) discovered while building the stalk.
  const stalkTip = useMemo(() => new THREE.Vector3(), []);
  const bodyGeo = useMemo(() => buildBodyGeometry(), []);
  const stalkGeo = useMemo(() => buildStalkGeometry(stalkTip), [stalkTip]);
  // Teeth are baked into the body geometry and tagged via the `mouthGlow`
  // attribute (glow=3), so the body fragment shader paints the fangs pale +
  // lure-lit in a single pass. No separate tooth draw needed.
  const loop = useMemo(() => buildLoop(), []);

  // Scratch objects reused every frame (never allocate inside useFrame).
  const scratch = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      ahead: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      qYaw: new THREE.Quaternion(),
      qRoll: new THREE.Quaternion(),
      fwdAxis: new THREE.Vector3(1, 0, 0),
      lureWorld: new THREE.Vector3(),
    }),
    [],
  );

  const bodyUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSwayAmp: { value: 0.1 },
      uBody: { value: color3(BODY_DARK) },
      uBelly: { value: color3(BODY_BELLY) },
      uRim: { value: color3(RIM_CYAN) },
      uLureColor: { value: color3(LURE_CYAN) },
      uTooth: { value: color3(TOOTH_COLOR) },
      uLurePos: { value: new THREE.Vector3() },
      uCamPos: { value: new THREE.Vector3() },
      uRimStrength: { value: 0 },
      uLureKey: { value: 0 },
      uOpacity: { value: 0 },
    }),
    [],
  );

  const stalkUniforms = useMemo(
    () => ({
      uBody: { value: color3(BODY_DARK) },
      uLureColor: { value: color3(LURE_CYAN) },
      uLurePos: { value: new THREE.Vector3() },
      uCamPos: { value: new THREE.Vector3() },
      uLureKey: { value: 0 },
      uOpacity: { value: 0 },
    }),
    [],
  );

  const lureUniforms = useMemo(
    () => ({
      uLureColor: { value: color3(LURE_CYAN) },
      uPulse: { value: 0 },
      uOpacity: { value: 0 },
    }),
    [],
  );

  const haloUniforms = useMemo(
    () => ({
      uLureColor: { value: color3(LURE_CYAN) },
      uPulse: { value: 0 },
      uOpacity: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = progress.get();

    // --- Global band fade. Triangular ramp across the feathered writing band.
    let target = 0;
    if (p >= BAND_START - FEATHER && p <= BAND_END + FEATHER) {
      const up = clamp01((p - (BAND_START - FEATHER)) / FEATHER);
      const down = clamp01((BAND_END + FEATHER - p) / FEATHER);
      target = Math.min(up, down); // 1 fully inside, 0 at the feather edges
    }
    intensity.current = lerp(intensity.current, target, Math.min(1, delta * 2));
    const vis = intensity.current;

    // Off-zone: hide + bail before any per-frame math. Costs ~nothing.
    if (vis < 0.01 && target === 0) {
      if (group.visible) group.visible = false;
      return;
    }
    group.visible = true;

    clockRef.current += delta;
    const t = clockRef.current;

    // --- Follow the slow loop, centered on the live camera depth -------------
    // The loop is authored around the origin; we add the camera's y/z so the
    // angler lurks in frame through the whole band rather than drifting past in
    // one beat. (x is world-absolute since the camera doesn't pan horizontally.)
    const speed = 0.018; // very slow, menacing drift
    const u0 = (t * speed) % 1;
    loop.getPointAt(u0, scratch.pos);
    const uAhead = (u0 + 0.03) % 1;
    loop.getPointAt(uAhead, scratch.ahead);

    group.position.set(
      scratch.pos.x,
      state.camera.position.y + scratch.pos.y,
      state.camera.position.z + scratch.pos.z,
    );

    // Orient toward the look-ahead point. lookAt aims local -z at the target;
    // our fish forward axis is +x, so build lookAt then yaw +90deg (+x -> -z).
    scratch.ahead.set(
      scratch.ahead.x,
      state.camera.position.y + scratch.ahead.y,
      state.camera.position.z + scratch.ahead.z,
    );
    scratch.m.lookAt(group.position, scratch.ahead, scratch.up);
    scratch.q.setFromRotationMatrix(scratch.m);
    scratch.qYaw.setFromAxisAngle(scratch.up, Math.PI * 0.5);
    scratch.q.multiply(scratch.qYaw);
    // Gentle banking roll into the drift.
    const roll = Math.sin(t * 0.4) * 0.08;
    scratch.qRoll.setFromAxisAngle(scratch.fwdAxis, roll);
    scratch.q.multiply(scratch.qRoll);
    group.quaternion.copy(scratch.q);

    // --- Lure bob: the lure group sits at the stalk tip and bobs/sways. -------
    const lureGroup = lureGroupRef.current;
    if (lureGroup) {
      const bobX = Math.sin(t * 1.1) * 0.06;
      const bobY = Math.sin(t * 1.6 + 1.0) * 0.08;
      const bobZ = Math.cos(t * 0.9) * 0.05;
      lureGroup.position.set(stalkTip.x + bobX, stalkTip.y + bobY, stalkTip.z + bobZ);
      // The parent group's transform was just set imperatively this frame, so
      // refresh world matrices before reading the lure's world position (used as
      // the key-light source by the body/stalk shaders). Without this the key
      // would lag one frame behind the fish's motion.
      group.updateWorldMatrix(false, false);
      lureGroup.updateWorldMatrix(true, false);
      lureGroup.getWorldPosition(scratch.lureWorld);
    }

    // Billboard the halo to face the camera (so the glow disc always reads).
    if (haloRef.current) {
      haloRef.current.quaternion.copy(state.camera.quaternion);
    }

    // --- Drive uniforms ------------------------------------------------------
    // Lure pulse: a slow breathing glow plus a faint flicker.
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.4) * 0.7 + 0.15 * Math.sin(t * 5.3);
    const rimStrength = lerp(0.25, 0.55, clamp01(p)) * vis;
    const lureKey = vis; // the lure key tracks overall presence
    const opacity = lerp(0, 1, vis);
    const lureOpacity = lerp(0, 1, clamp01(vis * 1.2)); // lure leads the fade-in

    const bm = bodyMatRef.current;
    if (bm) {
      const uu = bm.uniforms;
      uu.uTime.value = t;
      uu.uSwayAmp.value = 0.1;
      uu.uRimStrength.value = rimStrength;
      uu.uLureKey.value = lureKey;
      uu.uOpacity.value = opacity;
      uu.uCamPos.value.copy(state.camera.position);
      uu.uLurePos.value.copy(scratch.lureWorld);
    }
    const sm = stalkMatRef.current;
    if (sm) {
      const uu = sm.uniforms;
      uu.uLureKey.value = lureKey;
      uu.uOpacity.value = opacity;
      uu.uCamPos.value.copy(state.camera.position);
      uu.uLurePos.value.copy(scratch.lureWorld);
    }
    const lm = lureMatRef.current;
    if (lm) {
      lm.uniforms.uPulse.value = pulse;
      lm.uniforms.uOpacity.value = lureOpacity;
    }
    const hm = haloMatRef.current;
    if (hm) {
      hm.uniforms.uPulse.value = pulse;
      hm.uniforms.uOpacity.value = lureOpacity * 0.85;
    }
  });

  return (
    <group ref={groupRef} visible={false} renderOrder={3}>
      {/* BODY (dark) */}
      <mesh geometry={bodyGeo} frustumCulled={false}>
        <shaderMaterial
          ref={bodyMatRef}
          vertexShader={bodyVert}
          fragmentShader={bodyFrag}
          uniforms={bodyUniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>

      {/* ILLICIUM stalk */}
      <mesh geometry={stalkGeo} frustumCulled={false} renderOrder={4}>
        <shaderMaterial
          ref={stalkMatRef}
          vertexShader={stalkVert}
          fragmentShader={stalkFrag}
          uniforms={stalkUniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>

      {/* LURE + halo (bobbing at the stalk tip) */}
      <group ref={lureGroupRef}>
        {/* soft halo billboard (drawn first, behind the core) */}
        <mesh ref={haloRef} renderOrder={5}>
          <planeGeometry args={[1.1, 1.1]} />
          <shaderMaterial
            ref={haloMatRef}
            vertexShader={haloVert}
            fragmentShader={haloFrag}
            uniforms={haloUniforms}
            transparent
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
            fog={false}
          />
        </mesh>
        {/* glowing core */}
        <mesh renderOrder={6}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <shaderMaterial
            ref={lureMatRef}
            vertexShader={lureVert}
            fragmentShader={lureFrag}
            uniforms={lureUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog={false}
          />
        </mesh>
      </group>
    </group>
  );
}
