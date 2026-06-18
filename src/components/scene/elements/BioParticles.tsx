"use client";

/**
 * BioParticles - the brand signature: a drifting field of bioluminescent
 * plankton. ~4000 GPU Points with additive blending and soft round sprites,
 * glowing bio-cyan / bio-aqua / bio-lumen. They drift slowly upward with a
 * curling sway and twinkle individually.
 *
 * Depth behavior (the whole point): density + brightness RAMP WITH DEPTH.
 * Barely-there as you reach the twilight (projects), then thickening and
 * glowing harder through midnight / abyss / seabed / floor (ventures ->
 * contact). It is the strongest, densest element at the very bottom.
 *
 * Implementation notes that matter:
 *   - No Bloom pass. The glow is pure additive blending + a bright emissive
 *     color + a soft radial alpha falloff in the fragment shader, so each
 *     point self-glows and clusters bloom naturally where they overlap.
 *   - One <points> => one draw call. All motion, twinkle, and the depth
 *     ramp live in the shader; the CPU only writes a couple of uniforms per
 *     frame. Counts respected (~4000).
 *   - The field is a tall slab that wraps around the camera's descent path so
 *     the camera is always *inside* the plankton. Points are modulo-wrapped in
 *     the vertex shader against the camera's Y so we never run out of field and
 *     never pay for points we can't see.
 *   - ZONE-GATE: off its band (above projects) the group goes .visible=false
 *     and useFrame early-returns, so it costs ~nothing in the sunlit half.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { hexToRgb01, lerp, clamp01 } from "@/lib/depth";
import type { SceneElementProps } from "../types";

// ---------------------------------------------------------------------------
// Tunables
// ---------------------------------------------------------------------------

const COUNT = 4000;

// The slab the plankton live in. It is centered on the camera's descending Y
// (wrapped in the shader), so these are *extents around the camera*, not world
// absolutes. Wide + deep enough that the edges never enter frame, tall enough
// that wrapping is invisible.
const FIELD_X = 46; // half-width  (x spans [-46, 46])
const FIELD_Z_NEAR = 12; // points sit between camera and a bit behind
const FIELD_Z_FAR = -34;
const FIELD_HALF_HEIGHT = 26; // points exist within +/- this of the camera Y

// Bioluminescent palette (additive, so these read as glow colors).
const BIO_CYAN = hexToRgb01("#3FE0E6"); // primary glow
const BIO_AQUA = hexToRgb01("#5FF2C8"); // green-leaning
const BIO_LUMEN = hexToRgb01("#8FE8FF"); // pale electric blue

// Depth ramp: progress at which plankton first appear, and where they hit full
// strength. Projects begins at 0.32; we let a faint dusting begin there and
// crescendo into the abyss.
const RAMP_START = 0.3; // ~ start of projects: barely there
const RAMP_FULL = 0.82; // ~ seabed: full density + brightness

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------

const vertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uCamY;       // camera world Y (negative as we descend)
  uniform float uHalfH;      // FIELD_HALF_HEIGHT
  uniform float uIntensity;  // 0..1 depth ramp -> brightness/size/visible count
  uniform float uPixelRatio;

  // Per-point static attributes.
  attribute float aSeed;     // 0..1 stable random per point
  attribute float aSize;     // base point size multiplier
  attribute float aColorMix; // 0..1 -> picks between the three bio colors
  attribute float aDrift;    // per-point drift speed scalar

  varying float vTwinkle;
  varying float vColorMix;
  varying float vGate;       // 0 = culled this point, 1 = shown

  // Cheap smooth curl-ish sway from a couple of sines. Not true curl noise but
  // reads as organic plankton meander for a fraction of the cost.
  vec3 sway(vec3 p, float t, float seed) {
    float a = seed * 6.2831853;
    float s1 = sin(t * 0.18 + a) * 0.9;
    float s2 = sin(t * 0.27 + a * 1.7 + p.y * 0.12) * 0.6;
    float s3 = cos(t * 0.13 + a * 2.3 + p.x * 0.09) * 0.7;
    return vec3(s1 + s3 * 0.4, 0.0, s2 + s1 * 0.3);
  }

  void main() {
    vColorMix = aColorMix;

    vec3 pos = position;

    // --- slow upward drift, wrapped around the camera's depth ---------------
    // Plankton rise; speed scales gently per point. We work in a frame that
    // follows the camera Y, then wrap into [camY - H, camY + H] so the field is
    // effectively infinite and always surrounds the viewer.
    float rise = uTime * (0.35 + aDrift * 0.5);
    float yLocal = pos.y + rise;                 // drift within the band
    float span = uHalfH * 2.0;
    // wrap yLocal into [-H, H] relative to camera, using camY as the center
    float rel = yLocal - uCamY;
    rel = mod(rel + uHalfH, span) - uHalfH;      // [-H, H)
    pos.y = uCamY + rel;

    // horizontal/curl meander
    pos += sway(position, uTime, aSeed) * (0.7 + aDrift);

    // --- visible-count gate -------------------------------------------------
    // Ramp the *number* of live points with depth too, not just brightness:
    // a point shows once uIntensity passes its seed threshold. Shallow ->
    // sparse, deep -> nearly all of them. This is the "thickening" effect.
    float threshold = aSeed * 0.82;              // 0..0.82
    vGate = step(threshold, uIntensity);

    // --- twinkle ------------------------------------------------------------
    // Per-point shimmer; range never fully dark so the field always breathes.
    float tw = sin(uTime * (0.9 + aSeed * 2.2) + aSeed * 40.0);
    vTwinkle = 0.55 + 0.45 * tw * tw;            // 0.55..1.0, soft pulse

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Perspective-scaled point size. Bigger + brighter as the field intensifies
    // with depth. Clamp so close points don't blow out into giant discs.
    float size = aSize * (1.0 + uIntensity * 1.6) * vGate;
    gl_PointSize = clamp(size * uPixelRatio * (60.0 / -mvPosition.z), 0.0, 26.0);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uCyan;
  uniform vec3 uAqua;
  uniform vec3 uLumen;
  uniform float uIntensity; // 0..1 depth ramp -> overall brightness
  uniform float uTime;

  varying float vTwinkle;
  varying float vColorMix;
  varying float vGate;

  void main() {
    if (vGate < 0.5) discard;

    // Soft round sprite: radial falloff, no texture. A bright core + a wide,
    // fast-fading halo gives the self-glow without a bloom pass.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;            // 0 center .. 1 edge
    if (d > 1.0) discard;

    float core = smoothstep(1.0, 0.0, d);  // 0 edge .. 1 center
    float halo = pow(core, 1.6);
    float glow = pow(core, 4.0);           // tight bright nucleus
    float alpha = halo * 0.3 + glow * 0.5;

    // Pick the bio color: cyan -> aqua -> lumen across aColorMix.
    vec3 col;
    if (vColorMix < 0.5) {
      col = mix(uCyan, uAqua, vColorMix * 2.0);
    } else {
      col = mix(uAqua, uLumen, (vColorMix - 0.5) * 2.0);
    }
    // Hot white-ish core so overlapping points read as luminous, not flat.
    col = mix(col, vec3(1.0), glow * 0.32);

    // Brightness ramps with depth + twinkle. Additive blend handles the bloom.
    float bright = (0.22 + uIntensity * 0.68) * vTwinkle;

    gl_FragColor = vec4(col * bright, alpha);
  }
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BioParticles({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  // Smoothed depth so density/brightness eases in as you sink rather than
  // popping on a fast scroll.
  const smoothedIntensity = useRef(0);

  // Build the geometry once: positions + per-point random attributes.
  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);
    const colorMix = new Float32Array(COUNT);
    const drift = new Float32Array(COUNT);

    // Deterministic pseudo-random so the field layout is stable across reloads.
    // The React Compiler forbids Math.random() during render.
    let seed = 9241;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < COUNT; i++) {
      // Spread across the slab. Y is centered on 0 here; the shader re-centers
      // it on the live camera Y every frame via wrapping.
      positions[i * 3 + 0] = (rand() * 2 - 1) * FIELD_X;
      positions[i * 3 + 1] = (rand() * 2 - 1) * FIELD_HALF_HEIGHT;
      positions[i * 3 + 2] = lerp(FIELD_Z_FAR, FIELD_Z_NEAR, rand());

      seeds[i] = rand();
      // Most points small; a few notably larger "lantern" plankton for depth.
      const r = rand();
      sizes[i] = lerp(1.4, 5.5, r * r);
      colorMix[i] = rand();
      drift[i] = rand();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aColorMix", new THREE.BufferAttribute(colorMix, 1));
    g.setAttribute("aDrift", new THREE.BufferAttribute(drift, 1));
    // Generous bounding sphere: the field wraps around the camera, so it is
    // effectively always on-screen. This prevents frustum-culling the whole
    // <points> away as the camera moves through it.
    g.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(0, 0, 0),
      FIELD_X + FIELD_HALF_HEIGHT + 40,
    );
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCamY: { value: 0 },
      uHalfH: { value: FIELD_HALF_HEIGHT },
      uIntensity: { value: 0 },
      uPixelRatio: { value: 1 },
      uCyan: { value: new THREE.Color(BIO_CYAN[0], BIO_CYAN[1], BIO_CYAN[2]) },
      uAqua: { value: new THREE.Color(BIO_AQUA[0], BIO_AQUA[1], BIO_AQUA[2]) },
      uLumen: {
        value: new THREE.Color(BIO_LUMEN[0], BIO_LUMEN[1], BIO_LUMEN[2]),
      },
    }),
    [],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    const mat = matRef.current;
    if (!group || !mat) return;

    const p = progress.get();

    // Depth ramp 0..1 across [RAMP_START, RAMP_FULL]; 0 above projects.
    const targetIntensity = clamp01((p - RAMP_START) / (RAMP_FULL - RAMP_START));

    // ZONE-GATE: fully above the field's band -> hide + bail before any work.
    // We keep a small epsilon so it doesn't flicker right at the boundary.
    if (targetIntensity <= 0.001 && smoothedIntensity.current <= 0.002) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    // Ease intensity (and thus density/brightness/size) toward target.
    smoothedIntensity.current = lerp(
      smoothedIntensity.current,
      targetIntensity,
      Math.min(1, delta * 2),
    );

    const u = mat.uniforms;
    u.uTime.value += delta;
    u.uCamY.value = state.camera.position.y;
    u.uIntensity.value = smoothedIntensity.current;
    // Account for the canvas dpr so point sizes are stable across displays.
    u.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 1.5);
  });

  return (
    <group ref={groupRef} visible={false} renderOrder={5}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </points>
    </group>
  );
}
