/**
 * Code defaults for every editable string on the site, keyed
 * `PAGE_COPY[<page>][<key>]`.
 *
 * This is the copy the site renders until somebody edits it. An unedited
 * string does not exist in CONTENT_KV at all, so `PageText` falls back here.
 * That is what lets the ~25 pages become editable a few at a time instead of
 * in one enormous unreviewable change: a page behaves exactly as it does now
 * until its strings are opted in.
 *
 * TWO RULES:
 *
 * 1. **Never rename a key after it ships.** The key is the storage path, so a
 *    rename orphans the stored edit and the page quietly reverts to the text
 *    below. If a key is wrong, live with it or add a second one.
 *
 * 2. **Keep these in sync with the store when you change copy in code.**
 *    CONTENT_KV is unreachable at build time, so prerendered pages bake THESE
 *    strings, and after a deploy they are what visitors see until ISR
 *    refreshes. Junk Matters shipped 68 fields of drift this way: every
 *    deploy briefly resurfaced pre-edit copy.
 *
 * Only the keys a page has actually opted in need to exist here.
 */
export const PAGE_COPY: Record<string, Record<string, string>> = {
  about: {
    clientsHeading: "Businesses we build for",
  },
};
