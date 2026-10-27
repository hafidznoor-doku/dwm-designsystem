// Converts every exported Elyx component into a "scene": the resolved layer
// tree from `elyx tree` joined with the CSS from `elyx css`. Storybook renders
// scenes as live HTML, and the spec docs read their measurements and tokens.
// Also generates stories for blocks/ and screens/ (controls are hand-written).
//
//   node scripts/export-scenes.mjs          rebuild files whose .elyx changed
//   node scripts/export-scenes.mjs --force  rebuild everything

import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { elyxJson, parseExports, parseTitle, pool, pretty, projectRoot, requireElyx, sbRoot, sectionFiles } from "./lib/elyx.mjs";

const scenesDir = join(sbRoot, "src", "generated", "scenes");
const storiesDir = join(sbRoot, "stories", "generated");
const force = process.argv.includes("--force");

const rel = (p) => (p ? relative(projectRoot, p).split("\\").join("/") : p);
const tokenKey = (t) => (t ? t.split("#").pop() : null);
const r2 = (n) => (typeof n === "number" ? Math.round(n * 100) / 100 : n);
const slug = (s) => s.replace(/\.elyx$/, "").replace(/[^A-Za-z0-9]+/g, "_");

// ---- spec ----------------------------------------------------------------

function paint(p) {
  if (!p || p.visible === false) return null;
  const color = typeof p.color === "object" && p.color ? p.color : { value: p.color ?? null };
  const out = { type: p.type, token: tokenKey(color.token), value: color.value ?? null, opacity: r2(p.opacity) };
  if (p.type === "image") out.image = rel(p.image);
  if (p.type === "gradient") out.gradient = { kind: p.gradient, from: p.from, to: p.to, stops: p.stops };
  if (p.width !== undefined) Object.assign(out, { width: r2(p.width), position: p.position, dash: p.dash });
  return out;
}

const sizeMode = (v) => (typeof v === "number" ? "fixed" : typeof v === "string" ? "fill" : "hug");

function spec(n) {
  const s = {
    w: r2(n.resolvedSize.width),
    h: r2(n.resolvedSize.height),
    wMode: sizeMode(n.size.width),
    hMode: sizeMode(n.size.height),
    x: r2(n.position.x),
    y: r2(n.position.y),
  };
  if (n.layout.type === "stack") {
    const l = n.layout;
    s.layout = { dir: l.direction, gap: r2(l.gap), align: l.alignItems, justify: l.justifyContent, wrap: l.wrap,
      pad: [l.padding.top, l.padding.right, l.padding.bottom, l.padding.left].map(r2) };
  }
  const st = n.style;
  if (st.cornerRadius != null) s.radius = typeof st.cornerRadius === "number" ? r2(st.cornerRadius) : st.cornerRadius;
  const fills = st.fills.map(paint).filter(Boolean);
  if (fills.length) s.fills = fills;
  const borders = st.borders.map(paint).filter(Boolean);
  if (borders.length) s.borders = borders;
  if (st.shadows.length) s.shadows = st.shadows;
  if (st.opacity !== 1) s.opacity = r2(st.opacity);
  if (n.ignoreStack) s.absolute = true;
  return s;
}

// ---- css fallback for layers `elyx css` doesn't cover ----------------------

function gradientCss(g) {
  const dx = g.to.x - g.from.x, dy = g.to.y - g.from.y;
  const angle = Math.round((Math.atan2(dx, -dy) * 180) / Math.PI);
  return `linear-gradient(${angle}deg, ${g.stops.map((s) => `${s.color} ${Math.round(s.position * 100)}%`).join(", ")})`;
}

function fallbackCss(n, parentStacked) {
  const d = [];
  const s = n.spec;
  if (!parentStacked || s.absolute) d.push(["position", "absolute"], ["left", `${s.x}px`], ["top", `${s.y}px`]);
  else d.push(["flex-shrink", "0"]);
  if (n.t !== "text") d.push(["width", `${s.w}px`], ["height", `${s.h}px`]);
  for (const f of s.fills ?? []) {
    if (n.t === "text") continue;
    if (f.type === "solid") d.push(["background", f.value]);
    if (f.type === "image") d.push(["background", `url("${f.image}") center / 100% 100% no-repeat`]);
    if (f.type === "gradient" && f.gradient.kind === "linear") d.push(["background", gradientCss(f.gradient)]);
  }
  for (const b of s.borders ?? []) d.push(["box-shadow", `inset 0 0 0 ${b.width}px ${b.value}`]);
  if (n.t === "ellipse") d.push(["border-radius", "50%"]);
  else if (typeof s.radius === "number") d.push(["border-radius", `${s.radius}px`]);
  if (s.layout) d.push(["display", "flex"], ["flex-direction", s.layout.dir], ["gap", `${s.layout.gap}px`],
    ["padding", s.layout.pad.map((p) => `${p}px`).join(" ")]);
  if (n.text) {
    const f = n.text.font;
    d.push(["font-family", `"${f.family}"`], ["font-size", `${f.size}px`], ["font-weight", String(f.weight)],
      ["line-height", f.lineHeight ? String(f.lineHeight) : "normal"], ["white-space", "pre"]);
    const c = s.fills?.[0];
    if (c?.value) d.push(["color", c.value]);
  }
  if (s.opacity != null) d.push(["opacity", String(s.opacity)]);
  return d;
}

const PLACEMENT = new Set(["position", "left", "top", "right", "bottom", "flex", "flex-grow", "flex-shrink", "flex-basis",
  "align-self", "width", "min-width", "max-width", "margin"]);

const WEIGHTS = { thin: 100, light: 300, regular: 400, medium: 500, "semi bold": 600, semibold: 600, bold: 700, heavy: 800, black: 900 };
const weight = (style) => WEIGHTS[style.toLowerCase().replace(/ ?italic/, "").trim()] ?? 400;

// ---- convert ---------------------------------------------------------------

const targetKey = (t) => `${t.sourceRef}|${t.overridePath}`;

// `elyx tree` reports a rotated layer's rotation but not its translation, so
// place it by the center of the bounding box Elyx actually renders.
async function rotations(file, tree) {
  const rotated = [];
  const walk = (x) => {
    if (x.transform && Math.abs(x.transform.rotation) > 0.01 && x.target) rotated.push(x);
    x.children.forEach(walk);
  };
  walk(tree);
  const out = new Map();
  const bounds = async (ref, overridePath) => {
    const args = ["find", file, "--ref", ref];
    if (overridePath) args.push("--override-path", overridePath);
    return (await elyxJson(args)).results[0];
  };
  for (const x of rotated) {
    const self = await bounds(x.target.sourceRef, x.target.overridePath);
    if (!self?.parentRef) continue;
    const parent = await bounds(self.parentRef, x.target.overridePath);
    if (!parent) continue;
    const a = self.absoluteBounds, p = parent.absoluteBounds;
    const cx = a.x - p.x + a.width / 2, cy = a.y - p.y + a.height / 2;
    const { rotation, scaleX, scaleY } = x.transform;
    out.set(targetKey(x.target), [
      ["position", "absolute"],
      ["left", `${r2(cx - x.resolvedSize.width / 2)}px`],
      ["top", `${r2(cy - x.resolvedSize.height / 2)}px`],
      ["transform", `rotate(${r2(rotation)}deg) scale(${r2(scaleX)}, ${r2(scaleY)})`],
      ["transform-origin", "center"],
    ]);
  }
  return out;
}

// Elyx strokes don't take layout space, while a CSS border would grow hugging
// layers. Draw them as box-shadows at the stroke position instead.
function strokesAsShadows(decls, borders = []) {
  const position = borders[0]?.position ?? "inside";
  const shadows = [];
  const rest = decls.filter(([p, v]) => {
    const m = p === "border" && v.match(/^([\d.]+)px solid (.+)$/);
    if (!m) return true;
    const [w, color] = [+m[1], m[2]];
    if (position === "outside") shadows.push(`0 0 0 ${w}px ${color}`);
    else if (position === "center") shadows.push(`inset 0 0 0 ${w / 2}px ${color}`, `0 0 0 ${w / 2}px ${color}`);
    else shadows.push(`inset 0 0 0 ${w}px ${color}`);
    return false;
  });
  if (!shadows.length) return decls;
  const existing = rest.findIndex(([p]) => p === "box-shadow");
  if (existing >= 0) rest[existing] = ["box-shadow", `${shadows.join(", ")}, ${rest[existing][1]}`];
  else rest.push(["box-shadow", shadows.join(", ")]);
  return rest;
}

function convert(tree, rules, scope, rotated = new Map()) {
  const byTarget = new Map(rules.map((r) => [targetKey(r.target), r]));
  const css = [];
  let fallbackId = 0;

  const walk = (x, parentStacked) => {
    const node = { n: x.name, t: x.type, hidden: x.hidden || undefined, spec: spec(x) };
    if (x.text) {
      const f = x.text.font;
      node.text = {
        content: x.text.content,
        align: x.text.align,
        font: { family: f.family, style: f.style, weight: weight(f.style), size: r2(f.size),
          lineHeight: f.lineHeight ? r2(f.lineHeight) : null, lineHeightPx: f.lineHeight ? r2(f.lineHeight * f.size) : null,
          letterSpacing: f.letterSpacing },
        underline: x.text.underline || undefined,
        strikethrough: x.text.strikethrough || undefined,
      };
    }
    if (x.asset) node.asset = { src: rel(x.asset.contents), tinted: x.style.fills.some((f) => f.visible !== false && f.type === "solid") };
    if (x.instanceOf) node.inst = { file: rel(x.instanceOf.file), symbol: x.instanceOf.symbol, variant: x.instanceOf.variant };

    const rule = x.target && byTarget.get(targetKey(x.target));
    let decls = strokesAsShadows(rule ? rule.declarations.map((d) => [d.property, d.value]) : fallbackCss(node, parentStacked), node.spec.borders);
    const rot = x.target && rotated.get(targetKey(x.target));
    if (rot) {
      const replaced = new Set(rot.map(([p]) => p));
      decls = [...decls.filter(([p]) => !replaced.has(p)), ...rot];
    }
    if (node.asset) {
      const url = `url("${node.asset.src}")`;
      if (node.asset.tinted) decls.push(["mask", `${url} center / contain no-repeat`], ["-webkit-mask", `${url} center / contain no-repeat`]);
      else decls.push(["background", `${url} center / contain no-repeat`]);
    }
    node.cls = `${scope}__${rule ? rule.className : `x${fallbackId++}`}`;
    css.push(`.${node.cls} {\n${decls.map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`);
    // Where a coded control replaces this instance, keep only its placement.
    if (node.inst) {
      const place = decls.filter(([p]) => PLACEMENT.has(p));
      css.push(`.${node.cls}--place {\n  display: flex;\n  flex-direction: column;\n${place.map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`);
    }

    const stacked = x.layout.type === "stack";
    if (!stacked && x.children.length && !decls.some(([p]) => p === "position")) {
      css.push(`.${node.cls} { position: relative; }`);
    }
    node.c = x.children.map((c) => walk(c, stacked));
    if (!node.c.length) delete node.c;
    return node;
  };

  const root = walk(tree, false);
  // The root sits in the story canvas, not at its board position.
  css.push(`.${root.cls} { position: relative; left: auto; top: auto; }`, `.${root.cls}, .${root.cls} * { box-sizing: border-box; }`);
  return { root, css: css.join("\n") };
}

// ---- run -----------------------------------------------------------------

requireElyx();
const files = sectionFiles().map((f) => ({ ...f, exports: parseExports(f.file) })).filter((f) => f.exports.length);
const todo = files.filter((f) => {
  const out = join(scenesDir, `${f.file.replace(/\.elyx$/, "")}.json`);
  return force || !existsSync(out) || statSync(out).mtimeMs < statSync(join(projectRoot, f.file)).mtimeMs;
});

const failed = [];
const jobs = todo.flatMap((f) => f.exports.map((e) => ({ f, e })));
if (jobs.length) console.log(`Exporting ${jobs.length} scenes from ${todo.length} files…`);
const results = new Map();
let done = 0;
await pool(jobs, async ({ f, e }) => {
  try {
    const [tree, css] = await Promise.all([
      elyxJson(["tree", f.file, "--ref", e.ref, "--depth", "full"]),
      elyxJson(["css", f.file, "--ref", e.ref, "--format", "json"]),
    ]);
    const rotated = await rotations(f.file, tree.tree);
    const { root, css: sheet } = convert(tree.tree, css.rules, `${slug(f.file)}_${e.ref}`, rotated);
    results.set(`${f.file}#${e.ref}`, { ref: e.ref, title: e.title, ...parseTitle(e.title), root, css: sheet });
  } catch (err) {
    failed.push(`${f.file}#${e.ref}: ${(err.stderr || err.message).trim().split("\n")[0]}`);
  }
  if (++done % 50 === 0 || done === jobs.length) console.log(`  ${done}/${jobs.length}`);
});

for (const f of todo) {
  const out = join(scenesDir, `${f.file.replace(/\.elyx$/, "")}.json`);
  mkdirSync(dirname(out), { recursive: true });
  const exports = f.exports.map((e) => results.get(`${f.file}#${e.ref}`)).filter(Boolean);
  writeFileSync(out, JSON.stringify({ file: f.file, section: f.section, exports }));
}
if (failed.length) console.warn(`${failed.length} scenes failed:\n  ${failed.join("\n  ")}`);

// ---- stories for blocks, screens and foundations -----------------------------

rmSync(storiesDir, { recursive: true, force: true });
let count = 0;
for (const f of files) {
  if (f.section === "Controls") continue;
  const scene = join(scenesDir, `${f.file.replace(/\.elyx$/, "")}.json`);
  if (!existsSync(scene)) continue;
  const { exports } = JSON.parse(readFileSync(scene, "utf8"));
  const parts = f.file.replace(/\.elyx$/, "").split("/");
  const title = f.section === "Foundations" ? "Foundations/Elyx boards" : [f.section, ...parts.slice(1).map(pretty)].join("/");
  const out = join(storiesDir, `${f.file.replace(/\.elyx$/, "")}.stories.tsx`);
  const toSrc = (p) => relative(dirname(out), join(sbRoot, p)).split("\\").join("/");
  const used = new Set();
  const ident = (s) => {
    let id = s.replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^[^A-Za-z]+/, "");
    id = (id[0] ?? "S").toUpperCase() + id.slice(1);
    let n = id, i = 2;
    while (used.has(n)) n = `${id}${i++}`;
    used.add(n);
    return n;
  };
  const stories = exports.map((e) => {
    const id = ident(e.ref);
    return `export const ${id}: Story = { name: ${JSON.stringify(pretty(e.props ? `${e.set} ${Object.values(e.props).join(" ")}` : e.title))}, args: { exportRef: ${JSON.stringify(e.ref)} } };`;
  });
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `// Generated by scripts/export-scenes.mjs from ${f.file}. Do not edit.
import type { Meta, StoryObj } from "@storybook/react-vite";
import scene from "${toSrc(`src/generated/scenes/${f.file.replace(/\.elyx$/, "")}.json`)}";
import { SceneStory, sceneSpec } from "${toSrc("src/elyx/SceneStory")}";
import type { SceneFile } from "${toSrc("src/elyx/types")}";

const meta = {
  title: ${JSON.stringify(title)},
  component: SceneStory,
  args: { scene: scene as unknown as SceneFile, exportRef: "", codedControls: true },
  argTypes: { scene: { table: { disable: true } }, exportRef: { table: { disable: true } } },
  parameters: { elyxSpec: sceneSpec },
} satisfies Meta<typeof SceneStory>;
export default meta;
type Story = StoryObj<typeof meta>;

${stories.join("\n")}
`);
  count += exports.length;
}
console.log(`Scenes up to date. Generated ${count} block/screen stories.`);
