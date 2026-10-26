// Figma (.fig) -> Elyx converter for the DOKU Mobile Currency design system.
import fs from 'fs'; import path from 'path'; import crypto from 'crypto';
import {loadFig, index, gid, blobToPath} from './fig.mjs';

const FIG = process.argv[2];
const IMGDIR = process.argv[3];          // extracted images/ folder from the .fig zip
const OUT = process.argv[4];             // Elyx project root
const msg = loadFig(FIG);
const {N, byId, ch, blobs} = index(msg);

// ---------- colors / tokens ----------
const toHex = (c) => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const PALETTE = JSON.parse(fs.readFileSync(new URL('./palette.json', import.meta.url)));
const tokenByHex = new Map();
for (const [name, hex] of Object.entries(PALETTE)) if (!tokenByHex.has(hex)) tokenByHex.set(hex, name);
const pct = (x) => `${+(x * 100).toFixed(1)}%`;
const num = (x) => +(+x).toFixed(2);
const px = (x) => `${num(x)}px`;

function colorExpr(c, opacity = 1) {
  const a = (c.a ?? 1) * opacity;
  const hex = toHex(c);
  const tok = tokenByHex.get(hex);
  if (tok) return a >= 0.999 ? `colorTokens.colors.${tok}` : `opacity(colorTokens.colors.${tok}, ${pct(a)})`;
  if (a >= 0.999) return hex;
  return hex + Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase();
}

// ---------- override resolution ----------
const keyOf = (n) => gid(n.overrideKey) || gid(n.guid);
const OMIT = new Set(['__derived', 'guidPath', 'guid', 'parentIndex', 'type', 'phase', 'overrideKey']);
const propAliases = new Map(); // defId -> set of equivalent defIds
for (const n of N) for (const d of n.componentPropDefs || []) if (d.parentPropDefId) {
  const a = gid(d.id), b = gid(d.parentPropDefId);
  if (!propAliases.has(a)) propAliases.set(a, new Set([a])); if (!propAliases.has(b)) propAliases.set(b, new Set([b]));
  propAliases.get(a).add(b); propAliases.get(b).add(a);
}
const symbolOf = (id) => byId.get(gid(id));

function addOv(map, entries) {
  for (const e of entries || []) {
    const k = e.guidPath.guids.map(gid).join('/');
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(e);
  }
}

const styleByGuid = new Map(), styleByKey = new Map();
for (const n of N) if (n.styleType) { styleByGuid.set(gid(n.guid), n); if (n.key) styleByKey.set(n.key, n); }
function styleRef(ref) {
  if (!ref) return null;
  if (ref.guid && ref.guid.sessionID !== 4294967295) return styleByGuid.get(gid(ref.guid));
  if (ref.assetRef?.key) return styleByKey.get(ref.assetRef.key);
  return null;
}
function applyStyles(p, e) {
  let st;
  if (e.styleIdForFill && (st = styleRef(e.styleIdForFill))) p.fillPaints = st.fillPaints;
  if (e.styleIdForStrokeFill && (st = styleRef(e.styleIdForStrokeFill))) p.strokePaints = st.fillPaints;
  if (e.styleIdForEffect && (st = styleRef(e.styleIdForEffect))) p.effects = st.effects;
  if (false && e.styleIdForText && (st = styleRef(e.styleIdForText))) for (const f of ['fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'textCase', 'textDecoration']) if (st[f] !== undefined) p[f] = st[f];
}

// Resolve a node into a plain tree with overrides applied.
// ov: Map(relPath -> [override,...]) relative to the enclosing instance; props: Map(defId -> value)
function resolveNode(node, ov, props, prefix = '') {
  const k = prefix + keyOf(node);
  let p = {...node};
  if (node.type !== "INSTANCE") applyStyles(p, node);
  for (const e of ov.get(k) || []) { for (const [f, v] of Object.entries(e)) if (!OMIT.has(f)) p[f] = v; applyStyles(p, e); }
  for (const ref of node.componentPropRefs || []) {
    const val = lookupProp(props, gid(ref.defID));
    if (!val) continue;
    if (ref.componentPropNodeField === 'VISIBLE' && val.boolValue !== undefined) p.visible = val.boolValue;
    if (ref.componentPropNodeField === 'TEXT_DATA' && val.textValue) p.textData = {...p.textData, characters: val.textValue.characters};
    if (ref.componentPropNodeField === 'OVERRIDDEN_SYMBOL_ID' && val.guidValue) p.overriddenSymbolID = val.guidValue;
  }
  let slotContent = null;
  for (const ref of node.componentPropRefs || []) if (ref.componentPropNodeField === 'SLOT_CONTENT_ID') {
    const val = lookupProp(props, gid(ref.defID));
    if (val?.slot && val.slot.sessionID !== 4294967295) slotContent = byId.get(gid(val.slot));
  }
  const isSlot = (node.componentPropRefs || []).some(ref => ref.componentPropNodeField === 'SLOT_CONTENT_ID');
  const r = {type: node.type, p, children: []};
  if (node.type === 'INSTANCE') {
    const sym = symbolOf(p.overriddenSymbolID || node.symbolData?.symbolID);
    if (!sym) return r;
    r.symbol = sym;
    // overrides for inner nodes: instance own (lowest), then outer passed down (higher)
    const inner = new Map();
    addOv(inner, p.symbolData?.symbolOverrides || node.symbolData?.symbolOverrides);
    addOv(inner, (node.derivedSymbolData || []).map(e => ({...e, __derived: true})));
    for (const [path, list] of ov) if (path.startsWith(k + '/')) {
      const rel = path.slice(k.length + 1);
      if (!inner.has(rel)) inner.set(rel, []);
      inner.get(rel).push(...list);
    }
    const innerProps = new Map();
    for (const a of p.componentPropAssignments || []) innerProps.set(gid(a.defID), {...a.value, slot: a.varValue?.value?.slotContentIdValue?.guid});
    // root props, lowest to highest precedence: symbol root, instance node copy, the instance's own
    // root overrides, then overrides from enclosing instances
    const root = {...sym};
    const swapped = p.overriddenSymbolID && gid(p.overriddenSymbolID) !== gid(node.symbolData?.symbolID);
    // a swapped instance keeps only its placement; the node's copied root props belong to the old symbol
    const PLACE = new Set(['transform', 'size', 'visible', 'opacity', 'stackPositioning', 'stackChildAlignSelf', 'stackChildPrimaryGrow', 'horizontalConstraint', 'verticalConstraint', 'componentPropAssignments', 'name']);
    for (const [f, v] of Object.entries(node)) if (v !== undefined && !['symbolData', 'derivedSymbolData', 'guid', 'parentIndex', 'type'].includes(f) && (!swapped || PLACE.has(f))) root[f] = v;
    for (const e of inner.get(keyOf(sym)) || []) { for (const [f, v] of Object.entries(e)) if (!OMIT.has(f)) root[f] = v; applyStyles(root, e); }
    for (const e of ov.get(k) || []) { for (const [f, v] of Object.entries(e)) if (!OMIT.has(f)) root[f] = v; applyStyles(root, e); }
    for (const f of ['visible', 'textData', 'overriddenSymbolID']) if (p[f] !== undefined) root[f] = p[f];
    root.name = node.name;
    r.p = root;
    // stale size overrides (e.g. after an instance swap): infer the size from derived child geometry
    const hasDerived = (ov.get(k) || []).some(e => e.__derived && e.size);
    if (!hasDerived && !sym.stackMode && root.size && sym.size) {
      const c0 = ch(sym).find(c => c.size && c.size.x > 0);
      const d = c0 && (inner.get(keyOf(c0)) || []).filter(e => e.__derived && e.size).pop();
      if (d) {
        const sc = d.size.x / c0.size.x;
        const exp = {x: sym.size.x * sc, y: sym.size.y * sc};
        if (Math.abs(exp.x - root.size.x) > 1 || Math.abs(exp.y - root.size.y) > 1) root.size = exp;
      }
    }
    r.children = ch(sym).map(c => resolveNode(c, inner, innerProps));
  } else {
    r.children = ch(node).map(c => resolveNode(c, ov, props, prefix));
    if (slotContent) r.children = ch(slotContent).map(c => resolveNode(c, new Map(), new Map()));
  }
  r.slot = isSlot;
  return r;
}
function lookupProp(props, id) {
  if (props.has(id)) return props.get(id);
  for (const a of propAliases.get(id) || []) if (props.has(a)) return props.get(a);
  return null;
}

// ---------- graphics -> SVG ----------
const VECTORISH = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'LINE', 'REGULAR_POLYGON', 'BRUSH']);
const vis = (r) => r.p.visible !== false;
function hasImage(r) { return (r.p.fillPaints || []).some(f => f.type === 'IMAGE' && f.visible !== false); }
function isGraphic(r) {
  if (!vis(r)) return false;
  if (VECTORISH.has(r.type)) return true;
  if (r.type === 'ELLIPSE' && r.p.arcData && (Math.abs((r.p.arcData.endingAngle - r.p.arcData.startingAngle) - 2 * Math.PI) > 0.01 || r.p.arcData.innerRadius > 0)) return true;
  if (!['FRAME', 'INSTANCE', 'SYMBOL'].includes(r.type)) return false;
  let vec = false, ok = true;
  const walk = (x) => {
    if (!vis(x)) return;
    if (x.type === 'TEXT' || hasImage(x)) ok = false;
    if (VECTORISH.has(x.type)) vec = true;
    x.children.forEach(walk);
  };
  r.children.forEach(walk);
  return ok && vec;
}
const mat = (t) => t ? [t.m00, t.m01, t.m02, t.m10, t.m11, t.m12] : [1, 0, 0, 0, 1, 0];
const mul = (a, b) => [a[0] * b[0] + a[1] * b[3], a[0] * b[1] + a[1] * b[4], a[0] * b[2] + a[1] * b[5] + a[2], a[3] * b[0] + a[4] * b[3], a[3] * b[1] + a[4] * b[4], a[3] * b[2] + a[4] * b[5] + a[5]];
const inv = (m) => { const d = m[0] * m[4] - m[1] * m[3]; return [m[4] / d, -m[1] / d, (m[1] * m[5] - m[4] * m[2]) / d, -m[3] / d, m[0] / d, (m[3] * m[2] - m[0] * m[5]) / d]; };
const ap = (m, x, y) => [m[0] * x + m[1] * y + m[2], m[3] * x + m[4] * y + m[5]];
const svgMat = (m) => `matrix(${[m[0], m[3], m[1], m[4], m[2], m[5]].map(v => +v.toFixed(4)).join(' ')})`;

function buildSvg(r) {
  const W = r.p.size.x, H = r.p.size.y;
  const defs = []; let uid = 0; const colors = new Set(); let complex = false;
  const paintAttr = (paint, size) => {
    if (paint.type === 'SOLID') {
      const hex = toHex(paint.color); colors.add(hex);
      const a = (paint.color.a ?? 1) * (paint.opacity ?? 1);
      if (a < 0.999) complex = true;
      return `fill="${hex}"${a < 0.999 ? ` fill-opacity="${+a.toFixed(3)}"` : ''}`;
    }
    if (paint.type?.startsWith('GRADIENT')) {
      complex = true;
      const id = `g${uid++}`; const it = inv(mat(paint.transform));
      const stops = (paint.stops || []).map(s => `<stop offset="${+s.position.toFixed(4)}" stop-color="${toHex(s.color)}" stop-opacity="${+((s.color.a ?? 1) * (paint.opacity ?? 1)).toFixed(3)}"/>`).join('');
      if (paint.type === 'GRADIENT_LINEAR') {
        const [x1, y1] = ap(it, 0, 0.5), [x2, y2] = ap(it, 1, 0.5);
        defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${num(x1 * size.x)}" y1="${num(y1 * size.y)}" x2="${num(x2 * size.x)}" y2="${num(y2 * size.y)}">${stops}</linearGradient>`);
      } else {
        const [cx, cy] = ap(it, 0.5, 0.5), [ex, ey] = ap(it, 1, 0.5);
        const rad = Math.hypot((ex - cx) * size.x, (ey - cy) * size.y);
        defs.push(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${num(cx * size.x)}" cy="${num(cy * size.y)}" r="${num(rad)}">${stops}</radialGradient>`);
      }
      return `fill="url(#${id})"`;
    }
    return null;
  };
  const geo = (g) => { const b = blobs[g.commandsBlob]; return b ? blobToPath(b.bytes) : ''; };
  const draw = (x, m) => {
    if (!vis(x)) return '';
    const own = mul(m, mat(x.p.transform));
    let out = '';
    const tr = svgMat(own);
    for (const g of x.p.fillGeometry || []) for (const paint of (x.p.fillPaints || []).filter(f => f.visible !== false)) {
      const a = paintAttr(paint, x.p.size); if (!a) continue;
      out += `<path d="${geo(g)}" transform="${tr}" ${a} fill-rule="${g.windingRule === 'ODD' ? 'evenodd' : 'nonzero'}"/>`;
    }
    let strokes = '';
    for (const g of x.p.strokeGeometry || []) for (const paint of (x.p.strokePaints || []).filter(f => f.visible !== false)) {
      const a = paintAttr(paint, x.p.size); if (!a) continue;
      strokes += `<path d="${geo(g)}" transform="${tr}" ${a}/>`;
    }
    if (strokes && x.p.strokeAlign === 'INSIDE' && (x.p.fillGeometry || []).length) {
      // Figma stores inside strokes centered on the outline; clip them to the shape
      const id = `c${uid++}`;
      defs.push(`<clipPath id="${id}">${x.p.fillGeometry.map(g => `<path d="${geo(g)}" transform="${tr}"/>`).join('')}</clipPath>`);
      strokes = `<g clip-path="url(#${id})">${strokes}</g>`;
    }
    out += strokes;
    if (x.type !== 'BOOLEAN_OPERATION' && !VECTORISH.has(x.type)) {
      let inner = '', clip = null;
      for (const c of x.children) {
        if (c.p.mask && vis(c)) {
          const cm = mul(own, mat(c.p.transform)); const id = `c${uid++}`;
          defs.push(`<clipPath id="${id}">${(c.p.fillGeometry || []).map(g => `<path d="${geo(g)}" transform="${svgMat(cm)}"/>`).join('')}</clipPath>`);
          if (clip) inner += '</g>';
          inner += `<g clip-path="url(#${id})">`; clip = id; continue;
        }
        inner += draw(c, own);
      }
      if (clip) inner += '</g>';
      if (x !== r && ['FRAME', 'INSTANCE', 'SYMBOL'].includes(x.type) && x.p.frameMaskDisabled === false && x.p.size) {
        const id = `c${uid++}`;
        defs.push(`<clipPath id="${id}"><rect width="${num(x.p.size.x)}" height="${num(x.p.size.y)}" transform="${tr}"/></clipPath>`);
        inner = `<g clip-path="url(#${id})">${inner}</g>`;
      }
      out += inner;
    }
    const op = x.p.opacity ?? 1;
    if (op < 0.999 && out) { complex = true; out = `<g opacity="${+op.toFixed(3)}">${out}</g>`; }
    return out;
  };
  // the root is drawn in its own space; for a bare vector root keep its geometry
  let body;
  if (VECTORISH.has(r.type) || r.type === 'ELLIPSE') body = draw({...r, p: {...r.p, transform: null}}, [1, 0, 0, 0, 1, 0]);
  else { const root = {...r, p: {...r.p, transform: null, fillPaints: r.p.fillPaints, frameMaskDisabled: true}}; body = draw(root, [1, 0, 0, 0, 1, 0]); }
  let tint = null;
  if (!complex && colors.size === 1) { tint = [...colors][0]; body = body.split(`fill="${tint}"`).join('fill="#000000"'); }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${num(W)}" height="${num(H)}" viewBox="0 0 ${num(W)} ${num(H)}" fill="none">${defs.length ? `<defs>${defs.join('')}</defs>` : ''}${body}</svg>\n`;
  return {svg, tint, empty: !body};
}

// ---------- asset registry ----------
const kebab = (s) => s.normalize('NFKD').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'asset';
const svgByHash = new Map(); const usedSvgNames = new Map();
function registerSvg(svg, baseName) {
  const h = crypto.createHash('sha1').update(svg).digest('hex');
  if (svgByHash.has(h)) return svgByHash.get(h);
  let name = kebab(baseName); let n = name, i = 2;
  while (usedSvgNames.has(n)) n = `${name}-${i++}`;
  usedSvgNames.set(n, h);
  const rel = `resources/assets/icons/${n}.svg`;
  fs.mkdirSync(path.join(OUT, 'resources/assets/icons'), {recursive: true});
  fs.writeFileSync(path.join(OUT, rel), svg);
  svgByHash.set(h, rel); return rel;
}
const imgByHash = new Map();
function registerImage(hashBytes) {
  const h = Buffer.from(Object.values(hashBytes)).toString('hex');
  if (imgByHash.has(h)) return imgByHash.get(h);
  const src = path.join(IMGDIR, h);
  if (!fs.existsSync(src)) return null;
  const b = fs.readFileSync(src);
  const ext = b[0] === 0x89 ? 'png' : b[0] === 0xff ? 'jpg' : b.slice(0, 4).toString() === 'RIFF' ? 'webp' : b.slice(0, 3).toString() === 'GIF' ? 'gif' : 'png';
  const rel = `resources/assets/images/${h.slice(0, 16)}.${ext}`;
  fs.mkdirSync(path.join(OUT, 'resources/assets/images'), {recursive: true});
  fs.copyFileSync(src, path.join(OUT, rel));
  imgByHash.set(h, rel); return rel;
}

// ---------- naming ----------
const RESERVED = new Set('import use export priv as frame text boolean shape asset board component group let const fn this self children where type trait super struct static ref mod loop in data async await if when then else match case not and or try catch rescue finally throw return file tokens icon'.split(' '));
function ident(s, fallback = 'layer') {
  const words = (s || '').normalize('NFKD').replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  const ws = words.map(w => /^[A-Z0-9]+$/.test(w) ? w.toLowerCase() : w);
  let id = ws.map((w, i) => i === 0 ? w[0].toLowerCase() + w.slice(1) : w[0].toUpperCase() + w.slice(1)).join('');
  if (!id) id = fallback;
  if (/^[0-9]/.test(id)) id = fallback + id;
  if (RESERVED.has(id)) id = id + 'Layer';
  return id;
}
function uniq(base, used) { let n = base, i = 2; while (used.has(n)) n = `${base}${i++}`; used.add(n); return n; }

// ---------- emission ----------
const q = (s) => JSON.stringify(s);
const IND = (d) => '  '.repeat(d);

class FileCtx {
  constructor() { this.imports = new Map(); this.aliases = new Set(); this.usesTokens = false; }
  asset(rel, prefix) {
    if (this.imports.has(rel)) return this.imports.get(rel);
    const base = ident(prefix + ' ' + path.basename(rel).replace(/\.[a-z]+$/, ''));
    const a = uniq(base, this.aliases); this.imports.set(rel, a); return a;
  }
}

function fillsOf(paints, f, size) {
  const out = [];
  for (const p of paints || []) {
    if (p.visible === false) continue;
    const op = p.opacity ?? 1;
    if (p.type === 'SOLID') { const e = colorExpr(p.color, op); if (e.includes('colorTokens')) f.usesTokens = true; out.push(e); }
    else if (p.type === 'GRADIENT_LINEAR' || p.type === 'GRADIENT_RADIAL' || p.type === 'GRADIENT_ANGULAR' || p.type === 'GRADIENT_DIAMOND') {
      const stops = (p.stops || []).map(s => { const e = colorExpr(s.color, op); if (e.includes('colorTokens')) f.usesTokens = true; return `stop(${pct(s.position)}, ${e})`; }).join(', ');
      const it = inv(mat(p.transform));
      if (p.type === 'GRADIENT_LINEAR') {
        const [x1, y1] = ap(it, 0, 0.5), [x2, y2] = ap(it, 1, 0.5);
        out.push(`{linear-gradient: {from: point(${pct(x1)}, ${pct(y1)}), to: point(${pct(x2)}, ${pct(y2)}), stops: [${stops}]}}`);
      } else {
        const [cx, cy] = ap(it, 0.5, 0.5);
        out.push(`{radial-gradient: {at: point(${pct(cx)}, ${pct(cy)}), stops: [${stops}]}}`);
      }
    } else if (p.type === 'IMAGE' && p.image?.hash) {
      const rel = registerImage(p.image.hash); if (!rel) continue;
      const alias = f.asset(rel, 'image');
      const sizing = {FIT: '.fit', STRETCH: '.stretch'}[p.imageScaleMode] || '.fill';
      out.push(`{image: {ref: ${alias}, sizing: ${sizing}${op < 1 ? `, opacity: ${num(op)}` : ''}}}`);
    }
  }
  return out;
}

function bordersOf(p, f) {
  const paints = (p.strokePaints || []).filter(s => s.visible !== false);
  if (!paints.length || !(p.strokeWeight > 0)) return [];
  const pos = {INSIDE: '.inside', OUTSIDE: '.outside', CENTER: '.center'}[p.strokeAlign] || '.inside';
  let width = p.strokeWeight, sides = null;
  if (p.borderStrokeWeightsIndependent) {
    const s = [['top', p.borderTopWeight], ['right', p.borderRightWeight], ['bottom', p.borderBottomWeight], ['left', p.borderLeftWeight]].filter(([, w]) => w > 0);
    if (!s.length) return [];
    width = Math.max(...s.map(([, w]) => w)); if (s.length < 4) sides = s.map(([n]) => '.' + n);
  }
  return fillsOf(paints, f, p.size).map(c => {
    const body = c.startsWith('{') ? c.slice(1, -1) + ', ' : `color: ${c}, `;
    const dash = p.dashPattern?.length ? `, dash: [${p.dashPattern.map(px).join(', ')}]` : '';
    return `{${body}width: ${px(width)}, position: ${pos}${sides ? `, sides: [${sides.join(', ')}]` : ''}${dash}}`;
  });
}

function shadowsOf(p, f) {
  const out = [];
  for (const e of p.effects || []) {
    if (e.visible === false) continue;
    if (e.type !== 'DROP_SHADOW' && e.type !== 'INNER_SHADOW') continue;
    const c = colorExpr(e.color); if (c.includes('colorTokens')) f.usesTokens = true;
    const k = e.type === 'DROP_SHADOW' ? 'drop-shadow' : 'inner-shadow';
    out.push(`{${k}: {color: ${c}, offset: point(${num(e.offset?.x || 0)}, ${num(e.offset?.y || 0)}), blur-radius: ${num(e.radius || 0)}${e.spread ? `, spread: ${num(e.spread)}` : ''}}}`);
  }
  return out;
}
function filtersOf(p) {
  const out = [];
  for (const e of p.effects || []) {
    if (e.visible === false) continue;
    if (e.type === 'FOREGROUND_BLUR' || e.type === 'LAYER_BLUR') out.push(`{type: .gaussian-blur, radius: ${px(e.radius || 0)}}`);
    if (e.type === 'BACKGROUND_BLUR') out.push(`{type: .background-blur, radius: ${px(e.radius || 0)}}`);
  }
  return out;
}
const list = (arr) => arr.length === 1 ? arr[0] : `[${arr.join(', ')}]`;

function radiusOf(p) {
  if (p.rectangleCornerRadiiIndependent) {
    const r = [p.rectangleTopLeftCornerRadius, p.rectangleTopRightCornerRadius, p.rectangleBottomRightCornerRadius, p.rectangleBottomLeftCornerRadius].map(v => v || 0);
    if (r.every(v => v === r[0])) return r[0] ? px(r[0]) : null;
    return `[${r.map(px).join(', ')}]`;
  }
  return p.cornerRadius ? px(p.cornerRadius) : null;
}

const HUG = (s) => s === 'RESIZE_TO_FIT' || s === 'RESIZE_TO_FIT_WITH_IMPLICIT_SIZE';
const HUG_PRIMARY = (s) => s !== 'FIXED';
const ALIGN = {MIN: '.start', CENTER: '.center', MAX: '.end', SPACE_EVENLY: '.space-between', SPACE_BETWEEN: '.space-between', BASELINE: '.center'};

let stats = {nodes: 0, svgs: 0, linked: 0, unlinked: 0};
const INCLUDE_HIDDEN = true;
const LIB = new Map(); // symbol guid -> {file, sym}

// Emit one resolved node. parent: {layout: 'row'|'column'|null}. Returns {name, lines}
function emit(r, parent, f, used, depth, extra = {}) {
  stats.nodes++;
  let hidden = false;
  if (!vis(r)) { if (extra.forceVisible === undefined && !INCLUDE_HIDDEN) return null; hidden = !extra.forceVisible; r = {...r, p: {...r.p, visible: true}}; }
  const fin = (ir) => { if (hidden) { ir.props.push('display: .none'); ir.hidden = true; } return ir; };
  const p = r.p;
  const name = uniq(extra.name || ident(p.name, r.type === 'TEXT' ? 'label' : 'layer'), used);
  const props = [];
  const decls = [];
  const inStack = parent.layout && p.stackPositioning !== 'ABSOLUTE';
  const t = p.transform || {m02: 0, m12: 0};
  if (extra.title) props.push(`title: ${q(extra.title)}`);
  if (extra.caption) props.push(`caption: ${q(extra.caption)}`);
  if (extra.left !== undefined) { props.push(`left: ${px(extra.left)}`, `top: ${px(extra.top)}`); }
  else if (!inStack) {
    if (parent.layout) props.push('ignore-stack: .true');
    const rotated = Math.abs(t.m01 || 0) > 1e-3 || Math.abs(t.m10 || 0) > 1e-3 || (t.m00 ?? 1) < 0 || (t.m11 ?? 1) < 0;
    if (rotated) props.push('left: 0px', 'top: 0px', `transform: [${[t.m00, t.m01, t.m02, t.m10, t.m11, t.m12].map(v => +(+v).toFixed(4)).join(', ')}]`);
    else props.push(`left: ${px(t.m02)}`, `top: ${px(t.m12)}`);
  }
  const sz = p.size || {x: 0, y: 0};
  // cross-axis stretch inside a stack
  const stretchW = inStack && parent.layout === 'column' && p.stackChildAlignSelf === 'STRETCH';
  const stretchH = inStack && parent.layout === 'row' && p.stackChildAlignSelf === 'STRETCH';
  const growW = inStack && parent.layout === 'row' && p.stackChildPrimaryGrow > 0;
  const growH = inStack && parent.layout === 'column' && p.stackChildPrimaryGrow > 0;
  const common = () => {
    if (p.opacity !== undefined && p.opacity < 0.999) props.push(`opacity: ${num(p.opacity)}`);
    const sh = shadowsOf(p, f); if (sh.length) props.push(`shadow: ${list(sh)}`);
    const fl = filtersOf(p); if (fl.length) props.push(`filter: ${list(fl)}`);
  };

  // --- graphic -> asset
  const graphic = !extra.root && (isGraphic(r) || (['ELLIPSE', 'ROUNDED_RECTANGLE', 'RECTANGLE'].includes(r.type) && (p.fillPaints || []).some(x => x.visible !== false && x.type?.startsWith('GRADIENT_') && x.type !== 'GRADIENT_LINEAR' && x.type !== 'GRADIENT_RADIAL')));
  if (graphic && hasImage(r) && VECTORISH.has(r.type)) {
    // image-filled vector (e.g. an avatar masked by an ellipse): approximate with an image-filled shape
    const ell = r.children.length ? r.children.every(c => c.type === 'ELLIPSE') : false;
    props.push(`type: ${ell ? '.ellipse' : '.rect'}`, `width: ${px(sz.x)}`, `height: ${px(sz.y)}`);
    const fl = fillsOf(p.fillPaints, f, sz); if (fl.length) props.push(`fill: ${list(fl)}`);
    common();
    return fin({name, kind: 'shape', props, decls});
  }
  if (graphic) {
    if (!p.size || !isFinite(p.size.x) || !isFinite(p.size.y)) return null;
    const {svg, tint, empty} = buildSvg(r);
    if (empty) return null;
    stats.svgs++;
    let base = p.name;
    if (r.symbol) {
      const setNode = byId.get(gid(r.symbol.parentIndex?.guid));
      base = setNode?.isStateGroup ? `${setNode.name} ${r.symbol.name.replace(/[A-Za-z0-9 _:-]+=/g, '')}` : r.symbol.name;
    }
    const rel = registerSvg(svg, base);
    const alias = f.asset(rel, 'icon');
    props.push(stretchW || growW ? `width: ${px(sz.x)}` : `width: ${px(sz.x)}`, `height: ${px(sz.y)}`, `contents: ${alias}`);
    if (tint) { const e = colorExpr({...hexToRgb(tint), a: 1}); if (e.includes('colorTokens')) f.usesTokens = true; props.push(`fill: ${e}`); }
    if (p.opacity !== undefined && p.opacity < 0.999) props.push(`opacity: ${num(p.opacity)}`);
    return fin({name, kind: 'asset', props, decls});
  }

  if (r.type === 'TEXT') {
    const td = p.textData || {};
    let s = td.characters ?? '';
    // ordered / unordered list markers (Figma stores them per line, not in the characters)
    let shift = null;
    if ((td.lines || []).some(l => l.lineType === 'ORDERED_LIST' || l.lineType === 'UNORDERED_LIST')) {
      const src = s.split('\n'); let out = []; let n = 0; shift = []; let pos = 0;
      src.forEach((line, i) => {
        const l = td.lines[i] || {};
        let pre = '';
        if (l.lineType === 'ORDERED_LIST') { n = l.isFirstLineOfList ? 1 : n + 1; pre = `${n}. `; }
        else if (l.lineType === 'UNORDERED_LIST') pre = '• ';
        else n = 0;
        for (let k = 0; k <= line.length; k++) shift[pos + k] = pre.length + (shift.base || 0);
        shift.base = (shift.base || 0) + pre.length; pos += line.length + 1;
        out.push(pre + line);
      });
      s = out.join('\n');
    }
    if (p.textCase === 'UPPER') s = s.toUpperCase(); else if (p.textCase === 'LOWER') s = s.toLowerCase();
    else if (p.textCase === 'TITLE') s = s.replace(/\b\w/g, c => c.toUpperCase());
    const ar = p.textAutoResize || 'NONE';
    if (ar === 'WIDTH_AND_HEIGHT') { /* hug */ }
    else if (ar === 'HEIGHT') props.push(`width: ${stretchW ? '100%' : px(sz.x)}`);
    else props.push(`width: ${stretchW ? '100%' : px(sz.x)}`, `height: ${px(sz.y)}`);
    props.push(`contents: ${q(s)}`);
    props.push(`font-family: ${q(p.fontName?.family || 'DIN Next LT Pro')}`, `font-style: ${q(p.fontName?.style || 'Regular')}`, `font-size: ${num(p.fontSize || 14)}`);
    const lh = p.lineHeight;
    if (lh && p.fontSize) {
      let m = null;
      if (lh.units === 'PIXELS') m = lh.value / p.fontSize;
      else if (lh.units === 'PERCENT' && Math.abs(lh.value - 100) > 0.5) m = lh.value / 100;
      else if (lh.units === 'RAW') m = lh.value;
      if (m) props.push(`line-height: ${+m.toFixed(3)}`);
    }
    const ls = p.letterSpacing;
    if (ls && ls.value) props.push(`letter-spacing: ${ls.units === 'PIXELS' ? pct(ls.value / (p.fontSize || 14)) : `${num(ls.value)}%`}`);
    const al = {CENTER: '.center', RIGHT: '.right', JUSTIFIED: '.justify'}[p.textAlignHorizontal];
    if (al) props.push(`align: ${al}`);
    const va = {CENTER: '.center', BOTTOM: '.bottom'}[p.textAlignVertical];
    if (va && ar !== 'WIDTH_AND_HEIGHT' && ar !== 'HEIGHT') props.push(`vertical-align: ${va}`);
    if (p.textDecoration === 'UNDERLINE') props.push('underline: .single');
    if (p.textDecoration === 'STRIKETHROUGH') props.push('strikethrough: .single');
    const fl = fillsOf(p.fillPaints, f, sz); if (fl.length) props.push(`fill: ${list(fl)}`);
    // per-range styles
    const ids = td.characterStyleIDs || [];
    const table = new Map((td.styleOverrideTable || []).map(o => [o.styleID, o]));
    if (ids.length && table.size && s.length) {
      const ranges = []; let start = 0;
      for (let i = 1; i <= ids.length; i++) if (i === ids.length || ids[i] !== ids[start]) { if (ids[start]) ranges.push([start, i, table.get(ids[start])]); start = i; }
      const sub = [];
      for (const [a, b, o] of ranges) {
        if (!o) continue;
        const sh = (i) => shift ? i + (shift[Math.min(i, shift.length - 1)] ?? 0) : i;
        const parts = [`range: [${sh(a)}, ${sh(b)}]`];
        if (o.fontName) parts.push(`font-family: ${q(o.fontName.family)}`, `font-style: ${q(o.fontName.style)}`);
        if (o.fontSize) parts.push(`font-size: ${num(o.fontSize)}`);
        if (o.fillPaints) { const ff = fillsOf(o.fillPaints, f, sz); if (ff.length) parts.push(`fill: ${list(ff)}`); }
        if (o.textDecoration === 'UNDERLINE') parts.push('underline: .single');
        if (parts.length > 1) sub.push(`{${parts.join(', ')}}`);
      }
      if (sub.length) props.push(`subrange: [${sub.join(', ')}]`);
    }
    common();
    return fin({name, kind: 'text', props, decls});
  }

  if (['ROUNDED_RECTANGLE', 'RECTANGLE', 'ELLIPSE'].includes(r.type)) {
    props.push(`type: ${r.type === 'ELLIPSE' ? '.ellipse' : '.rect'}`);
    props.push(`width: ${stretchW ? '100%' : px(sz.x)}`, `height: ${stretchH ? '100%' : px(sz.y)}`);
    const rad = r.type !== 'ELLIPSE' && radiusOf(p); if (rad) props.push(`corner-radius: ${rad}`);
    const fl = fillsOf(p.fillPaints, f, sz); if (fl.length) props.push(`fill: ${list(fl)}`);
    const bd = bordersOf(p, f); if (bd.length) props.push(`border: ${list(bd)}`);
    common();
    return fin({name, kind: 'shape', props, decls});
  }

  // frames / instances / symbols / groups / sections
  // link instances of library components as real Elyx instances with property overrides
  if (r.type === 'INSTANCE' && !extra.root && !parent.noLink && r.symbol && LIB.has(gid(r.symbol.guid))) {
    const lib = LIB.get(gid(r.symbol.guid));
    const inl = {...parent, noLink: true};
    const instIR = emit({...r, p: {...r.p, visible: true}}, inl, f, new Set(), depth, {name});
    const mainIR = emit(resolveNode(r.symbol, new Map(), new Map()), inl, f, new Set(), depth, {name, forceVisible: true});
    const d = instIR && mainIR && diffIR(mainIR, instIR, true, new Set());
    if (d) {
      stats.linked++;
      const ref = lib.file === f.rel ? `::${lib.sym}` : `${f.lib(lib.file)}.${lib.sym}`;
      return fin({name, kind: 'frame', instOf: ref, props: d.props, subs: d.subs, decls: d.decls});
    }
    stats.unlinked++;
  }
  let layout = p.stackMode === 'HORIZONTAL' ? 'row' : p.stackMode === 'VERTICAL' ? 'column' : null;
  if ((p.stackSpacing || 0) < 0) layout = null; // overlapping stacks: keep Figma's resolved positions
  let wAuto = false, hAuto = false;
  if (layout && r.children.some(vis)) {
    const prim = HUG_PRIMARY(p.stackPrimarySizing), cross = HUG(p.stackCounterSizing);
    if (layout === 'row') { wAuto = prim; hAuto = cross; } else { hAuto = prim; wAuto = cross; }
  }
  if (stretchW) props.push('width: 100%'); else if (!wAuto || growW) props.push(`width: ${px(sz.x)}`);
  if (stretchH) props.push('height: 100%'); else if (!hAuto || growH) props.push(`height: ${px(sz.y)}`);
  if (layout) {
    const l = [`direction: .${layout}`];
    if (p.stackSpacing) l.push(`item-gap: ${px(p.stackSpacing)}`);
    const j = ALIGN[p.stackPrimaryAlignItems]; if (j && j !== '.start') l.push(`justify-content: ${j}`);
    const a = ALIGN[p.stackCounterAlignItems]; if (a && a !== '.start') l.push(`align-items: ${a === '.space-between' ? '.start' : a}`);
    if (p.stackWrap === 'WRAP') { l.push('wrap: .true'); if (p.stackCounterSpacing) l.push(`line-gap: ${px(p.stackCounterSpacing)}`); }
    if (p.bordersTakeSpace) l.push('include-borders: .true');
    props.push(`layout: {${l.join(', ')}}`);
    const pt = p.stackVerticalPadding || 0, pl = p.stackHorizontalPadding || 0;
    const pr = p.stackPaddingRight ?? pl, pb = p.stackPaddingBottom ?? pt;
    if (pt || pr || pb || pl) {
      if (pt === pb && pl === pr) props.push(`padding: ${pt === pl ? px(pt) : `[${px(pt)}, ${px(pl)}]`}`);
      else props.push(`padding: [${px(pt)}, ${px(pr)}, ${px(pb)}, ${px(pl)}]`);
    }
  }
  const rad = radiusOf(p); if (rad) props.push(`corner-radius: ${rad}`);
  const fl = fillsOf(p.fillPaints, f, sz); if (fl.length) props.push(`fill: ${list(fl)}`);
  const bd = bordersOf(p, f); if (bd.length) props.push(`border: ${list(bd)}`);
  if (p.frameMaskDisabled !== false || r.type === 'SECTION') props.push('overflow: .visible');
  if (r.slot) props.push('slot: .true');
  common();
  const childUsed = new Set();
  for (const c of r.children) {
    if (c.p.mask) continue; // masks are only supported inside vector graphics
    const e = emit(c, {layout, noLink: parent.noLink}, f, childUsed, depth + 1);
    if (e) decls.push(e);
  }
  const ir = fin({name, kind: 'frame', props, decls, export: extra.export, slot: r.slot});
  return ir;
}
const RESET = {width: '.auto', height: '.auto', fill: '[]', border: '[]', shadow: '[]', filter: '[]', opacity: '1', 'corner-radius': '0px', padding: '0px', overflow: '.clip', 'line-height': '0', 'letter-spacing': '0%', align: '.left', 'vertical-align': '.top', underline: '.none', strikethrough: '.none', subrange: '[]', display: '.visible', 'ignore-stack': '.false'};
const splitProp = (x) => { const i = x.indexOf(': '); return [x.slice(0, i), x.slice(i + 2)]; };
function diffIR(m, n, root, bodyNames) {
  if (m.kind !== n.kind || m.instOf || n.instOf) return null;
  const mp = new Map(m.props.map(splitProp)), np = new Map(n.props.map(splitProp));
  const props = [];
  for (const [k, v] of np) {
    if (k === 'title' || k === 'caption') continue;
    if (mp.get(k) !== v) props.push(`${k}: ${v}`);
  }
  for (const [k] of mp) {
    if (np.has(k) || k === 'title' || k === 'caption' || k === 'left' || k === 'top') continue;
    if (!(k in RESET)) return null;
    props.push(`${k}: ${RESET[k]}`);
  }
  const subs = [], decls = [];
  const md = m.decls || [], nd = n.decls || [];
  const childDiff = () => {
    let mi = 0;
    for (const c of nd) {
      let j = mi; while (j < md.length && md[j].name !== c.name) j++;
      if (j >= md.length) return false;
      for (let x = mi; x < j; x++) if (!md[x].hidden) subs.push({name: md[x].name, props: ['display: .none'], subs: []});
      const d = diffIR(md[j], c, false, bodyNames);
      if (!d) return false;
      if (d.props.length || d.subs.length || d.inserts) subs.push({name: c.name, props: d.props, subs: d.subs, inserts: d.inserts});
      decls.push(...d.decls);
      mi = j + 1;
    }
    for (let x = mi; x < md.length; x++) if (!md[x].hidden) subs.push({name: md[x].name, props: ['display: .none'], subs: []});
    return true;
  };
  const save = bodyNames.size;
  if (!childDiff()) {
    if (!m.slot) return null;
    // slot: hide the example content and insert the instance's own content
    subs.length = 0; decls.length = 0;
    for (const c of md) if (!c.hidden) subs.push({name: c.name, props: ['display: .none'], subs: []});
    const inserts = [];
    for (const c of nd) { c.name = uniq(c.name, bodyNames); decls.push(c); inserts.push(c.name); }
    return {props, subs, decls, inserts};
  }
  return {props, subs, decls};
}

function ser(ir, depth) {
  const I = IND(depth), J = IND(depth + 1);
  const props = [...ir.props];
  if (ir.instOf) {
    const subs = (ir.subs || []).map(s => serSub(s, depth + 1));
    const decls = (ir.decls || []).map(d => ser(d, depth + 1));
    const parts = [props.map(x => J + x).join(',\n'), subs.join('\n\n'), decls.join('\n\n')].filter(Boolean);
    return `${I}${ir.name} = ${ir.kind} : ${ir.instOf} {\n${parts.join('\n\n')}\n${I}}`;
  }
  if (ir.kind === 'frame' && ir.decls.length) props.push(`children: [${ir.decls.map(d => d.name).join(', ')}]`);
  const decls = (ir.decls || []).map(d => ser(d, depth + 1));
  return `${I}${ir.export ? 'export ' : ''}${ir.name} = ${ir.kind} {\n${props.map(x => J + x).join(',\n')}${decls.length ? '\n\n' + decls.join('\n\n') : ''}\n${I}}`;
}
function serSub(s, depth) {
  const I = IND(depth), J = IND(depth + 1);
  if (s.inserts?.length) s = {...s, props: [...s.props, `overrides: [${s.inserts.map((n, i) => `insert(${n}, after = ${i ? s.inserts[i - 1] : '.nil'})`).join(', ')}]`]};
  const subs = s.subs.map(x => serSub(x, depth + 1));
  return `${I}${s.name} {\n${s.props.map(x => J + x).join(',\n')}${subs.length ? (s.props.length ? '\n\n' : '') + subs.join('\n\n') : ''}\n${I}}`;
}

function hexToRgb(h) { return {r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255}; }

// ---------- pages -> files ----------
const PAGES = JSON.parse(fs.readFileSync(new URL('./pages.json', import.meta.url)));
const report = [];
const files = []; // {rel, units, used}
for (const [pageName, rel, kind] of PAGES) {
  const page = N.find(n => n.type === 'CANVAS' && n.name === pageName);
  if (!page) { console.error('missing page', pageName); continue; }
  if (kind === 'screens') {
    const used = new Set();
    for (const c of ch(page)) if (c.visible !== false && ['FRAME', 'SYMBOL', 'INSTANCE'].includes(c.type) && c.size?.x >= 300 && c.size?.y >= 500) {
      const sym = ident(c.name, 'screen');
      const fname = uniq(kebab(c.name), used);
      files.push({rel: `${rel}/${fname}.elyx`, units: [{items: [{node: c, title: c.name, sym, x: 0, y: 0, screen: true}]}]});
    }
    continue;
  }
  const units = [];
  const walk = (n) => {
    for (const c of ch(n)) {
      if (c.visible === false) continue;
      if (c.isStateGroup) {
        units.push({set: c, items: ch(c).filter(v => v.type === 'SYMBOL' && v.visible !== false).map(v => ({node: v, title: `${c.name} / ${v.name}`, sym: ident(c.name + ' ' + v.name.split(',').map(s => s.split('=').pop().trim()).join(' '), 'component'), x: v.transform.m02, y: v.transform.m12}))});
      } else if (c.type === 'SYMBOL') {
        units.push({items: [{node: c, title: c.name, sym: ident(c.name, 'component'), x: 0, y: 0}]});
      } else if (c.type === 'FRAME' || c.type === 'SECTION') walk(c);
    }
  };
  walk(page);
  if (!units.length) { console.error('no units on', pageName); continue; }
  files.push({rel, units});
}
// pass 1: assign final symbols and register the library
for (const file of files) {
  const used = new Set();
  for (const u of file.units) for (const it of u.items) {
    it.sym = uniq(it.sym, used);
    if (!it.screen) LIB.set(gid(it.node.guid), {file: file.rel, sym: it.sym});
  }
}
// pass 2: emit
for (const file of files) {
  const f = new FileCtx(); f.rel = file.rel;
  f.libs = new Map();
  f.lib = (rel) => { if (!f.libs.has(rel)) f.libs.set(rel, uniq(ident(path.basename(rel, '.elyx') + ' lib'), f.aliases)); return f.libs.get(rel); };
  let top = 0; const out = [];
  for (const u of file.units) {
    const rows = [];
    for (const it of [...u.items].sort((a, b) => a.y - b.y || a.x - b.x)) {
      const row = rows.find(r => Math.abs(r.y - it.y) < 8);
      if (row) row.items.push(it); else rows.push({y: it.y, items: [it]});
    }
    let unitBottom = top;
    for (const row of rows) {
      row.items.sort((a, b) => a.x - b.x);
      let left = 0; let rowH = 0;
      for (const it of row.items) {
        const w = it.node.size.x, h = it.node.size.y;
        const r = resolveNode(it.node, new Map(), new Map());
        const ir = emit(r, {layout: null}, f, new Set(), 0, {name: it.sym, export: true, root: true, forceVisible: true, title: it.title, left, top: unitBottom});
        if (!ir || !ir.decls.length) { LIB.delete(gid(it.node.guid)); continue; } // empty legacy components
        out.push(ser(ir, 0));
        report.push(`${file.rel}\t${it.sym}\t${it.title}\t${gid(it.node.guid)}\t${u.set ? gid(u.set.guid) : ''}`);
        left += w + Math.max(48, Math.round(w * 0.2));
        rowH = Math.max(rowH, h);
      }
      unitBottom += rowH + Math.max(48, Math.round(rowH * 0.2));
    }
    top = unitBottom + 80;
  }
  const body = out.join('\n\n') + '\n';
  const usedAlias = (a) => new RegExp(`(^|[^A-Za-z0-9_-])${a}([^A-Za-z0-9_-]|$)`).test(body);
  let src = '';
  if (body.includes('colorTokens.')) src += 'import "tokens/colors.elyx" as colorTokens\n';
  for (const [r2, a] of f.libs) if (usedAlias(a)) src += `import ${q(r2)} as ${a}\n`;
  for (const [r2, a] of f.imports) if (usedAlias(a)) src += `import ${q(r2)} as ${a}\n`;
  src += '\n' + body;
  fs.mkdirSync(path.dirname(path.join(OUT, file.rel)), {recursive: true});
  fs.writeFileSync(path.join(OUT, file.rel), src);
  console.log(file.rel, (src.length / 1024).toFixed(0) + 'KB');
}
fs.mkdirSync('/tmp/figwork', {recursive: true}); fs.writeFileSync('/tmp/figwork/components.tsv', report.join('\n') + '\n');
console.log(stats, 'svgs files', svgByHash.size, 'images', imgByHash.size);
