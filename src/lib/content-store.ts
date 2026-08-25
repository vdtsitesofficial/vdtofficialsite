// Poison pill. Importing this from a client component is a mistake that is
// otherwise very hard to read: the kit's store reaches for node:fs in its
// dev fallback, so the client compiler fails with "UnhandledSchemeError:
// Reading from node:fs/promises", which says nothing about the real cause.
// With this import the build says "server-only" instead, and names the
// offending file. Hit this on the homepage, which is a "use client"
// component: pages like that need a thin server wrapper that loads the
// content and passes it down as props.
import "server-only";
import { createContentStore } from "vdt-site-kit/server";
import { defaultContent } from "./content";

/**
 * The KV-backed content store, reading the CONTENT_KV binding.
 *
 * `loadContent` is memoized per request by the kit, so a page can call it
 * once and pass values down without worrying about repeat reads.
 *
 * DEPLOY NOTE, learned the hard way on Junk Matters: CONTENT_KV is not
 * reachable at build time, so every statically prerendered page is baked with
 * the CODE DEFAULTS, not the stored copy. After a deploy those pages serve
 * defaults until ISR refreshes them (`revalidate` in app/layout.tsx). While
 * the store is empty that is invisible, because default IS the live copy. The
 * moment real edits exist, a deploy will briefly resurface pre-edit text.
 * The fix is to sync the defaults in `page-copy.ts` back from the store
 * before deploying, or to ping revalidation from CI after one.
 */
export const { loadContent, saveContent } = createContentStore(defaultContent);
