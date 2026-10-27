import puppeteer from "puppeteer-core";
import { PNG } from "pngjs";
import { readFileSync, writeFileSync } from "node:fs";
const [key, refPath, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const p = await b.newPage();
await p.setViewport({ width: 600, height: 300, deviceScaleFactor: 2 });
await p.goto(`http://localhost:6006/iframe.html?id=internal-visual-check--export&viewMode=story&args=exportKey:${key}&globals=spec:hide`, { waitUntil: "networkidle0" });
await p.evaluate(() => document.fonts.ready);
const el = await p.waitForSelector("[data-visual-root] > *");
const box = await el.boundingBox();
const ref = PNG.sync.read(readFileSync(refPath));
const rw = ref.width / 2, rh = ref.height / 2;
const shot = PNG.sync.read(Buffer.from(await p.screenshot({ clip: { x: box.x + box.width / 2 - rw / 2, y: box.y + box.height / 2 - rh / 2, width: rw, height: rh } })));
const o = new PNG({ width: ref.width, height: ref.height * 2 });
for (let i = 0; i < o.data.length; i += 4) { o.data[i] = o.data[i+1] = o.data[i+2] = 246; o.data[i+3] = 255; }
for (let y = 0; y < ref.height; y++) for (let x = 0; x < ref.width; x++) { const i = (y * ref.width + x) * 4, a = ref.data[i+3] / 255; for (let c = 0; c < 3; c++) o.data[i+c] = Math.round(ref.data[i+c] * a + 246 * (1 - a)); }
PNG.bitblt(shot, o, 0, 0, Math.min(shot.width, ref.width), Math.min(shot.height, ref.height), 0, ref.height);
writeFileSync(out, PNG.sync.write(o)); await b.close();
