/**
 * scene/registry.ts - the ordered list of scene elements rendered by OceanScene.
 *
 * THIS is the only file you edit to add a new 3D element. See the full contract
 * in src/components/scene/types.ts.
 *
 * Add a line below:
 *   import Fish from "./elements/Fish";
 *   ...
 *   { id: "fish", Component: Fish },
 *
 * Elements draw in array order (later entries render after earlier ones).
 *
 * ONE SIGNATURE ANIMATION PER SECTION (by depth band):
 *   surface  -> the surface scene (Black Pearl + Lamborghini skier + dolphin)
 *   about    -> Clownfish (Nemo)            [0.16-0.32]
 *   projects -> Submarine                   [0.33-0.49]
 *   ventures -> Sharks                      [0.50-0.66]
 *   writing  -> Anglerfish                  [0.66-0.80]
 *   skills   -> Sea Turtle                  [0.76-0.90]
 *   contact  -> Octopus, on the floor       [0.90-1.0]
 * Coral + kelp are seabed SCENERY (not a moving creature). The big fish school
 * was retired - one group per section, no hundred-fish crowds.
 */

import WaterColumn from "./elements/WaterColumn";
import Dolphin from "./elements/Dolphin";
import BioParticles from "./elements/BioParticles";
import CoralReef from "./elements/CoralReef";
import Kelp from "./elements/Kelp";
import Octopus from "./elements/Octopus";
import Anglerfish from "./elements/Anglerfish";
import Submarine from "./elements/Submarine";
import Sharks from "./elements/Sharks";
import SeaTurtle from "./elements/SeaTurtle";
import Clownfish from "./elements/Clownfish";
import CausticsLight from "./elements/CausticsLight";
import WaterSurface from "./elements/WaterSurface";
import Sailboats from "./elements/Sailboats";
import WaterSkier from "./elements/WaterSkier";
import Surface from "./elements/Surface";
import type { SceneElementEntry } from "./types";
import type { DeviceTier } from "@/lib/useDeviceTier";

export const SCENE_ELEMENTS: readonly SceneElementEntry[] = [
  { id: "surface", Component: Surface },
  { id: "water-column", Component: WaterColumn },
  { id: "bioparticles", Component: BioParticles },
  { id: "coral-reef", Component: CoralReef },
  { id: "kelp", Component: Kelp },
  { id: "octopus", Component: Octopus },
  { id: "anglerfish", Component: Anglerfish },
  { id: "submarine", Component: Submarine },
  { id: "sharks", Component: Sharks },
  { id: "sea-turtle", Component: SeaTurtle },
  { id: "clownfish", Component: Clownfish },
  { id: "caustics-light", Component: CausticsLight },
  { id: "water-surface", Component: WaterSurface },
  { id: "sailboats", Component: Sailboats },
  { id: "water-skier", Component: WaterSkier },
  { id: "dolphin", Component: Dolphin },
];

/**
 * PHONE PROFILE (<= 767px). The full scene is too heavy for a phone, so we keep
 * the surface hero (sky/water + Black Pearl + Lamborghini + light plankton) plus
 * the one signature creature per section, and DROP the pure scenery + the
 * heaviest shaders + the redundant dolphin:
 *   dropped: coral-reef, kelp, caustics-light, water-surface, dolphin
 * Order is preserved by filtering the full list, so draw order never drifts.
 */
const PHONE_IDS = new Set<string>([
  "surface",
  "water-column",
  "bioparticles",
  "octopus", // contact
  "anglerfish", // writing
  "submarine", // projects
  "sharks", // ventures
  "sea-turtle", // skills
  "clownfish", // about
  "sailboats", // Black Pearl
  "water-skier", // Lamborghini
]);

/**
 * PHONE-LITE: the graceful-degradation floor. If even the phone profile can't
 * hold FPS, the PerformanceMonitor drops to this hero-only set instead of
 * blanking to the static gradient, so the Lamborghini + Black Pearl never vanish.
 */
const PHONE_LITE_IDS = new Set<string>([
  "surface",
  "water-column",
  "sailboats",
  "water-skier",
]);

export const SCENE_ELEMENTS_PHONE: readonly SceneElementEntry[] =
  SCENE_ELEMENTS.filter((e) => PHONE_IDS.has(e.id));

export const SCENE_ELEMENTS_PHONE_LITE: readonly SceneElementEntry[] =
  SCENE_ELEMENTS.filter((e) => PHONE_LITE_IDS.has(e.id));

/** Pick the element set for the current device tier + degradation state. */
export function elementsForTier(
  tier: DeviceTier,
  lite: boolean,
): readonly SceneElementEntry[] {
  if (tier !== "phone") return SCENE_ELEMENTS;
  return lite ? SCENE_ELEMENTS_PHONE_LITE : SCENE_ELEMENTS_PHONE;
}
