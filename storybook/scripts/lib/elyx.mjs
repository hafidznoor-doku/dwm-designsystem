// Shared helpers for the scripts that read the Elyx project.

import { execFile } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { cpus } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);

export const sbRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const projectRoot = join(sbRoot, "..");
export const ELYX = process.env.ELYX_BIN ?? "/Applications/Elyx Preview.app/Contents/Resources/bin/elyx";

// Sidebar sections, in order. `dir` is scanned recursively for .elyx files.
export const SECTIONS = [
  { title: "Foundations", files: ["foundations.elyx"] },
  { title: "Controls", dir: "controls" },
  { title: "Blocks", dir: "blocks" },
  { title: "Screens", dir: "screens" },
];

export function requireElyx() {
  if (!existsSync(ELYX)) {
    console.error(`Elyx CLI not found at ${ELYX}. Install Elyx or set ELYX_BIN.`);
    process.exit(1);
  }
}

export async function elyx(args) {
  const { stdout } = await exec(ELYX, [...args, "--workspace", projectRoot], { cwd: projectRoot, maxBuffer: 1 << 28 });
  return stdout;
}

export const elyxJson = async (args) => JSON.parse(await elyx(args));

export const walk = (dir) =>
  readdirSync(join(projectRoot, dir), { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".elyx") ? [join(dir, e.name)] : []))
    .sort();

export const sectionFiles = () => SECTIONS.flatMap((s) => (s.files ?? walk(s.dir)).map((file) => ({ section: s.title, file })));

export const pretty = (s) =>
  s
    .replace(/^_+/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || s;

// Figma prop names carry markers like ":state" or "?disabled"; keep the readable part.
const propLabel = (name) => name.replace(/^[:?_]+/, "").trim();

// Collect `export name = …` declarations with their Figma title.
export function parseExports(file) {
  const lines = readFileSync(join(projectRoot, file), "utf8").split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^export (\w+) = (frame|text|shape|asset|boolean)\b/);
    if (!m) continue;
    let title = null;
    for (let j = i + 1; j < lines.length && !/^\S/.test(lines[j]); j++) {
      const t = lines[j].match(/^  title: "(.*)",?$/);
      if (t) { title = t[1].replace(/\\"/g, '"'); break; }
    }
    out.push({ ref: m[1], title: title ?? m[1] });
  }
  return out;
}

// "button / Size=default, :state=pressed" → { set: "button", props: { Size: "default", state: "pressed" } }
export function parseTitle(title) {
  const slash = title.indexOf(" / ");
  if (slash < 0) return { set: title, props: null };
  const props = {};
  for (const part of title.slice(slash + 3).split(/,\s*/)) {
    const eq = part.indexOf("=");
    if (eq < 0) return { set: title, props: null };
    props[propLabel(part.slice(0, eq))] = part.slice(eq + 1).trim();
  }
  return { set: title.slice(0, slash), props };
}

export async function pool(items, fn, limit = Math.max(2, Math.min(8, cpus().length - 2))) {
  let next = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < items.length) await fn(items[next++]);
  }));
}
