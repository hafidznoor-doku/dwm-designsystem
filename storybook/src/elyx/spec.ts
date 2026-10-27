// Reads developer-facing measurements out of a scene node tree.
import { tokens } from "./scenes";
import type { NodeSpec, Paint, SceneNode } from "./types";

export interface Part {
  no: number;
  node: SceneNode;
  /** Position relative to the export root. */
  x: number;
  y: number;
  depth: number;
}

const hasVisual = (s: NodeSpec) => !!(s.fills?.length || s.borders?.length || s.shadows?.length);

/** Numbered anatomy parts: visible layers that draw something, without descending into instances. */
export function anatomy(root: SceneNode, max = 24): Part[] {
  const out: Part[] = [];
  const walk = (n: SceneNode, x: number, y: number, depth: number) => {
    for (const c of n.c ?? []) {
      if (c.hidden || out.length >= max) continue;
      const cx = x + c.spec.x, cy = y + c.spec.y;
      if (c.inst || c.text || c.asset || c.t === "rect" || c.t === "ellipse" || hasVisual(c.spec)) {
        out.push({ no: out.length + 1, node: c, x: cx, y: cy, depth });
      }
      if (!c.inst) walk(c, cx, cy, depth + 1);
    }
  };
  walk(root, 0, 0, 1);
  return out;
}

export function visibleNodes(root: SceneNode): SceneNode[] {
  const out: SceneNode[] = [];
  const walk = (n: SceneNode) => {
    if (n.hidden) return;
    out.push(n);
    if (!n.inst) n.c?.forEach(walk);
  };
  walk(root);
  return out;
}

export interface ColorRow {
  layer: string;
  role: string;
  paint: Paint;
}

/** Every color a developer has to set, deduplicated by layer and role. */
export function colorRows(root: SceneNode): ColorRow[] {
  const rows: ColorRow[] = [];
  const seen = new Set<string>();
  const add = (layer: string, role: string, paint: Paint) => {
    const key = `${layer}|${role}|${paint.token ?? paint.value ?? paint.image}`;
    if (seen.has(key)) return;
    seen.add(key);
    rows.push({ layer, role, paint });
  };
  for (const n of visibleNodes(root)) {
    const role = n.text ? "Text" : n.asset ? "Icon tint" : "Background";
    for (const f of n.spec.fills ?? []) {
      if (n.asset && !n.asset.tinted) continue;
      add(n.n, f.type === "image" ? "Image" : f.type === "gradient" ? "Gradient" : role, f);
    }
    for (const b of n.spec.borders ?? []) add(n.n, `Border ${b.width}dp`, b);
  }
  return rows;
}

export function textNodes(root: SceneNode): SceneNode[] {
  const seen = new Set<string>();
  return visibleNodes(root).filter((n) => {
    if (!n.text) return false;
    const f = n.text.font;
    const key = `${f.family}|${f.weight}|${f.size}|${f.lineHeightPx}|${n.spec.fills?.[0]?.token ?? n.spec.fills?.[0]?.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ---- formatting ----

export const dp = (n: number) => `${+n.toFixed(2)}`;

export function sizeText(s: NodeSpec) {
  const one = (v: number, mode: string) => (mode === "fixed" ? dp(v) : `${mode} (${dp(v)})`);
  return `${one(s.w, s.wMode)} × ${one(s.h, s.hMode)}`;
}

export function paddingText(pad: [number, number, number, number]) {
  const [t, r, b, l] = pad;
  if (t === r && r === b && b === l) return t ? `${dp(t)}` : "0";
  if (t === b && l === r) return `${dp(t)} vertical · ${dp(l)} horizontal`;
  return `top ${dp(t)} · end ${dp(r)} · bottom ${dp(b)} · start ${dp(l)}`;
}

export function radiusText(r: NodeSpec["radius"]) {
  if (r == null) return "";
  if (typeof r === "number") return dp(r);
  return Object.entries(r).map(([k, v]) => `${k} ${dp(v)}`).join(" · ");
}

/** Spacing/radius token whose value equals `n`, for a hint next to raw numbers. */
export function lengthToken(scope: "spacing" | "radius", n: number) {
  for (const t of tokens.values()) if (t.scope === scope && t.value === n) return t;
  return undefined;
}

export const tokenOf = (key: string | null) => (key ? tokens.get(key) : undefined);

export function colorHex(p: Paint) {
  const t = tokenOf(p.token);
  if (t?.hex) return t.hex;
  const m = p.value?.match(/rgb\(([\d.]+) ([\d.]+) ([\d.]+) \/ ([\d.]+)\)/);
  if (!m) return p.value ?? "";
  const hex = m.slice(1, 4).map((v) => Math.round(+v).toString(16).padStart(2, "0")).join("");
  const a = Math.round(+m[4] * 255);
  return `#${hex}${a < 255 ? a.toString(16).padStart(2, "0") : ""}`.toUpperCase();
}
