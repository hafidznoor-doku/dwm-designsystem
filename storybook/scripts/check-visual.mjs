// Compares every live story with its Elyx render and reports the pixel diff.
// Needs the dev server running (npm run storybook) and Google Chrome.
//
//   node scripts/check-visual.mjs                  all exports
//   node scripts/check-visual.mjs controls/button  only files under that path
//
// Writes src/generated/visual.json (shown in each Spec) and diff images to visual-report/.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import puppeteer from "puppeteer-core";
import { sbRoot } from "./lib/elyx.mjs";

const SCALE = 2;
const BASE = process.env.STORYBOOK_URL ?? "http://localhost:6006";
const CHROME = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const filter = process.argv[2];
const scenesDir = join(sbRoot, "src", "generated", "scenes");
const reportDir = join(sbRoot, "visual-report");
const renders = JSON.parse(readFileSync(join(sbRoot, "src", "generated", "renders.json"), "utf8"));

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const jobs = walk(scenesDir)
  .filter((p) => p.endsWith(".json"))
  .flatMap((p) => {
    const scene = JSON.parse(readFileSync(p, "utf8"));
    return scene.exports.map((e) => ({ file: scene.file, ref: e.ref, w: e.root.spec.w, h: e.root.spec.h }));
  })
  .filter((j) => !filter || j.file.startsWith(filter));

try {
  await fetch(`${BASE}/index.json`);
} catch {
  console.error(`Storybook is not running at ${BASE}. Start it with npm run storybook.`);
  process.exit(1);
}

// A filtered run only clears its own diff images, so runs can overlap.
mkdirSync(reportDir, { recursive: true });
const keyOf = (j) => `${j.file.replace(/\.elyx$/, "").replace(/\//g, "__")}--${j.ref}`;
for (const j of jobs) rmSync(join(reportDir, `${keyOf(j)}.png`), { force: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const results = {};
let done = 0;

// Elyx renders are transparent; the story canvas is #F6F6F6.
function onBackground(img, [r, g, b] = [0xf6, 0xf6, 0xf6]) {
  for (let i = 0; i < img.data.length; i += 4) {
    const a = img.data[i + 3] / 255;
    img.data[i] = Math.round(img.data[i] * a + r * (1 - a));
    img.data[i + 1] = Math.round(img.data[i + 1] * a + g * (1 - a));
    img.data[i + 2] = Math.round(img.data[i + 2] * a + b * (1 - a));
    img.data[i + 3] = 255;
  }
  return img;
}

// Offset (device px) of `ref` inside `area` with the lowest difference, sampled
// on a coarse grid and searched in 1dp steps.
function bestOffset(ref, area) {
  const maxX = area.width - ref.width, maxY = area.height - ref.height;
  if (maxX < 0 || maxY < 0) return [0, 0];
  const step = Math.max(2, Math.floor(Math.min(ref.width, ref.height) / 60));
  let best = [Math.round(maxX / 2), Math.round(maxY / 2)], bestScore = Infinity;
  for (let oy = 0; oy <= maxY; oy += SCALE) {
    for (let ox = 0; ox <= maxX; ox += SCALE) {
      let score = 0;
      for (let y = 0; y < ref.height && score < bestScore; y += step) {
        for (let x = 0; x < ref.width; x += step) {
          const i = (y * ref.width + x) * 4, k = ((y + oy) * area.width + x + ox) * 4;
          score += Math.abs(ref.data[i] - area.data[k]) + Math.abs(ref.data[i + 1] - area.data[k + 1]) + Math.abs(ref.data[i + 2] - area.data[k + 2]);
        }
      }
      if (score < bestScore) { bestScore = score; best = [ox, oy]; }
    }
  }
  return best;
}

async function check(page, j) {
  const key = keyOf(j);
  const refPath = renders[`${j.file}#${j.ref}`] && join(sbRoot, "public", renders[`${j.file}#${j.ref}`]);
  if (!refPath || !existsSync(refPath)) return null;
  const refPng = PNG.sync.read(readFileSync(refPath));
  // Leave room for strokes, shadows and arrows that the Elyx render includes.
  const room = (n, r) => Math.ceil(Math.max(n, r / SCALE)) + 400;
  await page.setViewport({ width: room(j.w, refPng.width), height: room(j.h, refPng.height), deviceScaleFactor: SCALE });
  await page.goto(`${BASE}/iframe.html?id=internal-visual-check--export&viewMode=story&args=exportKey:${key}&globals=spec:hide`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  const root = await page.waitForSelector("[data-visual-root] > *", { timeout: 15000 });
  const box = await root.boundingBox();
  const ref = refPng;
  // Elyx renders can extend past the layer (strokes, shadows, overflowing or
  // hidden children), so capture an area around the element and find where
  // the render lines up best before diffing.
  const rw = ref.width / SCALE, rh = ref.height / SCALE;
  const mx = Math.ceil(Math.abs(rw - box.width)) + 4, my = Math.ceil(Math.abs(rh - box.height)) + 4;
  const area = { x: box.x - mx, y: box.y - my, width: Math.max(rw, box.width) + 2 * mx, height: Math.max(rh, box.height) + 2 * my };
  const full = PNG.sync.read(Buffer.from(await page.screenshot({ clip: area, captureBeyondViewport: true })));
  const a = onBackground(ref);
  const [ox, oy] = bestOffset(a, full);
  const width = Math.min(ref.width, full.width - ox), height = Math.min(ref.height, full.height - oy);
  const b = new PNG({ width, height });
  PNG.bitblt(full, b, ox, oy, width, height, 0, 0);
  const aCrop = new PNG({ width, height });
  PNG.bitblt(a, aCrop, 0, 0, width, height, 0, 0);
  const diff = new PNG({ width, height });
  const bad = pixelmatch(aCrop.data, b.data, diff.data, width, height, { threshold: 0.15 });
  const pct = +((bad / (width * height)) * 100).toFixed(2);
  // Layout size against the design's layer size, ignoring strokes and shadows.
  const sizeDelta = [+(box.width - j.w).toFixed(1), +(box.height - j.h).toFixed(1)];
  if (pct > 0.5 || sizeDelta.some((d) => Math.abs(d) > 1)) writeFileSync(join(reportDir, `${key}.png`), PNG.sync.write(diff));
  return { diff: pct, sizeDelta };
}

const queue = [...jobs];
await Promise.all(Array.from({ length: 4 }, async () => {
  const page = await browser.newPage();
  while (queue.length) {
    const j = queue.shift();
    try {
      const r = await check(page, j);
      if (r) results[`${j.file}#${j.ref}`] = r;
    } catch (err) {
      results[`${j.file}#${j.ref}`] = { error: err.message.split("\n")[0] };
    }
    if (++done % 25 === 0 || done === jobs.length) console.log(`  ${done}/${jobs.length}`);
  }
  await page.close();
}));
await browser.close();

// Merge into the shared report so partial runs keep earlier results.
const reportPath = join(sbRoot, "src", "generated", "visual.json");
// Read it again just before writing, in case another run finished meanwhile.
const previous = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, "utf8")) : {};
writeFileSync(reportPath, JSON.stringify({ ...previous, ...results }, null, 1));

const rows = Object.entries(results).sort((x, y) => (y[1].diff ?? 999) - (x[1].diff ?? 999));
const worst = rows.filter(([, r]) => r.error || r.diff > 2 || r.sizeDelta.some((d) => Math.abs(d) > 1));
console.log(`\nChecked ${rows.length}. ${worst.length} over 2% diff or off by more than 1dp:`);
for (const [k, r] of worst.slice(0, 40)) console.log(`  ${r.error ? `ERROR ${r.error}` : `${String(r.diff).padStart(6)}%  size Δ ${r.sizeDelta.join(",")}`}  ${k}`);
console.log(`Diff images: ${relative(process.cwd(), reportDir)}/`);
