/**
 * The editable-content document for vdtsites.com.
 *
 * Shape is deliberately a flat two-level map, `pages.<page>.<key>`, rather
 * than a typed field-per-string object. The site has ~25 hand-written pages
 * and the goal is for every string on all of them to be editable, so a typed
 * shape would mean a type edit per string and a migration every time a page
 * gains a sentence. The flat map lets a page opt a string in with one JSX
 * change and nothing else.
 *
 * THE ONE HARD RULE: **never rename a key after it ships.** The key IS the
 * storage path. Rename it and the stored edit is orphaned: the page silently
 * falls back to the code default and the client's change appears to have been
 * thrown away. If a key is genuinely wrong, leave it and add the new one.
 *
 * The copy itself lives in `page-copy.ts` so this file stays a shape and that
 * file stays the content.
 */
import { PAGE_COPY } from "./page-copy";

export type SiteContent = {
  /** `pages[<page>][<key>]` — one string per editable field. */
  pages: Record<string, Record<string, string>>;
};

/**
 * The document the site falls back to, seeded with the real copy.
 *
 * It has to carry the ACTUAL text, not an empty shell. `Editable` renders
 * `editable ? contextValue : valueProp` — while the editor is on it ignores
 * the value the page passed in and reads only the fetched content document.
 * An unedited string does not exist in KV, so if the defaults were empty a
 * signed-in admin would open a page and find every untouched field showing as
 * a blank dashed box while visitors still saw the copy correctly. The store
 * deep-merges stored values over these per key, so an edit to one string
 * never blanks its neighbours.
 *
 * The copy itself lives in `page-copy.ts` to keep this file a shape and that
 * file the content.
 */
export const defaultContent: SiteContent = {
  pages: PAGE_COPY,
};
