"use client";

/**
 * SeaTurtle - one graceful green sea turtle gliding across the mid-water.
 *
 * The whole turtle is baked into ONE BufferGeometry (one draw call): a domed
 * carapace (shell) made of stitched rings, a flatter lighter plastron underneath,
 * four broad paddle flippers, a short neck and a small rounded head. Every vertex
 * carries two attributes the vertex shader uses for "free" animation:
 *   - aPart: which body part it belongs to (shell / plastron / flippers / head),
 *     so the flippers can flap while the shell stays rigid.
 *   - aFlap: a 0..1 root->tip weight per flipper vertex (and a left/right sign
 *     baked into the geometry) so the paddles bend most at their tips and the
 *     two pairs beat in a gentle, slightly offset sine.
 *
 * Colour is split in the fragment shader by a `vShade` channel: saturated green
 * carapace (#4E9A5A) ridged with darker scute lines (#2F6B43), a pale plastron,
 * and a slightly warmer head. A soft top-down key light (sun from the surface)
 * plus a faint cyan fresnel rim that grows with depth keep it reading as a clean,
 * friendly low-poly creature that still belongs in the bioluminescent deep.
 *
 * Motion: the turtle follows its own wide, slow closed Catmull-Rom path. We
 * sample position + a look-ahead for heading, add a lazy vertical bob and a tiny
 * banking roll. The path is re-centered on the LIVE camera depth every frame
 * (exactly like Sharks) so the turtle stays framed through its whole band rather
 * than scrolling past in one beat.
 *
 * Zone band: soft entrance in `about`, full presence through `projects` +
 * `ventures`, faded out by `writing`. Off-band the group goes .visible = false
 * and the per-frame work early-returns, so it costs ~nothing elsewhere.
 *
 * Self-contained SceneElement (see scene/types.ts): procedural geometry +
 * shaders only, no external models/textures/network. Reads the shared `progress`
 * accessor imperatively each frame; never subscribes.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, lerp } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
const SHELL = new THREE.Color("#4E9A5A"); // green carapace
const SCUTE = new THREE.Color("#2F6B43"); // darker scute ridge lines
const PLASTRON = new THREE.Color("#CFE6C2"); // pale belly
const SKIN = new THREE.Color("#5BA86A"); // head / flipper skin (slightly lighter)
const RIM = new THREE.Color("#8FE8FF"); // cool bio rim that grows with depth

// Band: soft entrance in `about` (0.16), full through `projects` (0.32..0.5) and
// `ventures` (0.5..0.66), gone by `writing` (>=0.66). Asymmetric feathers: a long
// gentle fade-in up top, a tighter fade-out so it's clear by the abyss.
const BAND_START = 0.18; // soft start a touch inside `about`
const BAND_END = 0.64; // hold full almost to the end of `ventures`
const FEATHER_IN = 0.1; // long, graceful entrance
const FEATHER_OUT = 0.06; // crisper exit before `writing`

// Part ids written into the aPart attribute (must match the shader switch).
const PART_SHELL = 0.0;
const PART_PLASTRON = 1.0;
const PART_FLIPPER = 2.0;
const PART_HEAD = 3.0;

// ---------------------------------------------------------------------------
// Procedural turtle geometry.
//
// Built facing +x (nose forward), +y up, +z right. Lengths are in local units;
// the whole thing is scaled per-rig. We assemble flat triangle soup with per-
// vertex attributes and let computeVertexNormals() face the low-poly look, then
// the shader recolours by part and bends the flippers.
// ---------------------------------------------------------------------------
function buildTurtleGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = []; // recomputed at the end
  const part: number[] = []; // which body part (see PART_*)
  const flap: number[] = []; // 0..1 root->tip flap weight (flippers only)
  const flapSide: number[] = []; // -1 / +1 which flipper pair phase; 0 elsewhere
  const shade: number[] = []; // 0 shell field .. 1 ridge line (for scute stripes)

  // ---- helper: push one triangle with shared per-vertex metadata ----
  const pushTri = (
    a: readonly [number, number, number],
    b: readonly [number, number, number],
    c: readonly [number, number, number],
    p: number,
    opts?: { flap?: number[]; flapSide?: number; shade?: number[] },
  ) => {
    const verts = [a, b, c];
    const fl = opts?.flap ?? [0, 0, 0];
    const sh = opts?.shade ?? [0, 0, 0];
    const fs = opts?.flapSide ?? 0;
    for (let k = 0; k < 3; k++) {
      positions.push(verts[k][0], verts[k][1], verts[k][2]);
      normals.push(0, 0, 0);
      part.push(p);
      flap.push(fl[k]);
      flapSide.push(fs);
      shade.push(sh[k]);
    }
  };

  // -------------------------------------------------------------------------
  // Carapace (shell): a domed oval. We build elliptical rings from the rear
  // (-x) to the front (+x), doming up in +y, then stitch them into quads. A
  // radial scute-ridge pattern is encoded in `shade` so the fragment shader can
  // paint darker seams along the dome.
  // -------------------------------------------------------------------------
  const SHELL_LEN = 1.9; // along x (nose..tail of the shell)
  const SHELL_WID = 1.35; // along z
  const SHELL_RISE = 0.62; // dome height in +y
  const RINGS = 12;
  const RADIAL = 16;

  // ring radius profile along the body: rounded front, slightly tapered tail.
  const shellProfile = (t: number) => {
    // t: 0 (tail, -x) .. 1 (front, +x)
    const oval = Math.sin(Math.PI * clamp01(t * 0.96 + 0.02)); // 0 at ends, 1 mid
    const frontBias = 0.82 + 0.18 * t; // a touch broader toward the head
    return Math.pow(oval, 0.62) * frontBias;
  };

  // Pre-build the ring vertex grid (positions + their shade value).
  const grid: Array<Array<[number, number, number]>> = [];
  const gridShade: number[][] = [];
  for (let i = 0; i <= RINGS; i++) {
    const t = i / RINGS;
    const x = (t - 0.5) * SHELL_LEN;
    const r = shellProfile(t);
    const row: Array<[number, number, number]> = [];
    const rowShade: number[] = [];
    for (let j = 0; j <= RADIAL; j++) {
      const a = (j / RADIAL) * Math.PI; // 0..PI -> top half ring (z from +.. -)
      const z = Math.cos(a) * r * SHELL_WID * 0.5;
      // dome height: tallest along the spine (a near 0 and PI -> sides low,
      // a == PI/2 -> top), modulated by how far along the body we are.
      const domeAcross = Math.sin(a); // 0 at sides, 1 at the crest
      const y = domeAcross * SHELL_RISE * r;
      row.push([x, y, z]);
      // Scute seams: ridge where either the longitudinal index (i) or the
      // radial index (j) lands on a seam line -> a soft triangular wave.
      const longSeam = Math.abs(((t * 5.0) % 1.0) - 0.5) * 2.0; // 5 rows of scutes
      const radSeam = Math.abs(((j / RADIAL) * 4.0 % 1.0) - 0.5) * 2.0; // 4 cols
      const seam = Math.min(longSeam, radSeam);
      rowShade.push(1.0 - smooth(seam, 0.0, 0.18)); // 1 on the seam, 0 in field
    }
    grid.push(row);
    gridShade.push(rowShade);
  }

  for (let i = 0; i < RINGS; i++) {
    for (let j = 0; j < RADIAL; j++) {
      const a = grid[i][j];
      const b = grid[i][j + 1];
      const c = grid[i + 1][j];
      const d = grid[i + 1][j + 1];
      const sa = gridShade[i][j];
      const sb = gridShade[i][j + 1];
      const sc = gridShade[i + 1][j];
      const sd = gridShade[i + 1][j + 1];
      pushTri(a, b, c, PART_SHELL, { shade: [sa, sb, sc] });
      pushTri(b, d, c, PART_SHELL, { shade: [sb, sd, sc] });
    }
  }

  // Skirt: drop the shell rim down a little so the carapace has thickness and
  // the plastron tucks under it (avoids a paper-thin edge).
  const SKIRT = 0.14;
  for (let i = 0; i < RINGS; i++) {
    // edge vertices live at j=0 and j=RADIAL (the two sides, z extremes)
    for (const j of [0, RADIAL]) {
      const top0 = grid[i][j];
      const top1 = grid[i + 1][j];
      const low0: [number, number, number] = [top0[0], top0[1] - SKIRT, top0[2]];
      const low1: [number, number, number] = [top1[0], top1[1] - SKIRT, top1[2]];
      if (j === 0) {
        pushTri(top0, low0, top1, PART_SHELL, { shade: [1, 1, 1] });
        pushTri(top1, low0, low1, PART_SHELL, { shade: [1, 1, 1] });
      } else {
        pushTri(top0, top1, low0, PART_SHELL, { shade: [1, 1, 1] });
        pushTri(top1, low1, low0, PART_SHELL, { shade: [1, 1, 1] });
      }
    }
  }

  // -------------------------------------------------------------------------
  // Plastron (belly): a flatter, lighter oval disc just under the carapace,
  // very slightly dished. Built as a fan so it's one tidy cap.
  // -------------------------------------------------------------------------
  const PLA_Y = -0.1;
  const PLA_LEN = SHELL_LEN * 0.92;
  const PLA_WID = SHELL_WID * 0.84;
  const plaCenter: [number, number, number] = [0.04, PLA_Y - 0.02, 0];
  const PLA_SEG = 22;
  for (let j = 0; j < PLA_SEG; j++) {
    const a0 = (j / PLA_SEG) * Math.PI * 2;
    const a1 = ((j + 1) / PLA_SEG) * Math.PI * 2;
    const r = 0.5;
    const p0: [number, number, number] = [
      0.04 + Math.cos(a0) * r * PLA_LEN,
      PLA_Y + (Math.cos(a0) > 0 ? 0.02 : 0), // hair higher toward the head
      Math.sin(a0) * r * PLA_WID,
    ];
    const p1: [number, number, number] = [
      0.04 + Math.cos(a1) * r * PLA_LEN,
      PLA_Y + (Math.cos(a1) > 0 ? 0.02 : 0),
      Math.sin(a1) * r * PLA_WID,
    ];
    // wind so the plastron faces DOWN (-y)
    pushTri(plaCenter, p1, p0, PART_PLASTRON);
  }

  // -------------------------------------------------------------------------
  // Flippers: four broad paddles. Front pair (large) near the shoulders, rear
  // pair (smaller) near the tail. Each is a flat tapered quad sheet swept out
  // and back, with a flap weight ramping root->tip and a side sign so the
  // shader beats them with a gentle sine. Front and rear pairs share the same
  // left/right sign but the shader offsets rear phase slightly.
  // -------------------------------------------------------------------------
  const addFlipper = (
    rootX: number,
    rootZ: number, // signed: +z right, -z left
    length: number,
    width: number,
    sweep: number, // how far back the tip trails (-x)
    droop: number, // tip lowers (-y) at rest
    side: number, // -1 left, +1 right (for flap phase sign)
  ) => {
    const sgn = Math.sign(rootZ) || side;
    // Root edge (attached to body), front and back corners.
    const rootFrontX = rootX + width * 0.35;
    const rootBackX = rootX - width * 0.35;
    const rootY = -0.02;
    const tipX = rootX - sweep;
    const tipZ = rootZ + sgn * length;
    const tipY = rootY - droop;

    const rFront: [number, number, number] = [rootFrontX, rootY, rootZ];
    const rBack: [number, number, number] = [rootBackX, rootY, rootZ];
    // mid spar gives the paddle a little curve + a smoother bend
    const midX = rootX - sweep * 0.4;
    const midZ = rootZ + sgn * length * 0.55;
    const midY = rootY - droop * 0.35;
    const mFront: [number, number, number] = [midX + width * 0.22, midY, midZ];
    const mBack: [number, number, number] = [midX - width * 0.3, midY, midZ];
    const tip: [number, number, number] = [tipX, tipY, tipZ];

    // root->tip flap weights for each vertex
    const wRoot = 0.0;
    const wMid = 0.5;
    const wTip = 1.0;

    // root quad -> two tris (root pair to mid pair)
    pushTri(rFront, mFront, rBack, PART_FLIPPER, {
      flap: [wRoot, wMid, wRoot],
      flapSide: side,
    });
    pushTri(rBack, mFront, mBack, PART_FLIPPER, {
      flap: [wRoot, wMid, wMid],
      flapSide: side,
    });
    // mid -> tip (taper to a point)
    pushTri(mFront, tip, mBack, PART_FLIPPER, {
      flap: [wMid, wTip, wMid],
      flapSide: side,
    });
  };

  // Front pair (large, around the shoulders, swept gracefully back).
  addFlipper(0.55, 0.5, 1.55, 0.6, 0.55, 0.12, 1); // right
  addFlipper(0.55, -0.5, 1.55, 0.6, 0.55, 0.12, -1); // left
  // Rear pair (smaller, near the tail).
  addFlipper(-0.7, 0.42, 0.78, 0.4, 0.3, 0.06, 1); // right
  addFlipper(-0.7, -0.42, 0.78, 0.4, 0.3, 0.06, -1); // left

  // -------------------------------------------------------------------------
  // Neck + head: a short tapered neck poking out the front, capped by a small
  // rounded head. Built as a few stitched rings (cheap) so it reads as a head,
  // not a cone.
  // -------------------------------------------------------------------------
  const neckBaseX = SHELL_LEN * 0.5 - 0.05;
  const headTipX = neckBaseX + 0.62;
  const headRings = [
    { x: neckBaseX, r: 0.2, y: 0.02 },
    { x: neckBaseX + 0.22, r: 0.17, y: 0.07 },
    { x: neckBaseX + 0.42, r: 0.2, y: 0.1 }, // the head swells a bit
    { x: headTipX, r: 0.11, y: 0.09 },
  ];
  const headRadial = 8;
  const headGrid: Array<Array<[number, number, number]>> = headRings.map((ring) => {
    const row: Array<[number, number, number]> = [];
    for (let j = 0; j <= headRadial; j++) {
      const a = (j / headRadial) * Math.PI * 2;
      row.push([ring.x, ring.y + Math.sin(a) * ring.r, Math.cos(a) * ring.r]);
    }
    return row;
  });
  for (let i = 0; i < headGrid.length - 1; i++) {
    for (let j = 0; j < headRadial; j++) {
      const a = headGrid[i][j];
      const b = headGrid[i][j + 1];
      const c = headGrid[i + 1][j];
      const d = headGrid[i + 1][j + 1];
      pushTri(a, c, b, PART_HEAD);
      pushTri(b, c, d, PART_HEAD);
    }
  }
  // cap the snout
  const snout: [number, number, number] = [headTipX + 0.08, 0.085, 0];
  const lastRow = headGrid[headGrid.length - 1];
  for (let j = 0; j < headRadial; j++) {
    pushTri(snout, lastRow[j], lastRow[j + 1], PART_HEAD);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("aPart", new THREE.Float32BufferAttribute(part, 1));
  geo.setAttribute("aFlap", new THREE.Float32BufferAttribute(flap, 1));
  geo.setAttribute("aFlapSide", new THREE.Float32BufferAttribute(flapSide, 1));
  geo.setAttribute("aShade", new THREE.Float32BufferAttribute(shade, 1));
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

// Smoothstep helper used at build time (kept tiny + local, no deps).
function smooth(x: number, edge0: number, edge1: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

// ---------------------------------------------------------------------------
// Shader: low-poly key-lit body, recoloured per part, with flipper flap baked
// into the vertex stage and a depth-driven cyan fresnel rim.
// ---------------------------------------------------------------------------
const vertexShader = /* glsl */ `
  precision highp float;

  attribute float aPart;     // 0 shell, 1 plastron, 2 flipper, 3 head
  attribute float aFlap;     // 0 root .. 1 tip (flippers)
  attribute float aFlapSide; // -1 left, +1 right, 0 otherwise
  attribute float aShade;    // 0 field .. 1 scute seam

  uniform float uTime;
  uniform float uFlapPhase;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vPart;
  varying float vShade;
  varying float vUp; // local-space up coordinate, for plastron/back blending

  void main() {
    vec3 pos = position;
    vPart = aPart;
    vShade = aShade;
    vUp = position.y;

    // --- Flipper flap: a gentle sine, ramped root->tip, beating up/down. The
    // rear pair lags the front pair slightly via a part-aware phase nudge. ---
    if (aPart > 1.5 && aPart < 2.5) {
      // front flippers sit forward (x>0), rear behind (x<0): offset their phase
      float rearLag = position.x < 0.0 ? 0.6 : 0.0;
      float beat = sin(uTime * 1.7 + uFlapPhase - rearLag);
      // tips travel most; quadratic weight for an organic bend
      float w = aFlap * aFlap;
      // vertical paddle stroke (the main flap)
      pos.y += beat * w * 0.55;
      // slight twist so the paddle isn't a rigid flat sheet
      pos.z += beat * w * 0.06 * aFlapSide;
    }

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uShell;
  uniform vec3 uScute;
  uniform vec3 uPlastron;
  uniform vec3 uSkin;
  uniform vec3 uRim;
  uniform float uDepth;   // 0 shallow .. 1 deep -> rim glow grows
  uniform float uFade;    // group opacity

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vPart;
  varying float vShade;
  varying float vUp;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDir);

    // Soft top-down key light (sun filtering down from the surface).
    vec3 L = normalize(vec3(0.2, 1.0, 0.35));
    float diff = clamp(dot(N, L), 0.0, 1.0);
    float ambient = 0.4;

    // Base colour by body part.
    vec3 base;
    if (vPart < 0.5) {
      // shell: green field, darker scute seams ridged in.
      base = mix(uShell, uScute, vShade);
      // a little extra darkening on the underside of the skirt.
      base = mix(base, uScute, clamp(-vUp * 1.2, 0.0, 0.4));
    } else if (vPart < 1.5) {
      base = uPlastron;                  // pale belly
    } else if (vPart < 2.5) {
      base = mix(uSkin, uShell, 0.25);   // flipper skin
    } else {
      base = uSkin;                      // head
    }

    vec3 col = base * (ambient + (1.0 - ambient) * diff);

    // Gentle specular sheen so the wet shell catches the key light.
    float spec = pow(clamp(dot(reflect(-L, N), V), 0.0, 1.0), 18.0);
    col += vec3(0.9, 1.0, 0.95) * spec * 0.18 * (vPart < 0.5 ? 1.0 : 0.4);

    // Depth-driven cyan fresnel rim (ties it to the bioluminescent palette).
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    col += uRim * fres * (0.18 + uDepth * 0.5);

    gl_FragColor = vec4(col, uFade);
  }
`;

// ---------------------------------------------------------------------------
// A wide, slow, closed path the turtle glides along. Coordinates are LOCAL to
// the group, which we slide to the live camera depth each frame. The loop is a
// broad shallow oval drifting mostly across (x) with a lazy z arc, kept well in
// front of the camera so the turtle reads at a comfortable mid distance.
// ---------------------------------------------------------------------------
function buildPath(): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const N = 10;
  const radiusX = 16; // wide horizontal travel
  const radiusZ = 7; // gentle depth arc
  const zOff = -15; // sit comfortably in front of the camera
  const yWobble = 1.6;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const x = Math.cos(a) * radiusX;
    const z = Math.sin(a) * radiusZ + zOff;
    // a slow, lazy vertical glide that never gets steep
    const y = Math.sin(a * 1.0) * yWobble + Math.sin(a * 2.0 + 0.7) * 0.5;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);
}

export default function SeaTurtle({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => buildTurtleGeometry(), []);
  const path = useMemo(() => buildPath(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlapPhase: { value: 0 },
      uShell: { value: SHELL.clone() },
      uScute: { value: SCUTE.clone() },
      uPlastron: { value: PLASTRON.clone() },
      uSkin: { value: SKIN.clone() },
      uRim: { value: RIM.clone() },
      uDepth: { value: 0 },
      uFade: { value: 0 },
    }),
    [],
  );

  // Smoothed band fade so scroll jumps glide instead of snapping.
  const fade = useRef(0);
  const clock = useRef(0);

  // Reusable scratch objects -> zero per-frame allocation. Held in a ref (not a
  // useMemo value) and built lazily on the first heavy frame, because the React
  // Compiler forbids mutating values returned from hooks; refs are mutable.
  const scratchRef = useRef<{
    pos: THREE.Vector3;
    ahead: THREE.Vector3;
    up: THREE.Vector3;
    m: THREE.Matrix4;
    q: THREE.Quaternion;
    qYaw: THREE.Quaternion;
    qRoll: THREE.Quaternion;
    fwdAxis: THREE.Vector3;
  } | null>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!group || !mesh || !mat) return;

    const p = progress.get();

    // ---- Zone gate: visible only inside the band (+asymmetric feathers). ----
    const inFeatheredBand =
      p > BAND_START - FEATHER_IN && p < BAND_END + FEATHER_OUT;
    const edgeIn = clamp01((p - (BAND_START - FEATHER_IN)) / FEATHER_IN);
    const edgeOut = clamp01((BAND_END + FEATHER_OUT - p) / FEATHER_OUT);
    const targetFade = inFeatheredBand ? Math.min(edgeIn, edgeOut) : 0;
    fade.current = lerp(fade.current, targetFade, Math.min(1, delta * 2.5));

    if (!inFeatheredBand && fade.current < 0.01) {
      if (group.visible) group.visible = false;
      return; // heavy work skipped entirely off-band
    }
    group.visible = true;

    // Lazily build the mutable scratch set on the first heavy frame.
    if (!scratchRef.current) {
      scratchRef.current = {
        pos: new THREE.Vector3(),
        ahead: new THREE.Vector3(),
        up: new THREE.Vector3(0, 1, 0),
        m: new THREE.Matrix4(),
        q: new THREE.Quaternion(),
        qYaw: new THREE.Quaternion(),
        qRoll: new THREE.Quaternion(),
        fwdAxis: new THREE.Vector3(1, 0, 0),
      };
    }
    const scratch = scratchRef.current;

    clock.current += delta;
    const t = clock.current;

    // Uniforms (own live material -> lint-safe to mutate).
    mat.uniforms.uTime.value = t;
    mat.uniforms.uFlapPhase.value = 0.0;
    mat.uniforms.uFade.value = fade.current;
    mat.uniforms.uDepth.value = clamp01((p - BAND_START) / (BAND_END - BAND_START));

    // Re-center the path on the live camera depth (like Sharks) so the turtle
    // stays framed through its whole band rather than drifting past in one beat.
    group.position.y = state.camera.position.y;
    group.position.z = state.camera.position.z;

    // ---- Follow the path: slow, graceful glide ----
    const SPEED = 0.018; // loop fraction per second -> a calm, unhurried cruise
    const u0 = (t * SPEED) % 1;
    path.getPointAt(u0, scratch.pos);
    const uAhead = (u0 + 0.02) % 1;
    path.getPointAt(uAhead, scratch.ahead);

    // lazy extra bob layered on top of the path's own gentle rise/fall
    scratch.pos.y += Math.sin(t * 0.5) * 0.4;

    mesh.position.copy(scratch.pos);

    // Orient: lookAt aims local -z at the target; our turtle forward axis is +x,
    // so build the lookAt rotation then yaw +90deg to map +x -> -z.
    scratch.m.lookAt(scratch.pos, scratch.ahead, scratch.up);
    scratch.q.setFromRotationMatrix(scratch.m);
    scratch.qYaw.setFromAxisAngle(scratch.up, Math.PI * 0.5);
    scratch.q.multiply(scratch.qYaw);

    // Gentle banking roll into the turn + a sympathetic sway with the flap.
    const roll = Math.sin(t * 0.4) * 0.12 + Math.sin(t * 1.7) * 0.03;
    scratch.qRoll.setFromAxisAngle(scratch.fwdAxis, roll);
    scratch.q.multiply(scratch.qRoll);

    mesh.quaternion.copy(scratch.q);
    mesh.scale.setScalar(1.0);
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh ref={meshRef} geometry={geometry} frustumCulled={false} renderOrder={2}>
        <shaderMaterial
          ref={matRef}
          attach="material"
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>
    </group>
  );
}
