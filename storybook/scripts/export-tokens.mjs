// Exports tokens/*.elyx to CSS variables, a token index for the spec docs, and
// Android / iOS resource files developers can drop into the native apps.

import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { elyxJson, projectRoot, requireElyx, sbRoot } from "./lib/elyx.mjs";

const out = join(sbRoot, "src", "generated");
const TOKEN_FILES = ["tokens/colors.elyx", "tokens/lengths.elyx", "tokens/typography.elyx"];

requireElyx();
mkdirSync(join(out, "platform"), { recursive: true });

const camel = (s) => s.replace(/[-_]+(\w)/g, (_, c) => c.toUpperCase());
const snake = (s) => s.replace(/-/g, "_");
const cssVar = (scope, name) => `--elyx-${scope}-${name}`;

export function rgbToHex(rgb) {
  const m = rgb.match(/rgb\(([\d.]+) ([\d.]+) ([\d.]+) \/ ([\d.]+)\)/);
  if (!m) return rgb;
  const [r, g, b] = m.slice(1, 4).map((v) => Math.round(+v).toString(16).padStart(2, "0"));
  const a = Math.round(+m[4] * 255);
  return `#${r}${g}${b}${a < 255 ? a.toString(16).padStart(2, "0") : ""}`.toUpperCase();
}

// Per scope: how the token is named and measured on each platform.
const PLATFORM = {
  colors: { android: (n) => `R.color.${snake(n)}`, ios: (n) => `DokuColor.${camel(n)}` },
  semantic: { android: (n) => `R.color.${snake(n)}`, ios: (n) => `DokuColor.${camel(n)}` },
  spacing: { android: (n) => `R.dimen.spacing_${snake(n)}`, ios: (n) => `DokuSpacing.${camel(n)}`, unit: "dp" },
  radius: { android: (n) => `R.dimen.radius_${snake(n)}`, ios: (n) => `DokuRadius.${camel(n)}`, unit: "dp" },
  "font-sizes": { android: (n) => `R.dimen.text_size_${snake(n)}`, ios: (n) => `DokuFontSize.${camel(n)}`, unit: "sp" },
  "line-heights": { android: (n) => `lineHeight ${n}`, ios: (n) => `lineHeight ${n}` },
  "font-families": { android: (n) => `R.font.${snake(n)}`, ios: (n) => `DokuFont.${camel(n)}` },
  "font-styles": { android: (n) => `FontWeight.${camel(n)}`, ios: (n) => `.${camel(n)}` },
};

const raw = [];
for (const file of TOKEN_FILES) raw.push(...(await elyxJson(["tokens", file])).tokens);

const byKey = new Map(raw.map((t) => [`${t.scope.join(".")}.${t.name}`, t]));
const tokens = raw.map((t) => {
  const scope = t.scope.join(".");
  const alias = t.alias ? `${t.alias.rootScope.join(".")}.${t.alias.name}` : null;
  const value = alias ? byKey.get(alias)?.value : t.value;
  const p = PLATFORM[scope] ?? { android: snake, ios: camel };
  return {
    key: `${scope}.${t.name}`,
    scope,
    name: t.name,
    type: t.type,
    alias,
    value: typeof value === "number" ? +value.toFixed(3) : value,
    hex: t.type === "color" ? rgbToHex(value) : null,
    unit: p.unit ?? null,
    cssVar: cssVar(scope, t.name),
    android: p.android(t.name),
    ios: p.ios(t.name),
  };
});

// ---- web -----------------------------------------------------------------

const cssValue = (t) => {
  if (t.alias) return `var(${tokens.find((x) => x.key === t.alias).cssVar})`;
  if (t.type === "string") return JSON.stringify(t.value);
  if (t.unit) return `${t.value}px`;
  return String(t.value);
};
writeFileSync(
  join(out, "tokens.css"),
  `/* Generated from tokens/*.elyx by scripts/export-tokens.mjs. Do not edit. */\n:root {\n${tokens
    .map((t) => `  ${t.cssVar}: ${cssValue(t)};`)
    .join("\n")}\n}\n`,
);
writeFileSync(join(out, "tokens.json"), JSON.stringify(tokens, null, 1));

// ---- Android -------------------------------------------------------------

const colors = tokens.filter((t) => t.type === "color");
const xml = (body) => `<?xml version="1.0" encoding="utf-8"?>\n<!-- Generated from the DWM Elyx design system. -->\n<resources>\n${body}\n</resources>\n`;
writeFileSync(
  join(out, "platform", "colors.xml"),
  xml(colors.map((t) => (t.alias
    ? `    <color name="${snake(t.name)}">@color/${snake(t.alias.split(".").pop())}</color>`
    : `    <color name="${snake(t.name)}">${t.hex}</color>`)).join("\n")),
);
const dimens = tokens.filter((t) => t.unit);
writeFileSync(
  join(out, "platform", "dimens.xml"),
  xml(dimens.map((t) => `    <dimen name="${t.android.split(".").pop()}">${t.value}${t.unit}</dimen>`).join("\n")),
);

// ---- iOS -----------------------------------------------------------------

const swiftColor = (t) => {
  const [r, g, b] = t.value.match(/[\d.]+/g).slice(0, 3).map((v) => (+v / 255).toFixed(3));
  const a = (+t.value.match(/\/ ([\d.]+)/)[1]).toFixed(3);
  return `Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${a})`;
};
const swiftEnum = (name, scope, fmt) =>
  `public enum ${name} {\n${tokens.filter((t) => t.scope === scope).map((t) => `    public static let ${camel(t.name)}: CGFloat = ${fmt(t)}`).join("\n")}\n}\n`;
writeFileSync(
  join(out, "platform", "DokuTokens.swift"),
  `// Generated from the DWM Elyx design system.\nimport SwiftUI\n\npublic enum DokuColor {\n${colors
    .map((t) => (t.alias
      ? `    public static let ${camel(t.name)} = ${camel(t.alias.split(".").pop())}`
      : `    public static let ${camel(t.name)} = ${swiftColor(t)} // ${t.hex}`))
    .join("\n")}\n}\n\n${swiftEnum("DokuSpacing", "spacing", (t) => t.value)}\n${swiftEnum("DokuRadius", "radius", (t) => t.value)}\n${swiftEnum("DokuFontSize", "font-sizes", (t) => t.value)}`,
);

// Icon index for the Foundations / Icons page.
const icons = readdirSync(join(projectRoot, "resources", "assets", "icons")).filter((f) => f.endsWith(".svg")).sort();
writeFileSync(join(out, "icons.json"), JSON.stringify(icons.map((f) => f.replace(/\.svg$/, ""))));

console.log(`Exported ${tokens.length} tokens and ${icons.length} icons.`);
