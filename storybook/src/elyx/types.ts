// Shapes written by scripts/export-scenes.mjs.

export interface Paint {
  type: "solid" | "image" | "gradient";
  /** Token key such as `colors.red-50`, or null when the value is off-palette. */
  token: string | null;
  value: string | null;
  opacity: number;
  image?: string;
  gradient?: { kind: string; stops: { color: string; position: number }[] };
  width?: number;
  position?: string;
  dash?: unknown;
}

export interface NodeSpec {
  w: number;
  h: number;
  wMode: "fixed" | "hug" | "fill";
  hMode: "fixed" | "hug" | "fill";
  x: number;
  y: number;
  layout?: { dir: "row" | "column"; gap: number; align: string; justify: string; wrap: boolean; pad: [number, number, number, number] };
  radius?: number | Record<string, number>;
  fills?: Paint[];
  borders?: Paint[];
  shadows?: unknown[];
  opacity?: number;
  absolute?: boolean;
}

export interface TextSpec {
  content: string;
  align: string;
  font: { family: string; style: string; weight: number; size: number; lineHeight: number | null; lineHeightPx: number | null; letterSpacing: string };
  underline?: boolean;
  strikethrough?: boolean;
}

export interface SceneNode {
  /** Layer name. */
  n: string;
  t: "frame" | "text" | "asset" | "rect" | "ellipse" | "boolean";
  hidden?: boolean;
  cls: string;
  spec: NodeSpec;
  text?: TextSpec;
  asset?: { src: string; tinted: boolean };
  inst?: { file: string; symbol: string; variant: string | null };
  c?: SceneNode[];
}

export interface SceneExport {
  ref: string;
  title: string;
  set: string;
  props: Record<string, string> | null;
  root: SceneNode;
  css: string;
}

export interface SceneFile {
  file: string;
  section: string;
  exports: SceneExport[];
}

export interface Token {
  key: string;
  scope: string;
  name: string;
  type: "color" | "number" | "string";
  alias: string | null;
  value: string | number;
  hex: string | null;
  unit: string | null;
  cssVar: string;
  android: string;
  ios: string;
}
