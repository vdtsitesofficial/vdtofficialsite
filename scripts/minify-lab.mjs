// Minifies the hand-written /lab bundle in the built OpenNext output.
//
// Runs after `opennextjs-cloudflare build` and before the deploy, in the
// preview/deploy scripts (package.json).
//
// ── Why this exists
// public/lab/*.{js,css} is the laptop-zoom homepage: ~330 KB of hand-written
// JS and CSS shipped exactly as authored. The Aug 2026 Semrush audit flagged
// 32 unminified-resource checks, all of them these files, and they are the
// largest thing a first-time visitor downloads. Everything else on the site
// (the Next.js chunks under /_next/static) is already minified by the
// framework; this directory was the one gap.
//
// ── Why it patches the build output, not the source
// The obvious alternative is moving the sources to lab-src/ and generating
// public/lab/. That works, but it costs the dev workflow: `next dev` serves
// public/ straight off disk, so every edit would need the generator to re-run
// before it showed up, and the readable file would no longer be the one whose
// path appears in a stack trace. Minifying .open-next/assets/lab/ instead
// leaves public/lab/ as the single readable source of truth, keeps `npm run
// dev` instant, and means only the deployed artifact differs. The tradeoff is
// that dev serves unminified files, which is what you want in dev anyway.
//
// ── Safety
// Cache-busting is unaffected: files are referenced as /lab/x.css?v=LAB_V
// (lib/labVersion.ts) and keep their exact paths here, so the immutable
// Cache-Control rules in public/_headers still match. A file that fails to
// minify FAILS THE BUILD rather than falling back to the original, because a
// silent fallback would quietly reintroduce the exact problem this fixes.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { transform } from "esbuild";

const LAB_DIR = join(process.cwd(), ".open-next", "assets", "lab");

function kb(bytes) {
  return (bytes / 1024).toFixed(1).padStart(6) + " KB";
}

const files = (await readdir(LAB_DIR)).filter(
  (f) => f.endsWith(".js") || f.endsWith(".css"),
);

if (files.length === 0) {
  console.error(`minify-lab: no .js/.css found in ${LAB_DIR}`);
  process.exit(1);
}

let before = 0;
let after = 0;
const rows = [];

for (const name of files) {
  const path = join(LAB_DIR, name);
  const source = await readFile(path, "utf8");

  let result;
  try {
    result = await transform(source, {
      loader: name.endsWith(".css") ? "css" : "js",
      minify: true,
      // The lab JS is authored as ES modules (hero.js, portfolio.js and
      // friends export init* functions consumed via an importmap), so the
      // output has to stay ESM. esbuild would otherwise be free to pick.
      format: name.endsWith(".css") ? undefined : "esm",
      // Browsers that can run the site today. Keeps esbuild from
      // down-levelling modern syntax the source already relies on.
      target: name.endsWith(".css") ? "chrome90" : "es2020",
      legalComments: "none",
    });
  } catch (err) {
    console.error(`\nminify-lab: FAILED on lab/${name}\n${err.message}\n`);
    process.exit(1);
  }

  await writeFile(path, result.code, "utf8");

  before += source.length;
  after += result.code.length;
  rows.push([name, source.length, result.code.length]);
}

rows.sort((a, b) => b[1] - a[1]);
for (const [name, from, to] of rows) {
  const saved = ((1 - to / from) * 100).toFixed(0).padStart(3);
  console.log(`  lab/${name.padEnd(22)} ${kb(from)} -> ${kb(to)}  (-${saved}%)`);
}

const savedPct = ((1 - after / before) * 100).toFixed(1);
console.log(
  `minify-lab: ${files.length} files, ${kb(before)} -> ${kb(after)} (-${savedPct}%)`,
);
