// Renders every exported Elyx component to PNG. Storybook shows these as the
// "Design reference" next to the live component, and check-visual compares them.
//
//   node scripts/build-catalog.mjs          render exports whose file changed
//   node scripts/build-catalog.mjs --force  re-render everything

import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { elyx, parseExports, pool, requireElyx, sbRoot, projectRoot, sectionFiles } from "./lib/elyx.mjs";

export const SCALE = 2;
const rendersDir = join(sbRoot, "public", "renders");
const force = process.argv.includes("--force");

const jobs = [];
const index = {};
for (const { file } of sectionFiles()) {
  const srcTime = statSync(join(projectRoot, file)).mtimeMs;
  for (const e of parseExports(file)) {
    const rel = `${file.replace(/\.elyx$/, "")}/${e.ref}.png`;
    const png = join(rendersDir, rel);
    index[`${file}#${e.ref}`] = `renders/${rel}`;
    if (force || !existsSync(png) || statSync(png).mtimeMs < srcTime) jobs.push({ file, ref: e.ref, png });
  }
}

if (jobs.length) {
  requireElyx();
  let done = 0;
  const failed = [];
  console.log(`Rendering ${jobs.length} design references…`);
  await pool(jobs, async ({ file, ref, png }) => {
    mkdirSync(dirname(png), { recursive: true });
    try {
      await elyx(["render", file, "--ref", ref, "--scale", String(SCALE), "--no-connections", "-o", png]);
    } catch (err) {
      failed.push(`${file}#${ref}: ${(err.stderr || err.message).trim().split("\n")[0]}`);
    }
    if (++done % 50 === 0 || done === jobs.length) console.log(`  ${done}/${jobs.length}`);
  });
  if (failed.length) console.warn(`${failed.length} failed to render:\n  ${failed.join("\n  ")}`);
}

mkdirSync(join(sbRoot, "src", "generated"), { recursive: true });
writeFileSync(join(sbRoot, "src", "generated", "renders.json"), JSON.stringify(index, null, 1));
// check-visual.mjs fills this in; the Spec reads it.
const visual = join(sbRoot, "src", "generated", "visual.json");
if (!existsSync(visual)) writeFileSync(visual, "{}");
console.log(`Design references up to date (${Object.keys(index).length}).`);
