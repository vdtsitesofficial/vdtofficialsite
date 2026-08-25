// Post-build patches for the generated OpenNext bundle. Runs after
// `opennextjs-cloudflare build` in the preview/deploy scripts (package.json).
//
// ── PATCH 1 · root-path cache interception (.open-next/middleware/handler.mjs)
// @opennextjs/aws 4.0.2 (bundled by @opennextjs/cloudflare <= 1.20.x) has a
// bug in cacheInterceptor(): for "/" the localized path normalizes to "" and
// the code uses `localizedPath ?? "/"` / `localizedPath ?? "/index"` — but ""
// is not nullish, so `??` never falls back. Result: every other prerendered
// route ( /blog, /sitemap.xml, ... ) is served straight from the static-assets
// cache with ~0 CPU, while the homepage — the most-hit route — falls through
// and boots the whole Next.js server on each request.
// The fix is `||` instead of `??` in those two expressions. If a future
// OpenNext version fixes this upstream, the patterns won't match and this
// patch reports SKIPPED — verify root interception still works
// (x-opennext-cache: HIT on /) and remove the patch.
//
// ── PATCH 2 · HTML cache-control (.open-next/worker.js)
// OpenNext stamps prerendered (SSG) responses with
// `s-maxage=31536000, stale-while-revalidate=2592000` and NO validators
// (no ETag / Last-Modified). That is Next's classic CDN header, written for
// platforms where every deploy purges the CDN. Nothing purges here, and the
// header gives browsers no explicit private-cache freshness either — so
// WebKit's heuristic disk cache reused WEEKS-old homepage HTML (2026-08-01:
// Philip's M1 MacBook rendered a pre-07-29 build whose hashed /_next/static
// chunks no longer existed; hydration never ran, so none of the
// afterInteractive lab scripts were injected and the hero froze at CSS
// defaults). The fix wraps the worker's fetch and rewrites that one header
// shape to `public, max-age=0, must-revalidate`, so no cache — shared or
// private — may reuse prerendered HTML/RSC without asking the worker first.
// Serving stays cheap: cache interception still answers from static assets
// with ~0 CPU; only the browser-side reuse policy changes.
// Static assets are untouched (served by the ASSETS binding before the
// worker runs — their caching policy lives in public/_headers).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// ---------- PATCH 1 (DISABLED 2026-08-24) ----------
//
// This patch only does anything when `enableCacheInterception` is on, because
// it fixes a bug in the interceptor's handling of the root path. Interception
// was removed from open-next.config.ts (its stale-entry path throws
// "FatalError: Dummy queue is not implemented" and took the site down for
// three hours), so the patch is now inert.
//
// Left in place, disabled, because it still printed "PATCH 1 OK - root path
// cache interception enabled" on every build — a line that would have read as
// confirmation that interception was working while it was in fact off. If
// interception ever comes back (it needs a real queue first), flip this to
// true and the patch resumes.
const PATCH_1_ENABLED = false;

if (PATCH_1_ENABLED) {
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
    console.log("[patch-open-next] PATCH 1 OK - root path cache interception enabled");
  } else {
    console.warn(
      `[patch-open-next] PATCH 1 SKIPPED (${applied}/${replacements.length} patterns found) - ` +
        "OpenNext may have fixed this upstream. Verify GET / returns x-opennext-cache: HIT, then remove the patch."
    );
  }
}

// ---------- PATCH 2 (hard-fail: deploying without it reintroduces the
// stale-HTML bug, so a non-matching bundle must stop the pipeline) ----------
{
  const target = path.join(root, ".open-next", "worker.js");
  let src = fs.readFileSync(target, "utf8");

  if (src.includes("__vdtWorkerCore")) {
    console.log("[patch-open-next] PATCH 2 OK - already applied (idempotent re-run)");
  } else {
    const marker = "export default {";
    const occurrences = src.split(marker).length - 1;
    if (occurrences !== 1) {
      console.error(
        `[patch-open-next] PATCH 2 FAILED - expected exactly one "${marker}" in worker.js, found ${occurrences}. ` +
          "OpenNext changed its worker shape; re-point the HTML cache-control wrapper before deploying."
      );
      process.exit(1);
    }

    src = src.replace(marker, "const __vdtWorkerCore = {");
    src += `
// --- appended by scripts/patch-open-next.mjs (PATCH 2) ---
// Rewrite OpenNext's SSG header (year-long s-maxage, a month of
// stale-while-revalidate, no validators) so no browser or shared cache can
// ever show a previous deploy's HTML. See scripts/patch-open-next.mjs for
// the incident this prevents.
export default {
  ...__vdtWorkerCore,
  async fetch(request, env, ctx) {
    // www -> apex 301, added 2026-08-05. Both hostnames are custom domains
    // on this Worker, and www used to serve the full site with a 200 -
    // canonicals meant Google consolidated it, but every other crawler saw
    // two complete copies (the Aug 4 Semrush audit counted 44 pages on a
    // 22-page site). This check lives HERE and not in Next middleware
    // because enableCacheInterception answers prerendered routes before
    // the routing layer runs, so middleware would be bypassed on exactly
    // the pages that matter. The wrapper is the one place every request
    // passes through.
    const url = new URL(request.url);
    if (url.hostname.replace(/\\.$/, "") === "www.vdtsites.com") {
      url.hostname = "vdtsites.com";
      // 301 for GET/HEAD (the permanent signal every SEO tool expects);
      // 308 for everything else so a POST to /api/contact or /api/admin
      // that somehow arrives on www keeps its method and body (Codex
      // review 2026-08-05: some clients rewrite POST->GET across a 301).
      // Explicit one-day cache: permanent enough to be cheap, short
      // enough that a mistake is recoverable without waiting out a
      // browser's heuristic forever-cache of an uncached 301.
      const status =
        request.method === "GET" || request.method === "HEAD" ? 301 : 308;
      return new Response(null, {
        status,
        headers: {
          location: url.toString(),
          "cache-control": "public, max-age=86400",
        },
      });
    }
    const resp = await __vdtWorkerCore.fetch(request, env, ctx);
    const cc = resp.headers.get("cache-control") || "";
    if (cc.includes("s-maxage=31536000")) {
      const patched = new Response(resp.body, resp);
      patched.headers.set("cache-control", "public, max-age=0, must-revalidate");
      return patched;
    }
    return resp;
  },
};
`;
    fs.writeFileSync(target, src, "utf8");
    console.log("[patch-open-next] PATCH 2 OK - prerendered HTML now max-age=0, must-revalidate + www->apex 301");
  }
}
