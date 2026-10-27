import type { ReactNode } from "react";
import { instanceRenderers } from "../components/registry";
import type { SceneExport, SceneNode } from "./types";

interface SceneProps {
  scene: SceneExport;
  /** Render control instances with the coded components (default) or as Elyx layers. */
  codedControls?: boolean;
  /** Layer names to show even though they are hidden in the design (optional icons, alternate states). */
  show?: string[];
}

/** Renders an Elyx export as live HTML/CSS. */
export function Scene({ scene, codedControls = true, show = [] }: SceneProps) {
  const render = (n: SceneNode, key?: number): ReactNode => {
    if (n.hidden && !show.includes(n.n)) return null;
    if (codedControls && n.inst) {
      const coded = instanceRenderers[`${n.inst.file}#${n.inst.symbol}`]?.(n);
      if (coded) {
        return (
          <div key={key} className={`${n.cls}--place`} data-elyx={n.n} data-coded="">
            {coded}
          </div>
        );
      }
    }
    if (n.t === "text") {
      return (
        <span key={key} className={n.cls} data-elyx={n.n} style={textDecoration(n)}>
          {n.text!.content}
        </span>
      );
    }
    return (
      <div key={key} className={n.cls} data-elyx={n.n} role={n.asset ? "img" : undefined} aria-label={n.asset ? n.n : undefined}>
        {n.c?.map(render)}
      </div>
    );
  };

  return (
    <>
      <style href={scene.root.cls} precedence="elyx-scene">
        {scene.css}
      </style>
      {render(scene.root)}
    </>
  );
}

const textDecoration = (n: SceneNode) => {
  const d = [n.text!.underline && "underline", n.text!.strikethrough && "line-through"].filter(Boolean).join(" ");
  return d ? { textDecoration: d } : undefined;
};

// ---- helpers for coded controls reading an Elyx instance ----

export function findNode(root: SceneNode, name: string): SceneNode | undefined {
  if (root.n === name) return root;
  for (const c of root.c ?? []) {
    const hit = findNode(c, name);
    if (hit) return hit;
  }
  return undefined;
}

/** First text content in the subtree, optionally under a named layer. */
export function textOf(root: SceneNode, name?: string): string | undefined {
  const start = name ? findNode(root, name) : root;
  if (!start) return undefined;
  if (start.text) return start.text.content;
  for (const c of start.c ?? []) {
    if (c.hidden) continue;
    const t = textOf(c);
    if (t !== undefined) return t;
  }
  return undefined;
}

export const isShown = (root: SceneNode, name: string) => {
  const n = findNode(root, name);
  return !!n && !n.hidden;
};
