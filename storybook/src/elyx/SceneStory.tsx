import { Scene } from "./Scene";
import { exportOf } from "./scenes";
import type { SceneFile } from "./types";

interface SceneStoryProps {
  scene: SceneFile;
  exportRef: string;
  /** Swap control instances for the coded components. */
  codedControls?: boolean;
}

/** Story component for generated block and screen stories. */
export function SceneStory({ scene, exportRef, codedControls = true }: SceneStoryProps) {
  return <Scene scene={exportOf(scene, exportRef)} codedControls={codedControls} />;
}

export const sceneSpec = ({ scene, exportRef }: SceneStoryProps) => ({ file: scene.file, scene: exportOf(scene, exportRef) });
