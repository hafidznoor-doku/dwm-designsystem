import type { ReactNode } from "react";
import type { NodeSpec, Paint, SceneExport, SceneFile, SceneNode } from "./types";

/**
 * Builds the coded component for an Elyx node: either an export's root, or an
 * instance of it inside a block or screen (with that screen's text overrides).
 * `variant` holds the export's Figma properties, e.g. { Size: "default", variant: "primary", state: "default" }.
 */
export type FromElyx = (node: SceneNode, variant: Record<string, string>, exp: SceneExport) => ReactNode;

/**
 * Instance renderers for every export of a control file (or only the given Figma sets).
 * A renderer returns null when the instance restyles its root (fill, border,
 * padding, radius, alignment) beyond what the variant defines; the scene then
 * draws the Elyx layers so the design stays exact.
 */
export function instancesFor(scene: SceneFile, fromElyx: FromElyx, sets?: string[]) {
  const out: Record<string, (node: SceneNode) => ReactNode> = {};
  for (const e of scene.exports) {
    if (sets && !sets.includes(e.set)) continue;
    out[`${scene.file}#${e.ref}`] = (node) => (node === e.root || !restyled(node.spec, e.root.spec) ? fromElyx(node, e.props ?? {}, e) : null);
  }
  return out;
}

const paintKey = (p?: Paint[]) => JSON.stringify((p ?? []).map((x) => [x.type, x.token ?? x.value, x.width]));

function restyled(a: NodeSpec, b: NodeSpec) {
  return paintKey(a.fills) !== paintKey(b.fills)
    || paintKey(a.borders) !== paintKey(b.borders)
    || JSON.stringify(a.radius) !== JSON.stringify(b.radius)
    || JSON.stringify(a.layout && [a.layout.pad, a.layout.justify, a.layout.align, a.layout.gap])
      !== JSON.stringify(b.layout && [b.layout.pad, b.layout.justify, b.layout.align, b.layout.gap]);
}

/** Icon file name (no extension) of a visible asset layer, following icon swaps. */
export function iconOf(root: SceneNode, name: string): string | undefined {
  const find = (n: SceneNode): SceneNode | undefined => (n.n === name ? n : n.c?.map(find).find(Boolean));
  const n = find(root);
  return n && !n.hidden && n.asset ? n.asset.src.split("/").pop()!.replace(/\.svg$/, "") : undefined;
}

/** Elyx variant property → prop value, e.g. "text primary" → "textPrimary". */
export const camelValue = (v: string) => v.trim().replace(/[\s_-]+(\w)/g, (_, c: string) => c.toUpperCase());
