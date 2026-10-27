// Jetpack Compose and SwiftUI skeletons from a scene. They show structure,
// sizes and token names to implement from; they are not drop-in code.
import { colorHex, dp, tokenOf } from "./spec";
import type { Paint, SceneNode } from "./types";

const MAX_LINES = 120;
const pascal = (s: string) => s.replace(/(^|[-_ ])(\w)/g, (_, __, c) => c.toUpperCase());
const drawable = (src: string) => src.split("/").pop()!.replace(/\.\w+$/, "").replace(/-/g, "_");
const str = (s: string) => JSON.stringify(s);
const firstSolid = (fills?: Paint[]) => fills?.find((f) => f.type === "solid");

function capped(lines: string[]) {
  return lines.length > MAX_LINES ? [...lines.slice(0, MAX_LINES), "// … truncated; see the layer tree above for the rest"] : lines;
}

// ---- Compose ----

const kColor = (p: Paint) => {
  const t = tokenOf(p.token);
  if (t) return `colorResource(${t.android})`;
  const hex = colorHex(p).slice(1);
  const argb = hex.length === 8 ? hex.slice(6) + hex.slice(0, 6) : `FF${hex}`;
  return `Color(0x${argb})`;
};

const kShape = (n: SceneNode) =>
  n.t === "ellipse" ? "CircleShape" : typeof n.spec.radius === "number" && n.spec.radius ? `RoundedCornerShape(${dp(n.spec.radius)}.dp)` : null;

function kModifier(n: SceneNode, parentFree: boolean, ind = "") {
  const s = n.spec;
  const m: string[] = [];
  if (parentFree && (s.x || s.y)) m.push(`offset(${dp(s.x)}.dp, ${dp(s.y)}.dp)`);
  if (s.wMode === "fill") m.push("fillMaxWidth()");
  else if (s.wMode === "fixed" || n.asset || !n.c) m.push(`width(${dp(s.w)}.dp)`);
  if (s.hMode === "fill") m.push("fillMaxHeight()");
  else if (s.hMode === "fixed" || n.asset) m.push(`height(${dp(s.h)}.dp)`);
  const shape = kShape(n);
  const bg = !n.text && !n.asset ? firstSolid(s.fills) : undefined;
  if (bg) m.push(`background(${kColor(bg)}${shape ? `, ${shape}` : ""})`);
  else if (shape && !n.text) m.push(`clip(${shape})`);
  for (const b of s.borders ?? []) m.push(`border(${dp(b.width ?? 1)}.dp, ${kColor(b)}${shape ? `, ${shape}` : ""})`);
  const p = s.layout?.pad;
  if (p && p.some(Boolean)) {
    const [t, r, b, l] = p;
    m.push(t === b && l === r ? `padding(horizontal = ${dp(l)}.dp, vertical = ${dp(t)}.dp)` : `padding(start = ${dp(l)}.dp, top = ${dp(t)}.dp, end = ${dp(r)}.dp, bottom = ${dp(b)}.dp)`);
  }
  if (s.opacity != null) m.push(`alpha(${s.opacity}f)`);
  if (!m.length) return "Modifier";
  return m.length > 1 ? `Modifier\n${m.map((x) => `${ind}        .${x}`).join("\n")}` : `Modifier.${m[0]}`;
}

const kAlign = (v: string, axis: "h" | "v") =>
  ({ start: axis === "h" ? "Start" : "Top", center: axis === "h" ? "CenterHorizontally" : "CenterVertically", end: axis === "h" ? "End" : "Bottom" } as Record<string, string>)[v];

export function compose(root: SceneNode): string {
  const lines: string[] = [];
  const emit = (n: SceneNode, ind: string, parentFree: boolean) => {
    if (n.hidden) return;
    const mod = kModifier(n, parentFree, ind);
    if (n.inst) {
      lines.push(`${ind}${pascal(n.inst.symbol)}(modifier = ${mod}) // instance of ${n.inst.file}`);
      return;
    }
    if (n.text) {
      const f = n.text.font;
      const color = firstSolid(n.spec.fills);
      lines.push(`${ind}Text(`, `${ind}    text = ${str(n.text.content)},`);
      lines.push(`${ind}    fontFamily = DokuFont.${f.family.startsWith("DIN") ? "brand" : "ui"}, // ${f.family} ${f.style}`);
      lines.push(`${ind}    fontSize = ${dp(f.size)}.sp, fontWeight = FontWeight(${f.weight})${f.lineHeightPx ? `, lineHeight = ${dp(f.lineHeightPx)}.sp` : ""},`);
      if (color) lines.push(`${ind}    color = ${kColor(color)},`);
      if (n.text.align !== "left") lines.push(`${ind}    textAlign = TextAlign.${pascal(n.text.align)},`);
      lines.push(`${ind})`);
      return;
    }
    if (n.asset) {
      const tint = n.asset.tinted ? firstSolid(n.spec.fills) : undefined;
      lines.push(tint
        ? `${ind}Icon(painterResource(R.drawable.${drawable(n.asset.src)}), contentDescription = null, tint = ${kColor(tint)}, modifier = ${mod})`
        : `${ind}Image(painterResource(R.drawable.${drawable(n.asset.src)}), contentDescription = null, modifier = ${mod})`);
      return;
    }
    const kids = (n.c ?? []).filter((c) => !c.hidden);
    const l = n.spec.layout;
    let open: string;
    if (l?.dir === "row") open = `Row(modifier = ${mod}, horizontalArrangement = Arrangement.spacedBy(${dp(l.gap)}.dp), verticalAlignment = Alignment.${kAlign(l.align, "v") ?? "CenterVertically"})`;
    else if (l?.dir === "column") open = `Column(modifier = ${mod}, verticalArrangement = Arrangement.spacedBy(${dp(l.gap)}.dp), horizontalAlignment = Alignment.${kAlign(l.align, "h") ?? "Start"})`;
    else open = `Box(modifier = ${mod})`;
    if (!kids.length) { lines.push(`${ind}${open}`); return; }
    lines.push(`${ind}${open} { // ${n.n}`);
    kids.forEach((c) => emit(c, `${ind}    `, !l));
    lines.push(`${ind}}`);
  };
  emit(root, "", false);
  return capped(lines).join("\n");
}

// ---- SwiftUI ----

const sColor = (p: Paint) => {
  const t = tokenOf(p.token);
  if (t) return t.ios;
  const hex = colorHex(p);
  return `Color(hex: "${hex}")`;
};

function sModifiers(n: SceneNode, parentFree: boolean, ind: string) {
  const s = n.spec;
  const m: string[] = [];
  const p = s.layout?.pad;
  if (p && p.some(Boolean)) {
    const [t, r, b, l] = p;
    m.push(t === b && l === r ? `.padding(.horizontal, ${dp(l)}).padding(.vertical, ${dp(t)})` : `.padding(EdgeInsets(top: ${dp(t)}, leading: ${dp(l)}, bottom: ${dp(b)}, trailing: ${dp(r)}))`);
  }
  const w = s.wMode === "fill" ? "maxWidth: .infinity" : s.wMode === "fixed" || n.asset ? `width: ${dp(s.w)}` : null;
  const h = s.hMode === "fill" ? "maxHeight: .infinity" : s.hMode === "fixed" || n.asset ? `height: ${dp(s.h)}` : null;
  if (w || h) m.push(`.frame(${[w, h].filter(Boolean).join(", ")})`);
  const r = typeof s.radius === "number" ? s.radius : 0;
  const bg = !n.text && !n.asset ? firstSolid(s.fills) : undefined;
  if (bg) m.push(`.background(${sColor(bg)})`);
  if (n.t === "ellipse") m.push(".clipShape(Circle())");
  else if (r && !n.text) m.push(`.clipShape(RoundedRectangle(cornerRadius: ${dp(r)}))`);
  for (const b of s.borders ?? []) m.push(`.overlay(RoundedRectangle(cornerRadius: ${dp(r)}).strokeBorder(${sColor(b)}, lineWidth: ${dp(b.width ?? 1)}))`);
  if (parentFree && (s.x || s.y)) m.push(`.offset(x: ${dp(s.x)}, y: ${dp(s.y)})`);
  if (s.opacity != null) m.push(`.opacity(${s.opacity})`);
  return m.map((x) => `${ind}${x}`);
}

const sAlign = (v: string, dir: "row" | "column") =>
  dir === "row" ? ({ start: ".top", center: ".center", end: ".bottom" } as Record<string, string>)[v] ?? ".center"
    : ({ start: ".leading", center: ".center", end: ".trailing" } as Record<string, string>)[v] ?? ".leading";

export function swiftui(root: SceneNode): string {
  const lines: string[] = [];
  const emit = (n: SceneNode, ind: string, parentFree: boolean) => {
    if (n.hidden) return;
    const mods = () => sModifiers(n, parentFree, `${ind}    `);
    if (n.inst) {
      lines.push(`${ind}${pascal(n.inst.symbol)}() // instance of ${n.inst.file}`, ...mods());
      return;
    }
    if (n.text) {
      const f = n.text.font;
      const color = firstSolid(n.spec.fills);
      lines.push(`${ind}Text(${str(n.text.content)})`);
      lines.push(`${ind}    .font(.custom(DokuFont.${f.family.startsWith("DIN") ? "brand" : "ui"}${pascal(f.style.replace(/\s/g, ""))}, size: ${dp(f.size)})) // ${f.family} ${f.style}`);
      if (f.lineHeightPx) lines.push(`${ind}    .lineSpacing(${dp(Math.max(0, f.lineHeightPx - f.size))}) // line height ${dp(f.lineHeightPx)}`);
      if (color) lines.push(`${ind}    .foregroundStyle(${sColor(color)})`);
      if (n.text.align !== "left") lines.push(`${ind}    .multilineTextAlignment(.${n.text.align === "right" ? "trailing" : n.text.align})`);
      lines.push(...mods());
      return;
    }
    if (n.asset) {
      const tint = n.asset.tinted ? firstSolid(n.spec.fills) : undefined;
      lines.push(`${ind}Image(${str(drawable(n.asset.src))})`);
      lines.push(`${ind}    ${tint ? ".renderingMode(.template).resizable()" : ".resizable().scaledToFit()"}`);
      if (tint) lines.push(`${ind}    .foregroundStyle(${sColor(tint)})`);
      lines.push(...mods());
      return;
    }
    const kids = (n.c ?? []).filter((c) => !c.hidden);
    const l = n.spec.layout;
    const open = l?.dir === "row" ? `HStack(alignment: ${sAlign(l.align, "row")}, spacing: ${dp(l.gap)})`
      : l?.dir === "column" ? `VStack(alignment: ${sAlign(l.align, "column")}, spacing: ${dp(l.gap)})`
      : `ZStack(alignment: .topLeading)`;
    if (!kids.length) {
      lines.push(`${ind}Rectangle().fill(.clear) // ${n.n}`, ...mods());
      return;
    }
    lines.push(`${ind}${open} { // ${n.n}`);
    kids.forEach((c) => emit(c, `${ind}    `, !l));
    lines.push(`${ind}}`, ...mods());
  };
  emit(root, "", false);
  return capped(lines).join("\n");
}
