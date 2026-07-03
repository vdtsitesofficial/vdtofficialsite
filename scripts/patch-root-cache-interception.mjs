// Post-build patch: make OpenNext's cache interception work for the root path.
//
// @opennextjs/aws 4.0.2 (bundled by @opennextjs/cloudflare <= 1.20.x) has a
// bug in cacheInterceptor(): for "/" the localized path normalizes to "" and
// the code uses `localizedPath ?? "/"` / `localizedPath ?? "/index"` — but ""
// is not nullish, so `??` never falls back. Result: every other prerendered
// route ( /blog, /sitemap.xml, ... ) is served straight from the static-assets
// cache with ~0 CPU, while the homepage — the most-hit route — falls through
// and boots the whole Next.js server on each request.
//
// The fix is `||` instead of `??` in those two expressions. We patch the
// generated bundle after `opennextjs-cloudflare build` (see package.json
// build/preview/deploy scripts). If a future OpenNext version fixes this
// upstream, the patterns won't match and this script reports SKIPPED —
// verify root interception still works (x-opennext-cache: HIT on /) and
// delete this script.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const target = path.join(root, ".open-next", "middleware", "handler.mjs");

const replacements = [
  {
    from: '.includes(localizedPath ?? "/")',
    to: '.includes(localizedPath || "/")',
  },
  {
    from: 'globalThis.incrementalCache.get(localizedPath ?? "/index")',
    to: 'globalThis.incrementalCache.get(localizedPath || "/index")',
  },
];

let src = fs.readFileSync(target, "utf8");
let applied = 0;
for (const { from, to } of replacements) {
  if (src.includes(to)) {
    applied++; // already patched (idempotent re-run)
    continue;
  }
  if (!src.includes(from)) continue;
  src = src.split(from).join(to);
  applied++;
}
fs.writeFileSync(target, src, "utf8");

if (applied === replacements.length) {
  console.log("[patch-root-cache-interception] OK - root path cache interception enabled");
} else {
  console.warn(
    `[patch-root-cache-interception] SKIPPED (${applied}/${replacements.length} patterns found) - ` +
      "OpenNext may have fixed this upstream. Verify GET / returns x-opennext-cache: HIT, then delete this script."
  );
}
