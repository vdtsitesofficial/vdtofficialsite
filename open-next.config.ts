import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Why this isn't the empty default config:
 *
 * With no incremental cache, OpenNext's runtime cache always MISSES, so even
 * prerendered pages (/, /blog, blog posts, sitemap) were fully re-rendered by
 * React on the Worker for EVERY request — ~180ms average CPU time for what
 * should be static HTML.
 *
 * - staticAssetsIncrementalCache: the build copies the prerendered pages
 *   (.open-next/cache) into the Worker's static assets (under
 *   cdn-cgi/_next_cache/) and serves them from there. Read-only — fine here
 *   because this site has no ISR/revalidation, just SSG + dynamic /admin.
 * - enableCacheInterception: answer prerendered routes straight from that
 *   cache BEFORE booting the Next.js server, skipping SSR entirely.
 *
 * If we ever add `revalidate`/`revalidateTag`, swap this for an R2/KV
 * incremental cache — the static-assets one can't be written to at runtime.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
