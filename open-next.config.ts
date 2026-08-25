import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

/**
 * Why this isn't the empty default config:
 *
 * With no incremental cache, OpenNext's runtime cache always MISSES, so even
 * prerendered pages were fully re-rendered by React on the Worker for EVERY
 * request — ~180ms average CPU time for what should be static HTML.
 *
 * - kvIncrementalCache: cache entries live in NEXT_INC_CACHE_KV, which is
 *   READ-WRITE at runtime. Pages answer `x-nextjs-cache: HIT`.
 * - d1NextTagCache: the revalidation tag store (NEXT_TAG_CACHE_D1). Required
 *   for `revalidatePath` to actually invalidate anything, which is how a save
 *   in the inline editor makes an edit show up immediately instead of waiting
 *   out the 5-minute window.
 *
 * ── 2026-08-24: two changes, both paid for in downtime. Read before editing.
 *
 * 1. This used to be `staticAssetsIncrementalCache`, whose `set()`/`delete()`
 *    are no-ops because it is baked at build time. The note here said to swap
 *    it "if we ever add revalidate" — mounting the inline editor did exactly
 *    that. Do not swap back while `revalidate` exists in the root layout.
 *
 * 2. `enableCacheInterception: true` was REMOVED and must not come back while
 *    this site uses ISR. It answered prerendered routes before booting Next,
 *    which is a real CPU win, but its stale-entry path enqueues a background
 *    revalidation — and with no queue override OpenNext's default is a stub
 *    that throws `FatalError: Dummy queue is not implemented`. The result was
 *    a site that looked healthy for exactly one revalidate window and then
 *    served 500s on every ISR page. It cannot be caught by requesting a page
 *    right after deploying: that hits a fresh cache entry and returns 200.
 *    Reproduce with a cache-busting query (`/?cb=123`) to force a real render.
 *
 *    If interception is ever wanted back, it needs a real queue first
 *    (`memory-queue` plus a WORKER_SELF_REFERENCE service binding, or the
 *    Durable Object queue). Junk Matters runs this same ISR setup without
 *    interception and is the reference config.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
});
