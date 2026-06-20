/**
 * scene/registry.ts - the ordered list of scene elements rendered by OceanScene.
 *
 * THIS is the only file you edit to add or remove a 3D element. See the full
 * contract in src/components/scene/types.ts. Elements draw in array order (later
 * entries render after earlier ones).
 *
 * THE DEEP: the cartoon surface elements (Surface sky shader, Sailboats,
 * WaterSkier) and the cartoon mid/deep props (Submarine, FishPatrol) are retired.
 * Their files remain on disk (checkpointed) but are no longer mounted. The scene
 * is now the cinematic WaterColumn (gradient + god-ray) plus drifting particles.
 * Tasteful bioluminescent per-zone accents are added in a later pass.
 */

import WaterColumn from "./elements/WaterColumn";
import DescentBubbles from "./elements/DescentBubbles";
import type { SceneElementEntry } from "./types";

export const SCENE_ELEMENTS: readonly SceneElementEntry[] = [
  { id: "water-column", Component: WaterColumn },
  { id: "descent-bubbles", Component: DescentBubbles },
];
