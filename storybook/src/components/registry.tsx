// Maps Elyx control exports to the coded components, so generated blocks and
// screens render a real <Button>, <Toggle>, … wherever the design uses an
// instance of that control. Key: "<file>#<export>".
import type { ReactNode } from "react";
import type { SceneNode } from "../elyx/types";

type InstanceRenderer = (node: SceneNode) => ReactNode;

const modules = import.meta.glob<{ elyxInstances?: Record<string, InstanceRenderer> }>("./*/*.elyx.tsx", { eager: true });

export const instanceRenderers: Record<string, InstanceRenderer> = Object.assign(
  {},
  ...Object.values(modules).map((m) => m.elyxInstances ?? {}),
);
