"use client";

/**
 * Clownfish - two small schools of orange-and-white clownfish cruising the
 * sunlit shallows (the `about` zone) BELOW the centered content card. One school
 * crosses LEFT -> RIGHT, the other RIGHT -> LEFT, on two slightly different
 * lanes, so they read as a couple of tidy little shoals passing each other (no
 * darting, no chaos). Each school slow-traverses with a quick fade-in at its
 * entering edge and a slow fade-out at its exit edge, exactly like the ship.
 *
 * Procedural low-poly geometry (kept) painted by a fragment shader (orange body,
 * two white bands, dark fin/edge trim); the tail wiggle is baked in the vertex
 * shader so the swim is free. Each school is one InstancedMesh whose group
 * translates across the screen; each fish holds a fixed formation offset + bob.
 *
 * Zone-gating: visible only inside the `about` band (0.16..0.32) + feather. The
 * camera-locked groups keep both schools framed through the band; off-band they
 * hide and the per-frame loop early-returns. Self-contained SceneElement; reads
 * `progress` imperatively. Procedural only - no external models/textures/network.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, hexToRgb01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// ---------------------------------------------------------------------------
// Tuning
// ---------------------------------------------------------------------------
const COUNT = 3; // fish per school; two schools (opposite directions) = 6 total

// Tight band centered on the EXPERIENCE card (scroll-progress ~0.14) so the
// clownfish are that section's single feature and don't bleed into the
// Entrepreneurship card below (the turtle owns that one).
const BAND_START = 0.08;
const BAND_END = 0.22;
const FEATHER = 0.04;

const Z_CENTER = -13; // sit in front of the camera (camera z = 8)
// Two lanes BELOW the centered content card so the schools read as separate
// shoals crossing under the text, not one clump hidden behind it.
const LANE_LR = -5; // the left -> right school rides the upper lane
const LANE_RL = -7.5; // the right -> left school rides the lower lane

// Slow cruise across the screen, wrapping (like the ship).
const X_LEFT = -16;
const X_RIGHT = 16;
const X_SPAN = X_RIGHT - X_LEFT;
const SPEED = 0.68; // world units / second - slowed 2026-07-21 for the "lowkey" pass (was 1.05, the fastest ambient creature)

// Asymmetric carousel fade relative to direction of travel: quick fade-IN at the
// entering edge, slow fade-OUT at the exit edge. EDGE_NEAR is the |x| where a
// fish begins entering / has begun exiting.
const EDGE_NEAR = 12;
const ENTER_SOFT = 1.6;
const EXIT_SOFT = 6;

// Fixed school formation (local). A loose trailing line so each school reads as
// a few fish swimming together, not a clump.
const FORMATION: ReadonlyArray<readonly [number, number, number]> = [
  [0.0, 0.7, 0.3],
  [-1.8, -0.2, 1.1],
  [-3.3, 0.5, -0.8],
];
const SCALES = [1.2, 0.95, 1.05];
const BOB_PHASE = [0.0, 2.1, 4.0];
const TAIL_SPEED = [5.0, 5.6, 4.6];
const TAIL_PHASE = [0.4, 2.7, 5.1];
const TAIL_WIGGLE = [0.5, 0.7, 0.6];

// Reused axis for the 180deg yaw that turns the geometry (nose +x) to face -x
// for the right -> left school.
const Y_AXIS = new THREE.Vector3(0, 1, 0);

// Palette.
const ORANGE = hexToRgb01("#D38A68"); // muted coral, was #FF7A3C
const ORANGE_DEEP = hexToRgb01("#BC704F"); // muted coral-deep, was #E85F23
const WHITE = hexToRgb01("#FBF4EC");
const EDGE = hexToRgb01("#241008");

// ---------------------------------------------------------------------------
// Procedural low-poly clownfish geometry (nose +x to tail -x).
// ---------------------------------------------------------------------------
function buildClownfishGeometry(): THREE.BufferGeometry {
  const sections: Array<[number, number, number]> = [
    [0.5, 0.04, 0.03],
    [0.38, 0.16, 0.07],
    [0.18, 0.27, 0.11],
    [-0.06, 0.24, 0.1],
    [-0.3, 0.13, 0.06],
    [-0.46, 0.06, 0.03],
  ];

  const positions: number[] = [];
  const normals: number[] = [];
  const body: number[] = [];
  const fin: number[] = [];

  const ringFor = (s: [number, number, number]) => {
    const [x, h, w] = s;
    return [
      [x, h, 0],
      [x, 0, w],
      [x, -h, 0],
      [x, 0, -w],
    ] as const;
  };

  const bodyParam = (i: number) => i / (sections.length - 1);

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
        normals.push(0, 0, 0);
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

  const peduncleX = sections[sections.length - 1][0];
  const tailTipX = -0.66;
  const finH = 0.19;
  addTri([peduncleX, 0.05, 0], [tailTipX, finH, 0], [tailTipX, 0.015, 0], 1.0, 1);
  addTri([peduncleX, -0.05, 0], [tailTipX, -0.015, 0], [tailTipX, -finH, 0], 1.0, 1);
  addTri([0.22, 0.27, 0], [-0.16, 0.24, 0], [0.02, 0.4, 0], 0.45, 1);
  addTri([-0.02, -0.24, 0], [-0.26, -0.13, 0], [-0.12, -0.34, 0], 0.6, 1);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("aBody", new THREE.Float32BufferAttribute(body, 1));
  geo.setAttribute("aFin", new THREE.Float32BufferAttribute(fin, 1));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

const fishVertex = /* glsl */ `
  attribute float aBody;
  attribute float aFin;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aWiggle;

  uniform float uTime;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vBody;
  varying float vFin;
  varying float vFlank;

  void main() {
    vec3 pos = position;

    // Smooth travelling tail wave (calmer than a darting fish).
    float wave = sin(uTime * aSpeed + aPhase + aBody * 4.2);
    float amp = aBody * aBody * (0.10 + aWiggle * 0.12);
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
  uniform float uFade;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vBody;
  varying float vFin;
  varying float vFlank;

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

    vec3 L = normalize(vec3(0.2, 1.0, 0.35));
    float diff = clamp(dot(N, L), 0.0, 1.0);

    vec3 base = mix(uOrange, uOrangeDeep, smoothstep(0.2, 1.0, abs(vFlank)) * 0.55);

    vec2 b1 = band(vBody, 0.26, 0.045, 0.028);
    vec2 b2 = band(vBody, 0.58, 0.055, 0.03);
    float whiteAmt = clamp(b1.x + b2.x, 0.0, 1.0);
    float edgeAmt = clamp(b1.y + b2.y, 0.0, 1.0);

    vec3 col = mix(base, uWhite, whiteAmt);
    col = mix(col, uEdge, edgeAmt);

    float tailTrim = smoothstep(0.93, 1.0, vBody);
    float noseTrim = 1.0 - smoothstep(0.0, 0.05, vBody);
    col = mix(col, uEdge, max(tailTrim, noseTrim) * 0.85);

    col = mix(col, uEdge, vFin * 0.35);

    col *= (0.62 + 0.52 * diff);

    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.5);
    col += uOrange * fres * 0.18;

    gl_FragColor = vec4(col, uFade);
  }
`;

// ---------------------------------------------------------------------------
// One school: COUNT fish translating across the screen in a single direction.
//   dir  = +1 -> left -> right (geometry nose +x already faces travel)
//   dir  = -1 -> right -> left (yaw 180deg so the nose faces travel)
// `laneY` rides the school below the card; `phase` offsets it along x so the two
// schools don't cross in lockstep.
// ---------------------------------------------------------------------------
function School({
  progress,
  dir,
  laneY,
  phase,
}: {
  progress: SceneElementProps["progress"];
  dir: 1 | -1;
  laneY: number;
  phase: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => buildClownfishGeometry(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOrange: { value: new THREE.Color(ORANGE[0], ORANGE[1], ORANGE[2]) },
      uOrangeDeep: { value: new THREE.Color(ORANGE_DEEP[0], ORANGE_DEEP[1], ORANGE_DEEP[2]) },
      uWhite: { value: new THREE.Color(WHITE[0], WHITE[1], WHITE[2]) },
      uEdge: { value: new THREE.Color(EDGE[0], EDGE[1], EDGE[2]) },
      uFade: { value: 0 },
    }),
    [],
  );

  // Facing quaternion for this school's travel direction (built once).
  const facing = useMemo(() => {
    const q = new THREE.Quaternion();
    if (dir < 0) q.setFromAxisAngle(Y_AXIS, Math.PI); // nose +x -> -x (faces left)
    return q;
  }, [dir]);

  const scratch = useMemo(
    () => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), p: new THREE.Vector3(), s: new THREE.Vector3() }),
    [],
  );
  const fade = useRef(0);
  const attrsReady = useRef(false);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!group || !mesh || !mat) return;

    const p = progress.get();
    const inBand = p > BAND_START - FEATHER && p < BAND_END + FEATHER;
    const edgeIn = clamp01((p - (BAND_START - FEATHER)) / FEATHER);
    const edgeOut = clamp01((BAND_END + FEATHER - p) / FEATHER);
    const bandFade = inBand ? Math.min(edgeIn, edgeOut) : 0;
    fade.current = lerp(fade.current, bandFade, Math.min(1, delta * 3));

    if (!inBand && fade.current < 0.01) {
      if (group.visible) group.visible = false;
      return;
    }
    group.visible = true;

    // One-time per-instance tail attributes.
    if (!attrsReady.current) {
      mesh.geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(new Float32Array(TAIL_PHASE), 1));
      mesh.geometry.setAttribute("aSpeed", new THREE.InstancedBufferAttribute(new Float32Array(TAIL_SPEED), 1));
      mesh.geometry.setAttribute("aWiggle", new THREE.InstancedBufferAttribute(new Float32Array(TAIL_WIGGLE), 1));
      attrsReady.current = true;
    }

    const t = state.clock.elapsedTime;
    mat.uniforms.uTime.value = t;

    // Directional traverse, wrapping. Both directions sweep x across [-16, 16].
    const travel = (t * SPEED + phase) % X_SPAN;
    const x = dir > 0 ? X_LEFT + travel : X_RIGHT - travel;

    // Carousel fade relative to the direction of travel: quick fade-in at the
    // entering edge, slow fade-out at the exit edge.
    const fadeIn =
      dir > 0 ? clamp01((x + EDGE_NEAR) / ENTER_SOFT) : clamp01((EDGE_NEAR - x) / ENTER_SOFT);
    const fadeOut =
      dir > 0 ? clamp01((EDGE_NEAR - x) / EXIT_SOFT) : clamp01((x + EDGE_NEAR) / EXIT_SOFT);
    mat.uniforms.uFade.value = fade.current * Math.min(fadeIn, fadeOut);

    // The school rides the live camera depth (framed through the band) on its
    // lane below the card, and translates across the screen.
    group.position.set(x, state.camera.position.y + laneY, Z_CENTER);

    for (let i = 0; i < COUNT; i++) {
      const o = FORMATION[i];
      const bobY = Math.sin(t * 2.0 + BOB_PHASE[i]) * 0.18;
      scratch.p.set(o[0], o[1] + bobY, o[2]);
      scratch.q.copy(facing); // face the direction of travel
      scratch.s.setScalar(SCALES[i]);
      scratch.m.compose(scratch.p, scratch.q, scratch.s);
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
        renderOrder={1}
      >
        <shaderMaterial
          ref={matRef}
          attach="material"
          vertexShader={fishVertex}
          fragmentShader={fishFragment}
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

export default function Clownfish({ progress }: SceneElementProps) {
  return (
    <>
      <School progress={progress} dir={1} laneY={LANE_LR} phase={0} />
      <School progress={progress} dir={-1} laneY={LANE_RL} phase={X_SPAN * 0.5} />
    </>
  );
}
