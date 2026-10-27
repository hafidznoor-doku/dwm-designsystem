import renders from "../generated/renders.json";
import tokenList from "../generated/tokens.json";
import visual from "../generated/visual.json";
import type { SceneExport, SceneFile, Token } from "./types";

export const tokens = new Map((tokenList as Token[]).map((t) => [t.key, t]));

/** The Elyx PNG for an export, as rendered by scripts/build-catalog.mjs. */
export const renderOf = (file: string, ref: string): string | undefined => (renders as Record<string, string>)[`${file}#${ref}`];

export function exportOf(scene: SceneFile, ref: string): SceneExport {
  const e = scene.exports.find((x) => x.ref === ref);
  if (!e) throw new Error(`${scene.file} has no export ${ref}`);
  return e;
}

/** Exports of one Figma component set, in file order. */
export const variantsOf = (scene: SceneFile, set: string) => scene.exports.filter((e) => e.set === set && e.props);

/** The export whose Figma variant properties match `props`. */
export function findVariant(scene: SceneFile, set: string, props: Record<string, string>): SceneExport | undefined {
  return variantsOf(scene, set).find((e) => Object.entries(props).every(([k, v]) => e.props![k] === v));
}

/** Last scripts/check-visual.mjs result for an export: percent of differing pixels. */
export const visualOf = (file: string, ref: string) =>
  (visual as Record<string, { diff?: number; sizeDelta?: number[]; error?: string }>)[`${file}#${ref}`];
