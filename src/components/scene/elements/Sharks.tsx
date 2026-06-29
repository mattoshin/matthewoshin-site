"use client";

/**
 * Sharks - 2-3 stylized procedural sharks cruising the midnight band.
 *
 * Each shark is a single low-poly mesh: an elongated tapered body with a swept
 * dorsal fin, a forked caudal (tail) fin, and two small pectoral fins, all baked
 * into ONE BufferGeometry so a shark is one draw call. The whole pod shares a
 * material (a dark silhouette with a faint cyan fresnel rim that brightens with
 * depth), and the geometry's tail half is sinusoidally swayed in the vertex
 * shader using a per-vertex "spine" attribute so the swim animation is free.
 *
 * Motion: each shark follows its own closed Catmull-Rom loop. We sample the
 * curve for position + a look-ahead point for orientation, then apply a gentle
 * roll/banking. The pod orbits the LIVE camera depth so it stays framed through
 * the whole ventures band rather than being pinned to one world Y.
 *
 * Zone gate: lives in the "ventures" (Midnight) band with soft edges that bleed
 * into projects (above) and writing (below). Fully invisible + early-returns
 * from the heavy per-frame work when the camera is far from that band, so it
 * costs ~nothing off-zone.
 *
 * Self-contained: no external models/textures/network. Geometry is procedural,
 * material is a small custom shader.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
const BIO_CYAN = new THREE.Color("#3FE0E6"); // primary glow
const BIO_LUMEN = new THREE.Color("#8FE8FF"); // cool rim highlight
// Great-white counter-shading: a slate-gray back over a pale underside. Kept on
// the darker/muted side so the pod still belongs in the moody midnight band.
const SHARK_BACK = new THREE.Color("#33434F"); // slate-gray dorsal surface
const SHARK_BELLY = new THREE.Color("#B6C4CE"); // pale counter-shaded belly

const SHARK_COUNT = 2;

// Tight band centered on the SKILLS card (scroll-progress ~0.56), with a small
// feather so the pod stays the single feature there and does NOT bleed up into
// the Portfolio card (where it was previously stacking with the submarine).
const BAND_START = 0.5;
const BAND_END = 0.63;
const FEATHER = 0.04;

// ---------------------------------------------------------------------------
// Procedural shark geometry
//
// Built nose (+x) to tail (-x). We extrude a series of elliptical rings along a
// tapered profile to form the body, cap the nose, then weld on a dorsal fin, a
// forked tail and two pectoral fins. Every vertex carries a `spine` attribute
// (0 at the snout, 1 at the tail tip) so the shader can sway the rear smoothly.
// ---------------------------------------------------------------------------
function buildSharkGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const spine: number[] = []; // 0..1 along the body length, for tail sway

  const LENGTH = 2.6;
  const SEGMENTS = 22; // rings along the body
  const RADIAL = 10; // verts around each ring

  // Body profile: half-height (vertical) and half-width (horizontal) per t.
  // Shark silhouette: blunt-ish rounded snout, fat midsection, tapering to a
  // thin caudal peduncle near the tail.
  const profile = (t: number): { h: number; w: number } => {
    // t: 0 (nose) -> 1 (tail). Higher exponent widens more gradually from the
    // tip -> the pointed, conical snout of a great white (vs a blunt nose).
    const nose = Math.pow(Math.sin(Math.min(t, 0.14) / 0.14 * Math.PI * 0.5), 1.5);
    const taper = Math.pow(1 - clamp01((t - 0.14) / 0.86), 1.35);
    const belly = 1 - Math.pow(Math.abs(t - 0.42) * 2.0, 2.4) * 0.22;
    const base = t < 0.14 ? nose : taper * belly;
    const h = base * 0.34; // a touch taller than wide -> shark cross-section
    const w = base * 0.26;
    return { h: Math.max(h, 0.012), w: Math.max(w, 0.01) };
  };

  // Generate rings of vertices.
  const ringStart: number[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const x = (0.5 - t) * LENGTH; // nose at +x, tail at -x
    const { h, w } = profile(t);
    ringStart.push(positions.length / 3);
    for (let j = 0; j < RADIAL; j++) {
      const a = (j / RADIAL) * Math.PI * 2;
      const cy = Math.sin(a) * h;
      const cz = Math.cos(a) * w;
      // Slight dorsal lift: push the top of the cross-section up a bit so the
      // back arches rather than being a plain ellipse.
      const dorsalLift = Math.max(0, Math.sin(a)) * 0.03 * (1 - t);
      positions.push(x, cy + dorsalLift, cz);
      // Approximate outward normal from the ellipse.
      const n = new THREE.Vector3(0, Math.sin(a) / h, Math.cos(a) / w).normalize();
      normals.push(n.x, n.y, n.z);
      spine.push(t);
    }
  }

  const indices: number[] = [];
  // Stitch consecutive rings into quads (two tris each).
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

  // --- Nose cap (fan to the snout center) ---
  {
    const cx = 0.5 * LENGTH + 0.22; // extend the tip forward into a pointed snout
    const center = positions.length / 3;
    positions.push(cx, 0, 0);
    normals.push(1, 0, 0);
    spine.push(0);
    const r0 = ringStart[0];
    for (let j = 0; j < RADIAL; j++) {
      const jn = (j + 1) % RADIAL;
      indices.push(center, r0 + j, r0 + jn);
    }
  }

  // --- Tail cap (close the caudal peduncle so it's watertight) ---
  {
    const center = positions.length / 3;
    const tailX = -0.5 * LENGTH;
    positions.push(tailX, 0, 0);
    normals.push(-1, 0, 0);
    spine.push(1);
    const rN = ringStart[SEGMENTS];
    for (let j = 0; j < RADIAL; j++) {
      const jn = (j + 1) % RADIAL;
      indices.push(center, rN + jn, rN + j);
    }
  }

  // Helper: append a flat double-sided fin from a list of (x,y,z) triangles.
  // `s` is the spine value driving sway for every vertex of the fin. Each fin is
  // added with both windings so the thin geometry renders from either side.
  const addFin = (tris: number[][], s: number) => {
    const base = positions.length / 3;
    for (const v of tris) {
      positions.push(v[0], v[1], v[2]);
      normals.push(0, 0, v[2] >= 0 ? 1 : -1);
      spine.push(s);
    }
    for (let k = 0; k < tris.length; k += 3) {
      indices.push(base + k, base + k + 1, base + k + 2);
      indices.push(base + k + 2, base + k + 1, base + k); // back face
    }
  };

  // --- Dorsal fin (the iconic triangle) ---
  {
    const baseT = 0.5;
    const xb = (0.5 - baseT) * LENGTH;
    const { h } = profile(baseT);
    const front = xb + 0.24;
    const back = xb - 0.44;
    const tipX = xb - 0.18;
    const tipY = h + 0.62; // taller, more imposing great-white dorsal
    const baseY = h * 0.9;
    addFin(
      [
        [front, baseY, 0],
        [back, baseY, 0],
        [tipX, tipY, 0],
      ],
      baseT,
    );
  }

  // --- Caudal (tail) fin: forked, larger upper lobe (heterocercal) ---
  {
    const tx = -0.5 * LENGTH;
    const s = 1.0;
    // Upper lobe
    addFin(
      [
        [tx + 0.06, 0.02, 0],
        [tx - 0.18, 0.0, 0],
        [tx - 0.34, 0.5, 0],
      ],
      s,
    );
    // Lower lobe (smaller)
    addFin(
      [
        [tx + 0.06, -0.02, 0],
        [tx - 0.16, 0.0, 0],
        [tx - 0.24, -0.3, 0],
      ],
      s,
    );
    // Fill between lobes for a connected fork silhouette
    addFin(
      [
        [tx - 0.18, 0.0, 0],
        [tx - 0.34, 0.5, 0],
        [tx - 0.24, -0.3, 0],
      ],
      s,
    );
  }

  // --- Pectoral fins (one each side), swept back ---
  for (const side of [1, -1]) {
    const baseT = 0.34;
    const xb = (0.5 - baseT) * LENGTH;
    const { w } = profile(baseT);
    const root = w * 0.7 * side;
    const s = baseT;
    addFin(
      [
        [xb + 0.06, -0.04, root],
        [xb - 0.14, -0.05, root],
        [xb - 0.26, -0.16, root + 0.42 * side],
      ],
      s,
    );
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("spine", new THREE.Float32BufferAttribute(spine, 1));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return geo;
}

// ---------------------------------------------------------------------------
// Shader: dark silhouette + faint cyan fresnel rim. Tail sway is applied in the
// vertex shader using the `spine` attribute and a per-instance phase.
// ---------------------------------------------------------------------------
const vertexShader = /* glsl */ `
  attribute float spine;
  uniform float uTime;
  uniform float uSwayPhase;
  uniform float uSwayAmp;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying float vSpine;
  varying float vLocalY; // body-local height, for counter-shading (belly..back)

  void main() {
    vSpine = spine;
    vLocalY = position.y;
    vec3 pos = position;

    // Yaw the rear of the body left/right. Only the back half (spine > 0.4)
    // moves, ramping to full at the tail tip, so the swim looks like a wave
    // travelling down the body rather than the whole fish wagging.
    float t = smoothstep(0.4, 1.0, spine);
    float wave = sin(uTime * 2.0 - spine * 4.0 + uSwayPhase);
    float yaw = wave * t * uSwayAmp;
    // Rotate around Y (turn in the horizontal plane), pivoting near mid-body.
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

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uBack;
  uniform vec3 uBelly;
  uniform vec3 uRim;
  uniform vec3 uGlow;
  uniform float uRimStrength;
  uniform float uOpacity;
  uniform vec3 uCamPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying float vSpine;
  varying float vLocalY;

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(uCamPos - vWorldPos);
    float ndv = clamp(dot(N, V), 0.0, 1.0);

    // Fresnel rim: hot at grazing angles -> the cyan silhouette edge.
    float fres = pow(1.0 - ndv, 4.5);

    // Great-white counter-shading: pale belly low on the body, slate back up top,
    // with a crisp-ish transition along the flank like the real animal.
    float topness = smoothstep(-0.14, 0.06, vLocalY);
    vec3 col = mix(uBelly, uBack, topness);

    // Cyan edge, slightly stronger toward the tail to echo the bio theme.
    float tailBias = 0.7 + 0.3 * vSpine;
    col += uRim * fres * uRimStrength * tailBias;

    // A whisper of interior glow on the lit side keeps it from going flat black.
    col += uGlow * pow(ndv, 2.0) * 0.04;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

// ---------------------------------------------------------------------------
// One closed Catmull-Rom loop per shark. Coordinates are LOCAL to the pod group
// (which we slide to the live camera depth each frame). Loops are wide, slow,
// overlapping ovals at slightly different depths/sizes so the pod feels alive
// but never crosses or clutters.
// ---------------------------------------------------------------------------
function buildLoop(seed: number): THREE.CatmullRomCurve3 {
  const rng = (n: number) => {
    const x = Math.sin(seed * 928.31 + n * 113.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const radiusX = 9 + rng(1) * 5;
  const radiusZ = 6 + rng(2) * 4;
  const yBase = (rng(3) - 0.5) * 5; // spread the pod vertically a little
  const yWobble = 1.2 + rng(4) * 1.4;
  const zOff = -17 - rng(5) * 10; // push the pod further out so they read as distant
  const tilt = (rng(6) - 0.5) * 0.5;

  const pts: THREE.Vector3[] = [];
  const N = 8;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + seed;
    const x = Math.cos(a) * radiusX;
    const z = Math.sin(a) * radiusZ + zOff;
    const y = yBase + Math.sin(a * 2 + seed) * yWobble + x * tilt * 0.04;
    pts.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);
  return curve;
}

interface SharkRig {
  curve: THREE.CatmullRomCurve3;
  speed: number; // loop fraction per second
  offset: number; // starting position along the loop
  scale: number;
  swayPhase: number;
  swayAmp: number;
  roll: number; // banking amount
}

/** Build the per-shark uniform set. Each shark owns its own material so the
 *  tail sway can be out of phase while sharing one geometry buffer. */
function makeUniforms() {
  return {
    uTime: { value: 0 },
    uSwayPhase: { value: 0 },
    uSwayAmp: { value: 0.12 },
    uBack: { value: SHARK_BACK.clone() },
    uBelly: { value: SHARK_BELLY.clone() },
    uRim: { value: BIO_CYAN.clone() },
    uGlow: { value: BIO_LUMEN.clone() },
    uRimStrength: { value: 0.0 },
    uOpacity: { value: 0.0 },
    uCamPos: { value: new THREE.Vector3() },
  };
}

export default function Sharks({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sharkRefs = useRef<(THREE.Mesh | null)[]>([]);
  const matRefs = useRef<(THREE.ShaderMaterial | null)[]>([]);

  // Smoothed band intensity (0 off-zone .. 1 deep in ventures) so fades never snap.
  const intensity = useRef(0);
  const clockRef = useRef(0);

  // Scratch objects reused every frame (never allocate inside useFrame).
  const scratch = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      ahead: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      fwdAxis: new THREE.Vector3(1, 0, 0),
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      qYaw: new THREE.Quaternion(),
      qRoll: new THREE.Quaternion(),
    }),
    [],
  );

  const geometry = useMemo(() => buildSharkGeometry(), []);

  const rigs = useMemo<SharkRig[]>(() => {
    const out: SharkRig[] = [];
    for (let i = 0; i < SHARK_COUNT; i++) {
      const r = (n: number) => {
        const x = Math.sin((i + 1) * 57.13 + n * 19.7) * 43758.5453;
        return x - Math.floor(x);
      };
      out.push({
        curve: buildLoop(i * 2.4 + 1),
        speed: 0.012 + r(1) * 0.01, // very slow, ominous cruise
        offset: r(2),
        scale: 0.85 + r(3) * 0.5, // smaller, distant silhouettes
        swayPhase: r(4) * Math.PI * 2,
        swayAmp: 0.1 + r(5) * 0.05,
        roll: 0.1 + r(6) * 0.06,
      });
    }
    return out;
  }, []);

  // One uniform set per shark, allocated once.
  const uniformSets = useMemo(() => rigs.map(() => makeUniforms()), [rigs]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = progress.get();

    // --- Global band fade. Triangular ramp across the feathered ventures band.
    let target = 0;
    if (p >= BAND_START - FEATHER && p <= BAND_END + FEATHER) {
      const up = clamp01((p - (BAND_START - FEATHER)) / FEATHER);
      const down = clamp01((BAND_END + FEATHER - p) / FEATHER);
      target = Math.min(up, down); // 1 fully inside, 0 at the feather edges
    }
    intensity.current = lerp(intensity.current, target, Math.min(1, delta * 2));
    const vis = intensity.current;

    // Off-zone: hide and bail before any per-shark math. Costs ~nothing.
    if (vis < 0.01 && target === 0) {
      if (group.visible) group.visible = false;
      return;
    }
    group.visible = true;

    clockRef.current += delta;
    const t = clockRef.current;

    // Keep the pod centered on the live camera depth so it stays framed through
    // the whole band rather than scrolling past in one beat.
    group.position.y = state.camera.position.y;
    group.position.z = state.camera.position.z;

    // Rim glow strengthens with depth (matches the bio-glow-with-depth aesthetic).
    const rimStrength = lerp(0.2, 0.6, clamp01(p)) * vis;
    const opacity = lerp(0.0, 0.92, vis);

    for (let i = 0; i < rigs.length; i++) {
      const mesh = sharkRefs.current[i];
      const mat = matRefs.current[i];
      const rig = rigs[i];
      if (!mesh) continue;

      // Per-material uniforms (own live material -> lint-safe to mutate).
      if (mat) {
        const u = mat.uniforms;
        u.uTime.value = t;
        u.uSwayPhase.value = rig.swayPhase;
        u.uSwayAmp.value = rig.swayAmp;
        u.uRimStrength.value = rimStrength;
        u.uOpacity.value = opacity;
        u.uCamPos.value.copy(state.camera.position);
      }

      // --- Follow the loop ---
      const u0 = (rig.offset + t * rig.speed) % 1;
      rig.curve.getPointAt(u0, scratch.pos);
      const uAhead = (u0 + 0.02) % 1;
      rig.curve.getPointAt(uAhead, scratch.ahead);

      mesh.position.copy(scratch.pos);

      // Orient: lookAt aims the local -z toward the target; our shark forward
      // axis is +x, so build the lookAt rotation then yaw +90deg to map +x->-z.
      scratch.m.lookAt(scratch.pos, scratch.ahead, scratch.up);
      scratch.q.setFromRotationMatrix(scratch.m);
      scratch.qYaw.setFromAxisAngle(scratch.up, Math.PI * 0.5);
      scratch.q.multiply(scratch.qYaw);

      // Gentle banking roll into the turn, tied to the swim phase.
      const roll = Math.sin(t * 0.6 + rig.swayPhase) * rig.roll;
      scratch.qRoll.setFromAxisAngle(scratch.fwdAxis, roll);
      scratch.q.multiply(scratch.qRoll);

      mesh.quaternion.copy(scratch.q);
      mesh.scale.setScalar(rig.scale);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {rigs.map((rig, i) => (
        <mesh
          key={i}
          ref={(el) => {
            sharkRefs.current[i] = el;
          }}
          geometry={geometry}
          frustumCulled={false}
          renderOrder={2}
        >
          <shaderMaterial
            ref={(el) => {
              matRefs.current[i] = el;
            }}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniformSets[i]}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
