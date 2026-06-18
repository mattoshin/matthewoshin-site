"use client";

/**
 * Clownfish - a small, playful group of 6 orange-and-white clownfish darting in
 * the sunlit shallows (the `about` zone), loosely huddled around a hint of a
 * swaying sea anemone.
 *
 * Two things live in one element:
 *
 *   1. The fish: ONE InstancedMesh of a procedural low-poly clownfish body
 *      (a flattened, friendly teardrop with a small forked tail). The body is
 *      painted in the fragment shader from a `vBody` coordinate (0 nose .. 1
 *      tail): a saturated orange (#FF7A3C) base with two crisp white bands and
 *      a thin dark edge on each band, plus tiny dark fin tips. A per-instance
 *      tail wiggle is baked into the vertex shader so the swim is free, and we
 *      drive a *quick, playful* darting motion in JS: short bursts of speed,
 *      loose cohesion toward a wandering huddle point, and gentle containment so
 *      they never wander off-screen.
 *
 *   2. The anemone: a handful (10) of soft pinkish (#E59BB0) tentacle blades on
 *      a second small InstancedMesh, rooted just below the huddle and swaying in
 *      the current via a height-weighted vertex sway (same trick as the kelp).
 *      The fish hover near it the way real clownfish shelter in an anemone.
 *
 * Zone-gating: the whole thing is only simulated + visible inside the `about`
 * band (0.16..0.32) plus a soft feather into surface (above) and projects
 * (below). Off-band the group goes `.visible = false` and the heavy per-frame
 * loop early-returns, so it costs ~nothing elsewhere.
 *
 * Self-contained SceneElement per scene/types.ts. Reads the shared `progress`
 * accessor imperatively each frame; never subscribes. Procedural only - no
 * external models, textures, or network.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// ---------------------------------------------------------------------------
// Tuning
// ---------------------------------------------------------------------------
const FISH_COUNT = 6; // a small, friendly group (brief: 5-8)
const TENT_COUNT = 10; // soft anemone tentacle blades
const TENT_SEGMENTS = 8; // vertical subdivisions per blade (smooth bend)

// The `about` zone is 0.16..0.32 (sunlit shallows). Feather into surface and
// projects so the fish swim in/out rather than popping at the band edges.
const BAND_START = 0.16;
const BAND_END = 0.32;
const FEATHER = 0.055;

// World-space volume the huddle occupies. The camera descends y: 0 -> -60 across
// progress 0..1, so the `about` band centers near y ~ -10.8. We keep the group
// camera-locked in y (re-centered each frame) so it's framed throughout the
// band, and let the fish dart within a compact local volume around the anemone.
const VOL_X = 14; // horizontal spread (kept tight: a cohesive little group)
const VOL_Y = 8; // vertical spread
const VOL_Z = 12; // depth spread
const Z_CENTER = -13; // sit in front of the camera (camera z = 8)
const ANEMONE_Y = -4.2; // the anemone sits a bit below the huddle center

// Palette.
const ORANGE = hexToRgb01("#FF7A3C"); // saturated clownfish body
const ORANGE_DEEP = hexToRgb01("#E85F23"); // shaded flank for a touch of form
const WHITE = hexToRgb01("#FBF4EC"); // warm white bands (not clinical white)
const EDGE = hexToRgb01("#241008"); // thin dark band/fin edges
const ANEMONE = hexToRgb01("#E59BB0"); // soft pink tentacles
const ANEMONE_TIP = hexToRgb01("#FBC9DA"); // brighter, slightly glowing tips

// Deterministic PRNG (mulberry32). React Compiler forbids Math.random() during
// render; a fixed seed makes the layout reproducible across reloads.
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
// Procedural low-poly clownfish geometry.
//
// Built nose(+x) to tail(-x); thin in z (a chubby, friendly profile). Cross-
// sections are 4-vertex diamond rings stitched into quads, then a small forked
// tail fin and a stubby dorsal fin are welded on. Two attributes ride along:
//   aBody : 0 at the nose .. 1 at the tail tip -> drives band painting + sway.
//   aFin  : 1 on fin geometry, 0 on the body  -> lets the shader darken fin tips.
// ---------------------------------------------------------------------------
function buildClownfishGeometry(): THREE.BufferGeometry {
  // Spine cross-sections nose -> tail base: [x, halfHeight, halfWidth].
  // A rounded teardrop: small head, deep belly just behind the head, tapering to
  // a thin peduncle. Clownfish read "friendly" because they're tall and stubby.
  const sections: Array<[number, number, number]> = [
    [0.5, 0.04, 0.03], // blunt nose
    [0.38, 0.16, 0.07], // head
    [0.18, 0.27, 0.11], // shoulders / deep belly (tallest)
    [-0.06, 0.24, 0.1], // mid
    [-0.3, 0.13, 0.06], // rear
    [-0.46, 0.06, 0.03], // peduncle (tail base)
  ];

  const positions: number[] = [];
  const normals: number[] = [];
  const body: number[] = [];
  const fin: number[] = [];

  // 4-vertex diamond ring (top, right, bottom, left) for a cross-section.
  const ringFor = (s: [number, number, number]) => {
    const [x, h, w] = s;
    return [
      [x, h, 0],
      [x, 0, w],
      [x, -h, 0],
      [x, 0, -w],
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
  const peduncleX = sections[sections.length - 1][0];
  const tailTipX = -0.66;
  const finH = 0.19;
  addTri([peduncleX, 0.05, 0], [tailTipX, finH, 0], [tailTipX, 0.015, 0], 1.0, 1);
  addTri([peduncleX, -0.05, 0], [tailTipX, -0.015, 0], [tailTipX, -finH, 0], 1.0, 1);

  // Stubby dorsal fin (a low triangle along the back over the shoulders).
  addTri([0.22, 0.27, 0], [-0.16, 0.24, 0], [0.02, 0.4, 0], 0.45, 1);

  // Small anal fin under the belly for a touch more silhouette.
  addTri([-0.02, -0.24, 0], [-0.26, -0.13, 0], [-0.12, -0.34, 0], 0.6, 1);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("aBody", new THREE.Float32BufferAttribute(body, 1));
  geo.setAttribute("aFin", new THREE.Float32BufferAttribute(fin, 1));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.computeVertexNormals(); // per-face normals so low-poly facets catch light
  geo.computeBoundingSphere();
  return geo;
}

// ---------------------------------------------------------------------------
// Fish shaders. Vertex bakes a quick per-instance tail wiggle (stronger toward
// the tail). Fragment paints the orange body with two white bands + dark edges.
// ---------------------------------------------------------------------------
const fishVertex = /* glsl */ `
  attribute float aBody;     // 0 nose .. 1 tail tip (also drives band painting)
  attribute float aFin;      // 1 on fins, 0 on body
  attribute float aPhase;    // per-instance swim phase
  attribute float aSpeed;    // per-instance tail-beat speed
  attribute float aWiggle;   // per-instance wiggle amplitude (darting intensity)

  uniform float uTime;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vBody;       // pass-through nose..tail for band painting
  varying float vFin;        // pass-through fin flag
  varying float vFlank;      // -1 .. +1 across the body width (z), for shading

  void main() {
    vec3 pos = position;

    // Quick travelling tail wave: yaw the body left/right, ramping toward the
    // tail. Higher base frequency than slow cruisers -> a playful, busy wiggle.
    float wave = sin(uTime * aSpeed + aPhase + aBody * 4.2);
    float amp = aBody * aBody * (0.14 + aWiggle * 0.16);
    pos.z += wave * amp;

    vBody = aBody;
    vFin = aFin;
    vFlank = clamp(position.z / 0.11, -1.0, 1.0);

    vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);
    mat3 nm = mat3(modelMatrix) * mat3(instanceMatrix);
    vNormalW = normalize(nm * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fishFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uOrange;
  uniform vec3 uOrangeDeep;
  uniform vec3 uWhite;
  uniform vec3 uEdge;
  uniform float uFade;      // 0..1 group opacity

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vBody;
  varying float vFin;
  varying float vFlank;

  // Soft band: 1 inside [c-hw, c+hw], thin dark edge just outside that.
  // Returns x = white amount (0..1), y = dark-edge amount (0..1).
  vec2 band(float t, float c, float hw, float edge) {
    float d = abs(t - c);
    float white = 1.0 - smoothstep(hw, hw + 0.012, d);
    float outer = 1.0 - smoothstep(hw + edge, hw + edge + 0.012, d);
    float darkEdge = clamp(outer - white, 0.0, 1.0);
    return vec2(white, darkEdge);
  }

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);

    // Soft top-down key light (sun filtering down from the bright surface).
    vec3 L = normalize(vec3(0.2, 1.0, 0.35));
    float diff = clamp(dot(N, L), 0.0, 1.0);

    // Base orange with a gently shaded far flank so the body reads as a volume.
    vec3 base = mix(uOrange, uOrangeDeep, smoothstep(0.2, 1.0, abs(vFlank)) * 0.55);

    // Two crisp white bands across the body (clownfish have a head band and a
    // mid band). vBody: 0 nose .. 1 tail. Band 1 sits just behind the head,
    // band 2 over the mid-body. Each gets a thin dark edge.
    vec2 b1 = band(vBody, 0.26, 0.045, 0.028);
    vec2 b2 = band(vBody, 0.58, 0.055, 0.03);
    float whiteAmt = clamp(b1.x + b2.x, 0.0, 1.0);
    float edgeAmt = clamp(b1.y + b2.y, 0.0, 1.0);

    vec3 col = mix(base, uWhite, whiteAmt);
    col = mix(col, uEdge, edgeAmt);

    // Thin dark trim on the very tail and at the nose tip (classic clownfish).
    float tailTrim = smoothstep(0.93, 1.0, vBody);
    float noseTrim = 1.0 - smoothstep(0.0, 0.05, vBody);
    col = mix(col, uEdge, max(tailTrim, noseTrim) * 0.85);

    // Fins: darken the outer fin membrane a touch toward the edges.
    col = mix(col, uEdge, vFin * 0.35);

    // Lighting: warm, bright (shallows), with a soft ambient floor so the
    // shaded side never goes muddy.
    col *= (0.62 + 0.52 * diff);

    // A gentle warm rim picks the fish out of the blue water.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.5);
    col += uOrange * fres * 0.18;

    gl_FragColor = vec4(col, uFade);
  }
`;

// ---------------------------------------------------------------------------
// Anemone tentacle shaders. A height-weighted sway (root anchored, tip sways
// most), pink body deepening at the root with a softly glowing tip. One blade
// instanced TENT_COUNT times around a small clump.
// ---------------------------------------------------------------------------
const tentVertex = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPresence;  // 0 hidden .. 1 full (drives grow + alpha)

  attribute float aPhase;   // per-instance phase offset
  attribute float aHeight;  // per-instance blade height
  attribute float aFacing;  // per-instance sway/facing direction (radians)

  varying float vUp;        // 0 root .. 1 tip along the blade
  varying float vEdge;      // 0..1 across the blade width (for soft edges)

  void main() {
    vUp = uv.y;
    vEdge = uv.x + 0.5;

    // Grow out of the rock as the band fades in.
    float grow = mix(0.18, 1.0, uPresence);
    float up = uv.y * aHeight * grow;

    // Width tapers to a soft point at the tip.
    float widthTaper = mix(1.0, 0.12, uv.y * uv.y);
    float across = position.x * widthTaper;

    // Lazy current sway, weighted quadratically by height (rooted base).
    float h = uv.y;
    float weight = h * h;
    float primary = sin(uTime * 0.9 + aPhase + h * 1.4);
    float ripple = sin(uTime * 2.1 + aPhase * 1.6 + h * 4.0) * 0.3;
    float bend = (primary + ripple) * weight;

    vec2 dir = vec2(cos(aFacing), sin(aFacing));
    float swayAmp = aHeight * 0.22;
    vec2 swayXZ = dir * bend * swayAmp;

    vec2 rightXZ = vec2(-dir.y, dir.x); // in-plane width direction
    vec3 local = vec3(
      rightXZ.x * across + swayXZ.x,
      up,
      rightXZ.y * across + swayXZ.y
    );

    vec4 world = instanceMatrix * vec4(local, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * world;
  }
`;

const tentFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uBody;
  uniform vec3 uTip;
  uniform float uPresence;

  varying float vUp;
  varying float vEdge;

  void main() {
    // Pink body deepening slightly at the root, glowing toward the tip.
    vec3 col = mix(uBody * 0.7, uBody, smoothstep(0.0, 0.4, vUp));
    col = mix(col, uTip, smoothstep(0.55, 1.0, vUp));
    col += uTip * smoothstep(0.78, 1.0, vUp) * 0.4;

    // Soft edges + soft tip so blades feather into the water.
    float edgeFade = smoothstep(0.0, 0.22, vEdge) * smoothstep(1.0, 0.78, vEdge);
    float tipFade = 1.0 - smoothstep(0.9, 1.0, vUp) * 0.6;
    float alpha = edgeFade * tipFade * uPresence * 0.92;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

// Per-instance fish simulation buffers (mutated every frame; held in a ref).
interface Sim {
  pos: Float32Array;
  vel: Float32Array;
  phase: Float32Array;
  speed: Float32Array;
  wiggle: Float32Array;
  scale: Float32Array;
  burst: Float32Array; // current dart-burst timer per fish
  burstDir: Float32Array; // per-fish burst heading (x,y,z)
}

function buildSim(): Sim {
  const rng = makeRng(0xc10f15);
  const pos = new Float32Array(FISH_COUNT * 3);
  const vel = new Float32Array(FISH_COUNT * 3);
  const phase = new Float32Array(FISH_COUNT);
  const speed = new Float32Array(FISH_COUNT);
  const wiggle = new Float32Array(FISH_COUNT);
  const scale = new Float32Array(FISH_COUNT);
  const burst = new Float32Array(FISH_COUNT);
  const burstDir = new Float32Array(FISH_COUNT * 3);
  for (let i = 0; i < FISH_COUNT; i++) {
    // Start clustered near the anemone.
    pos[i * 3] = (rng() - 0.5) * VOL_X * 0.5;
    pos[i * 3 + 1] = ANEMONE_Y + 1 + (rng() - 0.5) * VOL_Y * 0.4;
    pos[i * 3 + 2] = (rng() - 0.5) * VOL_Z * 0.5;
    vel[i * 3] = (rng() - 0.5) * 0.6;
    vel[i * 3 + 1] = (rng() - 0.5) * 0.3;
    vel[i * 3 + 2] = (rng() - 0.5) * 0.6;
    phase[i] = rng() * Math.PI * 2;
    speed[i] = 9 + rng() * 4; // fast tail beat -> quick, busy wiggle
    wiggle[i] = rng();
    scale[i] = 0.6 + rng() * 0.5; // small fish, slight size variety
    burst[i] = rng() * 1.5;
    burstDir[i * 3] = rng() - 0.5;
    burstDir[i * 3 + 1] = (rng() - 0.5) * 0.6;
    burstDir[i * 3 + 2] = rng() - 0.5;
  }
  return { pos, vel, phase, speed, wiggle, scale, burst, burstDir };
}

// Reusable scratch -> zero per-frame allocation.
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
  huddle: THREE.Vector3;
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
    huddle: new THREE.Vector3(),
  };
}

export default function Clownfish({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fishMeshRef = useRef<THREE.InstancedMesh>(null);
  const fishMatRef = useRef<THREE.ShaderMaterial>(null);
  const tentMeshRef = useRef<THREE.InstancedMesh>(null);
  const tentMatRef = useRef<THREE.ShaderMaterial>(null);

  // --- Fish geometry (built once) ---
  const fishGeometry = useMemo(() => buildClownfishGeometry(), []);

  // --- Anemone blade geometry + per-instance transforms (built once) ---
  const tentGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.5, 1, 1, TENT_SEGMENTS);
    geo.translate(0, 0.5, 0); // root at y=0, blade grows up (matches shader uv)
    return geo;
  }, []);

  const tentInstance = useMemo(() => {
    const rng = makeRng(0x7e57ed);
    const phases = new Float32Array(TENT_COUNT);
    const heights = new Float32Array(TENT_COUNT);
    const facings = new Float32Array(TENT_COUNT);
    const matrices = new Float32Array(TENT_COUNT * 16);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < TENT_COUNT; i++) {
      // Clump the blades in a small disc beneath the huddle.
      const ang = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * 2.2;
      dummy.position.set(Math.cos(ang) * r, ANEMONE_Y, Math.sin(ang) * r);
      dummy.rotation.set((rng() - 0.5) * 0.2, rng() * Math.PI * 2, (rng() - 0.5) * 0.2);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      dummy.matrix.toArray(matrices, i * 16);
      phases[i] = rng() * Math.PI * 2;
      heights[i] = 2.4 + rng() * 1.8; // short, soft tentacles
      facings[i] = rng() * Math.PI * 2;
    }
    return { phases, heights, facings, matrices };
  }, []);

  const fishUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOrange: { value: new THREE.Color(ORANGE[0], ORANGE[1], ORANGE[2]) },
      uOrangeDeep: {
        value: new THREE.Color(ORANGE_DEEP[0], ORANGE_DEEP[1], ORANGE_DEEP[2]),
      },
      uWhite: { value: new THREE.Color(WHITE[0], WHITE[1], WHITE[2]) },
      uEdge: { value: new THREE.Color(EDGE[0], EDGE[1], EDGE[2]) },
      uFade: { value: 0 },
    }),
    [],
  );

  const tentUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPresence: { value: 0 },
      uBody: { value: new THREE.Color(ANEMONE[0], ANEMONE[1], ANEMONE[2]) },
      uTip: { value: new THREE.Color(ANEMONE_TIP[0], ANEMONE_TIP[1], ANEMONE_TIP[2]) },
    }),
    [],
  );

  // Mutable per-frame state (refs, not useMemo, so the React Compiler lets us
  // mutate them inside useFrame). Lazily built on the first heavy frame.
  const simRef = useRef<Sim | null>(null);
  const scratchRef = useRef<Scratch | null>(null);
  const attrsReady = useRef(false);
  const tentReady = useRef(false);

  // Slowly wandering huddle point the fish loosely cohere toward.
  const huddlePhase = useRef(1.7);
  // Smoothed band fade so scroll jumps glide instead of snapping.
  const fade = useRef(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const fishMesh = fishMeshRef.current;
    const fishMat = fishMatRef.current;
    if (!group || !fishMesh || !fishMat) return;

    const p = progress.get();

    // ---- Zone gate: visible only inside the `about` band (+feather). ----
    const inFeatheredBand = p > BAND_START - FEATHER && p < BAND_END + FEATHER;
    const edgeIn = clamp01((p - (BAND_START - FEATHER)) / FEATHER);
    const edgeOut = clamp01((BAND_END + FEATHER - p) / FEATHER);
    const targetFade = inFeatheredBand ? Math.min(edgeIn, edgeOut) : 0;
    fade.current = lerp(fade.current, targetFade, Math.min(1, delta * 3));

    if (!inFeatheredBand && fade.current < 0.01) {
      if (group.visible) group.visible = false;
      return; // heavy sim skipped entirely off-band
    }
    group.visible = true;

    // Lazily build mutable buffers on first heavy frame.
    if (!simRef.current) simRef.current = buildSim();
    if (!scratchRef.current) scratchRef.current = buildScratch();
    const sim = simRef.current;
    const scratch = scratchRef.current;

    // One-time per-instance fish attribute upload now that the mesh exists.
    if (!attrsReady.current) {
      fishMesh.geometry.setAttribute(
        "aPhase",
        new THREE.InstancedBufferAttribute(sim.phase, 1),
      );
      fishMesh.geometry.setAttribute(
        "aSpeed",
        new THREE.InstancedBufferAttribute(sim.speed, 1),
      );
      fishMesh.geometry.setAttribute(
        "aWiggle",
        new THREE.InstancedBufferAttribute(sim.wiggle, 1),
      );
      attrsReady.current = true;
    }

    // One-time anemone instance-matrix + attribute upload.
    const tentMesh = tentMeshRef.current;
    if (tentMesh && !tentReady.current) {
      tentMesh.instanceMatrix.array.set(tentInstance.matrices);
      tentMesh.instanceMatrix.needsUpdate = true;
      tentMesh.geometry.setAttribute(
        "aPhase",
        new THREE.InstancedBufferAttribute(tentInstance.phases, 1),
      );
      tentMesh.geometry.setAttribute(
        "aHeight",
        new THREE.InstancedBufferAttribute(tentInstance.heights, 1),
      );
      tentMesh.geometry.setAttribute(
        "aFacing",
        new THREE.InstancedBufferAttribute(tentInstance.facings, 1),
      );
      tentReady.current = true;
    }

    const t = state.clock.elapsedTime;
    fishMat.uniforms.uTime.value = t;
    fishMat.uniforms.uFade.value = fade.current;

    const tentMat = tentMatRef.current;
    if (tentMat) {
      tentMat.uniforms.uTime.value = t;
      tentMat.uniforms.uPresence.value = fade.current;
    }

    // Keep the group centered on the live camera depth so it stays framed while
    // we pass through the band. x/z volume + anemone offset are local.
    group.position.y = state.camera.position.y;
    group.position.z = Z_CENTER;

    // Wandering huddle point (cohesion target), kept above the anemone.
    const hp = (huddlePhase.current += delta * 0.25);
    scratch.huddle.set(
      Math.sin(hp * 0.8) * VOL_X * 0.22,
      ANEMONE_Y + 1.6 + Math.sin(hp * 0.6 + 1.1) * VOL_Y * 0.18,
      Math.cos(hp * 0.7) * VOL_Z * 0.22,
    );

    const dt = Math.min(delta, 0.05); // clamp to avoid blowups after a tab stall
    const { pos, vel, burst, burstDir } = sim;

    for (let i = 0; i < FISH_COUNT; i++) {
      const ix = i * 3;
      const px = pos[ix];
      const py = pos[ix + 1];
      const pz = pos[ix + 2];

      // 1) Loose cohesion toward the wandering huddle point.
      let ax = (scratch.huddle.x - px) * 0.9;
      let ay = (scratch.huddle.y - py) * 0.9;
      let az = (scratch.huddle.z - pz) * 0.9;

      // 2) Playful darting: each fish periodically fires a short burst in a
      // fresh random direction, then coasts. This gives the quick, twitchy,
      // back-and-forth motion clownfish are known for.
      burst[i] -= dt;
      if (burst[i] <= 0) {
        // Reseed the burst from a cheap hash of (i, t) -> no Math.random in loop.
        const s = Math.sin(i * 12.9898 + t * 7.233) * 43758.5453;
        const r1 = s - Math.floor(s);
        const s2 = Math.sin(i * 39.346 + t * 11.71) * 24634.6345;
        const r2 = s2 - Math.floor(s2);
        const s3 = Math.sin(i * 73.156 + t * 5.117) * 17231.123;
        const r3 = s3 - Math.floor(s3);
        burstDir[ix] = r1 - 0.5;
        burstDir[ix + 1] = (r2 - 0.5) * 0.7;
        burstDir[ix + 2] = r3 - 0.5;
        burst[i] = 0.5 + r1 * 1.3; // re-fire in 0.5 .. 1.8s
      }
      // Apply the burst impulse, strongest right after it fires (burst high).
      const kick = clamp01(burst[i]) * 4.5;
      ax += burstDir[ix] * kick;
      ay += burstDir[ix + 1] * kick;
      az += burstDir[ix + 2] * kick;

      // 3) Soft containment: turn back before leaving the local volume.
      ax += -px * (Math.abs(px) > VOL_X * 0.5 ? 1.2 : 0.0);
      ay += (ANEMONE_Y + 1.6 - py) * (Math.abs(py - (ANEMONE_Y + 1.6)) > VOL_Y * 0.5 ? 1.2 : 0.0);
      az += -pz * (Math.abs(pz) > VOL_Z * 0.5 ? 1.2 : 0.0);

      // Integrate velocity with damping (the damping is what makes darts decay).
      let vx = vel[ix] + ax * dt;
      let vy = vel[ix + 1] + ay * dt;
      let vz = vel[ix + 2] + az * dt;
      const damp = 0.9;
      vx *= damp;
      vy *= damp;
      vz *= damp;

      // Clamp speed: allow quick darts but keep a believable cap.
      const sp = Math.hypot(vx, vy, vz);
      const maxSp = 5.5;
      const minSp = 0.4;
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

      // ---- Orient to velocity: right-handed basis (det +1) ----
      // Fish local axes: +x = nose, +y = back/up, +z = right side.
      scratch.fwd.set(vx, vy, vz);
      if (scratch.fwd.lengthSq() < 1e-6) scratch.fwd.set(1, 0, 0);
      scratch.fwd.normalize();
      scratch.right.copy(scratch.fwd).cross(scratch.up);
      if (scratch.right.lengthSq() < 1e-6) scratch.right.set(0, 0, 1);
      scratch.right.normalize();
      scratch.newUp.copy(scratch.right).cross(scratch.fwd).normalize();
      scratch.basis.makeBasis(scratch.fwd, scratch.newUp, scratch.right);
      scratch.q.setFromRotationMatrix(scratch.basis);

      const s = sim.scale[i];
      scratch.sclV.set(s, s, s);
      scratch.posV.set(nx, ny, nz);
      scratch.m.compose(scratch.posV, scratch.q, scratch.sclV);
      fishMesh.setMatrixAt(i, scratch.m);
    }

    fishMesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Anemone tentacles (drawn first, behind the fish) */}
      <instancedMesh
        ref={tentMeshRef}
        args={[tentGeometry, undefined, TENT_COUNT]}
        frustumCulled={false}
        renderOrder={0}
      >
        <shaderMaterial
          ref={tentMatRef}
          attach="material"
          vertexShader={tentVertex}
          fragmentShader={tentFragment}
          uniforms={tentUniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </instancedMesh>

      {/* Clownfish */}
      <instancedMesh
        ref={fishMeshRef}
        args={[fishGeometry, undefined, FISH_COUNT]}
        frustumCulled={false}
        renderOrder={1}
      >
        <shaderMaterial
          ref={fishMatRef}
          attach="material"
          vertexShader={fishVertex}
          fragmentShader={fishFragment}
          uniforms={fishUniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </instancedMesh>
    </group>
  );
}
