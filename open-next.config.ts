import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

/**
 * Why this isn't the empty default config:
 *
 * With no incremental cache, OpenNext's runtime cache always MISSES, so even
 * prerendered pages (/, /blog, blog posts, sitemap) were fully re-rendered by
 * React on the Worker for EVERY request — ~180ms average CPU time for what
 * should be static HTML.
 *
 * - kvIncrementalCache: cache entries live in the NEXT_INC_CACHE_KV binding,
 *   which is READ-WRITE at runtime.
 * - enableCacheInterception: answer prerendered routes straight from that
 *   cache BEFORE booting the Next.js server, skipping SSR entirely.
 *
 * 2026-08-24 — this used to be `staticAssetsIncrementalCache`, and the note
 * here said to swap it "if we ever add revalidate/revalidateTag". That day
 * arrived: the inline editor made app/layout.tsx ISR (`revalidate = 300`) and
 * saves purge the page cache with revalidatePath. The static-assets cache is
 * baked at build time and its set()/delete() are error-logging no-ops, so
 * with ISR turned on it would have failed in two ways at once — a saved edit
 * could never invalidate anything, and every request past the 5-minute window
 * would pay a full re-render whose result was then thrown away. Do not swap
 * back while `revalidate` exists in the root layout.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  enableCacheInterception: true,
});
