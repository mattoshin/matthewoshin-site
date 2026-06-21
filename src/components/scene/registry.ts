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
