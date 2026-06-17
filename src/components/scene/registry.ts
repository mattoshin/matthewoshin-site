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
import type { SceneElementEntry } from "./types";

export const SCENE_ELEMENTS: readonly SceneElementEntry[] = [
  { id: "water-column", Component: WaterColumn },
  // { id: "water-surface", Component: WaterSurface },
  // { id: "bioluminescent-particles", Component: BioParticles },
  // { id: "kelp", Component: Kelp },
  // { id: "fish", Component: Fish },
  // { id: "sharks", Component: Sharks },
];
