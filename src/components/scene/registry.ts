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
 * Elements draw in array order (later entries render after earlier ones). The
 * Phase-1 scene ships with just the water column; fog is handled separately by
 * the FogController inside OceanScene since it mutates scene.fog rather than
 * rendering a mesh.
 */

import WaterColumn from "./elements/WaterColumn";
import BioParticles from "./elements/BioParticles";
import CoralReef from "./elements/CoralReef";
import Kelp from "./elements/Kelp";
import Octopus from "./elements/Octopus";
import Anglerfish from "./elements/Anglerfish";
import Sharks from "./elements/Sharks";
import SeaTurtle from "./elements/SeaTurtle";
import FishSchool from "./elements/FishSchool";
import Clownfish from "./elements/Clownfish";
import CausticsLight from "./elements/CausticsLight";
import WaterSurface from "./elements/WaterSurface";
import Sailboats from "./elements/Sailboats";
import WaterSkier from "./elements/WaterSkier";
import Sky from "./elements/Sky";
import type { SceneElementEntry } from "./types";

export const SCENE_ELEMENTS: readonly SceneElementEntry[] = [
  { id: "sky", Component: Sky },
  { id: "water-column", Component: WaterColumn },
  { id: "bioparticles", Component: BioParticles },
  { id: "coral-reef", Component: CoralReef },
  { id: "kelp", Component: Kelp },
  { id: "octopus", Component: Octopus },
  { id: "anglerfish", Component: Anglerfish },
  { id: "sharks", Component: Sharks },
  { id: "sea-turtle", Component: SeaTurtle },
  { id: "fishschool", Component: FishSchool },
  { id: "clownfish", Component: Clownfish },
  { id: "caustics-light", Component: CausticsLight },
  { id: "water-surface", Component: WaterSurface },
  { id: "sailboats", Component: Sailboats },
  { id: "water-skier", Component: WaterSkier },
];
