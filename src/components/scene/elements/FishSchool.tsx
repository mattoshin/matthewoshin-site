"use client";

/**
 * FishSchool - a school of ~320 silvery fish that swims and turns together
 * across the sunlit-shallows-to-twilight band (zones `about` + `projects`).
 *
 * Everything is ONE InstancedMesh:
 *   - geometry: a procedural low-poly fish body (a flattened, elongated diamond
 *     with a tiny tail flick), built in a BufferGeometry. No external assets.
 *   - per-instance simulation: curl-noise drift + soft cohesion toward a slowly
 *     wandering school center, so the shoal banks and turns as one. Each fish is
 *     oriented to its own velocity each frame, then written into instanceMatrix.
 *   - material: a custom ShaderMaterial giving brushed-silver bodies with a faint
 *     cyan fresnel rim that strengthens with depth, a subtle counter-shading
 *     (darker belly), and a per-fish tail wiggle baked into the vertex shader.
 *
 * Zone-gating: the school is only simulated + visible inside its depth band and
 * a small feather around it. Off-band the group goes `.visible = false` and the
 * heavy per-instance loop early-returns, so it costs ~nothing elsewhere.
 *
 * Self-contained SceneElement per the contract in scene/types.ts. Reads the
 * shared `progress` accessor imperatively each frame; never subscribes.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

const COUNT = 320;

// Deterministic PRNG (mulberry32). The React Compiler forbids Math.random()
// during render, and a fixed seed makes the initial shoal layout reproducible.
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

// The school lives across `about` (0.16..0.32) and `projects` (0.32..0.5).
// Feather a little past each edge so fish swim in/out rather than pop.
const BAND_START = 0.16;
const BAND_END = 0.5;
const FEATHER = 0.06;

// World-space slab the camera passes through while in the band. The camera
// descends y: 0 -> -60 across progress 0..1, so the band centers near y ~ -19.8.
// We keep the school roughly camera-locked in y (re-centered each frame) so it is
// always in view while within the band, and let it drift in a wide x/z volume.
const VOL_X = 26; // horizontal spread
const VOL_Y = 11; // vertical spread (kept shallow: a flat shoal reads better)
const VOL_Z = 22; // depth spread (camera looks down -z toward the school)
const Z_CENTER = -16; // sit in front of the camera (camera z = 8)

// Palette.
const SILVER = hexToRgb01("#BFD8E0"); // cool silvery body
const BELLY = hexToRgb01("#23566B"); // shaded belly for counter-shading
const RIM = hexToRgb01("#3FE0E6"); // bio-cyan fresnel rim
const HILITE = hexToRgb01("#8FE8FF"); // bio-lumen specular pop

// ---------------------------------------------------------------------------
// Procedural low-poly fish geometry: a flattened elongated diamond + tail fin.
// Built nose(+x) to tail(-x); thin in z. A `vSeg` attribute (0 at nose .. 1 at
// tail tip) lets the vertex shader add a travelling tail wiggle.
// ---------------------------------------------------------------------------
function buildFishGeometry(): THREE.BufferGeometry {
  // Spine cross-sections from nose to tail-base: [x, halfHeight, halfWidth].
  const sections: Array<[number, number, number]> = [
    [0.5, 0.0, 0.0], // nose
    [0.34, 0.12, 0.05], // head
    [0.1, 0.2, 0.09], // shoulders (widest)
    [-0.16, 0.15, 0.07], // mid
    [-0.4, 0.07, 0.03], // peduncle (tail base)
  ];

  const positions: number[] = [];
  const normals: number[] = [];
  const segs: number[] = [];

  // Each cross-section is a 4-vertex diamond ring: top, right, bottom, left.
  const ringFor = (s: [number, number, number]) => {
    const [x, h, w] = s;
    return [
      [x, h, 0], // top
      [x, 0, w], // right
      [x, -h, 0], // bottom
      [x, 0, -w], // left
    ] as const;
  };

  const segParam = (i: number) => i / (sections.length - 1); // 0..1 along body

  // Stitch quads (two tris) between consecutive rings.
  for (let i = 0; i < sections.length - 1; i++) {
    const a = ringFor(sections[i]);
    const b = ringFor(sections[i + 1]);
    const sa = segParam(i);
    const sb = segParam(i + 1);
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4;
      // quad: a[k], a[k2], b[k2], b[k]
      const quad = [
        [a[k], sa],
        [a[k2], sa],
        [b[k2], sb],
        [b[k], sb],
      ] as const;
      const tris = [quad[0], quad[1], quad[2], quad[0], quad[2], quad[3]];
      for (const [v, seg] of tris) {
        positions.push(v[0], v[1], v[2]);
        normals.push(0, 0, 0); // recomputed below
        segs.push(seg);
      }
    }
  }

  // Tail fin: a flat forked triangle pair from the peduncle back to the tail tip.
  const peduncleX = sections[sections.length - 1][0];
  const tailTipX = -0.62;
  const finH = 0.2;
  const addTri = (
    p0: readonly [number, number, number],
    p1: readonly [number, number, number],
    p2: readonly [number, number, number],
    seg: number,
  ) => {
    for (const v of [p0, p1, p2]) {
      positions.push(v[0], v[1], v[2]);
      normals.push(0, 0, 0);
      segs.push(seg);
    }
  };
  // upper fin lobe
  addTri([peduncleX, 0.05, 0], [tailTipX, finH, 0], [tailTipX, 0.02, 0], 1.0);
  // lower fin lobe
  addTri([peduncleX, -0.05, 0], [tailTipX, -0.02, 0], [tailTipX, -finH, 0], 1.0);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("aSeg", new THREE.Float32BufferAttribute(segs, 1));
  // Per-face normals from the geometry so the low-poly facets catch light.
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

// ---------------------------------------------------------------------------
// Shaders. Vertex bakes a per-instance tail wiggle (stronger toward the tail).
// Fragment does counter-shaded silver + depth-driven cyan fresnel rim.
// ---------------------------------------------------------------------------
const vertexShader = /* glsl */ `
  attribute float aSeg;       // 0 nose .. 1 tail tip
  attribute float aPhase;     // per-instance swim phase
  attribute float aSpeed;     // per-instance tail beat speed

  uniform float uTime;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vBelly;       // -1 belly .. +1 back, in local space

  void main() {
    vec3 pos = position;

    // Travelling body wave: yaw the body left/right, ramping toward the tail.
    float wave = sin(uTime * aSpeed + aPhase + aSeg * 3.4);
    float amp = aSeg * aSeg * 0.16;       // negligible at the nose, max at tail
    pos.z += wave * amp;

    vBelly = clamp(position.y / 0.2, -1.0, 1.0);

    // Instance + model transforms (instanceMatrix is provided by InstancedMesh).
    vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);
    // Normal through instance rotation (uniform scale assumed -> mat3 is fine).
    mat3 nm = mat3(modelMatrix) * mat3(instanceMatrix);
    vNormalW = normalize(nm * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uSilver;
  uniform vec3 uBelly;
  uniform vec3 uRim;
  uniform vec3 uHilite;
  uniform float uDepth;   // 0 (shallow) .. 1 (deep): rim glow grows with depth
  uniform float uFade;    // 0..1 group opacity

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vBelly;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);

    // Soft top-down key light (sun filtering from the surface).
    vec3 L = normalize(vec3(0.15, 1.0, 0.35));
    float diff = clamp(dot(N, L), 0.0, 1.0);

    // Counter-shading: darker belly, brighter back -> classic fish silvering.
    vec3 base = mix(uBelly, uSilver, smoothstep(-1.0, 1.0, vBelly));
    vec3 col = base * (0.45 + 0.55 * diff);

    // Brushed-silver glints: a tight spec lobe gives a metallic flash as fish bank.
    float spec = pow(clamp(dot(reflect(-L, N), V), 0.0, 1.0), 24.0);
    col += uHilite * spec * 0.6;

    // Fresnel cyan rim, strengthening as we descend into twilight.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.5);
    col += uRim * fres * (0.35 + uDepth * 0.85);

    gl_FragColor = vec4(col, uFade);
  }
`;

// Per-instance simulation buffers (mutated every frame; held in a ref).
interface Sim {
  pos: Float32Array;
  vel: Float32Array;
  phase: Float32Array;
  speed: Float32Array;
  scale: Float32Array;
}

function buildSim(): Sim {
  const rng = makeRng(0x5eedf157);
  const pos = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT * 3);
  const phase = new Float32Array(COUNT);
  const speed = new Float32Array(COUNT);
  const scale = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (rng() - 0.5) * VOL_X;
    pos[i * 3 + 1] = (rng() - 0.5) * VOL_Y;
    pos[i * 3 + 2] = (rng() - 0.5) * VOL_Z;
    // Initial velocity heading roughly +x with small jitter.
    vel[i * 3] = 0.5 + rng() * 0.3;
    vel[i * 3 + 1] = (rng() - 0.5) * 0.1;
    vel[i * 3 + 2] = (rng() - 0.5) * 0.3;
    phase[i] = rng() * Math.PI * 2;
    speed[i] = 6 + rng() * 4; // tail-beat frequency
    scale[i] = 0.7 + rng() * 0.7; // size variety
  }
  return { pos, vel, phase, speed, scale };
}

// Reusable scratch objects -> zero per-frame allocation.
interface Scratch {
  m: THREE.Matrix4;
  q: THREE.Quaternion;
  up: THREE.Vector3;
  fwd: THREE.Vector3;
  right: THREE.Vector3;
  newUp: THREE.Vector3;
  basis: THREE.Matrix4;
  sclV: THREE.Vector3;
  posV: THREE.Vector3;
  center: THREE.Vector3;
}

function buildScratch(): Scratch {
  return {
    m: new THREE.Matrix4(),
    q: new THREE.Quaternion(),
    up: new THREE.Vector3(0, 1, 0),
    fwd: new THREE.Vector3(),
    right: new THREE.Vector3(),
    newUp: new THREE.Vector3(),
    basis: new THREE.Matrix4(),
    sclV: new THREE.Vector3(),
    posV: new THREE.Vector3(),
    center: new THREE.Vector3(),
  };
}

// 3D curl-ish flow built from cheap layered sines (no texture, no deps). Returns
// a divergence-light flow vector (the curl of a sine potential) -> swirly drift.
function flow(
  x: number,
  y: number,
  z: number,
  t: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  const a = Math.sin(x * 0.18 + t * 0.6) + Math.cos(z * 0.21 - t * 0.5);
  const b = Math.sin(y * 0.25 - t * 0.4) + Math.cos(x * 0.16 + t * 0.45);
  const c = Math.sin(z * 0.19 + t * 0.55) + Math.cos(y * 0.22 - t * 0.6);
  out.set(b - c, c - a, a - b);
  return out;
}

export default function FishSchool({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => buildFishGeometry(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSilver: { value: new THREE.Color(SILVER[0], SILVER[1], SILVER[2]) },
      uBelly: { value: new THREE.Color(BELLY[0], BELLY[1], BELLY[2]) },
      uRim: { value: new THREE.Color(RIM[0], RIM[1], RIM[2]) },
      uHilite: { value: new THREE.Color(HILITE[0], HILITE[1], HILITE[2]) },
      uDepth: { value: 0 },
      uFade: { value: 0 },
    }),
    [],
  );

  // Per-instance simulation buffers + reusable scratch objects. These are
  // mutated every frame, so per the React Compiler they live in refs (which the
  // linter permits us to mutate) and are lazily built on the first frame rather
  // than via useMemo (whose return value must not be mutated inside useFrame).
  const simRef = useRef<Sim | null>(null);
  const scratchRef = useRef<Scratch | null>(null);

  // Attach per-instance attributes (phase/speed) once the mesh exists.
  const attrsReady = useRef(false);

  // Slowly wandering school center (in the group's local x/z), drives cohesion.
  const centerPhase = useRef(4.2);

  // Smoothed band fade so scroll jumps glide instead of snapping.
  const fade = useRef(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!group || !mesh || !mat) return;

    const p = progress.get();

    // ---- Zone gate: visible only inside the band (+feather). Off-band: bail. ----
    const inFeatheredBand = p > BAND_START - FEATHER && p < BAND_END + FEATHER;

    // Fade rises inside the band, eases to 0 at the feathered edges.
    const edgeIn = clamp01((p - (BAND_START - FEATHER)) / FEATHER);
    const edgeOut = clamp01(((BAND_END + FEATHER) - p) / FEATHER);
    const targetFade = inFeatheredBand ? Math.min(edgeIn, edgeOut) : 0;
    fade.current = lerp(fade.current, targetFade, Math.min(1, delta * 3));

    if (!inFeatheredBand && fade.current < 0.01) {
      if (group.visible) group.visible = false;
      return; // heavy sim skipped entirely off-band
    }
    group.visible = true;

    // Lazily build the mutable sim + scratch buffers on first heavy frame.
    if (!simRef.current) simRef.current = buildSim();
    if (!scratchRef.current) scratchRef.current = buildScratch();
    const sim = simRef.current;
    const scratch = scratchRef.current;

    // One-time per-instance attribute upload (phase/speed) now that mesh exists.
    if (!attrsReady.current) {
      mesh.geometry.setAttribute(
        "aPhase",
        new THREE.InstancedBufferAttribute(sim.phase, 1),
      );
      mesh.geometry.setAttribute(
        "aSpeed",
        new THREE.InstancedBufferAttribute(sim.speed, 1),
      );
      attrsReady.current = true;
    }

    const t = state.clock.elapsedTime;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uFade.value = fade.current;
    // Depth term: 0 at band top (sunlit) -> 1 at band bottom (twilight).
    mat.uniforms.uDepth.value = clamp01(
      (p - BAND_START) / (BAND_END - BAND_START),
    );

    // Keep the shoal centered on the camera's depth so it stays in frame while
    // we pass through. Group y tracks the camera y; x/z volume is local.
    group.position.y = state.camera.position.y;
    group.position.z = Z_CENTER;

    // Wandering school attractor (cohesion target) inside the local volume.
    const cp = (centerPhase.current += delta * 0.12);
    scratch.center.set(
      Math.sin(cp * 0.7) * VOL_X * 0.32,
      Math.sin(cp * 0.5 + 1.3) * VOL_Y * 0.3,
      Math.cos(cp * 0.6) * VOL_Z * 0.32,
    );

    const dt = Math.min(delta, 0.05); // clamp to avoid blowups after a tab stall
    const { pos, vel } = sim;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const px = pos[ix];
      const py = pos[ix + 1];
      const pz = pos[ix + 2];

      // 1) Curl-noise drift (the "current").
      flow(px, py, pz, t, scratch.fwd);
      let ax = scratch.fwd.x * 0.55;
      let ay = scratch.fwd.y * 0.4;
      let az = scratch.fwd.z * 0.55;

      // 2) Cohesion: gentle pull toward the wandering school center.
      ax += (scratch.center.x - px) * 0.22;
      ay += (scratch.center.y - py) * 0.22;
      az += (scratch.center.z - pz) * 0.22;

      // 3) Soft containment: turn back before leaving the volume.
      ax += -px * (Math.abs(px) > VOL_X * 0.5 ? 0.9 : 0.04);
      ay += -py * (Math.abs(py) > VOL_Y * 0.5 ? 0.9 : 0.06);
      az += -pz * (Math.abs(pz) > VOL_Z * 0.5 ? 0.9 : 0.04);

      // Integrate velocity with damping; this is what makes the school bank.
      let vx = vel[ix] + ax * dt;
      let vy = vel[ix + 1] + ay * dt;
      let vz = vel[ix + 2] + az * dt;
      const damp = 0.92;
      vx *= damp;
      vy *= damp;
      vz *= damp;

      // Clamp speed so fish keep a believable, even cruising pace.
      const sp = Math.hypot(vx, vy, vz);
      const maxSp = 3.2;
      const minSp = 1.0;
      if (sp > maxSp) {
        const k = maxSp / sp;
        vx *= k;
        vy *= k;
        vz *= k;
      } else if (sp < minSp && sp > 1e-4) {
        const k = minSp / sp;
        vx *= k;
        vy *= k;
        vz *= k;
      }
      vel[ix] = vx;
      vel[ix + 1] = vy;
      vel[ix + 2] = vz;

      const nx = px + vx * dt;
      const ny = py + vy * dt;
      const nz = pz + vz * dt;
      pos[ix] = nx;
      pos[ix + 1] = ny;
      pos[ix + 2] = nz;

      // ---- Orient to velocity: build a RIGHT-HANDED basis ----
      // Fish local axes: +x = nose (forward), +y = back (up), +z = side (right).
      // For a valid rotation (det +1, normals intact) we need z = x cross y.
      scratch.fwd.set(vx, vy, vz);
      if (scratch.fwd.lengthSq() < 1e-6) scratch.fwd.set(1, 0, 0);
      scratch.fwd.normalize();
      // side = fwd x worldUp; newUp = side x fwd  ->  fwd x newUp == side.
      scratch.right.copy(scratch.fwd).cross(scratch.up);
      if (scratch.right.lengthSq() < 1e-6) scratch.right.set(0, 0, 1);
      scratch.right.normalize();
      scratch.newUp.copy(scratch.right).cross(scratch.fwd).normalize();

      // Columns: x-axis=fwd, y-axis=newUp, z-axis=side. Right-handed (det +1).
      scratch.basis.makeBasis(scratch.fwd, scratch.newUp, scratch.right);
      scratch.q.setFromRotationMatrix(scratch.basis);

      const s = sim.scale[i];
      scratch.sclV.set(s, s, s);
      scratch.posV.set(nx, ny, nz);
      scratch.m.compose(scratch.posV, scratch.q, scratch.sclV);
      mesh.setMatrixAt(i, scratch.m);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef} visible={false}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, undefined, COUNT]}
        frustumCulled={false}
      >
        <shaderMaterial
          ref={matRef}
          attach="material"
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </instancedMesh>
    </group>
  );
}
