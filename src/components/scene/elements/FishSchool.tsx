"use client";

/**
 * FishSchool - a calm, cohesive school of ~160 sleek silver-blue fish that drifts
 * and banks together across the sunlit-shallows-to-twilight band (zones `about` +
 * `projects`). The brief: it must READ AS FISH at a glance, never a glowing cloud.
 *
 * Everything is ONE InstancedMesh:
 *   - geometry: a procedural low-poly fish with a recognizable SIDE PROFILE - a
 *     rounded front tapering to a forked tail, a small dorsal-fin hint, and a tiny
 *     bit of belly volume. Built nose(+x) to tail(-x), legible at a glance.
 *   - per-instance simulation: curl-noise drift + soft cohesion toward a slowly
 *     wandering school center, so the shoal banks and turns as one. Each fish is
 *     oriented to its own velocity each frame, then written into instanceMatrix.
 *   - material: OPAQUE silver-blue bodies (pale steel ~#AEC6D6) painted in the
 *     fragment shader: a subtly darker back, a lighter belly (counter-shading), a
 *     tiny dark eye, and only a WHISPER of cool rim. NOT additive, NOT a glow.
 *     `depthWrite` stays ON so fish sort correctly; `transparent` is used ONLY to
 *     fade the whole school in/out at the band's feathered edges (alpha rides the
 *     fade uniform and is ~1 through the body of the band).
 *
 * Placement: the school is biased toward the SIDES / mid-background so it reads as
 * ambient life AROUND the centered content column, never piled on top of the text.
 *
 * Zone-gating: the school is only simulated + visible inside its depth band and a
 * small feather around it. Off-band the group goes `.visible = false` and the
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

// Fewer, larger fish so each one reads (brief: ~140-180, down from ~320).
const COUNT = 160;

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
const VOL_X = 30; // horizontal spread (wide: the shoal lives out to the sides)
const VOL_Y = 12; // vertical spread (kept shallow: a flat shoal reads better)
const VOL_Z = 22; // depth spread (camera looks down -z toward the school)
const Z_CENTER = -18; // sit a touch further back so fish read as ambient depth

// Keep the school OUT of the centered content column. Fish inside this central
// half-width get a gentle outward bias so they part around the text/cards.
const CLEAR_HALF_X = 7; // half-width of the kept-clear central corridor

// Palette: sleek silver-blue / pale steel, NOT cyan.
const STEEL = hexToRgb01("#AEC6D6"); // pale steel mid-tone (the body's key color)
const BACK = hexToRgb01("#6E94AB"); // subtly darker top/back for counter-shading
const BELLY = hexToRgb01("#E4EEF4"); // lighter belly
const EYE = hexToRgb01("#16242C"); // tiny dark eye
const RIM = hexToRgb01("#BFE6EE"); // a WHISPER of cool rim (no glow)

// ---------------------------------------------------------------------------
// Procedural low-poly fish geometry: a recognizable side profile.
//
// Built nose(+x) to tail(-x). Cross-sections are 4-vertex diamond rings stitched
// into quads; the profile is rounded at the front and tapers to a thin peduncle,
// then a forked tail fin and a small dorsal-fin hint are welded on. The body is
// slightly chunkier than a flat diamond so it reads as a solid shape, not a sliver.
//
// Two attributes ride along:
//   aBody : 0 at the nose .. 1 at the tail tip -> drives the tail wiggle + eye.
//   aFin  : 1 on fin geometry, 0 on the body  -> lets the shader shade fins.
// ---------------------------------------------------------------------------
function buildFishGeometry(): THREE.BufferGeometry {
  // Spine cross-sections nose -> tail base: [x, halfHeight, halfWidth].
  // Rounded front, deepest just behind the head, tapering to a thin tail base.
  // halfWidth (z) is kept modest so the fish stays sleek but not paper-thin.
  const sections: Array<[number, number, number]> = [
    [0.52, 0.03, 0.02], // rounded nose tip
    [0.42, 0.13, 0.06], // head
    [0.24, 0.21, 0.09], // shoulders (deepest, widest)
    [0.0, 0.19, 0.08], // mid
    [-0.24, 0.12, 0.05], // rear
    [-0.42, 0.05, 0.025], // peduncle (tail base)
  ];

  const positions: number[] = [];
  const normals: number[] = [];
  const body: number[] = [];
  const fin: number[] = [];

  // 4-vertex diamond ring (top, right, bottom, left) for a cross-section.
  const ringFor = (s: [number, number, number]) => {
    const [x, h, w] = s;
    return [
      [x, h, 0], // top (back)
      [x, 0, w], // right
      [x, -h, 0], // bottom (belly)
      [x, 0, -w], // left
    ] as const;
  };

  const bodyParam = (i: number) => i / (sections.length - 1); // 0..1 along body

  // Stitch quads (two tris) between consecutive rings.
  for (let i = 0; i < sections.length - 1; i++) {
    const a = ringFor(sections[i]);
    const b = ringFor(sections[i + 1]);
    const ba = bodyParam(i);
    const bb = bodyParam(i + 1);
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4;
      const quad = [
        [a[k], ba],
        [a[k2], ba],
        [b[k2], bb],
        [b[k], bb],
      ] as const;
      const tris = [quad[0], quad[1], quad[2], quad[0], quad[2], quad[3]];
      for (const [v, bp] of tris) {
        positions.push(v[0], v[1], v[2]);
        normals.push(0, 0, 0); // recomputed below
        body.push(bp);
        fin.push(0);
      }
    }
  }

  const addTri = (
    p0: readonly [number, number, number],
    p1: readonly [number, number, number],
    p2: readonly [number, number, number],
    bp: number,
    isFin: number,
  ) => {
    for (const v of [p0, p1, p2]) {
      positions.push(v[0], v[1], v[2]);
      normals.push(0, 0, 0);
      body.push(bp);
      fin.push(isFin);
    }
  };

  // Forked tail fin (flat, in the z=0 plane), from the peduncle to the tail tip.
  // Two lobes with a notch between -> a clearly forked, triangular tail.
  const peduncleX = sections[sections.length - 1][0];
  const tailTipX = -0.66;
  const finH = 0.2;
  addTri([peduncleX, 0.045, 0], [tailTipX, finH, 0], [tailTipX, 0.02, 0], 1.0, 1);
  addTri([peduncleX, -0.045, 0], [tailTipX, -0.02, 0], [tailTipX, -finH, 0], 1.0, 1);

  // Small dorsal-fin hint: a low triangle along the back over the shoulders.
  addTri([0.28, 0.21, 0], [-0.04, 0.19, 0], [0.12, 0.31, 0], 0.4, 1);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("aBody", new THREE.Float32BufferAttribute(body, 1));
  geo.setAttribute("aFin", new THREE.Float32BufferAttribute(fin, 1));
  // Per-face normals so the low-poly facets catch the top-down key light.
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

// ---------------------------------------------------------------------------
// Shaders. Vertex bakes a gentle per-instance tail wiggle (stronger toward the
// tail). Fragment paints an OPAQUE counter-shaded silver-blue body with a tiny
// dark eye, shaded fins, and only a whisper of cool rim (no additive glow).
// ---------------------------------------------------------------------------
const vertexShader = /* glsl */ `
  attribute float aBody;      // 0 nose .. 1 tail tip
  attribute float aFin;       // 1 on fins, 0 on body
  attribute float aPhase;     // per-instance swim phase
  attribute float aSpeed;     // per-instance tail beat speed

  uniform float uTime;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vBody;        // pass-through nose..tail
  varying float vFin;         // pass-through fin flag
  varying vec3 vLocalPos;     // local position (for eye + belly shading)

  void main() {
    vec3 pos = position;

    // Travelling body wave: yaw the body left/right, ramping toward the tail.
    // Gentle amplitude -> a calm cruise, not a frantic flap.
    float wave = sin(uTime * aSpeed + aPhase + aBody * 3.2);
    float amp = aBody * aBody * 0.13;     // negligible at the nose, max at tail
    pos.z += wave * amp;

    vBody = aBody;
    vFin = aFin;
    vLocalPos = position;

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

  uniform vec3 uSteel;    // pale steel mid body
  uniform vec3 uBack;     // darker top/back
  uniform vec3 uBelly;    // lighter belly
  uniform vec3 uEye;      // tiny dark eye
  uniform vec3 uRim;      // whisper of cool rim
  uniform float uFade;    // 0..1 group opacity (band-edge fade ONLY)

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vBody;
  varying float vFin;
  varying vec3 vLocalPos;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);

    // Soft top-down key light (sun filtering down from the bright surface).
    vec3 L = normalize(vec3(0.18, 1.0, 0.35));
    float diff = clamp(dot(N, L), 0.0, 1.0);

    // Counter-shading from local height: darker back (top), lighter belly
    // (bottom), steel through the middle -> classic fish silvering, reads solid.
    float h = clamp(vLocalPos.y / 0.21, -1.0, 1.0); // -1 belly .. +1 back
    vec3 base = mix(uBelly, uSteel, smoothstep(-1.0, 0.0, h));
    base = mix(base, uBack, smoothstep(0.0, 1.0, h));

    // OPAQUE diffuse shading with a solid ambient floor so the shaded side never
    // goes muddy (and never disappears into the water).
    vec3 col = base * (0.6 + 0.45 * diff);

    // Tiny dark eye: a small dot just behind/above the nose, on the upper flank.
    vec2 eyeC = vec2(0.32, 0.07);            // (along-body, height) in local units
    float eyeD = distance(vec2(vLocalPos.x, vLocalPos.y), eyeC);
    float eye = 1.0 - smoothstep(0.024, 0.034, eyeD);
    col = mix(col, uEye, eye * (1.0 - vFin)); // never paint eyes on the fins

    // Fins: shade the membrane a touch darker so the silhouette reads.
    col = mix(col, uBack, vFin * 0.35);

    // A WHISPER of cool rim to lift the fish off the blue water - low, NOT a glow,
    // and capped so additive build-up can't bloom into a cloud.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    col += uRim * fres * 0.12;

    // OPAQUE through the band; alpha rides uFade ONLY to feather in/out at edges.
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
    // Bias the starting x toward the sides (push out of the central corridor) so
    // the school reads as ambient life flanking the content, not over it.
    const side = rng() < 0.5 ? -1 : 1;
    const xOut = CLEAR_HALF_X + rng() * (VOL_X * 0.5 - CLEAR_HALF_X);
    pos[i * 3] = side * xOut;
    pos[i * 3 + 1] = (rng() - 0.5) * VOL_Y;
    pos[i * 3 + 2] = (rng() - 0.5) * VOL_Z;
    // Initial velocity heading roughly +x with small jitter.
    vel[i * 3] = 0.5 + rng() * 0.3;
    vel[i * 3 + 1] = (rng() - 0.5) * 0.1;
    vel[i * 3 + 2] = (rng() - 0.5) * 0.3;
    phase[i] = rng() * Math.PI * 2;
    speed[i] = 5 + rng() * 3.5; // tail-beat frequency (calm cruise)
    scale[i] = 0.95 + rng() * 0.85; // larger fish, with size variety
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
      uSteel: { value: new THREE.Color(STEEL[0], STEEL[1], STEEL[2]) },
      uBack: { value: new THREE.Color(BACK[0], BACK[1], BACK[2]) },
      uBelly: { value: new THREE.Color(BELLY[0], BELLY[1], BELLY[2]) },
      uEye: { value: new THREE.Color(EYE[0], EYE[1], EYE[2]) },
      uRim: { value: new THREE.Color(RIM[0], RIM[1], RIM[2]) },
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
    const edgeOut = clamp01((BAND_END + FEATHER - p) / FEATHER);
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

    // Keep the shoal centered on the camera's depth so it stays in frame while
    // we pass through. Group y tracks the camera y; x/z volume is local.
    group.position.y = state.camera.position.y;
    group.position.z = Z_CENTER;

    // Wandering school attractor (cohesion target). Kept biased to one flank and
    // out of the central corridor so the shoal stays beside the content column.
    const cp = (centerPhase.current += delta * 0.12);
    scratch.center.set(
      Math.sin(cp * 0.7) * VOL_X * 0.4,
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

      // 3) Central-corridor clearance: if a fish strays into the kept-clear band
      // around the content column, nudge it outward so the school parts around
      // the text/cards instead of swimming over them.
      if (Math.abs(px) < CLEAR_HALF_X) {
        const dir = px >= 0 ? 1 : -1;
        ax += dir * (CLEAR_HALF_X - Math.abs(px)) * 0.55;
      }

      // 4) Soft containment: turn back before leaving the volume.
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
      const maxSp = 3.0;
      const minSp = 0.9;
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
        {/*
          OPAQUE bodies: depthWrite ON so fish sort correctly and never stack
          into a glowing cloud. `transparent` is kept solely so the whole school
          can feather in/out at the band edges via the uFade-driven alpha; alpha
          is ~1 through the body of the band. Single-sided is fine for a solid,
          closed body and halves overdraw vs DoubleSide.
        */}
        <shaderMaterial
          ref={matRef}
          attach="material"
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite
          side={THREE.FrontSide}
          fog={false}
        />
      </instancedMesh>
    </group>
  );
}
