"use client";

/**
 * Sailboats - THE BLACK PEARL. A papercut galleon silhouette riding the surface:
 * a long near-black hull with a tall stern castle + stern lantern, the ship's
 * name "BLACK PEARL" in white on the hull, three masts of WHITE square sails, a
 * skull-and-crossbones on the mainsail, rigging stays, flags at each masthead,
 * and a bowsprit + figurehead. Flat camera-facing shapes (ShapeGeometry / Plane),
 * the scene's papercut idiom - just bigger and menacing.
 *
 * SURFACE band: past ~progress 0.24 it hides + early-returns. While visible it
 * DRIFTS UP with the surface. It rides a FAR plane (z=-15) vs the Lamborghini
 * speedboat (z=-10), cruising slowly LEFT -> RIGHT (opposite the Lambo), wrapping
 * with an opacity edge-fade so the loop is a seamless carousel, not a teleport.
 *
 * Contract: default-exported SceneElement; reads `progress` imperatively each
 * frame; mutates ONLY refs it owns to satisfy the React-Compiler lint.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDeviceTier } from "@/lib/useDeviceTier";
import type { SceneElementProps } from "../types";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

// Phone-only staggered intro: the Black Pearl arrives AFTER the Lamborghini
// (WaterSkier), so the two hero pieces load at visibly different times rather
// than popping in together. Desktop/tablet are unchanged.
const INTRO_DELAY = 1.2; // seconds after load before the ship starts to appear
const INTRO_DURATION = 1.0; // seconds to ease to full opacity

/** Shared sine-sum swell (same sea the water-skier rides). */
function swell(x: number, z: number, t: number): number {
  return (
    Math.sin(x * 0.6 + t * 0.9) * 0.16 +
    Math.sin(z * 0.8 - t * 0.7) * 0.12 +
    Math.sin((x + z) * 0.35 + t * 0.45) * 0.1
  );
}

// Palette.
const HULL = "#140f0d"; // near-black weathered hull
const TRIM = "#2a201a"; // faint warm gunwale line
const MASTC = "#0d0b0a"; // dark masts / yards
const RIGC = "#171210"; // rigging stays
const SAIL_LO = "#efe9db"; // WHITE canvas (lower sails)
const SAIL_HI = "#f7f3ea"; // brighter white (upper sails)
const FLAGC = "#0e0e14"; // torn flags
const LANTERN = "#c69248"; // faint warm stern-lantern glow
const EMBLEM = "#16120f"; // skull + crossbones, dark on the white sail

// Camera at z=8; seat on the painted horizon: y = HORIZON_K * (CAM_Z - z).
const CAM_Z = 8;
const HORIZON_K = 0.31;

// Surface band: drift up with the surface, then hide.
const SURFACE_DRIFT = 1900;
const SURFACE_GONE = 0.24;

// Far depth plane + size (smaller so the tall masts clear the top of the view).
const SHIP_Z = -15;
const SHIP_SCALE = 0.95;

// Slow LEFT -> RIGHT cruise, wrapping.
const DRIFT_SPEED = 0.3; // world units / second
const X_LEFT = -13;
const X_RIGHT = 13;
const X_SPAN = X_RIGHT - X_LEFT;

// Asymmetric carousel fade: near-instant fade-IN at the entering (left) edge,
// slow graceful fade-OUT at the exiting (right) edge.
const ENTER_AT = -12.4;  // x where it begins to appear (left)
const ENTER_SOFT = 0.7;  // narrow band -> almost instant fade-in
const EXIT_AT = 12.8;    // x where it's fully gone (right)
const EXIT_SOFT = 4.8;   // wide band -> slow fade-out

// PHONE carousel: tighter range + faster cruise (~22s loop vs ~87s) so the Black
// Pearl reappears regularly on a narrow viewport. SHIP_Z / horizon unchanged.
const PHONE_X_LEFT = -10;
const PHONE_X_RIGHT = 10;
const PHONE_X_SPAN = PHONE_X_RIGHT - PHONE_X_LEFT;
const PHONE_DRIFT_SPEED = 0.9;
const PHONE_ENTER_AT = -9.5;
const PHONE_EXIT_AT = 9.7;

const DECK_Y = 0.18; // mast bases + sheer line

const C = (hex: string) => new THREE.Color(hex);

// ---------------------------------------------------------------------------
// Geometry helpers — flat papercut shapes, bow to the RIGHT.
// ---------------------------------------------------------------------------

function makeHullGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-2.06, 0.0);
  s.lineTo(-2.06, 1.0);
  s.lineTo(-1.34, 1.02);
  s.lineTo(-1.26, 0.34);
  s.lineTo(-1.12, 0.30);
  s.lineTo(1.30, 0.16);
  s.lineTo(2.0, 0.5);
  s.lineTo(2.12, 0.2);
  s.lineTo(1.96, -0.06);
  s.quadraticCurveTo(0.7, -0.52, -0.5, -0.5);
  s.quadraticCurveTo(-1.7, -0.48, -2.06, 0.0);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeGunwaleGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-1.26, 0.30);
  s.lineTo(1.30, 0.14);
  s.lineTo(1.30, 0.085);
  s.lineTo(-1.26, 0.245);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeBowspritGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(1.98, 0.34);
  s.lineTo(3.0, 0.66);
  s.lineTo(3.02, 0.575);
  s.lineTo(2.0, 0.255);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeFigureheadGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(1.98, 0.06);
  s.lineTo(2.26, 0.12);
  s.lineTo(2.2, -0.02);
  s.lineTo(2.04, -0.06);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeLanternGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-1.99, 1.0);
  s.lineTo(-1.96, 1.0);
  s.lineTo(-1.96, 1.14);
  s.lineTo(-1.93, 1.14);
  s.lineTo(-1.93, 1.28);
  s.lineTo(-2.05, 1.28);
  s.lineTo(-2.05, 1.14);
  s.lineTo(-1.99, 1.14);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeFlagGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(0, 0.26);
  s.lineTo(0.5, 0.215);
  s.lineTo(0.36, 0.14);
  s.lineTo(0.56, 0.095);
  s.lineTo(0.33, 0.04);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeMastGeometry(height: number): THREE.BufferGeometry {
  const g = new THREE.PlaneGeometry(0.085, height);
  g.translate(0, height / 2, 0);
  return g;
}

function makeSquareSail(w: number, h: number): THREE.BufferGeometry {
  const hw = w / 2;
  const s = new THREE.Shape();
  s.moveTo(-hw, 0);
  s.lineTo(hw, 0);
  s.lineTo(hw, -h * 0.74);
  s.quadraticCurveTo(0, -h * 1.12, -hw, -h * 0.74);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeYardGeometry(w: number): THREE.BufferGeometry {
  return new THREE.PlaneGeometry(w + 0.22, 0.06);
}

function makeLineGeometry(
  a: readonly [number, number],
  b: readonly [number, number],
  width: number,
): THREE.BufferGeometry {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * (width / 2);
  const ny = (dx / len) * (width / 2);
  const s = new THREE.Shape();
  s.moveTo(a[0] + nx, a[1] + ny);
  s.lineTo(b[0] + nx, b[1] + ny);
  s.lineTo(b[0] - nx, b[1] - ny);
  s.lineTo(a[0] - nx, a[1] - ny);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeDiscGeometry(r: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.absarc(0, 0, r, 0, Math.PI * 2, false);
  return new THREE.ShapeGeometry(s, 24);
}

function makeBoneGeometry(len: number, w: number): THREE.BufferGeometry {
  const hl = len / 2;
  const r = w / 2;
  const s = new THREE.Shape();
  s.absarc(-hl, 0, r, Math.PI / 2, (Math.PI * 3) / 2, false);
  s.absarc(hl, 0, r, -Math.PI / 2, Math.PI / 2, false);
  s.closePath();
  return new THREE.ShapeGeometry(s, 10);
}

function makeJawGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-0.1, 0);
  s.lineTo(0.1, 0);
  s.lineTo(0.07, -0.12);
  s.lineTo(-0.07, -0.12);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

function makeNoseGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, -0.005);
  s.lineTo(0.032, -0.07);
  s.lineTo(-0.032, -0.07);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

/** "BLACK PEARL" hull wordmark as a transparent white canvas texture (client-only). */
function makeNameTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 150;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#f6f2ea";
  ctx.font = "700 96px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "5px";
  } catch {
    // ignore on engines without letterSpacing
  }
  ctx.fillText("BLACK PEARL", c.width / 2, c.height / 2 + 4);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

// Masts: mizzen (stern/left), main (center, tallest), fore (bow/right).
const MASTS = [
  { x: -1.0, h: 2.7, sails: [
      { w: 1.3, h: 0.95, y: 1.15 },
      { w: 1.05, h: 0.78, y: 2.15 },
    ] },
  { x: 0.18, h: 3.6, sails: [
      { w: 1.85, h: 1.2, y: 1.3 },
      { w: 1.55, h: 1.0, y: 2.55 },
      { w: 1.15, h: 0.78, y: 3.5 },
    ] },
  { x: 1.3, h: 3.05, sails: [
      { w: 1.55, h: 1.05, y: 1.2 },
      { w: 1.3, h: 0.9, y: 2.32 },
      { w: 1.0, h: 0.68, y: 3.05 },
    ] },
] as const;

// Skull + crossbones centered on the main course (lowest main sail).
const EMBLEM_X = MASTS[1].x;
const EMBLEM_Y = DECK_Y + MASTS[1].sails[0].y - MASTS[1].sails[0].h / 2;

export default function Sailboats({ progress }: SceneElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shipRef = useRef<THREE.Group>(null);
  const matRefs = useRef<THREE.MeshBasicMaterial[]>([]);
  const isPhone = useDeviceTier() === "phone";
  // Clock time of the first rendered frame, for the phone intro stagger.
  const introStart = useRef<number | null>(null);

  const hullGeo = useMemo(() => makeHullGeometry(), []);
  const gunwaleGeo = useMemo(() => makeGunwaleGeometry(), []);
  const bowspritGeo = useMemo(() => makeBowspritGeometry(), []);
  const figureGeo = useMemo(() => makeFigureheadGeometry(), []);
  const lanternGeo = useMemo(() => makeLanternGeometry(), []);
  const flagGeo = useMemo(() => makeFlagGeometry(), []);
  const nameTex = useMemo(() => makeNameTexture(), []);

  // Jolly Roger pieces.
  const craniumGeo = useMemo(() => makeDiscGeometry(0.16), []);
  const jawGeo = useMemo(() => makeJawGeometry(), []);
  const boneGeo = useMemo(() => makeBoneGeometry(0.64, 0.07), []);
  const eyeGeo = useMemo(() => makeDiscGeometry(0.044), []);
  const noseGeo = useMemo(() => makeNoseGeometry(), []);

  const rig = useMemo(
    () =>
      MASTS.map((m) => ({
        x: m.x,
        mast: makeMastGeometry(m.h),
        topY: DECK_Y + m.h,
        sails: m.sails.map((s, i) => ({
          yard: makeYardGeometry(s.w),
          sail: makeSquareSail(s.w, s.h),
          y: s.y,
          upper: i > 0,
        })),
      })),
    [],
  );

  const stays = useMemo(() => {
    const tops = rig.map((m) => [m.x, m.topY] as const);
    const bowsprit = [3.0, 0.66] as const;
    const sternTop = [-2.0, 1.05] as const;
    return [
      makeLineGeometry(tops[1], bowsprit, 0.022),
      makeLineGeometry(tops[2], bowsprit, 0.02),
      makeLineGeometry(tops[1], tops[2], 0.018),
      makeLineGeometry(tops[1], tops[0], 0.018),
      makeLineGeometry(tops[1], sternTop, 0.02),
      makeLineGeometry(tops[0], sternTop, 0.018),
    ];
  }, [rig]);

  const hullCol = useMemo(() => C(HULL), []);
  const trimCol = useMemo(() => C(TRIM), []);
  const mastCol = useMemo(() => C(MASTC), []);
  const rigCol = useMemo(() => C(RIGC), []);
  const sailLoCol = useMemo(() => C(SAIL_LO), []);
  const sailHiCol = useMemo(() => C(SAIL_HI), []);
  const flagCol = useMemo(() => C(FLAGC), []);
  const lanternCol = useMemo(() => C(LANTERN), []);
  const emblemCol = useMemo(() => C(EMBLEM), []);

  const collect = (el: THREE.MeshBasicMaterial | null) => {
    if (el && !matRefs.current.includes(el)) matRefs.current.push(el);
  };

  useFrame((state) => {
    const group = groupRef.current;
    const ship = shipRef.current;
    if (!group || !ship) return;

    // Stamp the intro clock on the first frame so the stagger is measured from
    // load, regardless of where the carousel happens to start.
    if (introStart.current === null) introStart.current = state.clock.elapsedTime;

    const p = progress.get();
    if (p >= SURFACE_GONE) {
      if (group.visible) group.visible = false;
      return;
    }
    if (!group.visible) group.visible = true;

    const t = state.clock.elapsedTime;

    // Phone intro: ease opacity in after INTRO_DELAY. 1 (no effect) elsewhere.
    let intro = 1;
    if (isPhone) {
      const lin = clamp01((t - introStart.current - INTRO_DELAY) / INTRO_DURATION);
      intro = lin * lin * (3 - 2 * lin); // smoothstep
    }

    group.position.y = state.camera.position.y + p * p * SURFACE_DRIFT;

    // Phones use a tighter, faster loop matched to the narrow visible band.
    const xLeft = isPhone ? PHONE_X_LEFT : X_LEFT;
    const xSpan = isPhone ? PHONE_X_SPAN : X_SPAN;
    const driftSpeed = isPhone ? PHONE_DRIFT_SPEED : DRIFT_SPEED;
    const enterAt = isPhone ? PHONE_ENTER_AT : ENTER_AT;
    const exitAt = isPhone ? PHONE_EXIT_AT : EXIT_AT;
    const x = xLeft + ((t * driftSpeed) % xSpan);
    ship.position.x = x;
    ship.position.y = HORIZON_K * (CAM_Z - SHIP_Z) + swell(x, SHIP_Z, t);
    ship.rotation.z = Math.sin(t * 0.5) * 0.025;

    const fadeIn = clamp01((x - enterAt) / ENTER_SOFT);
    const fadeOut = clamp01((exitAt - x) / EXIT_SOFT);
    const fade = Math.min(fadeIn, fadeOut) * intro;
    const mats = matRefs.current;
    for (let i = 0; i < mats.length; i++) mats[i].opacity = fade;
  });

  const mat = (color: THREE.Color) => (
    <meshBasicMaterial
      ref={collect}
      color={color}
      transparent
      opacity={0}
      depthWrite={false}
      side={THREE.DoubleSide}
      fog
    />
  );

  return (
    <group ref={groupRef} renderOrder={-5}>
      <group ref={shipRef} position={[0, 0, SHIP_Z]} scale={SHIP_SCALE}>
        {/* ---- SAILS (back) ---- */}
        {rig.map((m, mi) =>
          m.sails.map((s, si) => (
            <mesh key={`sail-${mi}-${si}`} geometry={s.sail} position={[m.x, DECK_Y + s.y, 0.0]}>
              {mat(s.upper ? sailHiCol : sailLoCol)}
            </mesh>
          )),
        )}

        {/* ---- SKULL + CROSSBONES on the mainsail ---- */}
        <group position={[EMBLEM_X, EMBLEM_Y, 0.013]}>
          <mesh geometry={boneGeo} rotation={[0, 0, 0.82]}>{mat(emblemCol)}</mesh>
          <mesh geometry={boneGeo} rotation={[0, 0, -0.82]}>{mat(emblemCol)}</mesh>
          <mesh geometry={craniumGeo} position={[0, 0.04, 0.001]}>{mat(emblemCol)}</mesh>
          <mesh geometry={jawGeo} position={[0, -0.05, 0.001]}>{mat(emblemCol)}</mesh>
          <mesh geometry={eyeGeo} position={[-0.066, 0.055, 0.002]}>{mat(sailLoCol)}</mesh>
          <mesh geometry={eyeGeo} position={[0.066, 0.055, 0.002]}>{mat(sailLoCol)}</mesh>
          <mesh geometry={noseGeo} position={[0, 0.0, 0.002]}>{mat(sailLoCol)}</mesh>
        </group>

        {/* ---- RIGGING STAYS ---- */}
        {stays.map((g, i) => (
          <mesh key={`stay-${i}`} geometry={g} position={[0, 0, 0.005]}>
            {mat(rigCol)}
          </mesh>
        ))}

        {/* ---- YARDS ---- */}
        {rig.map((m, mi) =>
          m.sails.map((s, si) => (
            <mesh key={`yard-${mi}-${si}`} geometry={s.yard} position={[m.x, DECK_Y + s.y, 0.006]}>
              {mat(mastCol)}
            </mesh>
          )),
        )}

        {/* ---- MASTS ---- */}
        {rig.map((m, mi) => (
          <mesh key={`mast-${mi}`} geometry={m.mast} position={[m.x, DECK_Y, 0.01]}>
            {mat(mastCol)}
          </mesh>
        ))}

        {/* ---- FLAGS at every masthead ---- */}
        {rig.map((m, mi) => (
          <mesh key={`flag-${mi}`} geometry={flagGeo} position={[m.x, m.topY, 0.012]}>
            {mat(flagCol)}
          </mesh>
        ))}

        {/* ---- HULL ---- */}
        <mesh geometry={hullGeo} position={[0, 0, 0.02]}>{mat(hullCol)}</mesh>
        <mesh geometry={bowspritGeo} position={[0, 0, 0.021]}>{mat(mastCol)}</mesh>
        <mesh geometry={figureGeo} position={[0, 0, 0.022]}>{mat(trimCol)}</mesh>
        <mesh geometry={gunwaleGeo} position={[0, 0, 0.024]}>{mat(trimCol)}</mesh>

        {/* ---- "BLACK PEARL" name on the hull ---- */}
        {nameTex && (
          <mesh position={[-0.32, -0.05, 0.027]}>
            <planeGeometry args={[2.5, 0.366]} />
            <meshBasicMaterial
              ref={collect}
              map={nameTex}
              transparent
              opacity={0}
              depthWrite={false}
              side={THREE.DoubleSide}
              fog
            />
          </mesh>
        )}

        {/* ---- STERN LANTERN ---- */}
        <mesh geometry={lanternGeo} position={[0, 0, 0.03]}>{mat(lanternCol)}</mesh>
      </group>
    </group>
  );
}
